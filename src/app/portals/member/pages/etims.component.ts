import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtimsService } from '../../../services/etims.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-etims',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- Elite Header -->
        <header class="db-header-elite animate-fade-in">
          <div class="header-left">
            <div class="live-badge">
              <div class="live-dot"></div>
              FISCAL GATEWAY
            </div>
            <h1 class="premium-title">e<span class="text-red">TIMS</span> Registry</h1>
            <p class="premium-subtitle">Electronic Tax Invoice Management System · Statutory Fiscal Synch</p>
          </div>
          
          <div class="header-right">
            <div class="sync-status">
              <span class="live-dot"></span>
              LIVE SYNC ACTIVE
            </div>
            <button class="btn-primary-elite" (click)="showInvoiceDialog.set(true)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              NEW INVOICE
            </button>
          </div>
        </header>

        <!-- HD Metrics Grid -->
        <div class="main-grid animate-fade-in" style="animation-delay: 0.1s">
          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">TOTAL INVOICES</span>
              <div class="metric-value">{{ allInvoices().length }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">NET REVENUE</span>
              <div class="metric-value">KES {{ totalRevenue() | number:'1.0-0' }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon text-red">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">VAT OBLIGATION</span>
              <div class="metric-value text-red">KES {{ totalTax() | number:'1.0-0' }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon text-green">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">GATEWAY STATUS</span>
              <div class="metric-value text-green">ONLINE</div>
            </div>
          </div>
        </div>

        <!-- Toolbar / Registry Panel -->
        <div class="elite-card table-panel animate-fade-in" style="animation-delay: 0.2s">
          <div class="card-glow"></div>
          <div class="table-toolbar-elite">
            <div class="filter-tabs-elite">
              <button class="filter-tab-elite" [class.active]="activeFilter === 'all'" (click)="activeFilter = 'all'">
                All <span class="tab-count-elite">{{ allInvoices().length }}</span>
              </button>
              <button class="filter-tab-elite" [class.active]="activeFilter === 'synced'" (click)="activeFilter = 'synced'">
                Synced <span class="tab-count-elite synced">{{ syncedInvoices().length }}</span>
              </button>
              <button class="filter-tab-elite" [class.active]="activeFilter === 'pending'" (click)="activeFilter = 'pending'">
                Pending <span class="tab-count-elite alert">{{ pendingInvoices().length }}</span>
              </button>
            </div>
            <div class="search-box-elite">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Trace invoices..." [(ngModel)]="searchQuery" (input)="onSearch()">
            </div>
          </div>

          <div class="registry-list">
            @for (invoice of filteredInvoices(); track invoice.id) {
              <div class="registry-item animate-fade-in" [class]="invoice.status">
                <div class="ri-left">
                  <div class="ri-type">{{ invoice.invoiceNumber }}</div>
                  <div class="ri-period">{{ invoice.date }}</div>
                </div>
                <div class="ri-center">
                  <div class="customer-info-elite">
                    <div class="customer-avatar-elite">{{ invoice.customerName.charAt(0) }}</div>
                    <div class="customer-details-elite">
                      <div class="customer-name-elite">{{ invoice.customerName }}</div>
                      <div class="ri-period">Verified Entity</div>
                    </div>
                  </div>
                </div>
                <div class="ri-stats-stack">
                  <div class="ri-stat-row">
                    <span class="ri-stat-label">NET</span>
                    <span class="ri-stat-val text-pri">KES {{ invoice.amount | number:'1.0-0' }}</span>
                  </div>
                  <div class="ri-stat-row">
                    <span class="ri-stat-label">VAT</span>
                    <span class="ri-stat-val text-red">KES {{ invoice.taxAmount | number:'1.0-0' }}</span>
                  </div>
                </div>
                <div class="ri-right">
                  <span class="status-badge" [class]="invoice.status === 'synced' ? 'success' : (invoice.status === 'pending' ? 'alert' : 'danger')">
                    {{ invoice.status | uppercase }}
                  </span>
                  <div class="action-stack-elite">
                    @if (invoice.status === 'pending') {
                      <button class="btn-primary-elite btn-table-action" (click)="syncInvoice(invoice.id)" [disabled]="syncing() === invoice.id">
                        {{ syncing() === invoice.id ? 'SYNCING...' : 'SYNC NOW' }}
                      </button>
                    } @else if (invoice.status === 'error') {
                      <button class="btn-primary-elite btn-table-action danger" (click)="retrySync(invoice.id)">RETRY</button>
                    } @else {
                      <button class="icon-btn-elite" (click)="downloadInvoice(invoice)"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
                    }
                  </div>
                </div>
              </div>
            } @empty {
              <div class="empty-state-elite">
                <div class="empty-icon text-muted">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <p>Registry Clear. No fiscal transactions match your search.</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Filing Modal -->
      @if (showInvoiceDialog()) {
        <div class="modal-overlay-elite animate-fade-in">
          <div class="modal-box elite-card animate-scale-in">
            <div class="card-glow"></div>
            <div class="panel-header-elite">
              <div class="header-left-stack">
                <h3 class="panel-title">Filing <span class="text-red">Sequence</span></h3>
                <p class="panel-desc">Generate eTIMS Synchronized Transaction</p>
              </div>
              <button class="close-btn" (click)="cancelInvoiceDialog()">✕</button>
            </div>
            
            <div class="modal-body-elite">
              <div class="mpesa-form-elite">
                <div class="input-group-elite">
                  <label>CUSTOMER / ENTITY NAME</label>
                  <input type="text" [(ngModel)]="newInvoice.customerName" placeholder="e.g. Safaricom PLC or A000000000Z">
                </div>

                <div class="ri-center-grid">
                  <div class="input-group-elite">
                    <label>NET AMOUNT (KES)</label>
                    <input type="number" [(ngModel)]="newInvoice.amount" placeholder="0.00">
                  </div>
                  <div class="input-group-elite">
                    <label>VAT PROTOCOL</label>
                    <div class="select-wrap-elite">
                      <select [(ngModel)]="newInvoice.taxRate">
                        <option [ngValue]="0.16">16% — Standard Rate</option>
                        <option [ngValue]="0">0% — Zero Rated</option>
                        <option [ngValue]="0.08">8% — Reduced Rate</option>
                      </select>
                    </div>
                  </div>
                </div>

                @if (newInvoice.amount > 0) {
                  <div class="tax-matrix-preview">
                    <div class="tm-row"><span>NET AMOUNT</span><span>KES {{ newInvoice.amount | number:'1.0-0' }}</span></div>
                    <div class="tm-row"><span>VAT ({{ newInvoice.taxRate * 100 }}%)</span><span class="text-red">KES {{ (newInvoice.amount * newInvoice.taxRate) | number:'1.0-0' }}</span></div>
                    <div class="tm-row total"><span>TOTAL PAYABLE</span><span class="text-red">KES {{ (newInvoice.amount * (1 + newInvoice.taxRate)) | number:'1.0-0' }}</span></div>
                  </div>
                }

                <div class="info-alert-elite">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span>This invoice will be immediately registered on the <strong>KRA National Ledger</strong> and cannot be revoked once committed.</span>
                </div>

                <div class="form-actions-elite">
                  <button class="btn-ghost-elite" (click)="cancelInvoiceDialog()" style="flex: 1">DISCARD</button>
                  <button class="btn-primary-elite" (click)="createInvoice()" [disabled]="!newInvoice.customerName || !newInvoice.amount" style="flex: 2">
                    COMMIT & SYNC TO KRA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

    /* ═══════════════════════════════
       CSS VARIABLES — KRA PALETTE
    ═══════════════════════════════ */
    :host {
      --kra-green: #1A7A3C;
      --kra-green-light: #22A052;
      --kra-green-pale: rgba(26,122,60,0.08);
      --kra-green-glow: rgba(26,122,60,0.2);
      --kra-red: #C0392B;
      --kra-red-light: #E74C3C;
      --kra-red-pale: rgba(192,57,43,0.08);
      --kra-blue: #1565C0;
      --kra-blue-pale: rgba(21,101,192,0.1);
      --kra-gold: #F59E0B;
      --kra-gold-pale: rgba(245,158,11,0.1);

      --bg-base: #0B0F0E;
      --bg-surface: #111916;
      --bg-card: #14201A;
      --bg-card-hover: #192820;
      --bg-elevated: #1C2B22;
      --border-subtle: rgba(26,122,60,0.15);
      --border-mid: rgba(26,122,60,0.25);
      --text-primary: #E8F5EC;
      --text-secondary: #8EA898;
      --text-muted: #4A6258;

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ═══════════════ ROOT ══════════════ */
    .etims-root {
      min-height: 100vh;
      background: var(--bg-base);
      position: relative;
      overflow-x: hidden;
      color: var(--text-primary);
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* ═══════════════ AMBIENT BG ══════════════ */
    .ambient-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .ambient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.12;
    }
    .orb-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, var(--kra-green) 0%, transparent 70%);
      top: -200px; left: -100px;
      animation: orbFloat 18s ease-in-out infinite alternate;
    }
    .orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, var(--kra-red) 0%, transparent 70%);
      bottom: -100px; right: -50px;
      animation: orbFloat 22s ease-in-out infinite alternate-reverse;
    }
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(26,122,60,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(26,122,60,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
    }
    @keyframes orbFloat {
      from { transform: translate(0,0) scale(1); }
      to   { transform: translate(40px, 30px) scale(1.1); }
    }

    /* ═══════════════ CONTENT ══════════════ */
    .etims-content {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px 64px;
    }

    /* ═══════════════ HEADER ══════════════ */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 36px;
      flex-wrap: wrap;
    }
    .header-brand { display: flex; align-items: center; gap: 16px; }
    .kra-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--kra-green);
      color: #fff;
      padding: 10px 16px;
      border-radius: 14px;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 1px;
      box-shadow: 0 4px 24px var(--kra-green-glow), 0 0 0 1px rgba(255,255,255,0.1) inset;
      flex-shrink: 0;
    }
    .page-title {
      font-size: clamp(22px, 4vw, 32px);
      font-weight: 900;
      color: var(--text-primary);
      letter-spacing: -1px;
      line-height: 1.1;
    }
    .title-accent { color: var(--kra-green-light); }
    .page-subtitle {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
      letter-spacing: 0.3px;
      margin-top: 4px;
    }
    .header-actions { display: flex; align-items: center; gap: 14px; }
    .live-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 50px;
      padding: 8px 16px;
      font-size: 11px;
      font-weight: 700;
      color: var(--kra-green-light);
      letter-spacing: 1px;
    }
    .live-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--kra-green-light);
      box-shadow: 0 0 6px var(--kra-green-light);
      animation: pulse 1.8s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    .btn-generate {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--kra-green);
      color: #fff;
      border: none;
      border-radius: 12px;
      padding: 12px 22px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 20px var(--kra-green-glow);
      white-space: nowrap;
    }
    .btn-generate:hover {
      background: var(--kra-green-light);
      transform: translateY(-1px);
      box-shadow: 0 6px 28px var(--kra-green-glow);
    }

    /* ═══════════════ STATS GRID ══════════════ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 24px;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      border-radius: 20px 20px 0 0;
    }
    .stat-invoices::before { background: var(--kra-blue); }
    .stat-revenue::before { background: var(--kra-green-light); }
    .stat-vat::before { background: var(--kra-red); }
    .stat-status::before { background: var(--kra-gold); }
    .stat-card:hover { transform: translateY(-2px); border-color: var(--border-mid); }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }
    .stat-label {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: var(--text-muted);
    }
    .stat-icon-wrap {
      width: 36px; height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-blue { background: var(--kra-blue-pale); color: #5B9BD5; }
    .icon-green { background: var(--kra-green-pale); color: var(--kra-green-light); }
    .icon-red { background: var(--kra-red-pale); color: var(--kra-red-light); }
    .icon-gold { background: var(--kra-gold-pale); color: var(--kra-gold); }

    .stat-value {
      font-size: 32px;
      font-weight: 900;
      color: var(--text-primary);
      line-height: 1;
      letter-spacing: -1.5px;
      margin-bottom: 12px;
    }
    .stat-value.compact { font-size: 22px; letter-spacing: -0.8px; }
    .stat-value.gateway-online { color: var(--kra-green-light); font-size: 24px; letter-spacing: 2px; }

    .stat-footer { margin-bottom: 14px; }
    .stat-delta {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .stat-delta.positive { background: var(--kra-green-pale); color: var(--kra-green-light); }
    .stat-delta.neutral { background: rgba(255,255,255,0.05); color: var(--text-secondary); }

    .stat-bar {
      height: 3px;
      background: rgba(255,255,255,0.06);
      border-radius: 3px;
      overflow: hidden;
    }
    .stat-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
      opacity: 0.7;
    }
    .gateway-bars {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 20px;
    }
    .gbar {
      flex: 1;
      background: var(--kra-green-light);
      border-radius: 2px;
      opacity: 0.6;
      animation: barPulse 1.5s ease-in-out infinite;
    }
    .gbar:nth-child(1) { animation-delay: 0s; }
    .gbar:nth-child(2) { animation-delay: 0.15s; }
    .gbar:nth-child(3) { animation-delay: 0.3s; }
    .gbar:nth-child(4) { animation-delay: 0.45s; }
    .gbar:nth-child(5) { animation-delay: 0.6s; }
    .gbar:nth-child(6) { animation-delay: 0.75s; }
    .gbar:nth-child(7) { animation-delay: 0.9s; }
    @keyframes barPulse {
      0%,100% { opacity: 0.4; transform: scaleY(0.7); }
      50% { opacity: 0.9; transform: scaleY(1); }
    }

    /* ═══════════════ TABLE PANEL ══════════════ */
    .table-panel {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      overflow: hidden;
    }

    .table-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-elevated);
      gap: 16px;
      flex-wrap: wrap;
    }
    .filter-tabs {
      display: flex;
      gap: 4px;
      background: var(--bg-surface);
      border-radius: 12px;
      padding: 4px;
    }
    .filter-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: none;
      border-radius: 9px;
      padding: 7px 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-tab.active {
      background: var(--bg-card);
      color: var(--text-primary);
      box-shadow: 0 1px 8px rgba(0,0,0,0.3);
    }
    .tab-count {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 5px;
      background: rgba(255,255,255,0.07);
    }
    .tab-count.synced { background: var(--kra-green-pale); color: var(--kra-green-light); }
    .tab-count.pending { background: var(--kra-gold-pale); color: var(--kra-gold); }
    .tab-count.error { background: var(--kra-red-pale); color: var(--kra-red-light); }

    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 10px 16px;
      min-width: 260px;
      transition: border-color 0.2s;
    }
    .search-box:focus-within { border-color: var(--kra-green); }
    .search-box svg { color: var(--text-muted); flex-shrink: 0; }
    .search-box input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      width: 100%;
    }
    .search-box input::placeholder { color: var(--text-muted); }

    .table-scroll { overflow-x: auto; }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 700px;
    }
    .invoice-table thead tr {
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border-subtle);
    }
    .invoice-table th {
      padding: 14px 20px;
      text-align: left;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1.2px;
      color: var(--text-muted);
    }
    .invoice-table .text-right { text-align: right; }
    .invoice-row {
      border-bottom: 1px solid rgba(26,122,60,0.07);
      transition: background 0.15s;
    }
    .invoice-row:last-child { border-bottom: none; }
    .invoice-row:hover { background: var(--bg-card-hover); }
    .invoice-table td {
      padding: 16px 20px;
      font-size: 13px;
    }

    .invoice-number {
      font-family: 'Courier New', monospace;
      font-weight: 700;
      color: var(--kra-green-light);
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    .date-cell { color: var(--text-secondary); font-size: 12px; font-weight: 500; }
    .customer-cell { display: flex; align-items: center; gap: 10px; }
    .customer-avatar {
      width: 34px; height: 34px;
      border-radius: 10px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 12px;
      color: var(--kra-green-light);
      flex-shrink: 0;
    }
    .customer-name { font-weight: 600; font-size: 13px; }
    .amount-cell { font-weight: 700; font-size: 13px; }
    .tax-cell { color: var(--text-secondary); font-size: 12px; font-weight: 600; }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .status-synced { background: var(--kra-green-pale); color: var(--kra-green-light); }
    .status-pending { background: var(--kra-gold-pale); color: var(--kra-gold); }
    .status-error { background: var(--kra-red-pale); color: var(--kra-red-light); }
    .status-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
    .status-synced .status-dot { box-shadow: 0 0 5px var(--kra-green-light); }
    .status-pending .status-dot { animation: pulse 1.4s infinite; }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      border-radius: 9px;
      padding: 8px 14px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.3px;
    }
    .action-sync {
      background: var(--kra-green-pale);
      color: var(--kra-green-light);
      border: 1px solid rgba(26,122,60,0.2);
    }
    .action-sync:hover:not(:disabled) { background: var(--kra-green); color: #fff; }
    .action-sync:disabled { opacity: 0.5; cursor: not-allowed; }
    .action-retry {
      background: var(--kra-red-pale);
      color: var(--kra-red-light);
      border: 1px solid rgba(192,57,43,0.2);
    }
    .action-retry:hover { background: var(--kra-red); color: #fff; }
    .action-download {
      background: rgba(255,255,255,0.04);
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
    }
    .action-download:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); }
    .spin { animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
      padding: 64px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .empty-icon { color: var(--text-muted); margin-bottom: 8px; opacity: 0.5; }
    .empty-title { font-weight: 700; font-size: 16px; }
    .empty-sub { font-size: 13px; color: var(--text-secondary); }

    /* ═══════════════ MODAL ══════════════ */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border-mid);
      border-radius: 24px;
      width: 100%;
      max-width: 520px;
      overflow: hidden;
      animation: slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1);
      box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(26,122,60,0.1) inset;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(24px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .modal-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 24px;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-elevated);
    }
    .modal-header-icon {
      width: 44px; height: 44px;
      background: var(--kra-green-pale);
      border: 1px solid rgba(26,122,60,0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--kra-green-light);
      flex-shrink: 0;
    }
    .modal-title { font-size: 17px; font-weight: 800; }
    .modal-sub { font-size: 12px; color: var(--text-secondary); margin-top: 3px; }
    .modal-close {
      margin-left: auto;
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      width: 36px; height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .modal-close:hover { background: var(--kra-red-pale); color: var(--kra-red-light); border-color: transparent; }

    .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
    .field-group { display: flex; flex-direction: column; gap: 8px; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .field-label { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: var(--text-secondary); text-transform: uppercase; }
    .field-input, .field-select {
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 12px 16px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      width: 100%;
    }
    .field-input:focus, .field-select:focus {
      border-color: var(--kra-green);
      box-shadow: 0 0 0 3px var(--kra-green-pale);
    }
    .field-input::placeholder { color: var(--text-muted); }
    .field-select { cursor: pointer; appearance: none; }
    .field-select option { background: var(--bg-card); }

    .tax-preview {
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .tax-preview-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .tax-preview-row span:last-child { font-weight: 700; color: var(--text-primary); }
    .tax-preview-row.total {
      padding-top: 10px;
      border-top: 1px solid var(--border-subtle);
      color: var(--text-primary);
      font-weight: 700;
      font-size: 14px;
    }
    .tax-preview-row.total span:last-child { color: var(--kra-green-light); font-size: 16px; font-weight: 800; }

    .kra-notice {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--kra-green-pale);
      border: 1px solid rgba(26,122,60,0.2);
      border-radius: 12px;
      padding: 14px 16px;
      color: var(--kra-green-light);
      font-size: 12px;
      line-height: 1.6;
    }
    .kra-notice svg { flex-shrink: 0; margin-top: 2px; }
    .kra-notice strong { font-weight: 700; }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 20px 24px;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-elevated);
    }
    .btn-cancel {
      background: transparent;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      padding: 11px 20px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
    .btn-commit {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--kra-green);
      border: none;
      border-radius: 10px;
      padding: 11px 22px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 16px var(--kra-green-glow);
    }
    .btn-commit:hover:not(:disabled) { background: var(--kra-green-light); transform: translateY(-1px); }
    .btn-commit:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .mt-4 { margin-top: 16px; }

    /* ═══════════════ RESPONSIVE ══════════════ */
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .etims-content { padding: 16px 16px 48px; }
      .page-header { flex-direction: column; align-items: flex-start; }
      .header-actions { width: 100%; justify-content: space-between; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .stat-card { padding: 18px; }
      .stat-value { font-size: 24px; }
      .stat-value.compact { font-size: 17px; }
      .table-toolbar { flex-direction: column; align-items: stretch; }
      .filter-tabs { overflow-x: auto; }
      .search-box { min-width: 0; }
      .field-row { grid-template-columns: 1fr; }
    }
    @media (max-width: 400px) {
      .stats-grid { grid-template-columns: 1fr; }
      .kra-badge span { display: none; }
    }
  `]
})
export class EtimsComponent {
  private etimsService = inject(EtimsService);

  searchQuery = '';
  activeFilter: 'all' | 'synced' | 'pending' | 'error' = 'all';
  showInvoiceDialog = signal(false);
  syncing = signal<string | null>(null);
  newInvoice = { customerName: '', amount: 0, taxRate: 0.16 };

  allInvoices = this.etimsService.allInvoices;
  syncedInvoices = this.etimsService.syncedInvoices;
  pendingInvoices = this.etimsService.pendingInvoices;
  errorInvoices = this.etimsService.errorInvoices;
  totalRevenue = this.etimsService.totalRevenue;
  totalTax = this.etimsService.totalTax;

  filteredInvoices = computed(() => {
    let invoices = this.allInvoices();
    if (this.activeFilter !== 'all') invoices = invoices.filter(inv => inv.status === this.activeFilter);
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      invoices = invoices.filter(inv =>
        inv.customerName.toLowerCase().includes(q) || inv.invoiceNumber.toLowerCase().includes(q)
      );
    }
    return invoices;
  });

  createInvoice() {
    if (!this.newInvoice.customerName || !this.newInvoice.amount) return;
    this.etimsService.createInvoice(this.newInvoice.customerName, this.newInvoice.amount, this.newInvoice.taxRate).subscribe({
      next: () => { alert('Invoice created and synced successfully.'); this.cancelInvoiceDialog(); },
      error: () => alert('Error: Failed to create invoice.')
    });
  }

  cancelInvoiceDialog() {
    this.showInvoiceDialog.set(false);
    this.newInvoice = { customerName: '', amount: 0, taxRate: 0.16 };
  }

  syncInvoice(id: string) {
    this.syncing.set(id);
    this.etimsService.syncInvoice(id).subscribe({
      next: () => this.syncing.set(null),
      error: () => this.syncing.set(null)
    });
  }

  retrySync(id: string) { this.syncInvoice(id); }
  onSearch() {}

  downloadInvoice(invoice: any) {
    const url = `c:/xampp/htdocs/itax/kra-itax/src/environments/environment.apiUrl/download.php?type=invoice&id=${invoice.id}&format=pdf`;
    window.open(url, '_blank');
  }
}