import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tot-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wizard p-6">
      <header class="mb-10">
        <div class="flex items-center gap-4">
          <div class="bg-red-100 p-3 rounded-2xl">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#e31e24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          </div>
          <div>
            <h1 class="text-3xl font-black text-slate-800 tracking-tight">File Turnover Tax (TOT)</h1>
            <p class="text-slate-500 mt-1">Guided wizard for businesses with annual turnover < KES 50M</p>
          </div>
        </div>
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
            <div class="step-line" [class.done]="currentStep() > i"></div>
          }
        }
      </div>

      <!-- Step Content -->
      <div class="card animate-fade-in min-h-[400px]">
        @if (currentStep() === 0) {
          <div class="step-body">
            <h3 class="font-bold text-xl text-slate-800 mb-6">Tax Period Details</h3>
            <div class="form-grid">
              <div class="field">
                <label>Tax Year</label>
                <select [(ngModel)]="year" class="input">
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div class="field">
                <label>Month</label>
                <select [(ngModel)]="month" class="input">
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                </select>
              </div>
            </div>
            <div class="alert mt-8">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Turnover Tax is payable at 1% of the gross monthly turnover.
            </div>
          </div>
        }

        @if (currentStep() === 1) {
          <div class="step-body">
            <h3 class="font-bold text-xl text-slate-800 mb-6">Income Declaration</h3>
            <div class="field mb-6">
              <label>Gross Monthly Sales / Turnover (KES)</label>
              <input type="number" [(ngModel)]="turnover" class="input text-2xl font-black" placeholder="0.00"/>
              <p class="text-xs text-slate-400 mt-2">Exclude VAT if you are a VAT-registered taxpayer.</p>
            </div>
            
            <div class="summary-box mt-10">
              <div class="s-row">
                <span>Tax Rate</span>
                <span class="font-bold">1%</span>
              </div>
              <div class="s-row total">
                <span>Estimated TOT Payable</span>
                <span class="text-red-600 font-bold">KES {{ (turnover * 0.01).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        }

        @if (currentStep() === 2) {
          <div class="step-body text-center py-10">
            @if (!isSubmitting() && !isDone()) {
              <div class="confirm-view animate-fade-in">
                <div class="bg-slate-50 p-8 rounded-3xl mb-8">
                  <h4 class="font-bold text-slate-500 uppercase text-xs tracking-widest mb-4">Summary</h4>
                  <p class="text-3xl font-black text-slate-800">KES {{ (turnover * 0.01).toLocaleString() }}</p>
                  <p class="text-slate-500 font-medium">TOT for {{ monthName() }} {{ year }}</p>
                </div>
                <label class="consent flex items-center gap-3 justify-center mb-6 cursor-pointer">
                  <input type="checkbox" [(ngModel)]="consent" class="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500">
                  <span class="text-sm font-semibold text-slate-600">I confirm the details above are accurate.</span>
                </label>
              </div>
            }

            @if (isSubmitting()) {
              <div class="processing flex flex-col items-center gap-6 animate-fade-in">
                <div class="spinner"></div>
                <h4 class="text-xl font-bold text-slate-700">Submitting to KRA Portal...</h4>
                <p class="text-slate-400">Please do not refresh this page.</p>
              </div>
            }

            @if (isDone()) {
              <div class="success flex flex-col items-center gap-6 animate-fade-in">
                <div class="success-icon">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h4 class="text-2xl font-black text-slate-800">TOT Return Filed!</h4>
                <p class="text-slate-500">Your PRN (Payment Registration Number) has been generated.</p>
                <div class="bg-red-50 p-6 rounded-2xl w-full max-w-sm">
                  <span class="text-xs font-bold text-red-600 uppercase tracking-widest">PRN NUMBER</span>
                  <p class="text-2xl font-mono font-black text-red-700 mt-1">202512984712</p>
                </div>
                <button class="nav-btn primary mt-4">Download Acknowledgement</button>
              </div>
            }
          </div>
        }
      </div>

      <!-- Navigation -->
      @if (!isSubmitting() && !isDone()) {
        <div class="wizard-nav mt-8">
          <button class="nav-btn secondary" [disabled]="currentStep() === 0" (click)="prev()">Back</button>
          <div class="spacer"></div>
          @if (currentStep() < 2) {
            <button class="nav-btn primary" [disabled]="!canProceed()" (click)="next()">Continue</button>
          } @else {
            <button class="nav-btn primary" [disabled]="!consent" (click)="submit()">Submit Return</button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .wizard { max-width: 800px; margin: 0 auto; }
    .card { background: white; border-radius: 32px; padding: 40px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.02); }
    
    .stepper { display: flex; align-items: flex-start; gap: 8px; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; z-index: 2; width: 100px; }
    .step-circle { 
      width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; 
      font-weight: 800; font-size: 1rem; border: 3px solid #e2e8f0; color: #94a3b8; background: white; transition: 0.3s;
    }
    .step.active .step-circle { border-color: #e31e24; color: #e31e24; box-shadow: 0 0 0 5px rgba(227,30,36,0.1); }
    .step.done .step-circle { border-color: #22c55e; background: #22c55e; color: white; }
    .step-label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }
    .step.active .step-label { color: #e31e24; }
    .step-line { flex: 1; height: 3px; background: #e2e8f0; border-radius: 2px; margin-top: 22px; transition: 0.5s; }
    .step-line.done { background: #22c55e; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .field { display: flex; flex-direction: column; gap: 8px; }
    .field label { font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .input { 
      padding: 16px 20px; border: 2px solid #f1f5f9; border-radius: 16px; 
      font-size: 1rem; font-weight: 700; color: #1e293b; background: #fbfcfd; transition: 0.3s;
    }
    .input:focus { border-color: #e31e24; background: white; outline: none; box-shadow: 0 0 0 4px rgba(227,30,36,0.05); }
    
    .alert { padding: 16px 20px; background: #fff7ed; border: 1px solid #ffedd5; border-radius: 16px; color: #9a3412; font-size: 0.9rem; font-weight: 600; display: flex; gap: 12px; align-items: flex-start; }

    .summary-box { border-top: 2px solid #f1f5f9; padding-top: 24px; display: flex; flex-direction: column; gap: 12px; }
    .s-row { display: flex; justify-content: space-between; font-size: 1rem; color: #64748b; font-weight: 600; }
    .s-row.total { font-size: 1.5rem; color: #1e293b; font-weight: 900; margin-top: 8px; }

    .wizard-nav { display: flex; align-items: center; }
    .spacer { flex: 1; }
    .nav-btn { 
      padding: 14px 36px; border-radius: 18px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: 0.3s;
      border: none; display: flex; align-items: center; gap: 10px;
    }
    .nav-btn.primary { background: #e31e24; color: white; }
    .nav-btn.primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(227,30,36,0.2); }
    .nav-btn.secondary { background: white; color: #64748b; border: 2px solid #e2e8f0; }
    .nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner { width: 48px; height: 48px; border: 4px solid #f1f5f9; border-top: 4px solid #e31e24; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    .success-icon { width: 80px; height: 80px; border-radius: 50%; background: #dcfce7; color: #22c55e; display: flex; align-items: center; justify-content: center; }

    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class TotWizardComponent {
  steps = ['Period', 'Income', 'Summary'];
  currentStep = signal(0);
  
  year = '2025';
  month = '01';
  turnover = 0;
  consent = false;
  isSubmitting = signal(false);
  isDone = signal(false);

  monthName() {
    const names: Record<string, string> = { '01': 'January', '02': 'February', '03': 'March' };
    return names[this.month] || this.month;
  }

  canProceed() {
    if (this.currentStep() === 1) return this.turnover > 0;
    return true;
  }

  next() { this.currentStep.update(s => s + 1); }
  prev() { this.currentStep.update(s => s - 1); }

  submit() {
    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isDone.set(true);
    }, 2000);
  }
}
