import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService, AdminDashboardSummary } from '../services/admin-dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-up">
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Admin <span class="gradient-text">Overview</span></h1>
          <p class="premium-subtitle">System-wide monitoring, revenue metrics, and compliance data</p>
        </div>
      </header>

      <div *ngIf="loading()" class="loading-state flex flex-col items-center justify-center p-12">
        <div class="spin"></div>
        <p class="mt-4 text-muted" style="color: var(--text-muted); margin-top: 1rem;">Aggregating system metrics...</p>
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
            <span class="stat-label">System Health</span>
            <h3 class="stat-value text-green">{{ summary()?.stats?.systemHealth }}%</h3>
          </div>
        </div>

        <div class="metrics-grid">
          <!-- Compliance Metrics -->
          <div class="compliance-card content-card-premium border-blue">
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

          <!-- Performance Metrics -->
          <div class="performance-card content-card-premium border-red">
            <h3 class="card-p-title mb-16">System Performance</h3>
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
                <span class="perf-label">Peak Hour</span>
                <div class="perf-val">{{ summary()?.metrics?.peakHour }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-content {
      margin-top: 32px;
    }
    .spin {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top-color: var(--kra-red);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px;
    }
    .error-banner {
      background: #FEE2E2;
      border: 1px solid #FECACA;
      color: #DC2626;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-weight: 600;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    .stat-card {
      padding: 24px;
    }
    .premium-stat-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      transition: all 0.3s;
    }
    .premium-stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.06);
    }
    .stat-label {
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 8px;
    }
    .stat-value {
      font-size: 1.75rem;
      font-weight: 900;
      color: var(--text-main);
      margin: 0;
    }
    .text-green { color: #10B981; }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 24px;
      margin-bottom: 32px;
    }
    @media (max-width: 900px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
    .content-card-premium {
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      padding: 24px;
    }
    .border-blue { border-top: 4px solid #3B82F6; }
    .border-red { border-top: 4px solid var(--kra-red); }
    .card-p-title {
      font-size: 1.15rem;
      font-weight: 900;
      color: var(--text-main);
      margin: 0;
      letter-spacing: -0.5px;
    }
    .mb-16 { margin-bottom: 16px; }

    .metric-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .metric-label {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-secondary);
    }
    .metric-val {
      font-size: 0.85rem;
      font-weight: 900;
      color: var(--text-main);
    }
    .progress-bar-bg {
      width: 100%;
      height: 8px;
      background: var(--border-color);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 1s ease-in-out;
    }
    .bg-blue { background: #3B82F6; }
    .bg-green { background: #10B981; }
    .bg-purple { background: #8B5CF6; }

    .perf-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .perf-stat {
      background: var(--bg-hover);
      padding: 16px;
      border-radius: 12px;
    }
    .perf-label {
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--text-muted);
      text-transform: uppercase;
      display: block;
      margin-bottom: 6px;
    }
    .perf-val {
      font-size: 1.3rem;
      font-weight: 900;
      color: var(--text-main);
    }
    .perf-sub {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: none;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(AdminDashboardService);

  loading = signal(true);
  error = signal('');
  summary = signal<AdminDashboardSummary | null>(null);

  ngOnInit() {
    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.summary.set(res.data);
        } else {
          this.error.set(res.error || 'Failed to initialize executive dashboard metrics.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Network error encountered while fetching metrics.');
        this.loading.set(false);
      }
    });
  }
}
