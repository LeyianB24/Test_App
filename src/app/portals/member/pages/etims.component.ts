import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtimsService } from '../../../services/etims.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-etims',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="etims-root">

      <!-- Ambient Background -->
      <div class="ambient-bg">
        <div class="ambient-orb orb-1"></div>
        <div class="ambient-orb orb-2"></div>
        <div class="grid-overlay"></div>
      </div>

      <div class="etims-content">

        <!-- ══════════ HEADER ══════════ -->
        <header class="page-header">
          <div class="header-brand">
            <div class="kra-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>KRA</span>
            </div>
            <div class="header-title-block">
              <h1 class="page-title">e<span class="title-accent">TIMS</span> Portal</h1>
              <p class="page-subtitle">Electronic Tax Invoice Management System · Kenya Revenue Authority</p>
            </div>
          </div>
          <div class="header-actions">
            <div class="live-indicator">
              <span class="live-dot"></span>
              <span>LIVE SYNC</span>
            </div>
            <button class="btn-generate" (click)="showInvoiceDialog.set(true)">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              <span>New Invoice</span>
            </button>
          </div>
        </header>

        <!-- ══════════ STAT CARDS ══════════ -->
        <div class="stats-grid">

          <div class="stat-card stat-invoices">
            <div class="stat-header">
              <span class="stat-label">TOTAL INVOICES</span>
              <div class="stat-icon-wrap icon-blue">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
            </div>
            <div class="stat-value">{{ allInvoices().length }}</div>
            <div class="stat-footer">
              <span class="stat-delta positive">+12% this month</span>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: 72%; background: var(--kra-blue)"></div>
            </div>
          </div>

          <div class="stat-card stat-revenue">
            <div class="stat-header">
              <span class="stat-label">NET REVENUE</span>
              <div class="stat-icon-wrap icon-green">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>
              </div>
            </div>
            <div class="stat-value compact">KES {{ totalRevenue() | number:'1.0-0' }}</div>
            <div class="stat-footer">
              <span class="stat-delta positive">+8.4% YoY</span>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: 85%; background: var(--kra-green)"></div>
            </div>
          </div>

          <div class="stat-card stat-vat">
            <div class="stat-header">
              <span class="stat-label">VAT OBLIGATION</span>
              <div class="stat-icon-wrap icon-red">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              </div>
            </div>
            <div class="stat-value compact">KES {{ totalTax() | number:'1.0-0' }}</div>
            <div class="stat-footer">
              <span class="stat-delta neutral">16% std. rate</span>
            </div>
            <div class="stat-bar">
              <div class="stat-bar-fill" style="width: 55%; background: var(--kra-red)"></div>
            </div>
          </div>

          <div class="stat-card stat-status">
            <div class="stat-header">
              <span class="stat-label">GATEWAY STATUS</span>
              <div class="stat-icon-wrap icon-green">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
            </div>
            <div class="stat-value gateway-online">ONLINE</div>
            <div class="stat-footer">
              <span class="stat-delta positive">All systems operational</span>
            </div>
            <div class="gateway-bars">
              <div class="gbar h-2"></div>
              <div class="gbar h-3"></div>
              <div class="gbar h-5"></div>
              <div class="gbar h-4"></div>
              <div class="gbar h-6"></div>
              <div class="gbar h-3"></div>
              <div class="gbar h-5"></div>
            </div>
          </div>

        </div>

        <!-- ══════════ TABLE PANEL ══════════ -->
        <div class="table-panel">

          <!-- Toolbar -->
          <div class="table-toolbar">
            <div class="filter-tabs">
              <button class="filter-tab" [class.active]="activeFilter === 'all'" (click)="activeFilter = 'all'">
                All <span class="tab-count">{{ allInvoices().length }}</span>
              </button>
              <button class="filter-tab" [class.active]="activeFilter === 'synced'" (click)="activeFilter = 'synced'">
                Synced <span class="tab-count synced">{{ syncedInvoices().length }}</span>
              </button>
              <button class="filter-tab" [class.active]="activeFilter === 'pending'" (click)="activeFilter = 'pending'">
                Pending <span class="tab-count pending">{{ pendingInvoices().length }}</span>
              </button>
              <button class="filter-tab" [class.active]="activeFilter === 'error'" (click)="activeFilter = 'error'">
                Error <span class="tab-count error">{{ errorInvoices().length }}</span>
              </button>
            </div>
            <div class="search-box">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search invoices or customers…" [(ngModel)]="searchQuery" (input)="onSearch()">
            </div>
          </div>

          <!-- Table -->
          <div class="table-scroll">
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>INVOICE NO.</th>
                  <th>DATE & TIME</th>
                  <th>CUSTOMER</th>
                  <th>NET AMT.</th>
                  <th>VAT</th>
                  <th>STATUS</th>
                  <th class="text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                @for (invoice of filteredInvoices(); track invoice.id) {
                  <tr class="invoice-row">
                    <td>
                      <span class="invoice-number">{{ invoice.invoiceNumber }}</span>
                    </td>
                    <td>
                      <span class="date-cell">{{ invoice.date }}</span>
                    </td>
                    <td>
                      <div class="customer-cell">
                        <div class="customer-avatar">{{ invoice.customerName.charAt(0) }}</div>
                        <span class="customer-name">{{ invoice.customerName }}</span>
                      </div>
                    </td>
                    <td><span class="amount-cell">KES {{ invoice.amount | number:'1.0-0' }}</span></td>
                    <td><span class="tax-cell">KES {{ invoice.taxAmount | number:'1.0-0' }}</span></td>
                    <td>
                      <div class="status-badge" [ngClass]="'status-' + invoice.status">
                        <span class="status-dot"></span>
                        {{ invoice.status | uppercase }}
                      </div>
                    </td>
                    <td class="text-right">
                      @if (invoice.status === 'pending') {
                        <button class="action-btn action-sync" (click)="syncInvoice(invoice.id)" [disabled]="syncing() === invoice.id">
                          @if (syncing() === invoice.id) {
                            <svg class="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                            Syncing…
                          } @else {
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                            Sync Now
                          }
                        </button>
                      } @else if (invoice.status === 'error') {
                        <button class="action-btn action-retry" (click)="retrySync(invoice.id)">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                          Retry
                        </button>
                      } @else {
                        <button class="action-btn action-download" title="Download Invoice">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          Download
                        </button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7">
                      <div class="empty-state">
                        <div class="empty-icon">
                          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <p class="empty-title">No invoices found</p>
                        <p class="empty-sub">No fiscal transactions match your current filters.</p>
                        <button class="btn-generate mt-4" (click)="showInvoiceDialog.set(true)">
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                          Create First Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

      </div><!-- /etims-content -->

      <!-- ══════════ MODAL ══════════ -->
      @if (showInvoiceDialog()) {
        <div class="modal-overlay" (click)="cancelInvoiceDialog()">
          <div class="modal-card" (click)="$event.stopPropagation()">

            <div class="modal-header">
              <div class="modal-header-icon">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <div>
                <h3 class="modal-title">Generate Invoice</h3>
                <p class="modal-sub">eTIMS Synchronized Transaction</p>
              </div>
              <button class="modal-close" (click)="cancelInvoiceDialog()">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="modal-body">
              <div class="field-group">
                <label class="field-label">Customer / Entity Name</label>
                <input class="field-input" type="text" [(ngModel)]="newInvoice.customerName" placeholder="e.g. Safaricom PLC or A000000000Z">
              </div>

              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">Transaction Amount (KES)</label>
                  <input class="field-input" type="number" [(ngModel)]="newInvoice.amount" placeholder="0.00">
                </div>
                <div class="field-group">
                  <label class="field-label">VAT Protocol</label>
                  <select class="field-select" [(ngModel)]="newInvoice.taxRate">
                    <option [ngValue]="0.16">16% — Standard Rate</option>
                    <option [ngValue]="0">0% — Zero Rated</option>
                    <option [ngValue]="0.08">8% — Reduced Rate</option>
                  </select>
                </div>
              </div>

              @if (newInvoice.amount > 0) {
                <div class="tax-preview">
                  <div class="tax-preview-row">
                    <span>Net Amount</span>
                    <span>KES {{ newInvoice.amount | number:'1.0-0' }}</span>
                  </div>
                  <div class="tax-preview-row">
                    <span>VAT ({{ newInvoice.taxRate * 100 }}%)</span>
                    <span>KES {{ (newInvoice.amount * newInvoice.taxRate) | number:'1.0-0' }}</span>
                  </div>
                  <div class="tax-preview-row total">
                    <span>Total Payable</span>
                    <span>KES {{ (newInvoice.amount * (1 + newInvoice.taxRate)) | number:'1.0-0' }}</span>
                  </div>
                </div>
              }

              <div class="kra-notice">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <p>This invoice will be immediately registered on the <strong>KRA National Ledger</strong> and cannot be deleted once committed.</p>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-cancel" (click)="cancelInvoiceDialog()">Cancel</button>
              <button class="btn-commit" (click)="createInvoice()" [disabled]="!newInvoice.customerName || !newInvoice.amount">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                Commit & Sync to KRA
              </button>
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
}