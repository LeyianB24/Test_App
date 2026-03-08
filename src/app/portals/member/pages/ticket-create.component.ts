import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HelpdeskService } from '../../../services/helpdesk.service';

@Component({
  selector: 'app-ticket-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="dashboard-precision animate-fade-in">
      
      <header class="header-precision mb-10">
        <div class="header-titles flex items-center gap-6">
          <a routerLink="/helpdesk" class="btn-precision btn-secondary-precision btn-sm px-3">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
          </a>
          <div>
            <h1 class="title-primary">New <span class="title-accent">Directive</span></h1>
            <p class="subtitle-secondary uppercase tracking-[0.2em] text-white/40">Initiate technical support sequence</p>
          </div>
        </div>
      </header>

      <div class="dashboard-content-precision grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <form (ngSubmit)="submitForm()" #ticketForm="ngForm" class="space-y-10">
            <div class="card-precision main-record-card-precision p-10">
              
              <div class="form-stack-precision space-y-10">
                <!-- Subject -->
                <div class="form-group-precision">
                  <label class="label-precision">Operation Subject *</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.subject"
                    name="subject"
                    required
                    placeholder="Brief objective summary..."
                    class="input-precision input-xl-precision w-full"
                  />
                </div>

                <!-- Category & Priority -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="form-group-precision">
                    <label class="label-precision">Registry Category *</label>
                    <div class="input-wrapper-precision relative">
                      <select
                        [(ngModel)]="formData.category"
                        name="category"
                        required
                        class="input-precision w-full appearance-none"
                      >
                        <option value="" disabled selected>Select Registry...</option>
                        @for (cat of helpdeskService.categories(); track cat) {
                          <option [value]="cat">{{ cat }}</option>
                        }
                      </select>
                    </div>
                  </div>

                  <div class="form-group-precision">
                    <label class="label-precision">Tactical Priority *</label>
                    <div class="input-wrapper-precision relative">
                      <select
                        [(ngModel)]="formData.priority"
                        name="priority"
                        required
                        class="input-precision w-full appearance-none"
                      >
                        <option value="Low">Low - Baseline</option>
                        <option value="Medium">Medium - Standard</option>
                        <option value="High">High - Degraded</option>
                        <option value="Critical">Critical - Outage</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="form-group-precision">
                  <label class="label-precision">Objective Details *</label>
                  <textarea
                    [(ngModel)]="formData.description"
                    name="description"
                    required
                    placeholder="Provide full technical context..."
                    rows="6"
                    class="input-precision w-full resize-none pt-4"
                  ></textarea>
                  <div class="character-count-precision flex justify-end mt-2">
                     <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">{{ formData.description.length }} / 5000 Units</span>
                  </div>
                </div>

                <!-- Status Feedback -->
                @if (errorMessage()) {
                  <div class="error-state-precision animate-shake mt-4">
                     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                     <span>{{ errorMessage() }}</span>
                  </div>
                }

                @if (successMessage()) {
                  <div class="success-state-precision animate-fade-in mt-4">
                     <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                     <span>{{ successMessage() }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="form-actions-precision flex justify-end gap-6 pt-6">
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
                  <div class="loader-spinner-precision sm"></div>
                } @else {
                  Execute Request
                }
              </button>
            </div>
          </form>
        </div>

        <!-- Ops Guidelines Sidebar -->
        <div class="space-y-8">
           <div class="card-precision ops-card-precision">
              <div class="card-header-precision border-b border-white/5 pb-4 mb-6">
                 <h3 class="text-[10px] font-black uppercase tracking-widest text-red-base">Service Protocol</h3>
              </div>
              <p class="text-white/40 text-xs font-medium leading-relaxed mb-8">Ensure all mission-critical data is included to maintain operational velocity.</p>
              
              <div class="protocol-stack-precision space-y-4">
                 <div class="protocol-item-precision bg-red-base/10 p-5 rounded-2xl border border-red-base/20">
                    <span class="badge-precision badge-danger-precision mb-3">CRITICAL</span>
                    <p class="text-[11px] font-black text-white mb-1">Response: 60 MIN</p>
                    <p class="text-[9px] text-white/40 uppercase tracking-widest leading-tight">Total system failure or severe financial risk.</p>
                 </div>
                 <div class="protocol-item-precision bg-white/5 p-5 rounded-2xl border border-white/10">
                    <span class="badge-precision badge-warning-precision mb-3">HIGH</span>
                    <p class="text-[11px] font-black text-white mb-1">Response: 04 HR</p>
                    <p class="text-[9px] text-white/40 uppercase tracking-widest leading-tight">Major feature degradation or filing blockages.</p>
                 </div>
                 <div class="protocol-item-precision bg-white/2 p-5 rounded-2xl border border-white/5">
                    <span class="badge-precision badge-blue-precision mb-3">BASELINE</span>
                    <p class="text-[11px] font-black text-white mb-1">Response: 24 HR</p>
                    <p class="text-[9px] text-white/40 uppercase tracking-widest leading-tight">Inquiries and non-critical optimizations.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-shake { animation: shake 0.5s; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

    .badge-critical { background: var(--red-500); color: white; }
    .badge-high { background: var(--red-050); color: var(--red-500); border-color: var(--red-200); }
    .badge-progress { background: var(--status-info-bg); color: var(--status-info); border-color: var(--border-subtle); }
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
