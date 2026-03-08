import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LoginCredentials } from '../core/models/app.models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule, NgOptimizedImage],
  template: `
    <div class="fixed inset-0 flex bg-[var(--bg-root)] transition-all duration-300 overflow-hidden font-plus-jakarta" [attr.data-theme]="theme()">

      <!-- Left Panel: Intelligence Matrix (Always Dark for Contrast) -->
      <div class="hidden lg:flex w-[480px] bg-[var(--brand-black)] relative overflow-hidden flex-col p-12 shrink-0">
        <!-- Grid Pattern Overlay -->
        <div class="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style="background-image: linear-gradient(var(--bg-surface-1) 1px, transparent 1px), linear-gradient(90deg, var(--bg-surface-1) 1px, transparent 1px); background-size: 40px 40px;">
        </div>
        
        <!-- Ambient Glow -->
        <div class="absolute -top-20 -left-20 w-80 h-80 bg-[var(--color-accent)] rounded-full blur-[120px] opacity-10"></div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center gap-5 mb-16">
            <div class="relative w-14 h-14 shrink-0">
              <img ngSrc="assets/logo.png" width="56" height="56" alt="KRA Logo" priority class="relative z-10 rounded-xl">
              <div class="absolute -inset-1 border border-[var(--color-accent)]/30 rounded-2xl animate-pulse"></div>
            </div>
            <div>
              <p class="text-[10px] font-black text-[var(--color-accent)] uppercase tracking-[0.2em] mb-1">Kenya Revenue Authority</p>
              <h1 class="text-3xl font-black text-[var(--brand-white)] tracking-tighter">iTax<span class="text-[var(--color-accent)]">IS</span></h1>
            </div>
          </div>

          <div class="space-y-8 flex-grow">
            <div>
              <h2 class="text-xl font-black text-[var(--brand-white)] uppercase tracking-tight mb-4 leading-tight">National Revenue<br><span class="text-[var(--color-accent)]">Intelligence Suite</span></h2>
              <p class="text-xs font-semibold text-[var(--brand-white)]/40 leading-relaxed uppercase tracking-widest">Authorized Personnel Access Only. Protected by AES-256 Protocol Encryption and Real-time Threat Mitigation.</p>
            </div>

            <div class="h-[1px] bg-gradient-to-r from-[var(--color-accent)]/40 to-transparent"></div>

            @if (systemStatus()) {
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] shadow-[0_0_8px_rgba(22,163,74,0.6)]"></span>
                  <span class="text-[10px] font-black text-[var(--brand-white)]/40 uppercase tracking-[0.2em]">Operational Pulse</span>
                </div>
                <div class="grid grid-cols-1 gap-3">
                  @for (portal of systemStatus(); track portal.name) {
                    <div class="flex items-center justify-between p-4 bg-[var(--brand-white)]/5 border border-[var(--brand-white)]/10 rounded-xl">
                      <div class="flex items-center gap-3">
                        <div class="w-1.5 h-1.5 rounded-full" [class]="portal.online ? 'bg-[var(--color-success)]' : 'bg-[var(--color-accent)]'"></div>
                        <span class="text-[10px] font-black text-[var(--brand-white)] tracking-widest uppercase">{{ portal.name }}</span>
                      </div>
                      <span class="text-[9px] font-black" [class]="portal.online ? 'text-[var(--color-success)]' : 'text-[var(--color-accent)]'">
                        {{ portal.online ? 'SYNC' : 'VOID' }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div class="flex gap-4 mt-auto opacity-40">
            <span class="text-[8px] font-black text-[var(--brand-white)] border border-[var(--brand-white)]/20 px-2 py-1 rounded">GOK.SEC.001</span>
            <span class="text-[8px] font-black text-[var(--brand-white)] border border-[var(--brand-white)]/20 px-2 py-1 rounded">ISO 27001</span>
            <span class="text-[8px] font-black text-[var(--brand-white)] border border-[var(--brand-white)]/20 px-2 py-1 rounded">TLS 1.3</span>
          </div>
        </div>
      </div>

      <!-- Right Panel: Command Input -->
      <div class="flex-1 flex items-center justify-center p-6 relative">
        <!-- Theme Toggle -->
        <button (click)="toggleTheme()" 
          class="absolute top-8 right-8 w-10 h-10 rounded-full bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-all hover:scale-110 shadow-sm z-50">
          @if (theme() === 'dark') {
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          } @else {
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
        </button>

        <div class="w-full max-w-[440px] animate-fade-in-up">
          <div class="bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-10 shadow-[var(--shadow-lg)] relative overflow-hidden">
            <!-- Form Header -->
            <div class="mb-10 text-center lg:text-left">
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent-bg)] border border-[var(--color-accent-dim)] rounded-full animate-pulse">
                  <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                  <span class="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">Command Auth</span>
                </div>
                <span class="text-[9px] font-mono font-medium text-[var(--text-muted)] uppercase tracking-widest">ID: {{ sessionRef() }}</span>
              </div>
              <h2 class="text-[var(--text-3xl)] font-black text-[var(--text-primary)] tracking-tighter uppercase mb-3">Sign <span class="text-[var(--color-accent)]">In</span></h2>
              <p class="text-[var(--text-xs)] font-semibold text-[var(--text-secondary)] uppercase tracking-widest leading-loose">Access your strategic identity node.</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-6">
              <!-- KRA PIN -->
              <div class="space-y-2 group">
                <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Deployment ID (PIN)</label>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--color-accent)]">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <input type="text" formControlName="taxpayer_id" 
                    placeholder="e.g. A001234567X" 
                    class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] pl-12 pr-4 text-[var(--text-sm)] font-mono font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] focus:shadow-[var(--shadow-focus)] outline-none uppercase transition-all">
                </div>
              </div>

              <!-- Password -->
              <div class="space-y-2 group">
                <div class="flex items-center justify-between ml-1">
                  <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] transition-colors group-focus-within:text-[var(--color-accent)]">Access Key</label>
                  <a routerLink="/forgot-password" class="text-[9px] font-black text-[var(--text-muted)] hover:text-[var(--color-accent)] uppercase tracking-widest transition-colors">Recover Key</a>
                </div>
                <div class="relative">
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--color-accent)]">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  </div>
                  <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" 
                    placeholder="••••••••••••" 
                    class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] pl-12 pr-12 text-[var(--text-sm)] font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] focus:shadow-[var(--shadow-focus)] outline-none transition-all">
                  <button type="button" (click)="togglePasswordVisibility()" 
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--color-accent)] transition-colors">
                    @if (!showPassword()) {
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    } @else {
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    }
                  </button>
                </div>
              </div>

              <!-- Persistence Toggle -->
              <div class="flex items-center gap-3 ml-1 py-1">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" formControlName="rememberMe" class="sr-only peer">
                  <div class="w-9 h-5 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-[var(--color-accent)] peer-checked:bg-[var(--color-accent-bg)] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[var(--text-muted)] after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                </label>
                <span class="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Persist Session</span>
              </div>

              <!-- Errors -->
              @if (errorMessage()) {
                <div class="p-4 bg-[var(--color-accent-bg)] border border-[var(--color-accent-dim)] rounded-[var(--radius-md)] text-[var(--color-danger)] animate-shake">
                  <div class="flex items-center gap-3">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span class="text-[var(--text-xs)] font-black uppercase tracking-widest">{{ errorMessage() }}</span>
                  </div>
                </div>
              }

              <!-- Submit -->
              <button type="submit" [disabled]="isLoading() || loginForm.invalid"
                class="w-full h-12 px-6 bg-[var(--color-accent)] text-[var(--brand-white)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.1em] relative overflow-hidden group transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] disabled:opacity-45 disabled:cursor-not-allowed">
                <div class="relative z-10 flex items-center justify-center gap-3">
                  @if (!isLoading()) {
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                    INITIALIZE ACCESS
                  } @else {
                    <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    VERIFYING...
                  }
                </div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[3000ms]"></div>
              </button>
            </form>

            <div class="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center">
              <span class="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" class="text-[var(--color-accent)]"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/></svg>
                SHA-256 SECURED &bull; TLS 1.3
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [``]
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router      = inject(Router);
  private http        = inject(HttpClient);
  private fb          = inject(FormBuilder);

  loginForm = this.fb.group({
    taxpayer_id: ['', Validators.required],
    password:    ['', Validators.required],
    rememberMe:  [false]
  });

  isLoading    = signal(false);
  errorMessage = signal<string>('');
  showPassword = signal(false);
  systemStatus = signal<any>(null);
  pinFocused   = signal(false);
  pwFocused    = signal(false);
  theme        = signal<'light' | 'dark'>('light');
  sessionRef   = signal('');

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(prefersDark ? 'dark' : 'light');
    this.sessionRef.set(Math.random().toString(36).substring(2, 8).toUpperCase());
    this.fetchSystemStatus();
  }

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { taxpayer_id, password } = this.loginForm.getRawValue();
    const credentials: LoginCredentials = { taxpayer_id: taxpayer_id!, password: password! };
    const rememberMe = !!this.loginForm.get('rememberMe')?.value;

    this.authService.login(credentials, rememberMe).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          const portal = this.authService.roleCategory() === 'member'
            ? '/member/dashboard'
            : '/admin-portal/dashboard';
          this.router.navigate([portal], { replaceUrl: true });
        } else {
          this.errorMessage.set(response.message || 'Access Denied. Identity validation failed.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Sync Failure. Uplink interrupted.');
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(val => !val);
  }

  private fetchSystemStatus() {
    this.http.get<any>(`${environment.apiUrl}/status_check.php`).subscribe({
      next: (res) => { if (res?.success) this.systemStatus.set(res.data); },
      error: () => { /* Fail silently */ }
    });
  }
}