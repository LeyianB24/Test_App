import { Component, input, output, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LogoComponent } from '../../components/logo.component';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

interface MenuItem {
  label: string;
  route: string;
  iconPath: string;
  notification?: string | number;
  variant?: 'danger' | 'default';
}

/**
 * Top-level navigation map.
 * Defines which slugs are considered "top-level" and what Angular route they map to.
 * Nested slugs (e.g. "tax-engine/file/income-tax") are collapsed to their parent entry.
 */
const NAV_MAP: { slug: string; route: string; label: string; iconPath: string }[] = [
  {
    slug: 'dashboard',
    route: '/member/dashboard',
    label: 'Dashboard',
    iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
  },
  {
    slug: 'compliance',
    route: '/member/compliance/tcc',
    label: 'Compliance',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    slug: 'returns',
    route: '/member/returns',
    label: 'File Returns',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    slug: 'payments',
    route: '/member/payments',
    label: 'Payments',
    iconPath: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
  },
  {
    slug: 'debt',
    route: '/member/debt',
    label: 'Liabilities',
    iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    slug: 'installments',
    route: '/member/installments',
    label: 'Payment Plans',
    iconPath: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
  },
  {
    slug: 'statements',
    route: '/member/statements/ledger',
    label: 'Tax Ledger',
    iconPath: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    slug: 'etims',
    route: '/member/etims',
    label: 'eTIMS Invoicing',
    iconPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
  },
  {
    slug: 'correspondence',
    route: '/member/correspondence/notices',
    label: 'Notices',
    iconPath: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z'
  },
  {
    slug: 'objections',
    route: '/member/objections',
    label: 'Objections',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  {
    slug: 'refunds',
    route: '/member/refunds',
    label: 'Tax Refunds',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    slug: 'm-service',
    route: '/member/m-service',
    label: 'M-Service',
    iconPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 012 2z'
  },
  {
    slug: 'tax-engine',
    route: '/member/tax-engine/calculators',
    label: 'Tax Engine',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    slug: 'checkers',
    route: '/member/checkers/pin',
    label: 'KRA Checkers',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    slug: 'notifications',
    route: '/member/notifications/hub',
    label: 'Notifications',
    iconPath: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
  },
  {
    slug: 'tickets',
    route: '/member/helpdesk/tickets',
    label: 'Support',
    iconPath: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    slug: 'kb',
    route: '/member/helpdesk/knowledge-base',
    label: 'Knowledge Base',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    slug: 'clients',
    route: '/admin-portal/clients',
    label: 'Clients',
    iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
  },
  {
    slug: 'role-matrix',
    route: '/admin-portal/role-matrix',
    label: 'Role Matrix',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    slug: 'audit',
    route: '/admin-portal/audit',
    label: 'Audit Log',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
  },
  {
    slug: 'profile',
    route: '/member/profile',
    label: 'My Profile',
    iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
  }
];

@Component({
  selector: 'app-sidebar',
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
             <app-logo [height]="collapsed() ? '80%' : '100%'"></app-logo>
        </div>
      </div>

      <div class="nav-scroller-elite custom-scrollbar">
        <nav class="sidebar-nav-elite">
          @if (!collapsed()) {
            <p class="nav-domain-label">Operational Hub</p>
          }

          @for (item of menuItems(); track item.route) {
            <a [routerLink]="item.route"
               routerLinkActive="active"
               class="nav-link-elite"
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

              @if (item.notification && !collapsed()) {
                <div class="badge-ring" [class.danger]="item.variant === 'danger'">
                   <span class="badge-text">{{ item.notification }}</span>
                </div>
              }
            </a>
          }

          @if (menuItems().length === 0) {
            <p class="nav-empty-msg">No pages assigned to your role.</p>
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
           <span class="s-ver">v2.4.0-elite</span>
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
      border-bottom: 1px solid var(--border-light);
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
    .nav-domain-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; padding: 0 16px; margin: 16px 0 12px 0; }
    .nav-empty-msg { font-size: 0.8rem; color: var(--text-muted); padding: 16px; text-align: center; }

    .nav-link-elite {
      display: flex; align-items: center; gap: 16px; padding: 14px 16px;
      border-radius: 16px; color: var(--text-secondary); text-decoration: none;
      font-weight: 700; font-size: 0.95rem; transition: 0.3s; margin-bottom: 4px;
    }
    .nav-link-elite:hover { background: rgba(0,0,0,0.03); color: var(--text-main); }
    .nav-link-elite.active { background: var(--bg-active); color: var(--kra-red); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }

    .icon-frame {
      width: 40px; height: 40px; border-radius: 12px; background: transparent;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      transition: 0.3s;
    }
    .nav-link-elite.active .icon-frame { background: rgba(227,30,36,0.08); color: var(--kra-red); }
    .nav-icon-elite { width: 22px; height: 22px; }
    .link-label-elite { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .badge-ring {
      margin-left: auto; padding: 2px 8px; border-radius: 8px;
      background: var(--bg-hover); color: var(--text-secondary); font-size: 0.7rem; font-weight: 900;
    }
    .badge-ring.danger { background: #FEE2E2; color: #EF4444; }

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
export class SidebarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  collapsed = input(false);
  isMobileOpen = input(false);
  toggle = output<void>();
  closeMobile = output<void>();
  logout = output<void>();

  isDarkMode = this.themeService.darkMode;
  userName = this.authService.userName;
  userType = this.authService.userType;

  menuItems = computed<MenuItem[]>(() => {
    const grantedSlugs = this.authService.userPages().map((p: any) =>
      p.slug.replace(/^\/+|\/+$/g, '')
    );

    // Build top-level nav, only showing entries the user has access to
    return NAV_MAP.filter(entry => {
      const entrySlug = entry.slug.replace(/^\/+|\/+$/g, '');
      // Check if the user has this exact slug OR any sub-slug starting with it
      return grantedSlugs.some((g: string) => g === entrySlug || g.startsWith(entrySlug + '/'));
    });
  });

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
