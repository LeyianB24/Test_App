import { Component, signal, inject, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilingWizardShellComponent } from './shared/filing-wizard-shell.component';
import { FilingPrepopulationService } from '../../../../core/services/member/filing-prepopulation.service';
import { TaxReturnService } from '../../../../services/tax-return.service';

interface Property {
  id: string;
  name: string;
  lrNumber: string;
  grossRent: number;
}

@Component({
  selector: 'app-mri-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilingWizardShellComponent],
  template: `
    <app-filing-wizard-shell
      title="Monthly Rental Income (MRI)"
      subtitle="Declare residential rental income at the standard 7.5% gross rate"
      [steps]="steps"
      [currentStep]="currentStep()"
      [canContinue]="canProceed()"
      [isSubmitting]="isSubmitting()"
      (next)="next()"
      (back)="prev()"
      (submit)="submit()"
    >
      <!-- Step 0: Portfolio & Period -->
      @if (currentStep() === 0) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section 1: Rental Portfolio</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="card-glass p-6">
              <label class="label-elite uppercase">Tax Period</label>
              <div class="p-4 bg-slate-800 rounded-2xl flex-grow font-black text-white border border-white/5 mt-2">
                February 2026
              </div>
            </div>
            <div class="card-glass p-6">
              <label class="label-elite uppercase">Property Count</label>
              <div class="flex items-center gap-4 mt-2">
                <span class="text-2xl font-black text-white">{{ properties().length }}</span>
                <span class="text-slate-500 font-bold uppercase text-[10px]">Registered Properties</span>
              </div>
            </div>
          </div>

          <div class="mt-8 space-y-4">
            @for (prop of properties(); track prop.id) {
              <div class="property-card p-6 bg-white/5 border border-white/5 rounded-3xl flex justify-between items-center group hover:border-blue-500/30 transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  </div>
                  <div>
                    <h4 class="text-white font-black">{{ prop.name }}</h4>
                    <p class="text-slate-500 text-[10px] uppercase font-bold tracking-widest">LR No: {{ prop.lrNumber }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                   <div class="text-right">
                      <span class="block text-[10px] font-black text-slate-500 uppercase">Gross Rent</span>
                      <span class="text-white font-black">KES {{ prop.grossRent | number }}</span>
                   </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Step 1: Revenue Entry -->
      @if (currentStep() === 1) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section 2: Monthly Revenue</h3>
          <div class="space-y-6 max-w-2xl">
            @for (prop of properties(); track prop.id) {
              <div class="revenue-row p-6 bg-slate-800/50 rounded-3xl border border-white/5">
                <label class="label-elite">{{ prop.name }} (LR: {{ prop.lrNumber }})</label>
                <div class="relative mt-2">
                   <span class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">KES</span>
                   <input type="number" class="input-elite pl-16" [(ngModel)]="prop.grossRent">
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Step 2: MRI Computation -->
      @if (currentStep() === 2) {
        <div class="step-content animate-fade-in flex flex-col items-center justify-center">
          <div class="computation-vault p-12 bg-slate-800 rounded-[4rem] border border-white/10 w-full max-w-xl text-center shadow-2xl relative overflow-hidden">
             <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
             
             <span class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 block">Monthly Rental Income Tax</span>
             
             <div class="space-y-4 mb-10">
                <div class="flex justify-between items-center px-4">
                   <span class="text-slate-400 font-bold">Total Gross Rent</span>
                   <span class="text-white font-black text-xl">KES {{ totalGross() | number }}</span>
                </div>
                <div class="flex justify-between items-center px-4">
                   <span class="text-slate-400 font-bold">Tax Rate</span>
                   <span class="text-blue-400 font-black text-xl">7.5%</span>
                </div>
                <div class="h-px bg-white/5 my-4"></div>
                <div class="flex flex-col items-center py-4">
                   <h2 class="text-7xl font-black text-white mb-2">KES {{ totalTax() | number }}</h2>
                   <p class="text-emerald-400 text-xs font-black uppercase tracking-widest">Net Tax Payable</p>
                </div>
             </div>
             
             <div class="flex items-center gap-3 justify-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <svg width="20" height="20" fill="#3B82F6" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                <span class="text-[10px] text-slate-400 font-bold uppercase">Note: No expenses are deductible for MRI at 7.5% rate.</span>
             </div>
          </div>
        </div>
      }
    </app-filing-wizard-shell>
  `,
  styles: [`
    .step-content { min-height: 480px; }
    .premium-heading { font-size: 1.5rem; font-weight: 950; color: #FFFFFF; letter-spacing: -1px; }
    .label-elite { display: block; font-size: 0.65rem; font-weight: 900; color: #64748B; letter-spacing: 1px; margin-bottom: 8px; }
    .card-glass { background: rgba(30, 41, 59, 1); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; }
    .input-elite { 
      width: 100%; padding: 16px 20px; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px; color: white; font-weight: 800; outline: none; transition: 0.3s;
    }
  `]
})
export class MriWizardComponent implements OnInit {
  private taxService = inject(TaxReturnService);
  private router = inject(Router);

  steps = ['Portfolio', 'Revenue', 'Summary'];
  currentStep = signal(0);
  isSubmitting = signal(false);

  properties = signal<Property[]>([
    { id: '1', name: 'Westlands Commercial Hub', lrNumber: '209/12344', grossRent: 450000 },
    { id: '2', name: 'Kilimani Residencies', lrNumber: '1/3342/B', grossRent: 120000 }
  ]);

  totalGross = computed(() => this.properties().reduce((acc, p) => acc + p.grossRent, 0));
  totalTax = computed(() => Math.round(this.totalGross() * 0.075));

  ngOnInit() {}

  canProceed(): boolean {
    if (this.currentStep() === 1) return this.totalGross() > 0;
    return true;
  }

  next() { this.currentStep.update(s => s + 1); }
  prev() { this.currentStep.update(s => s - 1); }

  submit() {
    this.isSubmitting.set(true);
    const payload = {
      return_type: 'MRI',
      tax_year: 2026,
      taxpayer_id: 1,
      status: 'Submitted',
      calculations: {
        gross_rent: this.totalGross(),
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
