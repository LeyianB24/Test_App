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
  standalone: true,
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
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section 1: Filing Quarter</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="card-glass p-8">
               <label class="label-elite uppercase">Select Quarter</label>
               <select class="input-elite w-full font-black mt-2" [(ngModel)]="selectedQuarter" (ngModelChange)="updateMonths()">
                 <option value="Q1">Quarter 1 (Jan - Mar 2026)</option>
                 <option value="Q2">Quarter 2 (Apr - Jun 2026)</option>
                 <option value="Q3">Quarter 3 (Jul - Sep 2026)</option>
                 <option value="Q4">Quarter 4 (Oct - Dec 2026)</option>
               </select>
            </div>
            <div class="card-glass p-8 flex items-center gap-6">
               <div class="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               </div>
               <div>
                  <h4 class="text-white font-black">TOT Criteria</h4>
                  <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Small businesses below KES 50M turnover</p>
               </div>
            </div>
          </div>
        </div>
      }

      <!-- Step 1: Turnover Entry -->
      @if (currentStep() === 1) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section 2: Monthly Turnover Breakdown</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (m of monthlyData(); track m.month) {
              <div class="card-glass p-6 group hover:border-blue-500/30 transition-all">
                <label class="label-elite">{{ m.month }}</label>
                <div class="relative mt-2">
                   <span class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">KES</span>
                   <input type="number" class="input-elite pl-16" [(ngModel)]="m.amount">
                </div>
              </div>
            }
          </div>
          
          <div class="mt-12 p-8 bg-blue-500/5 border border-blue-500/10 rounded-[3rem] text-center">
             <span class="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-2 block">Total Quarter Turnover</span>
             <h2 class="text-5xl font-black text-white">KES {{ totalGross()| number }}</h2>
          </div>
        </div>
      }

      <!-- Step 2: TOT Summary -->
      @if (currentStep() === 2) {
        <div class="step-content animate-fade-in flex flex-col items-center justify-center">
           <div class="summary-hex p-16 bg-slate-800 rounded-[5rem] border border-white/10 w-full max-w-2xl text-center shadow-2xl relative overflow-hidden">
              <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
              
              <div class="relative z-10">
                 <span class="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-8 block">Tax Assessment Summary</span>
                 
                 <div class="flex flex-col gap-4 mb-10">
                    <div class="flex justify-between p-4 border-b border-white/5">
                       <span class="text-slate-400 font-bold">Turnover (Gross)</span>
                       <span class="text-white font-black">KES {{ totalGross() | number }}</span>
                    </div>
                    <div class="flex justify-between p-4 border-b border-white/5">
                       <span class="text-slate-400 font-bold">TOT Rate</span>
                       <span class="text-blue-400 font-black">1.0%</span>
                    </div>
                 </div>

                 <h2 class="text-7xl font-black text-white mb-2">KES {{ totalTax() | number }}</h2>
                 <p class="text-xs font-black uppercase tracking-widest text-emerald-500">Net Turnover Tax Due</p>
                 
                 <div class="mt-12 flex items-center gap-3 justify-center p-4 bg-white/5 rounded-2xl">
                    <svg width="20" height="20" fill="#F59E0B" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    <span class="text-[10px] text-amber-500 font-black uppercase">Deadline: 20th of the month following the quarter</span>
                 </div>
              </div>
           </div>
        </div>
      }
    </app-filing-wizard-shell>
  `,
  styles: [`
    .step-content { min-height: 500px; }
    .premium-heading { font-size: 1.5rem; font-weight: 950; color: #FFFFFF; letter-spacing: -1px; }
    .label-elite { display: block; font-size: 0.65rem; font-weight: 900; color: #64748B; letter-spacing: 1px; margin-bottom: 8px; }
    .card-glass { background: rgba(30, 41, 59, 1); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; }
    .input-elite { 
      width: 100%; padding: 16px 20px; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px; color: white; font-weight: 800; outline: none; transition: 0.3s;
    }
    .input-elite:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
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
