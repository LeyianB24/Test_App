import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tcc-application',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              COMPLIANCE VERIFICATION HUB
            </span>
          </div>
          <h1 class="premium-title">Tax Compliance <span class="gradient-text">Registry</span></h1>
          <p class="premium-subtitle">Authorized gateway for TCC applications and real-time statutory standing verification</p>
        </div>
        
        <div class="flex items-center gap-4">
          <span class="status-pill-elite active !bg-emerald-500/10 !text-emerald-400 !border-emerald-500/20 shadow-xl shadow-emerald-500/5">
            <span class="dot !bg-emerald-400"></span>
            TAXPAYER COMPLIANT
          </span>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Authorized Application Module -->
        <div class="glass-panel p-12 flex flex-col items-center text-center relative overflow-hidden group bg-white/[0.01] border-white/5 transition-all hover:border-blue-500/30">
          <div class="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] group-hover:bg-blue-500/10 transition-all"></div>
          
          <div class="relative z-10 w-24 h-24 rounded-[2rem] bg-slate-950 border border-white/5 flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 transition-transform duration-500 text-blue-400">
             <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>

          <h2 class="text-3xl font-black text-white mb-4 tracking-tighter uppercase relative z-10">Initialize TCC Protocol</h2>
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-12 max-w-sm mx-auto opacity-70 relative z-10">
            Execute a statutory request for a Tax Compliance Certificate. Our autonomous clearing engine will itemize all historical ledgers.
          </p>

          <button class="modern-btn primary-btn w-full py-5 bg-blue-600 border-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 elite-glow !rounded-2xl relative z-10" (click)="apply()">
            BEGIN AUTHORIZATION FLOW
          </button>
        </div>

        <!-- Active Credential Ledger -->
        <div class="glass-panel p-10 flex flex-col relative overflow-hidden bg-white/[0.01] border-white/5">
          <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]"></div>

          <h3 class="text-[9px] font-black mb-10 flex items-center uppercase tracking-[0.3em] text-slate-600 relative z-10">
             <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 text-emerald-400">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             Active Fiscal Credentials
          </h3>
          
          @if (certificates.length > 0) {
            <div class="space-y-6 relative z-10">
              @for (cert of certificates; track cert.id) {
                <div class="p-8 rounded-[2rem] border bg-slate-950/40 border-white/5 hover:border-blue-500/30 transition-all group shadow-2xl animate-up">
                   <div class="flex justify-between items-start mb-8">
                      <div>
                         <div class="font-black mb-2 text-white tracking-[0.2em] text-sm font-mono group-hover:text-blue-400 transition-colors">{{ cert.number }}</div>
                         <div class="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                           <span class="w-1.5 h-1.5 rounded-full bg-blue-500/40"></span>
                           Issued • {{ cert.issuedDate | date:'dd MMM yyyy' | uppercase }}
                        </div>
                      </div>
                      <span class="status-pill-elite active !text-[8px] !bg-blue-500/20 !text-blue-400 !border-blue-500/30">VALID PROTOCOL</span>
                   </div>
                   <div class="flex justify-between items-center pt-6 border-t border-white/[0.02]">
                      <span class="text-[9px] font-black uppercase tracking-widest text-slate-600">Statutory Expiry: <strong class="text-emerald-500 ml-2 tracking-tighter">{{ cert.expiryDate | date:'dd MMM yyyy' | uppercase }}</strong></span>
                      <button class="text-[9px] font-black text-blue-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-3">
                        RETRIEVE ARCHIVE
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      </button>
                   </div>
                </div>
              }
            </div>
          } @else {
            <div class="flex-grow flex flex-col items-center justify-center text-slate-800 py-20 relative z-10">
               <svg class="w-16 h-16 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
               <p class="font-black uppercase tracking-[0.4em] text-[10px] opacity-40">Registry Null</p>
            </div>
          }
        </div>
      </div>

      <!-- Compliance Telemetry -->
      <section class="mt-16">
         <h2 class="text-[9px] font-black mb-10 uppercase tracking-[0.4em] text-slate-600 flex items-center gap-6">
            <span class="w-12 h-px bg-white/5"></span>
            Statutory Compliance Telemetry
         </h2>
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (item of checklist; track item.label) {
              <div class="glass-panel flex items-center p-8 bg-white/[0.01] border-white/5 hover:border-white/10 transition-all !rounded-[2rem] animate-up shadow-xl">
                 <div class="w-12 h-12 rounded-2xl flex items-center justify-center mr-6 shrink-0 shadow-2xl" 
                   [class]="item.ok ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'">
                    @if (item.ok) {
                       <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7" /></svg>
                    } @else {
                       <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4" /></svg>
                    }
                 </div>
                 <div class="flex flex-col gap-1">
                    <div class="text-[10px] font-black text-white tracking-widest uppercase">{{ item.label }}</div>
                    <div class="text-[8px] uppercase tracking-[0.2em] font-black" [class.text-emerald-500]="item.ok" [class.text-red-500]="!item.ok">
                      {{ item.ok ? 'ARCHIVE VERIFIED' : 'ACTION REQUIRED' }}
                    </div>
                 </div>
              </div>
            }
         </div>
      </section>
      
      <!-- Theme Adherence Footer -->
      <footer class="mt-24 p-12 glass-panel border-white/5 bg-white/[0.01] text-center !rounded-[3.5rem] relative overflow-hidden">
         <div class="absolute -left-24 -bottom-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
         <p class="text-[10px] text-slate-700 font-bold uppercase tracking-[0.5em] leading-relaxed max-w-5xl mx-auto relative z-10">
            OFFICIAL TAXPAYER COMPLIANCE HUB • AUTHORIZED BY KENYA REVENUE AUTHORITY • SYNCHRONIZED REAL-TIME
         </p>
      </footer>
    </div>
  `,
  styles: [``]
})
export class TccApplicationComponent {
  certificates = [
    {
      id: 1,
      number: 'KRA/TCC/2025/1102983',
      issuedDate: '2025-06-12',
      expiryDate: '2026-06-11'
    }
  ];

  checklist = [
    { label: 'Return Filing', ok: true },
    { label: 'Payment Status', ok: true },
    { label: 'PIN Data Update', ok: true },
    { label: 'Tax Obligations', ok: true }
  ];

  apply() { }
}
