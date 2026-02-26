import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminClientsService, ClientData } from '../services/admin-clients.service';

@Component({
  selector: 'app-admin-clients',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-up">
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Taxpayer <span class="gradient-text">Directory</span></h1>
          <p class="premium-subtitle">Manage client accounts, compliance status, and system access</p>
        </div>
        <div class="header-actions">
           <div class="search-box">
             <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()" placeholder="Search PIN, Name, Email..." class="premium-input">
             <button class="search-btn" (click)="search()">
               <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </button>
           </div>
        </div>
      </header>

      <div *ngIf="loading()" class="loading-state flex flex-col items-center justify-center p-12">
        <div class="spin"></div>
        <p class="mt-4 text-muted" style="color: var(--text-muted); margin-top: 1rem;">Loading directory...</p>
      </div>

      <div *ngIf="error()" class="error-banner">
        {{ error() }}
      </div>

      <div *ngIf="!loading() && !error()" class="content-card-premium table-responsive-elite">
        <table class="elite-table">
          <thead>
            <tr>
              <th>ID / Taxpayer PIN</th>
              <th>Name & Contact</th>
              <th>Type / Station</th>
              <th>Registration</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of clients()">
              <td>
                <span class="font-bold text-main block">{{ client.taxpayer_id }}</span>
                <span class="text-xs text-muted">ID: {{ client.id }}</span>
              </td>
              <td>
                <span class="font-bold text-main block">{{ client.name }}</span>
                <span class="text-xs text-muted block">{{ client.email }}</span>
                <span class="text-xs text-muted" *ngIf="client.phone">{{ client.phone }}</span>
              </td>
              <td>
                <span class="badge" [class.badge-blue]="client.type === 'individual'" [class.badge-purple]="client.type === 'business'">{{ client.type | uppercase }}</span>
                <span class="text-xs text-muted block mt-1">{{ client.station || 'Unassigned' }}</span>
              </td>
              <td>
                <span class="text-sm">{{ client.registration_date | date:'mediumDate' }}</span>
              </td>
              <td>
                <span class="text-sm" *ngIf="client.last_login">{{ client.last_login | date:'mediumDate' }}</span>
                <span class="text-sm text-muted" *ngIf="!client.last_login">Never</span>
              </td>
              <td>
                <button class="icon-btn" title="View Details">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="clients().length === 0">
              <td colspan="6" class="text-center p-8 text-muted">No clients found matching criteria</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="pagination flex justify-between items-center mt-6 pt-4 border-t border-gray-100" *ngIf="totalPages() > 1">
          <div class="text-sm text-muted">
             Showing page {{ currentPage() }} of {{ totalPages() }} ({{ totalCount() }} total)
          </div>
          <div class="flex gap-2">
            <button class="page-btn" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">Prev</button>
            <button class="page-btn" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spin { width: 40px; height: 40px; border: 4px solid var(--border-color); border-top-color: var(--kra-red); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 60px; }
    .error-banner { background: #FEE2E2; border: 1px solid #FECACA; color: #DC2626; padding: 16px; border-radius: 8px; margin-top: 16px; font-weight: 600; }
    .content-card-premium { background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); padding: 24px; margin-top: 24px; }
    
    .search-box { display: flex; align-items: center; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; padding: 4px; }
    .premium-input { border: none; background: transparent; padding: 8px 16px; outline: none; width: 250px; color: var(--text-main); font-size: 0.9rem; }
    .search-btn { background: var(--kra-red); color: white; border: none; border-radius: 8px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
    .search-btn:hover { opacity: 0.9; }
    
    .elite-table { width: 100%; border-collapse: collapse; }
    .elite-table th { text-align: left; padding: 16px; border-bottom: 2px solid var(--border-light); font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
    .elite-table td { padding: 16px; border-bottom: 1px solid var(--border-light); vertical-align: middle; }
    .elite-table tbody tr:hover { background: var(--bg-hover); }
    .font-bold { font-weight: 700; }
    .text-main { color: var(--text-main); }
    .text-muted { color: var(--text-muted); }
    .text-xs { font-size: 0.75rem; }
    .text-sm { font-size: 0.85rem; }
    .block { display: block; }
    .mt-1 { margin-top: 4px; }
    
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; }
    .badge-blue { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
    .badge-purple { background: rgba(139, 92, 246, 0.1); color: #7C3AED; }
    
    .icon-btn { background: var(--bg-hover); border: none; width: 32px; height: 32px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: 0.2s; }
    .icon-btn:hover { background: var(--kra-red); color: white; }
    
    .pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-light); }
    .flex { display: flex; }
    .gap-2 { gap: 8px; }
    .page-btn { padding: 8px 16px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-main); font-weight: 600; border-radius: 8px; cursor: pointer; transition: 0.2s; font-size: 0.85rem; }
    .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 768px) {
      .premium-input { width: 100%; }
      .search-box { width: 100%; }
      .content-card-premium { padding: 16px; }
      .elite-table th, .elite-table td { padding: 12px; }
    }
  `]
})
export class AdminClientsComponent implements OnInit {
  private clientsService = inject(AdminClientsService);

  loading = signal(true);
  error = signal('');
  clients = signal<ClientData[]>([]);
  
  currentPage = signal(1);
  totalPages = signal(1);
  totalCount = signal(0);
  searchQuery = '';
  
  pageSize = 10;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.error.set('');
    
    this.clientsService.getClients(this.currentPage(), this.pageSize, this.searchQuery).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.clients.set(res.data.clients);
          this.currentPage.set(res.data.pagination.page);
          this.totalPages.set(res.data.pagination.pages);
          this.totalCount.set(res.data.pagination.total);
        } else {
          this.error.set(res.error || 'Failed to fetch directory data.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Network error encountered while fetching directory.');
        this.loading.set(false);
      }
    });
  }
  
  loadPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadData();
    }
  }
  
  search() {
    this.currentPage.set(1);
    this.loadData();
  }
}
