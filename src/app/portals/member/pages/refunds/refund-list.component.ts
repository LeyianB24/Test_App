import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-refund-list',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              TREASURY RECOVERY
            </span>
          </div>
          <h1 class="premium-title">Tax <span class="gradient-text">Refunds</span></h1>
          <p class="premium-subtitle">Authorized registry of overpayment claims, statutory credits, and liquidation disbursements</p>
        </div>
        <button routerLink="/member/refunds/apply" class="modern-btn primary-btn py-4 px-8 shadow-xl shadow-emerald-500/20 elite-glow">
          Initiate Refund Claim
        </button>
      </header>

      <div class="grid grid-cols-1 gap-8">
        @for (item of refunds; track item.id) {
          <div class="glass-panel p-0 overflow-hidden border-white/5 hover:border-emerald-500/30 transition-all group relative">
             <!-- Interactive Glow -->
             <div class="absolute -right-24 -bottom-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700"></div>

             <div class="flex flex-wrap lg:flex-nowrap gap-8 items-center p-8 relative z-10">
                <!-- Icon Signal -->
                <div class="w-20 h-20 rounded-[1.5rem] bg-slate-950 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 group-hover:bg-emerald-600/5 transition-all duration-500 shadow-2xl relative">
                   <div class="absolute inset-0 bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                   <svg class="w-8 h-8 text-emerald-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                </div>

                <div class="flex-grow">
                   <div class="flex items-center gap-4 mb-3">
                      <span class="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.3em] font-mono border border-emerald-500/10 px-2 py-0.5 rounded-lg">{{ item.refNo }}</span>
                      <div class="w-1 h-1 rounded-full bg-slate-700"></div>
                      <span class="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">{{ item.obligation }}</span>
                   </div>
                   <h3 class="text-xl font-black text-white group-hover:text-emerald-400 transition-colors mb-4 tracking-tight uppercase">Claim for Period: {{ item.period }}</h3>
                   
                   <div class="flex items-center gap-8">
                      <div>
                         <div class="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Claim Liquidity</div>
                         <div class="text-3xl font-black text-emerald-500 tracking-tighter tabular-nums flex items-baseline gap-2">
                            <span class="text-xs text-slate-600">KES</span>
                            {{ item.amount | number:'1.2-2' }}
                         </div>
                      </div>
                      <div class="h-10 w-px bg-white/5"></div>
                      <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-3 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                           <span>Application: <strong class="text-slate-400">{{ item.appliedDate | date:'dd MMM yyyy' }}</strong></span>
                        </div>
                        <div class="flex items-center gap-3 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                           <span>Est. Disbursement: <strong class="text-slate-400">{{ item.expectedDate }}</strong></span>
                        </div>
                      </div>
                   </div>
                </div>

                <div class="flex flex-col items-end gap-6 min-w-[240px]">
                   <span class="status-pill-elite active" [class.success]="item.status === 'DISBURSED'">
                     <span class="dot"></span>
                     {{ item.status }}
                   </span>
                   <div class="text-[9px] text-slate-500 font-bold uppercase tracking-[0.15em] text-right leading-relaxed max-w-[200px] opacity-70 group-hover:opacity-100 transition-opacity">
                      {{ item.statusNote }}
                   </div>
                   <button class="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest flex items-center gap-2 group/btn">
                      Full Audit Archive
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover/btn:translate-x-0.5"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                   </button>
                </div>
             </div>
          </div>
        } @empty {
          <div class="glass-panel py-32 text-center flex flex-col items-center border-white/5">
             <div class="w-20 h-20 bg-slate-950 border border-white/5 rounded-full flex items-center justify-center mb-8 text-slate-700 shadow-2xl">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h3 class="text-white font-black uppercase tracking-widest mb-2">Claim Registry Silent</h3>
             <p class="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-xs opacity-60">No active or historical refund claims detected in the audit log.</p>
          </div>
        }
      </div>

      <!-- Bank Details Hook -->
      <div class="mt-14 glass-panel p-10 bg-emerald-600/5 border-emerald-500/10 flex flex-col md:flex-row justify-between items-center gap-8 group overflow-hidden relative">
         <div class="absolute -left-12 -bottom-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
         
         <div class="flex items-center gap-8 relative z-10">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600/10 transition-all duration-500 shadow-2xl">
               <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <div>
               <h4 class="text-white font-black text-lg tracking-tighter uppercase group-hover:text-emerald-400 transition-colors">Disbursement Protocol</h4>
               <p class="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">KCB BANK ARCHIVE •••• 8821</p>
            </div>
         </div>
         <button class="modern-btn border-white/10 text-slate-400 px-8 py-4 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-xl font-black text-[10px] uppercase tracking-widest relative z-10">Reconfigure Account</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefundListComponent {
  refunds = [
    {
      id: 1,
      refNo: 'REF-88721-P01',
      obligation: 'Value Added Tax (VAT)',
      period: 'August - October 2025',
      amount: 45800.00,
      appliedDate: '2025-11-15',
      expectedDate: '2026-03-30',
      status: 'VERIFICATION STAGE',
      statusNote: 'Awaiting inspector approval of secondary purchase invoices.'
    },
    {
      id: 2,
      refNo: 'REF-99120-Q12',
      obligation: 'Income Tax - Resident',
      period: 'Year 2024',
      amount: 12450.00,
      appliedDate: '2025-06-20',
      expectedDate: 'PAID',
      status: 'DISBURSED',
      statusNote: 'Statutory liquidation to linked bank archive confirmed on 2025-08-12.'
    }
  ];
}
