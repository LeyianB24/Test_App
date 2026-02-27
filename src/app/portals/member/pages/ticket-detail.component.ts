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
      <header class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
           <div class="flex items-center gap-3 mb-2">
              <a routerLink="/helpdesk" class="text-blue-500 hover:text-blue-400 transition-colors">
                 <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7"/></svg>
              </a>
              <h1 class="text-4xl font-black text-white tracking-tighter">Ticket Details</h1>
           </div>
           @if (ticket()) {
              <p class="text-slate-500 font-mono text-sm tracking-widest pl-9">{{ ticket()?.ticket_number }}</p>
           }
        </div>
        
        <div class="flex gap-4">
           @if (ticket() && !['Resolved', 'Closed'].includes(ticket()!.status)) {
              <button (click)="updateStatus('Resolved')" class="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10">
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
             <div class="card-glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
                
                <div class="flex flex-wrap gap-4 mb-8 relative z-10">
                   <span class="badge-elite" [class]="getStatusClass(ticket()!.status)">{{ ticket()!.status }}</span>
                   <span class="badge-elite" [class]="getPriorityClass(ticket()!.priority)">{{ ticket()!.priority }} Priority</span>
                   <span class="badge-elite bg-white/5 text-slate-400 border-none">{{ ticket()!.category }}</span>
                </div>

                <h2 class="text-3xl font-black text-white mb-6 leading-tight">{{ ticket()!.subject }}</h2>
                
                <div class="p-8 bg-black/20 rounded-3xl border border-white/5 mb-10">
                   <p class="text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">{{ ticket()!.description }}</p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/5">
                   <div>
                      <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Created</span>
                      <span class="text-white font-bold text-sm">{{ ticket()!.created_at | date:'medium' }}</span>
                   </div>
                   <div>
                      <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Last Update</span>
                      <span class="text-white font-bold text-sm">{{ ticket()!.updated_at | date:'medium' }}</span>
                   </div>
                </div>
             </div>

             <!-- Conversation Thread -->
             <div class="space-y-6">
                <h3 class="text-xl font-black text-white px-8">Communication History</h3>
                
                <div class="thread px-4 space-y-6">
                   @for (reply of ticket()!.replies; track reply.id) {
                      <div class="flex gap-4" [class.justify-end]="!reply.is_internal">
                         <div class="max-w-[80%] p-6 rounded-[2rem] border" 
                              [class]="reply.is_internal ? 'bg-slate-800/60 border-white/5 text-slate-300' : 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/10 rounded-tr-none'">
                            @if (reply.is_internal) {
                               <span class="text-[9px] font-black uppercase tracking-widest text-blue-400 block mb-2">Official Response</span>
                            }
                            <p class="font-medium text-sm leading-relaxed whitespace-pre-wrap">{{ reply.reply_text }}</p>
                            <span class="text-[9px] font-bold opacity-50 block mt-4">{{ reply.created_at | date:'short' }}</span>
                         </div>
                      </div>
                   } @empty {
                      <div class="text-center py-10 opacity-30">
                         <p class="text-sm font-bold uppercase tracking-widest">No replies yet. Awaiting official review.</p>
                      </div>
                   }
                </div>

                <!-- Reply Composer -->
                <div class="card-glass p-8 rounded-[3rem] border border-white/10 shadow-2xl">
                   <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 pl-4">Add Reply</h4>
                   <textarea
                      [(ngModel)]="newReply"
                      placeholder="Type your message to the support team..."
                      rows="4"
                      class="w-full bg-white/5 border border-white/10 text-white p-6 rounded-3xl focus:border-blue-500 outline-none font-medium mb-6 transition-all"
                   ></textarea>
                   <div class="flex justify-end">
                      <button
                         (click)="submitReply()"
                         [disabled]="!newReply.trim() || isSubmitting()"
                         class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 disabled:bg-slate-800 transition-all shadow-xl shadow-blue-600/10"
                      >
                         {{ isSubmitting() ? 'Transmitting...' : 'Send Message' }}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Sidebar Analytics -->
          <div class="space-y-8">
             <div class="card-glass p-8 rounded-[3rem] border border-white/5">
                <h3 class="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-6">Service Level Agreement</h3>
                @if (slaInfo()) {
                   <div class="space-y-6">
                      <div class="flex items-center gap-4">
                         <div class="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-black text-xs">RT</div>
                         <div>
                            <span class="text-[9px] font-black uppercase text-slate-500 block">Response Target</span>
                            <span class="text-white font-black">{{ slaInfo()!.response_time_hours }} Hours</span>
                         </div>
                      </div>
                      <div class="flex items-center gap-4">
                         <div class="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center font-black text-xs">RS</div>
                         <div>
                            <span class="text-[9px] font-black uppercase text-slate-500 block">Resolution Target</span>
                            <span class="text-white font-black">{{ slaInfo()!.resolution_time_hours }} Hours</span>
                         </div>
                      </div>
                   </div>
                }
             </div>

             <div class="card-glass p-8 rounded-[3rem] border border-white/5">
                <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Internal History</h3>
                <div class="space-y-4">
                   @for (event of ticket()!.history; track event.id) {
                      <div class="flex gap-3 text-[11px]">
                         <div class="w-1.5 h-1.5 rounded-full bg-slate-700 mt-1.5"></div>
                         <div>
                            <p class="text-slate-300 font-bold leading-tight mb-1">{{ event.description }}</p>
                            <span class="text-slate-600 font-medium">{{ event.changed_at | date:'short' }}</span>
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
      case 'Open': return 'badge-open';
      case 'In Progress': return 'badge-progress';
      case 'Waiting for Customer': return 'badge-waiting';
      case 'Resolved': return 'badge-resolved';
      default: return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      default: return 'badge-open';
    }
  }
}
import { map } from 'rxjs/operators';
