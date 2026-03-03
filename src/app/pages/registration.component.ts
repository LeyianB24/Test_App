import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Router, RouterModule } from '@angular/router';

import { PinCertificateComponent } from '../portals/member/pages/compliance/pin-certificate.component';

@Component({
  selector: 'app-registration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgOptimizedImage, PinCertificateComponent],
  template: `
    <div class="auth-layout login-scene animate-fade-in">
      <!-- High-Performance Background -->
      <div class="bg-image-container">
        <div class="bg-overlay"></div>
      </div>
      
      <div class="registration-view-scroller">
        <div class="registration-container animate-slide-up">
          <div class="reg-card-precision">
            
            <!-- Strategic Header -->
            <div class="reg-header-precision border-b border-white/5 pb-10 mb-10 flex items-center gap-8">
              <div class="logo-box-precision bg-white p-4 rounded-3xl shadow-glow-white">
                <img ngSrc="assets/logo.png" width="80" height="80" alt="KRA Logo" priority>
              </div>
              <div class="header-titles">
                <span class="text-[10px] font-black uppercase text-red-500 tracking-[0.3em] block mb-2">Central Registry</span>
                <h1 class="text-4xl font-black text-white tracking-tight">Resident <span class="text-red-base">Enrollment</span></h1>
              </div>
            </div>

            <!-- Tactical Step Progress -->
            <div class="stepper-precision mb-16 px-4">
              <div class="step-unit" [class.active]="currentStep === 1" [class.done]="currentStep > 1">
                <div class="step-blob">
                   @if (currentStep > 1) {
                     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                   } @else {
                     01
                   }
                </div>
                <span class="step-label">Identify</span>
              </div>
              <div class="step-line" [class.done]="currentStep > 1"></div>
              <div class="step-unit" [class.active]="currentStep === 2" [class.done]="currentStep > 2">
                <div class="step-blob">
                   @if (currentStep > 2) {
                     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                   } @else {
                     02
                   }
                </div>
                <span class="step-label">Domicile</span>
              </div>
              <div class="step-line" [class.done]="currentStep > 2"></div>
              <div class="step-unit" [class.active]="currentStep === 3" [class.done]="currentStep > 3">
                <div class="step-blob">
                   03
                </div>
                <span class="step-label">Secure</span>
              </div>
            </div>

            <!-- Dynamic Entry Surface -->
            <div class="form-surface-precision">
              
              <!-- Success: Validated Credential -->
              @if (showSuccess()) {
                <div class="success-vault animate-scale">
                  <app-pin-certificate 
                    [pin]="generatedPIN()" 
                    [name]="regForm.get('firstName')?.value + ' ' + regForm.get('lastName')?.value"
                    [email]="regForm.get('email')?.value">
                  </app-pin-certificate>

                  <div class="mt-12 flex justify-center">
                     <button class="btn-precision btn-primary-precision btn-lg w-full max-w-sm" routerLink="/login">
                        Access Taxpayer Dashboard
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="ml-2"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                     </button>
                  </div>
                </div>
              } @else {
                <!-- Form Interaction -->
                <form [formGroup]="regForm" (ngSubmit)="onSubmit()" class="form-stack-precision">
                  
                  <!-- Sequence 01: Identity parameters -->
                  @if (currentStep === 1) {
                    <div class="sequence-fade">
                      <div class="sequence-header mb-8">
                         <h3 class="text-xl font-black text-white">Identity Parameters</h3>
                         <p class="text-sm font-medium text-white/30 uppercase tracking-widest mt-1">Foundational taxpayer attributes</p>
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-stagger">
                        <div class="form-group-precision">
                          <label class="label-precision">Taxpayer Category</label>
                          <select class="input-precision w-full" formControlName="taxpayerType">
                            <option value="individual">Individual Entity</option>
                            <option value="business">Non-Individual / Corporate</option>
                          </select>
                        </div>
                        <div class="form-group-precision">
                          <label class="label-precision">Residency Status</label>
                          <select class="input-precision w-full" formControlName="residentStatus">
                            <option value="resident">Resident of Kenya</option>
                            <option value="non-resident">Non-Resident Entity</option>
                          </select>
                        </div>

                        <div class="form-group-precision">
                          <label class="label-precision">First Name</label>
                          <input type="text" class="input-precision w-full" formControlName="firstName" placeholder="Legal Forename">
                        </div>
                        <div class="form-group-precision">
                          <label class="label-precision">Surname</label>
                          <input type="text" class="input-precision w-full" formControlName="lastName" placeholder="Legal Surname">
                        </div>

                        <div class="form-group-precision">
                          <label class="label-precision">National Identifier (ID/Passport)</label>
                          <input type="text" class="input-precision w-full" formControlName="idNumber" placeholder="Registry Number">
                        </div>
                        <div class="form-group-precision">
                          <label class="label-precision">Date of Birth</label>
                          <input type="date" class="input-precision w-full" formControlName="dob">
                        </div>

                        <div class="form-group-precision md:col-span-2">
                          <label class="label-precision">Principal Economic Activity</label>
                          <select class="input-precision w-full" formControlName="economicActivity">
                            <option value="">Select activity classification...</option>
                            <option value="employment">Employment Services</option>
                            <option value="business">General Trade / Retail</option>
                            <option value="professional">Specialized Professional</option>
                            <option value="farming">Agro-Industrial</option>
                          </select>
                        </div>
                      </div>

                      <div class="sequence-footer mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div class="status-state-precision pending">
                           <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/></svg>
                           <span class="text-[10px] font-black uppercase tracking-widest">Protocol: Ensure alignment with legal ID registry.</span>
                        </div>
                        <button type="button" class="btn-precision btn-primary-precision btn-lg w-full md:w-auto" (click)="goToStep(2)" [disabled]="isStep1Invalid()">
                          Advanced Sequence
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="ml-2"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                      </div>
                    </div>
                  }

                  <!-- Sequence 02: Domicile & Location -->
                  @if (currentStep === 2) {
                    <div class="sequence-fade">
                      <div class="sequence-header mb-8">
                         <h3 class="text-xl font-black text-white">Domicile Registry</h3>
                         <p class="text-sm font-medium text-white/30 uppercase tracking-widest mt-1">Geographical and jurisdictional parameters</p>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-stagger">
                        <div class="form-group-precision">
                          <label class="label-precision">County of Domicile</label>
                          <select class="input-precision w-full" formControlName="county" (change)="onCountyChange()">
                            <option value="">Select County...</option>
                            @for (c of counties; track c.code) {
                              <option [value]="c.name">{{ c.name }}</option>
                            }
                          </select>
                        </div>
                        <div class="form-group-precision">
                          <label class="label-precision">Major Town / City</label>
                          <input type="text" class="input-precision w-full" formControlName="town" placeholder="Nairobi, etc.">
                        </div>

                        <div class="form-group-precision">
                          <label class="label-precision">Sub-County / District</label>
                          <input type="text" class="input-precision w-full" formControlName="subCounty" placeholder="Registry District">
                        </div>
                        <div class="form-group-precision">
                          <label class="label-precision">Administrative Ward</label>
                          <input type="text" class="input-precision w-full" formControlName="ward" placeholder="Ward Identity">
                        </div>

                        <div class="form-group-precision">
                          <label class="label-precision">Tactical Station Assignment</label>
                          <select class="input-precision w-full" formControlName="kraStation">
                            <option value="">Select nearest center...</option>
                            <option value="Nairobi North">Nairobi North Station</option>
                            <option value="Mombasa Station">Mombasa Operational Hub</option>
                            <option value="Kisumu Station">Kisumu Regional Station</option>
                            <option value="Eldoret Station">Eldoret Regional Hub</option>
                          </select>
                        </div>
                        <div class="form-group-precision">
                          <label class="label-precision">Postal Sequence Code</label>
                          <input type="text" class="input-precision w-full" formControlName="postalCode" placeholder="00100">
                        </div>

                        <div class="form-group-precision md:col-span-2">
                          <label class="label-precision">Surgical Physical Address</label>
                          <textarea class="input-precision w-full pt-4 min-h-[100px] resize-none" formControlName="address" placeholder="Building, Floor, Suite, Street Identity..."></textarea>
                        </div>
                      </div>

                      <div class="sequence-footer mt-12 pt-8 border-t border-white/5 flex justify-between gap-6">
                        <button type="button" class="btn-precision btn-secondary-precision btn-lg flex-1" (click)="goToStep(1)">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                          Return
                        </button>
                        <button type="button" class="btn-precision btn-primary-precision btn-lg flex-1" (click)="goToStep(3)" [disabled]="isStep2Invalid()">
                          Finalize Sequence
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="ml-2"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                      </div>
                    </div>
                  }

                  <!-- Sequence 03: Security & Mandates -->
                  @if (currentStep === 3) {
                    <div class="sequence-fade">
                      <div class="sequence-header mb-8">
                         <h3 class="text-xl font-black text-white">Security & Mandate Registry</h3>
                         <p class="text-sm font-medium text-white/30 uppercase tracking-widest mt-1">Access protocols and legal obligations</p>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-stagger">
                        <div class="form-group-precision">
                          <label class="label-precision">Operational Email</label>
                          <input type="email" class="input-precision w-full" formControlName="email" placeholder="name@domain.com">
                        </div>
                        <div class="form-group-precision">
                          <label class="label-precision">Primary Contact Line</label>
                          <input type="tel" class="input-precision w-full" formControlName="phone" placeholder="+254 7XX XXX XXX">
                        </div>

                        <div class="form-group-precision">
                          <label class="label-precision">Encryption Password</label>
                          <input type="password" class="input-precision w-full" formControlName="password" placeholder="Min 6 characters">
                        </div>
                        <div class="form-group-precision">
                          <label class="label-precision">Confirm Protocol</label>
                          <input type="password" class="input-precision w-full" formControlName="confirmPassword" placeholder="Match encryption key">
                        </div>
                      </div>

                      <div class="card-precision ops-card-precision mt-10 p-8 border border-white/5 animate-stagger">
                         <h4 class="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-6">Registered Tax Mandates</h4>
                         <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-stagger">
                            <label class="mandate-toggle-precision group" [class.checked]="regForm.get('obIncomeTax')?.value">
                               <input type="checkbox" formControlName="obIncomeTax" [disabled]="true" class="hidden">
                               <div class="content flex items-center justify-between">
                                  <div>
                                     <span class="text-sm font-bold text-white block">Income Tax - Resident</span>
                                     <span class="text-[9px] font-black text-red-500 uppercase tracking-widest">Mandatory Sequence</span>
                                  </div>
                                  <div class="check-box bg-red-base/20 border border-red-base flex items-center justify-center w-6 h-6 rounded-lg text-red-base">
                                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                  </div>
                               </div>
                            </label>
                            
                            <label class="mandate-toggle-precision group cursor-pointer" [class.checked]="regForm.get('obVAT')?.value">
                               <input type="checkbox" formControlName="obVAT" class="hidden">
                               <div class="content flex items-center justify-between">
                                  <div>
                                     <span class="text-sm font-bold text-white block">Value Added Tax (VAT)</span>
                                     <span class="text-[9px] font-black text-white/30 uppercase tracking-widest">Optional Stream</span>
                                  </div>
                                  <div class="check-box border border-white/10 group-hover:border-red-base/50 flex items-center justify-center w-6 h-6 rounded-lg text-transparent group-hover:text-red-base/30 transition-all" [class.!text-red-base]="regForm.get('obVAT')?.value" [class.!border-red-base]="regForm.get('obVAT')?.value" [class.!bg-red-base/10]="regForm.get('obVAT')?.value">
                                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                  </div>
                               </div>
                            </label>
                         </div>
                      </div>

                      <div class="agreement-strip mt-10 p-6 bg-white/2 rounded-2xl border border-white/5">
                         <label class="flex items-start gap-4 cursor-pointer group">
                            <input type="checkbox" formControlName="terms" class="mt-1 w-5 h-5 accent-red-base">
                            <span class="text-xs font-semibold text-white/50 group-hover:text-white/80 transition-colors leading-relaxed">
                               DECLARATION: I formally certify that all informational parameters submitted are accurate and legally binding under the Tax Administration Act.
                            </span>
                         </label>
                      </div>

                      <div class="sequence-footer mt-12 pt-8 border-t border-white/5 flex justify-between gap-6">
                        <button type="button" class="btn-precision btn-secondary-precision btn-lg flex-1" (click)="goToStep(2)">Return</button>
                        <button type="submit" class="btn-precision btn-primary-precision btn-lg flex-1 shadow-glow-red" [disabled]="regForm.invalid || isSubmitting()">
                          @if (!isSubmitting()) {
                             <span>Initialize Registration</span>
                          } @else {
                             <div class="flex items-center gap-3">
                                <div class="loader-spinner-precision sm"></div>
                                <span>Registering...</span>
                             </div>
                          }
                        </button>
                      </div>
                    </div>
                  }

                </form>
              }
            </div>

            <!-- Footer Authenticity Seal -->
            @if (!showSuccess()) {
              <div class="auth-footer-precision mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                 <p class="text-sm font-bold text-white/40">Already hold an active KRA PIN? <a routerLink="/login" class="text-white hover:text-red-base transition-colors underline underline-offset-4 decoration-red-base/30">Authorize Login</a></p>
                 <div class="security-seal-precision flex items-center gap-3 py-2 px-6 bg-white/5 rounded-full border border-white/10">
                    <svg width="14" height="14" fill="currentColor" class="text-red-base" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/></svg>
                    <span class="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Secure Cryptographic Enrollment</span>
                 </div>
              </div>
            }

          </div>
        </div>
      </div>
    </div>

  `,
  styles: [``],
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
