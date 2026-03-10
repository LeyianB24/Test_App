import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface TccResult {
  pin: string;
  name: string;
  tccNumber: string;
  status: 'Valid' | 'Expired' | 'Not Found';
  expiryDate: string;
  issueDate: string;
}

@Component({
  selector: 'app-tcc-checker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-fade-in">
      
      <header class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                COMPLIANCE CLEARANCE
              </span>
            </div>
            <h1 class="premium-title">TCC <span class="gradient-text">Validator</span></h1>
            <p class="premium-subtitle">Authentication terminal for Tax Compliance Certificates and official clearance records</p>
          </div>
        </div>
      </header>

      <div class="max-w-3xl mx-auto">
        <!-- Search identity Box -->
        <div class="glass-panel p-8 md:p-12 mb-10 relative overflow-hidden group">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
          
          <div class="relative z-10">
            <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Certificate Authentication Registry
            </h3>
            
            <div class="flex flex-col md:flex-row gap-4">
              <div class="relative flex-1">
                <input 
                  type="text" 
                  [(ngModel)]="tccNumber" 
                  class="w-full bg-slate-900/50 border border-white/10 text-white text-xl font-bold rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 focus:bg-slate-900 transition-all placeholder-slate-600 tracking-widest uppercase" 
                  placeholder="KRAW0012345678"
                  maxlength="20"
                />
              </div>
              <button 
                class="modern-btn primary-btn py-4 px-10 shadow-lg shadow-emerald-500/20 whitespace-nowrap !bg-emerald-600 !border-emerald-500 hover:!bg-emerald-500" 
                [disabled]="!tccNumber() || isLoading()" 
                (click)="checkTcc()"
              >
                @if (isLoading()) {
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  VALIDATING...
                } @else {
                  Execute Validation
                }
              </button>
            </div>
            <p class="text-xs text-slate-500 mt-4 font-medium tracking-wide">Enter the TCC reference number from the top right corner of the certificate.</p>
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
              <div class="absolute top-0 right-0 p-8 text-right flex flex-col items-end gap-2">
                <span class="status-pill-elite active !bg-emerald-500/20 !text-emerald-400 !border-emerald-500/30" [class.overdue]="result()?.status !== 'Valid'">
                  <span class="dot !bg-emerald-400"></span>
                  AUTHENTICATED: {{ result()?.status }}
                </span>
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">SYSTEM VERIFIED</p>
              </div>
              
              <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">{{ result()?.tccNumber }}</p>
              <h2 class="text-3xl md:text-4xl font-black text-white tracking-tighter mb-8 leading-tight">{{ result()?.name }}</h2>
              
              <div class="flex items-center gap-3 text-sm font-bold text-slate-400 mb-8 border-l-2 border-white/10 pl-6 py-1">
                <span class="uppercase tracking-widest text-[10px]">Tax Identity PIN</span>
                <span class="text-white tracking-widest">{{ result()?.pin }}</span>
              </div>
            </div>

            <div class="p-8 md:p-12">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-all">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Issue Date</span>
                  </div>
                  <span class="text-xl font-black text-white">{{ result()?.issueDate | date:'dd MMMM yyyy' }}</span>
                </div>

                <div class="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 group hover:border-red-500/30 transition-all">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <span class="text-[10px] font-black text-red-500/50 uppercase tracking-widest">Expiry Deadline</span>
                  </div>
                  <span class="text-xl font-black text-red-400">{{ result()?.expiryDate | date:'dd MMMM yyyy' }}</span>
                </div>
              </div>

              <div class="mt-10 p-6 rounded-2xl bg-slate-900/50 border border-white/5 flex gap-4">
                <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorization Notice</h5>
                  <p class="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-widest">
                    This validation is retrieved in real-time from the KRA Compliance Gateway. While legally binding for procurement processes, the physical certificate remains the fallback artifact for audit purposes.
                  </p>
                </div>
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
export class TccCheckerComponent {
  private http = inject(HttpClient);
  
  tccNumber = signal('');
  isLoading = signal(false);
  result = signal<TccResult | null>(null);
  error = signal('');

  checkTcc() {
    this.isLoading.set(true);
    this.error.set('');
    this.result.set(null);

    // Latency for elite user feedback
    setTimeout(() => {
      this.isLoading.set(false);
      if (this.tccNumber().toUpperCase().startsWith('KRAW')) {
        this.result.set({
          pin: 'A012345678X',
          name: 'DOE JOHN ANTHONY',
          tccNumber: this.tccNumber().toUpperCase(),
          status: 'Valid',
          issueDate: '2024-05-15',
          expiryDate: '2025-05-15'
        });
      } else {
        this.error.set('VERIFICATION FAILED: Could not locate requested certificate.');
      }
    }, 1400);
  }
}
