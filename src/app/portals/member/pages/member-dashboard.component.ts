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
    :host {
      --red:          #D92B2B;
      --red-bright:   #EF3B3B;
      --red-glow:     rgba(217, 43, 43, 0.38);
      --red-pale:     rgba(217, 43, 43, 0.10);
      --red-border:   rgba(217, 43, 43, 0.22);

      --bg-root:      #0C0C0C;
      --bg-card:      #141414;
      --bg-card-2:    #1C1C1C;
      --bg-card-3:    #232323;
      
      --text-pri:     #F0F0F0;
      --text-sec:     #888888;
      --text-mut:     #4A4A4A;

      --bdr:          rgba(255, 255, 255, 0.08);
      --bdr-md:       rgba(255, 255, 255, 0.14);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    .db-root { min-height: 100vh; background: var(--bg-root); color: var(--text-pri); position: relative; overflow-x: hidden; }
    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.03; z-index: 1; pointer-events: none; }
    .accent-bleed { position: fixed; top: -10vw; left: -10vw; width: 40vw; height: 40vw; background: var(--red); filter: blur(15vw); opacity: 0.08; border-radius: 50%; z-index: 1; pointer-events: none; }

    .db-inner { max-width: 1440px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 40px; position: relative; z-index: 10; }

    /* Header */
    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; }
    .premium-title { font-size: 40px; font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--red); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .action-stack { display: flex; gap: 12px; }
    .btn-ghost-elite { background: transparent; border: 1px solid var(--bdr); color: var(--text-sec); padding: 12px 20px; border-radius: 14px; display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; }
    .btn-ghost-elite:hover { background: var(--bg-card-2); color: var(--text-pri); }
    .btn-primary-elite { background: var(--red); border: none; color: white; padding: 12px 24px; border-radius: 14px; display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 24px var(--red-glow); }
    .btn-primary-elite:hover { transform: translateY(-2px); background: var(--red-bright); box-shadow: 0 12px 32px var(--red-glow); }

    /* KPI Grid */
    .kpi-grid-elite { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 28px; padding: 24px; position: relative; overflow: hidden; transition: all 0.3s; }
    .card-glow { position: absolute; top: -100px; left: -100px; width: 300px; height: 300px; background: var(--red); filter: blur(100px); opacity: 0.03; pointer-events: none; }
    
    .kpi-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .kpi-label { font-size: 10px; font-weight: 900; color: var(--text-mut); letter-spacing: 1px; }
    .kpi-icon-wrap { width: 40px; height: 40px; border-radius: 12px; background: var(--bg-card-2); border: 1px solid var(--bdr); display: flex; align-items: center; justify-content: center; color: var(--text-sec); }
    .kpi-icon-wrap.red { background: var(--red-pale); color: var(--red); border-color: var(--red-border); }

    .kpi-main { display: flex; align-items: baseline; gap: 6px; margin-bottom: 20px; }
    .kpi-currency { font-size: 14px; font-weight: 800; color: var(--text-mut); padding-bottom: 4px; }
    .kpi-number { font-size: 32px; font-weight: 950; letter-spacing: -1px; line-height: 1; }

    .status-badge { display: inline-flex; padding: 4px 10px; border-radius: 8px; font-size: 9px; font-weight: 900; letter-spacing: 0.5px; }
    .status-badge.alert { background: var(--red-pale); color: var(--red-bright); }
    .status-badge.success { background: var(--bg-card-2); color: var(--text-sec); border: 1px solid var(--bdr); }

    .kpi-box.alert { border-color: var(--red-border); }
    .kpi-box.alert .card-glow { opacity: 0.1; }

    .trend-indicator { font-size: 10px; font-weight: 900; margin-bottom: 8px; display: block; }
    .trend-indicator.positive { color: #10b981; }

    .mini-trace { height: 4px; background: var(--bg-card-2); border-radius: 2px; overflow: hidden; margin-top: 12px; }
    .trace-fill { height: 100%; background: var(--text-mut); transition: width 1s ease-out; }
    .mini-trace.red .trace-fill { background: var(--red); box-shadow: 0 0 10px var(--red-glow); }

    /* Main Grid */
    .dashboard-grid-elite { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
    .side-stack-elite { display: flex; flex-direction: column; gap: 24px; }

    /* Chart Section */
    .chart-section { padding: 32px; }
    .panel-header-elite { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .panel-title { font-size: 20px; font-weight: 900; margin-bottom: 4px; }
    .panel-desc { font-size: 13px; color: var(--text-sec); }

    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s infinite; }

    .chart-container-elite { display: flex; gap: 20px; height: 300px; margin-bottom: 32px; }
    .y-labels { display: flex; flex-direction: column; justify-content: space-between; height: 100%; font-size: 10px; font-weight: 800; color: var(--text-mut); text-align: right; width: 40px; padding-bottom: 24px; }
    .chart-canvas { flex: 1; position: relative; height: 100%; }
    .grid-lines { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 24px; }
    .grid-lines .gl { height: 1px; background: var(--bdr); width: 100%; }

    .bars-container { position: absolute; inset: 0; display: flex; align-items: flex-end; gap: 12px; padding-bottom: 24px; }
    .bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; height: 100%; justify-content: flex-end; position: relative; }
    .bar-pillar { width: 100%; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 6px 6px 0 0; position: relative; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); cursor: pointer; }
    .bar-pillar:hover { background: var(--bg-card-3); transform: scaleX(1.1); }
    .bar-pillar.highlight { background: var(--red); border-color: var(--red-bright); box-shadow: 0 10px 20px var(--red-pale); }
    
    .bar-tooltip { position: absolute; bottom: calc(100% + 12px); left: 50%; transform: translateX(-50%) translateY(10px); background: var(--bg-card-3); border: 1px solid var(--bdr-md); padding: 8px 12px; border-radius: 10px; display: flex; flex-direction: column; align-items: center; opacity: 0; pointer-events: none; transition: all 0.2s; white-space: nowrap; z-index: 100; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .tt-month { font-size: 9px; font-weight: 900; color: var(--text-mut); text-transform: uppercase; }
    .tt-val { font-size: 13px; font-weight: 950; color: var(--text-pri); }
    .bar-pillar:hover .bar-tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }
    .bar-month { font-size: 10px; font-weight: 900; color: var(--text-mut); text-transform: uppercase; }

    .chart-footer-elite { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--bdr); }
    .chart-legend { display: flex; gap: 24px; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 900; color: var(--text-sec); }
    .legend-item .dot { width: 10px; height: 10px; border-radius: 3px; }
    .legend-item .dot.muted { background: var(--bg-card-2); border: 1px solid var(--bdr); }
    .legend-item .dot.red { background: var(--red); box-shadow: 0 0 10px var(--red-glow); }
    .ytd-summary { display: flex; flex-direction: column; align-items: flex-end; }
    .ytd-summary .label { font-size: 10px; font-weight: 900; color: var(--text-mut); }
    .ytd-summary .value { font-size: 18px; font-weight: 950; color: var(--text-pri); }

    /* Health Ring */
    .panel-title-sm { font-size: 10px; font-weight: 950; letter-spacing: 2px; color: var(--text-mut); text-transform: uppercase; margin-bottom: 24px; }
    .ring-system { position: relative; width: 160px; height: 160px; margin: 0 auto; }
    .ring-svg { width: 100%; height: 100%; }
    .ring-track { stroke: var(--bg-card-2); }
    .ring-progress { stroke: var(--red); transition: stroke-dashoffset 1.5s cubic-bezier(0.2, 0.8, 0.2, 1); filter: drop-shadow(0 0 10px var(--red-glow)); }
    .ring-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .ring-pct { font-size: 32px; font-weight: 950; line-height: 1; }
    .ring-meta { font-size: 9px; font-weight: 900; color: var(--red-bright); letter-spacing: 1px; margin-top: 4px; }

    /* Quick Nav */
    .quick-nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .nav-btn-elite { background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 18px; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start; cursor: pointer; transition: all 0.3s; text-align: left; }
    .nav-btn-elite:hover { background: var(--bg-card-3); border-color: var(--red-border); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .btn-icon { width: 40px; height: 40px; border-radius: 12px; background: var(--red-pale); border: 1px solid var(--red-border); color: var(--red-bright); display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
    .nav-btn-elite:hover .btn-icon { background: var(--red); color: white; box-shadow: 0 8px 20px var(--red-glow); }
    .nav-btn-elite span { font-size: 13px; font-weight: 800; color: var(--text-sec); }
    .nav-btn-elite:hover span { color: var(--text-pri); }

    /* Audit Section */
    .audit-section { padding: 32px; }
    .btn-link-elite { background: none; border: none; color: var(--red-bright); font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; }
    .btn-link-elite:hover { color: var(--text-pri); transform: translateX(5px); }
    
    .audit-list-elite { display: flex; flex-direction: column; gap: 12px; }
    .audit-item-elite { display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 18px; transition: all 0.3s; }
    .audit-item-elite:hover { background: var(--bg-card-3); border-color: var(--red-border); transform: scale(1.01); }
    .audit-icon { width: 38px; height: 38px; border-radius: 10px; background: var(--bg-card-3); border: 1px solid var(--bdr-md); color: var(--text-mut); display: flex; align-items: center; justify-content: center; }
    .audit-icon.success { color: #10b981; border-color: rgba(16, 185, 129, 0.2); background: rgba(16, 185, 129, 0.05); }
    .audit-details { flex: 1; display: flex; flex-direction: column; gap: 3px; }
    .audit-action { font-size: 14px; font-weight: 800; color: var(--text-pri); }
    .audit-meta { font-size: 11px; font-weight: 600; color: var(--text-mut); }
    .audit-status { font-size: 10px; font-weight: 900; color: var(--text-mut); padding: 4px 10px; background: var(--bg-card-3); border-radius: 6px; text-transform: uppercase; }
    .audit-status.success { color: #10b981; }

    .audit-empty-elite { padding: 40px; text-align: center; color: var(--text-mut); font-size: 14px; font-weight: 700; }

    .db-footer-elite { margin-top: 40px; padding: 40px; border: 1px solid var(--bdr); border-radius: 32px; text-align: center; background: var(--bg-card-2); }
    .db-footer-elite p { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 4px; line-height: 1.8; max-width: 800px; margin: 0 auto; }

    /* Animations */
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .animate-stagger > * { opacity: 0; animation: fadeIn 0.6s ease-out forwards; }
    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
    .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
    .animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

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