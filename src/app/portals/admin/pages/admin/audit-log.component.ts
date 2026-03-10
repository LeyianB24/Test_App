import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService, AuditLog } from '../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Forensic Header Manifold -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Forensic Telemetry Matrix</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                Audit <span class="text-stroke-sm">Forensics</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                SYSTEM INTEGRITY LOG // COMMAND TRACE NODE: FRC-KRA-NODE-05
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-6">
              <div class="flex-grow md:flex-grow-0 md:min-w-[400px] relative group/search">
                <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-muted group-focus-within/search:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="loadLogs()" 
                  placeholder="Trace Node ID / Payload Hash..." 
                  class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-black transition-all focus:border-accent/40 outline-none focus:bg-accent/5 tracking-tight uppercase">
              </div>

              <div class="relative group/filter">
                <select [(ngModel)]="selectedStatus" (change)="loadLogs()" 
                  class="bg-white/5 border border-white/10 rounded-2xl py-4 px-8 text-[10px] font-black uppercase tracking-widest text-primary focus:border-accent/40 outline-none appearance-none cursor-pointer pr-14">
                  <option value="all">Global Array</option>
                  <option value="success">Nominal Protocols</option>
                  <option value="failure">Deviation Detected</option>
                  <option value="warning">Potential Violation</option>
                </select>
                <div class="absolute inset-y-0 right-5 flex items-center pointer-events-none text-muted">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Dynamic Severity Indicators -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
          <div class="glass-panel p-8 flex items-center gap-8 group hover:bg-white/[0.03] transition-all">
            <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:border-primary/30 transition-all">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </div>
            <div class="space-y-1">
              <span class="text-[9px] font-black text-muted uppercase tracking-[0.3em]">Total Traces</span>
              <h3 class="text-2xl font-black text-primary tracking-tighter tabular-nums">{{ totalLogs() | number }}</h3>
            </div>
          </div>

          <div class="glass-panel p-8 flex items-center gap-8 group hover:bg-white/[0.03] transition-all">
            <div class="w-14 h-14 rounded-2xl bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center border border-[var(--color-success)]/10">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="space-y-1">
              <span class="text-[9px] font-black text-muted uppercase tracking-[0.3em]">Active SyncNodes</span>
              <h3 class="text-2xl font-black text-[var(--color-success)] tracking-tighter tabular-nums">{{ nominalCount() | number }}</h3>
            </div>
          </div>

          <div class="glass-panel p-8 flex items-center gap-8 group hover:bg-white/[0.03] transition-all border-accent/20">
            <div class="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/10">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div class="space-y-1">
              <span class="text-[9px] font-black text-accent uppercase tracking-[0.3em]">Crit Deviations</span>
              <h3 class="text-2xl font-black text-accent tracking-tighter tabular-nums">{{ failureCount() | number }}</h3>
            </div>
          </div>

          <div class="glass-panel p-8 flex items-center gap-8 group hover:bg-white/[0.03] transition-all">
            <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:border-primary/30 transition-all">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="space-y-1">
              <span class="text-[9px] font-black text-muted uppercase tracking-[0.3em]">Metadata Load</span>
              <h3 class="text-2xl font-black text-primary tracking-tighter tabular-nums">4.2 PB</h3>
            </div>
          </div>
        </div>

        <!-- Forensic Log Terminal -->
        <div class="glass-panel overflow-hidden border-white/5">
          @if (loading()) {
            <div class="py-40 flex flex-col items-center justify-center gap-8">
              <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-t-accent rounded-full animate-spin"></div>
              </div>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Decryption Signal Strength: High... Reconstructing Array</p>
            </div>
          } @else {
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-white/[0.02] border-b border-white/5">
                    <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Temporal Signature</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Node Origin</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Command Unit</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Registry Metadata</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">IP Vector</th>
                    <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted text-right">Integrity</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  @for (log of auditLogs(); track log.id) {
                    <tr class="hover:bg-white/[0.03] transition-colors group">
                      <td class="px-10 py-8 whitespace-nowrap">
                        <div class="space-y-1">
                          <span class="text-sm font-black text-primary tabular-nums tracking-tighter group-hover:text-accent transition-colors">{{ log.timestamp | date:'dd MMM yyyy' | uppercase }}</span>
                          <span class="text-[10px] font-black text-muted font-mono tabular-nums tracking-widest">{{ log.timestamp | date:'HH:mm:ss:SSS' }}</span>
                        </div>
                      </td>
                      <td class="px-8 py-8">
                        <div class="flex items-center gap-5">
                          <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:border-accent/30 border border-transparent transition-all">
                             <span class="text-[10px] font-black">{{ log.user.substring(0, 2).toUpperCase() }}</span>
                          </div>
                          <div>
                            <span class="text-sm font-black text-primary uppercase tracking-tighter block truncate max-w-[150px]">{{ log.user }}</span>
                            <span class="text-[9px] font-black text-muted uppercase tracking-widest block opacity-60">Admin Node</span>
                          </div>
                        </div>
                      </td>
                      <td class="px-8 py-8">
                         <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-secondary tracking-widest group-hover:text-primary transition-colors">
                            <span class="w-1 h-1 rounded-full bg-accent"></span>
                            {{ log.action | uppercase }}
                         </div>
                      </td>
                      <td class="px-8 py-8">
                        <p class="text-xs font-semibold text-muted leading-relaxed max-w-[300px] group-hover:text-primary transition-colors">{{ log.details }}</p>
                      </td>
                      <td class="px-8 py-8">
                        <span class="text-[10px] font-black text-muted font-mono tracking-widest">{{ log.ip_address || '0.0.0.0' }}</span>
                      </td>
                      <td class="px-10 py-8 text-right">
                        <div class="inline-flex items-center gap-3 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest font-mono" 
                          [class.status-pill-success]="isNominal(log.status)"
                          [class.status-pill-error]="!isNominal(log.status)">
                          <span class="w-1.5 h-1.5 rounded-full shadow-lg" [class]="isNominal(log.status) ? 'bg-[var(--color-success)]' : 'bg-accent'"></span>
                          {{ log.status || 'NULL' }}
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Pagination Protocol -->
            <div class="flex justify-between items-center px-10 py-8 border-t border-white/5 bg-white/[0.01]">
                <span class="text-[9px] font-black text-muted uppercase tracking-[0.4em]">
                  Forensic Page {{ currentPage() }} of {{ totalPages() }} // {{ totalLogs() }} Events Traced
                </span>
                <div class="flex gap-4">
                  <button class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all flex items-center justify-center disabled:opacity-20" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all flex items-center justify-center disabled:opacity-20" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M15 5l-7 7 7 7"/></svg>
                  </button>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .db-root {
      min-height: 100vh;
      background: #050505;
      position: relative;
      overflow-x: hidden;
      color: #e2e8f0;
      padding: 3.5rem;
    }

    .noise-overlay {
      position: fixed;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.015;
      pointer-events: none;
      z-index: 1;
    }

    .content-area {
      position: relative;
      z-index: 2;
      max-width: 1700px;
      margin: 0 auto;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 2.5rem;
    }

    .status-pill-success { 
      background: rgba(16, 185, 129, 0.1); 
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: #10b981;
    }
    .status-pill-error { 
      background: rgba(217, 43, 43, 0.1); 
      border: 1px solid rgba(217, 43, 43, 0.2);
      color: #D92B2B;
    }

    .text-stroke-sm {
      -webkit-text-stroke: 1px currentColor;
      color: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-accent); }

    .animate-stagger > * {
      animation: stg 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes stg {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
  `]
})
export class AuditLogComponent implements OnInit {
  private auditService = inject(AuditLogService);

  loading = signal(true);
  auditLogs = signal<AuditLog[]>([]);
  totalLogs = signal(0);
  currentPage = signal(1);
  pageSize = 15;
  totalPages = signal(1);
  nominalCount = signal(0);
  failureCount = signal(0);
  
  searchQuery = '';
  selectedStatus = 'all';

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading.set(true);
    this.auditService.getLogs(this.currentPage(), this.pageSize, this.searchQuery, this.selectedStatus === 'all' ? '' : this.selectedStatus).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.auditLogs.set(res.data.logs);
          this.totalLogs.set(res.data.pagination.total);
          this.totalPages.set(res.data.pagination.pages);
          
          this.nominalCount.set(res.data.logs.filter(l => this.isNominal(l.status)).length);
          this.failureCount.set(res.data.logs.filter(l => !this.isNominal(l.status)).length);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadLogs();
    }
  }

  isNominal(status: string): boolean {
    const s = (status || '').toUpperCase();
    return s === 'SUCCESS' || s === 'NOMINAL' || s === 'OK' || s === 'VERIFIED';
  }
}
