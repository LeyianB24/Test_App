import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface StatusItem { status: string; count: number; }
interface PriorityItem { priority: string; count: number; }
interface CategoryItem { category: string; count: number; }
interface DailyItem { day: string; count: number; }

@Component({
  selector: 'app-helpdesk-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <header class="page-header-elite mb-10">
        <div class="header-info">
          <h1 class="premium-title mb-0">Helpdesk <span class="gradient-text">Intelligence</span></h1>
          <p class="premium-subtitle pl-0 mt-1">Real-time analytical oversight of support infrastructure</p>
        </div>
        <div class="header-actions">
           <a routerLink="/helpdesk/tickets" class="modern-btn outline-btn sm mr-2">
              View Tickets
           </a>
           <a routerLink="/helpdesk/create" class="modern-btn primary-btn sm">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path stroke-width="3" d="M12 4v16m8-8H4"/></svg>
              New Intervention
           </a>
        </div>
      </header>

      <!-- Elite Stat Row -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div class="premium-stat-card">
           <div class="stat-icon-wrapper bg-blue-50 text-blue-600">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
           </div>
           <div class="stat-content">
              <div class="stat-label">Active Tickets</div>
              <div class="stat-value">{{ openCount() | number }}</div>
           </div>
        </div>

        <div class="premium-stat-card">
           <div class="stat-icon-wrapper bg-amber-50 text-amber-600">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
           </div>
           <div class="stat-content">
              <div class="stat-label">Avg Resolution</div>
              <div class="stat-value">{{ avgResolution() }}h</div>
           </div>
        </div>

        <div class="premium-stat-card">
           <div class="stat-icon-wrapper bg-emerald-50 text-emerald-600">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
           </div>
           <div class="stat-content">
              <div class="stat-label">SLA Compliance</div>
              <div class="stat-value">{{ slaRate() }}%</div>
           </div>
        </div>

        <div class="premium-stat-card">
           <div class="stat-icon-wrapper bg-purple-50 text-purple-600">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M5 13l4 4L19 7"/></svg>
           </div>
           <div class="stat-content">
              <div class="stat-label">Total Resolved</div>
              <div class="stat-value">{{ totalResolved() | number }}</div>
           </div>
        </div>
      </div>

      <!-- Analytical Grids -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <!-- Status Core -->
        <div class="content-card-premium relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-40"></div>
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Executive Status Overview</h3>
          <div class="space-y-6">
            @for (item of statusData(); track item.status) {
              <div class="flex items-center gap-6">
                <span class="w-32 text-[11px] font-black text-slate-500 uppercase tracking-wide truncate">{{ item.status }}</span>
                <div class="flex-grow h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div class="h-full rounded-full transition-all duration-1000 ease-out" 
                       [style.width.%]="getPercentage(item.count, totalTickets())" 
                       [class]="'fill-' + getStatusColor(item.status)"></div>
                </div>
                <span class="w-10 text-xs font-black text-slate-800 text-right">{{ item.count }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Priority Matrix -->
        <div class="content-card-premium relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-40"></div>
          <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Triage Priority Matrix</h3>
          <div class="space-y-6">
            @for (item of priorityData(); track item.priority) {
              <div class="flex items-center gap-6">
                <span class="w-32 text-[11px] font-black text-slate-500 uppercase tracking-wide truncate">{{ item.priority }}</span>
                <div class="flex-grow h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div class="h-full rounded-full transition-all duration-1000 ease-out" 
                       [style.width.%]="getPercentage(item.count, totalTickets())" 
                       [class]="'fill-' + getPriorityColor(item.priority)"></div>
                </div>
                <span class="w-10 text-xs font-black text-slate-800 text-right">{{ item.count }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Sector Analysis -->
      <div class="content-card-premium mb-10 overflow-hidden">
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Category Sector Breakdown</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          @for (item of categoryData(); track item.category) {
            <div class="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:border-red-100 transition-all group">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 group-hover:text-red-600">{{ item.category }}</span>
              <span class="text-2xl font-black text-slate-800">{{ item.count }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Volume Trends -->
      <div class="content-card-premium relative overflow-hidden">
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-50 rounded-full blur-3xl opacity-40"></div>
        <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Temporal Volume Stream (7 Days)</h3>
        <div class="flex items-end justify-between gap-4 h-48 relative z-10 px-4">
          @for (d of dailyData(); track d.day) {
            <div class="flex-1 flex flex-col items-center gap-4 group">
              <div class="text-[10px] font-black text-red-600 opacity-0 group-hover:opacity-100 transition-opacity mb-2">{{ d.count }}</div>
              <div class="w-full bg-slate-100 rounded-2xl overflow-hidden flex flex-col justify-end p-0.5" style="height: 120px;">
                <div class="w-full rounded-xl bg-gradient-to-t from-red-600 to-red-400 transition-all duration-1000 ease-out shadow-lg shadow-red-100" 
                     [style.height.%]="getDayHeight(d.count)"></div>
              </div>
              <span class="text-[10px] font-black text-slate-400 uppercase">{{ formatDay(d.day) }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1500px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .stat-label { font-size: 0.65rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    .stat-value { font-size: 2.2rem; font-weight: 950; color: #1e293b; line-height: 1; margin-top: 4px; }

    .fill-blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
    .fill-amber { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .fill-green { background: linear-gradient(90deg, #22c55e, #4ade80); }
    .fill-red { background: linear-gradient(90deg, #ef4444, #f87171); }
    .fill-purple { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
    .fill-slate { background: linear-gradient(90deg, #64748b, #94a3b8); }

    .mr-2 { margin-right: 0.5rem; }
  `]
})
export class HelpdeskDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/helpdesk_api.php`;

  statusData   = signal<StatusItem[]>([]);
  priorityData = signal<PriorityItem[]>([]);
  categoryData = signal<CategoryItem[]>([]);
  dailyData    = signal<DailyItem[]>([]);

  openCount     = signal(0);
  avgResolution = signal(0);
  slaRate       = signal(100);
  totalResolved = signal(0);
  totalTickets  = signal(0);

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}?action=get_stats&user_role=SUPER_ADMIN`).subscribe({
      next: (res) => {
        if (!res?.success) return;
        const d = res.data;

        this.statusData.set(d.status_breakdown || []);
        this.priorityData.set(d.priority_breakdown || []);
        this.categoryData.set(d.category_breakdown || []);
        this.dailyData.set(d.daily_volume || []);

        const total = (d.status_breakdown || []).reduce((s: number, i: StatusItem) => s + Number(i.count), 0);
        this.totalTickets.set(total);

        const open = (d.status_breakdown || [])
          .filter((i: StatusItem) => ['Open', 'In Progress', 'Reopened'].includes(i.status))
          .reduce((s: number, i: StatusItem) => s + Number(i.count), 0);
        this.openCount.set(open);

        if (d.metrics) {
          this.avgResolution.set(d.metrics.avg_resolution_hours ?? 0);
          this.slaRate.set(d.metrics.sla_compliance_rate ?? 100);
          this.totalResolved.set(d.metrics.total_resolved ?? 0);
        }
      }
    });
  }

  getPercentage(count: number, total: number): number {
    return total > 0 ? Math.round((count / total) * 100) : 0;
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      'Open': 'blue', 'In Progress': 'amber', 'Waiting for Customer': 'purple',
      'Resolved': 'green', 'Closed': 'slate', 'Reopened': 'red'
    };
    return map[status] || 'slate';
  }

  getPriorityColor(p: string): string {
    const map: Record<string, string> = { 'Critical': 'red', 'High': 'amber', 'Medium': 'blue', 'Low': 'green' };
    return map[p] || 'slate';
  }

  getDayHeight(count: number): number {
    const max = Math.max(...this.dailyData().map(d => Number(d.count)), 1);
    return Math.max((count / max) * 100, 5);
  }

  formatDay(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en', { weekday: 'short' });
  }
}
