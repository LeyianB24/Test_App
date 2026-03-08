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
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="reconciliation-page p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Prepopulation Reconciliation</h1>
        <p class="text-slate-500 mt-1">Compare your records against KRA prepopulated data (eTIMS & iTax)</p>
      </header>

      <!-- KPI Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="kpi-card match">
          <span class="label">Total Matches</span>
          <span class="value">{{ matchesCount() }}</span>
          <div class="status-bar"><div class="fill" [style.width.%]="matchesPercent()"></div></div>
        </div>
        <div class="kpi-card discrepancy">
          <span class="label">Discrepancies found</span>
          <span class="value">{{ discrepanciesCount() }}</span>
          <div class="status-bar"><div class="fill" [style.width.%]="discrepanciesPercent()"></div></div>
        </div>
        <div class="kpi-card total">
          <span class="label">Net Variance</span>
          <span class="value" [class.text-red-600]="totalVariance() !== 0">KES {{ totalVariance().toLocaleString() }}</span>
          <span class="subtext">Across {{ items().length }} entries</span>
        </div>
      </div>

      <!-- Filters & Actions -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div class="flex gap-2">
          <button class="filter-btn" [class.active]="filter() === 'all'" (click)="filter.set('all')">All</button>
          <button class="filter-btn" [class.active]="filter() === 'discrepancy'" (click)="filter.set('discrepancy')">Discrepancies</button>
          <button class="filter-btn" [class.active]="filter() === 'match'" (click)="filter.set('match')">Matches</button>
        </div>
        <div class="flex gap-2">
          <button class="action-btn secondary">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export Variance Report
          </button>
          <button class="action-btn primary">Fetch iTax Prepopulation</button>
        </div>
      </div>

      <!-- Main Comparison Table -->
      <div class="card overflow-hidden">
        <div class="table-container">
          <table class="recon-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Description</th>
                <th class="text-right">Your Amount</th>
                <th class="text-right">iTax Prepopulated</th>
                <th class="text-right">Variance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (item of filteredItems(); track item.id) {
                <tr [class.row-error]="item.status === 'Discrepancy'">
                  <td class="text-slate-500 font-medium">{{ item.date }}</td>
                  <td><span class="badge" [class]="item.source.toLowerCase()">{{ item.source }}</span></td>
                  <td class="font-bold text-slate-700">{{ item.description }}</td>
                  <td class="text-right font-mono">{{ item.amount.toLocaleString() }}</td>
                  <td class="text-right font-mono text-slate-500">{{ item.itaxPrepopulated.toLocaleString() }}</td>
                  <td class="text-right font-mono" [class.text-red-600]="item.variance !== 0">
                    {{ item.variance > 0 ? '+' : '' }}{{ item.variance.toLocaleString() }}
                  </td>
                  <td>
                    <div class="status-pill" [class]="item.status.toLowerCase()">
                      <div class="dot"></div>
                      {{ item.status }}
                    </div>
                  </td>
                  <td>
                    <button class="icon-btn" title="Reconcile manually">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
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
    .reconciliation-page { max-width: 1400px; margin: 0 auto; }
    .card { background: white; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    
    .kpi-card {
      background: white; padding: 24px; border-radius: 24px; border: 1px solid #f1f5f9;
      display: flex; flex-direction: column; gap: 8px; position: relative;
    }
    .kpi-card .label { font-size: 0.8rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-card .value { font-size: 2.2rem; font-weight: 900; color: #1e293b; }
    .kpi-card .subtext { font-size: 0.8rem; color: #94a3b8; }
    .status-bar { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin-top: 8px; }
    .status-bar .fill { height: 100%; transition: width 1s ease-out; }
    .match .fill { background: #22c55e; }
    .discrepancy .fill { background: #e31e24; }

    .filter-btn {
      padding: 8px 20px; border-radius: 12px; font-weight: 700; font-size: 0.85rem;
      border: 2px solid transparent; background: #f1f5f9; color: #64748b; transition: 0.3s;
    }
    .filter-btn.active { background: #1e293b; color: white; }
    
    .action-btn {
      display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 14px;
      font-weight: 800; font-size: 0.85rem; transition: 0.3s; border: none; cursor: pointer;
    }
    .action-btn.primary { background: #e31e24; color: white; }
    .action-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(227,30,36,0.2); }
    .action-btn.secondary { background: white; color: #1e293b; border: 2px solid #e2e8f0; }

    .table-container { overflow-x: auto; }
    .recon-table { width: 100%; border-collapse: collapse; text-align: left; }
    .recon-table th { padding: 18px 20px; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
    .recon-table td { padding: 16px 20px; border-bottom: 1px solid #f8fafc; font-size: 0.9rem; }
    .recon-table tr:hover td { background: #fbfcfd; }
    .recon-table tr.row-error td { background: #fff5f5; }

    .badge { padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
    .badge.etims { background: #e0f2fe; color: #0369a1; }
    .badge.payslip { background: #fef3c7; color: #92400e; }
    .badge.bank { background: #f0fdf4; color: #166534; }
    .badge.manual { background: #f1f5f9; color: #475569; }

    .status-pill {
      display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 50px;
      font-size: 0.75rem; font-weight: 800;
    }
    .status-pill.match { background: #dcfce7; color: #166534; }
    .status-pill.match .dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
    .status-pill.discrepancy { background: #fee2e2; color: #991b1b; }
    .status-pill.discrepancy .dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; }

    .icon-btn {
      width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      transition: 0.3s; color: #94a3b8; border: 1px solid #e2e8f0; background: white; cursor: pointer;
    }
    .icon-btn:hover { color: #e31e24; border-color: #e31e24; }

    .text-right { text-align: right; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  `]
})
export class ReconciliationComponent {
  items = signal<ReconciliationItem[]>([
    { id: '1', source: 'eTIMS', date: '2025-01-15', description: 'Sale to Kengen PLC', amount: 450000, itaxPrepopulated: 450000, variance: 0, status: 'Match', category: 'Sales' },
    { id: '2', source: 'Payslip', date: '2025-01-28', description: 'January Basic Salary', amount: 125000, itaxPrepopulated: 120000, variance: 5000, status: 'Discrepancy', category: 'Income' },
    { id: '3', source: 'Bank', date: '2025-01-10', description: 'Consultancy Fees - ABC Corp', amount: 85000, itaxPrepopulated: 0, variance: 85000, status: 'Discrepancy', category: 'Sales' },
    { id: '4', source: 'eTIMS', date: '2025-02-05', description: 'Supply of Office Stationery', amount: 12400, itaxPrepopulated: 12400, variance: 0, status: 'Match', category: 'Expenses' },
    { id: '5', source: 'eTIMS', date: '2025-02-12', description: 'IT Support Services', amount: 95000, itaxPrepopulated: 95000, variance: 0, status: 'Match', category: 'Sales' },
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
