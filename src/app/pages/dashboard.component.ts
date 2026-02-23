import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardDataService } from '../services/dashboard-data.service';
import { AuthService } from '../services/auth.service';

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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container animate-up">
      
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Portal <span class="gradient-text">Executive</span></h1>
          <p class="premium-subtitle">System Hub Overseeing Revenue & Compliance for {{ userName() }}</p>
        </div>
        <div class="header-actions">
           <button class="modern-btn outline-btn sm" (click)="downloadStatusReport()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2.5"/></svg>
              Status Report
           </button>
           <button class="modern-btn primary-btn" (click)="router.navigate(['/payments'])">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="3"/></svg>
              Immediate Payment
           </button>
        </div>
      </header>

      <!-- Elite Dashboard Content -->
      <div class="elite-grid">
        
        <!-- Left Section: Main Intelligence -->
        <div class="elite-main-hub">
           
           <!-- Identity & Compliance Pulse -->
           <div class="compliance-card-luxury animate-up delay-1">
              <div class="compliance-glass">
                 <div class="c-header">
                    <div class="c-badge">TAX COMPLIANCE SCORE</div>
                    <div class="c-status" [class.danger]="complianceScore() < 80">Excellent Resilience</div>
                 </div>
                 
                 <div class="c-body">
                    <div class="c-viz">
                       <svg class="c-ring" viewBox="0 0 100 100">
                          <circle class="c-bg" cx="50" cy="50" r="45"></circle>
                          <circle class="c-fill" cx="50" cy="50" r="45" [style.stroke-dashoffset]="calculateDash()"></circle>
                       </svg>
                       <span class="c-val-text">{{ complianceScore() }}%</span>
                    </div>
                    <div class="c-info">
                       <h2 class="u-display-name">{{ userName() }}</h2>
                       <p class="u-display-meta">STATION: {{ dashboardData.station() }} | ID: {{ dashboardData.taxpayerProfile()?.id_number }}</p>
                        <div class="u-obligations">
                           @for (ob of dashboardData.obligations(); track ob.obligation_id) {
                             <span class="ob-chip">{{ ob.obligation_name }}</span>
                           }
                        </div>
                    </div>
                 </div>

                 <div class="c-footer">
                    <div class="footer-stat">
                       <span class="fs-label">Next Obligation</span>
                       <span class="fs-val">Jan 20, 2026</span>
                    </div>
                    <div class="fs-divider"></div>
                    <div class="footer-stat">
                       <span class="fs-label">Audit Status</span>
                       <span class="fs-val">Verified Seal</span>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Stats Intelligence Grids -->
            <div class="row g-4 mt-3">
               @for (stat of stats(); track stat.label; let i = $index) {
                 <div class="col-xl-3 col-md-6">
                    <div class="premium-stat-card d-flex align-items-center p-4 animate-up" [class]="'delay-' + (i+1)">
                      <div class="stat-icon-wrapper me-3" [class]="stat.color">
                         <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" [attr.d]="stat.icon" />
                         </svg>
                      </div>
                      <div class="stat-info flex-grow-1">
                         <span class="stat-label text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 0.75rem; letter-spacing: 0.5px;">{{ stat.label }}</span>
                         <div class="d-flex align-items-baseline justify-content-between">
                            <h3 class="stat-number mb-0 fw-bolder">{{ formatValue(stat) }}</h3>
                            <span class="stat-trend badge rounded-pill" 
                                  [class.bg-success-subtle]="stat.trendDirection === 'up'" 
                                  [class.text-success]="stat.trendDirection === 'up'"
                                  [class.bg-danger-subtle]="stat.trendDirection === 'down'"
                                  [class.text-danger]="stat.trendDirection === 'down'">
                              {{ stat.trend }}
                            </span>
                         </div>
                      </div>
                    </div>
                 </div>
               }
            </div>

           <!-- Revenue Flow Analytics -->
           <div class="content-card-premium mt-32 animate-up delay-2">
              <div class="card-p-header">
                 <div class="p-title-group">
                    <h3 class="card-p-title">Fiscal Contribution Analytics</h3>
                    <p class="card-p-subtitle">Historical revenue transmission over the current fiscal cycle</p>
                 </div>
                 <div class="p-actions">
                    <button class="icon-btn-elite active"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-width="2"/></svg></button>
                    <button class="icon-btn-elite"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2"/></svg></button>
                 </div>
              </div>
               <div class="luxury-chart-surface">
                 @if (chartData().length > 0) {
                    <div class="chart-bars-elite">
                      @for (bar of chartData(); track bar.month) {
                        <div class="bar-elite-wrapper">
                           <div class="bar-elite" [style.height.%]="getBarHeight(bar.amount)" [class.active]="bar.active">
                              <div class="bar-value-hint">KES {{ bar.amount / 1000 }}K</div>
                           </div>
                           <span class="bar-name">{{ bar.month }}</span>
                        </div>
                      }
                    </div>
                 } @else {
                    <div class="no-data-placeholder">No revenue data available for this period.</div>
                 }
                 <div class="chart-grid-lines">
                    <span></span><span></span><span></span><span></span>
                 </div>
               </div>
           </div>

        </div>

        <!-- Right Section: Executive Widgets -->
        <div class="elite-sidebar-hub">
           
           <div class="control-panel-luxury animate-up delay-2">
              <h4 class="luxury-widget-title">Command Center</h4>
              <div class="command-grid">
                 <button class="cmd-tile" (click)="router.navigate(['/returns'])">
                    <div class="cmd-icon-box blue"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2"/></svg></div>
                    <span>File Returns</span>
                 </button>
                 <button class="cmd-tile" (click)="router.navigate(['/etims'])">
                    <div class="cmd-icon-box gold"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" stroke-width="2"/></svg></div>
                    <span>e-TIMS Portal</span>
                 </button>
                 <button class="cmd-tile" (click)="router.navigate(['/debt'])">
                    <div class="cmd-icon-box red"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg></div>
                    <span>Clear Debt</span>
                 </button>
                 <button class="cmd-tile" (click)="router.navigate(['/settings'])">
                    <div class="cmd-icon-box grey"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-width="2"/></svg></div>
                    <span>Settings</span>
                 </button>
              </div>
           </div>

           <div class="activity-card-luxury mt-32 animate-up delay-3">
              <div class="card-p-header">
                 <h3 class="card-p-title">Recent Transactions</h3>
                 <a href="#" class="view-link">See Archive</a>
              </div>
               <div class="refined-timeline mt-24">
                  @for (act of activities(); track act.timestamp) {
                    <div class="timeline-unit">
                       <div class="unit-icon" [class]="act.status">
                          @if (act.status === 'success') {
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                          }
                          @if (act.status === 'warning') {
                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                          }
                       </div>
                       <div class="unit-details">
                          <p class="u-action">{{ act.action }}</p>
                          <span class="u-date">{{ act.date }}</span>
                       </div>
                       <div class="unit-extra">
                          <span class="u-badge" [class]="act.status">{{ act.statusLabel }}</span>
                       </div>
                    </div>
                  }
               </div>
              <button class="upgrade-ad-btn mt-32">
                 ⚡ Switch to Advance Portal
              </button>
           </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .elite-grid { display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
    
    /* Compliance Card Luxury */
    .compliance-card-luxury {
      background: var(--kra-gradient); border-radius: 40px; padding: 1px;
      box-shadow: 0 30px 60px rgba(227, 30, 36, 0.2); margin-bottom: 40px;
    }
    .compliance-glass {
      background: rgba(10, 34, 61, 0.4); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border-radius: 39px; padding: 40px; color: white;
    }
    .c-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .c-badge { font-size: 0.75rem; font-weight: 900; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 12px; letter-spacing: 1px; }
    .c-status { font-size: 0.85rem; font-weight: 800; color: #10B981; text-transform: uppercase; letter-spacing: 1.5px; }
    .c-status.danger { color: #f87171; }

    .c-body { display: flex; gap: 40px; align-items: center; }
    .c-viz { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
    .c-ring { width: 100%; height: 100%; transform: rotate(-90deg); }
    .c-bg { fill: none; stroke: rgba(255,255,255,0.1); stroke-width: 10; }
    .c-fill { fill: none; stroke: white; stroke-width: 10; stroke-linecap: round; stroke-dasharray: 283; transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
    .c-val-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: 900; }
    
    .u-display-name { font-size: 2.2rem; font-weight: 900; margin: 0; letter-spacing: -1.5px; }
    .u-display-meta { font-size: 0.95rem; color: rgba(255,255,255,0.6); font-weight: 600; margin-top: 4px; }
    .u-obligations { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
    .ob-chip { background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 4px 12px; font-size: 0.75rem; font-weight: 800; }

    .c-footer { display: flex; gap: 50px; margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); }
    .fs-label { display: block; font-size: 0.8rem; font-weight: 800; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-bottom: 4px; }
    .fs-val { font-size: 1.1rem; font-weight: 800; }
    .fs-divider { width: 1px; background: rgba(255,255,255,0.1); height: 40px; }

    /* Analytics Chart */
    .card-p-header { padding: 32px; display: flex; justify-content: space-between; align-items: center; }
    .card-p-title { font-size: 1.25rem; font-weight: 900; color: var(--text-main); margin: 0; letter-spacing: -0.5px; }
    .card-p-subtitle { font-size: 0.9rem; color: var(--text-muted); font-weight: 600; margin-top: 4px; }
    .luxury-chart-surface { padding: 0 40px 40px 40px; height: 280px; display: flex; flex-direction: column; position: relative; }
    .chart-bars-elite { height: 100%; display: flex; align-items: flex-end; justify-content: space-between; z-index: 2; gap: 20px; }
    .bar-elite-wrapper { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .bar-elite { width: 100%; max-width: 50px; background: #E2E8F0; border-radius: 12px 12px 6px 6px; position: relative; transition: 0.4s; }
    .bar-elite.active { background: var(--kra-gradient); box-shadow: 0 10px 20px rgba(227, 30, 36, 0.15); }
    .bar-value-hint { position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background: #1a202c; color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; opacity: 0; transition: 0.3s; pointer-events: none; }
    .bar-elite:hover { transform: scaleX(1.1); }
    .bar-elite:hover .bar-value-hint { opacity: 1; top: -45px; }
    .bar-name { font-size: 0.8rem; font-weight: 800; color: var(--text-muted); }
    .chart-grid-lines { position: absolute; inset: 40px 40px 85px 40px; display: flex; flex-direction: column; justify-content: space-between; pointer-events: none; }
    .chart-grid-lines span { height: 1px; background: #F1F5F9; width: 100%; }

    /* Control Panel */
    .control-panel-luxury { background: var(--kra-blue); border-radius: 32px; padding: 32px; color: white; }
    .luxury-widget-title { font-size: 1rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 24px 0; color: rgba(255,255,255,0.6); }
    .command-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .cmd-tile { 
      background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 24px; color: white; cursor: pointer; transition: 0.3s;
      display: flex; flex-direction: column; align-items: center; gap: 14px; font-family: inherit;
    }
    .cmd-tile:hover { background: white; color: var(--kra-blue); transform: translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
    .cmd-icon-box { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
    .cmd-icon-box.blue { background: rgba(59, 130, 246, 0.2); color: #60A5FA; }
    .cmd-icon-box.gold { background: rgba(212, 175, 55, 0.2); color: #FCD34D; }
    .cmd-icon-box.red { background: rgba(239, 68, 68, 0.2); color: #F87171; }
    .cmd-icon-box.grey { background: rgba(255, 255, 255, 0.1); color: white; }
    .cmd-tile:hover .cmd-icon-box { background: rgba(10, 34, 61, 0.05); color: inherit; }
    .cmd-tile span { font-weight: 800; font-size: 0.9rem; }

    /* Refined Timeline */
    .refined-timeline { display: flex; flex-direction: column; gap: 20px; }
    .timeline-unit { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 16px; transition: 0.3s; }
    .timeline-unit:hover { background: #F8FAFC; }
    .unit-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .unit-icon.success { background: #ECFDF5; color: #10B981; }
    .unit-icon.warning { background: #FFF7ED; color: #F59E0B; }
    .u-action { font-weight: 800; color: var(--text-main); margin: 0; font-size: 0.95rem; }
    .u-date { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }
    .u-badge { margin-left: auto; font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }
    .u-badge.success { background: #ECFDF5; color: #059669; }
    .u-badge.warning { background: #FFF7ED; color: #D97706; }
    .upgrade-ad-btn { width: 100%; padding: 16px; background: #F1F5F9; border: none; border-radius: 16px; color: var(--text-secondary); font-weight: 800; cursor: pointer; transition: 0.3s; font-family: inherit; }
    .upgrade-ad-btn:hover { background: var(--kra-blue); color: white; }

    @media (max-width: 1400px) {
       .elite-grid { grid-template-columns: 1fr; }
       .elite-sidebar-hub { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    }
    @media (max-width: 900px) {
       .elite-sidebar-hub { grid-template-columns: 1fr; }
       .u-display-name { font-size: 1.5rem; }
       .c-body { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class DashboardComponent implements OnInit {
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

  stats = computed<DashboardStat[]>(() => {
    const s = this.dashboardData.statistics();
    return [
      { 
        label: 'Fiscal revenue (YTD)', 
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
        trend: s.count_pending_obligations > 0 ? 'Critical Task' : 'All Clear', 
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
  });

  chartData = computed(() => this.dashboardData.chartData());

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
    this.dashboardData.refreshData().subscribe();
  }

  calculateDash(): number {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    return circumference - (this.complianceScore() / 100) * circumference;
  }

  formatValue(stat: DashboardStat): string {
    if (stat.type === 'currency') return 'KES ' + (stat.value / 1000).toFixed(1) + 'K';
    if (stat.type === 'percent') return stat.value + '%';
    return stat.value.toString();
  }

  getBarHeight(amount: number): number {
    const max = Math.max(...this.chartData().map(d => d.amount), 1000); 
    return (amount / max) * 100;
  }

  downloadStatusReport() {
    window.open('http://localhost/itax/kra-api/download.php?type=status_report&id=1&format=pdf', '_blank');
  }
}
