import { Component, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="content-area animate-fade-in">
      
      <header class="mb-10">
        <div class="flex items-center justify-between gap-6">
          <div class="flex items-center gap-6">
            <a routerLink="/helpdesk" class="btn-precision btn-secondary-precision btn-sm px-3">
               <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
            </a>
            <div class="header-titles-complex">
              <h1 class="text-3xl font-black text-primary tracking-tight">
                Ticket <span class="text-accent">Intelligence</span>
              </h1>
              @if (ticket()) {
                 <p class="text-[var(--text-secondary)] mt-1 font-semibold tracking-wide uppercase text-[10px]">Transmission Reference: {{ ticket()?.ticket_number }}</p>
              }
            </div>
          </div>
          
          <div class="flex items-center gap-4">
             @if (ticket() && !['Resolved', 'Closed'].includes(ticket()!.status)) {
                <button (click)="updateStatus('Resolved')" class="btn-precision btn-primary-precision btn-sm">
                   Finalize Resolution
                </button>
             }
          </div>
        </div>
      </header>

      @if (helpdeskService.isLoading()) {
        <div class="py-20 flex justify-center">
          <div class="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        </div>
      } @else if (ticket()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Intelligence Thread -->
          <div class="lg:col-span-2 space-y-10">
              <!-- Master Directive Card -->
             <div class="stat-card-precision !p-0 overflow-hidden">
                <div class="flex justify-between items-center p-8 bg-[var(--bg-surface-2)]/50 border-b border-[var(--border-subtle)]">
                   <div>
                      <h2 class="text-2xl font-black text-primary leading-tight">{{ ticket()!.subject }}</h2>
                      <span class="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mt-2 block">{{ ticket()!.category }}</span>
                   </div>
                   <div class="flex gap-3">
                     <span class="status-pill-precision" [class]="getStatusClass(ticket()!.status)">
                       {{ ticket()!.status }}
                     </span>
                     <span class="status-pill-precision" [class]="getPriorityClass(ticket()!.priority)">
                       {{ ticket()!.priority }}
                     </span>
                   </div>
                </div>
                
                <div class="p-8">
                   <div class="bg-[var(--bg-surface-2)] p-8 rounded-2xl border border-[var(--border-subtle)] mb-10">
                      <p class="text-secondary font-semibold leading-relaxed whitespace-pre-wrap">{{ ticket()!.description }}</p>
                   </div>

                   <div class="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-[var(--border-subtle)]">
                      <div>
                         <span class="text-[9px] font-black text-tertiary uppercase tracking-widest block mb-1">Created</span>
                         <span class="text-primary font-black text-xs uppercase">{{ ticket()!.created_at | date:'dd MMM yyyy HH:mm' }}</span>
                      </div>
                      <div>
                         <span class="text-[9px] font-black text-tertiary uppercase tracking-widest block mb-1">Last Update</span>
                         <span class="text-primary font-black text-xs uppercase">{{ ticket()!.updated_at | date:'dd MMM yyyy HH:mm' }}</span>
                      </div>
                      <div>
                         <span class="text-[9px] font-black text-tertiary uppercase tracking-widest block mb-1">Origin Node</span>
                         <span class="text-primary font-black text-xs uppercase">PORTAL-MEMBER-CORE</span>
                      </div>
                   </div>
                </div>
             </div>

             <!-- Transmission Thread -->
             <div class="space-y-6">
                <div class="flex items-center gap-4 px-2">
                  <div class="h-px flex-1 bg-[var(--border-subtle)]"></div>
                  <h3 class="text-[10px] font-black text-tertiary uppercase tracking-[0.3em]">Communication Synchrony</h3>
                  <div class="h-px flex-1 bg-[var(--border-subtle)]"></div>
                </div>
                
                <div class="space-y-6">
                   @for (reply of ticket()!.replies; track reply.id) {
                      <div class="flex" [class.justify-end]="!reply.is_internal">
                         <div class="max-w-[85%] p-6 rounded-2xl border transition-all" 
                              [class]="reply.is_internal ? 'bg-[var(--bg-surface-2)] border-[var(--border-subtle)] shadow-sm' : 'bg-accent/5 border-accent/20 rounded-tr-none'">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-[9px] font-black uppercase tracking-widest" [class]="reply.is_internal ? 'text-accent' : 'text-primary'">
                                   {{ reply.is_internal ? 'Support Intelligence' : 'User' }}
                                </span>
                                <span class="text-[9px] font-bold text-tertiary">{{ reply.created_at | date:'shortTime' }}</span>
                            </div>
                            <p class="text-secondary font-semibold text-sm leading-relaxed whitespace-pre-wrap">{{ reply.reply_text }}</p>
                            <span class="text-[8px] font-black text-tertiary italic block mt-4 uppercase">{{ reply.created_at | date:'dd MMM yyyy' }}</span>
                         </div>
                      </div>
                   } @empty {
                      <div class="py-20 text-center opacity-30">
                         <p class="text-[10px] font-black uppercase tracking-widest">Awaiting primary transmission response</p>
                      </div>
                   }
                </div>

                <!-- Response Interface -->
                <div class="stat-card-precision mt-10 !p-8 border-t-4 border-accent">
                   <h4 class="text-[10px] font-black text-tertiary uppercase tracking-widest mb-6">Transmit Response</h4>
                   <textarea
                      [(ngModel)]="newReply"
                      placeholder="Compose secure transmission..."
                      rows="4"
                      class="w-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl py-4 px-6 text-sm font-black transition-all focus:border-accent outline-none resize-none"
                   ></textarea>
                   <div class="flex justify-end mt-6">
                      <button
                         (click)="submitReply()"
                         [disabled]="!newReply.trim() || isSubmitting()"
                         class="btn-precision btn-primary-precision px-10"
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
              <div class="stat-card-precision">
                 <div class="mb-6 pb-4 border-b border-[var(--border-subtle)]">
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-accent">SLA Telemetry</h3>
                 </div>
                 @if (slaInfo()) {
                    <div class="space-y-6">
                       <div class="p-5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
                          <span class="text-[9px] font-black text-tertiary uppercase tracking-widest block mb-1">Initial Handshake</span>
                          <span class="text-primary font-black text-lg">{{ slaInfo()!.response_time_hours }} Hours</span>
                       </div>
                       <div class="p-5 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
                          <span class="text-[9px] font-black text-tertiary uppercase tracking-widest block mb-1">Terminal Resolution</span>
                          <span class="text-primary font-black text-lg">{{ slaInfo()!.resolution_time_hours }} Hours</span>
                       </div>
                    </div>
                 }
              </div>

              <div class="stat-card-precision">
                 <div class="mb-6 pb-4 border-b border-[var(--border-subtle)]">
                    <h3 class="text-[10px] font-black uppercase tracking-widest text-tertiary">Operation Ledger</h3>
                 </div>
                 <div class="space-y-8 relative pl-6 border-l-2 border-[var(--border-subtle)] ml-2">
                    @for (event of ticket()!.history; track event.id) {
                       <div class="relative">
                          <div class="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-[var(--bg-card)] shadow-sm"></div>
                          <p class="text-primary font-black text-[11px] leading-tight mb-2 uppercase tracking-tight">{{ event.description }}</p>
                          <span class="text-tertiary font-bold text-[9px] uppercase tracking-widest font-mono">{{ event.changed_at | date:'dd MMM, HH:mm' }}</span>
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
      case 'Open': return 'online';
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
