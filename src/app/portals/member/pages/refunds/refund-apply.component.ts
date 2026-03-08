import { inject } from '@angular/core';
import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-refund-apply',
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div class="refund-apply-container p-6 animate-fade-in">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Apply for Tax Refund</h1>
          <p class="text-slate-400">Submit a claim for tax overpayment or withholding tax credits.</p>
        </div>
        <button routerLink="/member/refunds" class="text-slate-500 hover:text-white transition-colors">
          Cancel & Exit
        </button>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="glass-card p-10">
          <form [formGroup]="refundForm">
            <div class="space-y-8">
              
              <!-- Basics -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Tax Obligation</label>
                    <select formControlName="obligation" class="form-select">
                       <option value="" disabled>Select tax type...</option>
                       <option value="VAT">Value Added Tax (VAT)</option>
                       <option value="IncomeTax">Resident Income Tax</option>
                       <option value="Withholding">Withholding Tax</option>
                    </select>
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Claim Amount (KES)</label>
                    <input type="number" formControlName="amount" class="form-input" placeholder="0.00">
                 </div>
              </div>

              <!-- Period -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">From Period</label>
                    <input type="month" formControlName="from_period" class="form-input">
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">To Period</label>
                    <input type="month" formControlName="to_period" class="form-input">
                 </div>
              </div>

              <!-- Grounds -->
              <div class="form-group">
                 <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Reason for Claim</label>
                 <textarea formControlName="reason" rows="4" class="form-input resize-none" placeholder="Explain the origin of the overpayment (e.g., duplicate payment, excess input tax, withholding credits)..."></textarea>
              </div>

              <!-- Disbursement Bank -->
              <div class="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/20">
                 <div class="flex items-center justify-between mb-4">
                    <h4 class="text-white font-bold text-sm uppercase tracking-widest">Verified Bank Account</h4>
                    <span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">VERIFIED</span>
                 </div>
                 <div class="flex items-center text-slate-300">
                    <div class="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mr-4">
                       <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div>
                       <div class="font-bold">KCB BANK KENYA LTD</div>
                       <div class="text-[10px] uppercase font-bold text-slate-500 tracking-tighter">Acc No: ••••••8821 • UPPERHILL BRANCH</div>
                    </div>
                 </div>
                 <p class="text-[10px] text-slate-500 mt-4 italic">Refunds are only disbursed to the account linked to your iTax profile.</p>
              </div>

              <!-- Action Footer -->
              <div class="pt-10 border-t border-white/5 flex gap-4">
                 <button type="submit" class="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 transition-all hover:-translate-y-1" [disabled]="!refundForm.valid">
                    Submit Refund Claim
                 </button>
                 <button routerLink="/member/refunds" class="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-2xl transition-all">
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
      border-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefundApplyComponent {
  private fb = inject(FormBuilder);

  refundForm = this.fb.group({
    obligation: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(1)]],
    from_period: ['', Validators.required],
    to_period: ['', Validators.required],
    reason: ['', [Validators.required, Validators.minLength(10)]],
    declaration: [false, Validators.requiredTrue]
  });
}
