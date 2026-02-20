import { Component, Input, Output, EventEmitter, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportService, ExportColumn } from '../services/export.service';
import { NotificationService } from '../services/notification.service';

export interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'currency' | 'date' | 'status' | 'number';
  sortable: boolean;
  filterable: boolean;
  exportable: boolean;
  width?: string;
}

export interface TableAction {
  label: string;
  icon: string;
  action: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-table-wrapper">
      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <div class="search-box">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              class="search-input">
          </div>

          <select [(ngModel)]="selectedStatus" (change)="onFilter()" class="filter-select">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div class="toolbar-right">
          <button class="icon-btn" (click)="refreshData()" title="Refresh">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 5H15" stroke-width="2.5"/>
            </svg>
          </button>

          <button class="icon-btn export-btn" [class.expanded]="showExportMenu()">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2.2"/>
            </svg>
            <div class="export-menu" *ngIf="showExportMenu()">
              <button (click)="exportTable('excel')" class="export-option">
                <span>📊</span> Export to Excel
              </button>
              <button (click)="exportTable('pdf')" class="export-option">
                <span>📄</span> Export to PDF
              </button>
              <button (click)="exportTable('csv')" class="export-option">
                <span>📋</span> Export to CSV
              </button>
              <button (click)="exportTable('json')" class="export-option">
                <span>{ }</span> Export to JSON
              </button>
            </div>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th *ngFor="let col of columns"
                  [style.width]="col.width || 'auto'"
                  [class.sortable]="col.sortable"
                  (click)="col.sortable && toggleSort(col.key)">
                <div class="th-content">
                  <span>{{ col.label }}</span>
                  <span *ngIf="col.sortable" class="sort-indicator"
                        [class.active]="sortBy() === col.key">
                    {{ sortOrder() === 'asc' ? '▲' : '▼' }}
                  </span>
                </div>
              </th>
              <th *ngIf="actions.length > 0" style="width: 120px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of filteredData()" class="table-row-hover">
              <td *ngFor="let col of columns" [style.width]="col.width || 'auto'">
                <div [ngSwitch]="col.type">
                  <!-- Text -->
                  <span *ngSwitchCase="'text'" class="cell-value">
                    {{ row[col.key] }}
                  </span>

                  <!-- Currency -->
                  <span *ngSwitchCase="'currency'" class="cell-value currency">
                    {{ row[col.key] | currency:'KES ':'symbol':'1.0-2' }}
                  </span>

                  <!-- Date -->
                  <span *ngSwitchCase="'date'" class="cell-value date">
                    {{ row[col.key] | date:'short' }}
                  </span>

                  <!-- Status -->
                  <span *ngSwitchCase="'status'"
                        class="status-badge"
                        [class]="getStatusClass(row[col.key])">
                    {{ row[col.key] }}
                  </span>

                  <!-- Number -->
                  <span *ngSwitchCase="'number'" class="cell-value number">
                    {{ row[col.key] | number:'1.0-2' }}
                  </span>
                </div>
              </td>

              <!-- Actions -->
              <td *ngIf="actions.length > 0" class="actions-cell">
                <div class="action-buttons">
                  <button *ngFor="let action of actions"
                          class="action-btn"
                          [class]="'action-' + action.color"
                          (click)="onAction(action.action, row)"
                          [title]="action.label">
                    {{ action.icon }}
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr *ngIf="filteredData().length === 0" class="empty-state">
              <td [attr.colspan]="columns.length + (actions.length > 0 ? 1 : 0)">
                <div class="empty-message">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" stroke-width="2"/>
                  </svg>
                  <p>{{ searchQuery ? 'No results found' : 'No data available' }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="table-footer" *ngIf="totalPages() > 1">
        <div class="pagination-info">
          Showing {{ startIndex() + 1 }} to {{ endIndex() }} of {{ filteredData().length }} entries
        </div>
        <div class="pagination">
          <button [disabled]="currentPage() === 1" (click)="previousPage()" class="pagination-btn">
            Previous
          </button>
          <span class="page-info">
            Page {{ currentPage() }} of {{ totalPages() }}
          </span>
          <button [disabled]="currentPage() === totalPages()" (click)="nextPage()" class="pagination-btn">
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-table-wrapper {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    /* Toolbar */
    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
      background: #f9fafb;
      gap: 12px;
    }

    .toolbar-left,
    .toolbar-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box svg {
      position: absolute;
      left: 12px;
      color: #9ca3af;
      pointer-events: none;
    }

    .search-input {
      padding: 8px 12px 8px 36px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      width: 250px;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
      background: #f8f9ff;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      background: white;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .filter-select:focus {
      outline: none;
      border-color: #667eea;
    }

    .icon-btn {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: #6b7280;
      border-radius: 6px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-btn:hover {
      background: #e5e7eb;
      color: #1f2937;
    }

    .icon-btn.export-btn {
      position: relative;
    }

    .export-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      z-index: 100;
      min-width: 160px;
      margin-top: 8px;
      overflow: hidden;
    }

    .export-option {
      width: 100%;
      padding: 10px 16px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      color: #374151;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .export-option:hover {
      background: #f3f4f6;
      color: #667eea;
    }

    /* Table */
    .table-container {
      overflow-x: auto;
    }

    .modern-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .modern-table thead th {
      background: #f9fafb;
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: #1f2937;
      border-bottom: 2px solid #e5e7eb;
      user-select: none;
    }

    .modern-table th.sortable {
      cursor: pointer;
      transition: background 0.2s;
    }

    .modern-table th.sortable:hover {
      background: #f3f4f6;
    }

    .th-content {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: space-between;
    }

    .sort-indicator {
      font-size: 12px;
      color: #d1d5db;
      transition: color 0.2s;
    }

    .sort-indicator.active {
      color: #667eea;
      font-weight: bold;
    }

    .modern-table tbody td {
      padding: 14px 16px;
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
    }

    .table-row-hover:hover {
      background: #f9fafb;
    }

    .cell-value {
      display: block;
    }

    .cell-value.currency {
      font-weight: 600;
      color: #059669;
    }

    .cell-value.date {
      color: #6b7280;
      font-size: 13px;
    }

    .cell-value.number {
      text-align: right;
      font-family: 'Monaco', 'Menlo', monospace;
    }

    /* Status Badge */
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 12px;
    }

    .status-badge.completed {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.failed {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge.cancelled {
      background: #f3f4f6;
      color: #374151;
    }

    /* Actions */
    .actions-cell {
      text-align: center;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .action-btn {
      background: none;
      border: none;
      padding: 6px 10px;
      cursor: pointer;
      font-size: 16px;
      border-radius: 4px;
      transition: all 0.2s;
      opacity: 0.7;
    }

    .action-btn:hover {
      opacity: 1;
      background: #f3f4f6;
    }

    /* Empty State */
    .empty-state {
      background: #f9fafb;
    }

    .empty-message {
      padding: 48px 20px;
      text-align: center;
      color: #9ca3af;
    }

    .empty-message svg {
      opacity: 0.5;
      margin-bottom: 16px;
    }

    .empty-message p {
      margin: 0;
      font-size: 16px;
    }

    /* Footer */
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-top: 1px solid #e5e7eb;
      background: #f9fafb;
      font-size: 13px;
      color: #6b7280;
    }

    .pagination-info {
      flex: 1;
    }

    .pagination {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .pagination-btn {
      padding: 6px 12px;
      border: 1px solid #d1d5db;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }

    .pagination-btn:hover:not(:disabled) {
      border-color: #667eea;
      color: #667eea;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      min-width: 120px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .table-toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .toolbar-left,
      .toolbar-right {
        width: 100%;
      }

      .search-input {
        width: 100%;
      }

      .modern-table {
        font-size: 12px;
      }

      .modern-table thead th,
      .modern-table tbody td {
        padding: 8px 12px;
      }

      .table-footer {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Output() actionTriggered = new EventEmitter<{action: string; row: any}>();

  private exportService = inject(ExportService);
  private notificationService = inject(NotificationService);

  searchQuery = '';
  selectedStatus = '';
  showExportMenu = signal(false);
  sortBy = signal('');
  sortOrder = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  pageSize = signal(10);

  filteredData = computed(() => {
    let result = [...this.data];

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    // Status filter
    if (this.selectedStatus) {
      result = result.filter(row => row.status === this.selectedStatus);
    }

    // Sorting
    if (this.sortBy()) {
      result.sort((a, b) => {
        const aVal = a[this.sortBy()];
        const bVal = b[this.sortBy()];

        if (aVal == null || bVal == null) return 0;
        if (aVal < bVal) return this.sortOrder() === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortOrder() === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  totalPages = computed(() => Math.ceil(this.filteredData().length / this.pageSize()));

  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());
  endIndex = computed(() => Math.min(this.currentPage() * this.pageSize(), this.filteredData().length));

  paginatedData = computed(() =>
    this.filteredData().slice(this.startIndex(), this.endIndex())
  );

  onSearch(): void {
    this.currentPage.set(1);
  }

  onFilter(): void {
    this.currentPage.set(1);
  }

  toggleSort(columnKey: string): void {
    if (this.sortBy() === columnKey) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(columnKey);
      this.sortOrder.set('asc');
    }
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

  getStatusClass(status: string): string {
    return status?.toLowerCase() || '';
  }

  onAction(action: string, row: any): void {
    this.actionTriggered.emit({action, row});
  }

  exportTable(format: 'excel' | 'pdf' | 'csv' | 'json'): void {
    const exportColumns: ExportColumn[] = this.columns.map(col => ({
      key: col.key,
      label: col.label,
      format: col.type as any
    }));

    try {
      switch (format) {
        case 'excel':
          this.exportService.exportToExcel(this.filteredData(), exportColumns, `data_${Date.now()}`);
          this.notificationService.showSuccess('Exported to Excel successfully');
          break;
        case 'pdf':
          this.exportService.exportToPDF(this.filteredData(), exportColumns, `data_${Date.now()}`);
          this.notificationService.showSuccess('Exported to PDF successfully');
          break;
        case 'csv':
          const csv = this.exportService.convertToCSV(this.filteredData(), exportColumns);
          this.downloadFile(csv, `data_${Date.now()}.csv`, 'text/csv');
          this.notificationService.showSuccess('Exported to CSV successfully');
          break;
        case 'json':
          const json = JSON.stringify(this.filteredData(), null, 2);
          this.downloadFile(json, `data_${Date.now()}.json`, 'application/json');
          this.notificationService.showSuccess('Exported to JSON successfully');
          break;
      }
    } catch (error: any) {
      this.notificationService.showError('Export failed: ' + error.message);
    }

    this.showExportMenu.set(false);
  }

  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], {type});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  refreshData(): void {
    this.currentPage.set(1);
    this.notificationService.showInfo('Data refreshed');
  }
}
