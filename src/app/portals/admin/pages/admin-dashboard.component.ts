import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService, AdminDashboardSummary, PortalStatus } from '../../../services/admin-dashboard.service';
import { AuditLogService, AuditLog } from '../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-admin-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="dashboard-precision animate-fade-in">
      
      <!-- Top Intelligence Bar -->
      <header class="header-precision">
        <div class="header-content-complex">
          <div class="header-titles">
            <h1 class="title-primary">System <span class="title-accent">Intelligence</span></h1>
            <p class="subtitle-secondary">National Revenue Operations Center</p>
          </div>
          <div class="header-actions-precision">
            <div class="status-indicator-precision synced">
              <span class="pulse-dot"></span>
              CORE TERMINAL ONLINE
            </div>
            <button (click)="refresh()" class="btn-precision btn-secondary-precision btn-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh Telemetry
            </button>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-state-precision">
          <div class="loader-spinner-precision"></div>
          <p>Establishing secure data link...</p>
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <div class="error-state-precision animate-shake">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span>{{ error() }}</span>
        </div>
      }

      @if (!loading() && summary() && summary()?.stats) {
        <div class="dashboard-content-precision">

          <!-- KPI Surface (6x Grid) -->
          <div class="kpi-matrix-precision">
            
            <!-- Revenue -->
            <div class="card-precision kpi-card-precision status-red">
              <div class="kpi-icon-box">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div class="kpi-content">
                <span class="kpi-label">TOTAL REVENUE (YTD)</span>
                <h3 class="kpi-value">KES {{ formatM(summary()?.stats?.totalTaxCollected) }}</h3>
                <span class="kpi-meta">Month: {{ formatM(summary()?.stats?.monthlyRevenue) }}</span>
              </div>
            </div>

            <!-- Taxpayers -->
            <div class="card-precision kpi-card-precision status-blue">
              <div class="kpi-icon-box">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div class="kpi-content">
                <span class="kpi-label">TAXPAYER BASE</span>
                <h3 class="kpi-value">{{ (summary()?.stats?.totalTaxpayers || 0) | number }}</h3>
                <span class="kpi-meta">+{{ summary()?.stats?.newTaxpayersThisMonth || 0 }} new users</span>
              </div>
            </div>

            <!-- Active Returns -->
            <div class="card-precision kpi-card-precision status-green">
              <div class="kpi-icon-box">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <div class="kpi-content">
                <span class="kpi-label">FILING VELOCITY</span>
                <h3 class="kpi-value">{{ (summary()?.stats?.activeReturns || 0) | number }}</h3>
                <span class="kpi-meta">Last 30 Dynamic Days</span>
              </div>
            </div>

            <!-- Health -->
            <div class="card-precision kpi-card-precision status-purple">
              <div class="kpi-icon-box">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div class="kpi-content">
                <span class="kpi-label">SYSTEM UPTIME</span>
                <h3 class="kpi-value">{{ summary()?.stats?.systemHealth || 98 }}%</h3>
                <span class="kpi-meta">Tier-4 Operational</span>
              </div>
            </div>

            <!-- Pending -->
            <div class="card-precision kpi-card-precision status-gold">
              <div class="kpi-icon-box">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div class="kpi-content">
                <span class="kpi-label">SETTLEMENT QUEUE</span>
                <h3 class="kpi-value">{{ (summary()?.stats?.pendingPayments || 0) | number }}</h3>
                <span class="kpi-meta text-gold">Awaiting Processing</span>
              </div>
            </div>

            <!-- Overdue -->
            <div class="card-precision kpi-card-precision status-red glow-red">
              <div class="kpi-icon-box bg-red-base text-white">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div class="kpi-content">
                <span class="kpi-label">CRITICAL ARREARS</span>
                <h3 class="kpi-value text-red-base">{{ (summary()?.stats?.overdueObligations || 0) | number }}</h3>
                <span class="kpi-meta text-red-600">Action Mandated</span>
              </div>
            </div>
          </div>

          <div class="dashboard-grid-precision">
            
            <!-- Major Intelligence Column -->
            <div class="dashboard-main-area">
              
              <!-- Revenue Chart -->
              <div class="card-precision analytics-card-precision">
                <div class="card-header-precision">
                  <div class="chart-titles">
                    <h3>National Revenue Analytics</h3>
                    <p>Aggregated fiscal performance (12-Month Horizon)</p>
                  </div>
                  <div class="chart-actions">
                    <span class="total-tag">KES {{ formatM(totalRevenue12M()) }} Aggregate</span>
                  </div>
                </div>
                <div class="chart-viz-container h-300">
                  <div class="chart-surface-precision">
                    <div class="precision-bar-chart">
                      @for (m of chartMonths(); track $index) {
                        <div class="bar-unit-precision group" [style.height.%]="getBarPct(m.amount)">
                          <div class="bar-peak"></div>
                          <div class="bar-tooltip">{{ formatK(m.amount) }}</div>
                          <span class="bar-axis-label">{{ m.month }}</span>
                        </div>
                      }
                    </div>
                    <div class="chart-grid-precision">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Activity Logs -->
              <div class="card-precision logs-card-precision mt-10">
                <div class="card-header-precision">
                  <h3>Operations Pulse</h3>
                  <button class="btn-precision btn-secondary-precision btn-xs" (click)="refreshLogs()">Clear Logs</button>
                </div>
                <div class="logs-container-precision">
                  @for (log of recentLogs(); track log.id) {
                    <div class="log-entry-precision" [class.log-error]="isErrorAction(log.action)">
                      <div class="log-icon-precision">
                        @if (isErrorAction(log.action)) {
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2"/></svg>
                        } @else {
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="2"/></svg>
                        }
                      </div>
                      <div class="log-body-precision">
                        <div class="log-header-row">
                          <span class="log-user">{{ log.user || 'SYSTEM' }}</span>
                          <span class="log-time">{{ log.timestamp | date:'HH:mm:ss' }}</span>
                        </div>
                        <p class="log-details">{{ log.details }}</p>
                        <span class="log-action-tag">{{ log.action }}</span>
                      </div>
                    </div>
                  } @empty {
                    <div class="null-state-precision">No operational telemetry detected.</div>
                  }
                </div>
              </div>
            </div>

            <!-- Secondary Intelligence Sidebar -->
            <div class="dashboard-sidebar-area">
              
              <!-- Compliance Radar -->
              <div class="card-precision sidebar-widget-precision bg-dark-complex">
                <h4 class="widget-label-precision">Compliance Radar</h4>
                <div class="radar-metrics-stack">
                  <div class="radar-item-precision">
                    <div class="radar-header">
                      <span>FILING RATE</span>
                      <span>{{ summary()?.compliance?.returnFilingRate || 0 }}%</span>
                    </div>
                    <div class="radar-progress-track">
                      <div class="radar-fill bg-blue-base" [style.width.%]="summary()?.compliance?.returnFilingRate || 0"></div>
                    </div>
                  </div>
                  <div class="radar-item-precision">
                    <div class="radar-header">
                      <span>PAYMENT VELOCITY</span>
                      <span>{{ summary()?.compliance?.paymentCompliance || 0 }}%</span>
                    </div>
                    <div class="radar-progress-track">
                      <div class="radar-fill bg-green-base" [style.width.%]="summary()?.compliance?.paymentCompliance || 0"></div>
                    </div>
                  </div>
                </div>

                <div class="overall-health-gauge-precision mt-8">
                  <div class="gauge-viz">
                    <svg viewBox="0 0 36 36" class="gauge-ring">
                      <circle cx="18" cy="18" r="16" class="gauge-track"></circle>
                      <circle cx="18" cy="18" r="16" class="gauge-fill" [style.stroke-dashoffset]="100 - (summary()?.compliance?.auditReadiness || 0)"></circle>
                    </svg>
                    <div class="gauge-center">
                      <span class="gauge-val">{{ summary()?.compliance?.auditReadiness || 0 }}%</span>
                    </div>
                  </div>
                  <div class="gauge-meta">
                    <span class="gauge-title">Audit Readiness</span>
                    <span class="gauge-subtitle">Sytem-wide Integrity</span>
                  </div>
                </div>
              </div>

              <!-- Revenue Split -->
              <div class="card-precision sidebar-widget-precision">
                <h4 class="widget-label-precision">Revenue Distribution</h4>
                <div class="distribution-list-precision">
                  @for (t of taxTypes().slice(0,6); track $index) {
                    <div class="dist-row-precision">
                      <div class="dist-info">
                        <span class="dist-dot" [style.background]="taxColors[$index % taxColors.length]"></span>
                        <span class="dist-name">{{ shortTaxType(t.type) }}</span>
                      </div>
                      <span class="dist-val">KES {{ formatK(t.amount) }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Integration Status -->
              <div class="card-precision sidebar-widget-precision status-black">
                <h4 class="widget-label-precision text-white">Gateway Integrations</h4>
                <div class="integration-stack-precision">
                  @for (portal of portals(); track portal.name) {
                    <div class="integration-tile-precision" [class.is-offline]="!portal.online">
                      <div class="int-info">
                        <span class="int-name">{{ portal.name }}</span>
                        <span class="int-lat">{{ portal.online ? portal.latency : 'ERROR' }}</span>
                      </div>
                      <div class="int-status">
                        <span class="int-status-label">{{ portal.online ? 'SYNCED' : 'OFFLINE' }}</span>
                        <div class="int-dot" [class.online]="portal.online"></div>
                      </div>
                    </div>
                  }
                </div>
              </div>

            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [``]
})
export class AdminDashboardComponent implements OnInit {
  private dashSvc  = inject(AdminDashboardService);
  private auditSvc = inject(AuditLogService);

  loading    = signal(true);
  error      = signal('');
  summary    = signal<AdminDashboardSummary | null>(null);
  portals    = signal<PortalStatus[]>([]);
  recentLogs = signal<AuditLog[]>([]);

  taxColors = ['#E31E24','#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899','#06B6D4','#84CC16'];

  chartMonths() {
    return (this.summary()?.charts?.monthlyRevenue as any[]) ?? [];
  }

  taxTypes() {
    return (this.summary()?.charts?.taxTypeBreakdown as any[]) ?? [];
  }

  totalRevenue12M(): number {
    return this.chartMonths().reduce((s: number, m: any) => s + (m.amount ?? 0), 0);
  }

  getBarPct(amount: number): number {
    const max = Math.max(...this.chartMonths().map((m: any) => m.amount ?? 0), 1);
    return Math.max((amount / max) * 100, amount > 0 ? 4 : 0);
  }

  formatM(v: number | undefined): string {
    if (!v || v === 0) return '0';
    if (v >= 1_000_000_000) return (v/1_000_000_000).toFixed(2)+'B';
    if (v >= 1_000_000)     return (v/1_000_000).toFixed(2)+'M';
    if (v >= 1_000)         return (v/1_000).toFixed(1)+'K';
    return v.toFixed(0);
  }

  formatK(v: number | undefined): string {
    if (!v || v === 0) return '0';
    if (v >= 1_000_000) return (v/1_000_000).toFixed(1)+'M';
    if (v >= 1_000)     return (v/1_000).toFixed(0)+'K';
    return v.toFixed(0);
  }

  shortTaxType(t: string): string {
    return t?.replace('Income Tax', 'Inc. Tax').replace('Corporate','Corp.').replace('Withholding','W/H') ?? t;
  }

  isErrorAction(action: string): boolean {
    return !!(action?.toUpperCase().match(/FAIL|ERROR|DENIED|DOWN|REJECT/));
  }

  ngOnInit() { this.refresh(); this.refreshLogs(); }

  refresh() {
    this.loading.set(true);
    this.dashSvc.getSummary().subscribe({
      next: res => {
        if (res.success && res.data) this.summary.set(res.data);
        else this.error.set(res.error || 'Failed to load dashboard.');
        this.loading.set(false);
      },
      error: () => { this.error.set('API unreachable. Ensure backend is running.'); this.loading.set(false); }
    });
    this.dashSvc.getPortalsStatus().subscribe({
      next: res => { if (res.success && res.data) this.portals.set(res.data); }
    });
  }

  refreshLogs() {
    this.auditSvc.getLogs(1, 12).subscribe({
      next: res => { if (res.success && res.data) this.recentLogs.set(res.data.logs); }
    });
  }
}
