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
    <div class="login-root" [attr.data-theme]="theme()">

      <!-- Theme Toggle -->
      <button class="theme-toggle" type="button" (click)="toggleTheme()"
        [attr.aria-label]="theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
        @if (theme() === 'dark') {
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        } @else {
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        }
      </button>

      <!-- Left Panel -->
      <div class="left-panel">
        <div class="left-grid"></div>
        <div class="left-glow"></div>
        <span class="corner-mark corner-tl"></span>
        <span class="corner-mark corner-tr"></span>
        <span class="corner-mark corner-bl"></span>
        <span class="corner-mark corner-br"></span>

        <div class="left-inner">
          <div class="brand-block">
            <div class="logo-wrap">
              <img ngSrc="assets/logo.png" width="52" height="52" alt="KRA Logo" priority class="logo-img">
              <div class="logo-ring"></div>
            </div>
            <div class="brand-text">
              <p class="brand-eyebrow">Kenya Revenue Authority</p>
              <h1 class="brand-name">iTax<span class="brand-accent">IS</span></h1>
              <p class="brand-sub">Security & Recovery</p>
            </div>
          </div>

          <p class="brand-tagline">
            Official identity restoration protocol.<br>Enter your Taxpayer PIN to initiate secure recovery.
          </p>

          <div class="divider-rule"></div>
          
          <div class="left-footer">
            <span class="footer-tag">GOK CERTIFIED</span>
            <span class="footer-tag">ISO 27001</span>
            <span class="footer-tag">AES-256</span>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="right-inner">
          <div class="form-card">

            <div class="form-header">
              <div class="form-header-top">
                <div class="session-badge">
                  <span class="pulse-dot"></span>
                  SECURE RECOVERY
                </div>
                <span class="form-ref">REF: RC-{{ sessionRef() }}</span>
              </div>
              
              @if (!showSuccess()) {
                <h2 class="form-title">Reset Password</h2>
                <p class="form-subtitle">Verify your identity to establish a new security cipher.</p>
              } @else {
                <h2 class="form-title">Transmission Complete</h2>
                <p class="form-subtitle">Identity verified. A secure reset token has been dispatched.</p>
              }
            </div>

            @if (!showSuccess()) {
              <form [formGroup]="recoveryForm" (ngSubmit)="onSubmit()" class="login-form">
                
                <div class="field-group" [class.field-focused]="pinFocused()">
                  <label class="field-label">KRA PIN / ID Number</label>
                  <div class="field-wrap">
                    <div class="field-icon">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      formControlName="taxpayer_id"
                      placeholder="e.g. A000123456Z"
                      class="field-input"
                      (focus)="pinFocused.set(true)"
                      (blur)="pinFocused.set(false)"
                    />
                  </div>
                </div>

                @if (errorMessage()) {
                  <div class="error-bar">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{{ errorMessage() }}</span>
                  </div>
                }

                <button type="submit" class="submit-btn" [disabled]="recoveryForm.invalid || isSubmitting()">
                  <span class="submit-inner">
                    @if (!isSubmitting()) {
                      Authorize Recovery
                    } @else {
                      <span class="spinner"></span>
                      Tracing Records...
                    }
                  </span>
                  <span class="submit-shimmer"></span>
                </button>

                <div class="mt-4 text-center">
                  <a routerLink="/login" class="forgot-link text-xs">Back to Authentication</a>
                </div>

              </form>
            } @else {
              <div class="success-vault animate-scale">
                <div class="p-6 bg-accent-bg border border-accent-dim rounded-2xl text-center">
                  <p class="text-sm font-medium text-text-secondary leading-relaxed">
                    Identity verified. A secure reset token has been dispatched to:<br>
                    <strong class="text-primary italic">{{ maskedEmail() }}</strong>
                  </p>
                </div>
                <button class="submit-btn mt-10" routerLink="/login">
                  <span class="submit-inner">Return to Security Gateway</span>
                </button>
              </div>
            }

            <div class="card-footer">
              <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/>
              </svg>
              SHA-256 &bull; Secure Protocol &bull; TLS 1.3
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

    /* ── Variables ───────────────────────────────────────── */
    :host { display: block; height: 100dvh; font-family: 'Plus Jakarta Sans', sans-serif; }

    .login-root {
      --r: 8px;
      --tr: 180ms ease;

      /* Light theme */
      --bg:             #f4f3f0;
      --bg-card:        #ffffff;
      --bg-input:       #f8f7f5;
      --bg-input-focus: #ffffff;
      --border:         #e2dfd9;
      --text-primary:   #141210;
      --text-secondary: #6b6560;
      --text-muted:     #a09a94;
      --accent:         #c1392b;
      --accent-dim:     #e8b4af;
      --accent-bg:      #fdf2f1;
      --left-bg:        #141210;
      --left-text:      #f4f3f0;
      --left-muted:     #807a74;
      --left-border:    #2a2622;
      --left-accent:    #c1392b;
      --left-tag-bg:    #1e1a17;
      --shadow-lg:      0 16px 48px rgba(0,0,0,.12), 0 4px 16px rgba(0,0,0,.06);
      --submit-bg:      #c1392b;
      --submit-hover:   #a83224;
      --error-bg:       #fdf2f1;
      --error-border:   #f5c2bb;
      --error-text:     #a83224;
    }

    /* Dark theme */
    .login-root[data-theme="dark"] {
      --bg:             #0e0c0b;
      --bg-card:        #181512;
      --bg-input:       #1e1a17;
      --bg-input-focus: #231f1b;
      --border:         #2e2924;
      --text-primary:   #f0ede8;
      --text-secondary: #9c9590;
      --text-muted:     #5c5650;
      --accent:         #e04534;
      --accent-dim:     #7a2318;
      --accent-bg:      #1a100e;
      --left-bg:        #0a0908;
      --left-text:      #f0ede8;
      --left-muted:     #5c5650;
      --left-border:    #1e1a17;
      --left-accent:    #e04534;
      --left-tag-bg:    #141210;
      --shadow-lg:      0 16px 48px rgba(0,0,0,.6), 0 4px 16px rgba(0,0,0,.3);
      --submit-hover:   #e04534;
      --error-bg:       #1a100e;
      --error-border:   #7a2318;
      --error-text:     #f5887e;
    }

    /* ── Layout ──────────────────────────────────────────── */
    .login-root {
      display: flex; min-height: 100dvh;
      background: var(--bg); transition: background .3s ease;
      position: relative;
    }

    /* ── Theme Toggle ────────────────────────────────────── */
    .theme-toggle {
      position: fixed; top: 20px; right: 20px; z-index: 100;
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--bg-card); border: 1px solid var(--border);
      color: var(--text-secondary);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,.08);
      transition: all var(--tr);
    }
    .theme-toggle:hover { border-color: var(--accent); color: var(--accent); transform: rotate(20deg); }

    /* ── Left Panel ──────────────────────────────────────── */
    .left-panel {
      width: 400px; flex-shrink: 0;
      background: var(--left-bg);
      position: relative; overflow: hidden;
      display: flex; flex-direction: column;
    }
    .left-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(var(--left-border) 1px, transparent 1px),
        linear-gradient(90deg, var(--left-border) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: .35; pointer-events: none;
    }
    .left-glow {
      position: absolute; top: -80px; left: -80px;
      width: 320px; height: 320px; border-radius: 50%;
      background: radial-gradient(circle, rgba(193,57,43,.2) 0%, transparent 70%);
      pointer-events: none;
    }
    .corner-mark {
      position: absolute; width: 12px; height: 12px;
      border-color: var(--left-accent); border-style: solid; opacity: .5;
    }
    .corner-tl { top: 16px;    left: 16px;   border-width: 1px 0 0 1px; }
    .corner-tr { top: 16px;    right: 16px;  border-width: 1px 1px 0 0; }
    .corner-bl { bottom: 16px; left: 16px;   border-width: 0 0 1px 1px; }
    .corner-br { bottom: 16px; right: 16px;  border-width: 0 1px 1px 0; }

    .left-inner {
      position: relative; z-index: 1;
      padding: 48px 40px;
      display: flex; flex-direction: column; height: 100%;
    }

    /* Brand */
    .brand-block { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
    .logo-wrap   { position: relative; width: 52px; height: 52px; flex-shrink: 0; }
    .logo-img    { width: 52px; height: 52px; border-radius: 10px; position: relative; z-index: 1; }
    .logo-ring {
      position: absolute; inset: -4px; border-radius: 14px;
      border: 1px solid rgba(193,57,43,.4);
      animation: ring-pulse 3s ease-in-out infinite;
    }
    @keyframes ring-pulse {
      0%, 100% { opacity: .4; transform: scale(1); }
      50%       { opacity: .8; transform: scale(1.04); }
    }
    .brand-eyebrow {
      font-size: 9px; font-weight: 600; letter-spacing: .12em;
      text-transform: uppercase; color: var(--left-accent); margin: 0 0 2px;
    }
    .brand-name {
      font-size: 26px; font-weight: 800; color: var(--left-text);
      margin: 0; line-height: 1; letter-spacing: -.02em;
    }
    .brand-accent { color: var(--left-accent); }
    .brand-sub {
      font-size: 10px; font-weight: 500; letter-spacing: .08em;
      color: var(--left-muted); text-transform: uppercase; margin: 2px 0 0;
    }
    .brand-tagline {
      font-size: 13px; font-weight: 400; line-height: 1.7;
      color: var(--left-muted); margin: 0 0 28px;
    }
    .divider-rule {
      height: 1px;
      background: linear-gradient(90deg, var(--left-accent) 0%, transparent 100%);
      margin-bottom: 28px; opacity: .5;
    }

    .left-footer { display: flex; gap: 6px; margin-top: auto; }
    .footer-tag {
      font-size: 8px; font-weight: 700; letter-spacing: .1em; padding: 4px 8px; border-radius: 4px;
      background: var(--left-tag-bg); border: 1px solid var(--left-border);
      color: var(--left-muted); text-transform: uppercase;
    }

    /* ── Right Panel ─────────────────────────────────────── */
    .right-panel {
      flex: 1; display: flex; align-items: center; justify-content: center;
      padding: 32px 24px; background: var(--bg);
    }
    .right-inner { width: 100%; max-width: 440px; }

    /* ── Form Card ───────────────────────────────────────── */
    .form-card {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 16px; padding: 36px; box-shadow: var(--shadow-lg);
      animation: card-in 400ms cubic-bezier(.22,1,.36,1) both;
    }
    @keyframes card-in {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .form-header { margin-bottom: 28px; }
    .form-header-top {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
    }
    .session-badge {
      display: flex; align-items: center; gap: 6px;
      font-size: 9px; font-weight: 700; letter-spacing: .12em;
      color: var(--accent); background: var(--accent-bg);
      border: 1px solid var(--accent-dim); padding: 4px 10px;
      border-radius: 20px; text-transform: uppercase;
    }
    .pulse-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: var(--accent); animation: blink 2s ease-in-out infinite;
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
    .form-ref {
      font-size: 9px; font-weight: 600; letter-spacing: .08em;
      color: var(--text-muted); font-variant-numeric: tabular-nums;
    }
    .form-title {
      font-size: 22px; font-weight: 800; color: var(--text-primary);
      margin: 0 0 6px; letter-spacing: -.025em;
    }
    .form-subtitle { font-size: 13px; font-weight: 400; color: var(--text-secondary); margin: 0; line-height: 1.5; }

    /* ── Fields ──────────────────────────────────────────── */
    .login-form { display: flex; flex-direction: column; gap: 20px; }
    .field-group { display: flex; flex-direction: column; gap: 7px; }
    .field-label {
      font-size: 11px; font-weight: 600; letter-spacing: .04em;
      color: var(--text-secondary); text-transform: uppercase; transition: color var(--tr);
    }
    .field-group.field-focused .field-label { color: var(--accent); }
    .field-wrap { position: relative; display: flex; align-items: center; }
    .field-icon {
      position: absolute; left: 14px; color: var(--text-muted);
      display: flex; pointer-events: none; transition: color var(--tr);
    }
    .field-group.field-focused .field-icon { color: var(--accent); }
    .field-input {
      width: 100%; height: 46px; padding: 0 44px;
      background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--r);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13.5px; font-weight: 500; color: var(--text-primary);
      outline: none; transition: all var(--tr);
    }
    .field-input::placeholder { color: var(--text-muted); font-weight: 400; }
    .field-input:focus {
      background: var(--bg-input-focus); border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(193,57,43,.12);
    }
    
    .forgot-link {
      font-size: 11px; font-weight: 500; color: var(--text-muted);
      text-decoration: none; transition: color var(--tr);
    }
    .forgot-link:hover { color: var(--accent); }

    /* ── Error ───────────────────────────────────────────── */
    .error-bar {
      display: flex; align-items: flex-start; gap: 8px; padding: 11px 14px;
      background: var(--error-bg); border: 1px solid var(--error-border); border-radius: var(--r);
      color: var(--error-text); font-size: 12.5px; font-weight: 500; line-height: 1.4;
      animation: shake 300ms ease;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-4px); }
      60%       { transform: translateX(4px); }
    }

    /* ── Submit ──────────────────────────────────────────── */
    .submit-btn {
      position: relative; width: 100%; height: 48px;
      background: var(--submit-bg); border: none; border-radius: var(--r);
      cursor: pointer; overflow: hidden; transition: all 200ms ease; margin-top: 4px;
    }
    .submit-btn:hover:not(:disabled) {
      background: var(--submit-hover);
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(193,57,43,.35);
    }
    .submit-btn:active:not(:disabled) { transform: translateY(0); }
    .submit-btn:disabled { opacity: .5; cursor: not-allowed; }
    .submit-inner {
      position: relative; z-index: 1;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13.5px; font-weight: 700; letter-spacing: .02em; color: #fff;
    }
    .submit-shimmer {
      position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
      transform: skewX(-20deg);
      animation: shimmer 3s ease-in-out infinite;
    }
    @keyframes shimmer { 0% { left: -100%; } 50%, 100% { left: 160%; } }

    /* ── Spinner ─────────────────────────────────────────── */
    .spinner {
      width: 14px; height: 14px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
      animation: spin 600ms linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Card Footer ─────────────────────────────────────── */
    .card-footer {
      display: flex; align-items: center; justify-content: center; gap: 5px;
      margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border);
      font-size: 10px; font-weight: 500; letter-spacing: .05em;
      color: var(--text-muted); text-transform: uppercase;
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  recoveryForm = this.fb.group({
    taxpayer_id: ['', Validators.required]
  });

  maskedEmail = signal('');
  isSubmitting = signal(false);
  errorMessage = signal('');
  showSuccess = signal(false);
  pinFocused = signal(false);
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
    if (this.recoveryForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    
    const { taxpayer_id } = this.recoveryForm.getRawValue();

    this.authService.forgotPassword(taxpayer_id!).subscribe({
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
        this.errorMessage.set('Connection failed. Please try again.');
      }
    });
  }
}
