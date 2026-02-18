import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-simple-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="simple-dashboard">
      <div class="dashboard-header">
        <h2>Welcome to iTax Portal</h2>
        <p>Manage your tax payments, returns, and eTIMS invoices</p>
      </div>

      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-grid">
          <button class="action-btn" (click)="navigateTo('/dashboard')">
            Dashboard
          </button>
          <button class="action-btn" (click)="navigateTo('/payments')">
            Make Payment
          </button>
          <button class="action-btn" (click)="navigateTo('/returns')">
            File Return
          </button>
          <button class="action-btn" (click)="navigateTo('/etims')">
            Create Invoice
          </button>
          <button class="action-btn" (click)="navigateTo('/profile')">
            Update Profile
          </button>
        </div>
      </div>

      <div class="user-info">
        <h3>User Information</h3>
        <p><strong>Name:</strong> {{authService.userName()}}</p>
        <p><strong>Email:</strong> {{authService.currentUser()?.email}}</p>
        <p><strong>Taxpayer ID:</strong> {{authService.currentUser()?.taxpayer_id}}</p>
      </div>

      <div class="logout-section">
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>
    </div>
  `,
  styles: [`
    .simple-dashboard {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .dashboard-header h2 {
      color: #333;
      margin-bottom: 10px;
    }
    
    .dashboard-header p {
      color: #666;
    }
    
    .quick-actions {
      margin-bottom: 40px;
    }
    
    .quick-actions h3 {
      margin-bottom: 20px;
      color: #333;
    }
    
    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    .action-btn {
      padding: 16px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    
    .action-btn:hover {
      background: #0056b3;
    }
    
    .user-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    
    .user-info h3 {
      margin-top: 0;
      margin-bottom: 16px;
      color: #333;
    }
    
    .user-info p {
      margin: 8px 0;
      color: #666;
    }
    
    .logout-section {
      text-align: center;
    }
    
    .logout-btn {
      padding: 12px 24px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }
    
    .logout-btn:hover {
      background: #c82333;
    }
  `]
})
export class SimpleDashboardComponent {
  private router = inject(Router);
  authService = inject(AuthService);

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
  }
}
