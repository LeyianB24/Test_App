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
    <div class="login-root" [attr.data-theme]="theme()">

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

      <!-- Left Panel (Login Side) -->
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
              <p class="brand-sub">Official Online Services</p>
            </div>
          </div>

          <p class="brand-tagline">
            Welcome to the official tax management portal.<br>
            Sign in to securely manage your taxes and access government services online.
          </p>

          <div class="divider-rule"></div>

          @if (systemStatus()) {
            <div class="status-grid">
              <p class="status-heading">
                <span class="status-dot"></span>
                System Status
              </p>
              <div class="status-list">
                @for (portal of systemStatus(); track portal.name) {
                  <div class="status-item">
                    <span class="status-indicator" [class.online]="portal.online" [class.offline]="!portal.online"></span>
                    <span class="status-name text-[var(--text-xs)] uppercase tracking-wider">{{ portal.name }}</span>
                    <span class="status-badge" [class.online]="portal.online">
                      {{ portal.online ? 'ONLINE' : 'OFFLINE' }}
                    </span>
                  </div>
                }
              </div>
            </div>
          }

          <div class="left-footer mt-auto">
            <span class="footer-tag">GOK SECURED</span>
            <span class="footer-tag">SSL PROTECTED</span>
            <span class="footer-tag">ENCRYPTED</span>
          </div>
        </div>
      </div>

      <!-- Right Panel (Sign In Form) -->
      <div class="right-panel">
        <div class="right-inner">
          <div class="form-card">
            <div class="form-header">
              <div class="form-header-top">
                <div class="session-badge">
                  <span class="pulse-dot"></span>
                  SECURE CONNECTION
                </div>
                <span class="form-ref">REF: {{ sessionRef() }}</span>
              </div>
              <h2 class="form-title">Welcome Back</h2>
              <p class="form-subtitle">Enter your details to access your dashboard.</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">
              <!-- Taxpayer PIN -->
              <div class="field-group" [class.field-focused]="pinFocused()">
                <label class="field-label">Taxpayer PIN</label>
                <div class="field-wrap">
                  <div class="field-icon">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    formControlName="taxpayer_id"
                    placeholder="e.g. A000123456Z"
                    class="field-input uppercase font-mono"
                    autocomplete="username"
                    (focus)="pinFocused.set(true)"
                    (blur)="pinFocused.set(false)"
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="field-group" [class.field-focused]="pwFocused()">
                <div class="field-label-row">
                  <label class="field-label">Password</label>
                  <a routerLink="/forgot-password" class="forgot-link">Forgot Password?</a>
                </div>
                <div class="field-wrap">
                  <div class="field-icon">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="••••••••••••"
                    class="field-input"
                    autocomplete="current-password"
                    (focus)="pwFocused.set(true)"
                    (blur)="pwFocused.set(false)"
                  />
                  <button type="button" class="eye-toggle" (click)="togglePasswordVisibility()" tabindex="-1">
                    @if (!showPassword()) {
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    } @else {
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    }
                  </button>
                </div>
              </div>

              <!-- Remember Me -->
              <div class="remember-row">
                <label class="remember-label">
                  <input type="checkbox" formControlName="rememberMe" class="remember-cb" id="rememberMe">
                  <span class="remember-box">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  <span class="remember-text">Keep me signed in</span>
                </label>
              </div>

              <!-- Error Message -->
              @if (errorMessage()) {
                <div class="error-bar">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span class="uppercase tracking-wide">{{ errorMessage() }}</span>
                </div>
              }

              <!-- Submit Button -->
              <button type="submit" class="submit-btn" [disabled]="isLoading() || loginForm.invalid">
                <span class="submit-inner">
                  @if (!isLoading()) {
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    SIGN IN TO ACCOUNT
                  } @else {
                    <span class="spinner"></span>
                    SIGNING IN...
                  }
                </span>
                <span class="submit-shimmer"></span>
              </button>
            </form>

            <div class="text-center mt-6">
              <a routerLink="/registration" class="text-[var(--text-xs)] font-bold text-[var(--accent)] hover:underline uppercase tracking-widest">Create New Account</a>
            </div>

            <div class="card-footer">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" class="text-[var(--accent)]">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/>
              </svg>
              SECURED CONNECTION &bull; SHA-256 &bull; TLS 1.3
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

    .login-root {
      display: flex;
      min-height: 100dvh;
      background: var(--bg);
      transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      /* Variables - Synchronized with Elite 2.0 and User Request */
      --bg:             var(--bg-root, #f4f3f0);
      --bg-card:        var(--bg-surface-1, #ffffff);
      --bg-input:       var(--bg-surface-2, #f8f7f5);
      --bg-input-focus: var(--bg-surface-3, #ffffff);
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
      --submit-bg:      var(--color-accent);
      --submit-hover:   var(--color-accent-hover);
      --r-xl:           var(--radius-xl, 24px);
      --r-lg:           var(--radius-lg, 12px);
      --tr:             200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .login-root[data-theme="dark"] {
      --bg:             var(--bg-root, #0a0908);
      --bg-card:        var(--bg-surface-1, #141211);
      --bg-input:       var(--bg-surface-2, #1c1a18);
      --bg-input-focus: var(--bg-surface-3, #23211f);
      --border:         var(--border-subtle, #2a2724);
      --text-primary:   #f0ede8;
    }

    /* Theme Toggle */
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
      border-color: var(--accent); 
      color: var(--accent); 
      transform: scale(1.1) rotate(15deg); 
      box-shadow: var(--shadow-md);
    }

    /* Left Panel */
    .left-panel {
      width: 480px; flex-shrink: 0;
      background: var(--left-bg);
      position: relative; overflow: hidden;
      display: flex; flex-direction: column;
    }
    .left-background {
      position: absolute; inset: 0;
      background: radial-gradient(circle at 0% 0%, var(--accent) 0%, transparent 50%);
      opacity: 0.05;
    }
    .left-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(var(--left-border) 1px, transparent 1px),
        linear-gradient(90deg, var(--left-border) 1px, transparent 1px);
      background-size: 50px 50px;
      opacity: 0.5;
    }
    .left-glow {
      position: absolute; top: -100px; left: -100px;
      width: 450px; height: 450px; border-radius: 50%;
      background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
      filter: blur(80px); opacity: 0.15;
    }
    .corner-mark {
      position: absolute; width: 24px; height: 24px;
      border-color: var(--accent); border-style: solid; opacity: 0.3;
    }
    .corner-tl { top: 24px; left: 24px; border-width: 2px 0 0 2px; }
    .corner-tr { top: 24px; right: 24px; border-width: 2px 2px 0 0; }
    .corner-bl { bottom: 24px; left: 24px; border-width: 0 0 2px 2px; }
    .corner-br { bottom: 24px; right: 24px; border-width: 0 2px 2px 0; }

    .left-inner {
      position: relative; z-index: 1;
      padding: 64px 48px;
      display: flex; flex-direction: column; height: 100%;
    }

    .brand-block { display: flex; align-items: center; gap: 24px; margin-bottom: 48px; }
    .logo-wrap { position: relative; width: 84px; height: 84px; flex-shrink: 0; }
    .logo-img { 
      width: 84px; height: 84px; border-radius: 16px; 
      position: relative; z-index: 2;
      box-shadow: 0 12px 32px rgba(0,0,0,0.4);
    }
    .logo-ring {
      position: absolute; inset: -8px; border-radius: 22px;
      border: 2px solid var(--accent); opacity: 0.2;
      animation: ring-pulse 4s ease-in-out infinite;
    }
    @keyframes ring-pulse {
      0%, 100% { transform: scale(1); opacity: 0.1; }
      50% { transform: scale(1.1); opacity: 0.3; }
    }

    .brand-eyebrow {
      font-size: 10px; font-weight: 800; letter-spacing: 0.2em;
      text-transform: uppercase; color: var(--accent); margin: 0 0 4px;
    }
    .brand-name {
      font-size: 36px; font-weight: 900; color: var(--left-text);
      margin: 0; line-height: 1; letter-spacing: -0.04em;
    }
    .brand-accent { color: var(--accent); }
    .brand-sub {
      font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
      color: var(--left-muted); text-transform: uppercase; margin: 6px 0 0;
    }
    .brand-tagline {
      font-size: 15px; font-weight: 400; line-height: 1.8;
      color: var(--left-muted); margin: 0 0 40px;
    }
    .divider-rule {
      height: 2px;
      background: linear-gradient(90deg, var(--accent) 0%, transparent 100%);
      margin-bottom: 40px; opacity: 0.4;
    }

    .status-heading {
      font-size: 10px; font-weight: 800; letter-spacing: 0.15em;
      text-transform: uppercase; color: var(--left-muted);
      display: flex; align-items: center; gap: 8px; margin: 0 0 16px;
    }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #10b981; box-shadow: 0 0 12px #10b981;
      animation: blink 2s ease-in-out infinite;
    }
    @keyframes blink { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
    
    .status-list { display: flex; flex-direction: column; gap: 10px; }
    .status-item {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px;
      background: rgba(255,255,255,0.03); border: 1px solid var(--left-border); border-radius: 8px;
      transition: all 0.3s ease;
    }
    .status-item:hover { background: rgba(255,255,255,0.06); transform: translateX(4px); }
    .status-indicator { width: 6px; height: 6px; border-radius: 50%; }
    .status-indicator.online { background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.4); }
    .status-indicator.offline { background: #ef4444; }
    .status-name { font-size: 11px; font-weight: 700; color: var(--left-text); flex: 1; }
    .status-badge { font-size: 9px; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.2); }
    .status-badge.online { color: #10b981; }

    .left-footer { display: flex; gap: 12px; }
    .footer-tag {
      font-size: 9px; font-weight: 800; letter-spacing: 0.1em; padding: 6px 12px; border-radius: 6px;
      background: rgba(0,0,0,0.3); border: 1px solid var(--left-border);
      color: var(--left-muted); text-transform: uppercase;
    }

    /* Right Panel */
    .right-panel {
      flex: 1; display: flex; align-items: center; justify-content: center;
      padding: 40px;
    }
    .right-inner { width: 100%; max-width: 480px; }

    .form-card {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: var(--r-xl); padding: 48px; box-shadow: var(--shadow-lg);
      transform-origin: center;
      animation: card-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }
    @keyframes card-in {
      from { opacity: 0; transform: translateY(30px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .form-header { margin-bottom: 40px; }
    .form-header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .session-badge {
      display: flex; align-items: center; gap: 8px;
      font-size: 10px; font-weight: 800; letter-spacing: 0.1em;
      color: var(--accent); background: var(--accent-bg);
      border: 1px solid var(--accent-dim); padding: 6px 14px;
      border-radius: 30px;
    }
    .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: blink 2s infinite; }
    .form-ref { font-size: 10px; font-weight: 700; color: var(--text-muted); font-family: monospace; }
    .form-title { font-size: 28px; font-weight: 900; color: var(--text-primary); margin: 0 0 8px; letter-spacing: -0.03em; }
    .form-subtitle { font-size: 14px; font-weight: 500; color: var(--text-secondary); margin: 0; line-height: 1.6; }

    /* Form Fields */
    .login-form { display: flex; flex-direction: column; gap: 24px; }
    .field-group { display: flex; flex-direction: column; gap: 10px; }
    .field-label { 
      font-size: 12px; font-weight: 700; color: var(--text-secondary); 
      text-transform: uppercase; letter-spacing: 0.05em; transition: color var(--tr);
      margin-left: 4px;
    }
    .field-group.field-focused .field-label { color: var(--accent); }
    .field-label-row { display: flex; align-items: center; justify-content: space-between; }
    .forgot-link { font-size: 11px; font-weight: 700; color: var(--text-muted); text-decoration: none; transition: all var(--tr); }
    .forgot-link:hover { color: var(--accent); }

    .field-wrap { position: relative; }
    .field-icon { 
      position: absolute; left: 18px; top: 16px; color: var(--text-muted); 
      transition: color var(--tr);
    }
    .field-group.field-focused .field-icon { color: var(--accent); }
    .field-input {
      width: 100%; height: 54px; padding: 0 54px;
      background: var(--bg-input); border: 2px solid var(--border); border-radius: var(--r-lg);
      font-size: 15px; font-weight: 600; color: var(--text-primary);
      outline: none; transition: all 0.3s ease;
    }
    .field-input:focus {
      background: var(--bg-input-focus); border-color: var(--accent);
      box-shadow: 0 0 0 5px var(--accent-bg);
    }
    .eye-toggle {
      position: absolute; right: 18px; top: 16px; background: none; border: none;
      color: var(--text-muted); cursor: pointer; transition: color var(--tr);
    }
    .eye-toggle:hover { color: var(--accent); }

    /* Custom Checkbox */
    .remember-row { margin: 4px 0; }
    .remember-label { display: flex; align-items: center; gap: 12px; cursor: pointer; }
    .remember-cb { display: none; }
    .remember-box {
      width: 20px; height: 20px; border-radius: 6px;
      border: 2px solid var(--border); background: var(--bg-input);
      display: flex; align-items: center; justify-content: center;
      transition: all var(--tr); color: transparent;
    }
    .remember-cb:checked + .remember-box {
      background: var(--accent); border-color: var(--accent); color: white;
    }
    .remember-text { font-size: 13px; font-weight: 600; color: var(--text-secondary); user-select: none; }

    /* Error Bar */
    .error-bar {
      display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px;
      background: var(--accent-bg); border: 1px solid var(--accent-dim); border-radius: var(--r-lg);
      color: var(--accent); font-size: 12px; font-weight: 700; line-height: 1.5;
      animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }

    /* Submit Button */
    .submit-btn {
      position: relative; width: 100%; height: 56px;
      background: var(--submit-bg); border: none; border-radius: var(--r-lg);
      cursor: pointer; overflow: hidden; transition: all 0.4s ease;
      margin-top: 8px;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(193,57,43,0.3);
      filter: brightness(1.1);
    }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .submit-inner {
      position: relative; z-index: 1;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      font-size: 14px; font-weight: 900; letter-spacing: 0.05em; color: white;
    }
    .submit-shimmer {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: skewX(-20deg) translateX(-150%);
      animation: shimmer 3s infinite;
    }
    @keyframes shimmer { 100% { transform: skewX(-20deg) translateX(250%); } }

    .spinner {
      width: 18px; height: 18px; border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.2); border-top-color: white;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .card-footer {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border);
      font-size: 10px; font-weight: 800; letter-spacing: 0.1em;
      color: var(--text-muted); text-transform: uppercase;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .left-panel { width: 380px; }
      .brand-name { font-size: 30px; }
    }
    @media (max-width: 860px) {
      .left-panel { display: none; }
      .right-panel { background: var(--bg); padding: 24px; }
      .form-card { padding: 32px; }
    }
  `]
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
          this.errorMessage.set(response.message || 'Incorrect PIN or password. Please try again.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Connection failed. Please try again.');
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