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
    <div class="tooltip-wrapper-precision inline-flex items-center relative" [class.active-precision]="isVisible()">
      <button
        type="button"
        class="tooltip-trigger-precision w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white/40 flex items-center justify-center text-[10px] font-black hover:bg-red-base/10 hover:border-red-base/40 hover:text-red-base transition-all cursor-help"
        (mouseenter)="show()"
        (mouseleave)="hide()"
        (focus)="show()"
        (blur)="hide()"
        [attr.aria-label]="'Protocol: ' + content"
        aria-describedby="tooltip-content">
        ?
      </button>

      @if (isVisible()) {
        <div 
          id="tooltip-content"
          class="tooltip-content-precision absolute z-[600] min-w-[200px] p-4 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in"
          [ngClass]="'position-' + position"
          role="tooltip">
          <p class="text-[11px] font-medium leading-relaxed text-white/70">{{ content }}</p>
          <div class="tooltip-arrow-precision absolute w-2 h-2 bg-black border border-white/10 border-t-0 border-l-0 rotate-45"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; }
    .tooltip-content-precision.position-top { bottom: calc(100% + 12px); left: 50%; transform: translateX(-50%); }
    .tooltip-content-precision.position-bottom { top: calc(100% + 12px); left: 50%; transform: translateX(-50%); }
    .tooltip-content-precision.position-left { right: calc(100% + 12px); top: 50%; transform: translateY(-50%); }
    .tooltip-content-precision.position-right { left: calc(100% + 12px); top: 50%; transform: translateY(-50%); }

    .position-top .tooltip-arrow-precision { bottom: -5px; left: 50%; margin-left: -4px; }
    .position-bottom .tooltip-arrow-precision { top: -5px; left: 50%; margin-left: -4px; box-shadow: -1px -1px 0 rgba(255,255,255,0.05); }
    .position-left .tooltip-arrow-precision { right: -5px; top: 50%; margin-top: -4px; }
    .position-right .tooltip-arrow-precision { left: -5px; top: 50%; margin-top: -4px; }
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
