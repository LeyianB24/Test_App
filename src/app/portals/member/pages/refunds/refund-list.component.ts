import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-refund-list',
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
              <span class="tag-text">Treasury Recovery Protocol</span>
            </div>
            <h1 class="premium-title">Tax <span class="red-gradient">Refunds</span></h1>
            <p class="premium-subtitle">Authorized registry of overpayment claims, statutory credits, and liquidation disbursements</p>
          </div>
          <button routerLink="/member/refunds/apply" class="btn-primary-elite">
            <div class="btn-glow"></div>
            <span class="relative z-10">INITIATE REFUND CLAIM</span>
          </button>
        </header>

        <!-- KPI Metrics -->
        <div class="kpi-grid">
           <div class="elite-card kpi-card">
              <span class="kpi-label">PENDING LIQUIDITY</span>
              <div class="kpi-value text-red">KES 45.8K</div>
              <div class="kpi-sub">PROTOCOL VERIFYING</div>
           </div>
           <div class="elite-card kpi-card">
              <span class="kpi-label">TOTAL DISBURSED (YTD)</span>
              <div class="kpi-value">KES 1.2M</div>
              <div class="kpi-sub">LIQUIDITY STABLE</div>
           </div>
           <div class="elite-card kpi-card">
              <span class="kpi-label">AVG CYCLE TIME</span>
              <div class="kpi-value">18 DAYS</div>
              <div class="kpi-sub">OPTIMIZED ARCHIVE</div>
           </div>
        </div>

        <div class="refund-stack">
          @for (item of refunds; track item.id) {
            <div class="elite-card refund-card group">
               <div class="card-glow"></div>
               <div class="card-content">
                  <div class="content-left">
                     <div class="meta-line">
                        <span class="ref-tag">{{ item.refNo }}</span>
                        <span class="divider"></span>
                        <span class="obligation-text">{{ item.obligation }}</span>
                     </div>
                     <h3 class="period-title">Claim for Period: {{ item.period }}</h3>
                     
                     <div class="amount-display">
                        <div class="val-wrap">
                           <span class="val-label">CLAIM LIQUIDITY</span>
                           <div class="val-amount">
                              <span class="currency">KES</span>
                              {{ item.amount | number:'1.2-2' }}
                           </div>
                        </div>
                        <div class="timing-strip">
                           <div class="t-item">
                              <span class="t-label">APPLICATION</span>
                              <span class="t-value">{{ item.appliedDate | date:'dd MMM yyyy' }}</span>
                           </div>
                           <div class="t-item">
                              <span class="t-label">EST. DISBURSEMENT</span>
                              <span class="t-value highlight">{{ item.expectedDate }}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="content-right">
                     <span class="status-pill-elite" [class.active]="item.status === 'VERIFICATION STAGE'">
                        <span class="dot"></span>
                        {{ item.status }}
                     </span>
                     <p class="status-note">{{ item.statusNote }}</p>
                     <button class="btn-ghost-elite">
                        FULL AUDIT ARCHIVE
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                     </button>
                  </div>
               </div>
            </div>
          } @empty {
            <div class="empty-registry">
               <div class="empty-icon-wrap">
                  <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <h3 class="empty-title">CLAIM REGISTRY SILENT</h3>
               <p class="empty-text">No active or historical refund claims detected in the audit log.</p>
            </div>
          }
        </div>

        <!-- Bank Details Hook -->
        <div class="bank-hook-elite">
           <div class="hook-content">
              <div class="icon-box">
                 <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <div class="hook-text">
                 <h4 class="hook-title">DISBURSEMENT PROTOCOL</h4>
                 <p class="hook-sub">KCB BANK ARCHIVE •••• 8821</p>
              </div>
           </div>
           <button class="btn-ghost-elite">RECONFIGURE ACCOUNT</button>
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
      --bg-card: rgba(18, 18, 20, 0.6);
      --bdr: rgba(255, 255, 255, 0.05);
      --text-muted: #666670;
    }

    .db-root { 
      min-height: 100vh; 
      background: #050505;
      
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

    /* KPI Architecture */
    .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
    .kpi-card { 
      background: rgba(20, 20, 20, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08); 
      border-radius: 32px; 
      padding: 32px; 
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .kpi-card:hover {
      background: rgba(20, 20, 20, 0.6);
      border-color: rgba(217, 43, 43, 0.3);
      transform: translateY(-8px);
    }
    .kpi-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 12px; }
    .kpi-value { font-size: 32px; font-weight: 950; letter-spacing: -2px; margin-bottom: 8px; }
    .kpi-value.text-red { color: var(--red-bright); }
    .kpi-sub { font-size: 9px; font-weight: 950; color: #555; letter-spacing: 1.5px; opacity: 0.6; }

    /* Refund Card Architecture */
    .refund-stack { display: flex; flex-direction: column; gap: 32px; margin-bottom: 64px; }
    .refund-card { 
      padding: 32px; 
      background: rgba(20, 20, 20, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08); 
      border-radius: 32px; 
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative; 
      overflow: hidden; 
      box-shadow: 0 40px 80px rgba(0,0,0,0.4);
    }
    .refund-card:hover { 
      background: rgba(20, 20, 20, 0.6);
      border-color: rgba(217, 43, 43, 0.3); 
      transform: scale(1.01) translateY(-4px); 
    }
    .card-glow { position: absolute; bottom: -50px; right: -50px; width: 200px; height: 200px; background: radial-gradient(circle, var(--red-pale) 0%, transparent 70%); opacity: 0; transition: opacity 0.6s; }
    .refund-card:hover .card-glow { opacity: 1; }

    .card-content { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
    .content-left { flex-grow: 1; }

    .meta-line { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .ref-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 900; color: var(--red-bright); background: var(--red-pale); padding: 4px 10px; border-radius: 6px; }
    .divider { width: 4px; height: 4px; border-radius: 50%; background: var(--bdr); }
    .obligation-text { font-size: 10px; font-weight: 900; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }

    .period-title { font-size: 20px; font-weight: 950; margin: 0 0 24px; letter-spacing: -0.5px; }

    .amount-display { display: flex; gap: 48px; align-items: center; }
    .val-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; display: block; margin-bottom: 4px; }
    .val-amount { font-size: 32px; font-weight: 950; color: var(--red-bright); letter-spacing: -1.5px; display: flex; align-items: baseline; gap: 8px; }
    .currency { font-size: 14px; color: var(--text-muted); }

    .timing-strip { display: flex; gap: 32px; }
    .t-item { display: flex; flex-direction: column; gap: 4px; }
    .t-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 1px; }
    .t-value { font-size: 12px; font-weight: 900; color: #fff; }
    .t-value.highlight { color: #f59e0b; }

    .content-right { display: flex; flex-direction: column; align-items: flex-end; gap: 20px; min-width: 260px; }
    .status-pill-elite { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--bdr); border-radius: 100px; font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 1px; }
    .status-pill-elite.active { background: var(--red-pale); border-color: var(--red-border); color: var(--red-bright); }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .status-note { font-size: 10px; font-weight: 600; color: var(--text-muted); text-align: right; max-width: 220px; margin: 0; line-height: 1.6; }
    .btn-ghost-elite { padding: 12px 24px; background: rgba(255,255,255,0.03); border: 1px solid var(--bdr); border-radius: 12px; color: var(--text-muted); font-size: 10px; font-weight: 950; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
    .btn-ghost-elite:hover { background: var(--red-pale); color: var(--red-bright); border-color: var(--red-border); }

    /* Bank Hook */
    .bank-hook-elite { display: flex; justify-content: space-between; align-items: center; padding: 32px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 32px; }
    .hook-content { display: flex; align-items: center; gap: 24px; }
    .icon-box { width: 56px; height: 56px; border-radius: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--red-border); display: flex; align-items: center; justify-content: center; color: var(--red-bright); }
    .hook-title { font-size: 16px; font-weight: 950; margin: 0; letter-spacing: -0.5px; }
    .hook-sub { font-size: 10px; font-weight: 900; color: var(--text-muted); margin: 4px 0 0; letter-spacing: 2px; }

    .empty-registry { padding: 80px 0; text-align: center; }
    .empty-icon-wrap { width: 80px; height: 80px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr); border-radius: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--text-muted); }
    .empty-title { font-size: 11px; font-weight: 950; color: #fff; letter-spacing: 4px; margin: 0 0 8px; }
    .empty-text { font-size: 13px; color: var(--text-muted); font-weight: 500; }

    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: 1fr; }
      .amount-display { flex-direction: column; align-items: flex-start; gap: 24px; }
      .content-right { align-items: flex-start; min-width: 100%; margin-top: 32px; border-top: 1px solid var(--bdr); padding-top: 24px; }
      .status-note { text-align: left; max-width: 100%; }
      .bank-hook-elite { flex-direction: column; gap: 24px; align-items: flex-start; }
      .btn-ghost-elite { width: 100%; justify-content: center; }
    }
  `],
})
export class RefundListComponent {
  refunds = [
    {
      id: 1,
      refNo: 'REF-88721-P01',
      obligation: 'VALUE ADDED TAX (VAT)',
      period: 'August - October 2025',
      amount: 45800.00,
      appliedDate: '2025-11-15',
      expectedDate: '2026-03-30',
      status: 'VERIFICATION STAGE',
      statusNote: 'Awaiting inspector approval of secondary purchase invoices.'
    },
    {
      id: 2,
      refNo: 'REF-99120-Q12',
      obligation: 'INCOME TAX - RESIDENT',
      period: 'Year 2024',
      amount: 12450.00,
      appliedDate: '2025-06-20',
      expectedDate: 'PAID',
      status: 'DISBURSED',
      statusNote: 'Statutory liquidation to linked bank archive confirmed on 2025-08-12.'
    }
  ];
}
