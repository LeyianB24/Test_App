import { Component, signal, inject, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilingWizardShellComponent } from './shared/filing-wizard-shell.component';
import { FilingPrepopulationService, PrepopulationData } from '../../../../core/services/member/filing-prepopulation.service';
import { TaxReturnService } from '../../../../services/tax-return.service';

@Component({
  selector: 'app-it1-return-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilingWizardShellComponent],
  template: `
    <app-filing-wizard-shell
      title="Individual Income Tax (IT1) 2026"
      subtitle="Complete your annual tax return with eTIMS & P9 prepopulation"
      [steps]="steps"
      [currentStep]="currentStep()"
      [canContinue]="canProceed()"
      [isSubmitting]="isSubmitting()"
      (next)="next()"
      (back)="prev()"
      (submit)="submit()"
    >
      <!-- Step 0: Basic Info & Prepopulation -->
      @if (currentStep() === 0) {
        <div class="step-content animate-fade-in">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl font-black text-primary tracking-tight">Section A: Basic Information</h3>
            @if (loadingPreFill()) {
              <div class="flex items-center gap-3 text-[var(--color-info)] font-black text-[10px] uppercase tracking-widest">
                <div class="w-4 h-4 border-2 border-[var(--color-info)] border-t-transparent rounded-full animate-spin"></div>
                Syncing with KRA Systems...
              </div>
            }
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="glass-panel p-8">
              <label class="premium-subtitle !mt-0 !mb-4 uppercase tracking-widest text-[10px]">Tax Period</label>
              <div class="flex items-center gap-4 mt-2">
                <div class="p-4 bg-surface-2 rounded-2xl flex-grow font-black text-primary border border-subtle">
                  01/01/2026 — 31/12/2026
                </div>
                <div class="status-pill-precision online !px-4 !py-3">OPEN</div>
              </div>
            </div>

            <div class="glass-panel p-8">
              <label class="premium-subtitle !mt-0 !mb-4 uppercase tracking-widest text-[10px]">Filing Status</label>
              <div class="search-input-precision !w-full !px-6">
                <select class="w-full bg-transparent border-none appearance-none font-black text-xs text-primary focus:outline-none" [(ngModel)]="filingStatus">
                  <option value="Resident">Resident Individual</option>
                  <option value="Non-Resident">Non-Resident Individual</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Pre-population Alert -->
          @if (preFillData(); as data) {
            <div class="mt-8 p-8 glass-panel animate-scale-in border-[var(--color-info)]/20 bg-[var(--color-info)]/5">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 bg-[var(--color-info)]/10 text-[var(--color-info)] rounded-2xl flex items-center justify-center">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <div>
                  <h4 class="text-primary font-black text-lg">System Pre-population Ready</h4>
                  <p class="premium-subtitle !mt-0">We've found existing data for your PIN: {{ data.baseInfo.pin || 'A00---Z' }}</p>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div class="bg-surface-2 border border-subtle p-6 rounded-2xl">
                    <span class="text-[10px] uppercase font-black text-muted block mb-2 tracking-widest">Employment</span>
                    <span class="text-xl font-black text-primary">{{ data.incomeItems.length }} Records</span>
                 </div>
                 <div class="bg-surface-2 border border-subtle p-6 rounded-2xl">
                    <span class="text-[10px] uppercase font-black text-muted block mb-2 tracking-widest">eTIMS Sales</span>
                    <span class="text-xl font-black text-primary">KES 420.5K</span>
                 </div>
                 <div class="bg-surface-2 border border-subtle p-6 rounded-2xl">
                    <span class="text-[10px] uppercase font-black text-muted block mb-2 tracking-widest">Tax Credits</span>
                    <span class="text-xl font-black text-[var(--color-success)]">KES 12.8K</span>
                 </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Step 1: Income Details -->
      @if (currentStep() === 1) {
        <div class="step-content animate-fade-in">
          <h3 class="text-2xl font-black text-primary mb-8 tracking-tight">Section B: Income Details</h3>
          
          <div class="flex flex-col gap-8">
            <!-- Employment Income -->
            <div class="glass-panel p-8 relative overflow-hidden">
               <div class="absolute top-0 right-0 p-6">
                  <div class="status-pill-precision online !px-4 !py-2">PRE-FILLED</div>
               </div>
               <h4 class="text-primary font-black text-lg mb-8">Employment Income</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-4">
                    <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Gross Salary</label>
                    <div class="search-input-precision !w-full !px-6">
                       <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="income.employment" (ngModelChange)="recalculate()">
                    </div>
                  </div>
                  <div class="space-y-4">
                    <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Benefits (Non-Cash)</label>
                    <div class="search-input-precision !w-full !px-6">
                       <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="income.benefits" (ngModelChange)="recalculate()">
                    </div>
                  </div>
               </div>
            </div>

            <!-- Business/Other Income -->
            <div class="glass-panel p-8 border-dashed border-2 hover:border-[var(--color-accent)]/30 transition-all group">
               <h4 class="text-primary font-black text-lg mb-8">Business & Other Income</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-4">
                    <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Business Profit</label>
                    <div class="search-input-precision !w-full !px-6">
                       <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="income.business" (ngModelChange)="recalculate()">
                    </div>
                  </div>
                  <div class="space-y-4">
                    <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Rental Income (Gross)</label>
                    <div class="search-input-precision !w-full !px-6">
                       <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="income.rental" (ngModelChange)="recalculate()">
                    </div>
                  </div>
               </div>
               <div class="mt-8 flex justify-center">
                 <button class="btn-precision bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 hover:bg-[var(--color-success)] hover:text-white">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-3"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    INJECT FROM M-PESA ANALYSIS
                 </button>
               </div>
            </div>
          </div>
        </div>
      }

      <!-- Step 2: Deductions & Reliefs -->
      @if (currentStep() === 2) {
        <div class="step-content animate-fade-in">
          <h3 class="text-2xl font-black text-primary mb-8 tracking-tight">Section C: Deductions & Reliefs</h3>
          <div class="glass-panel p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div class="space-y-4">
                <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Pension Contributions (NSSF/Private)</label>
                <div class="search-input-precision !w-full !px-6">
                   <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="deductions.pension" (ngModelChange)="recalculate()">
                </div>
                <p class="text-[10px] text-muted mt-2 font-bold uppercase tracking-widest">Max deductible: KES 240,000 per annum</p>
             </div>
             <div class="space-y-4">
                <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Home Ownership Savings (HOSP)</label>
                <div class="search-input-precision !w-full !px-6">
                   <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="deductions.hosp" (ngModelChange)="recalculate()">
                </div>
             </div>
             <div class="space-y-4">
                <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Personal Relief (Fixed)</label>
                <div class="search-input-precision !w-full !px-6 bg-surface-3 border-transparent opacity-80 cursor-not-allowed">
                   <input type="number" class="!bg-transparent font-black w-full pointer-events-none" [(ngModel)]="reliefs.personal" readonly>
                </div>
             </div>
             <div class="space-y-4">
                <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Insurance Relief (NHIF/SHA/Life)</label>
                <div class="search-input-precision !w-full !px-6">
                   <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="reliefs.insurance" (ngModelChange)="recalculate()">
                </div>
             </div>
          </div>
        </div>
      }

      <!-- Step 3: Tax Computation -->
      @if (currentStep() === 3) {
        <div class="step-content animate-fade-in">
          <h3 class="text-2xl font-black text-primary mb-8 tracking-tight">Section D: Tax Computation</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="glass-panel p-8 space-y-4">
               <div class="flex justify-between p-4 border-b border-subtle">
                 <span class="premium-subtitle uppercase !mt-0">Total Actual Income</span>
                 <span class="text-primary font-black">KES {{ totalIncome() | number }}</span>
               </div>
               <div class="flex justify-between p-4 border-b border-subtle">
                 <span class="premium-subtitle uppercase !mt-0">Allowable Deductions</span>
                 <span class="text-[var(--color-info)] font-black">- KES {{ totalDeductions() | number }}</span>
               </div>
               <div class="flex justify-between p-4 bg-surface-2 rounded-2xl border border-subtle">
                 <span class="text-primary font-black uppercase tracking-widest text-xs">Taxable Income</span>
                 <span class="text-primary font-black underline decoration-[var(--color-accent)] underline-offset-4">KES {{ taxableIncome() | number }}</span>
               </div>
               <div class="flex justify-between p-4 border-b border-subtle">
                 <span class="premium-subtitle uppercase !mt-0">Tax Charged (Graduated)</span>
                 <span class="text-primary font-black">KES {{ grossTax() | number }}</span>
               </div>
               <div class="flex justify-between p-4 border-b border-subtle">
                 <span class="premium-subtitle uppercase !mt-0">Total Personal Reliefs</span>
                 <span class="text-[var(--color-success)] font-black">- KES {{ totalReliefs() | number }}</span>
               </div>
            </div>

            <div class="glass-panel p-10 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden relative">
               <div class="absolute top-0 right-0 p-8 opacity-40">
                  <div class="w-32 h-32 bg-[var(--color-accent)]/20 rounded-full blur-3xl"></div>
               </div>
               <span class="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)] mb-6 z-10 block">Tax Payable / Refund</span>
               <h2 class="text-6xl font-black tracking-tighter mb-4 z-10" [ngClass]="netTax() < 0 ? 'text-[var(--color-success)]' : 'text-primary'">
                 {{ netTax() < 0 ? '(' : '' }}KES {{ Math.abs(netTax()) | number }}{{ netTax() < 0 ? ')' : '' }}
               </h2>
               <p class="premium-subtitle max-w-[200px] z-10">
                 {{ netTax() > 0 ? 'Total tax amount due to KRA' : 'Estimated refund amount' }}
               </p>
            </div>
          </div>
        </div>
      }

      <!-- Step 4: Submission -->
      @if (currentStep() === 4) {
        <div class="step-content animate-fade-in flex flex-col items-center justify-center py-20 glass-panel">
           <h3 class="text-3xl font-black text-primary mb-4 tracking-tight">Ready for Filing</h3>
           <p class="premium-subtitle text-center max-w-md mb-12">
             You are about to submit your Individual Income Tax Return for the year 2026. This action is final.
           </p>
        </div>
      }

    </app-filing-wizard-shell>
  `,
  styles: [`
    .step-content { min-height: 450px; }
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out); }
  `]
})
export class It1ReturnWizardComponent implements OnInit {
  private preFillService = inject(FilingPrepopulationService);
  private taxService = inject(TaxReturnService);
  private router = inject(Router);

  Math = Math;
  steps = ['Information', 'Income', 'Deductions', 'Computation', 'Submit'];
  currentStep = signal(0);
  isSubmitting = signal(false);
  loadingPreFill = signal(false);
  preFillData = signal<PrepopulationData | null>(null);

  filingStatus = 'Resident';
  income = {
    employment: 0,
    benefits: 0,
    business: 0,
    rental: 0
  };
  deductions = {
    pension: 240000,
    hosp: 0
  };
  reliefs = {
    personal: 28800,
    insurance: 0
  };

  totalIncome = computed(() => this.income.employment + this.income.benefits + this.income.business + this.income.rental);
  totalDeductions = computed(() => Math.min(this.deductions.pension, 240000) + this.deductions.hosp);
  taxableIncome = computed(() => Math.max(0, this.totalIncome() - this.totalDeductions()));
  
  grossTax = computed(() => {
    const taxable = this.taxableIncome();
    if (taxable <= 288000) return taxable * 0.1;
    if (taxable <= 388000) return 28800 + (taxable - 288000) * 0.25;
    return 28800 + 25000 + (taxable - 388000) * 0.3;
  });

  totalReliefs = computed(() => this.reliefs.personal + this.reliefs.insurance);
  netTax = computed(() => Math.round(this.grossTax() - this.totalReliefs()));

  ngOnInit() {
    this.fetchPreFill();
  }

  fetchPreFill() {
    this.loadingPreFill.set(true);
    this.preFillService.getPrefillData('IT1', 2026).subscribe({
      next: (data) => {
        if (data) {
          this.preFillData.set(data);
          const empItem = data.incomeItems.find(i => i.category === 'Employment');
          if (empItem) this.income.employment = empItem.amount;
          
          const pRelief = data.reliefItems.find(i => i.category === 'Personal');
          if (pRelief) this.reliefs.personal = pRelief.amount;
        }
        this.loadingPreFill.set(false);
      },
      error: () => this.loadingPreFill.set(false)
    });
  }

  canProceed(): boolean {
    if (this.currentStep() === 0) return true;
    if (this.currentStep() === 1) return this.totalIncome() > 0;
    return true;
  }

  next() { this.currentStep.update(s => s + 1); }
  prev() { this.currentStep.update(s => s - 1); }
  recalculate() {}

  submit() {
    this.isSubmitting.set(true);
    const payload = {
      return_type: 'IT1',
      tax_year: 2026,
      taxpayer_id: 1,
      status: 'Submitted',
      calculations: {
        total_income: this.totalIncome(),
        taxable_income: this.taxableIncome(),
        net_tax: this.netTax()
      }
    };

    this.taxService.createReturn(payload as any).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/member/returns']);
      },
      error: () => this.isSubmitting.set(false)
    });
  }
}
