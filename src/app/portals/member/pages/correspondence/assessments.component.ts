import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assessments',
  imports: [CommonModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                TAX AUDIT LOG
              </span>
            </div>
            <h1 class="premium-title">Tax <span class="gradient-text">Assessments</span></h1>
            <p class="premium-subtitle">Authorized ledger of system-generated and officer-reviewed assessment records</p>
          </div>
        </div>
      </header>

      <!-- Assessment Totals Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div class="glass-panel p-6 bg-red-500/5 border-red-500/10 group hover:border-red-500/30 transition-all">
            <h4 class="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Total Unpaid Exposure</h4>
            <div class="flex items-baseline gap-2">
              <span class="text-xs font-black text-slate-600">KES</span>
              <div class="text-3xl font-black text-red-500 tracking-tighter tabular-nums">152,440.00</div>
            </div>
         </div>
         <div class="glass-panel p-6 bg-emerald-500/5 border-emerald-500/10 group hover:border-emerald-500/30 transition-all">
            <h4 class="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Settled Liability (YTD)</h4>
            <div class="flex items-baseline gap-2">
              <span class="text-xs font-black text-slate-600">KES</span>
              <div class="text-3xl font-black text-emerald-500 tracking-tighter tabular-nums">2,100,000.00</div>
            </div>
         </div>
         <div class="glass-panel p-6 border-white/5 group hover:border-blue-500/30 transition-all">
            <h4 class="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Avg. Response Latency</h4>
            <div class="flex items-baseline gap-3">
              <div class="text-3xl font-black text-white tracking-tighter tabular-nums">14</div>
              <span class="text-xs font-black text-slate-600 uppercase tracking-widest leading-none">Standard Days</span>
            </div>
         </div>
      </div>

      <div class="glass-panel p-0 overflow-hidden relative">
        <div class="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
           <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Assessment Registry</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02] text-[10px] uppercase tracking-widest font-black text-slate-500">
                <th class="px-8 py-6">Assessment Profile</th>
                <th class="px-8 py-6">Tax Obligation</th>
                <th class="px-8 py-6">Temporal Period</th>
                <th class="px-8 py-6 text-right">Liability Exposure</th>
                <th class="px-8 py-6">Directive Status</th>
                <th class="px-8 py-6 text-right">Autonomous Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              @for (item of assessments; track item.id) {
                <tr class="hover:bg-white/[0.02] transition-colors group">
                  <td class="px-8 py-6">
                     <div class="text-blue-400 font-black tracking-widest text-sm mb-1 uppercase">{{ item.no }}</div>
                     <div class="text-[9px] text-slate-600 font-black uppercase tracking-widest">{{ item.type }}</div>
                  </td>
                  <td class="px-8 py-6">
                    <span class="text-white font-black text-sm tracking-tight">{{ item.obligation }}</span>
                  </td>
                  <td class="px-8 py-6">
                    <span class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{{ item.period }}</span>
                  </td>
                  <td class="px-8 py-6 text-right tabular-nums">
                    <div class="text-white font-black text-sm">{{ item.principal + item.penalty | number:'1.2-2' }}</div>
                    <div class="text-[9px] text-red-500/50 font-black uppercase tracking-widest">+{{ item.penalty | number:'1.2-2' }} Penalty</div>
                  </td>
                  <td class="px-8 py-6">
                    <span class="status-pill-elite active" [class.overdue]="item.status === 'UNPAID'" [class.success]="item.status === 'PAID'">
                      <span class="dot"></span>
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-8 py-6">
                     <div class="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        @if (item.status === 'UNPAID') {
                          <button class="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/30 transition-all">
                             Authorize Payment
                          </button>
                        }
                        <button class="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 hover:border-white/20 transition-all">
                           Lodge Objection
                        </button>
                     </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentsComponent {
  assessments = [
    {
      id: 1,
      no: 'AS-8812-JAI',
      type: 'Self Assessment',
      obligation: 'Income Tax - Resident',
      period: 'Jan - Dec 2025',
      principal: 120000.00,
      penalty: 12500.00,
      status: 'UNPAID'
    },
    {
      id: 2,
      no: 'AS-9921-XAO',
      type: 'Officer Reviewed',
      obligation: 'Value Added Tax (VAT)',
      period: 'Dec 2025',
      principal: 15400.00,
      penalty: 4540.00,
      status: 'UNPAID'
    },
    {
      id: 3,
      no: 'AS-5541-PAO',
      type: 'Self Assessment',
      obligation: 'PAYE',
      period: 'Nov 2025',
      principal: 245000.00,
      penalty: 0.00,
      status: 'PAID'
    }
  ];
}
