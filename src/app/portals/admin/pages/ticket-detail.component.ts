import { inject } from '@angular/core';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
    <div class="page-container p-8 animate-up">
      <!-- Elite Header -->
      <header class="page-header-elite items-center mb-12">
        <div class="header-info flex items-center gap-6">
           <a routerLink="/helpdesk/tickets" class="icon-btn-elite group overflow-hidden relative">
              <div class="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="relative z-10 group-hover:text-white"><path stroke-width="3" d="M15 19l-7-7 7-7"/></svg>
           </a>
           <div>
              <h1 class="premium-title mb-0">Case <span class="gradient-text">Management</span></h1>
              @if (ticket) {
                 <p class="premium-subtitle pl-0 mt-1">Ref: {{ ticket.ticket_number }} • Support Case</p>
              }
           </div>
        </div>
        
        <div class="header-actions flex gap-4">
           @if (ticket && !['Resolved', 'Closed'].includes(ticket.status)) {
              <button (click)="updateStatus('Resolved')" class="modern-btn primary-btn sm">
                 <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                 Resolve Case
              </button>
           }
        </div>
      </header>

      @if (helpdeskService.isLoading()) {
        <div class="py-32 flex flex-col items-center">
          <div class="w-16 h-16 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
          <p class="mt-6 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Loading ticket details...</p>
        </div>
      } @else if (ticket) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Thread -->
          <div class="lg:col-span-2 space-y-12">
              <!-- Ticket Master Card -->
             <div class="content-card-premium relative overflow-hidden p-10 animate-scale">
                <div class="absolute -top-20 -right-20 w-60 h-60 bg-red-50/50 rounded-full blur-3xl opacity-50"></div>
                
                <div class="flex flex-wrap gap-4 mb-10 relative z-10">
                   <div class="status-pill-elite shadow-sm" [class]="getStatusEliteClass(ticket.status)">
                     <span class="dot"></span>
                     {{ ticket.status }}
                   </div>
                   <div class="status-pill-elite shadow-sm" [class]="getPriorityEliteClass(ticket.priority)">
                     <span class="dot"></span>
                     {{ ticket.priority }}
                   </div>
                   <span class="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-slate-100 rounded-xl text-slate-500">{{ ticket.category }}</span>
                </div>

                <h2 class="text-4xl font-black text-slate-800 mb-8 leading-[1.1] tracking-tight">{{ ticket.subject }}</h2>
                
                <div class="p-10 bg-slate-50/80 rounded-[2.5rem] border border-slate-200/50 mb-10 relative group">
                   <div class="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]"></div>
                   <p class="text-slate-700 font-medium leading-[1.8] whitespace-pre-wrap relative z-10">{{ ticket.description }}</p>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-10 border-t border-slate-100">
                   <div>
                      <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Created On</span>
                      <span class="text-slate-800 font-black text-xs">{{ ticket.created_at | date:'medium' }}</span>
                   </div>
                   <div>
                      <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Created By</span>
                      <span class="text-slate-800 font-black text-xs">{{ ticket.created_by }}</span>
                   </div>
                   <div>
                      <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">Ticket ID</span>
                      <span class="text-slate-800 font-black text-xs">#{{ ticket.ticket_number }}</span>
                   </div>
                </div>
             </div>

             <!-- Conversation Thread -->
             <div class="space-y-8">
                <div class="flex items-center justify-between px-4">
                   <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                      Conversation Thread
                   </h3>
                   <span class="text-[10px] font-bold text-slate-400 italic">{{ ticket.replies?.length || 0 }} entries recorded</span>
                </div>
                
                <div class="thread-elite px-4 space-y-8 pb-10">
                   @for (reply of (ticket.replies || []); track reply.id) {
                      <div class="flex gap-6 animate-up" [class.justify-end]="!reply.is_internal">
                         <div class="max-w-[85%] p-8 rounded-[2.5rem] border shadow-sm relative overflow-hidden group transition-all hover:shadow-xl" 
                              [class]="reply.is_internal ? 'bg-white border-red-100 text-slate-800 rounded-tl-none hover:border-red-200' : 'bg-slate-800 border-slate-700 text-slate-100 rounded-tr-none hover:bg-slate-900 shadow-slate-200/50'">
                            
                            @if (reply.is_internal) {
                               <div class="flex items-center gap-2 mb-3">
                                  <div class="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                                  <span class="text-[9px] font-black uppercase tracking-[0.15em] text-red-600">Admin Reply</span>
                               </div>
                            } @else {
                               <div class="flex items-center gap-2 mb-3">
                                  <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                  <span class="text-[9px] font-black uppercase tracking-[0.15em] text-blue-400">User Reply</span>
                               </div>
                            }
                            
                            <p class="font-medium text-sm leading-relaxed whitespace-pre-wrap">{{ reply.reply_text }}</p>
                            
                            <div class="flex items-center gap-2 mt-6 opacity-40 group-hover:opacity-100 transition-opacity">
                               <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                               <span class="text-[9px] font-black uppercase tracking-widest">{{ reply.created_at | date:'shortTime' }} • {{ reply.created_at | date:'mediumDate' }}</span>
                            </div>
                         </div>
                      </div>
                   } @empty {
                      <div class="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 animate-pulse">
                         <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">No replies yet</p>
                      </div>
                   }
                </div>

                <!-- Admin Action Composer -->
                <div class="content-card-premium mt-8 shadow-2xl p-1 animate-up delay-2">
                   <div class="p-8 pb-4">
                      <div class="flex items-center gap-3 mb-6 pl-2">
                         <div class="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                         </div>
                         <div>
                            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Add Reply</h4>
                            <p class="text-[11px] font-bold text-slate-800">Send a reply or write an internal note</p>
                         </div>
                      </div>
                      <textarea
                         [(ngModel)]="newReply"
                         placeholder="Write your reply here..."
                         rows="5"
                         class="search-input-elite w-full resize-none p-8 font-medium bg-slate-50/50 border-slate-100 focus:bg-white transition-all rounded-[2rem]"
                      ></textarea>
                   </div>
                   
                   <div class="flex items-center justify-between p-8 pt-4 bg-slate-50/50 rounded-b-[2rem]">
                      <label class="flex items-center gap-3 cursor-pointer group">
                         <div class="relative w-10 h-6 bg-slate-200 rounded-full transition-colors group-hover:bg-slate-300">
                            <input type="checkbox" class="sr-only peer" [(ngModel)]="isInternalOnly">
                            <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4 peer-checked:bg-red-600 shadow-sm"></div>
                         </div>
                         <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-red-600 transition-colors">Internal Note Only</span>
                      </label>
                      
                      <button
                         (click)="submitReply()"
                         [disabled]="!newReply.trim() || isSubmitting"
                         class="modern-btn primary-btn"
                      >
                         <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" [class.animate-pulse]="isSubmitting"><path stroke-width="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                         {{ isSubmitting ? 'Sending...' : 'Send Reply' }}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Sidebar Analytics & Control -->
          <div class="space-y-10 animate-up delay-2">
              <!-- Quick Triage -->
              <div class="content-card-premium p-8 relative overflow-hidden group">
                  <div class="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                     <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  </div>
                  <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-8 flex items-center gap-2">
                     Quick Actions
                  </h3>
                  <div class="space-y-4">
                    @if (ticket.status !== 'In Progress') {
                      <button (click)="updateStatus('In Progress')" class="protocol-btn group/btn">
                         <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover/btn:bg-amber-600 group-hover/btn:text-white transition-all">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                         </div>
                         <div>
                            <span class="text-[11px] font-black text-slate-800 block">Start Progress</span>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mark as in progress</p>
                         </div>
                      </button>
                    }
                    @if (ticket.status !== 'Waiting for Customer') {
                      <button (click)="updateStatus('Waiting for Customer')" class="protocol-btn group/btn">
                         <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                         </div>
                         <div>
                            <span class="text-[11px] font-black text-slate-800 block">Request Feedback</span>
                            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Waiting for customer response</p>
                         </div>
                      </button>
                    }
                    <button class="protocol-btn group/btn border-red-50/50 hover:bg-red-50/30">
                       <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover/btn:bg-red-600 group-hover/btn:text-white transition-all">
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                       </div>
                       <div>
                          <span class="text-[11px] font-black text-red-600 block">Delete Ticket</span>
                          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Permanently delete this ticket</p>
                       </div>
                    </button>
                  </div>
              </div>

              <!-- Service Level Analysis -->
              @if (slaInfo) {
              <div class="content-card-premium p-8 relative overflow-hidden">
                 <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50/50 rounded-full blur-3xl"></div>
                 <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                    SLA Metrics
                 </h3>
                 <div class="space-y-8">
                    <div class="flex items-center gap-5 group">
                       <div class="w-12 h-12 bg-white shadow-xl shadow-emerald-500/5 rounded-2xl flex items-center justify-center border border-emerald-50 group-hover:scale-110 transition-transform">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#10b981"><path stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       </div>
                       <div>
                          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Response Target</span>
                          <span class="text-slate-800 font-black text-lg">{{ slaInfo.response_time_hours }} <span class="text-xs font-bold text-slate-400">Hours</span></span>
                       </div>
                    </div>
                    <div class="flex items-center gap-5 group">
                       <div class="w-12 h-12 bg-white shadow-xl shadow-blue-500/5 rounded-2xl flex items-center justify-center border border-blue-50 group-hover:scale-110 transition-transform">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#3b82f6"><path stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       </div>
                       <div>
                          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Resolution Target</span>
                          <span class="text-slate-800 font-black text-lg">{{ slaInfo.resolution_time_hours }} <span class="text-xs font-bold text-slate-400">Hours</span></span>
                       </div>
                    </div>
                 </div>
              </div>
              }

              <!-- Event Log -->
              @if (ticket.history && ticket.history.length > 0) {
              <div class="content-card-premium p-8">
                 <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Audit Log</h3>
                 <div class="space-y-6 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                    @for (event of ticket.history; track event.id) {
                       <div class="flex gap-4 relative group">
                          <div class="flex-shrink-0 w-2 h-2 rounded-full bg-slate-200 mt-1.5 group-hover:bg-red-600 transition-colors"></div>
                          <div class="pb-6 border-b border-slate-50 last:border-0 w-full">
                             <p class="text-[11px] text-slate-700 font-bold leading-relaxed mb-2 group-hover:text-slate-900 transition-colors">{{ event.description }}</p>
                             <div class="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                {{ event.changed_at | date:'HH:mm' }} • {{ event.changed_at | date:'dd MMM' }}
                             </div>
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
    .page-container { max-width: 1600px; margin: 0 auto; }
    
    .status-pill-elite .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; margin-right: 8px; }
    
    .protocol-btn { 
       display: flex; align-items: center; gap: 16px; width: 100%; text-align: left;
       padding: 12px; border-radius: 20px; border: 1.5px solid #f8fafc;
       background: white; transition: 0.3s;
    }
    .protocol-btn:hover { 
       transform: translateX(8px);
       border-color: #e2e8f0;
       box-shadow: 0 10px 20px rgba(0,0,0,0.03);
    }

    .thread-elite { position: relative; }
    .thread-elite::before { 
       content: ''; position: absolute; left: 4px; top: 0; bottom: 0; 
       width: 2px; background: linear-gradient(180deg, #f1f5f9 0%, transparent 100%); 
       margin-left: -1px; 
    }

    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }

    .animate-up { animation: up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    .animate-scale { animation: scale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
  `]
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  ticket: Ticket | null = null;
  slaInfo: any = null;
  newReply = '';
  isInternalOnly = false;
  isSubmitting = false;
  private destroy$ = new Subject<void>();

  // TODO: Check constructor replacements
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
