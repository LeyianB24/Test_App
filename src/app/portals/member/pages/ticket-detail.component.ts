import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../services/helpdesk.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4 md:p-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Ticket Details</h1>
          <p class="text-gray-600 mt-1" *ngIf="ticket">{{ ticket.ticket_number }}</p>
        </div>
        <a
          routerLink="/helpdesk"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back to Tickets
        </a>
      </div>

      <!-- Loading State -->
      @if (helpdeskService.isLoading()) {
        <div class="text-center py-8">
          <div class="text-gray-500">Loading ticket...</div>
        </div>
      }

      <!-- Error State -->
      @if (helpdeskService.error() && !helpdeskService.isLoading()) {
        <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {{ helpdeskService.error() }}
        </div>
      }

      <!-- Ticket Content -->
      @if (ticket && !helpdeskService.isLoading()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Ticket Info Card -->
            <div class="bg-white rounded-lg border border-gray-200 shadow p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ ticket.subject }}</h2>

              <!-- Status Bar -->
              <div class="flex flex-wrap gap-3 mb-6">
                <span [class]="getStatusClass(ticket.status)" class="px-4 py-2 rounded-full text-sm font-semibold">
                  {{ ticket.status }}
                </span>
                <span [class]="getPriorityClass(ticket.priority)" class="px-4 py-2 rounded-full text-sm font-semibold">
                  {{ ticket.priority }} Priority
                </span>
                <span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                  {{ ticket.category }}
                </span>
              </div>

              <!-- Description -->
              <div class="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <h3 class="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                <p class="text-gray-700 whitespace-pre-wrap">{{ ticket.description }}</p>
              </div>

              <!-- Metadata -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Created</p>
                  <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(ticket.created_at) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider">Updated</p>
                  <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(ticket.updated_at) }}</p>
                </div>
                @if (ticket.first_response_at) {
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">1st Response</p>
                    <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(ticket.first_response_at) }}</p>
                  </div>
                }
                @if (ticket.resolved_at) {
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Resolved</p>
                    <p class="text-sm font-medium text-gray-900 mt-1">{{ formatDate(ticket.resolved_at) }}</p>
                  </div>
                }
              </div>
            </div>

            <!-- Replies Section -->
            <div class="bg-white rounded-lg border border-gray-200 shadow p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Replies & Comments</h3>

              <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
                @for (reply of (ticket.replies || []); track reply.id) {
                  <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="flex justify-between items-start mb-2">
                      <p class="font-medium text-gray-900">Reply #{{ reply.id }}</p>
                      @if (reply.is_internal) {
                        <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Internal Note
                        </span>
                      }
                    </div>
                    <p class="text-sm text-gray-700 whitespace-pre-wrap mb-2">{{ reply.reply_text }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(reply.created_at) }}</p>
                  </div>
                } @empty {
                  <div class="text-center py-8 text-gray-500">
                    No replies yet
                  </div>
                }
              </div>

              <!-- Add Reply Form -->
              <div class="border-t border-gray-200 pt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Add Reply</label>
                <textarea
                  [(ngModel)]="newReply"
                  placeholder="Type your reply here..."
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                  (click)="submitReply()"
                  [disabled]="!newReply || isSubmitting"
                  class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                  {{ isSubmitting ? 'Sending...' : 'Send Reply' }}
                </button>
              </div>
            </div>

            <!-- Attachments Section -->
            @if (ticket.attachments && ticket.attachments.length > 0) {
              <div class="bg-white rounded-lg border border-gray-200 shadow p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">Attachments</h3>
                <div class="space-y-2">
                  @for (attachment of ticket.attachments; track attachment.id) {
                    <a
                      href="#"
                      class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
                    >
                      <svg class="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 7H4v2h11V7zM4 5h2V3H4v2zm6 0h2V3h-2v2zM9 3H7v2h2V3z"/>
                      </svg>
                      <div>
                        <p class="font-medium text-gray-900">{{ attachment.filename }}</p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(attachment.file_size) }}</p>
                      </div>
                    </a>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Quick Actions -->
            <div class="bg-white rounded-lg border border-gray-200 shadow p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div class="space-y-2">
                @if (ticket.status !== 'In Progress') {
                  <button
                    (click)="updateStatus('In Progress')"
                    class="w-full px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium"
                  >
                    Mark In Progress
                  </button>
                }
                @if (!['Resolved', 'Closed'].includes(ticket.status)) {
                  <button
                    (click)="updateStatus('Resolved')"
                    class="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                  >
                    Mark Resolved
                  </button>
                }
                @if (ticket.status !== 'Waiting for Customer') {
                  <button
                    (click)="updateStatus('Waiting for Customer')"
                    class="w-full px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                  >
                    Waiting for Response
                  </button>
                }
              </div>
            </div>

            <!-- SLA Info -->
            @if (slaInfo) {
              <div class="bg-white rounded-lg border border-gray-200 shadow p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">SLA Info</h3>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Response Time Target</p>
                    <p class="text-sm font-medium text-gray-900 mt-1">{{ slaInfo.response_time_hours }} hours</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wider">Resolution Time Target</p>
                    <p class="text-sm font-medium text-gray-900 mt-1">{{ slaInfo.resolution_time_hours }} hours</p>
                  </div>
                </div>
              </div>
            }

            <!-- History -->
            @if (ticket.history && ticket.history.length > 0) {
              <div class="bg-white rounded-lg border border-gray-200 shadow p-6">
                <h3 class="text-lg font-bold text-gray-900 mb-4">History</h3>
                <div class="space-y-3 text-sm max-h-64 overflow-y-auto">
                  @for (event of ticket.history; track event.id) {
                    <div class="pb-3 border-b border-gray-200 last:border-b-0">
                      <p class="font-medium text-gray-900">{{ event.description }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ formatDate(event.changed_at) }}</p>
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
    :host {
      display: block;
    }
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

  getStatusClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'Open': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Waiting for Customer': 'bg-orange-100 text-orange-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800',
      'Reopened': 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getPriorityClass(priority: string): string {
    const priorityClasses: Record<string, string> = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return priorityClasses[priority] || 'bg-gray-100 text-gray-800';
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
