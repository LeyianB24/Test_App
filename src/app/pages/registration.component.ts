import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Router, RouterModule } from '@angular/router';
import { PinCertificateComponent } from '../portals/member/pages/compliance/pin-certificate.component';

@Component({
  selector: 'app-registration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule, NgOptimizedImage, PinCertificateComponent],
  template: `
    <div class="registration-root" [attr.data-theme]="theme()">

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

      <!-- Left Panel: Enrollment Intelligence -->
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
              <h2 class="text-xl font-black text-[var(--left-text)] uppercase tracking-tight mb-3">Register for iTax</h2>
              <p class="text-[11px] font-semibold text-[var(--left-muted)] leading-relaxed uppercase tracking-widest">
                Create your account to start managing your taxes and accessing government services online.
              </p>
            </div>

            <!-- Vertical Stepper -->
            <div class="space-y-6">
              <div class="flex items-start gap-4 group cursor-pointer" (click)="goToStep(1)" [class.opacity-40]="currentStep() < 1">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-[12px] font-black transition-all"
                  [class]="currentStep() >= 1 ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-glow)]' : 'bg-white/5 text-white/40 border border-white/10'">
                  1
                </div>
                <div>
                  <p class="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest mb-1">Step 01</p>
                  <p class="text-sm font-black text-white uppercase tracking-tight">Personal Details</p>
                </div>
              </div>

              <div class="w-px h-8 bg-white/10 ml-5"></div>

              <div class="flex items-start gap-4 group cursor-pointer" (click)="goToStep(2)" [class.opacity-40]="currentStep() < 2">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-[12px] font-black transition-all"
                  [class]="currentStep() >= 2 ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-glow)]' : 'bg-white/5 text-white/40 border border-white/10'">
                  2
                </div>
                <div>
                  <p class="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest mb-1">Step 02</p>
                  <p class="text-sm font-black text-white uppercase tracking-tight">Location Info</p>
                </div>
              </div>

              <div class="w-px h-8 bg-white/10 ml-5"></div>

              <div class="flex items-start gap-4 group cursor-pointer" (click)="goToStep(3)" [class.opacity-40]="currentStep() < 3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-[12px] font-black transition-all"
                  [class]="currentStep() >= 3 ? 'bg-[var(--accent)] text-white shadow-[var(--shadow-glow)]' : 'bg-white/5 text-white/40 border border-white/10'">
                  3
                </div>
                <div>
                  <p class="text-[9px] font-black text-[var(--accent)] uppercase tracking-widest mb-1">Step 03</p>
                  <p class="text-sm font-black text-white uppercase tracking-tight">Account Security</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-auto flex gap-4">
            <span class="footer-tag">SECURE ENROLL</span>
            <span class="footer-tag">AES-256</span>
          </div>
        </div>
      </div>

      <!-- Right Panel: Form Input -->
      <div class="right-panel">
        <div class="right-inner">
          <div class="form-card">
            
            @if (showSuccess()) {
              <div class="text-center animate-fade-in">
                <div class="w-20 h-20 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-8 animate-scale">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 class="form-title text-[var(--color-success)]">Registration Successful</h2>
                <p class="form-subtitle mb-12 uppercase tracking-widest text-[11px] font-bold">Your Taxpayer PIN has been generated.</p>
                
                <div class="max-w-md mx-auto">
                    <app-pin-certificate 
                      [pin]="generatedPIN()" 
                      [name]="regForm.get('firstName')?.value + ' ' + regForm.get('lastName')?.value"
                      [email]="regForm.get('email')?.value">
                    </app-pin-certificate>
                    
                    <button class="submit-btn mt-12" routerLink="/login">
                      <span class="submit-inner">SIGN IN TO YOUR ACCOUNT</span>
                      <span class="submit-shimmer"></span>
                    </button>
                </div>
              </div>
            } @else {
              <!-- Form Header -->
              <div class="form-header">
                <div class="form-header-top">
                  <div class="session-badge">
                    <span class="pulse-dot"></span>
                    STEP 0{{ currentStep() }} / 03
                  </div>
                  <span class="form-ref uppercase font-bold tracking-tighter">New Registration</span>
                </div>
                <h2 class="form-title">Account Registration</h2>
                <p class="form-subtitle">Follow the steps below to initialize your iTax account.</p>
              </div>

              <form [formGroup]="regForm" (ngSubmit)="onSubmit()" class="login-form">
                
                <!-- Step 1: Personal Details -->
                @if (currentStep() === 1) {
                  <div class="space-y-8 animate-fade-in-up">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="field-group">
                        <label class="field-label">Taxpayer Type</label>
                        <select formControlName="taxpayerType" class="field-input appearance-none">
                          <option value="individual">Individual</option>
                          <option value="business">Business / Corporate</option>
                        </select>
                      </div>
                      <div class="field-group">
                        <label class="field-label">Residency Status</label>
                        <select formControlName="residentStatus" class="field-input appearance-none">
                          <option value="resident">Resident</option>
                          <option value="non-resident">Non-Resident</option>
                        </select>
                      </div>
                      <div class="field-group">
                        <label class="field-label">First Name</label>
                        <input type="text" formControlName="firstName" placeholder="As per ID" class="field-input uppercase">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Last Name</label>
                        <input type="text" formControlName="lastName" placeholder="As per ID" class="field-input uppercase">
                      </div>
                      <div class="field-group">
                        <label class="field-label">ID / Passport Number</label>
                        <input type="text" formControlName="idNumber" placeholder="Primary ID" class="field-input font-mono uppercase">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Date of Birth</label>
                        <input type="date" formControlName="dob" class="field-input">
                      </div>
                    </div>
                    
                    <button type="button" (click)="goToStep(2)" [disabled]="isStep1Invalid()" class="submit-btn">
                      <span class="submit-inner">PROCEED TO NEXT STEP</span>
                      <span class="submit-shimmer"></span>
                    </button>
                    <div class="text-center">
                      <a routerLink="/login" class="forgot-link text-[11px] font-bold uppercase tracking-widest hover:text-[var(--accent)]">Already have an account? Sign In</a>
                    </div>
                  </div>
                }

                <!-- Step 2: Location Info -->
                @if (currentStep() === 2) {
                  <div class="space-y-8 animate-fade-in-up">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div class="field-group">
                        <label class="field-label">County</label>
                        <select formControlName="county" class="field-input appearance-none">
                          <option value="">Select County...</option>
                          @for (c of counties; track c.code) { <option [value]="c.name">{{ c.name }}</option> }
                        </select>
                      </div>
                      <div class="field-group">
                        <label class="field-label">Town</label>
                        <input type="text" formControlName="town" placeholder="City or Town" class="field-input uppercase">
                      </div>
                      <div class="field-group md:col-span-2">
                        <label class="field-label">Physical Address</label>
                        <textarea formControlName="address" rows="2" placeholder="Building, Street, Floor..." class="field-input py-3 min-h-[80px] uppercase"></textarea>
                      </div>
                      <div class="field-group">
                        <label class="field-label">KRA Hub/Station</label>
                        <select formControlName="kraStation" class="field-input appearance-none">
                          <option value="">Select Station...</option>
                          <option value="Nairobi North">Nairobi North</option>
                          <option value="Mombasa Station">Mombasa Central</option>
                          <option value="Kisumu Station">Kisumu West</option>
                        </select>
                      </div>
                      <div class="field-group">
                        <label class="field-label">Postal Code</label>
                        <input type="text" formControlName="postalCode" placeholder="e.g. 00100" class="field-input font-mono">
                      </div>
                    </div>
                    
                    <div class="flex gap-4">
                      <button type="button" (click)="goToStep(1)" class="field-input flex-1 border-2 font-bold uppercase tracking-widest text-[11px] hover:bg-[var(--bg-input)]">Back</button>
                      <button type="button" (click)="goToStep(3)" [disabled]="isStep2Invalid()" class="submit-btn flex-[2]">
                        <span class="submit-inner">CONTINUE REGISTRATION</span>
                        <span class="submit-shimmer"></span>
                      </button>
                    </div>
                  </div>
                }

                <!-- Step 3: Account Security -->
                @if (currentStep() === 3) {
                  <div class="space-y-8 animate-fade-in-up">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="field-group">
                        <label class="field-label">Email Address</label>
                        <input type="email" formControlName="email" placeholder="name@email.com" class="field-input">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Phone Number</label>
                        <input type="tel" formControlName="phone" placeholder="+254 7XX XXX" class="field-input font-mono">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Create Password</label>
                        <input type="password" formControlName="password" placeholder="••••••••" class="field-input">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Confirm Password</label>
                        <input type="password" formControlName="confirmPassword" placeholder="••••••••" class="field-input">
                      </div>
                    </div>

                    <div class="p-6 bg-[var(--bg-input)] border border-[var(--border)] rounded-[var(--r-lg)] space-y-4">
                      <h4 class="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Tax Obligations</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="flex items-center justify-between p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg">
                            <span class="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-tight">Income Tax</span>
                            <span class="text-[9px] font-black text-[var(--accent)] border border-[var(--accent-dim)] px-2 py-0.5 rounded">REQUIRED</span>
                        </div>
                        <label class="flex items-center justify-between p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg cursor-pointer hover:border-[var(--accent)] transition-all">
                            <span class="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-tight">VAT Obligation</span>
                            <input type="checkbox" formControlName="obVAT" class="w-4 h-4 accent-[var(--accent)]">
                        </label>
                      </div>
                    </div>

                    <label class="flex items-start gap-3 cursor-pointer p-1">
                      <input type="checkbox" formControlName="terms" class="w-4 h-4 accent-[var(--accent)] mt-0.5">
                      <span class="text-[11px] font-bold text-[var(--text-secondary)] leading-relaxed uppercase tracking-widest">
                        I certify that all information provided is accurate and I agree to the terms of service.
                      </span>
                    </label>

                    <div class="flex gap-4">
                      <button type="button" (click)="goToStep(2)" class="field-input flex-1 border-2 font-bold uppercase tracking-widest text-[11px] hover:bg-[var(--bg-input)]">Back</button>
                      <button type="submit" [disabled]="regForm.invalid || isSubmitting()" class="submit-btn flex-[2]">
                        <span class="submit-inner">
                           @if (!isSubmitting()) { COMPLETE REGISTRATION }
                           @else { 
                             <span class="spinner"></span>
                             PROCESSING... 
                            }
                        </span>
                        <span class="submit-shimmer"></span>
                      </button>
                    </div>
                  </div>
                }

              </form>
            }

            <div class="card-footer">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" class="text-[var(--accent)]">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/>
              </svg>
              OFFICIAL GOVERNMENT PORTAL &bull; DATA PROTECTED
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

    .registration-root {
      display: flex;
      min-height: 100dvh;
      background: var(--bg);
      transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

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
      --r-xl:           var(--radius-xl, 24px);
      --r-lg:           var(--radius-lg, 12px);
      --tr:             200ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .registration-root[data-theme="dark"] {
      --bg:             var(--bg-root, #0a0908);
      --bg-card:        var(--bg-surface-1, #141211);
      --bg-input:       var(--bg-surface-2, #1c1a18);
      --bg-input-focus: var(--bg-surface-3, #23211f);
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

    .right-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; overflow-y: auto; }
    .right-inner { width: 100%; max-width: 640px; margin: auto; }
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
export class RegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  regForm: FormGroup;
  currentStep = signal(1);
  isSubmitting = signal(false);
  showSuccess = signal(false);
  generatedPIN = signal('');
  theme = signal<'light' | 'dark'>('light');

  counties = [
    { name: 'Mombasa', code: '001' }, { name: 'Kwale', code: '002' },
    { name: 'Kilifi', code: '003' }, { name: 'Tana River', code: '004' },
    { name: 'Lamu', code: '005' }, { name: 'Taita Taveta', code: '006' },
    { name: 'Garissa', code: '007' }, { name: 'Wajir', code: '008' },
    { name: 'Mandera', code: '009' }, { name: 'Marsabit', code: '010' },
    { name: 'Isiolo', code: '011' }, { name: 'Meru', code: '012' },
    { name: 'Tharaka-Nithi', code: '013' }, { name: 'Embu', code: '014' },
    { name: 'Kitui', code: '015' }, { name: 'Machakos', code: '016' },
    { name: 'Makueni', code: '017' }, { name: 'Nyandarua', code: '018' },
    { name: 'Nyeri', code: '019' }, { name: 'Kirinyaga', code: '020' },
    { name: 'Murang\'a', code: '021' }, { name: 'Kiambu', code: '022' },
    { name: 'Turkana', code: '023' }, { name: 'West Pokot', code: '024' },
    { name: 'Samburu', code: '025' }, { name: 'Trans Nzoia', code: '026' },
    { name: 'Uasin Gishu', code: '027' }, { name: 'Elgeyo Marakwet', code: '028' },
    { name: 'Nandi', code: '029' }, { name: 'Baringo', code: '030' },
    { name: 'Laikipia', code: '031' }, { name: 'Nakuru', code: '032' },
    { name: 'Narok', code: '033' }, { name: 'Kajiado', code: '034' },
    { name: 'Kericho', code: '035' }, { name: 'Bomet', code: '036' },
    { name: 'Kakamega', code: '037' }, { name: 'Vihiga', code: '038' },
    { name: 'Bungoma', code: '039' }, { name: 'Busia', code: '040' },
    { name: 'Siaya', code: '041' }, { name: 'Kisumu', code: '042' },
    { name: 'Homa Bay', code: '043' }, { name: 'Migori', code: '044' },
    { name: 'Kisii', code: '045' }, { name: 'Nyamira', code: '046' },
    { name: 'Nairobi', code: '047' }
  ];

  constructor() {
    this.regForm = this.fb.group({
      taxpayerType: ['individual', Validators.required],
      residentStatus: ['resident', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      idNumber: ['', [Validators.required, Validators.minLength(6)]],
      dob: ['', Validators.required],
      economicActivity: ['employment', Validators.required],

      county: ['', Validators.required],
      subCounty: ['', Validators.required],
      ward: ['', Validators.required],
      town: ['', Validators.required],
      postalCode: ['', Validators.required],
      address: ['', Validators.required],
      kraStation: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+]{10,13}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
      
      obIncomeTax: [true],
      obVAT: [false]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(prefersDark ? 'dark' : 'light');
  }

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return pass === confirm ? null : { 'mismatch': true };
  }

  goToStep(step: number) {
    this.currentStep.set(step);
  }

  isStep1Invalid(): boolean {
    const fields = ['taxpayerType', 'residentStatus', 'firstName', 'lastName', 'idNumber', 'dob', 'economicActivity'];
    return fields.some(f => this.regForm.get(f)?.invalid);
  }

  isStep2Invalid(): boolean {
    const fields = ['county', 'subCounty', 'ward', 'town', 'postalCode', 'address', 'kraStation'];
    return fields.some(f => this.regForm.get(f)?.invalid);
  }

  onSubmit() {
    if (this.regForm.valid) {
      this.isSubmitting.set(true);
      const formData = this.regForm.getRawValue();
      const taxpayerId = this.generateTaxpayerId();
      
      const registrationData: any = {
        taxpayer_id: taxpayerId,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        type: formData.taxpayerType,
        profile: {
          id_number: formData.idNumber,
          first_name: formData.firstName,
          last_name: formData.lastName,
          dob: formData.dob,
          email: formData.email,
          phone: formData.phone,
          county: formData.county,
          town: formData.town,
          address: formData.address
        },
        obligations: [formData.obIncomeTax ? 'Income Tax - Resident' : ''],
        station: formData.kraStation
      };

      if (formData.obVAT) registrationData.obligations.push('Value Added Tax (VAT)');

      this.authService.register(registrationData).subscribe({
        next: (response: any) => {
          this.isSubmitting.set(false);
          if (response.success) {
            this.generatedPIN.set(taxpayerId);
            this.showSuccess.set(true);
          } else {
            alert(response.message || 'Error: ID number already registered.');
          }
        },
        error: () => {
          this.isSubmitting.set(false);
          alert('Error connecting to the server. Please check uplink.');
        }
      });
    } else {
      this.regForm.markAllAsTouched();
    }
  }

  private generateTaxpayerId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let pin = 'A';
    for (let i = 0; i < 9; i++) pin += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pin += letters.charAt(Math.floor(Math.random() * letters.length));
    return pin;
  }
}
