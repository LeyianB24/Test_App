import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Tooltip Component
 * Displays helpful information on hover or focus
 * Supports multiple positions and themes
 */
@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tooltip-wrapper" [class.active]="isVisible()">
      <button
        type="button"
        class="tooltip-trigger"
        (mouseenter)="show()"
        (mouseleave)="hide()"
        (focus)="show()"
        (blur)="hide()"
        [attr.aria-label]="'Help: ' + content"
        aria-describedby="tooltip-content">
        <span class="tooltip-icon">?</span>
      </button>

      <div 
        *ngIf="isVisible()" 
        id="tooltip-content"
        class="tooltip-content"
        [ngClass]="'tooltip-' + position"
        role="tooltip">
        {{ content }}
        <div class="tooltip-arrow"></div>
      </div>
    </div>
  `,
  styles: [`
    .tooltip-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    .tooltip-trigger {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--bg-hover);
      border: 1.5px solid var(--border-color);
      color: var(--text-muted);
      cursor: help;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 900;
      transition: all 0.3s;
    }

    .tooltip-trigger:hover {
      background: var(--kra-red-subtle);
      border-color: var(--kra-red);
      color: var(--kra-red);
    }

    .tooltip-content {
      position: absolute;
      background: var(--bg-surface);
      border: 1.5px solid var(--border-color);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      white-space: nowrap;
      animation: slideInUp 0.2s ease;
      line-height: 1.4;
    }

    .tooltip-top {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
    }

    .tooltip-bottom {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 8px;
    }

    .tooltip-left {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 8px;
      white-space: normal;
      max-width: 200px;
    }

    .tooltip-right {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 8px;
      white-space: normal;
      max-width: 200px;
    }

    .tooltip-arrow {
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--bg-surface);
      border: 1.5px solid var(--border-color);
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
    }

    .tooltip-top .tooltip-arrow {
      bottom: -6px;
      left: 50%;
      margin-left: -4px;
    }

    .tooltip-bottom .tooltip-arrow {
      top: -6px;
      left: 50%;
      margin-left: -4px;
    }

    .tooltip-left .tooltip-arrow {
      right: -6px;
      top: 50%;
      margin-top: -4px;
    }

    .tooltip-right .tooltip-arrow {
      left: -6px;
      top: 50%;
      margin-top: -4px;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class TooltipComponent {
  @Input() content: string = '';
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  isVisible = signal(false);

  show(): void {
    this.isVisible.set(true);
  }

  hide(): void {
    this.isVisible.set(false);
  }
}
