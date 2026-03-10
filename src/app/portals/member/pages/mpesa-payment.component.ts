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
    :host {
      --red:          #D92B2B;
      --red-bright:   #EF3B3B;
      --red-glow:     rgba(217, 43, 43, 0.38);
      --red-pale:     rgba(217, 43, 43, 0.10);
      --red-border:   rgba(217, 43, 43, 0.22);

      --bg-root:      #0C0C0C;
      --bg-card:      #141414;
      --bg-card-2:    #1C1C1C;
      
      --text-pri:     #F0F0F0;
      --text-sec:     #888888;
      --text-mut:     #4A4A4A;

      --bdr:          rgba(255, 255, 255, 0.08);
      --bdr-md:       rgba(255, 255, 255, 0.14);

      --duration-base: 0.4s;
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    /* Layout & Base */
    .db-root { background: var(--bg-root); color: var(--text-pri); position: relative; overflow-x: hidden; }
    .noise-overlay { position: fixed; inset: 0; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAA6f7sBAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAD1JREFUeNoVjEkOACAIA53/f9qFA9S0mSBYhS6Yp7mXqR8B1Zp6InoSpOqJ6EnUInoStYieRC2iF9GLaE30JPojDPoA9WpU6YIAAAAASUVORK5CYII=') repeat; opacity: 0.03; pointer-events: none; z-index: 1; }
    .accent-bleed { position: fixed; top: -100px; right: -100px; width: 600px; height: 600px; background: radial-gradient(circle, var(--red-pale) 0%, transparent 70%); filter: blur(60px); pointer-events: none; z-index: 2; }
    .db-inner { max-width: 1400px; margin: 0 auto; padding: 40px 28px; position: relative; z-index: 10; }

    /* Modals */
    .modal-overlay-elite { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; animation: fadeIn 0.3s var(--ease-out); }
    .modal-box { width: 100%; max-width: 500px; border-radius: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border-color: var(--bdr-md); position: relative; z-index: 1010; }
    .modal-body-elite { padding: 32px; display: flex; flex-direction: column; gap: 32px; }
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 24px; position: relative; overflow: hidden; transition: border-color 0.3s; }
    .card-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at top right, var(--red-pale), transparent 40%); pointer-events: none; opacity: 0.6; }

    .panel-header-elite { padding: 24px 32px; border-bottom: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: center; gap: 20px; }
    .panel-title { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
    .text-red { color: var(--red); }
    .panel-desc { font-size: 12px; color: var(--text-sec); font-weight: 500; }
    .close-btn { width: 32px; height: 32px; border-radius: 10px; border: none; background: var(--bg-card-2); color: var(--text-sec); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .close-btn:hover { color: var(--text-pri); background: var(--bdr); }

    /* M-Pesa Result & Processing */
    .mpesa-processing { text-align: center; padding: 40px 0; }
    .loader-ring { width: 48px; height: 48px; border: 3px solid var(--red-pale); border-top-color: var(--red); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 24px; }
    .mpesa-processing p { font-weight: 800; font-size: 13px; letter-spacing: 1px; margin-bottom: 8px; }
    .mpesa-processing span { font-size: 12px; color: var(--text-sec); }

    .mpesa-result { text-align: center; }
    .res-icon { width: 64px; height: 64px; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 24px; }
    .success .res-icon { background: #00C853; box-shadow: 0 0 20px rgba(0, 200, 83, 0.3); }
    .error .res-icon { background: var(--red); box-shadow: 0 0 20px var(--red-glow); }
    .mpesa-result h3 { font-size: 24px; font-weight: 950; margin-bottom: 12px; }
    .mpesa-result p { color: var(--text-sec); margin-bottom: 16px; font-size: 14px; }
    .txn-ref { font-family: monospace; font-size: 11px; background: var(--bg-root); padding: 8px 16px; border-radius: 8px; display: inline-block; color: var(--text-sec); border: 1px solid var(--bdr); }

    .fiscal-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--bdr); }
    .fs-label { font-size: 9px; font-weight: 800; color: var(--text-mut); letter-spacing: 1px; display: block; margin-bottom: 4px; }
    .fs-val { font-size: 15px; font-weight: 900; }

    /* Form Styles */
    .mpesa-form-elite { display: flex; flex-direction: column; gap: 24px; }
    .input-group-elite label { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 1.5px; margin-bottom: 10px; display: block; }
    .input-group-elite input { width: 100%; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 14px; padding: 14px 20px; font-size: 16px; font-family: 'JetBrains Mono', monospace; color: var(--text-pri); outline: none; transition: all 0.2s; }
    .input-group-elite input:focus { border-color: var(--red-border); background: var(--bg-card); box-shadow: 0 0 0 4px var(--red-pale); }
    .input-group-elite input.error { border-color: var(--red); background: var(--red-pale); }
    .error-intel { font-size: 10px; font-weight: 700; color: var(--red); margin-top: 6px; display: block; }

    .currency-wrap { position: relative; }
    .currency-wrap .prefix { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-weight: 900; font-size: 14px; color: var(--text-mut); }
    .currency-wrap input { padding-left: 54px; }

    .tax-matrix-elite { background: var(--bg-card-2); padding: 20px; border-radius: 14px; border: 1px solid var(--bdr); }
    .tm-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-sec); margin-bottom: 8px; }
    .tm-row.total { border-top: 1px solid var(--bdr); padding-top: 12px; margin-top: 12px; font-weight: 900; color: var(--text-pri); font-size: 14px; }

    .form-actions-elite { display: flex; gap: 16px; }

    /* Active Tracker Panel */
    .table-panel { margin-top: 40px; }
    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s ease-in-out infinite; }
    .action-stack { display: flex; align-items: center; gap: 16px; }

    .tracking-grid { display: flex; flex-direction: column; gap: 12px; }
    .tracking-item { display: grid; grid-template-columns: 1.5fr 1fr 1fr; align-items: center; padding: 16px 24px; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 16px; border-left: 4px solid var(--text-mut); transition: all 0.2s; }
    .tracking-item:hover { transform: translateX(4px); border-color: var(--bdr-md); }
    .tracking-item.completed { border-left-color: #00C853; }
    .tracking-item.pending { border-left-color: #FFAB00; }
    .tracking-item.failed { border-left-color: var(--red); }

    .ti-left { display: flex; flex-direction: column; gap: 4px; }
    .ti-ref { font-size: 9px; font-weight: 800; color: var(--text-mut); letter-spacing: 0.5px; }
    .ti-phone { font-size: 14px; font-weight: 700; }
    .ti-center { display: flex; flex-direction: column; gap: 4px; }
    .ti-amount { font-size: 14px; font-weight: 900; color: var(--text-pri); }
    .ti-time { font-size: 11px; color: var(--text-sec); }
    .ti-right { display: flex; justify-content: flex-end; }
    .status-badge { padding: 4px 12px; border-radius: 50px; font-size: 9px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }
    .status-badge.alert { background: rgba(255, 171, 0, 0.1); color: #FFAB00; border: 1px solid rgba(255, 171, 0, 0.2); }
    .status-badge.success { background: rgba(0, 200, 83, 0.1); color: #00C853; border: 1px solid rgba(0, 200, 83, 0.2); }

    /* Buttons */
    .btn-primary-elite { background: var(--red); color: #fff; border: none; padding: 16px 28px; border-radius: 14px; font-size: 11px; font-weight: 900; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 16px -4px var(--red-glow); display: flex; align-items: center; justify-content: center; text-transform: uppercase; }
    .btn-primary-elite:hover:not(:disabled) { background: var(--red-bright); transform: translateY(-2px); box-shadow: 0 12px 24px -6px var(--red-glow); }
    .btn-primary-elite:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

    .btn-ghost-elite { background: var(--bg-card-2); color: var(--text-sec); border: 1px solid var(--bdr); padding: 16px 24px; border-radius: 14px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; text-transform: uppercase; }
    .btn-ghost-elite:hover { background: var(--bg-card); color: var(--text-pri); border-color: var(--bdr-md); }

    /* Animations & Keyframes */
    .animate-fade-in { animation: fadeIn var(--duration-base) var(--ease-out); }
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 640px) {
      .modal-box { border-radius: 24px; }
      .modal-body-elite { padding: 24px; gap: 24px; }
      .tracking-item { grid-template-columns: 1fr 1fr; gap: 16px; }
      .ti-right { grid-column: span 2; justify-content: flex-start; }
      .form-actions-elite { flex-direction: column; }
    }
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
