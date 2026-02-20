import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';
import { ExportService } from '../services/export.service';
import { DataTableComponent } from '../components/simple-data-table/simple-data-table.component';

export interface Invoice {
  id?: number;
  taxpayerId: number;
  taxpayerName: string;
  taxpayerPin: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  balance: number;
  status: string;
  description: string;
  itemCount: number;
  createdAt?: string;
}

@Component({
  selector: 'app-invoices-enhanced',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTableComponent],
  template: `
    <div class="invoices-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>📄 Invoices Management</h1>
          <p>Manage and track tax invoices</p>
        </div>
        <button class="btn-primary" (click)="openNewInvoiceForm()">
          ➕ New Invoice
        </button>
      </div>

      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Total Invoices</h3>
            <p class="stat-value">{{ totalInvoices() }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Total Amount</h3>
            <p class="stat-value">{{ (totalAmount() | number: '1.2-2') }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">️✅</div>
          <div class="stat-content">
            <h3>Paid</h3>
            <p class="stat-value">{{ paidInvoices() }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>Outstanding</h3>
            <p class="stat-value">{{ (outstandingAmount() | number: '1.2-2') }}</p>
          </div>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Status:</label>
          <select [(ngModel)]="selectedStatus" (change)="applyFilters()">
            <option value="">All Invoices</option>
            <option value="issued">Issued</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="partially_paid">Partially Paid</option>
          </select>
        </div>
        <div class="filter-group">
          <input type="text" placeholder="Search invoice number or taxpayer..."
                 [(ngModel)]="searchQuery" (input)="applyFilters()" class="search-input">
        </div>
        <div class="filter-group">
          <input type="date" [(ngModel)]="dateFilter" (change)="applyFilters()" class="search-input">
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-secondary" (click)="exportData('excel')">📥 Export Excel</button>
        <button class="btn-secondary" (click)="exportData('pdf')">📥 Export PDF</button>
        <button class="btn-secondary" (click)="sendReminders()">📧 Send Reminders</button>
        <button class="btn-secondary" (click)="loadData()">🔄 Refresh</button>
      </div>

      <!-- Invoices Table -->
      <div class="data-table-wrapper">
        <app-simple-data-table
          [data]="filteredInvoices()"
          [columns]="tableColumns"
          [searchable]="true"
          [filterable]="true"
          [sortable]="true"
          [pageable]="true"
          [exportable]="true"
          [pageSize]="10"
          (actionClick)="handleTableAction($event)"
        ></app-simple-data-table>
      </div>

      <!-- Invoice Details Modal -->
      <div *ngIf="selectedInvoice()" class="modal-overlay" (click)="selectedInvoice.set(null)">
        <div class="modal-content details-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Invoice Details</h2>
            <button class="close-btn" (click)="selectedInvoice.set(null)">✕</button>
          </div>

          <div class="invoice-details">
            <div class="invoice-header">
              <div>
                <p class="label">Invoice Number</p>
                <p class="value">{{ selectedInvoice()?.invoiceNumber }}</p>
              </div>
              <div>
                <p class="label">Status</p>
                <p><span [ngClass]="'status-' + (selectedInvoice()?.status || '')">
                  {{ selectedInvoice()?.status | uppercase }}
                </span></p>
              </div>
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <label>Taxpayer</label>
                <p>{{ selectedInvoice()?.taxpayerName }}</p>
              </div>
              <div class="detail-item">
                <label>PIN</label>
                <p class="font-mono">{{ selectedInvoice()?.taxpayerPin }}</p>
              </div>
              <div class="detail-item">
                <label>Invoice Date</label>
                <p>{{ selectedInvoice()?.invoiceDate }}</p>
              </div>
              <div class="detail-item">
                <label>Due Date</label>
                <p [ngClass]="isOverdue(selectedInvoice()) ? 'overdue' : ''">
                  {{ selectedInvoice()?.dueDate }}
                </p>
              </div>
              <div class="detail-item">
                <label>Description</label>
                <p>{{ selectedInvoice()?.description }}</p>
              </div>
              <div class="detail-item">
                <label>Item Count</label>
                <p>{{ selectedInvoice()?.itemCount }} items</p>
              </div>
              <div class="detail-item highlight">
                <label>Invoice Amount</label>
                <p>{{ (selectedInvoice()?.amount | number: '1.2-2') }}</p>
              </div>
              <div class="detail-item highlight">
                <label>Amount Paid</label>
                <p>{{ (selectedInvoice()?.amountPaid | number: '1.2-2') }}</p>
              </div>
              <div class="detail-item highlight">
                <label>Balance</label>
                <p [ngClass]="(selectedInvoice()?.balance ?? 0) > 0 ? 'text-danger' : 'text-success'">
                  {{ (selectedInvoice()?.balance | number: '1.2-2') }}
                </p>
              </div>
            </div>

            <div class="progress-section">
              <p class="progress-label">Payment Progress</p>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
              </div>
              <p class="progress-text">{{ getProgressPercentage() | number: '1.0-0' }}% Paid</p>
            </div>

            <div class="modal-actions">
              <button class="btn-secondary" (click)="recordPayment()">💳 Record Payment</button>
              <button class="btn-secondary" (click)="sendReminder()">📧 Send Reminder</button>
              <button class="btn-secondary" (click)="downloadInvoice()">📥 Download</button>
              <button class="btn-secondary" (click)="selectedInvoice.set(null)">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- New Invoice Form -->
      <div *ngIf="showNewInvoiceForm()" class="modal-overlay" (click)="closeNewInvoiceForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>New Invoice</h2>
            <button class="close-btn" (click)="closeNewInvoiceForm()">✕</button>
          </div>

          <form class="form">
            <div class="form-group">
              <label>Taxpayer *</label>
              <select [(ngModel)]="newInvoice.taxpayerId" name="taxpayerId">
                <option value="">Select Taxpayer</option>
                <option *ngFor="let taxpayer of taxpayers()" [value]="taxpayer.id">
                  {{ taxpayer.name }} ({{ taxpayer.pin }})
                </option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Invoice Date *</label>
                <input type="date" [(ngModel)]="newInvoice.invoiceDate" name="invoiceDate">
              </div>
              <div class="form-group">
                <label>Due Date *</label>
                <input type="date" [(ngModel)]="newInvoice.dueDate" name="dueDate">
              </div>
            </div>

            <div class="form-group">
              <label>Description *</label>
              <textarea [(ngModel)]="newInvoice.description" name="description" rows="3"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Amount *</label>
                <input type="number" [(ngModel)]="newInvoice.amount" name="amount" min="0" step="0.01">
              </div>
              <div class="form-group">
                <label>Item Count *</label>
                <input type="number" [(ngModel)]="newInvoice.itemCount" name="itemCount" min="1">
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeNewInvoiceForm()">Cancel</button>
              <button type="button" class="btn-primary" (click)="submitNewInvoice()">Create Invoice</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invoices-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .header-content h1 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .header-content p {
      color: #666;
      margin: 0;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #e9ecef;
      color: #333;
      border: 1px solid #dee2e6;
    }

    .btn-secondary:hover {
      background: #dee2e6;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
      margin: 0;
    }

    .filters-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 600;
      color: #333;
    }

    .filter-group select,
    .search-input {
      padding: 0.75rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 0.95rem;
    }

    .filter-group select:focus,
    .search-input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .data-table-wrapper {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
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
      padding: 2rem;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    .details-modal {
      max-width: 800px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 1rem;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #666;
    }

    .invoice-details {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .invoice-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .invoice-header .label {
      font-size: 0.85rem;
      color: #666;
      margin: 0;
    }

    .invoice-header .value {
      font-size: 1.2rem;
      font-weight: bold;
      margin: 0.5rem 0 0 0;
      color: #333;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .detail-item {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .detail-item.highlight {
      background: #e7f3ff;
      border: 2px solid #007bff;
    }

    .detail-item label {
      display: block;
      font-weight: 600;
      color: #666;
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .detail-item p {
      margin: 0;
      color: #333;
      font-weight: 500;
    }

    .font-mono {
      font-family: 'Courier New', monospace;
    }

    .overdue {
      color: #dc3545;
      font-weight: bold;
    }

    .text-danger {
      color: #dc3545;
    }

    .text-success {
      color: #28a745;
    }

    .progress-section {
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .progress-label {
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .progress-bar {
      width: 100%;
      height: 20px;
      background: #e9ecef;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #007bff, #0056b3);
      transition: width 0.3s ease;
    }

    .progress-text {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
    }

    .status-issued {
      background: #cfe2ff;
      color: #084298;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-paid {
      background: #d1e7dd;
      color: #0f5132;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-overdue {
      background: #f8d7da;
      color: #842029;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-partially_paid {
      background: #fff3cd;
      color: #856404;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      border-top: 1px solid #f0f0f0;
      padding-top: 1rem;
      margin-top: 1rem;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #333;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 0.95rem;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
      border-top: 1px solid #f0f0f0;
      padding-top: 1rem;
    }

    @media (max-width: 768px) {
      .invoices-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .details-grid,
      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-content {
        width: 95%;
        padding: 1.5rem;
      }

      .invoice-header {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InvoicesEnhancedComponent implements OnInit {
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);
  private exportService = inject(ExportService);

  invoices = signal<Invoice[]>([]);
  taxpayers = signal<any[]>([]);
  filteredInvoices = signal<Invoice[]>([]);
  selectedInvoice = signal<Invoice | null>(null);
  showNewInvoiceForm = signal(false);

  selectedStatus = '';
  searchQuery = '';
  dateFilter = '';

  newInvoice = {
    taxpayerId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    amount: 0,
    itemCount: 1
  };

  tableColumns = [
    { key: 'invoiceNumber', label: 'Invoice #' },
    { key: 'taxpayerName', label: 'Taxpayer' },
    { key: 'amount', label: 'Amount', format: 'currency' },
    { key: 'amountPaid', label: 'Paid', format: 'currency' },
    { key: 'balance', label: 'Balance', format: 'currency' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'status', label: 'Status' }
  ];

  totalInvoices = computed(() => this.invoices().length);
  paidInvoices = computed(() => this.invoices().filter(i => i.status === 'paid').length);
  totalAmount = computed(() => this.invoices().reduce((sum, i) => sum + (i.amount || 0), 0));
  outstandingAmount = computed(() => this.invoices().reduce((sum, i) => sum + (i.balance || 0), 0));

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.get<any>('invoices_enhanced_api.php', { params: { action: 'list' } }).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.invoices) {
          this.invoices.set(response.data.invoices || []);
        } else if (response.data && Array.isArray(response.data)) {
          this.invoices.set(response.data);
        } else {
          this.invoices.set([]);
        }
        this.applyFilters();
        this.notificationService.showSuccess('Invoices loaded');
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.notificationService.showError('Failed to load invoices');
        this.invoices.set([]);
      }
    });

    this.apiService.get<any>('taxpayer_list.php').subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.taxpayers.set(response.data);
        } else {
          this.taxpayers.set([]);
        }
      },
      error: (error) => {
        console.error('Error loading taxpayers:', error);
        this.taxpayers.set([]);
      }
    });
  }

  applyFilters() {
    let filtered = this.invoices();

    if (this.selectedStatus) {
      filtered = filtered.filter(i => i.status === this.selectedStatus);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.invoiceNumber?.toLowerCase().includes(query) ||
        i.taxpayerName?.toLowerCase().includes(query)
      );
    }

    if (this.dateFilter) {
      filtered = filtered.filter(i => i.dueDate >= this.dateFilter);
    }

    this.filteredInvoices.set(filtered);
  }

  isOverdue(invoice?: Invoice): boolean {
    if (!invoice) return false;
    return new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid';
  }

  getProgressPercentage(): number {
    if (!this.selectedInvoice()) return 0;
    const amount = this.selectedInvoice()?.amount || 1;
    const paid = this.selectedInvoice()?.amountPaid || 0;
    return (paid / amount) * 100;
  }

  openNewInvoiceForm() {
    this.showNewInvoiceForm.set(true);
  }

  closeNewInvoiceForm() {
    this.showNewInvoiceForm.set(false);
    this.newInvoice = {
      taxpayerId: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      description: '',
      amount: 0,
      itemCount: 1
    };
  }

  submitNewInvoice() {
    const invoice = {
      taxpayerId: parseInt(this.newInvoice.taxpayerId as any),
      invoiceDate: this.newInvoice.invoiceDate,
      dueDate: this.newInvoice.dueDate,
      amount: this.newInvoice.amount,
      description: this.newInvoice.description
    };

    this.apiService.post<any>('invoices_enhanced_api.php', invoice).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Invoice created successfully');
          this.loadData();
          this.closeNewInvoiceForm();
        } else {
          this.notificationService.showError(response.error || 'Failed to create invoice');
        }
      },
      error: (error) => {
        console.error('Error creating invoice:', error);
        this.notificationService.showError('Failed to create invoice');
      }
    });
  }
      error: (error) => {
        console.error('Error creating invoice:', error);
        this.notificationService.showError('Failed to create invoice');
      }
    });
  }

  handleTableAction(action: any) {
    if (action.type === 'view') {
      const item = this.invoices().find(i => i.id === action.id);
      if (item) this.selectedInvoice.set(item);
    }
  }

  recordPayment() {
    this.notificationService.showInfo('Payment recording feature coming soon');
  }

  sendReminder() {
    this.notificationService.showSuccess('Reminder sent to taxpayer');
  }

  sendReminders() {
    this.notificationService.showSuccess('Reminders sent to all overdue invoices');
  }

  downloadInvoice() {
    this.notificationService.showSuccess('Invoice downloaded');
  }

  exportData(format: string) {
    this.notificationService.showInfo(`Exporting to ${format}...`);
  }
}
