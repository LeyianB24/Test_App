import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
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
    <div class="page-container p-8 animate-fade-in">
      <header class="mb-12">
        <h1 class="text-5xl font-black text-white tracking-tighter mb-2">PRN <span class="text-amber-500">Inquiry</span></h1>
        <p class="text-slate-400 font-medium text-lg">Cross-reference Payment Registration Numbers with financial ledgers</p>
      </header>

      <div class="max-w-3xl mx-auto">
        <div class="card-glass p-10 rounded-[3rem] border border-white/5 shadow-2xl mb-12">
          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Payment Identifier (PRN)</label>
              <div class="flex gap-4">
                <input 
                  type="text" 
                  [(ngModel)]="prn" 
                  class="flex-1 bg-white/5 border border-white/10 text-white px-8 py-5 rounded-3xl focus:border-amber-500 outline-none font-black text-xl tracking-[0.1em] uppercase placeholder:text-slate-600 transition-all" 
                  placeholder="202512345678"
                />
                <button 
                  class="bg-amber-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-amber-700 disabled:bg-slate-800 transition-all shadow-xl shadow-amber-600/20" 
                  [disabled]="!prn() || isLoading()" 
                  (click)="checkPrn()"
                >
                  @if (isLoading()) {
                    <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  } @else {
                    Query
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        @if (result()) {
          <div class="card-glass p-10 rounded-[4rem] border border-white/5 animate-fade-in relative overflow-hidden">
             <div class="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[120px] -mr-40 -mt-40"></div>
             
             <div class="text-center space-y-6 mb-12">
                <div class="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                   {{ result()?.paymentStatus }} Signal
                </div>
                <h3 class="text-6xl font-black text-white tracking-tighter tabular-nums">
                   <span class="text-2xl text-slate-500 mr-2">KES</span>{{ (result()?.amount || 0).toLocaleString() }}
                </h3>
                <p class="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em]">PRN BATCH: <span class="text-white font-mono ml-2">{{ result()?.prn }}</span></p>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                <div class="detail-panel">
                   <span class="detail-label">Taxpayer / Entity</span>
                   <span class="detail-value">{{ result()?.taxpayerName }}</span>
                </div>
                <div class="detail-panel">
                   <span class="detail-label">Verification PIN</span>
                   <span class="detail-value font-mono">{{ result()?.pin }}</span>
                </div>
                <div class="detail-panel">
                   <span class="detail-label">Obligation Directive</span>
                   <span class="detail-value">{{ result()?.taxObligation }}</span>
                </div>
                <div class="detail-panel">
                   <span class="detail-label">Temporal Period</span>
                   <span class="detail-value">{{ result()?.taxPeriod }}</span>
                </div>
                <div class="detail-panel lg:col-span-2 bg-amber-500/5 !border-amber-500/10">
                   <span class="detail-label text-amber-600">Expiration Threshold</span>
                   <span class="detail-value text-amber-500 font-black">{{ result()?.expiryDate | date:'dd MMM yyyy' }} (End of Cycle)</span>
                </div>
             </div>

             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button class="bg-white/5 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                   <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2.5"/></svg>
                   Secure Retrieval (E-slip)
                </button>
                @if (result()?.paymentStatus === 'Pending') {
                   <button class="bg-amber-600 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-3">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/></svg>
                      Execute Payment (M-PESA)
                   </button>
                }
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

    .detail-panel { padding: 1.5rem 2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 1.5rem; display: flex; flex-direction: column; gap: 0.25rem; }
    .detail-label { font-size: 0.6rem; font-weight: 950; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; }
    .detail-value { font-size: 0.9rem; font-weight: 700; color: white; }
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
