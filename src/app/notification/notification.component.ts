import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngFor and *ngIf
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  standalone: true, // <--- Crucial for your project setup
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div *ngFor="let note of notificationService.notifications$ | async"
           class="toast"
           [ngClass]="note.type">
        <span>{{ note.message }}</span>
        <button (click)="notificationService.remove(note.id)">×</button>
      </div>
    </div>
  `,
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {}
}
