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
    <div class="db-root">

      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">

        <!-- ══════════════ HEADER ══════════════ -->
        <header class="db-header">
          <div class="header-left">
            <div class="kra-wordmark">
              <div class="kra-shield">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div class="kra-text">
                <span class="kra-abbr">KRA</span>
                <span class="kra-full">Kenya Revenue Authority</span>
              </div>
            </div>
          </div>
          <div class="header-center">
            <div class="terminal-badge">
              <span class="term-dot"></span>
              <span>SECURE SESSION · {{ currentYear }}</span>
            </div>
          </div>
          <div class="header-right">
            <button class="hdr-btn ghost" (click)="downloadStatusReport()">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Export
            </button>
            <button class="hdr-btn primary" (click)="router.navigate(['/member/payments-enhanced'])">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Quick Pay
            </button>
          </div>
        </header>

        <!-- ══════════════ HERO ══════════════ -->
        <section class="db-hero">
          <div class="hero-eyebrow">
            <span class="eyebrow-line"></span>
            <span class="eyebrow-text">TAXPAYER CONTROL CENTRE</span>
            <span class="eyebrow-line"></span>
          </div>
          <h1 class="hero-title">
            <span class="title-hi">Welcome,</span>
            <span class="title-name">{{ userName() }}</span>
          </h1>
          <p class="hero-sub">Unified tax telemetry &amp; compliance dashboard · Fiscal Year {{ currentYear }}</p>
        </section>

        <!-- ══════════════ KPI CARDS ══════════════ -->
        <div class="kpi-grid">

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Revenue Paid YTD</span>
              <div class="kpi-icon red-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
            </div>
            <div class="kpi-val-group">
              <span class="kpi-curr">KES</span>
              <span class="kpi-val">{{ (dashboardData.statistics().total_revenue || 0) | number:'1.0-0' }}</span>
            </div>
            <div class="kpi-footer"><span class="kpi-chip chip-neutral">↑ 14.2% growth</span></div>
            <div class="kpi-bar-track"><div class="kpi-bar-fill" style="width:72%"></div></div>
          </div>

          <div class="kpi-card" [class.kpi-alert]="dashboardData.statistics().count_pending_obligations > 0">
            <div class="kpi-top">
              <span class="kpi-label">Pending Obligations</span>
              <div class="kpi-icon"
                [class.red-icon]="dashboardData.statistics().count_pending_obligations > 0"
                [class.muted-icon]="!(dashboardData.statistics().count_pending_obligations > 0)">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <span class="kpi-val">{{ dashboardData.statistics().count_pending_obligations || 0 }}</span>
            @if (dashboardData.statistics().count_pending_obligations > 0) {
              <div class="kpi-footer"><span class="kpi-chip chip-alert">ACTION REQUIRED</span></div>
            } @else {
              <div class="kpi-footer"><span class="kpi-chip chip-ok">FULLY COMPLIANT</span></div>
            }
            <div class="kpi-bar-track">
              <div class="kpi-bar-fill" [style.width]="dashboardData.statistics().count_pending_obligations > 0 ? '40%' : '100%'"></div>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Returns Filed</span>
              <div class="kpi-icon muted-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
            <span class="kpi-val">{{ dashboardData.statistics().total_returns || 0 }}</span>
            <div class="kpi-footer"><span class="kpi-chip chip-neutral">FY {{ currentYear }}</span></div>
            <div class="kpi-bar-track"><div class="kpi-bar-fill" style="width:60%"></div></div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-label">Compliance Score</span>
              <div class="kpi-icon red-icon">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
            </div>
            <div class="kpi-val-group">
              <span class="kpi-val score-red">{{ complianceScore() }}</span>
              <span class="kpi-pct">%</span>
            </div>
            <div class="kpi-footer"><span class="kpi-chip chip-ok">ELITE STATUS</span></div>
            <div class="kpi-bar-track"><div class="kpi-bar-fill" [style.width]="complianceScore() + '%'"></div></div>
          </div>

        </div>

        <!-- ══════════════ MAIN GRID ══════════════ -->
        <div class="main-grid">

          <!-- CHART PANEL -->
          <div class="panel chart-panel">
            <div class="panel-header">
              <div>
                <h2 class="panel-title">Fiscal Contribution Matrix</h2>
                <p class="panel-sub">12-month payment trend aggregation</p>
              </div>
              <div class="live-tag">
                <span class="ltag-dot"></span>
                REAL-TIME
              </div>
            </div>

            <div class="chart-wrap">
              <div class="y-axis">
                <span>100K</span><span>75K</span><span>50K</span><span>25K</span><span>0</span>
              </div>
              <div class="chart-inner">
                <div class="gridlines">
                  <div class="gl"></div><div class="gl"></div>
                  <div class="gl"></div><div class="gl"></div><div class="gl"></div>
                </div>
                <div class="bars-row">
                  @for (bar of chartBars; track $index) {
                    <div class="bar-wrap">
                      <div class="bar-col-inner">
                        <div class="bar" [style.height.%]="bar.pct" [class.bar-active]="bar.highlight">
                          <div class="bar-tip">
                            <span>{{ bar.month }}</span>
                            <strong>KES {{ bar.value }}K</strong>
                          </div>
                        </div>
                      </div>
                      <span class="bar-lbl">{{ bar.month }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="chart-footer">
              <div class="legend">
                <div class="leg-item"><span class="leg-dot ld-muted"></span>Standard Liability</div>
                <div class="leg-item"><span class="leg-dot ld-red"></span>Active Period</div>
              </div>
              <span class="ytd-label">YTD: <strong>KES {{ (dashboardData.statistics().total_revenue || 0) | number:'1.0-0' }}</strong></span>
            </div>
          </div>

          <!-- SIDE COLUMN -->
          <div class="side-col">

            <div class="panel ring-panel">
              <h2 class="panel-title-sm">Compliance Status</h2>
              <div class="ring-wrap">
                <svg class="ring-svg" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" class="ring-track" stroke-width="7"/>
                  <circle cx="60" cy="60" r="50" fill="none"
                    class="ring-progress"
                    stroke-width="7"
                    stroke-linecap="round"
                    stroke-dasharray="314.16"
                    [style.stroke-dashoffset]="dashOffset()"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div class="ring-center">
                  <span class="ring-pct">{{ complianceScore() }}<small>%</small></span>
                  <span class="ring-lbl">HEALTH</span>
                </div>
              </div>
              <div class="ring-rows">
                <div class="ring-row">
                  <span class="rr-dot rr-ok"></span>
                  <span class="rr-text">PIN Status</span>
                  <span class="rr-val ok">Active</span>
                </div>
                <div class="ring-row">
                  <span class="rr-dot"
                    [class.rr-ok]="!(dashboardData.statistics().count_pending_obligations > 0)"
                    [class.rr-alert]="dashboardData.statistics().count_pending_obligations > 0"></span>
                  <span class="rr-text">Obligations</span>
                  <span class="rr-val"
                    [class.ok]="!(dashboardData.statistics().count_pending_obligations > 0)"
                    [class.alert]="dashboardData.statistics().count_pending_obligations > 0">
                    {{ dashboardData.statistics().count_pending_obligations || 0 }} Pending
                  </span>
                </div>
                <div class="ring-row">
                  <span class="rr-dot rr-ok"></span>
                  <span class="rr-text">Returns</span>
                  <span class="rr-val ok">{{ dashboardData.statistics().total_returns || 0 }} Filed</span>
                </div>
              </div>
            </div>

            <div class="panel nav-panel">
              <h2 class="panel-title-sm">Quick Navigation</h2>
              <div class="nav-grid">
                <button class="nav-tile" routerLink="/member/payments-enhanced">
                  <div class="nav-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                  </div>
                  <span>Quick Pay</span>
                </button>
                <button class="nav-tile" routerLink="/member/returns">
                  <div class="nav-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <span>File Return</span>
                </button>
                <button class="nav-tile" routerLink="/member/installments">
                  <div class="nav-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span>Pay Plans</span>
                </button>
                <button class="nav-tile" routerLink="/member/statements">
                  <div class="nav-icon">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <span>Statements</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- ══════════════ AUDIT LOG ══════════════ -->
        <div class="panel audit-panel">
          <div class="panel-header">
            <div>
              <h2 class="panel-title">Fiscal Audit Trail</h2>
              <p class="panel-sub">Ledger events for the current session</p>
            </div>
            <button class="view-all-btn" routerLink="/member/payments-enhanced">View All →</button>
          </div>
          <div class="audit-list">
            @for (item of activities(); track item.timestamp) {
              <div class="audit-row">
                <div class="audit-icon" [class.ai-success]="item.status === 'success'" [class.ai-pending]="item.status !== 'success'">
                  @if (item.status === 'success') {
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                  } @else {
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8v4l3 3"/></svg>
                  }
                </div>
                <div class="audit-body">
                  <span class="audit-action">{{ item.action }}</span>
                  <span class="audit-meta">{{ item.date }} · Systematic Entry</span>
                </div>
                <div class="audit-chip" [class.ach-success]="item.status === 'success'">{{ item.statusLabel }}</div>
              </div>
            } @empty {
              <div class="audit-empty">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p>No recent synchronization logs detected.</p>
              </div>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');

    /* ══════════════════════════════════════════════════════
       DARK MODE TOKENS (default)
    ══════════════════════════════════════════════════════ */
    :host {
      /* Brand red — same in both modes */
      --red:           #D92B2B;
      --red-bright:    #EF3B3B;
      --red-glow:      rgba(217,43,43,0.38);
      --red-pale:      rgba(217,43,43,0.10);
      --red-border:    rgba(217,43,43,0.22);

      /* Dark surfaces */
      --bg-root:       #0C0C0C;
      --bg-card:       #141414;
      --bg-card-2:     #1C1C1C;
      --bg-card-3:     #232323;
      --bg-card-4:     #2B2B2B;

      /* Dark text */
      --text-pri:      #F0F0F0;
      --text-sec:      #888888;
      --text-mut:      #4A4A4A;

      /* Dark borders & surfaces */
      --bdr:           rgba(255,255,255,0.08);
      --bdr-md:        rgba(255,255,255,0.14);
      --srf-hover:     rgba(255,255,255,0.04);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
      color-scheme: dark;
    }

    /* ══════════════════════════════════════════════════════
       LIGHT MODE TOKEN OVERRIDES
    ══════════════════════════════════════════════════════ */
    @media (prefers-color-scheme: light) {
      :host {
        --bg-root:    #F2F2F4;
        --bg-card:    #FFFFFF;
        --bg-card-2:  #F7F7F9;
        --bg-card-3:  #EDEDEF;
        --bg-card-4:  #E4E4E7;

        --text-pri:   #111111;
        --text-sec:   #555560;
        --text-mut:   #9999A8;

        --bdr:        rgba(0,0,0,0.08);
        --bdr-md:     rgba(0,0,0,0.14);
        --srf-hover:  rgba(0,0,0,0.03);

        color-scheme: light;
      }
    }

    /* ══════════════════════════════════════════════════════
       RESET
    ══════════════════════════════════════════════════════ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    button { font-family: 'Plus Jakarta Sans', sans-serif; }

    /* ══════════════════════════════════════════════════════
       ROOT SHELL
    ══════════════════════════════════════════════════════ */
    .db-root {
      min-height: 100vh;
      background: var(--bg-root);
      color: var(--text-pri);
      font-family: 'Plus Jakarta Sans', sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    /* Noise grain */
    .noise-overlay {
      position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.02;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 180px 180px;
    }
    @media (prefers-color-scheme: light) { .noise-overlay { opacity: 0.035; } }

    /* Red ambient orb */
    .accent-bleed {
      position: fixed; top: -220px; right: -220px;
      width: 580px; height: 580px;
      background: radial-gradient(circle, var(--red-glow) 0%, transparent 65%);
      pointer-events: none; z-index: 0; opacity: 0.22;
    }
    @media (prefers-color-scheme: light) { .accent-bleed { opacity: 0.07; } }

    /* ══════════════════════════════════════════════════════
       INNER LAYOUT
    ══════════════════════════════════════════════════════ */
    .db-inner {
      position: relative; z-index: 1;
      max-width: 1440px; margin: 0 auto;
      padding: 24px 28px 80px;
      display: flex; flex-direction: column; gap: 22px;
    }

    /* ══════════════════════════════════════════════════════
       HEADER
    ══════════════════════════════════════════════════════ */
    .db-header {
      display: flex; align-items: center; justify-content: space-between;
      gap: 16px; flex-wrap: wrap;
      padding: 14px 20px;
      background: var(--bg-card);
      border: 1px solid var(--bdr);
      border-radius: 18px;
    }
    .header-left, .header-right { display: flex; align-items: center; gap: 10px; }

    .kra-wordmark { display: flex; align-items: center; gap: 12px; }
    .kra-shield {
      width: 38px; height: 38px; border-radius: 10px;
      background: var(--red); color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 14px var(--red-glow); flex-shrink: 0;
    }
    .kra-abbr {
      font-size: 16px; font-weight: 900; color: var(--text-pri);
      display: block; line-height: 1; letter-spacing: -0.3px;
    }
    .kra-full {
      font-size: 10px; font-weight: 500; color: var(--text-mut);
      display: block; margin-top: 2px; letter-spacing: 0.3px;
    }

    .terminal-badge {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 14px; border-radius: 50px;
      background: var(--bg-card-2); border: 1px solid var(--bdr);
      font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: var(--text-sec);
    }
    .term-dot {
      width: 7px; height: 7px; border-radius: 50%;
      background: var(--red); box-shadow: 0 0 5px var(--red);
      animation: dot-blink 1.6s ease-in-out infinite;
    }
    @keyframes dot-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

    .hdr-btn {
      display: flex; align-items: center; gap: 7px;
      padding: 9px 17px; border-radius: 10px;
      font-size: 12px; font-weight: 700; letter-spacing: 0.2px;
      cursor: pointer; transition: all 0.18s;
      border: 1px solid var(--bdr);
    }
    .hdr-btn.ghost  { background: transparent; color: var(--text-sec); }
    .hdr-btn.ghost:hover { background: var(--srf-hover); color: var(--text-pri); }
    .hdr-btn.primary {
      background: var(--red); color: #fff; border-color: transparent;
      box-shadow: 0 4px 14px var(--red-glow);
    }
    .hdr-btn.primary:hover { background: var(--red-bright); transform: translateY(-1px); }

    /* ══════════════════════════════════════════════════════
       HERO
    ══════════════════════════════════════════════════════ */
    .db-hero { text-align: center; padding: 18px 0 2px; }

    .hero-eyebrow {
      display: flex; align-items: center; justify-content: center; gap: 14px;
      margin-bottom: 16px;
    }
    .eyebrow-line {
      flex: 1; max-width: 100px; height: 1px;
      background: linear-gradient(90deg, transparent, var(--bdr), transparent);
    }
    .eyebrow-text { font-size: 10px; font-weight: 800; letter-spacing: 3px; color: var(--text-mut); }

    .hero-title {
      display: flex; flex-direction: column; align-items: center;
      margin-bottom: 10px; line-height: 1;
    }
    .title-hi {
      font-size: clamp(11px, 1.4vw, 14px); font-weight: 600;
      color: var(--text-mut); letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 6px;
    }
    .title-name {
      font-size: clamp(32px, 5vw, 64px);
      font-weight: 900; letter-spacing: -2px; color: var(--text-pri);
    }
    /* Dark-only gradient treatment for the name */
    @media (prefers-color-scheme: dark) {
      .title-name {
        background: linear-gradient(150deg, #ffffff 35%, rgba(255,255,255,0.42));
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      }
    }
    .hero-sub { font-size: 12px; font-weight: 500; color: var(--text-mut); letter-spacing: 0.3px; }

    /* ══════════════════════════════════════════════════════
       KPI GRID
    ══════════════════════════════════════════════════════ */
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

    .kpi-card {
      background: var(--bg-card); border: 1px solid var(--bdr);
      border-radius: 20px; padding: 22px;
      position: relative; overflow: hidden;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
    }
    .kpi-card:hover {
      transform: translateY(-3px); border-color: var(--bdr-md);
      box-shadow: 0 10px 36px rgba(0,0,0,0.10);
    }
    /* Subtle inset sheen */
    .kpi-card::after {
      content: ''; position: absolute; inset: 0; border-radius: 20px;
      background: linear-gradient(130deg, var(--srf-hover) 0%, transparent 55%);
      pointer-events: none;
    }
    /* Alert variant */
    .kpi-alert { border-color: var(--red-border) !important; }
    .kpi-alert::before {
      content: ''; position: absolute; inset: 0; border-radius: 20px;
      background: var(--red-pale); pointer-events: none;
    }

    .kpi-top {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 14px; position: relative; z-index: 1;
    }
    .kpi-label { font-size: 10px; font-weight: 800; letter-spacing: 1.2px; color: var(--text-mut); text-transform: uppercase; }

    .kpi-icon {
      width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .red-icon   { background: var(--red-pale); color: var(--red-bright); border: 1px solid var(--red-border); }
    .muted-icon { background: var(--bg-card-2); color: var(--text-mut); border: 1px solid var(--bdr); }

    .kpi-val-group { display: flex; align-items: baseline; gap: 4px; margin-bottom: 8px; position: relative; z-index: 1; }
    .kpi-curr { font-size: 12px; font-weight: 700; color: var(--text-mut); }

    .kpi-val {
      font-size: 28px; font-weight: 900; color: var(--text-pri);
      letter-spacing: -1.2px; line-height: 1;
      display: block; margin-bottom: 8px; position: relative; z-index: 1;
    }
    .score-red { color: var(--red-bright) !important; }
    .kpi-pct   { font-size: 17px; font-weight: 800; color: var(--red-bright); }

    .kpi-footer { margin-bottom: 14px; position: relative; z-index: 1; }
    .kpi-chip {
      display: inline-flex; padding: 3px 10px; border-radius: 6px;
      font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;
    }
    .chip-neutral { background: var(--bg-card-2); color: var(--text-sec); border: 1px solid var(--bdr); }
    .chip-alert   { background: var(--red-pale); color: var(--red-bright); }
    .chip-ok      { background: var(--bg-card-2); color: var(--text-sec); border: 1px solid var(--bdr); }

    .kpi-bar-track { height: 3px; background: var(--bg-card-3); border-radius: 3px; overflow: hidden; position: relative; z-index: 1; }
    .kpi-bar-fill  { height: 100%; background: var(--red); border-radius: 3px; transition: width 1.1s cubic-bezier(.4,0,.2,1); }
    .kpi-alert .kpi-bar-fill { box-shadow: 0 0 8px var(--red-glow); }

    /* ══════════════════════════════════════════════════════
       MAIN GRID
    ══════════════════════════════════════════════════════ */
    .main-grid { display: grid; grid-template-columns: 1fr 310px; gap: 18px; align-items: start; }

    /* ══════════════════════════════════════════════════════
       PANEL BASE
    ══════════════════════════════════════════════════════ */
    .panel {
      background: var(--bg-card); border: 1px solid var(--bdr);
      border-radius: 22px; padding: 24px;
    }
    .panel-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 22px; gap: 12px;
    }
    .panel-title     { font-size: 16px; font-weight: 800; color: var(--text-pri); letter-spacing: -0.3px; }
    .panel-sub       { font-size: 11px; font-weight: 500; color: var(--text-mut); margin-top: 4px; }
    .panel-title-sm  {
      font-size: 10px; font-weight: 800; letter-spacing: 1.5px;
      text-transform: uppercase; color: var(--text-mut); margin-bottom: 18px;
    }

    .live-tag {
      display: flex; align-items: center; gap: 7px;
      padding: 5px 12px; border-radius: 50px;
      background: var(--red-pale); border: 1px solid var(--red-border);
      font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright);
      white-space: nowrap;
    }
    .ltag-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--red); box-shadow: 0 0 5px var(--red);
      animation: dot-blink 1.5s infinite;
    }

    /* ══════════════════════════════════════════════════════
       CHART
    ══════════════════════════════════════════════════════ */
    .chart-wrap { display: flex; gap: 14px; height: 230px; margin-bottom: 20px; }
    .y-axis {
      display: flex; flex-direction: column; justify-content: space-between;
      font-size: 10px; font-weight: 700; color: var(--text-mut);
      text-align: right; width: 36px; padding-bottom: 4px;
    }
    .chart-inner { flex: 1; position: relative; }
    .gridlines { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; }
    .gl { width: 100%; height: 1px; background: var(--bdr); }

    .bars-row {
      position: absolute; inset: 0;
      display: flex; align-items: flex-end; gap: 6px; padding-bottom: 4px;
    }
    .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; height: 100%; justify-content: flex-end; }
    .bar-col-inner { width: 100%; flex: 1; display: flex; align-items: flex-end; }

    .bar {
      width: 100%; border-radius: 5px 5px 0 0; min-height: 6px;
      background: var(--bg-card-3); border: 1px solid var(--bdr);
      position: relative; cursor: pointer;
      transition: background 0.2s, transform 0.18s;
    }
    .bar:hover { background: var(--bg-card-4); transform: scaleX(1.06); }
    .bar-active {
      background: var(--red) !important; border-color: var(--red-bright) !important;
      box-shadow: 0 0 18px var(--red-glow), 0 -3px 10px var(--red-glow);
    }

    .bar-tip {
      position: absolute; bottom: calc(100% + 10px); left: 50%;
      transform: translateX(-50%) translateY(6px);
      background: var(--bg-card); border: 1px solid var(--bdr-md);
      padding: 7px 12px; border-radius: 9px;
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s, transform 0.18s;
      white-space: nowrap; z-index: 10;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
    .bar-tip span     { font-size: 9px; font-weight: 700; color: var(--text-mut); text-transform: uppercase; }
    .bar-tip strong   { font-size: 13px; font-weight: 800; color: var(--text-pri); }
    .bar:hover .bar-tip { opacity: 1; transform: translateX(-50%) translateY(0); }
    .bar-lbl { font-size: 9px; font-weight: 700; color: var(--text-mut); text-transform: uppercase; }

    .chart-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 16px; border-top: 1px solid var(--bdr);
    }
    .legend { display: flex; gap: 18px; }
    .leg-item { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; color: var(--text-mut); }
    .leg-dot  { width: 10px; height: 10px; border-radius: 3px; }
    .ld-muted { background: var(--bg-card-3); border: 1px solid var(--bdr-md); }
    .ld-red   { background: var(--red); box-shadow: 0 0 5px var(--red-glow); }
    .ytd-label { font-size: 11px; font-weight: 700; color: var(--text-mut); }
    .ytd-label strong { color: var(--text-pri); font-size: 13px; }

    /* ══════════════════════════════════════════════════════
       SIDE COLUMN
    ══════════════════════════════════════════════════════ */
    .side-col { display: flex; flex-direction: column; gap: 16px; }

    /* Compliance ring */
    .ring-panel { display: flex; flex-direction: column; align-items: center; }
    .ring-wrap  { position: relative; width: 150px; height: 150px; margin-bottom: 18px; }
    .ring-svg   { width: 150px; height: 150px; }

    .ring-track    { stroke: var(--bg-card-3); }
    .ring-progress {
      stroke: var(--red);
      filter: drop-shadow(0 0 7px var(--red-glow));
      transition: stroke-dashoffset 1.4s cubic-bezier(0.2,0.8,0.2,1);
    }

    .ring-center {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .ring-pct { font-size: 30px; font-weight: 900; color: var(--text-pri); line-height: 1; }
    .ring-pct small { font-size: 16px; font-weight: 800; }
    .ring-lbl { font-size: 9px; font-weight: 800; letter-spacing: 2px; color: var(--red-bright); margin-top: 4px; }

    .ring-rows { width: 100%; display: flex; flex-direction: column; gap: 8px; }
    .ring-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 13px;
      background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 10px;
    }
    .rr-dot   { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
    .rr-ok    { background: var(--text-sec); }
    .rr-alert { background: var(--red); box-shadow: 0 0 6px var(--red-glow); animation: dot-blink 1.4s infinite; }
    .rr-text  { flex: 1; font-size: 11px; font-weight: 600; color: var(--text-mut); }
    .rr-val   { font-size: 11px; font-weight: 800; }
    .rr-val.ok    { color: var(--text-pri); }
    .rr-val.alert { color: var(--red-bright); }

    /* Quick nav */
    .nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .nav-tile {
      background: var(--bg-card-2); border: 1px solid var(--bdr);
      border-radius: 14px; padding: 15px 13px;
      display: flex; flex-direction: column; gap: 10px; align-items: flex-start;
      cursor: pointer; transition: all 0.2s; text-align: left;
    }
    .nav-tile:hover {
      background: var(--bg-card-3); border-color: var(--bdr-md);
      transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    }
    .nav-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: var(--red-pale); border: 1px solid var(--red-border);
      color: var(--red-bright);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .nav-tile:hover .nav-icon { background: var(--red); color: #fff; box-shadow: 0 4px 12px var(--red-glow); border-color: transparent; }
    .nav-tile span { font-size: 12px; font-weight: 700; color: var(--text-sec); }
    .nav-tile:hover span { color: var(--text-pri); }

    /* ══════════════════════════════════════════════════════
       AUDIT LOG
    ══════════════════════════════════════════════════════ */
    .view-all-btn {
      background: none; border: none;
      font-size: 12px; font-weight: 800; color: var(--red-bright);
      cursor: pointer; letter-spacing: 0.3px; transition: color 0.18s; white-space: nowrap;
    }
    .view-all-btn:hover { color: var(--text-pri); }

    .audit-list { display: flex; flex-direction: column; gap: 8px; }
    .audit-row {
      display: flex; align-items: center; gap: 13px;
      padding: 13px 16px;
      background: var(--bg-card-2); border: 1px solid var(--bdr);
      border-radius: 13px; transition: all 0.18s;
    }
    .audit-row:hover { background: var(--bg-card-3); border-color: var(--bdr-md); }

    .audit-icon {
      width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .ai-success { background: var(--bg-card-3); color: var(--text-pri); border: 1px solid var(--bdr-md); }
    .ai-pending { background: var(--red-pale); color: var(--red-bright); border: 1px solid var(--red-border); }

    .audit-body  { flex: 1; display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .audit-action { font-size: 13px; font-weight: 700; color: var(--text-pri); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .audit-meta   { font-size: 11px; font-weight: 500; color: var(--text-mut); }

    .audit-chip {
      padding: 4px 11px; border-radius: 7px; flex-shrink: 0;
      font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;
      background: var(--bg-card-3); color: var(--text-mut); border: 1px solid var(--bdr);
    }
    .ach-success { color: var(--text-pri); }

    .audit-empty {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 48px; text-align: center; color: var(--text-mut);
    }
    .audit-empty p { font-size: 13px; }

    /* ══════════════════════════════════════════════════════
       RESPONSIVE
    ══════════════════════════════════════════════════════ */
    @media (max-width: 1100px) { .main-grid { grid-template-columns: 1fr; } }
    @media (max-width: 900px)  { .kpi-grid  { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) {
      .db-inner    { padding: 14px 14px 56px; gap: 16px; }
      .db-header   { padding: 12px 14px; }
      .header-center { display: none; }
      .kpi-grid    { grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .kpi-val     { font-size: 22px; }
      .title-name  { font-size: 30px; letter-spacing: -1.5px; }
      .nav-grid    { grid-template-columns: repeat(2, 1fr); }
      .audit-row   { padding: 11px 13px; }
      .chart-wrap  { height: 180px; }
      .bars-row    { gap: 4px; }
    }
    @media (max-width: 420px) { .kpi-grid { grid-template-columns: 1fr; } }
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