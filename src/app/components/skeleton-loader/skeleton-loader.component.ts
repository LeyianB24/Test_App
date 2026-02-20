import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Skeleton Loading Component
 * Shows animated skeleton placeholders while content is loading
 * Prevents layout shift and improves perceived performance
 */
@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container">
      <!-- Card Skeleton -->
      <div *ngIf="type === 'card'" class="skeleton-card">
        <div [style.width]="width" class="skeleton-loading skeleton-title"></div>
        <div class="skeleton-loading skeleton-text" [style.width]="'90%'"></div>
        <div class="skeleton-loading skeleton-text" [style.width]="'80%'"></div>
      </div>

      <!-- Stat Card Skeleton -->
      <div *ngIf="type === 'stat'" class="skeleton-stat-card">
        <div class="skeleton-stat-icon skeleton-loading skeleton-avatar"></div>
        <div class="skeleton-stat-content">
          <div class="skeleton-loading skeleton-text" [style.width]="'70%'"></div>
          <div class="skeleton-loading skeleton-title" [style.width]="'90%'"></div>
        </div>
      </div>

      <!-- Table Row Skeleton -->
      <div *ngIf="type === 'table'" class="skeleton-table-row">
        <div class="skeleton-cell skeleton-loading" [style.width]="'15%'"></div>
        <div class="skeleton-cell skeleton-loading" [style.width]="'25%'"></div>
        <div class="skeleton-cell skeleton-loading" [style.width]="'20%'"></div>
        <div class="skeleton-cell skeleton-loading" [style.width]="'25%'"></div>
        <div class="skeleton-cell skeleton-loading" [style.width]="'15%'"></div>
      </div>

      <!-- List Item Skeleton -->
      <div *ngIf="type === 'list'" class="skeleton-list-item">
        <div class="skeleton-loading skeleton-avatar"></div>
        <div style="flex: 1;">
          <div class="skeleton-loading skeleton-text" [style.width]="'60%'"></div>
          <div class="skeleton-loading skeleton-text" [style.width]="'40%'"></div>
        </div>
      </div>

      <!-- Form Field Skeleton -->
      <div *ngIf="type === 'form'">
        <div class="skeleton-loading skeleton-text" [ngStyle]="{'width': '30%', 'margin-bottom': '8px'}"></div>
        <div class="skeleton-loading skeleton-loading" [ngStyle]="{'height': '40px', 'border-radius': '12px'}"></div>
      </div>

      <!-- Chart/Bar Skeleton -->
      <div *ngIf="type === 'chart'" class="skeleton-bar-chart">
        <div *ngFor="let i of [1,2,3,4,5]" class="skeleton-bar-item">
          <div class="skeleton-bar skeleton-loading" [style.height]="getRandomHeight()"></div>
        </div>
      </div>

      <!-- Multiple Skeletons -->
      <ng-container *ngIf="type === 'list-multiple'">
        <div *ngFor="let i of [1,2,3]" class="skeleton-list-item" style="margin-bottom: 16px;">
          <div class="skeleton-loading skeleton-avatar"></div>
          <div style="flex: 1;">
            <div class="skeleton-loading skeleton-text" [style.width]="'60%'"></div>
            <div class="skeleton-loading skeleton-text" [style.width]="'40%'"></div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .skeleton-container {
      width: 100%;
    }

    .skeleton-card {
      padding: 24px;
      background: var(--bg-surface);
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }

    .skeleton-stat-card {
      padding: 24px;
      display: flex;
      gap: 16px;
      background: var(--bg-surface);
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }

    .skeleton-stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      flex-shrink: 0;
    }

    .skeleton-stat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .skeleton-bar-chart {
      display: flex;
      gap: 12px;
      align-items: flex-end;
      justify-content: space-between;
      height: 200px;
      padding: 20px 0;
    }

    .skeleton-bar-item {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .skeleton-bar {
      width: 100%;
      border-radius: 8px;
      min-width: 20px;
    }

    .skeleton-text {
      height: 16px;
      width: 100%;
      margin-bottom: 8px;
      border-radius: 8px;
    }

    .skeleton-title {
      height: 24px;
      width: 100%;
      margin-bottom: 12px;
      border-radius: 8px;
    }

    .skeleton-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .skeleton-table-row {
      display: flex;
      gap: 20px;
      padding: 20px 24px;
      background: var(--bg-surface);
      border-radius: 12px;
      margin-bottom: 12px;
    }

    .skeleton-cell {
      flex: 1;
      height: 16px;
    }

    .skeleton-list-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: var(--bg-surface);
      border-radius: 12px;
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    .skeleton-loading {
      background: linear-gradient(90deg, var(--bg-hover) 25%, var(--bg-surface) 50%, var(--bg-hover) 75%);
      background-size: 1000px 100%;
      animation: shimmer 2s infinite;
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'stat' | 'table' | 'list' | 'form' | 'chart' | 'list-multiple' = 'card';
  @Input() width: string = '100%';
  @Input() count: number = 1;

  getRandomHeight(): string {
    const heights = ['60%', '70%', '50%', '80%', '65%'];
    return heights[Math.floor(Math.random() * heights.length)];
  }
}
