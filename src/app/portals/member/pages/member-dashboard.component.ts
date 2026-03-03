import { Component, inject, computed, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardDataService } from '../../../services/dashboard-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface DashboardStat {
  label: string;
  value: number;
  type: 'currency' | 'percent' | 'count';
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  color: 'red' | 'green' | 'blue' | 'gold';
  icon: string;
}

@Component({
  selector: 'app-member-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="content-area animate-fade-in">
      <!-- Top Intelligence Bar -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight flex items-center gap-3">
              Wealth Terminal <span class="text-accent">Intelligence</span>
              <span class="status-pill-precision online">
                <span class="status-pill-dot"></span>
                v2.0 MASTER
              </span>
            </h1>
            <p class="text-tertiary mt-2 font-medium tracking-wide">Synchronized access for {{ userName() }}</p>
          </div>
          <div class="flex items-center gap-4">
            <button class="btn-precision btn-secondary-precision btn-sm" (click)="downloadStatusReport()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2"/></svg>
              Intelligence Report
            </button>
            <button class="btn-precision btn-primary-precision btn-sm" (click)="router.navigate(['/payments'])">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="2.5"/></svg>
              Execute Payment
            </button>
          </div>
        </div>
      </header>

      <div class="dashboard-grid-precision mb-10">
        @for (stat of stats(); track stat.label) {
          <div class="stat-card-precision">
            <div class="card-icon-box" [class]="stat.color">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-width="2" [attr.d]="stat.icon" />
              </svg>
            </div>
            <span class="card-label">{{ stat.label }}</span>
            <span class="card-value">{{ stat.formattedValue }}</span>
            <div class="delta-badge" [class.positive]="stat.trendDirection === 'up'" [class.negative]="stat.trendDirection === 'down'">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path *ngIf="stat.trendDirection === 'up'" d="M5 10l7-7 7 7M12 3v18" stroke-width="2.5"/>
                <path *ngIf="stat.trendDirection === 'down'" d="M19 14l-7 7-7-7M12 21V3" stroke-width="2.5"/>
              </svg>
              {{ stat.trend }}
            </div>
          </div>
        }
      </div>

      <div class="dashboard-charts-grid">
        <!-- Revenue Analytics Surface -->
        <div class="stat-card-precision">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-lg font-bold text-primary uppercase tracking-widest">Revenue Trajectory</h3>
              <p class="text-xs text-tertiary mt-1">12-month centralized performance overview</p>
            </div>
            <span class="status-pill-precision">REAL-TIME TELEMETRY</span>
          </div>
          
          <div class="relative h-[300px] w-full">
            <svg class="w-full h-full overflow-visible">
              <defs>
                 <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#DA3832" />
                    <stop offset="100%" stop-color="#8B1E1A" />
                 </linearGradient>
                 <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                 </filter>
              </defs>
              <!-- Bar iteration would go here based on real data -->
               @for (bar of [50, 70, 40, 90, 60, 80, 55, 75, 65, 85, 95, 100]; track $index) {
                <rect 
                  [attr.x]="$index * (100 / 12) + '%'"
                  [attr.y]="100 - bar + '%'"
                  [attr.width]="(100 / 12) - 1 + '%'"
                  [attr.height]="bar + '%'"
                  fill="url(#barGradient)"
                  rx="4"
                  filter="url(#glow)"
                  style="transition: all 0.5s ease"
                />
              }
            </svg>
          </div>
        </div>

        <!-- System Load / Distribution -->
        <div class="stat-card-precision">
          <h3 class="text-lg font-bold text-primary uppercase tracking-widest mb-8">System Compliance</h3>
          <div class="flex flex-col items-center justify-center h-full">
            <div class="gauge-container">
              <svg class="gauge-svg" viewBox="0 0 100 50">
                <path class="gauge-track" d="M10 50 A40 40 0 0 1 90 50" />
                <path class="gauge-fill" d="M10 50 A40 40 0 0 1 90 50" [style.--arc-target]="70" />
                <text x="50" y="45" class="gauge-text">84%</text>
              </svg>
            </div>
            <p class="text-[10px] text-tertiary mt-6 uppercase tracking-widest text-center">Operational Integrity Status</p>
          </div>
        </div>
      </div>
  `,
  styles: [``]
})
export class MemberDashboardComponent implements OnInit {
  authService = inject(AuthService);
  dashboardData = inject(DashboardDataService);
  router = inject(Router);

  currentUser = computed(() => this.authService.currentUser());
  userName = computed(() => this.currentUser()?.name || 'Authorized Taxpayer');
  
  complianceScore = computed(() => {
    // Dynamic compliance score based on pending obligations
    const pending = this.dashboardData.statistics().count_pending_obligations || 0;
    if (pending === 0) return 98;
    return Math.max(10, 98 - (pending * 15));
  });

  dashOffset = computed(() => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    return circumference - (this.complianceScore() / 100) * circumference;
  });

  stats = computed(() => {
    const s = this.dashboardData.statistics();
    const data: any[] = [
      { 
        label: 'Total Paid (YTD)', 
        value: s.total_revenue || 0, 
        type: 'currency', 
        trend: '+12.5% Gain', 
        trendDirection: 'up', 
        color: 'blue', 
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
      },
      { 
        label: 'Pending Obligations', 
        value: s.count_pending_obligations || 0, 
        type: 'count', 
        trend: s.count_pending_obligations > 0 ? 'Action Needed' : 'All Clear', 
        trendDirection: s.count_pending_obligations > 0 ? 'down' : 'up', 
        color: 'red', 
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' 
      },
      { 
        label: 'Returns Filed', 
        value: s.total_returns || 0, 
        type: 'count', 
        trend: 'Elite Status', 
        trendDirection: 'up', 
        color: 'gold', 
        icon: 'M13 10V3L4 14h7v7l9-11h-7z' 
      }
    ];

    return data.map(stat => ({
      ...stat,
      formattedValue: stat.type === 'currency' 
        ? 'KES ' + (stat.value / 1000).toFixed(1) + 'K'
        : stat.type === 'percent' ? stat.value + '%' : stat.value.toString()
    }));
  });

  chartData = computed(() => {
    const rawData = this.dashboardData.chartData();
    const max = Math.max(...rawData.map(d => d.amount), 1000);
    return rawData.map(d => ({
      ...d,
      height: (d.amount / max) * 100
    }));
  });

  activities = computed(() => {
    const payments = this.dashboardData.recentPayments().map(p => ({
        action: `Payment: ${p.payment_reference}`,
        date: p.payment_date,
        status: 'success',
        statusLabel: 'SETTLED',
        timestamp: new Date(p.payment_date).getTime()
    }));
    
    const returns = this.dashboardData.recentReturns().map(r => ({
        action: `Return Filed: ${r.return_reference}`,
        date: r.filing_date,
        status: 'success',
        statusLabel: 'FILED',
        timestamp: new Date(r.filing_date).getTime()
    }));
    
    // Combine and sort by date descending
    return [...payments, ...returns]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);
  });

  ngOnInit() {
    // Data is now prefetched by AuthService on login/startup
  }

  downloadStatusReport() {
    window.open(`${environment.apiUrl}/download.php?type=status_report&id=1&format=pdf`, '_blank');
  }
}
