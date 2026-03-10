import { Component, inject, signal, computed, ViewChild, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../services/payment.service';
import { ApiService } from '../../../services/api.service';
import { environment } from '../../../../environments/environment';
import { PaymentFormComponent } from '../../../components/payment-form/payment-form.component';
import { NotificationService } from '../../../core/services/notification.service';
import { SkeletonLoaderComponent } from '../../../components/skeleton-loader/skeleton-loader.component';
import { ToastContainerComponent } from '../../../components/toast-container/toast-container.component';
import { MpesaService } from '../../../services/mpesa.service';

interface Payment {
  id: number;
  taxpayerId: string;
  taxpayerName: string;
  paymentDate: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  paymentMethod: string;
  referenceNumber?: string;
  prn?: string;
  transaction_id?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-payments-enhanced',
  imports: [CommonModule, FormsModule, PaymentFormComponent, SkeletonLoaderComponent, ToastContainerComponent],
  template: `
    <div class="animate-fade-in p-2 md:p-6 lg:p-8">
    
        <!-- Modern Header -->
        <header class="db-header-elite">
          <div class="header-left">
            <div class="live-badge">
              <span class="live-dot"></span>
              TRANSACTION TERMINAL
            </div>
            <h1 class="premium-title">Fiscal <span class="text-red">Telemetry</span></h1>
            <p class="premium-subtitle">Digital Financial Ledger & Secure Processing Engine</p>
          </div>
          <div class="action-stack">
            <button class="btn-ghost-elite" (click)="refreshPayments()" [disabled]="loading()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              {{ loading() ? 'SYNC...' : 'REFRESH' }}
            </button>
            <button class="btn-ghost-elite" (click)="openMpesaQuickPay()">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              M-PESA PAY
            </button>
            <button class="btn-primary-elite" (click)="togglePaymentForm()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 4v16m8-8H4"/></svg>
              {{ showPaymentForm() ? 'CLOSE FORM' : 'NEW PAYMENT' }}
            </button>
          </div>
        </header>

        <!-- Collapsible Payment Form -->
        @if (showPaymentForm()) {
          <div class="elite-card animate-fade-in">
            <div class="card-glow"></div>
            <div class="panel-header-elite">
              <div>
                <h3 class="panel-title">Execution Protocol</h3>
                <p class="panel-desc">Secure financial transaction initialization</p>
              </div>
              <div class="status-badge alert">ENCRYPTION ACTIVE</div>
            </div>
            <app-payment-form #paymentForm></app-payment-form>
          </div>
        }

        <!-- KPI Metrics Grid -->
        <div class="kpi-grid-elite">
          <div class="elite-card kpi-box cursor-pointer" (click)="filterByStatus('pending')">
            <div class="card-glow"></div>
            <div class="kpi-head">
              <span class="kpi-label">OUTSTANDING LIABILITY</span>
              <div class="kpi-icon-wrap">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <div class="kpi-main">
              <span class="kpi-currency">KES</span>
              <span class="kpi-number">{{ totalPending() | number:'1.2-2' }}</span>
            </div>
            <span class="trend-indicator">{{ pendingCount() }} QUEUED TRANSACTIONS</span>
            <div class="mini-trace"><div class="trace-fill" [style.width.%]="45"></div></div>
          </div>

          <div class="elite-card kpi-box cursor-pointer" (click)="filterByStatus('completed')">
            <div class="card-glow"></div>
            <div class="kpi-head">
              <span class="kpi-label">VOLUME PROCESSED</span>
              <div class="kpi-icon-wrap red">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>
            <div class="kpi-main">
              <span class="kpi-currency">KES</span>
              <span class="kpi-number">{{ totalCompleted() | number:'1.2-2' }}</span>
            </div>
            <span class="trend-indicator">{{ completedCount() }} VERIFIED PAYMENTS</span>
            <div class="mini-trace red"><div class="trace-fill" [style.width.%]="85"></div></div>
          </div>

          <div class="elite-card kpi-box">
            <div class="card-glow"></div>
            <div class="kpi-head">
              <span class="kpi-label">TOTAL TELEMETRY</span>
              <div class="kpi-icon-wrap">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
            </div>
            <div class="kpi-main">
              <span class="kpi-number">{{ payments().length }}</span>
            </div>
            <span class="trend-indicator">HISTORICAL DATABASE</span>
            <div class="mini-trace"><div class="trace-fill" [style.width.%]="60"></div></div>
          </div>

          <div class="elite-card kpi-box alert cursor-pointer" (click)="filterByStatus('failed')">
            <div class="card-glow"></div>
            <div class="kpi-head">
              <span class="kpi-label">ANOMALY COUNT</span>
              <div class="kpi-icon-wrap red">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
            </div>
            <div class="kpi-main">
              <span class="kpi-number">{{ failedCount() }}</span>
            </div>
            <span class="trend-indicator red">REQUIRES ATTENTION</span>
            <div class="mini-trace red"><div class="trace-fill" [style.width.%]="100"></div></div>
          </div>
        </div>

        <!-- Ledger Data Controls -->
        <div class="elite-card table-panel">
          <div class="card-glow"></div>
          <div class="panel-header-elite filter-box">
             <div class="filter-stack">
                <div class="filter-group">
                  <button class="filter-btn" [class.active]="statusFilter() === 'all'" (click)="filterByStatus('all')">UNIVERSAL</button>
                  <button class="filter-btn" [class.active]="statusFilter() === 'pending'" (click)="filterByStatus('pending')">PENDING</button>
                  <button class="filter-btn" [class.active]="statusFilter() === 'completed'" (click)="filterByStatus('completed')">VERIFIED</button>
                </div>
                <div class="search-wrap">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input type="text" placeholder="Search references, PINs, or amounts..." (input)="filterPayments($event)">
                </div>
             </div>
             <button class="btn-ghost-elite icon-only" (click)="exportPayments()" title="Export Ledger">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
             </button>
          </div>

          @if (loading()) {
            <div class="p-12 space-y-8">
              <app-skeleton-loader type="table"></app-skeleton-loader>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="elite-table">
                <thead>
                  <tr>
                    <th>TRANS REF</th>
                    <th>TAXPAYER ENTITY</th>
                    <th>FISCAL VALUE</th>
                    <th>CHANNEL</th>
                    <th>TIMESTAMP</th>
                    <th class="text-right">OPERATIONS</th>
                  </tr>
                </thead>
                <tbody>
                  @for (payment of filteredPayments(); track payment.id) {
                    <tr class="animate-stagger">
                      <td>
                        <div class="ref-cell">
                          <span class="ref-id">#{{ payment.id }}</span>
                          <span class="ref-hash">{{ payment.transaction_id || 'LOCAL-SYNC' }}</span>
                        </div>
                      </td>
                      <td><span class="entity-name">{{ payment.taxpayerName }}</span></td>
                      <td><span class="amount-cell">KES {{ payment.amount | number:'1.2-2' }}</span></td>
                      <td><span class="method-tag">{{ payment.paymentMethod }}</span></td>
                      <td><span class="date-cell">{{ payment.paymentDate | date:'medium' }}</span></td>
                      <td class="text-right">
                        <div class="op-stack">
                          <button class="op-btn" (click)="viewPayment(payment)" title="View Details">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          </button>
                          @if (payment.status === 'completed') {
                            <button class="op-btn red" (click)="downloadReceipt(payment)" title="Receipt">
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="empty-cell">
                         <div class="empty-intel">
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                            <h3>Null Telemetry Detected</h3>
                            <p>No financial records matched the current segment filter.</p>
                            <button class="btn-primary-elite mt-4" (click)="togglePaymentForm()">EXECUTE NEW TRANSACTION</button>
                         </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div class="table-pagination-elite">
              <span class="page-intel">SEGMENT {{ currentPage() }} / {{ totalPages() }}</span>
              <div class="page-btns">
                <button class="btn-ghost-elite" [disabled]="currentPage() === 1" (click)="previousPage()">PRESCIND</button>
                <button class="btn-ghost-elite" [disabled]="currentPage() === totalPages()" (click)="nextPage()">ADVANCE</button>
              </div>
            </div>
          }
        </div>
    </div>

    <!-- Payment Details Modal -->
    @if (selectedPayment()) {
      <div class="modal-overlay-elite animate-fade-in" (click)="selectedPayment.set(null)">
        <div class="elite-card modal-box animate-scale-in" (click)="$event.stopPropagation()">
          <div class="card-glow"></div>
          <div class="panel-header-elite">
            <div>
              <h3 class="panel-title">Transaction <span class="text-red">Intel</span></h3>
              <p class="panel-desc">Secure Telemetry Signature Verification</p>
            </div>
            <button class="close-btn" (click)="selectedPayment.set(null)">✕</button>
          </div>

          <div class="modal-body-elite">
            <div class="status-box-elite">
               <div class="sb-left">
                  <span class="sb-label">PROTOCOL STATUS</span>
                  <div class="status-badge" [class.success]="selectedPayment()?.status === 'completed'" [class.alert]="selectedPayment()?.status === 'pending' || selectedPayment()?.status === 'failed'">
                    <span class="live-dot"></span>
                    {{ selectedPayment()?.status | uppercase }}
                  </div>
               </div>
               <div class="sb-right">
                  <span class="sb-label">TIMESTAMP</span>
                  <span class="sb-val">{{ selectedPayment()?.paymentDate | date:'medium' }}</span>
               </div>
            </div>

            <div class="value-matrix-elite">
               <div class="vm-item">
                  <span class="vm-label">FISCAL VALUE</span>
                  <span class="vm-val red">KES {{ selectedPayment()?.amount | number:'1.2-2' }}</span>
               </div>
               <div class="vm-item text-right">
                  <span class="vm-label">PAYMENT CHANNEL</span>
                  <span class="vm-val">{{ selectedPayment()?.paymentMethod | uppercase }}</span>
               </div>
            </div>

            <div class="signature-box">
              <span class="sig-label">SECURE SIGNATURE HASH</span>
              <div class="sig-code">
                <code>{{ selectedPayment()?.transaction_id || selectedPayment()?.id || 'UNASSIGNED-SYNC' }}</code>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </div>
            </div>
          </div>

          <div class="modal-footer-elite">
            <button class="btn-ghost-elite" (click)="selectedPayment.set(null)">DISMISS</button>
            @if (selectedPayment()?.status === 'completed') {
              <button class="btn-primary-elite" (click)="downloadReceipt(selectedPayment()!)">GENERATE RECEIPT</button>
            }
          </div>
        </div>
      </div>
    }

    <app-toast-container #toastContainer></app-toast-container>

    <!-- M-Pesa Quick Pay Modal -->
    @if (showMpesaQuickPay()) {
      <div class="modal-overlay-elite animate-fade-in">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-xl" (click)="closeMpesaQuickPay()"></div>
        <div class="elite-card modal-box mpesa-box animate-scale-in">
          <div class="card-glow"></div>
          <div class="panel-header-elite">
            <div>
              <h3 class="panel-title">M-PESA <span class="text-red">Quick Pay</span></h3>
              <p class="panel-desc">Statutory payment via M-PESA STK Push</p>
            </div>
            <button class="close-btn" (click)="closeMpesaQuickPay()">✕</button>
          </div>

          <div class="modal-body-elite">
            @if (qpProcessing()) {
              <div class="mpesa-processing">
                <div class="loader-ring"></div>
                <p>SYNCING WITH SAFARICOM MOBILE ENGINE...</p>
                <span>Enter your M-PESA PIN when the prompt appears.</span>
              </div>
            } @else if (qpSuccess()) {
              <div class="mpesa-result success">
                <div class="res-icon">✓</div>
                <h3>Transmission Success!</h3>
                <p>Prompt sent to <strong class="text-white">{{ qpPhone() }}</strong></p>
                <div class="txn-ref">REF ID: {{ qpTransactionId() }}</div>
                <button class="btn-primary-elite w-full mt-8" (click)="closeMpesaQuickPay()">ACKNOWLEDGE</button>
              </div>
            } @else if (qpError()) {
              <div class="mpesa-result error">
                <div class="res-icon">✕</div>
                <h3>Payment Aborted</h3>
                <p>{{ qpErrorMessage() }}</p>
                <button class="btn-primary-elite w-full mt-8" (click)="resetQpState()">RETRY PROTOCOL</button>
              </div>
            } @else {
              <div class="mpesa-form-elite">
                <div class="input-group-elite">
                  <label>M-PESA PHONE NUMBER</label>
                  <input type="tel" [(ngModel)]="qpPhoneInput" placeholder="e.g. 0712 345 678">
                </div>
                <div class="input-group-elite text-right">
                  <label>AMOUNT (KES)</label>
                  <input type="number" [(ngModel)]="qpAmountInput" placeholder="5,000" class="text-right">
                </div>
                <div class="input-group-elite">
                  <label>DESCRIPTION (OPTIONAL)</label>
                  <input type="text" [(ngModel)]="qpDescInput" placeholder="Tax payment context">
                </div>
                <div class="form-actions-elite">
                   <button class="btn-ghost-elite" (click)="closeMpesaQuickPay()">CANCEL</button>
                   <button class="btn-primary-elite flex-1" [disabled]="!qpPhoneInput || !qpAmountInput" (click)="submitMpesaQuickPay()">INITIATE PUSH</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
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

    /* Layout & Base */
    .db-root { min-height: 100vh; background: var(--bg-root); color: var(--text-pri); position: relative; overflow-x: hidden; }
    .noise-overlay { position: fixed; inset: 0; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAA6f7sBAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAD1JREFUeNoVjEkOACAIA53/f9qFA9S0mSBYhS6Yp7mXqR8B1Zp6InoSpOqJ6EnUInoStYieRC2iF9GLaE30JPojDPoA9WpU6YIAAAAASUVORK5CYII=') repeat; opacity: 0.03; pointer-events: none; z-index: 1; }
    .accent-bleed { position: fixed; top: -100px; right: -100px; width: 600px; height: 600px; background: radial-gradient(circle, var(--red-pale) 0%, transparent 70%); filter: blur(60px); pointer-events: none; z-index: 2; }
    .db-inner { max-width: 1400px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 40px; position: relative; z-index: 10; }

    /* Header */
    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
    .premium-title { font-size: clamp(32px, 5vw, 42px); font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--red); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); max-width: 500px; }
    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s ease-in-out infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .action-stack { display: flex; gap: 12px; flex-wrap: wrap; }

    /* Cards */
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 24px; position: relative; overflow: hidden; transition: transform 0.3s var(--ease-out), border-color 0.3s; }
    .elite-card:hover { border-color: var(--bdr-md); }
    .card-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at top right, var(--red-pale), transparent 40%); pointer-events: none; opacity: 0.6; }

    .panel-header-elite { padding: 24px 32px; border-bottom: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
    .panel-title { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
    .panel-desc { font-size: 12px; color: var(--text-sec); font-weight: 500; }
    .status-badge { padding: 4px 12px; border-radius: 50px; font-size: 9px; font-weight: 900; letter-spacing: 1px; }
    .status-badge.alert { background: rgba(255, 171, 0, 0.1); color: #FFAB00; border: 1px solid rgba(255, 171, 0, 0.2); }
    .status-badge.success { background: rgba(0, 200, 83, 0.1); color: #00C853; border: 1px solid rgba(0, 200, 83, 0.2); }

    /* KPI Grid */
    .kpi-grid-elite { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .kpi-box { padding: 32px; display: flex; flex-direction: column; gap: 20px; }
    .kpi-head { display: flex; justify-content: space-between; align-items: flex-start; }
    .kpi-label { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: var(--text-sec); text-transform: uppercase; }
    .kpi-icon-wrap { width: 44px; height: 44px; border-radius: 14px; background: var(--bg-card-2); border: 1px solid var(--bdr); display: flex; align-items: center; justify-content: center; color: var(--text-sec); }
    .kpi-icon-wrap.red { background: var(--red-pale); border-color: var(--red-border); color: var(--red); }
    .kpi-main { display: flex; align-items: baseline; gap: 8px; }
    .kpi-number { font-size: 28px; font-weight: 900; letter-spacing: -1px; }
    .kpi-currency { font-size: 14px; font-weight: 700; color: var(--text-sec); }
    .trend-indicator { font-size: 10px; font-weight: 700; color: var(--text-mut); }
    .trend-indicator.red { color: var(--red); }
    .mini-trace { height: 4px; background: var(--bg-card-2); border-radius: 2px; overflow: hidden; }
    .trace-fill { height: 100%; background: var(--text-mut); border-radius: 2px; }
    .mini-trace.red .trace-fill { background: var(--red); }

    /* Table & Filtering */
    .filter-box { background: var(--bg-card-2); }
    .filter-stack { display: flex; gap: 24px; align-items: center; flex: 1; flex-wrap: wrap; }
    .filter-group { display: flex; background: var(--bg-root); padding: 4px; border-radius: 12px; border: 1px solid var(--bdr); }
    .filter-btn { padding: 8px 16px; border-radius: 8px; border: none; background: transparent; color: var(--text-sec); font-size: 10px; font-weight: 800; letter-spacing: 0.5px; cursor: pointer; transition: all 0.2s; }
    .filter-btn.active { background: var(--bg-card); color: var(--text-pri); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
    .search-wrap { position: relative; flex: 1; max-width: 400px; }
    .search-wrap svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-mut); }
    .search-wrap input { width: 100%; background: var(--bg-root); border: 1px solid var(--bdr); border-radius: 12px; padding: 10px 16px 10px 42px; font-size: 13px; color: var(--text-pri); outline: none; transition: border-color 0.2s; }
    .search-wrap input:focus { border-color: var(--red-border); }

    .elite-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .elite-table th { padding: 16px 32px; text-align: left; font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: var(--text-sec); text-transform: uppercase; border-bottom: 1px solid var(--bdr); }
    .elite-table td { padding: 20px 32px; border-bottom: 1px solid var(--bdr); font-size: 14px; vertical-align: middle; }
    .elite-table tr:last-child td { border-bottom: none; }
    .elite-table tr:hover td { background: var(--bg-card-2); }

    .ref-cell { display: flex; flex-direction: column; gap: 2px; }
    .ref-id { font-weight: 800; }
    .ref-hash { font-size: 10px; color: var(--text-sec); font-family: monospace; }
    .entity-name { font-weight: 700; color: var(--text-pri); }
    .amount-cell { font-weight: 900; color: var(--text-pri); }
    .method-tag { font-size: 10px; font-weight: 800; background: var(--bg-card-2); padding: 4px 8px; border-radius: 6px; border: 1px solid var(--bdr); }
    .date-cell { font-size: 12px; color: var(--text-sec); }

    .op-stack { display: flex; gap: 8px; justify-content: flex-end; }
    .op-btn { width: 36px; height: 36px; border-radius: 10px; background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--text-sec); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .op-btn:hover { border-color: var(--bdr-md); color: var(--text-pri); transform: translateY(-1px); }
    .op-btn.red:hover { background: var(--red-pale); color: var(--red); border-color: var(--red-border); }

    .empty-cell { padding: 80px 32px; text-align: center; }
    .empty-intel { display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--text-sec); }
    .empty-intel h3 { font-size: 20px; font-weight: 800; color: var(--text-pri); }

    .table-pagination-elite { padding: 24px 32px; border-top: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: center; }
    .page-intel { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: var(--text-mut); text-transform: uppercase; }
    .page-btns { display: flex; gap: 12px; }

    /* Modals */
    .modal-overlay-elite { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; animation: fadeIn 0.3s var(--ease-out); background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); }
    .modal-box { width: 100%; max-width: 540px; border-radius: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border-color: var(--bdr-md); position: relative; z-index: 1010; }
    .modal-body-elite { padding: 32px; display: flex; flex-direction: column; gap: 32px; }
    .modal-footer-elite { padding: 24px 32px; border-top: 1px solid var(--bdr); display: flex; justify-content: flex-end; gap: 16px; background: var(--bg-card-2); }
    .close-btn { width: 32px; height: 32px; border-radius: 10px; border: none; background: var(--bg-root); color: var(--text-sec); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .close-btn:hover { color: var(--text-pri); background: var(--bdr); }

    .status-box-elite { display: flex; justify-content: space-between; align-items: center; padding: 24px; background: var(--bg-card-2); border-radius: 20px; border: 1px solid var(--bdr); }
    .sb-label { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 1px; margin-bottom: 8px; display: block; }
    .sb-val { font-size: 14px; font-weight: 700; color: var(--text-pri); }

    .value-matrix-elite { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .vm-label { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 1px; margin-bottom: 8px; display: block; }
    .vm-val { font-size: 20px; font-weight: 900; }
    .vm-val.red { color: var(--red); }

    .signature-box { padding-top: 24px; border-top: 1px solid var(--bdr); }
    .sig-label { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 1px; margin-bottom: 12px; display: block; }
    .sig-code { background: var(--bg-root); padding: 16px; border-radius: 14px; border: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: center; }
    .sig-code code { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-sec); word-break: break-all; }

    /* M-Pesa Quick Pay Styles */
    .mpesa-box { max-width: 440px; }
    .mpesa-processing { text-align: center; padding: 40px 0; }
    .loader-ring { width: 48px; height: 48px; border: 3px solid var(--red-pale); border-top-color: var(--red); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 24px; }
    .mpesa-processing p { font-weight: 800; font-size: 13px; letter-spacing: 1px; margin-bottom: 8px; }
    .mpesa-processing span { font-size: 12px; color: var(--text-sec); }

    .mpesa-result { text-align: center; padding: 20px 0; }
    .res-icon { width: 64px; height: 64px; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 24px; }
    .success .res-icon { background: #00C853; box-shadow: 0 0 20px rgba(0, 200, 83, 0.3); }
    .error .res-icon { background: var(--red); box-shadow: 0 0 20px var(--red-glow); }
    .mpesa-result h3 { font-size: 24px; font-weight: 900; margin-bottom: 12px; }
    .mpesa-result p { color: var(--text-sec); margin-bottom: 16px; }
    .txn-ref { font-family: monospace; font-size: 11px; background: var(--bg-root); padding: 8px 16px; border-radius: 8px; display: inline-block; color: var(--text-sec); }

    .mpesa-form-elite { display: flex; flex-direction: column; gap: 24px; }
    .input-group-elite label { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 1.5px; margin-bottom: 10px; display: block; }
    .input-group-elite input { width: 100%; background: var(--bg-root); border: 1px solid var(--bdr); border-radius: 14px; padding: 14px 20px; font-size: 16px; font-family: 'JetBrains Mono', monospace; color: var(--text-pri); outline: none; transition: all 0.2s; }
    .input-group-elite input:focus { border-color: var(--red-border); background: var(--bg-card); box-shadow: 0 0 0 4px var(--red-pale); }
    .form-actions-elite { display: flex; gap: 16px; margin-top: 8px; }

    /* Buttons */
    .btn-primary-elite { background: var(--red); color: #fff; border: none; padding: 16px 28px; border-radius: 14px; font-size: 11px; font-weight: 900; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 16px -4px var(--red-glow); display: flex; align-items: center; justify-content: center; gap: 10px; text-transform: uppercase; }
    .btn-primary-elite:hover:not(:disabled) { background: var(--red-bright); transform: translateY(-2px); box-shadow: 0 12px 24px -6px var(--red-glow); }
    .btn-primary-elite:active { transform: translateY(0); }
    .btn-primary-elite:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

    .btn-ghost-elite { background: var(--bg-card-2); color: var(--text-sec); border: 1px solid var(--bdr); padding: 16px 24px; border-radius: 14px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; text-transform: uppercase; }
    .btn-ghost-elite:hover:not(:disabled) { background: var(--bg-root); color: var(--text-pri); border-color: var(--bdr-md); }
    .btn-ghost-elite.icon-only { width: 48px; height: 48px; padding: 0; }

    /* Animations */
    .animate-fade-in { animation: fadeIn var(--duration-base) var(--ease-out); }
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out); }
    .animate-stagger { animation: staggerIn var(--duration-base) var(--ease-out) both; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes staggerIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Responsive */
    @media (max-width: 768px) {
      .db-inner { padding: 24px 16px; gap: 24px; }
      .db-header-elite { flex-direction: column; align-items: flex-start; }
      .action-stack { width: 100%; }
      .action-stack button { flex: 1; }
      .kpi-grid-elite { grid-template-columns: 1fr; }
      .filter-stack { flex-direction: column; align-items: stretch; }
      .search-wrap { max-width: none; }
      .elite-table th:nth-child(4), .elite-table td:nth-child(4),
      .elite-table th:nth-child(5), .elite-table td:nth-child(5) { display: none; }
      .modal-box { border-radius: 24px; }
      .modal-body-elite { padding: 20px; gap: 20px; }
      .value-matrix-elite { grid-template-columns: 1fr; gap: 16px; }
      .vm-item.text-right { text-align: left; }
    }
  `]
})
export class PaymentsEnhancedComponent implements OnInit {
  @ViewChild('toastContainer') toastContainer!: ToastContainerComponent;

  private paymentService = inject(PaymentService);
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);
  private mpesaService = inject(MpesaService);

  // M-Pesa Quick Pay state
  showMpesaQuickPay = signal(false);
  qpProcessing = signal(false);
  qpSuccess = signal(false);
  qpError = signal(false);
  qpErrorMessage = signal('');
  qpTransactionId = signal('');
  qpPhone = signal('');
  qpPhoneInput = '';
  qpAmountInput: number | null = null;
  qpDescInput = '';


  // State Signals
  payments = signal<Payment[]>([]);
  loading = signal(false);
  showPaymentForm = signal(false);
  selectedPayment = signal<Payment | null>(null);
  statusFilter = signal<'all' | 'pending' | 'completed' | 'failed'>('all');
  searchQuery = signal('');
  sortColumn = signal('paymentDate');
  sortAsc = signal(false);
  currentPage = signal(1);
  itemsPerPageValue = signal('10');

  // Computed Properties
  filteredPayments = computed(() => {
    const status = this.statusFilter();
    const query = this.searchQuery().toLowerCase();
    let filtered = this.payments();

    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status);
    }

    if (query) {
      filtered = filtered.filter(p =>
        p.taxpayerName.toLowerCase().includes(query) ||
        (p.prn && p.prn.toLowerCase().includes(query)) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query)) ||
        p.amount.toString().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const col = this.sortColumn() as keyof Payment;
      const aVal = a[col];
      const bVal = b[col];

      if (!aVal || !bVal) return 0;
      if (aVal === bVal) return 0;
      const cmp = aVal > bVal ? 1 : -1;
      return this.sortAsc() ? cmp : -cmp;
    });

    const itemsPerPage = parseInt(this.itemsPerPageValue());
    const start = (this.currentPage() - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  });

  pendingCount = computed(() => this.payments().filter(p => p.status === 'pending').length);
  completedCount = computed(() => this.payments().filter(p => p.status === 'completed').length);
  failedCount = computed(() => this.payments().filter(p => p.status === 'failed').length);

  totalPending = computed(() =>
    this.payments()
      .filter(p => p.status === 'pending')
      .reduce((sum: number, p) => sum + p.amount, 0)
  );

  totalCompleted = computed(() =>
    this.payments()
      .filter(p => p.status === 'completed')
      .reduce((sum: number, p) => sum + p.amount, 0)
  );

  totalPages = computed(() => {
    const status = this.statusFilter();
    const query = this.searchQuery().toLowerCase();
    
    let filteredCount = this.payments().filter(p => {
      const matchStatus = status === 'all' || p.status === status;
      const matchQuery = !query || 
        p.taxpayerName.toLowerCase().includes(query) ||
        (p.prn && p.prn.toLowerCase().includes(query)) ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(query)) ||
        p.amount.toString().includes(query);
      
      return matchStatus && matchQuery;
    }).length;

    const itemsPerPage = parseInt(this.itemsPerPageValue());
    return Math.ceil(filteredCount / itemsPerPage) || 1;
  });

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading.set(true);
    this.apiService.get<any>('payments_enhanced_api.php?action=list').subscribe({
      next: (response) => {
        if (response.success && response.data?.payments) {
          this.payments.set(response.data.payments);
        } else {
          this.payments.set([]);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loading.set(false);
        this.showError('Failed to load payments');
      }
    });
  }

  refreshPayments(): void {
    this.loadPayments();
    this.showSuccess('Payments synchronized successfully');
  }

  togglePaymentForm(): void {
    this.showPaymentForm.update(v => !v);
  }

  filterByStatus(status: 'all' | 'pending' | 'completed' | 'failed'): void {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  filterPayments(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  sortByColumn(column: string): void {
    if (this.sortColumn() === column) {
      this.sortAsc.update(v => !v);
    } else {
      this.sortColumn.set(column);
      this.sortAsc.set(true);
    }
  }

  viewPayment(payment: Payment): void {
    this.selectedPayment.set(payment);
  }

  downloadReceipt(payment?: Payment): void {
    const currentPayment = payment || this.selectedPayment();
    if (!currentPayment) return;
    const finalUrl = `${environment.apiUrl}/download.php?type=payment&id=${currentPayment.id}&format=pdf`;
    window.open(finalUrl, '_blank');
    this.showSuccess(`Receipt for payment #${currentPayment.id} initiated`);
  }

  exportPayments(): void {
    this.showSuccess('Ledger export protocol initiated');
  }

  openMpesaQuickPay(): void {
    this.qpPhoneInput = '';
    this.qpAmountInput = null;
    this.qpDescInput = '';
    this.resetQpState();
    this.showMpesaQuickPay.set(true);
  }

  closeMpesaQuickPay(): void {
    this.showMpesaQuickPay.set(false);
  }

  resetQpState(): void {
    this.qpProcessing.set(false);
    this.qpSuccess.set(false);
    this.qpError.set(false);
    this.qpErrorMessage.set('');
    this.qpTransactionId.set('');
  }

  async submitMpesaQuickPay(): Promise<void> {
    const phone = this.qpPhoneInput?.trim();
    const amount = this.qpAmountInput;
    if (!phone || !amount) return;

    if (!this.mpesaService.isValidMpesaPhone(phone)) {
      this.qpError.set(true);
      this.qpErrorMessage.set('Invalid M-PESA phone number. Use a Safaricom or Airtel number.');
      return;
    }

    this.qpPhone.set(phone);
    this.qpProcessing.set(true);
    try {
      const ref = this.qpDescInput || 'KRA-QUICK-PAY';
      const result = await this.mpesaService.processPayment(phone, amount, ref);
      if (result.success) {
        this.qpTransactionId.set(result.transactionId ?? '');
        this.qpSuccess.set(true);
        this.showSuccess('M-PESA prompt sent! Enter your PIN to complete payment.');
      } else {
        this.qpError.set(true);
        this.qpErrorMessage.set(result.message);
      }
    } catch (err: unknown) {
      this.qpError.set(true);
      this.qpErrorMessage.set(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      this.qpProcessing.set(false);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  private showSuccess(message: string): void {
    if (this.toastContainer) {
      this.toastContainer.addToast({
        title: 'Protocol Success',
        message,
        type: 'success',
        duration: 5000,
        icon: '✓'
      });
    }
  }

  private showError(message: string): void {
    if (this.toastContainer) {
      this.toastContainer.addToast({
        title: 'Protocol Error',
        message,
        type: 'error',
        duration: 7000,
        dismissible: true,
        icon: '✕'
      });
    }
  }
}
