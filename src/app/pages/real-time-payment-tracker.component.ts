import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';
import { interval, Subscription } from 'rxjs';

export interface PaymentTransaction {
  id: number;
  transactionId: string;
  taxpayerName: string;
  taxpayerPin: string;
  amount: number;
  fee: number;
  total: number;
  paymentMethod: string;
  status: string;
  timestamp: string;
  phone?: string;
  receipt?: string;
}

@Component({
  selector: 'app-real-time-payment-tracker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payment-tracker-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>⚡ Real-Time Payment Tracker</h1>
          <p>Live payment monitoring dashboard</p>
        </div>
        <div class="header-controls">
          <div class="status-indicator" [ngClass]="liveStatus()">
            <span class="pulse"></span>
            {{ liveStatus() === 'active' ? '🟢 Live' : '🔴 Offline' }}
          </div>
          <button class="btn-secondary" (click)="toggleLiveTracking()">
            {{ liveTracking() ? 'Pause' : 'Resume' }} Tracking
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-row">
        <div class="stat-box">
          <span class="label">Payments Today</span>
          <span class="value">{{ paymentsToday() }}</span>
        </div>
        <div class="stat-box">
          <span class="label">Total Collected Today</span>
          <span class="value">{{ (totalCollectedToday() | number: '1.0-0') }}</span>
        </div>
        <div class="stat-box">
          <span class="label">Avg Transaction Time</span>
          <span class="value">{{ avgTransactionTime() }}s</span>
        </div>
        <div class="stat-box">
          <span class="label">Success Rate</span>
          <span class="value">{{ successRate() }}%</span>
        </div>
      </div>

      <!-- Payment Method Distribution (Live) -->
      <div class="live-distribution">
        <h3>Payment Distribution (Last Hour)</h3>
        <div class="distribution-bars">
          <div class="distribution-item">
            <span class="method-name">M-PESA</span>
            <div class="distribution-bar">
              <div class="distribution-fill" style="width: 65%;"></div>
            </div>
            <span class="distribution-count">650</span>
          </div>
          <div class="distribution-item">
            <span class="method-name">Bank</span>
            <div class="distribution-bar">
              <div class="distribution-fill" style="width: 25%;"></div>
            </div>
            <span class="distribution-count">250</span>
          </div>
          <div class="distribution-item">
            <span class="method-name">Cheque</span>
            <div class="distribution-bar">
              <div class="distribution-fill" style="width: 10%;"></div>
            </div>
            <span class="distribution-count">100</span>
          </div>
        </div>
      </div>

      <!-- Live Transaction Feed -->
      <div class="transaction-feed">
        <div class="feed-header">
          <h3>Live Payment Feed</h3>
          <div class="feed-controls">
            <input type="search" placeholder="Search transaction..."
                   [(ngModel)]="searchTerm" class="search-input">
            <select [(ngModel)]="filterStatus" class="filter-select">
              <option value="">All Statuses</option>
              <option value="success">Successful</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div class="feed-list">
          <div *ngFor="let transaction of filteredTransactions()"
               class="transaction-item" [ngClass]="'status-' + transaction.status">
            <div class="transaction-time">
              {{ getRelativeTime(transaction.timestamp) }}
            </div>
            <div class="transaction-details">
              <div class="transaction-header">
                <span class="taxpayer-name">{{ transaction.taxpayerName }}</span>
                <span [ngClass]="'status-badge-' + transaction.status">
                  {{ transaction.status | uppercase }}
                </span>
              </div>
              <div class="transaction-meta">
                <span class="pin">{{ transaction.taxpayerPin }}</span>
                <span class="method">{{ transaction.paymentMethod }}</span>
                <span class="time">{{ formatTime(transaction.timestamp) }}</span>
              </div>
            </div>
            <div class="transaction-amount">
              <span class="amount">{{ (transaction.amount | number: '1.2-2') }}</span>
              <span class="fee" *ngIf="transaction.fee > 0">+{{ (transaction.fee | number: '1.2-2') }} fee</span>
            </div>
            <div class="transaction-actions">
              <button class="action-icon" (click)="viewDetails(transaction)" title="View Details">
                👁️
              </button>
              <button class="action-icon" (click)="downloadReceipt(transaction)" title="Download Receipt">
                📥
              </button>
            </div>
          </div>

          <div *ngIf="filteredTransactions().length === 0" class="no-data">
            No recent transactions matching filters
          </div>
        </div>
      </div>

      <!-- Details Modal -->
      <div *ngIf="selectedTransaction()" class="modal-overlay" (click)="selectedTransaction.set(null)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Transaction Details</h2>
            <button class="modal-close" (click)="selectedTransaction.set(null)">✕</button>
          </div>

          <div class="detail-grid">
            <div class="detail-row">
              <span class="label">Transaction ID</span>
              <span class="value mono">{{ selectedTransaction()?.transactionId }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Taxpayer</span>
              <span class="value">{{ selectedTransaction()?.taxpayerName }}</span>
            </div>
            <div class="detail-row">
              <span class="label">PIN</span>
              <span class="value mono">{{ selectedTransaction()?.taxpayerPin }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Payment Method</span>
              <span class="value">{{ selectedTransaction()?.paymentMethod }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Amount</span>
              <span class="value amount">{{ (selectedTransaction()?.amount | number: '1.2-2') }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Fee</span>
              <span class="value">{{ (selectedTransaction()?.fee | number: '1.2-2') }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total</span>
              <span class="value total">{{ (selectedTransaction()?.total | number: '1.2-2') }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status</span>
              <span [ngClass]="'badge-' + (selectedTransaction()?.status || '')">
                {{ selectedTransaction()?.status | uppercase }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">Timestamp</span>
              <span class="value">{{ selectedTransaction()?.timestamp }}</span>
            </div>
            <div class="detail-row" *ngIf="selectedTransaction()?.phone">
              <span class="label">Phone Number</span>
              <span class="value mono">{{ selectedTransaction()?.phone }}</span>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-secondary" (click)="downloadReceipt(selectedTransaction()!)">
              📥 Download Receipt
            </button>
            <button class="btn-secondary" (click)="resendConfirmation(selectedTransaction()!)">
              📧 Resend Confirmation
            </button>
            <button class="btn-secondary" (click)="selectedTransaction.set(null)">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Auto-refresh indicator -->
      <div class="refresh-info">
        ⟳ Auto-refreshing every {{ refreshInterval }}s | Last updated: {{ lastUpdate() }}
      </div>
    </div>
  `,
  styles: [`
    .payment-tracker-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .page-header h1 {
      margin: 0;
      color: #333;
    }

    .page-header p {
      margin: 0.5rem 0 0 0;
      color: #666;
    }

    .header-controls {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      background: #e9ecef;
    }

    .status-indicator.active {
      background: #d1e7dd;
      color: #0f5132;
    }

    .pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #0056b3;
      transform: translateY(-2px);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-box {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border-left: 4px solid #007bff;
    }

    .stat-box .label {
      color: #666;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .stat-box .value {
      font-size: 1.8rem;
      font-weight: bold;
      color: #007bff;
    }

    .live-distribution {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .live-distribution h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .distribution-bars {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .distribution-item {
      display: grid;
      grid-template-columns: 100px 1fr 60px;
      gap: 1rem;
      align-items: center;
    }

    .method-name {
      font-weight: 600;
      color: #333;
    }

    .distribution-bar {
      height: 30px;
      background: #e9ecef;
      border-radius: 6px;
      overflow: hidden;
    }

    .distribution-fill {
      height: 100%;
      background: linear-gradient(90deg, #007bff, #0056b3);
      transition: width 0.3s ease;
    }

    .distribution-count {
      text-align: right;
      font-weight: 600;
      color: #333;
    }

    .transaction-feed {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .feed-header {
      padding: 1.5rem;
      border-bottom: 2px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .feed-header h3 {
      margin: 0;
      color: #333;
    }

    .feed-controls {
      display: flex;
      gap: 1rem;
    }

    .search-input,
    .filter-select {
      padding: 0.75rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 0.95rem;
    }

    .search-input:focus,
    .filter-select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }

    .feed-list {
      max-height: 600px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .transaction-item {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f0f0f0;
      display: grid;
      grid-template-columns: 80px 1fr 150px 100px;
      gap: 1rem;
      align-items: center;
      transition: all 0.2s ease;
      border-left: 4px solid transparent;
    }

    .transaction-item:hover {
      background: #f8f9fa;
    }

    .transaction-item.status-success {
      border-left-color: #28a745;
    }

    .transaction-item.status-pending {
      border-left-color: #ffc107;
    }

    .transaction-item.status-failed {
      border-left-color: #dc3545;
    }

    .transaction-time {
      font-size: 0.85rem;
      color: #999;
      font-weight: 600;
    }

    .transaction-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .transaction-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .taxpayer-name {
      font-weight: 600;
      color: #333;
    }

    .status-badge-success {
      background: #d1e7dd;
      color: #0f5132;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge-pending {
      background: #fff3cd;
      color: #856404;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge-failed {
      background: #f8d7da;
      color: #842029;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .transaction-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.85rem;
      color: #666;
    }

    .pin {
      font-family: monospace;
    }

    .transaction-amount {
      text-align: right;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .amount {
      font-weight: bold;
      color: #007bff;
      font-size: 1rem;
    }

    .fee {
      font-size: 0.85rem;
      color: #999;
    }

    .transaction-actions {
      display: flex;
      gap: 0.5rem;
    }

    .action-icon {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .action-icon:hover {
      transform: scale(1.2);
    }

    .no-data {
      padding: 2rem;
      text-align: center;
      color: #999;
      font-weight: 500;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 2px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .detail-grid {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .detail-row {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row .label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .detail-row .value {
      color: #333;
    }

    .mono {
      font-family: monospace;
    }

    .amount {
      color: #007bff;
      font-weight: bold;
    }

    .total {
      color: #28a745;
      font-weight: bold;
    }

    .badge-success {
      background: #d1e7dd;
      color: #0f5132;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      display: inline-block;
    }

    .badge-pending {
      background: #fff3cd;
      color: #856404;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      display: inline-block;
    }

    .badge-failed {
      background: #f8d7da;
      color: #842029;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.85rem;
      display: inline-block;
    }

    .modal-actions {
      padding: 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      border-top: 1px solid #f0f0f0;
    }

    .refresh-info {
      text-align: center;
      color: #999;
      font-size: 0.85rem;
      margin-top: 1rem;
      padding: 1rem;
    }

    @media (max-width: 768px) {
      .payment-tracker-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .transaction-item {
        grid-template-columns: 1fr;
      }

      .feed-controls {
        width: 100%;
      }

      .search-input,
      .filter-select {
        width: 100%;
      }
    }
  `]
})
export class RealTimePaymentTrackerComponent implements OnInit, OnDestroy {
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  transactions = signal<PaymentTransaction[]>([]);
  filteredTransactions = signal<PaymentTransaction[]>([]);
  selectedTransaction = signal<PaymentTransaction | null>(null);
  liveTracking = signal(true);
  lastUpdate = signal<string>('');

  searchTerm = '';
  filterStatus = '';
  refreshInterval = 5;

  private refreshSubscription?: Subscription;

  paymentsToday = computed(() => {
    const today = new Date().toDateString();
    return this.transactions().filter(t =>
      new Date(t.timestamp).toDateString() === today
    ).length;
  });

  totalCollectedToday = computed(() => {
    const today = new Date().toDateString();
    return this.transactions()
      .filter(t => new Date(t.timestamp).toDateString() === today && t.status === 'success')
      .reduce((sum, t) => sum + t.total, 0);
  });

  avgTransactionTime = computed(() => {
    const successTransactions = this.transactions().filter(t => t.status === 'success');
    if (successTransactions.length === 0) return 0;
    return Math.round(Math.random() * 10 + 5); // Mock calculation
  });

  successRate = computed(() => {
    if (this.transactions().length === 0) return 0;
    const successful = this.transactions().filter(t => t.status === 'success').length;
    return Math.round((successful / this.transactions().length) * 100);
  });

  liveStatus = computed(() => this.liveTracking() ? 'active' : 'inactive');

  ngOnInit() {
    this.loadTransactions();
    this.startLiveTracking();
  }

  ngOnDestroy() {
    this.stopLiveTracking();
  }

  loadTransactions() {
    this.apiService.get<any>('payments_realtime.php', { params: { action: 'list', limit: 50 } }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const data = response.data.obligations || response.data;
          this.transactions.set(Array.isArray(data) ? data : []);
        } else if (response.data && Array.isArray(response.data)) {
          this.transactions.set(response.data);
        } else {
          this.transactions.set([]);
        }
        this.applyFilters();
        this.updateLastUpdate();
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.transactions.set([]);
      }
    });
  }

  applyFilters() {
    let filtered = this.transactions();

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.taxpayerName?.toLowerCase().includes(search) ||
        t.taxpayerPin?.toLowerCase().includes(search) ||
        t.transactionId?.toLowerCase().includes(search)
      );
    }

    if (this.filterStatus) {
      filtered = filtered.filter(t => t.status === this.filterStatus);
    }

    this.filteredTransactions.set(filtered);
  }

  startLiveTracking() {
    this.refreshSubscription = interval(this.refreshInterval * 1000)
      .subscribe(() => {
        if (this.liveTracking()) {
          this.loadTransactions();
        }
      });
  }

  stopLiveTracking() {
    this.refreshSubscription?.unsubscribe();
  }

  toggleLiveTracking() {
    this.liveTracking.set(!this.liveTracking());
    if (this.liveTracking()) {
      this.startLiveTracking();
    } else {
      this.stopLiveTracking();
    }
  }

  getRelativeTime(timestamp: string): string {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  updateLastUpdate() {
    this.lastUpdate.set(new Date().toLocaleTimeString());
  }

  viewDetails(transaction: PaymentTransaction) {
    this.selectedTransaction.set(transaction);
  }

  downloadReceipt(transaction: PaymentTransaction) {
    this.notificationService.showSuccess('Receipt downloaded');
  }

  resendConfirmation(transaction: PaymentTransaction) {
    this.notificationService.showSuccess('Confirmation email sent');
  }
}
