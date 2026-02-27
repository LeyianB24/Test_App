import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../layout/admin/sidebar/admin-sidebar.component';
import { AdminHeaderComponent } from '../../layout/admin/header/admin-header.component';
import { AdminFooterComponent } from '../../layout/admin/footer/admin-footer.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

/**
 * AdminShellComponent — Layout shell for the Admin portal.
 * Renders the admin sidebar, header, and a <router-outlet> for all /admin-portal/* child routes.
 */
@Component({
  selector: 'app-admin-shell',
  imports: [CommonModule, RouterModule, AdminSidebarComponent, AdminHeaderComponent, AdminFooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container admin-portal-theme">
      <app-admin-sidebar
        [collapsed]="isCollapsed()"
        [isMobileOpen]="isMobileOpen()"
        (toggle)="toggleSidebar()"
        (closeMobile)="isMobileOpen.set(false)"
        (logout)="handleLogout()">
      </app-admin-sidebar>

      <main class="main-content" [class.expanded]="isCollapsed()">
        <app-admin-header
          (toggleSidebar)="handleSidebarToggle()"
          (logout)="handleLogout()">
        </app-admin-header>

        <div class="content-wrapper">
          <router-outlet></router-outlet>
          <app-admin-footer></app-admin-footer>
        </div>
      </main>
    </div>
  `
})
export class AdminShellComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isCollapsed = signal(false);
  isMobileOpen = signal(false);

  toggleSidebar() {
    this.isMobileOpen.update(v => !v);
  }

  handleSidebarToggle() {
    this.isCollapsed.update(v => !v);
  }

  handleLogout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
