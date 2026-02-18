import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SimplePaymentsService } from '../../services/simple-payments.service';
import { SimpleDataTableComponent } from '../../components/simple-data-table/simple-data-table.component';

@Component({
  selector: 'app-simple-payments',
  standalone: true,
  imports: [CommonModule, SimpleDataTableComponent],
  template: `
    <div class="simple-payments">
      <div class="page-header">
        <h2>Payment Management</h2>
        <button class="btn-primary" (click)="createPayment()">New Payment</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Paid</h3>
          <p class="stat-value">{{formatCurrency(paymentsService.totalPaid())}}</p>
          <p class="stat-count">{{paymentsService.paidCount()}} payments</p>
        </div>
        <div class="stat-card">
          <h3>Pending</h3>
          <p class="stat-value">{{formatCurrency(paymentsService.totalPending())}}</p>
          <p class="stat-count">{{paymentsService.pendingCount()}} payments</p>
        </div>
        <div class="stat-card">
          <h3>Failed</h3>
          <p class="stat-value">{{formatCurrency(getFailedAmount())}}</p>
          <p class="stat-count">{{paymentsService.failedCount()}} payments</p>
        </div>
      </div>

      <div class="payments-table">
        <app-simple-data-table
          [data]="paymentsService.allPayments()"
          [columns]="['payment_reference', 'tax_type', 'amount', 'payment_date', 'status']"
          [title]="'Payment Records'"
        ></app-simple-data-table>
      </div>

      <div class="actions">
        <button class="btn-secondary" (click)="exportPayments()">Export</button>
        <button class="btn-secondary" (click)="paymentsService.refresh()">Refresh</button>
      </div>
    </div>
  `,
  styles: [`
    .simple-payments {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    
    .page-header h2 {
      margin: 0;
      color: #333;
    }
    
    .btn-primary {
      padding: 12px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .btn-primary:hover {
      background: #0056b3;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .stat-card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007bff;
      margin: 0 0 5px 0;
    }
    
    .stat-count {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .payments-table {
      margin-bottom: 30px;
    }
    
    .actions {
      display: flex;
      gap: 12px;
    }
    
    .btn-secondary {
      padding: 10px 20px;
      background: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .btn-secondary:hover {
      background: #545b62;
    }
  `]
})
export class SimplePaymentsComponent {
  private router = inject(Router);
  paymentsService = inject(SimplePaymentsService);

  createPayment(): void {
    // Navigate to payment creation or show modal
    console.log('Create payment clicked');
  }

  exportPayments(): void {
    this.paymentsService.exportToExcel(this.paymentsService.allPayments());
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  }

  getFailedAmount(): number {
    const failedPayments = this.paymentsService.failedPayments();
    return failedPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  }
}
