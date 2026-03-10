import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HelpdeskService } from '../../../services/helpdesk.service';
import { CommonModule, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-ticket-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, CommonModule, UpperCasePipe],
  template: `
    <div class="db-root animate-fade-in">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- Elite Header -->
        <header class="db-header-elite animate-fade-in">
          <div class="header-left">
            <div class="flex items-center gap-4 mb-4 no-print">
              <a routerLink="/helpdesk" class="btn-ghost-elite btn-icon-only">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M15 19l-7-7 7-7"/></svg>
              </a>
              <div class="live-badge">
                <div class="live-dot"></div>
                NEW DIRECTIVE PROTOCOL
              </div>
            </div>
            <h1 class="premium-title">Initiate <span class="text-red">Signal</span></h1>
            <p class="premium-subtitle">Technical support sequence & objective definition</p>
          </div>
        </header>

        <div class="dashboard-grid-elite animate-fade-in" style="animation-delay: 0.1s">
          <div class="main-stack">
            <form (ngSubmit)="submitForm()" #ticketForm="ngForm" class="form-sequence">
              <div class="elite-card form-panel">
                <div class="card-glow"></div>
                
                <div class="form-grid-elite">
                  <!-- Subject -->
                  <div class="input-group-elite span-all">
                    <label class="meta-label">OPERATION SUBJECT *</label>
                    <input
                      type="text"
                      [(ngModel)]="formData.subject"
                      name="subject"
                      required
                      placeholder="Brief objective summary..."
                      class="elite-input"
                    />
                  </div>

                  <!-- Category -->
                  <div class="input-group-elite">
                    <label class="meta-label">REGISTRY CATEGORY *</label>
                    <div class="select-wrap-elite">
                      <select
                        [(ngModel)]="formData.category"
                        name="category"
                        required
                        class="elite-select"
                      >
                        <option value="" disabled selected>Select Registry...</option>
                        @for (cat of helpdeskService.categories(); track cat) {
                          <option [value]="cat">{{ cat }}</option>
                        }
                      </select>
                      <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>

                  <!-- Priority -->
                  <div class="input-group-elite">
                    <label class="meta-label">TACTICAL PRIORITY *</label>
                    <div class="select-wrap-elite">
                      <select
                        [(ngModel)]="formData.priority"
                        name="priority"
                        required
                        class="elite-select"
                      >
                        <option value="Low">Low - Baseline</option>
                        <option value="Medium">Medium - Standard</option>
                        <option value="High">High - Degraded</option>
                        <option value="Critical">Critical - Outage</option>
                      </select>
                      <svg class="select-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="input-group-elite span-all">
                    <label class="meta-label">OBJECTIVE DETAILS *</label>
                    <textarea
                      [(ngModel)]="formData.description"
                      name="description"
                      required
                      placeholder="Provide full technical context of the directive..."
                      rows="6"
                      class="elite-textarea"
                    ></textarea>
                  </div>

                  <!-- Status Feedback -->
                  @if (errorMessage()) {
                    <div class="status-alert-elite error span-all animate-fade-in">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        <span>{{ errorMessage() }}</span>
                    </div>
                  }

                  @if (successMessage()) {
                    <div class="status-alert-elite success span-all animate-fade-in">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7"/></svg>
                        <span>{{ successMessage() }}</span>
                    </div>
                  }
                </div>
              </div>

              <div class="form-actions-elite">
                <button
                  type="button"
                  routerLink="/helpdesk"
                  class="btn-ghost-elite"
                >
                  ABORT SEQUENCE
                </button>
                <button
                  type="submit"
                  [disabled]="isSubmitting() || !ticketForm.valid"
                  class="btn-primary-elite"
                >
                  @if (isSubmitting()) {
                    <div class="spin-elite sm mr-3"></div>
                    EXECUTING...
                  } @else {
                    EXECUTE REQUEST
                  }
                </button>
              </div>
            </form>
          </div>

          <!-- Ops Guidelines Sidebar -->
          <div class="side-stack-elite">
             <div class="elite-card side-panel">
                <div class="card-glow"></div>
                <div class="panel-header-mini">
                   <h3 class="meta-label text-red">SERVICE PROTOCOL</h3>
                </div>
                <p class="ri-period mb-8 leading-relaxed">Ensure all mission-critical telemetry is included to maintain operational velocity.</p>
                
                <div class="protocol-list">
                   <div class="protocol-item critical">
                      <div class="protocol-tag">CRITICAL</div>
                      <div class="protocol-main">
                        <span class="protocol-time">RESPONSE: 60 MIN</span>
                        <p class="protocol-desc">Total system failure or severe financial risk nodes.</p>
                      </div>
                   </div>
                   <div class="protocol-item high">
                      <div class="protocol-tag">HIGH</div>
                      <div class="protocol-main">
                        <span class="protocol-time">RESPONSE: 04 HR</span>
                        <p class="protocol-desc">Major feature degradation or filing blockages identified.</p>
                      </div>
                   </div>
                   <div class="protocol-item standard">
                      <div class="protocol-tag">BASELINE</div>
                      <div class="protocol-main">
                        <span class="protocol-time">RESPONSE: 24 HR</span>
                        <p class="protocol-desc">Inquiries and non-critical optimizations in queue.</p>
                      </div>
                   </div>
                </div>
             </div>
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

    .noise-overlay { position: fixed; inset: 0; background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.02; z-index: 2; pointer-events: none; }

    .accent-bleed {
      position: fixed;
      top: -15vw;
      right: -10vw;
      width: 45vw;
      height: 45vw;
      background: radial-gradient(circle, var(--red) 0%, transparent 70%);
      opacity: 0.05;
      filter: blur(80px);
      z-index: 1;
      pointer-events: none;
    }

    .db-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 48px 32px 100px;
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    /* ═══════════════════════════════
       Premium Header Flow
       ═══════════════════════════════ */
    .db-header-elite {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .premium-title {
      font-size: 44px;
      font-weight: 900;
      letter-spacing: -2px;
      line-height: 1;
      margin: 16px 0 10px;
    }

    .text-red {
      color: var(--red-bright);
      text-shadow: 0 0 25px var(--red-glow);
    }

    .premium-subtitle {
      font-size: 15px;
      font-weight: 500;
      color: var(--text-sec);
      letter-spacing: -0.2px;
    }

    .live-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: var(--red-pale);
      border: 1px solid var(--red-border);
      border-radius: 100px;
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 1.5px;
      color: var(--red-bright);
    }

    .live-dot {
      width: 6px;
      height: 6px;
      background: var(--red-bright);
      border-radius: 50%;
      box-shadow: 0 0 12px var(--red);
      animation: pulse-red 2s infinite;
    }

    @keyframes pulse-red {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 18px var(--red); }
      100% { transform: scale(0.95); opacity: 0.8; }
    }

    .btn-ghost-elite {
      background: transparent;
      border: 1.5px solid var(--bdr-hr);
      color: var(--text-sec);
      padding: 18px 32px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1.2px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-ghost-elite:hover {
      background: var(--bdr);
      color: var(--text-pri);
      border-color: var(--text-mut);
    }

    .btn-icon-only {
      padding: 12px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
    }

    .btn-primary-elite {
      background: var(--red);
      color: white;
      border: none;
      padding: 18px 40px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 950;
      letter-spacing: 1.5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 30px var(--red-glow);
    }

    .btn-primary-elite:hover:not(:disabled) {
      background: var(--red-bright);
      box-shadow: 0 15px 40px var(--red);
      transform: translateY(-3px) scale(1.02);
    }

    .btn-primary-elite:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      filter: grayscale(1);
    }

    /* ═══════════════════════════════
       Grid & Components
       ═══════════════════════════════ */
    .dashboard-grid-elite {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 40px;
    }

    .main-stack {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .form-panel {
      padding: 48px;
    }

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
      inset: 0;
      background: radial-gradient(circle at top left, var(--red) 0%, transparent 40%);
      opacity: 0.04;
      pointer-events: none;
    }

    /* ═══════════════════════════════
       Form Inputs (Premium Red)
       ═══════════════════════════════ */
    .form-grid-elite {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px;
    }

    .span-all { grid-column: 1 / -1; }

    .input-group-elite {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .meta-label {
      font-size: 10px;
      font-weight: 950;
      color: var(--text-mut);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .elite-input, .elite-textarea, .elite-select {
      width: 100%;
      background: var(--bg-input);
      border: 2px solid var(--bdr);
      border-radius: 18px;
      padding: 18px 22px;
      color: var(--text-pri);
      font-size: 15px;
      font-weight: 600;
      outline: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .elite-input:focus, .elite-textarea:focus, .elite-select:focus {
      border-color: var(--red-bright);
      background: #0d0d0d;
      box-shadow: 0 0 25px var(--red-pale);
    }

    .elite-textarea { resize: none; }

    .select-wrap-elite { position: relative; }
    .select-icon {
      position: absolute;
      right: 22px;
      top: 22px;
      color: var(--text-mut);
      pointer-events: none;
    }

    .elite-select { appearance: none; cursor: pointer; }

    .input-footer-elite {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }

    .form-actions-elite {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
      margin-top: 16px;
    }

    /* ═══════════════════════════════
       Sidebar Protocol
       ═══════════════════════════════ */
    .side-stack-elite {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .side-panel {
      padding: 36px;
    }

    .panel-header-mini {
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--bdr-hr);
    }

    .protocol-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .protocol-item {
      padding: 22px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--bdr);
      border-radius: 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: all 0.3s;
    }

    .protocol-item:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: var(--bdr-hr);
      transform: translateX(6px);
    }

    .protocol-tag {
      font-size: 9px;
      font-weight: 950;
      padding: 5px 12px;
      border-radius: 8px;
      width: fit-content;
      letter-spacing: 1px;
    }

    .critical .protocol-tag { background: var(--red-pale); color: var(--red-bright); }
    .high .protocol-tag { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
    .standard .protocol-tag { background: rgba(255, 255, 255, 0.05); color: var(--text-sec); }

    .protocol-main { display: flex; flex-direction: column; gap: 6px; }
    .protocol-time { font-size: 13px; font-weight: 800; color: var(--text-pri); letter-spacing: -0.2px; }
    .protocol-desc { font-size: 11px; font-weight: 600; color: var(--text-mut); line-height: 1.5; text-transform: uppercase; }

    /* ═══════════════════════════════
       Alerts & Spinners
       ═══════════════════════════════ */
    .status-alert-elite {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
    }

    .status-alert-elite.error {
      background: var(--red-pale);
      color: var(--red-bright);
      border: 1px solid var(--red-border);
    }

    .status-alert-elite.success {
      background: rgba(34, 197, 94, 0.1);
      color: #22C55E;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .spin-elite {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spin-elite.sm { width: 18px; height: 18px; border-width: 2.5px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    @media (max-width: 1100px) {
      .dashboard-grid-elite { grid-template-columns: 1fr; }
      .side-stack-elite { display: grid; grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .form-grid-elite { grid-template-columns: 1fr; }
      .premium-title { font-size: 36px; }
      .form-panel { padding: 32px; }
    }
  `]
})
export class TicketCreateComponent {
  public helpdeskService = inject(HelpdeskService);
  private router = inject(Router);

  formData = {
    subject: '',
    category: '',
    priority: 'Medium',
    description: ''
  };

  isSubmitting = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  submitForm(): void {
    if (!this.formData.subject || !this.formData.category || !this.formData.description) {
      this.errorMessage.set('Error: Please fill in all required fields.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.helpdeskService.createTicket(this.formData).subscribe({
      next: (response) => {
        this.successMessage.set(`Success: Ticket ${response.ticket_number} created.`);
        setTimeout(() => {
          this.router.navigate(['/helpdesk', response.ticket_id]);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage.set(err || 'Error: Could not create ticket.');
        this.isSubmitting.set(false);
      }
    });
  }
}
