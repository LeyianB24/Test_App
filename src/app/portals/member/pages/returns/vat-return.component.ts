import { inject, Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vat-return',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="db-root animate-fade-in">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner animate-stagger">
        <!-- Elite Header -->
        <header class="db-header-elite">
          <div class="header-left">
            <div class="live-badge">
              <span class="live-dot"></span>
              LIVE FILING MODULE
            </div>
            <h1 class="premium-title">VAT-3 <span class="text-red">Protocol</span></h1>
            <p class="premium-subtitle">Value Added Tax monthly declaration and assessment sequence</p>
          </div>
          
          <div class="header-right">
            <div class="period-badge">
              <span class="period-label">FISCAL PERIOD</span>
              <span class="period-value">JANUARY 2026</span>
            </div>
          </div>
        </header>

        <!-- Stepper -->
        <div class="stepper-elite">
          @for (step of steps; track step.id; let i = $index) {
            <div class="step-item" [class.active]="currentStep() >= step.id" [class.completed]="currentStep() > step.id">
              <div class="step-line" *ngIf="i > 0" [class.filled]="currentStep() >= step.id"></div>
              <div class="step-node">
                <div class="node-inner">
                  @if (currentStep() > step.id) {
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
                  } @else {
                    {{ step.id }}
                  }
                </div>
                <span class="node-label">{{ step.label }}</span>
              </div>
            </div>
          }
        </div>

        <div class="form-contain">
          <form [formGroup]="vatForm" class="elite-card form-card">
            <div class="card-glow"></div>
            
            <!-- Step 1: Sales / Output Tax -->
            @if (currentStep() === 1) {
              <div class="step-content animate-slide-up">
                <div class="step-header">
                  <h2 class="step-title">Part A: Sales & Output Tax</h2>
                  <p class="step-desc">Declare all taxable supplies made during this fiscal window.</p>
                </div>

                <div class="grid-inputs">
                  <div class="elite-input-group">
                    <label>Total Sales at General Rate (16%)</label>
                    <div class="input-wrap">
                      <input type="number" formControlName="sales_16" placeholder="0.00">
                      <span class="currency">KES</span>
                    </div>
                  </div>

                  <div class="elite-input-group">
                    <label>Total Zero-Rated Sales (0%)</label>
                    <div class="input-wrap">
                      <input type="number" formControlName="sales_0" placeholder="0.00">
                      <span class="currency">KES</span>
                    </div>
                  </div>

                  <div class="elite-input-group">
                    <label>Total Exempt Sales</label>
                    <div class="input-wrap">
                      <input type="number" formControlName="sales_exempt" placeholder="0.00">
                      <span class="currency">KES</span>
                    </div>
                  </div>

                  <div class="elite-input-group highlight">
                    <label>Output Tax Calculated</label>
                    <div class="calc-box">
                      <span class="calc-label">Calculated Liability</span>
                      <span class="calc-value">{{ (vatForm.get('sales_16')?.value || 0) * 0.16 | number:'1.2-2' }} KES</span>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- Step 2: Purchases / Input Tax -->
            @if (currentStep() === 2) {
              <div class="step-content animate-slide-up">
                <div class="step-header">
                  <h2 class="step-title">Part B: Purchases & Input Tax</h2>
                  <p class="step-desc">Declare statutory acquisitions and recoverable tax credits.</p>
                </div>

                <div class="grid-inputs">
                  <div class="elite-input-group">
                    <label>Local Purchases at 16%</label>
                    <div class="input-wrap">
                      <input type="number" formControlName="purchases_16" placeholder="0.00">
                      <span class="currency">KES</span>
                    </div>
                  </div>

                  <div class="elite-input-group">
                    <label>Imported Goods at 16%</label>
                    <div class="input-wrap">
                      <input type="number" formControlName="imports_16" placeholder="0.00">
                      <span class="currency">KES</span>
                    </div>
                  </div>
                </div>

                <div class="info-alert-elite">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div class="alert-body">
                    <strong>Input Tax Credit</strong>
                    <p>Total Input Tax deductible for this period: <span class="text-white">{{ inputTax() | number:'1.2-2' }} KES</span></p>
                  </div>
                </div>
              </div>
            }

            <!-- Step 3: Declaration -->
            @if (currentStep() === 3) {
              <div class="step-content animate-slide-up">
                <div class="step-header">
                  <h2 class="step-title">Part C: Archive Summary</h2>
                  <p class="step-desc">Final verification of computed tax liabilities.</p>
                </div>

                <div class="summary-list">
                  <div class="summary-item">
                    <span>Total Output Tax (Collected)</span>
                    <span class="val">{{ outputTax() | number:'1.2-2' }} KES</span>
                  </div>
                  <div class="summary-item">
                    <span>Total Input Tax (Deductible)</span>
                    <span class="val text-red">- {{ inputTax() | number:'1.2-2' }} KES</span>
                  </div>
                  <div class="summary-item total">
                    <span class="total-label">Net VAT Payable / (Refundable)</span>
                    <span class="total-val">{{ outputTax() - inputTax() | number:'1.2-2' }} KES</span>
                  </div>
                </div>

                <div class="declaration-box">
                  <label class="checkbox-container">
                    <input type="checkbox" formControlName="declaration">
                    <span class="checkmark"></span>
                    <span class="declaration-text">
                      I hereby declare that the information provided in this return is true and correct to the best of my knowledge and belief. I understand that any false statement or omission is an offense under the Tax Laws.
                    </span>
                  </label>
                </div>
              </div>
            }

            <!-- Step 4: Acknowledgement -->
            @if (currentStep() === 4) {
              <div class="success-content animate-fade-in">
                <div class="success-icon">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 class="success-title">Return Filed Successfully</h2>
                <p class="success-desc">Acknowledgment Receipt: <strong class="text-white">KRA202602158872</strong></p>
                
                <div class="success-actions">
                  <button class="btn-elite-pri" (click)="reset()">FILE ANOTHER RETURN</button>
                  <button class="btn-elite-sec" routerLink="/member/dashboard">GO TO DASHBOARD</button>
                </div>
              </div>
            }

            <!-- Navigation -->
            @if (currentStep() < 4) {
              <div class="form-nav">
                <button type="button" class="btn-nav-back" [disabled]="currentStep() === 1" (click)="prevStep()">
                  BACK
                </button>
                <button type="button" class="btn-nav-next" [disabled]="currentStep() === 3 && !vatForm.get('declaration')?.value" (click)="nextStep()">
                  @if (currentStep() === 3) { SUBMIT ARCHIVE } @else { CONTINUE }
                </button>
              </div>
            }
          </form>
        </div>

        <!-- Elite Footer -->
        <footer class="db-footer-elite">
           <p>STATUTORY PROTOCOL ENGINE. DATA IS TRANSMITTED VIA SECURED FISCAL CHANNELS. SUBJECT TO AUDIT VERIFICATION.</p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --red:          #D92B2B;
      --red-bright:   #EF3B3B;
      --red-glow:     rgba(217, 43, 43, 0.38);
      --red-pale:     rgba(217, 43, 43, 0.10);
      --red-border:   rgba(217, 43, 43, 0.22);

      --bg-root:      #0C0C0C;
      --bg-card:      #141414;
      --bg-card-2:    #1C1C1C;
      
      --text-pri:     #F0F0F0;
      --text-sec:     #888888;
      --text-mut:     #4A4A4A;

      --bdr:          rgba(255, 255, 255, 0.08);
      --bdr-md:       rgba(255, 255, 255, 0.14);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    .db-root { min-height: 100vh; background: var(--bg-root); color: var(--text-pri); position: relative; overflow-x: hidden; }
    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.03; z-index: 1; pointer-events: none; }
    .accent-bleed { position: fixed; top: -10vw; left: -10vw; width: 40vw; height: 40vw; background: var(--red); filter: blur(15vw); opacity: 0.08; border-radius: 50%; z-index: 1; pointer-events: none; }

    .db-inner { max-width: 1440px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 48px; position: relative; z-index: 10; }

    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; }
    .premium-title { font-size: 40px; font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--red); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .period-badge { background: var(--bg-card); border: 1px solid var(--bdr); padding: 10px 20px; border-radius: 16px; display: flex; flex-direction: column; }
    .period-label { font-size: 9px; font-weight: 900; color: var(--text-sec); letter-spacing: 1px; }
    .period-value { font-size: 13px; font-weight: 800; color: var(--text-pri); }

    /* Stepper */
    .stepper-elite { display: flex; align-items: center; gap: 40px; margin: 0 auto; max-width: 800px; padding: 0 40px; }
    .step-item { flex: 1; position: relative; }
    .step-node { display: flex; flex-direction: column; align-items: center; gap: 12px; position: relative; z-index: 10; }
    .node-inner { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-card-2); border: 2px solid var(--bdr); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; color: var(--text-mut); transition: all 0.3s; }
    .node-label { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: var(--text-mut); transition: color 0.3s; }

    .step-line { position: absolute; top: 18px; right: 50%; width: 100%; height: 2px; background: var(--bdr); z-index: 1; }
    .step-line.filled { background: var(--red); }

    .step-item.active .node-inner { border-color: var(--red); color: var(--red); box-shadow: 0 0 20px var(--red-pale); }
    .step-item.active .node-label { color: var(--text-pri); }
    .step-item.completed .node-inner { background: var(--red); border-color: var(--red); color: white; }

    /* Form Container */
    .form-contain { max-width: 800px; margin: 0 auto; width: 100%; }
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 32px; padding: 32px; position: relative; overflow: hidden; transition: all 0.3s; }
    .form-card { padding: 48px; border-radius: 40px; }
    .card-glow { position: absolute; top: -100px; left: -100px; width: 300px; height: 300px; background: var(--red); filter: blur(100px); opacity: 0.03; pointer-events: none; }

    .step-header { margin-bottom: 40px; }
    .step-title { font-size: 24px; font-weight: 900; color: var(--text-pri); margin-bottom: 8px; }
    .step-desc { font-size: 14px; font-weight: 500; color: var(--text-sec); }

    .grid-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .elite-input-group { display: flex; flex-direction: column; gap: 10px; }
    .elite-input-group label { font-size: 12px; font-weight: 800; color: var(--text-sec); text-transform: uppercase; letter-spacing: 0.5px; }

    .input-wrap { position: relative; }
    .input-wrap input { width: 100%; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 16px; padding: 16px 60px 16px 20px; color: var(--text-pri); font-size: 16px; font-weight: 700; transition: all 0.2s; }
    .input-wrap input:focus { outline: none; border-color: var(--red); box-shadow: 0 0 0 4px var(--red-pale); }
    .currency { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 12px; font-weight: 900; color: var(--text-mut); }

    .elite-input-group.highlight .calc-box { background: var(--bg-card-2); border: 1px solid var(--red-border); border-radius: 16px; padding: 16px 20px; display: flex; flex-direction: column; gap: 4px; border-left: 4px solid var(--red); }
    .calc-label { font-size: 10px; font-weight: 900; color: var(--text-sec); text-transform: uppercase; }
    .calc-value { font-size: 18px; font-weight: 950; color: var(--red); letter-spacing: -0.5px; }

    .info-alert-elite { margin-top: 32px; display: flex; gap: 16px; padding: 20px; background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.1); border-radius: 20px; color: #60a5fa; }
    .alert-body strong { display: block; font-size: 13px; font-weight: 900; text-transform: uppercase; margin-bottom: 4px; }
    .alert-body p { font-size: 13px; font-weight: 500; color: #93c5fd; }

    /* Summary */
    .summary-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
    .summary-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: var(--bg-card-2); border-radius: 16px; font-size: 14px; font-weight: 700; color: var(--text-sec); }
    .summary-item .val { font-family: 'IBM Plex Mono', monospace; font-size: 15px; color: var(--text-pri); }
    .summary-item.total { background: var(--red-pale); border: 1px solid var(--red-border); margin-top: 8px; }
    .total-label { font-weight: 900; color: var(--text-pri); text-transform: uppercase; letter-spacing: 0.5px; }
    .total-val { font-family: 'IBM Plex Mono', monospace; font-size: 24px; font-weight: 950; color: var(--red); }

    /* Checkbox */
    .declaration-box { margin-top: 32px; padding: 24px; background: var(--bg-card-2); border-radius: 20px; }
    .checkbox-container { display: flex; gap: 16px; cursor: pointer; }
    .checkbox-container input { display: none; }
    .checkmark { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--bdr); background: var(--bg-card); flex-shrink: 0; position: relative; transition: all 0.2s; }
    .checkbox-container input:checked ~ .checkmark { background: var(--red); border-color: var(--red); box-shadow: 0 0 15px var(--red-pale); }
    .checkmark:after { content: ""; position: absolute; left: 7px; top: 3px; width: 5px; height: 10px; border: solid white; border-width: 0 3px 3px 0; transform: rotate(45deg); opacity: 0; transition: opacity 0.2s; }
    .checkbox-container input:checked ~ .checkmark:after { opacity: 1; }
    .declaration-text { font-size: 12px; line-height: 1.6; color: var(--text-sec); font-weight: 600; }

    /* Success */
    .success-content { text-align: center; padding: 40px 0; }
    .success-icon { width: 80px; height: 80px; border-radius: 50%; background: var(--red-pale); border: 1px solid var(--red-border); color: var(--red); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; box-shadow: 0 0 40px var(--red-pale); }
    .success-title { font-size: 28px; font-weight: 950; margin-bottom: 8px; }
    .success-desc { font-size: 15px; color: var(--text-sec); margin-bottom: 40px; }
    .success-actions { display: flex; justify-content: center; gap: 16px; }

    /* Nav */
    .form-nav { margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--bdr); display: flex; justify-content: space-between; }
    .btn-nav-back { background: none; border: none; font-size: 11px; font-weight: 900; color: var(--text-sec); letter-spacing: 2px; cursor: pointer; padding: 12px 24px; transition: color 0.2s; }
    .btn-nav-back:hover:not(:disabled) { color: var(--text-pri); }
    .btn-nav-back:disabled { opacity: 0.3; cursor: not-allowed; }

    .btn-nav-next { background: var(--red); border: none; color: white; padding: 16px 40px; border-radius: 16px; font-size: 12px; font-weight: 900; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s; box-shadow: 0 10px 30px var(--red-pale); }
    .btn-nav-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 40px var(--red-glow); }
    .btn-nav-next:disabled { background: var(--bg-card-2); color: var(--text-mut); box-shadow: none; cursor: not-allowed; }

    .btn-elite-pri { background: var(--red); color: white; border: none; padding: 18px 40px; border-radius: 20px; font-size: 12px; font-weight: 950; letter-spacing: 2px; cursor: pointer; transition: all 0.3s; }
    .btn-elite-pri:hover { transform: translateY(-2px); background: var(--red-bright); }
    .btn-elite-sec { background: transparent; color: var(--text-pri); border: 1px solid var(--bdr); padding: 18px 40px; border-radius: 20px; font-size: 12px; font-weight: 950; letter-spacing: 2px; cursor: pointer; transition: all 0.3s; }
    .btn-elite-sec:hover { background: var(--bg-card-2); }

    .db-footer-elite { margin-top: 40px; padding: 40px; border: 1px solid var(--bdr); border-radius: 32px; text-align: center; background: var(--bg-card-2); }
    .db-footer-elite p { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 4px; line-height: 1.8; max-width: 800px; margin: 0 auto; }

    /* Animations */
    .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    `]
})
export class VatReturnComponent {
  currentStep = signal(1);
  steps = [
    { id: 1, label: 'Income/Output Tax' },
    { id: 2, label: 'Expenses/Input Tax' },
    { id: 3, label: 'Summary' }
  ];

  vatForm = inject(FormBuilder).group({
    sales_16: [0],
    sales_0: [0],
    sales_exempt: [0],
    purchases_16: [0],
    imports_16: [0],
    declaration: [false, Validators.requiredTrue]
  });

  constructor() {}

  nextStep() {
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  outputTax() {
    return (this.vatForm.get('sales_16')?.value || 0) * 0.16;
  }

  inputTax() {
    return ((this.vatForm.get('purchases_16')?.value || 0) + (this.vatForm.get('imports_16')?.value || 0)) * 0.16;
  }

  reset() {
    this.vatForm.reset();
    this.currentStep.set(1);
  }
}
