import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container animate-up">
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">System <span class="gradient-text">Reports</span> & Exports</h1>
          <p class="premium-subtitle">Generate and download official compliance and revenue audit files</p>
        </div>
      </header>

      <div class="reports-grid mt-32">
        <!-- Client Directory Export -->
        <div class="content-card-premium report-card">
          <div class="rc-icon blue">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          <div class="rc-details">
            <h3 class="rc-title">Client Master Directory</h3>
            <p class="rc-desc">Complete extract of all registered taxpayers, their KRA PINs, designated stations, and contact data.</p>
          </div>
          <button class="modern-btn outline-btn" (click)="downloadReport('clients', 'csv')">
            Generate CSV 
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          </button>
        </div>

        <!-- Revenue Extract -->
        <div class="content-card-premium report-card">
          <div class="rc-icon green">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          </div>
          <div class="rc-details">
            <h3 class="rc-title">Revenue & Payments Extract</h3>
            <p class="rc-desc">Consolidated ledger of all successful KRA payments across PRNs and payment modes.</p>
          </div>
          <button class="modern-btn outline-btn" (click)="downloadReport('revenue', 'csv')">
            Generate CSV 
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          </button>
        </div>

        <!-- Compliance Matrix -->
        <div class="content-card-premium report-card disabled">
          <div class="rc-icon purple">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div class="rc-details">
            <h3 class="rc-title">Compliance Audit Matrix</h3>
            <p class="rc-desc">Deep-dive compliance scores per taxpayer. (Requires advanced BI licensing).</p>
          </div>
          <button class="modern-btn outline-btn" disabled>Upgrade Required</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }
    .content-card-premium {
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.02);
      transition: all 0.3s;
    }
    .content-card-premium.disabled {
      opacity: 0.6;
      filter: grayscale(1);
    }
    .report-card {
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: flex-start;
    }
    .report-card:hover:not(.disabled) {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.06);
    }
    .rc-icon {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .rc-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
    .rc-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
    .rc-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
    .rc-title {
      font-size: 1.15rem;
      font-weight: 900;
      color: var(--text-main);
      margin: 0 0 8px 0;
    }
    .rc-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0;
    }
    .outline-btn {
      margin-top: auto;
      width: 100%;
      justify-content: center;
    }
  `]
})
export class AdminReportsComponent {
  private authService = inject(AuthService);
  
  downloadReport(type: string, format: string) {
    const token = this.authService.getAuthToken();
    if (!token) return;
    
    // Trigger download via window location strategy
    const url = `${environment.apiUrl}/admin_export.php?type=${type}&format=${format}&token=${token}`;
    window.location.href = url;
  }
}
