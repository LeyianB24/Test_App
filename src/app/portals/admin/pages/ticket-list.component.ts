import { inject, Component, OnInit, OnDestroy } from '@angular/core';
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
    <div class="page-container p-8 animate-up">
      <!-- Elite Page Header -->
      <header class="page-header-elite mb-12">
        <div class="header-info">
          <h1 class="premium-title">Support <span class="gradient-text">Tickets</span></h1>
          <p class="premium-subtitle">Manage your support tickets</p>
        </div>
        <div class="header-actions">
          <button [routerLink]="['/helpdesk/create']" class="modern-btn primary-btn btn-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/></svg>
            <span>New Ticket</span>
          </button>
        </div>
      </header>

      <!-- Statistics Pipeline -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="premium-stat-card p-6 animate-up delay-1">
          <div class="stat-info">
            <span class="stat-label">Open Tickets</span>
            <h3 class="stat-number text-blue-600">{{ helpdeskService.openTicketsCount() }}</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-blue-600">
             <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
        </div>
        <div class="premium-stat-card p-6 animate-up delay-2">
          <span class="stat-label">In Progress</span>
          <h3 class="stat-number text-amber-600">{{ helpdeskService.inProgressCount() }}</h3>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-amber-600">
             <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
        </div>
        <div class="premium-stat-card p-6 animate-up delay-3">
          <span class="stat-label">Waiting</span>
          <h3 class="stat-number text-purple-600">{{ helpdeskService.waitingCount() }}</h3>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-purple-600">
             <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          </div>
        </div>
        <div class="premium-stat-card p-6 animate-up delay-4">
          <span class="stat-label">Resolved</span>
          <h3 class="stat-number text-emerald-600">{{ helpdeskService.resolvedCount() }}</h3>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-emerald-600">
             <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>
      </div>

      <!-- Filters & Active Tickets Surface -->
      <div class="content-card-premium relative overflow-hidden animate-up delay-2">
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-slate-50 rounded-full blur-3xl"></div>
        
        <div class="p-8 border-b border-slate-100/50 bg-slate-50/30 relative z-10">
          <div class="flex flex-wrap gap-4 items-center">
            <div class="search-premium flex-grow max-w-md">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearch()" placeholder="Search tickets..." class="search-input-elite">
            </div>
            
            <div class="flex gap-3">
              <select [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" class="pill-btn outline-none">
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting for Customer">Waiting</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
              
              <select [(ngModel)]="priorityFilter" (ngModelChange)="onFilterChange()" class="pill-btn outline-none">
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <button (click)="clearFilters()" class="modern-btn outline-btn sm ml-auto">
               <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
               Reset Filters
            </button>
          </div>
        </div>

        <div class="relative z-10">
          @if (helpdeskService.isLoading()) {
            <div class="py-32 flex flex-col items-center">
              <div class="w-12 h-12 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
              <p class="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading tickets...</p>
            </div>
          }

          @if (helpdeskService.error() && !helpdeskService.isLoading()) {
            <div class="m-8 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold flex items-center gap-4 animate-scale">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
               {{ helpdeskService.error() }}
            </div>
          }

          @if (!helpdeskService.isLoading() && helpdeskService.tickets().length > 0) {
            <div class="table-responsive-elite">
              <table class="modern-table-elite w-full">
                <thead>
                  <tr>
                    <th class="pl-8">Ticket ID</th>
                    <th>Ticket Subject</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Date</th>
                    <th class="pr-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ticket of helpdeskService.tickets(); track ticket.id) {
                    <tr class="table-row-hover group cursor-pointer" [routerLink]="['/helpdesk', ticket.id]">
                      <td class="pl-8">
                        <span class="text-xs font-black text-slate-400 block mb-1 uppercase tracking-widest">Reference</span>
                        <span class="font-black text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">{{ ticket.ticket_number }}</span>
                      </td>
                      <td>
                        <span class="font-black text-slate-800 block truncate max-w-[200px] mb-1">{{ ticket.subject }}</span>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ ticket.category }}</span>
                      </td>
                      <td>
                        <div class="status-pill-elite" [class]="getStatusEliteClass(ticket.status)">
                          <span class="dot"></span>
                          {{ ticket.status }}
                        </div>
                      </td>
                      <td>
                        <div class="status-pill-elite" [class]="getPriorityEliteClass(ticket.priority)">
                          <span class="dot"></span>
                          {{ ticket.priority }}
                        </div>
                      </td>
                      <td>
                        <span class="text-[11px] font-black text-slate-700 block mb-1">{{ formatDateOnly(ticket.created_at) }}</span>
                        <span class="text-[10px] font-bold text-slate-400">{{ formatTimeOnly(ticket.created_at) }}</span>
                      </td>
                      <td class="pr-8 text-right">
                        <button class="icon-btn-elite ml-auto group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:scale-110">
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (!helpdeskService.isLoading() && helpdeskService.tickets().length === 0) {
            <div class="flex flex-col items-center justify-center py-40 animate-scale">
               <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
                  <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
               </div>
               <h3 class="text-xl font-black text-slate-800 mb-2">No Tickets Found</h3>
               <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">No tickets match your search criteria</p>
               <button (click)="clearFilters()" class="modern-btn primary-btn btn-icon">
                  Clear Filters
               </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1500px; margin: 0 auto; }
    .btn-icon span { margin-left: 8px; }
    .mr-2 { margin-right: 0.5rem; }
  `]
})
export class TicketListComponent implements OnInit, OnDestroy {
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  private destroy$ = new Subject<void>();

  // TODO: Check constructor replacements
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
      case 'Open': return 'synced';
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
      case 'Medium': return 'synced';
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return this.formatDateOnly(dateString) + ' ' + this.formatTimeOnly(dateString);
  }
}
