import { Component, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { MpesaService } from '../../services/mpesa.service';

export interface PaymentSummary {
  taxpayerId: number;
  taxpayerName: string;
  taxpayerPin: string;
  paymentType: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  relatedItemId?: number;
}

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="confirmation-overlay" (click)="onCancel()">
      <div class="confirmation-modal" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">💳</div>
            <div>
              <h2>Confirm Payment</h2>
              <p>Review payment details before proceeding</p>
            </div>
          </div>
          <button class="close-btn" (click)="onCancel()">✕</button>
        </div>

        <!-- Content -->
        <div class="modal-content">
          <!-- Payment Summary -->
          <div class="summary-section">
            <h3 class="section-title">Payment Details</h3>
            <div class="detail-row">
              <span class="label">Taxpayer:</span>
              <span class="value">{{ summary().taxpayerName }}</span>
            </div>
            <div class="detail-row">
              <span class="label">PIN:</span>
              <span class="value font-mono">{{ summary().taxpayerPin }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Payment Type:</span>
              <span class="value">{{ formatLabel(summary().paymentType) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Description:</span>
              <span class="value">{{ summary().description || 'N/A' }}</span>
            </div>
          </div>

          <!-- Amount Breakdown -->
          <div class="breakdown-section">
            <h3 class="section-title">Amount Breakdown</h3>
            <div class="breakdown-row">
              <span class="label">Base Amount:</span>
              <span class="value">KES {{ summary().amount | number:'1.0-2' }}</span>
            </div>
            <div *ngIf="showFee()" class="breakdown-row">
              <span class="label">{{ summary().paymentMethod | titlecase }} Fee:</span>
              <span class="value">KES {{ fee() | number:'1.0-2' }}</span>
            </div>
            <div *ngIf="showFee()" class="breakdown-row total">
              <span class="label">Total Amount:</span>
              <span class="value total-amount">KES {{ totalAmount() | number:'1.0-2' }}</span>
            </div>
            <div *ngIf="!showFee()" class="breakdown-row total">
              <span class="label">Total Amount:</span>
              <span class="value total-amount">KES {{ summary().amount | number:'1.0-2' }}</span>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="method-section">
            <h3 class="section-title">Payment Method</h3>
            <div class="method-display">
              <div class="method-icon">
                <span *ngIf="summary().paymentMethod === 'mpesa'">📱</span>
                <span *ngIf="summary().paymentMethod === 'bank_transfer'">🏦</span>
                <span *ngIf="summary().paymentMethod === 'cheque'">📄</span>
              </div>
              <div class="method-info">
                <div class="method-name">{{ formatLabel(summary().paymentMethod) }}</div>
                <div class="method-details" [ngSwitch]="summary().paymentMethod">
                  <span *ngSwitchCase="'mpesa'">
                    You'll receive a prompt on your M-PESA registered phone
                  </span>
                  <span *ngSwitchCase="'bank_transfer'">
                    Complete payment through your bank account
                  </span>
                  <span *ngSwitchCase="'cheque'">
                    Post cheque to KRA headquarters
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <div class="terms-section">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="acceptedTerms" class="checkbox-input">
              <span>
                I confirm that the above payment details are correct and authorize this transaction.
                By proceeding, I agree to the
                <a href="#" target="_blank" class="link">terms and conditions</a>.
              </span>
            </label>
          </div>

          <!-- Warning Message -->
          <div class="warning-box">
            <div class="warning-icon">⚠️</div>
            <div class="warning-content">
              <strong>Important:</strong> Please ensure all details are correct before confirming.
              This action cannot be undone. If using M-PESA, you will be charged a fee.
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="onCancel()">
            Cancel
          </button>
          <button
            class="btn btn-primary"
            (click)="onConfirm()"
            [disabled]="!acceptedTerms || isProcessing()">
            <span *ngIf="!isProcessing()">{{ getConfirmButtonText() }}</span>
            <span *ngIf="isProcessing()">Processing...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(2px);
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .confirmation-modal {
      background: white;
      border-radius: 16px;
      max-width: 550px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .header-content {
      display: flex;
      gap: 16px;
      flex: 1;
    }

    .header-icon {
      font-size: 36px;
      line-height: 1;
    }

    .modal-header h2 {
      margin: 0 0 6px;
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }

    .modal-header p {
      margin: 0;
      font-size: 13px;
      color: #6b7280;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #1f2937;
    }

    .modal-content {
      padding: 24px;
    }

    /* Sections */
    .summary-section,
    .breakdown-section,
    .method-section,
    .terms-section {
      margin-bottom: 24px;
    }

    .section-title {
      margin: 0 0 16px;
      font-size: 14px;
      font-weight: 700;
      color: #1f2937;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Detail Rows */
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row .label {
      color: #6b7280;
      font-size: 13px;
      font-weight: 500;
    }

    .detail-row .value {
      color: #1f2937;
      font-size: 13px;
      font-weight: 600;
      text-align: right;
    }

    .font-mono {
      font-family: 'Courier New', monospace;
      letter-spacing: 1px;
    }

    /* Breakdown */
    .breakdown-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      font-size: 14px;
      border-bottom: 1px solid #e5e7eb;
    }

    .breakdown-row .label {
      color: #6b7280;
      font-weight: 500;
    }

    .breakdown-row .value {
      color: #1f2937;
      font-weight: 600;
    }

    .breakdown-row.total {
      border-top: 2px solid #667eea;
      border-bottom: none;
      padding: 12px 0;
      font-weight: 700;
    }

    .total-amount {
      color: #2563eb;
      font-size: 16px;
    }

    /* Method Section */
    .method-display {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: #f8f9ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
    }

    .method-icon {
      font-size: 32px;
      line-height: 1;
    }

    .method-info {
      flex: 1;
    }

    .method-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .method-details {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.4;
    }

    /* Terms & Conditions */
    .checkbox-label {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      cursor: pointer;
      font-size: 13px;
      color: #6b7280;
    }

    .checkbox-input {
      margin-top: 2px;
      cursor: pointer;
      width: 18px;
      height: 18px;
      border: 2px solid #d1d5db;
      border-radius: 6px;
    }

    .checkbox-input:checked {
      background: #667eea;
      border-color: #667eea;
    }

    .checkbox-label:hover .checkbox-input {
      border-color: #9ca3af;
    }

    .link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .link:hover {
      text-decoration: underline;
    }

    /* Warning Box */
    .warning-box {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      border-radius: 8px;
    }

    .warning-icon {
      flex-shrink: 0;
      font-size: 20px;
    }

    .warning-content {
      font-size: 12px;
      color: #92400e;
      line-height: 1.5;
    }

    .warning-content strong {
      font-weight: 700;
    }

    /* Footer */
    .modal-footer {
      display: flex;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 14px;
      flex: 1;
    }

    .btn-secondary {
      background: white;
      border: 1px solid #d1d5db;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .confirmation-modal {
        width: 95%;
        max-height: 95vh;
      }

      .modal-header {
        padding: 16px;
      }

      .modal-content {
        padding: 16px;
      }

      .modal-footer {
        padding: 16px;
      }

      .header-content {
        gap: 12px;
      }

      .modal-header h2 {
        font-size: 18px;
      }

      .btn {
        padding: 10px 16px;
      }
    }
  `]
})
export class PaymentConfirmationComponent {
  private notificationService = inject(NotificationService);
  private mpesaService = inject(MpesaService);

  // Inputs & Outputs
  summary = input<PaymentSummary>({
    taxpayerId: 0,
    taxpayerName: '',
    taxpayerPin: '',
    paymentType: '',
    amount: 0,
    paymentMethod: 'mpesa'
  });

  confirmed = output<PaymentSummary>();
  cancelled = output<void>();

  // State
  acceptedTerms = false;
  isProcessing = signal(false);

  // Computed
  showFee = computed(() => this.summary().paymentMethod === 'mpesa');

  fee = computed(() => {
    if (!this.showFee()) return 0;
    return this.mpesaService.calculatePaymentFee(this.summary().amount).fee;
  });

  totalAmount = computed(() => {
    return this.summary().amount + (this.showFee() ? this.fee() : 0);
  });

  formatLabel(value: string): string {
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  getConfirmButtonText(): string {
    switch (this.summary().paymentMethod) {
      case 'mpesa':
        return 'Proceed to M-PESA';
      case 'bank_transfer':
        return 'Confirm Bank Transfer';
      case 'cheque':
        return 'Confirm Cheque Payment';
      default:
        return 'Confirm Payment';
    }
  }

  onConfirm(): void {
    if (!this.acceptedTerms) {
      this.notificationService.showWarning('Please accept the terms and conditions');
      return;
    }

    if (!this.summary().amount || this.summary().amount <= 0) {
      this.notificationService.showError('Invalid payment amount');
      return;
    }

    this.isProcessing.set(true);

    // Simulate processing delay
    setTimeout(() => {
      this.notificationService.showSuccess('Payment confirmed. Proceeding to payment gateway...');
      this.confirmed.emit(this.summary());
      this.isProcessing.set(false);
    }, 1000);
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
