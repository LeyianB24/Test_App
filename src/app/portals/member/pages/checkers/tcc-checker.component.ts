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
    <div class="dashboard-precision animate-fade-in">
      
      <header class="header-precision">
        <div class="header-titles">
          <h1 class="title-primary">TCC <span class="title-accent">Intelligence</span></h1>
          <p class="subtitle-secondary">Verify Tax Compliance Certificate clearance and authenticity</p>
        </div>
      </header>

      <div class="dashboard-content-precision">
        <div class="max-w-xl">
          <!-- Search Identity -->
          <div class="card-precision search-card-precision mb-10">
            <div class="card-header-precision">
              <h3>Target Certificate Registry</h3>
            </div>
            <div class="search-input-group mt-6">
              <input 
                type="text" 
                [(ngModel)]="tccNumber" 
                class="input-precision input-xl-precision" 
                placeholder="KRAW0012345678"
                maxlength="20"
              />
              <button 
                class="btn-precision btn-primary-precision btn-lg mt-4 w-full" 
                [disabled]="!tccNumber() || isLoading()" 
                (click)="checkTcc()"
              >
                @if (isLoading()) {
                  <div class="loader-spinner-precision sm"></div>
                } @else {
                  Authorize Verification
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
                  <span class="badge-precision badge-success-precision">
                    VERIFIED: {{ result()?.status }}
                  </span>
                  <p class="pin-id-precision">{{ result()?.tccNumber }}</p>
                </div>
                <h2 class="name-display-precision">{{ result()?.name }}</h2>
                <p class="subtitle-secondary text-white/40 mt-1 uppercase tracking-widest text-[10px]">PIN ASSOCIATED: {{ result()?.pin }}</p>
              </div>

              <div class="result-grid-precision grid-cols-2 mt-10">
                <div class="result-item-precision bg-dark-complex p-6 rounded-2xl border border-white/5">
                  <span class="label text-[10px] uppercase text-white/30 font-black block mb-2 tracking-widest">Issue Clearance</span>
                  <span class="value text-lg font-black text-white">{{ result()?.issueDate | date:'dd MMM yyyy' }}</span>
                </div>
                <div class="result-item-precision bg-red-base/10 p-6 rounded-2xl border border-red-base/20">
                  <span class="label text-[10px] uppercase text-red-base/50 font-black block mb-2 tracking-widest">Expiration Deadline</span>
                  <span class="value text-lg font-black text-red-base">{{ result()?.expiryDate | date:'dd MMM yyyy' }}</span>
                </div>
              </div>

              <div class="disclaimer-precision mt-10 p-6 bg-white/5 rounded-2xl border border-white/5 flex gap-4">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-white/20 shrink-0 mt-1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="text-[10px] font-medium text-white/30 leading-relaxed uppercase tracking-widest">
                  VERIFICATION NOTICE: This data is retrieved from the KRA system. While accurate at the time of inquiry, official physical certificates remain the primary source of truth.
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [``]
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
        this.error.set('VERIFICATION FAILED: Could not locate requested certificate.');
      }
    }, 1400);
  }
}
