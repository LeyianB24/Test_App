import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tax-statement',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner">
        <header class="premium-header">
          <div class="header-main">
            <div class="header-tag">
              <span class="tag-glow"></span>
              <span class="tag-text">Fiscal Ledger Protocol</span>
            </div>
            <h1 class="premium-title">Tax <span class="red-gradient">Statements</span></h1>
            <p class="premium-subtitle">Authorized extraction of statutory obligation ledgers and historical financial telemetry</p>
          </div>
          
          <div class="action-stack">
            <button class="btn-ghost-elite">
               <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
               XLS REPORT
            </button>
            <button class="btn-primary-elite">
               <div class="btn-glow"></div>
               <span class="relative z-10 flex items-center gap-2">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  DOWNLOAD PDF
               </span>
            </button>
          </div>
        </header>

        <!-- Search & Filter Interface -->
        <div class="registry-toolbar">
           <div class="search-wrap">
              <svg class="search-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                type="text" 
                [(ngModel)]="searchTerm" 
                placeholder="Query registry by identifier, obligation or amount..." 
                class="search-input"
              >
           </div>
           
           <div class="filter-cluster">
              <div class="filter-box">
                 <select [(ngModel)]="selectedObligation" class="filter-select">
                    <option value="ALL">ALL OBLIGATIONS</option>
                    <option value="VAT">VAT</option>
                    <option value="PAYE">PAYE</option>
                    <option value="INCOME">INCOME TAX</option>
                 </select>
              </div>
           </div>
        </div>

        <!-- Ledger Surface -->
        <div class="ledger-surface">
           <table class="elite-table">
              <thead>
                 <tr>
                    <th>EFFECTIVE DATE</th>
                    <th>IDENTIFIER</th>
                    <th>PROTOCOL / OBLIGATION</th>
                    <th class="text-right">LIABILITY (DR)</th>
                    <th class="text-right">SETTLEMENT (CR)</th>
                    <th class="text-right">NET BALANCE</th>
                    <th>AUTH STATUS</th>
                 </tr>
              </thead>
              <tbody>
                 @for (row of filteredLedger(); track row.id) {
                    <tr class="ledger-row">
                       <td class="date-cell">
                          <span class="primary-date">{{ row.date | date:'dd MMM yyyy' }}</span>
                          <span class="secondary-time">14:20:05 UTC</span>
                       </td>
                       <td class="ref-cell">
                          <span class="mono-ref">{{ row.ref }}</span>
                       </td>
                       <td class="type-cell">
                          <div class="protocol-wrap">
                             <span class="protocol-title">{{ row.type }}</span>
                             <span class="protocol-tag">{{ row.obligation }}</span>
                          </div>
                       </td>
                       <td class="amount-cell text-right dr">
                          {{ row.debit > 0 ? (row.debit | number:'1.2-2') : '---' }}
                       </td>
                       <td class="amount-cell text-right cr">
                          {{ row.credit > 0 ? (row.credit | number:'1.2-2') : '---' }}
                       </td>
                       <td class="amount-cell text-right balance">
                          {{ row.balance | number:'1.2-2' }}
                       </td>
                       <td class="status-cell">
                          <span class="status-pill-elite active">
                             <span class="dot"></span>
                             POSTED
                          </span>
                       </td>
                    </tr>
                 } @empty {
                    <tr>
                       <td colspan="7">
                          <div class="empty-registry">
                             <div class="empty-icon-wrap">
                                <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                             </div>
                             <h3 class="empty-title">LEDGER INERT</h3>
                             <p class="empty-text">No financial movements detected for the requested temporal parameters.</p>
                          </div>
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
    :host { 
      --red: #D92B2B;
      --red-bright: #EF3B3B;
      --red-glow: rgba(217, 43, 43, 0.4);
      --red-pale: rgba(217, 43, 43, 0.1);
      --red-border: rgba(217, 43, 43, 0.2);
      --bg-root: #080809;
      --bg-surface: rgba(18, 18, 20, 0.6);
      --bdr: rgba(255, 255, 255, 0.05);
      --text-muted: #666670;
    }

    .db-root {
      min-height: 100vh;
      background: var(--bg-root);
      position: relative;
      overflow-x: hidden;
      color: #fff;
    }

    .noise-overlay {
      position: fixed; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3");
      opacity: 0.03;
      pointer-events: none;
      z-index: 1;
    }

    .accent-bleed {
      position: fixed; top: -10%; right: -5%;
      width: 60%; height: 50%;
      background: radial-gradient(circle at center, var(--red-pale) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
    }

    .db-inner {
      position: relative; z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    /* Header */
    .premium-header {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 48px;
      gap: 32px;
    }

    .header-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px;
      background: var(--red-pale);
      border: 1px solid var(--red-border);
      border-radius: 100px;
      margin-bottom: 16px;
    }
    .tag-glow { width: 6px; height: 6px; background: var(--red); border-radius: 50%; box-shadow: 0 0 10px var(--red); }
    .tag-text { font-size: 10px; font-weight: 900; color: var(--red-bright); letter-spacing: 2px; text-transform: uppercase; }

    .premium-title { font-size: 48px; font-weight: 950; letter-spacing: -2px; margin: 0; line-height: 1; }
    .red-gradient { background: linear-gradient(to right, #fff, var(--red-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .premium-subtitle { color: var(--text-muted); font-size: 14px; font-weight: 500; margin: 12px 0 0; letter-spacing: 0.5px; }

    .action-stack { display: flex; gap: 16px; }

    /* Buttons */
    .btn-primary-elite {
      position: relative; padding: 14px 28px;
      background: var(--red); color: white;
      border: none; border-radius: 16px;
      font-size: 11px; font-weight: 900; letter-spacing: 1px;
      cursor: pointer; overflow: hidden;
      transition: all 0.4s;
      box-shadow: 0 8px 24px var(--red-glow);
    }
    .btn-primary-elite:hover { transform: translateY(-2px); box-shadow: 0 12px 32px var(--red-glow); }
    .btn-glow { position: absolute; inset: 0; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent); transform: translateX(-100%); transition: transform 0.6s; }
    .btn-primary-elite:hover .btn-glow { transform: translateX(100%); }

    .btn-ghost-elite {
      padding: 14px 24px; background: rgba(255,255,255,0.03);
      border: 1px solid var(--bdr); border-radius: 16px;
      color: var(--text-muted); font-size: 10px; font-weight: 900;
      letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s;
      display: flex; align-items: center; gap: 8px;
    }
    .btn-ghost-elite:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.1); }

    /* Toolbar */
    .registry-toolbar {
      display: flex; gap: 24px; margin-bottom: 32px;
      padding: 20px; background: var(--bg-surface);
      border: 1px solid var(--bdr); border-radius: 24px;
      backdrop-filter: blur(24px);
    }

    .search-wrap { flex-grow: 1; position: relative; }
    .search-icon { position: absolute; left: 20px; top: 50%; translate: 0 -50%; color: var(--text-muted); }
    .search-input {
      width: 100%; height: 56px; background: #000;
      border: 1px solid var(--bdr); border-radius: 16px;
      padding: 0 20px 0 56px; color: #fff;
      font-size: 14px; font-weight: 500; outline: none;
      transition: all 0.3s;
    }
    .search-input:focus { border-color: var(--red-border); box-shadow: 0 0 0 4px var(--red-pale); }

    .filter-cluster { display: flex; gap: 12px; }
    .filter-select {
      height: 56px; background: #000; color: var(--text-muted);
      border: 1px solid var(--bdr); border-radius: 16px;
      padding: 0 40px 0 20px; font-size: 10px; font-weight: 900;
      letter-spacing: 1px; cursor: pointer; outline: none;
      appearance: none; transition: all 0.3s;
    }
    .filter-select:focus { border-color: var(--red-border); color: #fff; }

    /* Table */
    .ledger-surface {
      background: var(--bg-surface);
      border: 1px solid var(--bdr);
      border-radius: 32px;
      overflow: hidden;
      backdrop-filter: blur(24px);
    }

    .elite-table {
      width: 100%; border-collapse: collapse;
      font-size: 13px;
    }

    .elite-table th {
      padding: 24px 32px; background: rgba(0,0,0,0.3);
      text-align: left; font-size: 10px; font-weight: 950;
      color: var(--text-muted); letter-spacing: 2px;
      text-transform: uppercase; border-bottom: 1px solid var(--bdr);
    }

    .ledger-row { border-bottom: 1px solid var(--bdr); transition: all 0.3s; }
    .ledger-row:hover { background: rgba(255,255,255,0.02); }

    .elite-table td { padding: 24px 32px; }

    .primary-date { display: block; font-weight: 900; color: #fff; }
    .secondary-time { font-size: 10px; color: var(--text-muted); font-weight: 600; }

    .mono-ref { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: var(--red-bright); background: var(--red-pale); padding: 4px 10px; border-radius: 8px; }

    .protocol-wrap { display: flex; flex-direction: column; gap: 4px; }
    .protocol-title { font-weight: 900; color: #fff; }
    .protocol-tag { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 1px; }

    .amount-cell { font-family: 'JetBrains Mono', monospace; font-weight: 900; font-size: 15px; }
    .amount-cell.dr { color: #fff; }
    .amount-cell.cr { color: #10b981; }
    .amount-cell.balance { color: var(--red-bright); }

    .status-pill-elite {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px; background: rgba(255,255,255,0.05);
      border: 1px solid var(--bdr); border-radius: 100px;
      font-size: 9px; font-weight: 950; color: var(--text-muted);
      letter-spacing: 1px;
    }
    .status-pill-elite.active { background: var(--red-pale); border-color: var(--red-border); color: var(--red-bright); }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .empty-registry { padding: 80px 0; text-align: center; }
    .empty-icon-wrap { width: 80px; height: 80px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr); border-radius: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--text-muted); }
    .empty-title { font-size: 11px; font-weight: 950; color: #fff; letter-spacing: 4px; margin: 0 0 8px; }
    .empty-text { font-size: 13px; color: var(--text-muted); font-weight: 500; }

    @media (max-width: 1024px) {
      .premium-header { flex-direction: column; align-items: flex-start; gap: 32px; }
      .registry-toolbar { flex-direction: column; }
      .filter-cluster { width: 100%; }
      .filter-select { width: 100%; }
    }
  `],
})
export class TaxStatementComponent {
  searchTerm = signal('');
  selectedObligation = signal('ALL');
  
  ledger = signal([
    {
      id: 1,
      date: '2026-02-15',
      type: 'VAT Return Filing',
      period: 'JAN 2026',
      ref: 'KRA202602158872',
      obligation: 'VAT',
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
      obligation: 'PAYE',
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
      obligation: 'INCOME',
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
      obligation: 'VAT',
      debit: 0,
      credit: 120000.00,
      balance: 0.00
    }
  ]);

  filteredLedger = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const obl = this.selectedObligation();
    return this.ledger().filter(row => {
      const matchesSearch = !term || 
        row.type.toLowerCase().includes(term) || 
        row.ref.toLowerCase().includes(term) || 
        row.obligation.toLowerCase().includes(term);
      const matchesObligation = obl === 'ALL' || row.obligation === obl;
      return matchesSearch && matchesObligation;
    });
  });

  exportExcel() {
    console.log('Exporting Ledger Archive to XLS...');
  }

  exportPdf() {
    console.log('Generating Formal PDF Statement...');
  }
}
