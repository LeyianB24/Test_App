import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService, AdminDashboardSummary, PortalStatus } from '../../../services/admin-dashboard.service';
import { AuditLogService, AuditLog } from '../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-admin-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="content-area animate-stagger">
      
      <!-- Top Intelligence Bar -->
      <header class="mb-12">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 class="premium-title">
              System <span class="text-[var(--color-accent)]">Intelligence</span>
            </h1>
            <p class="premium-subtitle">National Revenue Operations Center // Real-time Telemetry</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="status-pill-precision online">
              <span class="status-pill-dot animate-pulse"></span>
              CORE TERMINAL ONLINE
            </div>
            <button (click)="refresh()" class="btn-precision btn-secondary-precision">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="mr-2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh Intel
            </button>
          </div>
        </div>
      </header>

      <!-- Loading & Error States (HD) -->
      @if (loading()) {
        <div class="glass-panel py-24 flex flex-col items-center gap-6 mb-12">
          <div class="spinner"></div>
          <p class="premium-subtitle">Syncing with National Data Matrix...</p>
        </div>
      }

      @if (error()) {
        <div class="glass-panel border-accent/30 animate-shake mb-12">
          <div class="flex items-center gap-6 text-accent">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <div>
              <p class="text-lg font-black uppercase tracking-widest">Protocol Deviation</p>
              <p class="text-xs font-bold opacity-70">{{ error() }}</p>
            </div>
          </div>
        </div>
      }

      @if (!loading() && summary() && summary()?.stats) {
        <div class="space-y-12">

          <!-- KPI Matrix -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            
            <div class="stat-card-precision">
              <span class="card-label">REVENUE (YTD)</span>
              <h3 class="card-value">KES {{ formatM(summary()?.stats?.totalTaxCollected) }}</h3>
              <div class="mt-6 pt-4 border-t border-subtle">
                <span class="premium-subtitle !mt-0 !tracking-widest opacity-60">Monthly: {{ formatM(summary()?.stats?.monthlyRevenue) }}</span>
              </div>
            </div>

            <div class="stat-card-precision">
              <span class="card-label">TAXPAYER BASE</span>
              <h3 class="card-value">{{ (summary()?.stats?.totalTaxpayers || 0) | number }}</h3>
              <div class="mt-6 pt-4 border-t border-subtle">
                <span class="delta-badge compliant">+{{ summary()?.stats?.newTaxpayersThisMonth || 0 }} MONTHLY</span>
              </div>
            </div>

            <div class="stat-card-precision">
              <span class="card-label">FILING VELOCITY</span>
              <h3 class="card-value">{{ (summary()?.stats?.activeReturns || 0) | number }}</h3>
              <div class="mt-6 pt-4 border-t border-subtle">
                <span class="premium-subtitle !mt-0">30D DYNAMIC PEAK</span>
              </div>
            </div>

            <div class="stat-card-precision">
              <span class="card-label">SYSTEM HEALTH</span>
              <h3 class="card-value">{{ summary()?.stats?.systemHealth || 98 }}%</h3>
              <div class="mt-6 pt-4 border-t border-subtle">
                <span class="status-pill-precision online !py-1 !px-3 font-black">TIER-4 OPERATIONAL</span>
              </div>
            </div>

            <div class="stat-card-precision">
              <span class="card-label">SETTLEMENT QUEUE</span>
              <h3 class="card-value">{{ (summary()?.stats?.pendingPayments || 0) | number }}</h3>
              <div class="mt-6 pt-4 border-t border-subtle">
                <span class="status-pill-precision !py-1 !px-3">AWAITING SYNC</span>
              </div>
            </div>

            <div class="stat-card-precision critical">
              <span class="card-label">CRITICAL ARREARS</span>
              <h3 class="card-value text-[var(--color-accent)]">{{ (summary()?.stats?.overdueObligations || 0) | number }}</h3>
              <div class="mt-6 pt-4 border-t border-subtle">
                <span class="status-pill-precision !py-1 !px-3 !bg-[var(--color-accent)] !text-white">ACTION MANDATED</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <!-- Major Intelligence Column -->
            <div class="lg:col-span-2 space-y-12">
              
              <!-- Revenue Chart -->
              <div class="glass-panel p-0">
                <div class="flex items-center justify-between p-10 border-b border-subtle">
                  <div>
                    <h3 class="text-xl font-black text-primary uppercase tracking-widest">Global Analytics</h3>
                    <p class="premium-subtitle">Aggregated fiscal performance // 12-Month Horizon</p>
                  </div>
                  <span class="status-pill-precision online !px-6 !py-3">
                    KES {{ formatM(totalRevenue12M()) }} AGGREGATE
                  </span>
                </div>
                <div class="p-12 h-96 flex items-end gap-4 px-16">
                  @for (m of chartMonths(); track $index) {
                    <div class="flex-1 flex flex-col items-center gap-4 group">
                      <div class="w-full bg-[var(--color-accent)]/10 rounded-t-xl transition-all duration-700 group-hover:bg-[var(--color-accent)] relative overflow-hidden" 
                        [style.height.%]="getBarPct(m.amount)">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                        <div class="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-primary text-white text-[10px] font-black py-2 px-3 rounded-lg whitespace-nowrap shadow-2xl scale-95 group-hover:scale-100">
                          {{ formatK(m.amount) }}
                        </div>
                      </div>
                      <span class="text-[10px] font-black text-muted uppercase tracking-tighter">{{ m.month }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Activity Logs -->
              <div class="glass-panel p-0 overflow-hidden">
                <div class="flex items-center justify-between p-10 border-b border-subtle">
                  <h3 class="text-xl font-black text-primary uppercase tracking-widest">Operations Pulse</h3>
                  <button class="notification-bell-precision" (click)="refreshLogs()" title="Recalibrate Logs">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  </button>
                </div>
                <div class="divide-y divide-subtle max-h-[600px] overflow-y-auto custom-scrollbar">
                  @for (log of recentLogs(); track log.id) {
                    <div class="p-8 flex items-start gap-6 hover:bg-[var(--bg-surface-2)] transition-all group" [class.bg-accent/5]="isErrorAction(log.action)">
                      <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-md" 
                        [class]="isErrorAction(log.action) ? 'bg-accent/10 text-accent' : 'bg-surface-2 text-primary'">
                        @if (isErrorAction(log.action)) {
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2.5"/></svg>
                        } @else {
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3"/></svg>
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-black text-primary uppercase tracking-tight">{{ log.user || 'SYSTEM' }}</span>
                          <span class="text-[10px] font-black text-muted font-mono bg-surface-2 px-2 py-1 rounded">{{ log.timestamp | date:'HH:mm:ss' }}</span>
                        </div>
                        <p class="text-sm font-semibold text-secondary leading-relaxed mb-4">{{ log.details }}</p>
                        <span class="inline-block px-3 py-1 rounded-full bg-surface-3 text-[10px] font-black uppercase tracking-widest text-muted border border-subtle">
                          NODE: {{ log.action }}
                        </span>
                      </div>
                    </div>
                  } @empty {
                    <div class="p-24 text-center">
                      <p class="premium-subtitle">No operational telemetry detected</p>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Secondary Intelligence Sidebar -->
            <div class="space-y-10">
              
              <!-- Compliance Radar -->
              <div class="glass-panel !p-10">
                <h4 class="premium-subtitle mb-10">Compliance Radar</h4>
                <div class="space-y-10">
                  <div class="space-y-4">
                    <div class="flex justify-between items-center premium-subtitle !mt-0">
                      <span>FILING VELOCITY</span>
                      <span class="text-accent">{{ summary()?.compliance?.returnFilingRate || 0 }}%</span>
                    </div>
                    <div class="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-subtle p-0.5">
                      <div class="h-full bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)] transition-all duration-1000" [style.width.%]="summary()?.compliance?.returnFilingRate || 0"></div>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div class="flex justify-between items-center premium-subtitle !mt-0">
                      <span>PAYMENT INTEGRITY</span>
                      <span class="text-[var(--color-success)]">{{ summary()?.compliance?.paymentCompliance || 0 }}%</span>
                    </div>
                    <div class="h-2 w-full bg-surface-2 rounded-full overflow-hidden border border-subtle p-0.5">
                      <div class="h-full bg-[var(--color-success)] rounded-full shadow-[0_0_12px_var(--color-success)] transition-all duration-1000" [style.width.%]="summary()?.compliance?.paymentCompliance || 0"></div>
                    </div>
                  </div>
                </div>

                <div class="mt-12 flex items-center gap-6 p-8 rounded-3xl bg-surface-2/50 border border-subtle">
                  <div class="relative w-20 h-20 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                      <circle cx="18" cy="18" r="16" fill="none" class="stroke-subtle" stroke-width="3"></circle>
                      <circle cx="18" cy="18" r="16" fill="none" class="stroke-accent transition-all duration-1000" stroke-width="3" 
                        stroke-dasharray="100, 100" [attr.stroke-dashoffset]="100 - (summary()?.compliance?.auditReadiness || 0)"></circle>
                    </svg>
                    <span class="absolute text-xs font-black text-primary">{{ summary()?.compliance?.auditReadiness || 0 }}%</span>
                  </div>
                  <div>
                    <span class="premium-subtitle !mt-0">Audit Status</span>
                    <span class="text-[9px] font-black text-muted uppercase tracking-widest mt-1 block">Matrix Ready</span>
                  </div>
                </div>
              </div>

              <!-- Revenue Split -->
              <div class="glass-panel !p-10">
                <h4 class="premium-subtitle mb-10">Revenue Distribution</h4>
                <div class="space-y-6">
                  @for (t of taxTypes().slice(0,6); track $index) {
                    <div class="flex items-center justify-between group cursor-default">
                      <div class="flex items-center gap-4">
                        <div class="w-3 h-3 rounded-full shadow-lg" [style.background]="taxColors[$index % taxColors.length]"></div>
                        <span class="text-xs font-black text-secondary uppercase tracking-tight group-hover:text-primary transition-colors">{{ shortTaxType(t.type) }}</span>
                      </div>
                      <span class="text-[11px] font-black text-primary font-mono tabular-nums">KES {{ formatK(t.amount) }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Integration Status -->
              <div class="glass-panel !p-0 !bg-primary !border-none shadow-2xl relative group overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
                <div class="p-10 relative z-10">
                  <h4 class="premium-subtitle !text-white/40 mb-10">Gateway Integrations</h4>
                  <div class="space-y-4">
                    @for (portal of portals(); track portal.name) {
                      <div class="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/item" [class.opacity-40]="!portal.online">
                        <div>
                          <span class="text-[11px] font-black text-white uppercase tracking-widest block">{{ portal.name }}</span>
                          <span class="text-[9px] font-black text-white/40 font-mono">{{ portal.online ? portal.latency : 'LINK LOST' }}</span>
                        </div>
                        <div class="flex items-center gap-4">
                          <span class="text-[10px] font-black uppercase tracking-tighter" [class]="portal.online ? 'text-[var(--color-success)]' : 'text-accent'">
                            {{ portal.online ? 'ACTIVE' : 'DOWN' }}
                          </span>
                          <div class="w-2.5 h-2.5 rounded-full shadow-[0_0_12px_currentColor] transition-all group-hover/item:scale-125" [class]="portal.online ? 'bg-[var(--color-success)]' : 'bg-accent'"></div>
                        </div>
                      </div>
                    }
                  </div>
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
