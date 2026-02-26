import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-debt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-up">
      
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Liability <span class="gradient-text">Portfolio</span></h1>
          <p class="premium-subtitle">Strategic overview and liquidation of outstanding fiscal obligations</p>
        </div>
        <div class="header-actions">
           <button class="modern-btn outline-btn sm" (click)="downloadStatement()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke-width="2.5"/></svg>
              Tax Ledger Extract
           </button>
        </div>
      </header>

      <!-- Critical Intelligence Alert -->
      <div class="elite-debt-alert animate-scale" *ngIf="totalDebt() > 0">
         <div class="alert-shimmer"></div>
         <div class="alert-inner-elite">
            <div class="alert-icon-luxury">
               <svg class="ripple-glow" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="3"/></svg>
            </div>
            <div class="alert-message-elite">
               <h3 class="alert-title-luxury">Compliance Protocol Breach</h3>
               <p class="alert-desc-luxury">Strategic settling of <strong>{{ totalDebt() | currency:'KES ':'symbol':'1.0-0' }}</strong> is required to restore full sovereign compliance status.</p>
            </div>
            <button class="modern-btn primary-btn elite-glow" (click)="payNow()">Liquidation Portal</button>
         </div>
      </div>

      <!-- Elite Metrics Grid -->
      <div class="stats-grid-premium mt-32">
        <div class="premium-stat-card animate-up delay-1">
          <div class="stat-icon-wrapper red">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Outstanding Balance</span>
            <div class="stat-value-group">
               <h3 class="stat-number text-danger">{{ totalDebt() | currency:'KES ':'symbol':'1.0-0' }}</h3>
            </div>
          </div>
        </div>

        <div class="premium-stat-card animate-up delay-2">
          <div class="stat-icon-wrapper" [class.red]="totalDebt() > 0" [class.green]="totalDebt() === 0">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Integrity Status</span>
            <div class="stat-value-group">
               <h3 class="stat-number" [class.text-danger]="totalDebt() > 0" [class.text-success]="totalDebt() === 0">
                 {{ totalDebt() > 0 ? 'Protocol Offline' : 'Verified Secure' }}
               </h3>
            </div>
          </div>
        </div>

        <div class="premium-stat-card animate-up delay-3">
          <div class="stat-icon-wrapper blue">
             <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4M7.835 4.697a.75.75 0 00-1.282.645A12.01 12.01 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016a.75.75 0 00-1.094-.571 12.002 12.002 0 01-8.69 0z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Compliance Integrity Score</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ complianceScore() }}% <span class="unit-text">VERIFIED</span></h3>
            </div>
          </div>
        </div>
      </div>


      <!-- Main Ledger Decomposition -->
      <div class="content-card-premium mt-32 animate-up delay-2">
         <div class="card-p-header">
            <div class="p-title-group">
               <h3 class="card-p-title">Sovereign Liability Decomposition</h3>
               <p class="card-p-subtitle">Systematic audit of principal, retroactive interest and statutory penalties</p>
            </div>
            <div class="p-actions">
               <button class="icon-btn-elite active"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2.5"/></svg></button>
               <button class="icon-btn-elite"><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2.2"/></svg></button>
            </div>
         </div>

         <div class="table-responsive-elite">
            <table class="modern-table-elite">
              <thead>
                <tr>
                  <th>Revenue Head</th>
                  <th>Fiscal Period</th>
                  <th>Core Principal</th>
                  <th>Accrued Interest</th>
                  <th>Statutory Penalty</th>
                  <th>Consolidated Balance</th>
                  <th class="text-center">Protocol</th>
                </tr>
              </thead>
              <tbody>
                @for (debt of debts(); track debt.id) {
                  <tr class="table-row-hover">
                    <td><span class="tax-head-elite">{{ debt.taxHead }}</span></td>
                    <td><span class="period-pill">{{ debt.period }}</span></td>
                    <td><span class="amount-val-elite">KES {{ debt.principal | number:'1.0-0' }}</span></td>
                    <td><span class="interest-val-elite">KES {{ debt.interest | number:'1.0-0' }}</span></td>
                    <td><span class="penalty-val-elite">KES {{ debt.penalty | number:'1.0-0' }}</span></td>
                    <td>
                      <span class="total-bal-elite">KES {{ (debt.principal + debt.interest + debt.penalty) | number:'1.0-0' }}</span>
                    </td>
                    <td class="text-center">
                      <button class="modern-btn primary-btn sm" (click)="payItem(debt)">
                         Liquidate
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7" class="empty-placeholder">
                       <div class="empty-state-luxury">
                          <div class="e-icon">✓</div>
                          <p>Registry Purged. No pending liabilities detected.</p>
                       </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .elite-debt-alert {
      background: #FEE2E2; border-radius: 32px; padding: 1px;
      position: relative; overflow: hidden; margin-bottom: 32px;
      border: 1.5px solid #FCA5A5; box-shadow: 0 20px 40px rgba(220, 38, 38, 0.08);
    }
    .alert-shimmer { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: alertShimmer 4s infinite linear; }
    @keyframes alertShimmer { 0% { left: -100%; } 100% { left: 200%; } }

    .alert-inner-elite { padding: 24px 32px; position: relative; z-index: 2; display: flex; align-items: center; gap: 24px; }
    .alert-icon-luxury { width: 56px; height: 56px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #DC2626; box-shadow: 0 10px 20px rgba(220, 38, 38, 0.1); flex-shrink: 0; }
    .ripple-glow { animation: rippleScale 2s infinite; }
    @keyframes rippleScale { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }

    .alert-message-elite { flex: 1; }
    .alert-title-luxury { font-size: 1.25rem; font-weight: 900; color: #991B1B; margin: 0; letter-spacing: -0.5px; }
    .alert-desc-luxury { font-size: 0.95rem; color: #B91C1C; font-weight: 700; margin-top: 2px; }
    .alert-desc-luxury strong { color: #7F1D1D; font-weight: 900; }

    .tax-head-elite { font-weight: 900; color: var(--text-main); font-size: 0.95rem; }
    .amount-val-elite { font-weight: 700; color: var(--text-secondary); }
    .interest-val-elite { font-weight: 800; color: var(--kra-blue); }
    .penalty-val-elite { font-weight: 800; color: var(--kra-red); }
    .total-bal-elite { font-weight: 900; color: #1a202c; font-size: 1.1rem; letter-spacing: -0.5px; }

    .unit-text { font-size: 0.65rem; font-weight: 900; vertical-align: middle; margin-left: 6px; color: var(--text-muted); }

    @media (max-width: 991px) {
       .alert-inner-elite { flex-direction: column; text-align: center; }
       .alert-inner-elite button { width: 100%; }
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
    alert('Generating Sovereign Ledger Statement (PDF)...');
  }

  payNow() {
    this.router.navigate(['/payments']);
  }

  payItem(debt: any) {
    this.router.navigate(['/payments']);
  }
}
