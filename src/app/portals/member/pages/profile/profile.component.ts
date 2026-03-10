import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule, UpperCasePipe, DatePipe } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { DashboardDataService } from '../../../../services/dashboard-data.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, UpperCasePipe, DatePipe],
  template: `
    <div class="db-root animate-fade-in">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- Elite Header -->
        <header class="db-header-elite">
          <div class="header-left">
            <div class="live-badge">
              <span class="live-dot"></span>
              TAXPAYER IDENTITY SECURE
            </div>
            <h1 class="premium-title">Taxpayer <span class="text-red">Profile</span></h1>
            <p class="premium-subtitle">Authorized registry of statutory identity, demographic data, and biometric status</p>
          </div>
          <div class="action-stack">
            <button class="btn-ghost-elite" (click)="downloadPinCertificate()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              PIN CERTIFICATE
            </button>
            <button class="btn-primary-elite">
              UPDATE PARTICULARS
            </button>
          </div>
        </header>

        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            <div class="col-span-1 h-96 bg-card-pale rounded-3xl"></div>
            <div class="col-span-2 h-96 bg-card-pale rounded-3xl"></div>
          </div>
        } @else {
          <div class="dashboard-grid-elite">
            <!-- Sidebar: Identity Matrix -->
            <div class="side-stack-elite">
              <div class="elite-card identity-focus">
                <div class="card-glow"></div>
                
                <div class="avatar-capsule">
                  <div class="avatar-ring"></div>
                  <div class="avatar-content">
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                </div>

                <div class="identity-lead text-center mt-8">
                  <h2 class="text-xl font-black tracking-tighter text-white mb-2">{{ userName() | uppercase }}</h2>
                  <div class="flex flex-col items-center gap-3">
                    <span class="pin-badge">{{ taxpayerPin() }}</span>
                    <div class="status-badge success">
                      <span class="live-dot"></span>
                      STATUTORY COMPLIANT
                    </div>
                  </div>
                </div>
              </div>

              <div class="elite-card">
                 <div class="card-glow"></div>
                 <div class="panel-header-mini">
                    <h3 class="meta-label">IDENTITY MATRIX</h3>
                 </div>
                 <div class="matrix-list">
                    @for (field of [
                       { label: 'Citizenship', value: profileRecord()?.citizenship || 'KENYAN' },
                       { label: 'Gender', value: profileRecord()?.gender || 'N/A' },
                       { label: 'Date of Birth', value: (profileRecord()?.dob | date:'mediumDate') || 'N/A' },
                       { label: 'ID/Passport No.', value: profileRecord()?.id_number || 'N/A' }
                    ]; track field.label) {
                       <div class="matrix-item">
                          <span class="meta-label text-mut">{{ field.label }}</span>
                          <span class="matrix-val">{{ field.value | uppercase }}</span>
                       </div>
                    }
                 </div>
              </div>

              <div class="elite-card security-panel">
                 <div class="card-glow"></div>
                 <div class="flex items-center gap-4 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-red-pale border border-red-border flex items-center justify-center text-red">
                       <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <h4 class="meta-label">ENHANCED BIOMETRICS</h4>
                 </div>
                 <p class="ri-period mb-6 opacity-70 leading-relaxed">Active biometric handshake established for this identity archive.</p>
                 <button class="btn-ghost-elite w-full py-3">MANAGE KEYS</button>
              </div>
            </div>

            <!-- Main Content: Protocols & Obligations -->
            <div class="main-stack">
              <!-- Contact Protocols -->
              <div class="elite-card p-0">
                 <div class="card-glow"></div>
                 <div class="panel-header-elite">
                    <h3 class="panel-title">COMMUNICATION PROTOCOLS</h3>
                    <button class="meta-label text-red hover:underline">EDIT ARCHIVE</button>
                 </div>
                 <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    @for (contact of [
                       { label: 'Primary Terminal', value: profileRecord()?.phone || 'N/A', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                       { label: 'Identity Email', value: profileRecord()?.email || 'N/A', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                       { label: 'Physical Registry', value: profileRecord()?.address || 'N/A', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
                       { label: 'Postal Protocol', value: (profileRecord()?.postal_address || (profileRecord()?.town ? 'P.O BOX IN ' + profileRecord()?.town : 'STATIONARY ARCHIVE')), icon: 'M3 19v-8.913a1 1 0 01.31-.707l7-7a1 1 0 011.38 0l7 7a1 1 0 01.31.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z' }
                    ]; track contact.label) {
                      <div class="protocol-cell group">
                         <div class="protocol-icon">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path [attr.d]="contact.icon" /></svg>
                         </div>
                         <div class="protocol-info">
                            <span class="meta-label text-mut">{{ contact.label }}</span>
                            <span class="protocol-val">{{ contact.value | uppercase }}</span>
                         </div>
                      </div>
                    }
                 </div>
              </div>

              <!-- Tax Obligations -->
              <div class="elite-card p-0">
                 <div class="card-glow"></div>
                 <div class="panel-header-elite">
                    <h3 class="panel-title">STATUTORY OBLIGATIONS</h3>
                 </div>
                 <div class="p-8">
                    <div class="obligation-stack">
                       @for (obl of obligationsList(); track obl.obligation_id || obl.obligation_name) {
                         <div class="obligation-item group">
                            <div class="obl-left">
                               <div class="obl-code">{{ obl.obligation_code || (obl.obligation_name | slice:0:3) | uppercase }}</div>
                               <div class="obl-main">
                                  <h4 class="obl-name">{{ obl.obligation_name | uppercase }}</h4>
                                  <p class="ri-period text-mut">EFFECTIVE: {{ (obl.effective_from | date:'mediumDate') || 'N/A' }}</p>
                               </div>
                            </div>
                            <div class="status-badge" [class.success]="obl.status === 'active' || obl.status === 'Active'" [class.alert]="obl.status !== 'active' && obl.status !== 'Active'">
                               <span class="live-dot"></span>
                               {{ obl.status | uppercase }}
                            </div>
                         </div>
                       } @empty {
                          <div class="p-12 text-center">
                             <p class="ri-period text-mut">No statutory obligations registered.</p>
                          </div>
                       }
                    </div>
                 </div>
              </div>

              <!-- Linked Entities -->
              <div class="elite-card entity-link-card group">
                 <div class="card-glow"></div>
                 <div class="flex flex-col md:flex-row items-center gap-8">
                    <div class="entity-icon-ring">
                       <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </div>
                    <div class="flex-1 text-center md:text-left">
                       <h4 class="text-xl font-black text-white tracking-tighter uppercase group-hover:text-red transition-colors">Linked Corporate Entities</h4>
                       <p class="ri-period mt-1 opacity-60">Authorized digital proxy for linked commercial archives</p>
                    </div>
                    <button class="btn-primary-elite">VIEW ENTITIES</button>
                 </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

    :host {
      --red: #C0392B;
      --red-light: #E74C3C;
      --red-pale: rgba(192,57,43,0.08);
      --red-glow: rgba(192,57,43,0.25);
      --red-border: rgba(192,57,43,0.15);
      
      --green: #1A7A3C;
      --green-light: #22A052;
      --green-pale: rgba(26,122,60,0.08);

      --bg-root: #0B0F0E;
      --bg-card: #14201A;
      --bg-card-2: #192820;
      --bg-card-3: #1C2B22;
      
      --text-pri: #E8F5EC;
      --text-sec: #8EA898;
      --text-mut: #4A6258;

      --bdr: rgba(26,122,60,0.15);
      --bdr-md: rgba(26,122,60,0.25);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    .db-root { 
      min-height: 100vh; 
      background: #050505 url('assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      color: var(--text-pri); 
      position: relative; 
      overflow-x: hidden; 
      padding-bottom: 5rem;
    }
    
    .db-root::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.02; z-index: 2; pointer-events: none; }

    .db-inner { 
      max-width: 1600px; 
      margin: 0 auto; 
      padding: 60px 40px; 
      display: flex; 
      flex-direction: column; 
      gap: 50px; 
      position: relative; 
      z-index: 10; 
    }

    /* Header Enhancement */
    .db-header-elite { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
    }
    .premium-title { 
      font-size: 56px; 
      font-weight: 950; 
      letter-spacing: -2.5px; 
      line-height: 0.9; 
      margin: 16px 0 12px; 
      text-transform: uppercase;
    }
    .text-red { 
      color: var(--red-light); 
      -webkit-text-stroke: 1px var(--red-light);
      text-shadow: 0 0 20px var(--red-glow);
    }
    .premium-subtitle { 
      font-size: 11px; 
      font-weight: 900; 
      color: var(--text-sec); 
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-light); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red-light); box-shadow: 0 0 10px var(--red-glow); animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .action-stack { display: flex; gap: 12px; }
    .btn-ghost-elite { 
      background: rgba(255, 255, 255, 0.03); 
      border: 1px solid rgba(255, 255, 255, 0.08); 
      color: var(--text-pri); 
      padding: 16px 28px; 
      border-radius: 18px; 
      font-size: 11px; 
      font-weight: 950; 
      letter-spacing: 2px; 
      text-transform: uppercase;
      transition: all 0.4s;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .btn-ghost-elite:hover { 
      background: rgba(255, 255, 255, 0.08); 
      color: var(--text-pri); 
      border-color: rgba(255, 255, 255, 0.2); 
    }

    .btn-primary-elite { 
      background: var(--red); 
      border: none; 
      color: white; 
      padding: 16px 32px; 
      border-radius: 18px; 
      font-size: 11px; 
      font-weight: 950; 
      letter-spacing: 2px; 
      cursor: pointer; 
      transition: all 0.4s; 
      box-shadow: 0 12px 32px var(--red-glow); 
      text-transform: uppercase;
    }
    .btn-primary-elite:hover { transform: translateY(-3px) scale(1.05); background: var(--red-light); box-shadow: 0 20px 48px var(--red-glow); }

    /* Grid Architecture */
    .dashboard-grid-elite { display: grid; grid-template-columns: 380px 1fr; gap: 40px; }
    .main-stack { display: flex; flex-direction: column; gap: 32px; }
    .side-stack-elite { display: flex; flex-direction: column; gap: 32px; }

    /* Elite Card */
    .elite-card { 
      background: rgba(20, 32, 26, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08); 
      border-radius: 32px; 
      padding: 32px; 
      position: relative; 
      overflow: hidden; 
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .elite-card:hover { 
      background: rgba(20, 32, 26, 0.6);
      border-color: rgba(217, 43, 43, 0.3); 
      transform: translateY(-5px) scale(1.01); 
      box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 20px rgba(217, 43, 43, 0.1); 
    }
    .card-glow { position: absolute; inset: 0; background: radial-gradient(circle at top right, var(--red), transparent 70%); opacity: 0.03; pointer-events: none; }
    .bg-card-pale { background: rgba(255, 255, 255, 0.02); }

    /* Identity Sidebar */
    .avatar-capsule { width: 140px; height: 140px; margin: 0 auto; position: relative; }
    .avatar-ring { position: absolute; inset: -12px; border: 2px dashed rgba(217, 43, 43, 0.3); border-radius: 48px; animation: rotate 30s linear infinite; }
    @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .avatar-content { width: 100%; height: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 44px; display: flex; align-items: center; justify-content: center; color: var(--text-pri); position: relative; z-index: 2; box-shadow: 0 0 40px rgba(0,0,0,0.5); }
    
    .pin-badge { font-size: 11px; font-weight: 950; background: rgba(255, 255, 255, 0.03); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); color: var(--text-pri); letter-spacing: 2px; }
    .status-badge { display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 50px; font-size: 10px; font-weight: 950; letter-spacing: 1.5px; }
    .status-badge.success { background: rgba(16, 185, 129, 0.05); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .status-badge.alert { background: var(--red-pale); color: var(--red-light); border: 1px solid var(--red-border); }

    .panel-header-mini { margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .meta-label { font-size: 9px; font-weight: 950; color: var(--text-mut); letter-spacing: 3px; text-transform: uppercase; }

    .matrix-list { display: flex; flex-direction: column; gap: 20px; }
    .matrix-item { display: flex; justify-content: space-between; align-items: center; }
    .matrix-val { font-size: 12px; font-weight: 950; color: var(--text-pri); }

    .ri-period { font-size: 10px; font-weight: 900; color: var(--text-mut); letter-spacing: 2px; text-transform: uppercase; }

    /* Main Content Sections */
    .panel-header-elite { padding: 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.01); }
    .panel-title { font-size: 11px; font-weight: 950; color: var(--text-mut); letter-spacing: 3px; }

    .protocol-cell { display: flex; align-items: center; gap: 24px; transition: all 0.4s; }
    .protocol-icon { width: 56px; height: 56px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 18px; display: flex; align-items: center; justify-content: center; color: var(--text-pri); transition: all 0.4s; }
    .group:hover .protocol-icon { color: var(--red-light); border-color: rgba(217, 43, 43, 0.3); transform: scale(1.1); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
    .protocol-info { display: flex; flex-direction: column; gap: 6px; }
    .protocol-val { font-size: 14px; font-weight: 950; color: var(--text-pri); letter-spacing: -0.2px; }

    .obligation-stack { display: flex; flex-direction: column; gap: 20px; }
    .obligation-item { padding: 24px 32px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 24px; display: flex; justify-content: space-between; align-items: center; transition: all 0.4s; }
    .obligation-item:hover { border-color: rgba(217, 43, 43, 0.2); background: rgba(255, 255, 255, 0.04); transform: translateX(10px); }
    
    .obl-left { display: flex; align-items: center; gap: 28px; }
    .obl-code { width: 60px; height: 60px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 950; color: var(--text-pri); box-shadow: 0 0 20px rgba(0,0,0,0.3); }
    .obl-name { font-size: 16px; font-weight: 950; color: var(--text-pri); letter-spacing: -0.5px; }

    .entity-link-card { background: rgba(217, 43, 43, 0.05); border-color: rgba(217, 43, 43, 0.2); }
    .entity-icon-ring { width: 72px; height: 72px; border-radius: 24px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center; justify-content: center; color: var(--red-light); transition: all 0.5s; }
    .group:hover .entity-icon-ring { transform: rotate(10deg) scale(1.1); box-shadow: 0 10px 40px var(--red-glow); color: white; border-color: var(--red); }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }

    @media (max-width: 1024px) {
      .dashboard-grid-elite { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .db-inner { padding: 24px 16px; }
      .premium-title { font-size: 32px; }
      .db-header-elite { flex-direction: column; align-items: flex-start; }
      .action-stack { width: 100%; }
      .action-stack button { flex: 1; }
      .obl-left { gap: 16px; }
      .obl-code { display: none; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardData = inject(DashboardDataService);

  loading = this.dashboardData.isLoading;
  
  userName = computed(() => this.authService.userName());
  taxpayerPin = computed(() => this.authService.currentUser()?.taxpayer_id || 'N/A');
  
  profileRecord = this.dashboardData.taxpayerProfile;
  obligationsList = this.dashboardData.obligations;

  ngOnInit() {
    // Ensure data is loaded
    if (!this.dashboardData.taxpayerProfile() || this.dashboardData.obligations().length === 0) {
      this.dashboardData.refreshData().subscribe();
    }
  }

  downloadPinCertificate() {
    const token = this.authService.getAuthToken();
    const url = `${environment.apiUrl}/pin_certificate_pdf.php?token=${encodeURIComponent(token ?? '')}`;
    window.open(url, '_blank');
  }
}
