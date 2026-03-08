import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MpesaService, MpesaSTKPush, PaymentTracking } from '../../../services/mpesa.service';
import { ValidationService } from '../../../services/validation.service';
import { ExportService } from '../../../services/export.service';
import { NotificationService } from '../../../core/services/notification.service';

interface PaymentFormData {
  phone: string;
  amount: number;
  taxpayerId: string;
  description: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mpesa-payment',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="mpesa-payment-container">
      <!-- Payment Dialog -->
      @if (showPaymentModal()) {
        <div class="payment-modal">
          <div class="modal-overlay" (click)="closePaymentModal()"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h2>M-PESA Payment</h2>
              <button class="close-btn" (click)="closePaymentModal()">✕</button>
            </div>
            <div class="modal-body">
              <!-- Loading State -->
              @if (isProcessing()) {
                <div class="processing-state">
                  <div class="spinner"></div>
                  <p>Sending payment prompt to your M-PESA phone...</p>
                </div>
              }
              <!-- Success State -->
              @if (!isProcessing() && paymentSuccess()) {
                <div class="success-state">
                  <div class="success-icon">✓</div>
                  <h3>Payment Initiated Successfully</h3>
                  <p>A payment prompt has been sent to <strong>{{ lastPaymentPhone() }}</strong></p>
                  <p class="info-text">Please enter your M-PESA PIN when you receive the prompt.</p>
                  <div class="transaction-details">
                    <div class="detail-row">
                      <span>Transaction ID:</span>
                      <strong>{{ lastTransactionId() }}</strong>
                    </div>
                    <div class="detail-row">
                      <span>Amount:</span>
                      <strong>KES {{ lastPaymentAmount() | number:'1.0-2' }}</strong>
                    </div>
                    <div class="detail-row">
                      <span>Status:</span>
                      <span class="status-badge pending">Awaiting PIN Entry</span>
                    </div>
                  </div>
                  <button class="modern-btn primary-btn full-width" (click)="closePaymentModal()">
                    Close
                  </button>
                </div>
              }
              <!-- Error State -->
              @if (!isProcessing() && paymentError()) {
                <div class="error-state">
                  <div class="error-icon">✕</div>
                  <h3>Payment Failed</h3>
                  <p>{{ paymentErrorMessage() }}</p>
                  <button class="modern-btn primary-btn full-width" (click)="resetPaymentForm()">
                    Try Again
                  </button>
                </div>
              }
              <!-- Form State -->
              @if (!isProcessing() && !paymentSuccess() && !paymentError()) {
                <form
                  [formGroup]="paymentForm"
                  (ngSubmit)="submitPayment()"
                  class="payment-form">
                  <!-- Phone Number Input -->
                  <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      formControlName="phone"
                      placeholder="e.g., +254700000000 or 0700000000"
                      class="form-input"
                      [class.error]="hasPhoneError()">
                      <small class="hint-text">Must be registered with M-PESA</small>
                      @if (hasPhoneError()) {
                        <div class="error-text">
                          {{ getPhoneError() }}
                        </div>
                      }
                    </div>
                    <!-- Amount Input -->
                    <div class="form-group">
                      <label for="amount">Amount (KES)</label>
                      <div class="amount-input-group">
                        <span class="currency-prefix">KES</span>
                        <input
                          id="amount"
                          type="number"
                          formControlName="amount"
                          placeholder="100 - 150,000"
                          class="form-input amount-input"
                          [class.error]="hasAmountError()">
                        </div>
                        <small class="hint-text">Minimum: KES 100, Maximum: KES 150,000</small>
                        @if (hasAmountError()) {
                          <div class="error-text">
                            {{ getAmountError() }}
                          </div>
                        }
                      </div>
                      <!-- Amount Fee Info -->
                      @if (paymentForm.get('amount')?.value) {
                        <div class="fee-breakdown">
                          <div class="fee-row">
                            <span>Amount:</span>
                            <span>KES {{ paymentForm.get('amount')?.value | number:'1.0-2' }}</span>
                          </div>
                          <div class="fee-row">
                            <span>M-PESA Fee:</span>
                            <span>KES {{ calculateFee().fee | number:'1.0-2' }}</span>
                          </div>
                          <div class="fee-row total">
                            <span>Total to Pay:</span>
                            <strong>KES {{ calculateFee().total | number:'1.0-2' }}</strong>
                          </div>
                        </div>
                      }
                      <!-- Description -->
                      <div class="form-group">
                        <label for="description">Payment Description</label>
                        <textarea
                          id="description"
                          formControlName="description"
                          placeholder="e.g., Payment for tax return 2024"
                          class="form-input textarea"
                        rows="2"></textarea>
                      </div>
                      <!-- Form Actions -->
                      <div class="form-actions">
                        <button
                          type="button"
                          class="modern-btn outline-btn"
                          (click)="closePaymentModal()">
                          Cancel
                        </button>
                        <button
                          type="submit"
                          class="modern-btn primary-btn"
                          [disabled]="!paymentForm.valid || isProcessing()">
                          Initiate M-PESA Payment
                        </button>
                      </div>
                    </form>
                  }
                </div>
              </div>
            </div>
          }
    
          <!-- Active Payments Tracker -->
          @if ((activePayments$ | async)?.size; as paymentCount) {
            <div class="active-payments-panel">
              <div class="panel-header">
                <h3>Active Payments (<span class="count">{{ paymentCount }}</span>)</h3>
                <button class="clean-btn" (click)="clearCompletedPayments()">Clear Completed</button>
              </div>
              <div class="payments-list">
                @for (tracking of getActivePaymentsList(); track tracking) {
                  <div class="payment-item">
                    <div class="payment-info">
                      <div class="phone-info">
                        <span class="label">Phone:</span>
                        <strong>{{ maskPhoneNumber(tracking.phone) }}</strong>
                      </div>
                      <div class="amount-info">
                        <span class="label">Amount:</span>
                        <strong>KES {{ tracking.amount | number:'1.0-2' }}</strong>
                      </div>
                    </div>
                    <div class="payment-status">
                      <span class="status-badge" [class]="getStatusClass(tracking.status)">
                        {{ getStatusDisplay(tracking.status) }}
                      </span>
                      <span class="timestamp">{{ tracking.timestamp | date:'short' }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
    `,
  styles: [`
    .mpesa-payment-container {
      position: relative;
    }

    /* Modal Styles */
    .payment-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      cursor: pointer;
    }

    .modal-content {
      position: relative;
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px 12px 0 0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 28px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .modal-body {
      padding: 32px;
    }

    /* Form Styles */
    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      color: #1f2937;
      font-size: 14px;
    }

    .form-input {
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
      font-family: inherit;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      background: #f8f9ff;
    }

    .form-input.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .textarea {
      resize: vertical;
      font-family: inherit;
    }

    .hint-text {
      font-size: 12px;
      color: #6b7280;
    }

    .error-text {
      font-size: 12px;
      color: #ef4444;
      font-weight: 500;
    }

    .amount-input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .currency-prefix {
      position: absolute;
      left: 12px;
      color: #6b7280;
      font-weight: 600;
      font-size: 14px;
    }

    .amount-input {
      padding-left: 50px;
    }

    /* Fee Breakdown */
    .fee-breakdown {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .fee-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #1f2937;
    }

    .fee-row.total {
      border-top: 1px solid #d1d5db;
      padding-top: 12px;
      margin-top: 8px;
      font-weight: 600;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .form-actions button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .modern-btn.primary-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .modern-btn.primary-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .modern-btn.primary-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .modern-btn.outline-btn {
      background: white;
      border: 2px solid #e5e7eb;
      color: #1f2937;
    }

    .modern-btn.outline-btn:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .full-width {
      width: 100%;
    }

    /* State Views */
    .processing-state,
    .success-state,
    .error-state {
      text-align: center;
      padding: 32px;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e5e7eb;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .success-icon,
    .error-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .success-icon {
      color: #10b981;
    }

    .error-icon {
      color: #ef4444;
    }

    .success-state h3,
    .error-state h3 {
      margin: 0 0 12px;
      color: #1f2937;
    }

    .success-state p,
    .error-state p {
      color: #6b7280;
      margin: 0 0 16px;
      font-size: 14px;
    }

    .info-text {
      background: #ecfdf5;
      padding: 12px;
      border-radius: 8px;
      color: #047857;
      font-size: 13px;
      margin: 16px 0;
    }

    /* Transaction Details */
    .transaction-details {
      background: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #1f2937;
      border-bottom: 1px solid #e5e7eb;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row strong {
      color: #374151;
      word-break: break-all;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.completed {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge.cancelled {
      background: #f3f4f6;
      color: #374151;
    }

    /* Active Payments Panel */
    .active-payments-panel {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 16px;
      color: #1f2937;
    }

    .count {
      background: #667eea;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .clean-btn {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-weight: 500;
      font-size: 13px;
      transition: color 0.2s;
    }

    .clean-btn:hover {
      color: #764ba2;
    }

    .payments-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .payment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: #f9fafb;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }

    .payment-info {
      display: flex;
      gap: 24px;
      flex: 1;
    }

    .phone-info,
    .amount-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .phone-info .label,
    .amount-info .label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }

    .phone-info strong,
    .amount-info strong {
      font-size: 14px;
      color: #1f2937;
    }

    .payment-status {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .timestamp {
      font-size: 12px;
      color: #9ca3af;
    }

    @media (max-width: 640px) {
      .modal-content {
        width: 95%;
      }

      .modal-body {
        padding: 20px;
      }

      .form-actions {
        flex-direction: column;
      }

      .payment-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .payment-status {
        width: 100%;
      }

      .payment-info {
        width: 100%;
        gap: 16px;
      }
    }
  `]
})
export class MpesaPaymentComponent {
  private mpesaService = inject(MpesaService);
  private validationService = inject(ValidationService);
  private exportService = inject(ExportService);
  private notificationService = inject(NotificationService);
  private formBuilder = inject(FormBuilder);

  // State signals
  showPaymentModal = signal(false);
  isProcessing = signal(false);
  paymentSuccess = signal(false);
  paymentError = signal(false);
  paymentErrorMessage = signal('');
  lastPaymentPhone = signal('');
  lastPaymentAmount = signal(0);
  lastTransactionId = signal('');

  // Form
  paymentForm!: FormGroup;

  // Active payments tracking
  activePayments$ = this.mpesaService.paymentTracking$;

  constructor() {
    this.initForm();
  }

  /**
   * Initialize payment form
   */
  private initForm(): void {
    this.paymentForm = this.formBuilder.group({
      phone: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(100), Validators.max(150000)]],
      description: ['Payment from KRA iTax Portal'],
      taxpayerId: ['']
    });
  }

  /**
   * Open payment modal
   */
  openPaymentModal(taxpayerId?: string, initialAmount?: number): void {
    this.showPaymentModal.set(true);
    this.resetPaymentForm();

    if (taxpayerId) {
      this.paymentForm.patchValue({ taxpayerId });
    }

    if (initialAmount && initialAmount > 0) {
      this.paymentForm.patchValue({ amount: initialAmount });
    }
  }

  /**
   * Close payment modal
   */
  closePaymentModal(): void {
    this.showPaymentModal.set(false);
  }

  /**
   * Reset payment form
   */
  resetPaymentForm(): void {
    this.paymentForm.reset({ description: 'Payment from KRA iTax Portal' });
    this.paymentSuccess.set(false);
    this.paymentError.set(false);
    this.isProcessing.set(false);
    this.paymentErrorMessage.set('');
  }

  /**
   * Submit payment
   */
  async submitPayment(): Promise<void> {
    if (!this.paymentForm.valid) {
      this.notificationService.showError('Please fill in all required fields correctly');
      return;
    }

    const formData = this.paymentForm.value;

    // Validate phone
    if (!this.mpesaService.isValidMpesaPhone(formData.phone)) {
      this.paymentErrorMessage.set('Invalid M-PESA phone number. Please check and try again.');
      this.paymentError.set(true);
      return;
    }

    this.isProcessing.set(true);

    try {
      const result = await this.mpesaService.processPayment(
        formData.phone,
        formData.amount,
        formData.taxpayerId || ''
      );

      if (result.success) {
        this.paymentSuccess.set(true);
        this.lastPaymentPhone.set(formData.phone);
        this.lastPaymentAmount.set(formData.amount);
        this.lastTransactionId.set(result.transactionId || '');
        this.notificationService.showSuccess(result.message);
      } else {
        this.paymentError.set(true);
        this.paymentErrorMessage.set(result.message);
        this.notificationService.showError(result.message);
      }
    } catch (error: any) {
      this.paymentError.set(true);
      this.paymentErrorMessage.set(error.message || 'An error occurred during payment processing');
      this.notificationService.showError('Payment failed. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  /**
   * Calculate M-PESA fee
   */
  calculateFee() {
    const amount = this.paymentForm.get('amount')?.value || 0;
    return this.mpesaService.calculatePaymentFee(amount);
  }

  /**
   * Get active payments list
   */
  getActivePaymentsList(): PaymentTracking[] {
    return this.mpesaService.getActivePayments();
  }

  /**
   * Clear completed payments
   */
  clearCompletedPayments(): void {
    this.mpesaService.clearCompletedTransactions();
  }

  /**
   * Get status display
   */
  getStatusDisplay(status: string): string {
    const display = this.mpesaService.getPaymentStatusDisplay({} as any);
    const mapping: Record<string, string> = {
      'pending': 'Awaiting PIN',
      'completed': 'Completed',
      'failed': 'Failed',
      'cancelled': 'Cancelled'
    };
    return mapping[status] || status;
  }

  /**
   * Get status CSS class
   */
  getStatusClass(status: string): string {
    return status || 'pending';
  }

  /**
   * Mask phone number for display
   */
  maskPhoneNumber(phone: string): string {
    return phone.replace(/(\d{3})\d*(\d{3})/, '$1****$2');
  }

  /**
   * Form validation helpers
   */
  hasPhoneError(): boolean {
    const phone = this.paymentForm.get('phone');
    return !!phone && phone.invalid && (phone.dirty || phone.touched);
  }

  getPhoneError(): string {
    const phone = this.paymentForm.get('phone');
    if (phone?.hasError('required')) {
      return 'Phone number is required';
    }
    return 'Invalid phone number format';
  }

  hasAmountError(): boolean {
    const amount = this.paymentForm.get('amount');
    return !!amount && amount.invalid && (amount.dirty || amount.touched);
  }

  getAmountError(): string {
    const amount = this.paymentForm.get('amount');
    if (amount?.hasError('required')) {
      return 'Amount is required';
    }
    if (amount?.hasError('min')) {
      return 'Minimum amount is KES 100';
    }
    if (amount?.hasError('max')) {
      return 'Maximum amount is KES 150,000';
    }
    return 'Invalid amount';
  }
}
