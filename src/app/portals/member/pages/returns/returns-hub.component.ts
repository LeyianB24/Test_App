import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaxReturnService } from '../../../../services/tax-return.service';

@Component({
  selector: 'app-returns-hub',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              STATUTORY FILING ENGINE
            </span>
          </div>
          <h1 class="premium-title">Returns <span class="gradient-text">Hub</span></h1>
          <p class="premium-subtitle">Unified gateway for statutory tax obligation declarations and fiscal synchronization</p>
        </div>
        
        <div class="flex gap-4">
          <div class="glass-panel py-3 px-6 bg-white/[0.01] border-white/5 flex items-center gap-4 group hover:border-amber-500/30 transition-all">
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
               <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <div>
               <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Active Drafts</span>
               <span class="text-xl font-black text-white group-hover:text-amber-400 transition-colors">{{ taxService.draftReturnsCount() }}</span>
            </div>
          </div>
          <div class="glass-panel py-3 px-6 bg-white/[0.01] border-white/5 flex items-center gap-4 group hover:border-red-500/30 transition-all">
            <div class="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
               <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
               <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Overdue Protocols</span>
               <span class="text-xl font-black text-white group-hover:text-red-500 transition-colors">{{ taxService.overdueReturnsCount() }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Compliance Alerts -->
      @if (dueSoonDeadlines().length > 0) {
        <section class="mb-14">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-2 h-8 bg-gradient-to-b from-red-600 to-transparent rounded-full opacity-50"></div>
            <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Urgent Compliance Directives</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (dl of dueSoonDeadlines(); track dl.id) {
              <div class="glass-panel p-8 border-red-500/20 bg-red-500/[0.02] relative group hover:border-red-500/40 transition-all overflow-hidden">
                <div class="absolute -top-16 -right-16 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all"></div>
                
                <div class="flex justify-between items-start mb-6 relative z-10">
                  <span class="text-[9px] font-black uppercase tracking-[0.2em] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">{{ dl.return_type }} OBLIGATION</span>
                  <span class="text-[9px] font-black text-red-600 animate-pulse">CRITICAL PERIOD</span>
                </div>
                
                <h3 class="text-white font-black text-lg mb-2 uppercase tracking-tight">Statutory Filing Deadline</h3>
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">Deadline: <strong class="text-slate-300">{{ dl.filing_deadline | date:'longDate' }}</strong></p>
                
                <button 
                  class="modern-btn w-full py-4 bg-red-600/10 border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest !rounded-2xl"
                  [routerLink]="getFilingLink(dl.return_type)"
                >
                  Clear Obligation Archive
                </button>
              </div>
            }
          </div>
        </section>
      }

      <!-- Filing Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        @for (category of categories; track category.title) {
          <div class="glass-panel p-8 bg-white/[0.01] border-white/5 flex flex-col hover:border-blue-500/30 transition-all cursor-pointer group !rounded-[2.5rem] relative overflow-hidden" [routerLink]="category.link">
            <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-white/[0.05] transition-all"></div>
            
            <div class="flex justify-between items-start mb-10 relative z-10">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500" [style.background]="category.iconBg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="category.icon" />
                </svg>
              </div>
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest border border-white/5 bg-slate-900 px-3 py-1 rounded-lg">{{ category.status }} ARCHIVE</span>
            </div>
            
            <h3 class="text-xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-blue-400 transition-colors">{{ category.title }}</h3>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-10 flex-grow opacity-70">{{ category.description }}</p>
            
            <div class="flex items-center text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform relative z-10">
              <span>Initiate Protocol</span>
              <svg class="w-4 h-4 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </div>
          </div>
        }
      </div>

      <!-- History Registry -->
      <section>
        <div class="flex justify-between items-center mb-10">
          <div class="flex items-center gap-4">
            <div class="w-2 h-8 bg-gradient-to-b from-slate-600 to-transparent rounded-full opacity-30"></div>
            <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Filing History Archive</h2>
          </div>
          <button class="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest flex items-center gap-3 transition-all">
            Download Bulk Archive
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          </button>
        </div>
        
        <div class="glass-panel p-0 overflow-hidden bg-white/[0.01] border-white/5 relative">
          <table class="w-full">
            <thead>
              <tr class="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] text-left border-b border-white/5 bg-white/[0.02]">
                <th class="px-10 py-6">Obligation Profile</th>
                <th class="px-10 py-6">Fiscal Period</th>
                <th class="px-10 py-6">Submit Timestamp</th>
                <th class="px-10 py-6">Protocol Reference</th>
                <th class="px-10 py-6">Registry Status</th>
                <th class="px-10 py-6 text-right">Archived</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.02]">
              @if (taxService.returnsSignal().length === 0 && !taxService.loadingSignal()) {
                <tr>
                  <td colspan="6" class="px-10 py-32 text-center">
                    <div class="text-slate-700 font-black uppercase tracking-[0.2em] italic mb-2">Registry Silent</div>
                    <div class="text-[10px] text-slate-800 font-black uppercase tracking-widest">No recent filing activity detected.</div>
                  </td>
                </tr>
              }
              @for (filing of taxService.returnsSignal(); track filing.id) {
                <tr class="hover:bg-white/[0.01] transition-all group">
                  <td class="px-10 py-8">
                     <div class="text-sm font-black text-white tracking-tight group-hover:text-blue-400 transition-colors uppercase">{{ filing.return_type }}</div>
                  </td>
                  <td class="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ filing.tax_year }} FISCAL</td>
                  <td class="px-10 py-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest">{{ filing.submitted_at | date:'dd MMM yyyy' }}</td>
                  <td class="px-10 py-8">
                     <span class="text-[9px] font-black text-blue-500/50 uppercase tracking-widest font-mono border border-blue-500/10 px-2 py-0.5 rounded">{{ filing.kra_reference || 'DRAFT-64215' }}</span>
                  </td>
                  <td class="px-10 py-8">
                    <span class="status-pill-elite active" [class.success]="filing.status === 'Submitted'">
                      <span class="dot"></span>
                      {{ filing.status | uppercase }}
                    </span>
                  </td>
                  <td class="px-10 py-8 text-right">
                    <button class="w-10 h-10 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-slate-700 hover:text-white hover:border-white/20 transition-all shadow-xl">
                       <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
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
    :host { display: block; }
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
      title: 'VAT (Form P30)',
      description: 'Monthly statutory declarations for Value Added Tax including biometric eTIMS ledger synchronization.',
      link: '/member/tax-engine/file/vat',
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      iconBg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      status: 'Monthly'
    },
    {
      title: 'PAYE (Form P10)',
      description: 'Monthly employer declarations for PAYE, Social Health, and Housing Development archives.',
      link: '/member/tax-engine/file/paye',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      status: 'Monthly'
    },
    {
      title: 'Individual IT1',
      description: 'Annual unified return for resident identities. Automated prepopulation from P9 certificates.',
      link: '/member/tax-engine/file/it1',
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      status: 'Annual'
    },
    {
      title: 'Rental Income',
      description: 'Monthly MRI protocols for physical asset receipts. Statutory 7.5% gross liquidation.',
      link: '/member/tax-engine/file/mri',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      status: 'Monthly'
    },
    {
      title: 'Nil Protocols',
      description: 'Express zero-income declaration sequences. Optimized 60-second execution path.',
      link: '/member/tax-engine/file/nil-return',
      icon: 'M5 13l4 4L19 7',
      iconBg: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
      status: 'Express'
    },
    {
      title: 'Turnover Tax',
      description: 'Quarterly TOT archives for commercial entities. Simplified 1% gross ledger filing.',
      link: '/member/tax-engine/file/tot',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      iconBg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      status: 'Quarterly'
    }
  ];

  ngOnInit() {
    this.taxService.listReturns({ year: 2026 }).subscribe();
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
