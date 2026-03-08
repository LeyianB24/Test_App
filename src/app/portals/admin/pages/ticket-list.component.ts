import { inject, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ticket-list',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="content-area animate-fade-in">
      
      <!-- Elite Page Header -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight">
              Support <span class="text-accent">Directives</span>
            </h1>
            <p class="text-[var(--text-secondary)] mt-2 font-semibold tracking-wide uppercase text-[10px]">National Support Command & Escalation Matrix</p>
          </div>
          <div class="flex items-center gap-4">
            <button [routerLink]="['/helpdesk/create']" class="btn-precision btn-primary-precision btn-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path stroke-width="3" d="M12 4v16m8-8H4"/></svg>
              New Directive
            </button>
          </div>
        </div>
      </header>

      <!-- Statistics Pipeline -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Open Tickets</span>
              <h3 class="card-value text-accent">{{ helpdeskService.openTicketsCount() }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-accent/5 text-accent">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
          </div>
        </div>
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">In Progress</span>
              <h3 class="card-value">{{ helpdeskService.inProgressCount() }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-warning/5 text-warning">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
          </div>
        </div>
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Waiting</span>
              <h3 class="card-value">{{ helpdeskService.waitingCount() }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-blue-500/5 text-blue-500">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </div>
          </div>
        </div>
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Resolved</span>
              <h3 class="card-value text-success">{{ helpdeskService.resolvedCount() }}</h3>
            </div>
            <div class="p-3 rounded-xl bg-success/5 text-success">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters & Active Tickets Surface -->
      <div class="stat-card-precision p-0 overflow-hidden">
        
        <div class="p-8 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex-grow max-w-md relative group">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary transition-colors group-focus-within:text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearch()" 
                placeholder="Query registry..." 
                class="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg py-2 pl-9 pr-4 text-xs font-bold transition-all focus:border-accent outline-none">
            </div>
            
            <div class="flex gap-3">
              <select [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" 
                class="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg py-2 px-3 text-xs font-bold outline-none focus:border-accent">
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting for Customer">Waiting</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              
              <select [(ngModel)]="priorityFilter" (ngModelChange)="onFilterChange()" 
                class="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg py-2 px-3 text-xs font-bold outline-none focus:border-accent">
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <button (click)="clearFilters()" class="text-tertiary hover:text-accent transition-colors ml-auto" title="Reset Filters">
               <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div>
          @if (helpdeskService.isLoading()) {
            <div class="py-32 flex flex-col items-center">
              <div class="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              <p class="mt-4 text-[10px] font-black text-tertiary uppercase tracking-widest">Synchronizing registry...</p>
            </div>
          }

          @if (helpdeskService.error() && !helpdeskService.isLoading()) {
            <div class="m-8 p-6 bg-accent/5 border border-accent/10 rounded-2xl text-accent font-bold flex items-center gap-4 animate-shake">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
               <span class="text-xs uppercase tracking-widest">{{ helpdeskService.error() }}</span>
            </div>
          }

          @if (!helpdeskService.isLoading() && helpdeskService.tickets().length > 0) {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-[var(--bg-surface-2)]/50">
                    <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">ID</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Directive Subject</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Status</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">SLA Priority</th>
                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Created</th>
                    <th class="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[var(--border-subtle)]">
                  @for (ticket of helpdeskService.tickets(); track ticket.id) {
                    <tr class="hover:bg-[var(--bg-surface-1)] transition-colors group cursor-pointer" [routerLink]="['/helpdesk', ticket.id]">
                      <td class="px-8 py-4">
                        <div class="flex flex-col">
                          <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">#{{ ticket.id }}</span>
                          <span class="text-xs font-black text-primary tracking-tight group-hover:text-accent transition-colors">{{ ticket.ticket_number }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="text-sm font-black text-primary block truncate max-w-[250px] mb-1">{{ ticket.subject }}</span>
                        <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">{{ ticket.category }}</span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="status-pill-precision" [class]="getStatusEliteClass(ticket.status)">
                          {{ ticket.status }}
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="status-pill-precision" [class]="getPriorityEliteClass(ticket.priority)">
                          {{ ticket.priority }}
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex flex-col">
                          <span class="text-[11px] font-black text-primary uppercase">{{ formatDateOnly(ticket.created_at) }}</span>
                          <span class="text-[9px] font-bold text-tertiary uppercase">{{ formatTimeOnly(ticket.created_at) }}</span>
                        </div>
                      </td>
                      <td class="px-8 py-4 text-right">
                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button class="p-2 hover:text-accent transition-colors">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (!helpdeskService.isLoading() && helpdeskService.tickets().length === 0) {
            <div class="flex flex-col items-center justify-center py-40 animate-fade-in">
               <div class="w-20 h-20 bg-[var(--bg-surface-2)] rounded-full flex items-center justify-center text-tertiary mb-8">
                  <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
               </div>
               <h3 class="text-xl font-black text-primary mb-2">Registry Empty</h3>
               <p class="text-tertiary font-bold uppercase tracking-widest text-[10px] mb-8">No directives located in current synchronization</p>
               <button (click)="clearFilters()" class="btn-precision btn-secondary-precision btn-sm px-10">
                  Reset Command
               </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class TicketListComponent implements OnInit, OnDestroy {
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  private destroy$ = new Subject<void>();

  public helpdeskService = inject(HelpdeskService);
  constructor() {}

  ngOnInit(): void {
    this.loadTickets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTickets(): void {
    const filters: any = {};
    if (this.statusFilter) filters.status = this.statusFilter;
    if (this.priorityFilter) filters.priority = this.priorityFilter;
    if (this.searchTerm) filters.search = this.searchTerm;

    this.helpdeskService.listTickets(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onFilterChange(): void {
    this.loadTickets();
  }

  onSearch(): void {
    this.loadTickets();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.loadTickets();
  }

  getStatusEliteClass(status: string): string {
    switch (status) {
      case 'Open': return 'online';
      case 'In Progress': return 'pending';
      case 'Waiting for Customer': return 'overdue';
      case 'Resolved': return 'active';
      case 'Closed': return 'synced';
      default: return 'synced';
    }
  }

  getPriorityEliteClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'pending';
      case 'Medium': return 'active';
      case 'Low': return 'synced';
      default: return 'synced';
    }
  }

  formatDateOnly(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatTimeOnly(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
}
