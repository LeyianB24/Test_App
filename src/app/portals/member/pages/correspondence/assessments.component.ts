import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assessments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="assessments-container p-6 animate-fade-in">
      <header class="mb-10">
        <h1 class="text-3xl font-bold text-white mb-2">Tax Assessments</h1>
        <p class="text-slate-400">Manage and respond to system-generated and officer-reviewed tax assessments.</p>
      </header>

      <div class="glass-card overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-800/80 text-[10px] uppercase tracking-widest font-bold text-slate-400">
              <th class="px-6 py-5">Assessment No.</th>
              <th class="px-6 py-5">Obligation</th>
              <th class="px-6 py-5">Period</th>
              <th class="px-6 py-5">Principal Amount</th>
              <th class="px-6 py-5">Penalty/Interest</th>
              <th class="px-6 py-5">Total Due</th>
              <th class="px-6 py-5">Status</th>
              <th class="px-6 py-5">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            @for (item of assessments; track item.id) {
              <tr class="hover:bg-white/5 transition-colors group">
                <td class="px-6 py-5">
                   <div class="text-blue-400 font-mono font-bold">{{ item.no }}</div>
                   <div class="text-[9px] text-slate-500 uppercase">{{ item.type }}</div>
                </td>
                <td class="px-6 py-5 text-slate-300 font-medium">{{ item.obligation }}</td>
                <td class="px-6 py-5 text-slate-300">{{ item.period }}</td>
                <td class="px-6 py-5 text-slate-300 font-mono">{{ item.principal | number:'1.2-2' }}</td>
                <td class="px-6 py-5 text-amber-500 font-mono">+{{ item.penalty | number:'1.2-2' }}</td>
                <td class="px-6 py-5 text-white font-bold font-mono">{{ item.principal + item.penalty | number:'1.2-2' }}</td>
                <td class="px-6 py-5">
                   <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" [class.bg-rose-500/10]="item.status === 'UNPAID'" [class.text-rose-400]="item.status === 'UNPAID'" [class.bg-emerald-500/10]="item.status === 'PAID'" [class.text-emerald-400]="item.status === 'PAID'">{{ item.status }}</span>
                </td>
                <td class="px-6 py-5">
                   <div class="flex gap-4">
                      <button class="text-blue-400 hover:text-blue-300 font-bold text-xs uppercase transition-colors">Pay Now</button>
                      <button class="text-slate-500 hover:text-white font-bold text-xs uppercase transition-colors">Object</button>
                   </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Assessment Totals Summary -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div class="p-6 glass-card bg-rose-500/5 border-rose-500/20">
            <h4 class="text-slate-400 text-xs font-bold uppercase mb-2">Total Unpaid Assessments</h4>
            <div class="text-3xl font-bold text-rose-500 font-mono">152,440.00 KES</div>
         </div>
         <div class="p-6 glass-card bg-emerald-500/5 border-emerald-500/20">
            <h4 class="text-slate-400 text-xs font-bold uppercase mb-2">Total Settled (YTD)</h4>
            <div class="text-3xl font-bold text-emerald-500 font-mono">2,100,000.00 KES</div>
         </div>
         <div class="p-6 glass-card">
            <h4 class="text-slate-400 text-xs font-bold uppercase mb-2">Average Response Time</h4>
            <div class="text-3xl font-bold text-white font-mono">14 Days</div>
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
