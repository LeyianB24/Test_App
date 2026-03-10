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
      <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              MESSAGE TERMINAL
            </span>
          </div>
          <h1 class="premium-title">Intelligence <span class="gradient-text">Hub</span></h1>
          <p class="premium-subtitle">Authorized log of system events, security alerts, and compliance directives</p>
        </div>
        <div class="flex gap-4">
          <button (click)="ns.markAllAsRead()" class="modern-btn outline-btn py-3 px-6 text-xs">
            Mark all as read
          </button>
          <button (click)="ns.clearAll()" class="modern-btn outline-btn py-3 px-6 text-xs !text-red-400 !border-red-500/20 hover:!bg-red-500/10">
            Clear Archives
          </button>
        </div>
      </header>

      <div class="glass-panel p-0 overflow-hidden relative">
        <div class="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
           <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Active Notifications ({{ ns.notifications().length }})</h3>
        </div>

        <div class="divide-y divide-white/5">
          @for (note of ns.notifications(); track note.id) {
            <div class="p-8 transition-all hover:bg-white/[0.02] flex gap-6 relative group" [class.bg-blue-500/5]="!note.read">
               @if (!note.read) {
                 <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
               }
               
               <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg" [class]="getIconClass(note.type)">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                     @switch (note.type) {
                        @case ('success') { <path d="M5 13l4 4L19 7"/> }
                        @case ('warning') { <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/> }
                        @case ('error') { <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/> }
                        @case ('info') { <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/> }
                     }
                  </svg>
               </div>

               <div class="flex-grow">
                  <div class="flex items-center justify-between mb-2">
                     <h4 class="text-sm font-black text-white tracking-tight uppercase">{{ note.title }}</h4>
                     <span class="text-[10px] font-bold text-slate-500">{{ note.id | date:'HH:mm • dd MMM' }}</span>
                  </div>
                  <p class="text-slate-400 text-sm leading-relaxed mb-4 max-w-4xl">{{ note.message }}</p>
                  
                  <div class="flex items-center gap-4">
                    @if (!note.read) {
                      <button (click)="ns.markAsRead(note.id)" class="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">
                        Mark as Read
                      </button>
                    }
                    <button (click)="archive(note.id)" class="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors">
                      Archive
                    </button>
                  </div>
               </div>
            </div>
          } @empty {
            <div class="py-32 text-center">
              <div class="w-20 h-20 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center mx-auto mb-6 text-slate-700">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
              </div>
              <h3 class="text-white font-black uppercase tracking-widest mb-2">Inbox Depleted</h3>
              <p class="text-slate-500 text-sm">No tactical directives or system alerts present.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .get-success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #10b981; }
    .get-warning { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .get-error   { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; }
    .get-info    { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: #3b82f6; }
  `]
})
export class NotificationHubComponent {
  ns = inject(NotificationService);

  archive(id: number) { this.ns.remove(id); }

  getIconClass(type: string) {
    return 'get-' + type;
  }
}
