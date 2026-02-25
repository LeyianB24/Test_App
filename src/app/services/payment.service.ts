import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../models/app.models';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments_api_v2.php`;

  // Signals to hold state
  payments = signal<Payment[]>([]);

  // Computed signals (derived from the main payments signal)
  pendingPayments = computed(() => this.payments().filter(p => p.status === 'pending'));
  paidPayments = computed(() => this.payments().filter(p => p.status === 'paid'));

  totalPaid = computed(() =>
    this.paidPayments().reduce((sum, p) => sum + p.amount, 0)
  );

  totalPending = computed(() =>
    this.pendingPayments().reduce((sum, p) => sum + p.amount, 0)
  );

  constructor() {}

  refreshPayments(): Observable<any> {
    // Updated to use new API endpoint
    const listUrl = `${this.apiUrl}/payments/list`;
    return this.http.get<any>(listUrl, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success && Array.isArray(res.data?.payments)) {
          this.payments.set(res.data.payments);
          console.log('Payments loaded:', res.data.payments);
        }
      }),
      catchError(error => {
        console.error('Failed to load payments:', error);
        return of();
      })
    );
  }

  setPayments(data: Payment[]) {
    this.payments.set(data);
  }

  searchPayments(query: string) {
    const q = query.toLowerCase();
    return this.payments().filter(p =>
      p.prn.includes(q) || p.type.toLowerCase().includes(q)
    );
  }

  generatePRN(type: string, amount: number, taxpayerId?: string): Observable<Payment> {
    // Updated to use new API structure with tax_type and payment_method
    const createUrl = `${this.apiUrl}/payments/create`;
    const payload = {
      tax_type: type,
      amount,
      payment_method: 'mpesa' // Default to M-PESA
    };

    return this.http.post<any>(createUrl, payload, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success && res.data) {
          // Update local state with new payment
          this.payments.update(current => [res.data, ...current]);
          console.log('Payment created with PRN:', res.data.prn);
        }
      }),
      map(res => {
        if (res.success && res.data) {
          return res.data;
        } else {
          throw new Error(res.message || 'Failed to create payment');
        }
      }),
      catchError(error => {
        const message = error.error?.message || 'Failed to create payment';
        console.error('Payment creation error:', message);
        throw new Error(message);
      })
    );
  }

  markAsPaid(id: number, method: string): Observable<boolean> {
    // Updated to use new API endpoint for payment completion
    const completeUrl = `${this.apiUrl}/payments/${id}/complete`;
    const payload = { mpesa_reference: method || 'MANUAL' };

    return this.http.post<any>(completeUrl, payload, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success) {
          // Update local state
          this.payments.update(current => {
            return current.map(p => {
              if (p.id === id) {
                return { ...p, status: 'paid' };
              }
              return p;
            });
          });
        }
      }),
      map(res => res.success === true),
      catchError(error => {
        console.error('Payment completion error:', error);
        return of(false);
      })
    );
  }

  // Get payment by ID
  getPaymentById(id: number): Payment | undefined {
    return this.payments().find(p => p.id === id);
  }

  // Get payments by taxpayer
  getPaymentsByTaxpayer(taxpayerId: string): Payment[] {
    return this.payments().filter(p => p.taxpayerId === taxpayerId);
  }
}
