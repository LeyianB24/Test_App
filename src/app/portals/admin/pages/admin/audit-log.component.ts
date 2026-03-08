import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService, AuditLog } from '../../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-audit-log',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="content-area animate-fade-in">
      
      <!-- Elite Page Header -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight">
              Audit <span class="text-accent">Forensics</span>
            </h1>
            <p class="text-[var(--text-secondary)] mt-2 font-semibold tracking-wide uppercase text-[10px]">National Intelligence Registry Trace & Command Log</p>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex-grow md:flex-grow-0 md:min-w-[300px] relative group">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary transition-colors group-focus-within:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()" 
                placeholder="Query Trace Action/Identity..." 
                class="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg py-2 pl-9 pr-4 text-xs font-bold transition-all focus:border-accent outline-none">
            </div>
            <button class="btn-precision btn-secondary-precision btn-sm" (click)="loadData()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              SYNC LOGS
            </button>
          </div>
        </div>
      </header>

      <!-- Intelligence Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Total Logs</span>
              <h3 class="card-value">{{ totalCount() | number }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-primary/5 text-primary">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
          </div>
        </div>
        
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Success Rate</span>
              <h3 class="card-value text-success">{{ successLogs() | number }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-success/5 text-success">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
        </div>

        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Terminal Failures</span>
              <h3 class="card-value text-accent">{{ failedLogs() | number }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-accent/5 text-accent">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
        </div>

        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Access Origin nodes</span>
              <h3 class="card-value text-blue-500">{{ uniqueIPs() | number }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-blue-500/5 text-blue-500">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Forensics Surface -->
      <div class="stat-card-precision p-0 overflow-hidden relative border-accent/10">
        
        @if (loading()) {
            <div class="py-32 flex flex-col items-center">
              <div class="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              <p class="mt-4 text-[10px] font-black text-tertiary uppercase tracking-widest">Decoding Trace Registry...</p>
            </div>
        }

        @if (error()) {
            <div class="m-8 p-6 bg-accent/5 border border-accent/10 rounded-2xl text-accent font-bold flex items-center gap-4 animate-shake">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
               <span class="text-xs uppercase tracking-widest">{{ error() }}</span>
            </div>
        }

        @if (!loading() && !error()) {
             <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[var(--bg-surface-2)]/50">
                      <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-secondary">Temporal Stamp</th>
                      <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary">Identity Origin</th>
                      <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary">Command Unit</th>
                      <th class="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-secondary text-center">Node IP</th>
                      <th class="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-secondary">Registry Metadata</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[var(--border-subtle)]">
                    @for (log of logs(); track log.id) {
                      <tr class="hover:bg-[var(--bg-surface-1)] transition-colors group">
                        <td class="px-8 py-5 whitespace-nowrap">
                          <div class="flex flex-col">
                            <span class="text-[10px] font-black text-tertiary uppercase tracking-widest mb-1">{{ log.timestamp | date:'dd MMM yyyy' }}</span>
                            <span class="text-xs font-black text-primary font-mono tracking-tight">{{ log.timestamp | date:'HH:mm:ss:SSS' }}</span>
                          </div>
                        </td>
                        <td class="px-6 py-5">
                          <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-[var(--bg-surface-2)] flex items-center justify-center text-[10px] font-black text-tertiary group-hover:bg-accent group-hover:text-white transition-all transform group-hover:scale-110">
                              {{ log.user.substring(0, 2).toUpperCase() }}
                            </div>
                            <span class="text-xs font-black text-primary uppercase tracking-tight">{{ log.user }}</span>
                          </div>
                        </td>
                        <td class="px-6 py-5">
                          <div class="status-pill-precision synced mb-2">
                            {{ log.module | uppercase }}
                          </div>
                          <span class="text-[9px] font-black uppercase tracking-[0.2em] block ml-1" [class]="getActionEliteColor(log.action)">
                            {{ log.action }}
                          </span>
                        </td>
                        <td class="px-6 py-5 text-center">
                          <span class="text-[10px] font-black text-primary bg-[var(--bg-surface-2)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] font-mono tracking-tighter">{{ log.ip }}</span>
                        </td>
                        <td class="px-8 py-5">
                          <p class="text-[11px] font-semibold text-secondary max-w-sm line-clamp-1 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity" [title]="log.details">
                            {{ log.details }}
                          </p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
             </div>

             @if (logs().length === 0) {
               <div class="flex flex-col items-center justify-center py-40 animate-fade-in">
                  <div class="w-20 h-20 bg-[var(--bg-surface-2)] rounded-full flex items-center justify-center text-tertiary mb-8">
                     <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  </div>
                  <h3 class="text-xl font-black text-primary mb-2">Trace Void</h3>
                  <p class="text-tertiary font-bold uppercase tracking-widest text-[10px] mb-8">No forensics fragments match current registry synchronization</p>
                  <button (click)="searchQuery=''; search()" class="btn-precision btn-secondary-precision btn-sm px-10">
                     RESET TRACE
                  </button>
               </div>
             }

             <!-- Pagination -->
             @if (totalPages() > 1) {
                <div class="flex justify-between items-center p-8 border-t border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                   <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">
                      Node {{ currentPage() }} of {{ totalPages() }} • {{ totalCount() }} Trace Fragments synchronized
                   </span>
                   <div class="flex gap-3">
                      <button class="btn-precision btn-secondary-precision btn-sm px-3" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">
                         <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
                      </button>
                      <button class="btn-precision btn-secondary-precision btn-sm px-3" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">
                         <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                      </button>
                   </div>
                </div>
             }
        }
      </div>
    </div>
  `,
  styles: [``]
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
          const logList: AuditLog[] = res.data.logs;
          this.successLogs.set(logList.filter(l => this.getActionType(l.action) === 'success').length);
          this.failedLogs.set(logList.filter(l => this.getActionType(l.action) === 'error').length);
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

  getActionEliteColor(action: string) {
    const type = this.getActionType(action);
    if (type === 'success') return 'text-success';
    if (type === 'warning') return 'text-warning';
    if (type === 'error') return 'text-accent';
    return 'text-blue-500';
  }

  getActionType(action: string) {
    if (!action) return 'info';
    const act = action.toUpperCase();
    if (act.includes('SUCCESS') || act.includes('RESOLVE') || act.includes('CREATE')) return 'success';
    if (act.includes('UPDATE') || act.includes('CHANGE') || act.includes('IMPORT')) return 'warning';
    if (act.includes('ERROR') || act.includes('FAIL') || act.includes('DELETE')) return 'error';
    return 'info';
  }
}
