import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../models/app.models';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EtimsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/itax/kra-api/etims_actions.php';
  
  private invoices = signal<Invoice[]>([]);
  
  // Computed values
  allInvoices = computed(() => this.invoices());
  syncedInvoices = computed(() => 
    this.invoices().filter(i => i.status === 'synced')
  );
  pendingInvoices = computed(() => 
    this.invoices().filter(i => i.status === 'pending')
  );
  errorInvoices = computed(() => 
    this.invoices().filter(i => i.status === 'error')
  );
  totalRevenue = computed(() => 
    this.invoices().reduce((sum, i) => sum + i.amount, 0)
  );
  totalTax = computed(() => 
    this.invoices().reduce((sum, i) => sum + i.taxAmount, 0)
  );
  
  constructor() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.invoices.set(res.data);
        }
      },
      error: (err) => console.error('Failed to load invoices', err)
    });
  }

  setInvoices(data: Invoice[]) {
    this.invoices.set(data);
  }

  // Get all invoices
  getInvoices(): Invoice[] {
    return this.invoices();
  }

  // Get invoice by ID
  getInvoiceById(id: string): Invoice | undefined {
    return this.invoices().find(i => i.id === id);
  }

  // Create new invoice
  createInvoice(
    customerName: string, 
    amount: number, 
    taxRate: number = 0.16
  ): Observable<Invoice> {
    const taxAmount = amount * taxRate;
    const payload = {
      customer_name: customerName,
      amount,
      tax_amount: taxAmount,
      invoice_number: this.generateInvoiceNumber(),
      status: 'pending' // Default to pending, sync later
    };

    return this.http.post<any>(this.apiUrl, payload).pipe(
        tap(() => this.loadInvoices()),
        map(res => {
            if (res.success && res.data) {
                return {
                    id: res.data.id || 'TEMP', 
                    ...payload,
                    date: new Date().toLocaleDateString(),
                    invoiceNumber: payload.invoice_number,
                    customerName: payload.customer_name,
                    taxAmount: payload.tax_amount
                } as any as Invoice;
            }
            throw new Error(res.message || 'Sync failed');
        })
    );
  }

  // Sync invoice to eTIMS
  syncInvoice(id: string): Observable<boolean> {
     // PUT to update status to synced
     return this.http.put<any>(this.apiUrl, { id, status: 'synced' }).pipe(
         tap(() => this.loadInvoices()),
         map(res => res.success)
     );
  }

  // Retry failed sync
  retrySync(id: string): Observable<boolean> {
    return this.syncInvoice(id);
  }

  // Update invoice
  updateInvoice(id: string, updates: Partial<Invoice>): Observable<boolean> {
      // Not implemented in backend yet, just reload
     return this.loadInvoicesObservable().pipe(map(() => true));
  }

  // Delete invoice
  deleteInvoice(id: string): Observable<boolean> {
      // Not implemented in backend yet
     return this.loadInvoicesObservable().pipe(map(() => true));
  }
  
  private loadInvoicesObservable(): Observable<Invoice[]> {
      return this.http.get<Invoice[]>(this.apiUrl).pipe(
          tap(data => this.invoices.set(data))
      );
  }

  // Search invoices
  searchInvoices(query: string): Invoice[] {
    const lowerQuery = query.toLowerCase();
    return this.invoices().filter(i => 
      i.invoiceNumber.toLowerCase().includes(lowerQuery) ||
      i.customerName.toLowerCase().includes(lowerQuery)
    );
  }

  // Private helper methods
  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `INV-${year}-${random}`;
  }
}
