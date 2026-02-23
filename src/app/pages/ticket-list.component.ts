import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HelpdeskService, Ticket } from '../services/helpdesk.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4 md:p-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p class="text-gray-600 mt-1">Track and manage your support requests</p>
        </div>
        <button
          [routerLink]="['/helpdesk/create']"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <span class="mr-2">+</span>New Ticket
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <div class="text-3xl font-bold text-blue-600">{{ helpdeskService.openTicketsCount() }}</div>
          <div class="text-gray-600 text-sm mt-1">Open Tickets</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <div class="text-3xl font-bold text-yellow-600">{{ helpdeskService.inProgressCount() }}</div>
          <div class="text-gray-600 text-sm mt-1">In Progress</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <div class="text-3xl font-bold text-orange-600">{{ helpdeskService.waitingCount() }}</div>
          <div class="text-gray-600 text-sm mt-1">Waiting for Response</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow">
          <div class="text-3xl font-bold text-green-600">{{ helpdeskService.resolvedCount() }}</div>
          <div class="text-gray-600 text-sm mt-1">Resolved</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (ngModelChange)="onSearch()"
            placeholder="Search tickets..."
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            [(ngModel)]="statusFilter"
            (ngModelChange)="onFilterChange()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Customer">Waiting for Response</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            [(ngModel)]="priorityFilter"
            (ngModelChange)="onFilterChange()"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <button
            (click)="clearFilters()"
            class="px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (helpdeskService.isLoading()) {
        <div class="text-center py-8">
          <div class="text-gray-500">Loading tickets...</div>
        </div>
      }

      <!-- Error State -->
      @if (helpdeskService.error() && !helpdeskService.isLoading()) {
        <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {{ helpdeskService.error() }}
        </div>
      }

      <!-- Tickets Table -->
      @if (!helpdeskService.isLoading() && helpdeskService.tickets().length > 0) {
        <div class="bg-white rounded-lg border border-gray-200 shadow overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50">
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ticket</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subject</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Priority</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              @for (ticket of helpdeskService.tickets(); track ticket.id) {
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                  <td class="px-6 py-4 text-sm font-mono text-gray-600">{{ ticket.ticket_number }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ ticket.subject }}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{ ticket.category }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span [class]="getStatusClass(ticket.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                      {{ ticket.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span [class]="getPriorityClass(ticket.priority)" class="px-3 py-1 rounded-full text-xs font-semibold">
                      {{ ticket.priority }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ formatDate(ticket.created_at) }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <a
                      [routerLink]="['/helpdesk', ticket.id]"
                      class="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View →
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Empty State -->
      @if (!helpdeskService.isLoading() && helpdeskService.tickets().length === 0) {
        <div class="text-center py-12 bg-white rounded-lg border border-gray-200">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <div class="text-gray-500 mt-4">No tickets found</div>
          <button
            [routerLink]="['/helpdesk/create']"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Ticket
          </button>
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
export class TicketListComponent implements OnInit, OnDestroy {
  searchTerm = '';
  statusFilter = '';
  priorityFilter = '';
  private destroy$ = new Subject<void>();

  constructor(public helpdeskService: HelpdeskService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTickets(): void {
    const filters: any = {};
    if (this.statusFilter) filters.status = this.statusFilter;
    if (this.priorityFilter) filters.priority = this.priorityFilter;
    if (this.searchTerm) filters.search = this.searchTerm;

    this.helpdeskService.listTickets(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onFilterChange(): void {
    this.loadTickets();
  }

  onSearch(): void {
    this.loadTickets();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.loadTickets();
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
}
