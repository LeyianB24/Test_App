import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MpesaParserService, MpesaTransaction, MpesaSummary } from '../../../../services/mpesa-parser.service';

@Component({
  selector: 'app-mpesa-analyser',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="analyser p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">M-PESA Statement Analyser</h1>
        <p class="text-slate-500 mt-1">Upload your M-PESA statement to auto-categorize transactions for KRA filing</p>
      </header>

      <!-- Upload Zone -->
      @if (!summary()) {
        <div class="upload-zone"
             (dragover)="onDragOver($event)"
             (dragleave)="isDragging.set(false)"
             (drop)="onDrop($event)"
             [class.dragging]="isDragging()">
          <div class="upload-inner">
            <div class="upload-icon">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-slate-300">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-700 mt-4">Drop your M-PESA CSV statement here</h3>
            <p class="text-slate-400 text-sm mt-1">or click to browse files</p>
            <input type="file" accept=".csv" (change)="onFileSelected($event)" class="file-input" id="mpesa-upload" aria-label="Upload M-PESA CSV statement"/>
            <label for="mpesa-upload" class="browse-btn mt-4">Browse Files</label>
          </div>
        </div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="error-bar mt-4">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ error() }}
        </div>
      }

      <!-- Results Dashboard -->
      @if (summary()) {
        <div class="results animate-fade-in">
          <!-- KPI Row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div class="kpi income">
              <span class="kpi-label">Total Income</span>
              <span class="kpi-val">KES {{ formatNum(summary()!.totalIncome) }}</span>
            </div>
            <div class="kpi expense">
              <span class="kpi-label">Total Expenses</span>
              <span class="kpi-val">KES {{ formatNum(summary()!.totalExpenses) }}</span>
            </div>
            <div class="kpi net">
              <span class="kpi-label">Net Income</span>
              <span class="kpi-val" [class.negative]="summary()!.netIncome < 0">KES {{ formatNum(summary()!.netIncome) }}</span>
            </div>
            <div class="kpi count">
              <span class="kpi-label">Transactions</span>
              <span class="kpi-val">{{ summary()!.transactionCount }}</span>
            </div>
          </div>

          <!-- Monthly Breakdown -->
          <div class="card mb-8">
            <h3 class="card-title">Monthly Income vs Expenses</h3>
            <div class="monthly-grid mt-4">
              @for (m of summary()!.monthlyBreakdown; track m.month) {
                <div class="month-col">
                  <div class="month-bars">
                    <div class="bar-income" [style.height.%]="getMonthBarHeight(m.income, 'income')">
                      <span class="bar-tooltip">KES {{ formatNum(m.income) }}</span>
                    </div>
                    <div class="bar-expense" [style.height.%]="getMonthBarHeight(m.expenses, 'expense')">
                      <span class="bar-tooltip">KES {{ formatNum(m.expenses) }}</span>
                    </div>
                  </div>
                  <span class="month-label">{{ m.month }}</span>
                </div>
              }
            </div>
            <div class="legend mt-4">
              <span class="legend-item"><span class="dot-income"></span> Income</span>
              <span class="legend-item"><span class="dot-expense"></span> Expenses</span>
            </div>
          </div>

          <!-- Category Breakdown -->
          <div class="card mb-8">
            <h3 class="card-title">Transaction Categories</h3>
            <div class="cat-list mt-4">
              @for (cat of summary()!.categories; track cat.name) {
                <div class="cat-row">
                  <span class="cat-name">{{ cat.name }}</span>
                  <div class="cat-bar-track">
                    <div class="cat-bar-fill" [class]="cat.type === 'income' ? 'fill-green' : 'fill-red'" [style.width.%]="getCatPercent(cat.amount)"></div>
                  </div>
                  <span class="cat-amount">KES {{ formatNum(cat.amount) }}</span>
                  <span class="cat-count">({{ cat.count }})</span>
                </div>
              }
            </div>
          </div>

          <!-- Top Senders & Recipients side by side -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div class="card">
              <h3 class="card-title">Top Income Sources</h3>
              <div class="entity-list mt-3">
                @for (s of summary()!.topSenders; track s.name) {
                  <div class="entity-row">
                    <span class="entity-name">{{ s.name }}</span>
                    <span class="entity-amount text-green-600">KES {{ formatNum(s.amount) }}</span>
                  </div>
                }
              </div>
            </div>
            <div class="card">
              <h3 class="card-title">Top Expense Recipients</h3>
              <div class="entity-list mt-3">
                @for (r of summary()!.topRecipients; track r.name) {
                  <div class="entity-row">
                    <span class="entity-name">{{ r.name }}</span>
                    <span class="entity-amount text-red-500">KES {{ formatNum(r.amount) }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Transaction Table -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="card-title mb-0">All Transactions ({{ transactions().length }})</h3>
              <button class="reset-btn" (click)="reset()">Upload New Statement</button>
            </div>
            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Receipt</th>
                    <th>Date</th>
                    <th>Details</th>
                    <th>Category</th>
                    <th class="text-right">In (KES)</th>
                    <th class="text-right">Out (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  @for (tx of transactions(); track tx.receiptNo) {
                    <tr>
                      <td class="font-mono text-xs">{{ tx.receiptNo }}</td>
                      <td class="text-xs">{{ tx.completionDate }}</td>
                      <td class="text-sm max-w-xs truncate">{{ tx.details }}</td>
                      <td><span class="cat-badge">{{ tx.category }}</span></td>
                      <td class="text-right text-green-600 font-bold">{{ tx.paidIn > 0 ? formatNum(tx.paidIn) : '' }}</td>
                      <td class="text-right text-red-500 font-bold">{{ tx.withdrawn > 0 ? formatNum(tx.withdrawn) : '' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .analyser { max-width: 1400px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    .upload-zone {
      border: 3px dashed #e2e8f0; border-radius: 32px; padding: 60px 40px;
      text-align: center; transition: all 0.3s; cursor: pointer; position: relative;
    }
    .upload-zone.dragging { border-color: #e31e24; background: rgba(227,30,36,0.03); }
    .upload-zone:hover { border-color: #cbd5e1; }
    .file-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .browse-btn {
      display: inline-block; padding: 12px 32px; border-radius: 16px;
      background: linear-gradient(135deg, #e31e24, #c0121a); color: white;
      font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: 0.3s;
    }
    .browse-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(227,30,36,0.3); }

    .error-bar {
      display: flex; align-items: center; gap: 10px; padding: 16px 20px;
      background: #fef2f2; border: 1px solid #fecaca; border-radius: 16px;
      color: #dc2626; font-weight: 700; font-size: 0.9rem;
    }

    .kpi {
      padding: 24px; border-radius: 24px; border: 1px solid #f1f5f9; background: white;
      display: flex; flex-direction: column; gap: 6px;
    }
    .kpi-label { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-val { font-size: 1.8rem; font-weight: 900; color: #1e293b; }
    .kpi.income .kpi-val { color: #16a34a; }
    .kpi.expense .kpi-val { color: #dc2626; }
    .kpi-val.negative { color: #dc2626; }

    .card {
      background: white; border-radius: 24px; padding: 28px;
      border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .card-title { font-size: 1.1rem; font-weight: 800; color: #334155; margin-bottom: 0; }

    .monthly-grid { display: flex; gap: 8px; align-items: flex-end; height: 160px; }
    .month-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .month-bars { display: flex; gap: 4px; align-items: flex-end; height: 140px; width: 100%; }
    .bar-income { flex: 1; background: linear-gradient(180deg, #22c55e, #86efac); border-radius: 6px 6px 0 0; min-height: 4px; position: relative; }
    .bar-expense { flex: 1; background: linear-gradient(180deg, #ef4444, #fca5a5); border-radius: 6px 6px 0 0; min-height: 4px; position: relative; }
    .bar-tooltip {
      position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: #1e293b;
      color: white; padding: 4px 8px; border-radius: 8px; font-size: 0.65rem; white-space: nowrap; opacity: 0;
      transition: opacity 0.2s; pointer-events: none; font-weight: 700;
    }
    .bar-income:hover .bar-tooltip, .bar-expense:hover .bar-tooltip { opacity: 1; }
    .month-label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; }
    .legend { display: flex; gap: 20px; justify-content: center; }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: #64748b; }
    .dot-income { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; }
    .dot-expense { width: 10px; height: 10px; border-radius: 50%; background: #ef4444; }

    .cat-list { display: flex; flex-direction: column; gap: 10px; }
    .cat-row { display: flex; align-items: center; gap: 12px; }
    .cat-name { width: 160px; font-size: 0.85rem; font-weight: 700; color: #475569; text-align: right; flex-shrink: 0; }
    .cat-bar-track { flex: 1; height: 24px; background: #f8fafc; border-radius: 12px; overflow: hidden; }
    .cat-bar-fill { height: 100%; border-radius: 12px; transition: width 0.8s ease; min-width: 4px; }
    .fill-green { background: linear-gradient(90deg, #22c55e, #86efac); }
    .fill-red { background: linear-gradient(90deg, #ef4444, #fca5a5); }
    .cat-amount { font-size: 0.85rem; font-weight: 800; color: #1e293b; width: 120px; text-align: right; }
    .cat-count { font-size: 0.75rem; color: #94a3b8; width: 40px; }

    .entity-list { display: flex; flex-direction: column; gap: 8px; }
    .entity-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f8fafc; border-radius: 12px; }
    .entity-name { font-size: 0.85rem; font-weight: 700; color: #475569; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .entity-amount { font-size: 0.9rem; font-weight: 800; }

    .reset-btn {
      padding: 10px 20px; border-radius: 14px; border: 2px solid #e2e8f0;
      background: white; color: #475569; font-weight: 800; font-size: 0.8rem;
      cursor: pointer; transition: 0.3s;
    }
    .reset-btn:hover { border-color: #e31e24; color: #e31e24; }

    .table-wrapper { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { padding: 12px 16px; text-align: left; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #f1f5f9; }
    td { padding: 10px 16px; border-bottom: 1px solid #f8fafc; color: #334155; }
    tr:hover td { background: #f8fafc; }
    .cat-badge { display: inline-block; padding: 3px 10px; border-radius: 8px; background: #f1f5f9; font-size: 0.75rem; font-weight: 700; color: #64748b; }
    .max-w-xs { max-width: 220px; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .text-right { text-align: right; }
  `]
})
export class MpesaAnalyserComponent {
  private parser = inject(MpesaParserService);

  transactions = signal<MpesaTransaction[]>([]);
  summary = signal<MpesaSummary | null>(null);
  error = signal('');
  isDragging = signal(false);

  private maxCatAmount = 0;
  private maxMonthIncome = 0;
  private maxMonthExpense = 0;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.processFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.processFile(file);
  }

  private processFile(file: File) {
    this.error.set('');

    if (!file.name.endsWith('.csv')) {
      this.error.set('Only CSV files are supported. Please export your M-PESA statement as CSV.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const csvText = reader.result as string;
        const txs = this.parser.parseCSV(csvText);

        if (txs.length === 0) {
          this.error.set('No transactions found. Please ensure this is a valid M-PESA CSV statement.');
          return;
        }

        this.transactions.set(txs);
        const sum = this.parser.summarize(txs);
        this.summary.set(sum);

        this.maxCatAmount = Math.max(...sum.categories.map(c => c.amount), 1);
        this.maxMonthIncome = Math.max(...sum.monthlyBreakdown.map(m => m.income), 1);
        this.maxMonthExpense = Math.max(...sum.monthlyBreakdown.map(m => m.expenses), 1);
      } catch (e) {
        this.error.set('Failed to parse the CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  }

  reset() {
    this.transactions.set([]);
    this.summary.set(null);
    this.error.set('');
  }

  formatNum(n: number): string {
    return Math.abs(n).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getCatPercent(amount: number): number {
    return this.maxCatAmount > 0 ? Math.max((amount / this.maxCatAmount) * 100, 3) : 0;
  }

  getMonthBarHeight(value: number, type: 'income' | 'expense'): number {
    const max = type === 'income' ? this.maxMonthIncome : this.maxMonthExpense;
    return max > 0 ? Math.max((value / max) * 100, 5) : 5;
  }
}
