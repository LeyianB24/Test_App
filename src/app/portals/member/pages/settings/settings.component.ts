import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings',
  imports: [FormsModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-slate-500/10 border border-white/5 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse"></span>
              CORE CONFIGURATION
            </span>
          </div>
          <h1 class="premium-title">System <span class="gradient-text">Settings</span></h1>
          <p class="premium-subtitle">Authorized management of account security, communication protocols, and interface preferences</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
        <!-- Sidebar Navigation -->
        <div class="space-y-8 animate-up">
           <div class="glass-panel p-3 border-white/5 bg-white/[0.01]">
              <div class="space-y-2">
                 @for (tab of tabs; track tab.id) {
                    <button 
                       (click)="activeTab = tab.id as any"
                       class="w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all group relative overflow-hidden"
                       [class.bg-blue-600]="activeTab === tab.id"
                       [class.text-white]="activeTab === tab.id"
                       [class.shadow-xl]="activeTab === tab.id"
                       [class.shadow-blue-500/20]="activeTab === tab.id"
                       [class.text-slate-500]="activeTab !== tab.id"
                       [class.hover:bg-white/5]="activeTab !== tab.id"
                    >
                       <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all bg-white/5 group-hover:bg-white/10"
                          [class.!bg-white/20]="activeTab === tab.id">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path [attr.d]="tab.icon" /></svg>
                       </div>
                       <span class="text-[10px] font-black uppercase tracking-widest">{{ tab.label }}</span>
                    </button>
                 }
              </div>
           </div>

           <div class="glass-panel p-8 space-y-4 bg-white/[0.01] border-white/5 relative overflow-hidden">
              <div class="absolute -right-12 -bottom-12 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
              <h4 class="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 relative z-10">System Integrity</h4>
              <div class="flex items-center justify-between relative z-10">
                 <span class="text-[10px] font-black text-slate-400">CORE VERSION</span>
                 <span class="text-[10px] font-black text-white">4.2.5-STABLE</span>
              </div>
              <div class="flex items-center gap-3 relative z-10">
                 <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></span>
                 <span class="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Protocol Online</span>
              </div>
           </div>
        </div>

        <!-- Main Configuration Panel -->
        <div class="animate-up delay-1">
           <div class="glass-panel p-0 overflow-hidden relative">
              <!-- Animated Background -->
              <div class="absolute inset-0 bg-blue-600/[0.01] opacity-50"></div>

              @if (activeTab === 'general') {
                 <div class="relative z-10 animate-fade-in">
                    <div class="p-8 border-b border-white/5 bg-white/[0.01]">
                       <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">General Environment Preferences</h3>
                    </div>
                    <div class="p-10 space-y-10">
                       <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div class="form-group">
                             <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Interface Language</label>
                             <select class="form-select bg-slate-900 border-white/5 text-white rounded-xl focus:border-blue-500/50 transition-all font-black text-xs uppercase tracking-widest">
                                <option>English (International)</option>
                                <option>Kiswahili (East Africa)</option>
                             </select>
                          </div>
                          <div class="form-group">
                             <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Temporal Zone</label>
                             <select class="form-select bg-slate-900 border-white/5 text-white rounded-xl focus:border-blue-500/50 transition-all font-black text-xs uppercase tracking-widest">
                                <option>(GMT+03:00) NAIROBI / EAT</option>
                                <option>(GMT+00:00) UTC</option>
                             </select>
                          </div>
                       </div>
                       <div class="pt-8 border-t border-white/5 flex justify-end">
                          <button class="modern-btn primary-btn py-4 px-10 shadow-xl shadow-blue-500/20 elite-glow !rounded-2xl" (click)="saveGeneral()" [disabled]="isSavingGeneral()">
                             {{ isSavingGeneral() ? 'SYNCHRONIZING...' : 'COMMIT CHANGES' }}
                          </button>
                       </div>
                    </div>
                 </div>
              }

              @if (activeTab === 'security') {
                 <div class="relative z-10 animate-fade-in">
                    <div class="p-8 border-b border-white/5 bg-white/[0.01]">
                       <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Cryptographic & Security Protocols</h3>
                    </div>
                    <div class="p-10 space-y-10">
                       <div class="max-w-xl space-y-8">
                          <div class="form-group">
                             <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Current Credential</label>
                             <input type="password" class="form-input bg-slate-900 border-white/5 text-white rounded-xl focus:border-blue-500/50 transition-all" [(ngModel)]="currentPassword" placeholder="••••••••••••">
                          </div>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div class="form-group">
                                <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">New Credential</label>
                                <input type="password" class="form-input bg-slate-900 border-white/5 text-white rounded-xl focus:border-blue-500/50 transition-all" [(ngModel)]="newPassword" placeholder="Minimum 12 chars">
                             </div>
                             <div class="form-group">
                                <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Confirm Protocol</label>
                                <input type="password" class="form-input bg-slate-900 border-white/5 text-white rounded-xl focus:border-blue-500/50 transition-all" [(ngModel)]="confirmPassword" placeholder="Verify credential">
                             </div>
                          </div>
                          <div class="pt-8 flex justify-end">
                             <button class="modern-btn primary-btn py-4 px-10 shadow-xl shadow-blue-500/20 elite-glow !rounded-2xl" (click)="updatePassword()" [disabled]="isUpdating()">
                                {{ isUpdating() ? 'ROTATING KEYS...' : 'UPDATE CIPHER' }}
                             </button>
                          </div>
                       </div>

                       <div class="elite-divider my-10 relative h-px bg-white/5 flex items-center justify-center">
                          <span class="bg-slate-950 px-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Advanced Shielding</span>
                       </div>

                       <div class="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                          <div class="flex items-center gap-6">
                             <div class="w-14 h-14 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-emerald-500 transition-all shadow-2xl">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                             </div>
                             <div>
                                <h4 class="text-white font-black text-sm uppercase tracking-tight group-hover:text-emerald-400 transition-colors">Multi-Factor Authentication (MFA)</h4>
                                <p class="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1">Biometric STK verification required for all outbound protocols.</p>
                             </div>
                          </div>
                          <label class="switch-luxury relative inline-flex items-center cursor-pointer">
                             <input type="checkbox" checked class="sr-only peer">
                             <div class="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                       </div>
                    </div>
                 </div>
              }

              @if (activeTab === 'notifications') {
                 <div class="relative z-10 animate-fade-in">
                    <div class="p-8 border-b border-white/5 bg-white/[0.01]">
                       <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Broadcasting Strategy Preferences</h3>
                    </div>
                    <div class="p-10 space-y-6">
                       @for (pref of [
                          { title: 'Filing Confirmations', desc: 'Secure email protocol after successful statutory declarations.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                          { title: 'Payment Receipts', desc: 'Digital ledgers for PRN generation and liquidity confirmations.', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                          { title: 'Directive Updates', desc: 'Administrative bulletins regarding system upgrades and policy pivots.', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
                       ]; track pref.title) {
                          <label class="p-8 rounded-2xl bg-white/[0.01] border border-white/5 flex items-start gap-8 cursor-pointer hover:bg-white/[0.02] hover:border-blue-500/20 transition-all group">
                             <div class="flex items-center h-5">
                                <input type="checkbox" checked class="w-5 h-5 rounded border-white/10 bg-slate-900 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-slate-900">
                             </div>
                             <div class="flex items-start gap-6 -mt-1">
                                <div class="w-12 h-12 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all shadow-xl">
                                   <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path [attr.d]="pref.icon" /></svg>
                                </div>
                                <div>
                                   <strong class="text-white font-black text-sm uppercase tracking-tight group-hover:text-blue-400 transition-colors">{{ pref.title }}</strong>
                                   <p class="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1 opacity-70 leading-relaxed">{{ pref.desc }}</p>
                                </div>
                             </div>
                          </label>
                       }
                       <div class="pt-8 border-t border-white/5 flex justify-end">
                          <button class="modern-btn primary-btn py-4 px-10 shadow-xl shadow-blue-500/20 elite-glow !rounded-2xl" (click)="saveNotifications()" [disabled]="isSavingNotifications()">
                             {{ isSavingNotifications() ? 'TRANSMITTING...' : 'SAVE STRATEGY' }}
                          </button>
                       </div>
                    </div>
                 </div>
              }
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  tabs = [
    { id: 'general', label: 'General Configuration', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'security', label: 'Security & Shields', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'notifications', label: 'Directive Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
  ];

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
