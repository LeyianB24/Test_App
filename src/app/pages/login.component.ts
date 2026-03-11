import { Component, inject, signal, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
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
    <div class="login-root">

      <!-- Animated Grid Background -->
      <div class="grid-bg"></div>

      <!-- Particle Stream Overlay -->
      <div class="particle-field" aria-hidden="true">
        @for (p of particles; track $index) {
          <div class="particle" [style]="p"></div>
        }
      </div>

      <!-- Radial Glow Spots -->
      <div class="glow-spot glow-1"></div>
      <div class="glow-spot glow-2"></div>
      <div class="glow-spot glow-3"></div>

      <!-- Left Hero Panel -->
      <div class="left-panel">

        <div class="left-inner">
          <!-- Corner Brackets -->
          <span class="corner corner-tl"></span>
          <span class="corner corner-tr"></span>
          <span class="corner corner-bl"></span>
          <span class="corner corner-br"></span>

          <!-- Brand Mark -->
          <div class="brand-block">
            <div class="logo-outer">
              <div class="logo-ring ring-1"></div>
              <div class="logo-ring ring-2"></div>
              <div class="logo-wrap">
                <img ngSrc="assets/logo.png" width="80" height="80" alt="KRA Logo" priority class="logo-img">
              </div>
            </div>
            <div class="brand-text">
              <p class="brand-eyebrow">Kenya Revenue Authority</p>
              <h1 class="brand-name">i<span class="brand-tax">Tax</span><span class="brand-is">IS</span></h1>
              <p class="brand-sub">Official Tax Administration Portal</p>
            </div>
          </div>

          <!-- Divider -->
          <div class="hero-divider">
            <span class="divider-line"></span>
            <span class="divider-orb"></span>
            <span class="divider-line"></span>
          </div>

          <p class="hero-tagline">
            Secure, transparent, and efficient tax management for citizens and businesses across Kenya.
          </p>

          <!-- System Status -->
          @if (systemStatus()) {
            <div class="status-block">
              <div class="status-heading">
                <span class="live-dot"></span>
                LIVE SYSTEM STATUS
              </div>
              <div class="status-list">
                @for (portal of systemStatus(); track portal.name) {
                  <div class="status-row">
                    <div class="status-indicator" [class.online]="portal.online" [class.offline]="!portal.online"></div>
                    <span class="status-name">{{ portal.name }}</span>
                    <span class="status-badge" [class.online]="portal.online">
                      {{ portal.online ? 'NOMINAL' : 'OFFLINE' }}
                    </span>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Footer Tags -->
          <div class="hero-footer">
            <span class="hero-tag">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              GOK CERTIFIED
            </span>
            <span class="hero-tag">TLS 1.3</span>
            <span class="hero-tag">AES-256</span>
          </div>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="right-panel">
        <div class="right-inner">

          <!-- Header Bar -->
          <div class="form-topbar">
            <div class="session-pill">
              <span class="session-dot"></span>
              SECURE SESSION
            </div>
            <span class="session-ref">REF: {{ sessionRef() }}</span>
          </div>

          <!-- Form Card -->
          <div class="form-card">
            <div class="form-card-inner">

              <!-- Scanning effect -->
              <div class="card-scan"></div>

              <h2 class="form-title">Sign In</h2>
              <p class="form-subtitle">Enter your credentials to access your account.</p>

              <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form">

                <!-- Taxpayer PIN -->
                <div class="field-group" [class.focused]="pinFocused()">
                  <label class="field-label">Taxpayer PIN</label>
                  <div class="field-wrap">
                    <span class="field-icon">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      formControlName="taxpayer_id"
                      id="taxpayer_id"
                      placeholder="e.g. A000123456Z"
                      class="field-input font-mono uppercase"
                      autocomplete="username"
                      (focus)="pinFocused.set(true)"
                      (blur)="pinFocused.set(false)"
                    />
                    <span class="field-glow"></span>
                  </div>
                </div>

                <!-- Password -->
                <div class="field-group" [class.focused]="pwFocused()">
                  <div class="field-label-row">
                    <label class="field-label">Password</label>
                    <a routerLink="/forgot-password" class="forgot-link">Forgot Password?</a>
                  </div>
                  <div class="field-wrap">
                    <span class="field-icon">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </span>
                    <input
                      [type]="showPassword() ? 'text' : 'password'"
                      formControlName="password"
                      id="password"
                      placeholder="••••••••••••"
                      class="field-input"
                      autocomplete="current-password"
                      (focus)="pwFocused.set(true)"
                      (blur)="pwFocused.set(false)"
                    />
                    <button type="button" class="eye-btn" (click)="togglePasswordVisibility()" tabindex="-1" aria-label="Toggle password visibility">
                      @if (!showPassword()) {
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      } @else {
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      }
                    </button>
                    <span class="field-glow"></span>
                  </div>
                </div>

                <!-- Remember Me -->
                <div class="remember-row">
                  <label class="remember-label">
                    <input type="checkbox" formControlName="rememberMe" class="remember-actual" id="rememberMe">
                    <span class="remember-box">
                      <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    <span class="remember-text">Keep me signed in</span>
                  </label>
                </div>

                <!-- Error Alert -->
                @if (errorMessage()) {
                  <div class="error-alert" role="alert">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{{ errorMessage() }}</span>
                  </div>
                }

                <!-- Submit -->
                <button type="submit" class="submit-btn" id="login-submit" [disabled]="isLoading() || loginForm.invalid">
                  <span class="submit-content">
                    @if (!isLoading()) {
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                      </svg>
                      AUTHENTICATE
                    } @else {
                      <span class="spinner"></span>
                      VERIFYING...
                    }
                  </span>
                  <span class="btn-shimmer"></span>
                  <span class="btn-glow"></span>
                </button>

              </form>

              <div class="form-divider"></div>

              <a routerLink="/registration" class="register-link">
                New taxpayer? Create an account →
              </a>

              <div class="card-footer">
                <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/>
                </svg>
                SECURED • SHA-256 • TLS 1.3 • GOVERNMENT PORTAL
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');

    :host { display: block; height: 100dvh; font-family: 'Inter', sans-serif; }

    /* ── Root Layout ── */
    .login-root {
      display: flex;
      min-height: 100dvh;
      position: relative;
      overflow: hidden;
      background: #060608 url('/assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      --accent:        #D92B2B;
      --accent-glow:   rgba(217, 43, 43, 0.35);
      --accent-bg:     rgba(217, 43, 43, 0.08);
      --success:       #10b981;
      --border:        rgba(255,255,255,0.07);
      --border-focus:  rgba(217, 43, 43, 0.5);
      --text-1:        #f5f3f0;
      --text-2:        #9b979080;
      --text-3:        #5a5650;
      --surface-1:     rgba(255,255,255,0.03);
      --surface-2:     rgba(255,255,255,0.06);
    }

    /* ── Grid Background ── */
    .grid-bg {
      position: fixed; inset: 0; z-index: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
    }

    /* ── Particle Field ── */
    .particle-field { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }

    .particle {
      position: absolute;
      width: 2px;
      background: linear-gradient(to bottom, transparent, var(--accent), transparent);
      border-radius: 2px;
      animation: fall linear infinite;
      opacity: 0;
    }
    @keyframes fall {
      0%   { opacity: 0; transform: translateY(-20px); }
      10%  { opacity: 1; }
      90%  { opacity: 0.4; }
      100% { opacity: 0; transform: translateY(100vh); }
    }

    /* ── Glow Orbs ── */
    .glow-spot { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
    .glow-1 { width: 600px; height: 600px; top: -200px; left: -100px; background: radial-gradient(circle, rgba(217,43,43,0.12), transparent 70%); animation: drift1 20s ease-in-out infinite alternate; }
    .glow-2 { width: 400px; height: 400px; bottom: -100px; right: 30%; background: radial-gradient(circle, rgba(217,43,43,0.08), transparent 70%); animation: drift2 25s ease-in-out infinite alternate; }
    .glow-3 { width: 300px; height: 300px; top: 40%; right: 10%; background: radial-gradient(circle, rgba(140,82,255,0.06), transparent 70%); }
    @keyframes drift1 { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,50px) scale(1.2); } }
    @keyframes drift2 { from { transform: translate(0,0); } to { transform: translate(-40px, -30px); } }

    /* ── Left Panel ── */
    .left-panel {
      width: 480px; flex-shrink: 0;
      position: relative; z-index: 10;
      border-right: 1px solid var(--border);
      background: linear-gradient(135deg, rgba(217,43,43,0.05) 0%, transparent 60%);
    }
    .left-inner {
      position: relative; height: 100%;
      display: flex; flex-direction: column;
      padding: 56px 48px;
    }

    /* Corner Brackets */
    .corner { position: absolute; width: 20px; height: 20px; border-color: var(--accent); border-style: solid; opacity: 0.4; }
    .corner-tl { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
    .corner-tr { top: 20px; right: 20px; border-width: 2px 2px 0 0; }
    .corner-bl { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; }
    .corner-br { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; }

    /* Brand Block */
    .brand-block { display: flex; align-items: center; gap: 20px; margin-bottom: 40px; }
    .logo-outer { position: relative; width: 88px; height: 88px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .logo-wrap { position: relative; z-index: 2; width: 80px; height: 80px; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
    .logo-img { width: 80px; height: 80px; border-radius: 20px; }
    .logo-ring {
      position: absolute; inset: 0; border-radius: 28px;
      border: 1.5px solid var(--accent); opacity: 0.3;
    }
    .ring-1 { animation: pulse-ring 3s ease-in-out infinite; }
    .ring-2 { animation: pulse-ring 3s ease-in-out infinite 1.5s; inset: -8px; border-radius: 32px; opacity: 0.15; }
    @keyframes pulse-ring { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.06); } }

    .brand-text { flex: 1; }
    .brand-eyebrow { font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin: 0 0 4px; }
    .brand-name { font-size: 34px; font-weight: 900; color: var(--text-1); margin: 0; line-height: 1; letter-spacing: -0.04em; }
    .brand-tax { color: var(--text-1); }
    .brand-is { color: var(--accent); }
    .brand-sub { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; color: var(--text-2); text-transform: uppercase; margin: 6px 0 0; }

    /* Divider */
    .hero-divider { display: flex; align-items: center; gap: 12px; margin: 32px 0; }
    .divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.3; }
    .divider-orb { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 12px var(--accent-glow); animation: pulse-dot 2s ease-in-out infinite; }
    @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }

    .hero-tagline { font-size: 14px; font-weight: 400; line-height: 1.8; color: var(--text-2); margin: 0 0 36px; }

    /* Status Block */
    .status-block { margin-bottom: auto; }
    .status-heading { font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-2); display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
    .live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); box-shadow: 0 0 10px rgba(16,185,129,0.6); animation: blink 2s ease-in-out infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .status-list { display: flex; flex-direction: column; gap: 8px; }
    .status-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--surface-1); border: 1px solid var(--border); border-radius: 10px; transition: all 0.3s ease; }
    .status-row:hover { background: var(--surface-2); transform: translateX(3px); }
    .status-indicator { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
    .status-indicator.online { background: var(--success); box-shadow: 0 0 8px rgba(16,185,129,0.5); }
    .status-indicator.offline { background: #ef4444; }
    .status-name { font-size: 10px; font-weight: 700; color: var(--text-1); text-transform: uppercase; letter-spacing: 0.05em; flex: 1; }
    .status-badge { font-size: 8px; font-weight: 900; padding: 2px 8px; border-radius: 4px; background: rgba(0,0,0,0.3); color: var(--text-3); }
    .status-badge.online { color: var(--success); }

    /* Footer Tags */
    .hero-footer { display: flex; gap: 10px; margin-top: 28px; }
    .hero-tag { font-size: 8px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 10px; border-radius: 6px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); color: var(--text-3); display: flex; align-items: center; gap: 5px; }

    /* ── Right Panel ── */
    .right-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; z-index: 10; }
    .right-inner { width: 100%; max-width: 460px; }

    /* Top Bar */
    .form-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .session-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 9px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); background: var(--accent-bg); border: 1px solid rgba(217,43,43,0.25); border-radius: 30px; padding: 6px 14px; }
    .session-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: blink 2s infinite; }
    .session-ref { font-size: 10px; font-weight: 700; color: var(--text-3); font-family: 'JetBrains Mono', monospace; }

    /* Form Card */
    .form-card {
      background: rgba(12, 11, 10, 0.7);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 28px;
      box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset;
      overflow: hidden;
      position: relative;
      animation: card-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes card-in { from { opacity:0; transform: translateY(32px) scale(0.97); } to { opacity:1; transform: translateY(0) scale(1); } }

    /* Scan Line */
    .card-scan {
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
      animation: scan 4s ease-in-out infinite;
      opacity: 0.6;
    }
    @keyframes scan {
      0%   { transform: translateY(0); opacity: 0.6; }
      50%  { transform: translateY(500px); opacity: 0.2; }
      100% { transform: translateY(0); opacity: 0.6; }
    }

    .form-card-inner { padding: 48px; }

    .form-title { font-size: 30px; font-weight: 900; color: var(--text-1); margin: 0 0 8px; letter-spacing: -0.03em; }
    .form-subtitle { font-size: 13px; font-weight: 500; color: var(--text-2); margin: 0 0 36px; line-height: 1.6; }

    /* Form */
    .login-form { display: flex; flex-direction: column; gap: 20px; }

    .field-group { display: flex; flex-direction: column; gap: 8px; }
    .field-label { font-size: 11px; font-weight: 700; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.07em; margin-left: 4px; transition: color 0.2s; }
    .field-group.focused .field-label { color: var(--accent); }
    .field-label-row { display: flex; align-items: center; justify-content: space-between; }
    .forgot-link { font-size: 11px; font-weight: 600; color: var(--text-3); text-decoration: none; transition: color 0.2s; }
    .forgot-link:hover { color: var(--accent); }

    .field-wrap { position: relative; }
    .field-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-3); transition: color 0.2s; z-index: 1; }
    .field-group.focused .field-icon { color: var(--accent); }

    .field-input {
      width: 100%; height: 52px; padding: 0 50px;
      background: rgba(255,255,255,0.04);
      border: 1.5px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      font-size: 14px; font-weight: 600; color: var(--text-1);
      font-family: inherit;
      outline: none;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }
    .field-input:focus {
      border-color: var(--accent);
      background: rgba(217,43,43,0.04);
      box-shadow: 0 0 0 4px rgba(217,43,43,0.1);
    }
    .field-input::placeholder { color: var(--text-3); font-weight: 500; }
    .font-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em; }

    .field-glow {
      position: absolute; inset: 0; border-radius: 14px;
      opacity: 0; pointer-events: none;
      box-shadow: 0 0 20px rgba(217,43,43,0.15);
      transition: opacity 0.3s;
    }
    .field-group.focused .field-glow { opacity: 1; }

    .eye-btn { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-3); cursor: pointer; transition: color 0.2s; padding: 4px; }
    .eye-btn:hover { color: var(--text-1); }

    /* Remember Row */
    .remember-row { margin: 4px 0; }
    .remember-label { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
    .remember-actual { display: none; }
    .remember-box {
      width: 18px; height: 18px; border-radius: 6px;
      border: 1.5px solid rgba(255,255,255,0.12);
      background: var(--surface-1);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; color: transparent; flex-shrink: 0;
    }
    .remember-actual:checked + .remember-box { background: var(--accent); border-color: var(--accent); color: white; }
    .remember-text { font-size: 13px; font-weight: 500; color: var(--text-2); }

    /* Error */
    .error-alert {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 16px;
      background: rgba(217,43,43,0.1);
      border: 1px solid rgba(217,43,43,0.3);
      border-radius: 12px;
      color: #ff6b6b;
      font-size: 12px; font-weight: 600;
      animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
    }
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }

    /* Submit Button */
    .submit-btn {
      position: relative; width: 100%; height: 54px;
      background: linear-gradient(135deg, #D92B2B 0%, #b82323 100%);
      border: none; border-radius: 14px;
      cursor: pointer; overflow: hidden;
      transition: all 0.3s ease; margin-top: 4px;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(217,43,43,0.45), 0 0 0 1px rgba(255,255,255,0.1) inset;
    }
    .submit-btn:active:not(:disabled) { transform: translateY(0); }
    .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }

    .submit-content { position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; font-weight: 900; letter-spacing: 0.08em; color: white; }

    .btn-shimmer {
      position: absolute; inset: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
      transform: skewX(-20deg) translateX(-150%);
      animation: shimmer 3.5s infinite;
    }
    @keyframes shimmer { 0%,100% { transform: skewX(-20deg) translateX(-150%); } 60% { transform: skewX(-20deg) translateX(250%); } }

    .btn-glow { position: absolute; inset: -2px; border-radius: 16px; background: inherit; filter: blur(12px); opacity: 0; transition: opacity 0.3s; z-index: -1; }
    .submit-btn:hover:not(:disabled) .btn-glow { opacity: 0.5; }

    .spinner { width: 16px; height: 16px; border-radius: 50%; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: white; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Footer Links */
    .form-divider { height: 1px; background: var(--border); margin: 28px 0 20px; }
    .register-link { display: block; text-align: center; font-size: 13px; font-weight: 600; color: var(--accent); text-decoration: none; transition: opacity 0.2s; }
    .register-link:hover { opacity: 0.75; }

    .card-footer { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 24px; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-3); }

    /* Responsive */
    @media (max-width: 1024px) { .left-panel { width: 380px; } }
    @media (max-width: 840px) {
      .left-panel { display: none; }
      .right-panel { padding: 20px; }
      .form-card-inner { padding: 32px; }
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
  sessionRef   = signal('');

  // Pre-generate particle styles server-side for performance
  particles = Array.from({ length: 20 }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = 6 + Math.random() * 10;
    const h = 40 + Math.random() * 120;
    return `left:${left}%;height:${h}px;animation-delay:${delay}s;animation-duration:${duration}s;opacity:0`;
  });

  ngOnInit() {
    this.sessionRef.set(Math.random().toString(36).substring(2, 8).toUpperCase());
    this.fetchSystemStatus();
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

  togglePasswordVisibility() { this.showPassword.update(v => !v); }

  private fetchSystemStatus() {
    this.http.get<any>(`${environment.apiUrl}/status_check.php`).subscribe({
      next: (res) => { if (res?.success) this.systemStatus.set(res.data); },
      error: () => { /* Fail silently */ }
    });
  }
}
