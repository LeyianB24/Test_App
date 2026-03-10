import { inject, Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-unauthorized',
  imports: [RouterModule],
  template: `
    <div class="unauth-root" [attr.data-theme]="theme()">
      
      <!-- Background Decor -->
      <div class="background-grid"></div>
      <div class="background-glow"></div>

      <div class="unauth-inner">
        <div class="unauth-card">
          
          <!-- Access Icon -->
          <div class="icon-wrap">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <div class="icon-ring"></div>
          </div>

          <!-- Message -->
          <div class="mb-12">
            <div class="status-badge mb-8">
              <span class="pulse-dot"></span>
              ACCESS RESTRICTED
            </div>
            <h2 class="unauth-title">Access <span class="brand-accent">Denied</span></h2>
            <p class="unauth-subtitle">
              You do not have permission to view this page. 
              Please sign in with an account that has the required access levels.
            </p>
          </div>

          <!-- Actions -->
          <div class="space-y-4">
            <button routerLink="/" class="primary-btn">
              <span class="btn-inner">BACK TO DASHBOARD</span>
              <span class="btn-shimmer"></span>
            </button>
            
            <button (click)="onSignOut()" class="secondary-btn">
              SIGN OUT & LOGIN AGAIN
            </button>
          </div>

          @if (userRole()) {
            <div class="role-footer">
              <span class="footer-label">CURRENT ROLE</span>
              <span class="footer-value">{{ userRole() }}</span>
            </div>
          }

          <div class="card-footer">
            OFFICIAL KRA SECURITY &bull; ACCESS CONTROL
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

    :host { 
      display: block; 
      height: 100dvh; 
      font-family: 'Plus Jakarta Sans', sans-serif; 
    }

    .unauth-root {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100dvh;
      background: var(--bg);
      position: relative;
      overflow: hidden;
      padding: 24px;

      --bg:             var(--bg-root, #f4f3f0);
      --bg-card:        var(--bg-surface-1, #ffffff);
      --border:         var(--border-default, #e2dfd9);
      --text-primary:   var(--text-primary, #141210);
      --text-secondary: var(--text-secondary, #6b6560);
      --text-muted:     var(--text-muted, #a09a94);
      --accent:         var(--color-accent, #c1392b);
      --accent-bg:      var(--color-accent-bg, #fdf2f1);
      --accent-dim:     var(--color-accent-dim, #e8b4af);
      --r-xl:           var(--radius-xl, 24px);
      --r-lg:           var(--radius-lg, 12px);
    }

    .unauth-root[data-theme="dark"] {
      --bg:             var(--bg-root, #0a0908);
      --bg-card:        var(--bg-surface-1, #141211);
      --border:         var(--border-subtle, #2a2724);
      --text-primary:   #f0ede8;
    }

    .background-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 50px 50px; opacity: 0.2; pointer-events: none; }
    .background-glow { position: absolute; top: 0; right: 0; width: 600px; height: 600px; background: radial-gradient(circle, var(--accent) 0%, transparent 70%); filter: blur(100px); opacity: 0.05; pointer-events: none; }

    .unauth-inner { width: 100%; max-width: 520px; position: relative; z-index: 1; }
    .unauth-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 56px; text-align: center; box-shadow: var(--shadow-xl); animation: card-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    @keyframes card-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    .icon-wrap { width: 96px; height: 96px; background: var(--accent-bg); border: 1px solid var(--accent-dim); color: var(--accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 40px; position: relative; }
    .icon-ring { position: absolute; inset: -8px; border-radius: 50%; border: 1px solid var(--accent); opacity: 0.2; animation: icon-pulse 2s infinite; }
    @keyframes icon-pulse { 0%, 100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.1); opacity: 0.1; } }

    .status-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: var(--accent); background: var(--accent-bg); border: 1px solid var(--accent-dim); padding: 6px 14px; border-radius: 30px; }
    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: blink 2s infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

    .unauth-title { font-size: 32px; font-weight: 900; color: var(--text-primary); margin: 0 0 12px; letter-spacing: -0.03em; text-transform: uppercase; }
    .brand-accent { color: var(--accent); }
    .unauth-subtitle { font-size: 14px; font-weight: 500; color: var(--text-secondary); margin: 0; line-height: 1.6; }

    .primary-btn { position: relative; width: 100%; height: 56px; background: var(--accent); border: none; border-radius: var(--r-lg); cursor: pointer; overflow: hidden; transition: all 0.4s ease; display: flex; align-items: center; justify-content: center; }
    .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(193,57,43,0.3); filter: brightness(1.1); }
    .btn-inner { position: relative; z-index: 1; font-size: 14px; font-weight: 900; letter-spacing: 0.05em; color: white; }
    .btn-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); transform: skewX(-20deg) translateX(-150%); animation: shimmer 3s infinite; }
    @keyframes shimmer { 100% { transform: skewX(-20deg) translateX(250%); } }

    .secondary-btn { width: 100%; height: 50px; background: transparent; border: 2px solid var(--border); border-radius: var(--r-lg); font-size: 12px; font-weight: 800; color: var(--text-secondary); letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s ease; }
    .secondary-btn:hover { background: var(--accent-bg); border-color: var(--accent); color: var(--accent); }

    .role-footer { margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: center; gap: 12px; }
    .footer-label { font-size: 10px; font-weight: 800; color: var(--text-muted); opacity: 0.6; }
    .footer-value { font-size: 10px; font-weight: 900; color: var(--accent); background: var(--accent-bg); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--accent-dim); }

    .card-footer { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; margin-top: 32px; opacity: 0.6; }
  `]
})
export class UnauthorizedComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  theme = signal<'light' | 'dark'>('light');

  userRole = () => this.authService.userRole();

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(prefersDark ? 'dark' : 'light');
  }

  onSignOut() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
