import { Component, signal, inject, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilingWizardShellComponent } from './shared/filing-wizard-shell.component';
import { FilingPrepopulationService, PrepopulationData } from '../../../../core/services/member/filing-prepopulation.service';
import { TaxReturnService } from '../../../../services/tax-return.service';

@Component({
  selector: 'app-vat-wizard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilingWizardShellComponent],
  template: `
    <app-filing-wizard-shell
      title="VAT Return (P30)"
      subtitle="Monthly Value Added Tax declaration with eTIMS synchronization"
      [steps]="steps"
      [currentStep]="currentStep()"
      [canContinue]="canProceed()"
      [isSubmitting]="isSubmitting()"
      (next)="next()"
      (back)="prev()"
      (submit)="submit()"
    >
      <!-- Step 0: Period & Pre-population -->
      @if (currentStep() === 0) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section 1: Period & Sync</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="card-glass p-6">
              <label class="label-elite uppercase">Filing Month</label>
              <select class="input-elite w-full font-black mt-2" [(ngModel)]="selectedMonth">
                @for (m of months; track m.value) {
                  <option [value]="m.value">{{ m.label }}</option>
                }
              </select>
            </div>
            <div class="card-glass p-6">
              <label class="label-elite uppercase">Sync Status</label>
              <div class="flex items-center gap-4 mt-2">
                 @if (loadingPreFill()) {
                   <div class="flex items-center gap-2 text-info font-bold text-xs uppercase tracking-widest">
                     <div class="spinner-sm"></div> eTIMS Ledger Hooking...
                   </div>
                 } @else {
                   <div class="badge-precision badge-compliant">eTIMS Data Loaded</div>
                   <button (click)="fetchPreFill()" class="text-[10px] font-black uppercase text-accent hover:underline">Refresh</button>
                 }
              </div>
            </div>
          </div>

          @if (preFillData(); as data) {
            <div class="mt-8 p-6 bg-surface-2 rounded-3xl border border-default animate-up">
              <h4 class="text-primary font-black mb-4 flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Data Summary for {{ data.baseInfo.taxpayer_name }}
              </h4>
              <div class="grid grid-cols-3 gap-4">
                 <div class="p-4 bg-app rounded-2xl">
                    <span class="text-[10px] uppercase font-black text-tertiary block mb-1">Expected Sales</span>
                    <span class="text-primary font-black">KES {{ (preFillData()?.incomeItems?.[0]?.amount || 0) | number }}</span>
                 </div>
                 <div class="p-4 bg-app rounded-2xl">
                    <span class="text-[10px] uppercase font-black text-tertiary block mb-1">Expected Purchases</span>
                    <span class="text-primary font-black">KES {{ (preFillData()?.incomeItems?.[1]?.amount || 0) | number }}</span>
                 </div>
                 <div class="p-4 bg-app rounded-2xl">
                    <span class="text-[10px] uppercase font-black text-tertiary block mb-1">VAT Rate</span>
                    <span class="text-info font-black">16% (Standard)</span>
                 </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Step 1: Sales / Output Tax -->
      @if (currentStep() === 1) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section 2: Sales & Output Tax</h3>
          <div class="space-y-6">
            <div class="card-glass p-8">
               <h4 class="text-primary font-black text-lg mb-6">Standard Rated Sales (16%)</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="form-group">
                    <label class="label-elite">Taxable Amount (Excl. VAT)</label>
                    <input type="number" class="input-elite" [(ngModel)]="sales.standard" (ngModelChange)="recalculate()">
                  </div>
                  <div class="form-group">
                    <label class="label-elite">Output Tax (Calculated)</label>
                    <div class="input-elite bg-app flex items-center justify-between">
                       <span>KES {{ (sales.standard * 0.16) | number }}</span>
                       <svg width="16" height="16" fill="var(--text-success)" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                  </div>
               </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="card-glass p-6">
                 <label class="label-elite uppercase">Zero Rated Sales</label>
                 <input type="number" class="input-elite" [(ngModel)]="sales.zero" (ngModelChange)="recalculate()">
              </div>
              <div class="card-glass p-6">
                 <label class="label-elite uppercase">Exempt Sales</label>
                 <input type="number" class="input-elite" [(ngModel)]="sales.exempt" (ngModelChange)="recalculate()">
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Step 2: Purchases / Input Tax -->
      @if (currentStep() === 2) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-8">Section 3: Purchases & Input Tax</h3>
          <div class="card-glass p-8">
             <h4 class="text-primary font-black text-lg mb-6 group flex items-center gap-3">
               Standard Purchases (16%)
               <span class="badge-precision badge-compliant ml-auto">Verified by eTIMS</span>
             </h4>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="form-group">
                  <label class="label-elite">Taxable Purchases (Excl. VAT)</label>
                  <input type="number" class="input-elite border-accent/30" [(ngModel)]="purchases.standard" (ngModelChange)="recalculate()">
                </div>
                <div class="form-group">
                  <label class="label-elite">Input Tax (Claimable)</label>
                  <div class="input-elite bg-app flex items-center justify-between">
                     <span>KES {{ (purchases.standard * 0.16) | number }}</span>
                     <svg width="16" height="16" fill="var(--text-info)" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  </div>
                </div>
             </div>
          </div>
        </div>
      }

      <!-- Step 3: VAT Computation -->
      @if (currentStep() === 3) {
        <div class="step-content animate-fade-in">
          <h3 class="premium-heading mb-10 text-center">VAT Compliance Summary</h3>
          
          <div class="flex flex-col items-center">
             <div class="vault-box p-12 bg-app rounded-[3rem] border border-default w-full max-w-2xl relative shadow-2xl overflow-hidden">
                <div class="absolute top-0 right-0 p-8">
                   <div class="orb w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>
                </div>
                
                <div class="space-y-6 relative z-10">
                   <div class="flex justify-between items-center text-tertiary font-bold uppercase text-xs tracking-widest">
                      <span>Total Output Tax</span>
                      <span class="text-primary font-black text-lg">KES {{ totalOutput() | number }}</span>
                   </div>
                   <div class="flex justify-between items-center text-tertiary font-bold uppercase text-xs tracking-widest">
                      <span>Total Input Tax</span>
                      <span class="text-info font-black text-lg">- KES {{ totalInput() | number }}</span>
                   </div>
                   <div class="h-px bg-default my-4"></div>
                   <div class="flex flex-col items-center py-6">
                      <span class="text-[10px] font-black uppercase text-tertiary mb-2">Net VAT Payable / (Refund)</span>
                      <h2 class="text-6xl font-black text-primary" [class.text-success]="netVat() < 0">
                        KES {{ Math.abs(netVat()) | number }}
                      </h2>
                      <p class="mt-4 text-xs font-bold text-tertiary uppercase tracking-widest text-center">
                        {{ netVat() > 0 ? 'Filing requires subsequent payment' : 'VAT Credit Carry Forward' }}
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      }
    </app-filing-wizard-shell>
  `,
  styles: [`
    .step-content { min-height: 480px; }
    .premium-heading { font-size: 1.5rem; font-weight: 950; color: var(--text-primary); letter-spacing: -1px; }
    .label-elite { display: block; font-size: 0.65rem; font-weight: 900; color: var(--text-tertiary); letter-spacing: 1px; margin-bottom: 8px; }
    .card-glass { background: var(--bg-surface-1); border: 1px solid var(--border-subtle); border-radius: 24px; }
    .input-elite { 
      width: 100%; padding: 16px 20px; background: var(--bg-surface-2); border: 1px solid var(--border-subtle);
      border-radius: 16px; color: var(--text-primary); font-weight: 800; outline: none; transition: 0.3s;
    }
    .input-elite:focus { border-color: var(--color-accent); box-shadow: var(--shadow-focus); }
    .spinner-sm { width: 14px; height: 14px; border: 2px solid var(--info-dim); border-top: 2px solid var(--info-base); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class VatWizardComponent implements OnInit {
  private preFillService = inject(FilingPrepopulationService);
  private taxService = inject(TaxReturnService);
  private router = inject(Router);

  Math = Math;
  steps = ['Sync', 'Sales', 'Purchases', 'Summary'];
  currentStep = signal(0);
  isSubmitting = signal(false);
  loadingPreFill = signal(false);
  preFillData = signal<PrepopulationData | null>(null);

  selectedMonth = (new Date().getMonth()).toString();
  months = [
    { value: '0', label: 'January 2026' }, { value: '1', label: 'February 2026' },
    { value: '2', label: 'March 2026' }, { value: '3', label: 'April 2026' }
  ];

  sales = {
    standard: 0,
    zero: 0,
    exempt: 0
  };

  purchases = {
    standard: 0,
    import: 0
  };

  totalOutput = computed(() => this.sales.standard * 0.16);
  totalInput = computed(() => this.purchases.standard * 0.16);
  netVat = computed(() => Math.round(this.totalOutput() - this.totalInput()));

  ngOnInit() {
    this.fetchPreFill();
  }

  fetchPreFill() {
    this.loadingPreFill.set(true);
    this.preFillService.getPrefillData('VAT', 2026).subscribe({
      next: (data) => {
        if (data) {
          this.preFillData.set(data);
          const salesItem = data.incomeItems.find(i => i.category === 'Sales');
          if (salesItem) this.sales.standard = salesItem.amount;
          
          const purchasesItem = data.incomeItems.find(i => i.category === 'Purchases');
          if (purchasesItem) this.purchases.standard = purchasesItem.amount;
        }
        this.loadingPreFill.set(false);
      },
      error: () => this.loadingPreFill.set(false)
    });
  }

  canProceed(): boolean {
    if (this.currentStep() === 0) return true;
    if (this.currentStep() === 1) return this.sales.standard > 0 || this.sales.exempt > 0;
    return true;
  }

  next() { this.currentStep.update(s => s + 1); }
  prev() { this.currentStep.update(s => s - 1); }
  recalculate() {}

  submit() {
    this.isSubmitting.set(true);
    const payload = {
      return_type: 'VAT',
      tax_year: 2026,
      taxpayer_id: 1,
      status: 'Submitted',
      calculations: {
        output_tax: this.totalOutput(),
        input_tax: this.totalInput(),
        net_tax: this.netVat()
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
