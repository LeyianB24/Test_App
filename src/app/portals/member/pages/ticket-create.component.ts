import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HelpdeskService } from '../../../services/helpdesk.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container animate-up">
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <div class="mb-16">
            <a routerLink="/helpdesk" class="back-link">← Return to Support Hub</a>
          </div>
          <h1 class="premium-title">Create <span class="gradient-text">Support Ticket</span></h1>
          <p class="premium-subtitle">Initiate a formal request for technical or administrative assistance</p>
        </div>
      </header>

      <div class="creation-grid mt-32">
        <div class="content-card-premium p-40">
          <form (ngSubmit)="submitForm()" #ticketForm="ngForm" class="luxury-form-stack">
            
            <!-- Subject -->
            <div class="form-item-elite">
              <label>Service Request Subject *</label>
              <input
                type="text"
                [(ngModel)]="formData.subject"
                name="subject"
                required
                placeholder="Brief description of the issue or request"
                class="luxury-input-elite"
              />
              <span class="char-count">{{ formData.subject.length }}/255 characters</span>
            </div>

            <!-- Category & Priority Row -->
            <div class="form-row-elite">
              <div class="form-item-elite flex-1">
                <label>Operational Category *</label>
                <select
                  [(ngModel)]="formData.category"
                  name="category"
                  required
                  class="luxury-select-elite"
                >
                  <option value="" disabled selected>Select category...</option>
                  @for (cat of helpdeskService.categories(); track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </div>

              <div class="form-item-elite flex-1">
                <label>Urgency Level *</label>
                <select
                  [(ngModel)]="formData.priority"
                  name="priority"
                  required
                  class="luxury-select-elite"
                >
                  <option value="Low">Low - Informational</option>
                  <option value="Medium">Medium - Standard Inquiry</option>
                  <option value="High">High - System Degradation</option>
                  <option value="Critical">Critical - Full Outage / Data Loss</option>
                </select>
              </div>
            </div>

            <!-- Description -->
            <div class="form-item-elite">
              <label>Detailed Request Description *</label>
              <textarea
                [(ngModel)]="formData.description"
                name="description"
                required
                placeholder="Please describe the issue in detail. If applicable, specify error codes, affected PRNs, or timestamps to expedite resolution."
                rows="6"
                class="luxury-textarea-elite"
              ></textarea>
              <span class="char-count">{{ formData.description.length }}/5000</span>
            </div>

            <!-- Info Matrix -->
            <div class="info-matrix">
              <div class="im-icon bg-blue-light text-blue">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div class="im-text">
                <strong>Documentation Protocol</strong>
                <p>Attach supporting evidence directly in the ticket thread once generated.</p>
              </div>
            </div>

            @if (errorMessage) {
              <div class="error-banner animate-fade">
                {{ errorMessage }}
              </div>
            }

            @if (successMessage) {
              <div class="success-banner animate-fade">
                {{ successMessage }}
              </div>
            }

            <div class="surface-footer-flush">
              <button
                type="button"
                routerLink="/helpdesk"
                class="modern-btn outline-btn"
              >
                Abort
              </button>
              <button
                type="submit"
                [disabled]="isSubmitting || !ticketForm.valid"
                class="modern-btn primary-btn"
              >
                {{ isSubmitting ? 'Transmitting...' : 'Initialize Request' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Sidebar Guidelines -->
        <div class="guideline-card">
          <h3 class="gc-title">Resolution SLA Parameters</h3>
          
          <div class="sla-item">
            <span class="sla-badge critical">Critical</span>
            <div class="sla-info">
              <strong>1 Hour</strong> First Response
              <p>System outages, payment gateway failure.</p>
            </div>
          </div>
          
          <div class="sla-item">
            <span class="sla-badge high">High</span>
            <div class="sla-info">
              <strong>4 Hours</strong> First Response
              <p>Degraded performance, filing blockages.</p>
            </div>
          </div>
          
          <div class="sla-item">
            <span class="sla-badge medium">Medium</span>
            <div class="sla-info">
              <strong>24 Hours</strong> First Response
              <p>General inquiries, ledger discrepancies.</p>
            </div>
          </div>
          
          <div class="sla-item">
            <span class="sla-badge low">Low</span>
            <div class="sla-info">
              <strong>48 Hours</strong> First Response
              <p>Feedback, feature requests, minor bugs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mb-16 { margin-bottom: 16px; }
    .mt-32 { margin-top: 32px; }
    .p-40 { padding: 40px; }
    
    .back-link { font-weight: 800; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: var(--kra-red); text-decoration: none; transition: 0.2s; }
    .back-link:hover { opacity: 0.8; }
    
    .creation-grid { display: grid; grid-template-columns: 1fr 340px; gap: 40px; align-items: start; }
    @media (max-width: 1000px) { .creation-grid { grid-template-columns: 1fr; } }
    
    .content-card-premium { background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.03); }
    
    .luxury-form-stack { display: flex; flex-direction: column; gap: 32px; }
    .form-item-elite { display: flex; flex-direction: column; gap: 12px; }
    .form-item-elite label { font-size: 0.75rem; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; }
    .char-count { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; align-self: flex-end; }
    
    .form-row-elite { display: flex; gap: 24px; }
    .flex-1 { flex: 1; }
    @media (max-width: 768px) { .form-row-elite { flex-direction: column; } }
    
    .luxury-input-elite, .luxury-select-elite, .luxury-textarea-elite {
      width: 100%; padding: 18px 24px; background: #F8FAFC; border: 2.5px solid #E2E8F0;
      border-radius: 20px; font-weight: 700; color: #1a202c; font-size: 1.05rem; transition: 0.3s;
      outline: none; font-family: inherit;
    }
    .luxury-textarea-elite { padding: 24px; resize: vertical; min-height: 150px; }
    
    .luxury-input-elite:focus, .luxury-select-elite:focus, .luxury-textarea-elite:focus { 
      border-color: var(--kra-red); background: white; box-shadow: 0 0 0 6px rgba(227,30,36,0.1); 
    }
    
    .info-matrix { display: flex; gap: 20px; padding: 24px; background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 20px; align-items: center; }
    .im-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .bg-blue-light { background: #EFF6FF; }
    .text-blue { color: #2563EB; }
    .im-text strong { display: block; font-size: 1rem; color: #1a202c; font-weight: 800; margin-bottom: 4px; }
    .im-text p { margin: 0; font-size: 0.9rem; color: #64748b; font-weight: 600; line-height: 1.5; }
    
    .error-banner { background: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; padding: 16px 24px; border-radius: 16px; font-weight: 700; }
    .success-banner { background: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; padding: 16px 24px; border-radius: 16px; font-weight: 700; }
    
    .surface-footer-flush { display: flex; justify-content: flex-end; gap: 16px; border-top: 1.5px solid #F1F5F9; padding-top: 32px; margin-top: 8px; }
    
    /* Sidebar styling */
    .guideline-card { background: #F8FAFC; border-radius: 24px; padding: 32px; border: 1.5px solid #E2E8F0; position: sticky; top: 120px; }
    .gc-title { font-size: 1.15rem; font-weight: 900; color: #1a202c; letter-spacing: -0.5px; margin: 0 0 24px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 16px; }
    
    .sla-item { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
    .sla-item:last-child { margin-bottom: 0; }
    .sla-badge { align-self: flex-start; padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    .sla-badge.critical { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
    .sla-badge.high { background: #FFEDD5; color: #EA580C; border: 1px solid #FED7AA; }
    .sla-badge.medium { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
    .sla-badge.low { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
    
    .sla-info strong { font-size: 0.95rem; color: #1a202c; font-weight: 800; }
    .sla-info p { margin: 4px 0 0 0; font-size: 0.85rem; color: #64748b; font-weight: 600; line-height: 1.5; }
  `]
})
export class TicketCreateComponent implements OnInit, OnDestroy {
  formData = {
    subject: '',
    category: '',
    priority: 'Medium',
    description: ''
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    public helpdeskService: HelpdeskService
  ) {}

  ngOnInit(): void {
    // Categories loaded via service
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (!this.formData.subject || !this.formData.category || !this.formData.description) {
      this.errorMessage = 'MANDATORY: Fill in all required fields.';
      return;
    }

    if (this.formData.subject.length < 5) {
      this.errorMessage = 'REJECTED: Subject must be at least 5 characters.';
      return;
    }

    if (this.formData.description.length < 20) {
      this.errorMessage = 'REJECTED: Description must be at least 20 characters.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.helpdeskService.createTicket({
      subject: this.formData.subject,
      category: this.formData.category,
      priority: this.formData.priority,
      description: this.formData.description
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.successMessage = `SUCCESS: Ticket ${response.ticket_number} created in the master ledger. Redirecting...`;

          setTimeout(() => {
            this.router.navigate(['/helpdesk', response.ticket_id]);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err || 'TRANSMISSION FAILED: Could not create ticket.';
          this.isSubmitting = false;
        }
      });
  }
}
