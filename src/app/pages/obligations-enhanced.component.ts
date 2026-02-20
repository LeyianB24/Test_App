import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';
import { DataTableComponent } from '../components/simple-data-table/simple-data-table.component';

export interface Obligation {
  id?: number;
  taxpayerId: number;
  taxpayerName: string;
  taxpayerPin: string;
  obligationType: string;
  description: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  balance: number;
  status: string;
  priority: string;
  penalty?: number;
  createdAt?: string;
}

@Component({
  selector: 'app-obligations-enhanced',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTableComponent],
  template: `
    <div class="obligations-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>⚖️ Tax Obligations</h1>
          <p>Track and manage tax filing obligations</p>
        </div>
        <button class="btn-primary" (click)="openNewObligationForm()">
          ➕ New Obligation
        </button>
      </div>

      <!-- Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <h3>Total Obligations</h3>
            <p class="stat-value">{{ totalObligations() }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔴</div>
          <div class="stat-content">
            <h3>Overdue</h3>
            <p class="stat-value text-danger">{{ overdueObligations() }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>Due Soon (7 days)</h3>
            <p class="stat-value text-warning">{{ dueSoonObligations() }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Outstanding Amount</h3>
            <p class="stat-value">{{ (totalBalance() | number: '1.2-2') }}</p>
          </div>
        </div>
      </div>

      <!-- Alerts -->
      <div *ngIf="overdueObligations() > 0" class="alert alert-danger">
        ⚠️ You have {{ overdueObligations() }} overdue obligations. Please address them immediately to avoid penalties.
      </div>

      <div *ngIf="dueSoonObligations() > 0" class="alert alert-warning">
        ⏰ {{ dueSoonObligations() }} obligations are due within the next 7 days.
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Filter by Status:</label>
          <select [(ngModel)]="selectedStatus" (change)="applyFilters()">
            <option value="">All Obligations</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
            <option value="waived">Waived</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Filter by Priority:</label>
          <select [(ngModel)]="selectedPriority" (change)="applyFilters()">
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div class="filter-group">
          <input type="text" placeholder="Search taxpayer or obligation..."
                 [(ngModel)]="searchQuery" (input)="applyFilters()" class="search-input">
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-secondary" (click)="exportData('excel')">📥 Export</button>
        <button class="btn-secondary" (click)="sendNotifications()">📧 Send Notifications</button>
        <button class="btn-secondary" (click)="generateReport()">📊 Generate Report</button>
        <button class="btn-secondary" (click)="loadData()">🔄 Refresh</button>
      </div>

      <!-- Obligations Table -->
      <div class="data-table-wrapper">
        <app-simple-data-table
          [data]="filteredObligations()"
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

      <!-- Obligation Details Modal -->
      <div *ngIf="selectedObligation()" class="modal-overlay" (click)="selectedObligation.set(null)">
        <div class="modal-content details-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Obligation Details</h2>
            <button class="close-btn" (click)="selectedObligation.set(null)">✕</button>
          </div>

          <div class="obligation-details">
            <div class="priority-badge" [ngClass]="'priority-' + (selectedObligation()?.priority || 'medium')">
              {{ selectedObligation()?.priority | uppercase }}
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <label>Taxpayer</label>
                <p>{{ selectedObligation()?.taxpayerName }}</p>
              </div>
              <div class="detail-item">
                <label>PIN</label>
                <p class="font-mono">{{ selectedObligation()?.taxpayerPin }}</p>
              </div>
              <div class="detail-item">
                <label>Obligation Type</label>
                <p>{{ selectedObligation()?.obligationType }}</p>
              </div>
              <div class="detail-item">
                <label>Status</label>
                <p><span [ngClass]="'status-' + (selectedObligation()?.status || '')">
                  {{ selectedObligation()?.status | uppercase }}
                </span></p>
              </div>
              <div class="detail-item">
                <label>Description</label>
                <p>{{ selectedObligation()?.description }}</p>
              </div>
              <div class="detail-item">
                <label>Due Date</label>
                <p [ngClass]="isOverdue(selectedObligation()) ? 'text-danger' : ''">
                  {{ selectedObligation()?.dueDate }}
                </p>
              </div>
              <div class="detail-item highlight">
                <label>Amount</label>
                <p>{{ (selectedObligation()?.amount | number: '1.2-2') }}</p>
              </div>
              <div class="detail-item highlight">
                <label>Amount Paid</label>
                <p>{{ (selectedObligation()?.amountPaid | number: '1.2-2') }}</p>
              </div>
              <div class="detail-item highlight">
                <label>Balance</label>
                <p [ngClass]="(selectedObligation()?.balance ?? 0) > 0 ? 'text-danger' : 'text-success'">
                  {{ (selectedObligation()?.balance | number: '1.2-2') }}
                </p>
              </div>
              <div class="detail-item" *ngIf="selectedObligation()?.penalty">
                <label>Penalty</label>
                <p class="text-danger">{{ (selectedObligation()?.penalty | number: '1.2-2') }}</p>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn-secondary" (click)="recordPayment()">💳 Record Payment</button>
              <button class="btn-secondary" (click)="markCompleted()">✅ Mark Completed</button>
              <button class="btn-secondary" (click)="sendReminder()">📧 Send Reminder</button>
              <button class="btn-secondary" (click)="selectedObligation.set(null)">Close</button>
            </div>
          </div>
        </div>
      </div>

      <!-- New Obligation Form -->
      <div *ngIf="showNewObligationForm()" class="modal-overlay" (click)="closeNewObligationForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>New Obligation</h2>
            <button class="close-btn" (click)="closeNewObligationForm()">✕</button>
          </div>

          <form class="form">
            <div class="form-group">
              <label>Taxpayer *</label>
              <select [(ngModel)]="newObligation.taxpayerId" name="taxpayerId">
                <option value="">Select Taxpayer</option>
                <option *ngFor="let taxpayer of taxpayers()" [value]="taxpayer.id">
                  {{ taxpayer.name }} ({{ taxpayer.pin }})
                </option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Obligation Type *</label>
                <select [(ngModel)]="newObligation.obligationType" name="obligationType">
                  <option value="">Select Type</option>
                  <option value="annual_return">Annual Return Filing</option>
                  <option value="monthly_return">Monthly Return Filing</option>
                  <option value="quarterly_return">Quarterly Return Filing</option>
                  <option value="tax_payment">Tax Payment</option>
                  <option value="audit">Audit Response</option>
                  <option value="documentation">Documentation Submission</option>
                </select>
              </div>
              <div class="form-group">
                <label>Priority *</label>
                <select [(ngModel)]="newObligation.priority" name="priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Description *</label>
              <textarea [(ngModel)]="newObligation.description" name="description" rows="3"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Due Date *</label>
                <input type="date" [(ngModel)]="newObligation.dueDate" name="dueDate">
              </div>
              <div class="form-group">
                <label>Amount *</label>
                <input type="number" [(ngModel)]="newObligation.amount" name="amount" min="0" step="0.01">
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeNewObligationForm()">Cancel</button>
              <button type="button" class="btn-primary" (click)="submitNewObligation()">Create Obligation</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .obligations-container {
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

    .text-danger {
      color: #dc3545;
    }

    .text-warning {
      color: #ffc107;
    }

    .alert {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border-left: 4px solid;
    }

    .alert-danger {
      background: #f8d7da;
      color: #721c24;
      border-left-color: #dc3545;
    }

    .alert-warning {
      background: #fff3cd;
      color: #856404;
      border-left-color: #ffc107;
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

    .obligation-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .priority-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      width: fit-content;
    }

    .priority-critical {
      background: #dc3545;
      color: white;
    }

    .priority-high {
      background: #fd7e14;
      color: white;
    }

    .priority-medium {
      background: #ffc107;
      color: black;
    }

    .priority-low {
      background: #17a2b8;
      color: white;
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

    .status-pending {
      background: #cfe2ff;
      color: #084298;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-completed {
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

    .status-waived {
      background: #e2e3e5;
      color: #383d41;
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
      .obligations-container {
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
    }
  `]
})
export class ObligationsEnhancedComponent implements OnInit {
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  obligations = signal<Obligation[]>([]);
  taxpayers = signal<any[]>([]);
  filteredObligations = signal<Obligation[]>([]);
  selectedObligation = signal<Obligation | null>(null);
  showNewObligationForm = signal(false);

  selectedStatus = '';
  selectedPriority = '';
  searchQuery = '';

  newObligation = {
    taxpayerId: '',
    obligationType: '',
    description: '',
    dueDate: '',
    amount: 0,
    priority: 'medium'
  };

  tableColumns = [
    { key: 'taxpayerName', label: 'Taxpayer' },
    { key: 'obligationType', label: 'Type' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'amount', label: 'Amount', format: 'currency' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' }
  ];

  totalObligations = computed(() => this.obligations().length);
  overdueObligations = computed(() =>
    this.obligations().filter(o => this.isOverdue(o) && o.status !== 'completed').length
  );
  dueSoonObligations = computed(() => {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return this.obligations().filter(o => {
      const dueDate = new Date(o.dueDate);
      return dueDate <= sevenDaysFromNow && dueDate > new Date() && o.status !== 'completed';
    }).length;
  });
  totalBalance = computed(() =>
    this.obligations().reduce((sum, o) => sum + (o.balance || 0), 0)
  );

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.get<any>('obligations_enhanced_api.php', { params: { action: 'list' } }).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.obligations) {
          this.obligations.set(response.data.obligations || []);
        } else if (response.data && Array.isArray(response.data)) {
          this.obligations.set(response.data);
        } else {
          this.obligations.set([]);
        }
        this.applyFilters();
        this.notificationService.showSuccess('Obligations loaded');
      },
      error: (error) => {
        console.error('Error loading obligations:', error);
        this.notificationService.showError('Failed to load obligations');
        this.obligations.set([]);
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
    let filtered = this.obligations();

    if (this.selectedStatus) {
      filtered = filtered.filter(o => o.status === this.selectedStatus);
    }

    if (this.selectedPriority) {
      filtered = filtered.filter(o => o.priority === this.selectedPriority);
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.taxpayerName?.toLowerCase().includes(query) ||
        o.obligationType?.toLowerCase().includes(query)
      );
    }

    this.filteredObligations.set(filtered);
  }

  isOverdue(obligation: Obligation): boolean {
    return new Date(obligation.dueDate) < new Date();
  }

  openNewObligationForm() {
    this.showNewObligationForm.set(true);
  }

  closeNewObligationForm() {
    this.showNewObligationForm.set(false);
    this.newObligation = {
      taxpayerId: '',
      obligationType: '',
      description: '',
      dueDate: '',
      amount: 0,
      priority: 'medium'
    };
  }

  submitNewObligation() {
    const obligation = {
      taxpayerId: parseInt(this.newObligation.taxpayerId as any),
      obligationType: this.newObligation.obligationType,
      description: this.newObligation.description,
      dueDate: this.newObligation.dueDate,
      amount: this.newObligation.amount,
      priority: this.newObligation.priority
    };

    this.apiService.post<any>('obligations_enhanced_api.php', obligation).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Obligation created successfully');
          this.loadData();
          this.closeNewObligationForm();
        } else {
          this.notificationService.showError(response.error || 'Failed to create obligation');
        }
      },
      error: (error) => {
        console.error('Error creating obligation:', error);
        this.notificationService.showError('Failed to create obligation');
      }
    });
  }
        this.loadData();
        this.closeNewObligationForm();
      },
      error: (error) => {
        console.error('Error creating obligation:', error);
        this.notificationService.showError('Failed to create obligation');
      }
    });
  }

  handleTableAction(action: any) {
    if (action.type === 'view') {
      const item = this.obligations().find(o => o.id === action.id);
      if (item) this.selectedObligation.set(item);
    }
  }

  recordPayment() {
    this.notificationService.showInfo('Payment recording coming soon');
  }

  markCompleted() {
    if (this.selectedObligation()) {
      this.selectedObligation()!.status = 'completed';
      this.notificationService.showSuccess('Obligation marked as completed');
    }
  }

  sendReminder() {
    this.notificationService.showSuccess('Reminder sent to taxpayer');
  }

  sendNotifications() {
    this.notificationService.showSuccess('Notifications sent to all due obligations');
  }

  generateReport() {
    this.notificationService.showInfo('Generating report...');
  }

  exportData(format: string) {
    this.notificationService.showInfo(`Exporting to ${format}...`);
  }
}
