import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-m-service-hub',
  imports: [RouterModule],
  template: `
    <div class="page-container animate-fade-in max-w-lg mx-auto !pt-10">
      <header class="mb-12 text-center relative">
        <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/5 rounded-full blur-3xl"></div>
        <div class="inline-flex items-center justify-center p-5 bg-gradient-to-br from-red-600 to-red-700 rounded-[2.5rem] mb-6 shadow-2xl shadow-red-600/20 relative z-10 border border-white/10 group hover:scale-105 transition-all duration-500">
           <svg class="w-10 h-10 text-white transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 012 2z" /></svg>
        </div>
        <div class="flex flex-col items-center gap-2 mb-3">
          <span class="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            MOBILE GATEWAY
          </span>
          <h1 class="premium-title !text-3xl">M-Service <span class="gradient-text">Hub</span></h1>
        </div>
        <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-60">Professional Tax Administration at your fingertips</p>
      </header>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-2 gap-4">
         @for (action of quickActions; track action.label) {
            <div class="glass-panel p-8 flex flex-col items-center text-center hover:border-white/20 transition-all cursor-pointer group active:scale-95 relative overflow-hidden" [routerLink]="action.link">
               <div class="absolute -bottom-10 -right-10 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.05] transition-colors"></div>
               <div class="w-14 h-14 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-2xl relative z-10 group-hover:border-white/20">
                  <svg class="w-7 h-7" [class]="action.colorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" [attr.d]="action.icon" /></svg>
               </div>
               <span class="text-white font-black text-[10px] uppercase tracking-widest relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">{{ action.label }}</span>
            </div>
         }
      </div>

      <!-- M-Pesa STK Push Simulator -->
      <section class="mt-10">
         <div class="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-2xl shadow-emerald-900/40 relative overflow-hidden group">
            <!-- Animated Background Glow -->
            <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div class="relative z-10">
               <div class="flex items-center gap-4 mb-6">
                  <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-black text-xl border border-white/20 shadow-xl">M</div>
                  <div>
                     <h3 class="font-black text-lg tracking-tight uppercase">M-Pesa Quick Pay</h3>
                     <p class="text-[9px] text-white/60 font-black uppercase tracking-widest mt-0.5">Instant liability liquidation</p>
                  </div>
               </div>
               
               <p class="text-xs text-white/80 mb-8 leading-relaxed font-bold uppercase tracking-widest opacity-80">Input your PRN reference to initiate a secure biometric STK authentication protocol.</p>
               
               <div class="flex flex-col gap-3">
                  <div class="relative">
                     <input type="text" placeholder="ENTER PRN NO." class="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-xs font-black tracking-widest focus:outline-none focus:bg-white/20 placeholder:text-white/30 transition-all uppercase">
                     <div class="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  </div>
                  <button class="bg-white text-emerald-800 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-50 transition-all active:scale-95 elite-glow">Request Gateway Authentication</button>
               </div>
            </div>
            
            <!-- Decorative logo -->
            <div class="absolute -right-16 -bottom-16 opacity-5 rotate-12">
               <svg class="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-.38-.07-.74-.17-1.11-.29l-.24 2.12-2.76-.32.48-4.22c-.67-.37-1.28-.84-1.81-1.39l-2.09 1.48-1.54-2.32 2.14-1.52c-.14-.54-.23-1.09-.27-1.65H2v-2.82h1.41c.04-.56.13-1.11.27-1.65l-2.14-1.52 1.54-2.32 2.09 1.48c.53-.55 1.14-1.02 1.81-1.39L8.48 2.21l2.76.32-.24 2.12c.37-.12.73-.22 1.11-.29V2h2.82v1.91c.38.07.74.17 1.11.29l.24-2.12 2.76.32-.48 4.22c.67.37 1.28.84 1.81 1.39l2.09-1.48 1.54 2.32-2.14 1.52c.14.54.23 1.09.27 1.65H22v2.82h-1.41c-.04.56-.13 1.11-.27 1.65l2.14 1.52-1.54 2.32-2.09-1.48c-.53.55-1.14 1.02-1.81 1.39l.48 4.22-2.76.32-.24-2.12c-.37.12-.73.22-1.11.29z" /></svg>
            </div>
         </div>
      </section>

      <!-- App Download Section -->
      <section class="mt-10 p-8 glass-panel bg-white/[0.01] border-white/5 relative overflow-hidden group">
         <div class="absolute -top-24 -right-24 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-white/[0.04] transition-colors"></div>
         <div class="flex items-center justify-between relative z-10">
            <div>
               <h4 class="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-3">Deployment Hub</h4>
               <p class="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] opacity-60">Unified Binary Archive</p>
            </div>
            <div class="w-20 h-20 bg-white p-2.5 rounded-2xl shadow-2xl relative">
               <div class="absolute inset-0 bg-blue-500/10 blur-xl"></div>
               <!-- QR to App Store -->
               <div class="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center relative">
                  <svg class="w-12 h-12 text-slate-800/20" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3-6h1.5v1.5H18V13zm3 0h1.5v1.5H21V13z" /></svg>
               </div>
            </div>
         </div>
         <div class="mt-8 flex gap-3 relative z-10">
            <button class="flex-1 bg-slate-900/50 border border-white/5 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-white/10 transition-all active:scale-95">Android Binary</button>
            <button class="flex-1 bg-slate-900/50 border border-white/5 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-white/10 transition-all active:scale-95">iOS Archive</button>
         </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MServiceHubComponent {
  quickActions = [
    {
      label: 'File Nil Return',
      icon: 'M5 13l4 4L19 7',
      link: '/member/tax-engine/file/nil-return',
      colorClass: 'text-emerald-500'
    },
    {
      label: 'Check Balance',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      link: '/member/debt',
      colorClass: 'text-blue-500'
    },
    {
      label: 'Verify TCC',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      link: '/member/compliance/tcc',
      colorClass: 'text-violet-500'
    },
    {
      label: 'Notifications',
      icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      link: '/member/notifications',
      colorClass: 'text-amber-500'
    }
  ];
}
