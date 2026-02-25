import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface TaxReturn {
  id: number;
  return_id: string;
  taxpayer_id: number;
  return_type: 'IT1' | 'Nil' | 'PAYE' | 'MRI' | 'TOT';
  tax_year: number;
  status: 'Draft' | 'Ready for Submission' | 'Submitted' | 'Acknowledged' | 'Under Review' | 'Approved' | 'Rejected' | 'Amended';
  gross_income: number;
  chargeable_income: number;
  calculated_tax: number;
  tax_due: number;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  deadline?: string;
  kra_reference?: string;
  notes?: string;
  items?: ReturnItem[];
  deadline_info?: any;
  attachments?: any[];
}

export interface ReturnItem {
  id: number;
  return_id: number;
  item_type: 'Income' | 'Deduction' | 'Adjustment' | 'Relief' | 'Withholding';
  category: string;
  description: string;
  amount: number;
  supporting_doc_required: boolean;
  supporting_doc_provided: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxCalculation {
  gross_income: number;
  deductions?: number;
  chargeable_income: number;
  calculated_tax: number;
  tax_paid?: number;
  tax_due: number;
  personal_relief?: number;
  steps: string[];
}

export interface ReturnDeadline {
  id: number;
  return_type: string;
  tax_year: number;
  filing_deadline: string;
  days_before_deadline?: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  is_extended: boolean;
  extension_reason?: string;
  new_deadline?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaxReturnService {
  private apiUrl = `${environment.apiUrl}/tax_returns_api.php`;

  // Signals for state management
  returnsSignal = signal<TaxReturn[]>([]);
  currentReturnSignal = signal<TaxReturn | null>(null);
  deadlinesSignal = signal<ReturnDeadline[]>([]);
  loadingSignal = signal(false);
  errorSignal = signal<string | null>(null);
  currentCalculationSignal = signal<TaxCalculation | null>(null);

  // Computed signals for derived state
  draftReturnsCount = computed(() =>
    this.returnsSignal().filter(r => r.status === 'Draft').length
  );
  submittedReturnsCount = computed(() =>
    this.returnsSignal().filter(r => r.status === 'Submitted').length
  );
  approvedReturnsCount = computed(() =>
    this.returnsSignal().filter(r => r.status === 'Approved').length
  );
  overdueReturnsCount = computed(() =>
    this.returnsSignal().filter(r => {
      const deadline = new Date(r.deadline || '');
      return deadline < new Date() && r.status !== 'Submitted';
    }).length
  );

  returnTypes = ['IT1', 'Nil', 'PAYE', 'MRI', 'TOT'];
  returnStatuses = ['Draft', 'Ready for Submission', 'Submitted', 'Acknowledged', 'Under Review', 'Approved', 'Rejected', 'Amended'];
  itemTypes = ['Income', 'Deduction', 'Adjustment', 'Relief', 'Withholding'];
  incomeCategories = ['Employment', 'Trade', 'Farming', 'Interest', 'Dividend', 'Capital Gains', 'Rent', 'Other'];

  constructor(private http: HttpClient) {
    this.loadDeadlines();
  }

  // List tax returns with optional filters
  listReturns(filters?: {
    return_type?: string;
    status?: string;
    year?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    this.loadingSignal.set(true);
    let url = `${this.apiUrl}?action=list`;

    if (filters?.return_type) url += `&return_type=${filters.return_type}`;
    if (filters?.status) url += `&status=${filters.status}`;
    if (filters?.year) url += `&year=${filters.year}`;
    if (filters?.search) url += `&search=${encodeURIComponent(filters.search)}`;
    if (filters?.page) url += `&page=${filters.page}`;
    if (filters?.limit) url += `&limit=${filters.limit}`;

    return this.http.get<any>(url).pipe(
      tap(response => {
        if (response.success) {
          this.returnsSignal.set(response.data || []);
          this.errorSignal.set(null);
        }
      }),
      tap(() => this.loadingSignal.set(false))
    );
  }

  // Get single return with full details
  getReturn(returnId: number): Observable<TaxReturn> {
    this.loadingSignal.set(true);
    return this.http.get<any>(`${this.apiUrl}?action=get&return_id=${returnId}`).pipe(
      tap(response => {
        if (response.success) {
          this.currentReturnSignal.set(response.data);
          this.errorSignal.set(null);
        }
      }),
      tap(() => this.loadingSignal.set(false)),
      map(response => response.data)
    );
  }

  // Create new tax return
  createReturn(data: {
    return_type: string;
    tax_year: number;
    taxpayer_id: number;
  }): Observable<TaxReturn> {
    this.loadingSignal.set(true);
    return this.http.post<any>(`${this.apiUrl}?action=create`, data).pipe(
      tap(response => {
        if (response.success) {
          this.errorSignal.set(null);
          // Refresh list
          this.listReturns({ year: data.tax_year }).subscribe();
        }
      }),
      tap(() => this.loadingSignal.set(false)),
      map(response => response.data)
    );
  }

  // Update return
  updateReturn(returnId: number, data: any): Observable<TaxReturn> {
    this.loadingSignal.set(true);
    return this.http.post<any>(`${this.apiUrl}?action=update&return_id=${returnId}`, data).pipe(
      tap(response => {
        if (response.success) {
          if (this.currentReturnSignal()?.id === returnId) {
            this.currentReturnSignal.set(response.data);
          }
          this.errorSignal.set(null);
        }
      }),
      tap(() => this.loadingSignal.set(false)),
      map(response => response.data)
    );
  }

  // Delete return
  deleteReturn(returnId: number): Observable<any> {
    this.loadingSignal.set(true);
    return this.http.post<any>(`${this.apiUrl}?action=delete&return_id=${returnId}`, {}).pipe(
      tap(response => {
        if (response.success) {
          const returns = this.returnsSignal().filter(r => r.id !== returnId);
          this.returnsSignal.set(returns);
          if (this.currentReturnSignal()?.id === returnId) {
            this.currentReturnSignal.set(null);
          }
          this.errorSignal.set(null);
        }
      }),
      tap(() => this.loadingSignal.set(false))
    );
  }

  // Add line item to return
  addReturnItem(returnId: number, item: Omit<ReturnItem, 'id' | 'return_id' | 'created_at' | 'updated_at'>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=add_item&return_id=${returnId}`, item).pipe(
      tap(response => {
        if (response.success) {
          // Refresh current return
          this.getReturn(returnId).subscribe();
        }
      })
    );
  }

  // Remove line item from return
  removeReturnItem(itemId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=remove_item&item_id=${itemId}`, {});
  }

  // Calculate tax for a return
  calculateTax(returnId: number): Observable<TaxCalculation> {
    this.loadingSignal.set(true);
    return this.http.get<any>(`${this.apiUrl}?action=calculate_tax&return_id=${returnId}`).pipe(
      tap(response => {
        if (response.success) {
          this.currentCalculationSignal.set(response.data);
          this.getReturn(returnId).subscribe(); // Refresh return with updated values
          this.errorSignal.set(null);
        }
      }),
      tap(() => this.loadingSignal.set(false)),
      map(response => response.data)
    );
  }

  // Submit return to KRA
  submitReturn(returnId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=submit&return_id=${returnId}`, {}).pipe(
      tap(response => {
        if (response.success) {
          this.getReturn(returnId).subscribe();
        }
      })
    );
  }

  // Get filing deadlines
  private loadDeadlines(): void {
    const year = new Date().getFullYear();
    this.http.get<any>(`${this.apiUrl}?action=get_deadlines&year=${year}`).pipe(
      tap(response => {
        if (response.success) {
          this.deadlinesSignal.set(response.data || []);
        }
      })
    ).subscribe();
  }

  // Get return categories and item types
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=get_categories`);
  }

  // Get deadlines for a specific year
  getDeadlinesByYear(year: number): Observable<ReturnDeadline[]> {
    return this.http.get<any>(`${this.apiUrl}?action=get_deadlines&year=${year}`).pipe(
      map(response => response.data || [])
    );
  }

  // Get submission history for a return
  getSubmissionHistory(returnId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}?action=get_submission_history&return_id=${returnId}`).pipe(
      map(response => response.data || [])
    );
  }

  // Upload attachment for a return
  uploadAttachment(returnId: number, file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<any>(`${this.apiUrl}?action=upload_attachment&return_id=${returnId}`, fd).pipe(
      tap(response => {
        if (response.success) {
          this.getReturn(returnId).subscribe();
        }
      })
    );
  }

  // Import PAYE CSV
  importPaye(file: File, taxpayerId: number, taxYear: number): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('taxpayer_id', String(taxpayerId));
    fd.append('tax_year', String(taxYear));
    return this.http.post<any>(`${this.apiUrl}?action=import_paye`, fd);
  }
}
