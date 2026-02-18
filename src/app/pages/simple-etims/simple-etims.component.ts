import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SimpleEtimsService } from '../../services/simple-etims.service';
import { SimpleDataTableComponent } from '../../components/simple-data-table/simple-data-table.component';

@Component({
  selector: 'app-simple-etims',
  standalone: true,
  imports: [CommonModule, SimpleDataTableComponent],
  template: `
    <div class="simple-etims">
      <div class="page-header">
        <h2>eTIMS Invoice Management</h2>
        <button class="btn-primary" (click)="createInvoice()">Create Invoice</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Invoices</h3>
          <p class="stat-value">{{etimsService.totalInvoicesCount()}}</p>
          <p class="stat-count">All invoices</p>
        </div>
        <div class="stat-card">
          <h3>Synced</h3>
          <p class="stat-value">{{etimsService.syncedCount()}}</p>
          <p class="stat-count">Successfully synced to KRA</p>
        </div>
        <div class="stat-card">
          <h3>Pending</h3>
          <p class="stat-value">{{etimsService.pendingCount()}}</p>
          <p class="stat-count">Awaiting synchronization</p>
        </div>
        <div class="stat-card">
          <h3>Failed</h3>
          <p class="stat-value">{{etimsService.failedCount()}}</p>
          <p class="stat-count">Sync failed - needs retry</p>
        </div>
      </div>

      <div class="financial-summary">
        <h3>Financial Overview</h3>
        <div class="financial-grid">
          <div class="financial-item">
            <span class="financial-label">Total Revenue:</span>
            <span class="financial-value">{{formatCurrency(etimsService.totalRevenue())}}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">Total Tax:</span>
            <span class="financial-value">{{formatCurrency(etimsService.totalTax())}}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">Overdue Invoices:</span>
            <span class="financial-value overdue">{{etimsService.overdueCount()}}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">Sync Rate:</span>
            <span class="financial-value">{{getSyncRate()}}%</span>
          </div>
        </div>
      </div>

      <div class="invoices-table">
        <app-simple-data-table
          [data]="etimsService.allInvoices()"
          [columns]="['invoice_number', 'customer_name', 'invoice_date', 'due_date', 'total_amount', 'status', 'sync_status']"
          [title]="'Invoice Records'"
        ></app-simple-data-table>
      </div>

      <div class="actions">
        <button class="btn-secondary" (click)="exportInvoices()">Export</button>
        <button class="btn-secondary" (click)="etimsService.refresh()">Refresh</button>
        <button class="btn-warning" (click)="syncPendingInvoices()">Sync All Pending</button>
      </div>
    </div>
  `,
  styles: [`
    .simple-etims {
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
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
      font-size: 1.8rem;
      font-weight: bold;
      color: #007bff;
      margin: 0 0 5px 0;
    }
    
    .stat-count {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .financial-summary {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    
    .financial-summary h3 {
      margin: 0 0 16px 0;
      color: #333;
    }
    
    .financial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .financial-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .financial-label {
      font-weight: 500;
      color: #333;
    }
    
    .financial-value {
      font-weight: 700;
      color: #333;
    }
    
    .financial-value.overdue {
      color: #dc3545;
    }
    
    .invoices-table {
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
    
    .btn-warning {
      padding: 10px 20px;
      background: #ffc107;
      color: #212529;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .btn-warning:hover {
      background: #e0a800;
    }
  `]
})
export class SimpleEtimsComponent {
  private router = inject(Router);
  etimsService = inject(SimpleEtimsService);

  createInvoice(): void {
    // Navigate to invoice creation or show modal
    console.log('Create invoice clicked');
  }

  exportInvoices(): void {
    this.etimsService.exportToExcel(this.etimsService.allInvoices());
  }

  syncPendingInvoices(): void {
    const pendingInvoices = this.etimsService.pendingInvoices();
    if (pendingInvoices.length === 0) {
      console.log('No pending invoices to sync');
      return;
    }

    console.log(`Syncing ${pendingInvoices.length} pending invoices...`);
    // Implement batch sync logic here
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  }

  getSyncRate(): number {
    const total = this.etimsService.totalInvoicesCount();
    const synced = this.etimsService.syncedCount();
    return total > 0 ? Math.round((synced / total) * 100) : 0;
  }
}
