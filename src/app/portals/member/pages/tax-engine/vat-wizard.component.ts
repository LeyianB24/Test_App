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
          <h3 class="text-2xl font-black text-primary mb-8 tracking-tight">Section 1: Period & Sync</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="glass-panel p-8">
              <label class="premium-subtitle !mt-0 !mb-4 uppercase tracking-widest text-[10px]">Filing Month</label>
              <div class="search-input-precision !w-full !px-6">
                <select class="w-full bg-transparent border-none appearance-none font-black text-xs text-primary focus:outline-none" [(ngModel)]="selectedMonth">
                  @for (m of months; track m.value) {
                    <option [value]="m.value">{{ m.label }}</option>
                  }
                </select>
              </div>
            </div>
            <div class="glass-panel p-8">
              <label class="premium-subtitle !mt-0 !mb-4 uppercase tracking-widest text-[10px]">Sync Status</label>
              <div class="flex items-center gap-4 mt-2">
                 @if (loadingPreFill()) {
                   <div class="flex items-center gap-3 text-[var(--color-info)] font-black text-[10px] uppercase tracking-widest">
                     <div class="w-4 h-4 border-2 border-[var(--color-info)] border-t-transparent rounded-full animate-spin"></div>
                     eTIMS Ledger Hooking...
                   </div>
                 } @else {
                   <div class="status-pill-precision online">
                     <span class="status-pill-dot animate-pulse"></span>
                     eTIMS DATA SYNCHRONIZED
                   </div>
                   <button (click)="fetchPreFill()" class="text-[10px] font-black uppercase text-[var(--color-accent)] hover:underline ml-4">Pull Fresh Data</button>
                 }
              </div>
            </div>
          </div>

          @if (preFillData(); as data) {
            <div class="mt-8 p-8 glass-panel animate-scale-in">
              <h4 class="text-lg font-black text-primary mb-6 flex items-center gap-3">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Telemetry Dashboard for {{ data.baseInfo.taxpayer_name }}
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div class="bg-surface-2 border border-subtle p-6 rounded-2xl">
                    <span class="text-[10px] uppercase font-black text-muted block mb-2 tracking-widest">Expected Sales Volume</span>
                    <span class="text-xl font-black text-primary">KES {{ (preFillData()?.incomeItems?.[0]?.amount || 0) | number }}</span>
                 </div>
                 <div class="bg-surface-2 border border-subtle p-6 rounded-2xl">
                    <span class="text-[10px] uppercase font-black text-muted block mb-2 tracking-widest">Expected Procurement</span>
                    <span class="text-xl font-black text-primary">KES {{ (preFillData()?.incomeItems?.[1]?.amount || 0) | number }}</span>
                 </div>
                 <div class="bg-surface-2 border border-subtle p-6 rounded-2xl">
                    <span class="text-[10px] uppercase font-black text-muted block mb-2 tracking-widest">Active VAT Rate</span>
                    <span class="text-xl font-black text-[var(--color-info)]">16% (Standard)</span>
                 </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Step 1: Sales / Output Tax -->
      @if (currentStep() === 1) {
        <div class="step-content animate-fade-in">
          <h3 class="text-2xl font-black text-primary mb-8 tracking-tight">Section 2: Sales & Output Tax</h3>
          <div class="space-y-6">
            <div class="glass-panel p-8">
               <h4 class="text-primary font-black text-lg mb-8">Standard Rated Sales (16%)</h4>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-4">
                    <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Taxable Amount (Excl. VAT)</label>
                    <div class="search-input-precision !w-full !px-6">
                       <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="sales.standard" (ngModelChange)="recalculate()">
                    </div>
                  </div>
                  <div class="space-y-4">
                    <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Output Tax (Calculated)</label>
                    <div class="search-input-precision !w-full !px-6 bg-surface-3 border-transparent justify-between opacity-80 cursor-not-allowed">
                       <span class="font-black text-primary">KES {{ (sales.standard * 0.16) | number }}</span>
                       <svg width="20" height="20" fill="var(--color-success)" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                  </div>
               </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="glass-panel p-8">
                 <label class="premium-subtitle !mt-0 !mb-4 uppercase tracking-widest text-[10px]">Zero Rated Sales</label>
                 <div class="search-input-precision !w-full !px-6">
                    <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="sales.zero" (ngModelChange)="recalculate()">
                 </div>
              </div>
              <div class="glass-panel p-8">
                 <label class="premium-subtitle !mt-0 !mb-4 uppercase tracking-widest text-[10px]">Exempt Sales</label>
                 <div class="search-input-precision !w-full !px-6">
                    <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="sales.exempt" (ngModelChange)="recalculate()">
                 </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Step 2: Purchases / Input Tax -->
      @if (currentStep() === 2) {
        <div class="step-content animate-fade-in">
          <h3 class="text-2xl font-black text-primary mb-8 tracking-tight">Section 3: Purchases & Input Tax</h3>
          <div class="glass-panel p-8">
             <h4 class="text-primary font-black text-lg mb-8 flex items-center justify-between">
               Standard Purchases (16%)
               <div class="status-pill-precision online">
                 <span class="status-pill-dot"></span>
                 VERIFIED BY eTIMS
               </div>
             </h4>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Taxable Purchases (Excl. VAT)</label>
                  <div class="search-input-precision border-[var(--color-info)]/30 focus-within:border-[var(--color-info)] !w-full !px-6">
                     <input type="number" class="!bg-transparent font-black w-full" [(ngModel)]="purchases.standard" (ngModelChange)="recalculate()">
                  </div>
                </div>
                <div class="space-y-4">
                  <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Input Tax (Claimable)</label>
                  <div class="search-input-precision !w-full !px-6 bg-[var(--color-info)]/5 border-[var(--color-info)]/20 justify-between opacity-90 cursor-not-allowed">
                     <span class="font-black text-[var(--color-info)]">KES {{ (purchases.standard * 0.16) | number }}</span>
                     <svg width="20" height="20" fill="var(--color-info)" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  </div>
                </div>
             </div>
          </div>
        </div>
      }

      <!-- Step 3: VAT Computation -->
      @if (currentStep() === 3) {
        <div class="step-content animate-fade-in">
          <h3 class="text-2xl font-black text-primary mb-10 text-center tracking-tight">Compliance Signature Protocol</h3>
          
          <div class="flex flex-col items-center">
             <div class="glass-panel p-12 w-full max-w-2xl relative shadow-2xl overflow-hidden animate-scale-in">
                <div class="absolute top-0 right-0 p-8 opacity-40">
                   <div class="w-32 h-32 bg-[var(--color-accent)]/20 rounded-full blur-3xl"></div>
                </div>
                
                <div class="space-y-6 relative z-10">
                   <div class="flex justify-between items-center premium-subtitle uppercase">
                      <span>Total Output Liability</span>
                      <span class="font-black text-primary text-lg tracking-normal">KES {{ totalOutput() | number }}</span>
                   </div>
                   <div class="flex justify-between items-center premium-subtitle uppercase">
                      <span>Total Input Claimable</span>
                      <span class="font-black text-[var(--color-info)] text-lg tracking-normal">- KES {{ totalInput() | number }}</span>
                   </div>
                   <div class="h-px bg-subtle my-8 border-t border-[var(--border-subtle)] border-dashed"></div>
                   <div class="flex flex-col items-center py-6">
                      <span class="premium-subtitle uppercase tracking-widest block mb-4">Net VAT Payable / (Refund)</span>
                      <h2 class="text-6xl font-black tracking-tighter" [ngClass]="netVat() < 0 ? 'text-[var(--color-success)]' : 'text-primary'">
                        KES {{ Math.abs(netVat()) | number }}
                      </h2>
                      <div class="mt-8 status-pill-precision" [ngClass]="netVat() > 0 ? 'pending' : 'online'">
                         <span class="status-pill-dot animate-pulse"></span>
                         {{ netVat() > 0 ? 'FUNDS TRANSFER REQUIRED' : 'CREDIT CARRY FORWARD ASSIGNED' }}
                      </div>
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
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out); }
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
