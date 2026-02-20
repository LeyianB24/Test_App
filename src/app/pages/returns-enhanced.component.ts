import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';
import { DataTableComponent } from '../components/simple-data-table/simple-data-table.component';

export interface ReturnItem {
  id?: number;
  taxpayerId: number;
  taxpayerName: string;
  taxpayerPin: string;
  returnPeriod: string;
  returnType: string;
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  taxPayable: number;
  taxPaid: number;
  balance: number;
  status: string;
  submittedDate?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-returns-enhanced',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTableComponent],
  template: `
    <div class="returns-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>📋 Tax Returns Management</h1>
          <p>View, submit, and manage tax returns</p>
        </div>
        <button class="btn-primary" (click)="openNewReturnForm()">
          ➕ New Return
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Total Returns</h3>
            <p class="stat-value">{{ totalReturns() }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Submitted</h3>
            <p class="stat-value">{{ submittedReturns() }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <h3>Draft</h3>
            <p class="stat-value">{{ draftReturns() }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Total Tax Payable</h3>
            <p class="stat-value">{{ (totalTaxPayable() | number: '1.2-2') }}</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Filter by Status:</label>
          <select [(ngModel)]="selectedStatus" (change)="applyFilters()">
            <option value="">All Returns</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="amended">Amended</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Filter by Period:</label>
          <select [(ngModel)]="selectedPeriod" (change)="applyFilters()">
            <option value="">All Periods</option>
            <option value="2024-01">Jan 2024</option>
            <option value="2024-02">Feb 2024</option>
            <option value="2024-Q1">Q1 2024</option>
            <option value="2024-Q2">Q2 2024</option>
            <option value="2024-Q3">Q3 2024</option>
            <option value="2024-Q4">Q4 2024</option>
            <option value="2024">Annual 2024</option>
          </select>
        </div>
        <div class="filter-group">
          <input type="text" placeholder="Search by taxpayer name or PIN..."
                 [(ngModel)]="searchQuery" (input)="applyFilters()" class="search-input">
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-secondary" (click)="exportData('excel')">📥 Export Excel</button>
        <button class="btn-secondary" (click)="exportData('pdf')">📥 Export PDF</button>
        <button class="btn-secondary" (click)="loadData()">🔄 Refresh</button>
      </div>

      <!-- Data Table -->
      <div class="data-table-wrapper">
        <app-simple-data-table
          [data]="filteredReturns()"
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

      <!-- New Return Form Modal -->
      <div *ngIf="showNewReturnForm()" class="modal-overlay" (click)="closeNewReturnForm()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>New Tax Return</h2>
            <button class="close-btn" (click)="closeNewReturnForm()">✕</button>
          </div>

          <form [formGroup]="newReturnForm" class="form">
            <div class="form-group">
              <label>Taxpayer *</label>
              <select formControlName="taxpayerId" required>
                <option value="">Select Taxpayer</option>
                <option *ngFor="let taxpayer of taxpayers()" [value]="taxpayer.id">
                  {{ taxpayer.name }} ({{ taxpayer.pin }})
                </option>
              </select>
              <span class="error" *ngIf="newReturnForm.get('taxpayerId')?.hasError('required') && newReturnForm.get('taxpayerId')?.touched">
                Taxpayer is required
              </span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Return Period *</label>
                <input type="month" formControlName="returnPeriod" required>
              </div>
              <div class="form-group">
                <label>Return Type *</label>
                <select formControlName="returnType" required>
                  <option value="">Select Type</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Gross Income *</label>
                <input type="number" formControlName="grossIncome" required min="0">
              </div>
              <div class="form-group">
                <label>Deductions *</label>
                <input type="number" formControlName="deductions" required min="0">
              </div>
            </div>

            <div class="calculated-group">
              <div class="calc-item">
                <span>Taxable Income:</span>
                <span class="value">{{ (taxableIncome() | number: '1.2-2') }}</span>
              </div>
              <div class="calc-item">
                <span>Tax Payable (30%):</span>
                <span class="value">{{ (taxPayable() | number: '1.2-2') }}</span>
              </div>
            </div>

            <div class="form-group">
              <label>Tax Paid *</label>
              <input type="number" formControlName="taxPaid" required min="0">
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="closeNewReturnForm()">Cancel</button>
              <button type="submit" class="btn-primary" (click)="submitNewReturn()" [disabled]="!newReturnForm.valid">
                Submit Return
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Return Details Modal -->
      <div *ngIf="selectedReturn()" class="modal-overlay" (click)="selectedReturn.set(null)">
        <div class="modal-content details-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Return Details</h2>
            <button class="close-btn" (click)="selectedReturn.set(null)">✕</button>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <label>Taxpayer</label>
              <p>{{ selectedReturn()?.taxpayerName }}</p>
            </div>
            <div class="detail-item">
              <label>PIN</label>
              <p class="font-mono">{{ selectedReturn()?.taxpayerPin }}</p>
            </div>
            <div class="detail-item">
              <label>Return Period</label>
              <p>{{ selectedReturn()?.returnPeriod }}</p>
            </div>
            <div class="detail-item">
              <label>Return Type</label>
              <p>{{ selectedReturn()?.returnType }}</p>
            </div>
            <div class="detail-item">
              <label>Gross Income</label>
              <p>{{ (selectedReturn()?.grossIncome | number: '1.2-2') }}</p>
            </div>
            <div class="detail-item">
              <label>Deductions</label>
              <p>{{ (selectedReturn()?.deductions | number: '1.2-2') }}</p>
            </div>
            <div class="detail-item">
              <label>Taxable Income</label>
              <p>{{ (selectedReturn()?.taxableIncome | number: '1.2-2') }}</p>
            </div>
            <div class="detail-item">
              <label>Tax Payable</label>
              <p>{{ (selectedReturn()?.taxPayable | number: '1.2-2') }}</p>
            </div>
            <div class="detail-item">
              <label>Tax Paid</label>
              <p>{{ (selectedReturn()?.taxPaid | number: '1.2-2') }}</p>
            </div>
            <div class="detail-item">
              <label>Balance</label>
              <p [ngClass]="{'text-danger': (selectedReturn()?.balance ?? 0) > 0}">
                {{ (selectedReturn()?.balance | number: '1.2-2') }}
              </p>
            </div>
            <div class="detail-item">
              <label>Status</label>
              <p><span [ngClass]="'status-' + (selectedReturn()?.status || '')">
                {{ selectedReturn()?.status | uppercase }}
              </span></p>
            </div>
            <div class="detail-item">
              <label>Submitted Date</label>
              <p>{{ selectedReturn()?.submittedDate || 'Not submitted' }}</p>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-secondary" (click)="amendReturn()">📝 Amend</button>
            <button class="btn-secondary" (click)="downloadReceipt()">📥 Download Receipt</button>
            <button class="btn-secondary" (click)="selectedReturn.set(null)">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .returns-container {
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
    .form-group select {
      padding: 0.75rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 0.95rem;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .error {
      color: #dc3545;
      font-size: 0.85rem;
    }

    .calculated-group {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 6px;
    }

    .calc-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .calc-item .value {
      color: #007bff;
      font-weight: bold;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
      border-top: 1px solid #f0f0f0;
      padding-top: 1rem;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .detail-item {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
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

    .status-draft {
      background: #fff3cd;
      color: #856404;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-submitted {
      background: #cfe2ff;
      color: #084298;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-accepted {
      background: #d1e7dd;
      color: #0f5132;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-rejected {
      background: #f8d7da;
      color: #842029;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .text-danger {
      color: #dc3545;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      border-top: 1px solid #f0f0f0;
      padding-top: 1rem;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .returns-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }

      .modal-content {
        width: 95%;
        padding: 1.5rem;
      }
    }
  `]
})
export class ReturnsEnhancedComponent implements OnInit {
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  returns = signal<ReturnItem[]>([]);
  taxpayers = signal<any[]>([]);
  filteredReturns = signal<ReturnItem[]>([]);
  selectedReturn = signal<ReturnItem | null>(null);
  showNewReturnForm = signal(false);

  selectedStatus = '';
  selectedPeriod = '';
  searchQuery = '';

  tableColumns = [
    { key: 'taxpayerName', label: 'Taxpayer' },
    { key: 'returnPeriod', label: 'Period' },
    { key: 'returnType', label: 'Type' },
    { key: 'taxableIncome', label: 'Taxable Income', format: 'currency' },
    { key: 'taxPayable', label: 'Tax Payable', format: 'currency' },
    { key: 'status', label: 'Status' }
  ];

  newReturnForm = this.fb.group({
    taxpayerId: ['', Validators.required],
    returnPeriod: ['', Validators.required],
    returnType: ['', Validators.required],
    grossIncome: ['', [Validators.required, Validators.min(0)]],
    deductions: ['', [Validators.required, Validators.min(0)]],
    taxPaid: ['', [Validators.required, Validators.min(0)]]
  });

  totalReturns = computed(() => this.returns().length);
  submittedReturns = computed(() => this.returns().filter(r => r.status === 'submitted').length);
  draftReturns = computed(() => this.returns().filter(r => r.status === 'draft').length);
  totalTaxPayable = computed(() => this.returns().reduce((sum, r) => sum + (r.taxPayable || 0), 0));

  taxableIncome = computed(() => {
    const gross = this.newReturnForm.get('grossIncome')?.value || 0;
    const deductions = this.newReturnForm.get('deductions')?.value || 0;
    return Math.max(0, gross - deductions);
  });

  taxPayable = computed(() => this.taxableIncome() * 0.30);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load returns from enhanced API
    this.apiService.get<any>('returns_enhanced_api.php', { params: { action: 'list' } }).subscribe({
      next: (response) => {
        if (response.success && response.data && response.data.obligations) {
          this.returns.set(response.data.obligations || []);
        } else if (response.data && Array.isArray(response.data)) {
          this.returns.set(response.data);
        } else {
          this.returns.set([]);
        }
        this.applyFilters();
        this.notificationService.showSuccess('Returns loaded successfully');
      },
      error: (error) => {
        console.error('Error loading returns:', error);
        this.notificationService.showError('Failed to load returns');
        // Fallback to empty array
        this.returns.set([]);
      }
    });

    // Load taxpayers
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
    let filtered = this.returns();

    if (this.selectedStatus) {
      filtered = filtered.filter(r => r.status === this.selectedStatus);
    }

    if (this.selectedPeriod) {
      filtered = filtered.filter(r => r.returnPeriod?.startsWith(this.selectedPeriod));
    }

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.taxpayerName?.toLowerCase().includes(query) ||
        r.taxpayerPin?.toLowerCase().includes(query)
      );
    }

    this.filteredReturns.set(filtered);
  }

  openNewReturnForm() {
    this.showNewReturnForm.set(true);
  }

  closeNewReturnForm() {
    this.showNewReturnForm.set(false);
    this.newReturnForm.reset();
  }

  submitNewReturn() {
    if (this.newReturnForm.invalid) {
      this.notificationService.showError('Please fill all required fields');
      return;
    }

    const formValue = this.newReturnForm.value;
    const newReturn = {
      taxpayerId: parseInt(formValue.taxpayerId || '0'),
      returnPeriod: formValue.returnPeriod || '',
      returnType: formValue.returnType || '',
      grossIncome: parseFloat(formValue.grossIncome || '0'),
      deductions: parseFloat(formValue.deductions || '0'),
      taxPaid: parseFloat(formValue.taxPaid || '0')
    };

    this.apiService.post<any>('returns_enhanced_api.php', newReturn).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showSuccess('Return submitted successfully');
          this.loadData();
          this.closeNewReturnForm();
        } else {
          this.notificationService.showError(response.error || 'Failed to submit return');
        }
      },
      error: (error) => {
        console.error('Error submitting return:', error);
        this.notificationService.showError('Failed to submit return');
      }
    });
  }

  handleTableAction(action: any) {
    if (action.type === 'view') {
      const item = this.returns().find(r => r.id === action.id);
      if (item) this.selectedReturn.set(item);
    }
  }

  amendReturn() {
    this.notificationService.showInfo('Amend feature coming soon');
  }

  downloadReceipt() {
    this.notificationService.showSuccess('Receipt downloaded');
  }

  exportData(format: string) {
    this.notificationService.showInfo(`Exporting to ${format}...`);
  }
}
