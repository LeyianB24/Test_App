import { Component, inject, computed, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardDataService } from '../../../services/dashboard-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-member-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="db-root animate-fade-in">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner animate-stagger">
        <!-- Elite Header -->
        <header class="db-header-elite">
          <div class="header-left">
            <div class="live-badge">
              <span class="live-dot"></span>
              TAXPAYER CONTROL CENTRE
            </div>
            <h1 class="premium-title">Fiscal <span class="text-red">Telemetry</span></h1>
            <p class="premium-subtitle">Unified tax telemetry & compliance dashboard · Fiscal Year {{ currentYear }}</p>
          </div>
          
          <div class="header-right">
            <div class="action-stack">
              <button class="btn-ghost-elite" (click)="downloadStatusReport()">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                EXPORT REPORT
              </button>
              <button class="btn-primary-elite" (click)="router.navigate(['/member/payments-enhanced'])">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                QUICK PAY
              </button>
            </div>
          </div>
        </header>

        <!-- KPI Grid -->
        <div class="kpi-grid-elite">
          <!-- KPI: Revenue -->
          <div class="elite-card kpi-box">
            <div class="card-glow"></div>
            <div class="kpi-head">
              <span class="kpi-label">REVENUE PAID YTD</span>
              <div class="kpi-icon-wrap">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>
              </div>
            </div>
            <div class="kpi-main">
              <span class="kpi-currency">KES</span>
              <span class="kpi-number">{{ (dashboardData.statistics().total_revenue || 0) | number:'1.0-0' }}</span>
            </div>
            <div class="kpi-foot">
              <span class="trend-indicator positive">↑ 14.2% GROWTH</span>
              <div class="mini-trace">
                <div class="trace-fill" style="width: 72%"></div>
              </div>
            </div>
          </div>

          <!-- KPI: Obligations -->
          <div class="elite-card kpi-box" [class.alert]="dashboardData.statistics().count_pending_obligations > 0">
            <div class="card-glow"></div>
            <div class="kpi-head">
              <span class="kpi-label">PENDING OBLIGATIONS</span>
              <div class="kpi-icon-wrap">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <div class="kpi-main">
              <span class="kpi-number">{{ dashboardData.statistics().count_pending_obligations || 0 }}</span>
            </div>
            <div class="kpi-foot">
              @if (dashboardData.statistics().count_pending_obligations > 0) {
                <span class="status-badge alert">ACTION REQUIRED</span>
              } @else {
                <span class="status-badge success">FULLY COMPLIANT</span>
              }
            </div>
          </div>

          <!-- KPI: Returns -->
          <div class="elite-card kpi-box">
            <div class="card-glow"></div>
            <div class="kpi-head">
              <span class="kpi-label">RETURNS FILED</span>
              <div class="kpi-icon-wrap">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
            </div>
            <div class="kpi-main">
              <span class="kpi-number">{{ dashboardData.statistics().total_returns || 0 }}</span>
            </div>
            <div class="kpi-foot">
              <span class="kpi-sub-text">CURRENT FISCAL CYCLE</span>
            </div>
          </div>

          <!-- KPI: Health Score -->
          <div class="elite-card kpi-box highlight">
            <div class="card-glow"></div>
            <div class="kpi-head">
              <span class="kpi-label">COMPLIANCE SCORE</span>
              <div class="kpi-icon-wrap red">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
            </div>
            <div class="kpi-main">
              <span class="kpi-number text-red">{{ complianceScore() }}%</span>
            </div>
            <div class="kpi-foot">
              <span class="status-badge success">ELITE STATUS</span>
              <div class="mini-trace red">
                <div class="trace-fill" [style.width.%]="complianceScore()"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="dashboard-grid-elite">
          
          <!-- Primary: Chart Section -->
          <div class="elite-card chart-section">
            <div class="card-glow"></div>
            <div class="panel-header-elite">
              <div class="header-left">
                <h2 class="panel-title">Contribution Matrix</h2>
                <p class="panel-desc">12-month payment trend aggregation</p>
              </div>
              <div class="header-right">
                <div class="live-tag">
                  <span class="pulse-dot"></span>
                  LIVE TELEMETRY
                </div>
              </div>
            </div>

            <div class="chart-container-elite">
              <div class="y-labels">
                <span>100K</span><span>75K</span><span>50K</span><span>25K</span><span>0</span>
              </div>
              <div class="chart-canvas">
                <div class="grid-lines">
                  <div class="gl"></div><div class="gl"></div><div class="gl"></div><div class="gl"></div><div class="gl"></div>
                </div>
                <div class="bars-container">
                  @for (bar of chartBars; track $index) {
                    <div class="bar-group">
                      <div class="bar-pillar" [style.height.%]="bar.pct" [class.highlight]="bar.highlight">
                        <div class="bar-tooltip">
                          <span class="tt-month">{{ bar.month }}</span>
                          <span class="tt-val">KES {{ bar.value }}K</span>
                        </div>
                      </div>
                      <span class="bar-month">{{ bar.month }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="chart-footer-elite">
              <div class="chart-legend">
                <div class="legend-item"><span class="dot muted"></span> STANDARD</div>
                <div class="legend-item"><span class="dot red"></span> ACTIVE PERIOD</div>
              </div>
              <div class="ytd-summary">
                <span class="label">YTD TOTAL</span>
                <span class="value">KES {{ (dashboardData.statistics().total_revenue || 0) | number:'1.0-0' }}</span>
              </div>
            </div>
          </div>

          <!-- Secondary: Status & Nav -->
          <div class="side-stack-elite">
            
            <!-- Health Ring -->
            <div class="elite-card health-box">
              <div class="card-glow"></div>
              <h3 class="panel-title-sm">FISCAL HEALTH</h3>
              <div class="ring-system">
                <svg class="ring-svg" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" class="ring-track" stroke-width="8"/>
                  <circle cx="60" cy="60" r="54" fill="none"
                    class="ring-progress"
                    stroke-width="8"
                    stroke-linecap="round"
                    stroke-dasharray="339.29"
                    [style.stroke-dashoffset]="dashOffset()"
                    transform="rotate(-90 60 60)" />
                </svg>
                <div class="ring-content">
                  <span class="ring-pct">{{ complianceScore() }}%</span>
                  <span class="ring-meta">OPERATIONAL</span>
                </div>
              </div>
            </div>

            <!-- Quick Access Nav -->
            <div class="elite-card nav-box">
              <div class="card-glow"></div>
              <h3 class="panel-title-sm">QUICK ACCESS</h3>
              <div class="quick-nav-grid">
                <button class="nav-btn-elite" routerLink="/member/payments-enhanced">
                  <div class="btn-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                  </div>
                  <span>Pay Tax</span>
                </button>
                <button class="nav-btn-elite" routerLink="/member/returns">
                  <div class="btn-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <span>File Returns</span>
                </button>
                <button class="nav-btn-elite" routerLink="/member/installments">
                  <div class="btn-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <span>Plans</span>
                </button>
                <button class="nav-btn-elite" routerLink="/member/statements">
                  <div class="btn-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </div>
                  <span>Logs</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Audit Trail -->
        <div class="elite-card audit-section">
          <div class="card-glow"></div>
          <div class="panel-header-elite">
            <div class="header-left">
              <h2 class="panel-title">Fiscal Audit Trail</h2>
              <p class="panel-desc">Recent ledger entries and system events</p>
            </div>
            <button class="btn-link-elite" routerLink="/member/payments-enhanced">VIEW COMPLETE LEDGER →</button>
          </div>
          <div class="audit-list-elite">
            @for (item of activities(); track item.timestamp) {
              <div class="audit-item-elite">
                <div class="audit-icon" [class.success]="item.status === 'success'">
                  @if (item.status === 'success') {
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7"/></svg>
                  } @else {
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M12 8v4l3 3"/></svg>
                  }
                </div>
                <div class="audit-details">
                  <span class="audit-action">{{ item.action }}</span>
                  <span class="audit-meta">{{ item.date }} · SECURE SYSTEM ENTRY</span>
                </div>
                <div class="audit-status" [class.success]="item.status === 'success'">{{ item.statusLabel }}</div>
              </div>
            } @empty {
              <div class="audit-empty-elite">
                <p>No recent synchronization logs detected.</p>
              </div>
            }
          </div>
        </div>

        <!-- Footer -->
        <footer class="db-footer-elite">
           <p>STATUTORY FISCAL DASHBOARD. DATA IS ENCRYPTED AND SYNCHRONIZED WITH THE CENTRAL REVENUE ENGINE. UNAUTHORIZED MODIFICATION IS PROHIBITED.</p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

    .db-root { 
      min-height: 100vh; 
      background: #050505 url('/assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      color: var(--text-pri); 
      position: relative; 
      overflow-x: hidden; 
      padding-bottom: 5rem;
    }
    
    .db-root::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.15), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { 
      position: fixed; 
      inset: 0; 
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); 
      opacity: 0.02; 
      z-index: 2; 
      pointer-events: none; 
    }

    .db-inner { 
      max-width: 1600px; 
      margin: 0 auto; 
      padding: 60px 40px; 
      display: flex; 
      flex-direction: column; 
      gap: 50px; 
      position: relative; 
      z-index: 10; 
    }

    /* Header Enhancement */
    .db-header-elite { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
    }
    .premium-title { 
      font-size: 56px; 
      font-weight: 950; 
      letter-spacing: -2.5px; 
      line-height: 0.9; 
      margin: 16px 0 12px; 
      text-transform: uppercase;
    }
    .text-red { 
      color: var(--kra-red-light); 
      -webkit-text-stroke: 1px var(--kra-red-light);
      text-shadow: 0 0 20px var(--kra-red-glow);
    }
    .premium-subtitle { 
      font-size: 11px; 
      font-weight: 900; 
      color: var(--text-sec); 
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    /* Cards & Glassmorphism */
    .elite-card { 
      background: rgba(20, 32, 26, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08); 
      border-radius: 32px; 
      padding: 32px; 
      position: relative; 
      overflow: hidden; 
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); 
    }
    .elite-card:hover { 
      background: rgba(20, 32, 26, 0.6);
      border-color: rgba(217, 43, 43, 0.3); 
      transform: translateY(-5px) scale(1.01); 
      box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 20px rgba(217, 43, 43, 0.1); 
    }
    
    .kpi-grid-elite { 
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 28px; 
    }
    
    .kpi-label { 
      font-size: 9px; 
      font-weight: 950; 
      color: var(--text-mut); 
      letter-spacing: 3px; 
      text-transform: uppercase;
    }
    .kpi-number { 
      font-size: 42px; 
      font-weight: 950; 
      letter-spacing: -2px; 
      line-height: 1; 
      color: var(--text-pri);
    }

    /* Components Spacing */
    .dashboard-grid-elite { 
      display: grid; 
      grid-template-columns: 1fr 380px; 
      gap: 32px; 
    }

    .btn-primary-elite { 
      background: var(--kra-red); 
      border: none; 
      color: white; 
      padding: 16px 32px; 
      border-radius: 18px; 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      font-size: 12px; 
      font-weight: 950; 
      letter-spacing: 2px; 
      cursor: pointer; 
      transition: all 0.4s; 
      box-shadow: 0 12px 32px var(--kra-red-glow); 
      text-transform: uppercase;
    }
    .btn-primary-elite:hover { 
      background: var(--kra-red-bright); 
      transform: translateY(-3px) scale(1.05); 
      box-shadow: 0 20px 48px var(--kra-red-glow); 
    }

    .btn-ghost-elite { 
      background: rgba(255, 255, 255, 0.03); 
      border: 1px solid rgba(255, 255, 255, 0.08); 
      color: var(--text-pri); 
      padding: 16px 28px; 
      border-radius: 18px; 
      font-size: 11px; 
      font-weight: 950; 
      letter-spacing: 2px; 
      text-transform: uppercase;
      transition: all 0.4s;
    }
    .btn-ghost-elite:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
    }

    /* Charts */
    .chart-container-elite { height: 350px; }
    .bar-pillar { 
      border-radius: 12px 12px 4px 4px; 
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .bar-pillar.highlight { 
      background: linear-gradient(to top, var(--kra-red), var(--kra-red-light));
      border: none;
      box-shadow: 0 0 30px var(--kra-red-glow);
    }

    /* Custom Scrollbar for HD Experience */
    .audit-list-elite::-webkit-scrollbar { width: 4px; }
    .audit-list-elite::-webkit-scrollbar-track { background: transparent; }
    .audit-list-elite::-webkit-scrollbar-thumb { background: rgba(217, 43, 43, 0.3); border-radius: 10px; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 1200px) {
      .kpi-grid-elite { grid-template-columns: repeat(2, 1fr); }
      .dashboard-grid-elite { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .premium-title { font-size: 32px; }
      .kpi-grid-elite { grid-template-columns: 1fr; }
      .db-header-elite { flex-direction: column; align-items: flex-start; gap: 24px; }
    }
  `]
})
export class MemberDashboardComponent implements OnInit {
  authService   = inject(AuthService);
  dashboardData = inject(DashboardDataService);
  router        = inject(Router);

  currentYear = new Date().getFullYear();
  currentUser = computed(() => this.authService.currentUser());
  userName    = computed(() => this.currentUser()?.name || 'Authorized Taxpayer');

  complianceScore = computed(() => {
    const pending = this.dashboardData.statistics().count_pending_obligations || 0;
    return pending === 0 ? 98 : Math.max(10, 98 - pending * 15);
  });

  dashOffset = computed(() => {
    const c = 2 * Math.PI * 50; // r = 50
    return c - (this.complianceScore() / 100) * c;
  });

  chartBars = [
    { month: 'Jan', value: 52,  pct: 52,  highlight: false },
    { month: 'Feb', value: 68,  pct: 68,  highlight: false },
    { month: 'Mar', value: 45,  pct: 45,  highlight: false },
    { month: 'Apr', value: 89,  pct: 89,  highlight: false },
    { month: 'May', value: 60,  pct: 60,  highlight: false },
    { month: 'Jun', value: 79,  pct: 79,  highlight: false },
    { month: 'Jul', value: 55,  pct: 55,  highlight: false },
    { month: 'Aug', value: 74,  pct: 74,  highlight: false },
    { month: 'Sep', value: 63,  pct: 63,  highlight: false },
    { month: 'Oct', value: 85,  pct: 85,  highlight: false },
    { month: 'Nov', value: 92,  pct: 92,  highlight: false },
    { month: 'Dec', value: 100, pct: 100, highlight: true  },
  ];

  activities = computed(() => {
    const payments = this.dashboardData.recentPayments().map(p => ({
      action: `Payment: ${p.payment_reference}`,
      date: p.payment_date, status: 'success', statusLabel: 'SETTLED',
      timestamp: new Date(p.payment_date).getTime()
    }));
    const returns = this.dashboardData.recentReturns().map(r => ({
      action: `Return Filed: ${r.return_reference}`,
      date: r.filing_date, status: 'success', statusLabel: 'FILED',
      timestamp: new Date(r.filing_date).getTime()
    }));
    return [...payments, ...returns]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6);
  });

  ngOnInit() {}

  downloadStatusReport() {
    window.open(`${environment.apiUrl}/download.php?type=status_report&id=1&format=pdf`, '_blank');
  }
}
