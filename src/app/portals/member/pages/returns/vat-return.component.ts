import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vat-return',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="vat-return-container p-6 animate-fade-in">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">VAT-3 Return Filing</h1>
          <p class="text-slate-400 text-sm">Value Added Tax (VAT) monthly declaration and assessment.</p>
        </div>
        <div class="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <span class="text-blue-400 text-sm font-medium">Period: January 2026</span>
        </div>
      </header>

      <!-- Stepper Progress -->
      <div class="flex items-center mb-10 px-4">
        @for (step of steps; track step.id; let i = $index) {
          <div class="flex items-center flex-1">
            <div class="step-circle" [class.active]="currentStep() >= step.id" [class.completed]="currentStep() > step.id">
              @if (currentStep() > step.id) {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              } @else {
                {{ step.id }}
              }
            </div>
            <span class="ml-3 text-sm font-medium" [class.text-white]="currentStep() >= step.id" [class.text-slate-500]="currentStep() < step.id">{{ step.label }}</span>
            @if (i < steps.length - 1) {
              <div class="h-0.5 flex-1 mx-4 bg-slate-700" [class.bg-blue-500]="currentStep() > step.id"></div>
            }
          </div>
        }
      </div>

      <div class="glass-card p-8 max-w-4xl mx-auto">
        <form [formGroup]="vatForm">
          
          <!-- Step 1: Sales / Output Tax -->
          @if (currentStep() === 1) {
            <div class="animate-slide-in">
              <h2 class="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-2">Part A: Sales and Output Tax</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label class="block text-slate-300 mb-2">Total Sales at General Rate (16%)</label>
                  <input type="number" formControlName="sales_16" class="form-input" placeholder="0.00">
                  <p class="text-xs text-slate-500 mt-1">Include all taxable sales made during the period.</p>
                </div>
                <div class="form-group">
                  <label class="block text-slate-300 mb-2">Total Zero-Rated Sales (0%)</label>
                  <input type="number" formControlName="sales_0" class="form-input" placeholder="0.00">
                </div>
                <div class="form-group">
                  <label class="block text-slate-300 mb-2">Total Exempt Sales</label>
                  <input type="number" formControlName="sales_exempt" class="form-input" placeholder="0.00">
                </div>
                <div class="form-group">
                  <label class="block text-slate-300 mb-2">Output Tax Calculated</label>
                  <div class="p-3 bg-slate-800 rounded-lg text-blue-400 font-bold">
                    {{ (vatForm.get('sales_16')?.value || 0) * 0.16 | number:'1.2-2' }} KES
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- Step 2: Purchases / Input Tax -->
          @if (currentStep() === 2) {
            <div class="animate-slide-in">
              <h2 class="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-2">Part B: Purchases and Input Tax</h2>
              <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-group">
                    <label class="block text-slate-300 mb-2">Local Purchases at 16%</label>
                    <input type="number" formControlName="purchases_16" class="form-input" placeholder="0.00">
                  </div>
                  <div class="form-group">
                    <label class="block text-slate-300 mb-2">Imported Goods at 16%</label>
                    <input type="number" formControlName="imports_16" class="form-input" placeholder="0.00">
                  </div>
                </div>
                <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div class="flex items-center text-blue-400 text-sm mb-2">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <strong>Input Tax Credit</strong>
                  </div>
                  <p class="text-slate-400 text-xs">Total Input Tax deductible for this period: <strong>{{ ((vatForm.get('purchases_16')?.value || 0) + (vatForm.get('imports_16')?.value || 0)) * 0.16 | number:'1.2-2' }} KES</strong></p>
                </div>
              </div>
            </div>
          }

          <!-- Step 3: Declaration of Summary -->
          @if (currentStep() === 3) {
            <div class="animate-slide-in">
              <h2 class="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-2">Part C: Tax Calculation Summary</h2>
              <div class="space-y-4">
                <div class="flex justify-between p-4 bg-slate-800/50 rounded-lg">
                  <span class="text-slate-300">Total Output Tax (Collected)</span>
                  <span class="text-white font-mono">{{ outputTax() | number:'1.2-2' }} KES</span>
                </div>
                <div class="flex justify-between p-4 bg-slate-800/50 rounded-lg">
                  <span class="text-slate-300">Total Input Tax (Deductible)</span>
                  <span class="text-white font-mono">- {{ inputTax() | number:'1.2-2' }} KES</span>
                </div>
                <div class="flex justify-between p-4 bg-blue-600/20 rounded-lg border border-blue-500/30">
                  <span class="text-blue-300 font-bold">Net VAT Payable / (Refundable)</span>
                  <span class="text-blue-400 font-bold text-xl font-mono">{{ outputTax() - inputTax() | number:'1.2-2' }} KES</span>
                </div>
                <div class="flex items-start mt-6 p-4 bg-slate-800/80 rounded-lg">
                  <input type="checkbox" formControlName="declaration" class="mt-1 mr-3 rounded border-slate-600 bg-slate-700 text-blue-500">
                  <p class="text-xs text-slate-400 leading-relaxed">
                    I hereby declare that the information provided in this return is true and correct to the best of my knowledge and belief. I understand that any false statement or omission is an offense under the Tax Laws.
                  </p>
                </div>
              </div>
            </div>
          }

          <!-- Step 4: Acknowledgement -->
          @if (currentStep() === 4) {
            <div class="animate-fade-in text-center py-10">
              <div class="w-20 h-20 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 class="text-2xl font-bold text-white mb-2">Return Filed Successfully</h2>
              <p class="text-slate-400 mb-8">Acknowledgment Receipt: <strong class="text-white">KRA202602158872</strong></p>
              
              <div class="flex flex-col md:flex-row gap-4 justify-center">
                <button class="btn-primary flex items-center justify-center p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg" (click)="reset()">
                   File Another Return
                </button>
                <button class="btn-secondary flex items-center justify-center p-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-medium transition-all" routerLink="/member/dashboard">
                   Go to Dashboard
                </button>
              </div>
            </div>
          }

          <!-- Navigation Buttons -->
          @if (currentStep() < 4) {
            <div class="flex justify-between mt-12 pt-6 border-t border-slate-700">
              <button 
                type="button" 
                class="px-6 py-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
                [disabled]="currentStep() === 1"
                (click)="prevStep()">
                Back
              </button>
              <button 
                type="button" 
                class="px-8 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg hover:scale-105 disabled:opacity-50"
                [disabled]="currentStep() === 3 && !vatForm.get('declaration')?.value"
                (click)="nextStep()">
                @if (currentStep() === 3) { Submit Return } @else { Continue }
              </button>
            </div>
          }
        </form>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }
    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #1e293b;
      border: 2px solid #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .step-circle.active {
      border-color: #3b82f6;
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
    }
    .step-circle.completed {
      background: #3b82f6;
      border-color: #3b82f6;
      color: white;
    }
    .form-input {
      width: 100%;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 12px 16px;
      color: white;
      transition: all 0.2s;
    }
    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: rgba(15, 23, 42, 0.8);
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VatReturnComponent {
  currentStep = signal(1);
  steps = [
    { id: 1, label: 'Income/Output Tax' },
    { id: 2, label: 'Expenses/Input Tax' },
    { id: 3, label: 'Summary' }
  ];

  vatForm = inject(FormBuilder).group({
    sales_16: [0],
    sales_0: [0],
    sales_exempt: [0],
    purchases_16: [0],
    imports_16: [0],
    declaration: [false, Validators.requiredTrue]
  });

  constructor() {}

  nextStep() {
    if (this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  outputTax() {
    return (this.vatForm.get('sales_16')?.value || 0) * 0.16;
  }

  inputTax() {
    return ((this.vatForm.get('purchases_16')?.value || 0) + (this.vatForm.get('imports_16')?.value || 0)) * 0.16;
  }

  reset() {
    this.vatForm.reset();
    this.currentStep.set(1);
  }
}


