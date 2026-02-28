import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../../../services/helpdesk.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
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
              <h1 class="premium-title mb-0">Case <span class="gradient-text">Management</span></h1>
              @if (ticket) {
                 <p class="premium-subtitle pl-0 mt-1">Ref: {{ ticket.ticket_number }} • System Integrity</p>
              }
           </div>
        </div>
        
        <div class="header-actions flex gap-3">
           @if (ticket && !['Resolved', 'Closed'].includes(ticket.status)) {
              <button (click)="updateStatus('Resolved')" class="modern-btn primary-btn sm">
                 Finalize Case
              </button>
           }
        </div>
      </header>

      @if (helpdeskService.isLoading()) {
        <div class="py-20 flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
          <p class="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving secure records...</p>
        </div>
      } @else if (ticket) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Main Thread -->
          <div class="lg:col-span-2 space-y-10">
              <!-- Ticket Master Card -->
             <div class="content-card-premium relative overflow-hidden mb-8">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50"></div>
                
                <div class="flex flex-wrap gap-4 mb-8 relative z-10">
                   <div class="status-pill-elite" [class]="getStatusEliteClass(ticket.status)">
                     <span class="dot"></span>
                     {{ ticket.status }}
                   </div>
                   <div class="status-pill-elite" [class]="getPriorityEliteClass(ticket.priority)">
                     <span class="dot"></span>
                     {{ ticket.priority }}
                   </div>
                   <span class="badge-elite bg-slate-100 text-slate-500 border-none">{{ ticket.category }}</span>
                </div>

                <h2 class="text-3xl font-black text-slate-800 mb-6 leading-tight">{{ ticket.subject }}</h2>
                
                <div class="p-8 bg-slate-50/80 rounded-3xl border border-slate-200 mb-10">
                   <p class="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{{ ticket.description }}</p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
                   <div>
                      <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Created</span>
                      <span class="text-slate-800 font-bold text-sm">{{ ticket.created_at | date:'medium' }}</span>
                   </div>
                   <div>
                      <span class="text-slate-800 font-bold text-sm">Issuer ID: {{ ticket.created_by }}</span>
                   </div>
                   <div>
                      <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Reference</span>
                      <span class="text-slate-800 font-bold text-sm">#{{ ticket.ticket_number }}</span>
                   </div>
                </div>
             </div>

             <!-- Conversation Thread -->
             <div class="space-y-6">
                <h3 class="text-xl font-black text-slate-800 px-4">Intervention Thread</h3>
                
                <div class="thread px-4 space-y-6">
                   @for (reply of (ticket.replies || []); track reply.id) {
                      <div class="flex gap-4" [class.justify-end]="!reply.is_internal">
                         <div class="max-w-[80%] p-6 rounded-[2rem] border shadow-sm" 
                              [class]="reply.is_internal ? 'bg-red-50 border-red-100 text-slate-800 rounded-tl-none' : 'bg-white border-slate-200 text-slate-700 rounded-tr-none'">
                            @if (reply.is_internal) {
                               <span class="text-[9px] font-black uppercase tracking-widest text-red-600 block mb-2">Internal Admin Action</span>
                            } @else {
                               <span class="text-[9px] font-black uppercase tracking-widest text-blue-600 block mb-2">Taxpayer Statement</span>
                            }
                            <p class="font-medium text-sm leading-relaxed whitespace-pre-wrap flex-grow">{{ reply.reply_text }}</p>
                            <span class="text-[9px] font-bold opacity-50 block mt-4">{{ reply.created_at | date:'short' }}</span>
                         </div>
                      </div>
                   } @empty {
                      <div class="text-center py-10 opacity-60">
                         <p class="text-sm font-bold uppercase tracking-widest text-slate-500">No active interventions recorded.</p>
                      </div>
                   }
                </div>

                <!-- Admin Action Composer -->
                <div class="content-card-premium mt-8 shadow-xl">
                   <div class="flex items-center gap-2 mb-4 pl-2">
                      <div class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                      <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest">Execute Official Action</h4>
                   </div>
                   <textarea
                      [(ngModel)]="newReply"
                      placeholder="Enter official resolution or internal directive..."
                      rows="4"
                      class="search-input-elite w-full resize-none p-6 font-medium mb-6 transition-all"
                   ></textarea>
                   <div class="flex justify-between items-center">
                      <div class="flex gap-4">
                         <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="w-4 h-4 rounded text-red-600 focus:ring-red-500">
                            <span class="text-[10px] font-bold text-slate-500 uppercase">Internal Only</span>
                         </label>
                      </div>
                      <button
                         (click)="submitReply()"
                         [disabled]="!newReply.trim() || isSubmitting"
                         class="modern-btn primary-btn"
                      >
                         {{ isSubmitting ? 'Processing Transaction...' : 'Post Action' }}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Sidebar Analytics & Control -->
          <div class="space-y-8">
              <!-- Quick Triage -->
              <div class="content-card-premium">
                  <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-6">Triage Protocols</h3>
                  <div class="space-y-3">
                    @if (ticket.status !== 'In Progress') {
                      <button (click)="updateStatus('In Progress')" class="modern-btn-elite-sm w-full block text-left hover:bg-slate-50">
                         <span class="text-yellow-600 font-black">Escalate</span>
                         <p class="text-[9px] text-slate-400">Mark as currently under review</p>
                      </button>
                    }
                    @if (ticket.status !== 'Waiting for Customer') {
                      <button (click)="updateStatus('Waiting for Customer')" class="modern-btn-elite-sm w-full block text-left hover:bg-slate-50">
                         <span class="text-blue-600 font-black">Deferred</span>
                         <p class="text-[9px] text-slate-400">Await taxpayer documentation</p>
                      </button>
                    }
                    <button class="modern-btn-elite-sm w-full block text-left hover:bg-slate-50 text-red-600">
                       <span class="font-black">Redact Case</span>
                       <p class="text-[9px] text-slate-400">Official closure/deletion (Audited)</p>
                    </button>
                  </div>
              </div>

              <!-- Service Level Analysis -->
              @if (slaInfo) {
              <div class="content-card-premium">
                 <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">SLA Compliance</h3>
                 <div class="space-y-6">
                    <div class="flex items-center gap-4">
                       <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xs">RT</div>
                       <div>
                          <span class="text-[9px] font-black uppercase text-slate-500 block">Response Target</span>
                          <span class="text-slate-800 font-black">{{ slaInfo.response_time_hours }} Hours</span>
                       </div>
                    </div>
                    <div class="flex items-center gap-4">
                       <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">RS</div>
                       <div>
                          <span class="text-[9px] font-black uppercase text-slate-500 block">Resolution Target</span>
                          <span class="text-slate-800 font-black">{{ slaInfo.resolution_time_hours }} Hours</span>
                       </div>
                    </div>
                 </div>
              </div>
              }

              <!-- Event Log -->
              @if (ticket.history && ticket.history.length > 0) {
              <div class="content-card-premium">
                 <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Internal History</h3>
                 <div class="space-y-4 max-h-80 overflow-y-auto custom-scrollbar">
                    @for (event of ticket.history; track event.id) {
                       <div class="flex gap-3 text-[11px] pb-4 border-b border-slate-50 last:border-0">
                          <div class="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
                          <div>
                             <p class="text-slate-700 font-bold leading-tight mb-1">{{ event.description }}</p>
                             <span class="text-[9px] text-slate-400 font-medium">{{ event.changed_at | date:'short' }}</span>
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
  styles: [`
    .page-container { max-width: 1500px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .badge-elite { padding: 4px 12px; border-radius: 8px; font-size: 0.65rem; font-weight: 950; text-transform: uppercase; border: 1px solid transparent; }
    .status-pill-elite .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-right: 8px; }
    
    .modern-btn-elite-sm { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 16px; transition: 0.2s; background: white; }
    .modern-btn-elite-sm:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

    .thread { position: relative; }
    .thread::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #f1f5f9; margin-left: -1px; }

    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  `]
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  ticket: Ticket | null = null;
  slaInfo: any = null;
  newReply = '';
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public helpdeskService: HelpdeskService
  ) {}

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
    this.helpdeskService.addReply(this.ticket.id, this.newReply)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.newReply = '';
          this.isSubmitting = false;
          // Reload ticket to get updated replies
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
      case 'Open': return 'synced';
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
      default: return 'synced';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
