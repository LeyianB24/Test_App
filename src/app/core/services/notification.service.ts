import { Injectable, signal, computed } from '@angular/core';
export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  read?: boolean;
  title?: string;
  time?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationQueue = signal<Notification[]>([]);
  readonly notifications = this.notificationQueue.asReadonly();
  
  readonly unreadCount = computed(() => 
    this.notifications().filter(n => !n.read).length
  );

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 4000, title?: string) {
    const id = Date.now();
    const notification: Notification = { 
      id, 
      message, 
      type, 
      duration, 
      read: false,
      title: title || type.toUpperCase(),
      time: 'Just now'
    };
    
    this.notificationQueue.update(queue => [notification, ...queue]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  showSuccess(message: string, title?: string) { this.show(message, 'success', 4000, title); }
  showError(message: string, title?: string) { this.show(message, 'error', 0, title); }
  showWarning(message: string, title?: string) { this.show(message, 'warning', 6000, title); }
  showInfo(message: string, title?: string) { this.show(message, 'info', 4000, title); }

  markAsRead(id: number) {
    this.notificationQueue.update(queue => 
      queue.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead() {
    this.notificationQueue.update(queue => 
      queue.map(n => ({ ...n, read: true }))
    );
  }

  remove(id: number) {
    this.notificationQueue.update(queue => queue.filter(n => n.id !== id));
  }

  clearAll() {
    this.notificationQueue.set([]);
  }
}
