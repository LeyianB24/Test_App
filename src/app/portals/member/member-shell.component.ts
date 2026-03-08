import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from '../../layout/sidebar/sidebar.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

/**
 * MemberShellComponent — Layout shell for the Taxpayer (Member) portal.
 * Renders the sidebar, header, and a <router-outlet> for all /member/* child routes.
 */
@Component({
  selector: 'app-member-shell',
  imports: [RouterModule, SidebarComponent, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container">
      <app-sidebar
        [collapsed]="isCollapsed()"
        [isMobileOpen]="isMobileOpen()"
        (toggle)="toggleSidebar()"
        (closeMobile)="isMobileOpen.set(false)"
        (logout)="handleLogout()">
      </app-sidebar>

      <main class="main-content" [class.expanded]="isCollapsed()">
        <app-header
          (toggleSidebar)="handleSidebarToggle()"
          (logout)="handleLogout()">
        </app-header>

        <div class="content-wrapper">
          <router-outlet></router-outlet>
          <app-footer></app-footer>
        </div>
      </main>
    </div>
  `
})
export class MemberShellComponent {
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
