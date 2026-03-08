import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule, NgOptimizedImage],
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
                <img ngSrc="assets/logo.png" width="100" height="100" alt="KRA Logo" priority>
              </div>
              <div class="brand-info-elite">
                <span class="hub-tag">Security & Recovery</span>
                <h1 class="auth-title-elite">Reset <span class="gradient-text">Cipher</span></h1>
              </div>
            </div>
    
            <!-- Recovery Header -->
            @if (!showSuccess()) {
              <div class="auth-header-mini mt-40">
                <h2>Identity Restoration</h2>
                <p>Enter your Taxpayer PIN to initiate secure recovery</p>
              </div>
            }
    
            <!-- Form Area -->
            @if (!showSuccess()) {
              <div class="auth-form-luxury mt-32">
                <form [formGroup]="recoveryForm" (ngSubmit)="onSubmit()" class="recovery-form">
                  <div class="form-group-luxury">
                    <label>Registered Taxpayer PIN</label>
                    <div class="luxury-input-wrapper">
                      <svg class="input-icon-elite" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2.5"/></svg>
                      <input
                        type="text"
                        class="elite-input-luxury with-icon"
                        formControlName="taxpayer_id"
                        placeholder="e.g. A000123456Z"
                        >
                      </div>
                    </div>
                    <!-- Error Message -->
                    @if (errorMessage()) {
                      <div class="auth-error-glass animate-up mt-24">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2.5"/></svg>
                        <span>{{ errorMessage() }}</span>
                      </div>
                    }
                    <div class="stage-footer mt-40">
                      <button type="button" class="modern-btn outline-btn" routerLink="/login">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Back to Authentication
                      </button>
                      <button type="submit" class="modern-btn primary-btn elite-glow" [disabled]="recoveryForm.invalid || isSubmitting()">
                        @if (!isSubmitting()) {
                          <span>Authorize Recovery</span>
                        }
                        @if (isSubmitting()) {
                          <span class="loader-flex">
                            <div class="mini-spinner"></div>
                            Tracing Records...
                          </span>
                        }
                      </button>
                    </div>
                  </form>
                </div>
              }
    
              <!-- Success Reveal -->
              @if (showSuccess()) {
                <div class="success-reveal animate-scale">
                  <div class="stamp-luxury-blue">
                    <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-width="2.5"/></svg>
                  </div>
                  <h2 class="success-title-elite">Transmission Complete</h2>
                  <p class="success-msg-elite">Identity verified. A secure reset token has been dispatched to: <br><strong class="highlight-text">{{ maskedEmail() }}</strong></p>
                  <button class="modern-btn primary-btn full-width mt-40" routerLink="/login">Return to Security Gateway</button>
                </div>
              }
    
              <!-- Branding Seal -->
              <div class="security-seal-mini mt-48">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/></svg>
                <span>Trusted Government Identity Protocol</span>
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
    .auth-container { width: 100%; max-width: 620px; }

    .elite-auth-card {
      background: rgba(255, 255, 255, 0.03);
      -webkit-backdrop-filter: blur(32px); backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 48px;
      padding: 60px; box-shadow: 0 50px 150px rgba(0,0,0,0.6);
    }

    .auth-brand-box { display: flex; align-items: center; gap: 24px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 32px; }
    .logo-wrapper-luxury { background: white; padding: 12px; border-radius: 22px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(255,255,255,0.1); }
    .hub-tag { display: block; color: var(--kra-red); font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px; }
    .auth-title-elite { font-size: 3rem; font-weight: 900; color: white; margin: 0; letter-spacing: -2px; line-height: 1; }

    .auth-header-mini h2 { font-size: 1.5rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.5px; }
    .auth-header-mini p { color: rgba(255,255,255,0.45); font-size: 1rem; margin-top: 8px; }

    .form-group-luxury { display: flex; flex-direction: column; gap: 12px; }
    .form-group-luxury label { font-size: 0.8rem; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; }

    .luxury-input-wrapper { position: relative; }
    .input-icon-elite { position: absolute; left: 24px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.25); pointer-events: none; }
    
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

    .auth-error-glass { background: rgba(227, 30, 36, 0.1); border: 1px solid rgba(227, 30, 36, 0.2); color: #ff9a9c; padding: 18px; border-radius: 20px; display: flex; align-items: center; gap: 14px; font-weight: 700; font-size: 0.95rem; }

    .stage-footer { display: flex; justify-content: space-between; align-items: center; gap: 24px; }
    .full-width { width: 100%; }
    .elite-glow:hover { box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    .loader-flex { display: flex; align-items: center; justify-content: center; gap: 12px; }
    .mini-spinner { width: 22px; height: 22px; border: 3px solid rgba(255,255,255,0.2); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Success Results */
    .success-reveal { text-align: center; }
    .stamp-luxury-blue { width: 100px; height: 100px; background: var(--kra-blue); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 0 40px rgba(26,54,93,0.3); }
    .success-title-elite { font-size: 2.25rem; font-weight: 900; color: white; letter-spacing: -1px; margin-top: 24px; margin-bottom: 12px; }
    .success-msg-elite { color: rgba(255,255,255,0.5); font-size: 1.1rem; line-height: 1.6; }
    .highlight-text { color: white; font-weight: 800; border-bottom: 2px solid var(--kra-red); }

    .security-seal-mini { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 0.75rem; color: rgba(255,255,255,0.2); font-weight: 800; text-transform: uppercase; letter-spacing: 2.5px; }

    .gradient-text { background: var(--kra-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .mt-24 { margin-top: 24px; }
    .mt-32 { margin-top: 32px; }
    .mt-40 { margin-top: 40px; }
    .mt-48 { margin-top: 48px; }

    @media (max-width: 600px) {
      .auth-view-scroller { padding: 20px 12px; }
      .elite-auth-card { padding: 40px 24px; }
      .stage-footer { flex-direction: column-reverse; }
      .stage-footer button { width: 100%; }
    }
  `]
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  recoveryForm = this.fb.group({
    taxpayer_id: ['', Validators.required]
  });

  maskedEmail = signal('');
  isSubmitting = signal(false);
  errorMessage = signal('');
  showSuccess = signal(false);

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
        this.errorMessage.set('Primary gateway connection timed out.');
      }
    });
  }
}
