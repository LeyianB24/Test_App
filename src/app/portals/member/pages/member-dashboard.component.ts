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
    <div class="db-root animate-stagger">
      
      <!-- ── DASHBOARD HEADER ───────────────────────────────── -->
      <header class="db-hero">
        <div class="db-hero-content">
          <div class="db-badge-hd">
            <span class="pulse-ring"></span>
            <span class="db-badge-text">SECURE TERMINAL ACTIVE</span>
          </div>
          <h1 class="premium-title">
            Member <span class="text-gradient">Dashboard</span>
          </h1>
          <p class="premium-subtitle">
            Welcome, <span class="highlight text-white">{{ userName() }}</span>. 
            Unified tax telemetry for the fiscal year {{ currentYear }}.
          </p>
        </div>
        
        <div class="db-hero-actions">
          <button class="glass-btn btn-secondary" (click)="downloadStatusReport()">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span>DOWNLOAD STATUS</span>
          </button>
          <button class="glass-btn btn-primary" (click)="router.navigate(['/member/payments-enhanced'])">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span>QUICK PAYMENT</span>
          </button>
        </div>
      </header>

      <!-- ── KPI ANALYTICS GRID ────────────────────────────── -->
      <section class="kpi-grid" aria-label="Key Performance Indicators">
        
        <!-- Revenue Card (Blue) -->
        <div class="kpi-card kpi-blue">
          <div class="kpi-icon-wrap">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Revenue PAID (YTD)</span>
            <div class="kpi-value-row">
              <span class="kpi-currency">KES</span>
              <span class="kpi-value text-glow-blue">{{ (dashboardData.statistics().total_revenue || 0) | number:'1.0-0' }}</span>
            </div>
            <div class="kpi-trend trend-up">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path d="M5 10l7-7 7 7"/>
              </svg>
              <span>+14.2% Growth</span>
            </div>
          </div>
          <div class="kpi-shimmer"></div>
        </div>

        <!-- Obligations Card (Red/Green) -->
        <div class="kpi-card" 
             [class.kpi-danger]="dashboardData.statistics().count_pending_obligations > 0"
             [class.kpi-success]="!(dashboardData.statistics().count_pending_obligations > 0)">
          <div class="kpi-icon-wrap">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Pending Obligations</span>
            <span class="kpi-value">{{ dashboardData.statistics().count_pending_obligations || 0 }}</span>
            @if (dashboardData.statistics().count_pending_obligations > 0) {
              <div class="kpi-status-tag tag-urgent">ACTION REQUIRED</div>
            } @else {
              <div class="kpi-status-tag tag-verified">FULLY COMPLIANT</div>
            }
          </div>
          <div class="kpi-shimmer"></div>
        </div>

        <!-- Returns Card (Gold) -->
        <div class="kpi-card kpi-gold">
          <div class="kpi-icon-wrap">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Total Returns Filed</span>
            <span class="kpi-value">{{ dashboardData.statistics().total_returns || 0 }}</span>
            <div class="kpi-status-tag tag-regular">FISCAL YEAR {{ currentYear }}</div>
          </div>
          <div class="kpi-shimmer"></div>
        </div>

        <!-- Compliance Score (KRA Green) -->
        <div class="kpi-card kpi-kra-green">
          <div class="kpi-icon-wrap">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-label">Compliance Health</span>
            <div class="kpi-value-row">
              <span class="kpi-value text-glow-green">{{ complianceScore() }}</span>
              <span class="kpi-pct">%</span>
            </div>
            <div class="kpi-status-tag tag-verified">ELITE STATUS</div>
          </div>
          <div class="kpi-shimmer"></div>
        </div>

      </section>

      <!-- ── MAIN ANALYTICS VIEW ──────────────────────────── -->
      <section class="main-telemetry">
        
        <!-- Payment Trends Chart -->
        <div class="telemetry-card chart-card">
          <div class="card-header">
            <div class="header-group">
              <h2 class="card-title">Fiscal Contribution Matrix</h2>
              <p class="card-subtitle">Aggregated payment trends across 12 fiscal cycles</p>
            </div>
            <div class="live-indicator">
              <span class="indicator-pulse"></span>
              REAL-TIME
            </div>
          </div>

          <div class="modern-chart">
            <div class="chart-y-axis">
              <span>100K</span>
              <span>75K</span>
              <span>50K</span>
              <span>25K</span>
              <span>0</span>
            </div>
            <div class="chart-body">
              <div class="grid-lines">
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <div class="chart-bars">
                @for (bar of chartBars; track $index) {
                  <div class="bar-col">
                    <div class="bar-pill" 
                         [style.height.%]="bar.pct"
                         [class.pill-active]="bar.highlight">
                      <div class="bar-tooltip">
                        <span class="tt-month">{{ bar.month }}</span>
                        <span class="tt-value">KES {{ bar.value }}K</span>
                      </div>
                    </div>
                    <span class="bar-label">{{ bar.month }}</span>
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="chart-footer">
            <div class="legend">
              <div class="legend-item">
                <span class="dot dot-primary"></span>
                <span>Standard Liability</span>
              </div>
              <div class="legend-item">
                <span class="dot dot-highlight"></span>
                <span>Surcharges/Penalties</span>
              </div>
            </div>
            <div class="aggregate-total">
              YTD AGGREGATE: <span class="total-value">KES {{ (dashboardData.statistics().total_revenue || 0) | number:'1.0-0' }}</span>
            </div>
          </div>
        </div>

        <!-- Compliance & Quick Actions -->
        <div class="side-telemetry">
          
          <!-- Compliance Ring -->
          <div class="telemetry-card ring-card">
            <h2 class="card-title-sm">Compliance Status</h2>
            <div class="ring-container">
              <svg class="compliance-ring" viewBox="0 0 100 100">
                <circle class="ring-bg" cx="50" cy="50" r="40" />
                <circle class="ring-progress" 
                        cx="50" cy="50" r="40"
                        [style.stroke-dasharray]="251.2"
                        [style.stroke-dashoffset]="dashOffset()" />
              </svg>
              <div class="ring-content">
                <span class="ring-number">{{ complianceScore() }}%</span>
                <span class="ring-status">ACTIVE</span>
              </div>
            </div>
            <div class="status-summary">
              <div class="summary-item">
                <span class="dot dot-success"></span>
                <span>PIN Status: Active</span>
              </div>
              <div class="summary-item">
                <span class="dot" [class.dot-success]="!(dashboardData.statistics().count_pending_obligations > 0)" [class.dot-danger]="dashboardData.statistics().count_pending_obligations > 0"></span>
                <span>Obligations: {{ dashboardData.statistics().count_pending_obligations || 0 }} Pending</span>
              </div>
            </div>
          </div>

          <!-- Smart Actions -->
          <div class="telemetry-card actions-card">
            <h2 class="card-title-sm">Smart Nav</h2>
            <div class="action-grid">
              <button class="action-tile" routerLink="/member/payments-enhanced">
                <div class="tile-icon icon-blue">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                  </svg>
                </div>
                <span>Quick Pay</span>
              </button>
              <button class="action-tile" routerLink="/member/returns">
                <div class="tile-icon icon-purple">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <span>File Return</span>
              </button>
              <button class="action-tile" routerLink="/member/installments">
                <div class="tile-icon icon-amber">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <span>Pay Plans</span>
              </button>
              <button class="action-tile" routerLink="/member/statements">
                <div class="tile-icon icon-emerald">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <span>Statements</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- ── ACTIVITY LOG ─────────────────────────────────── -->
      <section class="activity-log-hd telemetry-card">
        <div class="card-header">
          <div class="header-group">
            <h2 class="card-title">Fiscal Audit Trail</h2>
            <p class="card-subtitle">Ledger events for the current session</p>
          </div>
          <button class="text-link" routerLink="/member/payments-enhanced">View Ledger</button>
        </div>

        <div class="audit-list">
          @for (item of activities(); track item.timestamp) {
            <div class="audit-entry">
              <div class="entry-status" [class.entry-success]="item.status === 'success'">
                @if (item.status === 'success') {
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                } @else {
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path d="M12 8v4l3 3"/>
                  </svg>
                }
              </div>
              <div class="entry-details">
                <span class="entry-action">{{ item.action }}</span>
                <span class="entry-meta">{{ item.date }} &bull; Systematic Entry</span>
              </div>
              <div class="entry-tag" [class.tag-success]="item.status === 'success'">
                {{ item.statusLabel }}
              </div>
            </div>
          } @empty {
            <div class="audit-empty">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p>No recent synchronization logs detected.</p>
            </div>
          }
        </div>
      </section>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-root, #0a0c10);
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .db-root {
      padding: clamp(1.5rem, 5vw, 3rem);
      max-width: 1600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    /* ── DASHBOARD HERO ────────────────────────────────── */
    .db-hero {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .db-badge-hd {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 16px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 99px;
      margin-bottom: 1.25rem;
    }

    .pulse-ring {
      width: 8px; height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
      animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .db-badge-text {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: #34d399;
    }

    .premium-title {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 900;
      color: #fff;
      line-height: 1;
      letter-spacing: -0.05em;
      margin: 0;
    }

    .text-gradient {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .premium-subtitle {
      font-size: 1.125rem;
      color: #94a3b8;
      margin: 0.75rem 0 0;
      max-width: 600px;
    }

    .db-hero-actions {
      display: flex;
      gap: 1rem;
    }

    .glass-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .btn-primary {
      background: #c1392b; /* KRA Red */
      color: #fff;
      border: none;
      box-shadow: 0 8px 24px rgba(193, 57, 43, 0.3);
    }

    .btn-primary:hover {
      background: #e74c3c;
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(193, 57, 43, 0.4);
    }

    /* ── KPI GRID ────────────────────────────────────── */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .kpi-card {
      position: relative;
      padding: 2rem;
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      backdrop-filter: blur(12px);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      overflow: hidden;
      transition: all 0.4s ease;
    }

    .kpi-card:hover {
      transform: translateY(-5px);
      border-color: rgba(255, 255, 255, 0.15);
      background: rgba(30, 41, 59, 0.7);
    }

    .kpi-icon-wrap {
      width: 52px; height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kpi-blue .kpi-icon-wrap { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }
    .kpi-danger .kpi-icon-wrap { background: rgba(193, 57, 43, 0.1); color: #f87171; }
    .kpi-success .kpi-icon-wrap { background: rgba(16, 185, 129, 0.1); color: #34d399; }
    .kpi-gold .kpi-icon-wrap { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
    .kpi-kra-green .kpi-icon-wrap { background: rgba(0, 102, 51, 0.1); color: #10b981; }

    .kpi-label {
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }

    .kpi-value-row { display: flex; align-items: baseline; gap: 8px; margin: 4px 0; }
    .kpi-currency { font-size: 1.25rem; font-weight: 700; color: #475569; }
    .kpi-value { font-size: 2.5rem; font-weight: 900; color: #fff; letter-spacing: -0.04em; }
    .kpi-pct { font-size: 1.5rem; font-weight: 700; color: var(--kra-green, #10b981); }

    .text-glow-blue { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
    .text-glow-green { text-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }

    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
    }

    .trend-up { color: #34d399; }
    .kpi-status-tag {
      display: inline-flex;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.05em;
      margin-top: 8px;
    }

    .tag-urgent { background: rgba(193, 57, 43, 0.15); color: #f87171; }
    .tag-verified { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .tag-regular { background: rgba(255, 255, 255, 0.05); color: #94a3b8; }

    .kpi-shimmer {
      position: absolute;
      top: -100px; right: -100px;
      width: 250px; height: 250px;
      background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
      pointer-events: none;
    }

    /* ── TELEMETRY GRID ──────────────────────────────── */
    .main-telemetry {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 2rem;
    }

    @media (max-width: 1200px) {
      .main-telemetry { grid-template-columns: 1fr; }
    }

    .telemetry-card {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 28px;
      padding: 2rem;
      backdrop-filter: blur(16px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2.5rem;
    }

    .card-title { font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0; }
    .card-subtitle { font-size: 13px; color: #64748b; margin: 4px 0 0; }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 30px;
      color: #60a5fa;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.1em;
    }

    .indicator-pulse {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #3b82f6;
      animation: blink 2s infinite;
    }

    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

    /* ── CHART ─────────────────────────────────────── */
    .modern-chart {
      display: flex;
      gap: 1.5rem;
      height: 300px;
      margin-bottom: 2rem;
    }

    .chart-y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      text-align: right;
      width: 40px;
    }

    .chart-body {
      flex: 1;
      position: relative;
    }

    .grid-lines {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .grid-lines span {
      width: 100%;
      height: 1px;
      background: rgba(255, 255, 255, 0.03);
    }

    .chart-bars {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: flex-end;
      gap: 12px;
      z-index: 1;
    }

    .bar-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      height: 100%;
      justify-content: flex-end;
    }

    .bar-pill {
      width: 100%;
      min-height: 8px;
      background: linear-gradient(180deg, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.1) 100%);
      border-radius: 99px;
      position: relative;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
    }

    .bar-pill:hover {
      background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
      transform: scaleX(1.1);
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
    }

    .pill-active {
      background: linear-gradient(180deg, #c1392b 0%, #a52a1e 100%) !important;
      box-shadow: 0 0 30px rgba(193, 57, 43, 0.3);
    }

    .bar-tooltip {
      position: absolute;
      bottom: calc(100% + 12px);
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      background: #141b24;
      border: 1px solid rgba(255,255,255,0.1);
      padding: 8px 14px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
      z-index: 10;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }

    .bar-pill:hover .bar-tooltip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .tt-month { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
    .tt-value { font-size: 14px; font-weight: 800; color: #fff; }

    .bar-label { font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; }

    .chart-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .legend { display: flex; gap: 1.5rem; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #64748b; }
    .dot { width: 10px; height: 10px; border-radius: 3px; }
    .dot-primary { background: #3b82f6; }
    .dot-highlight { background: #c1392b; }

    .aggregate-total { font-size: 12px; font-weight: 800; color: #475569; }
    .total-value { color: #fff; margin-left: 8px; font-size: 14px; }

    /* ── SIDE TELEMETRY ──────────────────────────────── */
    .side-telemetry { display: flex; flex-direction: column; gap: 2rem; }

    .card-title-sm { font-size: 1rem; font-weight: 800; color: #fff; margin: 0 0 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; }

    .ring-card { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .ring-container { position: relative; width: 180px; height: 180px; margin-bottom: 2rem; }
    .compliance-ring { transform: rotate(-90deg); width: 180px; height: 180px; }
    .ring-bg { fill: none; stroke: rgba(255, 255, 255, 0.04); stroke-width: 8; }
    .ring-progress {
      fill: none; stroke: #10b981; stroke-width: 8; stroke-linecap: round;
      filter: drop-shadow(0 0 12px rgba(16, 185, 129, 0.4));
      transition: stroke-dashoffset 1.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .ring-content {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }

    .ring-number { font-size: 2.25rem; font-weight: 950; color: #fff; line-height: 1; }
    .ring-status { font-size: 10px; font-weight: 900; color: #10b981; letter-spacing: 0.2em; margin-top: 4px; }

    .status-summary { display: flex; flex-direction: column; gap: 12px; width: 100%; }
    .summary-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 16px; background: rgba(255, 255, 255, 0.03);
      border-radius: 12px; font-size: 12px; font-weight: 600; color: #94a3b8;
    }
    .dot-success { background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }
    .dot-danger { background: #ef4444; box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }

    /* ── SMART NAV ──────────────────────────────────── */
    .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .action-tile {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 18px; padding: 1.25rem;
      display: flex; flex-direction: column; gap: 1rem;
      align-items: flex-start; cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left;
    }

    .action-tile:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-3px);
    }

    .tile-icon {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }

    .icon-blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
    .icon-purple { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }
    .icon-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
    .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }

    .action-tile span { font-size: 13px; font-weight: 800; color: #f1f5f9; }

    /* ── AUDIT LOG ───────────────────────────────────── */
    .activity-log-hd { display: flex; flex-direction: column; gap: 1.5rem; }
    .audit-list { display: flex; flex-direction: column; gap: 10px; }
    .audit-entry {
      display: flex; align-items: center; gap: 1.25rem;
      padding: 1.25rem 1.75rem; background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 18px; transition: all 0.3s ease;
    }

    .audit-entry:hover { background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.08); }

    .entry-status {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; background: rgba(255, 255, 255, 0.05); color: #475569;
    }

    .entry-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .entry-details { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .entry-action { font-size: 14px; font-weight: 700; color: #f1f5f9; }
    .entry-meta { font-size: 11px; font-weight: 600; color: #475569; }

    .entry-tag {
      padding: 6px 14px; border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      font-size: 10px; font-weight: 800; color: #64748b;
      letter-spacing: 0.05em;
    }
    .tag-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .text-link {
      background: none; border: none; color: #3b82f6;
      font-size: 13px; font-weight: 800; cursor: pointer;
      text-transform: uppercase; letter-spacing: 0.1em;
    }

    .audit-empty {
      display: flex; flex-direction: column; align-items: center; padding: 4rem;
      color: #334155; text-align: center; gap: 1rem;
    }

    /* ── ANIMATIONS ──────────────────────────────────── */
    .animate-stagger > * {
      opacity: 0;
      animation: slide-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }

    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
    .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
    .animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }

    @keyframes slide-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
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
