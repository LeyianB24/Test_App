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
    <div class="content-area animate-fade-in">
      <!-- Enhanced Header -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight">
              Wealth <span class="text-accent">Transaction Terminal</span>
            </h1>
            <p class="text-[var(--text-secondary)] mt-2 font-semibold tracking-wide uppercase text-[10px]">Synchronized financial telemetry and secure processing</p>
          </div>
          <div class="flex items-center gap-4">
            <button class="btn-precision btn-secondary-precision btn-sm" (click)="refreshPayments()" [disabled]="loading()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2"/></svg>
              {{ loading() ? 'Synchronizing...' : 'Refresh Intel' }}
            </button>
            <button class="btn-precision btn-primary-precision btn-sm" (click)="togglePaymentForm()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" stroke-width="2.5"/></svg>
              {{ showPaymentForm() ? 'Secure Terminal' : 'Execute Payment' }}
            </button>
          </div>
        </div>
      </header>

      <!-- Payment Form (Collapsible) -->
      @if (showPaymentForm()) {
        <div class="mb-10 animate-fade-in">
          <div class="stat-card-precision border-accent/20">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-lg font-black text-primary uppercase tracking-widest">Execution Protocol</h3>
              <span class="status-pill-precision online">ENCRYPTION ACTIVE</span>
            </div>
            <app-payment-form #paymentForm></app-payment-form>
          </div>
        </div>
      }

      <!-- Statistics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="stat-card-precision group cursor-pointer" (click)="filterByStatus('pending')">
          <div class="flex items-start justify-between">
            <div class="card-icon-box yellow">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
            </div>
            <div class="delta-badge" [class.negative]="pendingCount() > 0">
              {{ pendingCount() }} PENDING
            </div>
          </div>
          <div class="mt-4">
            <span class="card-label">Outstanding Liability</span>
            <span class="card-value">KES {{ totalPending() | number:'1.2-2' }}</span>
          </div>
        </div>

        <div class="stat-card-precision group cursor-pointer" (click)="filterByStatus('completed')">
          <div class="flex items-start justify-between">
            <div class="card-icon-box green">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
            </div>
            <div class="delta-badge positive">
              {{ completedCount() }} SUCCESS
            </div>
          </div>
          <div class="mt-4">
            <span class="card-label">Volume Processed (M)</span>
            <span class="card-value">KES {{ totalCompleted() | number:'1.2-2' }}</span>
          </div>
        </div>

        <div class="stat-card-precision">
          <div class="flex items-start justify-between">
            <div class="card-icon-box primary">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-width="2"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="card-label">Total Telemetry</span>
            <span class="card-value">{{ payments().length }}</span>
          </div>
        </div>

        <div class="stat-card-precision group cursor-pointer" (click)="filterByStatus('failed')">
          <div class="flex items-start justify-between">
            <div class="card-icon-box accent">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="card-label">Anomaly Count</span>
            <span class="card-value text-accent">{{ failedCount() }}</span>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="stat-card-precision mb-10 overflow-visible">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex-1 max-w-lg relative group">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary transition-colors group-focus-within:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input type="text"
              class="w-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl py-3 pl-12 pr-4 text-sm font-semibold transition-all focus:border-accent outline-none"
              placeholder="Query transaction database..."
              (input)="filterPayments($event)">
          </div>
          
          <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <button class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
              [class]="statusFilter() === 'all' ? 'bg-accent text-white shadow-lg' : 'text-tertiary hover:bg-[var(--bg-surface-2)]'"
              (click)="filterByStatus('all')">ALL</button>
            <button class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
              [class]="statusFilter() === 'pending' ? 'bg-accent text-white shadow-lg' : 'text-tertiary hover:bg-[var(--bg-surface-2)]'"
              (click)="filterByStatus('pending')">PENDING</button>
            <button class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
              [class]="statusFilter() === 'completed' ? 'bg-accent text-white shadow-lg' : 'text-tertiary hover:bg-[var(--bg-surface-2)]'"
              (click)="filterByStatus('completed')">SUCCESS</button>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="stat-card-precision overflow-hidden p-0">
        <div class="flex items-center justify-between p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <h3 class="text-xs font-black text-primary uppercase tracking-[0.2em]">Transaction Ledger</h3>
          <div class="flex items-center gap-3">
            <button class="p-2 hover:bg-[var(--bg-surface-2)] rounded-lg text-accent transition-colors" (click)="exportPayments()" title="Export Ledger">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2"/></svg>
            </button>
          </div>
        </div>

        @if (loading()) {
          <div class="p-12 space-y-4">
            <app-skeleton-loader type="table"></app-skeleton-loader>
            <app-skeleton-loader type="table"></app-skeleton-loader>
            <app-skeleton-loader type="table"></app-skeleton-loader>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-[var(--bg-surface-2)]/50">
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Transaction</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Taxpayer</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Value</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Method</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Timestamp</th>
                  <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--border-subtle)]">
                @for (payment of filteredPayments(); track payment.id; let i = $index) {
                  <tr class="hover:bg-[var(--bg-surface-1)] transition-colors group">
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="text-sm font-black text-primary">#{{ payment.id }}</span>
                        <span class="text-[9px] font-mono text-tertiary">{{ payment.transaction_id || 'LOCAL-SYNC' }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm font-bold text-secondary">{{ payment.taxpayerName }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm font-black text-primary">KES {{ payment.amount | number:'1.2-2' }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 rounded bg-[var(--bg-surface-2)] text-[10px] font-black uppercase tracking-tighter text-secondary border border-[var(--border-subtle)]">
                        {{ payment.paymentMethod }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-xs font-semibold text-tertiary">{{ payment.paymentDate | date:'medium' }}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="p-2 hover:text-accent transition-colors" (click)="viewPayment(payment)">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                        </button>
                        @if (payment.status === 'completed') {
                          <button class="p-2 hover:text-accent transition-colors" (click)="downloadReceipt(payment)">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2"/></svg>
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-6">
        <span class="text-[10px] font-black text-tertiary uppercase tracking-widest">Displaying telemetry segment {{ currentPage() }}/{{ totalPages() }}</span>
        <div class="flex items-center gap-2">
          <button class="btn-precision btn-secondary-precision btn-sm px-4" [disabled]="currentPage() === 1" (click)="previousPage()">PREV</button>
          <button class="btn-precision btn-secondary-precision btn-sm px-4" [disabled]="currentPage() === totalPages()" (click)="nextPage()">NEXT</button>
        </div>
      </div>
    </div>

    <!-- Payment Details Modal -->
    @if (selectedPayment()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in" (click)="selectedPayment.set(null)">
        <div class="stat-card-precision max-w-lg w-full shadow-2xl overflow-hidden" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-xl font-black text-primary tracking-tight">TRANSACTION <span class="text-accent">INTEL</span></h3>
            <button class="p-2 hover:bg-[var(--bg-surface-2)] rounded-lg transition-colors" (click)="selectedPayment.set(null)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5"/></svg>
            </button>
          </div>
          
          <div class="space-y-6">
            <div class="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
               <div class="text-[10px] font-black text-tertiary uppercase tracking-widest mb-1">Status Protocol</div>
               <span class="status-pill-precision online">{{ selectedPayment()?.status | uppercase }}</span>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
               <div>
                 <div class="text-[10px] font-black text-tertiary uppercase tracking-widest">Value</div>
                 <div class="text-lg font-black text-primary">KES {{ selectedPayment()?.amount | number:'1.2-2' }}</div>
               </div>
               <div>
                 <div class="text-[10px] font-black text-tertiary uppercase tracking-widest">Channel</div>
                 <div class="text-lg font-bold text-secondary">{{ selectedPayment()?.paymentMethod | titlecase }}</div>
               </div>
            </div>

            <div>
              <div class="text-[10px] font-black text-tertiary uppercase tracking-widest">Transaction Signature</div>
              <div class="text-xs font-mono font-black text-primary mt-1">{{ selectedPayment()?.transaction_id || selectedPayment()?.id }}</div>
            </div>
          </div>

          <div class="flex items-center gap-3 mt-10">
            <button class="btn-precision btn-secondary-precision flex-1 py-3" (click)="selectedPayment.set(null)">DISMISS</button>
            <button class="btn-precision btn-primary-precision flex-1 py-3" (click)="downloadReceipt(selectedPayment()!)">GET RECEIPT</button>
          </div>
        </div>
      </div>
    }

    <app-toast-container #toastContainer></app-toast-container>
  `,
  styles: [``]
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
