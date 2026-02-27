import { Component, Output, EventEmitter, OnInit, OnDestroy, signal, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  host: { '(document:click)': 'onDocumentClick()' },
  template: `
    <header class="header-elite admin-header">
      <div class="header-inner">
        
        <div class="header-left">
          <button class="menu-trigger-elite" (click)="toggleSidebar.emit()" title="Toggle Navigation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>

          <div class="page-context hide-mobile">
            <span class="context-tag admin-tag">KRA ADMINISTRATIVE CONSOLE</span>
            <h1 class="context-title">Staff <span class="gradient-text admin-gradient">Portal</span></h1>
          </div>
        </div>

        <div class="header-center hide-mobile">
          <div class="luxury-search admin-search">
            <svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search systems, clients or audit entries..." (keyup.enter)="handleSearch($event)" />
            <div class="kbd-hint">ENTER</div>
          </div>
        </div>

        <div class="header-right">
          
          <!-- Intelligent Notifications -->
          <div class="notif-anchor">
            <button class="notif-btn-elite" 
                    (click)="toggleNotifications($event)" 
                    [class.active]="isNotificationsOpen()">
              <div class="notif-icon-box" [class.pulse]="unreadCount() > 0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <div class="notif-badge" *ngIf="unreadCount() > 0">{{ unreadCount() }}</div>
              </div>
            </button>

            <!-- Luxury Notifications Panel -->
            <div class="notif-panel-elite animate-scale" *ngIf="isNotificationsOpen()" (click)="$event.stopPropagation()">
              <div class="panel-header-elite admin-panel-header">
                <div class="p-title-box">
                   <h3>System Alerts</h3>
                   <span class="p-count admin-p-count">{{ unreadCount() }} NEW INCIDENTS</span>
                </div>
                <button class="p-action-btn" (click)="markAllRead()">Archive All</button>
              </div>
              <div class="panel-body-elite custom-scrollbar">
                <div *ngIf="notifications().length === 0" class="notif-empty">
                  <div class="empty-icon">✓</div>
                  <p>All background systems operational.</p>
                </div>
                <div *ngFor="let note of notifications()" 
                     class="notif-item-elite" 
                     [class.unread]="!note.read"
                     (click)="markAsRead(note)">
                  <div class="notif-indicator" [ngClass]="note.type"></div>
                  <div class="notif-content">
                    <div class="notif-top">
                       <span class="notif-title">{{ note.title }}</span>
                       <span class="notif-time">{{ note.time }}</span>
                    </div>
                    <p class="notif-msg">{{ note.message }}</p>
                  </div>
                </div>
              </div>
              <div class="panel-footer-elite">
                 <button class="view-all-btn" (click)="clearAll()">Flush Audit Notifications</button>
              </div>
            </div>
          </div>

          <!-- User Intelligence Dropdown -->
          <div class="user-anchor">
            <button class="user-trigger-elite admin-user-trigger" (click)="toggleMenu($event)" [class.active]="isMenuOpen()">
              <div class="user-avatar-small admin-avatar">{{ getInitials(userName()) }}</div>
              <div class="user-meta-mini hide-mobile">
                <span class="u-name">{{ userName() }}</span>
                <span class="u-pin admin-role">{{ userRole() }}</span>
              </div>
              <svg class="chevron-elite" [class.rotated]="isMenuOpen()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <!-- Luxury User Menu -->
            <div class="user-menu-elite animate-scale" *ngIf="isMenuOpen()" (click)="$event.stopPropagation()">
              <div class="menu-intro-elite admin-menu-intro">
                <div class="intro-avatar admin-intro-avatar">{{ getInitials(userName()) }}</div>
                <div class="intro-info">
                   <p class="i-name">{{ userName() }}</p>
                   <p class="i-email">{{ userRole() }} - Staff</p>
                </div>
              </div>
              
              <ul class="menu-links-elite">
                <li>
                  <a [routerLink]="'/admin-portal/profile'" (click)="isMenuOpen.set(false)">
                    <div class="m-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>
                    <span>Staff Profile</span>
                  </a>
                </li>
                <li>
                  <a [routerLink]="'/admin-portal/settings'" (click)="isMenuOpen.set(false)">
                    <div class="m-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg></div>
                    <span>Global Settings</span>
                  </a>
                </li>
                <li class="m-divider"></li>
                <li>
                  <button (click)="logout.emit(); isMenuOpen.set(false)" class="m-logout-btn">
                    <div class="m-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg></div>
                    <span>Seal Session</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-elite {
      position: sticky; top: 0; right: 0; left: 0; height: 90px;
      background: var(--bg-topbar); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-color); z-index: 900;
    }
    .admin-header { border-bottom: 1.5px solid var(--kra-blue); }
    .header-inner { height: 100%; max-width: 1600px; margin: 0 auto; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; }
    
    .header-left { display: flex; align-items: center; gap: 32px; }
    .menu-trigger-elite { width: 44px; height: 44px; border-radius: 14px; border: none; background: var(--bg-hover); color: var(--text-main); cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
    .menu-trigger-elite:hover { background: var(--border-light); transform: scale(1.05); }

    .page-context { display: flex; flex-direction: column; }
    .context-tag { font-size: 0.7rem; font-weight: 800; color: var(--kra-red); text-transform: uppercase; letter-spacing: 2px; }
    .admin-tag { color: var(--kra-blue); }
    .context-title { font-size: 1.5rem; font-weight: 900; color: var(--text-main); margin: 0; letter-spacing: -1px; }
    .admin-gradient { background: linear-gradient(135deg, var(--kra-blue), #60a5fa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .luxury-search { position: relative; width: 450px; display: flex; align-items: center; }
    .luxury-search .s-icon { position: absolute; left: 20px; width: 24px; height: 24px; color: var(--text-muted); pointer-events: none; }
    .luxury-search input { 
      width: 100%; padding: 14px 100px 14px 56px; background: var(--bg-hover); border: 1.5px solid var(--border-color);
      border-radius: 18px; font-weight: 600; color: var(--text-main); transition: 0.3s; font-family: inherit;
    }
    .luxury-search input:focus { background: var(--bg-surface); border-color: var(--kra-blue); outline: none; box-shadow: 0 0 0 5px rgba(59,130,246,0.1); }
    .kbd-hint { position: absolute; right: 12px; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); border: 1.5px solid var(--border-color); padding: 4px 8px; border-radius: 8px; background: var(--bg-surface); }

    .header-right { display: flex; align-items: center; gap: 24px; }
    
    .notif-anchor, .user-anchor { position: relative; }
    .notif-btn-elite { width: 50px; height: 50px; border-radius: 16px; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; position: relative; }
    .notif-btn-elite:hover { background: rgba(0,0,0,0.03); color: var(--text-main); }
    .notif-btn-elite.active { background: rgba(59,130,246,0.08); color: var(--kra-blue); }
    
    .notif-icon-box { position: relative; width: 22px; height: 22px; }
    .notif-icon-box.pulse { animation: notifPulse 2s infinite; }
    @keyframes notifPulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
    .notif-badge { position: absolute; top: -8px; right: -8px; background: var(--kra-blue); color: white; font-size: 0.65rem; font-weight: 900; min-width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; border: 2.5px solid var(--bg-surface); padding: 0 4px; }

    .notif-panel-elite { position: absolute; top: 64px; right: 0; width: 420px; background: var(--bg-surface); border-radius: 28px; border: 1px solid var(--border-color); box-shadow: 0 30px 60px rgba(0,0,0,0.2); overflow: hidden; }
    .panel-header-elite { padding: 24px 30px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; background: var(--bg-hover); }
    .admin-panel-header { background: rgba(59,130,246,0.03); }
    .p-title-box h3 { font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin: 0; }
    .admin-p-count { color: var(--kra-blue); }
    .p-action-btn { color: var(--kra-blue); font-weight: 900; font-size: 0.8rem; background: none; border: none; cursor: pointer; }

    .panel-body-elite { max-height: 480px; overflow-y: auto; }
    .notif-item-elite { padding: 20px 30px; display: flex; gap: 16px; cursor: pointer; border-bottom: 1px solid var(--border-light); transition: 0.3s; position: relative; }
    .notif-item-elite:hover { background: var(--bg-hover); }
    .notif-item-elite.unread { background: var(--bg-active); }
    .notif-indicator { width: 4px; height: 32px; border-radius: 2px; flex-shrink: 0; align-self: center; }
    .notif-indicator.success { background: #10B981; }
    .notif-indicator.warning { background: #F59E0B; }
    .notif-indicator.error { background: #EF4444; }
    .notif-indicator.info { background: #3B82F6; }
    .panel-footer-elite { padding: 16px; background: var(--bg-hover); text-align: center; }
    .view-all-btn { width: 100%; padding: 12px; background: var(--bg-surface); border: 1.5px solid var(--border-color); border-radius: 16px; font-weight: 800; color: var(--text-secondary); cursor: pointer; transition: 0.3s; }
    .view-all-btn:hover { border-color: var(--kra-blue); color: var(--kra-blue); }

    .admin-user-trigger { background: rgba(59,130,246,0.03); border: 1.5px solid rgba(59,130,246,0.1); }
    .admin-avatar { background: var(--kra-blue); }
    .admin-role { font-size: 0.65rem; color: var(--kra-blue); text-transform: uppercase; letter-spacing: 0.5px; }

    .user-menu-elite { position: absolute; top: 64px; right: 0; width: 300px; background: var(--bg-surface); border-radius: 28px; border: 1px solid var(--border-color); box-shadow: 0 30px 60px rgba(0,0,0,0.2); overflow: hidden; }
    .menu-intro-elite { padding: 30px; background: var(--bg-hover); border-bottom: 1px solid var(--border-light); display: flex; align-items: center; gap: 16px; }
    .admin-menu-intro { background: rgba(59,130,246,0.03); }
    .admin-intro-avatar { background: var(--kra-blue); }

    .menu-links-elite { list-style: none; padding: 12px; margin: 0; }
    .menu-links-elite a, .m-logout-btn { display: flex; align-items: center; gap: 16px; padding: 14px 18px; border-radius: 16px; color: var(--text-secondary); text-decoration: none; font-weight: 700; font-size: 0.95rem; transition: 0.3s; width: 100%; border: none; background: transparent; cursor: pointer; font-family: inherit; }
    .menu-links-elite a:hover { background: var(--bg-hover); color: var(--text-main); }
    .m-logout-btn:hover { background: #FEF2F2; color: var(--kra-red); }
    .m-icon { width: 32px; height: 32px; border-radius: 10px; background: var(--bg-hover); display: flex; align-items: center; justify-content: center; }
    .m-divider { height: 1px; background: var(--border-light); margin: 8px 18px; }
  `]
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  userName = this.authService.userName;
  userRole = this.authService.userRole;
  
  isMenuOpen = signal(false);
  isNotificationsOpen = signal(false);
  private timer: any;

  notifications = this.notificationService.notifications;
  unreadCount = this.notificationService.unreadCount;

  ngOnInit() {
    this.timer = setInterval(() => {}, 5000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  onDocumentClick() {
    this.isMenuOpen.set(false);
    this.isNotificationsOpen.set(false);
  }

  toggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.isMenuOpen.update(v => !v);
    this.isNotificationsOpen.set(false);
  }

  toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    this.isNotificationsOpen.update(v => !v);
    this.isMenuOpen.set(false);
  }

  getInitials(name: string): string {
    if (!name) return 'S';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  markAsRead(note: Notification) { this.notificationService.markAsRead(note.id); }
  markAllRead() { this.notificationService.markAllAsRead(); }
  clearAll() { this.notificationService.clearAll(); }
  handleSearch(event: any) {
    const query = event.target.value;
    if (query) alert(`Executing staff intelligence search for: ${query}`);
  }
}
