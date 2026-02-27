import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService, AuditLog } from '../../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container animate-up">
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">System <span class="gradient-text">Audit Log</span></h1>
          <p class="premium-subtitle">Traceability and security monitoring for all administrative actions</p>
        </div>
        <div class="header-actions">
           <div class="search-box mr-12">
             <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()" placeholder="Search logs..." class="premium-input">
             <button class="search-btn" (click)="search()">
               <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </button>
           </div>
           <button class="btn-premium-outline" (click)="loadData()">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
             Refresh
           </button>
        </div>
      </header>

      <div *ngIf="loading()" class="loading-state flex flex-col items-center justify-center p-12">
        <div class="spin"></div>
        <p class="mt-4 text-muted" style="color: var(--text-muted); margin-top: 1rem;">Retrieving audit trails...</p>
      </div>

      <div *ngIf="error()" class="error-banner">
        {{ error() }}
      </div>

      <div *ngIf="!loading() && !error()" class="content-card-premium table-responsive-elite glassmorphism">
        <table class="elite-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Module / Action</th>
              <th>IP Address</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            @for (log of logs(); track log.id) {
              <tr class="hover-row">
                <td class="px-16 py-12">
                  <div class="font-black text-main">{{ log.timestamp | date:'shortDate' }}</div>
                  <div class="text-[10px] text-muted font-mono">{{ log.timestamp | date:'HH:mm:ss' }}</div>
                </td>
                <td class="px-16 py-12">
                  <div class="flex items-center gap-3">
                    <div class="avatar-mini bg-blue-soft text-blue font-black">{{ log.user.substring(0, 2).toUpperCase() }}</div>
                    <span class="text-xs font-bold text-main">{{ log.user }}</span>
                  </div>
                </td>
                <td class="px-16 py-12">
                  <span class="badge badge-slate mb-4 block w-fit">{{ log.module }}</span>
                  <span class="text-xs font-black uppercase tracking-wider" [class]="getActionColor(log.action)">
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-16 py-12 text-xs font-mono text-muted">{{ log.ip }}</td>
                <td class="px-16 py-12">
                  <p class="text-[11px] text-secondary max-w-sm" [title]="log.details">
                    {{ log.details }}
                  </p>
                </td>
              </tr>
            }
            <tr *ngIf="logs().length === 0">
              <td colspan="5" class="text-center p-12 text-muted">No audit trails found in this sector.</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="pagination flex justify-between items-center mt-6 pt-4 border-t border-gray-100" *ngIf="totalPages() > 1">
          <div class="text-sm text-muted font-bold">
             Page {{ currentPage() }} of {{ totalPages() }} ({{ totalCount() }} actions)
          </div>
          <div class="flex gap-2">
            <button class="page-btn" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button class="page-btn" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .glassmorphism {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    }
    
    .mr-12 { margin-right: 12px; }
    .mb-4 { margin-bottom: 4px; }
    .px-16 { padding-left: 16px; padding-right: 16px; }
    .py-12 { padding-top: 12px; padding-bottom: 12px; }

    .search-box { display: flex; align-items: center; background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 4px; }
    .premium-input { border: none; background: transparent; padding: 8px 16px; outline: none; width: 220px; color: #1E293B; font-size: 0.85rem; }
    .search-btn { background: #E2E8F0; color: #64748B; border: none; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
    .search-btn:hover { background: #EF4444; color: white; }

    .elite-table { width: 100%; border-collapse: collapse; }
    .elite-table th { text-align: left; padding: 12px 16px; font-size: 0.75rem; font-weight: 900; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; }
    .elite-table tr.hover-row { border-bottom: 1px solid #F1F5F9; transition: background 0.2s; }
    .elite-table tr.hover-row:hover { background: rgba(241, 245, 249, 0.5); }

    .avatar-mini { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; }
    .bg-blue-soft { background: rgba(59, 130, 246, 0.1); }
    .text-blue { color: #2563EB; }

    .badge { padding: 3px 8px; border-radius: 6px; font-size: 0.6rem; font-weight: 950; text-transform: uppercase; }
    .badge-slate { background: #F1F5F9; color: #64748B; }

    .text-success { color: #10B981; }
    .text-warning { color: #F59E0B; }
    .text-error { color: #EF4444; }
    .text-info { color: #3B82F6; }

    .pagination { padding: 1.5rem 0; }
    .page-btn { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #E2E8F0; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; transition: 0.2s; }
    .page-btn:hover:not(:disabled) { border-color: #EF4444; color: #EF4444; }
    .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    .spin { width: 40px; height: 40px; border: 4px solid var(--border-color); border-top-color: var(--kra-red); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AuditLogComponent implements OnInit {
  private auditService = inject(AuditLogService);

  logs = signal<AuditLog[]>([]);
  loading = signal(true);
  error = signal('');
  
  currentPage = signal(1);
  totalPages = signal(1);
  totalCount = signal(0);
  searchQuery = '';
  pageSize = 15;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set('');
    
    this.auditService.getLogs(this.currentPage(), this.pageSize, this.searchQuery).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          this.logs.set(res.data.logs);
          this.currentPage.set(res.data.pagination.page);
          this.totalPages.set(res.data.pagination.pages);
          this.totalCount.set(res.data.pagination.total);
        } else {
          this.error.set(res.error || 'Failed to sync with Audit Nexus.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Terminal comms failure: Audit stream disconnected.');
        this.loading.set(false);
      }
    });
  }

  search() {
    this.currentPage.set(1);
    this.loadData();
  }

  loadPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadData();
    }
  }

  getActionColor(action: string) {
    if (!action) return 'text-info';
    const act = action.toUpperCase();
    if (act.includes('SUCCESS') || act.includes('RESOLVE') || act.includes('CREATE')) return 'text-success';
    if (act.includes('UPDATE') || act.includes('CHANGE') || act.includes('IMPORT')) return 'text-warning';
    if (act.includes('ERROR') || act.includes('FAIL') || act.includes('DELETE')) return 'text-error';
    return 'text-info';
  }
}
