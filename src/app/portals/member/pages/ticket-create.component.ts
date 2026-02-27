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
      <header class="mb-12">
        <div class="flex items-center gap-3 mb-4">
           <a routerLink="/helpdesk" class="text-blue-500 hover:text-blue-400 transition-colors">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7"/></svg>
           </a>
           <span class="text-slate-500 font-black uppercase text-[10px] tracking-widest">Support Portal</span>
        </div>
        <h1 class="text-5xl font-black text-white tracking-tighter mb-2">Initialize <span class="text-blue-500">Service Request</span></h1>
        <p class="text-slate-400 font-medium text-lg">Detailed documentation ensures rapid escalation and resolution</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <form (ngSubmit)="submitForm()" #ticketForm="ngForm" class="space-y-8">
            <div class="card-glass p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
              
              <!-- Subject -->
              <div class="space-y-3">
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Inquiry Subject *</label>
                <input
                  type="text"
                  [(ngModel)]="formData.subject"
                  name="subject"
                  required
                  placeholder="e.g., Transaction timeout on PRN 2026..."
                  class="w-full bg-white/5 border border-white/10 text-white px-8 py-5 rounded-3xl focus:border-blue-500 outline-none font-bold text-lg placeholder:text-slate-600 transition-all"
                />
              </div>

              <!-- Category & Priority Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Inquiry Category *</label>
                  <select
                    [(ngModel)]="formData.category"
                    name="category"
                    required
                    class="w-full bg-white/5 border border-white/10 text-slate-300 px-8 py-5 rounded-3xl focus:border-blue-500 outline-none font-bold appearance-none transition-all"
                  >
                    <option value="" disabled selected>Classification...</option>
                    @for (cat of helpdeskService.categories(); track cat) {
                      <option [value]="cat">{{ cat }}</option>
                    }
                  </select>
                </div>

                <div class="space-y-3">
                  <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Operational Priority *</label>
                  <select
                    [(ngModel)]="formData.priority"
                    name="priority"
                    required
                    class="w-full bg-white/5 border border-white/10 text-slate-300 px-8 py-5 rounded-3xl focus:border-blue-500 outline-none font-bold appearance-none transition-all"
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
                <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Comprehensive Description *</label>
                <textarea
                  [(ngModel)]="formData.description"
                  name="description"
                  required
                  placeholder="Describe the issue, including sequence of events and any error codes displayed."
                  rows="6"
                  class="w-full bg-white/5 border border-white/10 text-white px-8 py-6 rounded-[2rem] focus:border-blue-500 outline-none font-medium text-base placeholder:text-slate-600 transition-all"
                ></textarea>
                <div class="flex justify-end pr-4">
                   <span class="text-[10px] font-bold text-slate-500">{{ formData.description.length }}/5000 characters</span>
                </div>
              </div>

              @if (errorMessage()) {
                <div class="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-bold flex items-center gap-3 animate-shake">
                   <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                   {{ errorMessage() }}
                </div>
              }

              @if (successMessage()) {
                <div class="p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl font-bold flex items-center gap-3 animate-fade-in">
                   <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7"/></svg>
                   {{ successMessage() }}
                </div>
              }
            </div>

            <div class="flex justify-end gap-6 pt-6">
              <button
                type="button"
                routerLink="/helpdesk"
                class="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="isSubmitting() || !ticketForm.valid"
                class="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:bg-slate-800 transition-all shadow-xl shadow-blue-600/20"
              >
                {{ isSubmitting() ? 'Transmitting...' : 'Initialize Secure Request' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Sidebar Guidelines -->
        <div class="space-y-8">
           <div class="card-glass p-8 rounded-[3rem] border border-white/5 space-y-6">
              <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Operational protocol</h3>
              <p class="text-slate-400 text-sm font-medium leading-relaxed">Ensure all sensitive data is redacted from screenshots. Support response times are governed by the Tier-1 SLA Agreement.</p>
              
              <div class="space-y-4">
                 <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span class="badge-elite badge-critical mb-2">Critical</span>
                    <p class="text-xs font-bold text-white mb-1">1 Hour Response</p>
                    <p class="text-[10px] text-slate-500">Total system failure or severe financial risk.</p>
                 </div>
                 <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span class="badge-elite badge-high mb-2">High</span>
                    <p class="text-xs font-bold text-white mb-1">4 Hour Response</p>
                    <p class="text-[10px] text-slate-500">Major feature degradation or filing blockages.</p>
                 </div>
                 <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <span class="badge-elite badge-progress mb-2">Medium</span>
                    <p class="text-xs font-bold text-white mb-1">24 Hour Response</p>
                    <p class="text-[10px] text-slate-500">Standard business inquiries or non-critical bugs.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    .animate-shake { animation: shake 0.5s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }

    .card-glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); }
    
    .badge-elite { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 0.6rem; font-weight: 950; text-transform: uppercase; }
    .badge-critical { background: #E31E24; color: white; }
    .badge-high { background: rgba(227, 30, 36, 0.1); color: #E31E24; border: 1px solid rgba(227, 30, 36, 0.2); }
    .badge-progress { background: rgba(245, 158, 11, 0.1); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.2); }
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
      this.errorMessage.set('MANDATORY: Fill in all required fields.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.helpdeskService.createTicket(this.formData).subscribe({
      next: (response) => {
        this.successMessage.set(`SUCCESS: Ticket ${response.ticket_number} created in the master ledger.`);
        setTimeout(() => {
          this.router.navigate(['/helpdesk', response.ticket_id]);
        }, 1500);
      },
      error: (err) => {
        this.errorMessage.set(err || 'TRANSMISSION FAILED: Could not initiate request.');
        this.isSubmitting.set(false);
      }
    });
  }
}
