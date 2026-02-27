import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxReturnService } from '../../../../services/tax-return.service';

@Component({
  selector: 'app-returns-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="returns-hub-container p-8 animate-fade-in">
      <header class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 class="text-5xl font-black text-white tracking-tighter mb-2">Returns Hub</h1>
          <p class="text-slate-400 font-medium text-lg">Precision filing for your 2026 tax obligations</p>
        </div>
        
        <div class="flex gap-4">
          <div class="stat-pill-premium bg-slate-800/50 p-6 rounded-3xl border border-white/5">
            <span class="label text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">Drafts</span>
            <span class="value text-3xl font-black text-amber-400">{{ taxService.draftReturnsCount() }}</span>
          </div>
          <div class="stat-pill-premium bg-slate-800/50 p-6 rounded-3xl border border-white/5">
            <span class="label text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1">Overdue</span>
            <span class="value text-3xl font-black text-red-500">{{ taxService.overdueReturnsCount() }}</span>
          </div>
        </div>
      </header>

      <!-- Due Now Alerts -->
      @if (dueSoonDeadlines().length > 0) {
        <section class="mb-16 animate-up">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-2 h-8 bg-red-600 rounded-full shadow-lg shadow-red-600/20"></div>
            <h2 class="text-2xl font-black text-white uppercase tracking-tighter">Compliance Alerts</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (dl of dueSoonDeadlines(); track dl.id) {
              <div class="alert-card-elite p-8 bg-slate-800/40 rounded-[2.5rem] border border-white/5 relative group hover:bg-slate-800 transition-all overflow-hidden">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
                <div class="flex justify-between items-start mb-6">
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-lg">{{ dl.return_type }}</span>
                  <span class="status-badge" [class.urgent]="dl.priority === 'Critical'">{{ dl.priority }}</span>
                </div>
                <h3 class="text-white font-black text-xl mb-1">Filing Deadline</h3>
                <p class="text-slate-400 font-bold text-sm mb-8">Due: {{ dl.filing_deadline | date:'longDate' }}</p>
                <button 
                  class="w-full py-4 bg-white/5 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 group-hover:border-red-600 shadow-2xl"
                  [routerLink]="getFilingLink(dl.return_type)"
                >
                  Clear Obligation
                </button>
              </div>
            }
          </div>
        </section>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (category of categories; track category.title) {
          <div class="category-card-premium p-8 bg-slate-900 border border-white/5 rounded-[3rem] flex flex-col hover:border-blue-500/30 transition-all cursor-pointer group" [routerLink]="category.link">
            <div class="flex justify-between items-start mb-8">
              <div class="icon-orb p-5 rounded-[1.5rem] bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-lg" [style.background]="category.iconBg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" [attr.d]="category.icon" />
                </svg>
              </div>
              <span class="type-pill bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">{{ category.status }}</span>
            </div>
            <h3 class="text-2xl font-black text-white mb-3">{{ category.title }}</h3>
            <p class="text-slate-500 text-sm font-medium mb-8 flex-grow leading-relaxed">{{ category.description }}</p>
            <div class="flex items-center text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
              <span>Start Filing</span>
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </div>
          </div>
        }
      </div>

      <!-- History Section -->
      <section class="mt-24">
        <div class="flex justify-between items-center mb-10">
          <h2 class="text-4xl font-black text-white tracking-tighter">Filing History</h2>
          <button class="text-slate-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest flex items-center gap-3">
            Download Archive
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          </button>
        </div>
        
        <div class="history-table-wrapper rounded-[3rem] border border-white/5 bg-slate-900/40 overflow-hidden shadow-2xl">
          <table class="w-full">
            <thead>
              <tr class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] text-left bg-black/10">
                <th class="px-10 py-6">Obligation</th>
                <th class="px-10 py-6">Period</th>
                <th class="px-10 py-6">Filed Date</th>
                <th class="px-10 py-6">Reference</th>
                <th class="px-10 py-6">Status</th>
                <th class="px-10 py-6 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              @if (taxService.returnsSignal().length === 0 && !taxService.loadingSignal()) {
                <tr>
                  <td colspan="6" class="px-10 py-32 text-center text-slate-500 font-black italic text-lg opacity-50">No recent filings detected.</td>
                </tr>
              }
              @for (filing of taxService.returnsSignal(); track filing.id) {
                <tr class="hover:bg-white/5 transition-all group">
                  <td class="px-10 py-6 font-black text-white text-lg">{{ filing.return_type }}</td>
                  <td class="px-10 py-6 text-slate-400 font-bold">{{ filing.tax_year }}</td>
                  <td class="px-10 py-6 text-slate-400 font-medium">{{ filing.submitted_at | date:'mediumDate' }}</td>
                  <td class="px-10 py-6 font-mono text-xs text-blue-400 font-black">{{ filing.kra_reference || 'DRAFT-64215' }}</td>
                  <td class="px-10 py-6">
                    <span class="status-dot-elite" [class]="getStatusClass(filing.status)">{{ filing.status }}</span>
                  </td>
                  <td class="px-10 py-6 text-right">
                    <button class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white text-slate-400 hover:text-black transition-all">
                       <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    </button>
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
    .returns-hub-container { max-width: 1500px; margin: 0 auto; }
    .animate-up { animation: up 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    
    .status-badge { padding: 4px 12px; border-radius: 10px; font-size: 0.65rem; font-weight: 950; background: rgba(255,255,255,0.05); color: #64748B; text-transform: uppercase; }
    .status-badge.urgent { background: #E31E24; color: white; box-shadow: 0 4px 15px rgba(227, 30, 36, 0.4); }

    .status-dot-elite { font-size: 0.75rem; font-weight: 900; color: #94A3B8; display: flex; items-center; gap: 10px; }
    .status-dot-elite::before { content: ''; width: 8px; height: 8px; border-radius: 50%; display: inline-block; transition: 0.3s; }
    .dot-success::before { background: #10B981; box-shadow: 0 0 15px #10B981; }
    .dot-draft::before { background: #64748B; }
    
    .category-card-premium { transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .category-card-premium:hover { transform: translateY(-10px); box-shadow: 0 30px 60px -12px rgba(0,0,0,0.5); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReturnsHubComponent implements OnInit {
  public taxService = inject(TaxReturnService);

  dueSoonDeadlines = computed(() => 
    this.taxService.deadlinesSignal().filter(dl => 
      dl.priority === 'Critical' || dl.priority === 'High'
    )
  );

  categories = [
    {
      title: 'VAT Returns (P30)',
      description: 'Monthly returns for Value Added Tax including eTIMS sales/purchases synchronization.',
      link: '/member/tax-engine/file/vat',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      iconBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      status: 'Monthly'
    },
    {
      title: 'PAYE (P10)',
      description: 'Monthly returns for employee PAYE, SHA, and HDF contributions.',
      link: '/member/tax-engine/file/paye',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      status: 'Monthly'
    },
    {
      title: 'Individual Income (IT1)',
      description: 'Annual return for residents and non-residents with optional prepopulation from P9.',
      link: '/member/tax-engine/file/it1',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      status: 'Annual'
    },
    {
      title: 'Rental Income (MRI)',
      description: 'Monthly rental income tax at 7.5% gross. Automated rental receipt processing.',
      link: '/member/tax-engine/file/mri',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      status: 'Monthly'
    },
    {
      title: 'Nil Returns',
      description: 'High-speed filing for zero income periods. Takes less than 60 seconds.',
      link: '/member/tax-engine/file/nil-return',
      icon: 'M5 13l4 4L19 7',
      iconBg: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
      status: 'Express'
    },
    {
      title: 'Turnover Tax (TOT)',
      description: 'Simplified quarterly tax for small businesses at 1% of gross turnover.',
      link: '/member/tax-engine/file/tot',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      status: 'Quarterly'
    }
  ];

  ngOnInit() {
    this.taxService.listReturns({ year: 2026 }).subscribe();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Submitted': return 'dot-success';
      case 'Draft': return 'dot-draft';
      default: return 'dot-pending';
    }
  }

  getFilingLink(type: string): string {
    switch (type) {
      case 'VAT': return '/member/tax-engine/file/vat';
      case 'PAYE': return '/member/tax-engine/file/paye';
      case 'IT1': return '/member/tax-engine/file/it1';
      case 'MRI': return '/member/tax-engine/file/mri';
      case 'TOT': return '/member/tax-engine/file/tot';
      case 'Nil': return '/member/tax-engine/file/nil-return';
      default: return '/member/returns';
    }
  }
}
