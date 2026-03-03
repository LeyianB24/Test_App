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
    <div class="page-container p-8 animate-fade-in">
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Support <span class="gradient-text">Tickets</span></h1>
          <p class="premium-subtitle">Track, manage, and escalate your support requests</p>
        </div>
        <div class="header-actions flex gap-4">
          <button (click)="viewMode.set('list')" [class.active]="viewMode() === 'list'" class="icon-btn-elite">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <button (click)="viewMode.set('kanban')" [class.active]="viewMode() === 'kanban'" class="icon-btn-elite">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17V7m-7 10V7h14v10H2zm16-10v10h4V7h-4z"/></svg>
          </button>
          <button [routerLink]="['/helpdesk/create']" class="modern-btn primary-btn ml-2">
            Create New Ticket
          </button>
        </div>
      </header>

      <!-- Statistics Pipeline -->
      <div class="stats-grid-premium">
        <div class="premium-stat-card animate-up delay-1">
          <div class="stat-icon-wrapper blue">
             <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Open Tickets</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ helpdeskService.openTicketsCount() }}</h3>
            </div>
          </div>
        </div>
        <div class="premium-stat-card animate-up delay-2">
          <div class="stat-icon-wrapper gold">
             <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">In Progress</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ helpdeskService.inProgressCount() }}</h3>
            </div>
          </div>
        </div>
        <div class="premium-stat-card animate-up delay-3">
          <div class="stat-icon-wrapper red">
             <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Waiting On You</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ helpdeskService.waitingCount() }}</h3>
            </div>
          </div>
        </div>
        <div class="premium-stat-card animate-up delay-3">
          <div class="stat-icon-wrapper green">
             <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Resolved</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ helpdeskService.resolvedCount() }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Active Tickets Surface -->
      <div class="action-bar-glass mt-32 animate-up delay-2 w-full">
        <div class="search-premium">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Search by ticket # or subject..." class="search-input-elite">
        </div>
        <div class="flex gap-4">
          <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" class="search-input-elite w-auto px-4 py-2">
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Customer">Waiting for Response</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select [ngModel]="priorityFilter()" (ngModelChange)="priorityFilter.set($event)" class="search-input-elite w-auto px-4 py-2">
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div class="content-card-premium animate-up delay-3 w-full mb-20">
        @if (helpdeskService.isLoading()) {
          <div class="py-20 flex flex-col items-center">
            <div class="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
            <p class="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading tickets...</p>
          </div>
        } @else if (helpdeskService.tickets().length === 0) {
          <div class="py-20 text-center">
            <div class="text-slate-400 mb-6 flex justify-center">
               <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <p class="text-slate-600 font-black text-xl mb-2">No Support Tickets</p>
            <p class="text-slate-500 text-sm mb-8">You haven't filed any tickets yet. Need help?</p>
            <button [routerLink]="['/helpdesk/create']" class="modern-btn outline-btn">Submit Ticket</button>
          </div>
        } @else {
          @if (viewMode() === 'list') {
            <div class="table-responsive-elite">
              <table class="modern-table-elite w-full">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Information</th>
                    <th class="text-center">Status</th>
                    <th class="text-center">Priority</th>
                    <th>Created</th>
                    <th class="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ticket of filteredTickets(); track ticket.id) {
                    <tr class="table-row-hover">
                      <td>
                        <span class="font-black text-sm" style="color: var(--kra-blue);">{{ ticket.ticket_number }}</span>
                      </td>
                      <td>
                        <span class="font-bold block mb-1 text-sm" style="color: var(--text-main);">{{ ticket.subject }}</span>
                        <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">{{ ticket.category }}</span>
                      </td>
                      <td class="text-center">
                        <div class="status-pill-elite" [class]="getStatusBadgeClass(ticket.status)">
                           <span class="dot"></span>
                           {{ ticket.status }}
                        </div>
                      </td>
                      <td class="text-center">
                         <div class="status-pill-elite" [class]="getPriorityBadgeClass(ticket.priority)">
                           <span class="dot"></span>
                           {{ ticket.priority }}
                        </div>
                      </td>
                      <td>
                        <span class="text-slate-500 text-xs font-bold">{{ ticket.created_at | date:'medium' }}</span>
                      </td>
                      <td class="text-right">
                        <button [routerLink]="['/helpdesk', ticket.id]" class="icon-btn-elite ml-auto">
                           <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <!-- Kanban View -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px] p-6">
               @for (group of kanbanGroups; track group.status) {
                  <div class="kanban-col bg-slate-50 p-6 rounded-3xl border border-slate-200">
                     <div class="flex items-center justify-between mb-6">
                        <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-500">{{ group.label }}</h4>
                        <span class="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">{{ group.tickets.length }}</span>
                     </div>
                     <div class="space-y-4">
                        @for (ticket of group.tickets; track ticket.id) {
                           <div [routerLink]="['/helpdesk', ticket.id]" class="kanban-card p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer">
                              <span class="text-[9px] font-black text-blue-500 block mb-2">{{ ticket.ticket_number }}</span>
                              <h5 class="text-slate-800 font-bold text-sm leading-tight mb-4">{{ ticket.subject }}</h5>
                              <div class="flex justify-between items-center">
                                 <span class="text-slate-500 text-[9px] font-black uppercase">{{ ticket.category }}</span>
                                 <div class="w-2 h-2 rounded-full" [class]="getPriorityColor(ticket.priority)"></div>
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
  `,
  styles: [`
    .icon-btn-elite.active { background: var(--kra-red); color: white; border-color: var(--kra-red); }
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
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  }
}
