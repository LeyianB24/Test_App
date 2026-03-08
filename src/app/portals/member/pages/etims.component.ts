import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtimsService } from '../../../services/etims.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-etims',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="content-area animate-stagger">
    
      <!-- HD Page Header -->
      <header class="mb-12">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 class="premium-title">e-TIMS <span class="text-[var(--color-accent)]">Invoicing</span></h1>
            <p class="premium-subtitle">Digital Sales Registry & Tax Compliance Terminal</p>
          </div>
          <div class="flex items-center gap-4">
            <button class="btn-precision btn-primary-precision" (click)="showInvoiceDialog.set(true)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              Generate Invoice
            </button>
          </div>
        </div>
      </header>
    
      <!-- HD Metrics Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div class="stat-card-precision">
          <div class="card-icon-box blue">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <span class="card-label">TOTAL INVOICES</span>
          <span class="card-value">{{ allInvoices().length }}</span>
        </div>
    
        <div class="stat-card-precision">
          <div class="card-icon-box green">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <span class="card-label">TOTAL REVENUE (NET)</span>
          <span class="card-value">KES {{ totalRevenue() | number:'1.0-0' }}</span>
        </div>
    
        <div class="stat-card-precision">
          <div class="card-icon-box danger">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <span class="card-label">VAT OBLIGATION</span>
          <span class="card-value">KES {{ totalTax() | number:'1.0-0' }}</span>
        </div>
    
        <div class="stat-card-precision">
          <div class="card-icon-box compliant">
            <div class="status-pill-dot animate-pulse"></div>
          </div>
          <span class="card-label">GATEWAY STATUS</span>
          <span class="card-value !text-[var(--color-success)]">ONLINE</span>
        </div>
      </div>
    
      <!-- HD Registry Surface -->
      <div class="glass-panel p-0 overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between p-10 border-b border-subtle bg-surface-2/50 gap-6">
          <div class="flex gap-4">
            <button class="status-pill-precision !px-6 !py-2 cursor-pointer transition-all hover:bg-surface-3" [class.online]="activeFilter === 'all'" (click)="activeFilter = 'all'">
              Universal Log
            </button>
            <button class="status-pill-precision !px-6 !py-2 cursor-pointer transition-all hover:bg-surface-3" [class.online]="activeFilter === 'synced'" (click)="activeFilter = 'synced'">
              Synchronized
            </button>
            <button class="status-pill-precision !px-6 !py-2 cursor-pointer transition-all hover:bg-surface-3" [class.pending]="activeFilter === 'pending'" (click)="activeFilter = 'pending'">
              Pending Sync
            </button>
          </div>
          <div class="search-input-precision w-full md:w-96">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Search by Invoice ID or Customer..." [(ngModel)]="searchQuery" (input)="onSearch()">
          </div>
        </div>
    
        <div class="table-container">
          <table class="table-precision">
            <thead>
              <tr>
                <th>INVOICE NUMBER</th>
                <th>TIMESTAMP</th>
                <th>CUSTOMER ENTITY</th>
                <th>NET AMOUNT</th>
                <th>TAX APPLIED</th>
                <th>PROTOCO STATUS</th>
                <th class="text-right">OPERATION</th>
              </tr>
            </thead>
            <tbody>
              @for (invoice of filteredInvoices(); track invoice.id) {
                <tr class="animate-stagger-item">
                  <td class="font-mono font-black text-[var(--color-accent)]">{{ invoice.invoiceNumber }}</td>
                  <td class="text-muted font-bold">{{ invoice.date }}</td>
                  <td>
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center font-black text-xs text-primary shadow-sm">
                        {{ invoice.customerName.charAt(0) }}
                      </div>
                      <span class="font-black text-primary">{{ invoice.customerName }}</span>
                    </div>
                  </td>
                  <td class="font-black">KES {{ invoice.amount | number:'1.0-0' }}</td>
                  <td class="text-muted font-bold">KES {{ invoice.taxAmount | number:'1.0-0' }}</td>
                  <td>
                    <div class="status-pill-precision" [class]="invoice.status === 'synced' ? 'online' : (invoice.status === 'pending' ? 'pending' : 'overdue')">
                      <span class="status-pill-dot"></span>
                      {{ invoice.status | uppercase }}
                    </div>
                  </td>
                  <td class="text-right">
                    @if (invoice.status === 'pending') {
                      <button class="btn-precision btn-primary-precision !py-2" (click)="syncInvoice(invoice.id)" [disabled]="syncing() === invoice.id">
                        {{ syncing() === invoice.id ? 'SYNCING...' : 'SYNC TERMINAL' }}
                      </button>
                    } @else if (invoice.status === 'error') {
                      <button class="btn-precision btn-secondary-precision !py-2 !text-[var(--color-accent)]" (click)="retrySync(invoice.id)">
                        RETRY LINK
                      </button>
                    } @else {
                      <button class="notification-bell-precision" title="Download Official Invoice">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      </button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7">
                    <div class="py-24 text-center">
                      <div class="text-4xl mb-6 opacity-20">NULL</div>
                      <p class="premium-subtitle">No fiscal transactions detected in this sector.</p>
                      <button class="btn-precision btn-primary-precision mt-8" (click)="showInvoiceDialog.set(true)">Initialize First Invoice</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    
      <!-- HD Dialog: Invoice Generation -->
      @if (showInvoiceDialog()) {
        <div class="dialog-overlay-elite animate-fade-in" (click)="cancelInvoiceDialog()">
          <div class="glass-panel !p-0 !max-w-xl w-full animate-scale-in" (click)="$event.stopPropagation()">
            <div class="p-10 border-b border-subtle bg-surface-2/50 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-black text-primary uppercase tracking-widest">Generate Invoice</h3>
                <p class="premium-subtitle">Initialize eTIMS Synchronized Transaction</p>
              </div>
              <button class="notification-bell-precision" (click)="cancelInvoiceDialog()">✕</button>
            </div>
            
            <div class="p-10 space-y-10">
              <div class="space-y-4">
                <label class="premium-subtitle !mt-0">Customer / Entity Name</label>
                <div class="search-input-precision !w-full !px-6">
                  <input type="text" [(ngModel)]="newInvoice.customerName" placeholder="Legal Name or PIN" class="!bg-transparent">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-8">
                <div class="space-y-4">
                  <label class="premium-subtitle !mt-0">Transaction Amount</label>
                  <div class="search-input-precision !w-full !px-6">
                    <span class="text-[10px] font-black opacity-40 mr-2">KES</span>
                    <input type="number" [(ngModel)]="newInvoice.amount" placeholder="0.00" class="!bg-transparent font-mono">
                  </div>
                </div>
                <div class="space-y-4">
                  <label class="premium-subtitle !mt-0">Tax Protocol (VAT)</label>
                  <div class="search-input-precision !w-full !px-6">
                    <select class="w-full bg-transparent border-none appearance-none font-black text-xs text-primary focus:outline-none" [(ngModel)]="newInvoice.taxRate">
                      <option [ngValue]="0.16">16% STANDARD</option>
                      <option [ngValue]="0">0% ZERO RATED</option>
                      <option [ngValue]="0.08">8% REDUCED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="p-6 rounded-2xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 flex gap-4 text-[var(--color-accent)]">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span class="text-xs font-bold leading-tight">Proceeding will immediately synchronize this record with the KRA National Ledger.</span>
              </div>
            </div>

            <div class="p-10 bg-surface-2/50 border-t border-subtle flex justify-end gap-6">
              <button class="btn-precision btn-secondary-precision" (click)="cancelInvoiceDialog()">Protocol Abort</button>
              <button class="btn-precision btn-primary-precision" (click)="createInvoice()" [disabled]="!newInvoice.customerName || !newInvoice.amount">
                Commit & Sync Device
              </button>
            </div>
          </div>
        </div>
      }
    
    </div>
    `,
  styles: [`
    .dialog-overlay-elite { position: fixed; inset: 0; background: var(--bg-overlay); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out); }
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
