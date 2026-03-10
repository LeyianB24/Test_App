import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-income-tax-hub',
  imports: [RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
              ANNUAL FISCAL RECONCILIATION
            </span>
          </div>
          <h1 class="premium-title">Income Tax <span class="gradient-text">Filing</span></h1>
          <p class="premium-subtitle">Authorized gateway for elective annual tax declarations and statutory reconciliation</p>
        </div>
        <button routerLink="/member/returns" class="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
          Return to Hub
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- IT1: Individual -->
        <div class="glass-panel p-10 bg-gradient-to-br from-violet-600/5 to-transparent border-violet-500/20 hover:border-violet-500/40 transition-all group !rounded-[3rem] relative overflow-hidden flex flex-col items-start cursor-pointer">
          <div class="absolute -right-24 -top-24 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-1000"></div>
          
          <div class="flex justify-between items-start w-full mb-10 relative z-10">
            <div class="w-16 h-16 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-violet-400 shadow-2xl group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <span class="px-4 py-1.5 bg-violet-500/10 text-violet-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-violet-500/20">FORM IT1 PROTOCOL</span>
          </div>

          <h3 class="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Individual Income Archive</h3>
          <p class="text-[11px] text-slate-500 font-bold uppercase tracking-[0.1em] leading-relaxed mb-10 flex-grow opacity-80">
            Authorized for residents with employment liquidity, commercial ventures, or professional consultancy archives. Optimized for self-employed demographic profiles.
          </p>

          <button class="modern-btn primary-btn w-full py-5 bg-violet-600 border-violet-500 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-violet-600/20 elite-glow !rounded-2xl relative z-10">
            Execute IT1 Sequence
          </button>
        </div>

        <!-- IT2C: Company/Corporate -->
        <div class="glass-panel p-10 bg-gradient-to-br from-emerald-600/5 to-transparent border-emerald-500/20 hover:border-emerald-500/40 transition-all group !rounded-[3rem] relative overflow-hidden flex flex-col items-start cursor-pointer">
          <div class="absolute -right-24 -top-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000"></div>

          <div class="flex justify-between items-start w-full mb-10 relative z-10">
            <div class="w-16 h-16 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-emerald-400 shadow-2xl group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <span class="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/20">FORM IT2C PROTOCOL</span>
          </div>

          <h3 class="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Corporate Income Archive</h3>
          <p class="text-[11px] text-slate-500 font-bold uppercase tracking-[0.1em] leading-relaxed mb-10 flex-grow opacity-80">
            Designed for limited liability entities, cooperatives, trust archives, and social clubs. Filing derived from audited financial ledgers.
          </p>

          <button class="modern-btn w-full py-5 bg-slate-900 border-white/5 text-slate-500 hover:text-white hover:border-emerald-500/30 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl !rounded-2xl relative z-10 transition-all">
            Initiate Corporate Filing
          </button>
        </div>
      </div>

      <!-- Secondary Protocols -->
      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
         <div class="glass-panel p-8 flex items-center justify-between group cursor-pointer border-white/5 bg-white/[0.01] hover:border-blue-500/30 transition-all">
            <div class="flex items-center gap-6">
               <div class="w-14 h-14 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all shadow-2xl">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </div>
               <div>
                  <h4 class="text-white font-black text-sm uppercase tracking-tight group-hover:text-blue-400 transition-colors">Partnership Protocol (IT2P)</h4>
                  <p class="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">Joint liability sharing for enterprise partners.</p>
               </div>
            </div>
            <svg class="w-6 h-6 text-slate-800 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
         </div>

         <div class="glass-panel p-8 flex items-center justify-between group cursor-pointer border-white/5 bg-white/[0.01] hover:border-amber-500/30 transition-all">
            <div class="flex items-center gap-6">
               <div class="w-14 h-14 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-amber-400 group-hover:border-amber-500/20 transition-all shadow-2xl">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </div>
               <div>
                  <h4 class="text-white font-black text-sm uppercase tracking-tight group-hover:text-amber-400 transition-colors">Simplified Registry (IT2S)</h4>
                  <p class="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">For turnover below KES 1M statutory threshold.</p>
               </div>
            </div>
            <svg class="w-6 h-6 text-slate-800 group-hover:text-amber-500 group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
         </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeTaxHubComponent {}
