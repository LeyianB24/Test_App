import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from '../../../../services/notification.service';

@Component({
  selector: 'app-notification-hub',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hub-container p-6">
      <header class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Notification Hub</h1>
          <p class="text-slate-500 mt-1">Real-time alerts and system updates</p>
        </div>
        <div class="flex gap-3">
          <button class="btn-secondary text-sm" (click)="ns.markAllAsRead()">Mark all as read</button>
          <button class="btn-ghost text-sm text-red-600" (click)="ns.clearAll()">Clear all</button>
        </div>
      </header>

      <div class="notifications-list flex flex-col gap-4">
        @for (n of ns.notifications(); track n.id) {
          <div class="notif-card" [class.unread]="!n.read">
            <div class="icon-wrap" [class]="n.type">
              @if (n.type === 'success') {
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              } @else if (n.type === 'warning') {
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              } @else if (n.type === 'error') {
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              } @else {
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              }
            </div>
            <div class="content">
              <div class="flex justify-between items-start mb-1">
                <h4 class="title text-slate-800 font-bold">{{ n.title }}</h4>
                <span class="time text-slate-400 text-xs font-medium">{{ n.time }}</span>
              </div>
              <p class="message text-slate-600 text-sm leading-relaxed">{{ n.message }}</p>
              @if (!n.read) {
                <button class="mt-3 text-xs font-extrabold text-red-600 hover:underline" (click)="ns.markAsRead(n.id)">Mark as Read</button>
              }
            </div>
          </div>
        } @empty {
          <div class="empty-state py-20 text-center">
            <div class="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#cbd5e1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-400">All caught up!</h3>
            <p class="text-slate-300 text-sm">You have no new notifications.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .hub-container { max-width: 900px; margin: 0 auto; }
    
    .btn-secondary { padding: 10px 20px; border-radius: 12px; background: white; border: 2px solid #f1f5f9; color: #64748b; font-weight: 800; cursor: pointer; transition: 0.3s; }
    .btn-secondary:hover { border-color: #e2e8f0; color: #1e293b; }
    .btn-ghost { padding: 10px 20px; border: none; background: transparent; font-weight: 800; cursor: pointer; transition: 0.3s; }

    .notif-card { 
      display: flex; gap: 20px; padding: 24px; background: white; border-radius: 20px; 
      border: 1px solid #f1f5f9; transition: 0.3s; position: relative;
    }
    .notif-card.unread { border-left: 4px solid #e31e24; background: #fffcfc; }
    .notif-card:hover { transform: translateX(4px); border-color: #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }

    .icon-wrap { 
      width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; 
      flex-shrink: 0; 
    }
    .icon-wrap.success { background: #dcfce7; color: #166534; }
    .icon-wrap.warning { background: #fef3c7; color: #92400e; }
    .icon-wrap.error { background: #fee2e2; color: #991b1b; }
    .icon-wrap.info { background: #e0f2fe; color: #0369a1; }

    .content { flex: 1; }
  `]
})
export class NotificationHubComponent {
  ns = inject(NotificationService);
}
