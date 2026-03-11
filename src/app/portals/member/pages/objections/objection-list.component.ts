import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-objection-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner">
        <header class="premium-header">
          <div class="header-main">
            <div class="header-tag">
              <span class="tag-glow"></span>
              <span class="tag-text">Legal Chancery Protocol</span>
            </div>
            <h1 class="premium-title">My <span class="red-gradient">Objections</span></h1>
            <p class="premium-subtitle">Authorized tracker for formal disputes and administrative appeals protocols</p>
          </div>
          <button routerLink="/member/objections/create" class="btn-primary-elite">
            <div class="btn-glow"></div>
            <span class="relative z-10">FILE NEW DISPUTE</span>
          </button>
        </header>

        <!-- Stats Grid -->
        <div class="stats-grid">
           @for (stat of stats; track stat.label) {
              <div class="elite-card stat-card">
                 <span class="stat-label">{{ stat.label }}</span>
                 <div class="stat-value">{{ stat.value }}</div>
                 <div class="stat-indicator">PROTOCOL ACTIVE</div>
              </div>
           }
        </div>

        <!-- Registry Surface -->
        <div class="registry-surface">
           <div class="surface-header">
              <h3 class="surface-title">ACTIVE DISPUTE REGISTRY</h3>
           </div>

           <div class="objection-stack">
              @for (item of objections; track item.id) {
                 <div class="objection-row group">
                    <div class="row-main">
                       <div class="meta-line">
                          <span class="ref-tag">{{ item.refNo }}</span>
                          <span class="divider"></span>
                          <span class="obligation-text">{{ item.obligation }}</span>
                       </div>
                       <h3 class="objection-reason">{{ item.reason }}</h3>
                       <div class="info-cluster">
                          <div class="info-item">
                             <span class="info-label">ASSESSMENT NO</span>
                             <span class="info-value">{{ item.assessmentNo }}</span>
                          </div>
                          <div class="info-item">
                             <span class="info-label">PROTOCOL DATE</span>
                             <span class="info-value">{{ item.filedDate | date:'dd MMM yyyy' }}</span>
                          </div>
                       </div>
                    </div>

                    <div class="row-actions-wrap">
                       <span class="status-pill-elite" [class.active]="item.status === 'UNDER REVIEW'">
                          <span class="dot"></span>
                          {{ item.status }}
                       </span>
                       <div class="action-buttons">
                          <button class="btn-icon-elite" title="Audit Archive">
                             <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                          </button>
                          <button class="btn-ghost-elite">TRACK PROGRESS</button>
                       </div>
                    </div>
                 </div>
              } @empty {
                 <div class="empty-registry">
                    <div class="empty-icon-wrap">
                       <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                    </div>
                    <h3 class="empty-title">NO DISPUTE RECORDS</h3>
                    <p class="empty-text">You have no active or historical objection protocols in the registry.</p>
                 </div>
              }
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      --red: #D92B2B;
      --red-bright: #EF3B3B;
      --red-glow: rgba(217, 43, 43, 0.4);
      --red-pale: rgba(217, 43, 43, 0.1);
      --red-border: rgba(217, 43, 43, 0.2);
      --bg-root: #080809;
      --bg-surface: rgba(18, 18, 20, 0.6);
      --bdr: rgba(255, 255, 255, 0.05);
      --text-muted: #666670;
    }

    .db-root { 
      min-height: 100vh; 
      background: #050505 ;
      background-size: cover;
      color: #fff; 
      position: relative; 
      overflow-x: hidden; 
      padding-bottom: 5rem;
    }
    
    .db-root::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.02; z-index: 2; pointer-events: none; }

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
    .premium-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
      margin-bottom: 40px;
    }

    .header-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px;
      background: var(--red-pale);
      border: 1px solid var(--red-border);
      border-radius: 100px;
      margin-bottom: 16px;
    }
    .tag-glow { width: 6px; height: 6px; background: var(--red); border-radius: 50%; box-shadow: 0 0 10px var(--red); }
    .tag-text { font-size: 10px; font-weight: 900; color: var(--red-bright); letter-spacing: 2px; text-transform: uppercase; }

    .premium-title { font-size: 48px; font-weight: 950; letter-spacing: -2px; line-height: 1; margin: 0; }
    .red-gradient { background: linear-gradient(to right, #fff, var(--red-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .premium-subtitle { color: var(--text-muted); font-size: 14px; font-weight: 500; margin: 12px 0 0; letter-spacing: 0.5px; }

    /* Buttons */
    .btn-primary-elite {
      position: relative; padding: 18px 36px;
      background: var(--red); color: white;
      border: none; border-radius: 20px;
      font-size: 11px; font-weight: 900; letter-spacing: 1.5px;
      cursor: pointer; overflow: hidden;
      transition: all 0.4s;
      box-shadow: 0 8px 24px var(--red-glow);
    }
    .btn-primary-elite:hover { transform: translateY(-3px); box-shadow: 0 12px 32px var(--red-glow); }
    .btn-glow { position: absolute; inset: 0; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent); transform: translateX(-100%); transition: transform 0.6s; }
    .btn-primary-elite:hover .btn-glow { transform: translateX(100%); }

    /* Stats Architecture */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 40px; }
    .stat-card { 
      background: rgba(20, 20, 20, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08); 
      border-radius: 32px; 
      padding: 32px; 
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .stat-card:hover {
      background: rgba(20, 20, 20, 0.6);
      border-color: rgba(217, 43, 43, 0.3);
      transform: translateY(-8px);
    }
    .stat-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 12px; }
    .stat-value { font-size: 40px; font-weight: 950; letter-spacing: -2px; margin-bottom: 8px; }
    .stat-indicator { font-size: 9px; font-weight: 950; color: var(--red-bright); letter-spacing: 1.5px; opacity: 0.6; }

    /* Registry Surface Architecture */
    .registry-surface {
      background: rgba(20, 20, 20, 0.4);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 40px 80px rgba(0,0,0,0.4);
    }

    .surface-header { padding: 24px 32px; border-bottom: 1px solid var(--bdr); background: rgba(0,0,0,0.2); }
    .surface-title { font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 3px; margin: 0; }

    .objection-stack { display: flex; flex-direction: column; }
    .objection-row { display: flex; justify-content: space-between; align-items: center; padding: 32px; border-bottom: 1px solid var(--bdr); transition: all 0.3s; }
    .objection-row:last-child { border-bottom: none; }
    .objection-row:hover { background: rgba(255,255,255,0.02); }

    .meta-line { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .ref-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 900; color: var(--red-bright); background: var(--red-pale); padding: 4px 10px; border-radius: 6px; }
    .divider { width: 4px; height: 4px; border-radius: 50%; background: var(--bdr); }
    .obligation-text { font-size: 10px; font-weight: 900; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }

    .objection-reason { font-size: 18px; font-weight: 950; margin: 0 0 16px; letter-spacing: -0.5px; }

    .info-cluster { display: flex; gap: 32px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 1px; }
    .info-value { font-size: 12px; font-weight: 900; color: #eee; }

    .row-actions-wrap { display: flex; flex-direction: column; align-items: flex-end; gap: 20px; }

    .status-pill-elite { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--bdr); border-radius: 100px; font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 1px; }
    .status-pill-elite.active { background: var(--red-pale); border-color: var(--red-border); color: var(--red-bright); }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .action-buttons { display: flex; gap: 12px; }
    .btn-icon-elite { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 1px solid var(--bdr); border-radius: 12px; color: var(--text-muted); cursor: pointer; transition: all 0.3s; }
    .btn-icon-elite:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.1); }
    .btn-ghost-elite { padding: 0 20px; height: 44px; background: rgba(255,255,255,0.03); border: 1px solid var(--bdr); border-radius: 12px; color: var(--text-muted); font-size: 10px; font-weight: 950; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s; }
    .btn-ghost-elite:hover { background: var(--red-pale); color: var(--red-bright); border-color: var(--red-border); }

    .empty-registry { padding: 80px 0; text-align: center; }
    .empty-icon-wrap { width: 80px; height: 80px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr); border-radius: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--text-muted); }
    .empty-title { font-size: 11px; font-weight: 950; color: #fff; letter-spacing: 4px; margin: 0 0 8px; }
    .empty-text { font-size: 13px; color: var(--text-muted); font-weight: 500; }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .objection-row { flex-direction: column; align-items: flex-start; gap: 32px; }
      .row-actions-wrap { align-items: flex-start; width: 100%; }
      .action-buttons { width: 100%; }
      .btn-ghost-elite { flex-grow: 1; }
    }
  `],
})
export class ObjectionListComponent {
  objections = [
    {
      id: 1,
      refNo: 'OBJ-2026-001',
      obligation: 'VALUE ADDED TAX (VAT)',
      reason: 'Disputed Input Tax Deduction rejection',
      assessmentNo: 'AS-9921-XAO',
      filedDate: '2026-02-20',
      status: 'UNDER REVIEW'
    },
    {
      id: 2,
      refNo: 'OBJ-2025-042',
      obligation: 'INCOME TAX - RESIDENT',
      reason: 'Incorrect calculation of professional fee relief',
      assessmentNo: 'AS-8812-JAI',
      filedDate: '2025-12-15',
      status: 'PENDING DOCUMENTS'
    }
  ];

  stats = [
    { label: 'Total Filed', value: '12' },
    { label: 'Under Review', value: '3' },
    { label: 'Awaiting Action', value: '1' },
    { label: 'Resolved (YTD)', value: '8' }
  ];
}
