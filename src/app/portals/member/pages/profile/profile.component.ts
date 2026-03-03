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
    <div class="dashboard-precision animate-fade-in">
      
      <header class="header-precision">
        <div class="header-titles">
          <h1 class="title-primary">Taxpayer <span class="title-accent">Intelligence</span></h1>
          <p class="subtitle-secondary">Official registration and operation credentials</p>
        </div>
        <div class="header-actions">
           <div class="btn-group-precision">
             <button class="btn-precision btn-secondary-precision btn-sm" (click)="downloadCertificate()">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16h16M4 12h16M4 18h16" stroke-width="2.5"/></svg>
                PIN Certificate
             </button>
             <button class="btn-precision btn-primary-precision btn-sm" (click)="showEditModal.set(true)">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2.5"/></svg>
                Update Registry
             </button>
           </div>
        </div>
      </header>

      <div class="dashboard-content-precision grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- Left Column: Core Identity -->
        <div class="lg:col-span-1 space-y-10">
           <div class="card-precision profile-identity-card animate-slide-up">
              <div class="avatar-system mb-8">
                 <div class="avatar-orb-precision">
                    {{ getInitials(user()?.name) }}
                    <div class="verified-indicator">
                       <svg width="10" height="10" fill="white" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                    </div>
                 </div>
              </div>
              
              <div class="identity-info-precision text-center mb-10">
                 <h2 class="text-2xl font-black text-white leading-tight mb-2">{{ user()?.name }}</h2>
                 <span class="text-[10px] font-black uppercase text-red-base tracking-widest">{{ user()?.type }} Taxpayer</span>
              </div>

              <div class="integrity-meter mb-10">
                 <div class="meter-labels flex justify-between mb-2">
                    <span class="text-[9px] font-black text-white/30 uppercase tracking-widest">Profile Integrity</span>
                    <span class="text-[9px] font-black text-white">{{ complianceProgress() }}%</span>
                 </div>
                 <div class="meter-track bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div class="meter-fill bg-red-base h-full shadow-glow-red transition-all duration-700" [style.width.%]="complianceProgress()"></div>
                 </div>
              </div>

              <div class="ledger-summary-precision pt-8 border-t border-white/5 space-y-6">
                 <div class="ledger-item flex justify-between">
                    <span class="text-[9px] font-black text-white/30 uppercase tracking-widest">KRA PIN</span>
                    <span class="text-[11px] font-black text-white tabular-nums tracking-widest">{{ user()?.taxpayer_id }}</span>
                 </div>
                 <div class="ledger-item flex justify-between">
                    <span class="text-[9px] font-black text-white/30 uppercase tracking-widest">Registered</span>
                    <span class="text-[11px] font-black text-white uppercase">{{ user()?.registrationDate | date:'MMM yyyy' }}</span>
                 </div>
              </div>
           </div>

           <!-- Contact Parameters -->
           <div class="card-precision ops-card-precision">
              <div class="card-header-precision border-b border-white/5 pb-4 mb-6">
                 <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">Communication Interface</h3>
              </div>
              <div class="parameter-stack space-y-6">
                 <div class="parameter-item">
                    <span class="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">Transmission Email</span>
                    <div class="flex items-center gap-3">
                       <span class="text-sm font-bold text-white">{{ user()?.email }}</span>
                       <span class="badge-precision active tabular-nums">VERIFIED</span>
                    </div>
                 </div>
                 <div class="parameter-item">
                    <span class="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">Operational Phone</span>
                    <span class="text-sm font-bold text-white">{{ taxpayer()?.phone || '07XXXXXXXX' }}</span>
                 </div>
                 <div class="parameter-item">
                    <span class="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">Legal Domicile</span>
                    <span class="text-sm font-bold text-white leading-relaxed">{{ taxpayer()?.address || 'Nairobi, Kenya' }}</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Middle/Right Column: Strategic Mandates -->
        <div class="lg:col-span-2 space-y-10">
           <div class="card-precision main-record-card-precision">
              <div class="card-header-precision border-b border-white/5 pb-6 mb-8 flex justify-between items-center">
                 <div>
                    <h3 class="text-lg font-black text-white">Tax Obligations</h3>
                    <p class="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">Legally registered tax mandates</p>
                 </div>
                 <button class="btn-precision btn-secondary-precision btn-xs">Request Amendment</button>
              </div>
              
              <div class="mandate-registry-precision space-y-4">
                 @for (ob of obligations(); track ob.id) {
                    <div class="mandate-tile-precision flex items-center gap-6 p-6 bg-white/2 rounded-2xl border border-white/5 hover:border-red-base/20 transition-all group">
                       <div class="tile-icon-orb bg-white/5 group-hover:bg-red-base/10 text-white/40 group-hover:text-red-base text-xs font-black w-10 h-10 rounded-xl flex items-center justify-center transition-all">
                          {{ ob.obligation_name.substring(0, 2).toUpperCase() }}
                       </div>
                       <div class="flex-1">
                          <h4 class="text-white font-bold">{{ ob.obligation_name }}</h4>
                          <div class="flex gap-4 mt-1">
                             <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">Effective: {{ ob.effective_from }}</span>
                             <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">Cycle: Monthly</span>
                          </div>
                       </div>
                       <div class="mandate-status">
                          <span class="badge-precision active uppercase">Active Sequence</span>
                       </div>
                    </div>
                 } @empty {
                    <div class="null-state-precision py-20 text-center">
                       <p class="text-[10px] font-black text-white/20 uppercase tracking-widest">No primary mandates detected.</p>
                    </div>
                 }
              </div>
           </div>

           <div class="card-precision ops-card-precision">
              <div class="card-header-precision border-b border-white/5 pb-4 mb-8">
                 <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">Credential Integrity</h3>
              </div>
              <div class="integrity-stack-precision space-y-8 relative pl-6 border-l border-white/5 ml-3">
                 <div class="integrity-entry relative">
                    <div class="entry-dot bg-red-base absolute -left-[30px] top-1.5 w-2 h-2 rounded-full shadow-glow-red"></div>
                    <span class="it-title text-sm font-bold text-white block mb-1">Identity Verification</span>
                    <span class="it-desc text-[10px] font-medium text-white/30 uppercase tracking-widest">Authenticated via National Central Registry</span>
                 </div>
                 <div class="integrity-entry relative">
                    <div class="entry-dot bg-red-base absolute -left-[30px] top-1.5 w-2 h-2 rounded-full shadow-glow-red"></div>
                    <span class="it-title text-sm font-bold text-white block mb-1">PIN Authorization</span>
                    <span class="it-desc text-[10px] font-medium text-white/30 uppercase tracking-widest">Cryptographic validation of taxpayer signature</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- Tactical Edit Surface -->
      @if (showEditModal()) {
        <div class="modal-backdrop-precision" (click)="showEditModal.set(false)">
           <div class="modal-panel-precision max-w-lg animate-scale" (click)="$event.stopPropagation()">
              <div class="modal-header-precision">
                 <div class="icon-orb-precision">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2.5"/></svg>
                 </div>
                 <div class="modal-titles">
                    <h3 class="title-primary">Update <span class="title-accent">Registry</span></h3>
                    <p class="subtitle-secondary">Modify operational transmission parameters</p>
                 </div>
                 <button class="modal-close-precision" (click)="showEditModal.set(false)">✕</button>
              </div>

              <div class="modal-body-precision py-10">
                 <div class="form-stack-precision space-y-8">
                    <div class="form-group-precision">
                       <label class="label-precision">Mobile Transmission Line</label>
                       <input type="text" [(ngModel)]="editData.phone" placeholder="+254 XXX XXX XXX" class="input-precision w-full">
                    </div>
                    <div class="form-group-precision">
                       <label class="label-precision">Primary Legal Domicile</label>
                       <textarea rows="3" [(ngModel)]="editData.address" placeholder="Enter full physical address" class="input-precision w-full resize-none pt-4"></textarea>
                    </div>
                 </div>
                 
                 <div class="status-state-precision pending mt-8">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.5"/></svg>
                    <span class="text-[10px] font-black uppercase tracking-widest">Protocol: An OTP will be dispatched to verify changes.</span>
                 </div>
              </div>

              <div class="modal-footer-precision">
                 <button class="btn-precision btn-secondary-precision" (click)="showEditModal.set(false)">Abort</button>
                 <button class="btn-precision btn-primary-precision" (click)="saveProfile()" [disabled]="isSaving()">
                    @if (isSaving()) {
                      <div class="loader-spinner-precision sm"></div>
                    } @else {
                      Execute Update
                    }
                 </button>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .avatar-orb-precision {
      width: 100px; height: 100px; background: var(--black-900); border: 2px solid var(--red-500); border-radius: 32px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 2.2rem; color: #FFFFFF; position: relative;
      box-shadow: var(--shadow-glow-red);
      margin: 0 auto;
    }
    .verified-indicator {
      position: absolute; bottom: -6px; right: -6px; width: 28px; height: 28px;
      background: #10B981; border: 3px solid var(--black-950); border-radius: 10px;
      display: flex; align-items: center; justify-content: center; shadow: var(--shadow-md);
    }
    .meter-fill { box-shadow: 0 0 20px rgba(218, 56, 50, 0.4); }

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
