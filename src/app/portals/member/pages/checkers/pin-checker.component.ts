import { inject, Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface PinDetails {
  pin: string;
  taxpayerName: string;
  pinStatus: string;
  iTaxStatus: string;
  obligations: { name: string; status: string }[];
}

@Component({
  selector: 'app-pin-checker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page-container animate-fade-in">
      
      <header class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                REGISTRY VALIDATION
              </span>
            </div>
            <h1 class="premium-title">PIN <span class="gradient-text">Intelligence</span></h1>
            <p class="premium-subtitle">Authorized gateway for taxpayer registry verification and compliance monitoring</p>
          </div>
        </div>
      </header>

      <div class="max-w-3xl mx-auto">
        <!-- Search Identity Box -->
        <div class="glass-panel p-8 md:p-12 mb-10 relative overflow-hidden group">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-700"></div>
          
          <div class="relative z-10">
            <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Target Identity Registry
            </h3>
            
            <div class="flex flex-col md:flex-row gap-4">
              <div class="relative flex-1">
                <input 
                  type="text" 
                  [(ngModel)]="pin" 
                  class="w-full bg-slate-900/50 border border-white/10 text-white text-xl font-bold rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 focus:bg-slate-900 transition-all placeholder-slate-600 tracking-widest uppercase" 
                  placeholder="A001234567X"
                  maxlength="11"
                />
              </div>
              <button 
                class="modern-btn primary-btn py-4 px-10 shadow-lg shadow-blue-500/20 whitespace-nowrap" 
                [disabled]="!pin() || isLoading()" 
                (click)="checkPin()"
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
            <p class="text-xs text-slate-500 mt-4 font-medium tracking-wide">Enter the KRA PIN as it appears on the official registration certificate.</p>
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
                <span class="status-pill-elite active" [class.overdue]="result()?.pinStatus !== 'Active'">
                  <span class="dot"></span>
                  {{ result()?.pinStatus }}
                </span>
              </div>
              
              <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{{ result()?.pin }}</p>
              <h2 class="text-3xl md:text-4xl font-black text-white tracking-tighter mb-8 leading-tight">{{ result()?.taxpayerName }}</h2>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Electronic Status</span>
                  <span class="text-white font-black">{{ result()?.iTaxStatus }}</span>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Validation Mode</span>
                  <span class="text-white font-black">REAL-TIME</span>
                </div>
              </div>
            </div>

            <div class="p-8 md:p-12">
              <h4 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span class="w-8 h-px bg-white/10"></span>
                Tax Obligations Registry
              </h4>
              
              <div class="space-y-4">
                @for (ob of result()?.obligations; track ob.name) {
                  <div class="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      </div>
                      <span class="text-sm font-black text-white tracking-tight">{{ ob.name }}</span>
                    </div>
                    <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest" [class.bg-red-500/10]="ob.status !== 'Active'" [class.text-red-400]="ob.status !== 'Active'">
                      {{ ob.status }}
                    </span>
                  </div>
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
export class PinCheckerComponent {
  private http = inject(HttpClient);
  
  pin = signal('');
  isLoading = signal(false);
  result = signal<PinDetails | null>(null);
  error = signal('');

  checkPin() {
    if (this.pin().length < 11) {
      this.error.set('AUTHENTICATION FAILED: PIN must be exactly 11 characters.');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');
    this.result.set(null);

    // Simulated API latency for elite feel
    setTimeout(() => {
      this.isLoading.set(false);
      this.result.set({
        pin: this.pin().toUpperCase(),
        taxpayerName: 'DOE JOHN ANTHONY',
        pinStatus: 'Active',
        iTaxStatus: 'Registered',
        obligations: [
          { name: 'Income Tax - Resident Individual', status: 'Active' },
          { name: 'Value Added Tax (VAT)', status: 'Active' },
          { name: 'Pay As You Earn (PAYE)', status: 'Inactive' }
        ]
      });
    }, 1200);
  }
}
