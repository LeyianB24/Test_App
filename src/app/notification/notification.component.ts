import { inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from '../core/services/notification.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-notification',
  imports: [],
  template: `
    <div class="toast-container-precision" role="region" aria-label="Notifications" aria-live="polite">
      @for (note of notificationService.notifications(); track note.id) {
        <div class="toast-precision animate-slide-in-right"
             [class.success]="note.type === 'success'"
             [class.error]="note.type === 'error'"
             [class.warning]="note.type === 'warning'"
             [class.info]="note.type === 'info'"
             role="alert">
          
          <div class="toast-accent-precision"></div>
          
          <div class="toast-icon-precision flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
             @if (note.type === 'success') { <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M5 13l4 4L19 7"/></svg> }
             @else if (note.type === 'error') { <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg> }
             @else { <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> }
          </div>

          <div class="toast-content-precision">
            @if (note.title) {
              <h4 class="toast-title-precision">{{ note.title }}</h4>
            }
            <p class="toast-message-precision">{{ note.message }}</p>
          </div>

          <button class="btn-precision btn-secondary-precision btn-sm px-2 border-none opacity-40 hover:opacity-100" 
                  (click)="notificationService.remove(note.id)"
                  aria-label="Dismiss">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; z-index: 1000; }
    .animate-slide-in-right {
      animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}
