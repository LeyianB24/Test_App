import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-returns-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="returns-hub-container p-6 animate-fade-in">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Returns Filing Hub</h1>
        <p class="text-slate-400">Manage all your tax obligations and filing history in one place.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Return Category Cards -->
        @for (category of categories; track category.title) {
          <div class="glass-card p-6 flex flex-col hover-scale transition-all cursor-pointer" [routerLink]="category.link">
            <div class="icon-box mb-4 p-3 rounded-lg w-fit" [style.background]="category.iconBg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="category.icon" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">{{ category.title }}</h3>
            <p class="text-slate-400 text-sm mb-4 flex-grow">{{ category.description }}</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="status-badge" [class]="category.statusClass">{{ category.status }}</span>
              <span class="text-blue-400 text-sm font-medium">File Now →</span>
            </div>
          </div>
        }
      </div>

      <!-- Recent Filing History -->
      <section class="mt-12">
        <h2 class="text-2xl font-semibold text-white mb-6">Recent Filing History</h2>
        <div class="glass-card overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-800/50 text-slate-300 text-sm uppercase tracking-wider">
                <th class="px-6 py-4">Tax Obligation</th>
                <th class="px-6 py-4">Period</th>
                <th class="px-6 py-4">Date Filed</th>
                <th class="px-6 py-4">Acknowledgement No.</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              @for (filing of recentFilings; track filing.id) {
                <tr class="hover:bg-slate-800/30 transition-colors text-slate-300">
                  <td class="px-6 py-4 font-medium text-white">{{ filing.type }}</td>
                  <td class="px-6 py-4">{{ filing.period }}</td>
                  <td class="px-6 py-4">{{ filing.date }}</td>
                  <td class="px-6 py-4 font-mono text-xs">{{ filing.ackNo }}</td>
                  <td class="px-6 py-4">
                    <span class="dot-status" [class]="filing.statusClass">{{ filing.status }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <button class="text-blue-400 hover:underline">Download Receipt</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
    }
    .hover-scale:hover {
      transform: translateY(-4px);
      border-color: rgba(59, 130, 246, 0.5);
      background: rgba(30, 41, 59, 0.9);
    }
    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-success { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
    .status-warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .status-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    
    .dot-status::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .dot-success::before { background: #4ade80; }
    .dot-warning::before { background: #fbbf24; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReturnsHubComponent {
  categories = [
    {
      title: 'VAT Returns',
      description: 'Monthly returns for Value Added Tax based on sales and purchases.',
      link: '/member/returns/vat',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      iconBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      status: 'Due in 5 days',
      statusClass: 'status-warning'
    },
    {
      title: 'PAYE / P10',
      description: 'Monthly returns for employee PAYE deductions and SHA/HDF contributions.',
      link: '/member/returns/paye',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      status: 'Filed',
      statusClass: 'status-success'
    },
    {
      title: 'Income Tax',
      description: 'Annual returns for Individuals (IT1), Corporations (IT2C), and Partnerships.',
      link: '/member/returns/income-tax',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      status: 'Available',
      statusClass: 'status-success'
    },
    {
      title: 'Monthly Rental Income',
      description: 'File monthly returns for residential rental income at the current rate.',
      link: '/member/returns/rental-income',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      status: 'Due',
      statusClass: 'status-danger'
    },
    {
      title: 'Nil Returns',
      description: 'Quickly file nil returns for any obligation period when no activity occurred.',
      link: '/member/tax-engine/file/nil-return',
      icon: 'M5 13l4 4L19 7',
      iconBg: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
      status: 'Fast Flow',
      statusClass: 'status-success'
    }
  ];

  recentFilings = [
    {
      id: 1,
      type: 'Value Added Tax (VAT)',
      period: 'January 2026',
      date: '2026-02-15',
      ackNo: 'KRA202602158872',
      status: 'Successful',
      statusClass: 'dot-success'
    },
    {
      id: 2,
      type: 'PAYE (P10)',
      period: 'January 2026',
      date: '2026-02-08',
      ackNo: 'KRA202602081123',
      status: 'Successful',
      statusClass: 'dot-success'
    },
    {
      id: 3,
      type: 'MRI (Rental Income)',
      period: 'December 2025',
      date: '2026-01-18',
      ackNo: 'KRA202601185542',
      status: 'Successful',
      statusClass: 'dot-success'
    }
  ];
}
