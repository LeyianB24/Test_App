import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService, AuditLog } from '../../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-audit-log',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container p-8 animate-up">
      <!-- Elite Page Header -->
      <header class="page-header-elite mb-12">
        <div class="header-info">
          <h1 class="premium-title">Audit <span class="gradient-text">Log</span></h1>
          <p class="premium-subtitle">Track and monitor all system actions</p>
        </div>
        <div class="header-actions flex gap-4">
           <div class="search-premium min-w-[300px]">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()" placeholder="Search action, user, or IP..." class="search-input-elite">
           </div>
           <button class="modern-btn outline-btn btn-icon" (click)="loadData()">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
             <span>Refresh</span>
           </button>
        </div>
      </header>

      <!-- Intelligence Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="premium-stat-card p-6 animate-up delay-1">
          <div class="stat-info">
            <span class="stat-label">Total Logs</span>
            <h3 class="stat-number">{{ totalCount() | number }}</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-slate-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
        </div>
        
        <div class="premium-stat-card p-6 animate-up delay-2">
          <div class="stat-info">
            <span class="stat-label">Successful Actions</span>
            <h3 class="stat-number text-emerald-600">{{ successLogs() | number }}</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-emerald-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>

        <div class="premium-stat-card p-6 animate-up delay-3">
          <div class="stat-info">
            <span class="stat-label">Errors</span>
            <h3 class="stat-number text-red-600">{{ failedLogs() | number }}</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-red-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>

        <div class="premium-stat-card p-6 animate-up delay-4">
          <div class="stat-info">
            <span class="stat-label">Active IP Addresses</span>
            <h3 class="stat-number text-blue-600">{{ uniqueIPs() | number }}</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-blue-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
          </div>
        </div>
      </div>

      <!-- Forensics Surface -->
      <div class="content-card-premium relative overflow-hidden animate-up delay-2">
         <div class="absolute -top-20 -right-20 w-80 h-80 bg-slate-50 rounded-full blur-3xl"></div>

         <div class="relative z-10">
            @if (loading()) {
              <div class="py-32 flex flex-col items-center">
                <div class="w-12 h-12 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
                <p class="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading audit log...</p>
              </div>
            }

            @if (error()) {
              <div class="m-8 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold flex items-center gap-4 animate-scale">
                 <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                 {{ error() }}
              </div>
            }

            @if (!loading() && !error()) {
               <div class="table-responsive-elite">
                  <table class="modern-table-elite w-full">
                    <thead>
                      <tr>
                        <th class="pl-8">Date & Time</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>IP Address</th>
                        <th class="pr-8">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (log of logs(); track log.id) {
                        <tr class="table-row-hover group">
                          <td class="pl-8">
                            <span class="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-[0.15em]">{{ log.timestamp | date:'dd MMM yyyy' }}</span>
                            <span class="font-black text-slate-800 tracking-tight text-sm font-mono">{{ log.timestamp | date:'HH:mm:ss' }}</span>
                          </td>
                          <td>
                            <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:scale-110">
                                {{ log.user.substring(0, 2).toUpperCase() }}
                              </div>
                              <span class="text-xs font-black text-slate-800">{{ log.user }}</span>
                            </div>
                          </td>
                          <td>
                            <div class="status-pill-elite mb-2 shadow-sm synced">
                              <span class="dot"></span>
                              {{ log.module | uppercase }}
                            </div>
                            <span class="text-[9px] font-black uppercase tracking-widest block ml-2" [class]="getActionEliteClass(log.action)">
                              {{ log.action }}
                            </span>
                          </td>
                          <td>
                            <span class="text-[11px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{{ log.ip }}</span>
                          </td>
                          <td class="pr-8">
                            <p class="text-[11px] font-bold text-slate-600 max-w-sm line-clamp-2 leading-relaxed" [title]="log.details">
                              {{ log.details }}
                            </p>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
               </div>

               @if (logs().length === 0) {
                 <div class="flex flex-col items-center justify-center py-40 animate-scale">
                    <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
                       <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    </div>
                    <h3 class="text-xl font-black text-slate-800 mb-2">No Logs Found</h3>
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">No audit logs match your search criteria</p>
                    <button (click)="searchQuery=''; search()" class="modern-btn primary-btn">
                       Clear Search
                    </button>
                 </div>
               }

               <!-- Pagination -->
               @if (totalPages() > 1) {
                  <div class="flex justify-between items-center p-8 border-t border-slate-50 bg-slate-50/30">
                     <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Page {{ currentPage() }} of {{ totalPages() }} • {{ totalCount() }} Actions
                     </span>
                     <div class="flex gap-3">
                        <button class="icon-btn-elite" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">
                           <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button class="icon-btn-elite" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">
                           <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                     </div>
                  </div>
               }
            }
         </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1600px; margin: 0 auto; }
    
    .search-premium {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 1.5px solid rgba(226, 232, 240, 0.8);
      border-radius: 1.2rem;
      padding: 0 1.2rem;
      height: 3rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
    }
    .search-premium:focus-within {
      border-color: #E31E24;
      box-shadow: 0 8px 24px rgba(227, 30, 36, 0.12);
      transform: translateY(-1px);
      background: white;
    }
    .search-premium svg { color: #94A3B8; margin-right: 0.8rem; }
    .search-input-elite {
      background: transparent;
      border: none;
      outline: none;
      width: 100%;
      font-size: 0.85rem;
      font-weight: 700;
      color: #1E293B;
    }
    .search-input-elite::placeholder { color: #CBD5E1; font-weight: 600; }

    .table-responsive-elite { overflow-x: auto; }
    .modern-table-elite { border-collapse: separate; border-spacing: 0; }
    .modern-table-elite th {
      padding: 1.5rem 1rem;
      background: #F8FAFC;
      text-align: left;
      font-size: 0.65rem;
      font-weight: 900;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      border-bottom: 1px solid #F1F5F9;
    }
    .table-row-hover { transition: all 0.2s; cursor: default; }
    .table-row-hover td { padding: 1.5rem 1rem; border-bottom: 1px solid #F8FAFC; }
    .table-row-hover:hover { background: #FAFAFA; }

    .icon-btn-elite {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.8rem;
      background: white;
      border: 1px solid #F1F5F9;
      color: #94A3B8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .elite-success { color: #10B981; }
    .elite-warning { color: #F59E0B; }
    .elite-error { color: #EF4444; }
    .elite-info { color: #3B82F6; }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }

    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .animate-scale { animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
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

  // Derived KPI signals
  successLogs = signal(0);
  failedLogs  = signal(0);
  uniqueIPs   = signal(0);

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
          // Derive KPI counts
          const logList: AuditLog[] = res.data.logs;
          this.successLogs.set(logList.filter(l => this.getActionColor(l.action) === 'text-success').length);
          this.failedLogs.set(logList.filter(l => this.getActionColor(l.action) === 'text-error').length);
          const ips = new Set(logList.map((l: any) => l.ip).filter(Boolean));
          this.uniqueIPs.set(ips.size);
        } else {
          this.error.set(res.error || 'Failed to load audit logs.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to connect to the server.');
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

  getActionEliteClass(action: string) {
    const color = this.getActionColor(action);
    if (color === 'text-success') return 'elite-success';
    if (color === 'text-warning') return 'elite-warning';
    if (color === 'text-error') return 'elite-error';
    return 'elite-info';
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
