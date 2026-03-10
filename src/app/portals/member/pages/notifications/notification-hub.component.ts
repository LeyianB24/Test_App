import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-notification-hub',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              MESSAGE TERMINAL ARCHIVE
            </span>
          </div>
          <h1 class="premium-title">Intelligence <span class="gradient-text">Hub</span></h1>
          <p class="premium-subtitle">Authorized log of statutory directives, system events, and compliance alerts</p>
        </div>
        
        <div class="flex items-center gap-4">
          <button (click)="ns.markAllAsRead()" class="modern-btn border-white/5 text-slate-500 hover:text-white px-6 py-3 rounded-xl transition-all shadow-xl font-black text-[10px] uppercase tracking-widest bg-slate-900/40">
            MARK ALL READ
          </button>
          <button (click)="ns.clearAll()" class="modern-btn border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl transition-all shadow-xl font-black text-[10px] uppercase tracking-widest">
            CLEAR LOGS
          </button>
        </div>
      </header>

      <div class="glass-panel p-0 rounded-[3rem] bg-white/[0.01] border-white/5 shadow-2xl relative overflow-hidden transition-all duration-1000">
        <div class="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between relative z-10">
           <div class="flex items-center gap-4">
              <div class="w-1.5 h-10 bg-blue-500 rounded-full"></div>
              <h3 class="text-xs font-black text-white uppercase tracking-[0.2em]">Active Directives Archive ({{ ns.notifications().length }})</h3>
           </div>
           <div class="text-[9px] font-black text-slate-600 uppercase tracking-widest">System Synchronized • {{ today | date:'HH:mm' }}</div>
        </div>

        <div class="divide-y divide-white/5 relative z-10">
          @for (note of ns.notifications(); track note.id) {
            <div class="p-10 transition-all hover:bg-white/[0.02] flex gap-10 relative group" [class.bg-blue-500/[0.03]]="!note.read">
               @if (!note.read) {
                 <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
               }
               
               <div class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden" [class]="getIconClass(note.type)">
                  <div class="absolute inset-0 bg-current opacity-10"></div>
                  <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="relative z-10">
                     @switch (note.type) {
                        @case ('success') { <path d="M5 13l4 4L19 7"/> }
                        @case ('warning') { <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/> }
                        @case ('error') { <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/> }
                        @case ('info') { <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/> }
                     }
                  </svg>
               </div>

               <div class="flex-grow">
                  <div class="flex items-center justify-between mb-3">
                     <h4 class="text-lg font-black text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors">{{ note.title }}</h4>
                     <span class="text-[10px] font-black text-slate-500 bg-slate-950 border border-white/5 px-3 py-1 rounded-lg tabular-nums tracking-widest">{{ note.id | date:'HH:mm • dd MMM yy' | uppercase }}</span>
                  </div>
                  <p class="text-slate-400 text-sm leading-relaxed mb-8 max-w-5xl font-medium">{{ note.message }}</p>
                  
                  <div class="flex items-center gap-8">
                    @if (!note.read) {
                      <button (click)="ns.markAsRead(note.id)" class="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-white transition-all flex items-center gap-2">
                         <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                         Mark as READ
                      </button>
                    }
                    <button (click)="archive(note.id)" class="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] hover:text-red-500 transition-all">
                       Archive Directive
                    </button>
                  </div>
               </div>
            </div>
          } @empty {
            <div class="py-40 text-center flex flex-col items-center">
              <div class="w-24 h-24 rounded-[2rem] bg-slate-950 border border-white/5 flex items-center justify-center mb-8 text-slate-800 shadow-2xl relative overflow-hidden group">
                <div class="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-colors"></div>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
              </div>
              <h3 class="text-white font-black uppercase tracking-[0.3em] mb-3 text-sm">Registry Depleted</h3>
              <p class="text-slate-600 text-[10px] font-black uppercase tracking-widest max-w-xs opacity-60">No active directives or system notifications present in the communication array.</p>
            </div>
          }
        </div>
      </div>
      
      <!-- Theme Adherence Footer -->
      <footer class="mt-20 p-10 glass-panel border-white/5 bg-white/[0.01] text-center !rounded-[3rem] relative overflow-hidden">
         <div class="absolute -right-24 -bottom-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]"></div>
         <p class="text-[10px] text-slate-700 font-bold uppercase tracking-[0.5em] leading-relaxed max-w-4xl mx-auto relative z-10">
            OFFICIAL COMMUNICATION TERMINAL • AUTHORIZED BY KENYA REVENUE AUTHORITY • ENCRYPTED PAYLOAD
         </p>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .get-success { color: #10b981; }
    .get-warning { color: #f59e0b; }
    .get-error   { color: #ef4444; }
    .get-info    { color: #3b82f6; }
  `]
})
export class NotificationHubComponent {
  ns = inject(NotificationService);
  today = new Date();

  archive(id: number) { this.ns.remove(id); }

  getIconClass(type: string) {
    return 'get-' + type;
  }
}
