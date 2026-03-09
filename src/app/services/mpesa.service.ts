import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { NotificationService } from '../core/services/notification.service';
import { environment } from '../../environments/environment';

export interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  businessShortCode: string;
  accountReference: string;
  transactionDescription: string;
  callbackUrl: string;
}

export interface MpesaSTKPush {
  phone: string;
  amount: number;
  accountReference: string;
  transactionDescription: string;
}

export interface MpesaTransaction {
  checkoutRequestID: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
  merchantRequestID?: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  data?: any;
}

export interface PaymentTracking {
  checkoutRequestID: string;
  merchantRequestID: string;
  phone: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: Date;
  resultCode?: string;
  resultDescription?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MpesaService {
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  private mpesaConfig: MpesaConfig | null = null;
  private paymentTrackingSubject = new BehaviorSubject<Map<string, PaymentTracking>>(new Map());
  public paymentTracking$ = this.paymentTrackingSubject.asObservable();

  private activePayments = new Map<string, PaymentTracking>();

  constructor() {
    this.initializeConfig();
  }

  /**
   * Initialize M-PESA configuration
   * In production, load this from secure environment/backend
   */
  private initializeConfig(): void {
    const config = environment.mpesa;
    this.mpesaConfig = {
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
      passkey: config.passkey,
      businessShortCode: config.shortcode,
      accountReference: 'KRA-ITAX',
      transactionDescription: 'KRA Tax Payment',
      callbackUrl: `${window.location.origin}/api/mpesa/callback`
    };
  }

  /**
   * Check if M-PESA is configured
   */
  isConfigured(): boolean {
    return !!(this.mpesaConfig && this.mpesaConfig.consumerKey);
  }

  /**
   * Initialize M-PESA payment (STK Push)
   * Prompts user for M-PESA PIN on their phone
   */
  initiatePayment(request: MpesaSTKPush): Observable<ApiResponse<MpesaTransaction>> {
    // Validate phone number
    const formattedPhone = this.formatPhoneNumber(request.phone);
    if (!formattedPhone) {
      throw new Error('Invalid phone number');
    }

    const payload = {
      phone: formattedPhone,
      amount: request.amount,
      accountReference: request.accountReference,
      transactionDescription: request.transactionDescription,
      timestamp: new Date().toISOString()
    };

    this.notificationService.showInfo(`Sending M-PESA prompt to ${request.phone}...`);

    return this.apiService.post<MpesaTransaction>(
      'payments/mpesa/initiate',
      payload,
      { showNotification: false }
    );
  }

  /**
   * Query payment status
   */
  queryPaymentStatus(checkoutRequestID: string): Observable<ApiResponse<PaymentTracking>> {
    return this.apiService.get<PaymentTracking>(
      `payments/mpesa/status/${checkoutRequestID}`,
      { showNotification: false }
    );
  }

  /**
   * Handle M-PESA callback (for backend to call)
   */
  handleCallback(response: any): void {
    const checkoutRequestID = response.CheckoutRequestID;
    const resultCode = response.ResultCode;
    const resultDescription = response.ResultDesc;

    let status: PaymentTracking['status'] = 'failed';
    let message = 'Payment failed';

    if (resultCode === '0') {
      status = 'completed';
      message = 'Payment successful!';
    } else if (resultCode === '1001') {
      status = 'cancelled';
      message = 'Payment cancelled by user';
    } else if (resultCode === '1032') {
      status = 'cancelled';
      message = 'Request cancelled';
    }

    // Update tracking
    const tracking = this.activePayments.get(checkoutRequestID);
    if (tracking) {
      tracking.status = status;
      tracking.resultCode = resultCode;
      tracking.resultDescription = resultDescription;
    }

    // Show appropriate notification
    if (status === 'completed') {
      this.notificationService.showSuccess(message);
    } else if (status === 'cancelled') {
      this.notificationService.showWarning(message);
    } else {
      this.notificationService.showError(message);
    }
  }

  /**
   * Process payment with error handling
   */
  async processPayment(phone: string, amount: number, taxpayerId: string): Promise<{
    success: boolean;
    transactionId?: string;
    message: string;
  }> {
    try {
      // Validate inputs
      if (!phone || !amount || amount <= 0) {
        return {
          success: false,
          message: 'Invalid payment details'
        };
      }

      // Initiate STK push
      const stkResponse = await this.initiatePayment({
        phone,
        amount,
        accountReference: taxpayerId,
        transactionDescription: `Payment by ${taxpayerId}`
      }).toPromise();

      if (!stkResponse || !stkResponse.success) {
        return {
          success: false,
          message: stkResponse?.message || 'Failed to initiate payment'
        };
      }

      const transaction = stkResponse.data as MpesaTransaction;

      // Create tracking record
      const tracking: PaymentTracking = {
        checkoutRequestID: transaction.checkoutRequestID,
        merchantRequestID: transaction.merchantRequestID || '',
        phone,
        amount,
        status: 'pending',
        timestamp: new Date()
      };

      this.activePayments.set(transaction.checkoutRequestID, tracking);
      this.updateTrackingMap();

      return {
        success: true,
        transactionId: transaction.checkoutRequestID,
        message: transaction.customerMessage || 'Payment prompt sent to your phone'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Payment processing failed'
      };
    }
  }

  /**
   * Get payment history
   */
  getPaymentHistory(): Observable<ApiResponse<any>> {
    return this.apiService.get('payments/history', { showNotification: false });
  }

  /**
   * Get payment receipt
   */
  getPaymentReceipt(transactionId: string): Observable<ApiResponse<any>> {
    return this.apiService.get(`payments/receipt/${transactionId}`, { showNotification: false });
  }

  /**
   * Format phone number to required format
   * Converts: 0700000000, 700000000, +254700000000 → 254700000000
   */
  private formatPhoneNumber(phone: string): string | null {
    // Remove spaces and dashes
    phone = phone.replace(/[\s\-]/g, '');

    // Handle different formats
    if (phone.startsWith('+254')) {
      return phone.replace('+', '');
    } else if (phone.startsWith('254')) {
      return phone;
    } else if (phone.startsWith('0')) {
      return '254' + phone.substring(1);
    } else if (/^\d{9}$/.test(phone)) {
      return '254' + phone;
    }

    return null;
  }

  /**
   * Validate M-PESA phone number
   */
  isValidMpesaPhone(phone: string): boolean {
    // Must be Safaricom (07...) Airtel (01...) or Equity bank
    const formatted = this.formatPhoneNumber(phone);
    if (!formatted) {
      return false;
    }

    const lastNineDigits = formatted.substring(formatted.length - 9);
    const firstDigit = lastNineDigits[0];

    // Safaricom, Airtel, Telkom, Equity Bank
    return ['0', '1', '6', '7'].includes(firstDigit);
  }

  /**
   * Get active payments
   */
  getActivePayments(): PaymentTracking[] {
    return Array.from(this.activePayments.values());
  }

  /**
   * Clear completed transactions
   */
  clearCompletedTransactions(): void {
    this.activePayments.forEach((tracking, key) => {
      if (tracking.status !== 'pending') {
        this.activePayments.delete(key);
      }
    });
    this.updateTrackingMap();
  }

  /**
   * Update the tracking map observable
   */
  private updateTrackingMap(): void {
    this.paymentTrackingSubject.next(new Map(this.activePayments));
  }

  /**
   * Get payment status for UI
   */
  getPaymentStatusDisplay(tracking: PaymentTracking): {
    status: string;
    color: string;
    icon: string;
  } {
    switch (tracking.status) {
      case 'completed':
        return { status: 'Completed', color: 'success', icon: '✓' };
      case 'pending':
        return { status: 'Pending', color: 'info', icon: '⏳' };
      case 'failed':
        return { status: 'Failed', color: 'danger', icon: '✗' };
      case 'cancelled':
        return { status: 'Cancelled', color: 'warning', icon: '○' };
      default:
        return { status: 'Unknown', color: 'secondary', icon: '?' };
    }
  }

  /**
   * Calculate payment fee (if applicable)
   */
  calculatePaymentFee(amount: number): {
    fee: number;
    total: number;
    percentage: number;
  } {
    // M-PESA fees vary by amount in Kenya
    let fee = 0;
    let percentage = 0;

    if (amount <= 100) {
      fee = 0.80;
      percentage = 0.8;
    } else if (amount <= 500) {
      fee = 1.00;
      percentage = 0.2;
    } else if (amount <= 1000) {
      fee = 1.45;
      percentage = 0.145;
    } else if (amount <= 1500) {
      fee = 1.95;
      percentage = 0.13;
    } else if (amount <= 2500) {
      fee = 2.45;
      percentage = 0.098;
    } else {
      fee = 3.50;
      percentage = 0.14;
    }

    return {
      fee,
      total: amount + fee,
      percentage
    };
  }

  /**
   * Generate transaction reference
   */
  generateTransactionReference(): string {
    return `KRA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}
