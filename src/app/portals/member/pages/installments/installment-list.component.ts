import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-installment-list',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="installments-list-container p-6 animate-fade-in">
      <header class="mb-10 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Payment Installment Plans</h1>
          <p class="text-slate-400">Manage your tax debt through structured monthly payment arrangements.</p>
        </div>
        <button routerLink="/member/installments/apply" class="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-600/20 transition-all hover:-translate-y-1">
          Apply for Installment Plan
        </button>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        @for (plan of plans; track plan.id) {
          <div class="glass-card overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all flex flex-col">
             <!-- Header -->
             <div class="p-6 bg-slate-800/50 border-b border-white/5 flex justify-between items-center">
                <div>
                   <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{{ plan.refNo }}</div>
                   <h3 class="text-white font-bold">{{ plan.obligation }}</h3>
                </div>
                <span class="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider" [class.bg-emerald-500/10]="plan.status === 'ACTIVE'" [class.text-emerald-400]="plan.status === 'ACTIVE'" [class.bg-blue-500/10]="plan.status === 'COMPLETED'" [class.text-blue-400]="plan.status === 'COMPLETED'">{{ plan.status }}</span>
             </div>

             <!-- Body -->
             <div class="p-6 space-y-6 flex-grow">
                <div class="flex justify-between items-end">
                   <div>
                      <div class="text-slate-500 text-[10px] uppercase font-bold mb-1">Total Debt Amount</div>
                      <div class="text-2xl font-bold text-white font-mono">{{ plan.totalAmount | number:'1.2-2' }} KES</div>
                   </div>
                   <div class="text-right">
                      <div class="text-slate-500 text-[10px] uppercase font-bold mb-1">Remaining Balance</div>
                      <div class="text-xl font-bold text-violet-400 font-mono">{{ plan.remainingBalance | number:'1.2-2' }} KES</div>
                   </div>
                </div>

                <!-- Progress Bar -->
                <div>
                   <div class="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-2">
                      <span>Progress</span>
                      <span>{{ plan.paidInstallments }}/{{ plan.totalInstallments }} Months Paid</span>
                   </div>
                   <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div class="h-full bg-violet-500 rounded-full" [style.width.%]="(plan.paidInstallments / plan.totalInstallments) * 100"></div>
                   </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-2">
                   <div class="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                      <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Next Payment Due</div>
                      <div class="text-white font-bold text-sm">{{ plan.nextDue }}</div>
                   </div>
                   <div class="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                      <div class="text-[9px] text-slate-500 uppercase font-bold mb-1">Monthly Amount</div>
                      <div class="text-white font-bold text-sm">{{ plan.monthlyAmount | number:'1.2-2' }} KES</div>
                   </div>
                </div>
             </div>

             <!-- Footer -->
             <div class="p-4 bg-slate-800/30 flex gap-4">
                <button class="flex-1 py-2 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 text-xs font-bold rounded-lg transition-all">Download Schedule</button>
                <button class="flex-1 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-lg transition-all">View Ledger</button>
             </div>
          </div>
        } @empty {
          <div class="lg:col-span-2 glass-card p-20 flex flex-col items-center justify-center text-center">
             <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </div>
             <p class="text-slate-400">You have no active installment plans.</p>
          </div>
        }
      </div>

      <!-- Compliance Note -->
      <div class="mt-12 p-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 flex items-start">
         <svg class="w-6 h-6 text-violet-400 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
         <div class="text-xs text-slate-400 leading-relaxed">
            <strong class="text-violet-400 block mb-1 uppercase tracking-widest">Compliance Tip:</strong>
            Defaulting on a single installment payment may result in the immediate cancellation of the plan and full debt recovery enforcement, including agency notices on your bank accounts.
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallmentListComponent {
  plans = [
    {
      id: 1,
      refNo: 'IPL-2025-001',
      obligation: 'Income Tax - 2024 Audit Debt',
      totalAmount: 450000.00,
      remainingBalance: 300000.00,
      monthlyAmount: 37500.00,
      paidInstallments: 4,
      totalInstallments: 12,
      nextDue: '2026-03-05',
      status: 'ACTIVE'
    },
    {
      id: 2,
      refNo: 'IPL-2024-012',
      obligation: 'VAT - Oct 2024 Penalties',
      totalAmount: 18000.00,
      remainingBalance: 0.00,
      monthlyAmount: 3000.00,
      paidInstallments: 6,
      totalInstallments: 6,
      nextDue: 'N/A',
      status: 'COMPLETED'
    }
  ];
}
