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
    label: 'Knowledge Base',
    route: '/admin-portal/helpdesk/knowledge-base',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
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
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop-precision"
         *ngIf="isMobileOpen()"
         (click)="closeMobileMenu()">
    </div>

    <aside class="sidebar-precision"
           [class.collapsed]="collapsed()"
           [class.mobile-open]="isMobileOpen()">

      <!-- Branding -->
      <div class="sidebar-logo-precision">
        <img src="assets/logo.png" class="sidebar-logo-img" alt="KRA Logo">
        <span class="sidebar-logo-text">Staff Portal<span class="logo-accent-dot"></span></span>
      </div>

      <div class="nav-scroller-precision custom-scrollbar">
        <nav class="sidebar-nav-precision">
          @if (!collapsed()) {
            <p class="nav-section-label-precision">Administration Suite</p>
          }

          @for (item of menuItems; track item.route) {
            <a [routerLink]="item.route"
               routerLinkActive="active"
               class="nav-link-precision"
               [title]="item.label"
               (click)="closeMobileMenu()">

              <svg class="nav-link-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" [attr.d]="item.iconPath" />
              </svg>

              <span class="nav-link-label">{{ item.label }}</span>
            </a>
          }
        </nav>
      </div>

      <!-- Footer -->
      <div class="sidebar-footer-precision">
          <button class="btn-precision btn-ghost-precision w-full justify-start mb-2" (click)="themeService.toggleTheme()">
             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path *ngIf="isDarkMode()" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                <path *ngIf="!isDarkMode()" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
             </svg>
             <span class="nav-link-label">{{ isDarkMode() ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>

          <button class="btn-precision btn-ghost-precision w-full justify-start text-red-400" (click)="handleLogout()">
             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
             <span class="nav-link-label">Logout</span>
          </button>
      </div>
    </aside>
  `,
  styles: [``]
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
