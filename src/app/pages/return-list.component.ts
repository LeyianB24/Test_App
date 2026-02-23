import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaxReturnService } from '../services/tax-return.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-return-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Tax Returns</h1>
        <a routerLink="/tax-returns/create" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
          + New Return
        </a>
      </div>

      <!-- PAYE Import -->
      <div class="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 class="text-lg font-semibold mb-3">Bulk Import (PAYE CSV)</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Taxpayer ID</label>
            <input type="text" [(ngModel)]="importTaxpayerId" class="w-full px-3 py-2 border rounded" placeholder="e.g., 123456" />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Tax Year</label>
            <select [(ngModel)]="importTaxYear" class="w-full px-3 py-2 border rounded">
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">CSV File</label>
            <input type="file" (change)="onImportFile($event)" />
          </div>
        </div>
        <div class="mt-3">
          <button (click)="importPaye()" [disabled]="!importFile || !importTaxpayerId" class="bg-blue-600 text-white px-4 py-2 rounded">Import PAYE CSV</button>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div class="text-gray-600 text-sm font-medium">Draft Returns</div>
          <div class="text-3xl font-bold text-yellow-600">{{ service.draftReturnsCount() }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div class="text-gray-600 text-sm font-medium">Submitted</div>
          <div class="text-3xl font-bold text-blue-600">{{ service.submittedReturnsCount() }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div class="text-gray-600 text-sm font-medium">Approved</div>
          <div class="text-3xl font-bold text-green-600">{{ service.approvedReturnsCount() }}</div>
        </div>
        <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div class="text-gray-600 text-sm font-medium">Overdue</div>
          <div class="text-3xl font-bold text-red-600">{{ service.overdueReturnsCount() }}</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Return Type</label>
            <select [(ngModel)]="selectedReturnType" (change)="onFilterChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="IT1">IT1 - Income Tax</option>
              <option value="Nil">Nil Return</option>
              <option value="PAYE">PAYE</option>
              <option value="MRI">MRI - Motor Vehicle</option>
              <option value="TOT">TOT - Tax on Turnover</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select [(ngModel)]="selectedStatus" (change)="onFilterChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Ready for Submission">Ready for Submission</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tax Year</label>
            <select [(ngModel)]="selectedYear" (change)="onFilterChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input type="text" [(ngModel)]="searchQuery" (change)="onFilterChange()" placeholder="Return ID or KRA Ref..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (service.loadingSignal()) {
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="text-gray-600 mt-2">Loading returns...</p>
        </div>
      }

      <!-- Error State -->
      @if (service.errorSignal(); as error) {
        <div class="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
          <p class="text-red-700">{{ error }}</p>
        </div>
      }

      <!-- Table -->
      @if (!service.loadingSignal()) {
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Return ID</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Year</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th class="px-6 py-3 text-right text-sm font-semibold text-gray-900">Tax Due/Refund</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Deadline</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                <th class="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (ret of service.returnsSignal(); track ret.id) {
                <tr class="hover:bg-gray-50 transition">
                  <td class="px-6 py-4 text-sm font-medium text-blue-600">{{ ret.return_id }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                          [class]="getReturnTypeClass(ret.return_type)">
                      {{ ret.return_type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm">{{ ret.tax_year }}</td>
                  <td class="px-6 py-4 text-sm">
                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                          [class]="getStatusClass(ret.status)">
                      {{ ret.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-right font-medium"
                      [class.text-red-600]="ret.tax_due > 0"
                      [class.text-green-600]="ret.tax_due <= 0">
                    KES {{ (ret.tax_due | number: '1.2-2') || '0.00' }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    @if (ret.deadline; as deadline) {
                      <span [class.text-red-600]="isDeadlineApproaching(deadline)" [class.font-medium]="isDeadlineApproaching(deadline)">
                        {{ deadline | date: 'MMM dd, yyyy' }}
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ ret.created_at | date: 'MMM dd' }}</td>
                  <td class="px-6 py-4 text-center">
                    <a [routerLink]="['/tax-returns', ret.id]" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View</a>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                    No returns found. <a routerLink="/tax-returns/create" class="text-blue-600 hover:underline">Create one now</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
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
export class ReturnListComponent implements OnInit, OnDestroy {
  selectedReturnType = '';
  selectedStatus = '';
  selectedYear: any = new Date().getFullYear();
  searchQuery = '';
  importFile: File | null = null;
  importTaxpayerId = '';
  importTaxYear: any = new Date().getFullYear();

  private destroy$ = new Subject<void>();

  constructor(public service: TaxReturnService) {}

  ngOnInit() {
    this.loadReturns();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReturns() {
    this.service.listReturns({
      return_type: this.selectedReturnType || undefined,
      status: this.selectedStatus || undefined,
      year: parseInt(this.selectedYear),
      search: this.searchQuery || undefined
    }).pipe(takeUntil(this.destroy$)).subscribe();
  }

  onFilterChange() {
    this.loadReturns();
  }

  onImportFile(evt: any) {
    const f = evt.target.files && evt.target.files[0];
    if (f) this.importFile = f;
  }

  importPaye() {
    if (!this.importFile || !this.importTaxpayerId) return;
    this.service.importPaye(this.importFile, parseInt(this.importTaxpayerId), parseInt(this.importTaxYear)).subscribe(resp => {
      if (resp?.success) {
        alert('Imported ' + (resp.rows || 0) + ' rows');
        this.loadReturns();
      } else {
        alert('Import failed: ' + (resp?.error || 'unknown'));
      }
    });
  }

  getReturnTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'IT1': 'bg-blue-100 text-blue-800',
      'Nil': 'bg-gray-100 text-gray-800',
      'PAYE': 'bg-green-100 text-green-800',
      'MRI': 'bg-purple-100 text-purple-800',
      'TOT': 'bg-orange-100 text-orange-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Ready for Submission': 'bg-blue-100 text-blue-800',
      'Submitted': 'bg-indigo-100 text-indigo-800',
      'Acknowledged': 'bg-cyan-100 text-cyan-800',
      'Under Review': 'bg-orange-100 text-orange-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Amended': 'bg-pink-100 text-pink-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  isDeadlineApproaching(deadline: string): boolean {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysUntilDeadline = Math.floor((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 14; // Red if within 2 weeks
  }
}
