import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ticket-detail',
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
              <h1 class="premium-title mb-0">Ticket Details</h1>
              @if (ticket()) {
                 <p class="premium-subtitle pl-0 mt-1">Ref: {{ ticket()?.ticket_number }}</p>
              }
           </div>
        </div>
        
        <div class="header-actions">
           @if (ticket() && !['Resolved', 'Closed'].includes(ticket()!.status)) {
              <button (click)="updateStatus('Resolved')" class="modern-btn primary-btn sm">
                 Mark as Resolved
              </button>
           }
        </div>
      </header>

      @if (helpdeskService.isLoading()) {
        <div class="py-20 flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p class="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading secure record...</p>
        </div>
      } @else if (ticket()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Main Thread -->
          <div class="lg:col-span-2 space-y-10">
              <!-- Ticket Master Card -->
             <div class="content-card-premium relative overflow-hidden mb-8">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50"></div>
                
                <div class="flex flex-wrap gap-4 mb-8 relative z-10">
                   <div class="status-pill-elite" [class]="getStatusClass(ticket()!.status)">
                     <span class="dot"></span>
                     {{ ticket()!.status }}
                   </div>
                   <div class="status-pill-elite" [class]="getPriorityClass(ticket()!.priority)">
                     <span class="dot"></span>
                     {{ ticket()!.priority }}
                   </div>
                   <span class="badge-elite bg-slate-100 text-slate-500 border-none">{{ ticket()!.category }}</span>
                </div>

                <h2 class="text-3xl font-black text-slate-800 mb-6 leading-tight">{{ ticket()!.subject }}</h2>
                
                <div class="p-8 bg-slate-50/80 rounded-3xl border border-slate-200 mb-10">
                   <p class="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{{ ticket()!.description }}</p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
                   <div>
                      <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Created</span>
                      <span class="text-slate-800 font-bold text-sm">{{ ticket()!.created_at | date:'medium' }}</span>
                   </div>
                   <div>
                      <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Last Update</span>
                      <span class="text-slate-800 font-bold text-sm">{{ ticket()!.updated_at | date:'medium' }}</span>
                   </div>
                </div>
             </div>

             <!-- Conversation Thread -->
             <div class="space-y-6">
                <h3 class="text-xl font-black text-slate-800 px-4">Communication History</h3>
                
                <div class="thread px-4 space-y-6">
                   @for (reply of ticket()!.replies; track reply.id) {
                      <div class="flex gap-4" [class.justify-end]="!reply.is_internal">
                         <div class="max-w-[80%] p-6 rounded-[2rem] border shadow-sm" 
                              [class]="reply.is_internal ? 'bg-white border-slate-200 text-slate-700' : 'bg-red-50 border-red-100 text-slate-800 rounded-tr-none'">
                            @if (reply.is_internal) {
                               <span class="text-[9px] font-black uppercase tracking-widest text-red-500 block mb-2">Official Response</span>
                            }
                            <p class="font-medium text-sm leading-relaxed whitespace-pre-wrap flex-grow">{{ reply.reply_text }}</p>
                            <span class="text-[9px] font-bold opacity-50 block mt-4">{{ reply.created_at | date:'short' }}</span>
                         </div>
                      </div>
                   } @empty {
                      <div class="text-center py-10 opacity-60">
                         <p class="text-sm font-bold uppercase tracking-widest text-slate-500">No replies yet. Awaiting official review.</p>
                      </div>
                   }
                </div>

                <!-- Reply Composer -->
                <div class="content-card-premium mt-8 shadow-md">
                   <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 pl-2">Add Reply</h4>
                   <textarea
                      [(ngModel)]="newReply"
                      placeholder="Type your message to the support team..."
                      rows="4"
                      class="search-input-elite w-full resize-none p-6 font-medium mb-6 transition-all"
                   ></textarea>
                   <div class="flex justify-end">
                      <button
                         (click)="submitReply()"
                         [disabled]="!newReply.trim() || isSubmitting()"
                         class="modern-btn primary-btn"
                      >
                         {{ isSubmitting() ? 'Transmitting...' : 'Send Message' }}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Sidebar Analytics -->
          <div class="space-y-8">
              <div class="content-card-premium">
                 <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Service Level Agreement</h3>
                 @if (slaInfo()) {
                    <div class="space-y-6">
                       <div class="flex items-center gap-4">
                          <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xs">RT</div>
                          <div>
                             <span class="text-[9px] font-black uppercase text-slate-500 block">Response Target</span>
                             <span class="text-slate-800 font-black">{{ slaInfo()!.response_time_hours }} Hours</span>
                          </div>
                       </div>
                       <div class="flex items-center gap-4">
                          <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">RS</div>
                          <div>
                             <span class="text-[9px] font-black uppercase text-slate-500 block">Resolution Target</span>
                             <span class="text-slate-800 font-black">{{ slaInfo()!.resolution_time_hours }} Hours</span>
                          </div>
                       </div>
                    </div>
                 }
              </div>

              <div class="content-card-premium">
                 <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Internal History</h3>
                 <div class="space-y-4">
                    @for (event of ticket()!.history; track event.id) {
                       <div class="flex gap-3 text-[11px]">
                          <div class="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5"></div>
                          <div>
                             <p class="text-slate-700 font-bold leading-tight mb-1">{{ event.description }}</p>
                             <span class="text-slate-500 font-medium">{{ event.changed_at | date:'short' }}</span>
                          </div>
                       </div>
                    }
                 </div>
              </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 1500px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .card-glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); }
    
    .badge-elite { padding: 4px 12px; border-radius: 8px; font-size: 0.65rem; font-weight: 950; text-transform: uppercase; border: 1px solid transparent; }
    .badge-open { color: #3B82F6; background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); }
    .badge-progress { color: #F59E0B; background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.2); }
    .badge-waiting { color: #F97316; background: rgba(249, 115, 22, 0.1); border-color: rgba(249, 115, 22, 0.2); }
    .badge-resolved { color: #10B981; background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); }
    .badge-critical { color: white; background: #E31E24; }
    .badge-high { color: #E31E24; background: rgba(227, 30, 36, 0.1); border-color: rgba(227, 30, 36, 0.2); }
  `]
})
export class TicketDetailComponent {
  private route = inject(ActivatedRoute);
  public helpdeskService = inject(HelpdeskService);

  ticketId = toSignal(this.route.params.pipe(map(p => parseInt(p['id'], 10))));
  ticket = this.helpdeskService.currentTicket;
  
  slaInfo = computed(() => {
    const t = this.ticket();
    return t ? this.helpdeskService.getSLAForPriority(t.priority) : null;
  });

  newReply = '';
  isSubmitting = signal(false);

  constructor() {
    effect(() => {
      const id = this.ticketId();
      if (id) {
        this.helpdeskService.getTicket(id).subscribe();
      }
    });
  }

  submitReply(): void {
    const id = this.ticketId();
    if (!this.newReply.trim() || !id) return;

    this.isSubmitting.set(true);
    this.helpdeskService.addReply(id, this.newReply).subscribe({
      next: () => {
        this.newReply = '';
        this.isSubmitting.set(false);
        this.helpdeskService.getTicket(id).subscribe();
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  updateStatus(newStatus: string): void {
    const id = this.ticketId();
    if (!id) return;

    this.helpdeskService.updateTicket(id, { status: newStatus }).subscribe({
      next: () => this.helpdeskService.getTicket(id).subscribe()
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open': return 'synced';
      case 'In Progress': return 'pending';
      case 'Waiting for Customer': return 'overdue';
      case 'Resolved': return 'active';
      default: return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'pending';
      default: return 'synced';
    }
  }
}
import { map } from 'rxjs/operators';
