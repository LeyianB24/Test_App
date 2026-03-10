import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface TaxBracket { min: number; max: number; rate: number; }

// KRA 2026 PAYE brackets
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

type CalcMode = 'paye' | 'vat' | 'tot' | 'mri';

@Component({
  selector: 'app-tax-calculators',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              STATUTORY COMPUTATION ENGINE
            </span>
          </div>
          <h1 class="premium-title">Tax <span class="gradient-text">Calculators</span></h1>
          <p class="premium-subtitle">Authorized 2026 fiscal computation tools for accurate statutory obligation projections</p>
        </div>
      </header>

      <!-- Strategy Selector -->
      <div class="flex flex-wrap gap-4 mb-12 pb-6 border-b border-white/5 relative z-20">
        @for (tab of tabs; track tab.key) {
          <button 
            (click)="mode.set(tab.key)"
            class="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 relative overflow-hidden group shadow-xl"
            [class.bg-blue-600]="mode() === tab.key"
            [class.text-white]="mode() === tab.key"
            [class.shadow-blue-500/20]="mode() === tab.key"
            [class.bg-slate-900]="mode() !== tab.key"
            [class.text-slate-500]="mode() !== tab.key"
            [class.border]="mode() !== tab.key"
            [class.border-white/5]="mode() !== tab.key"
            [class.hover:bg-white/5]="mode() !== tab.key"
          >
            {{ tab.label }} Protocol
          </button>
        }
      </div>

      <!-- PAYE Discovery -->
      @if (mode() === 'paye') {
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-10 animate-up">
          <!-- Input Parameters -->
          <div class="glass-panel p-10 space-y-10 relative overflow-hidden bg-white/[0.01]">
            <div class="absolute -left-24 -top-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
            
            <div class="flex items-center gap-6 relative z-10">
               <div class="w-14 h-14 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-blue-400 shadow-2xl">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
               </div>
               <h3 class="text-xs font-black text-white uppercase tracking-widest">Monthly PAYE Parameters (2026 Archive)</h3>
            </div>
            
            <div class="space-y-8 relative z-10">
               <div class="form-group">
                 <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Gross Monthly Liquidity (KES)</label>
                 <div class="relative">
                   <span class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-black text-xs">KES</span>
                   <input type="number" [(ngModel)]="grossSalary" (ngModelChange)="calculate()" class="form-input bg-slate-950 border-white/5 text-white rounded-xl pl-16 py-5 font-black text-lg focus:border-blue-500/50 transition-all shadow-2xl" placeholder="0.00">
                 </div>
               </div>
               
               <div class="form-group">
                 <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Insurance Premium Outflow (KES)</label>
                 <div class="relative">
                   <span class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-black text-xs">KES</span>
                   <input type="number" [(ngModel)]="insurancePremium" (ngModelChange)="calculate()" class="form-input bg-slate-950 border-white/5 text-white rounded-xl pl-16 py-5 font-black text-lg focus:border-blue-500/50 transition-all shadow-2xl" placeholder="0.00">
                 </div>
                 <p class="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-2 px-2 opacity-50 text-right">MAX STATUTORY RELIEF: KES 5,000</p>
               </div>
            </div>
            
            <div class="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] relative z-10">
               <h4 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Automated Statutory Deductions</h4>
               <ul class="space-y-4">
                 <li class="flex justify-between items-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                       <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> SHA Remittance
                    </span> 
                    <span class="text-[10px] font-black text-white uppercase tracking-widest">2.75% OF GROSS</span>
                 </li>
                 <li class="flex justify-between items-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                       <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Housing Levy
                    </span> 
                    <span class="text-[10px] font-black text-white uppercase tracking-widest">1.50% OF GROSS</span>
                 </li>
                 <li class="flex justify-between items-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                       <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span> NSSF Tier II
                    </span> 
                    <span class="text-[10px] font-black text-white uppercase tracking-widest">KES 2,160.00</span>
                 </li>
               </ul>
            </div>
          </div>

          <!-- Analysis Projection -->
          <div class="glass-panel p-10 flex flex-col relative overflow-hidden group bg-white/[0.01]">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/[0.03] to-red-600/[0.03] opacity-50 transition-all duration-1000"></div>
            
            <div class="relative z-10 flex flex-col h-full">
              <h3 class="text-xs font-black text-white uppercase tracking-widest mb-10">Statutory Net Liquidity Projection</h3>
              
              <div class="flex-grow space-y-3">
                <div class="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Liquidity</span>
                  <span class="text-white font-black text-sm tabular-nums tracking-tighter">{{ fmt(grossSalary) }}</span>
                </div>
                
                <div class="flex justify-between items-center p-5 rounded-2xl border border-red-500/10 hover:bg-red-500/[0.02] transition-colors">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">NSSF Remittance</span>
                  <span class="text-red-500 font-black text-sm tabular-nums tracking-tighter">- {{ fmt(payeResult().nssf) }}</span>
                </div>
                
                <div class="flex justify-between items-center p-5 rounded-2xl border border-blue-500/10 hover:bg-blue-500/[0.02] transition-colors">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">SHA Authority (2.75%)</span>
                  <span class="text-blue-500 font-black text-sm tabular-nums tracking-tighter">- {{ fmt(payeResult().sha) }}</span>
                </div>
                
                <div class="flex justify-between items-center p-5 rounded-2xl border border-amber-500/10 hover:bg-amber-500/[0.02] transition-colors">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Housing Levy (1.5%)</span>
                  <span class="text-amber-500 font-black text-sm tabular-nums tracking-tighter">- {{ fmt(payeResult().housingLevy) }}</span>
                </div>
                
                <div class="h-px bg-white/5 my-10 relative flex justify-center items-center">
                   <div class="absolute px-6 bg-slate-950 text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Subtotal Projection</div>
                </div>
                
                <div class="flex justify-between items-center p-5">
                  <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Taxable Archive Base</span>
                  <span class="text-white font-black text-md tabular-nums tracking-tighter">{{ fmt(payeResult().taxableIncome) }}</span>
                </div>
                
                <div class="flex justify-between items-center p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 shadow-2xl shadow-amber-500/10">
                  <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest">PAYE LIABILITY (OBLIGATION)</span>
                  <span class="text-amber-400 font-black text-xl tabular-nums tracking-tighter">{{ fmt(payeResult().paye) }}</span>
                </div>
              </div>
              
              <div class="mt-12 p-10 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 text-center relative overflow-hidden group">
                <div class="absolute -right-12 -bottom-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                <span class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] block mb-4 relative z-10">Net Statutory Liquidity (Take-Home)</span>
                <span class="text-5xl font-black text-white tracking-tighter tabular-nums relative z-10"><span class="text-xs text-slate-600 mr-2">KES</span>{{ fmt(payeResult().netPay) }}</span>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- VAT Computation -->
      @if (mode() === 'vat') {
        <div class="glass-panel p-20 lg:p-32 max-w-4xl mx-auto animate-up text-center !rounded-[4rem] relative overflow-hidden bg-white/[0.01] border-white/5 transition-all hover:border-blue-500/20">
          <div class="absolute inset-0 bg-blue-600/[0.01] pointer-events-none"></div>
          
          <div class="w-24 h-24 bg-slate-950 border border-white/5 text-blue-400 rounded-3xl flex items-center justify-center mb-10 mx-auto shadow-2xl relative z-10">
             <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 class="text-3xl font-black text-white mb-4 tracking-tighter uppercase relative z-10">VAT Computation Matrix (16.0%)</h3>
          <p class="text-slate-500 max-w-md mx-auto mb-16 text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-70 relative z-10">Standard statutory rate applied for synchronized Value Added Tax declarations.</p>
          
          <div class="max-w-md mx-auto space-y-12 relative z-10">
            <div class="form-group text-left">
              <label class="block text-slate-500 mb-4 font-black text-[10px] uppercase tracking-[0.2em] text-center">Liquidity Amount (KES)</label>
              <div class="relative">
                <span class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-black text-xs">KES</span>
                <input type="number" [(ngModel)]="vatAmount" class="form-input bg-slate-950 border-white/5 text-white rounded-[1.5rem] pl-16 py-6 font-black text-2xl text-center focus:border-blue-500/50 transition-all shadow-2xl" placeholder="0.00">
              </div>
            </div>
            
            <div class="flex gap-4 p-1 bg-slate-950 border border-white/5 rounded-2xl mx-auto w-fit">
              <button class="px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all" [class.bg-white]="vatInclusive()" [class.text-slate-950]="vatInclusive()" [class.text-slate-600]="!vatInclusive()" (click)="vatInclusive.set(true)">VAT Inclusive</button>
              <button class="px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all" [class.bg-white]="!vatInclusive()" [class.text-slate-950]="!vatInclusive()" [class.text-slate-600]="vatInclusive()" (click)="vatInclusive.set(false)">VAT Exclusive</button>
            </div>
            
            <div class="space-y-4 pt-10">
              @if (vatInclusive()) {
                <div class="flex justify-between items-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                   <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Liquidity</span>
                   <span class="text-white font-black text-lg tabular-nums tracking-tighter">{{ fmt(vatAmount) }}</span>
                </div>
                <div class="flex justify-between items-center p-6 rounded-2xl border border-red-500/10">
                   <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">VAT Liability (16%)</span>
                   <span class="text-red-500 font-black text-lg tabular-nums tracking-tighter">{{ fmt(vatAmount - vatAmount / 1.16) }}</span>
                </div>
                <div class="flex justify-between items-center p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 mt-8 shadow-2xl shadow-emerald-500/10">
                   <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest font-bold">Base Fiscal Value</span>
                   <span class="text-emerald-400 font-black text-3xl tabular-nums tracking-tighter">{{ fmt(vatAmount / 1.16) }}</span>
                </div>
              } @else {
                <div class="flex justify-between items-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                   <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Fiscal Value</span>
                   <span class="text-white font-black text-lg tabular-nums tracking-tighter">{{ fmt(vatAmount) }}</span>
                </div>
                <div class="flex justify-between items-center p-6 rounded-2xl border border-red-500/10">
                   <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">VAT OBLIGATION (16%)</span>
                   <span class="text-red-500 font-black text-lg tabular-nums tracking-tighter">{{ fmt(vatAmount * 0.16) }}</span>
                </div>
                <div class="flex justify-between items-center p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 mt-8 shadow-2xl shadow-emerald-500/10">
                   <span class="text-[10px] font-black text-emerald-500 uppercase tracking-widest font-bold">Gross Statutory Total</span>
                   <span class="text-emerald-400 font-black text-3xl tabular-nums tracking-tighter">{{ fmt(vatAmount * 1.16) }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Other Calculators (TOT/MRI) follow same Elite pattern -->
      @if (mode() === 'tot' || mode() === 'mri') {
         <div class="glass-panel p-20 lg:p-32 max-w-4xl mx-auto animate-up text-center !rounded-[4rem] relative overflow-hidden bg-white/[0.01] border-white/5 transition-all hover:border-blue-500/20">
            <div class="w-24 h-24 bg-slate-950 border border-white/5 rounded-3xl flex items-center justify-center mb-10 mx-auto shadow-2xl relative z-10">
               <svg class="w-10 h-10" [class.text-indigo-400]="mode() === 'tot'" [class.text-violet-400]="mode() === 'mri'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path *ngIf="mode() === 'tot'" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  <path *ngIf="mode() === 'mri'" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
               </svg>
            </div>
            <h3 class="text-3xl font-black text-white mb-4 tracking-tighter uppercase relative z-10">{{ mode() === 'tot' ? 'Turnover Tax' : 'Rental Income' }} Archive Engine</h3>
            <p class="text-slate-500 max-w-md mx-auto mb-16 text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-70 relative z-10">
               {{ mode() === 'tot' ? 'Statutory 1.0% rate for Micro & Small Enterprise commercial liquidity.' : 'Authorized 7.5% gross liquidation for residential asset receipts.' }}
            </p>

            <div class="max-w-md mx-auto space-y-12 relative z-10">
               <div class="form-group text-left">
                  <label class="block text-slate-500 mb-4 font-black text-[10px] uppercase tracking-[0.2em] text-center">Gross Archive Liquidity (KES)</label>
                  <div class="relative">
                    <span class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-black text-xs">KES</span>
                    <input type="number" [(ngModel)]="mode() === 'tot' ? totTurnover : mriRent" class="form-input bg-slate-950 border-white/5 text-white rounded-[1.5rem] pl-16 py-6 font-black text-2xl text-center focus:border-blue-500/50 transition-all shadow-2xl" placeholder="0.00">
                  </div>
               </div>

               <div class="space-y-4 pt-10">
                  <div class="flex justify-between items-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                     <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gross Fiscal Total</span>
                     <span class="text-white font-black text-lg tabular-nums tracking-tighter">{{ fmt(mode() === 'tot' ? totTurnover : mriRent) }}</span>
                  </div>
                  <div class="flex justify-between items-center p-6 rounded-2xl border border-blue-500/10">
                     <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Statutory Applied Rate</span>
                     <span class="text-blue-500 font-black text-lg tabular-nums tracking-tighter">{{ mode() === 'tot' ? '1.0%' : '7.5%' }}</span>
                  </div>
                  <div class="flex justify-between items-center p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/20 mt-8 shadow-2xl shadow-amber-500/10">
                     <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest font-bold">PROJECTED OBLIGATION</span>
                     <span class="text-amber-400 font-black text-3xl tabular-nums tracking-tighter">{{ fmt((mode() === 'tot' ? totTurnover : mriRent) * (mode() === 'tot' ? 0.01 : 0.075)) }}</span>
                  </div>
               </div>
            </div>
         </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxCalculatorsComponent {
  mode = signal<CalcMode>('paye');
  tabs: { key: CalcMode; label: string }[] = [
    { key: 'paye', label: 'PAYE (Individual)' },
    { key: 'vat', label: 'VAT (Standard)' },
    { key: 'tot', label: 'Turnover (MSE)' },
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

  calculate() { }

  fmt(n: number): string {
    return (n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
