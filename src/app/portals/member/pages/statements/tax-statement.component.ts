import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tax-statement',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tax-statement-container p-6 animate-fade-in">
      <header class="mb-10 flex flex-wrap justify-between items-end gap-6">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Tax Ledger & Statements</h1>
          <p class="text-slate-400">Comprehensive view of all your tax transactions: payments, returns, and assessments.</p>
        </div>
        
        <div class="flex gap-4">
           <button class="px-6 py-2 bg-slate-800 border border-white/5 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-all text-sm uppercase tracking-widest">
              Export CSV
           </button>
           <button class="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-sm uppercase tracking-widest">
              Download PDF
           </button>
        </div>
      </header>

      <!-- Filters & Balance -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
         <div class="lg:col-span-3 glass-card p-6 flex flex-wrap gap-6 items-center">
            <div class="form-group flex-1 min-w-[200px]">
               <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Tax Obligation</label>
               <select class="form-select bg-slate-900/50 border-white/5 rounded-xl text-white text-sm w-full p-3 focus:outline-none focus:border-blue-500">
                  <option>All Obligations</option>
                  <option>Value Added Tax (VAT)</option>
                  <option>Income Tax - Resident</option>
                  <option>PAYE</option>
               </select>
            </div>
            <div class="form-group flex-1 min-w-[200px]">
               <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Date Range</label>
               <div class="flex gap-2">
                  <input type="date" class="bg-slate-900/50 border-white/5 rounded-xl text-white text-xs p-3 flex-1">
                  <input type="date" class="bg-slate-900/50 border-white/5 rounded-xl text-white text-xs p-3 flex-1">
               </div>
            </div>
            <button class="px-8 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-white transition-all text-xs uppercase self-end h-[50px]">
               Filter
            </button>
         </div>

         <div class="glass-card p-6 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/30">
            <div class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Net Ledger Balance</div>
            <div class="text-3xl font-bold text-white font-mono">(152,440.00)</div>
            <div class="text-[9px] text-rose-400 font-bold uppercase mt-1 tracking-tighter">Debit / Liability</div>
         </div>
      </div>

      <!-- Ledger Table -->
      <div class="glass-card overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-800/80 text-[10px] uppercase tracking-widest font-bold text-slate-400">
              <th class="px-6 py-5">Date</th>
              <th class="px-6 py-5">Transaction Type</th>
              <th class="px-6 py-5">Reference</th>
              <th class="px-6 py-5">Obligation</th>
              <th class="px-6 py-5 text-right">Debit (KES)</th>
              <th class="px-6 py-5 text-right">Credit (KES)</th>
              <th class="px-6 py-5 text-right">Balance (KES)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            @for (row of ledger; track row.id) {
              <tr class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-5 text-slate-400 font-mono text-xs">{{ row.date }}</td>
                <td class="px-6 py-5">
                   <div class="text-white font-bold text-sm">{{ row.type }}</div>
                   <div class="text-[9px] text-slate-500 uppercase">{{ row.period }}</div>
                </td>
                <td class="px-6 py-5 text-slate-500 font-mono text-[10px]">{{ row.ref }}</td>
                <td class="px-6 py-5 text-slate-300 text-xs">{{ row.obligation }}</td>
                <td class="px-6 py-5 text-right text-rose-400 font-mono font-bold">{{ row.debit ? (row.debit | number:'1.2-2') : '-' }}</td>
                <td class="px-6 py-5 text-right text-emerald-400 font-mono font-bold">{{ row.credit ? (row.credit | number:'1.2-2') : '-' }}</td>
                <td class="px-6 py-5 text-right text-white font-mono font-bold">{{ row.balance | number:'1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
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
export class TaxStatementComponent {
  ledger = [
    {
      id: 1,
      date: '2026-02-15',
      type: 'VAT Return Filing',
      period: 'Jan 2026',
      ref: 'KRA202602158872',
      obligation: 'Value Added Tax (VAT)',
      debit: 88400.00,
      credit: 0,
      balance: -152440.00
    },
    {
      id: 2,
      date: '2026-02-08',
      type: 'PAYE Payment (M-Pesa)',
      period: 'Jan 2026',
      ref: 'PRN992817266',
      obligation: 'PAYE',
      debit: 0,
      credit: 45000.00,
      balance: -64040.00
    },
    {
      id: 3,
      date: '2026-01-20',
      type: 'Assessment Notice',
      period: 'Year 2025',
      ref: 'AS-8812-JAI',
      obligation: 'Income Tax - Resident',
      debit: 109040.00,
      credit: 0,
      balance: -109040.00
    },
    {
      id: 4,
      date: '2025-12-12',
      type: 'Payment (Bank Transfer)',
      period: 'Dec 2025',
      ref: 'PRN11029933',
      obligation: 'VAT',
      debit: 0,
      credit: 120000.00,
      balance: 0.00
    }
  ];
}
