import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      <div *ngFor="let toast of toasts()"
           [ngClass]="'toast-elite ' + toast.type"
           [@slideIn]
           role="alert"
           [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'">

        <!-- Toast Icon -->
        <span class="toast-icon">{{ toast.icon }}</span>

        <!-- Toast Content -->
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>

        <!-- Close Button -->
        <button *ngIf="toast.dismissible !== false"
                type="button"
                class="toast-close"
                (click)="removeToast(toast.id)"
                aria-label="Close notification">
          ✕
        </button>

        <!-- Progress Bar -->
        <div *ngIf="toast.duration"
             class="toast-progress"
             [style.animation]="'progress-bar ' + (toast.duration / 1000) + 's linear'">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      max-width: 420px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .toast-elite {
      background: var(--bg-surface);
      border: 1.5px solid var(--border-color);
      border-radius: 16px;
      padding: 16px 20px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      animation: slideInUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
      border-left: 4px solid var(--kra-red);
      position: relative;
      overflow: hidden;
    }

    .toast-elite.success {
      border-left-color: #10B981;
    }

    .toast-elite.warning {
      border-left-color: #F59E0B;
    }

    .toast-elite.info {
      border-left-color: #3B82F6;
    }

    .toast-elite.error {
      border-left-color: #EF4444;
    }

    .toast-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }

    .toast-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .toast-title {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-main);
    }

    .toast-message {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0;
      transition: color 0.3s;
      flex-shrink: 0;
      margin-left: auto;
    }

    .toast-close:hover {
      color: var(--text-main);
    }

    .toast-close:focus {
      outline: 2px solid var(--kra-red);
      outline-offset: 2px;
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: var(--kra-red);
      border-radius: 0 0 12px 0;
    }

    .toast-elite.success .toast-progress {
      background: #10B981;
    }

    .toast-elite.warning .toast-progress {
      background: #F59E0B;
    }

    .toast-elite.info .toast-progress {
      background: #3B82F6;
    }

    .toast-elite.error .toast-progress {
      background: #EF4444;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .toast-container {
        bottom: 12px;
        right: 12px;
        left: 12px;
        max-width: none;
      }

      .toast-elite {
        border-radius: 12px;
        padding: 12px 16px;
      }
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
