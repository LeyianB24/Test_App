import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="checker-container p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">PRN Checker</h1>
        <p class="text-slate-500 mt-1">Check the status and details of a Payment Registration Number</p>
      </header>

      <div class="max-w-2xl mx-auto">
        <div class="card p-8 mb-8">
          <div class="flex flex-col gap-6">
            <div class="field">
              <label>PRN Number</label>
              <div class="flex gap-3">
                <input 
                  type="text" 
                  [(ngModel)]="prn" 
                  class="input font-mono text-lg" 
                  placeholder="e.g. 202512345678"
                />
                <button 
                  class="btn-primary" 
                  [disabled]="!prn() || isLoading()" 
                  (click)="checkPrn()"
                >
                  @if (isLoading()) {
                    <div class="spinner-sm"></div>
                  } @else {
                    Search
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        @if (result()) {
          <div class="result-card animate-fade-in">
            <div class="header">
              <div class="status-badge" [class.success]="result()?.paymentStatus === 'Paid'" [class.warning]="result()?.paymentStatus === 'Pending'">
                {{ result()?.paymentStatus }}
              </div>
              <h3 class="amount">KES {{ (result()?.amount || 0).toLocaleString() }}</h3>
              <p class="prn font-mono">PRN: {{ result()?.prn }}</p>
            </div>

            <div class="details-list mt-8">
              <div class="detail-row">
                <span class="label">Taxpayer</span>
                <span class="value">{{ result()?.taxpayerName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">PIN</span>
                <span class="value font-mono">{{ result()?.pin }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Obligation</span>
                <span class="value">{{ result()?.taxObligation }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Period</span>
                <span class="value">{{ result()?.taxPeriod }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Expiry</span>
                <span class="value text-amber-600">{{ result()?.expiryDate }}</span>
              </div>
            </div>

            <div class="mt-8 flex gap-3">
              <button class="flex-1 p-4 rounded-2xl bg-slate-800 text-white font-bold text-sm hover:translate-y-[-2px] transition-all">
                Download E-slip
              </button>
              @if (result()?.paymentStatus === 'Pending') {
                <button class="flex-1 p-4 rounded-2xl bg-red-600 text-white font-bold text-sm hover:translate-y-[-2px] transition-all">
                  Pay via M-PESA
                </button>
              }
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
      display: inline-block; padding: 6px 16px; border-radius: 50px; background: #f1f5f9; color: #64748b; 
      font-size: 0.75rem; font-weight: 800; margin-bottom: 16px;
    }
    .status-badge.success { background: #dcfce7; color: #166534; }
    .status-badge.warning { background: #fef3c7; color: #92400e; }

    .result-card .amount { font-size: 2.2rem; font-weight: 950; color: #1e293b; margin: 0; }
    .result-card .prn { font-size: 1rem; color: #94a3b8; margin-top: 4px; }

    .details-list { display: flex; flex-direction: column; gap: 8px; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; background: #fbfcfd; border-radius: 16px; }
    .detail-row .label { font-size: 0.85rem; font-weight: 700; color: #94a3b8; }
    .detail-row .value { font-weight: 800; color: #1e293b; text-align: right; }

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
export class PrnCheckerComponent {
  prn = signal('');
  isLoading = signal(false);
  result = signal<PrnDetails | null>(null);
  error = signal('');

  checkPrn() {
    this.isLoading.set(true);
    this.error.set('');
    this.result.set(null);

    setTimeout(() => {
      this.isLoading.set(false);
      // Mock search logic
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
        this.error.set('PRN not found or expired. Please verify the number.');
      }
    }, 1500);
  }
}
