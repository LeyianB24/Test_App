import { Component, input, output, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LogoComponent } from '../../../components/logo.component';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../services/theme.service';

interface MenuItem {
  label: string;
  route: string;
  iconPath: string;
  notification?: string | number;
  variant?: 'danger' | 'default';
}

/**
 * Navigation map for the Admin Portal.
 */
const ADMIN_NAV_MAP: MenuItem[] = [
  {
    label: 'Dashboard',
    route: '/admin-portal/dashboard',
    iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
  },
  {
    label: 'Clients',
    route: '/admin-portal/clients',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
  },
  {
    label: 'Role Matrix',
    route: '/admin-portal/role-matrix',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    label: 'Reports',
    route: '/admin-portal/reports',
    iconPath: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    label: 'Audit Log',
    route: '/admin-portal/audit',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
  },
  {
    label: 'Helpdesk Dashboard',
    route: '/admin-portal/helpdesk/dashboard',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    label: 'Support Tickets',
    route: '/admin-portal/helpdesk/tickets',
    iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    label: 'Custom Declaration',
    route: '/admin-portal/specialized/custom-declaration',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    label: 'My Profile',
    route: '/admin-portal/profile',
    iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  },
  {
    label: 'Gateway Settings',
    route: '/admin-portal/settings',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z'
  }
];

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterModule, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mobile-backdrop-elite"
         *ngIf="isMobileOpen()"
         (click)="closeMobileMenu()">
    </div>

    <aside class="sidebar-elite"
           [class.collapsed]="collapsed()"
           [class.mobile-open]="isMobileOpen()">

      <!-- Premium Branding -->
      <div class="sidebar-brand-elite">
        <div class="logo-sphere">
             <app-logo [height]="collapsed() ? '80%' : '100%'" color="gold"></app-logo>
        </div>
      </div>

      <div class="nav-scroller-elite custom-scrollbar">
        <nav class="sidebar-nav-elite">
          @if (!collapsed()) {
            <p class="nav-domain-label">Administration Suite</p>
          }

          @for (item of menuItems; track item.route) {
            <a [routerLink]="item.route"
               routerLinkActive="active"
               class="nav-link-elite admin-link"
               [title]="item.label"
               (click)="closeMobileMenu()">

              <div class="icon-frame">
                <svg class="nav-icon-elite" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" [attr.d]="item.iconPath" />
                </svg>
              </div>

              @if (!collapsed()) {
                <span class="link-label-elite">{{ item.label }}</span>
              }
            </a>
          }
        </nav>
      </div>

      <!-- Sophisticated Footer -->
      <div class="sidebar-footer-elite">
        <div class="footer-actions-elite">
          <button class="footer-btn-elite" (click)="themeService.toggleTheme()" [title]="isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            <div class="f-icon-box">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path *ngIf="isDarkMode()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                <path *ngIf="!isDarkMode()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <span class="f-label" *ngIf="!collapsed()">{{ isDarkMode() ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>

          <button class="footer-btn-elite logout" (click)="handleLogout()" title="Terminate Session">
            <div class="f-icon-box">
               <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </div>
            <span class="f-label" *ngIf="!collapsed()">Logout</span>
          </button>
        </div>

        <div class="system-seal-elite" *ngIf="!collapsed()">
           <span class="s-ver">Staff v2.4.0-admin</span>
           <span class="s-sep">|</span>
           <span class="s-sec">AES-X</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-elite {
      position: fixed; top: 0; left: 0; bottom: 0; width: 300px;
      background: var(--bg-surface);
      border-right: 1px solid var(--border-color);
      display: flex; flex-direction: column;
      z-index: 1000; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .sidebar-elite.collapsed { width: 90px; }

    .sidebar-brand-elite {
      height: 90px;
      display: flex; align-items: center; justify-content: center;
      padding: 10px 20px;
      border-bottom: 3px solid var(--kra-blue);
      background: var(--bg-surface);
      transition: all 0.3s ease;
    }
    .logo-sphere {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-scroller-elite { flex: 1; padding: 12px; overflow-y: auto; }
    .nav-domain-label { font-size: 0.7rem; font-weight: 800; color: var(--kra-blue); text-transform: uppercase; letter-spacing: 2px; padding: 0 16px; margin: 16px 0 12px 0; }

    .nav-link-elite {
      display: flex; align-items: center; gap: 16px; padding: 14px 16px;
      border-radius: 16px; color: var(--text-secondary); text-decoration: none;
      font-weight: 700; font-size: 0.95rem; transition: 0.3s; margin-bottom: 4px;
    }
    .nav-link-elite:hover { background: rgba(0,0,0,0.03); color: var(--text-main); }
    .nav-link-elite.active { background: rgba(59,130,246,0.05); color: var(--kra-blue); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }

    .icon-frame {
      width: 40px; height: 40px; border-radius: 12px; background: transparent;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      transition: 0.3s;
    }
    .nav-link-elite.active .icon-frame { background: rgba(59,130,246,0.1); color: var(--kra-blue); }
    .nav-icon-elite { width: 22px; height: 22px; }
    .link-label-elite { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .sidebar-footer-elite { padding: 20px; border-top: 1px solid var(--border-light); }
    .footer-actions-elite { display: flex; flex-direction: column; gap: 8px; }
    .footer-btn-elite {
      display: flex; align-items: center; gap: 14px; padding: 12px 16px;
      border-radius: 14px; border: none; background: transparent;
      color: var(--text-secondary); font-weight: 700; font-size: 0.9rem;
      cursor: pointer; transition: 0.3s; text-align: left;
      font-family: inherit;
    }
    .footer-btn-elite:hover { background: rgba(0,0,0,0.03); color: var(--text-main); }
    .footer-btn-elite.logout:hover { color: var(--kra-red); background: #FEF2F2; }
    .f-icon-box { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }

    .system-seal-elite {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-top: 20px; font-size: 0.65rem; color: var(--text-muted);
      font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .s-sep { opacity: 0.3; }

    /* Collapsed adjustments */
    .collapsed .nav-domain-label, .collapsed .link-label-elite, .collapsed .f-label { display: none; }
    .collapsed .nav-link-elite { justify-content: center; padding: 14px 0; }
    .collapsed .footer-btn-elite { justify-content: center; padding: 12px 0; }

    @media (max-width: 991px) {
      .sidebar-elite { transform: translateX(-100%); width: 280px; }
      .sidebar-elite.mobile-open { transform: translateX(0); }
      .sidebar-elite.collapsed { transform: translateX(-100%); }
    }
    .mobile-backdrop-elite {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999;
      -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
    }
  `]
})
export class AdminSidebarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  collapsed = input(false);
  isMobileOpen = input(false);
  toggle = output<void>();
  closeMobile = output<void>();
  logout = output<void>();

  isDarkMode = this.themeService.darkMode;
  menuItems = ADMIN_NAV_MAP;

  handleLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.logout.emit();
      },
      error: (error: unknown) => console.error('❌ Logout error:', error)
    });
  }

  onToggleSidebar() { this.toggle.emit(); }
  closeMobileMenu() { this.closeMobile.emit(); }
}
