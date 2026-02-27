import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <header class="mb-12">
        <h1 class="text-5xl font-black text-white tracking-tighter mb-2">PIN <span class="text-blue-500">Validation</span></h1>
        <p class="text-slate-400 font-medium text-lg">Verify KRA PIN authenticity and operational directives</p>
      </header>

      <div class="max-w-3xl mx-auto">
        <div class="card-glass p-10 rounded-[3rem] border border-white/5 shadow-2xl mb-12">
          <div class="space-y-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Registry PIN Number</label>
              <div class="flex gap-4">
                <input 
                  type="text" 
                  [(ngModel)]="pin" 
                  class="flex-1 bg-white/5 border border-white/10 text-white px-8 py-5 rounded-3xl focus:border-blue-500 outline-none font-black text-xl tracking-[0.2em] uppercase placeholder:text-slate-600 transition-all" 
                  placeholder="A001234567X"
                  maxlength="11"
                />
                <button 
                  class="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:bg-slate-800 transition-all shadow-xl shadow-blue-600/20" 
                  [disabled]="!pin() || isLoading()" 
                  (click)="checkPin()"
                >
                  @if (isLoading()) {
                    <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  } @else {
                    Validate
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        @if (result()) {
          <div class="card-glass p-10 rounded-[3rem] border border-white/5 animate-fade-in relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32"></div>
            
            <div class="text-center space-y-4 mb-12">
              <span class="badge-elite" [class]="result()?.pinStatus === 'Active' ? 'badge-active' : 'badge-inactive'">
                {{ result()?.pinStatus }}
              </span>
              <h3 class="text-3xl font-black text-white tracking-tight leading-none">{{ result()?.taxpayerName }}</h3>
              <p class="text-blue-500 font-black text-lg tracking-[0.3em] font-mono">{{ result()?.pin }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <div class="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">iTax Registration</span>
                  <span class="text-sm font-bold text-white">{{ result()?.iTaxStatus }}</span>
               </div>
               <div class="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Status Classification</span>
                  <span class="text-sm font-bold text-white">Consolidated</span>
               </div>
            </div>

            <div class="space-y-4">
              <h4 class="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase ml-4">Tax Obligations Registry</h4>
              <div class="space-y-3">
                @for (ob of result()?.obligations; track ob.name) {
                  <div class="flex justify-between items-center p-6 bg-white/5 rounded-[1.5rem] border border-white/5 group hover:bg-white/10 transition-all">
                    <span class="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{{ ob.name }}</span>
                    <span class="text-[10px] font-black uppercase tracking-widest" [class]="ob.status === 'Active' ? 'text-emerald-500' : 'text-slate-600'">
                       {{ ob.status }}
                    </span>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        @if (error()) {
          <div class="mt-8 p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-bold flex items-center gap-3 animate-shake">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
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

    .badge-elite { display: inline-block; padding: 4px 12px; border-radius: 8px; font-size: 0.65rem; font-weight: 950; text-transform: uppercase; letter-spacing: 1px; }
    .badge-active { background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .badge-inactive { background: rgba(239, 68, 68, 0.1); color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.2); }
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
