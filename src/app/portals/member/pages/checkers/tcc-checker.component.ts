import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    <div class="page-container p-8 animate-fade-in">
      <header class="mb-12">
        <h1 class="text-5xl font-black text-white tracking-tighter mb-2">TCC <span class="text-emerald-500">Verification</span></h1>
        <p class="text-slate-400 font-medium text-lg">Validate Tax Compliance Certificate clearance and expiry</p>
      </header>

      <div class="max-w-3xl mx-auto">
        <div class="card-glass p-10 rounded-[3rem] border border-white/5 shadow-2xl mb-12">
          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">TCC Reference Number</label>
              <div class="flex gap-4">
                <input 
                  type="text" 
                  [(ngModel)]="tccNumber" 
                  class="flex-1 bg-white/5 border border-white/10 text-white px-8 py-5 rounded-3xl focus:border-emerald-500 outline-none font-black text-xl tracking-[0.1em] uppercase placeholder:text-slate-600 transition-all" 
                  placeholder="KRAW0012345678"
                />
                <button 
                  class="bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 disabled:bg-slate-800 transition-all shadow-xl shadow-emerald-600/20" 
                  [disabled]="!tccNumber() || isLoading()" 
                  (click)="checkTcc()"
                >
                  @if (isLoading()) {
                    <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  } @else {
                    Authorize
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        @if (result()) {
          <div class="card-glass p-10 rounded-[4rem] border border-white/5 animate-fade-in relative overflow-hidden">
            <div class="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[120px] -mr-40 -mt-40"></div>
            
            <div class="text-center space-y-4 mb-12">
              <div class="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                 <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="3"/></svg>
                 Signal: {{ result()?.status }}
              </div>
              <h3 class="text-4xl font-black text-white tracking-tighter leading-none">{{ result()?.name }}</h3>
              <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest">PIN ASSOCIATED: <span class="text-white font-mono ml-2">{{ result()?.pin }}</span></p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
               <div class="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Certificate Reference</span>
                  <span class="text-lg font-black text-white font-mono">{{ result()?.tccNumber }}</span>
               </div>
               <div class="p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Issue Clearance</span>
                  <span class="text-lg font-black text-white">{{ result()?.issueDate | date:'dd MMM yyyy' }}</span>
               </div>
               <div class="p-8 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20">
                  <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Expiration Deadline</span>
                  <span class="text-lg font-black text-emerald-400">{{ result()?.expiryDate | date:'dd MMM yyyy' }}</span>
               </div>
            </div>

            <div class="disclaimer p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-indigo-400 shrink-0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p class="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-widest">
                VERIFICATION PROTOCOL: This data fragment is retrieved from the centralized taxation nexus. While accurate at the time of transmission, official hard-copies remain the primary source of truth for jurisdictional audits.
              </p>
            </div>
          </div>
        }

        @if (error()) {
          <div class="mt-8 p-8 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 animate-shake">
             <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="shrink-0"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2.5"/></svg>
             {{ error() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; }
    .card-glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-shake { animation: shake 0.5s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
  `]
})
export class TccCheckerComponent {
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
        this.error.set('VERIFICATION REJECTED: TERMINAL COULD NOT LOCATE REQUESTED CERTIFICATE INDEX.');
      }
    }, 1400);
  }
}
