import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              SUPPORT TERMINAL
            </span>
          </div>
          <h1 class="premium-title">Helpdesk <span class="gradient-text">Operations</span></h1>
          <p class="premium-subtitle">Strategic overview of support initiatives and resolution performance</p>
        </div>
        <a routerLink="/helpdesk/create" class="modern-btn primary-btn elite-glow">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          Initialize Ticket
        </a>
      </header>

      <!-- Elite Metrics Matrix -->
      <div class="stats-grid-premium mb-10">
        <div class="premium-stat-card d-flex align-items-center p-6 animate-up delay-1">
          <div class="stat-icon-wrapper blue me-4">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Active</span>
            <div class="stat-value-group">
              <h3 class="stat-number">{{ openCount() }}</h3>
            </div>
          </div>
        </div>

        <div class="premium-stat-card d-flex align-items-center p-6 animate-up delay-2">
          <div class="stat-icon-wrapper gold me-4">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Avg Resolution</span>
            <div class="stat-value-group">
              <h3 class="stat-number">{{ avgResolution() }}<span class="unit-text">HRS</span></h3>
            </div>
          </div>
        </div>

        <div class="premium-stat-card d-flex align-items-center p-6 animate-up delay-3">
          <div class="stat-icon-wrapper green me-4">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">SLA Compliance</span>
            <div class="stat-value-group">
              <h3 class="stat-number">{{ slaRate() }}%</h3>
            </div>
          </div>
        </div>

        <div class="premium-stat-card d-flex align-items-center p-6 animate-up delay-4">
          <div class="stat-icon-wrapper purple me-4">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Resolved</span>
            <div class="stat-value-group">
              <h3 class="stat-number">{{ totalResolved() }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <!-- Status Decomposition -->
        <div class="content-card-premium p-8 animate-up delay-2">
          <div class="card-p-header mb-8">
            <h3 class="card-p-title">Status Decomposition</h3>
            <p class="card-p-subtitle">Distribution of active and closed protocols</p>
          </div>
          <div class="space-y-6">
            @for (item of statusData(); track item.status) {
              <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                  <span class="text-slate-400">{{ item.status }}</span>
                  <span class="text-white">{{ item.count }}</span>
                </div>
                <div class="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div class="h-full rounded-full transition-all duration-1000" 
                       [style.width.%]="getPercentage(item.count, totalTickets())" 
                       [class]="'fill-' + getStatusColor(item.status)"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Priority Matrix -->
        <div class="content-card-premium p-8 animate-up delay-3">
          <div class="card-p-header mb-8">
            <h3 class="card-p-title">Priority Distribution</h3>
            <p class="card-p-subtitle">SLA urgency mapping for current workload</p>
          </div>
          <div class="space-y-6">
            @for (item of priorityData(); track item.priority) {
              <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                  <span class="text-slate-400">{{ item.priority }}</span>
                  <span class="text-white">{{ item.count }}</span>
                </div>
                <div class="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div class="h-full rounded-full transition-all duration-1000" 
                       [style.width.%]="getPercentage(item.count, totalTickets())" 
                       [class]="'fill-' + getPriorityColor(item.priority)"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Category Insights -->
      <div class="content-card-premium p-8 mb-10 animate-up delay-4">
        <h3 class="card-p-title mb-6">Subject Matter Insights</h3>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (item of categoryData(); track item.category) {
            <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{{ item.category }}</span>
              <span class="text-2xl font-black text-white">{{ item.count }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Volumetric Analysis -->
      <div class="content-card-premium p-8 animate-up delay-5">
        <h3 class="card-p-title mb-8">Periodic Volumetric Analysis</h3>
        <div class="flex items-end gap-3 h-48 px-4">
          @for (d of dailyData(); track d.day) {
            <div class="flex-1 flex flex-col items-center gap-4 group">
              <div class="relative w-full flex flex-col items-center justify-end h-32">
                 <div class="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-white/10">
                    {{ d.count }}
                 </div>
                 <div class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-xl group-hover:from-red-500 group-hover:to-red-300 transition-all duration-500" 
                      [style.height.%]="getDayHeight(d.count)"></div>
              </div>
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ formatDay(d.day) }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    .unit-text { font-size: 0.65rem; font-weight: 900; vertical-align: middle; margin-left: 6px; color: var(--text-tertiary); }
    
    .fill-blue   { background: linear-gradient(90deg, #3b82f6, #60a5fa); box-shadow: 0 0 15px rgba(59,130,246,0.3); }
    .fill-amber  { background: linear-gradient(90deg, #f59e0b, #fbbf24); box-shadow: 0 0 15px rgba(245,158,11,0.3); }
    .fill-green  { background: linear-gradient(90deg, #22c55e, #4ade80); box-shadow: 0 0 15px rgba(34,197,94,0.3); }
    .fill-red    { background: linear-gradient(90deg, #ef4444, #f87171); box-shadow: 0 0 15px rgba(239,68,68,0.3); }
    .fill-purple { background: linear-gradient(90deg, #8b5cf6, #a78bfa); box-shadow: 0 0 15px rgba(139,92,246,0.3); }
    .fill-slate  { background: linear-gradient(90deg, #64748b, #94a3b8); box-shadow: 0 0 15px rgba(100,116,139,0.3); }
    
    .card-p-header { display: flex; flex-direction: column; gap: 4px; }
    .card-p-title { font-size: 1.1rem; font-weight: 900; color: #fff; margin: 0; letter-spacing: -0.5px; }
    .card-p-subtitle { font-size: 0.85rem; color: #64748b; font-weight: 500; }
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
