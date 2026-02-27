import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (note of notificationService.notifications(); track note.id) {
        <div class="toast" [class]="note.type">
          <div class="toast-content">
            @if (note.title) {
              <strong class="toast-title">{{ note.title }}</strong>
            }
            <span class="toast-message">{{ note.message }}</span>
          </div>
          <button class="close-btn" (click)="notificationService.remove(note.id)">×</button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}
