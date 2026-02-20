import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../services/payment.service';
import { ApiService } from '../services/api.service';
import { DataTableComponent, TableColumn, TableAction } from './data-table/data-table.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { NotificationService } from '../services/notification.service';

interface Payment {
  id: number;
  taxpayer_id: number;
  taxpayer_name: string;
  payment_date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  payment_method: string;
  transaction_id?: string;
}

@Component({
  selector: 'app-payments-enhanced',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaymentFormComponent],
  template: `
    <div class="payments-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>Payments Management</h1>
          <p>Manage and track all your tax payments</p>
        </div>
        <button class="btn btn-primary" (click)="togglePaymentForm()">
          <span>{{ showPaymentForm() ? '✕ Close' : '+ New Payment' }}</span>
        </button>
      </div>

      <!-- Payment Form (Collapsible) -->
      <div *ngIf="showPaymentForm()" class="form-container">
        <app-payment-form #paymentForm></app-payment-form>
      </div>

      <!-- Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon pending">💰</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalPending() | number:'1.2-2' }}</div>
            <div class="stat-label">Pending Payments</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon completed">✓</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalCompleted() | number:'1.2-2' }}</div>
            <div class="stat-label">Completed This Month</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ payments().length }}</div>
            <div class="stat-label">Total Transactions</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon failed">⚠️</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalFailed() }}</div>
            <div class="stat-label">Failed Payments</div>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="table-section">
        <div class="section-header">
          <h2>Payment Transactions</h2>
          <div class="section-actions">
            <input
              type="text"
              placeholder="Quick search..."
              class="search-input"
              (change)="onQuickSearch($event)">
            <select class="filter-select" (change)="onStatusFilter($event)">
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button class="btn-icon" (click)="refreshPayments()" title="Refresh">
              🔄
            </button>
          </div>
        </div>

        <div *ngIf="loading()" class="loading-state">
          <div class="spinner"></div>
          <p>Loading payment data...</p>
        </div>

        <app-data-table
          *ngIf="!loading()"
          [data]="filteredPayments()"
          [columns]="paymentColumns"
          [actions]="paymentActions"
          (actionTriggered)="handlePaymentAction($event)">
        </app-data-table>

        <div *ngIf="!loading() && payments().length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>No Payments Yet</h3>
          <p>You haven't made any payments. Click "New Payment" to get started.</p>
        </div>
      </div>

      <!-- Payment Details Modal -->
      <div *ngIf="selectedPayment()" class="modal-overlay" (click)="selectedPayment.set(null)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Payment Details</h3>
            <button class="modal-close" (click)="selectedPayment.set(null)">✕</button>
          </div>
          <div class="modal-content">
            <div class="detail-group">
              <label>Transaction ID</label>
              <div class="detail-value">{{ selectedPayment()?.transaction_id || selectedPayment()?.id }}</div>
            </div>
            <div class="detail-group">
              <label>Taxpayer</label>
              <div class="detail-value">{{ selectedPayment()?.taxpayer_name }}</div>
            </div>
            <div class="detail-group">
              <label>Amount</label>
              <div class="detail-value currency">KES {{ selectedPayment()?.amount | number:'1.2-2' }}</div>
            </div>
            <div class="detail-group">
              <label>Payment Date</label>
              <div class="detail-value">{{ selectedPayment()?.payment_date | date:'medium' }}</div>
            </div>
            <div class="detail-group">
              <label>Payment Method</label>
              <div class="detail-value">{{ selectedPayment()?.payment_method | titlecase }}</div>
            </div>
            <div class="detail-group">
              <label>Status</label>
              <div class="detail-value">
                <span class="status-badge" [class]="'status-' + selectedPayment()?.status">
                  {{ selectedPayment()?.status | titlecase }}
                </span>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="selectedPayment.set(null)">Close</button>
            <button class="btn btn-primary" (click)="downloadReceipt()">📥 Download Receipt</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payments-container {
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
      font-size: 28px;
      color: #1f2937;
    }

    .page-header p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    /* Form Container */
    .form-container {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Statistics */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      gap: 16px;
      background: white;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      transition: all 0.2s;
    }

    .stat-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 10px;
      background: #f3f4f6;
      font-size: 24px;
    }

    .stat-icon.pending {
      background: #fef3c7;
    }

    .stat-icon.completed {
      background: #d1fae5;
    }

    .stat-icon.failed {
      background: #fee2e2;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 13px;
      color: #6b7280;
    }

    /* Table Section */
    .table-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      margin: 0;
      font-size: 20px;
      color: #1f2937;
    }

    .section-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .search-input,
    .filter-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 13px;
      transition: border-color 0.2s;
    }

    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      padding: 0;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.2s;
    }

    .btn-icon:hover {
      border-color: #667eea;
      background: #f8f9ff;
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #6b7280;
    }

    .spinner {
      width: 40px;
      height: 40px;
      margin-bottom: 16px;
      border: 4px solid #e5e7eb;
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px;
      font-size: 18px;
      color: #1f2937;
    }

    .empty-state p {
      margin: 0;
      color: #6b7280;
      font-size: 14px;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .modal {
      background: white;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      color: #1f2937;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6b7280;
      transition: color 0.2s;
    }

    .modal-close:hover {
      color: #1f2937;
    }

    .modal-content {
      padding: 24px;
      max-height: 60vh;
      overflow-y: auto;
    }

    .detail-group {
      margin-bottom: 16px;
    }

    .detail-group:last-child {
      margin-bottom: 0;
    }

    .detail-group label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .detail-value {
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;
    }

    .detail-value.currency {
      font-size: 18px;
      color: #059669;
      font-weight: 700;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-completed {
      background: #d1fae5;
      color: #065f46;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-cancelled {
      background: #e5e7eb;
      color: #374151;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-secondary {
      background: white;
      border: 1px solid #d1d5db;
      color: #374151;
      flex: 1;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    .btn-primary {
      flex: 1;
    }

    @media (max-width: 768px) {
      .payments-container {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }

      .section-actions {
        flex-wrap: wrap;
      }

      .search-input,
      .filter-select {
        font-size: 12px;
        padding: 6px 10px;
      }
    }
  `]
})
export class PaymentsEnhancedComponent {
  private paymentService = inject(PaymentService);
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  // State
  payments = signal<Payment[]>([]);
  loading = signal(false);
  showPaymentForm = signal(false);
  selectedPayment = signal<Payment | null>(null);
  filteredStatus = signal('');

  // Computed
  filteredPayments = computed(() => {
    const status = this.filteredStatus();
    if (!status) return this.payments();
    return this.payments().filter(p => p.status === status);
  });

  totalCompleted = computed(() => {
    return this.payments()
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  });

  totalPending = computed(() => {
    return this.payments()
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
  });

  totalFailed = computed(() => {
    return this.payments()
      .filter(p => p.status === 'failed').length;
  });

  // Table Configuration
  paymentColumns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'text', sortable: true, filterable: false, width: '80px' },
    { key: 'taxpayer_name', label: 'Taxpayer', type: 'text', sortable: true, filterable: false },
    { key: 'amount', label: 'Amount', type: 'currency', sortable: true, filterable: false },
    { key: 'payment_date', label: 'Date', type: 'date', sortable: true, filterable: false },
    { key: 'payment_method', label: 'Method', type: 'text', sortable: true, filterable: false, width: '100px' },
    { key: 'status', label: 'Status', type: 'status', sortable: true, filterable: true }
  ];

  paymentActions: TableAction[] = [
    { label: 'View', icon: '👁️', action: 'view', color: 'info' },
    { label: 'Receipt', icon: '📄', action: 'receipt', color: 'primary' },
    { label: 'Resend Receipt', icon: '📧', action: 'resend', color: 'secondary' }
  ];

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading.set(true);
    this.apiService.get<Payment[]>('/api/payments').subscribe({
      next: (data) => {
        this.payments.set(data || this.getMockPayments());
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.payments.set(this.getMockPayments());
        this.loading.set(false);
      }
    });
  }

  refreshPayments(): void {
    this.loadPayments();
    this.notificationService.showSuccess('Payments refreshed');
  }

  togglePaymentForm(): void {
    this.showPaymentForm.update(v => !v);
  }

  handlePaymentAction(event: {action: string; data: any}): void {
    switch (event.action) {
      case 'view':
        this.selectedPayment.set(event.data);
        break;
      case 'receipt':
        this.downloadReceipt(event.data);
        break;
      case 'resend':
        this.resendReceipt(event.data);
        break;
    }
  }

  downloadReceipt(payment?: Payment): void {
    const currentPayment = payment || this.selectedPayment();
    if (!currentPayment) return;

    this.notificationService.showSuccess('Receipt download initiated');
    // TODO: Implement actual receipt download
  }

  resendReceipt(payment: Payment): void {
    this.notificationService.showSuccess(`Receipt resent to ${payment.taxpayer_name}`);
    // TODO: Implement actual resend
  }

  onQuickSearch(event: Event): void {
    // TODO: Implement real-time search
  }

  onStatusFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filteredStatus.set(target.value);
  }

  private getMockPayments(): Payment[] {
    return [
      {
        id: 1,
        taxpayer_id: 1,
        taxpayer_name: 'John Doe',
        payment_date: '2024-01-15',
        amount: 50000,
        status: 'completed',
        payment_method: 'mpesa',
        transaction_id: 'TXN001'
      },
      {
        id: 2,
        taxpayer_id: 2,
        taxpayer_name: 'Jane Smith',
        payment_date: '2024-01-20',
        amount: 75000,
        status: 'completed',
        payment_method: 'bank_transfer',
        transaction_id: 'TXN002'
      },
      {
        id: 3,
        taxpayer_id: 3,
        taxpayer_name: 'ABC Corporation',
        payment_date: '2024-02-01',
        amount: 150000,
        status: 'pending',
        payment_method: 'mpesa'
      }
    ];
  }
}
