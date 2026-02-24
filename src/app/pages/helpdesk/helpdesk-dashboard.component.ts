import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface StatusItem { status: string; count: number; }
interface PriorityItem { priority: string; count: number; }
interface CategoryItem { category: string; count: number; }
interface DailyItem { day: string; count: number; }

@Component({
  selector: 'app-helpdesk-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hd-dash p-6">
      <header class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-slate-800 tracking-tight">Helpdesk Command Center</h1>
          <p class="text-slate-500 mt-1">Real-time ticket analytics &amp; SLA performance</p>
        </div>
        <a routerLink="/helpdesk/create" class="btn-create flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          New Ticket
        </a>
      </header>

      <!-- KPI Cards -->
      <div class="kpi-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="kpi-card">
          <div class="kpi-icon bg-blue-50 text-blue-600">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-label">Total Open</span>
            <span class="kpi-value">{{ openCount() }}</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon bg-amber-50 text-amber-600">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-label">Avg Resolution</span>
            <span class="kpi-value">{{ avgResolution() }}h</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon bg-green-50 text-green-600">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-label">SLA Compliance</span>
            <span class="kpi-value">{{ slaRate() }}%</span>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon bg-purple-50 text-purple-600">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div class="kpi-body">
            <span class="kpi-label">Total Resolved</span>
            <span class="kpi-value">{{ totalResolved() }}</span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <!-- Status Breakdown -->
        <div class="chart-card">
          <h3 class="chart-title">Status Breakdown</h3>
          <div class="bar-chart">
            @for (item of statusData(); track item.status) {
              <div class="bar-row">
                <span class="bar-label">{{ item.status }}</span>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="getPercentage(item.count, totalTickets())" [class]="'fill-' + getStatusColor(item.status)"></div>
                </div>
                <span class="bar-count">{{ item.count }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Priority Breakdown -->
        <div class="chart-card">
          <h3 class="chart-title">Priority Distribution</h3>
          <div class="bar-chart">
            @for (item of priorityData(); track item.priority) {
              <div class="bar-row">
                <span class="bar-label">{{ item.priority }}</span>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="getPercentage(item.count, totalTickets())" [class]="'fill-' + getPriorityColor(item.priority)"></div>
                </div>
                <span class="bar-count">{{ item.count }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="chart-card mb-10">
        <h3 class="chart-title">Tickets by Category</h3>
        <div class="category-grid grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          @for (item of categoryData(); track item.category) {
            <div class="cat-pill">
              <span class="cat-name">{{ item.category }}</span>
              <span class="cat-count">{{ item.count }}</span>
            </div>
          }
        </div>
      </div>

      <!-- 7-Day Volume Sparkline -->
      <div class="chart-card">
        <h3 class="chart-title">7-Day Ticket Volume</h3>
        <div class="daily-chart mt-4 flex items-end gap-3 h-32">
          @for (d of dailyData(); track d.day) {
            <div class="daily-bar-wrapper flex-1 flex flex-col items-center gap-1">
              <span class="daily-count text-xs font-bold text-slate-500">{{ d.count }}</span>
              <div class="daily-bar rounded-t-lg" [style.height.%]="getDayHeight(d.count)"></div>
              <span class="daily-label text-xs text-slate-400">{{ formatDay(d.day) }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hd-dash { max-width: 1400px; margin: 0 auto; animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .btn-create {
      padding: 12px 24px; border-radius: 16px; font-weight: 800; font-size: 0.9rem;
      background: linear-gradient(135deg, #e31e24, #c0121a); color: white; border: none;
      cursor: pointer; transition: all 0.3s; text-decoration: none;
    }
    .btn-create:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(227,30,36,0.3); }

    .kpi-card {
      display: flex; align-items: center; gap: 16px; padding: 24px;
      background: white; border-radius: 24px; border: 1px solid #f1f5f9;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: all 0.3s;
    }
    .kpi-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-2px); }
    .kpi-icon { width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .kpi-body { display: flex; flex-direction: column; }
    .kpi-label { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-value { font-size: 2rem; font-weight: 900; color: #1e293b; line-height: 1.1; margin-top: 4px; }

    .chart-card {
      background: white; border-radius: 24px; padding: 28px;
      border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .chart-title { font-size: 1.1rem; font-weight: 800; color: #334155; margin-bottom: 20px; }

    .bar-chart { display: flex; flex-direction: column; gap: 12px; }
    .bar-row { display: flex; align-items: center; gap: 12px; }
    .bar-label { width: 140px; font-size: 0.85rem; font-weight: 700; color: #64748b; text-align: right; flex-shrink: 0; }
    .bar-track { flex: 1; height: 28px; background: #f8fafc; border-radius: 14px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 14px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); min-width: 4px; }
    .bar-count { width: 40px; font-size: 0.85rem; font-weight: 800; color: #1e293b; text-align: center; }

    .fill-blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
    .fill-amber { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .fill-green { background: linear-gradient(90deg, #22c55e, #4ade80); }
    .fill-red { background: linear-gradient(90deg, #ef4444, #f87171); }
    .fill-purple { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
    .fill-slate { background: linear-gradient(90deg, #64748b, #94a3b8); }

    .cat-pill {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px; background: #f8fafc; border-radius: 16px;
      border: 1px solid #f1f5f9; transition: all 0.3s;
    }
    .cat-pill:hover { border-color: #e2e8f0; background: white; }
    .cat-name { font-size: 0.85rem; font-weight: 700; color: #475569; }
    .cat-count { font-size: 1.1rem; font-weight: 900; color: #1e293b; }

    .daily-bar-wrapper { position: relative; }
    .daily-bar { width: 100%; background: linear-gradient(180deg, #e31e24, #f87171); border-radius: 8px 8px 0 0; min-height: 4px; transition: height 0.8s cubic-bezier(0.4,0,0.2,1); }
    .daily-chart { align-items: flex-end; }
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
