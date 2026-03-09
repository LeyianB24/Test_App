import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [],
  template: `
    <div class="p-8 max-w-[1400px] mx-auto animate-fade-in relative">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent)]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-info)]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <header class="mb-10 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] mb-6">
           <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        </div>
        <h1 class="text-4xl font-black text-primary tracking-tight mb-2">Prepopulation Reconciliation</h1>
        <p class="premium-subtitle">Compare your records against KRA prepopulated data (eTIMS & iTax)</p>
      </header>

      <!-- KPI Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div class="glass-panel p-8 text-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-success)]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span class="premium-subtitle uppercase tracking-widest block !mt-0 !mb-4 z-10 relative">Total Matches</span>
          <span class="text-5xl font-black text-primary z-10 relative block tracking-tighter">{{ matchesCount() }}</span>
          <div class="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden mt-8 z-10 relative">
            <div class="h-full bg-[var(--color-success)] transition-all duration-1000" [style.width.%]="matchesPercent()"></div>
          </div>
        </div>
        <div class="glass-panel p-8 text-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-danger)]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span class="premium-subtitle uppercase tracking-widest block !mt-0 !mb-4 z-10 relative">Discrepancies found</span>
          <span class="text-5xl font-black text-primary z-10 relative block tracking-tighter">{{ discrepanciesCount() }}</span>
          <div class="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden mt-8 z-10 relative">
            <div class="h-full bg-[var(--color-danger)] transition-all duration-1000" [style.width.%]="discrepanciesPercent()"></div>
          </div>
        </div>
        <div class="glass-panel p-8 text-center relative overflow-hidden group border-[var(--color-accent)]/20">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span class="premium-subtitle uppercase tracking-widest block !mt-0 !mb-4 z-10 relative">Net Variance</span>
          <span class="text-4xl font-black z-10 relative block tracking-tighter" [class.text-[var(--color-danger)]]="totalVariance() !== 0" [class.text-primary]="totalVariance() === 0">
            KES {{ totalVariance().toLocaleString() }}
          </span>
          <span class="text-muted text-[10px] font-bold uppercase tracking-widest mt-8 block z-10 relative">Across {{ items().length }} entries</span>
        </div>
      </div>

      <!-- Main Comparison -->
      <div class="glass-panel overflow-hidden p-0 border border-subtle">
        
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-subtle bg-surface-2/30">
          <div class="flex gap-2 p-1 bg-surface-2 rounded-xl border border-subtle">
            <button class="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all" 
                    [class.bg-primary]="filter() === 'all'" [class.text-[var(--color-background)]]="filter() === 'all'"
                    [class.text-muted]="filter() !== 'all'" [class.hover:text-primary]="filter() !== 'all'"
                    (click)="filter.set('all')">All</button>
            <button class="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all" 
                    [class.bg-[var(--color-danger)]]="filter() === 'discrepancy'" [class.text-white]="filter() === 'discrepancy'"
                    [class.text-muted]="filter() !== 'discrepancy'" [class.hover:text-primary]="filter() !== 'discrepancy'"
                    (click)="filter.set('discrepancy')">Discrepancies</button>
            <button class="px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all" 
                    [class.bg-[var(--color-success)]]="filter() === 'match'" [class.text-white]="filter() === 'match'"
                    [class.text-muted]="filter() !== 'match'" [class.hover:text-primary]="filter() !== 'match'"
                    (click)="filter.set('match')">Matches</button>
          </div>
          <div class="flex gap-4">
            <button class="btn-precision bg-surface-2 text-primary border border-subtle hover:bg-subtle !py-3">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2 inline-block"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              EXPORT REPORT
            </button>
            <button class="btn-precision bg-[var(--color-accent)] text-[var(--color-background)] hover:opacity-90 !py-3">
              FETCH ITAX PREPOPULATION
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] uppercase font-black text-muted bg-surface-2 border-b border-subtle tracking-widest">
                <th class="px-6 py-5 whitespace-nowrap">Date</th>
                <th class="px-6 py-5 whitespace-nowrap">Source</th>
                <th class="px-6 py-5 whitespace-nowrap">Description</th>
                <th class="px-6 py-5 text-right whitespace-nowrap">Your Amount</th>
                <th class="px-6 py-5 text-right whitespace-nowrap">iTax Prepopulated</th>
                <th class="px-6 py-5 text-right whitespace-nowrap">Variance</th>
                <th class="px-6 py-5 whitespace-nowrap">Status</th>
                <th class="px-6 py-5 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-subtle">
              @for (item of filteredItems(); track item.id) {
                <tr class="group hover:bg-surface-2/50 transition-colors" [class.bg-[var(--color-danger)]]="item.status === 'Discrepancy'" [class.bg-opacity-5]="item.status === 'Discrepancy'">
                  <td class="px-6 py-5 whitespace-nowrap text-muted font-bold text-xs">{{ item.date }}</td>
                  <td class="px-6 py-5 whitespace-nowrap">
                    <span class="status-pill-precision border"
                          [class.border-[var(--color-info)]]="item.source === 'eTIMS'" [class.text-[var(--color-info)]]="item.source === 'eTIMS'"
                          [class.border-[var(--color-warning)]]="item.source === 'Payslip'" [class.text-[var(--color-warning)]]="item.source === 'Payslip'"
                          [class.border-[var(--color-success)]]="item.source === 'Bank'" [class.text-[var(--color-success)]]="item.source === 'Bank'"
                          [class.border-subtle]="item.source === 'Manual'" [class.text-muted]="item.source === 'Manual'">
                      {{ item.source }}
                    </span>
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap font-black text-primary">{{ item.description }}</td>
                  <td class="px-6 py-5 text-right whitespace-nowrap font-black text-primary font-mono tracking-tighter">{{ item.amount.toLocaleString() }}</td>
                  <td class="px-6 py-5 text-right whitespace-nowrap font-black text-muted font-mono tracking-tighter">{{ item.itaxPrepopulated.toLocaleString() }}</td>
                  <td class="px-6 py-5 text-right whitespace-nowrap font-black font-mono tracking-tighter" [class.text-[var(--color-danger)]]="item.variance !== 0" [class.text-primary]="item.variance === 0">
                    {{ item.variance > 0 ? '+' : '' }}{{ item.variance.toLocaleString() }}
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap">
                    <span class="status-pill-precision"
                          [class.bg-[var(--color-success)]]="item.status === 'Match'" [class.text-[var(--color-success)]]="item.status === 'Match'" [class.bg-opacity-10]="item.status === 'Match'"
                          [class.bg-[var(--color-danger)]]="item.status === 'Discrepancy'" [class.text-[var(--color-danger)]]="item.status === 'Discrepancy'" [class.bg-opacity-10]="item.status === 'Discrepancy'">
                      <div class="w-1.5 h-1.5 rounded-full mr-2 inline-block" [class.bg-[var(--color-success)]]="item.status === 'Match'" [class.bg-[var(--color-danger)]]="item.status === 'Discrepancy'"></div>
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-6 py-5 text-center whitespace-nowrap">
                    <button class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors mx-auto" title="Reconcile manually">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
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
  styles: [],
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
    return currentItems.filter(i => i.status.toLowerCase() === currentFilter);
  });

  matchesCount = computed(() => this.items().filter(i => i.status === 'Match').length);
  discrepanciesCount = computed(() => this.items().filter(i => i.status === 'Discrepancy').length);

  matchesPercent = computed(() => (this.matchesCount() / this.items().length) * 100);
  discrepanciesPercent = computed(() => (this.discrepanciesCount() / this.items().length) * 100);

  totalVariance = computed(() => this.items().reduce((acc, i) => acc + i.variance, 0));
}

