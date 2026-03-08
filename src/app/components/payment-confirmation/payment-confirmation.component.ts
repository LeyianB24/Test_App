import { Component, inject, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-payment-confirmation',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop-precision" (click)="onCancel()">
      <div class="modal-panel-precision md animate-scale-in" (click)="$event.stopPropagation()">
        <!-- High-Precision Modal Header -->
        <div class="modal-header-precision">
          <div class="flex items-center gap-5">
            <div class="icon-orb-precision">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            </div>
            <div>
              <h2 class="modal-title-precision">Authorize Transaction</h2>
              <p class="text-[11px] font-bold uppercase tracking-widest text-white/40 mt-1">Reviewing secure payment pipeline</p>
            </div>
          </div>
          <button class="btn-precision btn-secondary-precision px-3 border-none opacity-40 hover:opacity-100" (click)="onCancel()">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
    
        <!-- Tactical Modal Body -->
        <div class="modal-body-precision space-y-8 scrollbar-thin">
    
          <!-- Summary Component -->
          <div class="ops-card-precision">
            <h3 class="text-[10px] font-black uppercase tracking-widest text-red-base mb-4 flex items-center gap-2">
              <span class="w-1 h-1 bg-red-base rounded-full animate-pulse"></span>
              Entity Identification
            </h3>
            <div class="ledger-stack-precision">
              <div class="ledger-row-precision">
                <span class="label">Primary Taxpayer</span>
                <span class="value">{{ summary().taxpayerName }}</span>
              </div>
              <div class="ledger-row-precision">
                <span class="label">Tax Identification Number</span>
                <span class="value font-mono tracking-widest">{{ summary().taxpayerPin }}</span>
              </div>
              <div class="ledger-row-precision">
                <span class="label">Classification</span>
                <span class="value uppercase">{{ formatLabel(summary().paymentType) }}</span>
              </div>
            </div>
          </div>
    
          <!-- Financial Breakdown -->
          <div class="grid grid-cols-1 gap-6">
            <div class="card-precision p-6 border-white/5 bg-white/[0.02]">
              <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Financial Payload Breakdown</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-end border-b border-white/5 pb-3">
                  <span class="text-[11px] font-bold text-white/50 uppercase tracking-widest">Base Amount</span>
                  <span class="text-lg font-black text-white">KES {{ summary().amount | number:'1.0-2' }}</span>
                </div>
    
                @if (showFee()) {
                  <div class="flex justify-between items-end border-b border-white/5 pb-3">
                    <span class="text-[11px] font-bold text-white/50 uppercase tracking-widest">{{ summary().paymentMethod }} Processor Fee</span>
                    <span class="text-md font-bold text-white/70">KES {{ fee() | number:'1.0-2' }}</span>
                  </div>
                }
    
                <div class="flex justify-between items-end pt-2">
                  <span class="text-[12px] font-black text-red-base uppercase tracking-[0.2em]">Total Authorization</span>
                  <span class="text-2xl font-black text-white tracking-tighter">KES {{ totalAmount() | number:'1.0-2' }}</span>
                </div>
              </div>
            </div>
          </div>
    
          <!-- Channel Allocation -->
          <div class="ops-card-precision border-red-base/10">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-10 h-10 rounded-xl bg-red-base/10 border border-red-base/20 flex items-center justify-center text-xl">
                @if (summary().paymentMethod === 'mpesa') { 📱 }
                  @else if (summary().paymentMethod === 'bank_transfer') { 🏦 }
                  @else { 📄 }
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-white">Channel: {{ formatLabel(summary().paymentMethod) }}</h4>
                  <p class="text-[10px] text-white/40 font-medium">Standard processing protocol applied</p>
                </div>
              </div>
            </div>
    
            <!-- Tactical Requirements -->
            <div class="protocol-stack-precision">
              <label class="flex items-start gap-4 cursor-pointer group">
                <input type="checkbox" [(ngModel)]="acceptedTerms" class="mt-1 w-5 h-5 rounded-lg border-2 border-white/10 bg-black/40 text-red-base focus:ring-red-base/20 transition-all checked:bg-red-base">
                <span class="text-[11px] font-medium leading-relaxed text-white/60 group-hover:text-white/90 transition-colors">
                  I hereby authorize the KRA to initiate this transaction. I acknowledge that this financial directive is irreversible once committed.
                  <a href="#" target="_blank" class="text-red-base underline decoration-red-base/30 hover:decoration-red-base ml-1">Directive Policy v2.0</a>
                </span>
              </label>
            </div>
    
            <!-- Sentinel Warning -->
            <div class="error-state-precision/10 p-4 border border-red-base/20 rounded-2xl flex gap-4 bg-red-base/[0.02]">
              <svg width="20" height="20" class="text-red-base mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <div class="space-y-1">
                <h5 class="text-[10px] font-black uppercase tracking-widest text-red-base">Irreversible Sequence</h5>
                <p class="text-[11px] text-white/50 leading-relaxed">System verification required. Misallocation of funds may lead to compliance flags.</p>
              </div>
            </div>
          </div>
    
          <!-- Operational Footer -->
          <div class="modal-footer-precision flex gap-4">
            <button class="btn-precision btn-secondary-precision flex-1 py-4" (click)="onCancel()">
              Abort
            </button>
            <button
              class="btn-precision btn-primary-precision flex-1 py-4"
              (click)="onConfirm()"
              [disabled]="!acceptedTerms || isProcessing()">
              @if (!isProcessing()) {
                <span>{{ getConfirmButtonText() }}</span>
              }
              @if (isProcessing()) {
                <span>Synchronizing...</span>
              }
            </button>
          </div>
        </div>
      </div>
    `,
  styles: [`
    :host { display: block; }
    .scrollbar-thin::-webkit-scrollbar { width: 4px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
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
