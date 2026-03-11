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
            <p class="premium-subtitle">Electronic Tax Invoice Management System · Statutory Fiscal Synchronization</p>
          </div>
          
          <div class="header-right">
            <div class="sync-status no-print">
              <div class="live-dot"></div>
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
              <div class="metric-value">{{ totalRevenue() | currency:'KES ':'symbol':'1.0-0' }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">VAT OBLIGATION</span>
              <div class="metric-value text-red">{{ totalTax() | currency:'KES ':'symbol':'1.0-0' }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">GATEWAY STATUS</span>
              <div class="metric-value text-red">SECURE</div>
            </div>
          </div>
        </div>

        <!-- Toolbar / Registry Panel -->
        <div class="elite-card table-panel animate-fade-in" style="animation-delay: 0.2s">
          <div class="card-glow"></div>
          <div class="table-toolbar-elite">
            <div class="filter-tabs-elite">
              <button class="filter-tab-elite" [class.active]="activeFilter === 'all'" (click)="activeFilter = 'all'">
                ALL <span class="tab-count-elite">{{ allInvoices().length }}</span>
              </button>
              <button class="filter-tab-elite" [class.active]="activeFilter === 'synced'" (click)="activeFilter = 'synced'">
                SYNCED <span class="tab-count-elite synced">{{ syncedInvoices().length }}</span>
              </button>
              <button class="filter-tab-elite" [class.active]="activeFilter === 'pending'" (click)="activeFilter = 'pending'">
                PENDING <span class="tab-count-elite alert">{{ pendingInvoices().length }}</span>
              </button>
            </div>
            
            <div class="search-box-elite">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Search registry..." [(ngModel)]="searchQuery" (input)="onSearch()">
            </div>
          </div>

          <div class="registry-list">
            @for (invoice of filteredInvoices(); track invoice.id) {
              <div class="registry-item animate-fade-in" [class]="invoice.status">
                <div class="ri-left">
                  <div class="ri-type">{{ invoice.invoiceNumber }}</div>
                  <div class="ri-period">{{ invoice.date | date:'mediumDate' }}</div>
                </div>
                <div class="ri-center">
                  <div class="customer-info-elite">
                    <div class="customer-avatar-elite">{{ invoice.customerName.charAt(0) }}</div>
                    <div class="customer-details">
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
                  <span class="status-badge" [class.success]="invoice.status === 'synced'" [class.alert]="invoice.status === 'pending'" [class.danger]="invoice.status === 'error'">
                    {{ invoice.status | uppercase }}
                  </span>
                  
                  <div class="action-stack-elite">
                    @if (invoice.status === 'pending') {
                      <button class="btn-primary-elite btn-table-action" (click)="syncInvoice(invoice.id)" [disabled]="syncing() === invoice.id">
                        {{ syncing() === invoice.id ? 'SYNCING...' : 'SYNC' }}
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
                <div class="empty-icon text-red">∅</div>
                <p>Registry Clear. No fiscal records detected.</p>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Filing Modal -->
      @if (showInvoiceDialog()) {
        <div class="modal-overlay-elite animate-fade-in">
          <div class="elite-card modal-box animate-scale-in">
            <div class="card-glow"></div>
            <div class="panel-header-elite">
              <div>
                <h3 class="panel-title">Filing <span class="text-red">Sequence</span></h3>
                <p class="panel-desc">Statutory eTIMS Transaction Registration</p>
              </div>
              <button class="close-btn" (click)="cancelInvoiceDialog()">✕</button>
            </div>
            
            <div class="modal-body-elite">
              <div class="mpesa-form-elite">
                <div class="input-group-elite">
                  <label>CUSTOMER / ENTITY NAME</label>
                  <input type="text" [(ngModel)]="newInvoice.customerName" placeholder="e.g. SAFARICOM PLC / A001234567Z">
                </div>

                <div class="ri-center-grid">
                  <div class="input-group-elite">
                    <label>NET VALUE (KES)</label>
                    <input type="number" [(ngModel)]="newInvoice.amount" placeholder="0.00">
                  </div>
                  <div class="input-group-elite">
                    <label>VAT PROTOCOL</label>
                    <select [(ngModel)]="newInvoice.taxRate">
                      <option [ngValue]="0.16">16% STANDARD RATE</option>
                      <option [ngValue]="0">0% ZERO RATED</option>
                      <option [ngValue]="0.08">8% REDUCED RATE</option>
                    </select>
                  </div>
                </div>

                @if (newInvoice.amount > 0) {
                  <div class="tax-matrix-preview">
                    <div class="tm-row"><span>NET VALUE</span><span>KES {{ newInvoice.amount | number:'1.0-0' }}</span></div>
                    <div class="tm-row"><span>VAT ({{ newInvoice.taxRate * 100 }}%)</span><span class="text-red">KES {{ (newInvoice.amount * newInvoice.taxRate) | number:'1.0-0' }}</span></div>
                    <div class="tm-row total"><span>AGGREGATE PAYABLE</span><span class="text-red">KES {{ (newInvoice.amount * (1 + newInvoice.taxRate)) | number:'1.0-0' }}</span></div>
                  </div>
                }

                <div class="info-alert-elite">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 15v2m0-6V7m0 11a9 9 0 110-18 9 9 0 010 18z"/></svg>
                  <span>This transaction will be committed to the <strong>KRA National Fiscal Ledger</strong>. Once synchronized, fiscal records cannot be revoked.</span>
                </div>

                <div class="form-actions-elite">
                  <button class="btn-ghost-elite flex-1" (click)="cancelInvoiceDialog()">ABORT</button>
                  <button class="btn-primary-elite flex-1" (click)="createInvoice()" [disabled]="!newInvoice.customerName || !newInvoice.amount">
                    COMMIT & SYNC
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
    :host {
      --red:          #D92B2B;
      --red-bright:   #EF3B3B;
      --red-glow:     rgba(217, 43, 43, 0.38);
      --red-pale:     rgba(217, 43, 43, 0.10);
      --red-border:   rgba(217, 43, 43, 0.22);

      --bg-root:      #0C0C0C;
      --bg-card:      #141414;
      --bg-card-2:    #1C1C1C;
      
      --text-pri:     #F0F0F0;
      --text-sec:     #888888;
      --text-mut:     #4A4A4A;

      --bdr:          rgba(255, 255, 255, 0.08);
      --bdr-md:       rgba(255, 255, 255, 0.14);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    @media (prefers-color-scheme: light) {
      :host {
        --bg-root:    #F2F2F4;
        --bg-card:    #FFFFFF;
        --bg-card-2:  #F8F8FA;
        --text-pri:   #111111;
        --text-sec:   #555560;
        --text-mut:   #9999A8;
        --bdr:        rgba(0, 0, 0, 0.08);
        --bdr-md:     rgba(0, 0, 0, 0.12);
      }
    }

    .db-root { 
      min-height: 100vh; 
      background: #050505 url('/assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      color: var(--text-pri); 
      position: relative; 
      overflow-x: hidden; 
    }
    
    .db-root::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { position: fixed; inset: 0; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAA6f7sBAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAD1JREFUeNoVjEkOACAIA53/f9qFA9S0mSBYhS6Yp7mXqR8B1Zp6InoSpOqJ6EnUInoStYieRC2iF9GLaE30JPojDPoA9WpU6YIAAAAASUVORK5CYII=') repeat; opacity: 0.02; pointer-events: none; z-index: 2; }

    .db-inner { 
      max-width: 1400px; 
      margin: 0 auto; 
      padding: 40px 28px 80px; 
      display: flex; 
      flex-direction: column; 
      gap: 40px; 
      position: relative; 
      z-index: 10; 
    }

    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
    .premium-title { font-size: clamp(32px, 5vw, 42px); font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--red); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); max-width: 500px; }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s ease-in-out infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .sync-status { display: flex; align-items: center; gap: 8px; color: #10B981; font-size: 10px; font-weight: 800; letter-spacing: 1px; }
    .header-right { display: flex; align-items: center; gap: 20px; }

    .main-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .elite-card { 
      background: rgba(20, 20, 20, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--bdr); 
      border-radius: 32px; 
      position: relative; 
      overflow: hidden; 
    }
    .card-glow { 
      position: absolute; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background: radial-gradient(circle at top right, var(--red-pale), transparent 40%); 
      pointer-events: none; 
      opacity: 0.4; 
    }

    .metric-card { padding: 32px; display: flex; align-items: center; gap: 24px; transition: transform 0.3s; }
    .metric-card:hover { transform: translateY(-4px); }
    .card-icon { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--text-sec); }
    .metric-label { font-size: 10px; font-weight: 800; color: var(--text-sec); letter-spacing: 1.5px; display: block; margin-bottom: 4px; }
    .metric-value { font-size: 28px; font-weight: 950; color: var(--text-pri); }

    .table-panel { padding: 0; }
    .table-toolbar-elite { padding: 24px 32px; border-bottom: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: center; gap: 24px; background: rgba(255,255,255,0.01); }
    .filter-tabs-elite { display: flex; background: var(--bg-root); padding: 4px; border-radius: 12px; border: 1px solid var(--bdr); }
    .filter-tab-elite { padding: 8px 16px; border-radius: 8px; border: none; background: transparent; color: var(--text-sec); font-size: 9px; font-weight: 950; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
    .filter-tab-elite.active { background: var(--bg-card); color: var(--text-pri); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    
    .tab-count-elite { font-size: 8px; padding: 2px 6px; border-radius: 4px; background: var(--bg-card-2); color: var(--text-mut); }
    .tab-count-elite.synced { color: #10B981; background: rgba(16, 185, 129, 0.1); }
    .tab-count-elite.alert { color: var(--red); background: var(--red-pale); }

    .search-box-elite { position: relative; flex: 1; max-width: 400px; }
    .search-box-elite svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-mut); }
    .search-box-elite input { width: 100%; background: var(--bg-root); border: 1px solid var(--bdr); border-radius: 12px; padding: 10px 16px 10px 42px; font-size: 13px; color: var(--text-pri); outline: none; transition: all 0.3s; }
    .search-box-elite input:focus { border-color: var(--red-border); background: var(--bg-card-2); }

    .registry-list { display: flex; flex-direction: column; }
    .registry-item { display: grid; grid-template-columns: 1.5fr 2fr 1fr 1.5fr; align-items: center; padding: 24px 32px; border-bottom: 1px solid var(--bdr); transition: all 0.2s; }
    .registry-item:hover { background: var(--bg-card-2); transform: translateX(8px); }
    .registry-item.synced { border-left: 4px solid #10B981; }
    .registry-item.pending { border-left: 4px solid #F59E0B; }
    .registry-item.error { border-left: 4px solid var(--red); }

    .ri-left { display: flex; flex-direction: column; gap: 2px; }
    .ri-type { font-size: 15px; font-weight: 900; color: var(--text-pri); }
    .ri-period { font-size: 11px; color: var(--text-sec); font-weight: 600; }

    .customer-info-elite { display: flex; align-items: center; gap: 12px; }
    .customer-avatar-elite { width: 36px; height: 36px; border-radius: 10px; background: var(--bg-card-3); display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--red); border: 1px solid var(--bdr); }
    .customer-name-elite { font-size: 13px; font-weight: 700; color: var(--text-pri); }

    .ri-stats-stack { display: flex; flex-direction: column; gap: 6px; }
    .ri-stat-row { display: flex; gap: 12px; justify-content: space-between; max-width: 140px; }
    .ri-stat-label { font-size: 8px; font-weight: 800; color: var(--text-mut); letter-spacing: 1px; }
    .ri-stat-val { font-size: 12px; font-weight: 700; }

    .ri-right { display: flex; align-items: center; justify-content: flex-end; gap: 20px; }
    .status-badge { padding: 4px 12px; border-radius: 50px; font-size: 9px; font-weight: 900; letter-spacing: 1px; }
    .status-badge.success { background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .status-badge.alert { background: rgba(245, 158, 11, 0.1); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.2); }
    .status-badge.danger { background: var(--red-pale); color: var(--red); border: 1px solid var(--red-border); }

    .action-stack-elite { display: flex; gap: 8px; }
    .icon-btn-elite { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-3); border: 1px solid var(--bdr); color: var(--text-sec); cursor: pointer; transition: all 0.2s; }
    .icon-btn-elite:hover { background: var(--red); color: #fff; border-color: var(--red); }

    .btn-table-action { padding: 6px 14px; font-size: 9px; border-radius: 8px; height: auto; }
    .btn-table-action.danger { background: #333; color: var(--red); }
    .btn-table-action.danger:hover { background: var(--red); color: white; }

    .empty-state-elite { padding: 80px 0; text-align: center; color: var(--text-mut); }
    .empty-icon { font-size: 40px; margin-bottom: 20px; opacity: 0.3; }

    /* Modal Architecture */
    .modal-overlay-elite { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .modal-box { width: 100%; max-width: 540px; }
    .panel-header-elite { padding: 32px; border-bottom: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: center; }
    .panel-title { font-size: 16px; font-weight: 950; color: var(--text-mut); letter-spacing: 2px; text-transform: uppercase; }
    .panel-desc { font-size: 11px; color: var(--text-sec); margin-top: 4px; }
    .close-btn { width: 34px; height: 34px; border-radius: 10px; background: var(--bg-card-3); border: 1px solid var(--bdr); color: var(--text-sec); cursor: pointer; }

    .modal-body-elite { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
    .mpesa-form-elite { display: flex; flex-direction: column; gap: 24px; }
    .input-group-elite { display: flex; flex-direction: column; gap: 8px; }
    .input-group-elite label { font-size: 9px; font-weight: 800; color: var(--text-mut); letter-spacing: 1.5px; }
    .input-group-elite input, .input-group-elite select { background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 12px; padding: 12px 16px; color: var(--text-pri); font-size: 14px; outline: none; transition: 0.2s; }
    .input-group-elite input:focus { border-color: var(--red); }

    .ri-center-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .tax-matrix-preview { background: var(--bg-card-2); padding: 20px; border-radius: 16px; border: 1px solid var(--bdr); }
    .tm-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-sec); margin-bottom: 8px; }
    .tm-row.total { border-top: 1px solid var(--bdr); padding-top: 12px; margin-top: 12px; font-weight: 900; color: var(--text-pri); }

    .info-alert-elite { display: flex; gap: 12px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 12px; padding: 16px; font-size: 11px; color: var(--text-sec); line-height: 1.5; }
    .info-alert-elite strong { color: var(--text-pri); }
    .form-actions-elite { display: flex; gap: 16px; }

    /* Buttons */
    .btn-primary-elite { background: var(--red); color: #fff; border: none; padding: 14px 24px; border-radius: 14px; font-size: 11px; font-weight: 900; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 16px var(--red-glow); display: flex; align-items: center; justify-content: center; gap: 10px; }
    .btn-primary-elite:hover:not(:disabled) { background: var(--red-bright); transform: translateY(-2px); }
    .btn-primary-elite:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-ghost-elite { background: var(--bg-card-2); color: var(--text-sec); border: 1px solid var(--bdr); padding: 14px 24px; border-radius: 14px; font-size: 11px; font-weight: 800; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; }
    .btn-ghost-elite:hover { background: var(--bg-card-3); color: var(--text-pri); }

    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
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
