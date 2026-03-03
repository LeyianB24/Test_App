import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardDataService } from '../../../../services/dashboard-data.service';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-up">
      
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Taxpayer <span class="gradient-text">Profile</span></h1>
          <p class="premium-subtitle">Your official taxpayer information</p>
        </div>
        <div class="header-actions">
           <button class="modern-btn outline-btn sm" (click)="downloadCertificate()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16h16M4 12h16M4 18h16" stroke-width="2.5"/></svg>
              PIN Certificate
           </button>
           <button class="modern-btn primary-btn" (click)="showEditModal.set(true)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="3"/></svg>
              Update Details
           </button>
        </div>
      </header>

      <div class="profile-grid-luxury">
        
        <!-- Left Column: Identity Core -->
        <div class="profile-core-hub">
           <div class="id-card-luxury animate-up delay-1">
              <div class="id-inner-glass">
                 <div class="id-header-v">
                    <div class="id-avatar-box">
                       {{ getInitials(user()?.name) }}
                       <div class="id-badge-verified">
                          <svg width="12" height="12" fill="white" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                       </div>
                    </div>
                    <div class="id-title-v">
                       <h2 class="id-name-elite">{{ user()?.name }}</h2>
                       <span class="id-type-tag">{{ user()?.type }} Taxpayer</span>
                    </div>
                 </div>

                 <div class="compliance-pulse-v mt-32">
                    <div class="p-labels">
                       <span class="p-tag">PROFILE COMPLETION</span>
                       <span class="p-val">{{ complianceProgress() }}%</span>
                    </div>
                    <div class="p-track-lux">
                       <div class="p-fill-lux" [style.width.%]="complianceProgress()"></div>
                    </div>
                    <p class="p-hint-v">{{ complianceProgress() === 100 ? 'Profile is fully updated' : 'Update your address to reach 100%' }}</p>
                 </div>

                 <div class="id-footer-v mt-40">
                    <div class="id-stat-unit">
                       <span class="isu-label">KRA PIN</span>
                       <span class="isu-val mono">{{ user()?.taxpayer_id }}</span>
                    </div>
                    <div class="isu-divider"></div>
                    <div class="id-stat-unit">
                       <span class="isu-label">REGISTRATION DATE</span>
                       <span class="isu-val">{{ user()?.registrationDate | date:'MMM yyyy' }}</span>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Connectivity & Domicile -->
           <div class="content-card-premium mt-32 animate-up delay-2">
              <div class="card-p-header">
                 <div class="ch-icon-ring green">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-width="2.2"/></svg>
                 </div>
                 <div class="p-title-group">
                    <h3 class="card-p-title">Contact Information</h3>
                    <p class="card-p-subtitle">Your verified contact details</p>
                 </div>
              </div>
              <div class="luxury-info-stack p-32">
                 <div class="li-item">
                    <span class="li-label">Email Address</span>
                    <div class="li-val-row">
                       <span class="li-val">{{ user()?.email }}</span>
                       <span class="verify-status">VERIFIED</span>
                    </div>
                 </div>
                 <div class="li-item">
                    <span class="li-label">Phone Number</span>
                    <span class="li-val">{{ taxpayer()?.phone || '07XXXXXXXX' }}</span>
                 </div>
                 <div class="li-item full">
                    <span class="li-label">Physical Address</span>
                    <span class="li-val">{{ taxpayer()?.address || 'Nairobi, Kenya' }}</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Right Column: Legal Mandates -->
        <div class="profile-mandate-hub">
           <div class="content-card-premium animate-up delay-2">
              <div class="card-p-header">
                 <div class="ch-icon-ring blue">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2.2"/></svg>
                 </div>
                 <div class="p-title-group">
                    <h3 class="card-p-title">Tax Obligations</h3>
                    <p class="card-p-subtitle">Your registered tax obligations</p>
                 </div>
              </div>
              <div class="luxury-mandate-list p-32">
                 @for (ob of obligations(); track ob.id) {
                   <div class="mandate-item-elite">
                      <div class="m-icon-box">
                         {{ ob.obligation_name.substring(0, 2).toUpperCase() }}
                      </div>
                      <div class="m-content">
                         <h4 class="m-title">{{ ob.obligation_name }}</h4>
                         <div class="m-meta-stack">
                            <span>Genesis: {{ ob.effective_from }}</span>
                            <span class="m-sep">|</span>
                            <span>Cycle: Monthly</span>
                         </div>
                      </div>
                      <div class="m-status-wrap">
                         <div class="status-pill-elite synced">
                            <span class="dot"></span> ACTIVE
                         </div>
                      </div>
                   </div>
                 } @empty {
                   <div class="empty-placeholder" style="padding: 40px 0;">
                      <p>No active obligations found.</p>
                   </div>
                 }
              </div>
           </div>

           <div class="content-card-premium mt-32 animate-up delay-3">
              <div class="card-p-header">
                 <div class="p-title-group">
                    <h3 class="card-p-title">Account Verification</h3>
                    <p class="card-p-subtitle">Verification status</p>
                 </div>
              </div>
              <div class="integrity-timeline p-32">
                 <div class="it-unit">
                    <div class="it-dot active"></div>
                    <div class="it-text">
                       <span class="it-title">ID Verification</span>
                       <span class="it-desc">Verification complete via national ID registry</span>
                    </div>
                 </div>
                 <div class="it-unit">
                    <div class="it-dot active"></div>
                    <div class="it-text">
                       <span class="it-title">PIN Verification</span>
                       <span class="it-desc">Verified as authorized for this PIN</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      <!-- Elite Edit Overlay -->
      <div class="dialog-overlay-elite animate-fade" *ngIf="showEditModal()" (click)="showEditModal.set(false)">
         <div class="elite-dialog-card animate-scale" (click)="$event.stopPropagation()">
            <div class="dialog-header-luxury">
               <div class="header-icon-ring">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="3"/></svg>
               </div>
               <div class="header-text-v">
                  <h3>Update Details</h3>
                  <p>Update your contact information and address</p>
               </div>
               <button class="close-luxury-circular" (click)="showEditModal.set(false)">✕</button>
            </div>

            <div class="dialog-content-luxury">
               <div class="luxury-form-stack">
                  <div class="form-item-elite">
                     <label>Mobile Number</label>
                     <input type="text" [(ngModel)]="editData.phone" placeholder="+254 XXX XXX XXX" class="luxury-input-elite">
                  </div>
                  <div class="form-item-elite">
                     <label>Physical Address</label>
                     <textarea rows="3" [(ngModel)]="editData.address" placeholder="Enter full address" class="luxury-input-elite"></textarea>
                  </div>
               </div>
               
               <div class="policy-notice-luxury">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/></svg>
                  <span>A verification code will be sent to your registered address.</span>
               </div>
            </div>

            <div class="dialog-footer-luxury">
               <button class="modern-btn outline-btn sm" (click)="showEditModal.set(false)">Cancel</button>
               <button class="modern-btn primary-btn" (click)="saveProfile()" [disabled]="isSaving()">
                  {{ isSaving() ? 'SAVING...' : 'SAVE CHANGES' }}
               </button>
            </div>
         </div>
      </div>

    </div>
  `,
  styles: [`
    .profile-grid-luxury { display: grid; grid-template-columns: 1fr 450px; gap: 40px; }
    
    .id-card-luxury {
      background: var(--kra-gradient); border-radius: 40px; padding: 1px;
      box-shadow: 0 30px 60px rgba(227, 30, 36, 0.15);
    }
    .id-inner-glass {
      background: rgba(10, 34, 61, 0.4); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border-radius: 39px; padding: 40px; color: white;
    }
    .id-header-v { display: flex; align-items: center; gap: 32px; }
    .id-avatar-box {
      width: 100px; height: 100px; background: white; border-radius: 32px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 2.2rem; color: var(--kra-red); position: relative;
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    }
    .id-badge-verified {
      position: absolute; bottom: -8px; right: -8px; width: 32px; height: 32px;
      background: #10B981; border: 4px solid #1a223d; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(16,185,129,0.3);
    }
    .id-name-elite { font-size: 2.2rem; font-weight: 900; margin: 0; letter-spacing: -1.5px; }
    .id-type-tag { font-size: 0.85rem; font-weight: 800; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; }

    .compliance-pulse-v .p-labels { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
    .p-tag { font-size: 0.75rem; font-weight: 900; color: rgba(255,255,255,0.5); letter-spacing: 1px; }
    .p-val { font-size: 1.1rem; font-weight: 900; }
    .p-track-lux { height: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; overflow: hidden; }
    .p-fill-lux { height: 100%; background: white; box-shadow: 0 0 15px rgba(255,255,255,0.5); border-radius: 5px; }
    .p-hint-v { font-size: 0.8rem; color: rgba(255,255,255,0.5); font-weight: 600; margin-top: 10px; }

    .id-footer-v { display: flex; gap: 50px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); }
    .isu-label { font-size: 0.7rem; font-weight: 900; color: rgba(255,255,255,0.4); display: block; margin-bottom: 4px; letter-spacing: 1px; }
    .isu-val { font-size: 1.15rem; font-weight: 800; }
    .isu-val.mono { font-family: 'Courier New', monospace; letter-spacing: 1px; color: #60A5FA; }
    .isu-divider { width: 1px; background: rgba(255,255,255,0.1); }

    .luxury-info-stack { display: flex; flex-direction: column; gap: 32px; }
    .li-item { display: flex; flex-direction: column; gap: 8px; }
    .li-label { font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; }
    .li-val { font-size: 1.1rem; font-weight: 800; color: #1a202c; }
    .li-val-row { display: flex; align-items: center; gap: 16px; }
    .verify-status { font-size: 0.65rem; font-weight: 900; color: #10B981; background: #ECFDF5; padding: 4px 10px; border-radius: 8px; }

    .luxury-mandate-list { display: flex; flex-direction: column; gap: 16px; }
    .mandate-item-elite {
      display: flex; align-items: center; gap: 20px; padding: 24px; background: #F8FAFC;
      border-radius: 24px; border: 1.5px solid #E2E8F0; transition: 0.3s;
    }
    .mandate-item-elite:hover { transform: translateX(10px); background: white; border-color: var(--kra-red); }
    .m-icon-box { width: 44px; height: 44px; background: white; border: 2px solid #E2E8F0; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: var(--kra-blue); }
    .m-title { font-size: 1rem; font-weight: 900; color: #1a202c; margin: 0; }
    .m-meta-stack { font-size: 0.8rem; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 10px; margin-top: 4px; }
    .m-sep { color: #CBD5E1; }

    .integrity-timeline { display: flex; flex-direction: column; gap: 32px; }
    .it-unit { display: flex; gap: 20px; align-items: flex-start; }
    .it-dot { width: 14px; height: 14px; border-radius: 50%; background: #E2E8F0; margin-top: 6px; flex-shrink: 0; }
    .it-dot.active { background: #10B981; box-shadow: 0 0 10px rgba(16,185,129,0.4); border: 3px solid white; outline: 1px solid #10B981; }
    .it-title { font-weight: 800; font-size: 1rem; color: #1a202c; display: block; }
    .it-desc { font-size: 0.85rem; color: #64748b; font-weight: 600; margin-top: 2px; display: block; }

    /* Dialog/Overlay Extras */
    .dialog-overlay-elite { position: fixed; inset: 0; background: rgba(10, 10, 11, 0.5); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .elite-dialog-card { background: white; width: 100%; max-width: 600px; border-radius: 40px; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.3); border-top: 6px solid var(--kra-red); }
    .dialog-header-luxury { padding: 40px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; display: flex; align-items: center; gap: 24px; position: relative; }
    .header-icon-ring { width: 56px; height: 56px; background: var(--kra-red); border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(227, 30, 36, 0.2); }
    .header-text-v h3 { font-size: 1.4rem; font-weight: 900; color: #1a202c; margin: 0; letter-spacing: -0.5px; }
    .header-text-v p { font-size: 0.9rem; color: #64748b; font-weight: 600; margin-top: 4px; }
    .close-luxury-circular { position: absolute; top: 30px; right: 30px; width: 44px; height: 44px; border-radius: 50%; border: none; background: #F1F5F9; color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
    .close-luxury-circular:hover { background: #fee2e2; color: #ef4444; }

    .dialog-content-luxury { padding: 40px; }
    .luxury-form-stack { display: flex; flex-direction: column; gap: 32px; }
    .form-item-elite { display: flex; flex-direction: column; gap: 12px; }
    .form-item-elite label { font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; }
    
    .luxury-input-elite { width: 100%; padding: 18px 24px; background: #F8FAFC; border: 2.5px solid #E2E8F0; border-radius: 20px; font-weight: 800; color: #1a202c; font-size: 1.05rem; transition: 0.3s; font-family: inherit; }
    .luxury-input-elite:focus { border-color: var(--kra-red); outline: none; background: white; box-shadow: 0 0 0 6px rgba(227,30,36,0.1); }
    
    .policy-notice-luxury { margin-top: 40px; padding: 20px; background: #E0F2FE; border-radius: 18px; border: 1.5px solid #BAE6FD; display: flex; align-items: center; gap: 16px; color: #0369A1; font-weight: 700; font-size: 0.9rem; }
    .dialog-footer-luxury { padding: 32px 40px; background: #F8FAFC; border-top: 1px solid #E2E8F0; display: flex; justify-content: flex-end; gap: 20px; }

    .p-32 { padding: 32px; }

    @media (max-width: 1200px) {
       .profile-grid-luxury { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
       .id-header-v { flex-direction: column; text-align: center; gap: 20px; }
       .id-footer-v { flex-direction: column; gap: 20px; text-align: center; }
       .isu-divider { display: none; }
       .id-name-elite { font-size: 1.8rem; }
       .p-val { font-size: 1rem; }
       .luxury-info-stack { padding: 20px; gap: 24px; }
       .li-val { font-size: 1rem; }
       .luxury-mandate-list { padding: 20px; }
       .mandate-item-elite { padding: 16px; gap: 12px; }
       .m-icon-box { width: 36px; height: 36px; font-size: 0.8rem; }
       .m-title { font-size: 0.9rem; }
    }
  `]
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private dashboardData = inject(DashboardDataService);

  user = this.authService.currentUser;
  taxpayer = this.dashboardData.taxpayerProfile;
  obligations = this.dashboardData.obligations;

  showEditModal = signal(false);
  isSaving = signal(false);
  complianceProgress = signal(100);

  editData = {
    phone: this.taxpayer()?.phone || '0700123456',
    address: this.taxpayer()?.address || 'Nairobi, Kenya'
  };

  saveProfile() {
    this.isSaving.set(true);
    setTimeout(() => {
      this.isSaving.set(false);
      this.showEditModal.set(false);
      alert('Success: Profile details updated successfully.');
    }, 1500);
  }

  downloadCertificate() {
    alert('Downloading PIN Certificate...');
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'TP';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}
