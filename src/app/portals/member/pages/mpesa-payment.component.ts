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
    <div class="db-root animate-fade-in">
      <!-- Digital Noise & Background Accents -->
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <!-- Payment Interface Modal -->
      @if (showPaymentModal()) {
        <div class="modal-overlay-elite animate-fade-in">
          <div class="absolute inset-0 bg-black/85 backdrop-blur-xl" (click)="closePaymentModal()"></div>
          <div class="elite-card modal-box mpesa-box animate-scale-in">
            <div class="card-glow"></div>
            <div class="panel-header-elite">
              <div>
                <h3 class="panel-title">M-PESA <span class="text-red">Protocol</span></h3>
                <p class="panel-desc">Statutory Payment Initialization via STK Push</p>
              </div>
              <button class="close-btn" (click)="closePaymentModal()">✕</button>
            </div>

            <div class="modal-body-elite">
              <!-- SYNC STATE -->
              @if (isProcessing()) {
                <div class="mpesa-processing">
                  <div class="loader-ring"></div>
                  <p>SYNCING WITH SAFARICOM MOBILE ENGINE...</p>
                  <span>Enter your M-PESA PIN when the prompt appears on your device.</span>
                </div>
              }

              <!-- SUCCESS TELEMETRY -->
              @if (!isProcessing() && paymentSuccess()) {
                <div class="mpesa-result success">
                  <div class="res-icon">✓</div>
                  <h3>Transmission Success</h3>
                  <p>Telemetry prompt dispatched to <strong class="text-white">{{ lastPaymentPhone() }}</strong></p>
                  <div class="txn-ref">REF ID: {{ lastTransactionId() }}</div>
                  
                  <div class="fiscal-summary">
                    <div class="fs-item">
                       <span class="fs-label">FISCAL VALUE</span>
                       <span class="fs-val">KES {{ lastPaymentAmount() | number:'1.2-2' }}</span>
                    </div>
                    <div class="fs-item text-right">
                       <span class="fs-label">PROTOCOL STATUS</span>
                       <span class="fs-val text-red">AWAITING PIN</span>
                    </div>
                  </div>

                  <button class="btn-primary-elite w-full mt-8" (click)="closePaymentModal()">ACKNOWLEDGE & CLOSE</button>
                </div>
              }

              <!-- ANOMALY DETECTED -->
              @if (!isProcessing() && paymentError()) {
                <div class="mpesa-result error">
                  <div class="res-icon">✕</div>
                  <h3>Protocol Aborted</h3>
                  <p>{{ paymentErrorMessage() }}</p>
                  <button class="btn-primary-elite w-full mt-8" (click)="resetPaymentForm()">RETRY TRANSMISSION</button>
                </div>
              }

              <!-- EXECUTION FORM -->
              @if (!isProcessing() && !paymentSuccess() && !paymentError()) {
                <form [formGroup]="paymentForm" (ngSubmit)="submitPayment()" class="mpesa-form-elite">
                  <div class="input-group-elite">
                    <label>ENCRYPTED PHONE NUMBER</label>
                    <input type="tel" formControlName="phone" placeholder="e.g. 0712 345 678" [class.error]="hasPhoneError()">
                    @if (hasPhoneError()) { <span class="error-intel">{{ getPhoneError() }}</span> }
                  </div>

                  <div class="input-group-elite text-right">
                    <label>EXACT FISCAL VALUE (KES)</label>
                    <div class="currency-wrap">
                      <span class="prefix">KES</span>
                      <input type="number" formControlName="amount" placeholder="1,000" class="text-right" [class.error]="hasAmountError()">
                    </div>
                    @if (hasAmountError()) { <span class="error-intel">{{ getAmountError() }}</span> }
                  </div>

                  @if (paymentForm.get('amount')?.value) {
                    <div class="tax-matrix-elite">
                      <div class="tm-row">
                        <span>PRN Principal</span>
                        <span>{{ paymentForm.get('amount')?.value | number:'1.2-2' }}</span>
                      </div>
                      <div class="tm-row">
                        <span>Gateway Fee</span>
                        <span>{{ calculateFee().fee | number:'1.2-2' }}</span>
                      </div>
                      <div class="tm-row total">
                        <span>Total Liability</span>
                        <span>KES {{ calculateFee().total | number:'1.2-2' }}</span>
                      </div>
                    </div>
                  }

                  <div class="input-group-elite">
                    <label>PAYMENT TELEMETRY CONTEXT</label>
                    <input type="text" formControlName="description" placeholder="e.g. Income Tax Period 2024-Q1">
                  </div>

                  <div class="form-actions-elite pt-4">
                    <button type="button" class="btn-ghost-elite flex-1" (click)="closePaymentModal()">PRESCIND</button>
                    <button type="submit" class="btn-primary-elite flex-1" [disabled]="!paymentForm.valid || isProcessing()">INITIATE STK PUSH</button>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      }

      <!-- Performance Telemetry Tracker -->
      @if ((activePayments$ | async)?.size; as paymentCount) {
        <div class="db-inner !py-0">
          <div class="elite-card table-panel">
            <div class="card-glow"></div>
            <div class="panel-header-elite">
              <div>
                <h3 class="panel-title">Active <span class="text-red">Telemetry</span> Tracker</h3>
                <p class="panel-desc">Real-time status of dispatched M-PESA prompts</p>
              </div>
              <div class="action-stack">
                <div class="live-badge">
                  <span class="live-dot"></span>
                  {{ paymentCount }} SIGNAL{{ paymentCount > 1 ? 'S' : '' }} ACTIVE
                </div>
                <button class="btn-ghost-elite" (click)="clearCompletedPayments()">CLEAR COMPLETED</button>
              </div>
            </div>

            <div class="p-6">
               <div class="tracking-grid">
                  @for (tracking of getActivePaymentsList(); track tracking) {
                    <div class="tracking-item" [class]="getStatusClass(tracking.status)">
                      <div class="ti-left">
                         <span class="ti-ref">#TRANSACTION-{{ tracking.timestamp | date:'HHmmss' }}</span>
                         <span class="ti-phone">{{ maskPhoneNumber(tracking.phone) }}</span>
                      </div>
                      <div class="ti-center">
                         <span class="ti-amount">KES {{ tracking.amount | number:'1.2-2' }}</span>
                         <span class="ti-time">{{ tracking.timestamp | date:'shortTime' }}</span>
                      </div>
                      <div class="ti-right">
                         <div class="status-badge" [class.success]="tracking.status === 'completed'" [class.alert]="tracking.status === 'pending'">
                            {{ getStatusDisplay(tracking.status) | uppercase }}
                         </div>
                      </div>
                    </div>
                  }
               </div>
            </div>
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
