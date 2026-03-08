import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal, inject, computed, ChangeDetectionStrategy, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardDataService } from '../../services/dashboard-data.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService, Notification } from '../../core/services/notification.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  host: { '(document:click)': 'onDocumentClick()' },
  template: `
    <header class="topbar-precision">
      <div class="breadcrumb-container-precision">
        <button class="btn-precision btn-icon-precision lg:hidden" (click)="toggleSidebar.emit()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
    
        <a [routerLink]="portalPrefix() + '/dashboard'" class="breadcrumb-parent">KRA PORTAL</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">iTax</span>
      </div>
    
      <div class="status-pills-container hidden md:flex">
        <div class="status-pill-precision online">
          <span class="status-pill-dot"></span>
          <span>iTax</span>
        </div>
        <div class="status-pill-precision online">
          <span class="status-pill-dot"></span>
          <span>eTIMS</span>
        </div>
      </div>
    
      <div class="topbar-right-zone">
        <!-- Theme Toggle -->
        <button class="theme-toggle-precision"
          [attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          (click)="themeService.toggleTheme()">
          @if (themeService.theme() === 'dark') {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line></svg>
          } @else {
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          }
        </button>
    
        <!-- Notifications -->
        <div class="relative">
          <button class="notification-bell-precision" (click)="toggleNotifications($event)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            @if (unreadCount() > 0) {
              <div class="unread-badge-precision">{{ unreadCount() }}</div>
            }
          </button>
    
          @if (isNotificationsOpen()) {
            <div class="notifications-panel-precision" (click)="$event.stopPropagation()">
              <div class="notifications-header-precision">
                <span class="notifications-title-precision">Notifications</span>
                <a href="javascript:void(0)" class="mark-read-link-precision" (click)="markAllRead()">Mark all as read</a>
              </div>
              <div class="custom-scrollbar overflow-y-auto max-h-[380px]">
                @if (notifications().length === 0) {
                  <div class="p-8 text-center color-black-500 text-xs">
                    All systems quiet.
                  </div>
                }
                @for (note of notifications(); track note.id) {
                  <div class="notification-item-precision" [class.unread]="!note.read" (click)="markAsRead(note)">
                    <div class="notif-icon-box-precision"
                      [class.danger]="note.type === 'error' || note.type === 'warning'"
                      [class.success]="note.type === 'success'"
                      [class.info]="note.type === 'info'">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="notif-content-precision">
                      <div class="notif-header-row-precision">
                        <span class="notif-subject-precision">{{ note.title }}</span>
                        <span class="notif-time-precision">{{ note.time }}</span>
                      </div>
                      <p class="notif-body-precision">{{ note.message }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
    
        <!-- User -->
        <div class="relative">
          <div class="user-trigger-precision" (click)="toggleMenu($event)">
            <div class="avatar-circle-precision">{{ getInitials(userName()) }}</div>
            <div class="hidden sm:block">
              <div class="text-[12px] font-bold text-[var(--text-primary)] leading-none">{{ userName() }}</div>
              <div class="text-[10px] text-[var(--text-secondary)] mt-1 uppercase tracking-widest">{{ userPin() }}</div>
            </div>
          </div>
    
          @if (isMenuOpen()) {
            <div class="user-menu-elite pointer-events-auto" (click)="$event.stopPropagation()">
              <ul class="menu-links-elite">
                <li><a [routerLink]="portalPrefix() + '/profile'"><span class="nav-link-label">My Profile</span></a></li>
                <li><a [routerLink]="portalPrefix() + '/settings'"><span class="nav-link-label">Settings</span></a></li>
                <li class="m-divider"></li>
                <li><button (click)="logout.emit()" class="m-logout-btn font-bold"><span class="nav-link-label">Logout</span></button></li>
              </ul>
            </div>
          }
        </div>
      </div>
    </header>
    `,
  styles: [`
    .theme-toggle-precision {
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      transition: all var(--duration-200) var(--ease-in-out);
    }
    .theme-toggle-precision:hover {
      background: var(--bg-hover);
      color: var(--color-accent);
      transform: rotate(15deg);
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  public themeService = inject(ThemeService);

  toggleSidebar = output<void>();
  logout = output<void>();

  userName = this.authService.userName;
  userPin = computed(() => this.authService.currentUser()?.taxpayer_id || 'N/A');
  userEmail = computed(() => this.authService.currentUser()?.email || 'N/A');
  portalPrefix = signal('/member');
  
  isMenuOpen = signal(false);
  isNotificationsOpen = signal(false);
  private timer: any;

  notifications = this.notificationService.notifications;
  unreadCount = this.notificationService.unreadCount;

  ngOnInit() {
    this.timer = setInterval(() => {
       // Future real-time updates
    }, 5000);
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
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  markAsRead(note: Notification) {
    this.notificationService.markAsRead(note.id);
  }

  markAllRead() {
    this.notificationService.markAllAsRead();
  }

  clearAll() {
    this.notificationService.clearAll();
  }

  handleSearch(event: any) {
    const query = event.target.value;
    if (query) alert(`Searching for: ${query}`);
  }
}
