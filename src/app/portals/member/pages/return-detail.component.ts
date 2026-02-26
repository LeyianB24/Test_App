import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaxReturnService, TaxReturn, ReturnItem } from '../services/tax-return.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-return-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <a routerLink="/tax-returns" class="text-blue-600 hover:text-blue-800 text-sm">← Back to Returns</a>
          @if (taxReturn) {
            <h1 class="text-3xl font-bold text-gray-900 mt-2">{{ taxReturn.return_id }}</h1>
          }
        </div>
        @if (taxReturn) {
          <div class="text-right">
            <span class="px-3 py-1 rounded-full text-sm font-medium" [class]="getStatusClass(taxReturn.status)">
              {{ taxReturn.status }}
            </span>
          </div>
        }
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Main Content (Full Width on Mobile) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Main Content (Full Width on Mobile) -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Return Overview -->
          @if (taxReturn) {
            <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Return Overview</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Return Type</p>
                  <p class="text-lg font-medium text-gray-900">{{ taxReturn.return_type }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Tax Year</p>
                  <p class="text-lg font-medium text-gray-900">{{ taxReturn.tax_year }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Status</p>
                  <p class="text-lg font-medium" [class]="getStatusColor(taxReturn.status)">{{ taxReturn.status }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Created</p>
                  <p class="text-lg font-medium text-gray-900">{{ taxReturn.created_at | date: 'MMM dd, yyyy' }}</p>
                </div>
                @if (taxReturn.submitted_at) {
                  <div>
                    <p class="text-sm text-gray-600">Submitted</p>
                    <p class="text-lg font-medium text-gray-900">{{ taxReturn.submitted_at | date: 'MMM dd, yyyy' }}</p>
                  </div>
                }
                @if (taxReturn.kra_reference) {
                  <div>
                    <p class="text-sm text-gray-600">KRA Reference</p>
                    <p class="text-sm font-mono text-gray-900">{{ taxReturn.kra_reference }}</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Financial Summary -->
          @if (taxReturn) {
            <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h2>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">Gross Income</p>
                  <p class="text-2xl font-bold text-gray-900">KES {{ (taxReturn.gross_income | number: '1.2-2') || '0.00' }}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">Chargeable Income</p>
                  <p class="text-2xl font-bold text-gray-900">KES {{ (taxReturn.chargeable_income | number: '1.2-2') || '0.00' }}</p>
                </div>
                <div class="bg-blue-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-600 mb-1">Calculated Tax</p>
                  <p class="text-2xl font-bold text-blue-600">KES {{ (taxReturn.calculated_tax | number: '1.2-2') || '0.00' }}</p>
                </div>
                <div class="p-4 rounded-lg" [class.bg-red-50]="taxReturn.tax_due > 0" [class.bg-green-50]="taxReturn.tax_due <= 0">
                  <p class="text-sm text-gray-600 mb-1">{{ taxReturn.tax_due > 0 ? 'Tax Due' : 'Refund Due' }}</p>
                  <p class="text-2xl font-bold" [class.text-red-600]="taxReturn.tax_due > 0" [class.text-green-600]="taxReturn.tax_due <= 0">
                    KES {{ (taxReturn.tax_due | number: '1.2-2') || '0.00' }}
                  </p>
                </div>
              </div>
            </div>
          }

          <!-- Return Items / Line Items -->
          <!-- Attachments Uploader -->
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-4">
            <h3 class="font-semibold text-gray-900 mb-3">Attachments</h3>
            <div class="flex gap-2 items-center">
              <input type="file" (change)="onFileSelected($event)" />
              <button class="bg-blue-600 text-white px-4 py-2 rounded" (click)="uploadSelected()" [disabled]="!selectedFile">Upload</button>
            </div>
            <div class="mt-3">
              <ul class="list-disc pl-5 text-sm text-gray-700">
                @for (a of (taxReturn?.attachments || []); track a.file_path) {
                  <li> <a [href]="'/' + a.file_path" target="_blank">{{ a.file_name }}</a></li>
                } @empty {
                  <li class="text-gray-500">No attachments</li>
                }
              </ul>
            </div>
          </div>
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Return Items</h2>
              <button (click)="showAddItem = !showAddItem" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                + Add Item
              </button>
            </div>

            <!-- Add Item Form -->
            @if (showAddItem) {
              <div class="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                <h3 class="font-semibold text-gray-900 mb-3">Add New Item</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
                    <select [(ngModel)]="newItem.item_type" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="Income">Income</option>
                      <option value="Deduction">Deduction</option>
                      <option value="Adjustment">Adjustment</option>
                      <option value="Relief">Relief</option>
                      <option value="Withholding">Withholding</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select [(ngModel)]="newItem.category" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option value="">Select Category</option>
                      <option value="Employment">Employment</option>
                      <option value="Trade">Trade</option>
                      <option value="Farming">Farming</option>
                      <option value="Interest">Interest</option>
                      <option value="Dividend">Dividend</option>
                      <option value="Capital Gains">Capital Gains</option>
                      <option value="Rent">Rent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input type="text" [(ngModel)]="newItem.description" placeholder="Enter item description" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
                    <input type="number" [(ngModel)]="newItem.amount" placeholder="0.00" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  </div>
                  <div class="flex gap-2 items-end">
                    <button (click)="addItem()" class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">Add</button>
                    <button (click)="showAddItem = false" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg transition">Cancel</button>
                  </div>
                </div>
              </div>
            }

            <!-- Items Table -->
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-sm font-semibold">Type</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold">Category</th>
                    <th class="px-4 py-2 text-left text-sm font-semibold">Description</th>
                    <th class="px-4 py-2 text-right text-sm font-semibold">Amount</th>
                    <th class="px-4 py-2 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  @for (item of (taxReturn?.items || []); track item.id) {
                    <tr class="hover:bg-gray-50">
                      <td class="px-4 py-2 text-sm">
                        <span class="px-2 py-1 rounded text-xs font-medium" [class]="getItemTypeClass(item.item_type)">
                          {{ item.item_type }}
                        </span>
                      </td>
                      <td class="px-4 py-2 text-sm">{{ item.category }}</td>
                      <td class="px-4 py-2 text-sm">{{ item.description }}</td>
                      <td class="px-4 py-2 text-sm text-right font-medium">KES {{ (item.amount | number: '1.2-2') }}</td>
                      <td class="px-4 py-2 text-center">
                        <button (click)="removeItem(item.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="px-4 py-4 text-center text-gray-500 text-sm">No items added yet</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Calculation Results -->
          @if (calculation) {
            <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Tax Calculation Breakdown</h2>
              <div class="space-y-2 bg-gray-50 p-4 rounded-lg">
                @for (step of calculation.steps; track step) {
                  <div class="text-sm text-gray-700">{{ step }}</div>
                }
              </div>
            </div>
          }

          <!-- Action Buttons -->
          @if (taxReturn && taxReturn.status === 'Draft') {
            <div class="flex gap-3">
              <button (click)="calculateTax()" [disabled]="service.loadingSignal()" class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition">
                {{ service.loadingSignal() ? 'Calculating...' : 'Calculate Tax' }}
              </button>
              <button (click)="submitReturn()" [disabled]="service.loadingSignal() || !taxReturn.calculated_tax" class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition">
                Submit to KRA
              </button>
              <button (click)="deleteReturn()" [disabled]="service.loadingSignal()" class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition">
                Delete
              </button>
            </div>
          }
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <!-- Deadline Info -->
          @if (taxReturn?.deadline_info) {
            <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 class="font-semibold text-gray-900 mb-3">Filing Deadline</h3>
              <div class="space-y-2">
                <div>
                  <p class="text-xs text-gray-600">Deadline</p>
                  <p class="font-medium text-gray-900">{{ taxReturn?.deadline_info?.filing_deadline | date: 'MMM dd, yyyy' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600">Priority</p>
                  <span class="px-2 py-1 rounded text-xs font-medium" [class]="getPriorityClass(taxReturn?.deadline_info?.priority)">
                    {{ taxReturn?.deadline_info?.priority }}
                  </span>
                </div>
              </div>
            </div>
          }

          <!-- Submission History -->
          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 class="font-semibold text-gray-900 mb-3">Submission History</h3>
            @if (submissions && submissions.length > 0) {
              <div class="space-y-2">
                @for (sub of submissions; track sub.id) {
                  <div class="text-xs border-l-2 border-blue-300 pl-2">
                    <p class="font-medium text-gray-900">{{ sub.submission_date | date: 'MMM dd, HH:mm' }}</p>
                    <p class="text-gray-600">{{ sub.status }}</p>
                    @if (sub.kra_acknowledgment) {
                      <p class="text-gray-500">{{ sub.kra_acknowledgment }}</p>
                    }
                  </div>
                }
              </div>
            } @else {
              <div class="text-sm text-gray-500">
                Not yet submitted
              </div>
            }
          </div>

          <!-- Notes -->
          @if (taxReturn) {
            <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 class="font-semibold text-gray-900 mb-3">Notes</h3>
              <textarea [(ngModel)]="taxReturn.notes" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" rows="4" placeholder="Add internal notes..."></textarea>
              <button (click)="saveNotes()" class="mt-2 w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition">Save Notes</button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ReturnDetailComponent implements OnInit, OnDestroy {
  taxReturn: TaxReturn | null = null;
  calculation: any = null;
  submissions: any[] = [];
  showAddItem = false;
  newItem: any = {
    item_type: 'Income',
    category: '',
    description: '',
    amount: 0,
    supporting_doc_required: false,
    supporting_doc_provided: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  selectedFile: File | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public service: TaxReturnService
  ) {}

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.loadReturn(parseInt(params['id']));
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadReturn(returnId: number) {
    this.service.getReturn(returnId).pipe(takeUntil(this.destroy$)).subscribe(ret => {
      this.taxReturn = ret;
      if (this.taxReturn?.id) {
        this.service.getSubmissionHistory(this.taxReturn.id).pipe(takeUntil(this.destroy$)).subscribe(subs => {
          this.submissions = subs;
        });
      }
    });
  }

  calculateTax() {
    if (this.taxReturn?.id) {
      this.service.calculateTax(this.taxReturn.id).pipe(takeUntil(this.destroy$)).subscribe(calc => {
        this.calculation = calc;
        this.loadReturn(this.taxReturn!.id);
      });
    }
  }

  submitReturn() {
    if (this.taxReturn?.id && confirm('Are you sure you want to submit this return to KRA?')) {
      this.service.submitReturn(this.taxReturn.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.loadReturn(this.taxReturn!.id);
      });
    }
  }

  addItem() {
    if (this.taxReturn?.id && this.newItem.description && this.newItem.amount) {
      this.service.addReturnItem(this.taxReturn.id, this.newItem).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.newItem = { item_type: 'Income', category: '', description: '', amount: 0, supporting_doc_required: false, supporting_doc_provided: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        this.showAddItem = false;
        this.loadReturn(this.taxReturn!.id);
      });
    }
  }

  onFileSelected(evt: any) {
    const files: FileList = evt.target.files;
    if (files && files.length) this.selectedFile = files[0];
  }

  uploadSelected() {
    if (!this.selectedFile || !this.taxReturn?.id) return;
    this.service.uploadAttachment(this.taxReturn.id, this.selectedFile).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.selectedFile = null;
      this.loadReturn(this.taxReturn!.id);
    });
  }

  removeItem(itemId: number) {
    if (confirm('Remove this item?')) {
      this.service.removeReturnItem(itemId).pipe(takeUntil(this.destroy$)).subscribe(() => {
        if (this.taxReturn?.id) {
          this.loadReturn(this.taxReturn.id);
        }
      });
    }
  }

  saveNotes() {
    if (this.taxReturn?.id) {
      this.service.updateReturn(this.taxReturn.id, { notes: this.taxReturn.notes }).pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  deleteReturn() {
    if (this.taxReturn?.id && confirm('Are you sure? This cannot be undone.')) {
      this.service.deleteReturn(this.taxReturn.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
        window.location.href = '/tax-returns';
      });
    }
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Submitted': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Draft': 'text-yellow-600',
      'Submitted': 'text-blue-600',
      'Approved': 'text-green-600',
      'Rejected': 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
  }

  getItemTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'Income': 'bg-green-100 text-green-800',
      'Deduction': 'bg-blue-100 text-blue-800',
      'Adjustment': 'bg-yellow-100 text-yellow-800',
      'Relief': 'bg-purple-100 text-purple-800',
      'Withholding': 'bg-gray-100 text-gray-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
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
