import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-notification-hub',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <header class="mb-12 flex justify-between items-end">
        <div>
          <h1 class="text-5xl font-black text-white tracking-tighter mb-2">Notification <span class="text-red-500">Nexus</span></h1>
          <p class="text-slate-400 font-medium text-lg">Central intelligence hub for all system alerts, compliance notices, and transactional updates.</p>
        </div>
        <div class="flex gap-4">
          <button (click)="ns.markAllAsRead()" class="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5">
            Dismiss All
          </button>
          <button (click)="ns.clearAll()" class="bg-red-600/10 hover:bg-red-600/20 text-red-500 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-red-500/10">
            Purge Archives
          </button>
        </div>
      </header>

      <div class="max-w-4xl mx-auto space-y-4">
        @for (n of ns.notifications(); track n.id) {
          <div 
            class="notif-card group p-8 rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-md hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 relative overflow-hidden"
            [class.unread-glow]="!n.read"
          >
            <!-- Priority Indicator -->
            <div 
              class="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500"
              [class.bg-emerald-500]="n.type === 'success'"
              [class.bg-amber-500]="n.type === 'warning'"
              [class.bg-red-500]="n.type === 'error'"
              [class.bg-indigo-500]="n.type === 'info'"
            ></div>

            <div class="flex gap-8 items-start">
               <!-- Icon Nexus -->
               <div 
                class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border"
                [class.bg-emerald-500/10]="n.type === 'success'" [class.border-emerald-500/20]="n.type === 'success'" [class.text-emerald-400]="n.type === 'success'"
                [class.bg-amber-500/10]="n.type === 'warning'" [class.border-amber-500/20]="n.type === 'warning'" [class.text-amber-400]="n.type === 'warning'"
                [class.bg-red-500/10]="n.type === 'error'" [class.border-red-500/20]="n.type === 'error'" [class.text-red-400]="n.type === 'error'"
                [class.bg-indigo-500/10]="n.type === 'info'" [class.border-indigo-500/20]="n.type === 'info'" [class.text-indigo-400]="n.type === 'info'"
               >
                  @if (n.type === 'success') {
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
                  } @else if (n.type === 'warning') {
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  } @else if (n.type === 'error') {
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  } @else {
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  }
               </div>

               <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-center mb-2">
                     <h4 class="text-xl font-black text-white tracking-tight uppercase truncate mr-4">{{ n.title }}</h4>
                     <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest shrink-0">{{ n.time }}</span>
                  </div>
                  <p class="text-slate-400 font-medium leading-relaxed mb-6">{{ n.message }}</p>
                  
                  <div class="flex items-center gap-6">
                     @if (!n.read) {
                        <button (click)="ns.markAsRead(n.id)" class="text-red-500 font-black text-[10px] uppercase tracking-widest hover:text-red-400 transition-colors">
                           Mark as Acknowledged
                        </button>
                     }
                  </div>
               </div>
            </div>
          </div>
        } @empty {
          <div class="py-32 text-center animate-fade-in">
             <div class="w-32 h-32 bg-white/5 rounded-[3rem] border border-white/5 mx-auto mb-10 flex items-center justify-center text-slate-600">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
             </div>
             <h3 class="text-3xl font-black text-white tracking-tighter mb-2">Nexus Clear</h3>
             <p class="text-slate-500 font-medium text-lg">Your intelligence queue is currently empty.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; }
    .unread-glow { box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.1) !important; }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class NotificationHubComponent {
  ns = inject(NotificationService);
}
