import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { LogoComponent } from '../../components/logo.component';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { environment } from '../../../environments/environment';

interface MenuItem {
  label: string;
  route: string;
  iconPath: string;
  notification?: string | number;
  variant?: 'danger' | 'default';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoComponent],
  template: `
    <div class="mobile-backdrop-elite"
         *ngIf="isMobileOpen"
         (click)="closeMobileMenu()">
    </div>

    <aside class="sidebar-elite"
           [class.collapsed]="collapsed"
           [class.mobile-open]="isMobileOpen">

      <!-- Premium Branding - Logo Only -->
      <div class="sidebar-brand-elite">
        <div class="logo-sphere">
             <app-logo [height]="collapsed ? '80%' : '100%'"></app-logo>
        </div>
      </div>

      <div class="nav-scroller-elite custom-scrollbar">
        <nav class="sidebar-nav-elite">
          <p class="nav-domain-label" *ngIf="!collapsed">Operational Hub</p>

          <a *ngFor="let item of menuItems"
             [routerLink]="item.route"
             routerLinkActive="active"
             class="nav-link-elite"
             [title]="item.label"
             (click)="closeMobileMenu()">

            <div class="icon-frame">
              <svg class="nav-icon-elite" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" [attr.d]="item.iconPath" />
              </svg>
            </div>

            <span class="link-label-elite" *ngIf="!collapsed">{{ item.label }}</span>

            <div class="badge-ring" *ngIf="item.notification && !collapsed" [class.danger]="item.variant === 'danger'">
               <span class="badge-text">{{ item.notification }}</span>
            </div>
          </a>
        </nav>
      </div>

      <!-- Sophisticated Footer -->
      <div class="sidebar-footer-elite">
        <div class="footer-actions-elite">
          <button class="footer-btn-elite" (click)="themeService.toggleTheme()" [title]="isDarkMode() ? 'Switch to Vitality Mode' : 'Switch to Dark Mode'">
            <div class="f-icon-box">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path *ngIf="isDarkMode()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                <path *ngIf="!isDarkMode()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <span class="f-label" *ngIf="!collapsed">{{ isDarkMode() ? 'Light Mode' : 'Dark Mode' }}</span>
          </button>

          <button class="footer-btn-elite logout" (click)="handleLogout()" title="Terminate Session">
            <div class="f-icon-box">
               <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </div>
            <span class="f-label" *ngIf="!collapsed">Logout</span>
          </button>
        </div>

        <div class="system-seal-elite" *ngIf="!collapsed">
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
      height: 90px; /* Aligned with header */
      display: flex; align-items: center; justify-content: center;
      padding: 10px 20px;
      border-bottom: 1px solid var(--border-light);
      background: var(--bg-surface);
      transition: all 0.3s ease;
    }
    :host-context(.dark-theme) .sidebar-brand-elite {
      background: var(--bg-surface); /* Ensure dark mode bg matches */
      border-bottom-color: var(--border-color);
    }
    .logo-sphere {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-text-luxury { display: flex; flex-direction: column; }
    .brand-text-luxury .b-main { font-size: 1.3rem; font-weight: 900; color: var(--text-main); letter-spacing: -1px; }
    .brand-text-luxury .b-highlight { color: var(--kra-red); }
    .brand-text-luxury .b-sub { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px; }

    .user-block-elite {
      padding: 24px; display: flex; align-items: center; gap: 16px;
      background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.01));
    }
    .avatar-ring { position: relative; }
    .u-avatar-elite {
      width: 48px; height: 48px; background: var(--kra-gradient); color: white;
      border-radius: 16px; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 1.25rem; box-shadow: 0 8px 16px rgba(227, 30, 36, 0.15);
    }
    .status-indicator-lite {
      position: absolute; bottom: -2px; right: -2px; width: 14px; height: 14px;
      background: #10B981; border: 3px solid var(--bg-surface); border-radius: 50%;
    }
    .u-name-elite { font-weight: 800; color: var(--text-main); font-size: 0.95rem; }
    .u-badge-elite { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

    .nav-scroller-elite { flex: 1; padding: 12px; }
    .nav-domain-label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; padding: 0 16px; margin: 16px 0 12px 0; }

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
    .collapsed .nav-domain-label, .collapsed .nav-label-elite, .collapsed .u-meta-elite, .collapsed .sidebar-footer-elite .f-label { display: none; }
    .collapsed .nav-link-elite { justify-content: center; padding: 14px 0; }
    .collapsed .user-block-elite { justify-content: center; padding: 20px 0; }
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
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private http = inject(HttpClient);
  private router = inject(Router);

  @Input() collapsed = false;
  @Input() isMobileOpen = false;
  @Output() toggle = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  isDarkMode = this.themeService.darkMode;
  userName = this.authService.userName;
  userType = this.authService.userType;

  userTypeLabel = computed(() => {
    const type = this.userType();
    return type === 'individual' ? 'Resident' :
           type === 'business' ? 'Corporate' : 'System';
  });

  menuItems: MenuItem[] = [];

  constructor() {
    this.loadNavigation();
  }

  private loadNavigation() {
    // Fetch navigation based on user role permissions
    this.http.get<any>(`${environment.apiUrl}/admin_role_matrix.php?action=get_navigation`, { withCredentials: true }).subscribe({
      next: (res) => {
        if (res && res.data && res.data.pages) {
          this.menuItems = res.data.pages.map((p: any) => ({
            label: p.title,
            route: '/' + p.slug,
            iconPath: p.iconPath || 'M4 6h16'
          }));
        }
      },
      error: (err) => {
        console.error('Failed to load navigation:', err);
        // Fallback to empty menu on error
        this.menuItems = [];
      }
    });
  }

  handleLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        this.logout.emit();
      },
      error: (error) => console.error('❌ Logout error:', error)
    });
  }

  onToggleSidebar() { this.toggle.emit(); }
  closeMobileMenu() { this.closeMobile.emit(); }
}
