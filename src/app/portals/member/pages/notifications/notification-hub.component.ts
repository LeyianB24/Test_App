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
          <h1 class="text-5xl font-black text-primary tracking-tighter mb-2">My <span class="text-accent">Notifications</span></h1>
          <p class="text-tertiary font-medium text-lg">View all your alerts and updates.</p>
        </div>
        <div class="flex gap-4">
          <button (click)="ns.markAllAsRead()" class="bg-surface-2 hover:bg-hover text-primary px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-default">
            Dismiss All
          </button>
          <button (click)="ns.clearAll()" class="bg-status-danger text-danger px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-danger-border/10">
            Clear All
          </button>
        </div>
      </header>

      <div class="max-w-4xl mx-auto space-y-4">
        @for (n of ns.notifications(); track n.id) {
          <div 
            class="notif-card group p-8 rounded-[2.5rem] border border-default bg-surface-1 backdrop-blur-md hover:bg-hover transition-all duration-300 relative overflow-hidden"
            [class.unread-glow]="!n.read"
          >
            <!-- Priority Indicator -->
            <div 
              class="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500"
              [class.bg-success]="n.type === 'success'"
              [class.bg-warning]="n.type === 'warning'"
              [class.bg-danger]="n.type === 'error'"
              [class.bg-info]="n.type === 'info'"
            ></div>

            <div class="flex gap-8 items-start">
               <!-- Icon Nexus -->
               <div 
                class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border"
                [class.bg-status-success]="n.type === 'success'" [class.border-success-border/20]="n.type === 'success'" [class.text-success]="n.type === 'success'"
                [class.bg-status-warning]="n.type === 'warning'" [class.border-warning-border/20]="n.type === 'warning'" [class.text-warning]="n.type === 'warning'"
                [class.bg-status-danger]="n.type === 'error'" [class.border-danger-border/20]="n.type === 'error'" [class.text-danger]="n.type === 'error'"
                [class.bg-status-info]="n.type === 'info'" [class.border-info-border/20]="n.type === 'info'" [class.text-info]="n.type === 'info'"
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
                     <h4 class="text-xl font-black text-primary tracking-tight uppercase truncate mr-4">{{ n.title }}</h4>
                     <span class="text-[10px] font-bold text-tertiary uppercase tracking-widest shrink-0">{{ n.time }}</span>
                  </div>
                  <p class="text-secondary font-medium leading-relaxed mb-6">{{ n.message }}</p>
                  
                  <div class="flex items-center gap-6">
                     @if (!n.read) {
                        <button (click)="ns.markAsRead(n.id)" class="text-accent font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                           Mark as Read
                        </button>
                     }
                  </div>
               </div>
            </div>
          </div>
        } @empty {
          <div class="py-32 text-center animate-fade-in">
             <div class="w-32 h-32 bg-surface-1 rounded-[3rem] border border-default mx-auto mb-10 flex items-center justify-center text-tertiary shadow-xl shadow-black/5">
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
             </div>
             <h3 class="text-3xl font-black text-primary tracking-tighter mb-2">No Notifications</h3>
             <p class="text-tertiary font-medium text-lg">You have no new notifications.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; }
    .unread-glow { box-shadow: inset 0 0 20px rgba(var(--success-base-rgb), 0.05); border-color: var(--border-accent-subtle) !important; }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class NotificationHubComponent {
  ns = inject(NotificationService);
}
