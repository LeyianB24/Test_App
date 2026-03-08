import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';

@Component({
  selector: 'app-ticket-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="content-area animate-fade-in">
      
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight">
              Support <span class="text-accent">Intelligence</span>
            </h1>
            <p class="text-[var(--text-secondary)] mt-2 font-semibold tracking-wide uppercase text-[10px]">Track, manage, and escalate support directives</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex bg-[var(--bg-surface-2)] p-1 rounded-xl border border-[var(--border-subtle)]">
              <button (click)="viewMode.set('list')" 
                class="px-3 py-1.5 rounded-lg transition-all"
                [class]="viewMode() === 'list' ? 'bg-accent text-white shadow-lg' : 'text-tertiary hover:text-primary'">
                 <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2"/></svg>
              </button>
              <button (click)="viewMode.set('kanban')" 
                class="px-3 py-1.5 rounded-lg transition-all"
                [class]="viewMode() === 'kanban' ? 'bg-accent text-white shadow-lg' : 'text-tertiary hover:text-primary'">
                 <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17V7m-7 10V7h14v10H2zm16-10v10h4V7h-4z" stroke-width="2"/></svg>
              </button>
            </div>
            <button [routerLink]="['/helpdesk/create']" class="btn-precision btn-primary-precision btn-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path d="M12 4v16m8-8H4" stroke-width="2.5"/></svg>
              New Directive
            </button>
          </div>
        </div>
      </header>

      <!-- KPI Pipeline -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Open Signals</span>
              <h3 class="card-value">{{ helpdeskService.openTicketsCount() }}</h3>
            </div>
            <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          </div>
        </div>
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">In Processing</span>
              <h3 class="card-value">{{ helpdeskService.inProgressCount() }}</h3>
            </div>
            <div class="w-2 h-2 rounded-full bg-warning"></div>
          </div>
        </div>
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Awaiting Handshake</span>
              <h3 class="card-value">{{ helpdeskService.waitingCount() }}</h3>
            </div>
            <div class="w-2 h-2 rounded-full bg-red-500"></div>
          </div>
        </div>
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Resolved</span>
              <h3 class="card-value">{{ helpdeskService.resolvedCount() }}</h3>
            </div>
            <div class="w-2 h-2 rounded-full bg-success"></div>
          </div>
        </div>
      </div>

      <!-- Main Interface -->
      <div class="stat-card-precision p-0 overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <h3 class="text-xs font-black text-primary uppercase tracking-[0.2em]">Support Registry</h3>
          <div class="flex items-center gap-4 flex-1 max-w-2xl">
            <div class="flex-1 relative group">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary transition-colors group-focus-within:text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" 
                placeholder="Query registry..." 
                class="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg py-2 pl-9 pr-4 text-xs font-bold transition-all focus:border-accent outline-none">
            </div>
            <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" 
              class="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg py-2 px-3 text-xs font-bold outline-none focus:border-accent">
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Customer">Waiting</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div class="card-body">
          @if (helpdeskService.isLoading()) {
            <div class="p-20 flex justify-center">
              <div class="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
            </div>
          } @else if (helpdeskService.tickets().length === 0) {
            <div class="p-20 text-center">
              <p class="text-xs font-black text-tertiary uppercase tracking-widest">No support records located in registry</p>
            </div>
          } @else {
            @if (viewMode() === 'list') {
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[var(--bg-surface-2)]/50">
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">ID</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Subject / Identity</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Status</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Priority</th>
                      <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[var(--border-subtle)]">
                    @for (ticket of filteredTickets(); track ticket.id) {
                      <tr class="hover:bg-[var(--bg-surface-1)] transition-colors group">
                        <td class="px-6 py-4 font-black text-primary/40 tabular-nums text-xs">#{{ ticket.ticket_number }}</td>
                        <td class="px-6 py-4">
                          <div class="flex flex-col">
                            <span class="text-sm font-black text-primary">{{ ticket.subject }}</span>
                            <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">{{ ticket.category }}</span>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <span class="status-pill-precision" [class]="getStatusBadgeClass(ticket.status)">
                            {{ ticket.status }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                           <span class="status-pill-precision" [class]="getPriorityBadgeClass(ticket.priority)">
                            {{ ticket.priority }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-right">
                          <button [routerLink]="['/helpdesk', ticket.id]" class="btn-precision btn-secondary-precision btn-sm px-4">
                             View Intel
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            } @else {
              <!-- Kanban View -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-[var(--bg-surface-2)]/30">
                 @for (group of kanbanGroups; track group.status) {
                    <div class="flex flex-col gap-4">
                       <div class="flex justify-between items-center mb-2">
                          <h4 class="text-[10px] font-black uppercase text-tertiary tracking-[0.2em]">{{ group.label }}</h4>
                          <span class="px-2 py-0.5 rounded-full bg-[var(--bg-surface-2)] text-[9px] font-black text-primary">{{ group.tickets.length }}</span>
                       </div>
                       <div class="flex flex-col gap-4">
                          @for (ticket of group.tickets; track ticket.id) {
                             <div [routerLink]="['/helpdesk', ticket.id]" 
                               class="stat-card-precision !p-5 hover:border-accent transition-all cursor-pointer group shadow-sm">
                                <span class="text-[9px] font-black text-accent block mb-2">{{ ticket.ticket_number }}</span>
                                <h5 class="text-primary font-black text-sm leading-tight mb-4 group-hover:text-accent transition-colors">{{ ticket.subject }}</h5>
                                <div class="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-subtle)]">
                                   <span class="text-tertiary text-[9px] font-black uppercase tracking-widest">{{ ticket.category }}</span>
                                   <div class="w-1.5 h-1.5 rounded-full" [class]="getPriorityColor(ticket.priority)"></div>
                                </div>
                             </div>
                          }
                       </div>
                    </div>
                 }
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .priority-dot { width: 6px; height: 6px; border-radius: 50%; }
  `]
})
export class TicketListComponent {
  public helpdeskService = inject(HelpdeskService);
  
  viewMode = signal<'list' | 'kanban'>('list');
  searchTerm = signal('');
  statusFilter = signal('');
  priorityFilter = signal('');

  filteredTickets = computed(() => {
    let tickets = this.helpdeskService.tickets();
    const search = this.searchTerm().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    if (search) {
      tickets = tickets.filter(t => 
        t.ticket_number.toLowerCase().includes(search) || 
        t.subject.toLowerCase().includes(search)
      );
    }
    if (status) tickets = tickets.filter(t => t.status === status);
    if (priority) tickets = tickets.filter(t => t.priority === priority);

    return tickets;
  });

  get kanbanGroups() {
    const tickets = this.filteredTickets();
    return [
      { label: 'Open Signals', status: 'Open', tickets: tickets.filter(t => t.status === 'Open') },
      { label: 'In Processing', status: 'In Progress', tickets: tickets.filter(t => t.status === 'In Progress') },
      { label: 'Waiting Handshake', status: 'Waiting for Customer', tickets: tickets.filter(t => t.status === 'Waiting for Customer') },
      { label: 'Resolved Archived', status: 'Resolved', tickets: tickets.filter(t => t.status === 'Resolved') }
    ];
  }

  constructor() {
    this.helpdeskService.listTickets().subscribe();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Open': return 'online';
      case 'In Progress': return 'pending';
      case 'Waiting for Customer': return 'overdue';
      case 'Resolved': return 'active';
      default: return '';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'pending';
      default: return 'synced';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-400';
      case 'Medium': return 'bg-blue-400';
      default: return 'bg-slate-400';
    }
  }
}
