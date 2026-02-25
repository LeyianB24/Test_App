import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { Component, inject, computed, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';
import { UserDataService } from './services/user-data.service';
import { DashboardDataService } from './services/dashboard-data.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, FooterComponent],
  template: `
    @if (isLoading()) {
      <div class="loading-overlay">
        <div class="spinner"></div>
      </div>
    }

    @if (isAuthenticated()) {
      <!-- Show layout when authenticated -->
      <div class="dashboard-container">

          <app-sidebar
              [collapsed]="isCollapsed"
              [isMobileOpen]="isMobileOpen"
              (toggle)="toggleSidebar()"
              (closeMobile)="isMobileOpen = false"
              (logout)="handleLogout()">
          </app-sidebar>

          <main class="main-content" [class.expanded]="isCollapsed">

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
    } @else {
      <!-- Guest view (login/register/forgot-password, no layout) -->
      <router-outlet></router-outlet>
    }
  `
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private dashboardData = inject(DashboardDataService);
  private router = inject(Router);

  isCollapsed = false;
  isMobileOpen = false;

  // Reactive authentication state
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  userData = this.userDataService.currentUser;
  userName = computed(() => this.userData()?.name || this.authService.userName());
  station = this.dashboardData.station;
  // We only show the global loading overlay while the initial auth state is unknown
  isLoading = computed(() => !this.authService.isInitialized());

  handleSidebarToggle() {
    if (window.innerWidth <= 768) {
      this.isMobileOpen = !this.isMobileOpen;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  handleLogout() {
    console.log('App: Logging out...');
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  // Initialize user data on app startup if authenticated
  ngOnInit() {
    // Session context is now handled automatically by AuthService constructor subscription
  }
}
