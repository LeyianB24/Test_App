import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tax-statement',
  imports: [CommonModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              FISCAL LEDGER ACCESS
            </span>
          </div>
          <h1 class="premium-title">Tax Ledger & <span class="gradient-text">Statements</span></h1>
          <p class="premium-subtitle">Comprehensive archive of synchronized transactions, statutory declarations, and liquidity transfers</p>
        </div>
        
        <div class="flex gap-4">
           <button class="modern-btn border-white/10 text-slate-400 px-6 py-4 rounded-2xl hover:bg-white/[0.05] hover:text-white transition-all shadow-xl font-black text-[10px] uppercase tracking-widest">
              Export Archive (CSV)
           </button>
           <button class="modern-btn primary-btn py-4 px-8 shadow-xl shadow-blue-500/20 elite-glow !rounded-2xl">
              Download Formal Statement (PDF)
           </button>
        </div>
      </header>

      <!-- Advanced Filters & Balance Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mb-12">
         <div class="glass-panel p-8 flex flex-wrap gap-8 items-center bg-white/[0.01] border-white/5 relative overflow-hidden group">
            <div class="absolute inset-0 bg-blue-500/[0.01] opacity-50 group-hover:bg-blue-500/[0.02] transition-colors"></div>
            
            <div class="form-group flex-grow min-w-[200px] relative z-10">
               <label class="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 block">Filter Obligation Profile</label>
               <select class="form-select bg-slate-950 border-white/5 rounded-xl text-white text-xs p-4 w-full focus:outline-none focus:border-blue-500/50 transition-all font-black uppercase tracking-widest">
                  <option>ALL STATUTORY OBLIGATIONS</option>
                  <option>VALUE ADDED TAX (VAT)</option>
                  <option>INCOME TAX - RESIDENT</option>
                  <option>PAYE (EMPLOYER)</option>
               </select>
            </div>
            <div class="form-group flex-shrink-0 relative z-10">
               <label class="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 block">Temporal Range</label>
               <div class="flex items-center gap-3">
                  <input type="date" class="bg-slate-950 border-white/5 rounded-xl text-white text-[10px] p-4 font-black focus:border-blue-500/50 transition-all">
                  <div class="w-2 h-px bg-slate-800"></div>
                  <input type="date" class="bg-slate-950 border-white/5 rounded-xl text-white text-[10px] p-4 font-black focus:border-blue-500/50 transition-all">
               </div>
            </div>
            <button class="modern-btn px-10 py-4 bg-white text-slate-950 font-black rounded-xl hover:bg-slate-200 transition-all text-[10px] uppercase tracking-widest self-end h-[56px] relative z-10">
               Apply Filter
            </button>
         </div>

         <div class="glass-panel p-8 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20 relative overflow-hidden group">
            <div class="absolute -right-12 -bottom-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
            <div class="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3 relative z-10">Unified Ledger Balance</div>
            <div class="text-3xl font-black text-white tracking-tighter tabular-nums mb-2 relative z-10">
               <span class="text-xs text-slate-600">KES</span>
               (152,440.00)
            </div>
            <div class="inline-flex items-center gap-2 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-lg relative z-10">
               <span class="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
               <span class="text-[8px] text-red-500 font-black uppercase tracking-widest">Active Liability</span>
            </div>
         </div>
      </div>

      <!-- Ledger Transaction Archive -->
      <div class="glass-panel p-0 overflow-hidden bg-white/[0.01] border-white/5 relative">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/[0.02] text-[9px] uppercase tracking-[0.3em] font-black text-slate-600 border-b border-white/5">
              <th class="px-10 py-6">Transaction Meta</th>
              <th class="px-10 py-6">Protocol Type</th>
              <th class="px-10 py-6">Protocol Reference</th>
              <th class="px-10 py-6 text-right">Debit (OBL)</th>
              <th class="px-10 py-6 text-right">Credit (LIQ)</th>
              <th class="px-10 py-6 text-right">Active Balance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/[0.02]">
            @for (row of ledger; track row.id) {
              <tr class="hover:bg-white/[0.01] transition-all group">
                <td class="px-10 py-8">
                   <div class="text-[10px] font-black text-slate-400 tracking-widest mb-1">{{ row.date | date:'dd MMM yyyy' }}</div>
                   <div class="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] font-mono">{{ row.obligation }}</div>
                </td>
                <td class="px-10 py-8">
                   <div class="text-sm font-black text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase">{{ row.type }}</div>
                   <div class="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1 opacity-60">{{ row.period }} FISCAL PERIOD</div>
                </td>
                <td class="px-10 py-8">
                   <span class="text-[9px] font-black text-blue-500/50 uppercase tracking-widest font-mono border border-blue-500/10 px-2 py-0.5 rounded-lg">{{ row.ref }}</span>
                </td>
                <td class="px-10 py-8 text-right font-mono text-xs font-black" [class.text-rose-500]="row.debit">
                   {{ row.debit ? (row.debit | number:'1.2-2') : '---' }}
                </td>
                <td class="px-10 py-8 text-right font-mono text-xs font-black text-emerald-500">
                   {{ row.credit ? (row.credit | number:'1.2-2') : '---' }}
                </td>
                <td class="px-10 py-8 text-right font-mono text-sm font-black text-white group-hover:text-blue-400 transition-colors tracking-tighter">
                   {{ row.balance | number:'1.2-2' }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaxStatementComponent {
  ledger = [
    {
      id: 1,
      date: '2026-02-15',
      type: 'VAT Return Filing',
      period: 'JAN 2026',
      ref: 'KRA202602158872',
      obligation: 'VALUE ADDED TAX (VAT)',
      debit: 88400.00,
      credit: 0,
      balance: -152440.00
    },
    {
      id: 2,
      date: '2026-02-08',
      type: 'PAYE Payment (M-PESA)',
      period: 'JAN 2026',
      ref: 'PRN992817266',
      obligation: 'PAYE (EMPLOYER)',
      debit: 0,
      credit: 45000.00,
      balance: -64040.00
    },
    {
      id: 3,
      date: '2026-01-20',
      type: 'Assessment Notice',
      period: 'YEAR 2025',
      ref: 'AS-8812-JAI',
      obligation: 'INCOME TAX - RESIDENT',
      debit: 109040.00,
      credit: 0,
      balance: -109040.00
    },
    {
      id: 4,
      date: '2025-12-12',
      type: 'Payment (BANK TRANSFER)',
      period: 'DEC 2025',
      ref: 'PRN11029933',
      obligation: 'VALUE ADDED TAX (VAT)',
      debit: 0,
      credit: 120000.00,
      balance: 0.00
    }
  ];
}
