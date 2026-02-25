import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService, AdminDashboardSummary, PortalStatus } from '../services/admin-dashboard.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-up">
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Admin <span class="gradient-text">Overview</span></h1>
          <p class="premium-subtitle">System-wide monitoring, revenue metrics, and government link status</p>
        </div>
      </header>

      <div *ngIf="loading()" class="loading-state flex flex-col items-center justify-center p-12">
        <div class="spin"></div>
        <p class="mt-4 text-muted" style="color: var(--text-muted); margin-top: 1rem;">Aggregating intelligence metrics...</p>
      </div>

      <div *ngIf="error()" class="error-banner">
        {{ error() }}
      </div>

      <div *ngIf="!loading() && !error() && summary()" class="dashboard-content">
        
        <!-- Key Stats Pipeline -->
        <div class="stats-grid">
          <div class="stat-card premium-stat-card">
            <span class="stat-label">Total Tax Collected</span>
            <h3 class="stat-value">KES {{ (summary()?.stats?.totalTaxCollected / 1000000) | number:'1.1-2' }}M</h3>
          </div>
          <div class="stat-card premium-stat-card">
            <span class="stat-label">Total Taxpayers</span>
            <h3 class="stat-value">{{ summary()?.stats?.totalTaxpayers | number }}</h3>
          </div>
          <div class="stat-card premium-stat-card">
            <span class="stat-label">Active Returns (30d)</span>
            <h3 class="stat-value">{{ summary()?.stats?.activeReturns | number }}</h3>
          </div>
          <div class="stat-card premium-stat-card">
            <span class="stat-label">System Integrity</span>
            <h3 class="stat-value text-green">{{ summary()?.stats?.systemHealth }}%</h3>
          </div>
        </div>

        <div class="metrics-grid">
          <div class="left-stack">
            <!-- Compliance Metrics -->
            <div class="compliance-card content-card-premium border-blue mb-24">
              <h3 class="card-p-title mb-16">Compliance Pulse</h3>
              
              <div class="metric-item mb-16">
                <div class="metric-header">
                  <span class="metric-label">Return Filing Rate</span>
                  <span class="metric-val">{{ summary()?.compliance?.returnFilingRate }}%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill bg-blue" [style.width.%]="summary()?.compliance?.returnFilingRate"></div>
                </div>
              </div>

              <div class="metric-item mb-16">
                <div class="metric-header">
                 <span class="metric-label">Payment Compliance</span>
                 <span class="metric-val">{{ summary()?.compliance?.paymentCompliance }}%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill bg-green" [style.width.%]="summary()?.compliance?.paymentCompliance"></div>
                </div>
              </div>

               <div class="metric-item">
                 <div class="metric-header">
                   <span class="metric-label">Obligation Compliance</span>
                   <span class="metric-val">{{ summary()?.compliance?.obligationComplianceRate }}%</span>
                 </div>
                 <div class="progress-bar-bg">
                   <div class="progress-bar-fill bg-purple" [style.width.%]="summary()?.compliance?.obligationComplianceRate"></div>
                 </div>
               </div>
            </div>

            <!-- Portal Status Monitoring -->
            <div class="portals-card content-card-premium border-purple">
              <div class="flex-between mb-16">
                <h3 class="card-p-title">Gov Portals Status</h3>
                <span class="badge-mini" [class.live]="portals().length > 0">Live Monitoring</span>
              </div>
              
              <div *ngIf="portalsLoading()" class="portal-loading flex flex-col items-center py-16">
                <div class="spinner-mini"></div>
                <p class="text-xs text-muted mt-8">Checking external portal reachability...</p>
              </div>

              <div *ngIf="!portalsLoading()" class="portal-list animate-in">
                <div *ngFor="let portal of portals()" class="portal-item">
                  <div class="portal-info">
                    <span class="p-name">{{ portal.name }}</span>
                    <span class="p-latency" *ngIf="portal.online">{{ portal.latency }}</span>
                  </div>
                  <div class="portal-status">
                    <span class="status-msg" [class.offline]="!portal.online">{{ portal.online ? 'Active' : 'Down' }}</span>
                    <span class="pulse-dot" [class.green]="portal.online" [class.red]="!portal.online"></span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Performance Metrics -->
          <div class="performance-card content-card-premium border-red">
            <h3 class="card-p-title mb-16">System Performance Intelligence</h3>
            <div class="perf-grid">
              <div class="perf-stat">
                <span class="perf-label">Payment Success Rate</span>
                <div class="perf-val">{{ summary()?.metrics?.paymentSuccessRate }}%</div>
              </div>
              <div class="perf-stat">
                <span class="perf-label">Avg Transaction Val</span>
                <div class="perf-val">KES {{ summary()?.metrics?.avgTransactionValue | number:'1.0-0' }}</div>
              </div>
              <div class="perf-stat">
                <span class="perf-label">Transactions Today</span>
                <div class="perf-val text-green">{{ summary()?.metrics?.completedToday | number }} <span class="perf-sub">Success</span></div>
              </div>
              <div class="perf-stat">
                <span class="perf-label">Peak Sync Hour</span>
                <div class="perf-val">{{ summary()?.metrics?.peakHour }}</div>
              </div>
            </div>

            <!-- Revenue Trend Placeholder/Simulated (Future: Add Charts) -->
            <div class="trend-section mt-32">
              <h4 class="section-label">24h Transaction Flux</h4>
              <div class="flux-viz">
                 <div class="flux-bar" style="height: 40%"></div>
                 <div class="flux-bar" style="height: 60%"></div>
                 <div class="flux-bar" style="height: 45%"></div>
                 <div class="flux-bar" style="height: 80%"></div>
                 <div class="flux-bar" style="height: 95%"></div>
                 <div class="flux-bar" style="height: 70%"></div>
                 <div class="flux-bar" style="height: 50%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content { margin-top: 32px; }
    .mb-24 { margin-bottom: 24px; }
    .mt-32 { margin-top: 32px; }
    .py-16 { padding-top: 16px; padding-bottom: 16px; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }

    .spin {
      width: 40px; height: 40px; border: 4px solid var(--border-color);
      border-top-color: var(--kra-red); border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .spinner-mini {
      width: 20px; height: 20px; border: 2px solid var(--border-color);
      border-top-color: var(--kra-red); border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .loading-state { display: flex; flex-direction: column; align-items: center; padding: 60px; }
    
    .error-banner {
      background: #FEE2E2; border: 1px solid #FECACA; color: #DC2626;
      padding: 16px; border-radius: 8px; margin-top: 16px; font-weight: 600;
    }

    .animate-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px; margin-bottom: 32px;
    }
    .premium-stat-card {
      background: var(--bg-surface); border: 1px solid var(--border-light);
      border-radius: 16px; padding: 24px; transition: all 0.3s;
    }
    .premium-stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
    .stat-label { color: var(--text-muted); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; display: block; }
    .stat-value { font-size: 1.75rem; font-weight: 900; color: var(--text-main); margin: 0; }
    .text-green { color: #10B981; }
    .text-xs { font-size: 0.75rem; }
    .text-muted { color: var(--text-muted); }
    .mt-8 { margin-top: 8px; }


    .metrics-grid { display: grid; grid-template-columns: 1fr 1.8fr; gap: 24px; margin-bottom: 32px; }
    @media (max-width: 1000px) { .metrics-grid { grid-template-columns: 1fr; } }

    .content-card-premium {
      background: var(--bg-surface); border: 1px solid var(--border-light);
      border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    }
    .border-blue { border-top: 4px solid #3B82F6; }
    .border-red { border-top: 4px solid var(--kra-red); }
    .border-purple { border-top: 4px solid #8B5CF6; }
    
    .card-p-title { font-size: 1.15rem; font-weight: 900; color: var(--text-main); margin: 0; }
    
    .progress-bar-bg { width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; margin-top: 8px; }
    .progress-bar-fill { height: 100%; transition: width 1s ease-in-out; }
    .bg-blue { background: #3B82F6; }
    .bg-green { background: #10B981; }
    .bg-purple { background: #8B5CF6; }

    .portal-list { display: flex; flex-direction: column; gap: 12px; }
    .portal-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 16px; background: var(--bg-hover); border-radius: 12px;
    }
    .p-name { font-weight: 700; color: var(--text-main); font-size: 0.9rem; }
    .p-latency { font-size: 0.75rem; color: var(--text-muted); margin-left: 8px; }
    .portal-status { display: flex; align-items: center; gap: 10px; }
    .status-msg { font-size: 0.8rem; font-weight: 800; color: #10B981; text-transform: uppercase; }
    .status-msg.offline { color: #EF4444; }
    
    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; }
    .pulse-dot.green { background: #10B981; box-shadow: 0 0 8px #10B981; animation: pulse 2s infinite; }
    .pulse-dot.red { background: #EF4444; box-shadow: 0 0 8px #EF4444; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

    .badge-mini { font-size: 0.65rem; font-weight: 900; padding: 4px 8px; border-radius: 6px; background: #E2E8F0; color: #64748B; text-transform: uppercase; }
    .badge-mini.live { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }

    .perf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .perf-stat { background: var(--bg-hover); padding: 20px; border-radius: 14px; }
    .perf-label { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 8px; }
    .perf-val { font-size: 1.4rem; font-weight: 900; color: var(--text-main); }
    .perf-sub { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

    .flux-viz { display: flex; align-items: flex-end; gap: 8px; height: 100px; margin-top: 16px; }
    .flux-bar { flex: 1; min-width: 10px; background: var(--kra-gradient); border-radius: 4px 4px 0 0; opacity: 0.4; transition: 0.3s; }
    .flux-bar:hover { opacity: 1; }
    .section-label { font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(AdminDashboardService);

  loading = signal(true);
  portalsLoading = signal(true);
  error = signal('');
  summary = signal<AdminDashboardSummary | null>(null);
  portals = signal<PortalStatus[]>([]);

  ngOnInit() {
    this.refreshIntelligence();
  }

  refreshIntelligence() {
    this.loading.set(true);
    this.portalsLoading.set(true);
    
    // Fetch stats - high priority
    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.summary.set(res.data);
        } else {
          this.error.set(res.error || 'Failed to initialize executive intelligence.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Terminal comms failure: Failed to reach sovereign API.');
        this.loading.set(false);
      }
    });

    // Fetch portal status - background priority
    this.dashboardService.getPortalsStatus().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.portals.set(res.data);
        }
        this.portalsLoading.set(false);
      },
      error: () => {
        // Portal status failures shouldn't break the whole dashboard
        this.portalsLoading.set(false);
      }
    });
  }
}

