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

      <!-- ── HEADER ─────────────────────────────────────── -->
      <header class="db-header">
        <div class="db-header-left">
          <div class="db-badge">
            <span class="db-badge-dot"></span>LIVE DASHBOARD
          </div>
          <h1 class="db-title">Tax <span class="db-accent">Overview</span></h1>
          <p class="db-subtitle">Welcome back, <strong class="text-white">{{ userName() }}</strong> &mdash; here's your financial summary for {{ currentYear }}.</p>
        </div>
        <div class="db-header-actions">
          <button class="db-btn-ghost" (click)="downloadStatusReport()">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Download Report
          </button>
          <button class="db-btn-primary" (click)="router.navigate(['/member/payments-enhanced'])">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            Make Payment
          </button>
        </div>
      </header>

      <!-- ── KPI STAT CARDS ─────────────────────────────── -->
      <section class="db-kpi-grid" aria-label="Key performance indicators">

        <!-- Total Paid YTD -->
        <div class="db-kpi-card db-kpi-blue">
          <div class="db-kpi-icon db-kpi-icon-blue">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="db-kpi-body">
            <span class="db-kpi-label">Total Paid (YTD)</span>
            <span class="db-kpi-value">KES {{ (dashboardData.statistics().total_revenue || 0) | number:'1.0-0' }}</span>
          </div>
          <div class="db-kpi-trend db-trend-up">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7 7 7"/></svg>
            +12.5%
          </div>
          <div class="db-kpi-glow db-glow-blue"></div>
        </div>

        <!-- Pending Obligations -->
        <div class="db-kpi-card" [class.db-kpi-red]="dashboardData.statistics().count_pending_obligations > 0" [class.db-kpi-green]="!(dashboardData.statistics().count_pending_obligations > 0)">
          <div class="db-kpi-icon" [class.db-kpi-icon-red]="dashboardData.statistics().count_pending_obligations > 0" [class.db-kpi-icon-green]="!(dashboardData.statistics().count_pending_obligations > 0)">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="db-kpi-body">
            <span class="db-kpi-label">Pending Obligations</span>
            <span class="db-kpi-value">{{ dashboardData.statistics().count_pending_obligations || 0 }}</span>
          </div>
          <div [class]="dashboardData.statistics().count_pending_obligations > 0 ? 'db-kpi-trend db-trend-down' : 'db-kpi-trend db-trend-up'">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              @if (dashboardData.statistics().count_pending_obligations > 0) {
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7-7-7"/>
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7 7 7"/>
              }
            </svg>
            {{ dashboardData.statistics().count_pending_obligations > 0 ? 'Action Needed' : 'All Clear' }}
          </div>
          <div [class]="dashboardData.statistics().count_pending_obligations > 0 ? 'db-kpi-glow db-glow-red' : 'db-kpi-glow db-glow-green'"></div>
        </div>

        <!-- Returns Filed -->
        <div class="db-kpi-card db-kpi-purple">
          <div class="db-kpi-icon db-kpi-icon-purple">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div class="db-kpi-body">
            <span class="db-kpi-label">Returns Filed</span>
            <span class="db-kpi-value">{{ dashboardData.statistics().total_returns || 0 }}</span>
          </div>
          <div class="db-kpi-trend db-trend-up">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7 7 7"/></svg>
            Up to date
          </div>
          <div class="db-kpi-glow db-glow-purple"></div>
        </div>

        <!-- Compliance Score -->
        <div class="db-kpi-card db-kpi-emerald">
          <div class="db-kpi-icon db-kpi-icon-emerald">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div class="db-kpi-body">
            <span class="db-kpi-label">Compliance Score</span>
            <span class="db-kpi-value">{{ complianceScore() }}<span class="db-kpi-unit">%</span></span>
          </div>
          <div class="db-kpi-trend db-trend-up">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7 7 7"/></svg>
            Excellent
          </div>
          <div class="db-kpi-glow db-glow-emerald"></div>
        </div>

      </section>

      <!-- ── MAIN CONTENT GRID ───────────────────────────── -->
      <section class="db-main-grid">

        <!-- Revenue Chart (2/3 width) -->
        <div class="db-card db-chart-card">
          <div class="db-card-header">
            <div>
              <h2 class="db-card-title">Tax Payment History</h2>
              <p class="db-card-subtitle">Monthly payment volume over the past 12 months</p>
            </div>
            <span class="db-live-badge">
              <span class="db-live-dot"></span>
              LIVE
            </span>
          </div>

          <!-- Bar Chart -->
          <div class="db-chart-wrap" aria-label="Bar chart of monthly payments">
            <div class="db-chart-bars">
              @for (bar of chartBars; track $index) {
                <div class="db-chart-col">
                  <div
                    class="db-bar"
                    [style.height.%]="bar.pct"
                    [class.db-bar-highlight]="bar.highlight"
                    role="img"
                    [attr.aria-label]="bar.month + ': KES ' + bar.value + 'K'">
                    <div class="db-bar-tooltip">{{ bar.month }}<br/><strong>KES {{ bar.value }}K</strong></div>
                  </div>
                  <span class="db-bar-label">{{ bar.month }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Chart Legend -->
          <div class="db-chart-legend">
            <div class="db-legend-item">
              <span class="db-legend-dot bg-blue-500"></span>
              <span>Tax Payments</span>
            </div>
            <div class="db-legend-item db-legend-total">
              Total YTD: <strong class="text-white">KES {{ (dashboardData.statistics().total_revenue || 0) | number:'1.0-0' }}</strong>
            </div>
          </div>
        </div>

        <!-- Right column -->
        <div class="db-right-col">

          <!-- Compliance Ring -->
          <div class="db-card db-compliance-card">
            <h2 class="db-card-title">Compliance Status</h2>
            <div class="db-ring-wrap">
              <svg class="db-ring-svg" viewBox="0 0 100 100" aria-label="Compliance score {{ complianceScore() }}%">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" stroke-width="8" fill="none"/>
                <circle
                  cx="50" cy="50" r="40"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="none"
                  stroke-linecap="round"
                  class="db-ring-fill"
                  [style.stroke-dasharray]="251.2"
                  [style.stroke-dashoffset]="dashOffset()"/>
              </svg>
              <div class="db-ring-center">
                <span class="db-ring-value">{{ complianceScore() }}<span class="db-ring-pct">%</span></span>
                <span class="db-ring-label">Compliant</span>
              </div>
            </div>
            <div class="db-compliance-rows">
              <div class="db-comp-row">
                <span>Returns Status</span>
                <span class="db-badge-ok">✓ Filed</span>
              </div>
              <div class="db-comp-row">
                <span>Pending Actions</span>
                <span [class]="dashboardData.statistics().count_pending_obligations > 0 ? 'db-badge-warn' : 'db-badge-ok'">
                  {{ dashboardData.statistics().count_pending_obligations || 0 }}
                </span>
              </div>
              <div class="db-comp-row">
                <span>PIN Status</span>
                <span class="db-badge-ok">✓ Active</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="db-card db-quick-actions">
            <h2 class="db-card-title">Quick Actions</h2>
            <div class="db-actions-list">
              <button class="db-action-btn" routerLink="/member/payments-enhanced">
                <div class="db-action-icon db-action-blue">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                </div>
                <span>Make a Payment</span>
                <svg class="db-action-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
              <button class="db-action-btn" routerLink="/member/returns">
                <div class="db-action-icon db-action-purple">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <span>File a Return</span>
                <svg class="db-action-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
              <button class="db-action-btn" routerLink="/member/installments">
                <div class="db-action-icon db-action-amber">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <span>Payment Plans</span>
                <svg class="db-action-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
              <button class="db-action-btn" routerLink="/member/statements">
                <div class="db-action-icon db-action-emerald">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <span>View Statements</span>
                <svg class="db-action-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- ── RECENT ACTIVITY FEED ───────────────────────── -->
      <section class="db-card db-activity-card">
        <div class="db-card-header">
          <div>
            <h2 class="db-card-title">Recent Activity</h2>
            <p class="db-card-subtitle">Your latest transactions and filings</p>
          </div>
          <button class="db-btn-ghost" routerLink="/member/payments-enhanced">View All</button>
        </div>

        <div class="db-activity-list">
          @for (item of activities(); track item.timestamp) {
            <div class="db-activity-item">
              <div class="db-activity-icon" [class.db-act-success]="item.status === 'success'" [class.db-act-warning]="item.status === 'warning'">
                @if (item.status === 'success') {
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                } @else {
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3"/></svg>
                }
              </div>
              <div class="db-activity-body">
                <span class="db-activity-action">{{ item.action }}</span>
                <span class="db-activity-date">{{ item.date }}</span>
              </div>
              <span [class]="item.status === 'success' ? 'db-tag-success' : 'db-tag-warn'">{{ item.statusLabel }}</span>
            </div>
          } @empty {
            <div class="db-activity-empty">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              <p>No recent activity found</p>
            </div>
          }
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* ── Root ─────────────────────────────────── */
    .db-root {
      padding: clamp(1rem, 3vw, 2rem);
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      max-width: 1600px;
      margin: 0 auto;
    }

    /* ── Header ───────────────────────────────── */
    .db-header {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: flex-end;
      justify-content: space-between;
    }
    .db-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 999px;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.25);
      color: #34d399;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .db-badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .db-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 900;
      color: #fff;
      line-height: 1.1;
      letter-spacing: -0.04em;
      margin: 0;
    }
    .db-accent { color: #3b82f6; }
    .db-subtitle {
      color: #94a3b8;
      font-size: 1rem;
      margin-top: 0.4rem;
    }
    .db-header-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .db-btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #e2e8f0;
      font-weight: 600; font-size: 13px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .db-btn-ghost:hover { background: rgba(255,255,255,0.1); }
    .db-btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      background: #2563eb;
      border: none;
      color: #fff;
      font-weight: 700; font-size: 13px;
      cursor: pointer;
      transition: all 0.15s;
      box-shadow: 0 4px 16px rgba(37,99,235,0.3);
    }
    .db-btn-primary:hover { background: #1d4ed8; transform: translateY(-1px); }

    /* ── KPI Grid ─────────────────────────────── */
    .db-kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .db-kpi-card {
      position: relative;
      background: rgba(30,41,59,0.7);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 18px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      overflow: hidden;
      backdrop-filter: blur(10px);
      transition: transform 0.2s, border-color 0.2s;
    }
    .db-kpi-card:hover { transform: translateY(-3px); }
    .db-kpi-blue:hover  { border-color: rgba(59,130,246,0.3); }
    .db-kpi-red:hover   { border-color: rgba(239,68,68,0.3); }
    .db-kpi-green:hover { border-color: rgba(16,185,129,0.3); }
    .db-kpi-purple:hover{ border-color: rgba(139,92,246,0.3); }
    .db-kpi-emerald:hover{ border-color: rgba(16,185,129,0.3); }

    .db-kpi-icon {
      width: 44px; height: 44px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .db-kpi-icon-blue   { background: rgba(59,130,246,0.12);  color: #60a5fa; }
    .db-kpi-icon-red    { background: rgba(239,68,68,0.12);   color: #f87171; }
    .db-kpi-icon-green  { background: rgba(16,185,129,0.12);  color: #34d399; }
    .db-kpi-icon-purple { background: rgba(139,92,246,0.12);  color: #a78bfa; }
    .db-kpi-icon-emerald{ background: rgba(16,185,129,0.12);  color: #34d399; }

    .db-kpi-body { display: flex; flex-direction: column; gap: 2px; }
    .db-kpi-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
    .db-kpi-value { font-size: 1.9rem; font-weight: 900; color: #fff; line-height: 1.1; letter-spacing: -0.03em; }
    .db-kpi-unit  { font-size: 1.1rem; color: #34d399; }

    .db-kpi-trend {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 999px;
      font-size: 10px; font-weight: 700;
      width: fit-content; letter-spacing: 0.04em;
    }
    .db-trend-up   { background: rgba(16,185,129,0.1);  color: #34d399;  border: 1px solid rgba(16,185,129,0.2);  }
    .db-trend-down { background: rgba(239,68,68,0.1);   color: #f87171;  border: 1px solid rgba(239,68,68,0.2);   }

    .db-kpi-glow {
      position: absolute;
      width: 100px; height: 100px;
      border-radius: 50%;
      top: -30px; right: -30px;
      filter: blur(40px);
      pointer-events: none;
      opacity: 0.4;
    }
    .db-glow-blue   { background: #3b82f6; }
    .db-glow-red    { background: #ef4444; }
    .db-glow-green  { background: #10b981; }
    .db-glow-purple { background: #8b5cf6; }
    .db-glow-emerald{ background: #10b981; }

    /* ── Main Grid ────────────────────────────── */
    .db-main-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 1.25rem;
    }
    @media (max-width: 1100px) {
      .db-main-grid { grid-template-columns: 1fr; }
    }
    .db-right-col { display: flex; flex-direction: column; gap: 1.25rem; }

    /* ── Card base ────────────────────────────── */
    .db-card {
      background: rgba(30,41,59,0.7);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 20px;
      padding: 1.5rem;
      backdrop-filter: blur(10px);
    }
    .db-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
      gap: 1rem;
    }
    .db-card-title   { font-size: 1rem; font-weight: 800; color: #f8fafc; margin: 0; }
    .db-card-subtitle{ font-size: 12px; color: #64748b; margin-top: 3px; }
    .db-live-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 999px;
      background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25);
      color: #34d399; font-size: 10px; font-weight: 800; letter-spacing: 0.1em;
      white-space: nowrap;
    }
    .db-live-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #10b981; animation: pulse 2s infinite;
    }

    /* ── Chart ────────────────────────────────── */
    .db-chart-card { display: flex; flex-direction: column; }
    .db-chart-wrap { flex: 1; overflow: hidden; }
    .db-chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      height: 220px;
      padding-bottom: 0;
    }
    .db-chart-col {
      flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
      min-width: 0;
    }
    .db-bar {
      width: 100%;
      background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 6px 6px 0 0;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      min-height: 4px;
    }
    .db-bar:hover { background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%); }
    .db-bar-highlight { background: linear-gradient(180deg, #22d3ee 0%, #0ea5e9 100%) !important; }
    .db-bar-tooltip {
      position: absolute;
      bottom: calc(100% + 6px);
      left: 50%; transform: translateX(-50%);
      background: #1e293b;
      border: 1px solid rgba(255,255,255,0.1);
      color: #f8fafc;
      font-size: 11px; font-weight: 600;
      padding: 5px 10px; border-radius: 8px;
      white-space: nowrap;
      opacity: 0; pointer-events: none;
      transition: opacity 0.15s;
      z-index: 10;
    }
    .db-bar:hover .db-bar-tooltip { opacity: 1; }
    .db-bar-label { font-size: 9px; font-weight: 700; color: #475569; text-transform: uppercase; }
    .db-chart-legend {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
      font-size: 12px; color: #64748b;
    }
    .db-legend-item { display: flex; align-items: center; gap: 6px; }
    .db-legend-dot { width: 10px; height: 10px; border-radius: 3px; }
    .db-legend-total { font-size: 12px; color: #64748b; }

    /* ── Compliance Ring ──────────────────────── */
    .db-compliance-card { display: flex; flex-direction: column; gap: 1rem; }
    .db-ring-wrap { position: relative; width: 160px; height: 160px; margin: 0 auto; }
    .db-ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
    .db-ring-fill { color: #10b981; filter: drop-shadow(0 0 8px rgba(16,185,129,0.5)); transition: stroke-dashoffset 1s ease; }
    .db-ring-center {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .db-ring-value { font-size: 2rem; font-weight: 900; color: #fff; line-height: 1; }
    .db-ring-pct   { font-size: 1rem; color: #10b981; }
    .db-ring-label { font-size: 10px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }
    .db-compliance-rows { display: flex; flex-direction: column; gap: 0.5rem; }
    .db-comp-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      background: rgba(255,255,255,0.03);
      font-size: 12px; color: #94a3b8;
    }
    .db-badge-ok   { padding: 2px 10px; border-radius: 999px; background: rgba(16,185,129,0.1); color: #34d399; font-size: 11px; font-weight: 700; }
    .db-badge-warn { padding: 2px 10px; border-radius: 999px; background: rgba(239,68,68,0.1);  color: #f87171; font-size: 11px; font-weight: 700; }

    /* ── Quick Actions ────────────────────────── */
    .db-quick-actions .db-actions-list { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem; }
    .db-action-btn {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      color: #e2e8f0; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.15s; width: 100%;
      text-align: left;
    }
    .db-action-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.12); transform: translateX(2px); }
    .db-action-icon {
      width: 34px; height: 34px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .db-action-blue   { background: rgba(59,130,246,0.15);  color: #60a5fa; }
    .db-action-purple { background: rgba(139,92,246,0.15);  color: #a78bfa; }
    .db-action-amber  { background: rgba(245,158,11,0.15);  color: #fbbf24; }
    .db-action-emerald{ background: rgba(16,185,129,0.15);  color: #34d399; }
    .db-action-arrow  { margin-left: auto; color: #334155; flex-shrink: 0; }
    .db-action-btn:hover .db-action-arrow { color: #94a3b8; }

    /* ── Activity Feed ────────────────────────── */
    .db-activity-card .db-activity-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .db-activity-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.04);
      transition: background 0.15s;
    }
    .db-activity-item:hover { background: rgba(255,255,255,0.04); }
    .db-activity-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .db-act-success { background: rgba(16,185,129,0.12); color: #34d399; }
    .db-act-warning { background: rgba(245,158,11,0.12); color: #fbbf24; }
    .db-activity-body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .db-activity-action { font-size: 13px; font-weight: 600; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .db-activity-date   { font-size: 11px; color: #475569; }
    .db-tag-success { padding: 2px 10px; border-radius: 999px; background: rgba(16,185,129,0.1); color: #34d399; font-size: 10px; font-weight: 800; letter-spacing: 0.06em; white-space: nowrap; }
    .db-tag-warn    { padding: 2px 10px; border-radius: 999px; background: rgba(245,158,11,0.1);  color: #fbbf24; font-size: 10px; font-weight: 800; letter-spacing: 0.06em; white-space: nowrap; }
    .db-activity-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; color: #475569; gap: 0.5rem; font-size: 13px; }
  `]
})
export class MemberDashboardComponent implements OnInit {
  authService = inject(AuthService);
  dashboardData = inject(DashboardDataService);
  router = inject(Router);

  currentYear = new Date().getFullYear();

  currentUser = computed(() => this.authService.currentUser());
  userName = computed(() => this.currentUser()?.name || 'Authorized Taxpayer');

  complianceScore = computed(() => {
    const pending = this.dashboardData.statistics().count_pending_obligations || 0;
    if (pending === 0) return 98;
    return Math.max(10, 98 - (pending * 15));
  });

  dashOffset = computed(() => {
    const circumference = 2 * Math.PI * 40;
    return circumference - (this.complianceScore() / 100) * circumference;
  });

  // 12-month bar chart data (static demo values; replace with real data when available)
  chartBars = [
    { month: 'Jan', value: 52, pct: 52, highlight: false },
    { month: 'Feb', value: 68, pct: 68, highlight: false },
    { month: 'Mar', value: 45, pct: 45, highlight: false },
    { month: 'Apr', value: 89, pct: 89, highlight: false },
    { month: 'May', value: 60, pct: 60, highlight: false },
    { month: 'Jun', value: 79, pct: 79, highlight: false },
    { month: 'Jul', value: 55, pct: 55, highlight: false },
    { month: 'Aug', value: 74, pct: 74, highlight: false },
    { month: 'Sep', value: 63, pct: 63, highlight: false },
    { month: 'Oct', value: 85, pct: 85, highlight: false },
    { month: 'Nov', value: 92, pct: 92, highlight: false },
    { month: 'Dec', value: 100, pct: 100, highlight: true },
  ];

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

    return [...payments, ...returns]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6);
  });

  ngOnInit() {
    // Data is prefetched by AuthService on login/startup
  }

  downloadStatusReport() {
    window.open(`${environment.apiUrl}/download.php?type=status_report&id=1&format=pdf`, '_blank');
  }
}
