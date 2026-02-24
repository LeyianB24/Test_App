import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginCredentials } from '../models/app.models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgOptimizedImage],
  template: `
    <div class="auth-layout login-scene">
      <!-- Fixed Background Layer -->
      <div class="bg-image-container">
        <div class="bg-overlay"></div>
      </div>

      <div class="auth-view-scroller">
        <div class="auth-container animate-up">
          <div class="glass-card elite-auth-card">

            <!-- Luxury Branding -->
            <div class="auth-brand-box">
              <div class="logo-wrapper-luxury">
                <img ngSrc="assets/logo.png" width="120" height="120" alt="KRA Logo" priority>
              </div>
              <div class="brand-info-elite">
                <span class="hub-tag">Official Smart Portal</span>
                <h1 class="auth-title-elite">iTax <span class="gradient-text">Gateway</span></h1>
              </div>
            </div>

              <div class="remember-row mt-12">
                <label class="remember-me" style="color: rgba(255,255,255,0.6); font-weight:700;">
                  <input type="checkbox" [(ngModel)]="rememberMe" /> Remember Me
                </label>
              </div>

            <!-- Login Header -->
            <div class="auth-header-mini mt-40">
              <h2>Account Authentication</h2>
              <p>Securely log in to your digital taxpayer terminal</p>
            </div>

            <!-- System Status Badges -->
            <div class="system-status-row mt-16" *ngIf="systemStatus">
              <div class="status-item" *ngFor="let k of statusKeys">
                <span class="status-name">{{ k }}:</span>
                <span class="status-value" [ngClass]="{'online': systemStatus[k].online, 'offline': !systemStatus[k].online}">
                  {{ systemStatus[k].online ? 'Online ✓' : 'Offline ✗' }}
                </span>
              </div>
            </div>

            <!-- Form Area -->
            <form (ngSubmit)="onLogin()" class="auth-form-luxury mt-32">
              <div class="form-group-luxury">
                <label>Taxpayer PIN / User ID</label>
                <div class="luxury-input-wrapper">
                  <svg class="input-icon-elite" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2.5"/></svg>
                  <input
                    type="text"
                    name="taxpayer_id"
                    [(ngModel)]="credentials().taxpayer_id"
                    placeholder="e.g. A000123456Z"
                    [disabled]="isLoading()"
                    required
                    class="elite-input-luxury with-icon"
                    autocomplete="username"
                  />
                </div>
              </div>

              <div class="form-group-luxury mt-24">
                <div class="label-flex-elite">
                  <label>Secure Password</label>
                  <a routerLink="/forgot-password" class="auth-link-elite">Reset Secret?</a>
                </div>
                <div class="luxury-input-wrapper">
                  <svg class="input-icon-elite" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2.5"/></svg>
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    name="password"
                    [(ngModel)]="credentials().password"
                    placeholder="••••••••••••"
                    [disabled]="isLoading()"
                    required
                    class="elite-input-luxury with-icon"
                    autocomplete="current-password"
                  />
                  <button type="button" class="eye-toggle-luxury" (click)="togglePasswordVisibility()">
                     <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" *ngIf="!showPassword()"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                     <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" *ngIf="showPassword()"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" stroke-width="2"/></svg>
                  </button>
                </div>
              </div>

              <div class="auth-error-glass animate-up mt-24" *ngIf="errorMessage()">
                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2.5"/></svg>
                 <span>{{ errorMessage() }}</span>
              </div>

              <button type="submit" class="modern-btn primary-btn full-width elite-glow mt-40" [disabled]="isLoading()">
                <span *ngIf="!isLoading()">Sign In to Portal</span>
                <span *ngIf="isLoading()" class="loader-flex">
                   <div class="mini-spinner"></div>
                   Establishing Secure Session...
                </span>
                <svg *ngIf="!isLoading()" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </form>

            <!-- Bottom Meta -->
              <div class="auth-footer-luxury mt-48 text-center">
              <p>Unregistered? <a routerLink="/registration" class="reg-link-bold">Request New PIN</a></p>
              <div class="security-seal-mini mt-24">
                 <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/></svg>
                 <span>Government Grade Encryption Active</span>
              </div>

              <!-- Strategic Branding -->
              <div class="auth-strategic-branding mt-32">
                <div class="branding-divider"></div>
                <div class="branding-logos">
                  <div class="partner-logo-box">
                    <img ngSrc="assets/itax.jpeg" width="100" height="40" alt="iTax" class="strategic-logo">
                  </div>
                  <div class="partner-logo-box">
                    <img ngSrc="assets/vision_2030.png" width="100" height="40" alt="Vision 2030" class="strategic-logo">
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-scene {
      min-height: 100vh; position: relative; background: #0a0a0b; overflow: hidden;
    }
    .bg-image-container {
      position: fixed; inset: 0;
      background-image: url('/assets/kra_background.png');
      background-size: cover; background-position: center; z-index: 1;
    }
    .bg-overlay {
      position: absolute; inset: 0;
      background: radial-gradient(circle at center, rgba(10, 10, 11, 0.75) 0%, rgba(10, 10, 11, 0.98) 100%);
    }

    .auth-view-scroller {
      position: relative; z-index: 10; height: 100vh; overflow-y: auto; display: flex; align-items: center; justify-content: center; padding: 40px 20px;
    }
    .auth-container { width: 100%; max-width: 580px; }

    .elite-auth-card {
      background: rgba(255, 255, 255, 0.03);
      -webkit-backdrop-filter: blur(32px); backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 48px;
      padding: 60px; box-shadow: 0 50px 150px rgba(0,0,0,0.6);
    }

    .auth-brand-box { display: flex; align-items: center; gap: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 32px; }
    .logo-wrapper-luxury { background: white; padding: 14px; border-radius: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(255,255,255,0.1); }
    .hub-tag { display: block; color: var(--kra-red); font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
    .auth-title-elite { font-size: 3rem; font-weight: 900; color: white; margin: 0; letter-spacing: -2px; line-height: 1; }

    .auth-header-mini h2 { font-size: 1.5rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.5px; }
    .auth-header-mini p { color: rgba(255,255,255,0.45); font-size: 1rem; margin-top: 8px; }

    .form-group-luxury { display: flex; flex-direction: column; gap: 12px; }
    .form-group-luxury label { font-size: 0.8rem; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; }

    .luxury-input-wrapper { position: relative; }
    .input-icon-elite { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.25); pointer-events: none; }
    .eye-toggle-luxury { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(255,255,255,0.2); cursor: pointer; padding: 8px; border-radius: 12px; transition: 0.3s; }
    .eye-toggle-luxury:hover { color: white; background: rgba(255,255,255,0.05); }

    .elite-input-luxury {
      width: 100%; padding: 18px 24px; background: rgba(255,255,255,0.04);
      border: 2px solid rgba(255,255,255,0.08); border-radius: 20px;
      color: white; font-size: 1.1rem; font-weight: 600; font-family: inherit;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .elite-input-luxury.with-icon { padding-left: 64px; }
    .elite-input-luxury:focus {
      background: rgba(255,255,255,0.06); border-color: var(--kra-red); outline: none;
      box-shadow: 0 0 0 6px rgba(227, 30, 36, 0.15); transform: translateY(-2px);
    }

    .label-flex-elite { display: flex; justify-content: space-between; align-items: center; }
    .auth-link-elite { color: rgba(255,255,255,0.3); font-size: 0.85rem; font-weight: 700; text-decoration: none; transition: 0.3s; }
    .auth-link-elite:hover { color: white; }

    .auth-error-glass { background: rgba(227, 30, 36, 0.1); border: 1px solid rgba(227, 30, 36, 0.2); color: #ff9a9c; padding: 18px; border-radius: 20px; display: flex; align-items: center; gap: 14px; font-weight: 700; font-size: 0.95rem; }

    .full-width { width: 100%; }
    .elite-glow:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .loader-flex { display: flex; align-items: center; justify-content: center; gap: 12px; }
    .mini-spinner { width: 22px; height: 22px; border: 3px solid rgba(255,255,255,0.2); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-footer-luxury p { color: rgba(255,255,255,0.4); font-size: 1.05rem; font-weight: 600; }
    .reg-link-bold { color: var(--kra-red); font-weight: 800; text-decoration: none; margin-left: 6px; }
    .reg-link-bold:hover { text-decoration: underline; }
    .security-seal-mini { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.7rem; color: rgba(255,255,255,0.25); font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }

    .gradient-text { background: var(--kra-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .mt-24 { margin-top: 24px; }
    .mt-32 { margin-top: 32px; }
    .mt-40 { margin-top: 40px; }
    .mt-48 { margin-top: 48px; }
    .text-center { text-align: center; }
    
    .auth-strategic-branding {
      width: 100%; margin-top: 40px;
    }
    .branding-divider {
      height: 1px; width: 100%;
      background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
      margin-bottom: 24px;
    }
    .branding-logos {
      display: flex; align-items: center; justify-content: center; gap: 32px;
    }
    .partner-logo-box {
      opacity: 0.6; filter: grayscale(1);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: crosshair;
    }
    .partner-logo-box:hover {
      opacity: 1; filter: grayscale(0);
      transform: scale(1.1);
    }
    .strategic-logo {
      max-height: 48px; width: auto; object-fit: contain;
    }

    @media (max-width: 600px) {
      .elite-auth-card { padding: 40px 24px; }
      .auth-title-elite { font-size: 2.5rem; }
      .branding-logos { gap: 20px; }
      .strategic-logo { max-height: 36px; }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  credentials = signal<LoginCredentials>({ taxpayer_id: '', password: '' });
  rememberMe = false;
  isLoading = signal(false);
  errorMessage = signal<string>('');
  showPassword = signal(false);
  systemStatus: any = null;
  statusKeys: string[] = [];

  constructor() {
    this.fetchSystemStatus();
  }

  onLogin() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.authService.login(this.credentials(), this.rememberMe).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success && response.data?.user) {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        } else {
          this.errorMessage.set(response.message || 'Authentication sequence failed.');
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Primary gateway connection timed out.');
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(val => !val);
  }

  private fetchSystemStatus() {
    try {
      this.http.get<any>(`${environment.apiUrl}/status.php`).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.systemStatus = res.data;
            this.statusKeys = Object.keys(this.systemStatus).filter(k => k !== 'timestamp');
          }
        },
        error: () => {
          // ignore
        }
      });
    } catch (e) {
      // ignore
    }
  }
}
