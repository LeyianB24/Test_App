import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-up">

      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Revenue <span class="gradient-text">Transmission</span></h1>
          <p class="premium-subtitle">Strategic management of fiscal obligations and payment reconciliation</p>
        </div>
        <div class="header-actions">
           <button class="modern-btn outline-btn sm" (click)="refreshPayments()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 5H15" stroke-width="2.5"/></svg>
              Refresh Synchrony
           </button>
           <button class="modern-btn primary-btn" (click)="generateNewPrn()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" stroke-width="3"/></svg>
              Initialize New PRN
           </button>
        </div>
      </header>

      <!-- Elite Summary Grid -->
      <div class="stats-grid-premium">
        <div class="premium-stat-card animate-up delay-1">
          <div class="stat-icon-wrapper green">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Verified Transmission (YTD)</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ totalPaid() | currency:'KES ':'symbol':'1.0-0' }}</h3>
            </div>
          </div>
        </div>
        <div class="premium-stat-card animate-up delay-2">
          <div class="stat-icon-wrapper red">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Outstanding Liabilities</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ totalPending() | currency:'KES ':'symbol':'1.0-0' }}</h3>
            </div>
          </div>
        </div>
        <div class="premium-stat-card animate-up delay-3">
          <div class="stat-icon-wrapper blue">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Last Transmission</span>
            <div class="stat-value-group">
               <h3 class="stat-number" style="font-size: 1.35rem;">{{ lastPaymentDate() }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Action & Filter Bar -->
      <div class="action-bar-glass mt-32 animate-up delay-2">
        <div class="filter-pills-elite">
           <button class="pill-btn" [class.active]="activeTab === 'pending'" (click)="activeTab = 'pending'">
              Pending Obligations
              <span class="badge">{{ pendingCount() }}</span>
           </button>
           <button class="pill-btn" [class.active]="activeTab === 'history'" (click)="activeTab = 'history'">
              Transaction Archive
           </button>
        </div>
        @if (activeTab === 'history') {
          <div class="search-premium">
             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5"/></svg>
             <input type="text" placeholder="Search by PRN or Type..." class="search-input-elite" [(ngModel)]="searchQuery" (input)="onSearch()">
          </div>
        }
      </div>

      <!-- Main Data Surface -->
      <div class="content-card-premium animate-up delay-3">
        @switch (activeTab) {
          
          <!-- Pending View: Elite List -->
          @case ('pending') {
            <div class="p-32">
              @if (pendingPayments().length === 0) {
                <div class="notif-empty" style="padding: 100px 0;">
                  <div class="empty-icon" style="color: var(--success); opacity: 0.2; font-size: 4rem; border: none; background: none;">✓</div>
                  <p style="font-size: 1.2rem; font-weight: 700;">All fiscal obligations have been successfully synchronized.</p>
                </div>
              }

              <div class="elite-payment-grid">
                @for (item of pendingPayments(); track item.prn) {
                  <div class="elite-payment-item animate-scale">
                    <div class="p-main-box">
                       <div class="p-type-icon">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2"/></svg>
                       </div>
                       <div class="p-headings">
                          <span class="p-title">{{ item.type }}</span>
                          <span class="p-sub">PRN: <strong>{{ item.prn }}</strong> | Genesis: {{ item.date }}</span>
                       </div>
                    </div>
                    <div class="p-financials">
                       <div class="p-amount-elite">{{ item.amount | currency:'KES ':'symbol':'1.0-0' }}</div>
                       <button class="modern-btn primary-btn sm" (click)="payNow(item.id.toString())">
                          Finalize Payment
                       </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- History View: Elite Table -->
          @case ('history') {
            <div>
               <div class="table-responsive-elite">
                  <table class="modern-table-elite">
                    <thead>
                      <tr>
                        <th>Ref Sequence</th>
                        <th>Revenue Head</th>
                        <th>Transmitted Capital</th>
                        <th>Settlement Date</th>
                        <th>Status Protocol</th>
                        <th>Directives</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (p of filteredPayments(); track p.id) {
                        <tr class="table-row-hover">
                          <td><span class="ref-id">#{{ p.id }}</span></td>
                          <td><span class="tax-type-label">{{ p.type }}</span></td>
                          <td><span class="amount-val-elite">{{ p.amount | currency:'KES ':'symbol':'1.0-0' }}</span></td>
                          <td><span class="date-label-elite">{{ p.date }}</span></td>
                          <td>
                            <div class="status-pill-elite" [class]="p.status">
                               <span class="dot"></span>
                               {{ p.status }}
                            </div>
                          </td>
                          <td>
                            <div class="action-group-elite">
                               <button class="icon-btn-elite" (click)="downloadReceipt(p.id.toString())" title="Generate Receipt">
                                 <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2.2"/></svg>
                               </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
               </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .p-32 { padding: 32px; }
    .elite-payment-grid { display: flex; flex-direction: column; gap: 20px; }
    .elite-payment-item {
      padding: 30px; background: #F8FAFC; border-radius: 28px;
      border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;
      transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .elite-payment-item:hover { transform: translateX(10px); border-color: var(--kra-red); background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }

    .p-main-box { display: flex; gap: 24px; align-items: center; }
    .p-type-icon { width: 56px; height: 56px; background: rgba(10, 34, 61, 0.05); color: var(--kra-blue); border-radius: 18px; display: flex; align-items: center; justify-content: center; }
    .p-headings { display: flex; flex-direction: column; gap: 4px; }
    .p-title { font-size: 1.2rem; font-weight: 900; color: var(--text-main); letter-spacing: -0.5px; }
    .p-sub { font-size: 0.85rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .p-sub strong { color: var(--text-main); }

    .p-financials { display: flex; align-items: center; gap: 40px; }
    .p-amount-elite { font-size: 1.8rem; font-weight: 900; color: var(--text-main); letter-spacing: -1px; }

    .ref-id { font-weight: 900; color: var(--text-muted); font-family: 'Courier New', monospace; }
    .tax-type-label { font-weight: 800; color: var(--text-main); }
    .amount-val-elite { font-weight: 900; color: var(--text-main); }
    .date-label-elite { font-weight: 700; color: var(--text-secondary); }

    @media (max-width: 900px) {
       .elite-payment-item { flex-direction: column; align-items: flex-start; gap: 24px; }
       .p-financials { width: 100%; justify-content: space-between; }
    }
  `]
})
export class PaymentsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  
  activeTab: 'pending' | 'history' = 'pending';
  searchQuery = '';

  pendingPayments = this.paymentService.pendingPayments;
  paidPayments = this.paymentService.paidPayments;
  totalPaid = this.paymentService.totalPaid;
  totalPending = this.paymentService.totalPending;
  
  pendingCount = computed(() => this.pendingPayments().length);
  
  filteredPayments = computed(() => {
    if (!this.searchQuery) return this.paidPayments();
    return this.paymentService.searchPayments(this.searchQuery).filter(p => p.status === 'paid');
  });
  
  lastPaymentDate = computed(() => {
    const paid = this.paidPayments();
    return paid.length > 0 ? paid[0].date : 'N/A';
  });

  generateNewPrn() {
    const types = ['Income Tax (Resident)', 'VAT (Monthly)', 'Rental Income', 'Turnover Tax', 'Withholding Tax'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomAmount = Math.floor(5000 + Math.random() * 50000);
    
    this.paymentService.generatePRN(randomType, randomAmount).subscribe({
      next: (newPayment) => {
        alert(`Strategic Acknowledgement: New PRN generated successfully.\nReference: ${newPayment.prn}\nProtocol Amount: KES ${newPayment.amount.toLocaleString()}`);
      },
      error: () => alert('Gateway Timeout: Failed to initialize new protocol.')
    });
  }

  ngOnInit() {
    this.refreshPayments();
  }

  refreshPayments() {
    this.paymentService.refreshPayments().subscribe();
  }
  
  payNow(paymentId: string) {
    const methods = ['M-PESA', 'Direct Bank Seal', 'Equity Trust', 'Co-op Gateway'];
    const randomMethod = methods[Math.floor(Math.random() * methods.length)];
    
    this.paymentService.markAsPaid(parseInt(paymentId), randomMethod).subscribe({
      next: (success) => {
        if (success) alert(`Payment verified successfully via ${randomMethod} Secured Gateway.`);
        else alert('Transaction Aborted: Internal validation check failed.');
      },
      error: () => alert('Connection Interrupted: Final settlement handoff failed.')
    });
  }
  
  downloadReceipt(paymentId: string) {
    const finalUrl = `http://localhost/itax/kra-api/download.php?type=payment&id=${paymentId}&format=pdf`;
    window.open(finalUrl, '_blank');
  }
  
  onSearch() {}
}
