import { Component, Input, Output, EventEmitter, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportService, ExportColumn } from '../../services/export.service';
import { NotificationService } from '../../core/services/notification.service';

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
    <div class="card-precision dashboard-content-precision overflow-hidden border border-default">
      <!-- High-Authority Toolbar -->
      <div class="table-toolbar-precision px-8 py-6 border-b border-default bg-surface-2 flex justify-between items-center gap-6">
        <div class="toolbar-left flex items-center gap-6">
          <div class="search-box-precision relative group">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary group-focus-within:text-accent transition-colors" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5"/>
            </svg>
            <input
              type="text"
              placeholder="Filter Registry..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              class="input-precision sm pl-10 w-[280px]">
          </div>

          <div class="filter-wrapper-precision relative">
            <select [(ngModel)]="selectedStatus" (change)="onFilter()" class="input-precision sm appearance-none pr-10">
              <option value="">Operational Status</option>
              <option value="completed">Verified</option>
              <option value="pending">Synchronizing</option>
              <option value="failed">Halted</option>
            </select>
            <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2"/></svg>
            </div>
          </div>
        </div>

        <div class="toolbar-right flex items-center gap-4">
          <button (click)="refreshData()" class="btn-precision btn-secondary-precision btn-sm px-3" title="Refresh Feed">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 5H15" stroke-width="2.5"/>
            </svg>
          </button>

          <div class="relative">
            <button (click)="showExportMenu.set(!showExportMenu())" class="btn-precision btn-secondary-precision btn-sm gap-2" [class.active-precision]="showExportMenu()">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2"/>
              </svg>
              <span>Export</span>
            </button>
            
            @if (showExportMenu()) {
              <div class="absolute right-0 top-full mt-2 z-50 bg-overlay backdrop-blur-xl border border-default rounded-2xl shadow-2xl p-2 min-w-[200px] animate-fade-in">
                <button (click)="exportTable('excel')" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover rounded-xl transition-all text-xs font-bold text-secondary">
                  <span class="text-success">📊</span> Excel Record
                </button>
                <button (click)="exportTable('pdf')" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover rounded-xl transition-all text-xs font-bold text-secondary">
                  <span class="text-danger">📄</span> PDF Document
                </button>
                <button (click)="exportTable('csv')" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover rounded-xl transition-all text-xs font-bold text-secondary">
                  <span class="text-info">📋</span> CSV Manifest
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- High-Precision Data Grid -->
      <div class="table-container-precision overflow-x-auto scrollbar-thin">
        <table class="table-precision w-full">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th [style.width]="col.width || 'auto'"
                    [class.sortable-precision]="col.sortable"
                    (click)="col.sortable && toggleSort(col.key)"
                    class="group">
                  <div class="flex items-center justify-between gap-4">
                    <span class="label-master uppercase tracking-[0.2em] font-black pointer-events-none">{{ col.label }}</span>
                    @if (col.sortable) {
                      <div class="sort-icon-precision opacity-20 group-hover:opacity-100 transition-opacity" [class.active-precision]="sortBy() === col.key">
                        @if (sortBy() === col.key && sortOrder() === 'desc') {
                          <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 4L4 1L7 4" stroke="var(--color-accent)" stroke-width="2"/></svg>
                        } @else {
                          <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1L4 4L7 1" stroke="currentColor" stroke-width="2"/></svg>
                        }
                      </div>
                    }
                  </div>
                </th>
              }
              @if (actions.length > 0) {
                <th style="width: 140px;" class="text-right">Actions</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of paginatedData(); track $index) {
              <tr class="hover-precision transition-all border-b border-default">
                @for (col of columns; track col.key) {
                  <td [style.width]="col.width || 'auto'">
                    <div [ngSwitch]="col.type">
                      <!-- Standard Text -->
                      <span *ngSwitchCase="'text'" class="text-primary font-medium text-sm leading-none block">
                        {{ row[col.key] }}
                      </span>

                      <!-- Financial Intensity -->
                      <span *ngSwitchCase="'currency'" class="text-primary font-black text-sm tabular-nums tracking-tight">
                        {{ row[col.key] | currency:'KES ':'code':'1.0-0' }}
                      </span>

                      <!-- Chronological Identity -->
                      <div *ngSwitchCase="'date'" class="date-identity">
                        <span class="text-secondary font-bold text-[12px] block">{{ row[col.key] | date:'dd MMM yyyy' }}</span>
                        <span class="text-tertiary font-black text-[9px] uppercase tracking-widest block">{{ row[col.key] | date:'HH:mm' }}</span>
                      </div>

                      <!-- Operational Status -->
                      <div *ngSwitchCase="'status'">
                        <span class="badge-precision" [class]="getStatusClass(row[col.key])">
                          {{ row[col.key] }}
                        </span>
                      </div>

                      <!-- Mathematical units -->
                      <span *ngSwitchCase="'number'" class="text-tertiary font-black text-sm tabular-nums">
                        {{ row[col.key] | number:'1.0-0' }}
                      </span>
                    </div>
                  </td>
                }

                <!-- Reactive Actions -->
                @if (actions.length > 0) {
                  <td class="text-right">
                    <div class="flex justify-end gap-2">
                      @for (action of actions; track action.label) {
                        <button (click)="onAction(action.action, row)" 
                                class="btn-precision btn-secondary-precision btn-sm px-2 border-default hover:border-accent/50" 
                                [title]="action.label">
                          <span class="text-xs">{{ action.icon }}</span>
                        </button>
                      }
                    </div>
                  </td>
                }
              </tr>
            }

            <!-- Null State Matrix -->
            @if (filteredData().length === 0) {
              <tr>
                <td [attr.colspan]="columns.length + (actions.length > 0 ? 1 : 0)" class="py-32">
                  <div class="null-state-precision text-center max-w-sm mx-auto">
                    <div class="icon-orb-precision w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center mx-auto mb-6 border border-default">
                      <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-tertiary"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" stroke-width="1.5"/></svg>
                    </div>
                    <h3 class="text-primary font-bold text-lg mb-2">No Records Localized</h3>
                    <p class="text-tertiary text-xs font-medium">{{ searchQuery ? 'Your search query yielded zero operational matches.' : 'Registry pipeline currently contains no synchronized data.' }}</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Tactical Pagination Shell -->
      @if (totalPages() > 1) {
        <div class="pagination-shell-precision px-8 py-6 border-t border-default flex justify-between items-center bg-surface-2">
          <div class="pagination-telemetry">
            <span class="text-[10px] uppercase font-black tracking-widest text-tertiary">Telemetry: </span>
            <span class="text-secondary font-bold text-xs">{{ startIndex() + 1 }} - {{ endIndex() }} of {{ filteredData().length }} Units</span>
          </div>
          
          <div class="pagination-controls-precision flex items-center gap-2">
            <button [disabled]="currentPage() === 1" (click)="previousPage()" class="btn-precision btn-secondary-precision btn-sm px-4 disabled:opacity-20 transition-all">
              Prev Transmission
            </button>
            <div class="page-indicator-precision px-6 py-2 bg-app border border-default rounded-xl">
               <span class="text-primary font-black text-xs">Phase {{ currentPage() }} <span class="text-tertiary">/ {{ totalPages() }}</span></span>
            </div>
            <button [disabled]="currentPage() === totalPages()" (click)="nextPage()" class="btn-precision btn-secondary-precision btn-sm px-4 disabled:opacity-20 transition-all">
              Next Transmission
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .scrollbar-thin::-webkit-scrollbar { width: 4px; height: 4px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #DA3832; }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
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
          this.exportService.exportToExcel(this.filteredData(), { columns: exportColumns, filename: `data_${Date.now()}.csv` });
          this.notificationService.showSuccess('Exported to Excel successfully');
          break;
        case 'pdf':
          this.exportService.exportToPDF(this.filteredData(), { columns: exportColumns, filename: `data_${Date.now()}.pdf` });
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
