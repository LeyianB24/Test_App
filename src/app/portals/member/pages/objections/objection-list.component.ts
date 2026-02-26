import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-objection-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="objections-list-container p-6 animate-fade-in">
      <header class="mb-10 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">My Objections & Appeals</h1>
          <p class="text-slate-400">Track the status of your formal objections to tax assessments.</p>
        </div>
        <button routerLink="/member/objections/create" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1">
          Lodge New Objection
        </button>
      </header>

      <div class="grid grid-cols-1 gap-6">
        @for (item of objections; track item.id) {
          <div class="glass-card p-6 border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
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
                      <button class="text-xs font-bold text-slate-400 hover:text-white">View Case</button>
                      <button class="text-xs font-bold text-blue-400 hover:underline">Track Progress</button>
                   </div>
                </div>
             </div>
          </div>
        } @empty {
          <div class="glass-card p-20 flex flex-col items-center justify-center text-center">
             <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
             </div>
             <h3 class="text-xl font-bold text-white mb-2">No Objections Found</h3>
             <p class="text-slate-500 text-sm max-w-xs">You haven't filed any objections to tax assessments yet.</p>
          </div>
        }
      </div>

      <!-- Objection Stats -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
         @for (stat of stats; track stat.label) {
            <div class="p-6 glass-card">
               <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{{ stat.label }}</div>
               <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
            </div>
         }
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
