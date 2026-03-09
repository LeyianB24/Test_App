import { Component, signal, inject, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilingWizardShellComponent } from './shared/filing-wizard-shell.component';
import { FilingPrepopulationService } from '../../../../core/services/member/filing-prepopulation.service';
import { TaxReturnService } from '../../../../services/tax-return.service';

interface MonthlyTurnover {
  month: string;
  amount: number;
}

@Component({
  selector: 'app-tot-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilingWizardShellComponent],
  template: `
    <app-filing-wizard-shell
      title="Turnover Tax (TOT) Return"
      subtitle="Simplified quarterly tax for small businesses at 1% gross turnover"
      [steps]="steps"
      [currentStep]="currentStep()"
      [canContinue]="canProceed()"
      [isSubmitting]="isSubmitting()"
      (next)="next()"
      (back)="prev()"
      (submit)="submit()"
    >
      <!-- Step 0: Period & Selection -->
      @if (currentStep() === 0) {
        <div class="animate-fade-in">
          <div class="mb-8">
            <h2 class="premium-title">Filing Quarter</h2>
            <p class="text-slate-400 mt-2 text-sm">Select the tax quarter for this TOT return.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="glass-panel p-8">
               <div class="field-group">
                 <label class="field-label">Select Quarter</label>
                 <select class="input-modern" [(ngModel)]="selectedQuarter" (ngModelChange)="updateMonths()">
                   <option value="Q1">Quarter 1 (Jan - Mar 2026)</option>
                   <option value="Q2">Quarter 2 (Apr - Jun 2026)</option>
                   <option value="Q3">Quarter 3 (Jul - Sep 2026)</option>
                   <option value="Q4">Quarter 4 (Oct - Dec 2026)</option>
                 </select>
               </div>
            </div>
            <div class="glass-panel p-8 flex items-center gap-6 border-l-4 border-l-blue-500">
               <div class="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               </div>
               <div>
                  <h4 class="text-white font-semibold text-lg">TOT Criteria</h4>
                  <p class="text-slate-400 text-sm mt-1">Applicable for small businesses with turnover below KES 50,000,000.</p>
               </div>
            </div>
          </div>
        </div>
      }

      <!-- Step 1: Turnover Entry -->
      @if (currentStep() === 1) {
        <div class="animate-fade-in">
          <div class="mb-8">
            <h2 class="premium-title">Monthly Turnover Breakdown</h2>
            <p class="text-slate-400 mt-2 text-sm">Enter gross turnover for each month in the selected quarter.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (m of monthlyData(); track m.month) {
              <div class="glass-panel p-6 group hover:border-blue-500/30 transition-colors">
                <div class="field-group">
                  <label class="field-label">{{ m.month }}</label>
                  <div class="relative mt-2">
                     <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">KES</span>
                     <input type="number" class="input-modern pl-14" [(ngModel)]="m.amount" placeholder="0">
                  </div>
                </div>
              </div>
            }
          </div>
          
          <div class="mt-8 glass-panel p-8 text-center relative overflow-hidden">
             <div class="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5"></div>
             <div class="relative z-10">
               <span class="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 block">Total Quarter Turnover</span>
               <div class="text-4xl md:text-5xl font-bold text-white tracking-tight">KES {{ totalGross()| number }}</div>
             </div>
          </div>
        </div>
      }

      <!-- Step 2: TOT Summary -->
      @if (currentStep() === 2) {
        <div class="animate-fade-in flex flex-col items-center justify-center py-8">
           <div class="glass-panel p-10 w-full max-w-2xl text-center relative overflow-hidden group">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div class="relative z-10">
                 <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 mb-6">
                   <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 </div>
                 
                 <h2 class="premium-title mb-2">Tax Assessment Summary</h2>
                 <p class="text-slate-400 mb-8">Review your Turnover Tax calculation before submitting.</p>
                 
                 <div class="glass-panel p-6 mb-8 text-left space-y-4 bg-white/[0.02]">
                    <div class="flex justify-between items-center pb-4 border-b border-white/5">
                       <span class="text-slate-400">Turnover (Gross)</span>
                       <span class="text-white font-medium">KES {{ totalGross() | number }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                       <span class="text-slate-400">TOT Rate</span>
                       <span class="text-blue-400 font-medium">1.0%</span>
                    </div>
                 </div>

                 <div class="mb-8">
                   <div class="text-sm font-medium uppercase tracking-wider text-emerald-500 mb-2">Net Turnover Tax Due</div>
                   <div class="text-5xl md:text-6xl font-bold text-white tracking-tight mb-2">KES {{ totalTax() | number }}</div>
                 </div>
                 
                 <div class="inline-flex items-center gap-3 px-4 py-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500/90 text-sm">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>Deadline: 20th of the month following the quarter</span>
                 </div>
              </div>
           </div>
        </div>
      }
    </app-filing-wizard-shell>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TotWizardComponent implements OnInit {
  private taxService = inject(TaxReturnService);
  private router = inject(Router);

  steps = ['Period', 'Turnover', 'Summary'];
  currentStep = signal(0);
  isSubmitting = signal(false);

  selectedQuarter = 'Q1';
  monthlyData = signal<MonthlyTurnover[]>([]);

  totalGross = computed(() => this.monthlyData().reduce((acc, m) => acc + m.amount, 0));
  totalTax = computed(() => Math.round(this.totalGross() * 0.01));

  ngOnInit() {
    this.updateMonths();
  }

  updateMonths() {
    const qMonths: { [key: string]: string[] } = {
      'Q1': ['January', 'February', 'March'],
      'Q2': ['April', 'May', 'June'],
      'Q3': ['July', 'August', 'September'],
      'Q4': ['October', 'November', 'December']
    };
    this.monthlyData.set(qMonths[this.selectedQuarter].map(m => ({ month: m, amount: 0 })));
  }

  canProceed(): boolean {
    if (this.currentStep() === 1) return this.totalGross() > 0;
    return true;
  }

  next() { this.currentStep.update(s => s + 1); }
  prev() { this.currentStep.update(s => s - 1); }

  submit() {
    this.isSubmitting.set(true);
    const payload = {
      return_type: 'TOT',
      tax_year: 2026,
      taxpayer_id: 1,
      status: 'Submitted',
      calculations: {
        quarter: this.selectedQuarter,
        gross_turnover: this.totalGross(),
        net_tax: this.totalTax()
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
