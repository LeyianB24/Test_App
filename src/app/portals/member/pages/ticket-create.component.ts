import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HelpdeskService } from '../../../services/helpdesk.service';

@Component({
  selector: 'app-ticket-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <!-- Elite Header -->
      <header class="page-header-elite items-center mb-8">
        <div class="header-info flex items-center gap-4">
           <a routerLink="/helpdesk" class="icon-btn-elite">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
           </a>
           <div>
              <span class="text-slate-500 font-black uppercase text-[10px] tracking-widest pl-1 block mb-1">Support Portal</span>
              <h1 class="premium-title mb-0">Create <span class="gradient-text">Ticket</span></h1>
              <p class="premium-subtitle pl-0 mt-1">Provide details about your issue for quick resolution</p>
           </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <form (ngSubmit)="submitForm()" #ticketForm="ngForm" class="space-y-8">
            <div class="content-card-premium shadow-xl space-y-8">
              
              <!-- Subject -->
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Subject *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.subject"
                  name="subject"
                  required
                  placeholder="Briefly describe the issue..."
                  class="search-input-elite w-full font-bold text-lg"
                />
              </div>

              <!-- Category & Priority Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Category *</label>
                  <select
                    [(ngModel)]="formData.category"
                    name="category"
                    required
                    class="search-input-elite w-full font-bold appearance-none py-4"
                  >
                    <option value="" disabled selected>Select Category...</option>
                    @for (cat of helpdeskService.categories(); track cat) {
                      <option [value]="cat">{{ cat }}</option>
                    }
                  </select>
                </div>

                <div class="space-y-3">
                  <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Priority *</label>
                  <select
                    [(ngModel)]="formData.priority"
                    name="priority"
                    required
                    class="search-input-elite w-full font-bold appearance-none py-4"
                  >
                    <option value="Low">Low - Informational</option>
                    <option value="Medium">Medium - Standard Inquiry</option>
                    <option value="High">High - System Degradation</option>
                    <option value="Critical">Critical - Full Outage / Data Loss</option>
                  </select>
                </div>
              </div>

              <!-- Description -->
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Description *</label>
                <textarea
                  [(ngModel)]="formData.description"
                  name="description"
                  required
                  placeholder="Describe the issue in detail..."
                  rows="6"
                  class="search-input-elite w-full font-medium text-base resize-none"
                ></textarea>
                <div class="flex justify-end pr-4">
                   <span class="text-[10px] font-bold text-slate-400">{{ formData.description.length }}/5000 characters</span>
                </div>
              </div>

              @if (errorMessage()) {
                <div class="p-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold flex items-center gap-3 animate-shake">
                   <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                   {{ errorMessage() }}
                </div>
              }

              @if (successMessage()) {
                <div class="p-6 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl font-bold flex items-center gap-3 animate-fade-in">
                   <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg>
                   {{ successMessage() }}
                </div>
              }
            </div>

            <div class="flex justify-end gap-4 pt-6">
              <button
                type="button"
                routerLink="/helpdesk"
                class="modern-btn outline-btn uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="isSubmitting() || !ticketForm.valid"
                class="modern-btn primary-btn uppercase tracking-widest text-xs py-4 px-10"
              >
                {{ isSubmitting() ? 'Submitting...' : 'Create Ticket' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Sidebar Guidelines -->
        <div class="space-y-8">
           <div class="content-card-premium space-y-6">
              <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Support Guidelines</h3>
              <p class="text-slate-600 text-sm font-medium leading-relaxed mb-6">Please provide as much clear information as possible to help us resolve your issue quickly.</p>
              
              <div class="space-y-4">
                 <div class="p-4 bg-red-50 rounded-2xl border border-red-100">
                    <span class="badge-elite badge-critical mb-2">Critical</span>
                    <p class="text-xs font-bold text-red-800 mb-1">1 Hour Response</p>
                    <p class="text-[10px] text-red-600">Total system failure or severe financial risk.</p>
                 </div>
                 <div class="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <span class="badge-elite badge-high mb-2">High</span>
                    <p class="text-xs font-bold text-orange-800 mb-1">4 Hour Response</p>
                    <p class="text-[10px] text-orange-600">Major feature degradation or filing blockages.</p>
                 </div>
                 <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <span class="badge-elite badge-progress mb-2">Medium</span>
                    <p class="text-xs font-bold text-blue-800 mb-1">24 Hour Response</p>
                    <p class="text-[10px] text-blue-600">Standard business inquiries or non-critical bugs.</p>
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

    .badge-elite { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.6rem; font-weight: 950; text-transform: uppercase; border: 1px solid transparent; }
    .badge-critical { background: #E31E24; color: white; }
    .badge-high { background: rgba(227, 30, 36, 0.1); color: #E31E24; border-color: rgba(227, 30, 36, 0.2); }
    .badge-progress { background: rgba(59, 130, 246, 0.1); color: #3B82F6; border-color: rgba(59, 130, 246, 0.2); }
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
