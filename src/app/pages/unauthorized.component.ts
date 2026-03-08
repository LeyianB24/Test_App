import { inject, Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-unauthorized',
  imports: [RouterModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-[var(--bg-root)] p-6 font-plus-jakarta animate-fade-in-up" [attr.data-theme]="theme()">
      
      <!-- Background Decor -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>

      <div class="bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-12 shadow-[var(--shadow-lg)] backdrop-blur-xl max-w-lg w-full text-center relative overflow-hidden">
        
        <!-- Forensics Icon -->
        <div class="relative w-20 h-20 bg-[var(--color-accent-bg)] text-[var(--color-accent)] rounded-full flex items-center justify-center mx-auto mb-10 group">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover:scale-110">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <div class="absolute -inset-2 border border-[var(--color-accent-dim)] rounded-full animate-ping opacity-20"></div>
        </div>

        <!-- Security Message -->
        <div class="mb-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent-bg)] border border-[var(--color-accent-dim)] rounded-full animate-pulse shadow-sm mb-8">
            <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
            <span class="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">Access Restricted</span>
          </div>
          <h2 class="text-[var(--text-3xl)] font-black text-[var(--text-primary)] tracking-tighter uppercase mb-4">Access <span class="text-[var(--color-accent)]">Denied</span></h2>
          <p class="text-[var(--text-xs)] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.15em] leading-loose">
            You do not have permission to access this page. 
            Please sign in with the correct account or contact support.
          </p>
        </div>

        <!-- Actions -->
        <div class="space-y-4">
          <button routerLink="/" class="w-full h-14 px-6 bg-[var(--color-accent)] text-[var(--brand-white)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.2em] transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
            BACK TO DASHBOARD
          </button>
          
          <button (click)="onSignOut()" class="w-full h-12 px-6 border border-[var(--border-default)] text-[var(--text-secondary)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-md)] uppercase tracking-[0.2em] hover:bg-[var(--bg-surface-2)] transition-all">
            SIGN OUT & LOGIN AGAIN
          </button>
        </div>

        @if (userRole()) {
          <div class="mt-10 pt-8 border-t border-[var(--border-subtle)]">
            <div class="flex items-center justify-center gap-4 text-[var(--text-2xs)] font-black uppercase tracking-widest text-[var(--text-muted)]">
              <span>YOUR CURRENT ROLE:</span>
              <span class="text-[var(--color-accent)] bg-[var(--color-accent-bg)] px-3 py-1 rounded-lg border border-[var(--color-accent-dim)]">{{ userRole() }}</span>
            </div>
          </div>
        }

        <div class="mt-8 text-center">
          <span class="text-[var(--text-2xs)] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
             OFFICIAL KRA SECURITY &bull; ACCESS CONTROL
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [``]
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
