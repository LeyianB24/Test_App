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
          <h3 class="text-2xl font-black text-primary mb-8 tracking-tight">Section 1: Data Integration</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="glass-panel p-12 border-dashed border-2 hover:border-[var(--color-accent)]/50 transition-all cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden">
               <div class="w-16 h-16 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform z-10">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
               </div>
               <h4 class="text-primary font-black text-lg mb-2 z-10">Upload Employee CSV</h4>
               <p class="premium-subtitle text-center max-w-[200px] z-10">Drag and drop your payroll file or click to browse</p>
               <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div class="glass-panel p-10 flex flex-col justify-center relative overflow-hidden">
               <div class="absolute top-0 right-0 p-6 opacity-30">
                  <div class="w-32 h-32 bg-[var(--color-success)]/20 rounded-full blur-3xl"></div>
               </div>
               <h4 class="text-primary font-black text-lg mb-4 z-10">Historical Pre-population</h4>
               <p class="premium-subtitle mb-8 z-10 max-w-sm">Found <strong class="text-primary">12 employees</strong> from your previous month's filing (January 2026).</p>
               <button (click)="useHistoricalData()" class="btn-precision bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 hover:bg-[var(--color-success)] hover:text-white mt-auto self-start z-10">
                  USE LAST MONTH'S DATA
               </button>
            </div>
          </div>
        </div>
      }

      <!-- Step 1: Employee List -->
      @if (currentStep() === 1) {
        <div class="step-content animate-fade-in">
          <div class="flex justify-between items-center mb-8">
            <h3 class="text-2xl font-black text-primary tracking-tight">Section 2: Employee Breakdown</h3>
            <button (click)="addEmployee()" class="btn-precision bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 hover:bg-[var(--color-accent)] hover:text-white !py-2 !px-4">+ ADD EMPLOYEE</button>
          </div>

          <div class="glass-panel overflow-hidden p-0 border border-subtle">
            <div class="overflow-x-auto">
              <table class="w-full text-left max-w-full">
                <thead>
                  <tr class="text-[10px] uppercase font-black text-muted bg-surface-2 border-b border-subtle tracking-widest">
                    <th class="px-6 py-4 whitespace-nowrap">Employee Details</th>
                    <th class="px-6 py-4 text-right whitespace-nowrap">Basic Salary</th>
                    <th class="px-6 py-4 text-right whitespace-nowrap">PAYE</th>
                    <th class="px-6 py-4 text-right whitespace-nowrap">SHA (2.75%)</th>
                    <th class="px-6 py-4 text-right whitespace-nowrap">HDF (1.5%)</th>
                    <th class="px-6 py-4 text-center whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-subtle">
                  @for (emp of employees(); track emp.id) {
                    <tr class="group hover:bg-surface-2/50 transition-colors">
                      <td class="px-6 py-5 whitespace-nowrap">
                        <div class="flex flex-col">
                          <span class="text-primary font-black text-sm">{{ emp.name }}</span>
                          <span class="text-muted text-[10px] font-mono tracking-widest mt-1">{{ emp.pin }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-5 text-right font-black text-primary whitespace-nowrap">
                        KES {{ emp.basicSalary | number }}
                      </td>
                      <td class="px-6 py-5 text-right font-black text-[var(--color-danger)] whitespace-nowrap">
                        KES {{ emp.paye | number }}
                      </td>
                      <td class="px-6 py-5 text-right font-black text-[var(--color-info)] whitespace-nowrap">
                        KES {{ emp.sha | number }}
                      </td>
                      <td class="px-6 py-5 text-right font-black text-[var(--color-warning)] whitespace-nowrap">
                        KES {{ emp.houseLevy | number }}
                      </td>
                      <td class="px-6 py-5 text-center whitespace-nowrap">
                        <button (click)="removeEmployee(emp.id)" class="opacity-0 group-hover:opacity-100 p-2 text-muted hover:text-[var(--color-danger)] transition-all">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- Step 2: Summary & Net Pay -->
      @if (currentStep() === 2) {
        <div class="step-content animate-fade-in">
          <h3 class="text-2xl font-black text-primary mb-10 tracking-tight">Section 3: Aggregate Summary</h3>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="glass-panel p-8 space-y-4">
               <div class="flex justify-between p-4 bg-surface-2 rounded-2xl border border-subtle">
                 <span class="premium-subtitle uppercase !mt-0">Total Employees</span>
                 <span class="text-primary font-black">{{ employees().length }}</span>
               </div>
               <div class="flex justify-between p-4 border-b border-subtle">
                 <span class="premium-subtitle uppercase !mt-0">Total Gross Pay</span>
                 <span class="text-primary font-black">KES {{ totalGross() | number }}</span>
               </div>
               <div class="flex justify-between p-4 border-b border-subtle">
                 <span class="premium-subtitle uppercase !mt-0">Total PAYE Due</span>
                 <span class="text-[var(--color-danger)] font-black">KES {{ totalPaye() | number }}</span>
               </div>
               <div class="flex justify-between p-4 border-b border-subtle">
                 <span class="premium-subtitle uppercase !mt-0">Total SHA Remittance</span>
                 <span class="text-[var(--color-info)] font-black">KES {{ totalSha() | number }}</span>
               </div>
               <div class="flex justify-between p-4 border-b border-subtle">
                 <span class="premium-subtitle uppercase !mt-0">Total Housing Levy</span>
                 <span class="text-[var(--color-warning)] font-black">KES {{ totalHouseLevy() | number }}</span>
               </div>
            </div>

            <div class="glass-panel p-12 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden relative border-[var(--color-accent)]/20">
               <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-accent)]/5 pointer-events-none"></div>
               <div class="mb-6 w-20 h-20 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-3xl flex items-center justify-center border border-[var(--color-success)]/20 z-10">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               </div>
               <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4 z-10 block">Total Liability (P10)</span>
               <h2 class="text-6xl font-black text-primary mb-8 tracking-tighter z-10">KES {{ (totalPaye() + totalSha() + totalHouseLevy()) | number }}</h2>
               
               <div class="w-full h-px bg-subtle mb-8 z-10"></div>
               <p class="premium-subtitle z-10 max-w-[250px]">Submission will generate a single PRN for the aggregate amount.</p>
            </div>
          </div>
        </div>
      }
    </app-filing-wizard-shell>
  `,
  styles: [`
    .step-content { min-height: 500px; }
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
