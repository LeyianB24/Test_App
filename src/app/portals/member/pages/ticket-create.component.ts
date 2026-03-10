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
        <header class="db-header-elite">
          <div class="header-left">
            <div class="flex items-center gap-4 mb-4">
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

        <div class="dashboard-grid-elite">
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
                      <svg class="select-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
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
                      <svg class="select-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
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
                    <div class="input-footer-elite">
                       <span class="meta-label text-mut">{{ formData.description.length }} / 5000 UNITS</span>
                    </div>
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
                  class="btn-ghost-elite px-10"
                >
                  ABORT SEQUENCE
                </button>
                <button
                  type="submit"
                  [disabled]="isSubmitting() || !ticketForm.valid"
                  class="btn-primary-elite px-12"
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
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

    :host {
      --kra-red: #C0392B;
      --kra-red-light: #E74C3C;
      --kra-red-pale: rgba(192,57,43,0.08);
      --kra-red-glow: rgba(192,57,43,0.25);
      
      --kra-green: #1A7A3C;
      --kra-green-light: #22A052;
      --kra-green-pale: rgba(26,122,60,0.08);

      --kra-gold: #F59E0B;
      --kra-gold-pale: rgba(245,158,11,0.1);
      
      --bg-root: #0B0F0E;
      --bg-card: #14201A;
      --bg-card-2: #192820;
      --bg-card-3: #1C2B22;
      
      --text-pri: #E8F5EC;
      --text-sec: #8EA898;
      --text-mut: #4A6258;

      --bdr: rgba(26,122,60,0.15);
      --bdr-md: rgba(26,122,60,0.25);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    .db-root { min-height: 100vh; background: var(--bg-root); color: var(--text-pri); position: relative; overflow: hidden; }
    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.03; z-index: 1; pointer-events: none; }
    .accent-bleed { position: fixed; top: -10vw; right: -10vw; width: 40vw; height: 40vw; background: var(--kra-red); filter: blur(15vw); opacity: 0.05; border-radius: 50%; z-index: 1; pointer-events: none; }

    .db-inner { max-width: 1440px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 40px; position: relative; z-index: 10; }

    /* Header */
    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; }
    .premium-title { font-size: 40px; font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--kra-red-light); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--kra-red-pale); border: 1px solid rgba(192,57,43,0.2); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--kra-red-light); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--kra-red-light); box-shadow: 0 0 10px var(--kra-red-glow); animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    /* Actions */
    .btn-ghost-elite { background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--text-sec); padding: 12px 24px; border-radius: 14px; font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; }
    .btn-ghost-elite:hover { background: var(--bg-card-3); color: var(--text-pri); }
    .btn-icon-only { padding: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }

    .btn-primary-elite { background: var(--kra-red); border: none; color: white; padding: 12px 24px; border-radius: 14px; display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 900; letter-spacing: 1px; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 24px var(--kra-red-glow); }
    .btn-primary-elite:hover { transform: translateY(-2px); background: var(--kra-red-light); box-shadow: 0 12px 32px var(--kra-red-glow); }
    .btn-primary-elite:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    /* Grid Architecture */
    .dashboard-grid-elite { display: grid; grid-template-columns: 1fr 340px; gap: 32px; }
    .main-stack { display: flex; flex-direction: column; gap: 32px; }
    .side-stack-elite { display: flex; flex-direction: column; gap: 24px; }

    /* Elite Card */
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 28px; padding: 40px; position: relative; overflow: hidden; }
    .card-glow { position: absolute; inset: 0; background: radial-gradient(circle at top left, var(--kra-red), transparent 70%); opacity: 0.03; pointer-events: none; }

    /* Form Architecture */
    .form-sequence { display: flex; flex-direction: column; gap: 32px; }
    .form-grid-elite { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .span-all { grid-column: 1 / -1; }

    .input-group-elite { display: flex; flex-direction: column; gap: 12px; }
    .meta-label { font-size: 9px; font-weight: 950; color: var(--text-mut); letter-spacing: 2px; text-transform: uppercase; }
    
    .elite-input, .elite-select, .elite-textarea { width: 100%; background: var(--bg-card-2); border: 2px solid var(--bdr); border-radius: 16px; padding: 16px 20px; color: var(--text-pri); font-size: 14px; font-weight: 600; outline: none; transition: all 0.3s; }
    .elite-input:focus, .elite-select:focus, .elite-textarea:focus { border-color: var(--kra-red-light); background: var(--bg-card-3); box-shadow: 0 0 20px var(--kra-red-pale); }
    .elite-textarea { resize: none; }

    .select-wrap-elite { position: relative; }
    .select-icon { position: absolute; right: 20px; top: 18px; pointer-events: none; color: var(--text-mut); }
    .elite-select { appearance: none; cursor: pointer; }

    .input-footer-elite { display: flex; justify-content: flex-end; margin-top: 8px; }

    .form-actions-elite { display: flex; justify-content: flex-end; gap: 16px; padding-top: 16px; }

    /* Protocol Sidebar */
    .side-panel { padding: 32px; }
    .panel-header-mini { margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid var(--bdr); }
    .ri-period { font-size: 10px; font-weight: 900; color: var(--text-mut); letter-spacing: 1.5px; }

    .protocol-list { display: flex; flex-direction: column; gap: 16px; }
    .protocol-item { background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 12px; transition: all 0.3s; }
    .protocol-item:hover { border-color: var(--bdr-md); transform: translateX(5px); }
    
    .protocol-tag { font-size: 9px; font-weight: 950; padding: 4px 10px; border-radius: 6px; width: fit-content; }
    .critical .protocol-tag { background: var(--kra-red-pale); color: var(--kra-red-light); }
    .high .protocol-tag { background: var(--kra-gold-pale); color: var(--kra-gold); }
    .standard .protocol-tag { background: var(--bg-card-3); color: var(--text-sec); border: 1px solid var(--bdr); }

    .protocol-main { display: flex; flex-direction: column; gap: 4px; }
    .protocol-time { font-size: 11px; font-weight: 950; color: var(--text-pri); }
    .protocol-desc { font-size: 10px; font-weight: 700; color: var(--text-mut); line-height: 1.4; text-transform: uppercase; letter-spacing: 0.5px; }

    /* Status Alerts */
    .status-alert-elite { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-radius: 16px; font-size: 12px; font-weight: 800; }
    .status-alert-elite.error { background: var(--kra-red-pale); color: var(--kra-red-light); border: 1px solid var(--kra-red-border); }
    .status-alert-elite.success { background: var(--kra-green-pale); color: var(--kra-green-light); border: 1px solid rgba(34, 160, 82, 0.2); }

    /* Loading / Spin */
    .spin-elite { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.1); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
    .spin-elite.sm { width: 16px; height: 16px; border-width: 2px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }

    @media (max-width: 1024px) {
      .dashboard-grid-elite { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .form-grid-elite { grid-template-columns: 1fr; }
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
