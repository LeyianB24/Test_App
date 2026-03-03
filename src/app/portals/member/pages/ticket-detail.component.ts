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
    <div class="dashboard-precision animate-fade-in">
      
      <header class="header-precision mb-10">
        <div class="header-titles flex items-center gap-6">
          <a routerLink="/helpdesk" class="btn-precision btn-secondary-precision btn-sm px-3">
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
          </a>
          <div>
            <h1 class="title-primary">Ticket <span class="title-accent">Intelligence</span></h1>
            @if (ticket()) {
               <p class="subtitle-secondary uppercase tracking-[0.2em] text-white/40">Ref: {{ ticket()?.ticket_number }}</p>
            }
          </div>
        </div>
        
        <div class="header-actions">
           @if (ticket() && !['Resolved', 'Closed'].includes(ticket()!.status)) {
              <button (click)="updateStatus('Resolved')" class="btn-precision btn-primary-precision">
                 Finalize Resolution
              </button>
           }
        </div>
      </header>

      @if (helpdeskService.isLoading()) {
        <div class="loader-container-precision py-20">
          <div class="loader-spinner-precision"></div>
        </div>
      } @else if (ticket()) {
        <div class="dashboard-content-precision grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Intelligence Thread -->
          <div class="lg:col-span-2 space-y-10">
              <!-- Master Directive Card -->
             <div class="card-precision main-record-card-precision overflow-hidden pb-10">
                <div class="card-header-precision border-b border-white/5 pb-6 flex justify-between items-center bg-white/2 px-8 py-6">
                   <div class="header-identity">
                      <h2 class="text-2xl font-black text-white leading-tight">{{ ticket()!.subject }}</h2>
                      <span class="label-secondary text-[10px] uppercase text-white/30 tracking-widest font-black mt-1 block">{{ ticket()!.category }}</span>
                   </div>
                   <div class="header-status flex gap-3">
                     <span class="badge-precision" [class]="getStatusClass(ticket()!.status)">
                       {{ ticket()!.status }}
                     </span>
                     <span class="badge-precision" [class]="getPriorityClass(ticket()!.priority)">
                       {{ ticket()!.priority }}
                     </span>
                   </div>
                </div>
                
                <div class="card-body-precision px-8 pt-8">
                   <div class="record-description-box bg-dark-complex p-8 rounded-3xl border border-white/5 mb-10">
                      <p class="text-white/70 font-medium leading-relaxed whitespace-pre-wrap">{{ ticket()!.description }}</p>
                   </div>

                   <div class="record-meta-grid-precision grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                      <div class="meta-item">
                         <span class="label text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Created</span>
                         <span class="value text-white font-bold text-sm">{{ ticket()!.created_at | date:'dd MMM yyyy HH:mm' }}</span>
                      </div>
                      <div class="meta-item">
                         <span class="label text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Last Transmission</span>
                         <span class="value text-white font-bold text-sm">{{ ticket()!.updated_at | date:'dd MMM yyyy HH:mm' }}</span>
                      </div>
                      <div class="meta-item">
                         <span class="label text-[10px] font-black uppercase tracking-widest text-white/30 block mb-1">Origin</span>
                         <span class="value text-white font-bold text-sm">Portal Core</span>
                      </div>
                   </div>
                </div>
             </div>

             <!-- Transmission Thread -->
             <div class="thread-section-precision space-y-6">
                <h3 class="section-title-precision px-4">Communication Synchrony</h3>
                
                <div class="thread-stack-precision space-y-6">
                   @for (reply of ticket()!.replies; track reply.id) {
                      <div class="transmission-tile flex" [class.justify-end]="!reply.is_internal">
                         <div class="transmission-bubble max-w-[85%] p-6 rounded-[1.5rem] border" 
                              [class]="reply.is_internal ? 'bg-white/5 border-white/10 text-white/90' : 'bg-red-base/5 border-red-base/20 text-white rounded-tr-none'">
                            <div class="bubble-header flex justify-between items-center mb-3">
                                <span class="origin-tag text-[9px] font-black uppercase tracking-widest" [class.text-red-base]="reply.is_internal">
                                   {{ reply.is_internal ? 'Support Authority' : 'You' }}
                                </span>
                                <span class="time-tag text-[9px] font-bold text-white/30">{{ reply.created_at | date:'shortTime' }}</span>
                            </div>
                            <p class="transmission-text font-medium text-sm leading-relaxed whitespace-pre-wrap">{{ reply.reply_text }}</p>
                            <span class="date-tag text-[8px] font-bold text-white/10 block mt-4">{{ reply.created_at | date:'dd MMM yyyy' }}</span>
                         </div>
                      </div>
                   } @empty {
                      <div class="empty-thread-precision py-20 text-center opacity-30">
                         <p class="text-xs font-black uppercase tracking-widest">Awaiting primary transmission response.</p>
                      </div>
                   }
                </div>

                <!-- Response Interface -->
                <div class="card-precision response-interface-precision mt-8 p-8 border-t-2 border-red-base/20">
                   <h4 class="text-[10px] font-black text-white/30 uppercase tracking-widest mb-6">Transmit Response</h4>
                   <textarea
                      [(ngModel)]="newReply"
                      placeholder="Compose secure message..."
                      rows="4"
                      class="input-precision w-full resize-none p-6 text-white mb-6"
                   ></textarea>
                   <div class="flex justify-end">
                      <button
                         (click)="submitReply()"
                         [disabled]="!newReply.trim() || isSubmitting()"
                         class="btn-precision btn-primary-precision"
                      >
                         @if (isSubmitting()) {
                           <div class="loader-spinner-precision sm"></div>
                         } @else {
                           Execute Transmission
                         }
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Ops Analytics Sidebar -->
          <div class="space-y-8">
              <div class="card-precision ops-card-precision">
                 <div class="card-header-precision border-b border-white/5 pb-4 mb-6">
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">SLA Matrix</h3>
                 </div>
                 @if (slaInfo()) {
                    <div class="sla-metrics-precision space-y-6">
                       <div class="sla-item-precision bg-dark-complex p-5 rounded-2xl border border-white/5">
                          <span class="label text-[9px] font-black uppercase text-white/30 block mb-1">Response Threshold</span>
                          <span class="value text-white font-black text-lg">{{ slaInfo()!.response_time_hours }} Hours</span>
                       </div>
                       <div class="sla-item-precision bg-dark-complex p-5 rounded-2xl border border-white/5">
                          <span class="label text-[9px] font-black uppercase text-white/30 block mb-1">Resolution Deadline</span>
                          <span class="value text-white font-black text-lg">{{ slaInfo()!.resolution_time_hours }} Hours</span>
                       </div>
                    </div>
                 }
              </div>

              <div class="card-precision history-card-precision">
                 <div class="card-header-precision border-b border-white/5 pb-4 mb-6">
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-white/40">Operation Ledger</h3>
                 </div>
                 <div class="ledger-stack-precision space-y-6 relative pl-4 border-l border-white/5 ml-2">
                    @for (event of ticket()!.history; track event.id) {
                       <div class="ledger-entry-precision relative">
                          <div class="ledger-dot bg-red-base absolute -left-[21px] top-1.5 w-2 h-2 rounded-full shadow-glow-red"></div>
                          <p class="ledger-text text-white/70 font-bold text-[11px] leading-tight mb-2">{{ event.description }}</p>
                          <span class="ledger-time text-white/20 font-black text-[9px] uppercase tracking-widest">{{ event.changed_at | date:'dd MMM, HH:mm' }}</span>
                       </div>
                    }
                 </div>
              </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [``]
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
