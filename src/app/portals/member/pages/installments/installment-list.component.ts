import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MpesaService } from '../../../../services/mpesa.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-installment-list',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner">
        <header class="premium-header">
          <div class="header-main">
            <div class="header-tag">
              <span class="tag-glow"></span>
              <span class="tag-text">Fiscal Telemetry</span>
            </div>
            <h1 class="premium-title">Repayment <span class="red-gradient">Schedules</span></h1>
            <p class="premium-subtitle">Authorized monitoring of structured tax liability liquidation protocols</p>
          </div>
          <button routerLink="/member/installments/apply" class="btn-primary-elite">
            <div class="btn-glow"></div>
            <span class="relative z-10">PROPOSE NEW PLAN</span>
          </button>
        </header>

        <div class="grid-layout">
          @for (plan of plans; track plan.id) {
            <div class="elite-card plan-card group">
              <!-- Header Section -->
              <div class="card-head">
                <div class="head-info">
                  <span class="ref-id">{{ plan.refNo }}</span>
                  <h3 class="obligation-title">{{ plan.obligation }}</h3>
                </div>
                <div class="status-indicator" [class.completed]="plan.status === 'COMPLETED'">
                  <span class="status-dot"></span>
                  <span class="status-text">{{ plan.status }}</span>
                </div>
              </div>

              <!-- Metrics Section -->
              <div class="card-body">
                <div class="metric-row">
                  <div class="metric-box">
                    <span class="metric-label">TOTAL LIABILITY</span>
                    <div class="metric-value">
                      <span class="currency">KES</span>
                      {{ plan.totalAmount | number:'1.2-2' }}
                    </div>
                  </div>
                  <div class="metric-box text-right">
                    <span class="metric-label">OUTSTANDING</span>
                    <div class="metric-value highlight">
                      <span class="currency">KES</span>
                      {{ plan.remainingBalance | number:'1.2-2' }}
                    </div>
                  </div>
                </div>

                <!-- Progress Visualization -->
                <div class="progress-container">
                  <div class="progress-meta">
                    <span class="progress-label">LIQUIDATION PROGRESS</span>
                    <span class="progress-stats">{{ plan.paidInstallments }} / {{ plan.totalInstallments }} MONTHS</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" [style.width.%]="(plan.paidInstallments / plan.totalInstallments) * 100"></div>
                  </div>
                </div>

                <!-- Schedule Details -->
                <div class="schedule-grid">
                  <div class="schedule-item">
                    <span class="item-label">NEXT MILESTONE</span>
                    <span class="item-value">{{ plan.nextDue | date:'dd MMM yyyy' }}</span>
                  </div>
                  <div class="schedule-item">
                    <span class="item-label">MONTHLY QUOTA</span>
                    <span class="item-value accent">{{ plan.monthlyAmount | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Footer -->
              <div class="card-foot">
                <button class="btn-ghost-elite">Schedule</button>
                <button class="btn-ghost-elite">Ledger</button>
                @if (plan.status === 'ACTIVE') {
                  <button class="btn-action-highlight" (click)="openMpesaModal(plan)">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Pay via M-Pesa
                  </button>
                }
              </div>
            </div>
          } @empty {
             <div class="empty-telemetry">
                <div class="empty-icon-wrap">
                   <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 class="empty-title">REGISTRY SILENT</h3>
                <p class="empty-text">No active repayment schedules or structured plans detected.</p>
             </div>
          }
        </div>

        <!-- Compliance Directive -->
        <footer class="directive-box">
           <div class="directive-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
           <div class="directive-content">
              <h4 class="directive-title">COMPLIANCE DIRECTIVE</h4>
              <p class="directive-text text-balance">
                Failure to adhere to the agreed liquidation schedule will terminate the protection protocol, triggering immediate enforcement actions including bank agency notices and asset lien procedures.
              </p>
           </div>
        </footer>
      </div>
    </div>

    <!-- M-Pesa Payment Modal -->
    @if (showMpesaModal()) {
      <div class="modal-overlay-elite" role="dialog" aria-modal="true">
        <div class="modal-backdrop" (click)="closeMpesaModal()"></div>
        <div class="modal-glass">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-info">
              <span class="header-tag">MPESA STK PROTOCOL</span>
              <h2 class="modal-title">Pay Installment</h2>
              @if (selectedPlan()) {
                <p class="modal-subtitle">{{ selectedPlan()!.obligation }}</p>
              }
            </div>
            <button class="modal-close" (click)="closeMpesaModal()">✕</button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            @if (mpesaProcessing()) {
              <div class="processing-state">
                <div class="loader-ring"></div>
                <h3 class="state-title">Authenticating...</h3>
                <p class="state-text text-balance">Sending secure STK trigger to your device. Complete PIN entry now.</p>
              </div>
            } @else if (mpesaSuccess()) {
              <div class="success-state">
                <div class="success-icon">✓</div>
                <h3 class="state-title">Protocol Sent</h3>
                <p class="state-text">Check {{ mpesaForm.get('phone')?.value }} for the payment prompt.</p>
                <div class="tx-badge">TXID: {{ mpesaTransactionId() }}</div>
                <button class="btn-primary-elite mt-8 w-full" (click)="closeMpesaModal()">DISMISS</button>
              </div>
            } @else if (mpesaError()) {
              <div class="error-state">
                <div class="error-icon">✕</div>
                <h3 class="state-title">Auth Failed</h3>
                <p class="state-text">{{ mpesaErrorMessage() }}</p>
                <button class="btn-primary-elite mt-8 w-full" (click)="resetMpesaState()">RETRY PROTOCOL</button>
              </div>
            } @else {
              <form [formGroup]="mpesaForm" (ngSubmit)="submitMpesaPayment()" class="elite-form">
                <div class="amount-card">
                  <span class="label">SETTLEMENT AMOUNT</span>
                  <div class="value">
                    <span class="unit">KES</span>
                    {{ mpesaForm.get('amount')?.value | number:'1.2-2' }}
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">VALIDATED PHONE NUMBER</label>
                  <div class="input-group">
                    <input
                      type="tel"
                      formControlName="phone"
                      placeholder="e.g. 0712 345 678"
                      class="form-input-elite"
                      [class.error]="mpesaForm.get('phone')?.invalid && mpesaForm.get('phone')?.touched"
                    >
                  </div>
                  @if (mpesaForm.get('phone')?.invalid && mpesaForm.get('phone')?.touched) {
                    <span class="error-hint">VALID PROTOCOL-ENABLED NUMBER REQUIRED</span>
                  }
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn-ghost-elite" (click)="closeMpesaModal()">ABORT</button>
                  <button type="submit" class="btn-primary-elite flex-grow" [disabled]="mpesaForm.invalid">
                    <div class="btn-glow"></div>
                    <span class="relative z-10">INITIATE PAYMENT</span>
                  </button>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    }
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
      background: var(--bg-root);
      position: relative;
      overflow-x: hidden;
      color: #fff;
    }

    .noise-overlay {
      position: fixed; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3");
      opacity: 0.03;
      pointer-events: none;
      z-index: 1;
    }

    .accent-bleed {
      position: fixed; top: -10%; right: -5%;
      width: 60%; height: 50%;
      background: radial-gradient(circle at center, var(--red-pale) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
    }

    .db-inner {
      position: relative; z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    /* Header */
    .premium-header {
      display: flex; justify-content: space-between; align-items: flex-end;
      margin-bottom: 64px;
      gap: 32px;
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
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 24px var(--red-glow);
    }
    .btn-primary-elite:hover { transform: translateY(-3px); box-shadow: 0 12px 32px var(--red-glow); filter: brightness(1.1); }
    .btn-glow { position: absolute; inset: 0; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent); transform: translateX(-100%); transition: transform 0.6s; }
    .btn-primary-elite:hover .btn-glow { transform: translateX(100%); }

    /* Grid Layout */
    .grid-layout {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
      gap: 32px;
    }

    /* Plan Card */
    .elite-card {
      background: var(--bg-card);
      border: 1px solid var(--bdr);
      border-radius: 32px;
      padding: 0;
      backdrop-filter: blur(24px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    .elite-card:hover { border-color: var(--red-border); transform: translateY(-8px); box-shadow: 0 24px 64px rgba(0,0,0,0.4); }

    .card-head { padding: 32px; border-bottom: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: flex-start; }
    .ref-id { font-size: 9px; font-weight: 900; color: var(--text-muted); letter-spacing: 3px; display: block; margin-bottom: 8px; }
    .obligation-title { font-size: 18px; font-weight: 900; margin: 0; letter-spacing: -0.5px; color: #fff; transition: color 0.4s; }
    .plan-card:hover .obligation-title { color: var(--red-bright); }

    .status-indicator { display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 100px; }
    .status-indicator.completed { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; }
    .completed .status-dot { background: #10b981; }
    .status-text { font-size: 9px; font-weight: 900; color: #f59e0b; letter-spacing: 1px; }
    .completed .status-text { color: #10b981; }

    .card-body { padding: 32px; flex-grow: 1; }
    .metric-row { display: flex; justify-content: space-between; margin-bottom: 32px; }
    .metric-label { font-size: 9px; font-weight: 900; color: var(--text-muted); letter-spacing: 1.5px; display: block; margin-bottom: 8px; }
    .metric-value { font-size: 32px; font-weight: 950; letter-spacing: -1px; display: flex; align-items: baseline; gap: 4px; }
    .metric-value.highlight { color: var(--red-bright); font-size: 24px; }
    .currency { font-size: 10px; color: var(--text-muted); font-weight: 900; }

    /* Progress */
    .progress-container { margin-bottom: 32px; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px solid var(--bdr); }
    .progress-meta { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .progress-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; }
    .progress-stats { font-size: 9px; font-weight: 950; color: var(--red-bright); letter-spacing: 1px; }
    .progress-track { height: 6px; background: #000; border-radius: 100px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(to right, var(--red), var(--red-bright)); border-radius: 100px; box-shadow: 0 0 10px var(--red-glow); }

    .schedule-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .schedule-item { padding: 20px; background: rgba(0,0,0,0.2); border-radius: 20px; border: 1px solid var(--bdr); }
    .item-label { font-size: 9px; font-weight: 900; color: var(--text-muted); letter-spacing: 1px; display: block; margin-bottom: 4px; }
    .item-value { font-size: 14px; font-weight: 900; color: #fff; }
    .item-value.accent { color: #10b981; }

    .card-foot { padding: 24px 32px; background: rgba(0,0,0,0.2); display: flex; gap: 12px; }
    .btn-ghost-elite { flex: 1; padding: 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--bdr); border-radius: 16px; color: var(--text-muted); font-size: 10px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.3s; }
    .btn-ghost-elite:hover { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.1); }
    .btn-action-highlight { flex: 2; display: flex; align-items: center; justify-content: center; gap: 8px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 16px; color: var(--red-bright); font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; }
    .btn-action-highlight:hover { background: var(--red); color: #fff; box-shadow: 0 8px 20px var(--red-glow); }

    /* Directive */
    .directive-box { margin-top: 64px; padding: 32px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 32px; display: flex; gap: 24px; align-items: flex-start; position: relative; overflow: hidden; }
    .directive-icon { width: 48px; height: 48px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--red-bright); flex-shrink: 0; }
    .directive-title { font-size: 11px; font-weight: 950; color: var(--red-bright); letter-spacing: 3px; margin: 0 0 8px; }
    .directive-text { font-size: 13px; color: var(--text-muted); line-height: 1.6; font-weight: 500; margin: 0; }

    /* M-Pesa Modal Refined */
    .modal-overlay-elite { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(20px); }
    .modal-glass { position: relative; z-index: 10; width: 100%; max-width: 480px; background: #121214; border: 1px solid var(--bdr); border-radius: 40px; overflow: hidden; box-shadow: 0 64px 128px rgba(0,0,0,0.8); }
    
    .modal-header { padding: 40px; border-bottom: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: flex-start; }
    .modal-header .header-tag { margin-bottom: 12px; }
    .modal-title { font-size: 28px; font-weight: 950; margin: 0; letter-spacing: -1px; }
    .modal-subtitle { color: var(--text-muted); font-size: 13px; margin: 4px 0 0; font-weight: 600; }
    .modal-close { background: rgba(255,255,255,0.05); border: none; width: 40px; height: 40px; border-radius: 15px; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; transition: all 0.3s; }
    .modal-close:hover { background: var(--red); color: #fff; transform: rotate(90deg); }

    .modal-body { padding: 40px; }
    .processing-state { text-align: center; padding: 20px 0; }
    .loader-ring { width: 56px; height: 56px; border: 4px solid var(--red-pale); border-top-color: var(--red-bright); border-radius: 50%; animation: spin-elite 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; margin: 0 auto 24px; }
    @keyframes spin-elite { to { transform: rotate(360deg); } }
    .state-title { font-size: 18px; font-weight: 900; margin: 0 0 8px; }
    .state-text { color: var(--text-muted); font-size: 13px; font-weight: 500; }

    .success-state, .error-state { text-align: center; }
    .success-icon, .error-icon { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; margin: 0 auto 24px; }
    .success-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .error-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

    .elite-form { display: flex; flex-direction: column; gap: 32px; }
    .amount-card { padding: 24px; background: rgba(255,255,255,0.02); border-radius: 24px; border: 1px solid var(--bdr); }
    .amount-card .label { font-size: 9px; font-weight: 900; color: var(--text-muted); letter-spacing: 2px; display: block; margin-bottom: 8px; }
    .amount-card .value { font-size: 32px; font-weight: 950; letter-spacing: -1px; }
    .amount-card .unit { font-size: 12px; color: var(--text-muted); margin-right: 4px; }

    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-label { font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 1.5px; margin-left: 4px; }
    .form-input-elite { background: rgba(0,0,0,0.3); border: 1px solid var(--bdr); border-radius: 16px; padding: 18px 24px; color: #fff; font-size: 16px; font-weight: 600; outline: none; transition: all 0.3s; }
    .form-input-elite:focus { border-color: var(--red-border); background: #000; box-shadow: 0 0 0 4px var(--red-pale); }
    .form-input-elite.error { border-color: rgba(239, 68, 68, 0.5); }
    .error-hint { font-size: 9px; font-weight: 900; color: #ef4444; letter-spacing: 1px; margin-top: 4px; }

    .modal-footer { display: flex; gap: 16px; margin-top: 8px; }

    .empty-telemetry { grid-column: 1 / -1; padding: 80px 0; text-align: center; }
    .empty-icon-wrap { width: 80px; height: 80px; background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--text-muted); }
    .empty-title { font-size: 11px; font-weight: 950; color: #fff; letter-spacing: 4px; margin: 0 0 8px; }
    .empty-text { font-size: 13px; color: var(--text-muted); font-weight: 500; }

    @media (max-width: 1024px) {
      .grid-layout { grid-template-columns: 1fr; }
      .premium-header { flex-direction: column; align-items: flex-start; }
      .btn-primary-elite { width: 100%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallmentListComponent {
  private mpesaService = inject(MpesaService);
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);

  // M-Pesa modal state
  showMpesaModal = signal(false);
  selectedPlan = signal<{ id: number; refNo: string; obligation: string; monthlyAmount: number } | null>(null);
  mpesaProcessing = signal(false);
  mpesaSuccess = signal(false);
  mpesaError = signal(false);
  mpesaErrorMessage = signal('');
  mpesaTransactionId = signal('');

  mpesaForm = this.fb.group({
    phone: ['', [Validators.required]],
    amount: [0]
  });

  openMpesaModal(plan: { id: number; refNo: string; obligation: string; monthlyAmount: number }) {
    this.selectedPlan.set(plan);
    this.mpesaForm.reset({ phone: '', amount: plan.monthlyAmount });
    this.resetMpesaState();
    this.showMpesaModal.set(true);
  }

  closeMpesaModal() {
    this.showMpesaModal.set(false);
    this.selectedPlan.set(null);
  }

  resetMpesaState() {
    this.mpesaProcessing.set(false);
    this.mpesaSuccess.set(false);
    this.mpesaError.set(false);
    this.mpesaErrorMessage.set('');
    this.mpesaTransactionId.set('');
  }

  async submitMpesaPayment() {
    if (this.mpesaForm.invalid) return;
    const { phone, amount } = this.mpesaForm.value;
    if (!phone || !amount) return;

    if (!this.mpesaService.isValidMpesaPhone(phone)) {
      this.mpesaError.set(true);
      this.mpesaErrorMessage.set('Invalid M-PESA phone number. Use a Safaricom or Airtel number.');
      return;
    }

    this.mpesaProcessing.set(true);
    try {
      const plan = this.selectedPlan();
      const result = await this.mpesaService.processPayment(phone, amount, plan?.refNo ?? '');
      if (result.success) {
        this.mpesaTransactionId.set(result.transactionId ?? '');
        this.mpesaSuccess.set(true);
        this.notificationService.showSuccess('M-PESA prompt sent to your phone!');
      } else {
        this.mpesaError.set(true);
        this.mpesaErrorMessage.set(result.message);
      }
    } catch (err: unknown) {
      this.mpesaError.set(true);
      this.mpesaErrorMessage.set(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      this.mpesaProcessing.set(false);
    }
  }

  plans = [
    {
      id: 1,
      refNo: 'IPL-2025-001',
      obligation: 'Income Tax - 2024 Audit Debt',
      totalAmount: 450000.00,
      remainingBalance: 300000.00,
      monthlyAmount: 37500.00,
      paidInstallments: 4,
      totalInstallments: 12,
      nextDue: '2026-03-05',
      status: 'ACTIVE'
    },
    {
      id: 2,
      refNo: 'IPL-2024-012',
      obligation: 'VAT - Oct 2024 Penalties',
      totalAmount: 18000.00,
      remainingBalance: 0.00,
      monthlyAmount: 3000.00,
      paidInstallments: 6,
      totalInstallments: 6,
      nextDue: 'N/A',
      status: 'COMPLETED'
    }
  ];
}
