import { Component, inject, signal, computed, ViewChild, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
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
  imports: [CommonModule, FormsModule, PaymentFormComponent, SkeletonLoaderComponent, ToastContainerComponent, UpperCasePipe],
  template: `
    <div class="db-root animate-fade-in">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- Modern Header -->
        <header class="db-header-elite">
          <div class="header-left">
            <div class="live-badge">
              <span class="live-dot"></span>
              TRANSACTION TERMINAL SECURE
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
          <div class="elite-card animate-fade-in mb-8">
            <div class="card-glow"></div>
            <div class="panel-header-elite">
              <div>
                <h3 class="panel-title">Execution Protocol</h3>
                <p class="panel-desc">Secure financial transaction initialization</p>
              </div>
              <div class="status-badge alert">ENCRYPTION ACTIVE</div>
            </div>
            <div class="p-8">
               <app-payment-form #paymentForm></app-payment-form>
            </div>
          </div>
        }

        <!-- KPI Metrics Grid -->
        <div class="dashboard-grid-elite-4">
          <div class="elite-card kpi-box cursor-pointer" (click)="filterByStatus('pending')">
            <div class="card-glow"></div>
            <div class="kpi-head">
              <span class="meta-label">OUTSTANDING LIABILITY</span>
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
              <span class="meta-label">VOLUME PROCESSED</span>
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
              <span class="meta-label">TOTAL TELEMETRY</span>
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
              <span class="meta-label">ANOMALY COUNT</span>
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
        <div class="elite-card registry-list">
          <div class="card-glow"></div>
          <div class="registry-toolbar">
              <div class="filter-group">
                <button class="filter-btn" [class.active]="statusFilter() === 'all'" (click)="filterByStatus('all')">UNIVERSAL</button>
                <button class="filter-btn" [class.active]="statusFilter() === 'pending'" (click)="filterByStatus('pending')">PENDING</button>
                <button class="filter-btn" [class.active]="statusFilter() === 'completed'" (click)="filterByStatus('completed')">VERIFIED</button>
              </div>
              <div class="search-wrap">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" placeholder="Search references, PINs, or amounts..." (input)="filterPayments($event)" class="elite-input-sm">
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
                      <td><span class="method-tag">{{ payment.paymentMethod | uppercase }}</span></td>
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

            <div class="registry-footer">
              <span class="page-intel">SEGMENT {{ currentPage() }} / {{ totalPages() }}</span>
              <div class="page-btns">
                <button class="btn-ghost-elite" [disabled]="currentPage() === 1" (click)="previousPage()">PRESCIND</button>
                <button class="btn-ghost-elite" [disabled]="currentPage() === totalPages()" (click)="nextPage()">ADVANCE</button>
              </div>
            </div>
          }
        </div>
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
                  <label class="meta-label">M-PESA PHONE NUMBER</label>
                  <input type="tel" [(ngModel)]="qpPhoneInput" placeholder="e.g. 0712 345 678" class="elite-input-sm">
                </div>
                <div class="input-group-elite text-right">
                  <label class="meta-label">AMOUNT (KES)</label>
                  <input type="number" [(ngModel)]="qpAmountInput" placeholder="5,000" class="elite-input-sm text-right">
                </div>
                <div class="input-group-elite">
                  <label class="meta-label">DESCRIPTION (OPTIONAL)</label>
                  <input type="text" [(ngModel)]="qpDescInput" placeholder="Tax payment context" class="elite-input-sm">
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

      --bg-root:  #080808;
      --bg-card:  #111111;
      --bg-input: #151515;
      
      --text-pri: #F5F5F7;
      --text-sec: #A1A1AA;
      --text-mut: #52525B;
      
      --bdr:      rgba(255, 255, 255, 0.05);
      --bdr-hr:   rgba(255, 255, 255, 0.08);
      
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    /* ═══════════════════════════════
       Layout & Background
       ═══════════════════════════════ */
    .db-root { 
      min-height: 100vh; 
      background: #050505 url('assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      color: var(--text-pri); 
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
    .db-header-elite { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
    }
    .premium-title { 
      font-size: 56px; 
      font-weight: 950; 
      letter-spacing: -2.5px; 
      line-height: 0.9; 
      margin: 16px 0 12px; 
      text-transform: uppercase;
    }
    .text-red { 
      color: var(--red-bright); 
      -webkit-text-stroke: 1px var(--red-bright);
      text-shadow: 0 0 20px var(--red-glow);
    }
    .premium-subtitle { 
      font-size: 11px; 
      font-weight: 900; 
      color: var(--text-sec); 
      text-transform: uppercase;
      letter-spacing: 3px;
    }

    .live-badge { display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 100px; font-size: 10px; font-weight: 950; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; background: var(--red-bright); border-radius: 50%; box-shadow: 0 0 12px var(--red); animation: pulse-red 2s infinite; }
    @keyframes pulse-red { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 18px var(--red); } 100% { transform: scale(0.95); opacity: 0.8; } }

    /* ═══════════════════════════════
       Premium Card Architecture
       ═══════════════════════════════ */
    .elite-card { 
      background: rgba(20, 20, 20, 0.4); 
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08); 
      border-radius: 32px; 
      position: relative; 
      overflow: hidden; 
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); 
    }
    .elite-card:hover { 
      background: rgba(20, 20, 20, 0.6);
      border-color: rgba(217, 43, 43, 0.3); 
      transform: translateY(-5px) scale(1.01); 
      box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 20px rgba(217, 43, 43, 0.1); 
    }
    .card-glow { position: absolute; inset: 0; background: radial-gradient(circle at top left, var(--red-pale), transparent 70%); opacity: 0.3; pointer-events: none; }

    /* ═══════════════════════════════
       KPI Performance Grid
       ═══════════════════════════════ */
    .dashboard-grid-elite-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; }
    .kpi-box { padding: 32px; display: flex; flex-direction: column; gap: 24px; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    .kpi-box:hover { transform: translateY(-5px); border-color: var(--red-border); background: var(--bg-input); }
    
    .kpi-head { display: flex; justify-content: space-between; align-items: flex-start; }
    .meta-label { font-size: 10px; font-weight: 950; color: var(--text-mut); letter-spacing: 2px; text-transform: uppercase; }
    
    .kpi-icon-wrap { width: 48px; height: 48px; border-radius: 16px; background: var(--bg-input); border: 1px solid var(--bdr-hr); display: flex; align-items: center; justify-content: center; color: var(--text-sec); transition: all 0.3s ease; }
    .kpi-icon-wrap.red { border-color: var(--red-border); color: var(--red-bright); background: var(--red-pale); }
    
    .kpi-main { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
    .kpi-number { font-size: 32px; font-weight: 900; letter-spacing: -1.5px; color: var(--text-pri); }
    .kpi-currency { font-size: 14px; font-weight: 700; color: var(--text-mut); }
    
    .trend-indicator { font-size: 11px; font-weight: 800; color: var(--text-mut); letter-spacing: 0.5px; }
    .trend-indicator.red { color: var(--red-bright); }
    
    .mini-trace { height: 5px; background: var(--bg-input); border-radius: 100px; overflow: hidden; margin-top: 12px; }
    .trace-fill { height: 100%; background: var(--text-mut); border-radius: 100px; transition: width 1s ease-out; }
    .mini-trace.red .trace-fill { background: var(--red-bright); box-shadow: 0 0 10px var(--red-glow); }

    /* ═══════════════════════════════
       Registry Ledger Architecture
       ═══════════════════════════════ */
    .registry-toolbar { padding: 32px; border-bottom: 1px solid var(--bdr-hr); display: flex; justify-content: space-between; align-items: center; gap: 32px; }
    .filter-group { display: flex; background: var(--bg-input); padding: 6px; border-radius: 16px; border: 1px solid var(--bdr-hr); }
    .filter-btn { padding: 10px 20px; border-radius: 12px; border: none; background: transparent; color: var(--text-sec); font-size: 10px; font-weight: 950; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .filter-btn.active { background: var(--bg-card); color: var(--red-bright); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4); border: 1px solid var(--red-border); }

    .search-wrap { position: relative; flex: 1; max-width: 480px; }
    .search-wrap svg { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--text-mut); }
    .elite-input-sm { width: 100%; background: var(--bg-input); border: 1.5px solid var(--bdr-hr); border-radius: 16px; padding: 14px 20px 14px 52px; font-size: 14px; color: var(--text-pri); outline: none; transition: all 0.3s; }
    .elite-input-sm:focus { border-color: var(--red-border); background: var(--bg-card); box-shadow: 0 0 20px var(--red-pale); }

    .elite-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .elite-table th { padding: 20px 32px; text-align: left; font-size: 10px; font-weight: 950; letter-spacing: 2px; color: var(--text-mut); text-transform: uppercase; border-bottom: 1px solid var(--bdr-hr); background: rgba(255, 255, 255, 0.02); }
    .elite-table td { padding: 24px 32px; border-bottom: 1px solid var(--bdr-hr); font-size: 14px; vertical-align: middle; color: var(--text-pri); }
    .elite-table tr:hover td { background: var(--bg-input); }

    .ref-cell { display: flex; flex-direction: column; gap: 4px; }
    .ref-id { font-weight: 900; color: var(--text-pri); }
    .ref-hash { font-size: 11px; color: var(--text-mut); font-family: 'JetBrains Mono', monospace; letter-spacing: -0.5px; }
    .entity-name { font-weight: 800; color: var(--text-pri); font-size: 15px; }
    .amount-cell { font-weight: 950; color: var(--text-pri); font-size: 16px; }
    .method-tag { font-size: 10px; font-weight: 950; background: var(--bg-input); padding: 6px 12px; border-radius: 8px; border: 1px solid var(--bdr-hr); letter-spacing: 1px; color: var(--text-sec); }
    .date-cell { font-size: 12px; color: var(--text-mut); font-weight: 600; }

    .op-stack { display: flex; gap: 12px; justify-content: flex-end; }
    .op-btn { width: 44px; height: 44px; border-radius: 14px; background: var(--bg-input); border: 1px solid var(--bdr-hr); color: var(--text-sec); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .op-btn:hover { border-color: var(--text-sec); color: var(--text-pri); transform: translateY(-3px); background: var(--bg-card); }
    .op-btn.red:hover { background: var(--red-pale); color: var(--red-bright); border-color: var(--red-border); box-shadow: 0 0 15px var(--red-pale); }

    .registry-footer { padding: 32px; border-top: 1px solid var(--bdr-hr); display: flex; justify-content: space-between; align-items: center; }
    .page-intel { font-size: 11px; font-weight: 950; letter-spacing: 2px; color: var(--text-mut); text-transform: uppercase; }

    /* ═══════════════════════════════
       Premium Modal Flow
       ═══════════════════════════════ */
    .modal-overlay-elite { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 24px; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(20px); }
    .modal-box { width: 100%; max-width: 560px; border-radius: 36px; border-color: var(--bdr-hr); box-shadow: 0 50px 100px rgba(0, 0, 0, 0.6); background: var(--bg-card); overflow: hidden; position: relative; }
    
    .panel-header-elite { padding: 32px; border-bottom: 1px solid var(--bdr-hr); display: flex; justify-content: space-between; align-items: center; }
    .panel-title { font-size: 11px; font-weight: 950; color: var(--text-sec); letter-spacing: 2px; text-transform: uppercase; }
    .panel-desc { font-size: 13px; font-weight: 700; color: var(--text-mut); margin-top: 4px; }

    .status-badge { display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 100px; font-size: 10px; font-weight: 950; color: var(--red-bright); letter-spacing: 1px; }

    .modal-body-elite { padding: 40px; display: flex; flex-direction: column; gap: 32px; }
    .status-box-elite { display: flex; justify-content: space-between; align-items: center; padding: 24px; background: var(--bg-input); border-radius: 20px; border: 1px solid var(--bdr-hr); }
    
    .value-matrix-elite { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .vm-item { display: flex; flex-direction: column; gap: 8px; }
    .vm-val { font-size: 24px; font-weight: 950; color: var(--text-pri); letter-spacing: -0.5px; }
    .vm-val.red { color: var(--red-bright); text-shadow: 0 0 15px var(--red-glow); }

    .signature-box { padding-top: 32px; border-top: 1px solid var(--bdr-hr); }
    .sig-label { font-size: 10px; font-weight: 950; color: var(--text-mut); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; display: block; }
    .sig-code { background: var(--bg-input); padding: 20px; border-radius: 16px; border: 1px solid var(--bdr-hr); display: flex; justify-content: space-between; align-items: center; }
    .sig-code code { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--red-bright); font-weight: 700; word-break: break-all; }

    .modal-footer-elite { padding: 32px; border-top: 1px solid var(--bdr-hr); display: flex; justify-content: flex-end; gap: 20px; background: var(--bg-input); }

    /* M-Pesa Quick Pay Processing */
    .mpesa-processing { text-align: center; padding: 48px 0; }
    .loader-ring { width: 56px; height: 56px; border: 4px solid var(--red-pale); border-top-color: var(--red-bright); border-radius: 50%; animation: spin-elite 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; margin: 0 auto 24px; }
    @keyframes spin-elite { to { transform: rotate(360deg); } }

    .mpesa-form-elite { display: flex; flex-direction: column; gap: 24px; }
    .form-actions-elite { display: flex; gap: 20px; margin-top: 12px; }

    /* ═══════════════════════════════
       Premium Buttons
       ═══════════════════════════════ */
    .btn-primary-elite { background: var(--red); color: #fff; border: none; padding: 16px 32px; border-radius: 20px; font-size: 11px; font-weight: 950; letter-spacing: 1.5px; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 10px 30px var(--red-glow); display: flex; align-items: center; justify-content: center; gap: 12px; }
    .btn-primary-elite:hover:not(:disabled) { background: var(--red-bright); transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 40px var(--red); }
    .btn-primary-elite:disabled { opacity: 0.4; cursor: not-allowed; filter: grayscale(1); }

    .btn-ghost-elite { background: var(--bg-input); color: var(--text-sec); border: 1.5px solid var(--bdr-hr); padding: 16px 28px; border-radius: 20px; font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .btn-ghost-elite:hover { background: var(--bg-card); color: var(--text-pri); border-color: var(--text-sec); transform: translateY(-2px); }

    .close-btn { background: transparent; border: none; font-size: 20px; color: var(--text-mut); cursor: pointer; transition: all 0.3s; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .close-btn:hover { background: var(--bg-input); color: var(--text-pri); }

    .input-group-elite { display: flex; flex-direction: column; gap: 10px; }
    .input-group-elite label { margin-left: 4px; }

    .empty-cell { padding: 80px 32px !important; text-align: center; }
    .empty-intel { display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--text-mut); }
    .empty-intel svg { opacity: 0.3; filter: drop-shadow(0 0 10px var(--red-glow)); }
    .empty-intel h3 { font-size: 18px; font-weight: 950; color: var(--text-sec); letter-spacing: 1px; margin-top: 12px; }
    .empty-intel p { font-size: 14px; max-width: 320px; margin: 0 auto; line-height: 1.6; }

    .mpesa-result { text-align: center; padding: 20px 0; display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .res-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; margin-bottom: 8px; }
    .success .res-icon { background: var(--red-pale); color: var(--red-bright); border: 2px solid var(--red-border); box-shadow: 0 0 30px var(--red-glow); }
    .error .res-icon { background: rgba(0,0,0,0.2); color: var(--text-mut); border: 2px solid var(--bdr-hr); }
    .mpesa-result h3 { font-size: 20px; font-weight: 950; color: var(--text-pri); }
    .mpesa-result p { color: var(--text-sec); font-size: 14px; }
    .txn-ref { font-family: 'JetBrains Mono', monospace; background: var(--bg-input); padding: 12px 20px; border-radius: 12px; font-size: 13px; color: var(--red-bright); margin-top: 8px; border: 1px solid var(--bdr-hr); }

    .animate-stagger { animation: slideInFade 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }
    @for $i from 1 through 10 {
      .animate-stagger:nth-child(#{$i}) { animation-delay: calc(#{$i} * 0.05s); }
    }
    @keyframes slideInFade { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

    @media (max-width: 1024px) {
      .db-inner { padding: 32px 24px; }
      .db-header-elite { flex-direction: column; gap: 32px; }
      .dashboard-grid-elite-4 { grid-template-columns: repeat(2, 1fr); gap: 24px; }
      .registry-toolbar { flex-direction: column; align-items: stretch; gap: 24px; }
      .search-wrap { max-width: none; }
      .elite-table th:nth-child(4), .elite-table td:nth-child(4),
      .elite-table th:nth-child(5), .elite-table td:nth-child(5) { display: none; }
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
        duration: 5000,
        icon: '✕'
      });
    }
  }
}
