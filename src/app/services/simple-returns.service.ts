import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimpleReturnsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/itax/kra-api';

  // Signals for reactive state management
  private returns = signal<any[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  // Computed properties
  allReturns = this.returns.asReadonly();
  isLoading = this.loading.asReadonly();
  errorMessage = this.error.asReadonly();

  // Computed statistics
  draftCount = computed(() => {
    return this.returns().filter(r => r.status === 'draft').length;
  });

  submittedCount = computed(() => {
    return this.returns().filter(r => r.status === 'submitted').length;
  });

  acceptedCount = computed(() => {
    return this.returns().filter(r => r.status === 'accepted').length;
  });

  rejectedCount = computed(() => {
    return this.returns().filter(r => r.status === 'rejected').length;
  });

  totalTaxPayable = computed(() => {
    return this.returns().reduce((sum, r) => sum + (r.tax_payable || 0), 0);
  });

  totalTaxPaid = computed(() => {
    return this.returns().reduce((sum, r) => sum + (r.tax_paid || 0), 0);
  });

  totalPenalties = computed(() => {
    return this.returns().reduce((sum, r) => sum + (r.penalties || 0), 0);
  });

  totalRefunds = computed(() => {
    return this.returns().reduce((sum, r) => sum + (r.refunds || 0), 0);
  });

  // Methods
  loadReturns(): Observable<any[]> {
    this.loading.set(true);
    this.error.set(null);

    // Mock data for now
    const mockReturns = [
      {
        id: 1,
        return_reference: 'RET-001',
        tax_type: 'VAT Return',
        tax_year: '2024',
        tax_period: 'Q1',
        filing_date: '2024-01-31',
        due_date: '2024-01-31',
        status: 'submitted',
        total_income: 100000,
        tax_payable: 16000,
        tax_paid: 16000,
        penalties: 0,
        refunds: 0
      },
      {
        id: 2,
        return_reference: 'RET-002',
        tax_type: 'PAYE Return',
        tax_year: '2024',
        tax_period: 'Q1',
        filing_date: '2024-02-15',
        due_date: '2024-02-15',
        status: 'accepted',
        total_income: 50000,
        tax_payable: 8000,
        tax_paid: 8000,
        penalties: 0,
        refunds: 0
      },
      {
        id: 3,
        return_reference: 'RET-003',
        tax_type: 'Corporate Tax Return',
        tax_year: '2024',
        tax_period: 'Annual',
        filing_date: '2024-03-01',
        due_date: '2024-03-01',
        status: 'rejected',
        total_income: 200000,
        tax_payable: 32000,
        tax_paid: 30000,
        penalties: 2000,
        refunds: 0
      }
    ];

    this.returns.set(mockReturns);
    this.loading.set(false);
    
    return of(mockReturns);
  }

  refresh(): void {
    this.loadReturns().subscribe();
  }

  exportToExcel(data: any[]): void {
    console.log('Exporting returns to Excel:', data);
    // Implement Excel export logic here
  }

  printReturn(taxReturn: any): void {
    console.log('Printing return:', taxReturn);
    // Implement print logic here
  }

  createReturn(returnData: any): Observable<any> {
    console.log('Creating return:', returnData);
    // Implement create return logic here
    return of({ success: true, data: returnData });
  }

  submitReturn(returnId: number): Observable<any> {
    console.log('Submitting return:', returnId);
    // Implement submit logic here
    return of({ success: true });
  }

  amendReturn(returnId: number, reason: string): Observable<any> {
    console.log('Amending return:', returnId, reason);
    // Implement amend logic here
    return of({ success: true });
  }
}
