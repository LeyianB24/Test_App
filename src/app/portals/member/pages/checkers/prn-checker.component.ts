import { inject, Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface PrnDetails {
  prn: string;
  pin: string;
  taxpayerName: string;
  amount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Expired';
  expiryDate: string;
  taxObligation: string;
  taxPeriod: string;
}

@Component({
  selector: 'app-prn-checker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-fade-in">
      
      <header class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                PAYMENT REGISTRY
              </span>
            </div>
            <h1 class="premium-title">PRN <span class="gradient-text">Intelligence</span></h1>
            <p class="premium-subtitle">Authentication terminal for Payment Registration Numbers and historical financial ledgers</p>
          </div>
        </div>
      </header>

      <div class="max-w-3xl mx-auto">
        <!-- Search identity Box -->
        <div class="glass-panel p-8 md:p-12 mb-10 relative overflow-hidden group">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors duration-700"></div>
          
          <div class="relative z-10">
            <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Payment Identity Registry
            </h3>
            
            <div class="flex flex-col md:flex-row gap-4">
              <div class="relative flex-1">
                <input 
                  type="text" 
                  [(ngModel)]="prn" 
                  class="w-full bg-slate-900/50 border border-white/10 text-white text-xl font-bold rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 focus:bg-slate-900 transition-all placeholder-slate-600 tracking-widest" 
                  placeholder="202512345678"
                  maxlength="20"
                />
              </div>
              <button 
                class="modern-btn primary-btn py-4 px-10 shadow-lg shadow-amber-500/20 whitespace-nowrap !bg-amber-600 !border-amber-500 hover:!bg-amber-500" 
                [disabled]="!prn() || isLoading()" 
                (click)="checkPrn()"
              >
                @if (isLoading()) {
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  VALIDATING...
                } @else {
                  Execute Inquiry
                }
              </button>
            </div>
            <p class="text-xs text-slate-500 mt-4 font-medium tracking-wide">Enter the 12-digit Payment Registration Number provided during return filing.</p>
          </div>
        </div>

        @if (error()) {
          <div class="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-4 animate-up mb-10">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span class="text-sm font-bold tracking-tight uppercase">{{ error() }}</span>
          </div>
        }

        @if (result()) {
          <div class="glass-panel p-0 overflow-hidden animate-up">
            <div class="p-8 md:p-12 border-b border-white/5 bg-white/[0.02] relative">
              <div class="absolute top-0 right-0 p-8">
                <span class="status-pill-elite active" [class.success]="result()?.paymentStatus === 'Paid'" [class.overdue]="result()?.paymentStatus === 'Expired'">
                  <span class="dot"></span>
                  {{ result()?.paymentStatus }}
                </span>
              </div>
              
              <p class="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">{{ result()?.prn }}</p>
              <div class="flex items-baseline gap-2 mb-8">
                <span class="text-sm font-black text-slate-500">KES</span>
                <h2 class="text-4xl md:text-5xl font-black text-white tracking-tighter tabular-nums">{{ (result()?.amount || 0).toLocaleString() }}</h2>
              </div>
              
              <div class="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-400">
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <span class="uppercase tracking-widest opacity-50">{{ result()?.taxpayerName }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <span class="text-white">{{ result()?.pin }}</span>
                </div>
              </div>
            </div>

            <div class="p-8 md:p-12">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Obligation Directive</span>
                  <span class="text-sm font-black text-white leading-tight">{{ result()?.taxObligation }}</span>
                </div>
                <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Temporal Period</span>
                  <span class="text-sm font-black text-white">{{ result()?.taxPeriod }}</span>
                </div>
                <div class="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 col-span-2 flex items-center justify-between">
                  <div>
                    <span class="text-[10px] font-black text-red-500/50 uppercase tracking-widest block mb-1">Expiration Threshold</span>
                    <span class="text-lg font-black text-red-400">{{ result()?.expiryDate | date:'dd MMMM yyyy' }}</span>
                  </div>
                  <span class="text-[10px] font-black text-red-500/30 uppercase tracking-widest">End of Cycle</span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button class="modern-btn outline-btn py-4 flex items-center justify-center gap-3">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download Slip
                 </button>
                 @if (result()?.paymentStatus === 'Pending') {
                    <button class="modern-btn primary-btn py-4 flex items-center justify-center gap-3 elite-glow">
                       <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       Authorize Settlement
                    </button>
                 }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class PrnCheckerComponent {
  private http = inject(HttpClient);
  
  prn = signal('');
  isLoading = signal(false);
  result = signal<PrnDetails | null>(null);
  error = signal('');

  checkPrn() {
    this.isLoading.set(true);
    this.error.set('');
    this.result.set(null);

    // Simulated latency for tactical feel
    setTimeout(() => {
      this.isLoading.set(false);
      if (this.prn().startsWith('2025')) {
        this.result.set({
          prn: this.prn(),
          pin: 'A012345678X',
          taxpayerName: 'DOE JOHN ANTHONY',
          amount: 45250,
          paymentStatus: 'Pending',
          expiryDate: '2025-06-30',
          taxObligation: 'Value Added Tax (VAT)',
          taxPeriod: 'May 2025'
        });
      } else {
        this.error.set('INQUIRY FAILED: RECORD NOT FOUND OR PRN VOIDED.');
      }
    }, 1300);
  }
}
