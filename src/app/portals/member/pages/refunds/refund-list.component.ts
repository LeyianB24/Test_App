import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-refund-list',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="refunds-list-container p-6 animate-fade-in">
      <header class="mb-10 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-primary mb-2">Tax Refunds</h1>
          <p class="text-tertiary">View and track your tax refund applications and overpayment claims.</p>
        </div>
        <button routerLink="/member/refunds/apply" class="modern-btn primary-btn px-6 py-3 font-bold rounded-xl shadow-lg transition-all hover:-translate-y-1">
          Apply for Refund
        </button>
      </header>

      <div class="grid grid-cols-1 gap-6">
        @for (item of refunds; track item.id) {
          <div class="glass-card p-6 border border-default hover:border-accent transition-all group relative overflow-hidden">
             <!-- Status Gradient -->
             <div class="absolute inset-y-0 left-0 w-1" [class]="item.statusBg"></div>
             
             <div class="flex flex-wrap lg:flex-nowrap gap-8 items-center">
                <!-- Icon -->
                <div class="w-16 h-16 rounded-2xl bg-app flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                   <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>

                <div class="flex-grow">
                   <div class="flex items-center gap-3 mb-1">
                      <span class="text-[10px] font-bold text-tertiary uppercase tracking-widest font-mono">{{ item.refNo }}</span>
                      <span class="px-2 py-0.5 rounded bg-surface-2 text-primary text-[10px] font-bold uppercase">{{ item.obligation }}</span>
                   </div>
                   <h3 class="text-xl font-bold text-primary mb-1">Claim for Period {{ item.period }}</h3>
                   <div class="text-2xl font-bold font-mono text-success mb-2">{{ item.amount | number:'1.2-2' }} KES</div>
                   <div class="flex items-center text-tertiary text-[10px] uppercase font-bold tracking-tight">
                      <span class="mr-4">Application Date: <strong class="text-secondary">{{ item.appliedDate }}</strong></span>
                      <span>Expected Disbursement: <strong class="text-secondary">{{ item.expectedDate }}</strong></span>
                   </div>
                </div>

                <div class="flex flex-col items-end gap-3 min-w-[200px]">
                   <span class="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" [class]="item.statusClass">{{ item.status }}</span>
                   <div class="text-[10px] text-tertiary text-right">
                      {{ item.statusNote }}
                   </div>
                   <button class="text-info text-xs font-bold hover:underline mt-2">View Full Audit Log</button>
                </div>
             </div>
          </div>
        } @empty {
          <div class="glass-card p-20 text-center flex flex-col items-center">
             <div class="w-16 h-16 bg-app rounded-full flex items-center justify-center mb-6 text-tertiary">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p class="text-tertiary">No active refund claims found.</p>
          </div>
        }
      </div>

      <!-- Bank Details Hook -->
      <div class="mt-12 p-8 glass-card bg-status-info border-info-border/20 flex justify-between items-center">
         <div class="flex items-center">
            <div class="w-12 h-12 rounded-xl bg-status-info flex items-center justify-center mr-6 border border-info-border/30">
               <svg class="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <div>
               <h4 class="text-primary font-bold">Disbursement Account</h4>
               <p class="text-tertiary text-xs uppercase tracking-widest font-bold">KCB BANK •••••• 8821</p>
            </div>
         </div>
         <button class="text-info font-bold hover:underline text-sm uppercase">Change Account</button>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: var(--bg-surface-1);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-subtle);
      border-radius: 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RefundListComponent {
  refunds = [
    {
      id: 1,
      refNo: 'REF-88721-P01',
      obligation: 'Value Added Tax (VAT)',
      period: 'August - October 2025',
      amount: 45800.00,
      appliedDate: '2025-11-15',
      expectedDate: '2026-03-30',
      status: 'VERIFICATION STAGE',
      statusClass: 'bg-blue-500/10 text-info',
      statusBg: 'bg-blue-500',
      statusNote: 'Awaiting inspector approval of purchase invoices.'
    },
    {
      id: 2,
      refNo: 'REF-99120-Q12',
      obligation: 'Income Tax - Resident',
      period: 'Year 2024',
      amount: 12450.00,
      appliedDate: '2025-06-20',
      expectedDate: 'PAID',
      status: 'DISBURSED',
      statusClass: 'bg-green-500/20 text-success',
      statusBg: 'bg-emerald-50',
      statusNote: 'Funds transferred to bank account on 2025-08-12.'
    }
  ];
}
