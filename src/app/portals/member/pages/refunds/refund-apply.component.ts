import { inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-refund-apply',
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              CLAIM PROTOCOL
            </span>
          </div>
          <h1 class="premium-title">Refund <span class="gradient-text">Application</span></h1>
          <p class="premium-subtitle">Authorized gateway for tax overpayment claims and statutory credit recovery</p>
        </div>
        <button routerLink="/member/refunds" class="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
          Abort Claim
        </button>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="glass-panel p-10 relative overflow-hidden group">
          <div class="absolute -top-32 -left-32 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl group-hover:bg-emerald-600/10 transition-colors duration-1000"></div>

          <form [formGroup]="refundForm">
            <div class="space-y-10 relative z-10">
              
              <!-- Basics -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Tax Obligation Profile</label>
                    <select formControlName="obligation" class="form-select bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-emerald-500/50 transition-all">
                       <option value="" disabled>Select tax type...</option>
                       <option value="VAT">Value Added Tax (VAT)</option>
                       <option value="IncomeTax">Resident Income Tax</option>
                       <option value="Withholding">Withholding Tax</option>
                    </select>
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Quantified Claim (KES)</label>
                    <div class="relative">
                       <input type="number" formControlName="amount" class="form-input bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-emerald-500/50 transition-all pl-12" placeholder="0.00">
                       <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px]">KES</span>
                    </div>
                 </div>
              </div>

              <!-- Period -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Temporal Start</label>
                    <input type="month" formControlName="from_period" class="form-input bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-emerald-500/50 transition-all">
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Temporal End</label>
                    <input type="month" formControlName="to_period" class="form-input bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-emerald-500/50 transition-all">
                 </div>
              </div>

              <!-- Grounds -->
              <div class="form-group">
                 <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Justification Grounds</label>
                 <textarea formControlName="reason" rows="4" class="form-input bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-emerald-500/50 transition-all resize-none shadow-2xl" placeholder="Explain the origin of the overpayment protocol (e.g., duplicate liquidation, excess input tax archive)..."></textarea>
              </div>

              <!-- Disbursement Bank -->
              <div class="p-8 rounded-[1.5rem] bg-white/[0.01] border border-white/5 relative overflow-hidden group/bank">
                 <div class="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover/bank:opacity-100 transition-opacity"></div>
                 <div class="flex items-center justify-between mb-6 relative z-10">
                    <h4 class="text-white font-black text-[10px] uppercase tracking-[0.3em] opacity-60">Linked Disbursement Archive</h4>
                    <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black tracking-widest rounded-lg border border-emerald-500/20">VERIFIED STATUS</span>
                 </div>
                 <div class="flex items-center text-slate-300 relative z-10">
                    <div class="w-14 h-14 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center mr-6 shadow-2xl group-hover/bank:border-emerald-500/30 transition-all">
                       <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div>
                       <div class="font-black text-white tracking-tight uppercase">KCB BANK KENYA ARCHIVE</div>
                       <div class="text-[9px] uppercase font-black text-slate-600 tracking-widest mt-1">Archive ID: ••••••8821 • Nairobi HQ HUB</div>
                    </div>
                 </div>
                 <p class="text-[9px] text-slate-600 mt-6 font-black uppercase tracking-[0.2em] italic relative z-10">Statutory refunds are only disbursed to the verified archive linked to your digital identity profile.</p>
              </div>

              <!-- Action Footer -->
              <div class="pt-10 border-t border-white/5 flex flex-col md:flex-row gap-4 relative z-10">
                 <button type="submit" class="modern-btn primary-btn flex-1 py-4 shadow-xl shadow-emerald-500/20 elite-glow !rounded-2xl" [disabled]="!refundForm.valid">
                    Authorize Refund Protocol
                 </button>
                 <button routerLink="/member/refunds" class="px-10 py-4 bg-slate-900 border border-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:text-white transition-all">
                    Discard Claim
                 </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
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
