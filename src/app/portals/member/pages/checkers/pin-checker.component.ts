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
    <div class="dashboard-precision animate-fade-in">
      
      <header class="header-precision">
        <div class="header-titles">
          <h1 class="title-primary">PIN <span class="title-accent">Intelligence</span></h1>
          <p class="subtitle-secondary">Verify taxpayer registry and compliance status</p>
        </div>
      </header>

      <div class="dashboard-content-precision">
        <div class="max-w-xl">
          <!-- Search Identity -->
          <div class="card-precision search-card-precision mb-10">
            <div class="card-header-precision">
              <h3>Target Identity Registry</h3>
            </div>
            <div class="search-input-group mt-6">
              <input 
                type="text" 
                [(ngModel)]="pin" 
                class="input-precision input-xl-precision" 
                placeholder="A001234567X"
                maxlength="11"
              />
              <button 
                class="btn-precision btn-primary-precision btn-lg mt-4 w-full" 
                [disabled]="!pin() || isLoading()" 
                (click)="checkPin()"
              >
                @if (isLoading()) {
                  <div class="loader-spinner-precision sm"></div>
                } @else {
                  Execute Validation
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
                  <span class="badge-precision" [class]="result()?.pinStatus === 'Active' ? 'badge-success-precision' : 'badge-danger-precision'">
                    {{ result()?.pinStatus }}
                  </span>
                  <p class="pin-id-precision">{{ result()?.pin }}</p>
                </div>
                <h2 class="name-display-precision">{{ result()?.taxpayerName }}</h2>
              </div>

              <div class="result-grid-precision mt-10">
                <div class="result-item-precision bg-dark-complex">
                  <span class="label">iTax Status</span>
                  <span class="value">{{ result()?.iTaxStatus }}</span>
                </div>
                <div class="result-item-precision bg-dark-complex">
                  <span class="label">Last Validated</span>
                  <span class="value">Instant Access</span>
                </div>
              </div>

              <div class="obligations-section-precision mt-10 border-t border-white/5 pt-10">
                <h4 class="section-title-precision">Tax Obligations Registry</h4>
                <div class="obligations-stack-precision mt-6">
                  @for (ob of result()?.obligations; track ob.name) {
                    <div class="obligation-tile-precision group">
                      <div class="ob-info">
                        <span class="ob-name">{{ ob.name }}</span>
                      </div>
                      <div class="ob-status">
                        <span class="status-tag" [class.status-active]="ob.status === 'Active'">{{ ob.status }}</span>
                        <div class="status-dot" [class.active]="ob.status === 'Active'"></div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [``]
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
