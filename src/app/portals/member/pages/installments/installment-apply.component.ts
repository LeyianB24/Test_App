import { inject, Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MpesaService } from '../../../../services/mpesa.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-installment-apply',
  imports: [ReactiveFormsModule, RouterModule, CommonModule, FormsModule],
  template: `
    <div class="installment-apply-container p-6 animate-fade-in">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Apply for Payment Plan</h1>
          <p class="text-slate-400">Propose a monthly repayment schedule for your outstanding tax debt.</p>
        </div>
        <button routerLink="/member/installments" class="text-slate-500 hover:text-white transition-colors">
          Cancel &amp; Exit
        </button>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="glass-card p-10">
          <form [formGroup]="installmentForm">
            <div class="space-y-8">
              
              <!-- Basics -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Select Debt Obligation</label>
                    <select formControlName="obligation_id" class="form-select">
                       <option value="" disabled>Choose liability...</option>
                       <option value="1">Income Tax 2024 Audit (450,000 KES)</option>
                       <option value="2">VAT Sept 2025 (88,200 KES)</option>
                    </select>
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Down Payment (Min 10%)</label>
                    <input type="number" formControlName="down_payment" class="form-input" placeholder="0.00">
                    <div class="text-[9px] text-violet-400 mt-2 italic">Minimum required: 45,000.00 KES</div>
                 </div>
              </div>

              <!-- Proposed Schedule -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Number of Months</label>
                    <select formControlName="duration_months" class="form-select">
                       <option [value]="3">3 Months</option>
                       <option [value]="6">6 Months</option>
                       <option [value]="12">12 Months</option>
                       <option [value]="24">24 Months</option>
                    </select>
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Preferred Payment Day</label>
                    <select formControlName="payment_day" class="form-select">
                       <option [value]="5">5th of every month</option>
                       <option [value]="20">20th of every month</option>
                    </select>
                 </div>
              </div>

              <!-- Computed Summary -->
              <div class="p-6 rounded-2xl bg-violet-600/5 border border-violet-500/10">
                 <h4 class="text-white font-bold text-xs uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Proposed Schedule Summary</h4>
                 <div class="space-y-4">
                    <div class="flex justify-between text-slate-400 text-sm">
                       <span>Total Principal Liability</span>
                       <span class="text-white font-mono">450,000.00 KES</span>
                    </div>
                    <div class="flex justify-between text-slate-400 text-sm">
                       <span>Down Payment to be Paid</span>
                       <span class="text-violet-400 font-mono">- {{ downPaymentValue() | number:'1.2-2' }} KES</span>
                    </div>
                    <div class="flex justify-between text-slate-200 font-bold border-t border-white/5 pt-4">
                       <span class="uppercase text-xs">Monthly Installment Amount</span>
                       <span class="text-xl font-mono">{{ monthlyAmount() | number:'1.2-2' }} KES / month</span>
                    </div>
                    <div class="text-[10px] text-slate-500 mt-2 italic text-center">
                       * Includes 1% statutory interest per month on declining balance.
                    </div>
                 </div>
              </div>

              <!-- Action Footer -->
              <div class="pt-10 border-t border-white/5 flex gap-4 flex-wrap">
                 <button
                   type="submit"
                   class="flex-1 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/20 transition-all hover:-translate-y-1"
                   [disabled]="!installmentForm.valid">
                    Submit Installment Proposal
                 </button>
                 <button
                   type="button"
                   class="flex-1 py-4 bg-green-700/20 hover:bg-green-700/30 text-green-400 font-bold rounded-2xl border border-green-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                   [disabled]="!(+( installmentForm.get('down_payment')?.value ?? 0) > 0)"
                   (click)="openMpesaModal()">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Pay Down Payment via M-Pesa
                 </button>
                 <button routerLink="/member/installments" class="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-2xl transition-all">
                    Discard
                 </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- M-Pesa Down Payment Modal -->
    @if (showMpesaModal()) {
      <div class="mpesa-overlay" role="dialog" aria-modal="true" aria-labelledby="apply-mpesa-title">
        <div class="mpesa-modal-backdrop" (click)="closeMpesaModal()"></div>
        <div class="mpesa-modal-content">
          <!-- Header -->
          <div class="mpesa-modal-header">
            <div>
              <div class="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">M-PESA STK PUSH</div>
              <h2 id="apply-mpesa-title" class="text-lg font-black text-white">Pay Down Payment</h2>
              <p class="text-slate-400 text-xs mt-0.5">This secures your installment plan application.</p>
            </div>
            <button class="mpesa-close-btn" (click)="closeMpesaModal()" aria-label="Close M-Pesa modal">✕</button>
          </div>

          <!-- Body -->
          <div class="mpesa-modal-body">
            @if (mpesaProcessing()) {
              <div class="mpesa-state-center">
                <div class="mpesa-spinner" role="status" aria-label="Processing payment"></div>
                <p class="text-white font-bold mt-4">Sending prompt to your phone…</p>
                <p class="text-slate-400 text-sm mt-1">Enter your M-PESA PIN when prompted.</p>
              </div>
            } @else if (mpesaSuccess()) {
              <div class="mpesa-state-center">
                <div class="mpesa-icon-success" aria-hidden="true">✓</div>
                <h3 class="text-white font-bold text-lg mt-4">Down Payment Initiated!</h3>
                <p class="text-slate-400 text-sm mt-1">Check <strong class="text-white">{{ mpesaPhone() }}</strong> for the M-PESA PIN prompt.</p>
                <p class="text-green-400 text-xs mt-3 bg-green-500/10 px-4 py-2 rounded-lg">Transaction ID: {{ mpesaTransactionId() }}</p>
                <p class="text-slate-500 text-[10px] mt-3">Once payment is confirmed, proceed to submit your installment proposal.</p>
                <button class="mpesa-btn-primary mt-6" (click)="closeMpesaModal()">Done</button>
              </div>
            } @else if (mpesaError()) {
              <div class="mpesa-state-center">
                <div class="mpesa-icon-error" aria-hidden="true">✕</div>
                <h3 class="text-white font-bold text-lg mt-4">Payment Failed</h3>
                <p class="text-slate-400 text-sm mt-1">{{ mpesaErrorMessage() }}</p>
                <button class="mpesa-btn-primary mt-6" (click)="resetMpesaState()">Try Again</button>
              </div>
            } @else {
              <!-- Form -->
              <div class="mpesa-amount-card">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Down Payment Amount</div>
                <div class="text-3xl font-black text-white font-mono">KES {{ downPaymentValue() | number:'1.2-2' }}</div>
                <div class="text-[10px] text-slate-500 mt-1">Min. 10% of total liability</div>
              </div>

              <div class="mpesa-field">
                <label for="apply-mpesa-phone" class="mpesa-label">M-PESA Phone Number <span class="text-red-400">*</span></label>
                <input
                  id="apply-mpesa-phone"
                  type="tel"
                  [(ngModel)]="mpesaPhoneInput"
                  name="apply_mpesa_phone"
                  placeholder="e.g. 0712 345 678 or +254712345678"
                  class="mpesa-input"
                  autocomplete="tel">
                <span class="text-slate-500 text-[10px] mt-1 block">Must be registered with M-PESA</span>
              </div>

              <div class="mpesa-form-footer">
                <button type="button" class="mpesa-btn-secondary" (click)="closeMpesaModal()">Cancel</button>
                <button
                  type="button"
                  class="mpesa-btn-primary"
                  [disabled]="!mpesaPhoneInput"
                  (click)="submitMpesaPayment()">
                  Initiate M-PESA Payment
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 28px;
    }
    .form-input, .form-select {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px 16px;
      color: white;
      transition: all 0.2s;
    }
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #8b5cf6;
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
    }
    /* M-Pesa Modal */
    .mpesa-overlay {
      position: fixed; inset: 0; z-index: 900;
      display: flex; align-items: center; justify-content: center; padding: 1rem;
    }
    .mpesa-modal-backdrop {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.75); backdrop-filter: blur(6px);
    }
    .mpesa-modal-content {
      position: relative; z-index: 1;
      background: #1e293b; border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 40px 80px rgba(0,0,0,0.5);
      width: 100%; max-width: 440px; overflow: hidden;
    }
    .mpesa-modal-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.02);
    }
    .mpesa-close-btn {
      width: 32px; height: 32px; border-radius: 8px;
      background: rgba(255,255,255,0.05); border: none;
      color: #94a3b8; cursor: pointer; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.15s;
    }
    .mpesa-close-btn:hover { background: rgba(255,255,255,0.1); color: white; }
    .mpesa-modal-body { padding: 1.5rem; }
    .mpesa-state-center { text-align: center; padding: 1.5rem 0; }
    .mpesa-spinner {
      width: 52px; height: 52px; border-radius: 50%;
      border: 4px solid rgba(255,255,255,0.1);
      border-top-color: #22c55e;
      animation: spin 0.8s linear infinite; margin: 0 auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .mpesa-icon-success {
      width: 64px; height: 64px; border-radius: 50%;
      background: #16a34a20; color: #22c55e;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; font-weight: 900; margin: 0 auto;
      border: 2px solid #22c55e40;
    }
    .mpesa-icon-error {
      width: 64px; height: 64px; border-radius: 50%;
      background: #dc262620; color: #ef4444;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; font-weight: 900; margin: 0 auto;
      border: 2px solid #ef444440;
    }
    .mpesa-amount-card {
      background: rgba(139,92,246,0.08); border: 1px solid rgba(139,92,246,0.2);
      border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;
    }
    .mpesa-field { display: flex; flex-direction: column; margin-bottom: 1.25rem; }
    .mpesa-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    .mpesa-input {
      background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 0.75rem 1rem;
      color: white; font-size: 14px; font-family: monospace; letter-spacing: 0.05em;
      transition: border-color 0.15s;
    }
    .mpesa-input:focus { outline: none; border-color: #8b5cf6; }
    .mpesa-form-footer { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
    .mpesa-btn-primary {
      flex: 1; padding: 0.75rem 1.5rem; border-radius: 10px;
      background: #16a34a; color: white; font-weight: 700; font-size: 13px;
      border: none; cursor: pointer; transition: background 0.15s;
    }
    .mpesa-btn-primary:hover:not(:disabled) { background: #15803d; }
    .mpesa-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
    .mpesa-btn-secondary {
      padding: 0.75rem 1.25rem; border-radius: 10px;
      background: rgba(255,255,255,0.05); color: #94a3b8;
      font-weight: 600; font-size: 13px;
      border: 1px solid rgba(255,255,255,0.08); cursor: pointer; transition: all 0.15s;
    }
    .mpesa-btn-secondary:hover { background: rgba(255,255,255,0.08); color: white; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallmentApplyComponent {
  private fb = inject(FormBuilder);
  private mpesaService = inject(MpesaService);
  private notificationService = inject(NotificationService);

  installmentForm = this.fb.group({
    obligation_id: ['', Validators.required],
    down_payment: [null as number | null, [Validators.required, Validators.min(0)]],
    duration_months: [12, Validators.required],
    payment_day: [5, Validators.required],
    declaration: [false, Validators.requiredTrue]
  });

  // Computed values from form
  downPaymentValue = computed(() => {
    return (this.installmentForm.get('down_payment')?.value as number) || 45000;
  });

  monthlyAmount = computed(() => {
    const total = 450000;
    const down = this.downPaymentValue();
    const months = (this.installmentForm.get('duration_months')?.value as number) || 12;
    const remaining = total - down;
    if (months <= 0) return 0;
    return remaining / months;
  });

  // M-Pesa state
  showMpesaModal = signal(false);
  mpesaProcessing = signal(false);
  mpesaSuccess = signal(false);
  mpesaError = signal(false);
  mpesaErrorMessage = signal('');
  mpesaTransactionId = signal('');
  mpesaPhone = signal('');
  mpesaPhoneInput = '';

  openMpesaModal() {
    this.mpesaPhoneInput = '';
    this.resetMpesaState();
    this.showMpesaModal.set(true);
  }

  closeMpesaModal() {
    this.showMpesaModal.set(false);
  }

  resetMpesaState() {
    this.mpesaProcessing.set(false);
    this.mpesaSuccess.set(false);
    this.mpesaError.set(false);
    this.mpesaErrorMessage.set('');
    this.mpesaTransactionId.set('');
  }

  async submitMpesaPayment() {
    const phone = this.mpesaPhoneInput?.trim();
    if (!phone) return;

    if (!this.mpesaService.isValidMpesaPhone(phone)) {
      this.mpesaError.set(true);
      this.mpesaErrorMessage.set('Invalid M-PESA phone number. Use a Safaricom or Airtel number.');
      return;
    }

    const amount = this.downPaymentValue();
    this.mpesaPhone.set(phone);
    this.mpesaProcessing.set(true);

    try {
      const obligationId = this.installmentForm.get('obligation_id')?.value || '';
      const result = await this.mpesaService.processPayment(phone, amount, `DOWN-${obligationId}`);
      if (result.success) {
        this.mpesaTransactionId.set(result.transactionId ?? '');
        this.mpesaSuccess.set(true);
        this.notificationService.showSuccess('M-PESA prompt sent! Enter your PIN to complete the down payment.');
      } else {
        this.mpesaError.set(true);
        this.mpesaErrorMessage.set(result.message);
      }
    } catch (err: unknown) {
      this.mpesaError.set(true);
      this.mpesaErrorMessage.set(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      this.mpesaProcessing.set(false);
    }
  }
}
