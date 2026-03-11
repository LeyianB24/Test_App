import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';
import { environment } from '../../../../environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debt',
  imports: [CommonModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- Elite Header -->
        <header class="db-header-elite animate-fade-in">
          <div class="header-left">
            <div class="live-badge">
              <div class="live-dot"></div>
              FISCAL STANDING
            </div>
            <h1 class="premium-title">Liability <span class="text-red">Archive</span></h1>
            <p class="premium-subtitle">Authorized record of outstanding statutory obligations and settlement status</p>
          </div>
          
          <div class="header-right">
            <button class="btn-primary-elite" (click)="downloadStatement()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              FISCAL STATEMENT
            </button>
          </div>
        </header>

        <!-- Critical Attention Alert -->
        @if (totalDebt() > 0) {
          <div class="alert-box-elite animate-fade-in" style="animation-delay: 0.1s">
            <div class="alert-shimmer"></div>
            <div class="alert-inner">
              <div class="alert-icon-wrap">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div class="alert-content">
                <h3 class="alert-title">ACTION REQUIRED: OUTSTANDING BALANCE</h3>
                <p class="alert-desc">A net settlement of <span class="text-glow">{{ totalDebt() | currency:'KES ':'symbol':'1.0-0' }}</span> is required to maintain compliance status.</p>
              </div>
              <button class="btn-primary-elite" (click)="payNow()">SETTLE NOW</button>
            </div>
          </div>
        }

        <!-- HD Metrics Grid -->
        <div class="main-grid animate-fade-in" style="animation-delay: 0.2s">
          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">TOTAL OUTSTANDING</span>
              <div class="metric-value text-red">{{ totalDebt() | currency:'KES ':'symbol':'1.0-0' }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon" [class.text-red]="totalDebt() > 0" [class.text-green]="totalDebt() === 0">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">ACCOUNT STATUS</span>
              <div class="metric-value" [class.text-red]="totalDebt() > 0" [class.text-green]="totalDebt() === 0">
                {{ totalDebt() > 0 ? 'ACTION REQUIRED' : 'ALL CLEAR' }}
              </div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4M7.835 4.697a.75.75 0 00-1.282.645A12.01 12.01 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016a.75.75 0 00-1.094-.571 12.002 12.002 0 01-8.69 0z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">COMPLIANCE RATING</span>
              <div class="metric-value">{{ complianceScore() }}% <span class="unit-text">VERIFIED</span></div>
            </div>
          </div>
        </div>

        <!-- Ledger Breakdown -->
        <div class="elite-card table-panel animate-fade-in" style="animation-delay: 0.3s">
          <div class="card-glow"></div>
          <div class="panel-header-elite">
            <div class="header-left-stack">
              <h2 class="panel-title">Liability <span class="text-red">Registry</span></h2>
              <p class="panel-desc">Granular decomposition of outstanding tax heads</p>
            </div>
            <div class="action-stack-elite">
              <button class="icon-btn-elite active"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
              <button class="icon-btn-elite" (click)="downloadStatement()"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
            </div>
          </div>

          <div class="registry-list">
            @for (debt of debts(); track debt.id) {
              <div class="registry-item animate-fade-in">
                <div class="ri-left">
                  <div class="ri-type">{{ debt.taxHead }}</div>
                  <div class="ri-period">{{ debt.period }}</div>
                </div>
                <div class="ri-center-grid">
                  <div class="ri-stat">
                    <span class="ri-stat-label">PRINCIPAL</span>
                    <span class="ri-stat-val text-pri">KES {{ debt.principal | number:'1.0-0' }}</span>
                  </div>
                  <div class="ri-stat">
                    <span class="ri-stat-label">INTEREST</span>
                    <span class="ri-stat-val text-blue">KES {{ debt.interest | number:'1.0-0' }}</span>
                  </div>
                  <div class="ri-stat">
                    <span class="ri-stat-label">PENALTY</span>
                    <span class="ri-stat-val text-red">KES {{ debt.penalty | number:'1.0-0' }}</span>
                  </div>
                </div>
                <div class="ri-right-stack">
                  <div class="ri-total-label">TOTAL BALANCE</div>
                  <div class="ri-total-val text-red">KES {{ (debt.principal + debt.interest + debt.penalty) | number:'1.0-0' }}</div>
                  <button class="btn-primary-elite btn-table-action" (click)="payItem(debt)">PAY</button>
                </div>
              </div>
            } @empty {
              <div class="empty-state-elite">
                <div class="empty-icon text-green">✓</div>
                <p>Registry Clear. No pending liabilities detected.</p>
              </div>
            }
          </div>
        </div>
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
      
      --text-pri:     #F0F0F0;
      --text-sec:     #888888;
      --text-mut:     #4A4A4A;

      --bdr:          rgba(255, 255, 255, 0.08);
      --bdr-md:       rgba(255, 255, 255, 0.14);

      --duration-base: 0.4s;
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    .db-root { 
      min-height: 100vh; 
      background: #050505 ;
      background-size: cover;
      color: var(--text-pri); 
      position: relative; 
      overflow-x: hidden; 
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

    .noise-overlay { position: fixed; inset: 0; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAA6f7sBAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAD1JREFUeNoVjEkOACAIA53/f9qFA9S0mSBYhS6Yp7mXqR8B1Zp6InoSpOqJ6EnUInoStYieRC2iF9GLaE30JPojDPoA9WpU6YIAAAAASUVORK5CYII=') repeat; opacity: 0.02; pointer-events: none; z-index: 2; }
    
    .db-inner { 
      max-width: 1400px; 
      margin: 0 auto; 
      padding: 40px 28px 80px; 
      position: relative; 
      z-index: 10; 
      display: flex; 
      flex-direction: column; 
      gap: 40px; 
    }

    /* Header */
    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
    .premium-title { font-size: clamp(32px, 5vw, 48px); font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--red); }
    .text-green { color: #00C853; }
    .text-blue { color: #2196F3; }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); max-width: 500px; }
    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s infinite; }

    /* Alert Box */
    .alert-box_elite { background: var(--bg-card); border: 1.5px solid var(--red-border); border-radius: 24px; position: relative; overflow: hidden; }
    .alert-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, var(--red-pale), transparent); background-size: 200% 100%; animation: shimmer 3s infinite; pointer-events: none; }
    @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }

    .alert-inner { padding: 32px; display: flex; align-items: center; gap: 24px; position: relative; z-index: 2; }
    .alert-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: var(--red-pale); color: var(--red-bright); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px var(--red-glow); }
    .alert-content { flex: 1; }
    .alert-title { font-size: 11px; font-weight: 900; letter-spacing: 2px; color: var(--red-bright); margin-bottom: 6px; }
    .alert-desc { font-size: 16px; font-weight: 700; color: var(--text-pri); }
    .text-glow { color: var(--red-bright); text-shadow: 0 0 10px var(--red-glow); }

    /* Cards & Grid */
    .main-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .elite-card { 
      background: rgba(20, 20, 20, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--bdr); 
      border-radius: 32px; 
      position: relative; 
      overflow: hidden; 
    }
    .card-glow { 
      position: absolute; 
      top: 0; 
      left: 0; 
      width: 100%; 
      height: 100%; 
      background: radial-gradient(circle at top right, var(--red-pale), transparent 40%); 
      pointer-events: none; 
      opacity: 0.4; 
    }

    .metric-card { padding: 32px; display: flex; align-items: center; gap: 24px; transition: transform 0.3s; }
    .metric-card:hover { transform: translateY(-4px); }
    .card-icon { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--text-sec); }
    .metric-label { font-size: 10px; font-weight: 800; color: var(--text-sec); letter-spacing: 1.5px; }
    .metric-value { font-size: 28px; font-weight: 950; color: var(--text-pri); }
    .unit-text { font-size: 9px; font-weight: 800; color: var(--text-mut); margin-left: 6px; letter-spacing: 1px; }

    /* Registry Panel */
    .table-panel { padding: 0; }
    .panel-header-elite { padding: 32px; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; border-bottom: 1px solid var(--bdr); }
    .panel-title { font-size: 20px; font-weight: 900; margin: 0; }
    .panel-desc { font-size: 12px; color: var(--text-sec); margin-top: 4px; }
    
    .action-stack-elite { display: flex; align-items: center; gap: 12px; }
    .icon-btn-elite { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--text-sec); cursor: pointer; transition: all 0.2s; }
    .icon-btn-elite:hover { background: var(--red); color: #fff; border-color: var(--red); }
    .icon-btn-elite.active { background: var(--red-pale); color: var(--red-bright); border-color: var(--red-border); }

    .registry-list { display: flex; flex-direction: column; }
    .registry-item { display: grid; grid-template-columns: 2fr 3fr 2fr; align-items: center; padding: 24px 32px; border-bottom: 1px solid var(--bdr); transition: all 0.2s; border-left: 4px solid var(--red); }
    .registry-item:hover { background: var(--bg-card-2); transform: translateX(8px); }

    .ri-type { font-size: 16px; font-weight: 900; color: var(--text-pri); }
    .ri-period { font-size: 12px; color: var(--text-sec); font-weight: 600; margin-top: 2px; }

    .ri-center-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .ri-stat { display: flex; flex-direction: column; gap: 4px; }
    .ri-stat-label { font-size: 9px; font-weight: 800; color: var(--text-mut); letter-spacing: 1px; }
    .ri-stat-val { font-size: 14px; font-weight: 700; }

    .ri-right-stack { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .ri-total-label { font-size: 9px; font-weight: 800; color: var(--text-mut); letter-spacing: 1px; }
    .ri-total-val { font-size: 18px; font-weight: 950; margin-bottom: 8px; }
    
    .btn-table-action { padding: 8px 20px; font-size: 9px; border-radius: 10px; height: auto; }

    .empty-state-elite { padding: 60px 0; text-align: center; color: var(--text-mut); }
    .empty-icon { font-size: 40px; margin-bottom: 16px; }

    /* Buttons */
    .btn-primary-elite { background: var(--red); color: #fff; border: none; padding: 16px 28px; border-radius: 14px; font-size: 11px; font-weight: 900; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 16px -4px var(--red-glow); display: flex; align-items: center; justify-content: center; gap: 10px; text-transform: uppercase; }
    .btn-primary-elite:hover:not(:disabled) { background: var(--red-bright); transform: translateY(-2px); box-shadow: 0 12px 24px -6px var(--red-glow); }
    .btn-primary-elite:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Utilities & Animations */
    .animate-fade-in { animation: fadeIn var(--duration-base) var(--ease-out) both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .mt-32 { margin-top: 32px; }

    @media (max-width: 1100px) {
      .registry-item { grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px; }
      .ri-center-grid { grid-column: span 2; }
      .ri-right-stack { grid-column: span 2; flex-direction: row; justify-content: space-between; align-items: center; }
    }

    @media (max-width: 640px) {
      .alert-inner { flex-direction: column; text-align: center; }
      .ri-center-grid { grid-template-columns: 1fr; gap: 12px; }
      .ri-right-stack { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class DebtComponent {
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  debts = signal<any[]>([]);
  complianceScore = signal<number>(0);

  totalDebt = computed(() => {
    return this.debts().reduce((sum: number, d: any) => sum + d.principal + d.interest + d.penalty, 0);
  });

  ngOnInit() {
    this.paymentService.getLiabilities().subscribe(data => {
      this.debts.set(data);
    });

    this.paymentService.getObligationStats().subscribe((stats: any) => {
      if (stats) {
        this.complianceScore.set(stats.complianceScore || 0);
      }
    });

  }


  downloadStatement() {
    const url = `${environment.apiUrl}/download.php?type=status_report&id=1&format=pdf`;
    window.open(url, '_blank');
  }

  payNow() {
    this.router.navigate(['/payments']);
  }

  payItem(debt: any) {
    this.router.navigate(['/payments']);
  }
}
