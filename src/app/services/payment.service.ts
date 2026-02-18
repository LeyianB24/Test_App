import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from '../models/app.models';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/itax/kra-api/payment_actions.php'; 

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
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success && Array.isArray(res.data)) {
          this.payments.set(res.data);
          console.log('Payments loaded:', res.data);
        }
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
    const payload = { type, amount, taxpayer_id: taxpayerId };
    return this.http.post<any>(this.apiUrl, payload, { withCredentials: true }).pipe(
      map(res => {
        if (res.success && res.data?.payment) {
          // Update local state
          this.payments.update(current => [res.data.payment, ...current]);
          return res.data.payment;
        } else {
          throw new Error(res.message || 'Failed to generate PRN');
        }
      })
    );
  }

  markAsPaid(id: number, method: string): Observable<boolean> {
    const payload = { id, status: 'paid', method };
    return this.http.put<any>(this.apiUrl, payload, { withCredentials: true }).pipe(
      map(res => {
        if (res.success) {
          // Update local state
          this.payments.update(current => {
            return current.map(p => {
              if (p.id === id) {
                return { ...p, status: 'paid', method };
              }
              return p;
            });
          });
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
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
