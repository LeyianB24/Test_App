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
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- Elite Header -->
        <header class="db-header-elite animate-fade-in">
          <div class="header-left">
            <div class="live-badge">
              <div class="live-dot"></div>
              SUPPORT TELEMETRY
            </div>
            <h1 class="premium-title">Service <span class="text-red">Intelligence</span></h1>
            <p class="premium-subtitle">Unified support directives registry · KRA Helpdesk Engine</p>
          </div>
          
          <div class="header-right no-print">
            <div class="view-toggle-elite">
              <button (click)="viewMode.set('list')" [class.active]="viewMode() === 'list'" title="List View">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <button (click)="viewMode.set('kanban')" [class.active]="viewMode() === 'kanban'" title="Kanban View">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 17V7m-7 10V7h14v10H2zm16-10v10h4V7h-4z"/></svg>
              </button>
            </div>
            <button class="btn-primary-elite" [routerLink]="['/helpdesk/create']">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              NEW DIRECTIVE
            </button>
          </div>
        </header>

        <!-- KPI Grid -->
        <div class="main-grid animate-fade-in" style="animation-delay: 0.1s">
          <div class="elite-card metric-card">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">OPEN SIGNALS</span>
              <div class="metric-value">{{ helpdeskService.openTicketsCount() }}</div>
            </div>
          </div>

          <div class="elite-card metric-card">
            <div class="card-glow"></div>
            <div class="card-icon text-gold">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">IN PROCESSING</span>
              <div class="metric-value text-gold">{{ helpdeskService.inProgressCount() }}</div>
            </div>
          </div>

          <div class="elite-card metric-card">
            <div class="card-glow"></div>
            <div class="card-icon text-red">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">AWAITING HANDSHAKE</span>
              <div class="metric-value text-red">{{ helpdeskService.waitingCount() }}</div>
            </div>
          </div>

          <div class="elite-card metric-card">
            <div class="card-glow"></div>
            <div class="card-icon text-green">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">RESOLVED</span>
              <div class="metric-value text-green">{{ helpdeskService.resolvedCount() }}</div>
            </div>
          </div>
        </div>

        <!-- Registry Panel -->
        <div class="elite-card table-panel animate-fade-in" style="animation-delay: 0.2s">
          <div class="card-glow"></div>
          <div class="table-toolbar-elite">
            <div class="filter-tabs-elite">
              <button class="filter-tab-elite" [class.active]="!statusFilter()" (click)="statusFilter.set('')">
                Registry <span class="tab-count-elite">{{ helpdeskService.tickets().length }}</span>
              </button>
              <button class="filter-tab-elite" [class.active]="statusFilter() === 'Open'" (click)="statusFilter.set('Open')">
                Open <span class="tab-count-elite">{{ helpdeskService.openTicketsCount() }}</span>
              </button>
            </div>
            
            <div class="search-box-elite">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
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
                      <div class="ri-period">{{ ticket.priority }} PRIORITY</div>
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
                        <div class="kanban-card-elite" [routerLink]="['/helpdesk', ticket.id]">
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
    :host {
      --red:          #D92B2B;
      --red-bright:   #EF3B3B;
      --red-glow:     rgba(217, 43, 43, 0.38);
      --red-pale:     rgba(217, 43, 43, 0.10);
      --red-border:   rgba(217, 43, 43, 0.22);

      --bg-root:  #080808;
      --bg-card:  #111111;
      --bg-input: #151515;
      
      --text-pri: #F5F5F7;
      --text-sec: #A1A1AA;
      --text-mut: #52525B;
      
      --bdr:      rgba(255, 255, 255, 0.05);
      --bdr-hr:   rgba(255, 255, 255, 0.08);
      
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    /* ═══════════════════════════════
       Layout & Background
       ═══════════════════════════════ */
    .db-root { 
      min-height: 100vh; 
      background: #050505 ;
      background-size: cover;
      color: var(--text-pri); 
      position: relative; 
      overflow-x: hidden; 
      padding-bottom: 5rem;
    }
    
    .db-root::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.02; z-index: 2; pointer-events: none; }

    .db-inner { 
      max-width: 1600px; 
      margin: 0 auto; 
      padding: 60px 40px; 
      display: flex; 
      flex-direction: column; 
      gap: 50px; 
      position: relative; 
      z-index: 10; 
    }

    /* Header Enhancement */
    .db-header-elite { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
    }
    .premium-title { 
      font-size: 56px; 
      font-weight: 950; 
      letter-spacing: -2.5px; 
      line-height: 0.9; 
      margin: 16px 0 12px; 
      text-transform: uppercase;
    }
    .text-red { 
      color: var(--red-bright); 
      -webkit-text-stroke: 1px var(--red-bright);
      text-shadow: 0 0 20px var(--red-glow);
    }
    .premium-subtitle { 
      font-size: 11px; 
      font-weight: 900; 
      color: var(--text-sec); 
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    .live-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--red-pale);
      border: 1px solid var(--red-border);
      border-radius: 100px;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 1.5px;
      color: var(--red-bright);
    }

    .live-dot {
      width: 6px;
      height: 6px;
      background: var(--red-bright);
      border-radius: 50%;
      box-shadow: 0 0 12px var(--red);
      animation: pulse-red 2s infinite;
    }

    @keyframes pulse-red {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 18px var(--red); }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .view-toggle-elite {
      display: flex;
      background: var(--bg-card);
      border: 1.5px solid var(--bdr-hr);
      border-radius: 18px;
      padding: 6px;
      gap: 4px;
    }

    .view-toggle-elite button {
      background: transparent;
      border: none;
      padding: 10px 14px;
      border-radius: 12px;
      color: var(--text-mut);
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
    }

    .view-toggle-elite button.active {
      background: var(--red-pale);
      color: var(--red-bright);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .btn-primary-elite {
      background: var(--red);
      color: white;
      border: none;
      padding: 16px 32px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 1.2px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 30px var(--red-glow);
    }

    .btn-primary-elite:hover {
      background: var(--red-bright);
      box-shadow: 0 15px 40px var(--red);
      transform: translateY(-3px) scale(1.02);
    }

    /* ═══════════════════════════════
       Main Grid & Metrics
       ═══════════════════════════════ */
    .elite-card { 
      background: rgba(20, 20, 20, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08); 
      border-radius: 32px; 
      padding: 32px; 
      position: relative; 
      overflow: hidden; 
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .elite-card:hover { 
      background: rgba(20, 20, 20, 0.6);
      border-color: rgba(217, 43, 43, 0.3); 
      transform: translateY(-5px) scale(1.01); 
      box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 20px rgba(217, 43, 43, 0.1); 
    }

    .card-glow { position: absolute; inset: 0; background: radial-gradient(circle at top right, var(--red), transparent 70%); opacity: 0.03; pointer-events: none; }

    .metric-card {
      padding: 32px;
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .card-icon {
      width: 56px;
      height: 56px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1.5px solid var(--bdr-hr);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-sec);
      transition: all 0.3s;
    }

    .metric-card:hover .card-icon {
      background: var(--red-pale);
      border-color: var(--red-border);
      color: var(--red-bright);
      transform: scale(1.1) rotate(4deg);
    }

    .card-icon.text-gold { color: #F59E0B; }
    .card-icon.text-red { color: var(--red-bright); }
    .card-icon.text-green { color: #22C55E; }

    .metric-label {
      font-size: 10px;
      font-weight: 950;
      color: var(--text-mut);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .metric-value {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1;
    }

    /* ═══════════════════════════════
       Registry List View Architecture
       ═══════════════════════════════ */
    .table-panel { padding: 0; }
    
    .table-toolbar-elite {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px 40px;
      background: rgba(255, 255, 255, 0.01);
      border-bottom: 1px solid var(--bdr-hr);
    }

    .filter-tabs-elite {
      display: flex;
      gap: 32px;
    }

    .filter-tab-elite {
      background: transparent;
      border: none;
      font-size: 11px;
      font-weight: 950;
      color: var(--text-mut);
      letter-spacing: 1.2px;
      cursor: pointer;
      padding: 12px 0;
      position: relative;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .filter-tab-elite.active { color: var(--text-pri); }
    .filter-tab-elite.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--red-bright);
      box-shadow: 0 0 15px var(--red-glow);
    }

    .tab-count-elite {
      font-size: 9px;
      font-weight: 900;
      background: var(--bg-card);
      color: var(--text-mut);
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid var(--bdr-hr);
    }

    .filter-tab-elite.active .tab-count-elite {
      background: var(--red);
      color: white;
      border-color: transparent;
    }

    .search-box-elite {
      position: relative;
      width: 320px;
    }

    .search-box-elite svg {
      position: absolute;
      left: 18px;
      top: 14px;
      color: var(--text-mut);
    }

    .search-box-elite input {
      width: 100%;
      background: var(--bg-input);
      border: 1.5px solid var(--bdr-hr);
      border-radius: 16px;
      padding: 14px 20px 14px 50px;
      color: var(--text-pri);
      font-size: 13px;
      font-weight: 600;
      outline: none;
      transition: all 0.3s;
    }

    .search-box-elite input:focus {
      border-color: var(--red-bright);
      box-shadow: 0 0 20px var(--red-pale);
    }

    .registry-item {
      display: grid;
      grid-template-columns: 160px 1fr 320px;
      align-items: center;
      padding: 28px 40px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .registry-item:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(217, 43, 43, 0.2);
      transform: translateX(10px);
    }

    .ri-left {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .ri-type {
      font-size: 11px;
      font-weight: 950;
      color: var(--red-bright);
      letter-spacing: 1.5px;
    }

    .ri-period {
      font-size: 10px;
      font-weight: 800;
      color: var(--text-mut);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .customer-info-elite {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .customer-avatar-elite {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: var(--bg-card);
      border: 1.5px solid var(--bdr-hr);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 950;
      color: var(--red-bright);
    }

    .customer-name-elite {
      font-size: 16px;
      font-weight: 800;
      color: var(--text-pri);
      letter-spacing: -0.2px;
      margin-bottom: 2px;
    }

    .ri-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 32px;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 1px;
    }

    .status-badge.online { background: rgba(34, 197, 94, 0.1); color: #22C55E; }
    .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
    .status-badge.overdue { background: var(--red-pale); color: var(--red-bright); }
    .status-badge.active { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }

    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .btn-table-action {
      padding: 10px 20px;
      font-size: 10px;
      border-radius: 14px;
    }

    /* ═══════════════════════════════
       Kanban Architecture
       ═══════════════════════════════ */
    .kanban-grid-elite {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 32px;
      padding: 40px;
      background: rgba(0, 0, 0, 0.2);
    }

    .kanban-column-elite {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .column-header-elite {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 2px;
      color: var(--text-mut);
      padding-bottom: 12px;
      border-bottom: 1px solid var(--bdr-hr);
    }

    .column-count-elite {
      padding: 2px 8px;
      border-radius: 6px;
      background: var(--bg-card);
      color: var(--text-sec);
      border: 1px solid var(--bdr-hr);
    }
    
    .column-content-elite {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .kanban-card-elite {
      background: var(--bg-card);
      border: 1.5px solid var(--bdr-hr);
      border-radius: 24px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    .kanban-card-elite:hover {
      background: #151515;
      border-color: var(--red-border);
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    
    .kanban-card-elite .ri-type { margin-bottom: 10px; }
    .kanban-card-elite .customer-name-elite { font-size: 14px; margin-bottom: 10px; }
    
    .card-footer-elite {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid var(--bdr-hr);
    }

    .priority-marker {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-mut);
    }
    .priority-marker.critical { background: var(--red-bright); box-shadow: 0 0 10px var(--red-glow); }
    .priority-marker.high { background: #F59E0B; }

    .loading-state-elite {
      padding: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      color: var(--text-sec);
    }

    .spin-elite {
      width: 40px;
      height: 40px;
      border: 3.5px solid var(--bdr-hr);
      border-top-color: var(--red-bright);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    @media (max-width: 1400px) {
      .kanban-grid-elite { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 1100px) {
      .main-grid { grid-template-columns: repeat(2, 1fr); }
      .registry-item { grid-template-columns: 100px 1fr 180px; }
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
