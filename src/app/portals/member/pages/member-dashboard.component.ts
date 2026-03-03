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
    <div class="dashboard-precision animate-fade-in">
      
      <!-- Top Intelligence Bar -->
      <header class="header-precision">
        <div class="header-content-complex">
          <div class="header-titles">
            <h1 class="title-primary">Wealth Terminal <span class="title-accent">Intelligence</span></h1>
            <p class="subtitle-secondary">Synchronized access for {{ userName() }}</p>
          </div>
          <div class="header-actions-precision">
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

      <div class="dashboard-grid-precision">
        
        <!-- Left Column: Core Metrics & Visuals -->
        <div class="dashboard-main-area">
          
          <!-- Compliance Identity Card -->
          <div class="card-precision card-red-accent compliance-hero-precision animate-slide-up">
            <div class="compliance-layout">
              <div class="compliance-viz-box">
                <svg class="compliance-ring-svg" viewBox="0 0 100 100">
                  <circle class="ring-track" cx="50" cy="50" r="45"></circle>
                  <circle class="ring-fill" cx="50" cy="50" r="45" [style.stroke-dashoffset]="dashOffset()"></circle>
                </svg>
                <div class="compliance-score-text">
                  <span class="score-num">{{ complianceScore() }}%</span>
                  <span class="score-lbl">PRECISION</span>
                </div>
              </div>
              <div class="compliance-info-box">
                <div class="user-identity-precision">
                  <span class="id-tag">OPERATIONAL IDENTITY</span>
                  <h2>{{ userName() }}</h2>
                  <p>STATION: {{ dashboardData.station() }} | PIN: {{ dashboardData.taxpayerProfile()?.id_number }}</p>
                </div>
                <div class="obligation-chips-row">
                  @for (ob of dashboardData.obligations(); track ob.obligation_id) {
                    <span class="precision-chip">{{ ob.obligation_name }}</span>
                  }
                </div>
              </div>
              <div class="compliance-status-footer">
                <div class="footer-metric">
                  <span class="f-lbl">Next Filing Deadline</span>
                  <span class="f-val">Jan 20, 2026</span>
                </div>
                <div class="footer-metric">
                  <span class="f-lbl">Account Integrity</span>
                  <span class="f-val badge-precision badge-success-precision">VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          <!-- KPI Stats Grid -->
          <div class="stats-matrix-precision">
            @for (stat of stats(); track stat.label) {
              <div class="card-precision stat-card-precision">
                <div class="stat-icon-precision" [class]="stat.color">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-width="2" [attr.d]="stat.icon" />
                  </svg>
                </div>
                <div class="stat-content-precision">
                  <span class="stat-label-precision text-uppercase">{{ stat.label }}</span>
                  <h3 class="stat-value-precision">{{ stat.formattedValue }}</h3>
                  <div class="stat-trend-precision" [class]="stat.trendDirection === 'up' ? 'trend-up' : 'trend-down'">
                    {{ stat.trend }}
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Revenue Analytics Surface -->
          <div class="card-precision analytics-card-precision animate-scale">
            <div class="card-header-precision">
              <div class="chart-titles">
                <h3>Revenue Trajectory</h3>
                <p>12-month centralized performance overview</p>
              </div>
              <div class="chart-legend-precision">
                <span class="legend-unit"><span class="dot-red"></span> Revenue Flow (KES)</span>
              </div>
            </div>
            <div class="chart-viz-container">
              <!-- Premium Gradient Definitions -->
              <svg width="0" height="0" style="position: absolute;">
                <defs>
                  <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:var(--red-400); stop-opacity:1" />
                    <stop offset="100%" style="stop-color:var(--red-600); stop-opacity:0.8" />
                  </linearGradient>
                  <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:var(--red-500); stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:var(--red-500); stop-opacity:0" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div class="chart-surface-precision">
                @if (chartData().length > 0) {
                  <div class="precision-bar-chart">
                    @for (bar of chartData(); track bar.month) {
                      <div class="bar-unit-precision" [style.height.%]="bar.height" [class.active-bar]="bar.active" 
                           style="background: linear-gradient(180deg, var(--red-400) 0%, var(--red-600) 100%); box-shadow: 0 4px 12px rgba(218, 56, 50, 0.2);">
                        <div class="bar-peak" style="background: white; opacity: 0.4; height: 1px; width: 100%;"></div>
                        <div class="bar-tooltip">KES {{ bar.amount / 1000 }}K</div>
                        <span class="bar-axis-label">{{ bar.month }}</span>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="data-null-state">No telemetry data for this sequence.</div>
                }
                <div class="chart-grid-precision">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Operational Controls -->
        <div class="dashboard-sidebar-area">
          
          <div class="card-precision controls-card-precision">
            <span class="widget-heading-precision">Operational Command</span>
            <div class="command-tiles-grid">
              <button class="cmd-tile-precision" (click)="router.navigate(['/returns'])">
                <div class="tile-icon icon-blue"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2"/></svg></div>
                <span>File Returns</span>
              </button>
              <button class="cmd-tile-precision" (click)="router.navigate(['/etims'])">
                <div class="tile-icon icon-gold"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2"/></svg></div>
                <span>e-TIMS Portal</span>
              </button>
              <button class="cmd-tile-precision" (click)="router.navigate(['/debt'])">
                <div class="tile-icon icon-red"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg></div>
                <span>Clear Arrears</span>
              </button>
              <button class="cmd-tile-precision" (click)="router.navigate(['/settings'])">
                <div class="tile-icon icon-grey"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-width="2"/></svg></div>
                <span>Preferences</span>
              </button>
            </div>
          </div>

          <div class="card-precision activity-card-precision">
            <div class="card-header-precision compact-header">
              <h3>Live Activity Loop</h3>
              <a href="#" class="link-precision">ARCHIVE</a>
            </div>
            <div class="timeline-precision">
              @for (act of activities(); track act.timestamp) {
                <div class="timeline-event-precision">
                  <div class="event-marker" [class]="act.status"></div>
                  <div class="event-details">
                    <p class="event-action">{{ act.action }}</p>
                    <span class="event-meta">{{ act.date }}</span>
                  </div>
                  <div class="event-status-tag" [class]="'tag-' + act.status">{{ act.statusLabel }}</div>
                </div>
              }
            </div>
            <button class="btn-precision btn-secondary-precision w-full mt-6" (click)="router.navigate(['/statements'])">View Full Log</button>
          </div>

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
