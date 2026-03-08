import { inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-unauthorized',
  imports: [RouterModule],
  template: `
    <div class="unauthorized-container">
      <div class="glass-card text-center animate-up">
        <div class="icon-box-denied mb-24">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2"/>
          </svg>
        </div>
        <h1 class="gradient-text">Access Denied</h1>
        <p>You do not have the required permissions to access this terminal. This might be due to an expired session or insufficient privileges.</p>
        
        <div class="action-stack mt-40">
          <a routerLink="/" class="modern-btn primary-btn full-width">Return to Security Perimeter</a>
          <button (click)="onSignOut()" class="modern-btn secondary-btn full-width mt-12">
            Clear Session & Sign In Again
          </button>
        </div>

        @if (userRole()) {
          <div class="debug-hint mt-32">
            <span class="label">Identified Role:</span>
            <span class="value">{{ userRole() }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0b;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1); padding: 60px; border-radius: 40px; max-width: 540px;
    }
    .icon-box-denied { color: var(--kra-red); display: flex; justify-content: center; }
    h1 { font-size: 2.5rem; font-weight: 900; margin: 0; }
    p { color: rgba(255,255,255,0.6); margin-top: 20px; font-size: 1.1rem; line-height: 1.6; }
    .gradient-text { background: var(--kra-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .mt-40 { margin-top: 40px; }
    .mt-12 { margin-top: 12px; }
    .mt-32 { margin-top: 32px; }
    .mb-24 { margin-bottom: 24px; }
    .full-width { width: 100%; display: block; }
    .action-stack { display: flex; flex-direction: column; }
    
    .debug-hint { font-size: 0.8rem; color: rgba(255,255,255,0.3); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; }
    .debug-hint .label { font-weight: 800; text-transform: uppercase; margin-right: 8px; }
    .debug-hint .value { color: var(--kra-red); }
  `]
})
export class UnauthorizedComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userRole = () => this.authService.userRole();

  onSignOut() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
