import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimplePaymentsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/itax/kra-api';

  // Signals for reactive state management
  private payments = signal<any[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  // Computed properties
  allPayments = this.payments.asReadonly();
  isLoading = this.loading.asReadonly();
  errorMessage = this.error.asReadonly();

  // Computed statistics
  totalPaid = computed(() => {
    return this.payments()
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  });

  totalPending = computed(() => {
    return this.payments()
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  });

  paidCount = computed(() => {
    return this.payments().filter(p => p.status === 'paid').length;
  });

  pendingCount = computed(() => {
    return this.payments().filter(p => p.status === 'pending').length;
  });

  failedCount = computed(() => {
    return this.payments().filter(p => p.status === 'failed').length;
  });

  totalPaymentsCount = computed(() => {
    return this.payments().length;
  });

  failedPayments = computed(() => {
    return this.payments().filter(p => p.status === 'failed');
  });

  // Methods
  loadPayments(): Observable<any[]> {
    this.loading.set(true);
    this.error.set(null);

    // Mock data for now
    const mockPayments = [
      {
        id: 1,
        payment_reference: 'PAY-001',
        tax_type: 'VAT',
        amount: 15000,
        payment_date: '2024-01-15',
        status: 'paid',
        payment_method: 'bank'
      },
      {
        id: 2,
        payment_reference: 'PAY-002',
        tax_type: 'PAYE',
        amount: 25000,
        payment_date: '2024-01-20',
        status: 'pending',
        payment_method: 'mobile'
      },
      {
        id: 3,
        payment_reference: 'PAY-003',
        tax_type: 'Corporate Tax',
        amount: 50000,
        payment_date: '2024-01-25',
        status: 'failed',
        payment_method: 'online'
      }
    ];

    this.payments.set(mockPayments);
    this.loading.set(false);
    
    return of(mockPayments);
  }

  refresh(): void {
    this.loadPayments().subscribe();
  }

  exportToExcel(data: any[]): void {
    console.log('Exporting payments to Excel:', data);
    // Implement Excel export logic here
  }

  printReceipt(payment: any): void {
    console.log('Printing receipt for payment:', payment);
    // Implement print logic here
  }

  createPayment(paymentData: any): Observable<any> {
    console.log('Creating payment:', paymentData);
    // Implement create payment logic here
    return of({ success: true, data: paymentData });
  }

  processPayment(paymentId: number): Observable<any> {
    console.log('Processing payment:', paymentId);
    // Implement payment processing logic here
    return of({ success: true });
  }

  refundPayment(paymentId: number, reason: string): Observable<any> {
    console.log('Refunding payment:', paymentId, reason);
    // Implement refund logic here
    return of({ success: true });
  }
}
