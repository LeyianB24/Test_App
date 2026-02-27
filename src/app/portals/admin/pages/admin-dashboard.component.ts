import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService, AdminDashboardSummary, PortalStatus } from '../../../services/admin-dashboard.service';
import { AuditLogService, AuditLog } from '../../../core/services/admin/audit-log.service';
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
        <div class="header-actions">
           <button class="btn-premium-outline" (click)="refreshIntelligence()">
             <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
             Refresh Intelligence
           </button>
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
          <div class="stat-card premium-stat-card glassmorphism">
            <span class="stat-label">Total Tax Collected</span>
            <div class="flex items-end justify-between">
              <h3 class="stat-value">KES {{ (summary()?.stats?.totalTaxCollected / 1000000) | number:'1.1-2' }}M</h3>
              <div class="stat-trend up">+12.5%</div>
            </div>
            <div class="mini-chart mt-12">
               <svg viewBox="0 0 100 30" class="sparkline blue">
                 <path d="M0,25 L10,22 L20,24 L30,18 L40,20 L50,12 L60,15 L70,8 L80,10 L90,2 L100,5" fill="none" stroke-width="2" vector-effect="non-scaling-stroke"></path>
               </svg>
            </div>
          </div>
          <div class="stat-card premium-stat-card glassmorphism">
            <span class="stat-label">Total Taxpayers</span>
            <div class="flex items-end justify-between">
              <h3 class="stat-value">{{ summary()?.stats?.totalTaxpayers | number }}</h3>
              <div class="stat-trend up">+2.3%</div>
            </div>
            <div class="mini-chart mt-12">
               <svg viewBox="0 0 100 30" class="sparkline green">
                 <path d="M0,20 L20,18 L40,15 L60,10 L80,8 L100,2" fill="none" stroke-width="2" vector-effect="non-scaling-stroke"></path>
               </svg>
            </div>
          </div>
          <div class="stat-card premium-stat-card glassmorphism">
            <span class="stat-label">Active Returns (30d)</span>
            <div class="flex items-end justify-between">
              <h3 class="stat-value">{{ summary()?.stats?.activeReturns | number }}</h3>
              <div class="stat-trend down">-1.2%</div>
            </div>
            <div class="mini-chart mt-12">
               <svg viewBox="0 0 100 30" class="sparkline red">
                 <path d="M0,5 L20,8 L40,15 L60,12 L80,18 L100,22" fill="none" stroke-width="2" vector-effect="non-scaling-stroke"></path>
               </svg>
            </div>
          </div>
          <div class="stat-card premium-stat-card glassmorphism">
            <span class="stat-label">System Integrity</span>
            <div class="flex items-end justify-between">
              <h3 class="stat-value text-green">{{ summary()?.stats?.systemHealth }}%</h3>
              <div class="stat-trend neutral">Stable</div>
            </div>
            <div class="mini-chart mt-12">
               <svg viewBox="0 0 100 30" class="sparkline purple">
                 <path d="M0,15 L20,15 L40,15 L60,15 L80,15 L100,15" fill="none" stroke-width="2" vector-effect="non-scaling-stroke"></path>
               </svg>
            </div>
          </div>
        </div>

        <div class="dashboard-layout-grid">
          <!-- Main Area -->
          <div class="main-column">
            <!-- System Performance Intelligence -->
            <div class="content-card-premium glassmorphism border-elite-red mb-24">
              <h3 class="card-p-title mb-24">System Performance Intelligence</h3>
              <div class="perf-stats-grid">
                <div class="perf-stat-box">
                  <span class="p-label">Payment Success</span>
                  <div class="p-value">{{ summary()?.metrics?.paymentSuccessRate }}%</div>
                  <div class="p-progress"><div class="p-fill bg-green" [style.width.%]="summary()?.metrics?.paymentSuccessRate"></div></div>
                </div>
                <div class="perf-stat-box">
                  <span class="p-label">Avg Transaction</span>
                  <div class="p-value">KES {{ summary()?.metrics?.avgTransactionValue | number:'1.0-0' }}</div>
                  <div class="p-sub">Standard Deviation: ±12%</div>
                </div>
                <div class="perf-stat-box">
                  <span class="p-label">Today's Load</span>
                  <div class="p-value text-green">{{ summary()?.metrics?.completedToday | number }} <span class="text-xs font-normal opacity-60">TXNs</span></div>
                  <div class="p-sub">Peak Hour: {{ summary()?.metrics?.peakHour }}</div>
                </div>
              </div>

              <div class="trend-visualization mt-32">
                <div class="flex-between mb-16">
                   <h4 class="section-label">24h Transaction Flux</h4>
                   <span class="text-[10px] font-black uppercase text-slate-400">Live Telemetry</span>
                </div>
                <div class="visual-bars">
                  @for (i of [40, 60, 45, 80, 95, 70, 50, 65, 85, 40, 55, 75]; track $index) {
                    <div class="v-bar" [style.height.px]="i" [style.opacity]="0.3 + (i/100)"></div>
                  }
                </div>
              </div>
            </div>

            <!-- Client Activity Pulse -->
            <div class="content-card-premium glassmorphism border-elite-blue">
               <div class="flex-between mb-24">
                 <h3 class="card-p-title">Live System Pulse</h3>
                 <button class="text-link-premium text-xs" (click)="refreshLogs()">View Audit Log</button>
               </div>
               
               <div class="pulse-list custom-scrollbar">
                 @for (log of recentLogs(); track log.id) {
                   <div class="pulse-item">
                     <div class="pulse-icon" [class]="log.action.includes('FAIL') ? 'bg-red-soft' : 'bg-blue-soft'">
                        <div class="dot" [class]="log.action.includes('FAIL') ? 'bg-red' : 'bg-blue'"></div>
                     </div>
                     <div class="pulse-content">
                        <div class="flex-between">
                          <span class="p-user">{{ log.user }}</span>
                          <span class="p-time">{{ log.timestamp | date:'shortTime' }}</span>
                        </div>
                        <p class="p-desc">{{ log.details }}</p>
                        <span class="p-tag">{{ log.action }}</span>
                     </div>
                   </div>
                 }
               </div>
            </div>
          </div>

          <!-- Side Area -->
          <div class="side-column">
             <!-- Compliance Meter -->
             <div class="content-card-premium glassmorphism border-elite-purple mb-24">
                <h3 class="card-p-title mb-24">Compliance Radar</h3>
                
                <div class="radar-item mb-20">
                  <div class="flex-between mb-8">
                    <span class="r-label">Return Filing</span>
                    <span class="r-val">{{ summary()?.compliance?.returnFilingRate }}%</span>
                  </div>
                  <div class="r-bar"><div class="r-fill bg-blue" [style.width.%]="summary()?.compliance?.returnFilingRate"></div></div>
                </div>

                <div class="radar-item mb-20">
                  <div class="flex-between mb-8">
                    <span class="r-label">Payment Compliance</span>
                    <span class="r-val">{{ summary()?.compliance?.paymentCompliance }}%</span>
                  </div>
                  <div class="r-bar"><div class="r-fill bg-green" [style.width.%]="summary()?.compliance?.paymentCompliance"></div></div>
                </div>

                <div class="radar-item">
                  <div class="flex-between mb-8">
                    <span class="r-label">Obligations</span>
                    <span class="r-val">{{ summary()?.compliance?.obligationComplianceRate }}%</span>
                  </div>
                  <div class="r-bar"><div class="r-fill bg-purple" [style.width.%]="summary()?.compliance?.obligationComplianceRate"></div></div>
                </div>
             </div>

             <!-- External Link Status -->
             <div class="content-card-premium glassmorphism border-elite-gold">
               <div class="flex-between mb-24">
                 <h3 class="card-p-title">Gov Nexus</h3>
                 <span class="badge-elite pulsate">Live</span>
               </div>
               
               <div class="nexus-list">
                 @for (portal of portals(); track portal.name) {
                   <div class="nexus-item">
                     <div class="n-info">
                        <span class="n-name">{{ portal.name }}</span>
                        <span class="n-latency" *ngIf="portal.online">{{ portal.latency }}</span>
                     </div>
                     <div class="n-status">
                        <div class="n-dot" [class.online]="portal.online"></div>
                        <span class="n-text" [class.offline]="!portal.online">{{ portal.online ? 'UP' : 'DOWN' }}</span>
                     </div>
                   </div>
                 }
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .glassmorphism {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    }
    
    .dashboard-layout-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 24px;
      margin-top: 32px;
    }

    @media (max-width: 1100px) {
      .dashboard-layout-grid { grid-template-columns: 1fr; }
    }

    .premium-stat-card {
      border-radius: 24px;
      padding: 1.75rem;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .premium-stat-card:hover { transform: translateY(-6px); box-shadow: 0 15px 45px rgba(0,0,0,0.08); }
    
    .stat-trend {
      font-size: 0.7rem; font-weight: 900; padding: 4px 8px; border-radius: 8px;
    }
    .stat-trend.up { background: rgba(16, 185, 129, 0.1); color: #059669; }
    .stat-trend.down { background: rgba(239, 68, 68, 0.1); color: #DC2626; }
    .stat-trend.neutral { background: rgba(100, 116, 139, 0.1); color: #64748B; }

    .sparkline { width: 100%; height: 30px; stroke-linecap: round; }
    .sparkline.blue { stroke: #3B82F6; }
    .sparkline.green { stroke: #10B981; }
    .sparkline.red { stroke: #EF4444; }
    .sparkline.purple { stroke: #8B5CF6; }

    .perf-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .perf-stat-box { background: rgba(241, 245, 249, 0.5); padding: 1.5rem; border-radius: 20px; }
    .p-label { font-size: 0.75rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; display: block; margin-bottom: 12px; }
    .p-value { font-size: 1.5rem; font-weight: 900; color: #1E293B; margin-bottom: 8px; }
    .p-progress { height: 4px; background: #E2E8F0; border-radius: 2px; overflow: hidden; }
    .p-fill { height: 100%; transition: width 1s ease; }
    .p-sub { font-size: 0.7rem; color: #94A3B8; font-weight: 600; margin-top: 8px; }

    .visual-bars { display: flex; align-items: flex-end; gap: 6px; height: 100px; padding: 10px 0; border-bottom: 1px solid #F1F5F9; }
    .v-bar { flex: 1; min-width: 8px; background: linear-gradient(to top, #3B82F6, #60A5FA); border-radius: 4px 4px 0 0; transition: transform 0.3s; }
    .v-bar:hover { transform: scaleY(1.1); opacity: 1 !important; }

    .pulse-list { max-height: 400px; overflow-y: auto; padding-right: 8px; }
    .pulse-item { display: flex; gap: 16px; padding: 16px; border-radius: 16px; transition: background 0.2s; }
    .pulse-item:hover { background: rgba(241, 245, 249, 0.8); }
    .pulse-icon { width: 36px; height: 36px; border-radius: 12px; display: flex; items-center justify-center; flex-shrink: 0; margin-top: 2px; }
    .pulse-icon .dot { width: 6px; height: 6px; border-radius: 50%; }
    .bg-blue-soft { background: rgba(59, 130, 246, 0.1); }
    .bg-red-soft { background: rgba(239, 68, 68, 0.1); }
    .bg-blue { background: #3B82F6; box-shadow: 0 0 8px #3B82F6; }
    .bg-red { background: #EF4444; box-shadow: 0 0 8px #EF4444; }

    .p-user { font-size: 0.85rem; font-weight: 900; color: #1E293B; }
    .p-time { font-size: 0.7rem; font-weight: 700; color: #94A3B8; }
    .p-desc { font-size: 0.8rem; color: #64748B; margin: 4px 0; font-weight: 500; }
    .p-tag { font-size: 0.6rem; font-weight: 950; text-transform: uppercase; color: #3B82F6; letter-spacing: 0.5px; }

    .r-bar { height: 6px; background: #F1F5F9; border-radius: 3px; overflow: hidden; }
    .r-fill { height: 100%; transition: width 1s ease; }
    .r-label { font-size: 0.8rem; font-weight: 800; color: #64748B; }
    .r-val { font-size: 0.8rem; font-weight: 900; color: #1E293B; }

    .nexus-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #F8FAFC; border-radius: 14px; margin-bottom: 8px; }
    .n-name { font-size: 0.85rem; font-weight: 800; color: #334155; }
    .n-latency { font-size: 0.65rem; color: #94A3B8; margin-left: 6px; font-weight: 700; }
    .n-status { display: flex; align-items: center; gap: 8px; }
    .n-dot { width: 6px; height: 6px; border-radius: 50%; background: #CBD5E1; }
    .n-dot.online { background: #10B981; box-shadow: 0 0 6px #10B981; }
    .n-text { font-size: 0.65rem; font-weight: 950; color: #10B981; }
    .n-text.offline { color: #EF4444; }

    .badge-elite { font-size: 0.65rem; font-weight: 950; padding: 4px 10px; border-radius: 20px; background: #1E293B; color: white; text-transform: uppercase; }
    .pulsate { animation: pulsate 2s infinite; }
    @keyframes pulsate { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

    .border-elite-red { border-left: 5px solid var(--kra-red); }
    .border-elite-blue { border-left: 5px solid #3B82F6; }
    .border-elite-purple { border-left: 5px solid #8B5CF6; }
    .border-elite-gold { border-left: 5px solid #F59E0B; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(AdminDashboardService);
  private auditService = inject(AuditLogService);

  loading = signal(true);
  portalsLoading = signal(true);
  error = signal('');
  summary = signal<AdminDashboardSummary | null>(null);
  portals = signal<PortalStatus[]>([]);
  recentLogs = signal<AuditLog[]>([]);

  ngOnInit() {
    this.refreshIntelligence();
    this.refreshLogs();
  }

  refreshIntelligence() {
    this.loading.set(true);
    this.portalsLoading.set(true);
    
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

    this.dashboardService.getPortalsStatus().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.portals.set(res.data);
        }
        this.portalsLoading.set(false);
      },
      error: () => {
        this.portalsLoading.set(false);
      }
    });
  }

  refreshLogs() {
    // Fetch last 10 logs for the pulse
    this.auditService.getLogs(1, 10).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.recentLogs.set(res.data.logs);
        }
      }
    });
  }
}

