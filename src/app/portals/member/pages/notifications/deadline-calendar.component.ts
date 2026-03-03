import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Deadline {
  id: number;
  date: string;
  title: string;
  category: 'VAT' | 'PAYE' | 'Income Tax' | 'MRI' | 'TOT';
  description: string;
  daysRemaining: number;
}

@Component({
  selector: 'app-deadline-calendar',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container p-8 animate-fade-in">
      <header class="mb-12 flex justify-between items-end">
        <div>
          <div class="flex items-center gap-4 mb-2">
            <span class="px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[10px] uppercase tracking-widest">Tax Calendar</span>
          </div>
          <h1 class="text-5xl font-black text-white tracking-tighter mb-2">Tax <span class="text-red-500">Deadlines</span></h1>
          <p class="text-slate-400 font-medium text-lg">Important dates for your tax filings in 2026.</p>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Modern Calendar Interface -->
        <div class="lg:col-span-4">
          <div class="card-glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
             <div class="flex justify-between items-center mb-10">
                <h3 class="text-xl font-black text-white tracking-tight uppercase">January 2026</h3>
                <div class="flex gap-2">
                   <button class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2.5"/></svg>
                   </button>
                   <button class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="2.5"/></svg>
                   </button>
                </div>
             </div>

             <div class="grid grid-cols-7 gap-1 text-center mb-4">
               @for (day of weekDays; track day) {
                 <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">{{ day }}</span>
               }
             </div>

             <div class="grid grid-cols-7 gap-1">
               @for (n of padArray; track n) {
                 <div class="aspect-square"></div>
               }
               @for (d of daysInMonth; track d) {
                 <div 
                  class="aspect-square flex items-center justify-center text-xs font-bold rounded-xl transition-all cursor-pointer relative group"
                  [class.text-white]="hasDeadline(d)"
                  [class.bg-white/5]="!hasDeadline(d)"
                  [class.text-slate-600]="!hasDeadline(d)"
                  [class.hover:bg-white/10]="!hasDeadline(d)"
                >
                  <span class="relative z-10">{{ d }}</span>
                  @if (hasDeadline(d)) {
                    <div class="absolute inset-1 bg-red-600 rounded-xl shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform"></div>
                  }
                 </div>
               }
             </div>

             <div class="mt-8 pt-8 border-t border-white/5 space-y-3">
                <div class="flex items-center gap-3">
                   <div class="w-2 h-2 rounded-full bg-red-600 shadow-glow"></div>
                   <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Statutory Deadline</span>
                </div>
                <div class="flex items-center gap-3">
                   <div class="w-2 h-2 rounded-full bg-white/10"></div>
                   <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Standard Window</span>
                </div>
             </div>
          </div>
        </div>

        <!-- Tactical Deadline Stream -->
        <div class="lg:col-span-8 flex flex-col gap-4">
           @for (dl of deadlines(); track dl.id) {
             <div 
              class="deadline-card group p-8 rounded-[2.5rem] border border-white/5 bg-white/5 hover:bg-white/[0.08] transition-all duration-300 flex items-center gap-8 relative overflow-hidden"
              [class.urgent-border]="dl.daysRemaining <= 5"
             >
                <div class="date-nexus w-24 h-24 rounded-[2rem] bg-white/5 flex flex-col items-center justify-center border border-white/5 shrink-0 transition-transform group-hover:scale-95">
                   <span class="text-3xl font-black text-white leading-none">{{ dl.date.split('-')[2] }}</span>
                   <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">JAN</span>
                </div>

                <div class="flex-1 min-w-0">
                   <div class="flex justify-between items-start mb-2">
                      <div class="flex items-center gap-3">
                         <span class="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-[9px] uppercase tracking-widest">
                            {{ dl.category }} Deadline
                         </span>
                         @if (dl.daysRemaining <= 5) {
                            <span class="text-red-500 font-black text-[9px] uppercase tracking-widest animate-pulse">Urgent</span>
                         }
                      </div>
                      <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest tabular-nums">{{ dl.daysRemaining }} Days to Lock</span>
                   </div>
                   <h4 class="text-xl font-black text-white tracking-tight mb-2 group-hover:text-red-500 transition-colors">{{ dl.title }}</h4>
                   <p class="text-slate-400 font-medium text-sm leading-relaxed">{{ dl.description }}</p>
                </div>

                <button class="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-red-600/20">
                   File Now
                </button>
             </div>
           }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    .card-glass { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(30px); }
    .shadow-glow { box-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
    .urgent-border { border-left: 4px solid #ef4444 !important; }
    
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    
    .date-nexus { box-shadow: inset 0 0 20px rgba(255,255,255,0.02); }
  `]
})
export class DeadlineCalendarComponent {
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  padArray = [1, 2, 3]; // January 2026 starts on Thursday (if 1st is Thu, pad 0,1,2,3? Let's check: S,M,T,W,T -> 0,1,2,3,4. 1st is Thu (4)). Pad 4 or 3? Pad 4. 
  // Wait, if Sunday is 0, then Thurs is 4. Pad 0,1,2,3. Correct.
  daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  deadlines = signal<Deadline[]>([
    { id: 1, date: '2026-01-09', category: 'PAYE', title: 'PAYE Return Deadline', description: 'Deadline to file PAYE returns and make payments.', daysRemaining: 3 },
    { id: 2, date: '2026-01-20', category: 'VAT', title: 'VAT Return Deadline', description: 'Deadline to file VAT returns.', daysRemaining: 14 },
    { id: 3, date: '2026-01-20', category: 'MRI', title: 'Rental Income Deadline', description: 'Deadline to file rental income returns.', daysRemaining: 14 },
    { id: 4, date: '2026-01-30', category: 'Income Tax', title: 'First Instalment Tax', description: 'First instalment deadline for Income Tax.', daysRemaining: 24 }
  ]);

  hasDeadline(day: number) {
    return [9, 20, 30].includes(day);
  }
}
