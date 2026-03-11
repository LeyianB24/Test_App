import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxReturnService } from '../../../../services/tax-return.service';

@Component({
  selector: 'app-returns-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
              STATUTORY FILING ENGINE
            </div>
            <h1 class="premium-title">Returns <span class="text-red">Hub</span></h1>
            <p class="premium-subtitle">Unified gateway for statutory tax obligation declarations and fiscal synchronization</p>
          </div>
          
          <div class="header-right">
            <div class="registry-metrics">
              <div class="mini-stat">
                <div class="stat-icon bg-amber-pale text-amber">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Active Drafts</span>
                  <div class="stat-value">{{ taxService.draftReturnsCount() }}</div>
                </div>
              </div>

              <div class="mini-stat">
                <div class="stat-icon bg-red-pale text-red">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div class="stat-content">
                  <span class="stat-label">Overdue Protocols</span>
                  <div class="stat-value text-red">{{ taxService.overdueReturnsCount() }}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Compliance Directives -->
        @if (dueSoonDeadlines().length > 0) {
          <section class="directives-section">
            <div class="section-header">
              <div class="section-marker"></div>
              <h2 class="section-title">Urgent Compliance Directives</h2>
            </div>
            <div class="directives-grid">
              @for (dl of dueSoonDeadlines(); track dl.id) {
                <div class="elite-card directive-card group">
                  <div class="card-glow"></div>
                  <div class="card-header">
                    <span class="obligation-tag">{{ dl.return_type }} OBLIGATION</span>
                    <span class="priority-label animate-pulse">CRITICAL PERIOD</span>
                  </div>
                  
                  <h3 class="directive-title">Statutory Filing Deadline</h3>
                  <p class="directive-date">Deadline: <strong class="text-pri">{{ dl.filing_deadline | date:'longDate' }}</strong></p>
                  
                  <button class="btn-outline-red" [routerLink]="getFilingLink(dl.return_type)">
                    CLEAR OBLIGATION ARCHIVE
                  </button>
                </div>
              }
            </div>
          </section>
        }

        <!-- Filing Categories -->
        <div class="categories-grid">
          @for (category of categories; track category.title) {
            <div class="elite-card category-card group" [routerLink]="category.link">
              <div class="card-accent" [style.background]="category.iconBg"></div>
              
              <div class="category-header">
                <div class="category-icon" [style.background]="category.iconBg">
                  <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="category.icon" />
                  </svg>
                </div>
                <span class="category-status">{{ category.status }} ARCHIVE</span>
              </div>
              
              <h3 class="category-title group-hover-red">{{ category.title }}</h3>
              <p class="category-desc">{{ category.description }}</p>
              
              <div class="category-action">
                <span>Initiate Protocol</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </div>
            </div>
          }
        </div>

        <!-- History Registry -->
        <section class="history-section">
          <div class="section-header-flex">
            <div class="section-header">
              <div class="section-marker-dim"></div>
              <h2 class="section-title-dim">Filing History Archive</h2>
            </div>
            <button class="btn-text">
              Download Bulk Archive
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            </button>
          </div>
          
          <div class="elite-card table-section">
            <div class="table-responsive">
              <table class="elite-table">
                <thead>
                  <tr>
                    <th>Obligation Profile</th>
                    <th>Fiscal Period</th>
                    <th>Submit Timestamp</th>
                    <th>Protocol Reference</th>
                    <th>Registry Status</th>
                    <th class="text-right">Archived</th>
                  </tr>
                </thead>
                <tbody>
                  @if (taxService.returnsSignal().length === 0 && !taxService.loadingSignal()) {
                    <tr>
                      <td colspan="6" class="empty-state">
                        <div class="empty-title">Registry Silent</div>
                        <div class="empty-sub">No recent filing activity detected.</div>
                      </td>
                    </tr>
                  }
                  @for (filing of taxService.returnsSignal(); track filing.id) {
                    <tr class="table-row group">
                      <td><div class="font-black text-pri uppercase">{{ filing.return_type }}</div></td>
                      <td><span class="period-pill">{{ filing.tax_year }} FISCAL</span></td>
                      <td><span class="text-sec">{{ filing.submitted_at | date:'dd MMM yyyy' }}</span></td>
                      <td>
                         <span class="ref-chip">{{ filing.kra_reference || 'DRAFT-64215' }}</span>
                      </td>
                      <td>
                        <span class="status-chip" [attr.data-status]="filing.status.toLowerCase()">
                          <span class="status-dot"></span>
                          {{ filing.status }}
                        </span>
                      </td>
                      <td class="text-right">
                        <button class="icon-btn-elite">
                           <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Elite Footer -->
        <footer class="db-footer-elite">
           <p>STATUTORY IDENTIFICATION ARCHIVE. AUTHORIZED ACCESS ONLY. THIS RECORD IS SYNCHRONIZED WITH THE CENTRAL TAXPAYER REGISTRY.</p>
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

      --amber:        #F59E0B;
      --amber-pale:   rgba(245, 158, 11, 0.10);

      --bg-root:      #0C0C0C;
      --bg-card:      #141414;
      --bg-card-2:    #1C1C1C;
      
      --text-pri:     #F0F0F0;
      --text-sec:     #888888;
      --text-mut:     #4A4A4A;

      --bdr:          rgba(255, 255, 255, 0.08);
      --bdr-md:       rgba(255, 255, 255, 0.14);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    @media (prefers-color-scheme: light) {
      :host {
        --bg-root:    #F2F2F4;
        --bg-card:    #FFFFFF;
        --bg-card-2:  #F8F8FA;
        --text-pri:   #111111;
        --text-sec:   #555560;
        --text-mut:   #9999A8;
        --bdr:        rgba(0, 0, 0, 0.08);
        --bdr-md:     rgba(0, 0, 0, 0.12);
      }
    }

    .db-root { min-height: 100vh; background: var(--bg-root); color: var(--text-pri); position: relative; overflow-x: hidden; }
    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.03; z-index: 1; pointer-events: none; }
    .accent-bleed { position: fixed; top: -10vw; left: -10vw; width: 40vw; height: 40vw; background: var(--red); filter: blur(15vw); opacity: 0.08; border-radius: 50%; z-index: 1; pointer-events: none; }

    .db-inner { max-width: 1440px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 48px; position: relative; z-index: 10; }

    /* Header & Stats */
    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
    .premium-title { font-size: clamp(32px, 5vw, 48px); font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--red); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); max-width: 500px; }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .registry-metrics { display: flex; gap: 16px; }
    .mini-stat { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 20px; padding: 12px 20px; display: flex; align-items: center; gap: 14px; transition: all 0.2s; }
    .mini-stat:hover { border-color: var(--bdr-md); }
    .stat-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-2); }
    .stat-label { font-size: 9px; font-weight: 900; text-transform: uppercase; color: var(--text-sec); letter-spacing: 1px; }
    .stat-value { font-size: 20px; font-weight: 900; color: var(--text-pri); }

    /* Directives */
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .section-marker { width: 4px; height: 24px; background: var(--red); border-radius: 2px; box-shadow: 0 0 10px var(--red); }
    .section-title { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; color: var(--text-sec); }

    .directives-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 32px; padding: 32px; position: relative; overflow: hidden; transition: all 0.3s; }
    .elite-card:hover { border-color: var(--bdr-md); transform: translateY(-4px); }
    
    .directive-card { background: linear-gradient(135deg, var(--bg-card) 0%, rgba(217, 43, 43, 0.03) 100%); }
    .card-glow { position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: var(--red); filter: blur(80px); opacity: 0.05; transition: opacity 0.3s; }
    .directive-card:hover .card-glow { opacity: 0.15; }

    .obligation-tag { font-size: 9px; font-weight: 900; padding: 4px 10px; border-radius: 6px; background: var(--red-pale); color: var(--red-bright); border: 1px solid var(--red-border); }
    .priority-label { font-size: 9px; font-weight: 900; color: var(--red); letter-spacing: 1px; }
    .directive-title { font-size: 20px; font-weight: 900; margin: 16px 0 8px; color: var(--text-pri); }
    .directive-date { font-size: 12px; font-weight: 700; color: var(--text-sec); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }

    /* Categories */
    .categories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; }
    .category-card { cursor: pointer; display: flex; flex-direction: column; min-height: 280px; }
    .card-accent { position: absolute; bottom: -40px; right: -40px; width: 120px; height: 120px; border-radius: 50%; filter: blur(40px); opacity: 0.05; transition: all 0.5s; }
    .category-card:hover .card-accent { opacity: 0.15; transform: scale(1.5); }

    .category-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .category-icon { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .category-status { font-size: 9px; font-weight: 900; color: var(--text-mut); text-transform: uppercase; letter-spacing: 1px; }

    .category-title { font-size: 22px; font-weight: 900; margin-bottom: 12px; transition: color 0.2s; }
    .category-desc { font-size: 13px; line-height: 1.6; color: var(--text-sec); font-weight: 500; margin-bottom: 24px; flex-grow: 1; opacity: 0.7; }

    .category-action { display: flex; align-items: center; gap: 12px; font-size: 11px; font-weight: 900; text-transform: uppercase; color: var(--red); transition: transform 0.2s; }
    .category-card:hover .category-action { transform: translateX(8px); }

    /* History Table */
    .section-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .section-marker-dim { width: 4px; height: 24px; background: var(--text-mut); border-radius: 2px; }
    .section-title-dim { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; color: var(--text-mut); }

    .table-section { padding: 0; }
    .table-responsive { width: 100%; overflow-x: auto; }
    .elite-table { width: 100%; border-collapse: collapse; }
    .elite-table th { padding: 20px 32px; text-align: left; font-size: 10px; font-weight: 900; color: var(--text-mut); text-transform: uppercase; letter-spacing: 2px; background: var(--bg-card-2); }
    .elite-table td { padding: 24px 32px; border-bottom: 1px solid var(--bdr); font-size: 14px; }
    .table-row:hover { background: var(--bg-card-2); }

    .period-pill { padding: 4px 12px; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 8px; font-size: 11px; font-weight: 800; color: var(--text-sec); }
    .ref-chip { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 700; color: var(--red); background: var(--red-pale); border: 1px solid var(--red-border); padding: 4px 10px; border-radius: 6px; }

    .status-chip { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 50px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
    .status-chip[data-status="submitted"] { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .status-chip .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .icon-btn-elite { width: 44px; height: 44px; border-radius: 14px; background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--text-sec); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .icon-btn-elite:hover { background: var(--red); color: white; border-color: var(--red); }

    /* Buttons */
    .btn-outline-red { width: 100%; background: transparent; color: var(--red); border: 1px solid var(--red-border); padding: 14px; border-radius: 16px; font-size: 11px; font-weight: 900; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; }
    .btn-outline-red:hover { background: var(--red); color: white; border-color: var(--red); }
    
    .btn-text { background: none; border: none; font-size: 10px; font-weight: 900; text-transform: uppercase; color: var(--text-mut); letter-spacing: 1.5px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: color 0.2s; }
    .btn-text:hover { color: var(--text-pri); }

    .db-footer-elite { margin-top: 40px; padding: 40px; border: 1px solid var(--bdr); border-radius: 32px; text-align: center; background: var(--bg-card-2); }
    .db-footer-elite p { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 4px; line-height: 1.8; max-width: 800px; margin: 0 auto; }

    /* Utility */
    .group-hover-red { transition: color 0.2s; }
    .category-card:hover .group-hover-red { color: var(--red); }
    .empty-state { padding: 60px 0; text-align: center; color: var(--text-mut); }
    .empty-title { font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .empty-sub { font-size: 12px; font-weight: 500; }

    /* Animations */
    .animate-stagger > * { opacity: 0; animation: slideIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
    .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
    .animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `],
})
export class ReturnsHubComponent implements OnInit {
  public taxService = inject(TaxReturnService);

  dueSoonDeadlines = computed(() => 
    this.taxService.deadlinesSignal().filter(dl => 
      dl.priority === 'Critical' || dl.priority === 'High'
    )
  );

  categories = [
    {
      title: 'VAT (Form P30)',
      description: 'Monthly statutory declarations for Value Added Tax including biometric eTIMS ledger synchronization.',
      link: '/member/tax-engine/file/vat',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      iconBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      status: 'Monthly'
    },
    {
      title: 'PAYE (Form P10)',
      description: 'Monthly employer declarations for PAYE, Social Health, and Housing Development archives.',
      link: '/member/tax-engine/file/paye',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      status: 'Monthly'
    },
    {
      title: 'Individual IT1',
      description: 'Annual unified return for resident identities. Automated prepopulation from P9 certificates.',
      link: '/member/tax-engine/file/it1',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      status: 'Annual'
    },
    {
      title: 'Rental Income',
      description: 'Monthly MRI protocols for physical asset receipts. Statutory 7.5% gross liquidation.',
      link: '/member/tax-engine/file/mri',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      status: 'Monthly'
    },
    {
      title: 'Nil Protocols',
      description: 'Express zero-income declaration sequences. Optimized 60-second execution path.',
      link: '/member/tax-engine/file/nil-return',
      icon: 'M5 13l4 4L19 7',
      iconBg: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
      status: 'Express'
    },
    {
      title: 'Turnover Tax',
      description: 'Quarterly TOT archives for commercial entities. Simplified 1% gross ledger filing.',
      link: '/member/tax-engine/file/tot',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      status: 'Quarterly'
    }
  ];

  ngOnInit() {
    this.taxService.listReturns({ year: 2026 }).subscribe();
  }

  getFilingLink(type: string): string {
    switch (type) {
      case 'VAT': return '/member/tax-engine/file/vat';
      case 'PAYE': return '/member/tax-engine/file/paye';
      case 'IT1': return '/member/tax-engine/file/it1';
      case 'MRI': return '/member/tax-engine/file/mri';
      case 'TOT': return '/member/tax-engine/file/tot';
      case 'Nil': return '/member/tax-engine/file/nil-return';
      default: return '/member/returns';
    }
  }
}
