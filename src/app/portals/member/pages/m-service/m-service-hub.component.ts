import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-m-service-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="m-service-container p-6 animate-fade-in max-w-lg mx-auto">
      <header class="mb-10 text-center">
        <div class="inline-block p-4 bg-red-600 rounded-3xl mb-4 shadow-lg shadow-red-600/20">
           <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 012 2z" /></svg>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">M-Service Hub</h1>
        <p class="text-slate-400 text-sm italic">"Tax at your fingertips"</p>
      </header>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-2 gap-4">
         @for (action of quickActions; track action.label) {
            <div class="glass-card p-6 flex flex-col items-center text-center hover:bg-slate-800/80 transition-all cursor-pointer group active:scale-95" [routerLink]="action.link">
               <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" [class]="action.colorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="action.icon" /></svg>
               </div>
               <span class="text-white font-bold text-xs uppercase tracking-wider">{{ action.label }}</span>
            </div>
         }
      </div>

      <!-- M-Pesa STK Push Simulator -->
      <section class="mt-8">
         <div class="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
            <div class="relative z-10">
               <div class="flex items-center gap-3 mb-4">
                  <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">M</div>
                  <h3 class="font-bold">M-Pesa Quick Pay</h3>
               </div>
               <p class="text-xs text-white/80 mb-6">Enter your PRN to receive an STK Push on your phone.</p>
               
               <div class="flex gap-2">
                  <input type="text" placeholder="Enter PRN No." class="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white/20 placeholder:text-white/40">
                  <button class="bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">Request</button>
               </div>
            </div>
            <!-- Decorative logo -->
            <div class="absolute -right-10 -bottom-10 opacity-10">
               <svg class="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.82v-1.91c-.38-.07-.74-.17-1.11-.29l-.24 2.12-2.76-.32.48-4.22c-.67-.37-1.28-.84-1.81-1.39l-2.09 1.48-1.54-2.32 2.14-1.52c-.14-.54-.23-1.09-.27-1.65H2v-2.82h1.41c.04-.56.13-1.11.27-1.65l-2.14-1.52 1.54-2.32 2.09 1.48c.53-.55 1.14-1.02 1.81-1.39L8.48 2.21l2.76.32-.24 2.12c.37-.12.73-.22 1.11-.29V2h2.82v1.91c.38.07.74.17 1.11.29l.24-2.12 2.76.32-.48 4.22c.67.37 1.28.84 1.81 1.39l2.09-1.48 1.54 2.32-2.14 1.52c.14.54.23 1.09.27 1.65H22v2.82h-1.41c-.04.56-.13 1.11-.27 1.65l2.14 1.52-1.54 2.32-2.09-1.48c-.53.55-1.14 1.02-1.81 1.39l.48 4.22-2.76.32-.24-2.12c-.37.12-.73.22-1.11.29z" /></svg>
            </div>
         </div>
      </section>

      <!-- App Download Section -->
      <section class="mt-8 p-6 glass-card">
         <div class="flex items-center justify-between">
            <div>
               <h4 class="text-white font-bold text-sm mb-1">Get the M-Service App</h4>
               <p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Android & iOS Available</p>
            </div>
            <div class="w-16 h-16 bg-white p-1 rounded-lg">
               <!-- QR to App Store -->
               <div class="w-full h-full bg-slate-200 flex items-center justify-center">
                  <svg class="w-10 h-10 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-3 0h2v2h-2v-2zm3-6h1.5v1.5H18V13zm3 0h1.5v1.5H21V13z" /></svg>
               </div>
            </div>
         </div>
         <div class="mt-4 flex gap-2">
            <button class="flex-1 bg-slate-900 border border-white/5 py-2 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors">Play Store</button>
            <button class="flex-1 bg-slate-900 border border-white/5 py-2 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-colors">App Store</button>
         </div>
      </section>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
    }
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
