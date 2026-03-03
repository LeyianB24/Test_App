import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';

@Component({
  selector: 'app-ticket-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-precision animate-fade-in">
      
      <header class="header-precision">
        <div class="header-titles">
          <h1 class="title-primary">Support <span class="title-accent">Intelligence</span></h1>
          <p class="subtitle-secondary">Track, manage, and escalate your support requests</p>
        </div>
        <div class="header-actions">
          <div class="btn-group-precision">
            <button (click)="viewMode.set('list')" [class.active-precision]="viewMode() === 'list'" class="btn-precision btn-secondary-precision btn-sm">
               <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2"/></svg>
            </button>
            <button (click)="viewMode.set('kanban')" [class.active-precision]="viewMode() === 'kanban'" class="btn-precision btn-secondary-precision btn-sm">
               <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17V7m-7 10V7h14v10H2zm16-10v10h4V7h-4z" stroke-width="2"/></svg>
            </button>
          </div>
          <button [routerLink]="['/helpdesk/create']" class="btn-precision btn-primary-precision">
            New Directive
          </button>
        </div>
      </header>

      <div class="dashboard-content-precision">
        <!-- KPI Pipeline -->
        <div class="kpi-grid-precision mb-10">
          <div class="card-precision kpi-card-precision">
            <div class="kpi-info">
              <span class="label">Open Tickets</span>
              <h3 class="value">{{ helpdeskService.openTicketsCount() }}</h3>
            </div>
            <div class="kpi-status-dot bg-blue-400"></div>
          </div>
          <div class="card-precision kpi-card-precision">
            <div class="kpi-info">
              <span class="label">In Progress</span>
              <h3 class="value">{{ helpdeskService.inProgressCount() }}</h3>
            </div>
            <div class="kpi-status-dot bg-warning"></div>
          </div>
          <div class="card-precision kpi-card-precision">
            <div class="kpi-info">
              <span class="label">Awaiting User</span>
              <h3 class="value">{{ helpdeskService.waitingCount() }}</h3>
            </div>
            <div class="kpi-status-dot bg-red-base"></div>
          </div>
          <div class="card-precision kpi-card-precision">
            <div class="kpi-info">
              <span class="label">Resolved</span>
              <h3 class="value">{{ helpdeskService.resolvedCount() }}</h3>
            </div>
            <div class="kpi-status-dot bg-success"></div>
          </div>
        </div>

        <!-- Interface Layer -->
        <div class="card-precision main-content-card-precision">
          <div class="card-header-precision border-b border-white/5 pb-6 flex justify-between items-center">
            <h3>Support Registry</h3>
            <div class="filter-actions flex gap-4">
              <div class="search-box-precision">
                <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Search Registry..." class="input-precision sm">
              </div>
              <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" class="input-precision sm">
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting for Customer">Waiting</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div class="card-body-precision mt-6">
            @if (helpdeskService.isLoading()) {
              <div class="loader-container-precision py-20">
                <div class="loader-spinner-precision"></div>
              </div>
            } @else if (helpdeskService.tickets().length === 0) {
              <div class="empty-state-precision py-20 text-center">
                <p class="subtitle-secondary">No support records located in registry</p>
              </div>
            } @else {
              @if (viewMode() === 'list') {
                <div class="table-precision-wrapper overflow-x-auto">
                  <table class="table-precision w-full">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Subject / Identity</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th class="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (ticket of filteredTickets(); track ticket.id) {
                        <tr class="hover-precision transition-all border-b border-white/5">
                          <td class="font-black text-white/40 tabular-nums">{{ ticket.ticket_number }}</td>
                          <td>
                            <div class="identity-cell">
                              <span class="label-primary text-white font-bold block">{{ ticket.subject }}</span>
                              <span class="label-secondary text-[10px] uppercase text-white/30 tracking-widest font-black">{{ ticket.category }}</span>
                            </div>
                          </td>
                          <td>
                            <span class="badge-precision" [class]="getStatusBadgeClass(ticket.status)">
                              {{ ticket.status }}
                            </span>
                          </td>
                          <td>
                             <span class="badge-precision" [class]="getPriorityBadgeClass(ticket.priority)">
                              {{ ticket.priority }}
                            </span>
                          </td>
                          <td class="text-right">
                            <button [routerLink]="['/helpdesk', ticket.id]" class="btn-precision btn-secondary-precision btn-sm">
                               View Record
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <!-- Kanban Integration -->
                <div class="kanban-precision grid grid-cols-1 md:grid-cols-4 gap-6">
                   @for (group of kanbanGroups; track group.status) {
                      <div class="kanban-column-precision bg-white/2 p-6 rounded-3xl border border-white/5">
                         <div class="kanban-header-precision flex justify-between items-center mb-6">
                            <h4 class="text-[10px] font-black uppercase text-white/30 tracking-widest">{{ group.label }}</h4>
                            <span class="count-badge-precision">{{ group.tickets.length }}</span>
                         </div>
                         <div class="kanban-stack-precision space-y-4">
                            @for (ticket of group.tickets; track ticket.id) {
                               <div [routerLink]="['/helpdesk', ticket.id]" class="card-precision kanban-card-precision p-5 hover:border-red-base/50 transition-all cursor-pointer">
                                  <span class="text-[9px] font-black text-red-base block mb-2">{{ ticket.ticket_number }}</span>
                                  <h5 class="text-white font-bold text-sm leading-tight mb-4">{{ ticket.subject }}</h5>
                                  <div class="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                     <span class="text-white/30 text-[9px] font-black uppercase">{{ ticket.category }}</span>
                                     <div class="priority-dot" [class]="getPriorityColor(ticket.priority)"></div>
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
    </div>
  `,
  styles: [`
    .btn-group-precision { display: flex; background: var(--black-800); padding: 4px; border-radius: 12px; border: 1px solid var(--border-subtle); }
    .btn-group-precision .btn-precision { border: none; background: transparent; }
    .btn-group-precision .btn-precision.active-precision { background: var(--red-500); color: white; }
    .kpi-status-dot { width: 4px; height: 100%; position: absolute; left: 0; top: 0; }
    .count-badge-precision { background: var(--black-800); color: white; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 950; }
    .priority-dot { width: 6px; height: 6px; border-radius: 50%; }
    .bg-red-base { background-color: var(--red-500); }
    .bg-warning { background-color: var(--status-warning); }
    .bg-success { background-color: var(--status-success); }
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
      { label: 'Open', status: 'Open', tickets: tickets.filter(t => t.status === 'Open') },
      { label: 'In Progress', status: 'In Progress', tickets: tickets.filter(t => t.status === 'In Progress') },
      { label: 'Waiting', status: 'Waiting for Customer', tickets: tickets.filter(t => t.status === 'Waiting for Customer') },
      { label: 'Resolved', status: 'Resolved', tickets: tickets.filter(t => t.status === 'Resolved') }
    ];
  }

  constructor() {
    // Initial load
    this.helpdeskService.listTickets().subscribe();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Open': return 'synced';
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
