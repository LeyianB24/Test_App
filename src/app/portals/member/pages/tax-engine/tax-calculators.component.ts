import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TaxBracket { min: number; max: number; rate: number; }

// KRA 2025 PAYE brackets
const PAYE_BRACKETS: TaxBracket[] = [
  { min: 0,       max: 24000,   rate: 10 },
  { min: 24001,   max: 32333,   rate: 25 },
  { min: 32334,   max: 500000,  rate: 30 },
  { min: 500001,  max: 800000,  rate: 32.5 },
  { min: 800001,  max: Infinity, rate: 35 },
];

const PERSONAL_RELIEF = 2400;
const INSURANCE_RELIEF_MAX = 5000;
const NSSF_TIER1 = 360;   // 6% of 6000
const NSSF_TIER2 = 1080;  // 6% of 18000
const NHIF_RATES: { min: number; max: number; amount: number }[] = [
  { min: 0, max: 5999, amount: 150 }, { min: 6000, max: 7999, amount: 300 },
  { min: 8000, max: 11999, amount: 400 }, { min: 12000, max: 14999, amount: 500 },
  { min: 15000, max: 19999, amount: 600 }, { min: 20000, max: 24999, amount: 750 },
  { min: 25000, max: 29999, amount: 850 }, { min: 30000, max: 34999, amount: 900 },
  { min: 35000, max: 39999, amount: 950 }, { min: 40000, max: 44999, amount: 1000 },
  { min: 45000, max: 49999, amount: 1100 }, { min: 50000, max: 59999, amount: 1200 },
  { min: 60000, max: 69999, amount: 1300 }, { min: 70000, max: 79999, amount: 1400 },
  { min: 80000, max: 89999, amount: 1500 }, { min: 90000, max: 99999, amount: 1600 },
  { min: 100000, max: Infinity, amount: 1700 },
];

type CalcMode = 'paye' | 'vat' | 'tot' | 'mri';

@Component({
  selector: 'app-tax-calculators',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calc-page p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Tax Calculators</h1>
        <p class="text-slate-500 mt-1">Kenya Revenue Authority 2025 tax computation tools</p>
      </header>

      <!-- Mode Tabs -->
      <div class="tabs mb-8">
        @for (tab of tabs; track tab.key) {
          <button class="tab-btn" [class.active]="mode() === tab.key" (click)="mode.set(tab.key)">{{ tab.label }}</button>
        }
      </div>

      <!-- PAYE Calculator -->
      @if (mode() === 'paye') {
        <div class="calc-card grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          <div class="input-side">
            <h3 class="font-bold text-lg text-slate-800 mb-6">Monthly PAYE Calculator</h3>
            <div class="form-field">
              <label>Gross Monthly Salary (KES)</label>
              <input type="number" [(ngModel)]="grossSalary" (ngModelChange)="calculate()" class="calc-input" placeholder="e.g. 100000"/>
            </div>
            <div class="form-field">
              <label>Insurance Premium / Month (KES)</label>
              <input type="number" [(ngModel)]="insurancePremium" (ngModelChange)="calculate()" class="calc-input" placeholder="Optional"/>
            </div>
          </div>

          <div class="result-side">
            <h3 class="font-bold text-lg text-slate-800 mb-4">Breakdown</h3>
            <div class="result-rows">
              <div class="r-row"><span>Gross Salary</span><span class="r-val">{{ fmt(grossSalary) }}</span></div>
              <div class="r-row"><span>NSSF Deduction</span><span class="r-val text-red-500">- {{ fmt(payeResult().nssf) }}</span></div>
              <div class="r-row"><span>Taxable Income</span><span class="r-val font-bold">{{ fmt(payeResult().taxableIncome) }}</span></div>
              <div class="r-row divider"><span>Tax Before Relief</span><span class="r-val">{{ fmt(payeResult().taxBeforeRelief) }}</span></div>
              <div class="r-row"><span>Personal Relief</span><span class="r-val text-green-600">- {{ fmt(payeResult().personalRelief) }}</span></div>
              <div class="r-row"><span>Insurance Relief</span><span class="r-val text-green-600">- {{ fmt(payeResult().insuranceRelief) }}</span></div>
              <div class="r-row highlight"><span>PAYE (Tax Payable)</span><span class="r-val">{{ fmt(payeResult().paye) }}</span></div>
              <div class="r-row"><span>NHIF</span><span class="r-val">{{ fmt(payeResult().nhif) }}</span></div>
              <div class="r-row final"><span>NET PAY</span><span class="r-val text-green-600">{{ fmt(payeResult().netPay) }}</span></div>
            </div>
          </div>
        </div>
      }

      <!-- VAT Calculator -->
      @if (mode() === 'vat') {
        <div class="calc-card animate-fade-in" style="max-width:600px">
          <h3 class="font-bold text-lg text-slate-800 mb-6">VAT Calculator (16%)</h3>
          <div class="form-field">
            <label>Amount (KES)</label>
            <input type="number" [(ngModel)]="vatAmount" class="calc-input" placeholder="Enter amount"/>
          </div>
          <div class="vat-toggle mt-4 flex gap-3">
            <button class="tab-btn small" [class.active]="vatInclusive()" (click)="vatInclusive.set(true)">VAT Inclusive</button>
            <button class="tab-btn small" [class.active]="!vatInclusive()" (click)="vatInclusive.set(false)">VAT Exclusive</button>
          </div>
          <div class="result-rows mt-6">
            @if (vatInclusive()) {
              <div class="r-row"><span>VAT Inclusive Amount</span><span class="r-val">{{ fmt(vatAmount) }}</span></div>
              <div class="r-row"><span>VAT (16%)</span><span class="r-val text-red-500">{{ fmt(vatAmount - vatAmount / 1.16) }}</span></div>
              <div class="r-row final"><span>Excluding VAT</span><span class="r-val text-green-600">{{ fmt(vatAmount / 1.16) }}</span></div>
            } @else {
              <div class="r-row"><span>Excluding VAT</span><span class="r-val">{{ fmt(vatAmount) }}</span></div>
              <div class="r-row"><span>VAT (16%)</span><span class="r-val text-red-500">{{ fmt(vatAmount * 0.16) }}</span></div>
              <div class="r-row final"><span>VAT Inclusive</span><span class="r-val text-green-600">{{ fmt(vatAmount * 1.16) }}</span></div>
            }
          </div>
        </div>
      }

      <!-- TOT Calculator -->
      @if (mode() === 'tot') {
        <div class="calc-card animate-fade-in" style="max-width:600px">
          <h3 class="font-bold text-lg text-slate-800 mb-6">Turnover Tax Calculator (1%)</h3>
          <p class="text-slate-400 text-sm mb-4">For businesses with annual turnover between KES 1M and KES 50M</p>
          <div class="form-field">
            <label>Annual Turnover (KES)</label>
            <input type="number" [(ngModel)]="totTurnover" class="calc-input" placeholder="e.g. 5000000"/>
          </div>
          <div class="result-rows mt-6">
            <div class="r-row"><span>Annual Turnover</span><span class="r-val">{{ fmt(totTurnover) }}</span></div>
            <div class="r-row"><span>TOT Rate</span><span class="r-val">1%</span></div>
            <div class="r-row final"><span>Annual TOT Payable</span><span class="r-val text-red-500">{{ fmt(totTurnover * 0.01) }}</span></div>
            <div class="r-row"><span>Monthly TOT</span><span class="r-val">{{ fmt(totTurnover * 0.01 / 12) }}</span></div>
          </div>
        </div>
      }

      <!-- MRI Calculator -->
      @if (mode() === 'mri') {
        <div class="calc-card animate-fade-in" style="max-width:600px">
          <h3 class="font-bold text-lg text-slate-800 mb-6">Monthly Rental Income Tax (7.5%)</h3>
          <div class="form-field">
            <label>Monthly Rent Received (KES)</label>
            <input type="number" [(ngModel)]="mriRent" class="calc-input" placeholder="e.g. 150000"/>
          </div>
          <div class="result-rows mt-6">
            <div class="r-row"><span>Monthly Rent</span><span class="r-val">{{ fmt(mriRent) }}</span></div>
            <div class="r-row"><span>MRI Tax Rate</span><span class="r-val">7.5%</span></div>
            <div class="r-row final"><span>Monthly Tax Payable</span><span class="r-val text-red-500">{{ fmt(mriRent * 0.075) }}</span></div>
            <div class="r-row"><span>Annual Tax</span><span class="r-val">{{ fmt(mriRent * 0.075 * 12) }}</span></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .calc-page { max-width: 1200px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .tab-btn {
      padding: 12px 24px; border-radius: 16px; border: 2px solid #f1f5f9;
      background: white; font-weight: 800; font-size: 0.9rem; color: #64748b;
      cursor: pointer; transition: 0.3s;
    }
    .tab-btn.small { padding: 8px 16px; font-size: 0.8rem; border-radius: 12px; }
    .tab-btn.active { border-color: #e31e24; color: #e31e24; background: rgba(227,30,36,0.03); }
    .tab-btn:hover:not(.active) { border-color: #cbd5e1; }

    .calc-card {
      background: white; border-radius: 24px; padding: 32px;
      border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }

    .form-field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .form-field label { font-size: 0.8rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .calc-input {
      padding: 14px 18px; border: 2px solid #e2e8f0; border-radius: 14px;
      font-size: 1.1rem; font-weight: 700; color: #1e293b; font-family: inherit; transition: 0.3s;
    }
    .calc-input:focus { border-color: #e31e24; outline: none; box-shadow: 0 0 0 4px rgba(227,30,36,0.1); }

    .result-rows { display: flex; flex-direction: column; gap: 8px; }
    .r-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; color: #475569; }
    .r-row.divider { border-top: 2px solid #f1f5f9; margin-top: 4px; padding-top: 16px; }
    .r-row.highlight { background: #fef3c7; border: 1px solid #fde68a; font-weight: 800; color: #92400e; }
    .r-row.final { background: #f0fdf4; border: 1px solid #bbf7d0; font-weight: 900; font-size: 1.05rem; color: #166534; margin-top: 8px; }
    .r-val { font-weight: 800; color: #1e293b; }
  `]
})
export class TaxCalculatorsComponent {
  mode = signal<CalcMode>('paye');
  tabs: { key: CalcMode; label: string }[] = [
    { key: 'paye', label: 'PAYE' },
    { key: 'vat', label: 'VAT' },
    { key: 'tot', label: 'Turnover Tax' },
    { key: 'mri', label: 'Rental Income' },
  ];

  // PAYE inputs
  grossSalary = 0;
  insurancePremium = 0;

  // VAT
  vatAmount = 0;
  vatInclusive = signal(true);

  // TOT
  totTurnover = 0;

  // MRI
  mriRent = 0;

  payeResult = computed(() => {
    const gross = this.grossSalary || 0;
    const nssf = Math.min(gross * 0.06, NSSF_TIER2);
    const taxableIncome = Math.max(gross - nssf, 0);

    let tax = 0;
    let remaining = taxableIncome;
    for (const bracket of PAYE_BRACKETS) {
      const range = Math.min(bracket.max, Infinity) - bracket.min + 1;
      const taxable = Math.min(remaining, range);
      if (taxable <= 0) break;
      tax += taxable * (bracket.rate / 100);
      remaining -= taxable;
    }

    const personalRelief = PERSONAL_RELIEF;
    const insuranceRelief = Math.min((this.insurancePremium || 0) * 0.15, INSURANCE_RELIEF_MAX);
    const paye = Math.max(tax - personalRelief - insuranceRelief, 0);

    const nhifAmount = NHIF_RATES.find(r => gross >= r.min && gross <= r.max)?.amount ?? 0;
    const netPay = gross - paye - nssf - nhifAmount;

    return {
      nssf: Math.round(nssf),
      taxableIncome: Math.round(taxableIncome),
      taxBeforeRelief: Math.round(tax),
      personalRelief,
      insuranceRelief: Math.round(insuranceRelief),
      paye: Math.round(paye),
      nhif: nhifAmount,
      netPay: Math.round(netPay),
    };
  });

  calculate() { /* triggers computed via ngModel change */ }

  fmt(n: number): string {
    return (n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
