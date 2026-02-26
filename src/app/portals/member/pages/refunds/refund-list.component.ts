import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-refund-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="refunds-list-container p-6 animate-fade-in">
      <header class="mb-10 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Tax Refunds</h1>
          <p class="text-slate-400">View and track your tax refund applications and overpayment claims.</p>
        </div>
        <button routerLink="/member/refunds/apply" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-1">
          Apply for Refund
        </button>
      </header>

      <div class="grid grid-cols-1 gap-6">
        @for (item of refunds; track item.id) {
          <div class="glass-card p-6 border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
             <!-- Status Gradient -->
             <div class="absolute inset-y-0 left-0 w-1" [class]="item.statusBg"></div>
             
             <div class="flex flex-wrap lg:flex-nowrap gap-8 items-center">
                <!-- Icon -->
                <div class="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600/10 transition-colors">
                   <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>

                <div class="flex-grow">
                   <div class="flex items-center gap-3 mb-1">
                      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">{{ item.refNo }}</span>
                      <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">{{ item.obligation }}</span>
                   </div>
                   <h3 class="text-xl font-bold text-white mb-1">Claim for Period {{ item.period }}</h3>
                   <div class="text-2xl font-bold font-mono text-emerald-400 mb-2">{{ item.amount | number:'1.2-2' }} KES</div>
                   <div class="flex items-center text-slate-500 text-[10px] uppercase font-bold tracking-tight">
                      <span class="mr-4">Application Date: <strong class="text-slate-300">{{ item.appliedDate }}</strong></span>
                      <span>Expected Disbursement: <strong class="text-slate-300">{{ item.expectedDate }}</strong></span>
                   </div>
                </div>

                <div class="flex flex-col items-end gap-3 min-w-[200px]">
                   <span class="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" [class]="item.statusClass">{{ item.status }}</span>
                   <div class="text-[10px] text-slate-500 text-right">
                      {{ item.statusNote }}
                   </div>
                   <button class="text-blue-400 text-xs font-bold hover:underline mt-2">View Full Audit Log</button>
                </div>
             </div>
          </div>
        } @empty {
          <div class="glass-card p-20 text-center flex flex-col items-center">
             <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p class="text-slate-400">No active refund claims found.</p>
          </div>
        }
      </div>

      <!-- Bank Details Hook -->
      <div class="mt-12 p-8 glass-card bg-blue-600/5 border-blue-500/20 flex justify-between items-center">
         <div class="flex items-center">
            <div class="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mr-6">
               <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <div>
               <h4 class="text-white font-bold">Disbursement Account</h4>
               <p class="text-slate-500 text-xs uppercase tracking-widest font-bold">KCB BANK •••••• 8821</p>
            </div>
         </div>
         <button class="text-blue-400 font-bold hover:underline text-sm uppercase">Change Account</button>
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
      statusClass: 'bg-blue-500/10 text-blue-400',
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
      statusClass: 'bg-emerald-500/10 text-emerald-400',
      statusBg: 'bg-emerald-500',
      statusNote: 'Funds transferred to bank account on 2025-08-12.'
    }
  ];
}
