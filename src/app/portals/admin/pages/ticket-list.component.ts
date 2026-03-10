import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Request Manifold Header -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Service Request Triaging</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                Incident <span class="text-stroke-sm">Manifold</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                DIRECTIVE ARRAY OVERRIDE // CLUSTER: HELP-KRA-NODE-01
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-6">
              <div class="flex-grow md:flex-grow-0 md:min-w-[400px] relative group/search">
                <div class="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <svg class="w-4 h-4 text-muted group-focus-within/search:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="loadTickets()" 
                  placeholder="Trace Incident ID / Identity Vector..." 
                  class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-black transition-all focus:border-accent/40 outline-none focus:bg-accent/5 tracking-tight uppercase">
              </div>

              <div class="flex gap-4">
                 <select [(ngModel)]="filterStatus" (change)="loadTickets()" 
                    class="bg-white/5 border border-white/10 rounded-2xl py-4 px-8 text-[10px] font-black uppercase tracking-widest text-primary focus:border-accent/40 outline-none appearance-none cursor-pointer min-w-[160px]">
                    <option value="all">Global Matrix</option>
                    <option value="Open">Unresolved</option>
                    <option value="In Progress">Processing</option>
                    <option value="Resolved">Synchronized</option>
                    <option value="Closed">Archived</option>
                 </select>
                 
                 <button (click)="loadTickets()" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/10 transition-all flex items-center justify-center">
                    <svg [class.animate-spin]="loading()" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                 </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Incident Registry Manifold -->
        <div class="glass-panel overflow-hidden border-white/5">
          @if (loading()) {
            <div class="py-40 flex flex-col items-center justify-center gap-8">
              <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-t-accent rounded-full animate-spin"></div>
              </div>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Syncing Support directive fragments...</p>
            </div>
          } @else {
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-white/[0.02] border-b border-white/5">
                    <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Incident Vector</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted">Temporal Logic</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted text-center">Protocol Level</th>
                    <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted text-center">Status Matrix</th>
                    <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted text-right">Operational</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  @for (ticket of tickets(); track ticket.id) {
                    <tr class="hover:bg-white/[0.03] transition-colors group">
                      <td class="px-10 py-8">
                         <div class="flex flex-col gap-1">
                            <span class="text-[9px] font-black text-accent uppercase tracking-widest opacity-60">ID: INC-{{ ticket.id }}</span>
                            <span class="text-sm font-black text-primary uppercase tracking-tighter truncate max-w-[400px] group-hover:text-accent transition-colors">{{ ticket.subject }}</span>
                         </div>
                      </td>
                      <td class="px-8 py-8">
                         <div class="space-y-1">
                            <span class="text-sm font-black text-primary tabular-nums tracking-tighter">{{ ticket.created_at | date:'dd MMM yyyy' | uppercase }}</span>
                            <span class="text-[9px] font-black text-muted uppercase tracking-widest block opacity-40">{{ ticket.created_at | date:'HH:mm' }} UTC</span>
                         </div>
                      </td>
                      <td class="px-8 py-8 text-center">
                         <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-widest" 
                            [class.text-accent]="ticket.priority === 'High'"
                            [class.border-accent/30]="ticket.priority === 'High'"
                            [class.bg-accent/10]="ticket.priority === 'High'">
                            {{ ticket.priority }}
                         </div>
                      </td>
                      <td class="px-8 py-8 text-center">
                         <div class="status-pill-precision mx-auto !py-1 !px-4" [class.online]="ticket.status === 'Resolved'">
                            @if (ticket.status === 'Resolved') {
                              <span class="status-pill-dot animate-pulse"></span>
                            }
                            {{ ticket.status | uppercase }}
                         </div>
                      </td>
                      <td class="px-10 py-8 text-right">
                         <button (click)="viewTicket(ticket.id)" class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all flex items-center justify-center group/btn relative overflow-hidden">
                            <div class="absolute inset-0 bg-accent/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            <svg class="relative z-10" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                         </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="py-40 text-center">
                        <div class="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-muted border border-white/10">
                           <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <p class="text-[11px] font-black text-muted uppercase tracking-[0.4em]">Zero Incident Pulse Detected</p>
                        <p class="text-[9px] font-black text-muted/40 uppercase tracking-widest mt-2">Current cluster synchronization returned no active service directives.</p>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Manifold Navigation -->
            @if (totalPages() > 1) {
              <div class="flex justify-between items-center px-10 py-8 border-t border-white/5 bg-white/[0.01]">
                <span class="text-[9px] font-black text-muted uppercase tracking-[0.4em]">
                  Manifold Page {{ currentPage() }} of {{ totalPages() }} // {{ totalCount() }} Total Directives
                </span>
                <div class="flex gap-4">
                  <button class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all flex items-center justify-center disabled:opacity-20" [disabled]="currentPage() === 1" (click)="loadPage(currentPage() - 1)">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all flex items-center justify-center disabled:opacity-20" [disabled]="currentPage() === totalPages()" (click)="loadPage(currentPage() + 1)">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M9 5l7 7-7 7"/></svg>
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

    .status-pill-precision {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255,255,255,0.03);
    }

    .online { color: #10b981; border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.05); }
    .status-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

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
export class TicketListComponent implements OnInit {
  private helpSvc = inject(HelpdeskService);

  tickets = signal<Ticket[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  pageSize = 12;
  totalCount = signal(0);
  totalPages = signal(1);
  
  searchQuery = '';
  filterStatus = 'all';

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.loading.set(true);
    this.helpSvc.getTickets(this.currentPage(), this.pageSize, this.searchQuery, this.filterStatus === 'all' ? '' : this.filterStatus).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.tickets.set(res.data.tickets);
          this.totalCount.set(res.data.pagination.total);
          this.totalPages.set(res.data.pagination.pages);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadTickets();
    }
  }

  viewTicket(id: number) {
    console.log('Intercepting directive ID:', id);
    // Navigation logic would go here
  }
}
