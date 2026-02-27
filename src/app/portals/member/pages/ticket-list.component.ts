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
      <header class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 class="text-5xl font-black text-white tracking-tighter mb-2">Support <span class="text-blue-500">Tickets</span></h1>
          <p class="text-slate-400 font-medium text-lg">Track, manage, and escalate your support requests</p>
        </div>
        <div class="flex gap-4">
          <button (click)="viewMode.set('list')" [class.active]="viewMode() === 'list'" class="mode-btn">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <button (click)="viewMode.set('kanban')" [class.active]="viewMode() === 'kanban'" class="mode-btn">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17V7m-7 10V7h14v10H2zm16-10v10h4V7h-4z"/></svg>
          </button>
          <button [routerLink]="['/helpdesk/create']" class="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
            Create New Ticket
          </button>
        </div>
      </header>

      <!-- Statistics Pipeline -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="stat-glass border-l-4 border-blue-500">
          <span class="label">Open Tickets</span>
          <h3 class="value text-blue-500">{{ helpdeskService.openTicketsCount() }}</h3>
        </div>
        <div class="stat-glass border-l-4 border-amber-500">
          <span class="label">In Progress</span>
          <h3 class="value text-amber-500">{{ helpdeskService.inProgressCount() }}</h3>
        </div>
        <div class="stat-glass border-l-4 border-orange-500">
          <span class="label">Waiting On You</span>
          <h3 class="value text-orange-500">{{ helpdeskService.waitingCount() }}</h3>
        </div>
        <div class="stat-glass border-l-4 border-emerald-500">
          <span class="label">Resolved</span>
          <h3 class="value text-emerald-500">{{ helpdeskService.resolvedCount() }}</h3>
        </div>
      </div>

      <!-- Filters & Active Tickets Surface -->
      <div class="card-glass p-8 rounded-[3rem] border border-white/5">
        <div class="flex flex-wrap gap-4 mb-8">
          <div class="relative flex-grow min-w-[300px]">
            <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Search by ticket # or subject..." class="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:border-blue-500 outline-none font-bold text-sm">
            <svg class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" class="bg-white/5 border border-white/10 text-slate-300 px-6 py-4 rounded-2xl focus:border-blue-500 outline-none font-bold text-sm">
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Customer">Waiting for Response</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select [ngModel]="priorityFilter()" (ngModelChange)="priorityFilter.set($event)" class="bg-white/5 border border-white/10 text-slate-300 px-6 py-4 rounded-2xl focus:border-blue-500 outline-none font-bold text-sm">
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        @if (helpdeskService.isLoading()) {
          <div class="py-20 flex flex-col items-center">
            <div class="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p class="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving secure records...</p>
          </div>
        } @else if (helpdeskService.tickets().length === 0) {
          <div class="py-20 text-center">
            <div class="text-slate-600 mb-6 flex justify-center">
               <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <p class="text-slate-400 font-black text-xl mb-2">No Support History</p>
            <p class="text-slate-600 text-sm mb-8">You haven't filed any tickets yet. Need help?</p>
            <button [routerLink]="['/helpdesk/create']" class="text-blue-500 font-black uppercase text-xs tracking-widest border border-blue-500/20 px-8 py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all">Submit Inquiry</button>
          </div>
        } @else {
          @if (viewMode() === 'list') {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-separate border-spacing-y-4">
                <thead>
                  <tr class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5">
                    <th class="px-6 py-4">Ticket ID</th>
                    <th class="px-6 py-4">Information</th>
                    <th class="px-6 py-4 text-center">Status</th>
                    <th class="px-6 py-4 text-center">Priority</th>
                    <th class="px-6 py-4">Created</th>
                    <th class="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ticket of filteredTickets(); track ticket.id) {
                    <tr class="hover:bg-white/5 transition-all group rounded-2xl">
                      <td class="px-6 py-6 bg-slate-800/20 rounded-l-2xl">
                        <span class="text-white font-black text-sm">{{ ticket.ticket_number }}</span>
                      </td>
                      <td class="px-6 py-6 bg-slate-800/20">
                        <span class="text-white font-bold block mb-1 text-sm">{{ ticket.subject }}</span>
                        <span class="text-slate-500 text-[10px] font-black uppercase tracking-widest">{{ ticket.category }}</span>
                      </td>
                      <td class="px-6 py-6 bg-slate-800/20 text-center">
                        <span class="badge-elite" [class]="getStatusBadgeClass(ticket.status)">{{ ticket.status }}</span>
                      </td>
                      <td class="px-6 py-6 bg-slate-800/20 text-center">
                        <span class="badge-elite" [class]="getPriorityBadgeClass(ticket.priority)">{{ ticket.priority }}</span>
                      </td>
                      <td class="px-6 py-6 bg-slate-800/20">
                        <span class="text-slate-400 text-xs font-bold">{{ ticket.created_at | date:'medium' }}</span>
                      </td>
                      <td class="px-6 py-6 bg-slate-800/20 rounded-r-2xl text-right">
                        <button [routerLink]="['/helpdesk', ticket.id]" class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white text-slate-400 hover:text-black transition-all">
                           <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <!-- Kanban View -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
               @for (group of kanbanGroups; track group.status) {
                  <div class="kanban-col bg-black/20 p-6 rounded-[2rem] border border-white/5">
                     <div class="flex items-center justify-between mb-6">
                        <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-500">{{ group.label }}</h4>
                        <span class="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400">{{ group.tickets.length }}</span>
                     </div>
                     <div class="space-y-4">
                        @for (ticket of group.tickets; track ticket.id) {
                           <div [routerLink]="['/helpdesk', ticket.id]" class="kanban-card p-5 bg-slate-800/60 rounded-2xl border border-white/5 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer">
                              <span class="text-[9px] font-black text-blue-400 block mb-2">{{ ticket.ticket_number }}</span>
                              <h5 class="text-white font-bold text-sm leading-tight mb-4">{{ ticket.subject }}</h5>
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
    .page-container { max-width: 1500px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .stat-glass { background: rgba(30, 41, 59, 0.4); padding: 24px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); }
    .stat-glass .label { font-size: 0.65rem; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
    .stat-glass .value { font-size: 2rem; font-weight: 950; margin: 0; }

    .card-glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); }
    .mode-btn { background: rgba(255,255,255,0.05); width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #64748B; transition: 0.3s; border: 1px solid transparent; }
    .mode-btn.active { background: #3B82F6; color: white; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); }
    .mode-btn:hover:not(.active) { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.1); }

    .badge-elite { padding: 4px 12px; border-radius: 8px; font-size: 0.65rem; font-weight: 900; background: rgba(255,255,255,0.05); color: #94A3B8; text-transform: uppercase; white-space: nowrap; }
    .badge-open { color: #3B82F6; background: rgba(59, 130, 246, 0.1); }
    .badge-progress { color: #F59E0B; background: rgba(245, 158, 11, 0.1); }
    .badge-waiting { color: #F97316; background: rgba(249, 115, 22, 0.1); }
    .badge-resolved { color: #10B981; background: rgba(16, 185, 129, 0.1); }
    .badge-critical { color: white; background: #E31E24; }
    .badge-high { color: #E31E24; background: rgba(227, 30, 36, 0.1); }
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
      case 'Open': return 'badge-open';
      case 'In Progress': return 'badge-progress';
      case 'Waiting for Customer': return 'badge-waiting';
      case 'Resolved': return 'badge-resolved';
      default: return '';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      default: return '';
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
