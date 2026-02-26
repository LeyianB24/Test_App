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
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="checker-container p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">PIN Checker</h1>
        <p class="text-slate-500 mt-1">Verify KRA PIN validity and active tax obligations</p>
      </header>

      <div class="max-w-2xl mx-auto">
        <div class="card p-8 mb-8">
          <div class="flex flex-col gap-6">
            <div class="field">
              <label>KRA PIN Number</label>
              <div class="flex gap-3">
                <input 
                  type="text" 
                  [(ngModel)]="pin" 
                  class="input uppercase font-mono tracking-widest text-lg" 
                  placeholder="e.g. A001234567X"
                  maxlength="11"
                />
                <button 
                  class="btn-primary" 
                  [disabled]="!pin() || isLoading()" 
                  (click)="checkPin()"
                >
                  @if (isLoading()) {
                    <div class="spinner-sm"></div>
                  } @else {
                    Verify
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        @if (result()) {
          <div class="result-card animate-fade-in">
            <div class="header">
              <div class="status-badge" [class.active]="result()?.pinStatus === 'Active'">
                {{ result()?.pinStatus }}
              </div>
              <h3 class="name">{{ result()?.taxpayerName }}</h3>
              <p class="pin font-mono">{{ result()?.pin }}</p>
            </div>

            <div class="details-grid mt-8">
              <div class="detail-item">
                <span class="label">iTax Status</span>
                <span class="value">{{ result()?.iTaxStatus }}</span>
              </div>
            </div>

            <div class="obligations mt-8">
              <h4 class="font-bold text-slate-800 mb-4 px-2">Tax Obligations</h4>
              <div class="ob-list">
                @for (ob of result()?.obligations; track ob.name) {
                  <div class="ob-item">
                    <span class="ob-name">{{ ob.name }}</span>
                    <span class="ob-status" [class.active]="ob.status === 'Active'">{{ ob.status }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        @if (error()) {
          <div class="error-msg animate-fade-in mt-4">
            {{ error() }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .checker-container { max-width: 1000px; margin: 0 auto; }
    .card { background: white; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    
    .field label { display: block; font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .input { 
      flex: 1; padding: 14px 20px; border-radius: 14px; border: 2px solid #f1f5f9; 
      background: #fbfcfd; font-weight: 700; transition: 0.3s;
    }
    .input:focus { border-color: #e31e24; background: white; outline: none; box-shadow: 0 0 0 4px rgba(227,30,36,0.05); }

    .btn-primary {
      padding: 0 32px; height: 56px; border-radius: 14px; background: #e31e24; color: white;
      font-weight: 800; border: none; cursor: pointer; transition: 0.3s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(227,30,36,0.2); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    .result-card { background: white; border-radius: 32px; padding: 40px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.02); }
    .result-card .header { text-align: center; }
    .status-badge { 
      display: inline-block; padding: 6px 16px; border-radius: 50px; background: #fee2e2; color: #991b1b; 
      font-size: 0.75rem; font-weight: 800; margin-bottom: 16px;
    }
    .status-badge.active { background: #dcfce7; color: #166534; }
    .result-card .name { font-size: 1.5rem; font-weight: 900; color: #1e293b; margin: 0; }
    .result-card .pin { font-size: 1rem; color: #94a3b8; margin-top: 4px; }

    .ob-list { display: flex; flex-direction: column; gap: 8px; }
    .ob-item { 
      display: flex; justify-content: space-between; align-items: center; 
      padding: 14px 20px; background: #fbfcfd; border-radius: 16px;
    }
    .ob-name { font-weight: 700; color: #475569; }
    .ob-status { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
    .ob-status.active { color: #22c55e; }

    .error-msg { 
      padding: 16px 20px; background: #fff5f5; border: 1px solid #fee2e2; border-radius: 16px; 
      color: #e31e24; font-weight: 700; font-size: 0.9rem; text-align: center;
    }

    .spinner-sm { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PinCheckerComponent {
  pin = signal('');
  isLoading = signal(false);
  result = signal<PinDetails | null>(null);
  error = signal('');

  checkPin() {
    this.isLoading.set(true);
    this.error.set('');
    this.result.set(null);

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      if (this.pin().length < 11) {
        this.error.set('Invalid PIN format. Please enter a valid 11-character KRA PIN.');
      } else {
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
      }
    }, 1500);
  }
}
