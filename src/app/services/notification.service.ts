import { Injectable, signal, computed } from '@angular/core';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = signal<AppNotification[]>([
    { id: 1, title: 'Compliance Received', message: 'Your VAT return for January 2026 has been successfully transmitted.', time: '2m', read: false, type: 'success' },
    { id: 2, title: 'Payment Authorized', message: 'The protocol for PRN 2025000456 has been localized and settled.', time: '1h', read: false, type: 'info' },
    { id: 3, title: 'Threshold Warning', message: 'Instalment Tax for Q1 2026 is approaching statutory deadline.', time: '4h', read: false, type: 'warning' },
    { id: 4, title: 'System Pulse', message: 'Biometric authorization successfully rotated in your security terminal.', time: 'Yesterday', read: true, type: 'success' }
  ]);

  notifications = computed(() => this._notifications());
  unreadCount = computed(() => this._notifications().filter(n => !n.read).length);

  addNotification(title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') {
    const newNotif: AppNotification = {
      id: Date.now(),
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    this._notifications.update(list => [newNotif, ...list]);
  }

  markAsRead(id: number) {
    this._notifications.update(list => 
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead() {
    this._notifications.update(list => 
      list.map(n => ({ ...n, read: true }))
    );
  }

  clearAll() {
    this._notifications.set([]);
  }
}
