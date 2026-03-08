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
    <div class="content-area animate-stagger">
      
      <!-- HD Page Header -->
      <header class="mb-12">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 class="premium-title">Taxpayer <span class="text-[var(--color-accent)]">Intelligence</span></h1>
            <p class="premium-subtitle">Official registration and operation credentials</p>
          </div>
          <div class="flex items-center gap-4">
            <button class="btn-precision btn-secondary-precision" (click)="downloadCertificate()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16h16M4 12h16M4 18h16"/></svg>
              PIN Certificate
            </button>
            <button class="btn-precision btn-primary-precision" (click)="showEditModal.set(true)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Update Registry
            </button>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- Left Column: Core Identity -->
        <div class="lg:col-span-1 space-y-10">
           <div class="glass-panel text-center animate-stagger-item">
              <div class="mb-8 relative inline-block">
                 <div class="w-32 h-32 bg-surface-3 p-1 rounded-[40px] border-2 border-[var(--color-accent)]/30 overflow-hidden flex items-center justify-center">
                    <div class="w-full h-full bg-surface-2 rounded-[36px] flex items-center justify-center font-black text-4xl text-primary">
                       {{ getInitials(user()?.name) }}
                    </div>
                 </div>
                 <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--color-success)] border-4 border-[var(--bg-card)] rounded-2xl flex items-center justify-center shadow-lg">
                    <svg width="18" height="18" fill="white" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                 </div>
              </div>
              
              <div class="mb-10">
                 <h2 class="text-3xl font-black text-primary leading-tight mb-2">{{ user()?.name }}</h2>
                 <span class="text-[10px] font-black uppercase text-[var(--color-accent)] tracking-widest">{{ user()?.type }} Taxpayer</span>
              </div>

              <div class="mb-10 text-left">
                 <div class="flex justify-between mb-3 items-end">
                    <span class="text-[10px] font-black text-muted uppercase tracking-widest">Profile Integrity</span>
                    <span class="text-xs font-black text-primary">{{ complianceProgress() }}%</span>
                 </div>
                 <div class="h-2 bg-surface-3 rounded-full overflow-hidden border border-subtle">
                    <div class="bg-[var(--color-accent)] h-full transition-all duration-1000 ease-out" [style.width.%]="complianceProgress()"></div>
                 </div>
              </div>

              <div class="pt-10 border-t border-subtle space-y-6 text-left">
                 <div class="flex justify-between items-center">
                    <span class="text-[10px] font-black text-muted uppercase tracking-widest">KRA PIN</span>
                    <span class="text-sm font-black text-primary font-mono tracking-widest">{{ user()?.taxpayer_id }}</span>
                 </div>
                 <div class="flex justify-between items-center">
                    <span class="text-[10px] font-black text-muted uppercase tracking-widest">Registered</span>
                    <span class="text-sm font-black text-primary uppercase">{{ user()?.registrationDate | date:'MMM yyyy' }}</span>
                 </div>
              </div>
           </div>

           <!-- Communication Interface -->
           <div class="glass-panel animate-stagger-item">
              <div class="mb-10 pb-6 border-b border-subtle">
                 <h3 class="text-xs font-black uppercase tracking-widest text-primary">Communication Interface</h3>
              </div>
              <div class="space-y-8">
                 <div class="parameter-item">
                    <span class="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Transmission Email</span>
                    <div class="flex items-center gap-3">
                       <span class="text-sm font-bold text-primary">{{ user()?.email }}</span>
                       <span class="status-pill-precision online !px-3 !py-1 text-[8px]">VERIFIED</span>
                    </div>
                 </div>
                 <div class="parameter-item">
                    <span class="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Operational Phone</span>
                    <span class="text-sm font-bold text-primary">{{ taxpayer()?.phone || '07XXXXXXXX' }}</span>
                 </div>
                 <div class="parameter-item">
                    <span class="text-[10px] font-black text-muted uppercase tracking-widest block mb-2">Legal Domicile</span>
                    <span class="text-sm font-bold text-primary leading-relaxed">{{ taxpayer()?.address || 'Nairobi, Kenya' }}</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Middle/Right Column: Strategic Mandates -->
        <div class="lg:col-span-2 space-y-10">
           <div class="glass-panel !p-0 overflow-hidden animate-stagger-item">
              <div class="p-10 border-b border-subtle bg-surface-2/50 flex justify-between items-center">
                 <div>
                    <h3 class="text-xl font-black text-primary uppercase tracking-widest">Tax Obligations</h3>
                    <p class="premium-subtitle">Legally registered tax mandates</p>
                 </div>
                 <button class="btn-precision btn-secondary-precision !py-2">Request Amendment</button>
              </div>
              
              <div class="p-10 space-y-4">
                 @for (ob of obligations(); track ob.id) {
                    <div class="flex items-center gap-8 p-8 bg-surface-2 rounded-[24px] border border-subtle hover:border-[var(--color-accent)]/30 transition-all group">
                       <div class="w-14 h-14 bg-surface-3 rounded-2xl flex items-center justify-center font-black text-primary group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all shadow-sm">
                          {{ ob.obligation_name.substring(0, 2).toUpperCase() }}
                       </div>
                       <div class="flex-1">
                          <h4 class="text-lg font-black text-primary">{{ ob.obligation_name }}</h4>
                          <div class="flex gap-6 mt-2">
                             <div class="flex items-center gap-2">
                                <span class="text-[10px] font-black text-muted uppercase tracking-widest">Effective</span>
                                <span class="text-[10px] font-black text-primary">{{ ob.effective_from }}</span>
                             </div>
                             <div class="flex items-center gap-2">
                                <span class="text-[10px] font-black text-muted uppercase tracking-widest">Cycle</span>
                                <span class="text-[10px] font-black text-primary">MONTHLY</span>
                             </div>
                          </div>
                       </div>
                       <div class="status-pill-precision online !px-5">
                          <span class="status-pill-dot"></span>
                          ACTIVE SEQUENCE
                       </div>
                    </div>
                 } @empty {
                    <div class="py-24 text-center">
                       <div class="text-4xl mb-6 opacity-20">NULL</div>
                       <p class="premium-subtitle">No primary mandates detected in the registry.</p>
                    </div>
                 }
              </div>
           </div>

           <div class="glass-panel animate-stagger-item">
              <div class="mb-10 pb-6 border-b border-subtle">
                 <h3 class="text-xs font-black uppercase tracking-widest text-primary">Credential Integrity</h3>
              </div>
              <div class="space-y-10 relative pl-10 border-l-2 border-surface-3 ml-4">
                 <div class="relative">
                    <div class="absolute -left-[51px] top-1 w-5 h-5 bg-[var(--color-accent)] rounded-full border-4 border-[var(--bg-card)] shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.3)]"></div>
                    <span class="text-sm font-black text-primary block mb-1">Identity Verification</span>
                    <span class="text-[10px] font-black text-muted uppercase tracking-widest">Authenticated via National Central Registry</span>
                 </div>
                 <div class="relative">
                    <div class="absolute -left-[51px] top-1 w-5 h-5 bg-[var(--color-accent)] rounded-full border-4 border-[var(--bg-card)] shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.3)]"></div>
                    <span class="text-sm font-black text-primary block mb-1">PIN Authorization</span>
                    <span class="text-[10px] font-black text-muted uppercase tracking-widest">Cryptographic validation of taxpayer signature</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- HD Tactical Edit Surface -->
      @if (showEditModal()) {
        <div class="dialog-overlay-elite animate-fade-in" (click)="showEditModal.set(false)">
           <div class="glass-panel !p-0 !max-w-xl w-full animate-scale-in" (click)="$event.stopPropagation()">
              <div class="p-10 border-b border-subtle bg-surface-2/50 flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-black text-primary uppercase tracking-widest">Update <span class="text-[var(--color-accent)]">Registry</span></h3>
                  <p class="premium-subtitle">Modify operational transmission parameters</p>
                </div>
                <button class="notification-bell-precision" (click)="showEditModal.set(false)">✕</button>
              </div>

              <div class="p-10 space-y-10">
                 <div class="space-y-4">
                    <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Mobile Transmission Line</label>
                    <div class="search-input-precision !w-full !px-6">
                       <input type="text" [(ngModel)]="editData.phone" placeholder="+254 XXX XXX XXX" class="!bg-transparent font-black">
                    </div>
                 </div>
                 <div class="space-y-4">
                    <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Primary Legal Domicile</label>
                    <div class="search-input-precision !w-full !px-6 !py-4">
                       <textarea rows="3" [(ngModel)]="editData.address" placeholder="Enter full physical address" class="w-full bg-transparent border-none focus:outline-none font-black text-xs text-primary resize-none"></textarea>
                    </div>
                 </div>
                 
                 <div class="p-6 rounded-2xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 flex gap-4 text-[var(--color-accent)]">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span class="text-xs font-bold leading-tight">Protocol: An OTP will be dispatched to your verified transmission line to authorize these changes.</span>
                 </div>
              </div>

              <div class="p-10 bg-surface-2/50 border-t border-subtle flex justify-end gap-6">
                 <button class="btn-precision btn-secondary-precision" (click)="showEditModal.set(false)">Abort Protocol</button>
                 <button class="btn-precision btn-primary-precision" (click)="saveProfile()" [disabled]="isSaving()">
                    @if (isSaving()) {
                      <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    } @else {
                      Commit to Registry
                    }
                 </button>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dialog-overlay-elite { position: fixed; inset: 0; background: var(--bg-overlay); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out); }

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
