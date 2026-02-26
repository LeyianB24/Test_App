import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rental-income-return',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="mri-return-container p-6 animate-fade-in">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Monthly Rental Income (MRI)</h1>
          <p class="text-slate-400 text-sm">Residential rental income tax declaration (7.5% of Gross Rent).</p>
        </div>
        <div class="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <span class="text-amber-400 text-sm font-medium">Period: January 2026</span>
        </div>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Filing Form -->
          <div class="lg:col-span-2">
            <div class="glass-card p-8">
              <form [formGroup]="mriForm">
                <div class="space-y-6">
                  <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-medium">Gross Rent Received (KES)</label>
                    <div class="relative">
                       <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">KES</span>
                       <input type="number" formControlName="gross_rent" class="form-input pl-14" placeholder="0.00">
                    </div>
                    <p class="text-xs text-slate-500 mt-2 italic px-1">
                      Include all rent collected from residential properties during the month.
                    </p>
                  </div>

                  <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-medium">Number of Properties</label>
                    <input type="number" formControlName="property_count" class="form-input" placeholder="1">
                  </div>

                  <div class="p-5 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                    <div class="flex items-center text-amber-400 text-sm font-bold uppercase tracking-widest mb-4">
                       <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       Tax Calculation Result
                    </div>
                    <div class="space-y-3">
                       <div class="flex justify-between text-slate-400 text-sm">
                          <span>Gross Rental Income</span>
                          <span class="text-white">{{ mriForm.get('gross_rent')?.value || 0 | number:'1.2-2' }} KES</span>
                       </div>
                       <div class="flex justify-between text-slate-400 text-sm">
                          <span>Tax Rate (Residential)</span>
                          <span class="text-amber-400">7.5%</span>
                       </div>
                       <div class="h-px bg-slate-700 my-2"></div>
                       <div class="flex justify-between items-baseline">
                          <span class="text-white font-semibold">Total MRI Payable</span>
                          <span class="text-2xl font-bold font-mono text-amber-500">{{ taxPayable() | number:'1.2-2' }} KES</span>
                       </div>
                    </div>
                  </div>

                  <div class="flex items-start p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                     <input type="checkbox" formControlName="declaration" class="mt-1 mr-3 rounded border-slate-600 bg-slate-700 text-amber-500">
                     <p class="text-[11px] text-slate-400 leading-normal">
                        I declare that the information provided above is correct. Note: Late filing attracts a penalty of KES 2,000 or 5% of tax due, whichever is higher.
                     </p>
                  </div>

                  <div class="flex gap-4 pt-4">
                    <button type="submit" class="flex-1 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-600/20 transition-all hover:-translate-y-0.5" [disabled]="!mriForm.valid">
                       File & Generate PRN
                    </button>
                    <button routerLink="/member/returns" type="button" class="px-8 py-4 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all">
                       Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Info Sidebar -->
          <div class="space-y-6">
            <div class="glass-card p-6 bg-slate-800/40">
              <h3 class="text-lg font-bold text-white mb-4">MRI Highlights</h3>
              <ul class="space-y-4">
                 <li class="flex items-start">
                    <div class="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center mr-3 shrink-0">
                       <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span class="text-slate-400 text-xs">Applicable to residential rent up to KES 15M p.a.</span>
                 </li>
                 <li class="flex items-start">
                    <div class="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center mr-3 shrink-0">
                       <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span class="text-slate-400 text-xs">Due by 20th of the subsequent month.</span>
                 </li>
                 <li class="flex items-start">
                    <div class="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center mr-3 shrink-0">
                       <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span class="text-slate-400 text-xs">No expenses are deductible under MRI.</span>
                 </li>
              </ul>
            </div>

            <div class="p-6 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 text-white">
               <div class="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-2">Pro Tip</div>
               <p class="text-sm font-medium leading-relaxed">
                  If you missed a month with no rental income, you must still file a **Nil Return** to avoid late penalties.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
    }
    .form-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 14px;
      padding: 14px 16px;
      color: white;
      transition: all 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentalIncomeReturnComponent {
  private fb = inject(FormBuilder);

  mriForm = this.fb.group({
    gross_rent: [null, [Validators.required, Validators.min(0)]],
    property_count: [1, [Validators.required, Validators.min(1)]],
    declaration: [false, Validators.requiredTrue]
  });

  taxPayable = computed(() => {
    const grossVal = this.mriForm.get('gross_rent')?.value || 0;
    return grossVal * 0.075; // 7.5% Residential Rental Income Tax
  });
}
