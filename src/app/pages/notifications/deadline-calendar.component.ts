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
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="calendar-container p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">KRA Deadline Calendar</h1>
        <p class="text-slate-500 mt-1">Stay compliant with statutory filing dates for 2026</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Calendar View (Simplified) -->
        <div class="lg:col-span-1">
          <div class="card p-6">
             <h3 class="text-lg font-black text-slate-800 mb-6">January 2026</h3>
             <div class="calendar-grid">
               @for (day of weekDays; track day) {
                 <div class="weekday">{{ day }}</div>
               }
               @for (n of padArray; track n) {
                 <div class="day empty"></div>
               }
               @for (d of daysInMonth; track d) {
                 <div class="day" [class.has-deadline]="hasDeadline(d)">
                   {{ d }}
                   @if (hasDeadline(d)) {
                     <div class="deadline-dot"></div>
                   }
                 </div>
               }
             </div>
          </div>
        </div>

        <!-- Deadlines List -->
        <div class="lg:col-span-2">
          <div class="flex flex-col gap-4">
            @for (dl of deadlines(); track dl.id) {
              <div class="deadline-strip" [class.urgent]="dl.daysRemaining <= 5">
                <div class="date-side">
                  <span class="day">{{ dl.date.split('-')[2] }}</span>
                  <span class="month">JAN</span>
                </div>
                <div class="info-side">
                  <div class="flex justify-between items-center mb-1">
                    <span class="category-tag" [class]="dl.category.toLowerCase()">{{ dl.category }}</span>
                    <span class="countdown" [class.urgent]="dl.daysRemaining <= 5">
                      {{ dl.daysRemaining }} days remaining
                    </span>
                  </div>
                  <h4 class="title text-slate-800 font-extrabold">{{ dl.title }}</h4>
                  <p class="desc text-slate-500 text-sm">{{ dl.description }}</p>
                </div>
                <div class="action-side">
                  <button class="file-btn">File Now</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container { max-width: 1200px; margin: 0 auto; }
    .card { background: white; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }

    .calendar-grid { 
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; 
      text-align: center;
    }
    .weekday { font-size: 0.65rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 10px 0; }
    .day { 
      aspect-ratio: 1; display: flex; align-items: center; justify-content: center; 
      font-size: 0.85rem; font-weight: 700; color: #475569; position: relative;
      border-radius: 10px; cursor: default;
    }
    .day.has-deadline { background: #fff5f5; color: #e31e24; }
    .deadline-dot { 
      position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%);
      width: 4px; height: 4px; border-radius: 50%; background: #e31e24; 
    }

    .deadline-strip { 
      display: flex; gap: 20px; align-items: center; padding: 20px; 
      background: white; border-radius: 24px; border: 1px solid #f1f5f9; transition: 0.3s;
    }
    .deadline-strip:hover { transform: scale(1.01); border-color: #e2e8f0; }
    .deadline-strip.urgent { border-left: 6px solid #e31e24; background: #fffcfc; }

    .date-side { 
      width: 60px; height: 60px; border-radius: 16px; background: #f8fafc; 
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      line-height: 1; flex-shrink: 0;
    }
    .date-side .day { font-size: 1.4rem; font-weight: 900; color: #1e293b; background: none; }
    .date-side .month { font-size: 0.6rem; font-weight: 800; color: #94a3b8; }

    .info-side { flex: 1; }
    .category-tag { padding: 4px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; }
    .category-tag.vat { background: #e0f2fe; color: #0369a1; }
    .category-tag.paye { background: #fef3c7; color: #92400e; }
    .category-tag.mri { background: #dcfce7; color: #166534; }

    .countdown { font-size: 0.75rem; font-weight: 800; color: #64748b; }
    .countdown.urgent { color: #e31e24; animation: pulse 2s infinite; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

    .file-btn { 
      padding: 10px 24px; border-radius: 12px; background: #e31e24; color: white; 
      font-weight: 800; border: none; font-size: 0.8rem; cursor: pointer; transition: 0.3s;
    }
    .file-btn:hover { background: #c0121a; }
  `]
})
export class DeadlineCalendarComponent {
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  padArray = [1, 2, 3]; // padding for month start
  daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  deadlines = signal<Deadline[]>([
    { id: 1, date: '2026-01-09', category: 'PAYE', title: 'PAYE Submission', description: 'Monthly PAYE returns and payment for December 2025.', daysRemaining: 3 },
    { id: 2, date: '2026-01-20', category: 'VAT', title: 'VAT Obligation', description: 'Monthly VAT returns for the period ending December 2025.', daysRemaining: 14 },
    { id: 3, date: '2026-01-20', category: 'MRI', title: 'Rental Income Tax', description: 'Statutory deadline for Monthly Rental Income tax returns.', daysRemaining: 14 },
    { id: 4, date: '2026-01-30', category: 'Income Tax', title: 'Yearly Instalment', description: 'First instalment of Income Tax for the year 2026.', daysRemaining: 24 }
  ]);

  hasDeadline(day: number) {
    return [9, 20, 30].includes(day);
  }
}
