import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-installment-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="installment-apply-container p-6 animate-fade-in">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Apply for Payment Plan</h1>
          <p class="text-slate-400">Propose a monthly repayment schedule for your outstanding tax debt.</p>
        </div>
        <button routerLink="/member/installments" class="text-slate-500 hover:text-white transition-colors">
          Cancel & Exit
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
                       <span class="text-violet-400 font-mono">- 45,000.00 KES</span>
                    </div>
                    <div class="flex justify-between text-slate-200 font-bold border-t border-white/5 pt-4">
                       <span class="uppercase text-xs">Monthly Installment Amount</span>
                       <span class="text-xl font-mono">33,750.00 KES / month</span>
                    </div>
                    <div class="text-[10px] text-slate-500 mt-2 italic text-center">
                       * Includes 1% statutory interest per month on declining balance.
                    </div>
                 </div>
              </div>

              <!-- Action Footer -->
              <div class="pt-10 border-t border-white/5 flex gap-4">
                 <button type="submit" class="flex-1 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/20 transition-all hover:-translate-y-1" [disabled]="!installmentForm.valid">
                    Submit Installment Proposal
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallmentApplyComponent {
  private fb = inject(FormBuilder);

  installmentForm = this.fb.group({
    obligation_id: ['', Validators.required],
    down_payment: [null, [Validators.required, Validators.min(0)]],
    duration_months: [12, Validators.required],
    payment_day: [5, Validators.required],
    declaration: [false, Validators.requiredTrue]
  });
}
