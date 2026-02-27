import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { ValidationService, ValidationRule } from '../../services/validation.service';
import { NotificationService } from '../../core/services/notification.service';
import { MpesaService } from '../../services/mpesa.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="payment-form-container">
      <div class="form-section">
        <h3 class="section-title">Payment Details</h3>

        <form [formGroup]="paymentForm" (ngSubmit)="submitPayment()" class="payment-form">
          <!-- Taxpayer Selection -->
          <div class="form-group">
            <label for="taxpayer" class="required">Select Taxpayer</label>
            <select formControlName="taxpayerId" id="taxpayer" class="form-input">
              <option value="">-- Select Taxpayer --</option>
              <option *ngFor="let tp of taxpayers()" [value]="tp.id">
                {{ tp.name }} ({{ tp.pin }})
              </option>
            </select>
            <div *ngIf="hasError('taxpayerId')" class="error-text">
              {{ getError('taxpayerId') }}
            </div>
          </div>

          <!-- Payment Type -->
          <div class="form-group">
            <label for="paymentType" class="required">Payment Type</label>
            <select formControlName="paymentType" id="paymentType" class="form-input" (change)="onPaymentTypeChange()">
              <option value="">-- Select Type --</option>
              <option value="tax_return">Tax Return Settlement</option>
              <option value="outstanding">Outstanding Liability</option>
              <option value="invoice">Invoice Payment</option>
              <option value="general">General Payment</option>
            </select>
            <div *ngIf="hasError('paymentType')" class="error-text">
              {{ getError('paymentType') }}
            </div>
          </div>

          <!-- Related Items (Dynamic based on type) -->
          <div *ngIf="selectedPaymentType() === 'tax_return'" class="form-group">
            <label for="returnId">Tax Return</label>
            <select formControlName="relatedId" id="returnId" class="form-input">
              <option value="">-- Select Return --</option>
              <option *ngFor="let ret of filteredReturns()" [value]="ret.id">
                {{ ret.period }} - KES {{ ret.amount | number:'1.0-2' }}
              </option>
            </select>
          </div>

          <div *ngIf="selectedPaymentType() === 'invoice'" class="form-group">
            <label for="invoiceId">Invoice</label>
            <select formControlName="relatedId" id="invoiceId" class="form-input">
              <option value="">-- Select Invoice --</option>
              <option *ngFor="let inv of filteredInvoices()" [value]="inv.id">
                INV-{{ inv.id }} - KES {{ inv.amount | number:'1.0-2' }}
              </option>
            </select>
          </div>

          <!-- Amount -->
          <div class="form-group">
            <label for="amount" class="required">Amount (KES)</label>
            <div class="amount-input-group">
              <span class="currency">KES</span>
              <input
                type="number"
                formControlName="amount"
                id="amount"
                placeholder="0.00"
                class="form-input amount-input"
                [class.error]="hasError('amount')">
            </div>
            <div *ngIf="hasError('amount')" class="error-text">
              {{ getError('amount') }}
            </div>
            <small class="hint-text">KES 100 - 150,000</small>
          </div>

          <!-- Payment Method -->
          <div class="form-group">
            <label for="method" class="required">Payment Method</label>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" formControlName="paymentMethod" value="mpesa" class="radio-input">
                <span class="radio-label">
                  <strong>M-PESA</strong>
                  <small>Quick mobile payment</small>
                </span>
              </label>
              <label class="radio-option">
                <input type="radio" formControlName="paymentMethod" value="bank_transfer" class="radio-input">
                <span class="radio-label">
                  <strong>Bank Transfer</strong>
                  <small>Direct bank payment</small>
                </span>
              </label>
              <label class="radio-option">
                <input type="radio" formControlName="paymentMethod" value="cheque" class="radio-input">
                <span class="radio-label">
                  <strong>Cheque</strong>
                  <small>Post cheque payment</small>
                </span>
              </label>
            </div>
            <div *ngIf="hasError('paymentMethod')" class="error-text">
              {{ getError('paymentMethod') }}
            </div>
          </div>

          <!-- Phone for M-PESA -->
          <div *ngIf="paymentForm.get('paymentMethod')?.value === 'mpesa'" class="form-group">
            <label for="phone" class="required">Phone Number</label>
            <input
              type="tel"
              formControlName="phone"
              id="phone"
              placeholder="+254 or 0"
              class="form-input"
              [class.error]="hasError('phone')">
              <div *ngIf="hasError('phone')" class="error-text">
              {{ getError('phone') }}
            </div>
            <small class="hint-text">Must have M-PESA registered</small>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Description/Notes</label>
            <textarea
              formControlName="description"
              id="description"
              placeholder="Additional payment details..."
              class="form-input textarea"
              rows="3"></textarea>
          </div>

          <!-- Fee Breakdown -->
          <div *ngIf="showFeeBreakdown()" class="fee-breakdown">
            <h4>Payment Summary</h4>
            <div class="fee-row">
              <span>Amount:</span>
              <strong>KES {{ paymentForm.get('amount')?.value | number:'1.0-2' }}</strong>
            </div>
            <div *ngIf="paymentForm.get('paymentMethod')?.value === 'mpesa'" class="fee-row">
              <span>M-PESA Fee:</span>
              <strong>KES {{ calculateMpesaFee() | number:'1.0-2' }}</strong>
            </div>
            <div class="fee-row total">
              <span>Total to Pay:</span>
              <strong class="total-amount">KES {{ getTotalAmount() | number:'1.0-2' }}</strong>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="reset" class="btn btn-secondary" (click)="resetForm()">
              Clear
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="!paymentForm.valid || isSubmitting()">
              <span *ngIf="!isSubmitting()">{{ getSubmitButtonText() }}</span>
              <span *ngIf="isSubmitting()">Processing...</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Summary Panel -->
      <div *ngIf="paymentForm.get('taxpayerId')?.value" class="summary-panel">
        <h3 class="section-title">Summary</h3>
        <div class="summary-group">
          <div class="summary-item">
            <span class="label">Taxpayer:</span>
            <span class="value">{{ getSelectedTaxpayer()?.name }}</span>
          </div>
          <div class="summary-item">
            <span class="label">PIN:</span>
            <span class="value">{{ getSelectedTaxpayer()?.pin }}</span>
          </div>
        </div>

        <div class="summary-group">
          <div class="summary-item">
            <span class="label">Type:</span>
            <span class="value">{{ paymentForm.get('paymentType')?.value }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Method:</span>
            <span class="value">{{ paymentForm.get('paymentMethod')?.value }}</span>
          </div>
        </div>

        <div class="summary-group highlight">
          <div class="summary-item">
            <span class="label">Amount:</span>
            <span class="value amount">KES {{ paymentForm.get('amount')?.value || '0' | number:'1.0-2' }}</span>
          </div>
        </div>

        <p class="summary-note">
          Review payment details carefully before proceeding. This action cannot be undone.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .payment-form-container {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 24px;
      margin-bottom: 24px;
    }

    .form-section,
    .summary-panel {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
    }

    .section-title {
      margin: 0 0 20px;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    label.required::after {
      content: ' *';
      color: #ef4444;
    }

    .form-input {
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .textarea {
      resize: vertical;
      min-height: 80px;
    }

    .error-text {
      font-size: 12px;
      color: #ef4444;
      font-weight: 500;
    }

    .hint-text {
      font-size: 12px;
      color: #9ca3af;
    }

    /* Amount Input */
    .amount-input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .currency {
      position: absolute;
      left: 12px;
      font-weight: 600;
      color: #6b7280;
      font-size: 13px;
    }

    .amount-input {
      padding-left: 40px;
      text-align: right;
    }

    /* Radio Group */
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .radio-option {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .radio-option:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    .radio-input {
      margin-top: 4px;
      cursor: pointer;
    }

    .radio-label {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .radio-label strong {
      color: #1f2937;
    }

    .radio-label small {
      color: #9ca3af;
      font-size: 12px;
    }

    /* Fee Breakdown */
    .fee-breakdown {
      background: #f0f9ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 16px;
    }

    .fee-breakdown h4 {
      margin: 0 0 12px;
      font-size: 14px;
      color: #1f2937;
    }

    .fee-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid #dbeafe;
    }

    .fee-row.total {
      border-bottom: none;
      border-top: 2px solid #3b82f6;
      padding-top: 12px;
      margin-top: 12px;
      font-weight: 600;
      color: #1f2937;
    }

    .total-amount {
      color: #2563eb;
      font-size: 16px;
    }

    /* Buttons */
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      flex: 1;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: white;
      border: 1px solid #d1d5db;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    /* Summary Panel */
    .summary-group {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }

    .summary-group.highlight {
      background: #f0f9ff;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #bfdbfe;
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 12px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }

    .summary-item:last-child {
      margin-bottom: 0;
    }

    .summary-item .label {
      color: #6b7280;
      font-weight: 500;
    }

    .summary-item .value {
      color: #1f2937;
      font-weight: 600;
      text-align: right;
      word-break: break-word;
    }

    .summary-item .value.amount {
      font-size: 16px;
      color: #059669;
    }

    .summary-note {
      margin: 16px 0 0;
      padding: 12px;
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      border-radius: 4px;
      color: #92400e;
      font-size: 12px;
      line-height: 1.5;
    }

    @media (max-width: 1024px) {
      .payment-form-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PaymentFormComponent {
  private formBuilder = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private validationService = inject(ValidationService);
  private notificationService = inject(NotificationService);
  private mpesaService = inject(MpesaService);

  // State
  paymentForm!: FormGroup;
  isSubmitting = signal(false);
  selectedPaymentType = signal('');

  // Data
  taxpayers = signal<any[]>([
    { id: 1, name: 'John Doe', pin: 'A123456789A' },
    { id: 2, name: 'Jane Smith', pin: 'B987654321B' },
    { id: 3, name: 'ABC Corp', pin: 'C111111111C' }
  ]);

  returns = signal<any[]>([
    { id: 1, period: '2024 Q1', amount: 50000 },
    { id: 2, period: '2024 Q2', amount: 75000 }
  ]);

  invoices = signal<any[]>([
    { id: 101, name: 'INV-001', amount: 25000 },
    { id: 102, name: 'INV-002', amount: 40000 }
  ]);

  filteredReturns = computed(() => this.returns());
  filteredInvoices = computed(() => this.invoices());

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.paymentForm = this.formBuilder.group({
      taxpayerId: ['', Validators.required],
      paymentType: ['', Validators.required],
      relatedId: [''],
      amount: [0, [Validators.required, Validators.min(100), Validators.max(150000)]],
      paymentMethod: ['mpesa', Validators.required],
      phone: ['', Validators.required],
      description: ['']
    });

    // Watch payment type changes
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const phoneControl = this.paymentForm.get('phone');
      if (method === 'mpesa') {
        phoneControl?.setValidators([Validators.required]);
      } else {
        phoneControl?.clearValidators();
      }
      phoneControl?.updateValueAndValidity({emitEvent: false});
    });
  }

  onPaymentTypeChange(): void {
    this.selectedPaymentType.set(this.paymentForm.get('paymentType')?.value);
  }

  showFeeBreakdown(): boolean {
    return !!this.paymentForm.get('amount')?.value && this.paymentForm.get('amount')?.value > 0;
  }

  calculateMpesaFee(): number {
    const amount = this.paymentForm.get('amount')?.value || 0;
    return this.mpesaService.calculatePaymentFee(amount).fee;
  }

  getTotalAmount(): number {
    const amount = this.paymentForm.get('amount')?.value || 0;
    const fee = this.paymentForm.get('paymentMethod')?.value === 'mpesa'
      ? this.calculateMpesaFee()
      : 0;
    return amount + fee;
  }

  getSubmitButtonText(): string {
    const method = this.paymentForm.get('paymentMethod')?.value;
    return method === 'mpesa' ? 'Proceed to M-PESA' : 'Confirm Payment';
  }

  getSelectedTaxpayer(): any {
    const id = this.paymentForm.get('taxpayerId')?.value;
    return this.taxpayers().find(tp => tp.id === id);
  }

  hasError(field: string): boolean {
    const control = this.paymentForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getError(field: string): string {
    const control = this.paymentForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('min')) {
      return 'Minimum amount is KES 100';
    }
    if (control.hasError('max')) {
      return 'Maximum amount is KES 150,000';
    }

    return 'Invalid input';
  }

  async submitPayment(): Promise<void> {
    if (!this.paymentForm.valid) {
      this.notificationService.showError('Please fill in all required fields');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formData = this.paymentForm.value;

      if (formData.paymentMethod === 'mpesa') {
        // Trigger M-PESA payment
        const result = await this.mpesaService.processPayment(
          formData.phone,
          formData.amount,
          formData.taxpayerId
        );

        if (result.success) {
          this.notificationService.showSuccess('M-PESA payment initiated. Check your phone for the prompt.');
          this.resetForm();
        } else {
          this.notificationService.showError(result.message);
        }
      } else {
        // Other payment methods
        this.notificationService.showSuccess('Payment recorded. Please complete payment through your bank.');
        this.resetForm();
      }
    } catch (error: any) {
      this.notificationService.showError('Payment processing failed: ' + error.message);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  resetForm(): void {
    this.paymentForm.reset({
      paymentMethod: 'mpesa'
    });
    this.selectedPaymentType.set('');
  }
}
