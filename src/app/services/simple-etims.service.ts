import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimpleEtimsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/itax/kra-api';

  // Signals for reactive state management
  private invoices = signal<any[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  // Computed properties
  allInvoices = this.invoices.asReadonly();
  isLoading = this.loading.asReadonly();
  errorMessage = this.error.asReadonly();

  // Computed statistics
  totalInvoicesCount = computed(() => {
    return this.invoices().length;
  });

  syncedCount = computed(() => {
    return this.invoices().filter(i => i.sync_status === 'synced').length;
  });

  pendingCount = computed(() => {
    return this.invoices().filter(i => i.sync_status === 'pending').length;
  });

  failedCount = computed(() => {
    return this.invoices().filter(i => i.sync_status === 'failed').length;
  });

  totalRevenue = computed(() => {
    return this.invoices().reduce((sum, i) => sum + (i.total_amount || 0), 0);
  });

  totalTax = computed(() => {
    return this.invoices().reduce((sum, i) => sum + (i.tax_amount || 0), 0);
  });

  overdueCount = computed(() => {
    const today = new Date();
    return this.invoices().filter(i => {
      const dueDate = new Date(i.due_date);
      return dueDate < today && i.status !== 'paid';
    }).length;
  });

  pendingInvoices = computed(() => {
    return this.invoices().filter(i => i.sync_status === 'pending');
  });

  // Methods
  loadInvoices(): Observable<any[]> {
    this.loading.set(true);
    this.error.set(null);

    // Mock data for now
    const mockInvoices = [
      {
        id: 1,
        invoice_number: 'INV-001',
        customer_name: 'ABC Company Ltd',
        invoice_date: '2024-01-15',
        due_date: '2024-02-15',
        total_amount: 118000,
        tax_amount: 18000,
        status: 'paid',
        sync_status: 'synced'
      },
      {
        id: 2,
        invoice_number: 'INV-002',
        customer_name: 'XYZ Enterprises',
        invoice_date: '2024-01-20',
        due_date: '2024-02-20',
        total_amount: 236000,
        tax_amount: 36000,
        status: 'pending',
        sync_status: 'pending'
      },
      {
        id: 3,
        invoice_number: 'INV-003',
        customer_name: 'DEF Industries',
        invoice_date: '2024-01-25',
        due_date: '2024-02-25',
        total_amount: 59000,
        tax_amount: 9000,
        status: 'overdue',
        sync_status: 'failed'
      }
    ];

    this.invoices.set(mockInvoices);
    this.loading.set(false);
    
    return of(mockInvoices);
  }

  refresh(): void {
    this.loadInvoices().subscribe();
  }

  exportToExcel(data: any[]): void {
    console.log('Exporting invoices to Excel:', data);
    // Implement Excel export logic here
  }

  printInvoice(invoice: any): void {
    console.log('Printing invoice:', invoice);
    // Implement print logic here
  }

  createInvoice(invoiceData: any): Observable<any> {
    console.log('Creating invoice:', invoiceData);
    // Implement create invoice logic here
    return of({ success: true, data: invoiceData });
  }

  syncInvoice(invoiceId: number): Observable<any> {
    console.log('Syncing invoice:', invoiceId);
    // Implement sync logic here
    return of({ success: true });
  }

  syncAllPending(): Observable<any> {
    const pending = this.pendingInvoices();
    console.log('Syncing all pending invoices:', pending.length);
    // Implement batch sync logic here
    return of({ success: true, synced: pending.length });
  }
}
