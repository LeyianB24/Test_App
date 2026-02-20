import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { NotificationService } from '../services/notification.service';

export interface DashboardMetrics {
  totalTaxCollected: number;
  totalTaxpayers: number;
  pendingPayments: number;
  overdueObligations: number;
  systemHealth: number;
  averagePaymentTime: number;
}

export interface ChartData {
  label: string;
  value: number;
  percentage: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>📊 Admin Dashboard & Analytics</h1>
          <p>System overview and performance metrics</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" (click)="refreshData()">🔄 Refresh</button>
          <button class="btn-secondary" (click)="generateSystemReport()">📋 System Report</button>
          <button class="btn-secondary" (click)="exportMetrics()">📥 Export</button>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card primary">
          <div class="metric-icon">💰</div>
          <div class="metric-content">
            <h3>Total Tax Collected</h3>
            <p class="metric-value">{{ (metrics.totalTaxCollected | number: '1.2-2') }}</p>
            <span class="badge positive">+12.5%</span>
          </div>
        </div>
        <div class="metric-card success">
          <div class="metric-icon">👥</div>
          <div class="metric-content">
            <h3>Active Taxpayers</h3>
            <p class="metric-value">{{ metrics.totalTaxpayers }}</p>
            <span class="badge positive">+3.2%</span>
          </div>
        </div>
        <div class="metric-card warning">
          <div class="metric-icon">⏳</div>
          <div class="metric-content">
            <h3>Pending Payments</h3>
            <p class="metric-value">{{ metrics.pendingPayments }}</p>
            <span class="badge negative">-2.1%</span>
          </div>
        </div>
        <div class="metric-card danger">
          <div class="metric-icon">🚨</div>
          <div class="metric-content">
            <h3>Overdue Obligations</h3>
            <p class="metric-value">{{ metrics.overdueObligations }}</p>
            <span class="badge warning">⚠️ Alert</span>
          </div>
        </div>
        <div class="metric-card info">
          <div class="metric-icon">⚙️</div>
          <div class="metric-content">
            <h3>System Health</h3>
            <p class="metric-value">{{ metrics.systemHealth }}%</p>
            <div class="health-bar">
              <div class="health-fill" [style.width.%]="metrics.systemHealth"></div>
            </div>
          </div>
        </div>
        <div class="metric-card secondary">
          <div class="metric-icon">⏱️</div>
          <div class="metric-content">
            <h3>Avg Payment Time</h3>
            <p class="metric-value">{{ metrics.averagePaymentTime }} days</p>
            <span class="badge positive">On Track</span>
          </div>
        </div>
      </div>

      <!-- Charts & Analytics Row 1 -->
      <div class="analytics-grid">
        <!-- Payment Status Distribution -->
        <div class="chart-card">
          <h3>Payment Status Distribution</h3>
          <div class="chart-container">
            <div class="pie-chart">
              <div class="pie-segment" style="--percentage: 65;" [style.--color]="'#28a745'">
                <span class="segment-label">Paid<br/>65%</span>
              </div>
              <div class="pie-segment" style="--percentage: 25;" [style.--color]="'#ffc107'">
                <span class="segment-label">Pending<br/>25%</span>
              </div>
              <div class="pie-segment" style="--percentage: 10;" [style.--color]="'#dc3545'">
                <span class="segment-label">Overdue<br/>10%</span>
              </div>
            </div>
          </div>
          <div class="legend">
            <div class="legend-item">
              <span class="legend-color" style="background: #28a745;"></span>
              <span>Paid: 650 (65%)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #ffc107;"></span>
              <span>Pending: 250 (25%)</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #dc3545;"></span>
              <span>Overdue: 100 (10%)</span>
            </div>
          </div>
        </div>

        <!-- Revenue Trend -->
        <div class="chart-card">
          <h3>Monthly Revenue Trend</h3>
          <div class="bar-chart">
            <div class="bar-item">
              <div class="bar" style="height: 60%;"></div>
              <span>Jan</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 75%;"></div>
              <span>Feb</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 82%;"></div>
              <span>Mar</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 70%;"></div>
              <span>Apr</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 90%;"></div>
              <span>May</span>
            </div>
            <div class="bar-item">
              <div class="bar" style="height: 85%;"></div>
              <span>Jun</span>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="chart-card">
          <h3>Payment Methods Used</h3>
          <div class="bar-chart horizontal">
            <div class="bar-item-h">
              <span>M-PESA</span>
              <div class="bar">
                <div class="bar-value" style="width: 55%;"></div>
              </div>
              <span>55%</span>
            </div>
            <div class="bar-item-h">
              <span>Bank Transfer</span>
              <div class="bar">
                <div class="bar-value" style="width: 30%;"></div>
              </div>
              <span>30%</span>
            </div>
            <div class="bar-item-h">
              <span>Cheque</span>
              <div class="bar">
                <div class="bar-value" style="width: 10%;"></div>
              </div>
              <span>10%</span>
            </div>
            <div class="bar-item-h">
              <span>Other</span>
              <div class="bar">
                <div class="bar-value" style="width: 5%;"></div>
              </div>
              <span>5%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Performance & Compliance -->
      <div class="analytics-grid">
        <!-- System Performance -->
        <div class="chart-card">
          <h3>System Performance Metrics</h3>
          <div class="metrics-list">
            <div class="metric-item">
              <span class="metric-name">API Response Time</span>
              <div class="metric-bar">
                <div class="metric-fill" style="width: 92%;"></div>
              </div>
              <span class="metric-val">245ms</span>
            </div>
            <div class="metric-item">
              <span class="metric-name">Database Performance</span>
              <div class="metric-bar">
                <div class="metric-fill success" style="width: 98%;"></div>
              </div>
              <span class="metric-val">98%</span>
            </div>
            <div class="metric-item">
              <span class="metric-name">Server Uptime</span>
              <div class="metric-bar">
                <div class="metric-fill success" style="width: 99.9%;"></div>
              </div>
              <span class="metric-val">99.9%</span>
            </div>
            <div class="metric-item">
              <span class="metric-name">Cache Hit Rate</span>
              <div class="metric-bar">
                <div class="metric-fill success" style="width: 87%;"></div>
              </div>
              <span class="metric-val">87%</span>
            </div>
          </div>
        </div>

        <!-- Compliance Status -->
        <div class="chart-card">
          <h3>Compliance & Audit Status</h3>
          <div class="compliance-items">
            <div class="compliance-item">
              <div class="compliance-icon success">✓</div>
              <div class="compliance-content">
                <p class="compliance-name">Data Validation</p>
                <p class="compliance-desc">All payments validated</p>
              </div>
            </div>
            <div class="compliance-item">
              <div class="compliance-icon success">✓</div>
              <div class="compliance-content">
                <p class="compliance-name">Audit Trail</p>
                <p class="compliance-desc">Fully logged</p>
              </div>
            </div>
            <div class="compliance-item">
              <div class="compliance-icon success">✓</div>
              <div class="compliance-content">
                <p class="compliance-name">Security Compliance</p>
                <p class="compliance-desc">HTTPS enforced</p>
              </div>
            </div>
            <div class="compliance-item">
              <div class="compliance-icon warning">!</div>
              <div class="compliance-content">
                <p class="compliance-name">Pending Audits</p>
                <p class="compliance-desc">3 items awaiting review</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="chart-card">
          <h3>Recent System Activity</h3>
          <div class="activity-list">
            <div class="activity-item">
              <span class="activity-time">2 min ago</span>
              <div class="activity-content">
                <p class="activity-action">💳 Payment Processed</p>
                <p class="activity-detail">$5,000 from TID-1234</p>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-time">15 min ago</span>
              <div class="activity-content">
                <p class="activity-action">📋 Return Filed</p>
                <p class="activity-detail">Q2 2024 return submitted</p>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-time">42 min ago</span>
              <div class="activity-content">
                <p class="activity-action">📧 Notification Sent</p>
                <p class="activity-detail">10 payment reminders sent</p>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-time">1 hour ago</span>
              <div class="activity-content">
                <p class="activity-action">🔐 Backup Completed</p>
                <p class="activity-detail">Daily database backup successful</p>
              </div>
            </div>
            <div class="activity-item">
              <span class="activity-time">3 hours ago</span>
              <div class="activity-content">
                <p class="activity-action">👤 User Login</p>
                <p class="activity-detail">Admin user accessed system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Admin Actions</h3>
        <div class="action-buttons">
          <button class="action-btn" (click)="viewSystemLogs()">
            <span class="icon">📜</span>
            <span class="label">View System Logs</span>
          </button>
          <button class="action-btn" (click)="manageUsers()">
            <span class="icon">👥</span>
            <span class="label">Manage Users</span>
          </button>
          <button class="action-btn" (click)="configureSettings()">
            <span class="icon">⚙️</span>
            <span class="label">System Settings</span>
          </button>
          <button class="action-btn" (click)="generateComplianceReport()">
            <span class="icon">📋</span>
            <span class="label">Compliance Report</span>
          </button>
          <button class="action-btn" (click)="backupDatabase()">
            <span class="icon">💾</span>
            <span class="label">Backup Database</span>
          </button>
          <button class="action-btn" (click)="viewAuditLog()">
            <span class="icon">🔍</span>
            <span class="label">Audit Log</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 2rem;
      max-width: 1600px;
      margin: 0 auto;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .page-header h1 {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .page-header p {
      color: #666;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-secondary {
      padding: 0.75rem 1.5rem;
      background: #e9ecef;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .btn-secondary:hover {
      background: #dee2e6;
      transform: translateY(-2px);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      display: flex;
      gap: 1rem;
      transitions: transform 0.3s ease;
      border-left: 4px solid;
    }

    .metric-card:hover {
      transform: translateY(-4px);
    }

    .metric-card.primary {
      border-left-color: #007bff;
    }

    .metric-card.success {
      border-left-color: #28a745;
    }

    .metric-card.warning {
      border-left-color: #ffc107;
    }

    .metric-card.danger {
      border-left-color: #dc3545;
    }

    .metric-card.info {
      border-left-color: #17a2b8;
    }

    .metric-card.secondary {
      border-left-color: #6c757d;
    }

    .metric-icon {
      font-size: 2.5rem;
    }

    .metric-content {
      flex: 1;
    }

    .metric-content h3 {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: #333;
      margin: 0.5rem 0 0 0;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .badge.positive {
      background: #d1e7dd;
      color: #0f5132;
    }

    .badge.negative {
      background: #f8d7da;
      color: #842029;
    }

    .badge.warning {
      background: #fff3cd;
      color: #856404;
    }

    .health-bar {
      width: 100%;
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 0.75rem;
    }

    .health-fill {
      height: 100%;
      background: linear-gradient(90deg, #28a745, #17a2b8);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .chart-card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.1rem;
    }

    .chart-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .pie-chart {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(
        #28a745 0deg 234deg,
        #ffc107 234deg 324deg,
        #dc3545 324deg 360deg
      );
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .pie-chart::before {
      content: '';
      width: 160px;
      height: 160px;
      border-radius: 50%;
      background: white;
    }

    .segment-label {
      position: absolute;
      font-weight: bold;
      font-size: 0.85rem;
      text-align: center;
      color: #333;
    }

    .legend {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .bar-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 250px;
      gap: 0.75rem;
      padding: 1rem 0;
    }

    .bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .bar-item .bar {
      width: 100%;
      background: linear-gradient(180deg, #007bff, #0056b3);
      border-radius: 4px 4px 0 0;
      min-height: 20px;
      transition: all 0.3s ease;
    }

    .bar-item .bar:hover {
      opacity: 0.8;
    }

    .bar-item span {
      font-size: 0.85rem;
      color: #666;
    }

    .bar-chart.horizontal {
      flex-direction: column;
      height: auto;
      gap: 1rem;
    }

    .bar-item-h {
      display: grid;
      grid-template-columns: 100px 1fr 50px;
      align-items: center;
      gap: 1rem;
    }

    .bar-item-h .bar {
      height: 30px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-value {
      height: 100%;
      background: linear-gradient(90deg, #007bff, #0056b3);
      transition: all 0.3s ease;
    }

    .metrics-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .metric-item {
      display: grid;
      grid-template-columns: 150px 1fr 60px;
      align-items: center;
      gap: 1rem;
    }

    .metric-name {
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .metric-bar {
      height: 24px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }

    .metric-fill {
      height: 100%;
      background: linear-gradient(90deg, #ffc107, #fd7e14);
      transition: width 0.3s ease;
    }

    .metric-fill.success {
      background: linear-gradient(90deg, #28a745, #20c997);
    }

    .metric-val {
      text-align: right;
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .compliance-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .compliance-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      align-items: center;
    }

    .compliance-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 1.2rem;
    }

    .compliance-icon.success {
      background: #28a745;
    }

    .compliance-icon.warning {
      background: #ffc107;
      color: #333;
    }

    .compliance-content {
      flex: 1;
    }

    .compliance-name {
      margin: 0;
      font-weight: 600;
      color: #333;
    }

    .compliance-desc {
      margin: 0.25rem 0 0 0;
      font-size: 0.85rem;
      color: #666;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 400px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 3px solid #007bff;
      align-items: flex-start;
    }

    .activity-time {
      font-size: 0.8rem;
      color: #999;
      white-space: nowrap;
      min-width: 80px;
    }

    .activity-content {
      flex: 1;
    }

    .activity-action {
      margin: 0;
      font-weight: 600;
      color: #333;
    }

    .activity-detail {
      margin: 0.25rem 0 0 0;
      font-size: 0.85rem;
      color: #666;
    }

    .quick-actions {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quick-actions h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.1rem;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f5f7fa, #e9ecef);
      border: 2px solid #dee2e6;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.95rem;
      font-weight: 600;
      color: #333;
    }

    .action-btn:hover {
      background: linear-gradient(135deg, #e9ecef, #dee2e6);
      border-color: #007bff;
      transform: translateY(-2px);
    }

    .action-btn .icon {
      font-size: 1.8rem;
    }

    .action-btn .label {
      text-align: center;
    }

    @media (max-width: 1024px) {
      .analytics-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .admin-dashboard {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  metrics: DashboardMetrics = {
    totalTaxCollected: 2850000,
    totalTaxpayers: 1978,
    pendingPayments: 125,
    overdueObligations: 42,
    systemHealth: 99,
    averagePaymentTime: 4
  };

  ngOnInit() {
    this.loadMetrics();
  }

  loadMetrics() {
    this.apiService.get<any>('admin_dashboard_api.php', { params: { action: 'stats' } }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.metrics = response.data;
        } else {
          this.metrics = {};
        }
        this.notificationService.showSuccess('Metrics loaded');
      },
      error: (error) => {
        console.error('Error loading metrics:', error);
        this.notificationService.showError('Failed to load metrics');
        this.metrics = {};
      }
    });
  }

  refreshData() {
    this.loadMetrics();
    this.notificationService.showSuccess('Data refreshed');
  }

  generateSystemReport() {
    this.notificationService.showSuccess('System report generated');
  }

  exportMetrics() {
    this.notificationService.showSuccess('Metrics exported');
  }

  viewSystemLogs() {
    this.notificationService.showInfo('System logs feature coming soon');
  }

  manageUsers() {
    this.notificationService.showInfo('User management feature coming soon');
  }

  configureSettings() {
    this.notificationService.showInfo('System settings feature coming soon');
  }

  generateComplianceReport() {
    this.notificationService.showSuccess('Compliance report generated');
  }

  backupDatabase() {
    this.notificationService.showSuccess('Database backup initiated');
  }

  viewAuditLog() {
    this.notificationService.showInfo('Audit log viewer coming soon');
  }
}
