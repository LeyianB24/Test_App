import { inject, Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-paye-return',
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div class="paye-return-container p-6 animate-fade-in">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">PAYE (P10) Monthly Filing</h1>
          <p class="text-slate-400 text-sm">Employer monthly return for PAYE, SHA, and Housing Levy.</p>
        </div>
        <div class="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <span class="text-emerald-400 text-sm font-medium">Period: January 2026</span>
        </div>
      </header>

      <div class="glass-card p-8 max-w-5xl mx-auto">
        <form [formGroup]="payeForm">
          
          <!-- Summary Section -->
          <section class="mb-10">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <span class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center mr-3 text-sm">1</span>
              Payroll Summary
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="form-group">
                <label class="block text-slate-300 mb-2 font-medium">Number of Employees</label>
                <input type="number" formControlName="employee_count" class="form-input" placeholder="0">
              </div>
              <div class="form-group">
                <label class="block text-slate-300 mb-2 font-medium">Total Gross Pay (KES)</label>
                <input type="number" formControlName="total_gross" class="form-input" placeholder="0.00">
              </div>
              <div class="form-group">
                <label class="block text-slate-300 mb-2 font-medium">Total PAYE Deducted</label>
                <input type="number" formControlName="total_paye" class="form-input" placeholder="0.00">
              </div>
            </div>
          </section>

          <!-- Contribution Breakdown -->
          <section class="mb-10">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <span class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center mr-3 text-sm">2</span>
              Statutory Contributions
            </h2>
            <div class="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-4">Social Health Authority (SHA)</h3>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span class="text-slate-400 text-sm">Total SHA Contribution</span>
                      <input type="number" formControlName="total_sha" class="text-right bg-transparent border-none text-white font-mono focus:ring-0 w-32" placeholder="0.00">
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-4">Affordable Housing Levy</h3>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
                      <span class="text-slate-400 text-sm">Total Housing Levy</span>
                      <input type="number" formControlName="total_housing_levy" class="text-right bg-transparent border-none text-white font-mono focus:ring-0 w-32" placeholder="0.00">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Upload Section (Simulated) -->
          <section class="mb-10">
            <h2 class="text-xl font-semibold text-white mb-6 flex items-center">
              <span class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center mr-3 text-sm">3</span>
              Detailed Payroll CSV
            </h2>
            <div class="upload-zone border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center hover:border-emerald-500/50 transition-all group cursor-pointer">
              <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-slate-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              </div>
              <p class="text-white font-medium mb-1">Click to upload or drag and drop</p>
              <p class="text-slate-500 text-xs">Standard KRA Payroll Template (CSV / Excel)</p>
            </div>
          </section>

          <!-- Action Footer -->
          <div class="flex justify-between items-center pt-8 border-t border-slate-700">
             <div class="flex items-center text-slate-400 text-sm">
                <svg class="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Secure 256-bit encrypted transmission
             </div>
             <div class="flex gap-4">
                <button type="button" class="px-6 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors" routerLink="/member/returns">Cancel</button>
                <button type="submit" class="px-10 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95">
                  Validate & Submit P10
                </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 150, 100, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
    }
    .form-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px 16px;
      color: white;
      transition: all 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayeReturnComponent {
  private fb = inject(FormBuilder);

  payeForm = this.fb.group({
    employee_count: [null, [Validators.required, Validators.min(1)]],
    total_gross: [null, [Validators.required, Validators.min(0)]],
    total_paye: [null, [Validators.required, Validators.min(0)]],
    total_sha: [null, [Validators.required, Validators.min(0)]],
    total_housing_levy: [null, [Validators.required, Validators.min(0)]]
  });
}
