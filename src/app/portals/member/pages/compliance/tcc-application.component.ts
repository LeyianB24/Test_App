import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tcc-application',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <!-- Elite Page Header -->
      <header class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="header-titles-complex">
             <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                COMPLIANCE TERMINAL
              </span>
            </div>
            <h1 class="premium-title">Tax Compliance <span class="gradient-text">Registry</span></h1>
            <p class="premium-subtitle">Authentication gateway for certificate applications and real-time standing verification</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="status-pill-elite active !bg-emerald-500/20 !text-emerald-400 !border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <span class="dot !bg-emerald-400"></span>
              REGISTERED COMPLIANT
            </span>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Application Card -->
        <div class="glass-panel p-10 flex flex-col items-center text-center relative overflow-hidden group">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-700"></div>
          
          <div class="relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center mb-8 bg-blue-500/10 border border-blue-500/20 transition-transform group-hover:scale-110 shadow-xl shadow-blue-500/5">
             <svg class="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>

          <h2 class="text-2xl font-black mb-4 uppercase tracking-tighter text-white">Apply for TCC</h2>
          <p class="text-sm leading-relaxed mb-10 max-w-sm mx-auto text-slate-400 font-medium">
            Initiate a new request for a Tax Compliance Certificate. Our autonomous verification engine will review your historical filings and ledgers.
          </p>

          <button class="modern-btn primary-btn w-full justify-center shadow-lg shadow-blue-500/20 elite-glow" (click)="apply()">
            Begin Authorization Flow
          </button>
        </div>

        <!-- Certificate Status Card -->
        <div class="glass-panel p-10 flex flex-col relative overflow-hidden">
          <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl opacity-50"></div>

          <h3 class="text-xs font-black mb-8 flex items-center uppercase tracking-widest text-slate-500">
             <svg class="w-5 h-5 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             Active Credentials
          </h3>
          
          @if (certificates.length > 0) {
            <div class="space-y-4 relative z-10">
              @for (cert of certificates; track cert.id) {
                <div class="p-6 rounded-2xl border bg-white/[0.02] border-white/5 hover:border-blue-500/30 transition-all group">
                   <div class="flex justify-between items-start mb-6">
                      <div>
                         <div class="font-black mb-1 text-white tracking-widest text-sm underline decoration-blue-500/30 underline-offset-4">{{ cert.number }}</div>
                         <div class="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">Issued • {{ cert.issuedDate | date:'dd MMM yyyy' }}</div>
                      </div>
                      <span class="status-pill-elite active !text-[9px]">VALID</span>
                   </div>
                   <div class="flex justify-between items-center">
                      <span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Expires: <strong class="text-emerald-400 font-black">{{ cert.expiryDate | date:'dd MMM yyyy' }}</strong></span>
                      <button class="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest flex items-center gap-2">
                        Retrive PDF
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      </button>
                   </div>
                </div>
              }
            </div>
          } @else {
            <div class="flex-grow flex flex-col items-center justify-center text-slate-600 py-10">
               <svg class="w-16 h-16 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
               <p class="font-black uppercase tracking-[0.2em] text-[10px]">Registry Empty</p>
            </div>
          }
        </div>
      </div>

      <!-- Compliance Checklist -->
      <section class="mt-14">
         <h2 class="text-xs font-black mb-8 uppercase tracking-[0.3em] text-slate-500 flex items-center gap-4">
            <span class="w-8 h-px bg-white/10"></span>
            Telemetric Compliance Checklist
         </h2>
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (item of checklist; track item.label) {
              <div class="glass-panel flex items-center p-6 border-white/5 hover:border-white/10 transition-all">
                 <div class="w-12 h-12 rounded-2xl flex items-center justify-center mr-5 shrink-0" 
                   [class]="item.ok ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'">
                    @if (item.ok) {
                       <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                    } @else {
                       <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    }
                 </div>
                 <div>
                    <div class="text-xs font-black text-white tracking-tight uppercase mb-1">{{ item.label }}</div>
                    <div class="text-[9px] uppercase tracking-widest font-black" [class.text-emerald-500]="item.ok" [class.text-amber-500]="!item.ok">
                      {{ item.ok ? 'System Verified' : 'Attention Required' }}
                    </div>
                 </div>
              </div>
            }
         </div>
      </section>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  apply() {
    console.log('Initiating TCC application...');
  }
}
