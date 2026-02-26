import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tcc-application',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tcc-container p-6 animate-fade-in">
      <header class="mb-10 flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Tax Compliance Certificate (TCC)</h1>
          <p class="text-slate-400">Apply for or renew your TCC to certify your tax compliance status.</p>
        </div>
        <div class="status-indicator-card p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
           <div class="text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-widest">Current Status</div>
           <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-emerald-500 mr-2 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span class="text-emerald-400 font-bold">COMPLIANT</span>
           </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Application Card -->
        <div class="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
             <svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>

          <h2 class="text-2xl font-bold text-white mb-4">Apply for New TCC</h2>
          <p class="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Submit a new application for a Tax Compliance Certificate. KRA will review your filing and payment history across all obligations.
          </p>

          <button class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95" (click)="apply()">
            Begin Application Flow
          </button>
        </div>

        <!-- Certificate Status Card -->
        <div class="glass-card p-10 flex flex-col">
          <h3 class="text-xl font-bold text-white mb-8 flex items-center">
             <svg class="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             My Active Certificates
          </h3>
          
          @if (certificates.length > 0) {
            <div class="space-y-4">
              @for (cert of certificates; track cert.id) {
                <div class="certificate-row p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/70 transition-colors">
                   <div class="flex justify-between items-start mb-4">
                      <div>
                         <div class="text-white font-bold mb-1">{{ cert.number }}</div>
                         <div class="text-[10px] text-slate-500 font-mono">Issued on: {{ cert.issuedDate }}</div>
                      </div>
                      <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20">VALID</span>
                   </div>
                   <div class="flex justify-between items-center text-xs">
                      <span class="text-slate-400">Expires: <strong class="text-slate-200">{{ cert.expiryDate }}</strong></span>
                      <button class="text-blue-400 font-bold hover:underline">Download PDF</button>
                   </div>
                </div>
              }
            </div>
          } @else {
            <div class="flex-grow flex flex-col items-center justify-center text-slate-500 py-10">
               <svg class="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
               <p>No active certificates found.</p>
            </div>
          }
        </div>
      </div>

      <!-- Compliance Checklist -->
      <section class="mt-12">
         <h2 class="text-2xl font-bold text-white mb-6">Compliance Checklist</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (item of checklist; track item.label) {
              <div class="glass-card p-6 flex items-center">
                 <div class="w-10 h-10 rounded-full flex items-center justify-center mr-4" [class.bg-emerald-500/10]="item.ok" [class.bg-amber-500/10]="!item.ok">
                    @if (item.ok) {
                       <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    } @else {
                       <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    }
                 </div>
                 <div>
                    <div class="text-white text-sm font-bold">{{ item.label }}</div>
                    <div class="text-[10px] text-slate-500 uppercase tracking-tighter">{{ item.ok ? 'All Clear' : 'Attention Required' }}</div>
                 </div>
              </div>
            }
         </div>
      </section>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
    }
  `],
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
