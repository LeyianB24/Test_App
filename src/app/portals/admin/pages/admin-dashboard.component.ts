import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService, AdminDashboardSummary, PortalStatus } from '../../../services/admin-dashboard.service';
import { AuditLogService, AuditLog } from '../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-admin-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="content-area animate-fade-in">
      
      <!-- Top Intelligence Bar -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight">
              System <span class="text-accent">Intelligence</span>
            </h1>
            <p class="text-[var(--text-secondary)] mt-2 font-semibold tracking-wide uppercase text-[10px]">National Revenue Operations Center | Real-time Telemetry</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="status-pill-precision online">
              <span class="w-2 h-2 rounded-full bg-success animate-pulse mr-2"></span>
              CORE TERMINAL ONLINE
            </div>
            <button (click)="refresh()" class="btn-precision btn-secondary-precision btn-sm">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-width="2"/></svg>
              Refresh Intel
            </button>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      @if (loading()) {
        <div class="py-20 flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <p class="text-xs font-black text-tertiary uppercase tracking-widest">Establishing secure data link...</p>
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <div class="stat-card-precision border-accent/20 animate-shake mb-10">
          <div class="flex items-center gap-4 text-accent">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span class="font-black uppercase text-xs tracking-widest">{{ error() }}</span>
          </div>
        </div>
      }

      @if (!loading() && summary() && summary()?.stats) {
        <div class="space-y-10">

          <!-- KPI Matrix -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            
            <div class="stat-card-precision">
              <span class="card-label">REVENUE (YTD)</span>
              <h3 class="card-value">KES {{ formatM(summary()?.stats?.totalTaxCollected) }}</h3>
              <div class="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">Monthly: {{ formatM(summary()?.stats?.monthlyRevenue) }}</span>
              </div>
            </div>

            <div class="stat-card-precision">
              <span class="card-label">TAXPAYER BASE</span>
              <h3 class="card-value">{{ (summary()?.stats?.totalTaxpayers || 0) | number }}</h3>
              <div class="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <span class="text-[9px] font-black text-success uppercase tracking-widest">+{{ summary()?.stats?.newTaxpayersThisMonth || 0 }} new users</span>
              </div>
            </div>

            <div class="stat-card-precision">
              <span class="card-label">FILING VELOCITY</span>
              <h3 class="card-value">{{ (summary()?.stats?.activeReturns || 0) | number }}</h3>
              <div class="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <span class="text-[9px] font-black text-tertiary uppercase tracking-widest">Dynamic 30-Day Window</span>
              </div>
            </div>

            <div class="stat-card-precision">
              <span class="card-label">SYSTEM HEALTH</span>
              <h3 class="card-value">{{ summary()?.stats?.systemHealth || 98 }}%</h3>
              <div class="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <span class="status-pill-precision synced text-[8px]">TIER-4 OPERATIONAL</span>
              </div>
            </div>

            <div class="stat-card-precision">
              <span class="card-label">SETTLEMENT QUEUE</span>
              <h3 class="card-value">{{ (summary()?.stats?.pendingPayments || 0) | number }}</h3>
              <div class="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <span class="status-pill-precision pending text-[8px]">AWAITING PROCESSING</span>
              </div>
            </div>

            <div class="stat-card-precision border-accent/20">
              <span class="card-label">CRITICAL ARREARS</span>
              <h3 class="card-value text-accent">{{ (summary()?.stats?.overdueObligations || 0) | number }}</h3>
              <div class="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <span class="status-pill-precision overdue text-[8px]">ACTION MANDATED</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <!-- Major Intelligence Column -->
            <div class="lg:col-span-2 space-y-10">
              
              <!-- Revenue Chart -->
              <div class="stat-card-precision p-0 overflow-hidden">
                <div class="flex items-center justify-between p-8 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                  <div>
                    <h3 class="text-xs font-black text-primary uppercase tracking-[0.2em]">National Revenue Analytics</h3>
                    <p class="text-[9px] font-black text-tertiary uppercase tracking-widest mt-1">Aggregated fiscal performance (12-Month Horizon)</p>
                  </div>
                  <span class="px-4 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest border border-accent/20">
                    KES {{ formatM(totalRevenue12M()) }} AGGREGATE
                  </span>
                </div>
                <div class="p-8 h-80 flex items-end gap-3 px-12">
                  @for (m of chartMonths(); track $index) {
                    <div class="flex-1 flex flex-col items-center gap-4 group">
                      <div class="w-full bg-accent/20 rounded-t-lg transition-all duration-500 group-hover:bg-accent relative" 
                        [style.height.%]="getBarPct(m.amount)">
                        <div class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[9px] font-black py-1 px-2 rounded-md whitespace-nowrap shadow-xl">
                          {{ formatK(m.amount) }}
                        </div>
                      </div>
                      <span class="text-[9px] font-black text-tertiary uppercase tracking-tighter">{{ m.month }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Activity Logs -->
              <div class="stat-card-precision p-0 overflow-hidden">
                <div class="flex items-center justify-between p-8 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                  <h3 class="text-xs font-black text-primary uppercase tracking-[0.2em]">Operations Pulse</h3>
                  <button class="text-tertiary hover:text-accent transition-colors" (click)="refreshLogs()" title="Clear Subsystem Logs">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
                  </button>
                </div>
                <div class="divide-y divide-[var(--border-subtle)] max-h-[500px] overflow-y-auto custom-scrollbar">
                  @for (log of recentLogs(); track log.id) {
                    <div class="p-6 flex items-start gap-4 hover:bg-[var(--bg-surface-2)] transition-colors group" [class.bg-accent/5]="isErrorAction(log.action)">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" 
                        [class]="isErrorAction(log.action) ? 'bg-accent/10 text-accent' : 'bg-[var(--bg-surface-2)] text-primary'">
                        @if (isErrorAction(log.action)) {
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2.5"/></svg>
                        } @else {
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3"/></svg>
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-1">
                          <span class="text-xs font-black text-primary uppercase tracking-tight">{{ log.user || 'SYSTEM' }}</span>
                          <span class="text-[9px] font-black text-tertiary font-mono">{{ log.timestamp | date:'HH:mm:ss' }}</span>
                        </div>
                        <p class="text-xs font-semibold text-secondary leading-normal mb-2">{{ log.details }}</p>
                        <span class="inline-block px-2 py-0.5 rounded bg-[var(--bg-card)] text-[8px] font-black uppercase tracking-widest text-tertiary border border-[var(--border-subtle)]">
                          {{ log.action }}
                        </span>
                      </div>
                    </div>
                  } @empty {
                    <div class="p-20 text-center">
                      <p class="text-[10px] font-black text-tertiary uppercase tracking-widest">No operational telemetry detected</p>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Secondary Intelligence Sidebar -->
            <div class="space-y-8">
              
              <!-- Compliance Radar -->
              <div class="stat-card-precision !p-8 shadow-xl">
                <h4 class="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mb-8">Compliance Radar</h4>
                <div class="space-y-8">
                  <div class="space-y-3">
                    <div class="flex justify-between items-center text-[10px] font-black text-primary uppercase tracking-widest">
                      <span>FILING RATE</span>
                      <span class="text-accent">{{ summary()?.compliance?.returnFilingRate || 0 }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-[var(--bg-surface-2)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                      <div class="h-full bg-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)] transition-all duration-1000" [style.width.%]="summary()?.compliance?.returnFilingRate || 0"></div>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center text-[10px] font-black text-primary uppercase tracking-widest">
                      <span>PAYMENT VELOCITY</span>
                      <span class="text-success">{{ summary()?.compliance?.paymentCompliance || 0 }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-[var(--bg-surface-2)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                      <div class="h-full bg-success shadow-[0_0_10px_rgba(var(--success-rgb),0.5)] transition-all duration-1000" [style.width.%]="summary()?.compliance?.paymentCompliance || 0"></div>
                    </div>
                  </div>
                </div>

                <div class="mt-12 flex items-center gap-6 p-6 rounded-2xl bg-[var(--bg-surface-2)]/50 border border-[var(--border-subtle)]">
                  <div class="relative w-16 h-16 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                      <circle cx="18" cy="18" r="16" fill="none" class="stroke-[var(--border-subtle)]" stroke-width="3"></circle>
                      <circle cx="18" cy="18" r="16" fill="none" class="stroke-accent transition-all duration-1000" stroke-width="3" 
                        stroke-dasharray="100, 100" [attr.stroke-dashoffset]="100 - (summary()?.compliance?.auditReadiness || 0)"></circle>
                    </svg>
                    <span class="absolute text-[10px] font-black text-primary">{{ summary()?.compliance?.auditReadiness || 0 }}%</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-primary uppercase tracking-widest">Audit Readiness</span>
                    <span class="text-[8px] font-black text-tertiary uppercase tracking-widest mt-1">System Integrity Matrix</span>
                  </div>
                </div>
              </div>

              <!-- Revenue Split -->
              <div class="stat-card-precision !p-8 shadow-sm">
                <h4 class="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mb-8">Revenue Distribution</h4>
                <div class="space-y-5">
                  @for (t of taxTypes().slice(0,6); track $index) {
                    <div class="flex items-center justify-between group">
                      <div class="flex items-center gap-3">
                        <div class="w-2.5 h-2.5 rounded-full shadow-sm" [style.background]="taxColors[$index % taxColors.length]"></div>
                        <span class="text-xs font-black text-secondary uppercase tracking-tight group-hover:text-primary transition-colors cursor-default">{{ shortTaxType(t.type) }}</span>
                      </div>
                      <span class="text-xs font-black text-primary font-mono tabular-nums">KES {{ formatK(t.amount) }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Integration Status -->
              <div class="stat-card-precision !p-8 !bg-[var(--text-primary)] !border-none shadow-2xl overflow-hidden relative group">
                <div class="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-50"></div>
                <h4 class="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8 relative z-10">Gateway Integrations</h4>
                <div class="space-y-4 relative z-10">
                  @for (portal of portals(); track portal.name) {
                    <div class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default" [class.opacity-40]="!portal.online">
                      <div class="flex flex-col">
                        <span class="text-[10px] font-black text-white uppercase tracking-widest">{{ portal.name }}</span>
                        <span class="text-[8px] font-black text-white/40 font-mono">{{ portal.online ? portal.latency : 'TELEMETRY LOSS' }}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <span class="text-[9px] font-black uppercase tracking-tighter" [class]="portal.online ? 'text-success' : 'text-accent'">
                          {{ portal.online ? 'SYNCED' : 'OFFLINE' }}
                        </span>
                        <div class="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" [class]="portal.online ? 'bg-success' : 'bg-accent'"></div>
                      </div>
                    </div>
                  }
                </div>
              </div>

            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [``]
})
export class AdminDashboardComponent implements OnInit {
  private dashSvc  = inject(AdminDashboardService);
  private auditSvc = inject(AuditLogService);

  loading    = signal(true);
  error      = signal('');
  summary    = signal<AdminDashboardSummary | null>(null);
  portals    = signal<PortalStatus[]>([]);
  recentLogs = signal<AuditLog[]>([]);

  taxColors = ['#c1392b', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16'];

  chartMonths() {
    return (this.summary()?.charts?.monthlyRevenue as any[]) ?? [];
  }

  taxTypes() {
    return (this.summary()?.charts?.taxTypeBreakdown as any[]) ?? [];
  }

  totalRevenue12M(): number {
    return this.chartMonths().reduce((s: number, m: any) => s + (m.amount ?? 0), 0);
  }

  getBarPct(amount: number): number {
    const max = Math.max(...this.chartMonths().map((m: any) => m.amount ?? 0), 1);
    return Math.max((amount / max) * 100, amount > 0 ? 4 : 0);
  }

  formatM(v: number | undefined): string {
    if (!v || v === 0) return '0';
    if (v >= 1_000_000_000) return (v/1_000_000_000).toFixed(2)+'B';
    if (v >= 1_000_000)     return (v/1_000_000).toFixed(2)+'M';
    if (v >= 1_000)         return (v/1_000).toFixed(1)+'K';
    return v.toFixed(0);
  }

  formatK(v: number | undefined): string {
    if (!v || v === 0) return '0';
    if (v >= 1_000_000) return (v/1_000_000).toFixed(1)+'M';
    if (v >= 1_000)     return (v/1_000).toFixed(0)+'K';
    return v.toFixed(0);
  }

  shortTaxType(t: string): string {
    return t?.replace('Income Tax', 'Inc. Tax').replace('Corporate','Corp.').replace('Withholding','W/H') ?? t;
  }

  isErrorAction(action: string): boolean {
    return !!(action?.toUpperCase().match(/FAIL|ERROR|DENIED|DOWN|REJECT/));
  }

  ngOnInit() { this.refresh(); this.refreshLogs(); }

  refresh() {
    this.loading.set(true);
    this.dashSvc.getSummary().subscribe({
      next: res => {
        if (res.success && res.data) this.summary.set(res.data);
        else this.error.set(res.error || 'Failed to load dashboard.');
        this.loading.set(false);
      },
      error: () => { this.error.set('API unreachable. Ensure backend is running.'); this.loading.set(false); }
    });
    this.dashSvc.getPortalsStatus().subscribe({
      next: res => { if (res.success && res.data) this.portals.set(res.data); }
    });
  }

  refreshLogs() {
    this.auditSvc.getLogs(1, 12).subscribe({
      next: res => { if (res.success && res.data) this.recentLogs.set(res.data.logs); }
    });
  }
}
