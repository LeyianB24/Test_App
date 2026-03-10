import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              TAXPAYER IDENTITY
            </span>
          </div>
          <h1 class="premium-title">Taxpayer <span class="gradient-text">Profile</span></h1>
          <p class="premium-subtitle">Authorized registry of statutory identity, demographic data, and biometric status</p>
        </div>
        <div class="flex gap-4">
           <button class="modern-btn border-white/10 text-slate-400 flex items-center gap-2 px-6 py-4 rounded-2xl hover:bg-white/[0.05] hover:text-white transition-all">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download PIN Certificate
           </button>
           <button class="modern-btn primary-btn py-4 px-8 shadow-xl shadow-blue-500/20 elite-glow">
              Update Particulars
           </button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar Profile info -->
        <div class="lg:col-span-1 space-y-8">
           <div class="glass-panel p-10 text-center relative overflow-hidden group border-blue-500/20 bg-blue-500/5">
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
              
              <div class="w-32 h-32 rounded-[2.5rem] bg-slate-900 border border-white/5 mx-auto mb-8 flex items-center justify-center relative z-10 shadow-2xl overflow-hidden group-hover:border-blue-500/30 transition-all">
                 <div class="absolute inset-0 bg-blue-500/5 blur-xl"></div>
                 <svg class="w-16 h-16 text-slate-700 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              
              <h2 class="text-2xl font-black text-white tracking-tighter mb-2 relative z-10">{{ profile().name }}</h2>
              <div class="flex flex-col items-center gap-3 relative z-10">
                 <span class="px-3 py-1 bg-slate-900 border border-white/10 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-widest shadow-lg">{{ profile().pin }}</span>
                 <span class="status-pill-elite active relative">
                   <span class="dot"></span>
                   STATUTORY COMPLIANT
                 </span>
              </div>
           </div>

           <div class="glass-panel p-8 space-y-6">
              <h3 class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Identity Matrix</h3>
              
              <div class="space-y-6">
                 @for (field of [
                    { label: 'Citizenship', value: profile().citizenship },
                    { label: 'Gender', value: profile().gender },
                    { label: 'Date of Birth', value: profile().dob },
                    { label: 'ID/Passport No.', value: profile().idNo }
                 ]; track field.label) {
                    <div class="flex justify-between items-center group/field">
                       <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest">{{ field.label }}</span>
                       <span class="text-xs font-black text-white group-hover/field:text-blue-400 transition-colors uppercase">{{ field.value }}</span>
                    </div>
                 }
              </div>
           </div>

           <div class="glass-panel p-8 bg-emerald-500/5 border-emerald-500/10">
              <div class="flex items-center gap-4 mb-4">
                 <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 </div>
                 <h4 class="text-xs font-black text-white uppercase tracking-widest">Enhanced Security</h4>
              </div>
              <p class="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-widest opacity-80 mb-6">Biometric authentication is active for this identity archive.</p>
              <button class="w-full py-3 rounded-xl bg-slate-900 border border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">Manage Keys</button>
           </div>
        </div>

        <!-- Main Profile Sections -->
        <div class="lg:col-span-2 space-y-8">
           <!-- Contact Particulars -->
           <div class="glass-panel p-0 overflow-hidden relative">
              <div class="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                 <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Contact & Communication Protocols</h3>
                 <button class="text-[9px] font-black text-blue-500/50 uppercase tracking-[0.2em] hover:text-blue-400 transition-colors">Edit Archive</button>
              </div>
              <div class="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                 @for (contact of [
                    { label: 'Primary Terminal', value: profile().phone, icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                    { label: 'Identity Email', value: profile().email, icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { label: 'Physical Registry', value: profile().address, icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
                    { label: 'Postal Protocol', value: profile().postal, icon: 'M3 19v-8.913a1 1 0 01.31-.707l7-7a1 1 0 011.38 0l7 7a1 1 0 01.31.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z' }
                 ]; track contact.label) {
                    <div class="group flex items-start gap-4">
                       <div class="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all shadow-xl">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path [attr.d]="contact.icon" /></svg>
                       </div>
                       <div>
                          <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1 block">{{ contact.label }}</span>
                          <span class="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{{ contact.value }}</span>
                       </div>
                    </div>
                 }
              </div>
           </div>

           <!-- Tax Obligations -->
           <div class="glass-panel p-0 overflow-hidden relative">
              <div class="p-8 border-b border-white/5 bg-white/[0.01]">
                 <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Statutory Tax Obligations</h3>
              </div>
              <div class="p-8">
                 <div class="grid grid-cols-1 gap-4">
                    @for (obl of profile().obligations; track obl.name) {
                       <div class="p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-blue-500/20 transition-all group flex items-center justify-between">
                          <div class="flex items-center gap-6">
                             <div class="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-600 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all shadow-xl font-black text-xs uppercase tracking-tighter">
                                {{ obl.code }}
                             </div>
                             <div>
                                <h4 class="text-white font-black text-sm tracking-tight group-hover:text-blue-400 transition-colors uppercase">{{ obl.name }}</h4>
                                <p class="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">Effective: {{ obl.effective }}</p>
                             </div>
                          </div>
                          <span class="status-pill-elite active">
                             <span class="dot"></span>
                             ACTIVE
                          </span>
                       </div>
                    }
                 </div>
              </div>
           </div>

           <!-- Associated Links -->
           <div class="glass-panel p-10 bg-blue-600/5 border-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div class="flex items-center gap-6">
                 <div class="w-16 h-16 rounded-[1.5rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-2xl group-hover:scale-110 transition-transform">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                 </div>
                 <div>
                    <h4 class="text-white font-black text-lg tracking-tighter uppercase group-hover:text-blue-400 transition-colors">Linked Corporate Entities</h4>
                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Authorized digital proxy for linked commercial archives</p>
                 </div>
              </div>
              <button class="modern-btn border-white/10 text-slate-400 px-8 py-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-xl font-black text-[10px] uppercase tracking-widest">
                 View Entities
              </button>
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
export class ProfileComponent {
  profile = signal({
    name: 'JOHNSON MUTAI OMONDI',
    pin: 'A009122883J',
    citizenship: 'Kenyan',
    gender: 'Male',
    dob: '12 May 1988',
    idNo: '24411228',
    phone: '+254 712 345 678',
    email: 'johnson.omondi@tactical.co.ke',
    address: 'Muthaiga Corporate Suites, Block C',
    postal: 'P.O BOX 2200-00100, Nairobi',
    obligations: [
      { code: 'INC', name: 'Income Tax - Resident Individual', effective: '01 Jan 2012' },
      { code: 'VAT', name: 'Value Added Tax (VAT)', effective: '15 Mar 2018' },
      { code: 'PAYE', name: 'PAYE (Employer)', effective: '01 Feb 2020' }
    ]
  });
}
