import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HelpdeskService } from '../services/helpdesk.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4 md:p-8 max-w-2xl">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <a
          routerLink="/helpdesk"
          class="text-gray-600 hover:text-gray-900 transition"
        >
          ← Back
        </a>
        <h1 class="text-3xl font-bold text-gray-900">Create New Ticket</h1>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg border border-gray-200 shadow p-8">
        <form (ngSubmit)="submitForm()" #ticketForm="ngForm">
          <!-- Subject -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              [(ngModel)]="formData.subject"
              name="subject"
              required
              placeholder="Brief description of your issue"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">{{ formData.subject.length }}/255 characters</p>
          </div>

          <!-- Category -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              [(ngModel)]="formData.category"
              name="category"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              @for (cat of helpdeskService.categories(); track cat) {
                <option [value]="cat">
                  {{ cat }}
                </option>
              }
            </select>
          </div>

          <!-- Priority -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Priority
            </label>
            <div class="grid grid-cols-4 gap-2">
              @for (p of ['Low', 'Medium', 'High', 'Critical']; track p) {
                <button
                  type="button"
                  (click)="formData.priority = p"
                  [class.ring-2]="formData.priority === p"
                  [class.ring-blue-500]="formData.priority === p"
                  [class]="getPriorityClass(p)"
                  class="px-3 py-2 rounded-lg font-medium text-sm transition"
                >
                  {{ p }}
                </button>
              }
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              required
              placeholder="Please provide detailed information about your issue. Include any relevant details that can help us resolve it faster."
              rows="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ formData.description.length }}/5000 characters
              @if (formData.description.length >= 5000) {
                <span class="text-red-500"> (Maximum reached)</span>
              }
            </p>
          </div>

          <!-- Info Box -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p class="text-sm text-blue-900">
              <strong>💡 Tip:</strong> The more details you provide, the faster our support team can help resolve your issue.
              Include error messages, screenshots, and steps to reproduce the problem.
            </p>
          </div>

          <!-- Error Message -->
          @if (errorMessage) {
            <div class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
              {{ errorMessage }}
            </div>
          }

          <!-- Success Message -->
          @if (successMessage) {
            <div class="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
              {{ successMessage }}
            </div>
          }

          <!-- Action Buttons -->
          <div class="flex gap-4 justify-end">
            <a
              routerLink="/helpdesk"
              class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </a>
            <button
              type="submit"
              [disabled]="isSubmitting || !ticketForm.valid"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
            >
              {{ isSubmitting ? 'Creating...' : 'Create Ticket' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Help Section -->
      <div class="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 class="font-semibold text-gray-900 mb-3">What happens next?</h3>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex gap-2">
            <span class="font-bold text-blue-600">1.</span>
            <span>Your ticket will be created and assigned a unique ticket number</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-blue-600">2.</span>
            <span>Our support team will review your issue based on priority and SLA times</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-blue-600">3.</span>
            <span>You'll receive email notifications for all ticket updates</span>
          </li>
          <li class="flex gap-2">
            <span class="font-bold text-blue-600">4.</span>
            <span>You can track progress and add replies directly in the ticket view</span>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TicketCreateComponent implements OnInit, OnDestroy {
  formData = {
    subject: '',
    category: '',
    priority: 'Medium',
    description: ''
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    public helpdeskService: HelpdeskService
  ) {}

  ngOnInit(): void {
    // Categories already loaded by service
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (!this.formData.subject || !this.formData.category || !this.formData.description) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.formData.subject.length < 5) {
      this.errorMessage = 'Subject must be at least 5 characters';
      return;
    }

    if (this.formData.description.length < 20) {
      this.errorMessage = 'Description must be at least 20 characters';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.helpdeskService.createTicket({
      subject: this.formData.subject,
      category: this.formData.category,
      priority: this.formData.priority,
      description: this.formData.description
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.successMessage = `Ticket ${response.ticket_number} created successfully!`;

          // Redirect to ticket detail after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/helpdesk', response.ticket_id]);
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err || 'Failed to create ticket';
          this.isSubmitting = false;
        }
      });
  }

  getPriorityClass(priority: string): string {
    const priorityClasses: Record<string, string> = {
      'Low': 'bg-green-50 text-green-800 border border-green-200',
      'Medium': 'bg-blue-50 text-blue-800 border border-blue-200',
      'High': 'bg-orange-50 text-orange-800 border border-orange-200',
      'Critical': 'bg-red-50 text-red-800 border border-red-200'
    };
    return priorityClasses[priority] || '';
  }
}
