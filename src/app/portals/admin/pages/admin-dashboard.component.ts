import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService, AdminDashboardSummary, PortalStatus } from '../../../services/admin-dashboard.service';
import { AuditLogService, AuditLog } from '../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-admin-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="admin-dash animate-up">

      <!-- ── Page Header ────────────────────────────────────── -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Admin <span class="gradient-text">Overview</span></h1>
          <p class="premium-subtitle">System-wide intelligence, revenue metrics & live monitoring</p>
        </div>
        <div class="header-actions">
          <div class="live-badge">
            <span class="live-dot"></span>Live
          </div>
          <button class="btn-premium-outline" (click)="refresh()">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Refresh
          </button>
        </div>
      </header>

      <!-- ── Loading ───────────────────────────────────────── -->
      <div *ngIf="loading()" class="loading-splash">
        <div class="spin"></div>
        <p>Aggregating intelligence…</p>
      </div>

      <!-- ── Error ─────────────────────────────────────────── -->
      <div *ngIf="error()" class="error-banner">{{ error() }}</div>

      <!-- ── Main Content ──────────────────────────────────── -->
      <div *ngIf="!loading() && summary()">

        <!-- KPI Row -->
        <div class="kpi-grid">

          <!-- Total Revenue -->
          <div class="kpi-card kpi-red">
            <div class="kpi-icon-wrap kpi-icon-red">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Total Revenue</span>
              <div class="kpi-value">KES {{ formatM(summary()?.stats?.totalTaxCollected) }}</div>
              <div class="kpi-sub">
                <span class="kpi-badge kpi-badge-green">↑ This Month: KES {{ formatM(summary()?.stats?.monthlyRevenue) }}</span>
              </div>
            </div>
            <div class="kpi-sparkline">
              <svg viewBox="0 0 80 28" preserveAspectRatio="none">
                <path d="M0,22 L10,18 L20,19 L30,12 L40,14 L50,8 L60,10 L70,4 L80,6" fill="none" stroke="rgba(227,30,36,0.7)" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

          <!-- Total Taxpayers -->
          <div class="kpi-card kpi-blue">
            <div class="kpi-icon-wrap kpi-icon-blue">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Registered Taxpayers</span>
              <div class="kpi-value">{{ (summary()?.stats?.totalTaxpayers || 0) | number }}</div>
              <div class="kpi-sub">
                <span class="kpi-badge kpi-badge-blue">+{{ summary()?.stats?.newTaxpayersThisMonth || 0 }} this month</span>
              </div>
            </div>
            <div class="kpi-sparkline">
              <svg viewBox="0 0 80 28" preserveAspectRatio="none">
                <path d="M0,24 L15,20 L30,15 L45,12 L60,8 L80,4" fill="none" stroke="rgba(59,130,246,0.7)" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

          <!-- Active Returns -->
          <div class="kpi-card kpi-green">
            <div class="kpi-icon-wrap kpi-icon-green">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Active Returns (30d)</span>
              <div class="kpi-value">{{ (summary()?.stats?.activeReturns || 0) | number }}</div>
              <div class="kpi-sub">
                <span class="kpi-badge kpi-badge-green">Submitted / Accepted</span>
              </div>
            </div>
            <div class="kpi-sparkline">
              <svg viewBox="0 0 80 28" preserveAspectRatio="none">
                <path d="M0,18 L10,15 L20,16 L30,10 L40,13 L50,7 L60,9 L70,5 L80,8" fill="none" stroke="rgba(16,185,129,0.7)" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

          <!-- Compliance Rate -->
          <div class="kpi-card kpi-purple">
            <div class="kpi-icon-wrap kpi-icon-purple">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">System Integrity</span>
              <div class="kpi-value">{{ summary()?.stats?.systemHealth || 98 }}<span class="kpi-unit">%</span></div>
              <div class="kpi-sub">
                <span class="kpi-badge kpi-badge-purple">Payment Success Rate</span>
              </div>
            </div>
            <div class="kpi-ring">
              <svg viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(139,92,246,0.1)" stroke-width="3"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="#8B5CF6" stroke-width="3" stroke-linecap="round"
                  [attr.stroke-dasharray]="(summary()?.stats?.systemHealth||98)*0.94 + ' 94'"
                  stroke-dashoffset="23.5" transform="rotate(-90 18 18)"/>
              </svg>
            </div>
          </div>

          <!-- Pending Payments -->
          <div class="kpi-card kpi-amber">
            <div class="kpi-icon-wrap kpi-icon-amber">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Pending Payments</span>
              <div class="kpi-value">{{ (summary()?.stats?.pendingPayments || 0) | number }}</div>
              <div class="kpi-sub">
                <span class="kpi-badge kpi-badge-amber">Awaiting Settlement</span>
              </div>
            </div>
            <div class="kpi-sparkline">
              <svg viewBox="0 0 80 28" preserveAspectRatio="none">
                <path d="M0,8 L15,12 L30,10 L45,16 L60,14 L80,18" fill="none" stroke="rgba(245,158,11,0.7)" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

          <!-- Overdue Obligations -->
          <div class="kpi-card kpi-rose">
            <div class="kpi-icon-wrap kpi-icon-rose">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            </div>
            <div class="kpi-content">
              <span class="kpi-label">Overdue Obligations</span>
              <div class="kpi-value">{{ (summary()?.stats?.overdueObligations || 0) | number }}</div>
              <div class="kpi-sub">
                <span class="kpi-badge kpi-badge-rose">Requires Action</span>
              </div>
            </div>
            <div class="kpi-sparkline">
              <svg viewBox="0 0 80 28" preserveAspectRatio="none">
                <path d="M0,10 L20,14 L40,12 L60,18 L80,22" fill="none" stroke="rgba(251,113,133,0.7)" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

        </div><!-- /kpi-grid -->

        <!-- ── Main Two-Column Layout ─────────────────────── -->
        <div class="dash-grid">

          <!-- LEFT COLUMN -->
          <div class="dash-col-main">

            <!-- Revenue Bar Chart -->
            <div class="card-glass card-red-left">
              <div class="card-header-row">
                <h3 class="card-title">12-Month Revenue Intelligence</h3>
                <span class="badge-pill">KES {{ formatM(totalRevenue12M()) }} Total</span>
              </div>

              <div class="bar-chart-wrap">
                @for (m of chartMonths(); track $index) {
                  <div class="bar-col">
                    <div class="bar-label-top">{{ m.amount > 0 ? formatK(m.amount) : '' }}</div>
                    <div class="bar-container">
                      <div class="bar-fill" [style.height.%]="getBarPct(m.amount)" [title]="'KES '+formatK(m.amount)"></div>
                    </div>
                    <div class="bar-month">{{ m.month }}</div>
                  </div>
                }
              </div>

              <div class="chart-legend">
                <div class="legend-item"><span class="legend-dot dot-red"></span>Monthly Collections</div>
              </div>
            </div>

            <!-- Performance Metrics Row -->
            <div class="perf-row">
              <div class="perf-metric">
                <div class="perf-icon blue">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <div>
                  <div class="perf-value">{{ summary()?.metrics?.paymentSuccessRate || 0 }}%</div>
                  <div class="perf-label">Payment Success</div>
                  <div class="mini-bar"><div class="mini-fill blue-fill" [style.width.%]="summary()?.metrics?.paymentSuccessRate || 0"></div></div>
                </div>
              </div>
              <div class="perf-metric">
                <div class="perf-icon green">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <div class="perf-value">KES {{ (summary()?.metrics?.avgTransactionValue || 0) | number:'1.0-0' }}</div>
                  <div class="perf-label">Avg Transaction</div>
                  <div class="mini-bar"><div class="mini-fill green-fill" style="width:70%"></div></div>
                </div>
              </div>
              <div class="perf-metric">
                <div class="perf-icon purple">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01"/></svg>
                </div>
                <div>
                  <div class="perf-value">{{ (summary()?.metrics?.totalTransactions || 0) | number }}</div>
                  <div class="perf-label">Total Transactions</div>
                  <div class="mini-bar"><div class="mini-fill purple-fill" style="width:85%"></div></div>
                </div>
              </div>
              <div class="perf-metric">
                <div class="perf-icon amber">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <div class="perf-value">{{ summary()?.metrics?.completedToday || 0 }}</div>
                  <div class="perf-label">Today's Payments</div>
                  <div class="mini-bar"><div class="mini-fill amber-fill" style="width:40%"></div></div>
                </div>
              </div>
            </div>

            <!-- Live System Pulse -->
            <div class="card-glass card-blue-left">
              <div class="card-header-row">
                <h3 class="card-title">Live System Pulse</h3>
                <button class="text-link" (click)="refreshLogs()">Refresh</button>
              </div>
              <div class="pulse-scroll">
                @for (log of recentLogs(); track log.id) {
                  <div class="pulse-item">
                    <div class="pulse-dot-wrap" [class.red-dot-wrap]="isErrorAction(log.action)">
                      <div class="pulse-dot" [class.red-dot]="isErrorAction(log.action)"></div>
                    </div>
                    <div class="pulse-body">
                      <div class="pulse-row">
                        <span class="pulse-user">{{ log.user || 'System' }}</span>
                        <span class="pulse-time">{{ log.timestamp | date:'HH:mm' }}</span>
                      </div>
                      <p class="pulse-desc">{{ log.details }}</p>
                      <span class="pulse-tag" [class.red-tag]="isErrorAction(log.action)">{{ log.action }}</span>
                    </div>
                  </div>
                }
                @if (recentLogs().length === 0) {
                  <p class="empty-msg">No recent activity</p>
                }
              </div>
            </div>

          </div><!-- /dash-col-main -->

          <!-- RIGHT COLUMN -->
          <div class="dash-col-side">

            <!-- Compliance Radar -->
            <div class="card-glass card-purple-left">
              <h3 class="card-title mb-20">Compliance Radar</h3>

              <div class="radar-item">
                <div class="radar-row">
                  <span class="radar-label">Return Filing</span>
                  <span class="radar-val">{{ summary()?.compliance?.returnFilingRate || 0 }}%</span>
                </div>
                <div class="radar-track"><div class="radar-fill radar-blue" [style.width.%]="summary()?.compliance?.returnFilingRate || 0"></div></div>
              </div>

              <div class="radar-item">
                <div class="radar-row">
                  <span class="radar-label">Payment Compliance</span>
                  <span class="radar-val">{{ summary()?.compliance?.paymentCompliance || 0 }}%</span>
                </div>
                <div class="radar-track"><div class="radar-fill radar-green" [style.width.%]="summary()?.compliance?.paymentCompliance || 0"></div></div>
              </div>

              <div class="radar-item">
                <div class="radar-row">
                  <span class="radar-label">Obligations</span>
                  <span class="radar-val">{{ summary()?.compliance?.obligationComplianceRate || 0 }}%</span>
                </div>
                <div class="radar-track"><div class="radar-fill radar-purple" [style.width.%]="summary()?.compliance?.obligationComplianceRate || 0"></div></div>
              </div>

              <div class="audit-score">
                <svg viewBox="0 0 80 80" class="score-ring">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#F1F5F9" stroke-width="8"/>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="url(#scoreGrad)" stroke-width="8" stroke-linecap="round"
                    [attr.stroke-dasharray]="(summary()?.compliance?.auditReadiness||0)*2.135+' 213.5'"
                    stroke-dashoffset="53.4" transform="rotate(-90 40 40)"/>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#8B5CF6"/>
                      <stop offset="100%" stop-color="#3B82F6"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div class="score-text">
                  <div class="score-num">{{ summary()?.compliance?.auditReadiness || 0 }}%</div>
                  <div class="score-lbl">Audit Ready</div>
                </div>
              </div>
            </div>

            <!-- Tax Type Distribution -->
            <div class="card-glass card-gold-left">
              <h3 class="card-title mb-20">Tax Type Distribution</h3>
              @if (taxTypes().length > 0) {
                @for (t of taxTypes().slice(0,6); track $index) {
                  <div class="tax-type-item">
                    <div class="tax-type-info">
                      <span class="tax-dot" [style.background]="taxColors[$index % taxColors.length]"></span>
                      <span class="tax-name">{{ shortTaxType(t.type) }}</span>
                    </div>
                    <div class="tax-right">
                      <span class="tax-amt">KES {{ formatK(t.amount) }}</span>
                    </div>
                  </div>
                }
              } @else {
                <p class="empty-msg">Run data seeder to populate tax breakdown</p>
              }
            </div>

            <!-- Gov Nexus -->
            <div class="card-glass card-slate-left">
              <div class="card-header-row mb-16">
                <h3 class="card-title">Gov Nexus</h3>
                <span class="live-badge-sm"><span class="live-dot-sm"></span>Live</span>
              </div>
              @for (portal of portals(); track portal.name) {
                <div class="nexus-row">
                  <span class="nexus-name">{{ portal.name }}</span>
                  <div class="nexus-status">
                    <div class="nexus-dot" [class.nexus-dot-on]="portal.online"></div>
                    <span class="nexus-txt" [class.nexus-off]="!portal.online">{{ portal.online ? 'UP' : 'DOWN' }}</span>
                    <span class="nexus-lat" *ngIf="portal.online">{{ portal.latency }}</span>
                  </div>
                </div>
              }
              @if (portals().length === 0) {
                <p class="empty-msg">Portal status unavailable</p>
              }
            </div>

          </div><!-- /dash-col-side -->
        </div><!-- /dash-grid -->
      </div><!-- /main content -->
    </div>
  `,
  styles: [`
    /* ── Layout ──────────────────────────────────────────── */
    .admin-dash { max-width: 1440px; margin: 0 auto; padding: 2rem; }

    /* ── KPI Grid ────────────────────────────────────────── */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (max-width: 1280px) { .kpi-grid { grid-template-columns: repeat(3,1fr); } }
    @media (max-width: 768px)  { .kpi-grid { grid-template-columns: 1fr 1fr; } }

    .kpi-card {
      background: #fff;
      border-radius: 20px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      transition: transform .35s cubic-bezier(.165,.84,.44,1), box-shadow .35s;
      box-shadow: 0 2px 12px rgba(0,0,0,.05);
      border: 1px solid #F1F5F9;
    }
    .kpi-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,.09); }

    .kpi-icon-wrap {
      width: 44px; height: 44px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 14px;
    }
    .kpi-icon-red    { background: rgba(227,30,36,.1);   color: #E31E24; }
    .kpi-icon-blue   { background: rgba(59,130,246,.1);  color: #3B82F6; }
    .kpi-icon-green  { background: rgba(16,185,129,.1);  color: #10B981; }
    .kpi-icon-purple { background: rgba(139,92,246,.1);  color: #8B5CF6; }
    .kpi-icon-amber  { background: rgba(245,158,11,.1);  color: #F59E0B; }
    .kpi-icon-rose   { background: rgba(251,113,133,.1); color: #F87171; }

    .kpi-label { font-size: .7rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: .5px; display: block; margin-bottom: 6px; }
    .kpi-value { font-size: 1.35rem; font-weight: 900; color: #1E293B; line-height: 1; margin-bottom: 8px; }
    .kpi-unit  { font-size: .8rem; font-weight: 700; }

    .kpi-badge { font-size: .62rem; font-weight: 900; padding: 3px 8px; border-radius: 8px; }
    .kpi-badge-green  { background: rgba(16,185,129,.1); color: #059669; }
    .kpi-badge-blue   { background: rgba(59,130,246,.1); color: #2563EB; }
    .kpi-badge-purple { background: rgba(139,92,246,.1); color: #7C3AED; }
    .kpi-badge-amber  { background: rgba(245,158,11,.1); color: #D97706; }
    .kpi-badge-rose   { background: rgba(239,68,68,.1);  color: #DC2626; }

    .kpi-sparkline { position: absolute; bottom: 0; right: 0; width: 100%; height: 40px; opacity: .5; }
    .kpi-sparkline svg { width: 100%; height: 100%; }

    .kpi-ring { position: absolute; bottom: 8px; right: 12px; width: 48px; height: 48px; }
    .kpi-ring svg { width: 100%; height: 100%; }

    /* ── Dash Grid ────────────────────────────────────────── */
    .dash-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
    @media (max-width: 1100px) { .dash-grid { grid-template-columns: 1fr; } }

    /* ── Cards ────────────────────────────────────────────── */
    .card-glass {
      background: rgba(255,255,255,.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,.5);
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 4px 24px rgba(0,0,0,.05);
      margin-bottom: 20px;
      transition: box-shadow .3s;
    }
    .card-glass:hover { box-shadow: 0 10px 36px rgba(0,0,0,.08); }
    .card-red-left    { border-left: 5px solid var(--kra-red, #E31E24); }
    .card-blue-left   { border-left: 5px solid #3B82F6; }
    .card-purple-left { border-left: 5px solid #8B5CF6; }
    .card-gold-left   { border-left: 5px solid #F59E0B; }
    .card-slate-left  { border-left: 5px solid #64748B; }

    .card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .card-title { font-size: 1rem; font-weight: 900; color: #1E293B; margin: 0; }
    .badge-pill { background: #F1F5F9; color: #475569; font-size: .7rem; font-weight: 900; padding: 4px 12px; border-radius: 20px; }
    .text-link  { background: none; border: none; color: #3B82F6; font-size: .8rem; font-weight: 800; cursor: pointer; }
    .mb-20 { margin-bottom: 20px; }
    .mb-16 { margin-bottom: 16px; }

    /* ── Bar Chart ────────────────────────────────────────── */
    .bar-chart-wrap { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding-bottom: 4px; }
    .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }
    .bar-label-top { font-size: .55rem; font-weight: 800; color: #94A3B8; min-height: 14px; }
    .bar-container { flex: 1; width: 100%; display: flex; align-items: flex-end; background: #F8FAFC; border-radius: 6px 6px 0 0; }
    .bar-fill { width: 100%; background: linear-gradient(to top, #E31E24, #F87171); border-radius: 6px 6px 0 0; min-height: 4px; transition: height 1s ease; }
    .bar-month { font-size: .6rem; font-weight: 800; color: #94A3B8; white-space: nowrap; }
    .chart-legend { display: flex; gap: 16px; margin-top: 12px; }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: .72rem; font-weight: 700; color: #64748B; }
    .legend-dot { width: 8px; height: 8px; border-radius: 2px; }
    .dot-red { background: #E31E24; }

    /* ── Performance Row ─────────────────────────────────── */
    .perf-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 20px; }
    @media (max-width: 900px) { .perf-row { grid-template-columns: repeat(2,1fr); } }

    .perf-metric { background: #FFF; border: 1px solid #F1F5F9; border-radius: 18px; padding: 16px; display: flex; gap: 14px; align-items: flex-start; box-shadow: 0 2px 8px rgba(0,0,0,.03); }
    .perf-icon { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .perf-icon.blue   { background: rgba(59,130,246,.1); color: #3B82F6; }
    .perf-icon.green  { background: rgba(16,185,129,.1); color: #10B981; }
    .perf-icon.purple { background: rgba(139,92,246,.1); color: #8B5CF6; }
    .perf-icon.amber  { background: rgba(245,158,11,.1); color: #F59E0B; }
    .perf-value { font-size: 1.1rem; font-weight: 900; color: #1E293B; margin-bottom: 2px; }
    .perf-label { font-size: .68rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-bottom: 8px; }
    .mini-bar { height: 4px; background: #F1F5F9; border-radius: 2px; overflow: hidden; }
    .mini-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }
    .blue-fill   { background: #3B82F6; }
    .green-fill  { background: #10B981; }
    .purple-fill { background: #8B5CF6; }
    .amber-fill  { background: #F59E0B; }

    /* ── Pulse List ──────────────────────────────────────── */
    .pulse-scroll { max-height: 320px; overflow-y: auto; padding-right: 4px; }
    .pulse-item { display: flex; gap: 12px; padding: 12px 8px; border-radius: 12px; transition: background .2s; }
    .pulse-item:hover { background: rgba(241,245,249,.8); }
    .pulse-dot-wrap { width: 32px; height: 32px; border-radius: 10px; background: rgba(59,130,246,.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
    .red-dot-wrap   { background: rgba(239,68,68,.1); }
    .pulse-dot  { width: 8px; height: 8px; border-radius: 50%; background: #3B82F6; box-shadow: 0 0 6px #3B82F6; }
    .red-dot    { background: #EF4444; box-shadow: 0 0 6px #EF4444; }
    .pulse-body { flex: 1; min-width: 0; }
    .pulse-row  { display: flex; justify-content: space-between; margin-bottom: 2px; }
    .pulse-user { font-size: .8rem; font-weight: 900; color: #1E293B; }
    .pulse-time { font-size: .68rem; color: #94A3B8; font-weight: 700; }
    .pulse-desc { font-size: .75rem; color: #64748B; margin: 2px 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pulse-tag  { font-size: .6rem; font-weight: 950; text-transform: uppercase; color: #3B82F6; letter-spacing: .4px; }
    .red-tag    { color: #EF4444; }

    /* ── Compliance Radar ────────────────────────────────── */
    .radar-item { margin-bottom: 16px; }
    .radar-row  { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .radar-label{ font-size: .78rem; font-weight: 800; color: #64748B; }
    .radar-val  { font-size: .78rem; font-weight: 900; color: #1E293B; }
    .radar-track{ height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden; }
    .radar-fill { height: 100%; border-radius: 4px; transition: width 1.2s ease; }
    .radar-blue   { background: linear-gradient(90deg, #3B82F6, #60A5FA); }
    .radar-green  { background: linear-gradient(90deg, #10B981, #34D399); }
    .radar-purple { background: linear-gradient(90deg, #8B5CF6, #A78BFA); }

    .audit-score { display: flex; align-items: center; gap: 16px; margin-top: 24px; padding: 16px; background: #F8FAFC; border-radius: 16px; }
    .score-ring  { width: 80px; height: 80px; flex-shrink: 0; }
    .score-num   { font-size: 1.6rem; font-weight: 900; color: #1E293B; }
    .score-lbl   { font-size: .7rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; }

    /* ── Tax Type Distribution ───────────────────────────── */
    .tax-type-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #F8FAFC; }
    .tax-type-info { display: flex; align-items: center; gap: 10px; }
    .tax-dot  { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
    .tax-name { font-size: .8rem; font-weight: 800; color: #334155; }
    .tax-amt  { font-size: .78rem; font-weight: 900; color: #1E293B; }

    /* ── Gov Nexus ───────────────────────────────────────── */
    .nexus-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #F8FAFC; border-radius: 12px; margin-bottom: 6px; }
    .nexus-name { font-size: .82rem; font-weight: 800; color: #334155; }
    .nexus-status { display: flex; align-items: center; gap: 6px; }
    .nexus-dot { width: 7px; height: 7px; border-radius: 50%; background: #CBD5E1; }
    .nexus-dot-on { background: #10B981; box-shadow: 0 0 5px #10B981; }
    .nexus-txt { font-size: .65rem; font-weight: 950; color: #10B981; }
    .nexus-off { color: #EF4444; }
    .nexus-lat { font-size: .6rem; color: #94A3B8; font-weight: 700; }

    /* ── Live Badge ──────────────────────────────────────── */
    .live-badge { display: flex; align-items: center; gap: 6px; background: #1E293B; color: #fff; font-size: .65rem; font-weight: 950; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; margin-right: 10px; }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; animation: blink 1.5s infinite; }
    .live-badge-sm { display: flex; align-items: center; gap: 4px; font-size: .62rem; font-weight: 800; color: #64748B; }
    .live-dot-sm { width: 5px; height: 5px; border-radius: 50%; background: #10B981; animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: .4; } }

    /* ── Loading ─────────────────────────────────────────── */
    .loading-splash { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 16px; }
    .loading-splash p { color: #94A3B8; font-weight: 700; font-size: .9rem; }
    .spin { width: 40px; height: 40px; border: 4px solid #F1F5F9; border-top-color: #E31E24; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-msg { color: #94A3B8; font-size: .82rem; font-weight: 700; text-align: center; padding: 20px; }
    .page-container { max-width: 1440px; margin: 0 auto; padding: 2rem; }
  `]
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
