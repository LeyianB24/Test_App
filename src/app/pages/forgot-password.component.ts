import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule, NgOptimizedImage],
  template: `
    <div class="forgot-root" [attr.data-theme]="theme()">

      <!-- Theme Toggle -->
      <button class="theme-toggle" type="button" (click)="toggleTheme()"
        [attr.aria-label]="theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
        @if (theme() === 'dark') {
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        } @else {
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        }
      </button>

      <!-- Left Panel: Recovery Intelligence -->
      <div class="left-panel">
        <div class="left-background"></div>
        <div class="left-grid"></div>
        <div class="left-glow"></div>
        
        <span class="corner-mark corner-tl"></span>
        <span class="corner-mark corner-tr"></span>
        <span class="corner-mark corner-bl"></span>
        <span class="corner-mark corner-br"></span>

        <div class="left-inner">
          <div class="brand-block">
            <div class="logo-wrap">
              <img ngSrc="assets/logo.png" width="84" height="84" alt="KRA Logo" priority class="logo-img">
              <div class="logo-ring"></div>
            </div>
            <div class="brand-text">
              <p class="brand-eyebrow">Kenya Revenue Authority</p>
              <h1 class="brand-name">iTax<span class="brand-accent">IS</span></h1>
            </div>
          </div>

          <div class="space-y-12">
            <div>
              <h2 class="text-xl font-black text-[var(--left-text)] uppercase tracking-tight mb-3">Password Recovery</h2>
              <p class="text-[11px] font-semibold text-[var(--left-muted)] leading-relaxed uppercase tracking-widest">
                Securely reset your password to regain access to your taxpayer account.
              </p>
            </div>

            <div class="space-y-6">
              <div class="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                 <div class="w-10 h-10 bg-[var(--accent)]/20 text-[var(--accent)] rounded-lg flex items-center justify-center">
                   <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                 </div>
                 <div>
                    <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Method 01</p>
                    <p class="text-sm font-black text-white uppercase tracking-tight">Email Verification</p>
                 </div>
              </div>
              <div class="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl opacity-40">
                 <div class="w-10 h-10 bg-white/10 text-white/40 rounded-lg flex items-center justify-center">
                   <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                 </div>
                 <div>
                    <p class="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Method 02</p>
                    <p class="text-sm font-black text-white uppercase tracking-tight">SMS Code</p>
                 </div>
              </div>
            </div>
          </div>

          <div class="mt-auto flex gap-4">
            <span class="footer-tag">SECURE RESET</span>
            <span class="footer-tag">ENCRYPTED</span>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="right-inner">
          <div class="form-card">
            
            @if (showSuccess()) {
              <div class="text-center animate-fade-in">
                <div class="w-20 h-20 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-8 animate-scale">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h2 class="form-title text-[var(--color-success)]">Reset Link Sent</h2>
                <p class="form-subtitle mb-12 uppercase tracking-widest text-[11px] font-bold">Please check your inbox: {{ forgotForm.get('email')?.value }}</p>
                
                <button class="submit-btn" routerLink="/login">
                  <span class="submit-inner">BACK TO SIGN IN</span>
                  <span class="submit-shimmer"></span>
                </button>
              </div>
            } @else {
              <!-- Form Header -->
              <div class="form-header">
                <div class="form-header-top">
                  <div class="session-badge">
                    <span class="pulse-dot"></span>
                    SECURE RECOVERY
                  </div>
                  <span class="form-ref uppercase font-bold tracking-tighter">Issue #RESET</span>
                </div>
                <h2 class="form-title">Trouble Signing In?</h2>
                <p class="form-subtitle">Enter your email and we'll send you a link to reset your password.</p>
              </div>

              <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="login-form">
                <div class="field-group mb-12">
                  <label class="field-label">Your Email Address</label>
                  <div class="relative">
                    <input type="email" formControlName="email" placeholder="name@email.com" class="field-input">
                    <div class="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                       <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <button type="submit" [disabled]="forgotForm.invalid || isSubmitting()" class="submit-btn">
                    <span class="submit-inner">
                       @if (!isSubmitting()) { SEND RESET LINK }
                       @else { 
                         <span class="spinner"></span>
                         SENDING... 
                        }
                    </span>
                    <span class="submit-shimmer"></span>
                  </button>
                  
                  <div class="text-center">
                    <a routerLink="/login" class="forgot-link text-[11px] font-bold uppercase tracking-widest hover:text-[var(--accent)]">Return to Sign In</a>
                  </div>
                </div>
              </form>
            }

            <div class="card-footer">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" class="text-[var(--accent)]">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/>
              </svg>
              OFFICIAL GOVERNMENT PORTAL &bull; ENCRYPTED SESSION
            </div>
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

    .forgot-root {
      display: flex;
      min-height: 100dvh;
      background: var(--bg);
      transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      --bg:             var(--bg-root, #f4f3f0);
      --bg-card:        var(--bg-surface-1, #ffffff);
      --bg-input:       var(--bg-surface-2, #f8f7f5);
      --border:         var(--border-default, #e2dfd9);
      --text-primary:   var(--text-primary, #141210);
      --text-secondary: var(--text-secondary, #6b6560);
      --text-muted:     var(--text-muted, #a09a94);
      --accent:         var(--color-accent, #c1392b);
      --accent-bg:      var(--color-accent-bg, #fdf2f1);
      --accent-dim:     var(--color-accent-dim, #e8b4af);
      --left-bg:        var(--brand-black, #141210);
      --left-text:      var(--brand-white, #f4f3f0);
      --left-muted:     rgba(255, 255, 255, 0.4);
      --left-border:    rgba(255, 255, 255, 0.05);
      --shadow-lg:      var(--shadow-xl);
      --r-xl:           var(--radius-xl, 24px);
      --r-lg:           var(--radius-lg, 12px);
      --tr:             200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .forgot-root[data-theme="dark"] {
      --bg:             var(--bg-root, #0a0908);
      --bg-card:        var(--bg-surface-1, #141211);
      --bg-input:       var(--bg-surface-2, #1c1a18);
      --border:         var(--border-subtle, #2a2724);
      --text-primary:   #f0ede8;
    }

    .theme-toggle {
      position: fixed; top: 32px; right: 32px; z-index: 100;
      width: 44px; height: 44px; border-radius: 50%;
      background: var(--bg-card); border: 1px solid var(--border);
      color: var(--text-secondary);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: var(--shadow-sm);
      transition: all var(--tr);
    }
    .theme-toggle:hover { 
      border-color: var(--accent); color: var(--accent); 
      transform: scale(1.1) rotate(15deg); 
    }

    .left-panel { width: 480px; flex-shrink: 0; background: var(--left-bg); position: relative; overflow: hidden; display: flex; flex-direction: column; }
    .left-background { position: absolute; inset: 0; background: radial-gradient(circle at 0% 0%, var(--accent) 0%, transparent 50%); opacity: 0.05; }
    .left-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--left-border) 1px, transparent 1px), linear-gradient(90deg, var(--left-border) 1px, transparent 1px); background-size: 50px 50px; opacity: 0.5; }
    .left-glow { position: absolute; top: -100px; left: -100px; width: 450px; height: 450px; border-radius: 50%; background: radial-gradient(circle, var(--accent) 0%, transparent 70%); filter: blur(80px); opacity: 0.15; }
    .corner-mark { position: absolute; width: 24px; height: 24px; border-color: var(--accent); border-style: solid; opacity: 0.3; }
    .corner-tl { top: 24px; left: 24px; border-width: 2px 0 0 2px; }
    .corner-tr { top: 24px; right: 24px; border-width: 2px 2px 0 0; }
    .corner-bl { bottom: 24px; left: 24px; border-width: 0 0 2px 2px; }
    .corner-br { bottom: 24px; right: 24px; border-width: 0 2px 2px 0; }

    .left-inner { position: relative; z-index: 1; padding: 64px 48px; display: flex; flex-direction: column; height: 100%; }
    .brand-block { display: flex; align-items: center; gap: 24px; margin-bottom: 48px; }
    .logo-wrap { position: relative; width: 84px; height: 84px; flex-shrink: 0; }
    .logo-img { width: 84px; height: 84px; border-radius: 16px; position: relative; z-index: 2; box-shadow: 0 12px 32px rgba(0,0,0,0.4); }
    .logo-ring { position: absolute; inset: -8px; border-radius: 22px; border: 2px solid var(--accent); opacity: 0.2; animation: ring-pulse 4s ease-in-out infinite; }
    @keyframes ring-pulse { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.1); opacity: 0.3; } }
    .brand-eyebrow { font-size: 10px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin: 0 0 4px; }
    .brand-name { font-size: 36px; font-weight: 900; color: var(--left-text); margin: 0; line-height: 1; letter-spacing: -0.04em; }
    .brand-accent { color: var(--accent); }
    .footer-tag { font-size: 9px; font-weight: 800; letter-spacing: 0.1em; padding: 6px 12px; border-radius: 6px; background: rgba(0,0,0,0.3); border: 1px solid var(--left-border); color: var(--left-muted); text-transform: uppercase; }

    .right-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; }
    .right-inner { width: 100%; max-width: 480px; }
    .form-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-xl); padding: 48px; box-shadow: var(--shadow-lg); animation: card-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
    @keyframes card-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    .form-header { margin-bottom: 40px; }
    .form-header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .session-badge { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: var(--accent); background: var(--accent-bg); border: 1px solid var(--accent-dim); padding: 6px 14px; border-radius: 30px; }
    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: blink 2s infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    .form-ref { font-size: 10px; font-weight: 700; color: var(--text-muted); }
    .form-title { font-size: 28px; font-weight: 900; color: var(--text-primary); margin: 0 0 8px; letter-spacing: -0.03em; }
    .form-subtitle { font-size: 14px; font-weight: 500; color: var(--text-secondary); margin: 0; line-height: 1.6; }

    .field-group { display: flex; flex-direction: column; gap: 10px; }
    .field-label { font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; tracking: 0.05em; margin-left: 4px; }
    .field-input { width: 100%; height: 50px; padding: 0 18px; background: var(--bg-input); border: 2px solid var(--border); border-radius: var(--r-lg); font-size: 14px; font-weight: 600; color: var(--text-primary); outline: none; transition: all 0.3s ease; }
    .field-input:focus { border-color: var(--accent); box-shadow: 0 0 0 5px var(--accent-bg); }

    .submit-btn { position: relative; width: 100%; height: 56px; background: var(--accent); border: none; border-radius: var(--r-lg); cursor: pointer; overflow: hidden; transition: all 0.4s ease; }
    .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(193,57,43,0.3); filter: brightness(1.1); }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .submit-inner { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; font-weight: 900; letter-spacing: 0.05em; color: white; }
    .submit-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); transform: skewX(-20deg) translateX(-150%); animation: shimmer 3s infinite; }
    @keyframes shimmer { 100% { transform: skewX(-20deg) translateX(250%); } }

    .spinner { width: 18px; height: 18px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.2); border-top-color: white; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .card-footer { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border); font-size: 10px; font-weight: 800; letter-spacing: 0.1em; color: var(--text-muted); text-transform: uppercase; }

    @media (max-width: 1024px) { .left-panel { width: 340px; } }
    @media (max-width: 960px) { .left-panel { display: none; } .right-panel { background: var(--bg); padding: 24px; } .form-card { padding: 32px; } }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  maskedEmail = signal('');
  isSubmitting = signal(false);
  errorMessage = signal('');
  showSuccess = signal(false);
  theme = signal<'light' | 'dark'>('light');
  sessionRef = signal('');

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(prefersDark ? 'dark' : 'light');
    this.sessionRef.set(Math.random().toString(36).substring(2, 8).toUpperCase());
  }

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    
    const { email } = this.forgotForm.getRawValue();

    this.authService.forgotPassword(email!).subscribe({
      next: (response: any) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.maskedEmail.set(response.masked_email || 'your registered security channel');
          this.showSuccess.set(true);
        } else {
          this.errorMessage.set(response.message || 'Identity verification sequence failed.');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Sync Failure. Uplink interrupted.');
      }
    });
  }
}
