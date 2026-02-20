import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { DashboardDataService } from '../services/dashboard-data.service';
import { NotificationService } from '../services/notification.service';
import { DataTableComponent, TableColumn, TableAction } from '../components/data-table/data-table.component';

interface DashboardStats {
  totalTaxPaid: number;
  totalOutstanding: number;
  totalInvoiced: number;
  completedReturns: number;
  pendingReturns: number;
  failedPayments: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentPayments: any[];
  recentReturns: any[];
  taxObligations: any[];
}

@Component({
  selector: 'app-dashboard-enhanced',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="dashboard-container">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb-nav" aria-label="Breadcrumb">
        <div class="breadcrumb-item active">
          <span>🏠 Dashboard</span>
        </div>
      </nav>

      <!-- Main Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Dashboard</h1>
          <p class="premium-subtitle">Welcome back! Here's your tax compliance overview</p>
        </div>
        <div class="header-actions">
          <button class="modern-btn primary-btn" (click)="refreshDashboard()" [disabled]="isRefreshing()" title="Refresh dashboard data" aria-label="Refresh dashboard">
            <span *ngIf="!isRefreshing()">🔄 Refresh</span>
            <span *ngIf="isRefreshing()"><span class="loader-pulse"></span> Refreshing...</span>
          </button>
        </div>
      </header>

      <!-- Key Metrics Section -->
      <section aria-labelledby="metrics-heading" class="animate-up">
        <h2 id="metrics-heading" class="sr-only">Key Metrics</h2>
        <div class="stats-grid-premium">
          <!-- Total Tax Paid Card -->
          <div class="premium-stat-card animate-scale delay-1">
            <div class="d-flex gap-3">
              <div class="stat-icon-wrapper blue">💰</div>
              <div class="stat-info">
                <div class="stat-label">Total Tax Paid</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ stats().totalTaxPaid | number:'1.0-0' }}</h3>
                  <span class="stat-trend up">↑ 12% YoY</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Outstanding Obligations Card -->
          <div class="premium-stat-card animate-scale delay-2">
            <div class="d-flex gap-3">
              <div class="stat-icon-wrapper red">⚠️</div>
              <div class="stat-info">
                <div class="stat-label">Outstanding</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ stats().totalOutstanding | number:'1.0-0' }}</h3>
                  <span class="stat-trend down">Action Required</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Invoiced Card -->
          <div class="premium-stat-card animate-scale delay-3">
            <div class="d-flex gap-3">
              <div class="stat-icon-wrapper gold">📋</div>
              <div class="stat-info">
                <div class="stat-label">Total Invoiced</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ stats().totalInvoiced | number:'1.0-0' }}</h3>
                  <span class="stat-trend down" [style.background]="'#fef3c7'" [style.color]="'#92400e'">{{ invoicesCount }} items</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Returns Status Card -->
          <div class="premium-stat-card animate-scale delay-3">
            <div class="d-flex gap-3">
              <div class="stat-icon-wrapper green">📊</div>
              <div class="stat-info">
                <div class="stat-label">Returns Status</div>
                <div class="stat-value-group">
                  <h3 class="stat-number">{{ stats().completedReturns }}</h3>
                  <span class="stat-trend up">{{ stats().pendingReturns }} pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions Section -->
      <section aria-labelledby="actions-heading" class="animate-up delay-1">
        <h2 id="actions-heading" class="sr-only">Quick Actions</h2>
        <div class="action-bar-glass">
          <div class="search-premium">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="search" class="search-input-elite" placeholder="Search payments, returns, obligations..." aria-label="Search dashboard">
          </div>
          <div class="filter-pills-elite">
            <button class="pill-btn active">All <span class="badge">4</span></button>
            <button class="pill-btn">Paid <span class="badge">2</span></button>
            <button class="pill-btn">Pending <span class="badge">2</span></button>
          </div>
        </div>
      </section>

      <!-- Action Cards Grid -->
      <section aria-labelledby="quick-actions-heading" class="animate-up delay-2">
        <h2 id="quick-actions-heading" class="sr-only">Popular Actions</h2>
        <div class="stats-grid-premium">
          <div class="premium-stat-card card-interactive" (click)="navigateTo('payments')" role="button" tabindex="0" (keydown.enter)="navigateTo('payments')" (keydown.space)="navigateTo('payments')">
            <div class="d-flex gap-3 flex-column">
              <div style="font-size: 2.5rem; line-height: 1;">💳</div>
              <div>
                <h3 class="premium-title" style="font-size: 1.2rem; margin: 0;">Make Payment</h3>
                <p style="margin: 6px 0 0 0; color: var(--text-secondary); font-size: 0.85rem;">Pay outstanding obligations</p>
              </div>
              <button class="modern-btn primary-btn sm" (click)="navigateTo('payments'); $event.stopPropagation();">Pay Now →</button>
            </div>
          </div>

          <div class="premium-stat-card card-interactive" (click)="navigateTo('returns')" role="button" tabindex="0" (keydown.enter)="navigateTo('returns')" (keydown.space)="navigateTo('returns')">
            <div class="d-flex gap-3 flex-column">
              <div style="font-size: 2.5rem; line-height: 1;">📝</div>
              <div>
                <h3 class="premium-title" style="font-size: 1.2rem; margin: 0;">Submit Return</h3>
                <p style="margin: 6px 0 0 0; color: var(--text-secondary); font-size: 0.85rem;">File your tax return</p>
              </div>
              <button class="modern-btn primary-btn sm" (click)="navigateTo('returns'); $event.stopPropagation();">File Return →</button>
            </div>
          </div>

          <div class="premium-stat-card card-interactive" (click)="navigateTo('profile')" role="button" tabindex="0" (keydown.enter)="navigateTo('profile')" (keydown.space)="navigateTo('profile')">
            <div class="d-flex gap-3 flex-column">
              <div style="font-size: 2.5rem; line-height: 1;">👤</div>
              <div>
                <h3 class="premium-title" style="font-size: 1.2rem; margin: 0;">Update Profile</h3>
                <p style="margin: 6px 0 0 0; color: var(--text-secondary); font-size: 0.85rem;">Update your information</p>
              </div>
              <button class="modern-btn primary-btn sm" (click)="navigateTo('profile'); $event.stopPropagation();">Update →</button>
            </div>
          </div>

          <div class="premium-stat-card card-interactive" (click)="showSupport()" role="button" tabindex="0" (keydown.enter)="showSupport()" (keydown.space)="showSupport()">
            <div class="d-flex gap-3 flex-column">
              <div style="font-size: 2.5rem; line-height: 1;">📞</div>
              <div>
                <h3 class="premium-title" style="font-size: 1.2rem; margin: 0;">Get Support</h3>
                <p style="margin: 6px 0 0 0; color: var(--text-secondary); font-size: 0.85rem;">Contact support team</p>
              </div>
              <button class="modern-btn outline-btn sm" (click)="showSupport(); $event.stopPropagation();">Contact →</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Activity Tables -->
      <section aria-labelledby="activity-heading" class="animate-up delay-3">
        <h2 id="activity-heading" class="sr-only">Recent Activity</h2>

        <!-- Recent Payments Table -->
        <div class="content-card-premium" *ngIf="true">
          <div class="table-header-elite" style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%); padding: 20px 24px; border-bottom: 2px solid var(--border-color);">
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 700;">Recent Payments</h3>
            <button class="btn-link" (click)="navigateTo('payments')" aria-label="View all payments">View All →</button>
          </div>
          <div class="table-responsive-elite" *ngIf="!paymentLoading()">
            <app-data-table
              [data]="recentPayments() | slice:0:5"
              [columns]="paymentColumns"
              [actions]="paymentActions"
              role="table"
              aria-label="Recent payments">
            </app-data-table>
          </div>
          <div *ngIf="paymentLoading()" class="loading-skeleton" style="padding: 20px 24px;">
            <div class="skeleton-text"></div>
            <div class="skeleton-text" style="width: 80%; margin-bottom: 12px;"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text" style="width: 70%;"></div>
          </div>
          <div *ngIf="!paymentLoading() && recentPayments().length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h3 class="empty-title">No Payments Yet</h3>
            <p class="empty-message">You haven't made any payments. Click below to make your first payment.</p>
            <div class="empty-action">
              <button class="modern-btn primary-btn" (click)="navigateTo('payments')">Make Payment</button>
            </div>
          </div>
        </div>

        <!-- Recent Returns Table -->
        <div class="content-card-premium" *ngIf="true" style="margin-top: 24px;">
          <div class="table-header-elite" style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%); padding: 20px 24px; border-bottom: 2px solid var(--border-color);">
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 700;">Recent Tax Returns</h3>
            <button class="btn-link" (click)="navigateTo('returns')" aria-label="View all returns">View All →</button>
          </div>
          <div class="table-responsive-elite" *ngIf="!returnLoading()">
            <app-data-table
              [data]="recentReturns() | slice:0:5"
              [columns]="returnColumns"
              [actions]="returnActions"
              role="table"
              aria-label="Recent tax returns">
            </app-data-table>
          </div>
          <div *ngIf="returnLoading()" class="loading-skeleton" style="padding: 20px 24px;">
            <div class="skeleton-text"></div>
            <div class="skeleton-text" style="width: 80%; margin-bottom: 12px;"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text" style="width: 70%;"></div>
          </div>
          <div *ngIf="!returnLoading() && recentReturns().length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <h3 class="empty-title">No Returns Filed</h3>
            <p class="empty-message">You haven't filed any tax returns yet. Click below to file your first return.</p>
            <div class="empty-action">
              <button class="modern-btn primary-btn" (click)="navigateTo('returns')">File Return</button>
            </div>
          </div>
        </div>

        <!-- Outstanding Obligations Table -->
        <div class="content-card-premium" *ngIf="true" style="margin-top: 24px;">
          <div class="table-header-elite" style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #f8fafc 0%, #f3f4f6 100%); padding: 20px 24px; border-bottom: 2px solid var(--border-color);">
            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main); font-weight: 700;">Outstanding Obligations</h3>
            <button class="btn-link" (click)="navigateTo('obligations')" aria-label="View all obligations">View All →</button>
          </div>
          <div class="table-responsive-elite" *ngIf="!obligationLoading()">
            <app-data-table
              [data]="obligations() | slice:0:5"
              [columns]="obligationColumns"
              [actions]="obligationActions"
              role="table"
              aria-label="Outstanding obligations">
            </app-data-table>
          </div>
          <div *ngIf="obligationLoading()" class="loading-skeleton" style="padding: 20px 24px;">
            <div class="skeleton-text"></div>
            <div class="skeleton-text" style="width: 80%; margin-bottom: 12px;"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text" style="width: 70%;"></div>
          </div>
          <div *ngIf="!obligationLoading() && obligations().length === 0" class="empty-state">
            <div class="empty-icon">✓</div>
            <h3 class="empty-title">All Clear!</h3>
            <p class="empty-message">You have no outstanding obligations. Great job staying compliant!</p>
          </div>
        </div>
      </section>

      <!-- Help Section -->
      <section aria-labelledby="help-heading" class="help-section animate-up delay-4" style="margin-top: 40px; background: var(--kra-gradient); color: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(227, 30, 36, 0.15);">
        <h2 id="help-heading" style="margin: 0 0 24px 0; font-size: 1.5rem; font-weight: 900; letter-spacing: -0.5px;">Quick Help & Support</h2>
        <div class="stats-grid-premium" style="gap: 20px;">
          <div class="help-item" style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);">
            <h4 style="margin: 0 0 8px 0; font-size: 0.95rem; font-weight: 700; color: white;">How to pay your taxes?</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">You can pay via M-PESA, bank transfer, or cheque. Click on "Make Payment" and choose your preferred method.</p>
          </div>
          <div class="help-item" style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);">
            <h4 style="margin: 0 0 8px 0; font-size: 0.95rem; font-weight: 700; color: white;">Return Filing Deadlines</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">Individual returns are due by June 30th, companies by June 30th. File early to avoid penalties.</p>
          </div>
          <div class="help-item" style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);">
            <h4 style="margin: 0 0 8px 0; font-size: 0.95rem; font-weight: 700; color: white;">Track Payments</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">Visit the Payments section to view payment status, receipts, and transaction history.</p>
          </div>
          <div class="help-item" style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);">
            <h4 style="margin: 0 0 8px 0; font-size: 0.95rem; font-weight: 700; color: white;">Late Filing Penalties</h4>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">If you missed the deadline, contact our support team immediately for guidance and possible penalty relief.</p>
          </div>
        </div>
      </section>
    </div>

    <style>
      .d-flex { display: flex; }
      .gap-3 { gap: 20px; }
      .flex-column { flex-direction: column; }
      .btn-link {
        background: none;
        border: none;
        color: var(--kra-red);
        cursor: pointer;
        font-weight: 700;
        font-size: 0.85rem;
        padding: 0;
        transition: color 0.3s;
        text-decoration: none;
      }
      .btn-link:hover {
        color: var(--kra-red-hover);
        text-decoration: underline;
      }
      .help-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .help-item:hover {
        transform: translateY(-4px);
        background: rgba(255, 255, 255, 0.15) !important;
      }
    </style>
  `
})
export class DashboardEnhancedComponent {
  private apiService = inject(ApiService);
  private dashboardService = inject(DashboardDataService);
  private notificationService = inject(NotificationService);

  // State
  stats = signal<DashboardStats>({
    totalTaxPaid: 2450000,
    totalOutstanding: 375000,
    totalInvoiced: 850000,
    completedReturns: 3,
    pendingReturns: 1,
    failedPayments: 0
  });

  recentPayments = signal<any[]>([]);
  recentReturns = signal<any[]>([]);
  obligations = signal<any[]>([]);

  paymentLoading = signal(false);
  returnLoading = signal(false);
  obligationLoading = signal(false);
  isRefreshing = signal(false);

  invoicesCount = 12;

  // Table Columns
  paymentColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text', sortable: true },
    { key: 'taxpayer_name', label: 'Taxpayer', type: 'text', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'payment_date', label: 'Date', type: 'date', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true }
  ];

  returnColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text', sortable: true },
    { key: 'period', label: 'Period', type: 'text', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'submission_date', label: 'Submitted', type: 'date', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true }
  ];

  obligationColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text', sortable: true },
    { key: 'type', label: 'Type', type: 'text', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'due_date', label: 'Due Date', type: 'date', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true }
  ];

  paymentActions = [
    { label: 'View', action: 'view', icon: '👁️' }
  ];

  returnActions = [
    { label: 'View', action: 'view', icon: '👁️' }
  ];

  obligationActions = [
    { label: 'Pay', action: 'pay', icon: '💳' },
    { label: 'View', action: 'view', icon: '👁️' }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getCurrentDate(): Date {
    return new Date();
  }

  loadDashboardData(): void {
    this.paymentLoading.set(true);
    this.returnLoading.set(true);
    this.obligationLoading.set(true);

    // Load recent payments
    this.apiService.get<any[]>('/api/payments?limit=5').subscribe({
      next: (data) => {
        this.recentPayments.set(data?.length ? data : this.getMockPayments());
        this.paymentLoading.set(false);
      },
      error: () => {
        this.recentPayments.set(this.getMockPayments());
        this.paymentLoading.set(false);
      }
    });

    // Load recent returns
    this.apiService.get<any[]>('/api/returns?limit=5').subscribe({
      next: (data) => {
        this.recentReturns.set(data?.length ? data : this.getMockReturns());
        this.returnLoading.set(false);
      },
      error: () => {
        this.recentReturns.set(this.getMockReturns());
        this.returnLoading.set(false);
      }
    });

    // Load obligations
    this.apiService.get<any[]>('/api/obligations').subscribe({
      next: (data) => {
        this.obligations.set(data?.length ? data : this.getMockObligations());
        this.obligationLoading.set(false);
      },
      error: () => {
        this.obligations.set(this.getMockObligations());
        this.obligationLoading.set(false);
      }
    });
  }

  refreshDashboard(): void {
    this.isRefreshing.set(true);
    setTimeout(() => {
      this.loadDashboardData();
      this.isRefreshing.set(false);
      this.notificationService.showSuccess('Dashboard refreshed successfully');
    }, 1500);
  }

  navigateTo(page: string): void {
    // TODO: Implement navigation using router
    this.notificationService.showInfo(`Navigating to ${page}...`);
  }

  showSupport(): void {
    this.notificationService.showInfo('Support contact information will be displayed here');
  }

  private getMockPayments(): any[] {
    return [
      { id: 'PAY-001', taxpayer_name: 'John Doe', amount: 50000, payment_date: '2024-01-15', status: 'completed' },
      { id: 'PAY-002', taxpayer_name: 'Jane Smith', amount: 75000, payment_date: '2024-01-20', status: 'completed' },
      { id: 'PAY-003', taxpayer_name: 'ABC Corp', amount: 125000, payment_date: '2024-01-22', status: 'pending' }
    ];
  }

  private getMockReturns(): any[] {
    return [
      { id: 'RET-001', period: '2024 Q1', amount: 50000, submission_date: '2024-01-10', status: 'completed' },
      { id: 'RET-002', period: '2023 Annual', amount: 450000, submission_date: '2024-01-05', status: 'completed' }
    ];
  }

  private getMockObligations(): any[] {
    return [
      { id: 'OBL-001', type: 'Quarterly Tax', amount: 25000, due_date: '2024-03-31', status: 'pending' },
      { id: 'OBL-002', type: 'Annual Return', amount: 0, due_date: '2024-06-30', status: 'pending' }
    ];
  }
}

        <div class="action-card">
          <div class="action-icon">👤</div>
          <h3>Update Profile</h3>
          <p>Update your personal or business information</p>
          <button class="btn btn-primary" (click)="navigateTo('profile')">Update Now</button>
        </div>

        <div class="action-card">
          <div class="action-icon">📞</div>
          <h3>Get Support</h3>
          <p>Contact our support team for assistance</p>
          <button class="btn btn-secondary">Contact Support</button>
        </div>
      </div>

      <!-- Data Tables Section -->
      <div class="tables-section">
        <!-- Recent Payments -->
        <div class="table-container">
          <div class="table-header">
            <h2>Recent Payments</h2>
            <button class="btn-link" (click)="navigateTo('payments')">View All →</button>
          </div>
          <div *ngIf="!paymentLoading()" class="table-wrapper">
            <app-data-table
              [data]="recentPayments() | slice:0:5"
              [columns]="paymentColumns"
              [actions]="paymentActions">
            </app-data-table>
          </div>
          <div *ngIf="paymentLoading()" class="loading-skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
          </div>
          <div *ngIf="!paymentLoading() && recentPayments().length === 0" class="empty-state">
            <p>No recent payments. <button class="link-btn" (click)="navigateTo('payments')">Make a payment</button></p>
          </div>
        </div>

        <!-- Recent Returns -->
        <div class="table-container">
          <div class="table-header">
            <h2>Recent Tax Returns</h2>
            <button class="btn-link" (click)="navigateTo('returns')">View All →</button>
          </div>
          <div *ngIf="!returnLoading()" class="table-wrapper">
            <app-data-table
              [data]="recentReturns() | slice:0:5"
              [columns]="returnColumns"
              [actions]="returnActions">
            </app-data-table>
          </div>
          <div *ngIf="returnLoading()" class="loading-skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
          </div>
          <div *ngIf="!returnLoading() && recentReturns().length === 0" class="empty-state">
            <p>No recent returns. <button class="link-btn" (click)="navigateTo('returns')">Submit a return</button></p>
          </div>
        </div>

        <!-- Outstanding Obligations -->
        <div class="table-container">
          <div class="table-header">
            <h2>Outstanding Obligations</h2>
            <button class="btn-link" (click)="navigateTo('obligations')">View All →</button>
          </div>
          <div *ngIf="!obligationLoading()" class="table-wrapper">
            <app-data-table
              [data]="obligations() | slice:0:5"
              [columns]="obligationColumns"
              [actions]="obligationActions">
            </app-data-table>
          </div>
          <div *ngIf="obligationLoading()" class="loading-skeleton">
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
            <div class="skeleton-row"></div>
          </div>
          <div *ngIf="!obligationLoading() && obligations().length === 0" class="empty-state">
            <p>✓ No outstanding obligations!</p>
          </div>
        </div>
      </div>

      <!-- Help Section -->
      <div class="help-section">
        <h2>Quick Help</h2>
        <div class="help-grid">
          <div class="help-item">
            <h4>How to pay your taxes?</h4>
            <p>You can pay via M-PESA, bank transfer, or cheque. Click on "Make Payment" and choose your preferred method.</p>
          </div>
          <div class="help-item">
            <h4>When do returns need to be filed?</h4>
            <p>Tax returns should be filed by June 30th for individual income earners and by June 30th for companies.</p>
          </div>
          <div class="help-item">
            <h4>How can I track my payment?</h4>
            <p>Go to the Payments section to view the status of all your payments and transaction details.</p>
          </div>
          <div class="help-item">
            <h4>What if I missed the deadline?</h4>
            <p>Late filing may attract penalties. Contact our support team for assistance.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-header h1 {
      margin: 0 0 8px;
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
    }

    .page-header p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    .btn-refresh {
      padding: 10px 20px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-refresh:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .metric-card {
      display: flex;
      gap: 20px;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      background: white;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .metric-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }

    .metric-card.warning::before {
      background: linear-gradient(90deg, #f59e0b, #ef4444);
    }

    .metric-card.secondary::before {
      background: linear-gradient(90deg, #06b6d4, #0891b2);
    }

    .metric-card.info::before {
      background: linear-gradient(90deg, #8b5cf6, #7c3aed);
    }

    .metric-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    .metric-icon {
      font-size: 40px;
      line-height: 1;
    }

    .metric-content {
      flex: 1;
    }

    .metric-label {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .metric-value {
      font-size: 32px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .metric-subtitle {
      font-size: 12px;
      color: #9ca3af;
    }

    .metric-trend {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border-radius: 8px;
      background: #d1fae5;
      color: #059669;
      font-weight: 700;
      font-size: 13px;
      height: fit-content;
    }

    .metric-action,
    .metric-stat,
    .metric-pending {
      font-size: 12px;
      color: #6b7280;
      margin-top: auto;
    }

    .link-btn {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-weight: 600;
      padding: 0;
      text-decoration: underline;
    }

    .link-btn:hover {
      color: #764ba2;
    }

    /* Action Cards */
    .action-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .action-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      transition: all 0.3s;
    }

    .action-card:hover {
      border-color: #667eea;
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
      transform: translateY(-4px);
    }

    .action-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .action-card h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: #1f2937;
    }

    .action-card p {
      margin: 0 0 16px;
      color: #6b7280;
      font-size: 13px;
      line-height: 1.5;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: white;
      border: 1px solid #d1d5db;
      color: #374151;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    /* Tables Section */
    .tables-section {
      display: grid;
      gap: 24px;
    }

    .table-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .table-header h2 {
      margin: 0;
      font-size: 18px;
      color: #1f2937;
    }

    .btn-link {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: color 0.2s;
    }

    .btn-link:hover {
      color: #764ba2;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    /* Loading Skeleton */
    .loading-skeleton {
      animation: pulse 2s infinite;
    }

    .skeleton-row {
      height: 50px;
      background: #f3f4f6;
      border-radius: 8px;
      margin-bottom: 10px;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #6b7280;
      font-size: 14px;
    }

    /* Help Section */
    .help-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 32px;
      color: white;
      margin-top: 32px;
    }

    .help-section h2 {
      margin: 0 0 24px;
      font-size: 24px;
    }

    .help-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .help-item {
      background: rgba(255, 255, 255, 0.1);
      padding: 16px;
      border-radius: 8px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .help-item h4 {
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 600;
    }

    .help-item p {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .action-cards-grid {
        grid-template-columns: 1fr;
      }

      .help-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardEnhancedComponent {
  private apiService = inject(ApiService);
  private dashboardService = inject(DashboardDataService);
  private notificationService = inject(NotificationService);

  // State
  stats = signal<DashboardStats>({
    totalTaxPaid: 2450000,
    totalOutstanding: 375000,
    totalInvoiced: 850000,
    completedReturns: 3,
    pendingReturns: 1,
    failedPayments: 0
  });

  recentPayments = signal<any[]>([]);
  recentReturns = signal<any[]>([]);
  obligations = signal<any[]>([]);

  paymentLoading = signal(false);
  returnLoading = signal(false);
  obligationLoading = signal(false);

  invoicesCount = 12;

  // Table Columns
  paymentColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text', sortable: true },
    { key: 'taxpayer_name', label: 'Taxpayer', type: 'text', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'payment_date', label: 'Date', type: 'date', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true }
  ];

  returnColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text', sortable: true },
    { key: 'period', label: 'Period', type: 'text', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'submission_date', label: 'Submitted', type: 'date', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true }
  ];

  obligationColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text', sortable: true },
    { key: 'type', label: 'Type', type: 'text', sortable: true },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true },
    { key: 'due_date', label: 'Due Date', type: 'date', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true }
  ];

  paymentActions = [
    { label: 'View', action: 'view', icon: '👁️' }
  ];

  returnActions = [
    { label: 'View', action: 'view', icon: '👁️' }
  ];

  obligationActions = [
    { label: 'Pay', action: 'pay', icon: '💳' },
    { label: 'View', action: 'view', icon: '👁️' }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getCurrentDate(): Date {
    return new Date();
  }

  loadDashboardData(): void {
    this.paymentLoading.set(true);
    this.returnLoading.set(true);
    this.obligationLoading.set(true);

    // Load recent payments
    this.apiService.get<any[]>('/api/payments?limit=5').subscribe({
      next: (data) => {
        this.recentPayments.set(data || this.getMockPayments());
        this.paymentLoading.set(false);
      },
      error: () => {
        this.recentPayments.set(this.getMockPayments());
        this.paymentLoading.set(false);
      }
    });

    // Load recent returns
    this.apiService.get<any[]>('/api/returns?limit=5').subscribe({
      next: (data) => {
        this.recentReturns.set(data || this.getMockReturns());
        this.returnLoading.set(false);
      },
      error: () => {
        this.recentReturns.set(this.getMockReturns());
        this.returnLoading.set(false);
      }
    });

    // Load obligations
    this.apiService.get<any[]>('/api/obligations').subscribe({
      next: (data) => {
        this.obligations.set(data || this.getMockObligations());
        this.obligationLoading.set(false);
      },
      error: () => {
        this.obligations.set(this.getMockObligations());
        this.obligationLoading.set(false);
      }
    });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
    this.notificationService.showSuccess('Dashboard refreshed');
  }

  navigateTo(page: string): void {
    // TODO: Implement navigation using router
    this.notificationService.showInfo(`Navigating to ${page}...`);
  }

  private getMockPayments(): any[] {
    return [
      { id: 1, taxpayer_name: 'John Doe', amount: 50000, payment_date: '2024-01-15', status: 'completed' },
      { id: 2, taxpayer_name: 'Jane Smith', amount: 75000, payment_date: '2024-01-20', status: 'completed' }
    ];
  }

  private getMockReturns(): any[] {
    return [
      { id: 1, period: '2024 Q1', amount: 50000, submission_date: '2024-01-10', status: 'completed' }
    ];
  }

  private getMockObligations(): any[] {
    return [
      { id: 1, type: 'Quarterly Tax', amount: 25000, due_date: '2024-03-31', status: 'pending' }
    ];
  }
}
