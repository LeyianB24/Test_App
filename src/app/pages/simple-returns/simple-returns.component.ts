import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SimpleReturnsService } from '../../services/simple-returns.service';
import { SimpleDataTableComponent } from '../../components/simple-data-table/simple-data-table.component';

@Component({
  selector: 'app-simple-returns',
  standalone: true,
  imports: [CommonModule, SimpleDataTableComponent],
  template: `
    <div class="simple-returns">
      <div class="page-header">
        <h2>Tax Returns Management</h2>
        <button class="btn-primary" (click)="fileReturn()">File Return</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Draft</h3>
          <p class="stat-value">{{returnsService.draftCount()}}</p>
          <p class="stat-count">Returns being prepared</p>
        </div>
        <div class="stat-card">
          <h3>Submitted</h3>
          <p class="stat-value">{{returnsService.submittedCount()}}</p>
          <p class="stat-count">Returns filed with KRA</p>
        </div>
        <div class="stat-card">
          <h3>Accepted</h3>
          <p class="stat-value">{{returnsService.acceptedCount()}}</p>
          <p class="stat-count">Returns approved by KRA</p>
        </div>
        <div class="stat-card">
          <h3>Rejected</h3>
          <p class="stat-value">{{returnsService.rejectedCount()}}</p>
          <p class="stat-count">Returns requiring corrections</p>
        </div>
      </div>

      <div class="financial-summary">
        <h3>Financial Overview</h3>
        <div class="financial-grid">
          <div class="financial-item">
            <span class="financial-label">Total Tax Payable:</span>
            <span class="financial-value">{{formatCurrency(returnsService.totalTaxPayable())}}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">Total Tax Paid:</span>
            <span class="financial-value">{{formatCurrency(returnsService.totalTaxPaid())}}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">Total Penalties:</span>
            <span class="financial-value penalty">{{formatCurrency(returnsService.totalPenalties())}}</span>
          </div>
          <div class="financial-item">
            <span class="financial-label">Total Refunds:</span>
            <span class="financial-value refund">{{formatCurrency(returnsService.totalRefunds())}}</span>
          </div>
        </div>
      </div>

      <div class="returns-table">
        <app-simple-data-table
          [data]="returnsService.allReturns()"
          [columns]="['return_reference', 'tax_type', 'tax_year', 'tax_period', 'filing_date', 'status', 'total_income', 'tax_payable']"
          [title]="'Tax Return Records'"
        ></app-simple-data-table>
      </div>

      <div class="actions">
        <button class="btn-secondary" (click)="exportReturns()">Export</button>
        <button class="btn-secondary" (click)="returnsService.refresh()">Refresh</button>
      </div>
    </div>
  `,
  styles: [`
    .simple-returns {
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
    
    .financial-value.penalty {
      color: #dc3545;
    }
    
    .financial-value.refund {
      color: #28a745;
    }
    
    .returns-table {
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
export class SimpleReturnsComponent {
  private router = inject(Router);
  returnsService = inject(SimpleReturnsService);

  fileReturn(): void {
    // Navigate to return filing or show modal
    console.log('File return clicked');
  }

  exportReturns(): void {
    this.returnsService.exportToExcel(this.returnsService.allReturns());
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  }
}
