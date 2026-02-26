import { Component, inject, signal, effect, computed, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { ApiService } from '../../../services/api.service';
import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';
import { PaymentFormComponent } from '../../../components/payment-form/payment-form.component';
import { NotificationService } from '../../../services/notification.service';
import { SkeletonLoaderComponent } from '../../../components/skeleton-loader/skeleton-loader.component';
import { ToastContainerComponent } from '../../../components/toast-container/toast-container.component';
import { TooltipComponent } from '../../../components/tooltip/tooltip.component';

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
}


@Component({
  selector: 'app-payments-enhanced',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule, PaymentFormComponent, SkeletonLoaderComponent, ToastContainerComponent],
  template: `
    <div class="payments-container">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb-nav animate-up" style="margin-bottom: 24px;">
        <div class="breadcrumb-item"><span>🏠</span></div>
        <span class="breadcrumb-separator">/</span>
        <div class="breadcrumb-item"><span>Dashboard</span></div>
        <span class="breadcrumb-separator">/</span>
        <div class="breadcrumb-item active"><span>Payments</span></div>
      </nav>

      <!-- Enhanced Header -->
      <header class="page-header-elite animate-up delay-1" style="margin-bottom: 32px;">
        <div class="header-info">
          <h1 class="premium-title">💳 Payments Management</h1>
          <p class="premium-subtitle">Track, manage and download payment receipts with secure processing</p>
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <button class="modern-btn secondary-btn" (click)="refreshPayments()" [disabled]="loading()" title="Refresh payment data">
            <span *ngIf="!loading()">🔄 Refresh</span>
            <span *ngIf="loading()">⏳ Loading...</span>
          </button>
          <button class="modern-btn primary-btn" (click)="togglePaymentForm()" [disabled]="loading()">
            <span *ngIf="!showPaymentForm()">➕ New Payment</span>
            <span *ngIf="showPaymentForm()">✕ Close Form</span>
          </button>
        </div>
      </header>

      <!-- Payment Form (Collapsible) -->
      <div *ngIf="showPaymentForm()" class="animate-up delay-2" style="margin-bottom: 32px;">
        <div class="content-card-premium" style="background: linear-gradient(135deg, rgba(227, 30, 36, 0.05) 0%, rgba(212, 175, 55, 0.05) 100%); border: 2px solid #E31E24;">
          <div style="padding: 24px;">
            <h3 class="premium-subtitle" style="margin: 0 0 16px; color: #1A365D;">New Payment Form</h3>
            <app-payment-form #paymentForm></app-payment-form>
          </div>
        </div>
      </div>

      <!-- Action Bar with Search and Filters -->
      <section class="animate-up delay-2" style="margin-bottom: 32px;">
        <div class="action-bar-glass">
          <div class="search-premium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="search"
                   class="search-input-elite"
                    placeholder="Search by taxpayer, PRN or reference..."
                    (input)="filterPayments($event)"
                   aria-label="Search payments">
          </div>
          <div class="filter-pills-elite">
            <button class="pill-btn" [class.active]="statusFilter() === 'all'"
                    (click)="filterByStatus('all')"
                    title="Show all payments">
              All <span class="badge">{{ payments().length }}</span>
            </button>
            <button class="pill-btn" [class.active]="statusFilter() === 'pending'"
                    (click)="filterByStatus('pending')"
                    title="Show pending payments">
              Pending <span class="badge">{{ pendingCount() }}</span>
            </button>
            <button class="pill-btn" [class.active]="statusFilter() === 'completed'"
                    (click)="filterByStatus('completed')"
                    title="Show completed payments">
              Completed <span class="badge">{{ completedCount() }}</span>
            </button>
            <button class="pill-btn" [class.active]="statusFilter() === 'failed'"
                    (click)="filterByStatus('failed')"
                    title="Show failed payments">
              Failed <span class="badge">{{ failedCount() }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Statistics Cards -->
      <section class="animate-up delay-3" style="margin-bottom: 32px;">
        <div class="stats-grid-premium">
          <!-- Pending Payments -->
          <div class="premium-stat-card animate-scale delay-1" style="cursor: pointer;" (click)="filterByStatus('pending')">
            <div style="display: flex; gap: 20px; width: 100%;">
              <div class="stat-icon-wrapper red" style="font-size: 28px; display: flex; align-items: center; justify-content: center;">💰</div>
              <div class="stat-info" style="flex: 1;">
                <div class="stat-label">Pending Payments</div>
                <div class="stat-value-group">
                  <h3 class="stat-number" style="amount in KES">KES {{ totalPending() | number:'1.2-2' }}</h3>
                  <span class="stat-trend" style="font-size: 12px; color: #F59E0B;">{{ pendingCount() }} payments</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Completed Payments -->
          <div class="premium-stat-card animate-scale delay-2" style="cursor: pointer;" (click)="filterByStatus('completed')">
            <div style="display: flex; gap: 20px; width: 100%;">
              <div class="stat-icon-wrapper green" style="font-size: 28px; display: flex; align-items: center; justify-content: center;">✓</div>
              <div class="stat-info" style="flex: 1;">
                <div class="stat-label">Completed This Month</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">KES {{ totalCompleted() | number:'1.2-2' }}</h3>
                  <span class="stat-trend" style="font-size: 12px; color: #10B981;">{{ completedCount() }} transactions</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Transactions -->
          <div class="premium-stat-card animate-scale delay-3">
            <div style="display: flex; gap: 20px; width: 100%;">
              <div class="stat-icon-wrapper blue" style="font-size: 28px; display: flex; align-items: center; justify-content: center;">📊</div>
              <div class="stat-info" style="flex: 1;">
                <div class="stat-label">Total Transactions</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ payments().length }}</h3>
                  <span class="stat-trend" style="font-size: 12px; color: #3B82F6;">on record</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Failed Payments -->
          <div class="premium-stat-card animate-scale delay-4" style="cursor: pointer;" (click)="filterByStatus('failed')">
            <div style="display: flex; gap: 20px; width: 100%;">
              <div class="stat-icon-wrapper gold" style="font-size: 28px; display: flex; align-items: center; justify-content: center;">⚠️</div>
              <div class="stat-info" style="flex: 1;">
                <div class="stat-label">Failed Payments</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ failedCount() }}</h3>
                  <span class="stat-trend" style="font-size: 12px; color: #EF4444;">need attention</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Payments Data Table -->
      <section class="animate-up delay-4">
        <div class="content-card-premium">
          <!-- Table Header -->
          <div class="table-header-elite"
               style="display: flex; justify-content: space-between; align-items: center;
                      background: linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%);
                      padding: 20px 24px;
                      border-bottom: 2px solid var(--border-color);
                      border-radius: 20px 20px 0 0;">
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 700;">
              Payment Transactions
            </h3>
            <div style="display: flex; gap: 8px;">
              <button class="btn-link" (click)="exportPayments()"
                      title="Export as CSV"
                      style="color: #E31E24; font-weight: 600; cursor: pointer; padding: 8px 12px; border-radius: 8px; border: none; background: rgba(227, 30, 36, 0.1); transition: all 0.3s;">
                📥 Export
              </button>
              <button class="btn-link" (click)="printPayments()"
                      title="Print transactions"
                      style="color: #1A365D; font-weight: 600; cursor: pointer; padding: 8px 12px; border-radius: 8px; border: none; background: rgba(26, 54, 93, 0.1); transition: all 0.3s;">
                🖨️ Print
              </button>
            </div>
          </div>

          <!-- Loading State with Skeleton Loaders -->
          <div *ngIf="loading()" style="padding: 40px 24px;">
            <app-skeleton-loader type="table"></app-skeleton-loader>
            <app-skeleton-loader type="table" style="margin-top: 12px;"></app-skeleton-loader>
            <app-skeleton-loader type="table" style="margin-top: 12px;"></app-skeleton-loader>
          </div>

          <!-- Data Table -->
          <div *ngIf="!loading()" class="table-responsive-elite">
            <table class="modern-table-elite" *ngIf="filteredPayments().length > 0">
              <thead>
                <tr>
                  <th (click)="sortByColumn('id')"
                      [class.sorted]="sortColumn() === 'id'"
                      style="cursor: pointer; user-select: none;">
                    Transaction
                    <span *ngIf="sortColumn() === 'id'" class="sort-indicator">
                      <span class="sort-arrow">{{ sortAsc() ? '↑' : '↓' }}</span>
                    </span>
                  </th>
                  <th (click)="sortByColumn('taxpayerName')"
                      [class.sorted]="sortColumn() === 'taxpayerName'"
                      style="cursor: pointer; user-select: none;">
                    Taxpayer
                    <span *ngIf="sortColumn() === 'taxpayerName'" class="sort-indicator">
                      <span class="sort-arrow">{{ sortAsc() ? '↑' : '↓' }}</span>
                    </span>
                  </th>
                  <th (click)="sortByColumn('amount')"
                      [class.sorted]="sortColumn() === 'amount'"
                      style="cursor: pointer; user-select: none;">
                    Amount
                    <span *ngIf="sortColumn() === 'amount'" class="sort-indicator">
                      <span class="sort-arrow">{{ sortAsc() ? '↑' : '↓' }}</span>
                    </span>
                  </th>
                  <th (click)="sortByColumn('paymentMethod')"
                      [class.sorted]="sortColumn() === 'paymentMethod'"
                      style="cursor: pointer; user-select: none;">
                    Method
                    <span *ngIf="sortColumn() === 'paymentMethod'" class="sort-indicator">
                      <span class="sort-arrow">{{ sortAsc() ? '↑' : '↓' }}</span>
                    </span>
                  </th>
                  <th (click)="sortByColumn('paymentDate')"
                      [class.sorted]="sortColumn() === 'paymentDate'"
                      style="cursor: pointer; user-select: none;">
                    Date
                    <span *ngIf="sortColumn() === 'paymentDate'" class="sort-indicator">
                      <span class="sort-arrow">{{ sortAsc() ? '↑' : '↓' }}</span>
                    </span>
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let payment of filteredPayments(); let i = index"
                    class="table-row-elite"
                    [style.animation]="'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) ' + (i * 50) + 'ms both'">
                  <td><strong>#{{ payment.id }}</strong></td>
                  <td>{{ payment.taxpayerName }}</td>
                  <td class="currency">KES {{ payment.amount | number:'1.2-2' }}</td>
                  <td><span class="method-badge">{{ payment.paymentMethod | titlecase }}</span></td>
                  <td>{{ payment.paymentDate | date:'short' }}</td>
                  <td>
                    <span [ngClass]="'status-pill-elite ' + 'status-' + payment.status">
                      <span class="dot" [style.background]="getStatusColor(payment.status)"></span>
                      {{ payment.status | titlecase }}
                    </span>
                  </td>
                  <td>
                    <div class="action-group-elite">
                      <button class="icon-btn-elite"
                              (click)="viewPayment(payment)"
                              [attr.aria-label]="'View details for payment ' + payment.id"
                              title="View details">👁️</button>
                      <button class="icon-btn-elite"
                              *ngIf="payment.status === 'completed'"
                              (click)="downloadReceipt(payment)"
                              [attr.aria-label]="'Download receipt for payment ' + payment.id"
                              title="Download receipt">📥</button>
                      <button class="icon-btn-elite"
                              *ngIf="payment.status === 'failed'"
                              (click)="retryPayment(payment)"
                              [attr.aria-label]="'Retry payment ' + payment.id"
                              title="Retry payment">🔄</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading() && filteredPayments().length === 0" class="empty-state animate-up">
            <div class="empty-icon">💳</div>
            <h3 class="empty-title">No Payments Found</h3>
            <p class="empty-message">
              <span *ngIf="statusFilter() === 'all'">You haven't made any payments yet. Click "New Payment" to get started.</span>
              <span *ngIf="statusFilter() !== 'all'">No {{ statusFilter() }} payments found. Try a different filter.</span>
            </p>
            <div class="empty-action">
              <button class="modern-btn primary-btn" (click)="togglePaymentForm()">
                ➕ Make Payment
              </button>
              <button class="modern-btn secondary-btn" (click)="filterByStatus('all')" *ngIf="statusFilter() !== 'all'">
                View All Payments
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <div *ngIf="!loading() && filteredPayments().length > 0" class="pagination-elite">
            <button class="pagination-btn"
                    [disabled]="currentPage() === 1"
                    (click)="previousPage()"
                    aria-label="Previous page">
              ← Previous
            </button>
            <span class="pagination-info">Page {{ currentPage() }} of {{ totalPages() }}</span>
            <button class="pagination-btn"
                    [disabled]="currentPage() === totalPages()"
                    (click)="nextPage()"
                    aria-label="Next page">
              Next →
            </button>
            <select class="pagination-select"
                    [(ngModel)]="itemsPerPageValue"
                    (change)="onPageSizeChange()"
                    aria-label="Items per page">
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Payment Details Modal -->
      <div *ngIf="selectedPayment()" class="modal-overlay-elite animate-up" (click)="selectedPayment.set(null)">
        <div class="modal-elite" (click)="$event.stopPropagation()">
          <div class="modal-header-elite">
            <h3 class="premium-title">Payment Details</h3>
            <button class="modal-close-elite"
                    (click)="selectedPayment.set(null)"
                    aria-label="Close modal">✕</button>
          </div>
          <div class="modal-content-elite">
            <div class="detail-group">
              <label>Transaction ID</label>
              <div class="detail-value strong">{{ selectedPayment()?.transaction_id || '#' + selectedPayment()?.id }}</div>
            </div>
            <div class="detail-group">
              <label>Taxpayer Name</label>
              <div class="detail-value">{{ selectedPayment()?.taxpayerName }}</div>
            </div>
            <div class="detail-group">
              <label>Amount Paid</label>
              <div class="detail-value strong currency">KES {{ selectedPayment()?.amount | number:'1.2-2' }}</div>
            </div>
            <div class="detail-group">
              <label>Payment Date</label>
              <div class="detail-value">{{ selectedPayment()?.paymentDate | date:'medium' }}</div>
            </div>
            <div class="detail-group">
              <label>Payment Method</label>
              <div class="detail-value">{{ selectedPayment()?.paymentMethod | titlecase }}</div>
            </div>
            <div class="detail-group">
              <label>Status</label>
              <div class="detail-value">
                <span [ngClass]="'status-pill-elite status-' + selectedPayment()?.status">
                  <span class="dot" [style.background]="getStatusColor(selectedPayment()?.status || '')"></span>
                  {{ selectedPayment()?.status | titlecase }}
                </span>
              </div>
            </div>
          </div>
          <div class="modal-actions-elite">
            <button class="modern-btn secondary-btn" (click)="selectedPayment.set(null)">Close</button>
            <button class="modern-btn primary-btn" (click)="downloadReceipt(selectedPayment()!)">
              📥 Download Receipt
            </button>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <section class="animate-up delay-5"
               style="margin-top: 40px; background: var(--kra-gradient); color: white;
                      border-radius: 20px; padding: 40px; box-shadow: var(--shadow-premium-red);">
        <h2 style="margin: 0 0 24px 0; font-size: 1.5rem; font-weight: 900; letter-spacing: -0.5px;">
          💡 Payment Help &amp; Support
        </h2>
        <div class="stats-grid-premium">
          <div class="help-card">
            <h4 style="margin: 0 0 8px 0; font-weight: 700; color: white;">✓ Payment Methods</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
              We accept M-PESA, bank transfer, cheque, and online card payments.
            </p>
          </div>
          <div class="help-card">
            <h4 style="margin: 0 0 8px 0; font-weight: 700; color: white;">📄 Receipt &amp; Proof</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
              Download payment receipts immediately after successful transaction.
            </p>
          </div>
          <div class="help-card">
            <h4 style="margin: 0 0 8px 0; font-weight: 700; color: white;">📅 Payment Plans</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
              Contact support for assistance with payment plans or arrangements.
            </p>
          </div>
          <div class="help-card">
            <h4 style="margin: 0 0 8px 0; font-weight: 700; color: white;">🔄 Failed Payments</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
              Retry failed payments or contact support for troubleshooting.
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Toast Notifications -->
    <app-toast-container #toastContainer></app-toast-container>
  `,
  styles: [`
    .payments-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .method-badge {
      background: rgba(99, 102, 241, 0.1);
      color: #4F46E5;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .currency {
      color: #10B981;
      font-weight: 700;
    }

    .strong {
      font-weight: 700;
    }

    .btn-link {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      text-decoration: none;
      transition: all 0.3s;
    }

    @media (max-width: 768px) {
      .payments-container {
        padding: 12px;
      }
    }
  `]
})
export class PaymentsEnhancedComponent {
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

    // Status filter
    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }

    // Search filter
    if (query) {
      filtered = filtered.filter(p =>
        p.taxpayerName.toLowerCase().includes(query) ||
        (p.prn && p.prn.toLowerCase().includes(query)) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query)) ||
        p.amount.toString().includes(query)
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const col = this.sortColumn() as keyof Payment;
      const aVal = a[col];
      const bVal = b[col];

      if (!aVal || !bVal) return 0;
      if (aVal === bVal) return 0;
      const cmp = aVal > bVal ? 1 : -1;
      return this.sortAsc() ? cmp : -cmp;
    });

    // Paginate
    const itemsPerPage = parseInt(this.itemsPerPageValue());
    const start = (this.currentPage() - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  });

  totalCount = computed(() => this.payments().length);
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
    const itemsPerPage = parseInt(this.itemsPerPageValue());
    return Math.ceil(
      this.payments().filter(p =>
        (this.statusFilter() === 'all' || p.status === this.statusFilter()) &&
        (this.searchQuery() === '' ||
         p.taxpayerName.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
         (p.prn && p.prn.toLowerCase().includes(this.searchQuery().toLowerCase())) ||
         p.id.toString().includes(this.searchQuery()))
      ).length / itemsPerPage
    );
  });

  // Table Configuration
  paymentColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text', sortable: true, filterable: false, width: '80px', exportable: true },
    { key: 'taxpayerName', label: 'Taxpayer', type: 'text', sortable: true, filterable: false, exportable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true, filterable: false, exportable: true },
    { key: 'paymentDate', label: 'Date', type: 'date', sortable: true, filterable: false, exportable: true },
    { key: 'paymentMethod', label: 'Method', type: 'text', sortable: true, filterable: false, width: '100px', exportable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true, filterable: true, exportable: true }
  ];

  paymentActions: TableAction[] = [
    { label: 'View', icon: '👁️', action: 'view', color: 'info' },
    { label: 'Receipt', icon: '📄', action: 'receipt', color: 'primary' },
    { label: 'Resend Receipt', icon: '📧', action: 'resend', color: 'info' }
  ];

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
    this.showSuccess('Payments refreshed successfully');
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

    this.apiService.get<any>(`payments_enhanced_api.php?action=receipt&id=${currentPayment.id}`).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // In a real app, this would use a PDF generation service
          // For now, we'll simulate the download by creating a JSON file
          const receiptData = JSON.stringify(res.data, null, 2);
          this.downloadFile(receiptData, `receipt_${currentPayment.id}.json`);
          this.showSuccess(`Receipt for payment #${currentPayment.id} downloaded`);
        }
      },
      error: () => this.showError('Failed to download receipt')
    });
  }


  retryPayment(payment: Payment): void {
    this.loading.set(true);
    this.apiService.post<any>(`payments_enhanced_api.php?action=retry&id=${payment.id}`, {}).subscribe({
      next: (res) => {
        if (res.success) {
          this.showSuccess(`Retry initiated for payment #${payment.id}`);
          this.loadPayments();
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.showError('Failed to retry payment');
      }
    });
  }


  exportPayments(): void {
    // TODO: Implement CSV export
    const csv = this.generateCSV();
    this.downloadFile(csv, 'payments.csv');
    this.showSuccess('Payments exported successfully');
  }

  printPayments(): void {
    window.print();
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

  onPageSizeChange(): void {
    this.currentPage.set(1);
  }

  // Utility Methods
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'completed': '#10B981',
      'pending': '#F59E0B',
      'failed': '#EF4444',
      'cancelled': '#6B7280'
    };
    return colors[status] || '#6B7280';
  }

  handlePaymentAction(event: { action: string; data: any }): void {
    switch (event.action) {
      case 'view':
        this.viewPayment(event.data);
        break;
      case 'receipt':
        this.downloadReceipt(event.data);
        break;
      case 'resend':
        this.showSuccess(`Receipt resent to ${event.data.taxpayerName}`);
        break;
    }
  }


  private generateCSV(): string {
    const headers = ['ID', 'Taxpayer', 'Amount', 'Method', 'Date', 'Status'];
    const rows = this.payments().map(p => [
      p.id,
      p.taxpayerName,
      p.amount,
      p.paymentMethod,
      p.paymentDate,
      p.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csvContent;
  }

  private downloadFile(content: string, filename: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  private showSuccess(message: string): void {
    if (this.toastContainer) {
      this.toastContainer.addToast({
        title: 'Success',
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
        title: 'Error',
        message,
        type: 'error',
        duration: 7000,
        dismissible: true,
        icon: '✕'
      });
    }
  }

  private getMockPayments(): Payment[] {
    return [
      {
        id: 1,
        taxpayerId: '1',
        taxpayerName: 'John Doe',
        paymentDate: '2024-01-15',
        amount: 50000,
        status: 'completed',
        paymentMethod: 'mpesa',
        referenceNumber: 'TXN001'
      },
      {
        id: 2,
        taxpayerId: '2',
        taxpayerName: 'Jane Smith',
        paymentDate: '2024-01-20',
        amount: 75000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        referenceNumber: 'TXN002'
      },
      {
        id: 3,
        taxpayerId: '3',
        taxpayerName: 'ABC Corporation',
        paymentDate: '2024-02-01',
        amount: 150000,
        status: 'pending',
        paymentMethod: 'mpesa'
      },
      {
        id: 4,
        taxpayerId: '4',
        taxpayerName: 'XYZ Limited',
        paymentDate: '2024-02-05',
        amount: 85000,
        status: 'failed',
        paymentMethod: 'bank_transfer'
      },
      {
        id: 5,
        taxpayerId: '5',
        taxpayerName: 'Tech Solutions Ltd',
        paymentDate: '2024-02-10',
        amount: 125000,
        status: 'completed',
        paymentMethod: 'mpesa',
        referenceNumber: 'TXN003'
      }
    ];
  }
}

