import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReconciliationItem {
  id: string;
  source: 'eTIMS' | 'Payslip' | 'Bank' | 'Manual';
  date: string;
  description: string;
  amount: number;
  itaxPrepopulated: number;
  variance: number;
  status: 'Match' | 'Discrepancy' | 'Missing';
  category: string;
}

@Component({
  selector: 'app-reconciliation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              FISCAL RECONCILIATION ENGINE
            </span>
          </div>
          <h1 class="premium-title">Prepopulation <span class="gradient-text">Sync</span></h1>
          <p class="premium-subtitle">Authorized verification of personal ledger archives against statutory eTIMS & iTax prepopulation data</p>
        </div>
        
        <div class="flex gap-4">
           <button (click)="fetchPrepopulation()" class="modern-btn primary-btn py-4 px-8 shadow-xl shadow-red-500/20 elite-glow !rounded-2xl">
              REFRESH OBLIGATION ARCHIVE
           </button>
        </div>
      </header>

      <!-- Elite Performance Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="glass-panel p-8 group relative overflow-hidden transition-all hover:border-emerald-500/30">
          <div class="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div class="flex justify-between items-start mb-6 relative z-10">
             <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Statutory Match Rate</span>
             <span class="text-[9px] font-black text-emerald-500">{{ matchesPercent() | number:'1.0-0' }}% ACCURACY</span>
          </div>
          <div class="text-4xl font-black text-white tracking-tighter mb-6 relative z-10">{{ matchesCount() }} <span class="text-xs text-slate-600">ENTRIES</span></div>
          <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative z-10 border border-white/5">
            <div class="h-full bg-emerald-500 transition-all duration-1000" [style.width.%]="matchesPercent()"></div>
          </div>
        </div>

        <div class="glass-panel p-8 group relative overflow-hidden transition-all hover:border-red-500/30">
          <div class="absolute -right-12 -top-12 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-all"></div>
          <div class="flex justify-between items-start mb-6 relative z-10">
             <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Pending Discrepancies</span>
             <span class="text-[9px] font-black text-red-500 animate-pulse">ACTION REQUIRED</span>
          </div>
          <div class="text-4xl font-black text-white tracking-tighter mb-6 relative z-10">{{ discrepanciesCount() }} <span class="text-xs text-slate-600">PROTOCOLS</span></div>
          <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative z-10 border border-white/5">
            <div class="h-full bg-red-500 transition-all duration-1000" [style.width.%]="discrepanciesPercent()"></div>
          </div>
        </div>

        <div class="glass-panel p-8 group relative overflow-hidden bg-gradient-to-br from-blue-600/5 to-transparent border-blue-500/20">
          <div class="absolute -right-12 -top-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div class="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 relative z-10">Net Fiscal Variance</div>
          <div class="text-3xl font-black tracking-tighter tabular-nums mb-4 relative z-10" [class.text-red-500]="totalVariance() !== 0" [class.text-white]="totalVariance() === 0">
            <span class="text-xs text-slate-600 mr-2">KES</span>{{ totalVariance().toLocaleString() }}
          </div>
          <p class="text-[9px] text-slate-500 font-bold uppercase tracking-widest relative z-10">Audited across {{ items().length }} ledger archives</p>
        </div>
      </div>

      <!-- Main Reconciliation Matrix -->
      <div class="glass-panel overflow-hidden p-0 bg-white/[0.01] border-white/5 relative mb-14">
        
        <!-- Strategy Bar -->
        <div class="flex flex-wrap items-center justify-between gap-6 p-8 border-b border-white/5 bg-white/[0.01] relative z-20">
          <div class="flex gap-2 p-1 bg-slate-950 border border-white/5 rounded-xl">
            <button class="px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all" 
                    [class.bg-white]="filter() === 'all'" [class.text-slate-950]="filter() === 'all'"
                    [class.text-slate-500]="filter() !== 'all'" [class.hover:text-white]="filter() !== 'all'"
                    (click)="filter.set('all')">ALL PROTOCOLS</button>
            <button class="px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all" 
                    [class.bg-red-600]="filter() === 'discrepancy'" [class.text-white]="filter() === 'discrepancy'"
                    [class.text-slate-500]="filter() !== 'discrepancy'" [class.hover:text-white]="filter() !== 'discrepancy'"
                    (click)="filter.set('discrepancy')">DISCREPANCIES</button>
            <button class="px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all" 
                    [class.bg-emerald-600]="filter() === 'match'" [class.text-white]="filter() === 'match'"
                    [class.text-slate-500]="filter() !== 'match'" [class.hover:text-white]="filter() !== 'match'"
                    (click)="filter.set('match')">MATCHES</button>
          </div>
          
          <button class="modern-btn border-white/10 text-slate-400 px-6 py-3 rounded-xl hover:bg-white/[0.05] hover:text-white transition-all shadow-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
             EXPORT FISCAL REPORT
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[9px] uppercase font-black text-slate-600 bg-white/[0.02] border-b border-white/5 tracking-[0.2em]">
                <th class="px-8 py-6">Fiscal Date</th>
                <th class="px-8 py-6">Archive Source</th>
                <th class="px-8 py-6">Protocol Description</th>
                <th class="px-8 py-6 text-right">Personal Ledger</th>
                <th class="px-8 py-6 text-right">Statutory Arch</th>
                <th class="px-8 py-6 text-right">Fiscal Variance</th>
                <th class="px-8 py-6">Sync Status</th>
                <th class="px-8 py-6 text-center">Protocol Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.02]">
              @for (item of filteredItems(); track item.id) {
                <tr class="group hover:bg-white/[0.01] transition-all" [class.bg-red-500/[0.02]]="item.status === 'Discrepancy'">
                  <td class="px-8 py-8 whitespace-nowrap text-slate-500 font-bold text-[10px] uppercase tracking-widest">{{ item.date | date:'dd MMM yyyy' }}</td>
                  <td class="px-8 py-8">
                    <span class="px-3 py-1 bg-slate-900 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest"
                          [class.text-blue-400]="item.source === 'eTIMS'"
                          [class.text-violet-400]="item.source === 'Payslip'"
                          [class.text-emerald-400]="item.source === 'Bank'"
                          [class.text-slate-600]="item.source === 'Manual'">
                      {{ item.source }}
                    </span>
                  </td>
                  <td class="px-8 py-8">
                     <div class="text-sm font-black text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase leading-tight">{{ item.description }}</div>
                     <div class="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-1">{{ item.category }} CATEGORY</div>
                  </td>
                  <td class="px-8 py-8 text-right font-black text-white font-mono text-xs tabular-nums tracking-tighter">{{ item.amount.toLocaleString() }}</td>
                  <td class="px-8 py-8 text-right font-black text-slate-500 font-mono text-xs tabular-nums tracking-tighter">{{ item.itaxPrepopulated.toLocaleString() }}</td>
                  <td class="px-8 py-8 text-right font-black font-mono text-xs tabular-nums tracking-tighter" [class.text-red-500]="item.variance !== 0" [class.text-emerald-500]="item.variance === 0">
                    {{ item.variance > 0 ? '+' : '' }}{{ item.variance.toLocaleString() }}
                  </td>
                  <td class="px-8 py-8">
                    <span class="status-pill-elite active" [class.success]="item.status === 'Match'" [class.warning]="item.status === 'Discrepancy'">
                      <span class="dot"></span>
                      {{ item.status | uppercase }}
                    </span>
                  </td>
                  <td class="px-8 py-8 text-center">
                    <button class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-700 hover:text-white hover:border-red-500/30 transition-all font-black" title="Reconcile manually">
                       <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReconciliationComponent {
  items = signal<ReconciliationItem[]>([
    { id: '1', source: 'eTIMS', date: '2025-01-01', description: 'Sale of Goods', amount: 100000, itaxPrepopulated: 100000, variance: 0, status: 'Match', category: 'Sales' },
    { id: '2', source: 'Payslip', date: '2025-01-15', description: 'Salary Payment', amount: 50000, itaxPrepopulated: 50000, variance: 0, status: 'Match', category: 'Payroll' },
    { id: '3', source: 'Bank', date: '2025-01-20', description: 'Utility Bill Payment', amount: 5000, itaxPrepopulated: 5500, variance: -500, status: 'Discrepancy', category: 'Expenses' },
    { id: '4', source: 'eTIMS', date: '2025-02-05', description: 'Supply of Office Stationery', amount: 12400, itaxPrepopulated: 12400, variance: 0, status: 'Match', category: 'Expenses' },
    { id: '5', source: 'eTIMS', date: '2025-02-12', description: 'IT Support Services', amount: 95000, itaxPrepopulated: 95000, variance: 0, status: 'Match', category: 'Sales' },
    { id: '6', source: 'Bank', date: '2025-02-18', description: 'Rent Payment', amount: 30000, itaxPrepopulated: 30000, variance: 0, status: 'Match', category: 'Expenses' },
    { id: '7', source: 'Payslip', date: '2025-02-28', description: 'Consulting Fees', amount: 75000, itaxPrepopulated: 70000, variance: 5000, status: 'Discrepancy', category: 'Sales' },
    { id: '8', source: 'Manual', date: '2025-03-01', description: 'Petty Cash Reimbursement', amount: 1500, itaxPrepopulated: 0, variance: 1500, status: 'Discrepancy', category: 'Expenses' },
    { id: '9', source: 'eTIMS', date: '2025-03-10', description: 'Software License Renewal', amount: 25000, itaxPrepopulated: 25000, variance: 0, status: 'Match', category: 'Expenses' },
    { id: '10', source: 'Bank', date: '2025-03-15', description: 'Loan Repayment', amount: 10000, itaxPrepopulated: 10000, variance: 0, status: 'Match', category: 'Financial' },
  ]);

  filter = signal<'all' | 'match' | 'discrepancy'>('all');

  filteredItems = computed(() => {
    const currentFilter = this.filter();
    const currentItems = this.items();
    if (currentFilter === 'all') return currentItems;
    return currentItems.filter((i: any) => i.status.toLowerCase() === currentFilter);
  });

  matchesCount = computed(() => this.items().filter((i: any) => i.status === 'Match').length);
  discrepanciesCount = computed(() => this.items().filter((i: any) => i.status === 'Discrepancy').length);

  matchesPercent = computed(() => (this.matchesCount() / this.items().length) * 100);
  discrepanciesPercent = computed(() => (this.discrepanciesCount() / this.items().length) * 100);

  totalVariance = computed(() => this.items().reduce((acc: number, i) => acc + i.variance, 0));

  fetchPrepopulation() {
    console.log('Fetching statutory data...');
  }
}
