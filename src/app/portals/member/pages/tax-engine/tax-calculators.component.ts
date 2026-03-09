import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
const NSSF_TIER1 = 420;   // 6% of 7000 (2026 rates)
const NSSF_TIER2 = 2160;  // 6% of 36000 (2026 rates)
const NHIF_RATES: { min: number; max: number; amount: number }[] = [
  { min: 0, max: 5999, amount: 150 }, { min: 6000, max: 7999, amount: 300 },
  { min: 8000, max: 11999, amount: 400 }, { min: 12000, max: 14999, amount: 500 },
  { min: 15000, max: 19999, amount: 600 }, { min: 20000, max: 24999, amount: 750 },
  { min: 25000, max: 29999, amount: 850 }, { min: 30000, max: 34999, amount: 900 },
  { min: 35000, max: 39999, amount: 950 }, { min: 40000, max: 44999, amount: 1000 },
  { min: 45000, max: 49999, amount: 1100 }, { min: 50000, max: 59999, amount: 1200 },
  { min: 60000, max: 69999, amount: 1300 }, { min: 70000, max: 79999, amount: 1400 },
  { min: 8000, max: 89999, amount: 1500 }, { min: 90000, max: 99999, amount: 1600 },
  { min: 100000, max: Infinity, amount: 1700 },
];

type CalcMode = 'paye' | 'vat' | 'tot' | 'mri';

@Component({
  selector: 'app-tax-calculators',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-[1200px] mx-auto p-4 md:p-8">
      <header class="mb-10 text-center md:text-left">
        <h1 class="premium-title mb-2">Tax Calculators</h1>
        <p class="text-slate-400 text-lg">Kenya Revenue Authority 2026 tax computation tools</p>
      </header>

      <!-- Mode Tabs -->
      <div class="flex flex-wrap gap-3 mb-10 pb-4 border-b border-white/5">
        @for (tab of tabs; track tab.key) {
          <button 
            (click)="mode.set(tab.key)"
            class="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 pointer"
            [ngClass]="mode() === tab.key ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-white/5'"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- PAYE Calculator -->
      @if (mode() === 'paye') {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in relative">
          <!-- Input Side -->
          <div class="glass-panel p-8 space-y-6">
            <div class="flex items-center gap-4 mb-8">
               <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
               </div>
               <h3 class="premium-subtitle m-0">Monthly PAYE Calculator (2026)</h3>
            </div>
            
            <div class="field-group">
              <label class="field-label">Gross Monthly Salary (KES)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">KES</span>
                <input type="number" [(ngModel)]="grossSalary" (ngModelChange)="calculate()" class="input-modern pl-14" placeholder="0">
              </div>
            </div>
            
            <div class="field-group">
              <label class="field-label">Insurance Premium / Month (KES)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">KES</span>
                <input type="number" [(ngModel)]="insurancePremium" (ngModelChange)="calculate()" class="input-modern pl-14" placeholder="0">
              </div>
              <p class="text-xs text-slate-500 mt-2">Optional limit. Maximum relief KES 5,000.</p>
            </div>
            
            <div class="mt-8 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
               <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Statutory Rates Applied</h4>
               <ul class="space-y-3">
                 <li class="text-sm font-medium text-slate-300 flex justify-between items-center">
                    <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> SHA (Social Health Auth)</span> 
                    <span class="text-white">2.75%</span>
                 </li>
                 <li class="text-sm font-medium text-slate-300 flex justify-between items-center">
                    <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Housing Levy</span> 
                    <span class="text-white">1.5%</span>
                 </li>
                 <li class="text-sm font-medium text-slate-300 flex justify-between items-center">
                    <span class="flex items-center gap-2"><div class="w-1.5 h-1.5 rounded-full bg-slate-500"></div> NSSF Tier II</span> 
                    <span class="text-white">KES 2,160</span>
                 </li>
               </ul>
            </div>
          </div>

          <!-- Result Side -->
          <div class="glass-panel p-8 flex flex-col relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div class="relative z-10 flex flex-col h-full">
              <h3 class="premium-subtitle mb-6">Net Pay Breakdown</h3>
              
              <div class="flex-grow space-y-2">
                <div class="flex justify-between items-center p-3 rounded-xl bg-white/[0.02]">
                  <span class="text-slate-400">Gross Salary</span>
                  <span class="text-white font-semibold">{{ fmt(grossSalary) }}</span>
                </div>
                
                <div class="flex justify-between items-center p-3 rounded-xl border border-red-500/10 mb-1">
                  <span class="text-slate-400">NSSF Deduction</span>
                  <span class="text-red-400">- {{ fmt(payeResult().nssf) }}</span>
                </div>
                
                <div class="flex justify-between items-center p-3 rounded-xl border border-blue-500/10 mb-1">
                  <span class="text-slate-400">SHA Remittance (2.75%)</span>
                  <span class="text-blue-400">- {{ fmt(payeResult().sha) }}</span>
                </div>
                
                <div class="flex justify-between items-center p-3 rounded-xl border border-amber-500/10 mb-1">
                  <span class="text-slate-400">Housing Levy (1.5%)</span>
                  <span class="text-amber-400">- {{ fmt(payeResult().housingLevy) }}</span>
                </div>
                
                <div class="h-px bg-white/10 my-4"></div>
                
                <div class="flex justify-between items-center p-3">
                  <span class="text-slate-400">Taxable Income</span>
                  <span class="text-white font-bold">{{ fmt(payeResult().taxableIncome) }}</span>
                </div>
                
                <div class="flex justify-between items-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-2">
                  <span class="text-amber-500 font-medium">PAYE (Tax Payable)</span>
                  <span class="text-amber-400 font-bold">{{ fmt(payeResult().paye) }}</span>
                </div>
              </div>
              
              <div class="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span class="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-2">NET TAKE-HOME</span>
                <span class="text-4xl font-bold text-white tracking-tight">{{ fmt(payeResult().netPay) }}</span>
              </div>
              
              <button routerLink="/member/tax-engine/file/paye" class="btn-primary w-full mt-6 py-4 justify-center">
                 Proceed to File P10 Return
              </button>
            </div>
          </div>
        </div>
      }

      <!-- VAT Calculator -->
      @if (mode() === 'vat') {
        <div class="glass-panel p-8 max-w-2xl mx-auto animate-fade-in text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 mb-6">
             <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="premium-subtitle mb-8 text-center">VAT Calculator (16%)</h3>
          
          <div class="field-group text-left mb-8">
            <label class="field-label">Amount (KES)</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">KES</span>
              <input type="number" [(ngModel)]="vatAmount" class="input-modern pl-14 text-lg" placeholder="Enter amount">
            </div>
          </div>
          
          <div class="flex gap-4 justify-center mb-8">
            <button class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors" [ngClass]="vatInclusive() ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'" (click)="vatInclusive.set(true)">VAT Inclusive</button>
            <button class="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors" [ngClass]="!vatInclusive() ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'" (click)="vatInclusive.set(false)">VAT Exclusive</button>
          </div>
          
          <div class="space-y-3 text-left">
            @if (vatInclusive()) {
              <div class="flex justify-between p-4 rounded-xl bg-white/[0.02]">
                 <span class="text-slate-400">VAT Inclusive Amount</span>
                 <span class="text-white font-medium">{{ fmt(vatAmount) }}</span>
              </div>
              <div class="flex justify-between p-4 rounded-xl border border-red-500/10">
                 <span class="text-slate-400">VAT (16%)</span>
                 <span class="text-red-400 font-medium">{{ fmt(vatAmount - vatAmount / 1.16) }}</span>
              </div>
              <div class="flex justify-between p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mt-4">
                 <span class="text-emerald-500 font-semibold">Excluding VAT</span>
                 <span class="text-emerald-400 font-bold text-xl">{{ fmt(vatAmount / 1.16) }}</span>
              </div>
            } @else {
              <div class="flex justify-between p-4 rounded-xl bg-white/[0.02]">
                 <span class="text-slate-400">Excluding VAT</span>
                 <span class="text-white font-medium">{{ fmt(vatAmount) }}</span>
              </div>
              <div class="flex justify-between p-4 rounded-xl border border-red-500/10">
                 <span class="text-slate-400">VAT (16%)</span>
                 <span class="text-red-400 font-medium">{{ fmt(vatAmount * 0.16) }}</span>
              </div>
              <div class="flex justify-between p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mt-4">
                 <span class="text-emerald-500 font-semibold">VAT Inclusive</span>
                 <span class="text-emerald-400 font-bold text-xl">{{ fmt(vatAmount * 1.16) }}</span>
              </div>
            }
          </div>
          
          <button routerLink="/member/tax-engine/file/vat" class="btn-primary w-full mt-8 py-4 justify-center">
             Open VAT Filing Wizard
          </button>
        </div>
      }

      <!-- TOT Calculator -->
      @if (mode() === 'tot') {
        <div class="glass-panel p-8 max-w-2xl mx-auto animate-fade-in text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 mb-6">
             <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <h3 class="premium-subtitle mb-2 text-center">Turnover Tax Calculator</h3>
          <p class="text-slate-400 text-sm mb-8">For Micro & Small Enterprises (1.0% Rate for 2026)</p>
          
          <div class="field-group text-left mb-8">
            <label class="field-label">Quarterly Turnover (KES)</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">KES</span>
              <input type="number" [(ngModel)]="totTurnover" class="input-modern pl-14 text-lg" placeholder="0">
            </div>
          </div>
          
          <div class="space-y-3 text-left">
            <div class="flex justify-between p-4 rounded-xl bg-white/[0.02]">
               <span class="text-slate-400">Gross Turnover</span>
               <span class="text-white font-medium">{{ fmt(totTurnover) }}</span>
            </div>
            <div class="flex justify-between p-4 rounded-xl border border-blue-500/10">
               <span class="text-slate-400">TOT Rate</span>
               <span class="text-blue-400 font-medium">1.0%</span>
            </div>
            <div class="flex justify-between p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-4">
               <span class="text-amber-500 font-semibold">TOT Payable</span>
               <span class="text-amber-400 font-bold text-xl">{{ fmt(totTurnover * 0.01) }}</span>
            </div>
          </div>
          
          <button routerLink="/member/tax-engine/file/tot" class="btn-primary w-full mt-8 py-4 justify-center">
             File Quarterly TOT Return
          </button>
        </div>
      }

      <!-- MRI Calculator -->
      @if (mode() === 'mri') {
        <div class="glass-panel p-8 max-w-2xl mx-auto animate-fade-in text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 text-violet-400 mb-6">
             <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </div>
          <h3 class="premium-subtitle mb-8 text-center">Monthly Rental Income Tax (7.5%)</h3>
          
          <div class="field-group text-left mb-8">
            <label class="field-label">Monthly Rent Received (KES)</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">KES</span>
              <input type="number" [(ngModel)]="mriRent" class="input-modern pl-14 text-lg" placeholder="0">
            </div>
          </div>
          
          <div class="space-y-3 text-left">
            <div class="flex justify-between p-4 rounded-xl bg-white/[0.02]">
               <span class="text-slate-400">Gross Rent</span>
               <span class="text-white font-medium">{{ fmt(mriRent) }}</span>
            </div>
            <div class="flex justify-between p-4 rounded-xl border border-blue-500/10">
               <span class="text-slate-400">MRI Tax Rate</span>
               <span class="text-blue-400 font-medium">7.5%</span>
            </div>
            <div class="flex justify-between p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-4">
               <span class="text-amber-500 font-semibold">Monthly Tax Due</span>
               <span class="text-amber-400 font-bold text-xl">{{ fmt(mriRent * 0.075) }}</span>
            </div>
          </div>
          
          <button routerLink="/member/tax-engine/file/mri" class="btn-primary w-full mt-8 py-4 justify-center">
             File MRI Return
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
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

    const sha = gross * 0.0275;
    const housingLevy = gross * 0.015;
    const netPay = gross - paye - nssf - sha - housingLevy;

    return {
      nssf: Math.round(nssf),
      taxableIncome: Math.round(taxableIncome),
      taxBeforeRelief: Math.round(tax),
      personalRelief,
      insuranceRelief: Math.round(insuranceRelief),
      paye: Math.round(paye),
      sha: Math.round(sha),
      housingLevy: Math.round(housingLevy),
      netPay: Math.round(netPay),
    };
  });

  calculate() { /* triggers computed via ngModel change */ }

  fmt(n: number): string {
    return (n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
