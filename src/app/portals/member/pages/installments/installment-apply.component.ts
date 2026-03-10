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
    <div class="page-container animate-fade-in">
      <div class="noise-overlay"></div>
      <header class="premium-header mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              PROPOSAL TERMINAL
            </span>
          </div>
          <h1 class="premium-title">Repayment <span class="gradient-text">Scheduler</span></h1>
          <p class="premium-subtitle">Propose a tactical monthly repayment protocol for outstanding tax liabilities</p>
        </div>
        <button routerLink="/member/installments" class="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
          Abort Proposal
        </button>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="glass-panel p-10 relative overflow-hidden group">
          <!-- Ambient Glow -->
          <div class="absolute -top-32 -left-32 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl group-hover:bg-violet-600/10 transition-colors duration-1000"></div>

          <form [formGroup]="installmentForm">
            <div class="space-y-10 relative z-10">
              
              <!-- Basics -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Select Liability Pool</label>
                    <select formControlName="obligation_id" class="form-select bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-violet-500/50 transition-all">
                       <option value="" disabled>Choose liability...</option>
                       <option value="1">Income Tax 2024 Audit (450,000 KES)</option>
                       <option value="2">VAT Sept 2025 (88,200 KES)</option>
                    </select>
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Initial Liquidation (Min 10%)</label>
                    <div class="relative">
                       <input type="number" formControlName="down_payment" class="form-input bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-violet-500/50 transition-all pl-12" placeholder="0.00">
                       <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px]">KES</span>
                    </div>
                    <div class="text-[9px] text-violet-400 mt-2 font-black uppercase tracking-widest opacity-60">Strategic Minimum: 45,000.00 KES</div>
                 </div>
              </div>

              <!-- Proposed Schedule -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Repayment Horizon</label>
                    <select formControlName="duration_months" class="form-select bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-violet-500/50 transition-all">
                       <option [value]="3">3 Months (Short Term)</option>
                       <option [value]="6">6 Months (Quarterly)</option>
                       <option [value]="12">12 Months (Standard)</option>
                       <option [value]="24">24 Months (Extended)</option>
                    </select>
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Recurrent Payment Date</label>
                    <select formControlName="payment_day" class="form-select bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-violet-500/50 transition-all">
                       <option [value]="5">5th of every month</option>
                       <option [value]="20">20th of every month</option>
                    </select>
                 </div>
              </div>

              <!-- Computed Summary -->
              <div class="p-8 rounded-2xl bg-white/[0.01] border border-white/5 relative overflow-hidden">
                 <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
                 <h4 class="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-8 opacity-60">Computed Proposal Matrix</h4>
                 <div class="space-y-6">
                    <div class="flex justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
                       <span>Gross Liability Exposure</span>
                       <span class="text-white tracking-widest font-mono">450,000.00 KES</span>
                    </div>
                    <div class="flex justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-widest">
                       <span>Initial Liquidation Offset</span>
                       <span class="text-violet-400 tracking-widest font-mono">{{ downPaymentValue() | number:'1.2-2' }} KES</span>
                    </div>
                    <div class="flex justify-between items-center bg-violet-500/5 p-4 rounded-xl border border-violet-500/10">
                       <span class="uppercase text-[10px] font-black text-violet-400 tracking-widest">Monthly Quota Allocation</span>
                       <span class="text-xl font-black text-white tracking-tighter tabular-nums">{{ monthlyAmount() | number:'1.2-2' }} <span class="text-[10px] text-slate-600">KES / Mo</span></span>
                    </div>
                    <div class="text-[9px] text-slate-600 mt-2 font-black uppercase tracking-[0.2em] text-center">
                       * Includes 1% statutory interest per month on declining balance per IT Act 2023.
                    </div>
                 </div>
              </div>

              <!-- Declaration Toggle -->
              <div class="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer group/decl" (click)="installmentForm.get('declaration')?.setValue(!installmentForm.get('declaration')?.value)">
                <div class="w-6 h-6 rounded-lg border-2 border-white/10 flex items-center justify-center shrink-0 transition-all group-hover/decl:border-violet-500/50" [class.bg-violet-600]="installmentForm.get('declaration')?.value" [class.border-violet-500]="installmentForm.get('declaration')?.value">
                  @if (installmentForm.get('declaration')?.value) {
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
                  }
                </div>
                <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                  I solemnly declare that I will strictly adhere to the repayment schedule and understand that any default will trigger full recovery enforcement protocols.
                </div>
              </div>

              <!-- Action Footer -->
              <div class="pt-10 border-t border-white/5 flex flex-col md:flex-row gap-4">
                 <button
                   type="submit"
                   class="modern-btn primary-btn flex-1 py-4 shadow-xl shadow-violet-600/20 elite-glow !rounded-2xl"
                   [disabled]="!installmentForm.valid">
                    Finalize Proposal Submission
                 </button>
                 <button
                   type="button"
                   class="flex-1 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-emerald-500/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                   [disabled]="!(+( installmentForm.get('down_payment')?.value ?? 0) > 0)"
                   (click)="openMpesaModal()">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Initial Liquidation via M-Pesa
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
    .page-container { 
      min-height: 100vh; 
      background: #050505 url('assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      color: #fff; 
      position: relative; 
      overflow-x: hidden; 
      padding: 60px 40px 100px;
    }
    
    .page-container::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.02; z-index: 2; pointer-events: none; }

    .premium-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
      margin-bottom: 40px;
    }

    .glass-panel {
      background: rgba(20, 20, 20, 0.4);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 32px;
      position: relative;
      z-index: 10;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .glass-panel:hover {
      background: rgba(20, 20, 20, 0.6);
      border-color: rgba(217, 43, 43, 0.3);
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    }

    .form-input, .form-select {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 16px 20px;
      color: white;
      transition: all 0.3s;
      outline: none;
    }
    .form-input:focus, .form-select:focus {
      border-color: rgba(217, 43, 43, 0.4);
      background: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 0 4px rgba(217, 43, 43, 0.1);
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
