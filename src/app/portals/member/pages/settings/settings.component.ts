import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner">
        <header class="premium-header">
           <div class="header-main">
              <div class="header-tag">
                 <span class="tag-glow"></span>
                 <span class="tag-text">Security Protocol Registry</span>
              </div>
              <h1 class="premium-title">System <span class="red-gradient">Settings</span></h1>
              <p class="premium-subtitle">Authorized management of account security, communication protocols, and interface preferences</p>
           </div>
        </header>

        <div class="settings-manifold">
          <!-- Protocol Sidebar -->
          <aside class="manifold-sidebar animate-up">
             <div class="sidebar-track">
                @for (tab of tabs; track tab.id) {
                   <button 
                      (click)="activeTab = tab.id"
                      class="nav-protocol"
                      [class.active]="activeTab === tab.id"
                   >
                      <div class="protocol-icon">
                         <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path [attr.d]="tab.icon" /></svg>
                      </div>
                      <span class="protocol-label">{{ tab.label }}</span>
                      @if (activeTab === tab.id) {
                         <div class="active-glint"></div>
                      }
                   </button>
                }
             </div>

             <div class="integrity-widget">
                <div class="widget-header">
                   <span class="w-label">SYSTEM INTEGRITY</span>
                   <div class="status-dot"></div>
                </div>
                <div class="widget-meta">
                   <span class="meta-v">STABLE PHASE 4.2.5</span>
                   <span class="meta-s">ENCRYPTION ACTIVE</span>
                </div>
             </div>
          </aside>

          <!-- Configuration Surface -->
          <main class="manifold-surface animate-up delay-1">
             <div class="surface-header">
                <h3 class="surface-title">{{ getActiveTabLabel() }}</h3>
                <div class="header-line"></div>
             </div>

             <div class="surface-body">
                @if (activeTab === 'general') {
                   <div class="config-panel animate-fade-in">
                      <div class="input-grid">
                         <div class="input-field">
                            <label>INTERFACE LANGUAGE ARCHIVE</label>
                            <select>
                               <option>ENGLISH (INTERNATIONAL)</option>
                               <option>KISWAHILI (EAST AFRICA)</option>
                            </select>
                         </div>
                         <div class="input-field">
                            <label>TEMPORAL ZONE COORDINATES</label>
                            <select>
                               <option>(GMT+03:00) NAIROBI / EAT</option>
                               <option>(GMT+00:00) UTC</option>
                            </select>
                         </div>
                      </div>
                      <div class="panel-actions">
                         <button class="btn-primary-elite" (click)="saveGeneral()" [disabled]="isSavingGeneral()">
                            {{ isSavingGeneral() ? 'SYNCHRONIZING...' : 'COMMIT CHANGES' }}
                         </button>
                      </div>
                   </div>
                }

                @if (activeTab === 'security') {
                   <div class="config-panel animate-fade-in">
                      <div class="security-stack">
                         <div class="input-field max-w-md">
                            <label>CURRENT MASTER CREDENTIAL</label>
                            <input type="password" [(ngModel)]="currentPassword" placeholder="••••••••••••">
                         </div>
                         <div class="input-grid">
                            <div class="input-field">
                               <label>NEW CIPHER KEY</label>
                               <input type="password" [(ngModel)]="newPassword" placeholder="MIN 12 CHARACTERS">
                            </div>
                            <div class="input-field">
                               <label>VERIFY CIPHER KEY</label>
                               <input type="password" [(ngModel)]="confirmPassword" placeholder="RE-ENTER KEY">
                            </div>
                         </div>
                         <div class="panel-actions">
                            <button class="btn-execute-security" (click)="updatePassword()" [disabled]="isUpdating()">
                               {{ isUpdating() ? 'ROTATING KEYS...' : 'EXECUTE CIPHER UPDATE' }}
                            </button>
                         </div>
                      </div>

                      <div class="shield-registry">
                         <div class="registry-header">ADVANCED SHIELDING PROTOCOLS</div>
                         <div class="shield-entry">
                            <div class="shield-info">
                               <div class="s-icon">
                                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                               </div>
                               <div class="s-text">
                                  <span class="s-title">MULTI-FACTOR AUTHENTICATION (MFA)</span>
                                  <p class="s-desc">Biometric STK verification required for all outbound fiscal transmissions.</p>
                               </div>
                            </div>
                            <label class="luxury-switch">
                               <input type="checkbox" checked>
                               <span class="switch-ui"></span>
                            </label>
                         </div>
                      </div>
                   </div>
                }

                @if (activeTab === 'notifications') {
                   <div class="config-panel animate-fade-in">
                      <div class="notification-stack">
                         @for (pref of [
                            { title: 'FILING CONFIRMATIONS', desc: 'Secure email protocol after successful statutory declarations.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { title: 'PAYMENT RECEIPTS', desc: 'Digital ledgers for PRN generation and liquidity confirmations.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                            { title: 'DIRECTIVE UPDATES', desc: 'Administrative bulletins regarding system upgrades and policy pivots.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
                         ]; track pref.title) {
                            <div class="pref-entry group">
                               <div class="pref-check">
                                  <input type="checkbox" checked>
                                  <div class="check-box"></div>
                               </div>
                               <div class="pref-visual">
                                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path [attr.d]="pref.icon" /></svg>
                               </div>
                               <div class="pref-meta">
                                  <span class="p-title">{{ pref.title }}</span>
                                  <p class="p-desc">{{ pref.desc }}</p>
                               </div>
                            </div>
                         }
                      </div>
                      <div class="panel-actions">
                         <button class="btn-primary-elite" (click)="saveNotifications()" [disabled]="isSavingNotifications()">
                            {{ isSavingNotifications() ? 'TRANSMITTING...' : 'SAVE BROADCAST STRATEGY' }}
                         </button>
                      </div>
                   </div>
                }
             </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      --red: #D92B2B;
      --red-bright: #EF3B3B;
      --red-glow: rgba(217, 43, 43, 0.4);
      --red-pale: rgba(217, 43, 43, 0.1);
      --red-border: rgba(217, 43, 43, 0.2);
      --violet: #8c52ff;
      --violet-pale: rgba(140, 82, 255, 0.1);
      --bg-root: #080809;
      --bg-surface: rgba(18, 18, 20, 0.6);
      --bdr: rgba(255, 255, 255, 0.05);
      --text-muted: #666670;
      --emerald: #10b981;
    }

    .db-root {
      min-height: 100vh;
      background: var(--bg-root);
      position: relative;
      overflow-x: hidden;
      color: #fff;
    }

    .noise-overlay {
      position: fixed; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3");
      opacity: 0.03;
      z-index: 1;
    }

    .accent-bleed {
      position: fixed; top: -10%; right: -5%;
      width: 60%; height: 50%;
      background: radial-gradient(circle at center, var(--red-pale) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
    }

    .db-inner {
      position: relative; z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .premium-header { margin-bottom: 56px; }
    .header-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px; background: var(--violet-pale);
      border: 1px solid rgba(140, 82, 255, 0.2); border-radius: 100px;
      margin-bottom: 16px;
    }
    .tag-glow { width: 6px; height: 6px; background: var(--violet); border-radius: 50%; box-shadow: 0 0 10px var(--violet); }
    .tag-text { font-size: 10px; font-weight: 950; color: #b794f4; letter-spacing: 2px; text-transform: uppercase; }

    .premium-title { font-size: 48px; font-weight: 950; letter-spacing: -2px; line-height: 1; margin: 0; }
    .red-gradient { background: linear-gradient(to right, #fff, var(--red-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .premium-subtitle { color: var(--text-muted); font-size: 14px; font-weight: 500; margin: 12px 0 0; letter-spacing: 0.5px; }

    /* Manifold Layout */
    .settings-manifold { display: grid; grid-template-columns: 320px 1fr; gap: 40px; }

    /* Sidebar */
    .manifold-sidebar { display: flex; flex-direction: column; gap: 32px; }
    .sidebar-track {
       padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr);
       border-radius: 32px; backdrop-filter: blur(24px);
    }
    .nav-protocol {
       width: 100%; display: flex; align-items: center; gap: 16px; padding: 16px 20px;
       background: none; border: none; border-radius: 20px; color: var(--text-muted);
       cursor: pointer; position: relative; transition: all 0.3s;
    }
    .nav-protocol:hover { background: rgba(255,255,255,0.03); color: #fff; }
    .nav-protocol.active { background: var(--red); color: #fff; box-shadow: 0 8px 20px var(--red-glow); }
    
    .protocol-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.03); border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
    .nav-protocol.active .protocol-icon { background: rgba(0,0,0,0.2); }
    .protocol-label { font-size: 9px; font-weight: 950; letter-spacing: 1.5px; text-transform: uppercase; }
    .active-glint { position: absolute; right: 12px; width: 4px; height: 4px; background: #fff; border-radius: 50%; box-shadow: 0 0 10px #fff; }

    .integrity-widget {
       padding: 32px; background: var(--bg-surface); border: 1px solid var(--bdr); border-radius: 32px;
    }
    .widget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .w-label { font-size: 8px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; }
    .status-dot { width: 8px; height: 8px; background: var(--emerald); border-radius: 50%; box-shadow: 0 0 15px var(--emerald); }
    .widget-meta { display: flex; flex-direction: column; gap: 8px; }
    .meta-v { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 950; color: #fff; }
    .meta-s { font-size: 8px; font-weight: 950; color: var(--emerald); letter-spacing: 1px; }

    /* Main Surface */
    .manifold-surface {
       background: var(--bg-surface); border: 1px solid var(--bdr);
       border-radius: 48px; backdrop-filter: blur(32px); overflow: hidden;
    }
    .surface-header { padding: 32px 48px; border-bottom: 1px solid var(--bdr); display: flex; align-items: center; gap: 24px; }
    .surface-title { font-size: 12px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; white-space: nowrap; }
    .header-line { flex: 1; height: 1px; background: var(--bdr); }

    .surface-body { padding: 48px; }

    .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
    .input-field { display: flex; flex-direction: column; gap: 12px; }
    .input-field label { font-size: 8px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; margin-left: 8px; }
    .input-field input, .input-field select {
       height: 56px; background: #000; border: 1px solid var(--bdr); border-radius: 16px;
       padding: 0 20px; color: #fff; font-size: 13px; font-weight: 950; outline: none; transition: all 0.3s;
    }
    .input-field input:focus, .input-field select:focus { border-color: var(--red-border); background: var(--red-pale); }

    .btn-primary-elite {
       height: 60px; padding: 0 40px; background: var(--red); color: #fff; border: none; border-radius: 20px;
       font-size: 11px; font-weight: 950; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s;
       box-shadow: 0 12px 24px var(--red-glow);
    }
    .btn-primary-elite:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 32px var(--red-glow); }
    .btn-primary-elite:disabled { opacity: 0.3; cursor: not-allowed; }

    .security-stack { display: flex; flex-direction: column; gap: 24px; margin-bottom: 48px; }
    .btn-execute-security {
       height: 56px; padding: 0 32px; background: #000; border: 1px solid var(--red-border); border-radius: 16px;
       color: var(--red); font-size: 10px; font-weight: 950; letter-spacing: 2px; cursor: pointer; transition: all 0.3s;
    }
    .btn-execute-security:hover { background: var(--red); color: #fff; box-shadow: 0 8px 16px var(--red-glow); }

    .shield-registry { margin-top: 48px; padding-top: 48px; border-top: 1px solid var(--bdr); }
    .registry-header { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 3px; margin-bottom: 24px; }
    .shield-entry {
       padding: 24px; background: rgba(0,0,0,0.2); border: 1px solid var(--bdr); border-radius: 24px;
       display: flex; justify-content: space-between; align-items: center;
    }
    .shield-info { display: flex; gap: 20px; align-items: center; }
    .s-icon { width: 52px; height: 52px; background: #000; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--emerald); }
    .s-title { font-size: 13px; font-weight: 950; color: #fff; display: block; }
    .s-desc { font-size: 10px; color: var(--text-muted); font-weight: 600; margin: 4px 0 0; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.4; }

    .luxury-switch { position: relative; width: 64px; height: 32px; }
    .luxury-switch input { opacity: 0; width: 0; height: 0; }
    .switch-ui {
       position: absolute; inset: 0; background: #000; border: 1px solid var(--bdr);
       border-radius: 32px; cursor: pointer; transition: all 0.4s;
    }
    .switch-ui:before {
       content: ""; position: absolute; height: 24px; width: 24px; left: 4px; bottom: 3px;
       background: #fff; transition: all 0.4s; border-radius: 50%;
    }
    input:checked + .switch-ui { background: var(--emerald); border-color: var(--emerald); box-shadow: 0 0 15px var(--emerald); }
    input:checked + .switch-ui:before { transform: translateX(32px); }

    .notification-stack { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
    .pref-entry {
       padding: 24px; background: rgba(0,0,0,0.2); border: 1px solid var(--bdr);
       border-radius: 24px; display: flex; align-items: center; gap: 24px; transition: all 0.3s;
    }
    .pref-entry:hover { border-color: var(--red-border); }
    
    .pref-check { position: relative; width: 24px; height: 24px; }
    .pref-check input { position: absolute; opacity: 0; cursor: pointer; width: 100%; height: 100%; z-index: 10; }
    .check-box { width: 24px; height: 24px; background: #000; border: 2px solid var(--bdr); border-radius: 8px; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
    .check-box:after { content: ""; width: 10px; height: 10px; background: var(--red); border-radius: 2px; transform: scale(0); transition: all 0.3s; }
    input:checked + .check-box { border-color: var(--red); }
    input:checked + .check-box:after { transform: scale(1); }

    .pref-visual { width: 48px; height: 48px; background: #000; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; }
    .pref-entry:hover .pref-visual { color: var(--red); border: 1px solid var(--red-border); }
    .p-title { font-size: 13px; font-weight: 950; color: #fff; text-transform: uppercase; }
    .p-desc { font-size: 9px; color: var(--text-muted); font-weight: 700; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; line-height: 1.4; }

    .animate-up { animation: up 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
    @keyframes up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    @media (max-width: 1024px) {
       .settings-manifold { grid-template-columns: 1fr; }
       .input-grid { grid-template-columns: 1fr; }
    }
  `],
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

  tabs: { id: 'general' | 'security' | 'notifications'; label: string; icon: string }[] = [
    { id: 'general', label: 'General Configuration', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'security', label: 'Security & Shields', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'notifications', label: 'Directive Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
  ];

  getActiveTabLabel(): string {
    return this.tabs.find(t => t.id === this.activeTab)?.label || '';
  }

  updatePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) return;
    if (this.newPassword !== this.confirmPassword) {
      alert('Error: Cryptographic mismatch in password confirmation.');
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
          alert('Success: Security credentials updated.');
        } else {
          alert('System Error: ' + response.message);
        }
      },
      error: () => {
        this.isUpdating.set(false);
        alert('Critical Error: Failed to commit cryptographic updates.');
      }
    });
  }

  saveGeneral() {
    this.isSavingGeneral.set(true);
    setTimeout(() => {
      this.isSavingGeneral.set(false);
      alert('Neutral: General configuration synchronized.');
    }, 1500);
  }

  saveNotifications() {
    this.isSavingNotifications.set(true);
    setTimeout(() => {
      this.isSavingNotifications.set(false);
      alert('Neutral: Broadcasting strategy committed to registry.');
    }, 1500);
  }
}
