import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifications$ = new BehaviorSubject<Notification[]>([]);
  private notifications: Notification[] = [];

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = Date.now();
    this.notifications.push({ id, message, type });
    this.notifications$.next(this.notifications);

    setTimeout(() => this.remove(id), 3000); // Auto-close after 3s
  }

  remove(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifications$.next(this.notifications);
  }
}
