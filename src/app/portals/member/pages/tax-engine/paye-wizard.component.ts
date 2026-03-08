import { Component, signal, inject, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilingWizardShellComponent } from './shared/filing-wizard-shell.component';
import { FilingPrepopulationService } from '../../../../core/services/member/filing-prepopulation.service';
import { TaxReturnService } from '../../../../services/tax-return.service';

interface EmployeeRecord {
  id: string;
  pin: string;
  name: string;
  basicSalary: number;
  benefits: number;
  paye: number;
  sha: number;
  houseLevy: number;
}

@Component({
  selector: 'app-paye-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilingWizardShellComponent],
  template: `
    <app-filing-wizard-shell
      title="PAYE (P10) Monthly Return"
      subtitle="Declare employee deductions and community social contributions"
      [steps]="steps"
      [currentStep]="currentStep()"
      [canContinue]="canProceed()"
      [isSubmitting]="isSubmitting()"
      (next)="next()"
      (back)="prev()"
      (submit)="submit()"
    >
      <!-- Step 0: Upload & Sync -->
      @if (currentStep() === 0) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section 1: Data Integration</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="upload-zone p-12 bg-slate-800/50 rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center group hover:border-blue-500/30 transition-all cursor-pointer">
               <div class="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
               </div>
               <h4 class="text-white font-black text-lg mb-2">Upload Employee CSV</h4>
               <p class="text-slate-500 text-xs font-medium text-center max-w-[200px]">Drag and drop your payroll file or click to browse</p>
            </div>

            <div class="card-glass p-8 flex flex-col justify-center">
               <h4 class="text-white font-black text-lg mb-4">Historical Pre-population</h4>
               <p class="text-slate-400 text-sm mb-6">Found <strong>12 employees</strong> from your previous month's filing (January 2026).</p>
               <button (click)="useHistoricalData()" class="btn-elite py-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">
                  Use Last Month's Data
               </button>
            </div>
          </div>
        </div>
      }

      <!-- Step 1: Employee List -->
      @if (currentStep() === 1) {
        <div class="step-content animate-fade-in">
          <div class="flex justify-between items-center mb-8">
            <h3 class="premium-heading">Section 2: Employee Breakdown</h3>
            <button (click)="addEmployee()" class="text-xs font-black uppercase text-blue-400 border border-blue-400/20 px-4 py-2 rounded-xl">+ Add Employee</button>
          </div>

          <div class="overflow-x-auto rounded-3xl border border-white/5 bg-slate-900/50">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] uppercase font-black text-slate-500 bg-black/20">
                  <th class="px-6 py-4">Employee Details</th>
                  <th class="px-6 py-4 text-right">Basic Salary</th>
                  <th class="px-6 py-4 text-right">PAYE</th>
                  <th class="px-6 py-4 text-right">SHA (2.75%)</th>
                  <th class="px-6 py-4 text-right">HDF (1.5%)</th>
                  <th class="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (emp of employees(); track emp.id) {
                  <tr class="group hover:bg-white/5 transition-all">
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="text-white font-black text-sm">{{ emp.name }}</span>
                        <span class="text-slate-500 text-[10px] font-mono">{{ emp.pin }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right font-black text-slate-300">
                      KES {{ emp.basicSalary | number }}
                    </td>
                    <td class="px-6 py-4 text-right font-black text-red-400">
                      KES {{ emp.paye | number }}
                    </td>
                    <td class="px-6 py-4 text-right font-black text-blue-400">
                      KES {{ emp.sha | number }}
                    </td>
                    <td class="px-6 py-4 text-right font-black text-amber-400">
                      KES {{ emp.houseLevy | number }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <button (click)="removeEmployee(emp.id)" class="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 transition-all">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Step 2: Summary & Net Pay -->
      @if (currentStep() === 2) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-10">Section 3: Aggregate Summary</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="space-y-4">
               <div class="calc-row flex justify-between p-4 bg-white/5 rounded-2xl">
                 <span class="text-slate-400 font-bold">Total Employees</span>
                 <span class="text-white font-black">{{ employees().length }}</span>
               </div>
               <div class="calc-row flex justify-between p-4 border-b border-white/5">
                 <span class="text-slate-400 font-bold">Total Gross Pay</span>
                 <span class="text-white font-black font-mono">KES {{ totalGross() | number }}</span>
               </div>
               <div class="calc-row flex justify-between p-4 border-b border-white/5">
                 <span class="text-slate-400 font-bold">Total PAYE Due</span>
                 <span class="text-red-400 font-black font-mono">KES {{ totalPaye() | number }}</span>
               </div>
               <div class="calc-row flex justify-between p-4 border-b border-white/5">
                 <span class="text-slate-400 font-bold">Total SHA Remittance</span>
                 <span class="text-blue-400 font-black font-mono">KES {{ totalSha() | number }}</span>
               </div>
               <div class="calc-row flex justify-between p-4 border-b border-white/5">
                 <span class="text-slate-400 font-bold">Total Housing Levy</span>
                 <span class="text-amber-400 font-black font-mono">KES {{ totalHouseLevy() | number }}</span>
               </div>
            </div>

            <div class="net-payment-card p-12 bg-slate-800 rounded-[3.5rem] border border-white/10 flex flex-col items-center justify-center text-center">
               <div class="mb-6 w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center border border-emerald-500/20">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               </div>
               <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Total Liability (P10)</span>
               <h2 class="text-6xl font-black text-white mb-8">KES {{ (totalPaye() + totalSha() + totalHouseLevy()) | number }}</h2>
               
               <div class="w-full h-px bg-white/10 mb-8"></div>
               <p class="text-xs text-slate-400 font-medium">Submission will generate a single PRN for the aggregate amount.</p>
            </div>
          </div>
        </div>
      }
    </app-filing-wizard-shell>
  `,
  styles: [`
    .step-content { min-height: 500px; }
    .premium-heading { font-size: 1.5rem; font-weight: 950; color: #FFFFFF; letter-spacing: -1px; }
    .card-glass { background: rgba(30, 41, 59, 1); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; }
  `]
})
export class PayeWizardComponent implements OnInit {
  private taxService = inject(TaxReturnService);
  private router = inject(Router);

  steps = ['Integration', 'Employees', 'Summary'];
  currentStep = signal(0);
  isSubmitting = signal(false);
  employees = signal<EmployeeRecord[]>([]);

  // Aggregate Computations
  totalGross = computed(() => this.employees().reduce((acc, emp) => acc + emp.basicSalary, 0));
  totalPaye = computed(() => this.employees().reduce((acc, emp) => acc + emp.paye, 0));
  totalSha = computed(() => this.employees().reduce((acc, emp) => acc + emp.sha, 0));
  totalHouseLevy = computed(() => this.employees().reduce((acc, emp) => acc + emp.houseLevy, 0));

  ngOnInit() {}

  useHistoricalData() {
    const mockEmployees: EmployeeRecord[] = [
      { id: '1', pin: 'A001234567Z', name: 'John Doe', basicSalary: 85000, benefits: 5000, paye: 14200, sha: 2337.5, houseLevy: 1275 },
      { id: '2', pin: 'A009876543X', name: 'Jane Smith', basicSalary: 120000, benefits: 0, paye: 24500, sha: 3300, houseLevy: 1800 },
      { id: '3', pin: 'A005544332Y', name: 'James Bundi', basicSalary: 45000, benefits: 0, paye: 4500, sha: 1237.5, houseLevy: 675 }
    ];
    this.employees.set(mockEmployees);
    this.currentStep.set(1);
  }

  addEmployee() {
    const newEmp: EmployeeRecord = {
      id: Math.random().toString(36).substring(7),
      pin: 'A00...',
      name: 'New Employee',
      basicSalary: 0,
      benefits: 0,
      paye: 0,
      sha: 0,
      houseLevy: 0
    };
    this.employees.update(e => [...e, newEmp]);
  }

  removeEmployee(id: string) {
    this.employees.update(e => e.filter(emp => emp.id !== id));
  }

  canProceed(): boolean {
    if (this.currentStep() === 1) return this.employees().length > 0;
    return true;
  }

  next() { this.currentStep.update(s => s + 1); }
  prev() { this.currentStep.update(s => s - 1); }

  submit() {
    this.isSubmitting.set(true);
    const payload = {
      return_type: 'PAYE',
      tax_year: 2026,
      taxpayer_id: 1,
      status: 'Submitted',
      calculations: {
        paye: this.totalPaye(),
        sha: this.totalSha(),
        house_levy: this.totalHouseLevy()
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
