import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-up">
      
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">System <span class="gradient-text">Configuration</span></h1>
          <p class="premium-subtitle">Authorized terminal parameters and security protocol management</p>
        </div>
      </header>

      <div class="settings-grid-luxury mt-32">
        
        <!-- Strategy Sidebar -->
        <div class="settings-nav-sidebar animate-up delay-1">
           <div class="nav-card-luxury">
              <button class="nav-item-elite" [class.active]="activeTab === 'general'" (click)="activeTab = 'general'">
                 <div class="ni-icon"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-width="2.2"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2.2"/></svg></div>
                 <span>General Protocol</span>
              </button>
              <button class="nav-item-elite" [class.active]="activeTab === 'security'" (click)="activeTab = 'security'">
                 <div class="ni-icon"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2.2"/></svg></div>
                 <span>Security & Cipher</span>
              </button>
              <button class="nav-item-elite" [class.active]="activeTab === 'notifications'" (click)="activeTab = 'notifications'">
                 <div class="ni-icon"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-width="2.2"/></svg></div>
                 <span>Broadcasting Strategy</span>
              </button>
           </div>

           <div class="integrity-card mt-32">
              <div class="i-header">Portal Integrity Status</div>
              <div class="i-ver">ENGINE v4.2.5 [STABLE CORE]</div>
              <div class="status-flex-elite">
                 <span class="pulse-dot green"></span>
                 <span>Sovereign Link Active</span>
              </div>
           </div>
        </div>

        <!-- Configuration Main Surface -->
        <div class="settings-content-surface animate-up delay-2">
           
           <!-- General Protocol Section -->
           <div *ngIf="activeTab === 'general'" class="content-card-premium animate-fade">
              <div class="card-p-header">
                 <div class="ch-icon-ring blue">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke-width="2.2"/></svg>
                 </div>
                 <div class="p-title-group">
                    <h3 class="card-p-title">Standard Environmental Parameters</h3>
                    <p class="card-p-subtitle">Localization and terminal display intelligence</p>
                 </div>
              </div>

              <div class="luxury-form-stack p-40">
                 <div class="form-row-elite">
                    <div class="form-item-elite">
                       <label>Authorized System Language</label>
                       <select class="luxury-select-elite">
                          <option>English (Sovereign Dialect)</option>
                          <option>Kiswahili (Official National)</option>
                       </select>
                    </div>
                    <div class="form-item-elite">
                       <label>Fiscal Time Zone Cluster</label>
                       <select class="luxury-select-elite">
                          <option>(GMT+03:00) NAIROBI / EAST AFRICA</option>
                          <option>(GMT+00:00) UTC UNIVERSAL CORE</option>
                       </select>
                    </div>
                 </div>

                 <div class="surface-footer-flush mt-32">
                    <button class="modern-btn primary-btn" (click)="saveGeneral()" [disabled]="isSavingGeneral()">
                       {{ isSavingGeneral() ? 'SYNCHRONIZING...' : 'COMMIT PROTOCOL' }}
                    </button>
                 </div>
              </div>
           </div>

           <!-- Security & Cipher Section -->
           <div *ngIf="activeTab === 'security'" class="content-card-premium animate-fade">
              <div class="card-p-header">
                 <div class="ch-icon-ring red">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2.2"/></svg>
                 </div>
                 <div class="p-title-group">
                    <h3 class="card-p-title">Auth Intelligence Management</h3>
                    <p class="card-p-subtitle">Rotate security ciphers and update gateway access</p>
                 </div>
              </div>

              <div class="luxury-form-stack p-40">
                 <div class="form-item-elite">
                    <label>Current Entry Password</label>
                    <input type="password" class="luxury-input-elite" [(ngModel)]="currentPassword" placeholder="••••••••••••">
                 </div>

                 <div class="form-row-elite">
                    <div class="form-item-elite">
                       <label>New Secret Cipher</label>
                       <input type="password" class="luxury-input-elite" [(ngModel)]="newPassword" placeholder="High entropy recommended">
                    </div>
                    <div class="form-item-elite">
                       <label>Verify Cipher</label>
                       <input type="password" class="luxury-input-elite" [(ngModel)]="confirmPassword" placeholder="Match new sequence">
                    </div>
                 </div>

                 <div class="surface-footer-flush mt-32 text-right">
                    <button class="modern-btn primary-btn" (click)="updatePassword()" [disabled]="isUpdating()">
                       {{ isUpdating() ? 'ENCRYPTING...' : 'ROTATE SECURITY KEY' }}
                    </button>
                 </div>

                 <div class="elite-divider mt-40"><span>Advanced Hardening</span></div>

                 <div class="toggle-card-luxury mt-24">
                    <div class="tc-text">
                       <h4>Sovereign Multi-Factor (MFA)</h4>
                       <p>Mandate biometric or OTP sequence for every terminal synchronization.</p>
                    </div>
                    <label class="switch-luxury">
                       <input type="checkbox" checked>
                       <span class="slider-luxury round"></span>
                    </label>
                 </div>
              </div>
           </div>

           <!-- Broadcasting Strategy Section -->
           <div *ngIf="activeTab === 'notifications'" class="content-card-premium animate-fade">
              <div class="card-p-header">
                 <div class="ch-icon-ring green">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-width="2.2"/></svg>
                 </div>
                 <div class="p-title-group">
                    <h3 class="card-p-title">Compliance Alert Matrix</h3>
                    <p class="card-p-subtitle">Configure automated intelligence dispatch channels</p>
                 </div>
              </div>

              <div class="luxury-check-grid p-40">
                 <label class="check-item-elite">
                    <input type="checkbox" checked>
                    <span class="custom-check-lux"></span>
                    <div class="ci-text-v">
                       <strong>Submission Acknowledgements</strong>
                       <p>Verified certificates via encrypted dispatch upon successful filing.</p>
                    </div>
                 </label>

                 <label class="check-item-elite">
                    <input type="checkbox" checked>
                    <span class="custom-check-lux"></span>
                    <div class="ci-text-v">
                       <strong>Fiscal Settlement Reports</strong>
                       <p>Instant digital confirmation of revenue transmission and PRN genesis.</p>
                    </div>
                 </label>

                 <label class="check-item-elite">
                    <input type="checkbox">
                    <span class="custom-check-lux"></span>
                    <div class="ci-text-v">
                       <strong>Authorized Regulatory Intelligence</strong>
                       <p>Mandatory bulletins regarding Finance Act amendments and statutory notices.</p>
                    </div>
                 </label>

                 <div class="surface-footer-flush mt-40">
                    <button class="modern-btn primary-btn" (click)="saveNotifications()" [disabled]="isSavingNotifications()">
                       {{ isSavingNotifications() ? 'COMMITTING...' : 'SAVE DISPATCH STRATEGY' }}
                    </button>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-grid-luxury { display: grid; grid-template-columns: 320px 1fr; gap: 40px; }
    
    .nav-card-luxury {
      background: white; border-radius: 32px; padding: 15px;
      border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);
    }
    .nav-item-elite {
      width: 100%; display: flex; align-items: center; gap: 16px; padding: 16px 20px;
      border: none; background: transparent; color: #64748b; font-weight: 800;
      border-radius: 18px; cursor: pointer; transition: 0.3s; text-align: left;
    }
    .nav-item-elite:hover { background: #F8FAFC; color: var(--text-main); }
    .nav-item-elite.active { background: var(--kra-gradient); color: white; box-shadow: 0 10px 20px rgba(227, 30, 36, 0.2); }
    .ni-icon { display: flex; align-items: center; justify-content: center; opacity: 0.7; }
    .nav-item-elite.active .ni-icon { opacity: 1; }

    .integrity-card {
      background: #F8FAFC; border-radius: 28px; padding: 24px; border: 1.5px solid #E2E8F0;
    }
    .i-header { font-size: 0.8rem; font-weight: 900; color: #1a202c; text-transform: uppercase; letter-spacing: 1.5px; }
    .i-ver { font-size: 0.75rem; color: #94a3b8; font-weight: 700; margin-top: 6px; }
    .status-flex-elite { display: flex; align-items: center; gap: 10px; margin-top: 16px; font-size: 0.8rem; font-weight: 800; color: #10B981; }
    .pulse-dot { width: 10px; height: 10px; border-radius: 50%; }
    .pulse-dot.green { background: #10B981; box-shadow: 0 0 10px #10B981; animation: dotPulse 2s infinite; }
    @keyframes dotPulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

    .luxury-form-stack { display: flex; flex-direction: column; gap: 32px; }
    .form-item-elite { display: flex; flex-direction: column; gap: 12px; }
    .form-item-elite label { font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; }
    .form-row-elite { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    
    .luxury-input-elite, .luxury-select-elite {
      width: 100%; padding: 18px 24px; background: #F8FAFC; border: 2.5px solid #E2E8F0;
      border-radius: 20px; font-weight: 800; color: #1a202c; font-size: 1.05rem; transition: 0.3s;
    }
    .luxury-input-elite:focus, .luxury-select-elite:focus { border-color: var(--kra-red); outline: none; background: white; box-shadow: 0 0 0 6px rgba(227,30,36,0.1); }

    .surface-footer-flush { border-top: 1.5px solid #F1F5F9; padding-top: 32px; }

    .elite-divider { position: relative; height: 1.5px; background: #E2E8F0; display: flex; align-items: center; justify-content: center; }
    .elite-divider span { background: white; padding: 0 20px; font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; }

    .toggle-card-luxury {
      display: flex; justify-content: space-between; align-items: center;
      padding: 30px; background: #F8FAFC; border-radius: 24px; border: 1.5px solid #E2E8F0;
    }
    .tc-text h4 { font-size: 1.1rem; font-weight: 900; color: #1a202c; margin: 0; }
    .tc-text p { font-size: 0.9rem; color: #64748b; font-weight: 600; margin-top: 4px; }

    .switch-luxury { position: relative; width: 60px; height: 34px; flex-shrink: 0; }
    .switch-luxury input { opacity: 0; width: 0; height: 0; }
    .slider-luxury { position: absolute; inset: 0; background: #CBD5E1; transition: .4s; border-radius: 34px; cursor: pointer; }
    .slider-luxury:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background: white; transition: .4s; border-radius: 50%; }
    input:checked + .slider-luxury { background: #10B981; }
    input:checked + .slider-luxury:before { transform: translateX(26px); }

    .luxury-check-grid { display: flex; flex-direction: column; gap: 24px; }
    .check-item-elite { display: flex; gap: 24px; padding: 24px; border-radius: 20px; cursor: pointer; border: 1.5px solid transparent; transition: 0.3s; }
    .check-item-elite:hover { background: #F8FAFC; border-color: #E2E8F0; }
    .check-item-elite input { display: none; }
    .custom-check-lux { width: 28px; height: 28px; border: 3px solid #E2E8F0; border-radius: 10px; flex-shrink: 0; position: relative; transition: 0.3s; margin-top: 2px; }
    input:checked + .custom-check-lux { background: var(--kra-blue); border-color: var(--kra-blue); }
    input:checked + .custom-check-lux:after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 16px; }
    .ci-text-v strong { font-size: 1.1rem; color: #1a202c; display: block; }
    .ci-text-v p { font-size: 0.95rem; color: #64748b; font-weight: 600; margin-top: 4px; line-height: 1.6; }

    .p-40 { padding: 40px; }
    .mt-40 { margin-top: 40px; }
    .mt-24 { margin-top: 24px; }

    @media (max-width: 1000px) {
       .settings-grid-luxury { grid-template-columns: 1fr; }
       .form-row-elite { grid-template-columns: 1fr; }
    }
  `]
})
export class SettingsComponent {
  private authService = inject(AuthService);
  
  activeTab: 'general' | 'security' | 'notifications' = 'general';
  
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isUpdating = signal(false);
  isSavingGeneral = signal(false);
  isSavingNotifications = signal(false);

  updatePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) return;
    if (this.newPassword !== this.confirmPassword) {
      alert('Strategic Breach: Secret ciphers do not match.');
      return;
    }

    this.isUpdating.set(true);
    this.authService.updatePassword(this.currentPassword, this.newPassword).subscribe({
      next: (response) => {
        this.isUpdating.set(false);
        if (response.success) {
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          alert('Sovereign Access Updated: New secret sequence encrypted successfully.');
        } else {
          alert('Gateway Access Refused: ' + response.message);
        }
      },
      error: () => {
        this.isUpdating.set(false);
        alert('Transmission Failure: Failed to synchronize with sovereign vault.');
      }
    });
  }

  saveGeneral() {
    this.isSavingGeneral.set(true);
    setTimeout(() => {
      this.isSavingGeneral.set(false);
      alert('Environmental Sync: Terminal parameters committed to system core.');
    }, 1500);
  }

  saveNotifications() {
    this.isSavingNotifications.set(true);
    setTimeout(() => {
      this.isSavingNotifications.set(false);
      alert('Strategy Committed: Broadcast matrix updated for this terminal.');
    }, 1500);
  }
}
