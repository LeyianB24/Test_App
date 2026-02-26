import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaxReturnService } from '../services/tax-return.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-return-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4 max-w-2xl">
      <!-- Header -->
      <div class="mb-6">
        <a routerLink="/tax-returns" class="text-blue-600 hover:text-blue-800 text-sm">← Back to Returns</a>
        <h1 class="text-3xl font-bold text-gray-900 mt-2">Create New Tax Return</h1>
        <p class="text-gray-600 mt-1">Fill in the details to start a new tax return</p>
      </div>

      <!-- Form -->
      <div class="bg-white p-8 rounded-lg border border-gray-200 shadow">
        <form (ngSubmit)="submitForm()" [ngClass]="{ 'opacity-50 pointer-events-none': service.loadingSignal() }">
          <!-- Return Type Selection with Cards -->
          <div class="mb-8">
            <label class="block text-lg font-semibold text-gray-900 mb-4">Select Return Type</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div *ngFor="let type of returnTypes"
                   (click)="formData.return_type = type.id"
                   class="p-4 rounded-lg border-2 cursor-pointer transition"
                   [ngClass]="formData.return_type === type.id
                     ? 'border-blue-600 bg-blue-50'
                     : 'border-gray-200 hover:border-gray-300 bg-white'">
                <div class="flex items-start">
                  <input type="radio"
                         [value]="type.id"
                         [(ngModel)]="formData.return_type"
                         name="return_type"
                         class="mt-1 mr-3">
                  <div>
                    <p class="font-semibold text-gray-900">{{ type.name }}</p>
                    <p class="text-sm text-gray-600">{{ type.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div *ngIf="errors['return_type']" class="text-red-600 text-sm mt-2">{{ errors['return_type'] }}</div>
          </div>

          <!-- Tax Year -->
          <div class="mb-6">
            <label for="tax_year" class="block text-sm font-medium text-gray-700 mb-2">Tax Year</label>
            <select id="tax_year"
                    [(ngModel)]="formData.tax_year"
                    name="tax_year"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select Tax Year</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <div *ngIf="errors['tax_year']" class="text-red-600 text-sm mt-1">{{ errors['tax_year'] }}</div>
          </div>

          <!-- Taxpayer ID -->
          <div class="mb-6">
            <label for="taxpayer_id" class="block text-sm font-medium text-gray-700 mb-2">Taxpayer ID / PIN</label>
            <input type="text"
                   id="taxpayer_id"
                   [(ngModel)]="formData.taxpayer_id"
                   name="taxpayer_id"
                   placeholder="e.g., 123456789"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <p class="text-sm text-gray-500 mt-1">Your KRA Personal Identification Number (PIN)</p>
            <div *ngIf="errors['taxpayer_id']" class="text-red-600 text-sm mt-1">{{ errors['taxpayer_id'] }}</div>
          </div>

          <!-- Deadline Info -->
          <div class="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6" *ngIf="selectedDeadline">
            <h3 class="font-semibold text-blue-900 mb-2">Filing Deadline</h3>
            <p class="text-sm text-blue-800">
              You have until <strong>{{ selectedDeadline.filing_deadline | date: 'MMMM dd, yyyy' }}</strong> to file this return.
              <span *ngIf="selectedDeadline.priority" class="ml-2 px-2 py-1 rounded text-xs font-medium" [ngClass]="getPriorityClass(selectedDeadline.priority)">
                {{ selectedDeadline.priority }} Priority
              </span>
            </p>
          </div>

          <!-- Help Text -->
          <div class="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
            <h3 class="font-semibold text-gray-900 mb-2">What Happens Next?</h3>
            <ol class="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Create the return and save it as a draft</li>
              <li>Add income items, deductions, and other details</li>
              <li>Calculate your tax liability</li>
              <li>Review and submit to KRA when ready</li>
            </ol>
          </div>

          <!-- Error Message -->
          <div *ngIf="generalError" class="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <p class="text-red-700 text-sm">{{ generalError }}</p>
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
            <p class="text-green-700 text-sm font-medium">{{ successMessage }}</p>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-3">
            <button type="submit"
                    [disabled]="!isFormValid() || service.loadingSignal()"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition">
              {{ service.loadingSignal() ? 'Creating...' : 'Create Return' }}
            </button>
            <a routerLink="/tax-returns"
               class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-3 rounded-lg font-medium text-center transition">
              Cancel
            </a>
          </div>
        </form>
      </div>

      <!-- Info Box -->
      <div class="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <p class="text-sm text-yellow-800">
          <strong>Note:</strong> You can save returns as drafts and complete them later. Keep your PIN and tax documents ready.
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ReturnCreateComponent implements OnInit, OnDestroy {
  formData = {
    return_type: '',
    tax_year: '',
    taxpayer_id: ''
  };

  errors: Record<string, string> = {};
  generalError = '';
  successMessage = '';
  selectedDeadline: any = null;

  returnTypes = [
    {
      id: 'IT1',
      name: 'IT1 Return',
      description: 'Individual Income Tax Return - For individuals with income from employment, trade, farming, or investment'
    },
    {
      id: 'Nil',
      name: 'Nil Return',
      description: 'For individuals with no income to declare or income below tax threshold'
    },
    {
      id: 'PAYE',
      name: 'PAYE Return',
      description: 'Pay As You Earn - For employers and PAYE deductions'
    },
    {
      id: 'MRI',
      name: 'MRI Return',
      description: 'Motor Vehicle Tax Return - For vehicle owners'
    },
    {
      id: 'TOT',
      name: 'TOT Return',
      description: 'Tax on Turnover - For micro-enterprises and small businesses'
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    public service: TaxReturnService,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.getDeadlinesByYear(new Date().getFullYear()).pipe(takeUntil(this.destroy$)).subscribe(deadlines => {
      // Pre-select deadline for first return type
      if (deadlines.length > 0) {
        this.selectedDeadline = deadlines[0];
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFormValid(): boolean {
    return !!this.formData.return_type && !!this.formData.tax_year && !!this.formData.taxpayer_id;
  }

  submitForm() {
    // Validate
    this.errors = {};
    if (!this.formData.return_type) {
      this.errors['return_type'] = 'Return type is required';
    }
    if (!this.formData.tax_year) {
      this.errors['tax_year'] = 'Tax year is required';
    }
    if (!this.formData.taxpayer_id) {
      this.errors['taxpayer_id'] = 'Taxpayer ID is required';
    }

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    this.service.createReturn({
      return_type: this.formData.return_type,
      tax_year: parseInt(this.formData.tax_year),
      taxpayer_id: parseInt(this.formData.taxpayer_id)
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.successMessage = 'Return created successfully! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/tax-returns', response.id]);
        }, 1500);
      },
      error: (error) => {
        this.generalError = error.error?.error || 'Failed to create return. Please try again.';
      }
    });
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }
}
