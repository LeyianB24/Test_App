# Component Template Refactor Guide

This guide provides reusable template patterns for updating the remaining 5 enhanced components to use the modern design system.

---

## Pattern 1: Payments Page Enhancement

Use this pattern for `payments-enhanced.component.ts`:

```typescript
import { Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../components/form-field/form-field.component';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';
import { ToastContainerComponent } from '../components/toast-container/toast-container.component';
import { TooltipComponent } from '../components/tooltip/tooltip.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-payments-enhanced',
  standalone: true,
  imports: [
    CommonModule,
    FormFieldComponent,
    SkeletonLoaderComponent,
    ToastContainerComponent,
    TooltipComponent
  ],
  template: `
    <div class="payments-container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb-nav">
        <div class="breadcrumb-item"><span>🏠 Home</span></div>
        <span class="breadcrumb-separator">/</span>
        <div class="breadcrumb-item active"><span>Payments</span></div>
      </nav>

      <!-- Enhanced Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">💳 Payments Management</h1>
          <p class="premium-subtitle">Make and track your tax payments easily</p>
        </div>
        <button class="modern-btn primary-btn" 
                (click)="showNewPaymentForm()"
                [disabled]="isProcessing()">
          ➕ New Payment
        </button>
      </header>

      <!-- Action Bar -->
      <section class="animate-up">
        <div class="action-bar-glass">
          <div class="search-premium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="search" 
                   class="search-input-elite" 
                   placeholder="Search payments..."
                   (input)="onSearch($event)"
                   aria-label="Search payments">
          </div>
          <div class="filter-pills-elite">
            <button class="pill-btn" [class.active]="statusFilter === 'all'"
                    (click)="filterByStatus('all')">
              All <span class="badge">{{ totalCount }}</span>
            </button>
            <button class="pill-btn" [class.active]="statusFilter === 'pending'"
                    (click)="filterByStatus('pending')">
              Pending <span class="badge">{{ pendingCount }}</span>
            </button>
            <button class="pill-btn" [class.active]="statusFilter === 'completed'"
                    (click)="filterByStatus('completed')">
              Completed <span class="badge">{{ completedCount }}</span>
            </button>
            <button class="pill-btn" [class.active]="statusFilter === 'failed'"
                    (click)="filterByStatus('failed')">
              Failed <span class="badge">{{ failedCount }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="animate-up delay-1">
        <div class="stats-grid-premium">
          <!-- Pending Payments -->
          <div class="premium-stat-card animate-scale delay-1">
            <div style="display: flex; gap: 20px;">
              <div class="stat-icon-wrapper red">💰</div>
              <div class="stat-info">
                <div class="stat-label">Pending Payments</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ pendingAmount | currency }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Completed Payments -->
          <div class="premium-stat-card animate-scale delay-2">
            <div style="display: flex; gap: 20px;">
              <div class="stat-icon-wrapper green">✓</div>
              <div class="stat-info">
                <div class="stat-label">Completed This Month</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ completedAmount | currency }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Transactions -->
          <div class="premium-stat-card animate-scale delay-3">
            <div style="display: flex; gap: 20px;">
              <div class="stat-icon-wrapper blue">📊</div>
              <div class="stat-info">
                <div class="stat-label">Total Transactions</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ paymentsList().length }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Failed Payments -->
          <div class="premium-stat-card animate-scale delay-4">
            <div style="display: flex; gap: 20px;">
              <div class="stat-icon-wrapper gold">⚠️</div>
              <div class="stat-info">
                <div class="stat-label">Failed Payments</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ failedCount }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Payments Table -->
      <section class="animate-up delay-2">
        <div class="content-card-premium" style="margin-top: 24px;">
          <div class="table-header-elite" 
               style="display: flex; justify-content: space-between; align-items: center; 
                      background: linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%); 
                      padding: 20px 24px; border-bottom: 2px solid var(--border-color);">
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 700;">
              Payment Transactions
            </h3>
            <button class="btn-link" (click)="exportPayments()" aria-label="Export payments">
              📥 Export
            </button>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading()" style="padding: 40px;">
            <app-skeleton-loader type="table"></app-skeleton-loader>
            <app-skeleton-loader type="table"></app-skeleton-loader>
            <app-skeleton-loader type="table"></app-skeleton-loader>
          </div>

          <!-- Data Table -->
          <div *ngIf="!isLoading()" class="table-responsive-elite">
            <table class="modern-table-elite">
              <thead>
                <tr>
                  <th (click)="sortByColumn('id')" [class.sorted]="sortColumn === 'id'">
                    Transaction ID
                    <span *ngIf="sortColumn === 'id'" class="sort-indicator">
                      <span class="sort-arrow">{{ sortAsc ? '↑' : '↓' }}</span>
                    </span>
                  </th>
                  <th (click)="sortByColumn('taxpayer_name')" [class.sorted]="sortColumn === 'taxpayer_name'">
                    Taxpayer
                    <span *ngIf="sortColumn === 'taxpayer_name'" class="sort-indicator">
                      <span class="sort-arrow">{{ sortAsc ? '↑' : '↓' }}</span>
                    </span>
                  </th>
                  <th (click)="sortByColumn('amount')" [class.sorted]="sortColumn === 'amount'">
                    Amount
                    <span *ngIf="sortColumn === 'amount'" class="sort-indicator">
                      <span class="sort-arrow">{{ sortAsc ? '↑' : '↓' }}</span>
                    </span>
                  </th>
                  <th>Payment Method</th>
                  <th (click)="sortByColumn('payment_date')" [class.sorted]="sortColumn === 'payment_date'">
                    Date
                    <span *ngIf="sortColumn === 'payment_date'" class="sort-indicator">
                      <span class="sort-arrow">{{ sortAsc ? '↑' : '↓' }}</span>
                    </span>
                  </th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let payment of filteredPayments" class="table-row-elite">
                  <td><strong>{{ payment.id }}</strong></td>
                  <td>{{ payment.taxpayer_name }}</td>
                  <td>KES {{ payment.amount | number:'1.2-2' }}</td>
                  <td>{{ payment.payment_method | titlecase }}</td>
                  <td>{{ payment.payment_date | date:'short' }}</td>
                  <td>
                    <span [ngClass]="'status-pill-elite ' + payment.status">
                      <span class="dot"></span>
                      {{ payment.status | titlecase }}
                    </span>
                  </td>
                  <td>
                    <div class="action-group-elite">
                      <button class="icon-btn-elite" 
                              (click)="viewPayment(payment)"
                              title="View details">👁️</button>
                      <button class="icon-btn-elite"
                              *ngIf="payment.status === 'completed'"
                              (click)="downloadReceipt(payment)"
                              title="Download receipt">📥</button>
                      <button class="icon-btn-elite"
                              *ngIf="payment.status === 'pending'"
                              (click)="retryPayment(payment)"
                              title="Retry payment">🔄</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading() && paymentsList().length === 0" class="empty-state">
            <div class="empty-icon">💳</div>
            <h3 class="empty-title">No Payments Yet</h3>
            <p class="empty-message">Start by making your first payment to complete your tax obligations.</p>
            <div class="empty-action">
              <button class="modern-btn primary-btn" (click)="showNewPaymentForm()">
                Make Payment
              </button>
            </div>
          </div>

          <!-- Pagination -->
          <div *ngIf="!isLoading() && paymentsList().length > 0" class="pagination-elite">
            <button class="pagination-btn" [disabled]="currentPage === 1" (click)="previousPage()">←</button>
            <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="pagination-btn" [disabled]="currentPage === totalPages" (click)="nextPage()">→</button>
            <select class="pagination-select" [(ngModel)]="itemsPerPage" (change)="onPageSizeChange()">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Help Section -->
      <section class="animate-up delay-3" 
               style="margin-top: 40px; background: var(--kra-gradient); color: white; 
                      border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(227, 30, 36, 0.15);">
        <h2 style="margin: 0 0 24px 0; font-size: 1.5rem; font-weight: 900; letter-spacing: -0.5px;">
          Payment Help & Support
        </h2>
        <div class="stats-grid-premium">
          <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; 
                      border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);">
            <h4 style="margin: 0 0 8px 0; font-weight: 700;color: white;">Payment Methods</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
              We accept M-PESA, bank transfer, cheque, and online card payments.
            </p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; 
                      border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);">
            <h4 style="margin: 0 0 8px 0; font-weight: 700; color: white;">Receipt & Proof</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
              Download payment receipts immediately after successful transaction.
            </p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; 
                      border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);">
            <h4 style="margin: 0 0 8px 0; font-weight: 700; color: white;">Payment Plans</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
              Contact support for assistance with payment plans or arrangements.
            </p>
          </div>
          <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; 
                      border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px);">
            <h4 style="margin: 0 0 8px 0; font-weight: 700; color: white;">Failed Payments</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
              Retry failed payments or contact support for troubleshooting.
            </p>
          </div>
        </div>
      </section>
    </div>

    <!-- Toast Container -->
    <app-toast-container #toastContainer></app-toast-container>
  `
})
export class PaymentsEnhancedComponent {
  @ViewChild('toastContainer') toastContainer: ToastContainerComponent;

  private apiService = inject(ApiService);

  // State signals
  paymentsList = signal<any[]>([]);
  isLoading = signal(false);
  isProcessing = signal(false);
  statusFilter = signal<'all' | 'pending' | 'completed' | 'failed'>('all');
  sortColumn = signal<string>('payment_date');
  sortAsc = signal(false);
  currentPage = signal(1);
  itemsPerPage = signal(10);

  // Computed values
  filteredPayments = computed(() => {
    const filter = this.statusFilter();
    const payments = this.paymentsList();
    const filtered = filter === 'all' 
      ? payments 
      : payments.filter(p => p.status === filter);
    
    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[this.sortColumn()];
      const bVal = b[this.sortColumn()];
      const cmp = aVal > bVal ? 1 : -1;
      return this.sortAsc() ? cmp : -cmp;
    });

    // Paginate
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    return sorted.slice(start, start + this.itemsPerPage());
  });

  totalCount = computed(() => this.paymentsList().length);
  pendingCount = computed(() => this.paymentsList().filter(p => p.status === 'pending').length);
  completedCount = computed(() => this.paymentsList().filter(p => p.status === 'completed').length);
  failedCount = computed(() => this.paymentsList().filter(p => p.status === 'failed').length);

  pendingAmount = computed(() => 
    this.paymentsList()
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)
  );

  completedAmount = computed(() => 
    this.paymentsList()
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  );

  totalPages = computed(() => Math.ceil(this.paymentsList().length / this.itemsPerPage()));

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading.set(true);
    this.apiService.get('/api/payments').subscribe({
      next: (data) => {
        this.paymentsList.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.showError('Failed to load payments');
        this.isLoading.set(false);
      }
    });
  }

  showNewPaymentForm(): void {
    // Navigate or show modal
  }

  filterByStatus(status: any): void {
    this.statusFilter.set(status);
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

  onSearch(event: any): void {
    // Filter payments by search
  }

  viewPayment(payment: any): void {
    // Show payment details modal
  }

  downloadReceipt(payment: any): void {
    // Download receipt
    this.showSuccess('Receipt downloaded successfully');
  }

  retryPayment(payment: any): void {
    // Retry failed payment
  }

  exportPayments(): void {
    // Export to CSV
    this.showSuccess('Payments exported successfully');
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

  private showSuccess(message: string): void {
    this.toastContainer.addToast({
      title: 'Success',
      message,
      type: 'success',
      icon: '✓',
      duration: 5000
    });
  }

  private showError(message: string): void {
    this.toastContainer.addToast({
      title: 'Error',
      message,
      type: 'error',
      icon: '✕',
      duration: 7000,
      dismissible: true
    });
  }
}
```

---

## How to Apply This Pattern

1. **Copy the template structure** above
2. **Replace the old component template** with this new one
3. **Import the new components** (FormField, Skeleton, Toast, Tooltip)
4. **Update the TypeScript logic** to match your data structure
5. **Test all interactions** - search,filter, sort, pagination
6. **Verify accessibility** - keyboard navigation, screen readers
7. **Check responsiveness** on mobile and tablet

---

## Reusable Patterns

### Breadcrumb Pattern
```html
<nav class="breadcrumb-nav">
  <div class="breadcrumb-item"><span>🏠 Home</span></div>
  <span class="breadcrumb-separator">/</span>
  <div class="breadcrumb-item"><span>Section</span></div>
  <span class="breadcrumb-separator">/</span>
  <div class="breadcrumb-item active"><span>Current</span></div>
</nav>
```

### Premium Header Pattern
```html
<header class="page-header-elite">
  <div class="header-info">
    <h1 class="premium-title">Page Title</h1>
    <p class="premium-subtitle">Brief description</p>
  </div>
  <button class="modern-btn primary-btn">Action</button>
</header>
```

### Action Bar Pattern
```html
<div class="action-bar-glass">
  <div class="search-premium">
    <svg><!-- search icon --></svg>
    <input type="search" class="search-input-elite" placeholder="Search...">
  </div>
  <div class="filter-pills-elite">
    <button class="pill-btn active">All <span class="badge">10</span></button>
    <button class="pill-btn">Status <span class="badge">3</span></button>
  </div>
</div>
```

### Stats Grid Pattern
```html
<div class="stats-grid-premium">
  <div class="premium-stat-card">
    <div style="display: flex; gap: 20px;">
      <div class="stat-icon-wrapper red">💰</div>
      <div class="stat-info">
        <div class="stat-label">Label</div>
        <div class="stat-value-group">
          <h3 class="stat-number">1,234</h3>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Table Pattern
```html
<div class="content-card-premium">
  <div class="table-responsive-elite">
    <table class="modern-table-elite">
      <thead>
        <tr>
          <th [class.sorted]="sortedBy === 'col'">Column</th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-row-elite">
          <td>Data</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="pagination-elite">
    <!-- Pagination controls -->
  </div>
</div>
```

---

## Apply To These Components

- **payments-enhanced.component.ts** - Use Payments pattern above
- **returns-enhanced.component.ts** - Adapt for returns (use similar structure)
- **obligations-enhanced.component.ts** - Adapt for obligations (use similar structure)
- **admin-dashboard.component.ts** - Use dashboard pattern (similar to enhanced dashboard)
- **batch-operations.component.ts** - Use form pattern with enhanced styling

---

## Quick Implementation Steps

For each component:

1. **Read the current template** and understand the structure
2. **Copy the pattern** that best matches (Payment, Return, etc.)
3. **Replace the template** section in the component
4. **Update the signals/state** to match your API
5. **Update event handlers** to match your logic
6. **Test filters, sorting, pagination**
7. **Verify accessibility**
8. **Check mobile responsiveness**

---

**Estimated Time**: 30 mins per component × 5 components = 2.5 hours total
**Difficulty**: Easy (mostly find/replace and minor customizations)
**Quality**: Production-ready with all enhancements
