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
              <p class="brand-sub">Central Registry</p>
            </div>
          </div>

          <p class="brand-tagline">
            Official resident enrollment protocol.<br>Foundational taxpayer attribution sequence.
          </p>

          <div class="stepper-vertical mt-12">
            <div class="step-v" [class.active]="currentStep === 1" [class.done]="currentStep > 1" (click)="goToStep(1)">
              <div class="step-dot">
                @if (currentStep > 1) { <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg> }
                @else { 1 }
              </div>
              <div class="step-info">
                <p class="step-key">PHASE 01</p>
                <p class="step-name">Identify</p>
              </div>
            </div>
            <div class="step-line-v" [class.done]="currentStep > 1"></div>
            <div class="step-v" [class.active]="currentStep === 2" [class.done]="currentStep > 2" (click)="goToStep(2)">
              <div class="step-dot">
                @if (currentStep > 2) { <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg> }
                @else { 2 }
              </div>
              <div class="step-info">
                <p class="step-key">PHASE 02</p>
                <p class="step-name">Domicile</p>
              </div>
            </div>
            <div class="step-line-v" [class.done]="currentStep > 2"></div>
            <div class="step-v" [class.active]="currentStep === 3" [class.done]="currentStep > 3" (click)="goToStep(3)">
              <div class="step-dot">3</div>
              <div class="step-info">
                <p class="step-key">PHASE 03</p>
                <p class="step-name">Secure</p>
              </div>
            </div>
          </div>

          <div class="divider-rule mt-auto mb-10"></div>
          
          <div class="left-footer">
            <span class="footer-tag">SECURE ENROLLMENT</span>
            <span class="footer-tag">TLS 1.3</span>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="right-inner-scroll">
          <div class="form-card-wide">

            <div class="form-header">
              <div class="form-header-top">
                <div class="session-badge">
                  <span class="pulse-dot"></span>
                  @switch (currentStep) {
                    @case (1) { IDENTITY PARAMETERS }
                    @case (2) { DOMICILE REGISTRY }
                    @case (3) { SECURITY PROTOCOLS }
                  }
                </div>
                <span class="form-ref">STEP 0{{ currentStep }} / 03</span>
              </div>
              
              @if (!showSuccess()) {
                <h2 class="form-title">Resident Enrollment</h2>
                <p class="form-subtitle">Formal taxpayer attribution for legislative compliance.</p>
              } @else {
                <h2 class="form-title">Enrollment Successful</h2>
                <p class="form-subtitle">Your digital identity has been certified and dispatched.</p>
              }
            </div>

            @if (showSuccess()) {
              <div class="success-vault animate-scale">
                <app-pin-certificate 
                  [pin]="generatedPIN()" 
                  [name]="regForm.get('firstName')?.value + ' ' + regForm.get('lastName')?.value"
                  [email]="regForm.get('email')?.value">
                </app-pin-certificate>

                <div class="mt-12 flex justify-center">
                  <button class="submit-btn max-w-sm" routerLink="/login">
                    <span class="submit-inner">Access Taxpayer Dashboard</span>
                  </button>
                </div>
              </div>
            } @else {
              <form [formGroup]="regForm" (ngSubmit)="onSubmit()" class="registration-form">
                
                <!-- Step 1: Identify -->
                @if (currentStep === 1) {
                  <div class="step-content animate-in">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div class="field-group">
                        <label class="field-label">Taxpayer Category</label>
                        <select class="field-input" formControlName="taxpayerType">
                          <option value="individual">Individual Entity</option>
                          <option value="business">Non-Individual / Corporate</option>
                        </select>
                      </div>
                      <div class="field-group">
                        <label class="field-label">Residency Status</label>
                        <select class="field-input" formControlName="residentStatus">
                          <option value="resident">Resident of Kenya</option>
                          <option value="non-resident">Non-Resident Entity</option>
                        </select>
                      </div>
                      <div class="field-group">
                        <label class="field-label">First Name</label>
                        <input type="text" class="field-input" formControlName="firstName" placeholder="Legal Forename">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Surname</label>
                        <input type="text" class="field-input" formControlName="lastName" placeholder="Legal Surname">
                      </div>
                      <div class="field-group">
                        <label class="field-label">ID / Passport Number</label>
                        <input type="text" class="field-input" formControlName="idNumber" placeholder="Registry ID">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Date of Birth</label>
                        <input type="date" class="field-input" formControlName="dob">
                      </div>
                      <div class="field-group md:col-span-2">
                        <label class="field-label">Economic Activity</label>
                        <select class="field-input" formControlName="economicActivity">
                          <option value="">Select activity classification...</option>
                          <option value="employment">Employment Services</option>
                          <option value="business">General Trade / Retail</option>
                          <option value="professional">Specialized Professional</option>
                          <option value="farming">Agro-Industrial</option>
                        </select>
                      </div>
                    </div>
                    <div class="step-footer mt-10">
                      <button type="button" class="submit-btn" (click)="goToStep(2)" [disabled]="isStep1Invalid()">
                        <span class="submit-inner">Advanced Sequence</span>
                      </button>
                    </div>
                  </div>
                }

                <!-- Step 2: Domicile -->
                @if (currentStep === 2) {
                  <div class="step-content animate-in">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div class="field-group">
                        <label class="field-label">County</label>
                        <select class="field-input" formControlName="county" (change)="onCountyChange()">
                          <option value="">Select County...</option>
                          @for (c of counties; track c.code) {
                            <option [value]="c.name">{{ c.name }}</option>
                          }
                        </select>
                      </div>
                      <div class="field-group">
                        <label class="field-label">Major Town / City</label>
                        <input type="text" class="field-input" formControlName="town" placeholder="e.g. Nairobi">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Sub-County / District</label>
                        <input type="text" class="field-input" formControlName="subCounty" placeholder="District">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Administrative Ward</label>
                        <input type="text" class="field-input" formControlName="ward" placeholder="Ward">
                      </div>
                      <div class="field-group">
                        <label class="field-label">KRA Station</label>
                        <select class="field-input" formControlName="kraStation">
                          <option value="">Select nearest center...</option>
                          <option value="Nairobi North">Nairobi North</option>
                          <option value="Mombasa Station">Mombasa Hub</option>
                          <option value="Kisumu Station">Kisumu Regional</option>
                        </select>
                      </div>
                      <div class="field-group">
                        <label class="field-label">Postal Code</label>
                        <input type="text" class="field-input" formControlName="postalCode" placeholder="00100">
                      </div>
                      <div class="field-group md:col-span-2">
                        <label class="field-label">Physical Address</label>
                        <textarea class="field-input h-20 py-3" formControlName="address" placeholder="Building, Floor, Street Identity..."></textarea>
                      </div>
                    </div>
                    <div class="step-footer mt-10 grid grid-cols-2 gap-4">
                      <button type="button" class="outline-btn" (click)="goToStep(1)">Return</button>
                      <button type="button" class="submit-btn" (click)="goToStep(3)" [disabled]="isStep2Invalid()">
                        <span class="submit-inner">Finalize Sequence</span>
                      </button>
                    </div>
                  </div>
                }

                <!-- Step 3: Secure -->
                @if (currentStep === 3) {
                  <div class="step-content animate-in">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div class="field-group">
                        <label class="field-label">Verified Email</label>
                        <input type="email" class="field-input" formControlName="email" placeholder="name@domain.com">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Contact Number</label>
                        <input type="tel" class="field-input" formControlName="phone" placeholder="+254 7XX XXX">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Encryption Key</label>
                        <input type="password" class="field-input" formControlName="password" placeholder="Min 6 chars">
                      </div>
                      <div class="field-group">
                        <label class="field-label">Confirm Key</label>
                        <input type="password" class="field-input" formControlName="confirmPassword" placeholder="Match key">
                      </div>
                    </div>

                    <!-- Mandates -->
                    <div class="mt-8 p-4 bg-bg-input rounded-xl border border-border">
                      <p class="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-4">Tax Obligations</p>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label class="mandate-card group cursor-pointer" [class.checked]="regForm.get('obIncomeTax')?.value">
                          <input type="checkbox" formControlName="obIncomeTax" [disabled]="true" class="hidden">
                          <div class="flex flex-col">
                            <span class="text-xs font-bold text-text-primary">Income Tax - Resident</span>
                            <span class="text-[8px] font-bold text-accent">MANDATORY</span>
                          </div>
                        </label>
                        <label class="mandate-card group cursor-pointer" [class.checked]="regForm.get('obVAT')?.value">
                          <input type="checkbox" formControlName="obVAT" class="hidden">
                          <div class="flex flex-col">
                            <span class="text-xs font-bold text-text-primary">Value Added Tax (VAT)</span>
                            <span class="text-[8px] font-bold text-text-muted">OPTIONAL</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <!-- Terms -->
                    <div class="mt-6">
                      <label class="terms-label">
                        <input type="checkbox" formControlName="terms" class="checkbox-ui">
                        <span>I formally certify that all informational parameters submitted are accurate and legally binding.</span>
                      </label>
                    </div>

                    <div class="step-footer mt-10 grid grid-cols-2 gap-4">
                      <button type="button" class="outline-btn" (click)="goToStep(2)">Return</button>
                      <button type="submit" class="submit-btn" [disabled]="regForm.invalid || isSubmitting()">
                        <span class="submit-inner">
                          @if (!isSubmitting()) { Initialize Registration }
                          @else { <span class="spinner"></span> Processing... }
                        </span>
                      </button>
                    </div>
                  </div>
                }

              </form>
            }

            <div class="card-footer mt-10">
              <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/>
              </svg>
              CERTIFIED SECURE &bull; DATA PROTECTION ACT &bull; GOK CLOUD
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

    :host { display: block; height: 100dvh; font-family: 'Plus Jakarta Sans', sans-serif; }

    .login-root {
      --r: 10px;
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
    }

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
    }

    .login-root { display: flex; min-height: 100dvh; background: var(--bg); transition: background .3s ease; position: relative; }

    /* Theme Toggle */
    .theme-toggle {
      position: fixed; top: 20px; right: 20px; z-index: 100;
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--bg-card); border: 1px solid var(--border);
      color: var(--text-secondary); display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all var(--tr);
    }
    .theme-toggle:hover { border-color: var(--accent); color: var(--accent); transform: rotate(20deg); }

    /* Left Panel */
    .left-panel { width: 380px; flex-shrink: 0; background: var(--left-bg); position: relative; overflow: hidden; display: flex; flex-direction: column; }
    .left-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--left-border) 1px, transparent 1px), linear-gradient(90deg, var(--left-border) 1px, transparent 1px); background-size: 40px 40px; opacity: .35; }
    .left-glow { position: absolute; top: -80px; left: -80px; width: 320px; height: 320px; border-radius: 50%; background: radial-gradient(circle, rgba(193,57,43,.2) 0%, transparent 70%); }
    .corner-mark { position: absolute; width: 12px; height: 12px; border-color: var(--left-accent); border-style: solid; opacity: .5; }
    .corner-tl { top: 16px; left: 16px; border-width: 1px 0 0 1px; }
    .corner-tr { top: 16px; right: 16px; border-width: 1px 1px 0 0; }
    .corner-bl { bottom: 16px; left: 16px; border-width: 0 0 1px 1px; }
    .corner-br { bottom: 16px; right: 16px; border-width: 0 1px 1px 0; }
    .left-inner { position: relative; z-index: 1; padding: 48px 40px; display: flex; flex-direction: column; height: 100%; }

    /* Brand */
    .brand-block { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
    .logo-wrap { position: relative; width: 52px; height: 52px; }
    .logo-img { width: 52px; height: 52px; border-radius: 10px; position: relative; z-index: 1; }
    .logo-ring { position: absolute; inset: -4px; border-radius: 14px; border: 1px solid rgba(193,57,43,.4); animation: ring-pulse 3s infinite; }
    @keyframes ring-pulse { 0%, 100% { opacity: .4; transform: scale(1); } 50% { opacity: .8; transform: scale(1.04); } }
    .brand-eyebrow { font-size: 9px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--left-accent); margin: 0 0 2px; }
    .brand-name { font-size: 26px; font-weight: 800; color: var(--left-text); margin: 0; line-height: 1; }
    .brand-accent { color: var(--left-accent); }
    .brand-sub { font-size: 10px; font-weight: 500; color: var(--left-muted); text-transform: uppercase; margin: 2px 0 0; }
    .brand-tagline { font-size: 12px; font-weight: 400; line-height: 1.6; color: var(--left-muted); margin: 0 0 28px; }

    /* Stepper */
    .stepper-vertical { display: flex; flex-direction: column; gap: 8px; }
    .step-v { display: flex; align-items: center; gap: 16px; cursor: pointer; transition: opacity .2s; }
    .step-v:not(.active):not(.done) { opacity: .4; }
    .step-dot {
      width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--left-border);
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 800; color: var(--left-muted);
      background: var(--left-tag-bg);
    }
    .step-v.active .step-dot { border-color: var(--left-accent); color: var(--left-text); background: var(--left-accent); }
    .step-v.done .step-dot { border-color: var(--left-accent); color: var(--left-accent); background: rgba(193,57,43,.1); }
    .step-key { font-size: 8px; font-weight: 700; color: var(--left-accent); margin: 0 0 1px; }
    .step-name { font-size: 12px; font-weight: 600; color: var(--left-text); margin: 0; }
    .step-line-v { width: 1px; height: 20px; background: var(--left-border); margin-left: 12px; }
    .step-line-v.done { background: var(--left-accent); opacity: .4; }

    .divider-rule { height: 1px; background: linear-gradient(90deg, var(--left-accent) 0%, transparent 100%); opacity: .5; }
    .left-footer { display: flex; gap: 6px; }
    .footer-tag { font-size: 8px; font-weight: 700; padding: 4px 8px; border-radius: 4px; background: var(--left-tag-bg); border: 1px solid var(--left-border); color: var(--left-muted); }

    /* Right Panel */
    .right-panel { flex: 1; display: flex; flex-direction: column; }
    .right-inner-scroll { flex: 1; overflow-y: auto; padding: 48px 24px; display: flex; align-items: flex-start; justify-content: center; }
    .form-card-wide { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 40px; box-shadow: var(--shadow-lg); width: 100%; max-width: 680px; }

    .form-header { margin-bottom: 32px; }
    .form-header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .session-badge {
      display: flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 700;
      color: var(--accent); background: var(--accent-bg); border: 1px solid var(--accent-dim); padding: 4px 10px; border-radius: 20px;
    }
    .pulse-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: blink 2s infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
    .form-ref { font-size: 10px; font-weight: 600; color: var(--text-muted); }
    .form-title { font-size: 24px; font-weight: 800; color: var(--text-primary); margin: 0; }
    .form-subtitle { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 4px 0 0; }

    /* Fields */
    .field-group { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; }
    .field-input {
      width: 100%; height: 42px; padding: 0 14px; background: var(--bg-input); border: 1px solid var(--border); border-radius: var(--r);
      font-size: 13px; font-weight: 500; color: var(--text-primary); transition: all var(--tr); outline: none;
    }
    .field-input:focus { border-color: var(--accent); background: var(--bg-input-focus); box-shadow: 0 0 0 3px rgba(193,57,43,.08); }

    .mandate-card {
      display: flex; flex-direction: column; padding: 12px 16px; border-radius: var(--r);
      background: var(--bg-card); border: 1px solid var(--border); transition: all var(--tr);
    }
    .mandate-card.checked { border-color: var(--accent); background: var(--accent-bg); }

    .terms-label { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 11px; color: var(--text-secondary); }
    .checkbox-ui { margin-top: 3px; accent-color: var(--accent); }

    .submit-btn {
      position: relative; width: 100%; height: 46px; background: var(--submit-bg); border: none; border-radius: var(--r);
      cursor: pointer; transition: all .2s; overflow: hidden;
    }
    .submit-btn:hover:not(:disabled) { background: var(--submit-hover); transform: translateY(-1px); box-shadow: 0 8px 20px rgba(193,57,43,.2); }
    .submit-inner { display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px; font-weight: 700; color: #fff; }
    .outline-btn {
      width: 100%; height: 46px; background: transparent; border: 1px solid var(--border); border-radius: var(--r);
      font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all .2s;
    }
    .outline-btn:hover { background: var(--bg-input); }

    .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .card-footer { display: flex; align-items: center; justify-content: center; gap: 6px; padding-top: 24px; border-top: 1px solid var(--border); font-size: 9px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }

    .animate-in { animation: fade-in .4s ease-out; }
    @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 900px) {
      .left-panel { display: none; }
      .theme-toggle { top: 12px; right: 12px; }
    }
  `]
})
export class RegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  regForm: FormGroup;
  currentStep = 1;
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
      // Step 1
      taxpayerType: ['individual', Validators.required],
      residentStatus: ['resident', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      idNumber: ['', [Validators.required, Validators.minLength(6)]],
      dob: ['', Validators.required],
      economicActivity: ['', Validators.required],

      // Step 2
      county: ['', Validators.required],
      subCounty: ['', Validators.required],
      ward: ['', Validators.required],
      town: ['', Validators.required],
      postalCode: ['', Validators.required],
      address: ['', Validators.required],
      kraStation: ['', Validators.required],

      // Step 3
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+]{10,13}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
      
      // Obligations
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

  onCountyChange() {
    // Logic for county change if needed elsewhere
  }

  goToStep(step: number) {
    this.currentStep = step;
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
      const { confirmPassword, terms, obIncomeTax, obVAT, ...userData } = formData;
      
      const taxpayerId = this.generateTaxpayerId();
      
      const registrationData: any = {
        taxpayer_id: taxpayerId,
        password: userData.password,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        type: userData.taxpayerType,
        profile: {
          id_number: userData.idNumber,
          first_name: userData.firstName,
          last_name: userData.lastName,
          dob: userData.dob,
          email: userData.email,
          phone: userData.phone,
          county: userData.county,
          town: userData.town,
          address: userData.address
        },
        obligations: [obIncomeTax ? 'Income Tax - Resident' : ''],
        station: userData.kraStation
      };

      if (obVAT) registrationData.obligations.push('Value Added Tax (VAT)');

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
          alert('Error connecting to the server. Please try again later.');
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

  downloadAck() {
    alert('Generating Digital PIN Certificate System-Generated (PDF)...');
  }
}
