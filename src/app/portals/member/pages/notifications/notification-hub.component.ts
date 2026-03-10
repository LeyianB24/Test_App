import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-notification-hub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner">
        <header class="premium-header">
          <div class="header-main">
            <div class="header-tag">
              <span class="tag-glow"></span>
              <span class="tag-text">Intelligence Terminal Archive</span>
            </div>
            <h1 class="premium-title">Security <span class="red-gradient">Hub</span></h1>
            <p class="premium-subtitle">Authorized log of statutory directives, system events, and compliance alerts</p>
          </div>
          
          <div class="header-actions">
            <button (click)="ns.markAllAsRead()" class="btn-ghost-elite">
               MARK ALL READ
            </button>
            <button (click)="ns.clearAll()" class="btn-outline-red">
               CLEAR LOGS
            </button>
          </div>
        </header>

        <div class="terminal-surface">
           <div class="surface-header">
              <div class="header-info">
                 <div class="trace-line"></div>
                 <h3 class="surface-title">ACTIVE DIRECTIVES ARCHIVE ({{ ns.notifications().length }})</h3>
              </div>
              <div class="sync-label">SYSTEM SYNCHRONIZED • {{ today | date:'HH:mm' }}</div>
           </div>

           <div class="notification-stack">
              @for (note of ns.notifications(); track note.id) {
                 <div class="notification-row group" [class.unread]="!note.read">
                    <div class="unread-glow" *ngIf="!note.read"></div>
                    
                    <div class="row-inner">
                       <div class="icon-wrap" [class]="getIconClass(note.type)">
                          <div class="icon-pulse"></div>
                          <svg class="note-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                             @switch (note.type) {
                                @case ('success') { <path d="M5 13l4 4L19 7"/> }
                                @case ('warning') { <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/> }
                                @case ('error') { <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/> }
                                @case ('info') { <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/> }
                             }
                          </svg>
                       </div>

                       <div class="note-main">
                          <div class="note-header">
                             <h4 class="note-title">{{ note.title }}</h4>
                             <span class="note-time">{{ note.id | date:'HH:mm • dd MMM yy' | uppercase }}</span>
                          </div>
                          <p class="note-message">{{ note.message }}</p>
                          
                          <div class="note-actions">
                             @if (!note.read) {
                                <button (click)="ns.markAsRead(note.id)" class="action-btn active">
                                   <span class="action-dot"></span>
                                   MARK AS READ
                                </button>
                             }
                             <button (click)="archive(note.id)" class="action-btn">ARCHIVE DIRECTIVE</button>
                          </div>
                       </div>
                    </div>
                 </div>
              } @empty {
                 <div class="empty-hub">
                    <div class="empty-icon-wrap">
                       <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                    </div>
                    <h3 class="empty-title">REGISTRY DEPLETED</h3>
                    <p class="empty-text">No active directives or system notifications present in the communication array.</p>
                 </div>
              }
           </div>
        </div>

        <footer class="terminal-footer">
           <div class="footer-line"></div>
           <p class="footer-text">
              OFFICIAL COMMUNICATION TERMINAL • AUTHORIZED BY KENYA REVENUE AUTHORITY • ENCRYPTED PAYLOAD
           </p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      --red: #D92B2B;
      --red-bright: #EF3B3B;
      --red-glow: rgba(217, 43, 43, 0.4);
      --red-pale: rgba(217, 43, 43, 0.1);
      --red-border: rgba(217, 43, 43, 0.2);
      --bg-root: #080809;
      --bg-surface: rgba(18, 18, 20, 0.6);
      --bdr: rgba(255, 255, 255, 0.05);
      --text-muted: #666670;
      
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
      --info: #3b82f6;
    }

    .db-root {
      min-height: 100vh;
      background: var(--bg-root);
      position: relative;
      overflow-x: hidden;
      color: #fff;
    }

    .noise-overlay {
      position: fixed; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3");
      opacity: 0.03;
      z-index: 1;
    }

    .accent-bleed {
      position: fixed; top: -10%; right: -5%;
      width: 60%; height: 50%;
      background: radial-gradient(circle at center, var(--red-pale) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
    }

    .db-inner {
      position: relative; z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .premium-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
    .header-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px; background: var(--red-pale);
      border: 1px solid var(--red-border); border-radius: 100px;
      margin-bottom: 16px;
    }
    .tag-glow { width: 6px; height: 6px; background: var(--red); border-radius: 50%; box-shadow: 0 0 10px var(--red); }
    .tag-text { font-size: 10px; font-weight: 950; color: var(--red-bright); letter-spacing: 2px; text-transform: uppercase; }

    .premium-title { font-size: 48px; font-weight: 950; letter-spacing: -2px; line-height: 1; margin: 0; }
    .red-gradient { background: linear-gradient(to right, #fff, var(--red-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .premium-subtitle { color: var(--text-muted); font-size: 14px; font-weight: 500; margin: 12px 0 0; letter-spacing: 0.5px; }

    .header-actions { display: flex; gap: 16px; }
    .btn-outline-red {
       padding: 12px 24px; border-radius: 12px; border: 1px solid var(--red-border);
       background: rgba(217, 43, 43, 0.05); color: var(--red-bright); font-size: 10px; font-weight: 950;
       letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s;
    }
    .btn-outline-red:hover { background: var(--red); color: #fff; box-shadow: 0 8px 16px var(--red-glow); }

    .btn-ghost-elite { 
       padding: 12px 24px; background: rgba(255,255,255,0.03); border: 1px solid var(--bdr); border-radius: 12px;
       font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 1.5px; cursor: pointer;
       transition: all 0.3s;
    }
    .btn-ghost-elite:hover { background: rgba(255,255,255,0.08); color: #fff; }

    /* Surface */
    .terminal-surface {
      background: var(--bg-surface);
      border: 1px solid var(--bdr);
      border-radius: 40px;
      overflow: hidden;
      backdrop-filter: blur(24px);
    }

    .surface-header { 
       padding: 24px 40px; background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--bdr);
       display: flex; justify-content: space-between; align-items: center;
    }
    .header-info { display: flex; align-items: center; gap: 16px; }
    .trace-line { width: 4px; height: 32px; background: var(--red); border-radius: 50px; box-shadow: 0 0 10px var(--red); }
    .surface-title { font-size: 11px; font-weight: 950; color: #fff; letter-spacing: 2px; margin: 0; }
    .sync-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; }

    /* Notifications */
    .notification-stack { display: flex; flex-direction: column; }
    .notification-row { padding: 40px; border-bottom: 1px solid var(--bdr); position: relative; transition: all 0.4s; overflow: hidden; }
    .notification-row:last-child { border-bottom: none; }
    .notification-row:hover { background: rgba(255,255,255,0.02); }
    
    .unread-glow { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--red); box-shadow: 0 0 20px var(--red); }
    .notification-row.unread { background: var(--red-pale); }

    .row-inner { display: flex; gap: 32px; position: relative; z-index: 10; }
    
    .icon-wrap { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1); }
    .icon-pulse { position: absolute; inset: 0; background: currentColor; opacity: 0.1; border-radius: inherit; }
    .note-icon { width: 28px; height: 28px; position: relative; z-index: 1; }

    .get-success { color: var(--success); }
    .get-warning { color: var(--warning); }
    .get-error   { color: var(--error); }
    .get-info    { color: var(--info); }

    .note-main { flex-grow: 1; }
    .note-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
    .note-title { font-size: 20px; font-weight: 950; margin: 0; letter-spacing: -0.5px; transition: color 0.3s; }
    .notification-row:hover .note-title { color: var(--red-bright); }
    .note-time { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 900; color: var(--text-muted); letter-spacing: 1px; }

    .note-message { font-size: 14px; font-weight: 500; color: #aaa; margin: 0 0 24px; line-height: 1.6; max-width: 90%; }

    .note-actions { display: flex; gap: 24px; }
    .action-btn { background: none; border: none; font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
    .action-btn:hover { color: #fff; }
    .action-btn.active { color: var(--red-bright); }
    .action-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }

    .empty-hub { padding: 120px 0; text-align: center; }
    .empty-icon-wrap { width: 80px; height: 80px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr); border-radius: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--text-muted); }
    .empty-title { font-size: 11px; font-weight: 950; color: #fff; letter-spacing: 4px; margin: 0 0 8px; }
    .empty-text { font-size: 13px; color: var(--text-muted); font-weight: 500; }

    .terminal-footer { margin-top: 48px; text-align: center; }
    .footer-line { width: 100px; height: 1px; background: var(--bdr); margin: 0 auto 24px; }
    .footer-text { font-size: 10px; font-weight: 900; color: #444; letter-spacing: 4px; text-transform: uppercase; }

    @media (max-width: 768px) {
       .premium-header { flex-direction: column; align-items: flex-start; gap: 32px; }
       .header-actions { width: 100%; }
       .btn-ghost-elite, .btn-outline-red { flex-grow: 1; text-align: center; }
       .row-inner { flex-direction: column; gap: 24px; }
       .icon-wrap { width: 48px; height: 48px; }
       .note-header { flex-direction: column; gap: 8px; }
    }
  `],
})
export class NotificationHubComponent {
  ns = inject(NotificationService);
  today = new Date();

  archive(id: number) { this.ns.remove(id); }

  getIconClass(type: string | undefined) {
    if (!type) return 'get-info';
    return 'get-' + type;
  }
}
