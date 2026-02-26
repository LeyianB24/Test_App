import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container animate-up">
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Support <span class="gradient-text">Tickets</span></h1>
          <p class="premium-subtitle">Track, manage, and escalate your support requests</p>
        </div>
        <div class="header-actions">
          <button [routerLink]="['/helpdesk/create']" class="modern-btn primary-btn btn-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>New Ticket</span>
          </button>
        </div>
      </header>

      <!-- Statistics Pipeline -->
      <div class="stats-grid mt-32">
        <div class="stat-card premium-stat-card border-blue">
          <span class="stat-label">Open Tickets</span>
          <h3 class="stat-value text-blue">{{ helpdeskService.openTicketsCount() }}</h3>
        </div>
        <div class="stat-card premium-stat-card border-yellow">
          <span class="stat-label">In Progress</span>
          <h3 class="stat-value text-yellow">{{ helpdeskService.inProgressCount() }}</h3>
        </div>
        <div class="stat-card premium-stat-card border-orange">
          <span class="stat-label">Waiting for Response</span>
          <h3 class="stat-value text-orange">{{ helpdeskService.waitingCount() }}</h3>
        </div>
        <div class="stat-card premium-stat-card border-green">
          <span class="stat-label">Resolved</span>
          <h3 class="stat-value text-green">{{ helpdeskService.resolvedCount() }}</h3>
        </div>
      </div>

      <!-- Filters & Active Tickets Surface -->
      <div class="content-card-premium mt-32 p-32">
        <div class="filters-row mb-24">
          <div class="search-box">
            <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="onSearch()" placeholder="Search tickets..." class="premium-input-sm">
            <div class="search-icon"><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
          </div>
          <select [(ngModel)]="statusFilter" (ngModelChange)="onFilterChange()" class="premium-select-sm">
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Customer">Waiting for Response</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select [(ngModel)]="priorityFilter" (ngModelChange)="onFilterChange()" class="premium-select-sm">
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <button (click)="clearFilters()" class="modern-btn outline-btn hidden-mobile">Clear Filters</button>
        </div>

        @if (helpdeskService.isLoading()) {
          <div class="loading-state">
            <div class="spin"></div>
            <p>Loading tickets...</p>
          </div>
        }

        @if (helpdeskService.error() && !helpdeskService.isLoading()) {
          <div class="error-banner">
            {{ helpdeskService.error() }}
          </div>
        }

        @if (!helpdeskService.isLoading() && helpdeskService.tickets().length > 0) {
          <div class="table-responsive">
            <table class="elite-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Subject & Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (ticket of helpdeskService.tickets(); track ticket.id) {
                  <tr>
                    <td>
                      <span class="font-bold text-main block">{{ ticket.ticket_number }}</span>
                    </td>
                    <td>
                      <span class="font-bold text-main block">{{ ticket.subject }}</span>
                      <span class="text-xs text-muted block mt-1">{{ ticket.category }}</span>
                    </td>
                    <td>
                      <span class="badge" [class]="getStatusBadgeClass(ticket.status)">{{ ticket.status }}</span>
                    </td>
                    <td>
                      <span class="badge" [class]="getPriorityBadgeClass(ticket.priority)">{{ ticket.priority }}</span>
                    </td>
                    <td>
                      <span class="text-sm text-muted">{{ formatDate(ticket.created_at) }}</span>
                    </td>
                    <td>
                      <button [routerLink]="['/helpdesk', ticket.id]" class="icon-btn" title="View Ticket">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        @if (!helpdeskService.isLoading() && helpdeskService.tickets().length === 0) {
          <div class="empty-state text-center py-12">
            <div class="es-icon mx-auto mb-4 text-gray-400">
               <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <p class="text-muted font-bold mb-4">No tickets found matching your criteria</p>
            <button [routerLink]="['/helpdesk/create']" class="modern-btn primary-btn mx-auto">Create Your First Ticket</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .mt-32 { margin-top: 32px; }
    .mb-24 { margin-bottom: 24px; }
    .p-32 { padding: 32px; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
    .stat-card { padding: 24px; }
    .border-blue { border-top: 4px solid #3B82F6; }
    .border-yellow { border-top: 4px solid #F59E0B; }
    .border-orange { border-top: 4px solid #F97316; }
    .border-green { border-top: 4px solid #10B981; }
    
    .stat-label { color: var(--text-muted); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
    .stat-value { font-size: 2rem; font-weight: 900; margin: 0; }
    .text-blue { color: #3B82F6; }
    .text-yellow { color: #F59E0B; }
    .text-orange { color: #F97316; }
    .text-green { color: #10B981; }
    
    .premium-stat-card { background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s; }
    .premium-stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
    .content-card-premium { background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
    
    .filters-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .search-box { display: flex; align-items: center; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 0 16px; flex: 1; min-width: 250px; transition: 0.3s; }
    .search-box:focus-within { border-color: var(--kra-red); box-shadow: 0 0 0 4px rgba(227,30,36,0.1); background: white; }
    .premium-input-sm { border: none; background: transparent; padding: 12px 0; outline: none; width: 100%; color: var(--text-main); font-size: 0.95rem; font-weight: 600; }
    .search-icon { color: #94A3B8; margin-left: auto; }
    
    .premium-select-sm { padding: 12px 16px; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; font-weight: 600; color: var(--text-main); font-size: 0.95rem; outline: none; cursor: pointer; transition: 0.3s; min-width: 180px; }
    .premium-select-sm:focus { border-color: var(--kra-red); background: white; box-shadow: 0 0 0 4px rgba(227,30,36,0.1); }
    
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
    .mx-auto { margin-left: auto; margin-right: auto; }
    .text-center { text-align: center; }
    
    .badge { display: inline-block; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.5px; }
    .badge-blue { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
    .badge-yellow { background: #FEF3C7; color: #D97706; border: 1px solid #FDE68A; }
    .badge-orange { background: #FFEDD5; color: #EA580C; border: 1px solid #FED7AA; }
    .badge-green { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
    .badge-gray { background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; }
    .badge-red { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
    
    .icon-btn { background: var(--bg-hover); border: none; width: 36px; height: 36px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; color: var(--text-secondary); cursor: pointer; transition: 0.2s; }
    .icon-btn:hover { background: var(--kra-red); color: white; transform: scale(1.05); }
    
    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 60px; }
    .spin { width: 40px; height: 40px; border: 4px solid var(--border-color); border-top-color: var(--kra-red); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .error-banner { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; padding: 16px 24px; border-radius: 12px; font-weight: 600; margin-bottom: 24px; }
    
    @media (max-width: 768px) {
      .filters-row { flex-direction: column; align-items: stretch; }
      .hidden-mobile { display: none; }
    }
  `]
})
export class TicketListComponent implements OnInit, OnDestroy {
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  private destroy$ = new Subject<void>();

  constructor(public helpdeskService: HelpdeskService) {}

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

  getStatusBadgeClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'Open': 'badge-blue',
      'In Progress': 'badge-yellow',
      'Waiting for Customer': 'badge-orange',
      'Resolved': 'badge-green',
      'Closed': 'badge-gray',
      'Reopened': 'badge-red'
    };
    return statusClasses[status] || 'badge-gray';
  }

  getPriorityBadgeClass(priority: string): string {
    const priorityClasses: Record<string, string> = {
      'Low': 'badge-green',
      'Medium': 'badge-blue',
      'High': 'badge-orange',
      'Critical': 'badge-red'
    };
    return priorityClasses[priority] || 'badge-gray';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute:'2-digit' });
  }
}
