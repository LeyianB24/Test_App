import { Component, Input, input, ChangeDetectionStrategy } from '@angular/core';
/**
 * Skeleton Loading Component
 * Shows animated skeleton placeholders while content is loading
 * Prevents layout shift and improves perceived performance
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-skeleton-loader',
  imports: [],
  template: `
    <div class="skeleton-shell animate-fade-in">
      <!-- High-Precision Card Skeleton -->
      @if (type === 'card') {
        <div class="skeleton-card-precision">
          <div class="skeleton-precision skeleton-title-precision"></div>
          <div class="skeleton-precision skeleton-text-precision" style="width: 90%"></div>
          <div class="skeleton-precision skeleton-text-precision" style="width: 75%"></div>
        </div>
      }

      <!-- Operational Stat Skeleton -->
      @if (type === 'stat') {
        <div class="skeleton-card-precision flex-row items-center gap-6">
          <div class="skeleton-precision skeleton-avatar-precision flex-shrink-0"></div>
          <div class="flex-1 space-y-3">
            <div class="skeleton-precision skeleton-text-precision" style="width: 40%"></div>
            <div class="skeleton-precision skeleton-title-precision" style="width: 80%"></div>
          </div>
        </div>
      }

      <!-- Registry Table Skeleton -->
      @if (type === 'table') {
        <div class="skeleton-card-precision p-0 border-white/5 bg-transparent overflow-hidden">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="skeleton-table-row-precision flex items-center gap-8 px-8 border-b border-white/5">
              <div class="skeleton-precision" style="width: 15%"></div>
              <div class="skeleton-precision" style="width: 30%"></div>
              <div class="skeleton-precision" style="width: 20%"></div>
              <div class="skeleton-precision" style="width: 15%"></div>
              <div class="skeleton-precision" style="width: 10%"></div>
            </div>
          }
        </div>
      }

      <!-- Protocol List Skeleton -->
      @if (type === 'list') {
        <div class="skeleton-card-precision flex-row gap-4 p-4 border-white/5 mb-4">
          <div class="skeleton-precision h-10 w-10 rounded-xl"></div>
          <div class="flex-1 space-y-2">
            <div class="skeleton-precision h-3 w-1/3"></div>
            <div class="skeleton-precision h-2 w-1/2"></div>
          </div>
        </div>
      }

      <!-- Directive Form Skeleton -->
      @if (type === 'form') {
        <div class="space-y-6">
          <div class="skeleton-precision h-3 w-24"></div>
          <div class="skeleton-precision h-12 w-full rounded-2xl"></div>
        </div>
      }

      <!-- Data Transmission (Chart) Skeleton -->
      @if (type === 'chart') {
        <div class="skeleton-card-precision h-[240px] flex items-end justify-between gap-4 py-8">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="skeleton-precision rounded-t-xl" [style.height]="getRandomHeight()" style="width: 8%"></div>
          }
        </div>
      }

      <!-- Recursive List Sequence -->
      @if (type === 'list-multiple') {
        <div class="space-y-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="skeleton-card-precision flex-row gap-4 p-4 border-white/5">
              <div class="skeleton-precision h-10 w-10 rounded-xl"></div>
              <div class="flex-1 space-y-2">
                <div class="skeleton-precision h-3 w-1/4"></div>
                <div class="skeleton-precision h-2 w-1/3"></div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .skeleton-shell { width: 100%; }
  `]
})
export class SkeletonLoaderComponent {
  type = input<'card' | 'stat' | 'table' | 'list' | 'form' | 'chart' | 'list-multiple'>('card');
  width = input<string>('100%');
  count = input<number>(1);

  getRandomHeight(): string {
    const heights = ['60%', '70%', '50%', '80%', '65%'];
    return heights[Math.floor(Math.random() * heights.length)];
  }
}
