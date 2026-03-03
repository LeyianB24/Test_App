import { Component, inject, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { LoginCredentials } from '../core/models/app.models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgOptimizedImage],
  template: `
    <div class="login-page-precision">
      <!-- Left Panel: Brand & Visuals -->
      <div class="login-left-panel">
        <div class="login-bg-overlay"></div>
        <div class="login-left-content">
          <div class="login-brand-precision">
            <img ngSrc="assets/img/kra-logo-white.png" width="80" height="80" alt="KRA Logo" priority class="login-branding-logo">
            <div class="brand-text-complex">
              <span class="brand-tagline">Kenya Revenue Authority</span>
              <h1 class="brand-portal-name">iTax<span class="portal-dot"></span></h1>
            </div>
          </div>
          
          <div class="login-hero-text">
            <h2>Authorized Access Only</h2>
            <p>Welcome to the unified revenue administration terminal. Please authenticate to access your operational workspace.</p>
          </div>

          <div class="login-status-badges" *ngIf="systemStatus()">
            @for (portal of systemStatus(); track portal.name) {
              <div class="status-badge-precision" [class.online]="portal.online">
                <span class="status-dot"></span>
                <span class="status-label">{{ portal.name }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Right Panel: Authentication Form -->
      <div class="login-right-panel">
        <div class="login-card-precision animate-fade-in">
          <div class="login-header-precision">
            <h3>Portal Login</h3>
            <p>Enter your credentials to establish a secure session.</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="login-form-precision">
            <div class="form-group-precision">
              <label>Taxpayer PIN / ID</label>
              <div class="input-container-precision">
                <input
                  type="text"
                  formName="taxpayer_id"
                  formControlName="taxpayer_id"
                  placeholder="e.g. A000123456Z"
                  class="input-precision"
                  autocomplete="username"
                />
              </div>
            </div>

            <div class="form-group-precision">
              <div class="flex justify-between items-center mb-1">
                <label>Security Password</label>
                <a routerLink="/forgot-password" class="text-xs color-red-base hover:underline">Forgot?</a>
              </div>
              <div class="input-container-precision">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  formName="password"
                  formControlName="password"
                  placeholder="••••••••••••"
                  class="input-precision"
                  autocomplete="current-password"
                />
                <button type="button" class="password-toggle-btn" (click)="togglePasswordVisibility()">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path *ngIf="!showPassword()" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path *ngIf="!showPassword()" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/>
                    <path *ngIf="showPassword()" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2 mb-6">
              <input type="checkbox" formControlName="rememberMe" id="rememberMe">
              <label for="rememberMe" class="text-xs color-black-400">Remember this terminal</label>
            </div>

            <div class="auth-error-precision" *ngIf="errorMessage()">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
              <span>{{ errorMessage() }}</span>
            </div>

            <button type="submit" class="btn-precision btn-primary-precision w-full" [disabled]="isLoading() || loginForm.invalid">
              @if (!isLoading()) {
                Establish Secure Session
              } @else {
                <span class="flex items-center gap-2 justify-center">
                  <div class="loader-spinner-tiny"></div>
                  Authenticating...
                </span>
              }
            </button>
          </form>

          <div class="login-footer-precision">
            <p>New taxpayer? <a routerLink="/registration">Register here</a></p>
            <div class="encryption-tag">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/></svg>
              SHA-256 Government Grade Encryption
            </div>
            
            <div class="partner-logos-row">
              <img ngSrc="assets/img/itax-logo.png" width="60" height="24" alt="iTax">
              <img ngSrc="assets/img/vision2030.png" width="60" height="24" alt="Vision 2030">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    taxpayer_id: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  isLoading = signal(false);
  errorMessage = signal<string>('');
  showPassword = signal(false);
  systemStatus = signal<any>(null);
  statusKeys: string[] = [];

  constructor() {
    this.fetchSystemStatus();
  }

  onLogin() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    
    const { taxpayer_id, password } = this.loginForm.getRawValue();
    const credentials: LoginCredentials = { 
      taxpayer_id: taxpayer_id!, 
      password: password! 
    };

    const rememberMe = !!this.loginForm.get('rememberMe')?.value;

    this.authService.login(credentials, rememberMe).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          // Route to the correct portal based on roleCategory signal
          const portal = this.authService.roleCategory() === 'member'
            ? '/member/dashboard'
            : '/admin-portal/dashboard';
          this.router.navigate([portal], { replaceUrl: true });
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
    this.http.get<any>(`${environment.apiUrl}/status_check.php`).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.systemStatus.set(res.data);
        }
      },
      error: () => { /* Fail silently */ }
    });
  }
}
