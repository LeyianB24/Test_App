import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-objection-list',
  imports: [RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              LEGAL CHANCERY
            </span>
          </div>
          <h1 class="premium-title">My <span class="gradient-text">Objections</span></h1>
          <p class="premium-subtitle">Authorized tracker for formal disputes and administrative appeals protocols</p>
        </div>
        <button routerLink="/member/objections/create" class="modern-btn primary-btn py-4 px-8 shadow-xl shadow-blue-500/20 elite-glow">
          File New Dispute
        </button>
      </header>

      <!-- Stats Grids -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        @for (stat of stats; track stat.label; let i = $index) {
          <div class="glass-panel p-6 border-white/5 hover:border-blue-500/20 transition-all group overflow-hidden relative">
             <div class="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
             <div class="flex items-center gap-4 relative z-10">
                <div class="w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-blue-400 shadow-2xl">
                   <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                   <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 block">{{ stat.label }}</span>
                   <h3 class="text-2xl font-black text-white tracking-tighter">{{ stat.value }}</h3>
                </div>
             </div>
          </div>
        }
      </div>

      <div class="glass-panel p-0 overflow-hidden relative">
        <div class="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
           <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Active Dispute Registry</h3>
        </div>

        <div class="grid grid-cols-1 divide-y divide-white/5">
          @for (item of objections; track item.id) {
            <div class="p-8 hover:bg-white/[0.02] transition-colors group relative overflow-hidden">
               <!-- Interactive Glow -->
               <div class="absolute -right-24 -bottom-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
               
               <div class="flex flex-wrap lg:flex-nowrap gap-8 items-center relative z-10">
                  <div class="flex-grow">
                     <div class="flex items-center gap-4 mb-3">
                        <span class="text-[9px] font-black text-blue-500/50 uppercase tracking-[0.3em] font-mono border border-blue-500/10 px-2 py-0.5 rounded-lg">{{ item.refNo }}</span>
                        <div class="w-1 h-1 rounded-full bg-slate-700"></div>
                        <span class="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">{{ item.obligation }}</span>
                     </div>
                     <h3 class="text-lg font-black text-white group-hover:text-blue-400 transition-colors mb-2 tracking-tight uppercase">{{ item.reason }}</h3>
                     <div class="flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <span>Ref Assessment: <strong class="text-slate-400">{{ item.assessmentNo }}</strong></span>
                        <div class="w-1 h-1 rounded-full bg-slate-800"></div>
                        <span>Protocol Date: <strong class="text-slate-400">{{ item.filedDate | date:'dd MMM yyyy' }}</strong></span>
                     </div>
                  </div>

                  <div class="flex flex-col items-end gap-6 min-w-[220px]">
                     <span class="status-pill-elite active" 
                        [class.warning]="item.status === 'PENDING DOCUMENTS'"
                        [class.success]="item.status === 'RESOLVED'">
                        <span class="dot"></span>
                        {{ item.status }}
                     </span>
                     <div class="flex gap-6">
                        <button class="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">Audit Archive</button>
                        <button class="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-2 group/btn">
                           Track Progress
                           <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover/btn:translate-x-0.5"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          } @empty {
            <div class="p-24 flex flex-col items-center justify-center text-center">
               <div class="w-20 h-20 rounded-full flex items-center justify-center mb-8 text-slate-700 border border-white/5 bg-slate-950 shadow-2xl">
                  <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
               </div>
               <h3 class="text-white font-black uppercase tracking-widest mb-2">No Dispute Records</h3>
               <p class="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-xs opacity-60">You have no active or historical objection protocols in the registry.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectionListComponent {
  objections = [
    {
      id: 1,
      refNo: 'OBJ-2026-001',
      obligation: 'Value Added Tax (VAT)',
      reason: 'Disputed Input Tax Deduction rejection',
      assessmentNo: 'AS-9921-XAO',
      filedDate: '2026-02-20',
      status: 'UNDER REVIEW'
    },
    {
      id: 2,
      refNo: 'OBJ-2025-042',
      obligation: 'Income Tax - Resident',
      reason: 'Incorrect calculation of professional fee relief',
      assessmentNo: 'AS-8812-JAI',
      filedDate: '2025-12-15',
      status: 'PENDING DOCUMENTS'
    }
  ];

  stats = [
    { label: 'Total Filed', value: '12' },
    { label: 'Under Review', value: '3' },
    { label: 'Awaiting Action', value: '1' },
    { label: 'Resolved (YTD)', value: '8' }
  ];
}
