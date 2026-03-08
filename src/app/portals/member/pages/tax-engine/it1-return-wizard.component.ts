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
            <h3 class="premium-heading">Section A: Basic Information</h3>
            @if (loadingPreFill()) {
              <div class="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest">
                <div class="spinner-sm"></div> Syncing with KRA Systems...
              </div>
            }
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="card-glass p-6">
              <label class="label-elite uppercase">Tax Period</label>
              <div class="flex items-center gap-4 mt-2">
                <div class="p-4 bg-slate-800 rounded-2xl flex-grow font-black text-white border border-white/5">
                  01/01/2026 — 31/12/2026
                </div>
                <div class="status-pill-elite bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Open</div>
              </div>
            </div>

            <div class="card-glass p-6">
              <label class="label-elite uppercase">Filing Status</label>
              <div class="flex items-center gap-4 mt-2">
                <select class="input-elite w-full font-black" [(ngModel)]="filingStatus">
                  <option value="Resident">Resident Individual</option>
                  <option value="Non-Resident">Non-Resident Individual</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Pre-population Alert -->
          @if (preFillData(); as data) {
            <div class="mt-8 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl animate-up">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <div>
                  <h4 class="text-white font-black text-lg">System Pre-population Ready</h4>
                  <p class="text-slate-400 text-xs font-medium">We've found existing data for your PIN: {{ data.baseInfo.pin || 'A00---Z' }}</p>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div class="mini-stat p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span class="block text-[10px] uppercase font-black text-slate-500 mb-1">Employment</span>
                  <span class="block text-white font-black">{{ data.incomeItems.length }} Records</span>
                </div>
                <div class="mini-stat p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span class="block text-[10px] uppercase font-black text-slate-500 mb-1">eTIMS Sales</span>
                  <span class="block text-white font-black">KES 420.5K</span>
                </div>
                <div class="mini-stat p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span class="block text-[10px] uppercase font-black text-slate-500 mb-1">Tax Credits</span>
                  <span class="block text-emerald-400 font-black">KES 12.8K</span>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Step 1: Income Details -->
      @if (currentStep() === 1) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section B: Income Details</h3>
          
          <div class="flex flex-col gap-6">
            <!-- Employment Income -->
            <div class="income-card p-8 bg-slate-800/50 rounded-[2rem] border border-white/5 relative overflow-hidden">
               <div class="absolute top-0 right-0 p-6">
                  <div class="status-pill-elite bg-blue-500/10 text-blue-400 border border-blue-400/20 uppercase text-[10px] font-black tracking-widest">Pre-filled</div>
               </div>
               <h4 class="text-white font-black text-xl mb-4">Employment Income</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div class="form-group">
                   <label class="label-elite">Gross Salary</label>
                   <input type="number" class="input-elite" [(ngModel)]="income.employment" (ngModelChange)="recalculate()">
                 </div>
                 <div class="form-group">
                   <label class="label-elite">Benefits (Non-Cash)</label>
                   <input type="number" class="input-elite" [(ngModel)]="income.benefits" (ngModelChange)="recalculate()">
                 </div>
               </div>
            </div>

            <!-- Business/Other Income -->
            <div class="income-card p-8 bg-slate-900/40 rounded-[2rem] border border-dashed border-white/10 group hover:border-blue-500/30 transition-all">
               <h4 class="text-white font-black text-xl mb-4">Business & Other Income</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-group">
                   <label class="label-elite">Business Profit</label>
                   <input type="number" class="input-elite" [(ngModel)]="income.business" (ngModelChange)="recalculate()">
                 </div>
                 <div class="form-group">
                   <label class="label-elite">Rental Income (Gross)</label>
                   <input type="number" class="input-elite" [(ngModel)]="income.rental" (ngModelChange)="recalculate()">
                 </div>
               </div>
               <div class="mt-8 flex justify-center">
                 <button class="btn-tool bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-emerald-500 hover:text-white transition-all">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    <span class="font-black text-xs uppercase tracking-widest">Inject from M-PESA Analysis</span>
                 </button>
               </div>
            </div>
          </div>
        </div>
      }

      <!-- Step 2: Deductions & Reliefs -->
      @if (currentStep() === 2) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section C: Deductions & Reliefs</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div class="form-group">
                <label class="label-elite">Pension Contributions (NSSF/Private)</label>
                <input type="number" class="input-elite" [(ngModel)]="deductions.pension" (ngModelChange)="recalculate()">
                <p class="text-[10px] text-slate-500 mt-2 font-bold uppercase">Max deductible: KES 240,000 per annum</p>
             </div>
             <div class="form-group">
                <label class="label-elite">Home Ownership Savings (HOSP)</label>
                <input type="number" class="input-elite" [(ngModel)]="deductions.hosp" (ngModelChange)="recalculate()">
             </div>
             <div class="form-group">
                <label class="label-elite">Personal Relief (Fixed)</label>
                <input type="number" class="input-elite bg-slate-800" [(ngModel)]="reliefs.personal" readonly>
             </div>
             <div class="form-group">
                <label class="label-elite">Insurance Relief (NHIF/SHA/Life)</label>
                <input type="number" class="input-elite" [(ngModel)]="reliefs.insurance" (ngModelChange)="recalculate()">
             </div>
          </div>
        </div>
      }

      <!-- Step 3: Tax Computation -->
      @if (currentStep() === 3) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section D: Tax Computation</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="calculation-breakdown space-y-4">
               <div class="calc-row flex justify-between p-4 border-b border-white/5">
                 <span class="text-slate-400 font-bold">Total Actual Income</span>
                 <span class="text-white font-black">KES {{ totalIncome() | number }}</span>
               </div>
               <div class="calc-row flex justify-between p-4 border-b border-white/5">
                 <span class="text-slate-400 font-bold">Allowable Deductions</span>
                 <span class="text-red-400 font-black">- KES {{ totalDeductions() | number }}</span>
               </div>
               <div class="calc-row flex justify-between p-4 bg-white/5 rounded-2xl">
                 <span class="text-slate-200 font-black">Taxable Income</span>
                 <span class="text-white font-black underline decoration-blue-500 underline-offset-4">KES {{ taxableIncome() | number }}</span>
               </div>
               <div class="calc-row flex justify-between p-4 border-b border-white/5">
                 <span class="text-slate-400 font-bold">Tax Charged (Graduated)</span>
                 <span class="text-white font-black">KES {{ grossTax() | number }}</span>
               </div>
               <div class="calc-row flex justify-between p-4 border-b border-white/5">
                 <span class="text-slate-400 font-bold">Total Personal Reliefs</span>
                 <span class="text-emerald-400 font-black">- KES {{ totalReliefs() | number }}</span>
               </div>
            </div>

            <div class="net-tax-card p-10 bg-slate-800 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center text-center shadow-2xl shadow-blue-500/10">
               <span class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Tax Payable / Refund</span>
               <h2 class="text-6xl font-black text-white mb-2" [class.text-emerald-400]="netTax() < 0">
                 {{ netTax() < 0 ? '(' : '' }}KES {{ Math.abs(netTax()) | number }}{{ netTax() < 0 ? ')' : '' }}
               </h2>
               <p class="text-slate-400 font-bold max-w-[200px]">
                 {{ netTax() > 0 ? 'Total tax amount due to KRA' : 'Estimated refund amount' }}
               </p>
            </div>
          </div>
        </div>
      }

      <!-- Step 4: Submission -->
      @if (currentStep() === 4) {
        <div class="step-content animate-fade-in flex flex-col items-center justify-center py-20">
           <h3 class="text-3xl font-black text-white mb-4">Ready for Filing</h3>
           <p class="text-slate-400 text-center max-w-md font-medium mb-12">
             You are about to submit your Individual Income Tax Return for the year 2026. This action is final.
           </p>
        </div>
      }

    </app-filing-wizard-shell>
  `,
  styles: [`
    .step-content { min-height: 450px; }
    .premium-heading { font-size: 1.5rem; font-weight: 950; color: #FFFFFF; letter-spacing: -1px; }
    .label-elite { display: block; font-size: 0.65rem; font-weight: 900; color: #64748B; letter-spacing: 1px; margin-bottom: 8px; }
    .card-glass { background: rgba(30, 41, 59, 1); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; }
    .input-elite { 
      width: 100%; padding: 16px 20px; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px; color: white; font-weight: 800; outline: none; transition: 0.3s;
    }
    .input-elite:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
    .status-pill-elite { padding: 4px 12px; border-radius: 10px; font-size: 0.65rem; font-weight: 900; }
    
    .spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(59, 130, 246, 0.2); border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
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
