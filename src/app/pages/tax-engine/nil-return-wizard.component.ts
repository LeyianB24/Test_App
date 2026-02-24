import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nil-return-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wizard p-6">
      <header class="mb-10">
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">File NIL Return</h1>
        <p class="text-slate-500 mt-1">Declare zero income for a tax period in 3 simple steps</p>
      </header>

      <!-- Stepper -->
      <div class="stepper mb-10">
        @for (s of steps; track s; let i = $index) {
          <div class="step" [class.active]="currentStep() === i" [class.done]="currentStep() > i">
            <div class="step-circle">
              @if (currentStep() > i) {
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              } @else {
                {{ i + 1 }}
              }
            </div>
            <span class="step-label">{{ s }}</span>
          </div>
          @if (i < steps.length - 1) {
            <div class="step-connector" [class.done]="currentStep() > i"></div>
          }
        }
      </div>

      <!-- Step 1: Select Tax Obligation -->
      @if (currentStep() === 0) {
        <div class="step-content card animate-fade-in">
          <h3 class="font-bold text-lg text-slate-800 mb-6">Select Tax Obligation</h3>
          <div class="obligation-grid">
            @for (ob of obligations; track ob.code) {
              <button class="obligation-btn" [class.selected]="selectedObligation() === ob.code" (click)="selectedObligation.set(ob.code)">
                <span class="ob-code">{{ ob.code }}</span>
                <span class="ob-name">{{ ob.name }}</span>
              </button>
            }
          </div>
        </div>
      }

      <!-- Step 2: Select Period -->
      @if (currentStep() === 1) {
        <div class="step-content card animate-fade-in">
          <h3 class="font-bold text-lg text-slate-800 mb-6">Select Filing Period</h3>
          <div class="period-form">
            <div class="form-row">
              <label for="nil-year">Tax Year</label>
              <select id="nil-year" [(ngModel)]="selectedYear" class="form-select">
                @for (y of years; track y) {
                  <option [value]="y">{{ y }}</option>
                }
              </select>
            </div>
            <div class="form-row">
              <label for="nil-month">Period (Month)</label>
              <select id="nil-month" [(ngModel)]="selectedMonth" class="form-select">
                @for (m of months; track m.value) {
                  <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>
          </div>
        </div>
      }

      <!-- Step 3: Confirm & Submit -->
      @if (currentStep() === 2) {
        <div class="step-content card animate-fade-in">
          <h3 class="font-bold text-lg text-slate-800 mb-6">Confirm & Submit</h3>
          <div class="confirm-summary">
            <div class="confirm-row">
              <span class="confirm-label">Tax Obligation</span>
              <span class="confirm-value">{{ getObligationName(selectedObligation()) }}</span>
            </div>
            <div class="confirm-row">
              <span class="confirm-label">Tax Period</span>
              <span class="confirm-value">{{ getMonthName(selectedMonth) }}, {{ selectedYear }}</span>
            </div>
            <div class="confirm-row">
              <span class="confirm-label">Declaration</span>
              <span class="confirm-value text-amber-600 font-bold">NIL — No taxable income for this period</span>
            </div>
          </div>

          @if (submitSuccess()) {
            <div class="success-bar mt-6">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              NIL Return filed successfully! Acknowledgement will appear in your returns history.
            </div>
          }
        </div>
      }

      <!-- Navigation -->
      <div class="wizard-nav mt-8">
        @if (currentStep() > 0) {
          <button class="nav-btn secondary" (click)="prev()" [disabled]="isSubmitting()">Back</button>
        }
        <div class="flex-spacer"></div>
        @if (currentStep() < 2) {
          <button class="nav-btn primary" (click)="next()" [disabled]="!canProceed()">Continue</button>
        } @else if (!submitSuccess()) {
          <button class="nav-btn primary" (click)="submit()" [disabled]="isSubmitting()">
            @if (isSubmitting()) {
              <div class="mini-spinner"></div> Filing...
            } @else {
              Submit NIL Return
            }
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .wizard { max-width: 800px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .stepper { display: flex; align-items: center; justify-content: center; gap: 0; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; z-index: 1; }
    .step-circle {
      width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 0.9rem; border: 3px solid #e2e8f0; color: #94a3b8; background: white; transition: 0.3s;
    }
    .step.active .step-circle { border-color: #e31e24; color: #e31e24; box-shadow: 0 0 0 4px rgba(227,30,36,0.1); }
    .step.done .step-circle { border-color: #22c55e; background: #22c55e; color: white; }
    .step-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .step.active .step-label { color: #e31e24; }
    .step.done .step-label { color: #22c55e; }
    .step-connector { flex: 1; height: 3px; background: #e2e8f0; margin: 0 8px; margin-bottom: 24px; transition: 0.3s; }
    .step-connector.done { background: #22c55e; }

    .card {
      background: white; border-radius: 24px; padding: 32px;
      border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }

    .obligation-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
    .obligation-btn {
      display: flex; flex-direction: column; gap: 4px; padding: 18px; border-radius: 16px;
      border: 2px solid #f1f5f9; background: white; cursor: pointer; text-align: left; transition: 0.3s;
    }
    .obligation-btn:hover { border-color: #cbd5e1; }
    .obligation-btn.selected { border-color: #e31e24; background: rgba(227,30,36,0.03); }
    .ob-code { font-size: 0.75rem; font-weight: 800; color: #e31e24; text-transform: uppercase; letter-spacing: 1px; }
    .ob-name { font-size: 0.95rem; font-weight: 700; color: #334155; }

    .period-form { display: flex; flex-direction: column; gap: 20px; max-width: 400px; }
    .form-row { display: flex; flex-direction: column; gap: 8px; }
    .form-row label { font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .form-select {
      padding: 14px 18px; border-radius: 14px; border: 2px solid #e2e8f0;
      font-size: 1rem; font-weight: 600; color: #1e293b; background: white; font-family: inherit;
      transition: 0.3s; appearance: auto;
    }
    .form-select:focus { border-color: #e31e24; outline: none; box-shadow: 0 0 0 4px rgba(227,30,36,0.1); }

    .confirm-summary { display: flex; flex-direction: column; gap: 16px; }
    .confirm-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: #f8fafc; border-radius: 14px; }
    .confirm-label { font-size: 0.85rem; font-weight: 700; color: #94a3b8; }
    .confirm-value { font-size: 0.95rem; font-weight: 800; color: #1e293b; }

    .success-bar {
      display: flex; align-items: center; gap: 10px; padding: 16px 20px;
      background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px;
      color: #16a34a; font-weight: 700; font-size: 0.9rem;
    }

    .wizard-nav { display: flex; align-items: center; gap: 12px; }
    .flex-spacer { flex: 1; }
    .nav-btn {
      padding: 14px 32px; border-radius: 16px; font-weight: 800; font-size: 0.9rem;
      cursor: pointer; transition: 0.3s; border: none; display: flex; align-items: center; gap: 8px;
    }
    .nav-btn.primary { background: linear-gradient(135deg, #e31e24, #c0121a); color: white; }
    .nav-btn.primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(227,30,36,0.3); }
    .nav-btn.secondary { background: white; color: #475569; border: 2px solid #e2e8f0; }
    .nav-btn.secondary:hover { border-color: #cbd5e1; }
    .nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .mini-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class NilReturnWizardComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  steps = ['Obligation', 'Period', 'Confirm'];
  currentStep = signal(0);
  selectedObligation = signal('');
  selectedYear = new Date().getFullYear().toString();
  selectedMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
  isSubmitting = signal(false);
  submitSuccess = signal(false);

  obligations = [
    { code: 'IT', name: 'Income Tax - Resident' },
    { code: 'PAYE', name: 'Pay As You Earn' },
    { code: 'VAT', name: 'Value Added Tax' },
    { code: 'MRI', name: 'Monthly Rental Income' },
    { code: 'TOT', name: 'Turnover Tax' },
    { code: 'WHT', name: 'Withholding Tax' },
  ];

  years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
  months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];

  canProceed(): boolean {
    if (this.currentStep() === 0) return this.selectedObligation() !== '';
    return true;
  }

  next() { if (this.canProceed()) this.currentStep.update(s => s + 1); }
  prev() { this.currentStep.update(s => Math.max(0, s - 1)); }

  getObligationName(code: string): string {
    return this.obligations.find(o => o.code === code)?.name || code;
  }

  getMonthName(val: string): string {
    return this.months.find(m => m.value === val)?.label || val;
  }

  submit() {
    this.isSubmitting.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
    }, 2000);
  }
}
