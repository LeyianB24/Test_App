import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HelpdeskService } from '../../../services/helpdesk.service';

@Component({
  selector: 'app-ticket-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="content-area animate-fade-in">
      
      <header class="mb-10">
        <div class="flex items-center gap-6">
          <a routerLink="/helpdesk" class="btn-precision btn-secondary-precision btn-sm px-3">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
          </a>
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight">
              New <span class="text-accent">Directive</span>
            </h1>
            <p class="text-[var(--text-secondary)] mt-1 font-semibold tracking-wide uppercase text-[10px]">Initiate technical support sequence</p>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <form (ngSubmit)="submitForm()" #ticketForm="ngForm" class="space-y-10">
            <div class="stat-card-precision !p-10">
              
              <div class="space-y-10">
                <!-- Subject -->
                <div class="flex flex-col gap-2">
                  <label class="text-[10px] font-black text-secondary uppercase tracking-widest">Operation Subject *</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.subject"
                    name="subject"
                    required
                    placeholder="Brief objective summary..."
                    class="w-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl py-4 px-6 text-sm font-black transition-all focus:border-accent outline-none"
                  />
                </div>

                <!-- Category & Priority -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-black text-secondary uppercase tracking-widest">Registry Category *</label>
                    <select
                      [(ngModel)]="formData.category"
                      name="category"
                      required
                      class="w-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl py-4 px-6 text-sm font-black transition-all focus:border-accent outline-none appearance-none"
                    >
                      <option value="" disabled selected>Select Registry...</option>
                      @for (cat of helpdeskService.categories(); track cat) {
                        <option [value]="cat">{{ cat }}</option>
                      }
                    </select>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-[10px] font-black text-secondary uppercase tracking-widest">Tactical Priority *</label>
                    <select
                      [(ngModel)]="formData.priority"
                      name="priority"
                      required
                      class="w-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl py-4 px-6 text-sm font-black transition-all focus:border-accent outline-none appearance-none"
                    >
                      <option value="Low">Low - Baseline</option>
                      <option value="Medium">Medium - Standard</option>
                      <option value="High">High - Degraded</option>
                      <option value="Critical">Critical - Outage</option>
                    </select>
                  </div>
                </div>

                <!-- Description -->
                <div class="flex flex-col gap-2">
                  <label class="text-[10px] font-black text-secondary uppercase tracking-widest">Objective Details *</label>
                  <textarea
                    [(ngModel)]="formData.description"
                    name="description"
                    required
                    placeholder="Provide full technical context..."
                    rows="6"
                    class="w-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl py-4 px-6 text-sm font-black transition-all focus:border-accent outline-none resize-none"
                  ></textarea>
                  <div class="flex justify-end mt-2">
                     <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">{{ formData.description.length }} / 5000 Units</span>
                  </div>
                </div>

                <!-- Status Feedback -->
                @if (errorMessage()) {
                  <div class="p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-bold flex items-center gap-3 animate-fade-in">
                     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                     <span>{{ errorMessage() }}</span>
                  </div>
                }

                @if (successMessage()) {
                  <div class="p-4 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-bold flex items-center gap-3 animate-fade-in">
                     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                     <span>{{ successMessage() }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="flex justify-end gap-6 pt-6">
              <button
                type="button"
                routerLink="/helpdesk"
                class="btn-precision btn-secondary-precision px-10"
              >
                Abort
              </button>
              <button
                type="submit"
                [disabled]="isSubmitting() || !ticketForm.valid"
                class="btn-precision btn-primary-precision px-12"
              >
                @if (isSubmitting()) {
                  <span class="flex items-center gap-2">
                    <div class="loader-spinner-precision sm"></div>
                    Executing...
                  </span>
                } @else {
                  Execute Request
                }
              </button>
            </div>
          </form>
        </div>

        <!-- Ops Guidelines Sidebar -->
        <div class="space-y-8">
           <div class="stat-card-precision">
              <div class="mb-6 pb-4 border-b border-[var(--border-subtle)]">
                 <h3 class="text-[10px] font-black uppercase tracking-widest text-accent">Service Protocol</h3>
              </div>
              <p class="text-tertiary text-xs font-bold leading-relaxed mb-8 uppercase tracking-wider">Ensure all mission-critical data is included to maintain operational velocity.</p>
              
              <div class="space-y-4">
                 <div class="p-5 rounded-2xl bg-accent/5 border border-accent/10">
                    <span class="status-pill-precision overdue mb-3">CRITICAL</span>
                    <p class="text-[11px] font-black text-primary mb-1">Response: 60 MIN</p>
                    <p class="text-[9px] text-tertiary uppercase tracking-widest font-bold leading-tight">Total system failure or severe financial risk.</p>
                 </div>
                 <div class="p-5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
                    <span class="status-pill-precision pending mb-3">HIGH</span>
                    <p class="text-[11px] font-black text-primary mb-1">Response: 04 HR</p>
                    <p class="text-[9px] text-tertiary uppercase tracking-widest font-bold leading-tight">Major feature degradation or filing blockages.</p>
                 </div>
                 <div class="p-5 rounded-2xl bg-[var(--bg-surface-2)]/50 border border-[var(--border-subtle)]">
                    <span class="status-pill-precision synced mb-3">BASELINE</span>
                    <p class="text-[11px] font-black text-primary mb-1">Response: 24 HR</p>
                    <p class="text-[9px] text-tertiary uppercase tracking-widest font-bold leading-tight">Inquiries and non-critical optimizations.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
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
