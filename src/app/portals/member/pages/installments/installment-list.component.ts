import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MpesaService } from '../../../../services/mpesa.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-installment-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="installments-list-container p-6 animate-fade-in">
      <header class="mb-10 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Payment Installment Plans</h1>
          <p class="text-slate-400">Manage your tax debt through structured monthly payment arrangements.</p>
        </div>
        <button routerLink="/member/installments/apply" class="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-1">
          Apply for Installment Plan
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        @for (plan of plans; track plan.id) {
          <div class="glass-card overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all flex flex-col">
             <!-- Header -->
             <div class="p-6 bg-slate-800/50 border-b border-white/5 flex justify-between items-center">
                <div>
                   <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{{ plan.refNo }}</div>
                   <h3 class="text-white font-bold">{{ plan.obligation }}</h3>
                </div>
                <span class="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider" [class.bg-emerald-500/10]="plan.status === 'ACTIVE'" [class.text-emerald-400]="plan.status === 'ACTIVE'" [class.bg-blue-500/10]="plan.status === 'COMPLETED'" [class.text-blue-400]="plan.status === 'COMPLETED'">{{ plan.status }}</span>
             </div>

             <!-- Body -->
             <div class="p-6 space-y-6 flex-grow">
                <div class="flex justify-between items-end">
                   <div>
                      <div class="text-slate-500 text-[10px] uppercase font-bold mb-1">Total Debt Amount</div>
                      <div class="text-2xl font-bold text-white font-mono">{{ plan.totalAmount | number:'1.2-2' }} KES</div>
                   </div>
                   <div class="text-right">
                      <div class="text-slate-500 text-[10px] uppercase font-bold mb-1">Remaining Balance</div>
                      <div class="text-xl font-bold text-violet-400 font-mono">{{ plan.remainingBalance | number:'1.2-2' }} KES</div>
                   </div>
                </div>

                <!-- Progress Bar -->
                <div>
                   <div class="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-2">
                      <span>Progress</span>
                      <span>{{ plan.paidInstallments }}/{{ plan.totalInstallments }} Months Paid</span>
                   </div>
                   <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-violet-500 rounded-full" [style.width.%]="(plan.paidInstallments / plan.totalInstallments) * 100"></div>
                   </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-2">
                   <div class="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                      <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Next Payment Due</div>
                      <div class="text-white font-bold text-sm">{{ plan.nextDue }}</div>
                   </div>
                   <div class="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                      <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Monthly Amount</div>
                      <div class="text-white font-bold text-sm">{{ plan.monthlyAmount | number:'1.2-2' }} KES</div>
                   </div>
                </div>
             </div>

             <!-- Footer -->
             <div class="p-4 bg-slate-800/30 flex gap-4">
                <button class="flex-1 py-2 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 text-xs font-bold rounded-lg transition-all">Download Schedule</button>
                <button class="flex-1 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-lg transition-all">View Ledger</button>
                @if (plan.status === 'ACTIVE') {
                  <button
                    class="flex-1 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                    (click)="openMpesaModal(plan)">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Pay via M-Pesa
                  </button>
                }
             </div>
          </div>
        } @empty {
          <div class="lg:col-span-2 glass-card p-20 flex flex-col items-center justify-center text-center">
             <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </div>
             <p class="text-slate-400">You have no active installment plans.</p>
          </div>
        }
      </div>

      <!-- Compliance Note -->
      <div class="mt-12 p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 flex items-start">
         <svg class="w-6 h-6 text-violet-400 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
         <div class="text-xs text-slate-400 leading-relaxed">
            <strong class="text-violet-400 block mb-1 uppercase tracking-widest">Compliance Tip:</strong>
            Defaulting on a single installment payment may result in the immediate cancellation of the plan and full debt recovery enforcement, including agency notices on your bank accounts.
         </div>
      </div>
    </div>

    <!-- M-Pesa Payment Modal -->
    @if (showMpesaModal()) {
      <div class="mpesa-overlay" role="dialog" aria-modal="true" aria-labelledby="mpesa-modal-title">
        <div class="mpesa-modal-backdrop" (click)="closeMpesaModal()"></div>
        <div class="mpesa-modal-content">
          <!-- Header -->
          <div class="mpesa-modal-header">
            <div>
              <div class="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">M-PESA STK PUSH</div>
              <h2 id="mpesa-modal-title" class="text-lg font-black text-white">Pay Installment</h2>
              @if (selectedPlan()) {
                <p class="text-slate-400 text-xs mt-0.5">{{ selectedPlan()!.obligation }}</p>
              }
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
                <h3 class="text-white font-bold text-lg mt-4">Prompt Sent!</h3>
                <p class="text-slate-400 text-sm mt-1">Check <strong class="text-white">{{ mpesaForm.get('phone')?.value }}</strong> for the M-PESA PIN prompt.</p>
                <p class="text-green-400 text-xs mt-3 bg-green-500/10 px-4 py-2 rounded-lg">Transaction ID: {{ mpesaTransactionId() }}</p>
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
              <form [formGroup]="mpesaForm" (ngSubmit)="submitMpesaPayment()" class="mpesa-form">
                <!-- Amount display -->
                <div class="mpesa-amount-card">
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount Due</div>
                  <div class="text-3xl font-black text-white font-mono">KES {{ mpesaForm.get('amount')?.value | number:'1.2-2' }}</div>
                  <div class="text-[10px] text-slate-500 mt-1">Monthly installment payment</div>
                </div>

                <!-- Phone input -->
                <div class="mpesa-field">
                  <label for="installment-mpesa-phone" class="mpesa-label">M-PESA Phone Number <span class="text-red-400">*</span></label>
                  <input
                    id="installment-mpesa-phone"
                    type="tel"
                    formControlName="phone"
                    placeholder="e.g. 0712 345 678 or +254712345678"
                    class="mpesa-input"
                    [class.mpesa-input-error]="mpesaForm.get('phone')?.invalid && mpesaForm.get('phone')?.touched"
                    autocomplete="tel">
                  @if (mpesaForm.get('phone')?.invalid && mpesaForm.get('phone')?.touched) {
                    <span class="text-red-400 text-[10px] font-bold uppercase mt-1 block">Valid Safaricom/Airtel number required</span>
                  }
                  <span class="text-slate-500 text-[10px] mt-1 block">Must be registered with M-PESA</span>
                </div>

                <div class="mpesa-form-footer">
                  <button type="button" class="mpesa-btn-secondary" (click)="closeMpesaModal()">Cancel</button>
                  <button
                    type="submit"
                    class="mpesa-btn-primary"
                    [disabled]="mpesaForm.invalid">
                    Initiate M-PESA Payment
                  </button>
                </div>
              </form>
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
      border-radius: 24px;
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
    .mpesa-form { display: flex; flex-direction: column; gap: 0; }
    .mpesa-field { display: flex; flex-direction: column; margin-bottom: 1.25rem; }
    .mpesa-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
    .mpesa-input {
      background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 0.75rem 1rem;
      color: white; font-size: 14px; font-family: monospace; letter-spacing: 0.05em;
      transition: border-color 0.15s;
    }
    .mpesa-input:focus { outline: none; border-color: #8b5cf6; }
    .mpesa-input-error { border-color: #ef4444; }
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
export class InstallmentListComponent {
  private mpesaService = inject(MpesaService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  // M-Pesa modal state
  showMpesaModal = signal(false);
  selectedPlan = signal<{ id: number; refNo: string; obligation: string; monthlyAmount: number } | null>(null);
  mpesaProcessing = signal(false);
  mpesaSuccess = signal(false);
  mpesaError = signal(false);
  mpesaErrorMessage = signal('');
  mpesaTransactionId = signal('');

  mpesaForm = this.fb.group({
    phone: ['', [Validators.required]],
    amount: [0]
  });

  openMpesaModal(plan: { id: number; refNo: string; obligation: string; monthlyAmount: number }) {
    this.selectedPlan.set(plan);
    this.mpesaForm.reset({ phone: '', amount: plan.monthlyAmount });
    this.resetMpesaState();
    this.showMpesaModal.set(true);
  }

  closeMpesaModal() {
    this.showMpesaModal.set(false);
    this.selectedPlan.set(null);
  }

  resetMpesaState() {
    this.mpesaProcessing.set(false);
    this.mpesaSuccess.set(false);
    this.mpesaError.set(false);
    this.mpesaErrorMessage.set('');
    this.mpesaTransactionId.set('');
  }

  async submitMpesaPayment() {
    if (this.mpesaForm.invalid) return;
    const { phone, amount } = this.mpesaForm.value;
    if (!phone || !amount) return;

    if (!this.mpesaService.isValidMpesaPhone(phone)) {
      this.mpesaError.set(true);
      this.mpesaErrorMessage.set('Invalid M-PESA phone number. Use a Safaricom or Airtel number.');
      return;
    }

    this.mpesaProcessing.set(true);
    try {
      const plan = this.selectedPlan();
      const result = await this.mpesaService.processPayment(phone, amount, plan?.refNo ?? '');
      if (result.success) {
        this.mpesaTransactionId.set(result.transactionId ?? '');
        this.mpesaSuccess.set(true);
        this.notificationService.showSuccess('M-PESA prompt sent to your phone!');
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

  plans = [
    {
      id: 1,
      refNo: 'IPL-2025-001',
      obligation: 'Income Tax - 2024 Audit Debt',
      totalAmount: 450000.00,
      remainingBalance: 300000.00,
      monthlyAmount: 37500.00,
      paidInstallments: 4,
      totalInstallments: 12,
      nextDue: '2026-03-05',
      status: 'ACTIVE'
    },
    {
      id: 2,
      refNo: 'IPL-2024-012',
      obligation: 'VAT - Oct 2024 Penalties',
      totalAmount: 18000.00,
      remainingBalance: 0.00,
      monthlyAmount: 3000.00,
      paidInstallments: 6,
      totalInstallments: 6,
      nextDue: 'N/A',
      status: 'COMPLETED'
    }
  ];
}
