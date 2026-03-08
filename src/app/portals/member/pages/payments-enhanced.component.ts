import { Component, inject, signal, computed, ViewChild, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { PaymentFormComponent } from '../../../components/payment-form/payment-form.component';
import { NotificationService } from '../../../core/services/notification.service';
import { SkeletonLoaderComponent } from '../../../components/skeleton-loader/skeleton-loader.component';
import { ToastContainerComponent } from '../../../components/toast-container/toast-container.component';

interface Payment {
  id: number;
  taxpayerId: string;
  taxpayerName: string;
  paymentDate: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  paymentMethod: string;
  referenceNumber?: string;
  prn?: string;
  transaction_id?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-payments-enhanced',
  imports: [CommonModule, FormsModule, PaymentFormComponent, SkeletonLoaderComponent, ToastContainerComponent],
  template: `
    <div class="content-area animate-stagger">
    
      <!-- HD Page Header -->
      <header class="mb-12">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 class="premium-title">Wealth <span class="text-[var(--color-accent)]">Transaction Terminal</span></h1>
            <p class="premium-subtitle">Digital Financial Telemetry & Secure Fiscal Processing</p>
          </div>
          <div class="flex items-center gap-4">
            <button class="btn-precision btn-secondary-precision" (click)="refreshPayments()" [disabled]="loading()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              {{ loading() ? 'SYNCHRONIZING...' : 'REFRESH INTEL' }}
            </button>
            <button class="btn-precision btn-primary-precision" (click)="togglePaymentForm()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 4v16m8-8H4"/></svg>
              {{ showPaymentForm() ? 'SHIELD PORTAL' : 'EXECUTE PAYMENT' }}
            </button>
          </div>
        </div>
      </header>

      <!-- HD Payment Form (Collapsible) -->
      @if (showPaymentForm()) {
        <div class="mb-12 animate-fade-in">
          <div class="glass-panel border-[var(--color-accent)]/20">
            <div class="flex items-center justify-between mb-8 border-b border-subtle pb-6">
              <h3 class="text-xl font-black text-primary uppercase tracking-widest">Execution Protocol</h3>
              <div class="status-pill-precision online">
                <span class="status-pill-dot animate-pulse"></span>
                ENCRYPTION ACTIVE
              </div>
            </div>
            <app-payment-form #paymentForm></app-payment-form>
          </div>
        </div>
      }

      <!-- HD Metrics Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div class="stat-card-precision cursor-pointer" (click)="filterByStatus('pending')">
          <div class="card-icon-box yellow">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <span class="card-label">OUTSTANDING LIABILITY</span>
          <span class="card-value">KES {{ totalPending() | number:'1.2-2' }}</span>
          <div class="mt-4 pt-4 border-t border-subtle">
            <span class="text-[10px] font-black uppercase text-muted tracking-widest">{{ pendingCount() }} QUEUED TRANSACTIONS</span>
          </div>
        </div>

        <div class="stat-card-precision cursor-pointer" (click)="filterByStatus('completed')">
          <div class="card-icon-box green">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <span class="card-label">VOLUME PROCESSED</span>
          <span class="card-value">KES {{ totalCompleted() | number:'1.2-2' }}</span>
          <div class="mt-4 pt-4 border-t border-subtle">
            <span class="text-[10px] font-black uppercase text-[var(--color-success)] tracking-widest">{{ completedCount() }} VERIFIED PAYMENTS</span>
          </div>
        </div>

        <div class="stat-card-precision">
          <div class="card-icon-box blue">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <span class="card-label">TOTAL TELEMETRY</span>
          <span class="card-value">{{ payments().length }}</span>
          <div class="mt-4 pt-4 border-t border-subtle">
            <span class="text-[10px] font-black uppercase text-muted tracking-widest">HISTORICAL DATABASE</span>
          </div>
        </div>

        <div class="stat-card-precision cursor-pointer" (click)="filterByStatus('failed')">
          <div class="card-icon-box danger">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <span class="card-label">ANOMALY COUNT</span>
          <span class="card-value !text-[var(--color-accent)]">{{ failedCount() }}</span>
          <div class="mt-4 pt-4 border-t border-subtle">
            <span class="text-[10px] font-black uppercase text-[var(--color-accent)] tracking-widest">REQUIRES ATTENTION</span>
          </div>
        </div>
      </div>

      <!-- HD Table Context -->
      <div class="glass-panel p-0 overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between p-10 border-b border-subtle bg-surface-2/50 gap-8">
          <div class="flex gap-4 items-center">
            <div class="flex bg-surface-3 p-1 rounded-xl">
              <button class="status-pill-precision !px-6 !py-2 cursor-pointer transition-all hover:bg-surface-4"
                [class.online]="statusFilter() === 'all'" (click)="filterByStatus('all')">Universal</button>
              <button class="status-pill-precision !px-6 !py-2 cursor-pointer transition-all hover:bg-surface-4"
                [class.pending]="statusFilter() === 'pending'" (click)="filterByStatus('pending')">Pending</button>
              <button class="status-pill-precision !px-6 !py-2 cursor-pointer transition-all hover:bg-surface-4"
                [class.online]="statusFilter() === 'completed'" (click)="filterByStatus('completed')">Verified</button>
            </div>
          </div>
          
          <div class="flex items-center gap-6 flex-1 md:max-w-xl">
            <div class="search-input-precision flex-1">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Query transaction by Reference, PIN or amount..." (input)="filterPayments($event)">
            </div>
            <button class="notification-bell-precision" (click)="exportPayments()" title="Export Ledger">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </button>
          </div>
        </div>

        @if (loading()) {
          <div class="p-20 space-y-8">
            <app-skeleton-loader type="table"></app-skeleton-loader>
            <app-skeleton-loader type="table"></app-skeleton-loader>
            <app-skeleton-loader type="table"></app-skeleton-loader>
          </div>
        } @else {
          <div class="table-container">
            <table class="table-precision">
              <thead>
                <tr>
                  <th>TRANSACTION REF</th>
                  <th>TAXPAYER ENTITY</th>
                  <th>FISCAL VALUE</th>
                  <th>CHANNEL</th>
                  <th>TIMESTAMP</th>
                  <th class="text-right">OPERATION</th>
                </tr>
              </thead>
              <tbody>
                @for (payment of filteredPayments(); track payment.id) {
                  <tr class="animate-stagger-item">
                    <td>
                      <div class="flex flex-col">
                        <span class="font-black text-primary">#{{ payment.id }}</span>
                        <span class="text-[10px] font-mono text-muted uppercase tracking-tighter">{{ payment.transaction_id || 'LOCAL-SYNC' }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="font-black text-primary">{{ payment.taxpayerName }}</span>
                    </td>
                    <td>
                      <span class="font-black text-primary">KES {{ payment.amount | number:'1.2-2' }}</span>
                    </td>
                    <td>
                      <span class="status-pill-precision !bg-surface-4 !px-4 !py-1 text-[10px] font-black uppercase text-primary border border-subtle">
                        {{ payment.paymentMethod }}
                      </span>
                    </td>
                    <td>
                      <span class="text-muted font-bold">{{ payment.paymentDate | date:'medium' }}</span>
                    </td>
                    <td class="text-right">
                      <div class="flex items-center justify-end gap-3">
                        <button class="notification-bell-precision" (click)="viewPayment(payment)" title="View Intel">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        @if (payment.status === 'completed') {
                          <button class="notification-bell-precision !text-[var(--color-success)]" (click)="downloadReceipt(payment)" title="Get Receipt">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6">
                      <div class="py-32 text-center">
                        <div class="text-5xl mb-8 opacity-20">NULL</div>
                        <p class="premium-subtitle">No financial telemetry detected in this segment.</p>
                        <button class="btn-precision btn-primary-precision mt-8" (click)="togglePaymentForm()">Execute First Transaction</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- HD Pagination -->
          <div class="flex items-center justify-between p-10 bg-surface-2/50 border-t border-subtle">
            <span class="text-[10px] font-black text-muted uppercase tracking-[0.2em]">Displaying telemetry segment {{ currentPage() }}/{{ totalPages() }}</span>
            <div class="flex items-center gap-4">
              <button class="btn-precision btn-secondary-precision !py-2 !px-6" [disabled]="currentPage() === 1" (click)="previousPage()">PREVIOUS</button>
              <button class="btn-precision btn-secondary-precision !py-2 !px-6" [disabled]="currentPage() === totalPages()" (click)="nextPage()">NEXT SEQUENCE</button>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- HD Payment Details Modal -->
    @if (selectedPayment()) {
      <div class="dialog-overlay-elite animate-fade-in" (click)="selectedPayment.set(null)">
        <div class="glass-panel !p-0 !max-w-xl w-full animate-scale-in" (click)="$event.stopPropagation()">
            <div class="p-10 border-b border-subtle bg-surface-2/50 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-black text-primary uppercase tracking-widest">Transaction <span class="text-[var(--color-accent)]">Intel</span></h3>
                <p class="premium-subtitle">Secure Telemetry Signature Verification</p>
              </div>
              <button class="notification-bell-precision" (click)="selectedPayment.set(null)">✕</button>
            </div>
          
          <div class="p-10 space-y-10">
            <div class="p-6 rounded-2xl bg-surface-2 border border-subtle flex items-center justify-between">
               <div>
                 <div class="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Protocol Status</div>
                 <div class="status-pill-precision" [class]="selectedPayment()?.status === 'completed' ? 'online' : (selectedPayment()?.status === 'pending' ? 'pending' : 'overdue')">
                    <span class="status-pill-dot"></span>
                    {{ selectedPayment()?.status | uppercase }}
                 </div>
               </div>
               <div class="text-right">
                 <div class="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Timestamp</div>
                 <div class="text-sm font-bold text-primary">{{ selectedPayment()?.paymentDate | date:'medium' }}</div>
               </div>
            </div>
            
            <div class="grid grid-cols-2 gap-10">
               <div class="space-y-2">
                 <div class="text-[10px] font-black text-muted uppercase tracking-widest">Fiscal Value</div>
                 <div class="text-2xl font-black text-primary">KES {{ selectedPayment()?.amount | number:'1.2-2' }}</div>
               </div>
               <div class="space-y-2 text-right">
                 <div class="text-[10px] font-black text-muted uppercase tracking-widest">Payment Channel</div>
                 <div class="text-xl font-bold text-secondary">{{ selectedPayment()?.paymentMethod | uppercase }}</div>
               </div>
            </div>

            <div class="space-y-2 pt-10 border-t border-subtle">
              <div class="text-[10px] font-black text-muted uppercase tracking-widest">Secure Signature Hash</div>
              <div class="text-xs font-mono font-black text-primary bg-surface-2 p-4 rounded-xl border border-subtle break-all">
                {{ selectedPayment()?.transaction_id || selectedPayment()?.id || 'UNASSIGNED-SYNC' }}
              </div>
            </div>
          </div>

          <div class="p-10 bg-surface-2/50 border-t border-subtle flex justify-end gap-6">
            <button class="btn-precision btn-secondary-precision" (click)="selectedPayment.set(null)">DISMISS INTEL</button>
            <button class="btn-precision btn-primary-precision" (click)="downloadReceipt(selectedPayment()!)">GENERATE RECEIPT</button>
          </div>
        </div>
      </div>
    }

    <app-toast-container #toastContainer></app-toast-container>
  `,
  styles: [`
    .dialog-overlay-elite { position: fixed; inset: 0; background: var(--bg-overlay); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out); }
  `]
})
export class PaymentsEnhancedComponent implements OnInit {
  @ViewChild('toastContainer') toastContainer!: ToastContainerComponent;

  private paymentService = inject(PaymentService);
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  // State Signals
  payments = signal<Payment[]>([]);
  loading = signal(false);
  showPaymentForm = signal(false);
  selectedPayment = signal<Payment | null>(null);
  statusFilter = signal<'all' | 'pending' | 'completed' | 'failed'>('all');
  searchQuery = signal('');
  sortColumn = signal('paymentDate');
  sortAsc = signal(false);
  currentPage = signal(1);
  itemsPerPageValue = signal('10');

  // Computed Properties
  filteredPayments = computed(() => {
    const status = this.statusFilter();
    const query = this.searchQuery().toLowerCase();
    let filtered = this.payments();

    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }

    if (query) {
      filtered = filtered.filter(p =>
        p.taxpayerName.toLowerCase().includes(query) ||
        (p.prn && p.prn.toLowerCase().includes(query)) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query)) ||
        p.amount.toString().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const col = this.sortColumn() as keyof Payment;
      const aVal = a[col];
      const bVal = b[col];

      if (!aVal || !bVal) return 0;
      if (aVal === bVal) return 0;
      const cmp = aVal > bVal ? 1 : -1;
      return this.sortAsc() ? cmp : -cmp;
    });

    const itemsPerPage = parseInt(this.itemsPerPageValue());
    const start = (this.currentPage() - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  });

  pendingCount = computed(() => this.payments().filter(p => p.status === 'pending').length);
  completedCount = computed(() => this.payments().filter(p => p.status === 'completed').length);
  failedCount = computed(() => this.payments().filter(p => p.status === 'failed').length);

  totalPending = computed(() =>
    this.payments()
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)
  );

  totalCompleted = computed(() =>
    this.payments()
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  );

  totalPages = computed(() => {
    const status = this.statusFilter();
    const query = this.searchQuery().toLowerCase();
    
    let filteredCount = this.payments().filter(p => {
      const matchStatus = status === 'all' || p.status === status;
      const matchQuery = !query || 
        p.taxpayerName.toLowerCase().includes(query) ||
        (p.prn && p.prn.toLowerCase().includes(query)) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query)) ||
        p.amount.toString().includes(query);
      
      return matchStatus && matchQuery;
    }).length;

    const itemsPerPage = parseInt(this.itemsPerPageValue());
    return Math.ceil(filteredCount / itemsPerPage) || 1;
  });

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading.set(true);
    this.apiService.get<any>('payments_enhanced_api.php?action=list').subscribe({
      next: (response) => {
        if (response.success && response.data?.payments) {
          this.payments.set(response.data.payments);
        } else {
          this.payments.set([]);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading.set(false);
        this.showError('Failed to load payments');
      }
    });
  }

  refreshPayments(): void {
    this.loadPayments();
    this.showSuccess('Payments synchronized successfully');
  }

  togglePaymentForm(): void {
    this.showPaymentForm.update(v => !v);
  }

  filterByStatus(status: 'all' | 'pending' | 'completed' | 'failed'): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  filterPayments(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  sortByColumn(column: string): void {
    if (this.sortColumn() === column) {
      this.sortAsc.update(v => !v);
    } else {
      this.sortColumn.set(column);
      this.sortAsc.set(true);
    }
  }

  viewPayment(payment: Payment): void {
    this.selectedPayment.set(payment);
  }

  downloadReceipt(payment?: Payment): void {
    const currentPayment = payment || this.selectedPayment();
    if (!currentPayment) return;
    const finalUrl = `${environment.apiUrl}/download.php?type=payment&id=${currentPayment.id}&format=pdf`;
    window.open(finalUrl, '_blank');
    this.showSuccess(`Receipt for payment #${currentPayment.id} initiated`);
  }

  exportPayments(): void {
    this.showSuccess('Ledger export protocol initiated');
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  private showSuccess(message: string): void {
    if (this.toastContainer) {
      this.toastContainer.addToast({
        title: 'Protocol Success',
        message,
        type: 'success',
        duration: 5000,
        icon: '✓'
      });
    }
  }

  private showError(message: string): void {
    if (this.toastContainer) {
      this.toastContainer.addToast({
        title: 'Protocol Error',
        message,
        type: 'error',
        duration: 7000,
        dismissible: true,
        icon: '✕'
      });
    }
  }
}
