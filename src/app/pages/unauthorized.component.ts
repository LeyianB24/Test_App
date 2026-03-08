import { inject, Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-unauthorized',
  imports: [RouterModule],
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-[var(--bg)] p-6 font-plus-jakarta animate-fade-in" [attr.data-theme]="theme()">
      
      <!-- Background Decor -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-[150px] opacity-[0.03] pointer-events-none"></div>

      <div class="stat-card-precision !p-12 !bg-[var(--bg-card)]/80 backdrop-blur-xl border-accent/10 shadow-2xl max-w-lg w-full text-center relative overflow-hidden">
        
        <!-- Forensics Icon -->
        <div class="relative w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-10 group">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="transition-transform group-hover:scale-110">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <div class="absolute -inset-2 border border-accent/20 rounded-full animate-ping opacity-20"></div>
        </div>

        <!-- Security Message -->
        <div class="mb-10">
          <div class="status-pill-precision online py-2 px-4 shadow-sm inline-flex mb-8">
            <span class="text-[9px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Security Breach Detected
            </span>
          </div>
          <h2 class="text-3xl font-black text-primary tracking-tighter uppercase mb-4">Access <span class="text-accent">Denied</span></h2>
          <p class="text-[11px] font-semibold text-secondary uppercase tracking-[0.15em] leading-loose">
            Your current identity node does not possess the requisite clearance for this sector. 
            Verification sequence mismatch or session expiration.
          </p>
        </div>

        <!-- Actions -->
        <div class="space-y-4">
          <button routerLink="/" class="btn-precision btn-primary-precision !w-full !h-14 font-black uppercase tracking-[0.2em]">
            RETURN TO PERIMETER
          </button>
          
          <button (click)="onSignOut()" class="btn-precision btn-secondary-precision !w-full !h-12 font-black uppercase tracking-[0.2em]">
            CLEAR TRACE & RE-AUTHENTICATE
          </button>
        </div>

        @if (userRole()) {
          <div class="mt-10 pt-8 border-t border-[var(--border-subtle)]">
            <div class="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-tertiary">
              <span>IDENTIFIED CLEARANCE:</span>
              <span class="text-accent bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">{{ userRole() }}</span>
            </div>
          </div>
        }

        <div class="mt-8 text-center">
          <span class="text-[9px] font-black text-tertiary uppercase tracking-[0.3em] flex items-center justify-center gap-2">
             GOK INTEL &bull; SHA-256 ENCRYPTED
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class UnauthorizedComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  theme = signal<'light' | 'dark'>('light');

  userRole = () => this.authService.userRole();

  onSignOut() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
