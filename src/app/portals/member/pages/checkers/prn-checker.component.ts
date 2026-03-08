import { inject } from '@angular/core';
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
    <div class="dashboard-precision animate-fade-in">
      
      <header class="header-precision">
        <div class="header-titles">
          <h1 class="title-primary">PRN <span class="title-accent">Intelligence</span></h1>
          <p class="subtitle-secondary">Cross-reference Payment Registration Numbers with financial ledgers</p>
        </div>
      </header>

      <div class="dashboard-content-precision">
        <div class="max-w-xl">
          <!-- Search Identity -->
          <div class="card-precision search-card-precision mb-10">
            <div class="card-header-precision">
              <h3>Target Payment Registry</h3>
            </div>
            <div class="search-input-group mt-6">
              <input 
                type="text" 
                [(ngModel)]="prn" 
                class="input-precision input-xl-precision" 
                placeholder="202512345678"
                maxlength="20"
              />
              <button 
                class="btn-precision btn-primary-precision btn-lg mt-4 w-full" 
                [disabled]="!prn() || isLoading()" 
                (click)="checkPrn()"
              >
                @if (isLoading()) {
                  <div class="loader-spinner-precision sm"></div>
                } @else {
                  Execute Inquiry
                }
              </button>
            </div>
          </div>

          @if (error()) {
            <div class="error-state-precision animate-shake mb-10">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>{{ error() }}</span>
            </div>
          }

          @if (result()) {
            <div class="card-precision result-card-precision animate-slide-up">
              <div class="result-identity-precision overflow-hidden">
                <div class="identity-header">
                  <span class="badge-precision" [class]="result()?.paymentStatus === 'Paid' ? 'badge-success-precision' : 'badge-warning-precision'">
                    SIGNAL: {{ result()?.paymentStatus }}
                  </span>
                  <p class="pin-id-precision">{{ result()?.prn }}</p>
                </div>
                <h2 class="name-display-precision tabular-nums">
                  <span class="currency-label text-white/40 text-sm mr-2">KES</span>{{ (result()?.amount || 0).toLocaleString() }}
                </h2>
                <p class="subtitle-secondary text-white/40 mt-1 uppercase tracking-widest text-[10px]">{{ result()?.taxpayerName }} | {{ result()?.pin }}</p>
              </div>

              <div class="result-grid-precision grid-cols-2 mt-10">
                <div class="result-item-precision bg-dark-complex p-6 rounded-2xl border border-white/5">
                  <span class="label text-[10px] uppercase text-white/30 font-black block mb-2 tracking-widest">Obligation Directive</span>
                  <span class="value text-sm font-bold text-white">{{ result()?.taxObligation }}</span>
                </div>
                <div class="result-item-precision bg-dark-complex p-6 rounded-2xl border border-white/5">
                  <span class="label text-[10px] uppercase text-white/30 font-black block mb-2 tracking-widest">Temporal Period</span>
                  <span class="value text-sm font-bold text-white">{{ result()?.taxPeriod }}</span>
                </div>
                <div class="result-item-precision bg-red-base/10 p-6 rounded-2xl border border-red-base/20 col-span-2">
                  <span class="label text-[10px] uppercase text-red-base/50 font-black block mb-2 tracking-widest">Expiration Threshold</span>
                  <span class="value text-lg font-black text-red-base">{{ result()?.expiryDate | date:'dd MMM yyyy' }} (End of Cycle)</span>
                </div>
              </div>

              <div class="action-grid-precision mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button class="btn-precision btn-secondary-precision w-full py-4 flex items-center justify-center gap-2">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2.5"/></svg>
                    Secure Retrieval
                 </button>
                 @if (result()?.paymentStatus === 'Pending') {
                    <button class="btn-precision btn-primary-precision w-full py-4 flex items-center justify-center gap-2">
                       <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/></svg>
                       Execute Settlement
                    </button>
                 }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [``]
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
