import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, UpperCasePipe],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- ═══════════════════════════════
             Premium Header
             ═══════════════════════════════ -->
        <header class="db-header-elite animate-fade-in">
          <div class="header-left">
            <div class="flex items-center gap-4 mb-4">
              <a routerLink="/helpdesk" class="btn-ghost-elite">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div class="live-badge">
                <div class="live-dot"></div>
                INTEL #{{ ticket()?.ticket_number || 'SYNCING...' }}
              </div>
            </div>
            <h1 class="premium-title">Directive <span class="text-red">Telemetry</span></h1>
            <p class="premium-subtitle">Neural terminal synchronization & status audit</p>
          </div>
          
          <div class="header-right">
            @if (ticket() && !['Resolved', 'Closed'].includes(ticket()!.status)) {
              <button class="btn-primary-elite" (click)="updateStatus('Resolved')">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
                FINALIZE RESOLUTION
              </button>
            }
          </div>
        </header>

        @if (helpdeskService.isLoading()) {
          <div class="loading-state-elite">
            <div class="spin-elite"></div>
            <span>Decoding Signal Layer...</span>
          </div>
        } @else if (ticket()) {
          <div class="dashboard-grid-elite animate-fade-in">
            <!-- ═══════════════════════════════
                 Main Operations Stack
                 ═══════════════════════════════ -->
            <div class="main-stack">
              <!-- Master Directive Card -->
              <div class="elite-card directive-card-elite">
                <div class="card-glow"></div>
                
                <div class="dc-header">
                  <div class="dc-titles">
                    <span class="directive-label">{{ ticket()!.category }}</span>
                    <h2 class="dc-subject">{{ ticket()!.subject }}</h2>
                  </div>
                  <div class="dc-badges">
                    <span class="status-badge" [class.online]="ticket()!.status === 'Open'" [class.pending]="ticket()!.status === 'In Progress'" [class.overdue]="ticket()!.status === 'Waiting for Customer'">
                      <span class="status-dot"></span>
                      {{ ticket()!.status | uppercase }}
                    </span>
                    <span class="status-badge">
                      <div class="priority-indicator" [class]="'priority-' + ticket()!.priority"></div>
                      {{ ticket()!.priority | uppercase }}
                    </span>
                  </div>
                </div>
                
                <div class="dc-body">
                  <div class="description-box">
                    {{ ticket()!.description }}
                  </div>

                  <div class="dc-meta-grid">
                    <div class="meta-item">
                      <span class="meta-label">TRANSMISSION ORIGIN</span>
                      <span class="meta-value">{{ ticket()!.created_at | date:'dd MMM, HH:mm' }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">LAST SYNC</span>
                      <span class="meta-value">{{ ticket()!.updated_at | date:'dd MMM, HH:mm' }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">AUTH NODE</span>
                      <span class="meta-value">CORE-MEMBER-SECURE</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Communication Thread -->
              <div class="thread-section">
                <div class="thread-divider">
                  <span class="thread-label">COMMUNICATION SYNCHRONY</span>
                </div>
                
                <div class="thread-list">
                  @for (reply of ticket()!.replies; track reply.id) {
                    <div class="message-elite" [class.member]="!reply.is_internal" [class.agent]="reply.is_internal">
                      <div class="avatar-wrapper">
                        @if (reply.is_internal) {
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        } @else {
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        }
                      </div>
                      <div class="message-bubble">
                        <div class="msg-header">
                          <span class="msg-author">{{ reply.is_internal ? 'SYSTEM INTELLIGENCE' : 'TAXPAYER ORIGIN' }}</span>
                          <span class="msg-time">{{ reply.created_at | date:'HH:mm' }}</span>
                        </div>
                        <div class="msg-content">{{ reply.reply_text }}</div>
                        <span class="bubble-date">{{ reply.created_at | date:'dd MMM yyyy' }}</span>
                      </div>
                    </div>
                  } @empty {
                    <div class="loading-state-elite">
                      <p>Initializing primary communication layer...</p>
                    </div>
                  }
                </div>

                <!-- Response Interface -->
                <div class="reply-box-elite">
                  <span class="meta-label">TRANSMIT UPLINK</span>
                  <textarea
                    [(ngModel)]="newReply"
                    placeholder="Compose secure transmission signal..."
                    class="textarea-elite"
                  ></textarea>
                  <div class="flex justify-end">
                    <button
                      (click)="submitReply()"
                      [disabled]="!newReply.trim() || isSubmitting()"
                      class="btn-primary-elite"
                    >
                      @if (isSubmitting()) {
                        <div class="spin-elite sm"></div>
                        <span>TRANSMITTING...</span>
                      } @else {
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                        EXECUTE TRANSMISSION
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═══════════════════════════════
                 Ops Analytics Sidebar
                 ═══════════════════════════════ -->
            <div class="side-stack-elite">
              <div class="analytics-card-elite">
                <div class="sidebar-header">
                  <span class="sidebar-title">SLA TELEMETRY</span>
                  <div class="sidebar-icon-box">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                </div>
                
                @if (slaInfo()) {
                  <div class="info-grid">
                    <div class="info-item-elite">
                      <span class="info-label">INITIAL HANDSHAKE</span>
                      <span class="sla-value">{{ slaInfo()!.response_time_hours }}H</span>
                    </div>
                    <div class="info-item-elite">
                      <span class="info-label">TERMINAL RESOLUTION</span>
                      <span class="sla-value">{{ slaInfo()!.resolution_time_hours }}H</span>
                    </div>
                  </div>
                }
              </div>

              <div class="analytics-card-elite">
                <div class="sidebar-header">
                  <span class="sidebar-title">OPERATION LEDGER</span>
                  <div class="sidebar-icon-box">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                  </div>
                </div>
                
                <div class="timeline-elite">
                  @for (event of ticket()!.history; track event.id) {
                    <div class="timeline-item">
                      <div class="timeline-marker"></div>
                      <div class="timeline-content">
                        <p class="timeline-text">{{ event.description | uppercase }}</p>
                        <span class="timeline-meta">{{ event.changed_at | date:'dd MMM, HH:mm' }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        }
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
      background: var(--bg-root);
      color: var(--text-pri);
      position: relative;
      overflow: hidden;
    }

    .noise-overlay {
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.02;
      z-index: 1;
      pointer-events: none;
    }

    .accent-bleed {
      position: fixed;
      top: -15vw;
      right: -10vw;
      width: 45vw;
      height: 45vw;
      background: radial-gradient(circle, var(--red) 0%, transparent 70%);
      opacity: 0.05;
      filter: blur(80px);
      z-index: 1;
      pointer-events: none;
    }

    .db-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 48px 32px 100px;
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    /* ═══════════════════════════════
       Premium Header Flow
       ═══════════════════════════════ */
    .db-header-elite {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .premium-title {
      font-size: 44px;
      font-weight: 900;
      letter-spacing: -2px;
      line-height: 1;
      margin: 16px 0 10px;
    }

    .text-red {
      color: var(--red-bright);
      text-shadow: 0 0 25px var(--red-glow);
    }

    .premium-subtitle {
      font-size: 15px;
      font-weight: 500;
      color: var(--text-sec);
      letter-spacing: -0.2px;
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

    .btn-ghost-elite {
      background: var(--bg-card);
      border: 1.5px solid var(--bdr-hr);
      color: var(--text-sec);
      padding: 14px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-ghost-elite:hover {
      background: var(--red-pale);
      border-color: var(--red-border);
      color: var(--red-bright);
      transform: translateX(-5px);
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
       Grid Architecture & Containers
       ═══════════════════════════════ */
    .dashboard-grid-elite {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 32px;
      align-items: flex-start;
    }

    .main-stack {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .side-stack-elite {
      display: flex;
      flex-direction: column;
      gap: 24px;
      position: sticky;
      top: 32px;
    }

    /* ═══════════════════════════════
       Elite Cards & Directives
       ═══════════════════════════════ */
    .elite-card {
      background: var(--bg-card);
      border: 1px solid var(--bdr);
      border-radius: 32px;
      padding: 32px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .card-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, var(--red-pale), transparent 70%);
      opacity: 0.3;
      pointer-events: none;
    }

    .dc-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--bdr-hr);
    }

    .dc-subject {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.2;
      color: var(--text-pri);
      margin-bottom: 8px;
    }

    .ri-period {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-mut);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .dc-badges {
      display: flex;
      gap: 12px;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 1px;
      background: var(--bg-input);
      border: 1px solid var(--bdr-hr);
      color: var(--text-sec);
    }

    .status-badge.online { background: var(--red-pale); border-color: var(--red-border); color: var(--red-bright); }
    .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #F59E0B; border-color: rgba(245, 158, 11, 0.2); }
    .status-badge.overdue { background: var(--red-pale); border-color: var(--red-border); color: var(--red-bright); }
    .status-badge.error { background: var(--red-pale); border-color: var(--red-border); color: var(--red-bright); }
    .status-badge.synced { background: var(--bg-input); color: var(--text-mut); }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .description-box {
      background: var(--bg-input);
      border: 1px solid var(--bdr-hr);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 32px;
      line-height: 1.7;
      color: var(--text-sec);
      font-size: 15px;
    }
    
    .dc-meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .meta-label {
      font-size: 9px;
      font-weight: 950;
      color: var(--text-mut);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .meta-value {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-pri);
    }

    /* ═══════════════════════════════
       Communication Thread
       ═══════════════════════════════ */
    .thread-section {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .thread-divider {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 0 16px;
    }

    .thread-divider::before, .thread-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--bdr-hr);
    }

    .thread-label {
      font-size: 10px;
      font-weight: 950;
      color: var(--text-mut);
      letter-spacing: 4px;
      text-transform: uppercase;
    }

    .thread-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .thread-item {
      display: flex;
      justify-content: flex-end;
    }

    .thread-item.internal {
      justify-content: flex-start;
    }

    .thread-bubble {
      max-width: 80%;
      background: var(--bg-card);
      border: 1px solid var(--bdr);
      border-radius: 24px;
      border-top-right-radius: 4px;
      padding: 24px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }

    .thread-item.internal .thread-bubble {
      background: var(--red-pale);
      border-color: var(--red-border);
      border-top-right-radius: 24px;
      border-top-left-radius: 4px;
      box-shadow: 0 15px 30px var(--red-pale);
    }
    
    .bubble-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .bubble-sender {
      font-size: 12px;
      font-weight: 950;
      color: var(--red-bright);
      letter-spacing: 0.5px;
    }

    .thread-item:not(.internal) .bubble-sender {
      color: var(--text-pri);
    }

    .bubble-time {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-mut);
    }
    
    .bubble-text {
      font-size: 15px;
      line-height: 1.6;
      color: var(--text-sec);
      white-space: pre-wrap;
    }

    .bubble-date {
      font-size: 10px;
      font-weight: 800;
      color: var(--text-mut);
      margin-top: 20px;
      display: block;
      border-top: 1px solid var(--bdr-hr);
      padding-top: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ═══════════════════════════════
       Reply Interface
       ═══════════════════════════════ */
    .elite-textarea {
      width: 100%;
      background: var(--bg-input);
      border: 1.5px solid var(--bdr-hr);
      border-radius: 24px;
      padding: 24px;
      color: var(--text-pri);
      font-size: 15px;
      font-weight: 500;
      outline: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      resize: none;
    }

    .elite-textarea:focus {
      border-color: var(--red-border);
      background: var(--bg-card);
      box-shadow: 0 0 30px var(--red-pale);
    }

    /* ═══════════════════════════════
       Sidebar Panels
       ═══════════════════════════════ */
    .side-panel {
      padding: 24px;
    }

    .panel-header-mini {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--bdr-hr);
    }
    
    .sla-metrics {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sla-metric-box {
      background: var(--bg-input);
      border: 1px solid var(--bdr-hr);
      border-radius: 20px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .sla-value {
      font-size: 24px;
      font-weight: 900;
      color: var(--text-pri);
      letter-spacing: -0.5px;
    }

    .timeline-elite {
      position: relative;
      padding-left: 24px;
      margin-left: 10px;
      border-left: 2px solid var(--bdr-hr);
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .timeline-item {
      position: relative;
    }

    .timeline-marker {
      position: absolute;
      left: -31px;
      top: 6px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--red);
      border: 3px solid var(--bg-root);
      box-shadow: 0 0 15px var(--red-glow);
    }

    .timeline-text {
      font-size: 13px;
      font-weight: 800;
      color: var(--text-pri);
      margin-bottom: 6px;
      line-height: 1.4;
    }

    .timeline-meta {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-mut);
      font-family: 'JetBrains Mono', monospace;
    }

    /* ═══════════════════════════════
       Loading & Animations
       ═══════════════════════════════ */
    .loading-state-elite {
      padding: 120px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      color: var(--text-sec);
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .spin-elite {
      width: 44px;
      height: 44px;
      border: 3.5px solid var(--bdr-hr);
      border-top-color: var(--red);
      border-radius: 50%;
      animation: spin-elite 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    .spin-elite.sm {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }

    @keyframes spin-elite {
      to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
      animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @media (max-width: 1024px) {
      .dashboard-grid-elite { grid-template-columns: 1fr; gap: 48px; }
      .dc-meta-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class TicketDetailComponent {
  private route = inject(ActivatedRoute);
  public helpdeskService = inject(HelpdeskService);

  ticketId = toSignal(this.route.params.pipe(map(p => parseInt(p['id'], 10))));
  ticket = this.helpdeskService.currentTicket;
  
  slaInfo = computed(() => {
    const t = this.ticket();
    return t ? this.helpdeskService.getSLAForPriority(t.priority) : null;
  });

  newReply = '';
  isSubmitting = signal(false);

  constructor() {
    effect(() => {
      const id = this.ticketId();
      if (id) {
        this.helpdeskService.getTicket(id).subscribe();
      }
    });
  }

  submitReply(): void {
    const id = this.ticketId();
    if (!this.newReply.trim() || !id) return;

    this.isSubmitting.set(true);
    this.helpdeskService.addReply(id, this.newReply).subscribe({
      next: () => {
        this.newReply = '';
        this.isSubmitting.set(false);
        this.helpdeskService.getTicket(id).subscribe();
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  updateStatus(newStatus: string): void {
    const id = this.ticketId();
    if (!id) return;

    this.helpdeskService.updateTicket(id, { status: newStatus }).subscribe({
      next: () => this.helpdeskService.getTicket(id).subscribe()
    });
  }
}
