import { inject, Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ticket-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="content-area animate-fade-in">
      
      <!-- Elite Header -->
      <header class="mb-10">
        <div class="flex items-center justify-between gap-6">
          <div class="flex items-center gap-6">
            <a routerLink="/helpdesk/tickets" class="btn-precision btn-secondary-precision btn-sm px-3">
               <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
            </a>
            <div class="header-titles-complex">
              <h1 class="text-3xl font-black text-primary tracking-tight">
                Case <span class="text-accent">Management</span>
              </h1>
              @if (ticket) {
                 <p class="text-[var(--text-secondary)] mt-1 font-semibold tracking-wide uppercase text-[10px]">Reference: {{ ticket.ticket_number }} • Support Cluster</p>
              }
            </div>
          </div>
          
          <div class="flex items-center gap-4">
             @if (ticket && !['Resolved', 'Closed'].includes(ticket.status)) {
                <button (click)="updateStatus('Resolved')" class="btn-precision btn-primary-precision btn-sm px-8">
                   Finalize Resolution
                </button>
             }
          </div>
        </div>
      </header>

      @if (helpdeskService.isLoading()) {
        <div class="py-20 flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <p class="text-[10px] font-black text-tertiary uppercase tracking-widest">Synchronizing Case Data...</p>
        </div>
      } @else if (ticket) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Thread -->
          <div class="lg:col-span-2 space-y-12">
              <!-- Ticket Master Card -->
             <div class="stat-card-precision !p-0 overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50"></div>
                
                <div class="p-8 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)] relative z-10">
                  <div class="flex flex-wrap gap-4 mb-8">
                     <span class="status-pill-precision" [class]="getStatusEliteClass(ticket.status)">
                       {{ ticket.status }}
                     </span>
                     <span class="status-pill-precision" [class]="getPriorityEliteClass(ticket.priority)">
                       {{ ticket.priority }}
                     </span>
                     <span class="px-4 py-1 rounded-lg bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[10px] font-black text-tertiary uppercase tracking-widest">{{ ticket.category }}</span>
                  </div>
                  <h2 class="text-3xl font-black text-primary leading-tight tracking-tight">{{ ticket.subject }}</h2>
                </div>
                
                <div class="p-8 relative z-10">
                   <div class="bg-[var(--bg-surface-2)] p-10 rounded-2xl border border-[var(--border-subtle)] mb-10 shadow-inner">
                      <p class="text-secondary font-semibold leading-relaxed whitespace-pre-wrap">{{ ticket.description }}</p>
                   </div>

                   <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-[var(--border-subtle)]">
                      <div>
                         <span class="text-[9px] font-black text-tertiary uppercase tracking-widest block mb-1">Created On</span>
                         <span class="text-primary font-black text-xs uppercase">{{ ticket.created_at | date:'dd MMM yyyy HH:mm' }}</span>
                      </div>
                      <div>
                         <span class="text-[9px] font-black text-tertiary uppercase tracking-widest block mb-1">Origin Unit</span>
                         <span class="text-primary font-black text-xs uppercase">{{ ticket.created_by }}</span>
                      </div>
                      <div>
                         <span class="text-[9px] font-black text-tertiary uppercase tracking-widest block mb-1">SLA Identifier</span>
                         <span class="text-primary font-black text-xs uppercase">#{{ ticket.ticket_number }}</span>
                      </div>
                      <div>
                         <span class="text-[9px] font-black text-tertiary uppercase tracking-widest block mb-1">Status Protocol</span>
                         <span class="text-primary font-black text-xs uppercase">{{ ticket.status }}</span>
                      </div>
                   </div>
                </div>
             </div>

             <!-- Conversation Thread -->
             <div class="space-y-8">
                <div class="flex items-center gap-4 px-2">
                  <div class="h-px flex-1 bg-[var(--border-subtle)]"></div>
                  <h3 class="text-[10px] font-black text-tertiary uppercase tracking-[0.3em]">Communication Synchrony</h3>
                  <div class="h-px flex-1 bg-[var(--border-subtle)]"></div>
                </div>
                
                <div class="space-y-8 pb-10">
                   @for (reply of (ticket.replies || []); track reply.id) {
                      <div class="flex" [class.justify-end]="!reply.is_internal">
                         <div class="max-w-[85%] p-8 rounded-2xl border transition-all" 
                              [class]="reply.is_internal ? 'bg-[var(--bg-surface-2)] border-[var(--border-subtle)] shadow-sm' : 'bg-[var(--text-primary)] border-none text-white rounded-tr-none'">
                            
                            <div class="flex items-center justify-between mb-4">
                               <div class="flex items-center gap-3">
                                  <div class="w-1.5 h-1.5 rounded-full" [class]="reply.is_internal ? 'bg-accent' : 'bg-success'"></div>
                                  <span class="text-[10px] font-black uppercase tracking-widest" [class]="reply.is_internal ? 'text-accent' : 'text-white/60'">
                                     {{ reply.is_internal ? 'Admin Authority' : 'External User' }}
                                  </span>
                               </div>
                               <span class="text-[9px] font-bold text-tertiary">{{ reply.created_at | date:'shortTime' }}</span>
                            </div>
                            
                            <p class="font-semibold text-sm leading-relaxed whitespace-pre-wrap" [class]="reply.is_internal ? 'text-secondary' : 'text-white'">{{ reply.reply_text }}</p>
                            
                            <span class="text-[8px] font-black uppercase italic mt-6 block opacity-40">{{ reply.created_at | date:'dd MMM yyyy' }}</span>
                         </div>
                      </div>
                   } @empty {
                      <div class="py-20 text-center opacity-30">
                         <p class="text-[10px] font-black uppercase tracking-widest">Awaiting primary transmission response</p>
                      </div>
                   }
                </div>

                <!-- Admin Action Composer -->
                <div class="stat-card-precision !p-8 border-t-4 border-accent shadow-2xl">
                   <div class="flex items-center gap-4 mb-8">
                      <div class="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                         <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </div>
                      <div>
                         <h4 class="text-[10px] font-black text-tertiary uppercase tracking-widest">Transmit Command</h4>
                         <p class="text-[11px] font-black text-primary uppercase mt-1">Append reply or internal annotation</p>
                      </div>
                   </div>
                   <textarea
                      [(ngModel)]="newReply"
                      placeholder="Compose response protocol..."
                      rows="5"
                      class="w-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl py-6 px-8 text-sm font-black transition-all focus:border-accent outline-none resize-none shadow-inner"
                   ></textarea>
                   
                   <div class="flex items-center justify-between mt-8">
                      <label class="flex items-center gap-3 cursor-pointer group">
                         <div class="relative w-12 h-6 bg-[var(--bg-surface-2)] rounded-full border border-[var(--border-subtle)] transition-colors">
                            <input type="checkbox" class="sr-only peer" [(ngModel)]="isInternalOnly">
                            <div class="absolute left-1 top-1 w-4 h-4 bg-tertiary rounded-full transition-all peer-checked:translate-x-6 peer-checked:bg-accent"></div>
                         </div>
                         <span class="text-[10px] font-black text-tertiary uppercase tracking-widest">Internal Directive Only</span>
                      </label>
                      
                      <button
                         (click)="submitReply()"
                         [disabled]="!newReply.trim() || isSubmitting"
                         class="btn-precision btn-primary-precision px-12"
                      >
                         @if (isSubmitting) {
                           <div class="loader-spinner-precision sm mr-2"></div>
                         }
                         {{ isSubmitting ? 'TRANSMITTING...' : 'EXECUTE RESPONSE' }}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Sidebar Analytics & Control -->
          <div class="space-y-10">
              <!-- Quick Triage -->
              <div class="stat-card-precision">
                  <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-8">Quick Protocols</h3>
                  <div class="space-y-4">
                    @if (ticket.status !== 'In Progress') {
                      <button (click)="updateStatus('In Progress')" class="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:border-warning hover:bg-warning/5 transition-all text-left group">
                         <div class="w-10 h-10 rounded-lg bg-[var(--bg-card)] text-tertiary flex items-center justify-center group-hover:bg-warning group-hover:text-white transition-all">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                         </div>
                         <div>
                            <span class="text-[11px] font-black text-primary block uppercase">Initiate Processing</span>
                            <p class="text-[9px] text-tertiary font-black uppercase tracking-widest mt-1">Set to In Progress</p>
                         </div>
                      </button>
                    }
                    @if (ticket.status !== 'Waiting for Customer') {
                      <button (click)="updateStatus('Waiting for Customer')" class="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] hover:border-blue-500 hover:bg-blue-500/5 transition-all text-left group">
                         <div class="w-10 h-10 rounded-lg bg-[var(--bg-card)] text-tertiary flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                         </div>
                         <div>
                            <span class="text-[11px] font-black text-primary block uppercase">Query Feedback</span>
                            <p class="text-[9px] text-tertiary font-black uppercase tracking-widest mt-1">Wait for sync</p>
                         </div>
                      </button>
                    }
                    <button class="w-full flex items-center gap-4 p-4 rounded-xl border border-accent/10 bg-accent/5 hover:bg-accent hover:text-white transition-all text-left group">
                       <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                       </div>
                       <div>
                          <span class="text-[11px] font-black block uppercase">Purge Directive</span>
                          <p class="text-[9px] opacity-60 font-black uppercase tracking-widest mt-1">Terminal Deletion</p>
                       </div>
                    </button>
                  </div>
              </div>

              <!-- Service Level Analysis -->
              @if (slaInfo) {
              <div class="stat-card-precision">
                 <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-8">SLA Telemetry</h3>
                 <div class="space-y-6">
                    <div class="flex items-center gap-5 p-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
                       <div class="w-12 h-12 bg-[var(--bg-card)] rounded-xl flex items-center justify-center text-success border border-[var(--border-subtle)] shadow-sm">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       </div>
                       <div>
                          <span class="text-[10px] font-black uppercase tracking-widest text-tertiary block mb-1">Response Window</span>
                          <span class="text-primary font-black text-lg">{{ slaInfo.response_time_hours }} <span class="text-xs font-bold text-tertiary">HR</span></span>
                       </div>
                    </div>
                    <div class="flex items-center gap-5 p-4 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
                       <div class="w-12 h-12 bg-[var(--bg-card)] rounded-xl flex items-center justify-center text-blue-500 border border-[var(--border-subtle)] shadow-sm">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       </div>
                       <div>
                          <span class="text-[10px] font-black uppercase tracking-widest text-tertiary block mb-1">Resolution Window</span>
                          <span class="text-primary font-black text-lg">{{ slaInfo.resolution_time_hours }} <span class="text-xs font-bold text-tertiary">HR</span></span>
                       </div>
                    </div>
                 </div>
              </div>
              }

              <!-- Event Log -->
              @if (ticket.history && ticket.history.length > 0) {
              <div class="stat-card-precision">
                 <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-tertiary mb-8">Operation Ledger</h3>
                 <div class="space-y-8 relative pl-6 border-l-2 border-[var(--border-subtle)] ml-2">
                    @for (event of ticket.history; track event.id) {
                       <div class="relative">
                          <div class="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-[var(--bg-card)]"></div>
                          <p class="text-primary font-black text-[11px] leading-tight mb-2 uppercase tracking-tight">{{ event.description }}</p>
                          <div class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-tertiary font-mono">
                             <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                             {{ event.changed_at | date:'HH:mm' }} • {{ event.changed_at | date:'dd MMM' }}
                          </div>
                       </div>
                    }
                 </div>
              </div>
              }
          </div>
        </div>
      }
    </div>
  `,
  styles: [``]
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  ticket: Ticket | null = null;
  slaInfo: any = null;
  newReply = '';
  isInternalOnly = false;
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  private route = inject(ActivatedRoute);
  public helpdeskService = inject(HelpdeskService);
  constructor() {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const ticketId = parseInt(params['id'], 10);
      this.loadTicket(ticketId);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTicket(ticketId: number): void {
    this.helpdeskService.getTicket(ticketId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ticket) => {
          this.ticket = ticket;
          this.slaInfo = this.helpdeskService.getSLAForPriority(ticket.priority);
        }
      });
  }

  submitReply(): void {
    if (!this.newReply.trim() || !this.ticket) return;

    this.isSubmitting = true;
    this.helpdeskService.addReply(this.ticket.id, this.newReply, this.isInternalOnly)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.newReply = '';
          this.isInternalOnly = false;
          this.isSubmitting = false;
          this.loadTicket(this.ticket!.id);
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
  }

  updateStatus(newStatus: string): void {
    if (!this.ticket) return;

    this.helpdeskService.updateTicket(this.ticket.id, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadTicket(this.ticket!.id);
        }
      });
  }

  getStatusEliteClass(status: string): string {
    switch (status) {
      case 'Open': return 'online';
      case 'In Progress': return 'pending';
      case 'Waiting for Customer': return 'overdue';
      case 'Resolved': return 'active';
      default: return 'synced';
    }
  }

  getPriorityEliteClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'error';
      case 'High': return 'pending';
      case 'Medium': return 'active';
      case 'Low': return 'synced';
      default: return 'synced';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
