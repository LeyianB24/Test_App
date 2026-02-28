import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-reports',
  imports: [CommonModule],
  template: `
    <div class="page-container animate-up">
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">System <span class="gradient-text">Reports</span> & Exports</h1>
          <p class="premium-subtitle">Generate and download official compliance and revenue audit files</p>
        </div>
      </header>

      <!-- Summary KPI Row -->
      <div class="reports-kpi-row">
        <div class="rk-card">
          <div class="rk-icon rk-red">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div class="rk-text">
            <div class="rk-val">6</div>
            <div class="rk-lbl">Report Types</div>
          </div>
        </div>
        <div class="rk-card">
          <div class="rk-icon rk-blue">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          </div>
          <div class="rk-text">
            <div class="rk-val">CSV</div>
            <div class="rk-lbl">Export Format</div>
          </div>
        </div>
        <div class="rk-card">
          <div class="rk-icon rk-green">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div class="rk-text">
            <div class="rk-val">Encrypted</div>
            <div class="rk-lbl">Secure Downloads</div>
          </div>
        </div>
        <div class="rk-card">
          <div class="rk-icon rk-purple">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="rk-text">
            <div class="rk-val">Real-time</div>
            <div class="rk-lbl">Live Data</div>
          </div>
        </div>
      </div>

      <!-- Reports Grid -->
      <div class="reports-grid">

        <div class="report-card-premium">
          <div class="rc-stripe rc-stripe-blue"></div>
          <div class="rc-icon-lg rci-blue">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <div class="rc-body">
            <h3 class="rc-title">Client Master Directory</h3>
            <p class="rc-desc">Complete extract of all registered taxpayers, KRA PINs, stations, and contact data.</p>
            <div class="rc-meta">
              <span class="rc-tag">Taxpayers</span>
              <span class="rc-tag">Compliance</span>
            </div>
          </div>
          <button class="rc-btn rc-btn-blue" (click)="downloadReport('clients', 'csv')">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export CSV
          </button>
        </div>

        <div class="report-card-premium">
          <div class="rc-stripe rc-stripe-green"></div>
          <div class="rc-icon-lg rci-green">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          </div>
          <div class="rc-body">
            <h3 class="rc-title">Revenue & Payments Extract</h3>
            <p class="rc-desc">Consolidated ledger of all successful KRA payments across PRNs and payment modes.</p>
            <div class="rc-meta">
              <span class="rc-tag">Revenue</span>
              <span class="rc-tag">Finance</span>
            </div>
          </div>
          <button class="rc-btn rc-btn-green" (click)="downloadReport('revenue', 'csv')">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export CSV
          </button>
        </div>

        <div class="report-card-premium">
          <div class="rc-stripe rc-stripe-amber"></div>
          <div class="rc-icon-lg rci-amber">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div class="rc-body">
            <h3 class="rc-title">Tax Returns Summary</h3>
            <p class="rc-desc">All filed returns with status breakdowns — draft, submitted, accepted, and amended.</p>
            <div class="rc-meta">
              <span class="rc-tag">Returns</span>
              <span class="rc-tag">Filing</span>
            </div>
          </div>
          <button class="rc-btn rc-btn-amber" (click)="downloadReport('returns', 'csv')">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export CSV
          </button>
        </div>

        <div class="report-card-premium">
          <div class="rc-stripe rc-stripe-red"></div>
          <div class="rc-icon-lg rci-red">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="rc-body">
            <h3 class="rc-title">Overdue Obligations Report</h3>
            <p class="rc-desc">All taxpayers with overdue tax obligations, penalty accruals, and escalation status.</p>
            <div class="rc-meta">
              <span class="rc-tag">Overdue</span>
              <span class="rc-tag">Obligations</span>
            </div>
          </div>
          <button class="rc-btn rc-btn-red" (click)="downloadReport('obligations', 'csv')">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export CSV
          </button>
        </div>

        <div class="report-card-premium">
          <div class="rc-stripe rc-stripe-purple"></div>
          <div class="rc-icon-lg rci-purple">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div class="rc-body">
            <h3 class="rc-title">Compliance Audit Matrix</h3>
            <p class="rc-desc">Deep-dive compliance scores per taxpayer, audit readiness, and risk classifications.</p>
            <div class="rc-meta">
              <span class="rc-tag">Compliance</span>
              <span class="rc-tag">Audit</span>
            </div>
          </div>
          <button class="rc-btn rc-btn-purple" disabled>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Upgrade Required
          </button>
        </div>

        <div class="report-card-premium">
          <div class="rc-stripe rc-stripe-slate"></div>
          <div class="rc-icon-lg rci-slate">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
          </div>
          <div class="rc-body">
            <h3 class="rc-title">System Audit Trail</h3>
            <p class="rc-desc">Full chronological log of all system actions, logins, exports, and permission changes.</p>
            <div class="rc-meta">
              <span class="rc-tag">Security</span>
              <span class="rc-tag">Traceability</span>
            </div>
          </div>
          <button class="rc-btn rc-btn-slate" (click)="downloadReport('audit', 'csv')">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export CSV
          </button>
        </div>

      </div><!-- /reports-grid -->
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }

    /* KPI Summary Row */
    .reports-kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 32px; }
    @media (max-width: 768px) { .reports-kpi-row { grid-template-columns: 1fr 1fr; } }
    .rk-card { background: #fff; border: 1px solid #F1F5F9; border-radius: 18px; padding: 20px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 8px rgba(0,0,0,.04); transition: transform .3s, box-shadow .3s; }
    .rk-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0,0,0,.07); }
    .rk-icon { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .rk-red    { background: rgba(227,30,36,.1); color: #E31E24; }
    .rk-blue   { background: rgba(59,130,246,.1); color: #3B82F6; }
    .rk-green  { background: rgba(16,185,129,.1); color: #10B981; }
    .rk-purple { background: rgba(139,92,246,.1); color: #8B5CF6; }
    .rk-val    { font-size: 1.4rem; font-weight: 900; color: #1E293B; line-height: 1; }
    .rk-lbl    { font-size: .68rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-top: 3px; }

    /* Reports Grid */
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px,1fr)); gap: 20px; }

    .report-card-premium {
      background: #fff;
      border: 1px solid #F1F5F9;
      border-radius: 24px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,.04);
      transition: transform .35s cubic-bezier(.165,.84,.44,1), box-shadow .35s;
      position: relative;
      overflow: hidden;
    }
    .report-card-premium:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,.09); }

    .rc-stripe { position: absolute; top: 0; left: 0; right: 0; height: 4px; }
    .rc-stripe-blue   { background: linear-gradient(90deg, #3B82F6, #60A5FA); }
    .rc-stripe-green  { background: linear-gradient(90deg, #10B981, #34D399); }
    .rc-stripe-amber  { background: linear-gradient(90deg, #F59E0B, #FCD34D); }
    .rc-stripe-red    { background: linear-gradient(90deg, #E31E24, #F87171); }
    .rc-stripe-purple { background: linear-gradient(90deg, #8B5CF6, #A78BFA); }
    .rc-stripe-slate  { background: linear-gradient(90deg, #64748B, #94A3B8); }

    .rc-icon-lg { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
    .rci-blue   { background: rgba(59,130,246,.1);  color: #3B82F6; }
    .rci-green  { background: rgba(16,185,129,.1);  color: #10B981; }
    .rci-amber  { background: rgba(245,158,11,.1);  color: #F59E0B; }
    .rci-red    { background: rgba(227,30,36,.1);   color: #E31E24; }
    .rci-purple { background: rgba(139,92,246,.1);  color: #8B5CF6; }
    .rci-slate  { background: rgba(100,116,139,.1); color: #64748B; }

    .rc-body { flex: 1; }
    .rc-title { font-size: 1.05rem; font-weight: 900; color: #1E293B; margin: 0 0 8px; }
    .rc-desc  { font-size: .85rem; color: #64748B; line-height: 1.6; margin: 0; }
    .rc-meta  { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
    .rc-tag   { font-size: .62rem; font-weight: 900; background: #F1F5F9; color: #64748B; padding: 3px 10px; border-radius: 8px; text-transform: uppercase; letter-spacing: .3px; }

    .rc-btn { width: 100%; padding: 12px; border-radius: 14px; border: none; font-size: .82rem; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all .2s; }
    .rc-btn-blue   { background: rgba(59,130,246,.1); color: #2563EB; }
    .rc-btn-blue:hover   { background: #3B82F6; color: #fff; }
    .rc-btn-green  { background: rgba(16,185,129,.1); color: #059669; }
    .rc-btn-green:hover  { background: #10B981; color: #fff; }
    .rc-btn-amber  { background: rgba(245,158,11,.1); color: #D97706; }
    .rc-btn-amber:hover  { background: #F59E0B; color: #fff; }
    .rc-btn-red    { background: rgba(227,30,36,.1); color: #DC2626; }
    .rc-btn-red:hover    { background: #E31E24; color: #fff; }
    .rc-btn-purple { background: rgba(139,92,246,.1); color: #7C3AED; }
    .rc-btn-purple:hover { background: #8B5CF6; color: #fff; }
    .rc-btn-slate  { background: rgba(100,116,139,.1); color: #475569; }
    .rc-btn-slate:hover  { background: #64748B; color: #fff; }
    .rc-btn:disabled { opacity: .5; cursor: not-allowed; }
    .rc-btn:disabled:hover { background: rgba(139,92,246,.1); color: #7C3AED; }
  `]
})
export class AdminReportsComponent {
  private authService = inject(AuthService);

  downloadReport(type: string, format: string) {
    const token = this.authService.getAuthToken();
    if (!token) return;
    const url = `${environment.apiUrl}/admin_export.php?type=${type}&format=${format}&token=${token}`;
    window.location.href = url;
  }
}
