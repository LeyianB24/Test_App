import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtimsService } from '../../../services/etims.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-etims',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-up">
    
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">e-TIMS <span class="gradient-text">Invoicing</span></h1>
          <p class="premium-subtitle">Create and manage your electronic tax invoices</p>
        </div>
        <div class="header-actions">
          <button class="modern-btn primary-btn" (click)="showInvoiceDialog.set(true)">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="3"/></svg>
            Create Invoice
          </button>
        </div>
      </header>
    
      <!-- Elite Metrics Grid -->
      <div class="stats-grid-premium">
        <div class="premium-stat-card animate-up delay-1">
          <div class="stat-icon-wrapper blue">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Invoices</span>
            <div class="stat-value-group">
              <h3 class="stat-number">{{ allInvoices().length }}</h3>
            </div>
          </div>
        </div>
    
        <div class="premium-stat-card animate-up delay-2">
          <div class="stat-icon-wrapper green">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Revenue</span>
            <div class="stat-value-group">
              <h3 class="stat-number">KES {{ totalRevenue() | number:'1.0-0' }}</h3>
            </div>
          </div>
        </div>
    
        <div class="premium-stat-card animate-up delay-3">
          <div class="stat-icon-wrapper red">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total VAT</span>
            <div class="stat-value-group">
              <h3 class="stat-number">KES {{ totalTax() | number:'1.0-0' }}</h3>
            </div>
          </div>
        </div>
    
        <div class="premium-stat-card animate-up delay-3">
          <div class="stat-icon-wrapper grey">
            <div class="pulse-ring"></div>
            <div class="pulse-dot"></div>
          </div>
          <div class="stat-info">
            <span class="stat-label">System Status</span>
            <div class="stat-value-group">
              <h3 class="stat-number status-online" style="font-size: 0.95rem;">ONLINE</h3>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Action & Filter Surface -->
      <div class="action-bar-glass mt-32 animate-up delay-2">
        <div class="filter-pills-elite">
          <button class="pill-btn" [class.active]="activeFilter === 'all'" (click)="activeFilter = 'all'">
            All Invoices <span class="badge">{{ allInvoices().length }}</span>
          </button>
          <button class="pill-btn" [class.active]="activeFilter === 'synced'" (click)="activeFilter = 'synced'">
            Synced
          </button>
          <button class="pill-btn" [class.active]="activeFilter === 'pending'" (click)="activeFilter = 'pending'">
            Pending
          </button>
        </div>
        <div class="search-premium">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5"/></svg>
          <input type="text" placeholder="Search invoice number or customer..." class="search-input-elite" [(ngModel)]="searchQuery" (input)="onSearch()">
        </div>
      </div>
    
      <!-- Main Registry Table -->
      <div class="content-card-premium animate-up delay-3">
        <div class="table-responsive-elite">
          <table class="modern-table-elite">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Tax Amount</th>
                <th>Status</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              @for (invoice of filteredInvoices(); track invoice.id) {
                <tr class="table-row-hover">
                  <td><span class="invoice-id-elite">{{ invoice.invoiceNumber }}</span></td>
                  <td><span class="date-label-elite">{{ invoice.date }}</span></td>
                  <td>
                    <div class="customer-block">
                      <div class="avatar-ref">{{ invoice.customerName.charAt(0) }}</div>
                      <span class="customer-title">{{ invoice.customerName }}</span>
                    </div>
                  </td>
                  <td><span class="amount-val-elite">KES {{ invoice.amount | number:'1.0-0' }}</span></td>
                  <td><span class="tax-amt-elite">KES {{ invoice.taxAmount | number:'1.0-0' }}</span></td>
                  <td>
                    <div class="status-pill-elite" [ngClass]="invoice.status">
                      <span class="dot"></span>
                      {{ invoice.status }}
                    </div>
                  </td>
                  <td>
                    <div class="action-center">
                      @if (invoice.status === 'pending') {
                        <button class="modern-btn primary-btn sm" (click)="syncInvoice(invoice.id)" [disabled]="syncing() === invoice.id">
                          {{ syncing() === invoice.id ? 'SYNCING' : 'SYNC NOW' }}
                        </button>
                      } @else if (invoice.status === 'error') {
                        <button class="modern-btn outline-btn sm danger" (click)="retrySync(invoice.id)">
                          RETRY SYNC
                        </button>
                      } @else {
                        <button class="icon-btn-elite" title="Download Invoice">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2.2"/></svg>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
                } @empty {
                <tr>
                  <td colspan="7" class="empty-placeholder">
                    <div class="empty-state-luxury">
                      <div class="e-icon">∅</div>
                      <p>No invoices found. Create a new one below.</p>
                      <button class="modern-btn outline-btn sm mt-16" (click)="showInvoiceDialog.set(true)">Create First Invoice</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    
      <!-- Elite Dialog: Smart Generation -->
      @if (showInvoiceDialog()) {
        <div class="dialog-overlay-elite animate-fade" (click)="cancelInvoiceDialog()">
          <div class="elite-dialog-card animate-scale" (click)="$event.stopPropagation()">
            <div class="dialog-header-luxury">
              <div class="header-icon-ring">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="3"/></svg>
              </div>
              <div class="header-text-v">
                <h3>Create New Invoice</h3>
                <p>Fill out the details to generate an eTIMS invoice</p>
              </div>
              <button class="close-luxury-circular" (click)="cancelInvoiceDialog()">✕</button>
            </div>
            <div class="dialog-content-luxury">
              <div class="luxury-form-stack">
                <div class="form-item-elite">
                  <label>Customer Name</label>
                  <input type="text" [(ngModel)]="newInvoice.customerName" placeholder="Customer Name" class="luxury-input-elite">
                </div>
                <div class="form-row-elite">
                  <div class="form-item-elite">
                    <label>Amount (KES)</label>
                    <div class="luxury-input-wrapper">
                      <span class="currency-tag">KES</span>
                      <input type="number" [(ngModel)]="newInvoice.amount" placeholder="0.00" class="luxury-input-elite with-tag">
                    </div>
                  </div>
                  <div class="form-item-elite">
                    <label>VAT Rate</label>
                    <select class="luxury-select-elite" [(ngModel)]="newInvoice.taxRate">
                      <option [ngValue]="0.16">16% Standard Rate</option>
                      <option [ngValue]="0">0% Zero Rated</option>
                      <option [ngValue]="0.08">8% Reduced Rate</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="policy-notice-luxury">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2.5"/></svg>
                <span>The invoice will be synced with KRA immediately.</span>
              </div>
            </div>
            <div class="dialog-footer-luxury">
              <button class="modern-btn outline-btn sm" (click)="cancelInvoiceDialog()">Cancel</button>
              <button class="modern-btn primary-btn" (click)="createInvoice()" [disabled]="!newInvoice.customerName || !newInvoice.amount">
                Create & Sync
              </button>
            </div>
          </div>
        </div>
      }
    
    </div>
    `,
  styles: [`
    .invoice-id-elite { font-weight: 900; color: var(--color-accent); font-family: 'Courier New', monospace; font-size: 0.95rem; background: var(--bg-accent-subtle); padding: 4px 10px; border-radius: 8px; border: 1px solid var(--border-accent-subtle); }
    .customer-block { display: flex; align-items: center; gap: 14px; }
    .avatar-ref { width: 34px; height: 34px; background: var(--gradient-accent); color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.85rem; }
    .customer-title { font-weight: 800; color: var(--text-primary); font-size: 0.95rem; }
    .amount-val-elite { font-weight: 900; color: var(--text-primary); letter-spacing: -0.5px; }
    .tax-amt-elite { color: var(--text-tertiary); font-weight: 700; font-size: 0.9rem; }

    .status-online { color: var(--success-base); font-weight: 900; letter-spacing: 1px; }
    .pulse-dot { width: 12px; height: 12px; background: var(--success-base); border-radius: 50%; z-index: 2; }
    .pulse-ring { position: absolute; width: 32px; height: 32px; border: 2.5px solid var(--success-base); border-radius: 50%; animation: pulse-ring 2s infinite; }
    @keyframes pulse-ring { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }

    /* Luxury Dialog Systems */
    .dialog-overlay-elite { position: fixed; inset: 0; background: var(--bg-overlay); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .elite-dialog-card { background: var(--bg-surface-1); width: 100%; max-width: 650px; border-radius: 40px; overflow: hidden; box-shadow: var(--shadow-xl); border-top: 6px solid var(--color-accent); }
    .dialog-header-luxury { padding: 40px; background: var(--bg-surface-2); border-bottom: 1px solid var(--border-default); display: flex; align-items: center; gap: 24px; position: relative; }
    .header-icon-ring { width: 56px; height: 56px; background: var(--color-accent); border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-focus); }
    .header-text-v h3 { font-size: 1.4rem; font-weight: 900; color: var(--text-primary); margin: 0; letter-spacing: -0.5px; }
    .header-text-v p { font-size: 0.9rem; color: var(--text-tertiary); font-weight: 600; margin-top: 4px; }
    .close-luxury-circular { position: absolute; top: 30px; right: 30px; width: 44px; height: 44px; border-radius: 50%; border: none; background: var(--bg-app); color: var(--text-tertiary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
    .close-luxury-circular:hover { background: var(--status-danger-bg); color: var(--danger-base); }

    .dialog-content-luxury { padding: 40px; }
    .luxury-form-stack { display: flex; flex-direction: column; gap: 32px; }
    .form-item-elite { display: flex; flex-direction: column; gap: 12px; }
    .form-item-elite label { font-size: 0.75rem; font-weight: 900; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1.5px; }
    .form-row-elite { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    
    .luxury-input-elite, .luxury-select-elite { width: 100%; padding: 18px 24px; background: var(--bg-surface-2); border: 2.5px solid var(--border-default); border-radius: 20px; font-weight: 800; color: var(--text-primary); font-size: 1.05rem; transition: 0.3s; font-family: inherit; }
    .luxury-input-elite:focus, .luxury-select-elite:focus { border-color: var(--color-accent); outline: none; background: var(--bg-app); box-shadow: var(--shadow-focus); }
    
    .luxury-input-wrapper { position: relative; }
    .currency-tag { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); font-weight: 900; font-size: 0.8rem; }
    .luxury-input-elite.with-tag { padding-left: 65px; }

    .policy-notice-luxury { margin-top: 40px; padding: 20px; background: var(--bg-status-info); border-radius: 18px; border: 1.5px solid var(--info-border); display: flex; align-items: center; gap: 16px; color: var(--info-base); font-weight: 700; font-size: 0.9rem; }
    .dialog-footer-luxury { padding: 32px 40px; background: var(--bg-surface-2); border-top: 1px solid var(--border-default); display: flex; justify-content: flex-end; gap: 20px; }

    .mt-16 { margin-top: 16px; }
    .action-center { display: flex; justify-content: center; }

    @media (max-width: 900px) {
       .form-row-elite { grid-template-columns: 1fr; }
       .dialog-header-luxury, .dialog-content-luxury, .dialog-footer-luxury { padding: 24px; }
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
      invoices = invoices.filter(inv => inv.customerName.toLowerCase().includes(q) || inv.invoiceNumber.toLowerCase().includes(q));
    }
    return invoices;
  });

  createInvoice() {
    if (!this.newInvoice.customerName || !this.newInvoice.amount) return;
    this.etimsService.createInvoice(this.newInvoice.customerName, this.newInvoice.amount, this.newInvoice.taxRate).subscribe({
      next: () => {
        alert('Invoice created and synced successfully.');
        this.cancelInvoiceDialog();
      },
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
