import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
  duration?: number;
  dismissible?: boolean;
}

/**
 * Enhanced Toast Notification Component
 * Displays toast notifications with animations and auto-dismiss
 * Integrates with NotificationService for app-wide notifications
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toast-container',
  imports: [],
  template: `
    <div class="toast-container-precision" role="region" aria-label="Notifications" aria-live="polite">
      @for (toast of toasts(); track toast.id) {
        <div class="toast-precision animate-slide-in-right"
             [class.success]="toast.type === 'success'"
             [class.error]="toast.type === 'error'"
             [class.warning]="toast.type === 'warning'"
             [class.info]="toast.type === 'info'"
             role="alert"
             [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'">
          
          <div class="toast-accent-precision"></div>
          
          <!-- Tactical Icon -->
          <div class="toast-icon-precision flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
            <span class="text-sm">{{ toast.icon }}</span>
          </div>

          <!-- Content Sequence -->
          <div class="toast-content-precision">
            <h4 class="toast-title-precision">{{ toast.title }}</h4>
            <p class="toast-message-precision">{{ toast.message }}</p>
          </div>

          <!-- Abort Interaction -->
          @if (toast.dismissible !== false) {
            <button type="button"
                    class="btn-precision btn-secondary-precision btn-sm px-2 border-none opacity-40 hover:opacity-100"
                    (click)="removeToast(toast.id)"
                    aria-label="Dismiss">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          }

          <!-- Depletion Gauge -->
          @if (toast.duration) {
            <div class="toast-progress-precision"
                 [style.animationDuration]="toast.duration + 'ms'">
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-slide-in-right {
      animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class ToastContainerComponent {
  toasts = signal<Toast[]>([]);

  private toastMap = new Map<string, ReturnType<typeof setTimeout>>();

  addToast(toast: Omit<Toast, 'id'>): void {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const fullToast: Toast = { ...toast, id };

    this.toasts.update(toasts => [...toasts, fullToast]);

    // Auto-dismiss if duration is set
    if (toast.duration) {
      const timeout = setTimeout(() => {
        this.removeToast(id);
      }, toast.duration);
      this.toastMap.set(id, timeout);
    }
  }

  removeToast(id: string): void {
    // Clear timeout if exists
    const timeout = this.toastMap.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.toastMap.delete(id);
    }

    // Remove toast from list
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  clear(): void {
    this.toastMap.forEach(timeout => clearTimeout(timeout));
    this.toastMap.clear();
    this.toasts.set([]);
  }
}
