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
    <div class="db-root animate-fade-in">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- Elite Header -->
        <header class="db-header-elite">
          <div class="header-left">
            <div class="flex items-center gap-4 mb-4">
              <a routerLink="/helpdesk" class="btn-ghost-elite btn-icon-only">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div class="live-badge">
                <div class="live-dot"></div>
                TICKET INTEL #{{ ticket()?.ticket_number }}
              </div>
            </div>
            <h1 class="premium-title">Directive <span class="text-red">Telemetry</span></h1>
            <p class="premium-subtitle">Terminal synchronization & status audit</p>
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
            <span>Decoding Signal...</span>
          </div>
        } @else if (ticket()) {
          <div class="dashboard-grid-elite">
            <!-- Intelligence Thread -->
            <div class="main-stack">
              <!-- Master Directive Card -->
              <div class="elite-card directive-card">
                <div class="card-glow"></div>
                <div class="dc-header">
                  <div class="dc-titles">
                    <h2 class="dc-subject">{{ ticket()!.subject }}</h2>
                    <span class="ri-period">{{ ticket()!.category | uppercase }}</span>
                  </div>
                  <div class="dc-badges">
                    <span class="status-badge" [class]="getStatusClass(ticket()!.status)">
                      <span class="status-dot"></span>
                      {{ ticket()!.status | uppercase }}
                    </span>
                    <span class="status-badge" [class]="getPriorityClass(ticket()!.priority)">
                      {{ ticket()!.priority | uppercase }}
                    </span>
                  </div>
                </div>
                
                <div class="dc-body">
                  <div class="description-box">
                    <p>{{ ticket()!.description }}</p>
                  </div>

                  <div class="dc-meta-grid">
                    <div class="meta-item">
                      <span class="meta-label">TRANSMISSION ORIGIN</span>
                      <span class="meta-value">{{ ticket()!.created_at | date:'dd MMM yyyy HH:mm' }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">SYNC STATE</span>
                      <span class="meta-value">{{ ticket()!.updated_at | date:'dd MMM yyyy HH:mm' }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">ORIGIN NODE</span>
                      <span class="meta-value">CORE-MEMBER-INTEL</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Communication Synchrony -->
              <div class="thread-section">
                <div class="thread-divider">
                  <span class="thread-label">COMMUNICATION SYNCHRONY</span>
                </div>
                
                <div class="thread-list">
                  @for (reply of ticket()!.replies; track reply.id) {
                    <div class="thread-item animate-fade-in" [class.internal]="reply.is_internal">
                      <div class="thread-bubble">
                        <div class="bubble-header">
                          <span class="bubble-sender">{{ reply.is_internal ? 'SUPPORT INTELLIGENCE' : 'TAXPAYER' }}</span>
                          <span class="bubble-time">{{ reply.created_at | date:'shortTime' }}</span>
                        </div>
                        <p class="bubble-text">{{ reply.reply_text }}</p>
                        <span class="bubble-date">{{ reply.created_at | date:'dd MMM yyyy' }}</span>
                      </div>
                    </div>
                  } @empty {
                    <div class="empty-thread-elite">
                      <p>Awaiting primary status verification...</p>
                    </div>
                  }
                </div>

                <!-- Response Interface -->
                <div class="elite-card reply-box">
                  <div class="card-glow"></div>
                  <h4 class="meta-label mb-6">TRANSMIT RESPONSE</h4>
                  <textarea
                    [(ngModel)]="newReply"
                    placeholder="Compose secure transmission signal..."
                    rows="4"
                    class="elite-textarea"
                  ></textarea>
                  <div class="flex justify-end mt-6">
                    <button
                      (click)="submitReply()"
                      [disabled]="!newReply.trim() || isSubmitting()"
                      class="btn-primary-elite px-10"
                    >
                      @if (isSubmitting()) {
                        <div class="spin-elite sm"></div>
                      } @else {
                        EXECUTE TRANSMISSION
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ops Analytics Sidebar -->
            <div class="side-stack-elite">
              <div class="elite-card side-panel">
                <div class="card-glow"></div>
                <div class="panel-header-mini">
                  <h3 class="meta-label text-red">SLA TELEMETRY</h3>
                </div>
                @if (slaInfo()) {
                  <div class="sla-metrics">
                    <div class="sla-metric-box">
                      <span class="meta-label">INITIAL HANDSHAKE</span>
                      <span class="sla-value">{{ slaInfo()!.response_time_hours }} HOURS</span>
                    </div>
                    <div class="sla-metric-box">
                      <span class="meta-label">TERMINAL RESOLUTION</span>
                      <span class="sla-value">{{ slaInfo()!.resolution_time_hours }} HOURS</span>
                    </div>
                  </div>
                }
              </div>

              <div class="elite-card side-panel">
                <div class="card-glow"></div>
                <div class="panel-header-mini">
                  <h3 class="meta-label">OPERATION LEDGER</h3>
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

    /* Header */
    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; }
    .premium-title { font-size: 40px; font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--kra-red-light); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--kra-red-pale); border: 1px solid rgba(192,57,43,0.2); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--kra-red-light); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kra-red-light); box-shadow: 0 0 10px var(--kra-red-glow); animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .btn-ghost-elite { background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--text-sec); padding: 12px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
    .btn-ghost-elite:hover { background: var(--bg-card-3); color: var(--text-pri); transform: scale(1.05); }

    .btn-primary-elite { background: var(--kra-red); border: none; color: white; padding: 12px 24px; border-radius: 14px; display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 24px var(--kra-red-glow); }
    .btn-primary-elite:hover { transform: translateY(-2px); background: var(--kra-red-light); box-shadow: 0 12px 32px var(--kra-red-glow); }

    /* Grid Architecture */
    .dashboard-grid-elite { display: grid; grid-template-columns: 1fr 340px; gap: 32px; }
    .main-stack { display: flex; flex-direction: column; gap: 32px; }
    .side-stack-elite { display: flex; flex-direction: column; gap: 24px; }

    /* Elite Cards */
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 28px; padding: 32px; position: relative; overflow: hidden; }
    .card-glow { position: absolute; inset: 0; background: radial-gradient(circle at top left, var(--kra-red), transparent 70%); opacity: 0.03; pointer-events: none; }

    /* Directive Card */
    .dc-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--bdr); }
    .dc-subject { font-size: 24px; font-weight: 950; letter-spacing: -0.5px; line-height: 1.2; color: var(--text-pri); margin-bottom: 8px; }
    .ri-period { font-size: 10px; font-weight: 900; color: var(--text-mut); letter-spacing: 1.5px; }
    
    .dc-badges { display: flex; gap: 12px; }
    .status-badge { display: flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 10px; font-size: 9px; font-weight: 900; letter-spacing: 1px; }
    .status-badge.online { background: var(--kra-green-pale); color: var(--kra-green-light); }
    .status-badge.pending { background: var(--kra-gold-pale); color: var(--kra-gold); }
    .status-badge.overdue { background: var(--kra-red-pale); color: var(--kra-red-light); }
    .status-badge.error { background: var(--kra-red-pale); color: var(--kra-red-light); }
    .status-badge.synced { background: var(--bg-card-2); color: var(--text-mut); border: 1px solid var(--bdr); }
    .status-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

    .description-box { background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 20px; padding: 24px; margin-bottom: 32px; line-height: 1.6; color: var(--text-sec); font-weight: 500; }
    
    .dc-meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .meta-item { display: flex; flex-direction: column; gap: 4px; }
    .meta-label { font-size: 9px; font-weight: 950; color: var(--text-mut); letter-spacing: 2px; text-transform: uppercase; }
    .meta-value { font-size: 11px; font-weight: 800; color: var(--text-pri); }

    /* Thread Section */
    .thread-section { display: flex; flex-direction: column; gap: 24px; }
    .thread-divider { display: flex; align-items: center; gap: 20px; padding: 0 10px; }
    .thread-divider::before, .thread-divider::after { content: ''; flex: 1; height: 1px; background: var(--bdr); }
    .thread-label { font-size: 9px; font-weight: 950; color: var(--text-mut); letter-spacing: 4px; }

    .thread-list { display: flex; flex-direction: column; gap: 16px; }
    .thread-item { display: flex; justify-content: flex-end; }
    .thread-item.internal { justify-content: flex-start; }

    .thread-bubble { max-width: 80%; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 20px; border-top-right-radius: 4px; padding: 24px; transition: all 0.3s; }
    .thread-item.internal .thread-bubble { background: var(--kra-red-pale); border-color: var(--kra-red-border); border-top-right-radius: 20px; border-top-left-radius: 4px; }
    
    .bubble-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .bubble-sender { font-size: 10px; font-weight: 950; color: var(--kra-red-light); letter-spacing: 1px; }
    .thread-item:not(.internal) .bubble-sender { color: var(--text-pri); }
    .bubble-time { font-size: 9px; font-weight: 700; color: var(--text-mut); }
    
    .bubble-text { font-size: 14px; line-height: 1.6; color: var(--text-pri); font-weight: 500; white-space: pre-wrap; }
    .bubble-date { font-size: 9px; font-weight: 900; color: var(--text-mut); margin-top: 16px; display: block; border-top: 1px solid var(--bdr); padding-top: 12px; }

    /* Reply Interface */
    .elite-textarea { width: 100%; background: var(--bg-card-2); border: 2px solid var(--bdr); border-radius: 20px; padding: 20px; color: var(--text-pri); font-size: 14px; font-weight: 600; outline: none; transition: border-color 0.3s; resize: none; }
    .elite-textarea:focus { border-color: var(--kra-red-light); }

    /* Sidebar Panels */
    .side-panel { padding: 24px; }
    .panel-header-mini { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--bdr); }
    
    .sla-metrics { display: flex; flex-direction: column; gap: 12px; }
    .sla-metric-box { background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 4px; }
    .sla-value { font-size: 20px; font-weight: 950; color: var(--text-pri); }

    .timeline-elite { position: relative; padding-left: 20px; margin-left: 10px; border-left: 2px solid var(--bdr); display: flex; flex-direction: column; gap: 24px; }
    .timeline-item { position: relative; }
    .timeline-marker { position: absolute; left: -26px; top: 6px; width: 10px; height: 10px; border-radius: 50%; background: var(--kra-red); border: 2px solid var(--bg-card); box-shadow: 0 0 8px var(--kra-red-glow); }
    .timeline-text { font-size: 11px; font-weight: 900; color: var(--text-pri); margin-bottom: 4px; line-height: 1.3; letter-spacing: -0.2px; }
    .timeline-meta { font-size: 9px; font-weight: 700; color: var(--text-mut); font-family: 'JetBrains Mono', monospace; }

    /* Loading State */
    .loading-state-elite { padding: 120px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--text-sec); font-weight: 800; letter-spacing: 1px; }
    .spin-elite { width: 32px; height: 32px; border: 3px solid var(--bdr); border-top-color: var(--kra-red-light); border-radius: 50%; animation: spin 0.8s linear infinite; }
    .spin-elite.sm { width: 16px; height: 16px; border-width: 2px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }

    @media (max-width: 1024px) {
      .dashboard-grid-elite { grid-template-columns: 1fr; }
      .dc-meta-grid { grid-template-columns: 1fr 1fr; }
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open': return 'online';
      case 'In Progress': return 'pending';
      case 'Waiting for Customer': return 'overdue';
      case 'Resolved': return 'active';
      default: return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'pending';
      default: return 'synced';
    }
  }
}
