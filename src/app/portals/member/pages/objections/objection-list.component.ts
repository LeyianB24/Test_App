import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-objection-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container animate-up">
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">My <span class="gradient-text">Objections & Appeals</span></h1>
          <p class="premium-subtitle">Track the status of your formal objections to tax assessments.</p>
        </div>
        <div class="header-actions">
           <button routerLink="/member/objections/create" class="modern-btn primary-btn">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              File New Objection
           </button>
        </div>
      </header>

      <!-- Stats Intelligence Grids -->
      <div class="row g-4 mt-3 mb-4">
        @for (stat of stats; track stat.label; let i = $index) {
          <div class="col-xl-3 col-md-6">
             <div class="premium-stat-card d-flex align-items-center p-4 animate-up" [class]="'delay-' + (i+1)">
                <div class="stat-icon-wrapper me-3 blue">
                   <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
                <div class="stat-info flex-grow-1">
                   <span class="stat-label text-uppercase text-muted fw-bold d-block mb-1" style="font-size: 0.75rem; letter-spacing: 0.5px;">{{ stat.label }}</span>
                   <h3 class="stat-number mb-0 fw-bolder">{{ stat.value }}</h3>
                </div>
             </div>
          </div>
        }
      </div>

      <div class="content-card-premium mt-4 animate-up delay-2">
         <div class="card-p-header">
            <div class="p-title-group">
               <h3 class="card-p-title">My Objections</h3>
               <p class="card-p-subtitle">Your recent and ongoing objections</p>
            </div>
         </div>
         <div class="p-4">
            <div class="grid grid-cols-1 gap-6">
              @for (item of objections; track item.id) {
                <div class="glass-card p-6 border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden" style="background: rgba(10,34,61,0.4); border-radius: 20px;">
                   <!-- Status Vertical Bar -->
                   <div class="absolute left-0 top-0 bottom-0 w-1.5" [class]="item.statusColor"></div>
                   
                   <div class="flex flex-wrap lg:flex-nowrap gap-6 items-center">
                      <div class="flex-grow">
                         <div class="flex items-center gap-3 mb-2">
                            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">{{ item.refNo }}</span>
                            <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">{{ item.obligation }}</span>
                         </div>
                         <h3 class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">{{ item.reason }}</h3>
                         <div class="flex items-center text-slate-500 text-xs">
                            <span class="mr-4">Against Assessment: <strong class="text-slate-300">{{ item.assessmentNo }}</strong></span>
                            <span>Filed on: <strong class="text-slate-300">{{ item.filedDate }}</strong></span>
                         </div>
                      </div>

                      <div class="flex flex-col items-end gap-3 min-w-[200px]">
                         <span class="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5" [class.text-blue-400]="item.status === 'UNDER REVIEW'" [class.text-amber-400]="item.status === 'PENDING DOCUMENTS'" [class.text-emerald-400]="item.status === 'RESOLVED'">{{ item.status }}</span>
                         <div class="flex gap-4">
                            <button class="text-xs font-bold text-slate-400 hover:text-white">View Details</button>
                            <button class="text-xs font-bold text-blue-400 hover:underline">Track Progress</button>
                         </div>
                      </div>
                   </div>
                </div>
              } @empty {
                <div class="p-20 flex flex-col items-center justify-center text-center">
                   <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-slate-600 border border-slate-700">
                      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                   </div>
                   <h3 class="text-xl font-bold text-slate-300 mb-2">No Objections Found</h3>
                   <p class="text-slate-500 text-sm max-w-xs">You have not filed any objections.</p>
                </div>
              }
            </div>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }
    .bg-status-blue { background: #3b82f6; }
    .bg-status-amber { background: #f59e0b; }
    .bg-status-emerald { background: #10b981; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectionListComponent {
  objections = [
    {
      id: 1,
      refNo: 'OBJ-2026-001',
      obligation: 'Value Added Tax (VAT)',
      reason: 'Disputed Input Tax Deduction rejection',
      assessmentNo: 'AS-9921-XAO',
      filedDate: '2026-02-20',
      status: 'UNDER REVIEW',
      statusColor: 'bg-status-blue'
    },
    {
      id: 2,
      refNo: 'OBJ-2025-042',
      obligation: 'Income Tax - Resident',
      reason: 'Incorrect calculation of professional fee relief',
      assessmentNo: 'AS-8812-JAI',
      filedDate: '2025-12-15',
      status: 'PENDING DOCUMENTS',
      statusColor: 'bg-status-amber'
    }
  ];

  stats = [
    { label: 'Total Filed', value: '12' },
    { label: 'Under Review', value: '3' },
    { label: 'Awaiting Action', value: '1' },
    { label: 'Resolved (YTD)', value: '8' }
  ];
}
