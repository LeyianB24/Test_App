import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgOptimizedImage],
  template: `
    <div class="auth-layout login-scene">
      <!-- Fixed Background Layer -->
      <div class="bg-image-container">
        <div class="bg-overlay"></div>
      </div>
      
      <div class="registration-view-scroller">
        <div class="registration-container animate-up">
          <div class="glass-card elite-reg-card-premium">
            
            <!-- Brand & Hub Header -->
            <div class="reg-brand-box">
              <div class="logo-wrapper-luxury">
                <img ngSrc="assets/logo.png" width="100" height="100" alt="KRA Logo" priority>
              </div>
              <div class="brand-info-elite">
                <span class="hub-tag">Taxpayer Enrolment Portal</span>
                <h1 class="auth-title-elite">Resident <span class="gradient-text">Registration</span></h1>
              </div>
            </div>

            <!-- Enhanced Universal Step Tracker -->
            <div class="elite-stepper mt-40">
              <div class="step-blob" [class.active]="currentStep === 1" [class.done]="currentStep > 1">
                <div class="step-icon">
                   <span *ngIf="currentStep <= 1">01</span>
                   <svg *ngIf="currentStep > 1" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="step-text">Bio-Data</span>
              </div>
              <div class="step-connector" [class.done]="currentStep > 1"></div>
              <div class="step-blob" [class.active]="currentStep === 2" [class.done]="currentStep > 2">
                <div class="step-icon">
                   <span *ngIf="currentStep <= 2">02</span>
                   <svg *ngIf="currentStep > 2" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="step-text">Geography</span>
              </div>
              <div class="step-connector" [class.done]="currentStep > 2"></div>
              <div class="step-blob" [class.active]="currentStep === 3" [class.done]="currentStep > 3">
                <div class="step-icon">
                   <span *ngIf="currentStep <= 3">03</span>
                   <svg *ngIf="currentStep > 3" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="step-text">Security</span>
              </div>
            </div>

            <!-- Dynamic Form Entry Surface -->
            <div class="form-surface mt-48">
              
              <!-- Success Result: Digital PIN Certificate -->
              <div class="success-reveal animate-scale" *ngIf="showSuccess()">
                <div class="cert-header">
                   <div class="stamp-luxury">
                      <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
                   </div>
                   <h2>PIN Registration Successful</h2>
                   <p>Official acknowledgement of taxpayer registration</p>
                </div>

                <div class="pin-display-luxury">
                   <span class="p-meta">ASSIGNED KRA P.I.N</span>
                   <div class="p-value">{{ generatedPIN() }}</div>
                   <div class="p-verify">
                      <span class="v-dot"></span> Verified by Central Revenue Authority
                   </div>
                </div>

                <div class="success-actions mt-40">
                   <button class="modern-btn primary-btn full-width" routerLink="/login">
                      Login to iTax Dashboard
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                   </button>
                   <button class="modern-btn outline-btn full-width mt-12" (click)="downloadAck()">
                      Download Acknowledgement Receipt (PDF)
                   </button>
                </div>
              </div>

              <!-- Form Body -->
              <form [formGroup]="regForm" (ngSubmit)="onSubmit()" *ngIf="!showSuccess()">
                
                <!-- Stage 01: Bio-Data Intelligence -->
                <div class="form-stage" *ngIf="currentStep === 1">
                  <div class="stage-intro">
                     <h3>Identity & Legal Classification</h3>
                     <p>Primary data used for official identification</p>
                  </div>
                  
                  <div class="form-grid-elite">
                    <div class="form-group-luxury">
                      <label>Taxpayer Category</label>
                      <select class="elite-select-luxury" formControlName="taxpayerType">
                        <option value="individual">Individual Taxpayer</option>
                        <option value="business">Non-Individual / Business</option>
                      </select>
                    </div>
                    <div class="form-group-luxury">
                      <label>Residency Protocol</label>
                      <select class="elite-select-luxury" formControlName="residentStatus">
                        <option value="resident">Resident of Kenya</option>
                        <option value="non-resident">Non-Resident</option>
                      </select>
                    </div>

                    <div class="form-group-luxury">
                      <label>Official First Name</label>
                      <input type="text" class="elite-input-luxury" formControlName="firstName" placeholder="As per ID/Passport">
                    </div>
                    <div class="form-group-luxury">
                      <label>Surname / Last Name</label>
                      <input type="text" class="elite-input-luxury" formControlName="lastName" placeholder="Legal surname">
                    </div>

                    <div class="form-group-luxury">
                      <label>National ID Number / Passport</label>
                      <input type="text" class="elite-input-luxury" formControlName="idNumber" placeholder="Verification string">
                    </div>
                    <div class="form-group-luxury">
                      <label>Date of Birth</label>
                      <input type="date" class="elite-input-luxury" formControlName="dob">
                    </div>

                    <div class="form-group-luxury full-width">
                      <label>Primary Economic Activity</label>
                      <select class="elite-select-luxury" formControlName="economicActivity">
                        <option value="">Select principal activity...</option>
                        <option value="employment">Employment / Salaried Executive</option>
                        <option value="business">Wholesale / Trade / Retail</option>
                        <option value="professional">Professional Consultant</option>
                        <option value="farming">Agro-Business / Farming</option>
                      </select>
                    </div>
                  </div>

                  <div class="stage-footer mt-48">
                    <div class="support-hint">
                       <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
                       <span>Ensure data matches your ID for automatic validation.</span>
                    </div>
                    <button type="button" class="modern-btn primary-btn" (click)="goToStep(2)" [disabled]="isStep1Invalid()">
                      Proceed to Location
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                  </div>
                </div>

                <!-- Stage 02: Geocoding & Jurisdiction -->
                <div class="form-stage" *ngIf="currentStep === 2">
                  <div class="stage-intro">
                     <h3>Geographical Domicile</h3>
                     <p>Define your principal place of residence or business</p>
                  </div>

                  <div class="form-grid-elite">
                    <div class="form-group-luxury">
                      <label>County of Residence</label>
                      <select class="elite-select-luxury" formControlName="county" (change)="onCountyChange()">
                        <option value="">Select Domain...</option>
                        <option *ngFor="let c of counties" [value]="c.name">{{ c.name }}</option>
                      </select>
                    </div>
                    <div class="form-group-luxury">
                      <label>Major Town / City</label>
                      <input type="text" class="elite-input-luxury" formControlName="town" placeholder="Nairobi, Mombasa, etc">
                    </div>

                    <div class="form-group-luxury">
                      <label>District / Sub-County</label>
                      <input type="text" class="elite-input-luxury" formControlName="subCounty" placeholder="e.g. Dagoretti">
                    </div>
                    <div class="form-group-luxury">
                      <label>Standard Ward</label>
                      <input type="text" class="elite-input-luxury" formControlName="ward" placeholder="e.g. Kilimani">
                    </div>

                    <div class="form-group-luxury">
                      <label>Target KRA Station</label>
                      <select class="elite-select-luxury" formControlName="kraStation">
                        <option value="">Select nearest center...</option>
                        <option value="Nairobi North">Nairobi North</option>
                        <option value="Mombasa Station">Mombasa Station</option>
                        <option value="Kisumu Station">Kisumu Station</option>
                        <option value="Eldoret Station">Eldoret Station</option>
                      </select>
                    </div>
                    <div class="form-group-luxury">
                      <label>Postal Code</label>
                      <input type="text" class="elite-input-luxury" formControlName="postalCode" placeholder="00100">
                    </div>

                    <div class="form-group-luxury full-width">
                      <label>Detailed Physical Address</label>
                      <textarea class="elite-input-luxury" formControlName="address" rows="2" placeholder="Building, Floor, Suite, Street..."></textarea>
                    </div>
                  </div>

                  <div class="stage-footer mt-48">
                    <button type="button" class="modern-btn outline-btn" (click)="goToStep(1)">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      Back
                    </button>
                    <button type="button" class="modern-btn primary-btn" (click)="goToStep(3)" [disabled]="isStep2Invalid()">
                      Security Protocols
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                  </div>
                </div>

                <!-- Stage 03: Safety & Compliance -->
                <div class="form-stage" *ngIf="currentStep === 3">
                  <div class="stage-intro">
                     <h3>Security & Mandates</h3>
                     <p>Finalize your access credentials and tax obligations</p>
                  </div>

                  <div class="form-grid-elite">
                    <div class="form-group-luxury">
                      <label>Primary Secure Email</label>
                      <input type="email" class="elite-input-luxury" formControlName="email" placeholder="name@agency.com">
                    </div>
                    <div class="form-group-luxury">
                      <label>Authorized Mobile</label>
                      <input type="tel" class="elite-input-luxury" formControlName="phone" placeholder="+254 7XX XXX XXX">
                    </div>

                    <div class="form-group-luxury">
                      <label>Access Password</label>
                      <input type="password" class="elite-input-luxury" formControlName="password" placeholder="Entropy-guarded password">
                    </div>
                    <div class="form-group-luxury">
                      <label>Confirm Cipher</label>
                      <input type="password" class="elite-input-luxury" formControlName="confirmPassword" placeholder="Repeat for verification">
                    </div>
                  </div>

                  <div class="compliance-box-luxury mt-32">
                     <h4 class="box-title-elite">Registered Tax Obligations</h4>
                     <div class="ob-list-fancy">
                        <label class="ob-luxury-pill">
                           <input type="checkbox" formControlName="obIncomeTax" [disabled]="true">
                           <div class="pill-content">
                              <span class="p-title">Income Tax - Resident</span>
                              <span class="p-badge">Mandatory</span>
                           </div>
                        </label>
                        <label class="ob-luxury-pill clickable">
                           <input type="checkbox" formControlName="obVAT">
                           <div class="pill-content">
                              <span class="p-title">Value Added Tax (VAT)</span>
                              <span class="p-opt">Optional</span>
                           </div>
                        </label>
                     </div>
                  </div>

                  <div class="agreement-surface mt-32">
                     <label class="agreement-luxury">
                        <input type="checkbox" formControlName="terms">
                        <span class="agreement-text">I solemnly declare that the information registered is exhaustive and compliant with the laws of Kenya.</span>
                     </label>
                  </div>

                  <div class="stage-footer mt-48">
                    <button type="button" class="modern-btn outline-btn" (click)="goToStep(2)">Back</button>
                    <button type="submit" class="modern-btn primary-btn elite-glow" [disabled]="regForm.invalid || isSubmitting()">
                      <span *ngIf="!isSubmitting()">Finalize PIN Generation</span>
                      <span *ngIf="isSubmitting()" class="loader-flex">
                        <div class="mini-spinner"></div>
                        Encrypting & Registering...
                      </span>
                    </button>
                  </div>
                </div>

              </form>
            </div>

            <!-- Footer Meta -->
            <div class="reg-footer-meta mt-48" *ngIf="!showSuccess()">
               <p>Already have an active KRA PIN? <a routerLink="/login" class="login-link-elite">Authenticate Here</a></p>
               <div class="security-seal">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/></svg>
                  <span>AES-256 SSL Encrypted Enrolment Session</span>
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

    .registration-view-scroller {
      position: relative; z-index: 10; height: 100vh; overflow-y: auto; display: flex; align-items: flex-start; justify-content: center; padding: 60px 20px;
    }
    .registration-container { width: 100%; max-width: 1000px; margin: 0 auto; }

    .elite-reg-card-premium {
      background: rgba(255, 255, 255, 0.03);
      -webkit-backdrop-filter: blur(30px); backdrop-filter: blur(30px);
      border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 56px;
      padding: 70px; box-shadow: 0 50px 150px rgba(0,0,0,0.6);
    }

    /* Brand Luxury Header */
    .reg-brand-box { display: flex; align-items: center; gap: 32px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 40px; }
    .logo-wrapper-luxury { background: white; padding: 16px; border-radius: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(255,255,255,0.1); }
    .hub-tag { display: block; color: var(--kra-red); font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 8px; }
    .auth-title-elite { font-size: 3.5rem; font-weight: 900; color: white; margin: 0; letter-spacing: -2.5px; line-height: 1; }

    /* Universal Stepper */
    .elite-stepper { display: flex; align-items: center; justify-content: space-between; position: relative; }
    .step-blob { display: flex; flex-direction: column; align-items: center; gap: 14px; position: relative; z-index: 5; flex: 1; }
    .step-icon { 
      width: 52px; height: 52px; background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.1);
      border-radius: 18px; display: flex; align-items: center; justify-content: center;
      color: rgba(255,255,255,0.4); font-weight: 800; font-size: 1.1rem; transition: 0.4s;
    }
    .step-text { font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 1.5px; }
    
    .step-blob.active .step-icon { border-color: var(--kra-red); background: var(--kra-red); color: white; transform: scale(1.15); box-shadow: 0 0 30px rgba(227, 30, 36, 0.5); }
    .step-blob.active .step-text { color: white; font-weight: 800; }
    .step-blob.done .step-icon { border-color: var(--success); background: var(--success); color: white; }
    .step-blob.done .step-text { color: var(--success); }

    .step-connector { flex: 1; height: 3px; background: rgba(255,255,255,0.1); margin: -35px 0 0 0; border-radius: 4px; z-index: 1; }
    .step-connector.done { background: var(--success); }

    /* Elite Form Grid */
    .form-stage { animation: stageFade 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes stageFade { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    
    .stage-intro { margin-bottom: 40px; }
    .stage-intro h3 { font-size: 1.6rem; font-weight: 800; color: white; margin-bottom: 8px; letter-spacing: -0.5px; }
    .stage-intro p { color: rgba(255,255,255,0.4); font-size: 1rem; }

    .form-grid-elite { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .form-group-luxury { display: flex; flex-direction: column; gap: 12px; }
    .form-group-luxury.full-width { grid-column: span 2; }
    .form-group-luxury label { font-size: 0.8rem; font-weight: 800; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 1px; }

    .elite-input-luxury, .elite-select-luxury {
      width: 100%; padding: 18px 24px; background: rgba(255,255,255,0.04);
      border: 2px solid rgba(255,255,255,0.08); border-radius: 20px;
      color: white; font-size: 1.05rem; font-weight: 600; font-family: inherit;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .elite-input-luxury:focus, .elite-select-luxury:focus { 
      background: rgba(255,255,255,0.06); border-color: var(--kra-red); outline: none;
      box-shadow: 0 0 0 6px rgba(227, 30, 36, 0.15); transform: translateY(-2px);
    }
    .elite-select-luxury option { background: #0a0a0b; color: white; }

    .stage-footer { display: flex; justify-content: space-between; align-items: center; gap: 24px; }
    .support-hint { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.45); font-weight: 600; font-size: 0.9rem; }
    
    /* Compliance & Obligations */
    .compliance-box-luxury { background: rgba(0,0,0,0.25); border-radius: 32px; padding: 32px; border: 1px solid rgba(255,255,255,0.04); }
    .box-title-elite { margin: 0 0 24px 0; font-size: 1.1rem; color: white; font-weight: 800; letter-spacing: -0.2px; }
    .ob-list-fancy { display: flex; gap: 20px; }
    .ob-luxury-pill { background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 20px 24px; flex: 1; display: flex; align-items: center; gap: 16px; transition: 0.3s; }
    .ob-luxury-pill.clickable { cursor: pointer; }
    .ob-luxury-pill:has(input:checked) { border-color: var(--kra-red); background: rgba(227,30,36,0.05); }
    .ob-luxury-pill input { width: 24px; height: 24px; accent-color: var(--kra-red); }
    .pill-content { display: flex; flex-direction: column; gap: 4px; }
    .p-title { font-weight: 700; color: white; }
    .p-badge { font-size: 0.7rem; font-weight: 800; color: var(--kra-red); text-transform: uppercase; }
    .p-opt { font-size: 0.7rem; font-weight: 800; color: rgba(255,255,255,0.3); text-transform: uppercase; }

    .agreement-luxury { display: flex; gap: 16px; cursor: pointer; color: rgba(255,255,255,0.6); font-size: 0.95rem; font-weight: 500; align-items: flex-start; }
    .agreement-luxury input { margin-top: 4px; width: 20px; height: 20px; flex-shrink: 0; accent-color: var(--kra-red); }

    /* Success Luxury Certificate */
    .success-reveal { text-align: center; padding: 40px 0; }
    .cert-header h2 { font-size: 3rem; font-weight: 900; color: white; letter-spacing: -2px; margin-top: 24px; margin-bottom: 8px; }
    .cert-header p { font-size: 1.1rem; color: rgba(255,255,255,0.5); margin-bottom: 48px; }
    .stamp-luxury { width: 120px; height: 120px; background: var(--success); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 0 60px rgba(16,185,129,0.3); border: 8px solid rgba(16,185,129,0.2); }
    
    .pin-display-luxury { background: rgba(255,255,255,0.03); border: 2px dashed rgba(255,255,255,0.1); border-radius: 40px; padding: 50px; position: relative; }
    .p-meta { font-size: 0.85rem; font-weight: 800; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 4px; margin-bottom: 20px; display: block; }
    .p-value { font-family: 'Outfit', sans-serif; font-size: 5rem; font-weight: 900; color: var(--kra-red); letter-spacing: 12px; margin-bottom: 24px; }
    .p-verify { display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 700; color: var(--success); font-size: 0.9rem; }
    .v-dot { width: 8px; height: 8px; background: var(--success); border-radius: 50%; box-shadow: 0 0 10px var(--success); }

    .full-width { width: 100%; }
    .loader-flex { display: flex; align-items: center; justify-content: center; gap: 12px; }
    .mini-spinner { width: 22px; height: 22px; border: 3px solid rgba(255,255,255,0.2); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .reg-footer-meta { text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 40px; }
    .reg-footer-meta p { color: rgba(255,255,255,0.4); font-size: 1rem; font-weight: 600; }
    .login-link-elite { color: white; font-weight: 800; text-decoration: underline; text-underline-offset: 6px; margin-left: 8px; transition: 0.3s; }
    .login-link-elite:hover { color: var(--kra-red); }
    .security-seal { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 24px; font-size: 0.75rem; color: rgba(255,255,255,0.3); font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }

    .mt-12 { margin-top: 12px; }
    .mt-32 { margin-top: 32px; }
    .mt-40 { margin-top: 40px; }
    .mt-48 { margin-top: 48px; }

    @media (max-width: 768px) {
      .registration-view-scroller { padding: 30px 12px; }
      .elite-reg-card-premium { padding: 40px 24px; }
      .form-grid-elite { grid-template-columns: 1fr; }
      .auth-title-elite { font-size: 2.5rem; }
      .reg-brand-box { flex-direction: column; text-align: center; gap: 20px; }
      .p-value { font-size: 3rem; letter-spacing: 6px; }
      .elite-stepper { display: none; }
    }
  `]
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  regForm: FormGroup;
  currentStep = 1;
  isSubmitting = signal(false);
  showSuccess = signal(false);
  generatedPIN = signal('');

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
    const scroller = document.querySelector('.registration-view-scroller');
    if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
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
            const scroller = document.querySelector('.registration-view-scroller');
            if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            alert(response.message || 'Verification Error: ID number already indexed.');
          }
        },
        error: () => {
          this.isSubmitting.set(false);
          alert('Network synchronization error. Primary gateway unresponsive.');
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
