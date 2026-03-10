import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';
import { CommonModule, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ticket-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, CommonModule, UpperCasePipe],
  template: `
    <div class="db-root animate-fade-in">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- Elite Header -->
        <header class="db-header-elite">
          <div class="header-left">
            <div class="live-badge">
              <div class="live-dot"></div>
              SUPPORT TELEMETRY
            </div>
            <h1 class="premium-title">Service <span class="text-red">Intelligence</span></h1>
            <p class="premium-subtitle">Unified support directives registry · KRA Helpdesk Engine</p>
          </div>
          
          <div class="header-right">
            <div class="view-toggle-elite">
              <button (click)="viewMode.set('list')" [class.active]="viewMode() === 'list'">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <button (click)="viewMode.set('kanban')" [class.active]="viewMode() === 'kanban'">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 17V7m-7 10V7h14v10H2zm16-10v10h4V7h-4z"/></svg>
              </button>
            </div>
            <button class="btn-primary-elite" [routerLink]="['/helpdesk/create']">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              NEW DIRECTIVE
            </button>
          </div>
        </header>

        <!-- KPI Grid -->
        <div class="main-grid animate-fade-stagger">
          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">OPEN SIGNALS</span>
              <div class="metric-value">{{ helpdeskService.openTicketsCount() }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon text-gold">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">IN PROCESSING</span>
              <div class="metric-value text-gold">{{ helpdeskService.inProgressCount() }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon text-red">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">AWAITING HANDSHAKE</span>
              <div class="metric-value text-red">{{ helpdeskService.waitingCount() }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon text-green">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">RESOLVED</span>
              <div class="metric-value text-green">{{ helpdeskService.resolvedCount() }}</div>
            </div>
          </div>
        </div>

        <!-- Registry List View -->
        <div class="elite-card table-panel animate-fade-in" style="animation-delay: 0.2s">
          <div class="card-glow"></div>
          <div class="table-toolbar-elite">
            <div class="filter-tabs-elite">
              <button class="filter-tab-elite" [class.active]="!statusFilter()" (click)="statusFilter.set('')">
                Registry <span class="tab-count-elite">{{ helpdeskService.tickets().length }}</span>
              </button>
              <button class="filter-tab-elite" [class.active]="statusFilter() === 'Open'" (click)="statusFilter.set('Open')">
                Open <span class="tab-count-elite active">{{ helpdeskService.openTicketsCount() }}</span>
              </button>
            </div>
            <div class="search-box-elite">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" [ngModel]="searchTerm()" (ngModelChange)="searchTerm.set($event)" placeholder="Trace directive signals...">
            </div>
          </div>

          @if (helpdeskService.isLoading()) {
            <div class="loading-state-elite">
              <div class="spin-elite"></div>
              <span>Synchronizing Registry...</span>
            </div>
          } @else {
            @if (viewMode() === 'list') {
              <div class="registry-list">
                @for (ticket of filteredTickets(); track ticket.id) {
                  <div class="registry-item animate-fade-in">
                    <div class="ri-left">
                      <div class="ri-type">#{{ ticket.ticket_number }}</div>
                      <div class="ri-period">{{ ticket.priority | uppercase }} PRIORITY</div>
                    </div>
                    <div class="ri-center">
                      <div class="customer-info-elite">
                        <div class="customer-avatar-elite">{{ ticket.subject.charAt(0) }}</div>
                        <div class="customer-details-elite">
                          <div class="customer-name-elite">{{ ticket.subject }}</div>
                          <div class="ri-period">{{ ticket.category }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="ri-right">
                      <span class="status-badge" [class]="getStatusBadgeClass(ticket.status)">
                        <span class="status-dot"></span>
                        {{ ticket.status | uppercase }}
                      </span>
                      <button class="btn-primary-elite btn-table-action" [routerLink]="['/helpdesk', ticket.id]">
                        VIEW INTEL
                      </button>
                    </div>
                  </div>
                } @empty {
                  <div class="empty-state-elite">
                    <p>No support records identified in the current telemetry span.</p>
                  </div>
                }
              </div>
            } @else {
              <!-- Kanban View Architecture -->
              <div class="kanban-grid-elite">
                @for (group of kanbanGroups; track group.status) {
                  <div class="kanban-column-elite">
                    <div class="column-header-elite">
                      <span>{{ group.label | uppercase }}</span>
                      <span class="column-count-elite">{{ group.tickets.length }}</span>
                    </div>
                    <div class="column-content-elite">
                      @for (ticket of group.tickets; track ticket.id) {
                        <div class="kanban-card-elite group" [routerLink]="['/helpdesk', ticket.id]">
                          <div class="ri-type">#{{ ticket.ticket_number }}</div>
                          <div class="customer-name-elite">{{ ticket.subject }}</div>
                          <div class="ri-period">{{ ticket.category }}</div>
                          <div class="card-footer-elite">
                            <div class="priority-marker" [class]="ticket.priority.toLowerCase()"></div>
                            <span class="ri-period">{{ ticket.priority }}</span>
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
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

    :host {
      --kra-red: #C0392B;
      --kra-red-light: #E74C3C;
      --kra-red-pale: rgba(192,57,43,0.08);
      --kra-red-glow: rgba(192,57,43,0.25);
      
      --kra-green: #1A7A3C;
      --kra-green-light: #22A052;
      --kra-green-pale: rgba(26,122,60,0.08);

      --kra-gold: #F59E0B;
      --kra-gold-pale: rgba(245,158,11,0.1);
      
      --bg-root: #0B0F0E;
      --bg-card: #14201A;
      --bg-card-2: #192820;
      --bg-card-3: #1C2B22;
      
      --text-pri: #E8F5EC;
      --text-sec: #8EA898;
      --text-mut: #4A6258;

      --bdr: rgba(26,122,60,0.15);
      --bdr-md: rgba(26,122,60,0.25);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    .db-root { min-height: 100vh; background: var(--bg-root); color: var(--text-pri); position: relative; overflow: hidden; }
    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.03; z-index: 1; pointer-events: none; }
    .accent-bleed { position: fixed; top: -10vw; right: -10vw; width: 40vw; height: 40vw; background: var(--kra-red); filter: blur(15vw); opacity: 0.05; border-radius: 50%; z-index: 1; pointer-events: none; }

    .db-inner { max-width: 1440px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 40px; position: relative; z-index: 10; }

    /* Header Architecture */
    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; }
    .premium-title { font-size: 40px; font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--kra-red-light); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--kra-red-pale); border: 1px solid rgba(192,57,43,0.2); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--kra-red-light); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kra-red-light); box-shadow: 0 0 10px var(--kra-red-glow); animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .header-right { display: flex; align-items: center; gap: 20px; }
    .view-toggle-elite { display: flex; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 14px; padding: 4px; }
    .view-toggle-elite button { background: none; border: none; padding: 8px 12px; border-radius: 10px; color: var(--text-mut); cursor: pointer; transition: all 0.3s; }
    .view-toggle-elite button.active { background: var(--bg-card-3); color: var(--text-pri); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }

    .btn-primary-elite { background: var(--kra-red); border: none; color: white; padding: 12px 24px; border-radius: 14px; display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 24px var(--kra-red-glow); }
    .btn-primary-elite:hover { transform: translateY(-2px); background: var(--kra-red-light); box-shadow: 0 12px 32px var(--kra-red-glow); }

    /* Main Grid & Metrics */
    .main-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 28px; padding: 24px; position: relative; overflow: hidden; transition: all 0.3s; }
    .metric-card { display: flex; align-items: center; gap: 20px; }
    .card-glow { position: absolute; inset: 0; background: radial-gradient(circle at top left, var(--kra-red), transparent 70%); opacity: 0; transition: opacity 0.4s; }
    .elite-card:hover .card-glow { opacity: 0.05; }
    .elite-card:hover { border-color: var(--bdr-md); transform: translateY(-2px); }

    .card-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--bg-card-2); border: 1px solid var(--bdr); display: flex; align-items: center; justify-content: center; color: var(--text-sec); flex-shrink: 0; }
    .card-icon.text-gold { color: var(--kra-gold); background: var(--kra-gold-pale); border-color: rgba(245,158,11,0.2); }
    .card-icon.text-red { color: var(--kra-red-light); background: var(--kra-red-pale); border-color: rgba(192,57,43,0.2); }
    .card-icon.text-green { color: var(--kra-green-light); background: var(--kra-green-pale); border-color: rgba(34,160,82,0.2); }

    .metric-content { display: flex; flex-direction: column; }
    .metric-label { font-size: 10px; font-weight: 900; color: var(--text-mut); letter-spacing: 1.5px; margin-bottom: 4px; }
    .metric-value { font-size: 28px; font-weight: 950; letter-spacing: -1px; }

    /* Registry List Table Area */
    .table-panel { padding: 0; }
    .table-toolbar-elite { display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; border-bottom: 1px solid var(--bdr); background: var(--bg-card-2); }
    
    .filter-tabs-elite { display: flex; gap: 24px; }
    .filter-tab-elite { background: none; border: none; font-size: 11px; font-weight: 900; color: var(--text-mut); letter-spacing: 1px; cursor: pointer; position: relative; padding: 8px 0; transition: color 0.3s; display: flex; align-items: center; gap: 8px; }
    .filter-tab-elite.active { color: var(--text-pri); }
    .filter-tab-elite.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--kra-red); border-radius: 2px; box-shadow: 0 0 8px var(--kra-red-glow); }
    
    .tab-count-elite { font-size: 9px; padding: 2px 6px; border-radius: 6px; background: var(--bg-card-3); color: var(--text-mut); }
    .tab-count-elite.active { background: var(--kra-red-pale); color: var(--kra-red-light); }

    .search-box-elite { display: flex; align-items: center; gap: 12px; background: var(--bg-card-3); border: 1px solid var(--bdr); border-radius: 14px; padding: 0 16px; width: 320px; height: 44px; transition: border-color 0.3s; }
    .search-box-elite:focus-within { border-color: var(--kra-red-light); }
    .search-box-elite input { background: none; border: none; color: var(--text-pri); font-size: 12px; font-weight: 600; width: 100%; outline: none; }
    .search-box-elite input::placeholder { color: var(--text-mut); }

    .registry-list { display: flex; flex-direction: column; }
    .registry-item { display: grid; grid-template-columns: 140px 1fr 280px; align-items: center; padding: 20px 32px; border-bottom: 1px solid var(--bdr); transition: all 0.3s; }
    .registry-item:hover { background: var(--bg-card-2); }
    
    .ri-left { display: flex; flex-direction: column; gap: 4px; }
    .ri-type { font-size: 11px; font-weight: 900; color: var(--kra-red-light); letter-spacing: 1px; }
    .ri-period { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 0.5px; }

    .customer-info-elite { display: flex; align-items: center; gap: 16px; }
    .customer-avatar-elite { width: 40px; height: 40px; border-radius: 12px; background: var(--bg-card-3); border: 1px solid var(--bdr-md); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 950; color: var(--kra-red-light); }
    .customer-details-elite { display: flex; flex-direction: column; }
    .customer-name-elite { font-size: 15px; font-weight: 800; color: var(--text-pri); margin-bottom: 2px; }

    .ri-right { display: flex; align-items: center; justify-content: flex-end; gap: 24px; }
    .status-badge { display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 10px; font-size: 10px; font-weight: 900; letter-spacing: 1px; }
    .status-badge.online { background: var(--kra-green-pale); color: var(--kra-green-light); }
    .status-badge.pending { background: var(--kra-gold-pale); color: var(--kra-gold); }
    .status-badge.overdue { background: var(--kra-red-pale); color: var(--kra-red-light); }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .btn-table-action { padding: 8px 16px; font-size: 10px; }

    /* Kanban Architecture */
    .kanban-grid-elite { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding: 32px; background: rgba(0,0,0,0.1); }
    .kanban-column-elite { display: flex; flex-direction: column; gap: 16px; }
    .column-header-elite { display: flex; justify-content: space-between; align-items: center; font-size: 10px; font-weight: 950; letter-spacing: 2px; color: var(--text-mut); margin-bottom: 8px; }
    .column-count-elite { padding: 2px 8px; border-radius: 6px; background: var(--bg-card-2); color: var(--text-sec); }
    
    .column-content-elite { display: flex; flex-direction: column; gap: 16px; }
    .kanban-card-elite { background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 20px; padding: 20px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
    .kanban-card-elite:hover { background: var(--bg-card-3); border-color: var(--kra-red-border); transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.3); }
    
    .kanban-card-elite .ri-type { font-size: 9px; margin-bottom: 8px; }
    .kanban-card-elite .customer-name-elite { font-size: 13px; line-height: 1.4; margin-bottom: 8px; }
    
    .card-footer-elite { display: flex; align-items: center; gap: 10px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--bdr); }
    .priority-marker { width: 4px; height: 4px; border-radius: 50%; background: var(--text-mut); }
    .priority-marker.critical { background: var(--kra-red-light); box-shadow: 0 0 6px var(--kra-red-glow); }
    .priority-marker.high { background: var(--kra-gold); }

    .loading-state-elite { padding: 80px; display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--text-sec); font-size: 13px; font-weight: 800; letter-spacing: 1px; }
    .spin-elite { width: 32px; height: 32px; border: 3px solid var(--bdr); border-top-color: var(--kra-red-light); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Animations Stagger */
    .animate-fade-stagger > * { opacity: 0; animation: fadeIn 0.6s ease-out forwards; }
    .animate-fade-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-fade-stagger > *:nth-child(2) { animation-delay: 0.2s; }
    .animate-fade-stagger > *:nth-child(3) { animation-delay: 0.3s; }
    .animate-fade-stagger > *:nth-child(4) { animation-delay: 0.4s; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 1200px) {
      .main-grid { grid-template-columns: repeat(2, 1fr); }
      .kanban-grid-elite { grid-template-columns: repeat(2, 1fr); }
      .registry-item { grid-template-columns: 100px 1fr 180px; font-size: 12px; }
    }
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
