import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService, AdminDashboardSummary, PortalStatus } from '../../../services/admin-dashboard.service';
import { AuditLogService, AuditLog } from '../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Strategic Header Manifold -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="absolute -inset-x-20 -top-20 h-40 bg-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">National Command Center</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                System <span class="text-stroke-sm">Intelligence</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                REAL-TIME TELEMETRY MATRIX <span class="w-1 h-1 rounded-full bg-muted/30"></span> NODE: NOC-KRA-01
              </p>
            </div>

            <div class="flex items-center gap-6">
              <div class="flex flex-col items-end gap-2">
                <div class="status-pill-precision online py-2 px-5 bg-white/5 border-white/10">
                  <span class="status-pill-dot animate-pulse shadow-[0_0_8px_var(--color-success)]"></span>
                  TIER-4 TERMINAL ONLINE
                </div>
                <span class="text-[9px] font-black text-muted tracking-widest uppercase">Latency: <span class="text-primary font-mono tabular-nums">14ms</span></span>
              </div>
              
              <button (click)="refresh()" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/10 transition-all flex items-center justify-center group/btn">
                <svg [class.animate-spin]="loading()" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Loading / Matrix Deviance States -->
        @if (loading()) {
          <div class="glass-panel py-32 flex flex-col items-center justify-center gap-8 mb-14 border-white/5">
            <div class="relative w-20 h-20">
              <div class="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-t-accent rounded-full animate-spin"></div>
            </div>
            <div class="text-center space-y-2">
              <p class="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Synchronizing Registry</p>
              <p class="text-[9px] font-black text-muted uppercase tracking-widest">Parsing National Data Matrix fragments...</p>
            </div>
          </div>
        }

        @if (error()) {
          <div class="glass-panel border-accent/30 bg-accent/5 animate-shake mb-14 p-12">
            <div class="flex items-center gap-10">
              <div class="w-20 h-20 rounded-3xl bg-accent flex items-center justify-center shadow-[0_0_30px_var(--color-accent)]">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <div class="space-y-1">
                <p class="text-2xl font-black text-primary uppercase tracking-tighter">Protocol Deviation</p>
                <p class="text-xs font-bold text-muted uppercase tracking-widest">{{ error() }}</p>
                <button (click)="refresh()" class="text-[10px] font-black text-accent uppercase tracking-widest mt-4 underline underline-offset-4">Retry Handshake</button>
              </div>
            </div>
          </div>
        }

        @if (!loading() && summary() && summary()?.stats) {
          <div class="space-y-14">

            <!-- KPI Manifold Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              
              <!-- Total Revenue Stat -->
              <div class="glass-panel p-8 hover:border-accent/30 transition-all group overflow-hidden relative">
                <div class="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <span class="text-[9px] font-black text-muted uppercase tracking-[0.3em] block mb-5">REVENUE (YTD)</span>
                <div class="flex items-baseline gap-2 mb-6">
                  <span class="text-[11px] font-black text-accent">KES</span>
                  <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums">{{ formatM(summary()?.stats?.totalTaxCollected) }}</h3>
                </div>
                <div class="pt-5 border-t border-white/5 flex items-center justify-between">
                  <span class="text-[9px] font-black text-muted uppercase tracking-widest">30D Dynamic</span>
                  <span class="text-[10px] font-black text-primary tabular-nums">{{ formatM(summary()?.stats?.monthlyRevenue) }}</span>
                </div>
              </div>

              <!-- Taxpayer Stat -->
              <div class="glass-panel p-8 hover:border-primary/30 transition-all group">
                <span class="text-[9px] font-black text-muted uppercase tracking-[0.3em] block mb-5">ENTITY REGISTER</span>
                <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums mb-6">{{ (summary()?.stats?.totalTaxpayers || 0) | number }}</h3>
                <div class="pt-5 border-t border-white/5 flex items-center justify-between">
                  <span class="text-[9px] font-black text-muted uppercase tracking-widest">NET Delta</span>
                  <span class="text-[10px] font-black text-[var(--color-success)]">+{{ summary()?.stats?.newTaxpayersThisMonth || 0 }}</span>
                </div>
              </div>

              <!-- Filing Stat -->
              <div class="glass-panel p-8 hover:border-primary/30 transition-all group">
                <span class="text-[9px] font-black text-muted uppercase tracking-[0.3em] block mb-5">FILING VELOCITY</span>
                <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums mb-6">{{ (summary()?.stats?.activeReturns || 0) | number }}</h3>
                <div class="pt-5 border-t border-white/5 flex items-center justify-between">
                  <span class="text-[9px] font-black text-muted uppercase tracking-widest">Active nodes</span>
                  <span class="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--color-accent)]"></span>
                </div>
              </div>

              <!-- Health Stat -->
              <div class="glass-panel p-8 hover:border-primary/30 transition-all group">
                <span class="text-[9px] font-black text-muted uppercase tracking-[0.3em] block mb-5">SYSTEM INTEGRITY</span>
                <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums mb-6">{{ summary()?.stats?.systemHealth || 98 }}%</h3>
                <div class="pt-5 border-t border-white/5 flex items-center gap-3">
                  <div class="status-pill-precision online !py-0.5 !px-3 bg-[var(--color-success)]/10 text-[var(--color-success)] border-none">NOMINAL</div>
                </div>
              </div>

              <!-- Queue Stat -->
              <div class="glass-panel p-8 hover:border-primary/30 transition-all group">
                <span class="text-[9px] font-black text-muted uppercase tracking-[0.3em] block mb-5">SETTLEMENT QUEUE</span>
                <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums mb-6">{{ (summary()?.stats?.pendingPayments || 0) | number }}</h3>
                <div class="pt-5 border-t border-white/5">
                  <span class="text-[9px] font-black text-muted uppercase tracking-widest">Awaiting Sync Cycle</span>
                </div>
              </div>

              <!-- Arrears Stat -->
              <div class="glass-panel p-8 border-accent/20 bg-accent/5 hover:bg-accent/10 transition-all group">
                <span class="text-[9px] font-black text-accent uppercase tracking-[0.3em] block mb-5">CRITICAL ARREARS</span>
                <h3 class="text-3xl font-black text-accent tracking-tighter tabular-nums mb-6">{{ (summary()?.stats?.overdueObligations || 0) | number }}</h3>
                <div class="pt-5 border-t border-accent/10">
                  <span class="text-[9px] font-black text-accent/60 uppercase tracking-widest font-bold">Action Mandated</span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <!-- Main Analytics Matrix -->
              <div class="lg:col-span-8 space-y-14">
                
                <!-- Revenue Command Chart -->
                <div class="glass-panel !p-0 overflow-hidden group">
                  <div class="flex items-center justify-between p-10 border-b border-white/5 bg-white/[0.02]">
                    <div class="space-y-1">
                      <h3 class="text-lg font-black text-primary uppercase tracking-tighter">Fiscal Horizon</h3>
                      <p class="text-[9px] font-black text-muted uppercase tracking-widest">Aggregated performance // 12-Month Telemetry</p>
                    </div>
                    <div class="flex items-center gap-6">
                      <div class="text-right">
                        <span class="text-[9px] font-black text-muted uppercase tracking-widest block mb-1">AGGREGATE VALUE</span>
                        <span class="text-lg font-black text-accent tabular-nums tracking-tighter">KES {{ formatM(totalRevenue12M()) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="p-12 h-[450px] flex items-end gap-5 px-16 relative">
                    <!-- Background Grid Protocol -->
                    <div class="absolute inset-x-12 inset-y-12 border-b border-white/5"></div>
                    <div class="absolute inset-x-12 top-1/4 h-[1px] bg-white/[0.02]"></div>
                    <div class="absolute inset-x-12 top-2/4 h-[1px] bg-white/[0.02]"></div>
                    <div class="absolute inset-x-12 top-3/4 h-[1px] bg-white/[0.02]"></div>

                    @for (m of chartMonths(); track $index) {
                      <div class="flex-1 flex flex-col items-center gap-6 group/bar relative z-10">
                        <div class="w-full max-w-[40px] bg-accent/10 rounded-t-lg transition-all duration-1000 ease-out group-hover/bar:bg-accent group-hover/bar:shadow-[0_0_20px_var(--color-accent)] relative overflow-hidden" 
                          [style.height.%]="getBarPct(m.amount)">
                          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div class="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all bg-primary text-secondary text-[9px] font-black py-2 px-3 rounded-lg whitespace-nowrap shadow-2xl scale-95 group-hover/bar:scale-100 z-50">
                            {{ formatK(m.amount) }}
                          </div>
                        </div>
                        <span class="text-[9px] font-black text-muted uppercase tracking-widest group-hover/bar:text-primary transition-colors">{{ m.month }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Operations Pulse Grid -->
                <div class="glass-panel !p-0 overflow-hidden">
                  <div class="flex items-center justify-between p-10 border-b border-white/5 bg-white/[0.02]">
                    <div class="space-y-1">
                      <h3 class="text-lg font-black text-primary uppercase tracking-tighter">Operations Pulse</h3>
                      <p class="text-[9px] font-black text-muted uppercase tracking-widest">Recent administrative directives & integrity logs</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <div class="status-pill-precision online animate-pulse">LIVE STREAM</div>
                    </div>
                  </div>
                  <div class="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
                    @for (log of recentLogs(); track log.id) {
                      <div class="p-8 flex items-start gap-8 hover:bg-white/[0.03] transition-all group relative overflow-hidden" [class.bg-accent/[0.02]]="isErrorAction(log.action)">
                        @if (isErrorAction(log.action)) {
                          <div class="absolute inset-y-0 left-0 w-1 bg-accent"></div>
                        }
                        
                        <div class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 transition-all group-hover:scale-110 shadow-lg bg-surface-2" 
                          [class.border-accent/20]="isErrorAction(log.action)">
                          @if (isErrorAction(log.action)) {
                            <svg class="text-accent" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2.5"/></svg>
                          } @else {
                            <svg class="text-[var(--color-success)]" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3"/></svg>
                          }
                        </div>
                        
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between mb-2">
                            <span class="text-[11px] font-black text-primary uppercase tracking-tight">{{ log.user || 'SYSTEM COMMAND' }}</span>
                            <span class="text-[9px] font-black text-muted font-mono bg-white/5 px-3 py-1 rounded-full uppercase tabular-nums tracking-widest">{{ log.timestamp | date:'HH:mm:ss:SSS' }}</span>
                          </div>
                          <p class="text-sm font-semibold text-secondary leading-relaxed mb-4 group-hover:text-primary transition-colors">{{ log.details }}</p>
                          <div class="flex items-center gap-3">
                            <span class="inline-block px-3 py-1 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-muted border border-white/5">
                              NODE: {{ log.action }}
                            </span>
                            @if (log.ip) {
                              <span class="text-[9px] font-black text-muted/40 font-mono">{{ log.ip }}</span>
                            }
                          </div>
                        </div>
                      </div>
                    } @empty {
                      <div class="p-32 text-center">
                        <div class="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <svg class="text-muted" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <p class="text-[11px] font-black text-muted uppercase tracking-[0.3em]">Operational Void Detected</p>
                        <p class="text-[9px] font-black text-muted/50 uppercase tracking-widest mt-2 px-10">No operational telemetry signals found in current cluster registry.</p>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <!-- Satellite Intelligence Sidebar -->
              <div class="lg:col-span-4 space-y-10">
                
                <!-- Compliance Radar Terminal -->
                <div class="glass-panel p-10 space-y-12 bg-white/[0.02]">
                  <header class="flex items-center justify-between">
                    <h4 class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Compliance Radar</h4>
                    <svg class="text-accent" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  </header>
                  
                  <div class="space-y-10">
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <span class="text-[10px] font-black text-muted uppercase tracking-widest">FILING VELOCITY</span>
                        <span class="text-xs font-black text-accent tabular-nums">{{ summary()?.compliance?.returnFilingRate || 0 }}%</span>
                      </div>
                      <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                        <div class="h-full bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)] transition-all duration-1000" [style.width.%]="summary()?.compliance?.returnFilingRate || 0"></div>
                      </div>
                    </div>
                    
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <span class="text-[10px] font-black text-muted uppercase tracking-widest">PAYMENT INTEGRITY</span>
                        <span class="text-xs font-black text-[var(--color-success)] tabular-nums">{{ summary()?.compliance?.paymentCompliance || 0 }}%</span>
                      </div>
                      <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                        <div class="h-full bg-[var(--color-success)] rounded-full shadow-[0_0_12px_var(--color-success)] transition-all duration-1000" [style.width.%]="summary()?.compliance?.paymentCompliance || 0"></div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-12 flex items-center gap-8 p-8 rounded-3xl bg-white/5 border border-white/5 relative overflow-hidden group/audit">
                    <div class="absolute inset-0 bg-accent transition-all duration-500 opacity-0 group-hover/audit:opacity-5"></div>
                    <div class="relative w-20 h-20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90 drop-shadow-[0_0_8px_var(--color-accent)]">
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-white/5" stroke-width="4"></circle>
                        <circle cx="18" cy="18" r="16" fill="none" class="stroke-accent transition-all duration-1000 ease-out" stroke-width="4" 
                          stroke-dasharray="100, 100" [attr.stroke-dashoffset]="100 - (summary()?.compliance?.auditReadiness || 0)"></circle>
                      </svg>
                      <span class="absolute text-[11px] font-black text-primary tabular-nums">{{ summary()?.compliance?.auditReadiness || 0 }}%</span>
                    </div>
                    <div class="space-y-1">
                      <span class="text-[10px] font-black text-primary uppercase tracking-widest block">Audit Readiness</span>
                      <span class="text-[9px] font-black text-muted uppercase tracking-[0.2em] block opacity-60">System Matrix Ready</span>
                    </div>
                  </div>
                </div>

                <!-- Strategic Revenue Split -->
                <div class="glass-panel p-10 bg-white/[0.02] group/split">
                  <header class="flex items-center justify-between mb-10">
                    <h4 class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Revenue Spectrum</h4>
                    <svg class="text-muted group-hover/split:rotate-180 transition-all duration-700" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
                  </header>
                  <div class="space-y-6">
                    @for (t of taxTypes().slice(0,6); track $index) {
                      <div class="flex items-center justify-between group/row cursor-default p-2 rounded-xl hover:bg-white/5 transition-all">
                        <div class="flex items-center gap-5">
                          <div class="w-2.5 h-2.5 rounded-full shadow-lg" [style.background]="taxColors[$index % taxColors.length]"></div>
                          <span class="text-[10px] font-black text-secondary uppercase tracking-widest group-hover/row:text-primary transition-colors">{{ shortTaxType(t.type) }}</span>
                        </div>
                        <span class="text-[11px] font-black text-primary font-mono tabular-nums tracking-tighter">KES {{ formatK(t.amount) }}</span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Integration Command Status -->
                <div class="glass-panel !p-0 bg-primary !border-none shadow-2xl relative group overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-accent/30 to-transparent"></div>
                  <div class="p-10 relative z-10">
                    <h4 class="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-10">Gateway Command</h4>
                    <div class="space-y-4">
                      @for (portal of portals(); track portal.name) {
                        <div class="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all group/item" [class.opacity-40]="!portal.online">
                          <div class="space-y-1">
                            <span class="text-xs font-black text-white uppercase tracking-widest block">{{ portal.name }}</span>
                            <span class="text-[9px] font-black text-white/40 font-mono tracking-tighter">{{ portal.online ? portal.latency : 'LINK DISRUPTED' }}</span>
                          </div>
                          <div class="flex items-center gap-5">
                            <span class="text-[9px] font-black uppercase tracking-widest font-bold" [class]="portal.online ? 'text-[var(--color-success)]' : 'text-accent'">
                              {{ portal.online ? 'STABLE' : 'NULL' }}
                            </span>
                            <div class="w-2 h-2 rounded-full shadow-[0_0_12px_currentColor] transition-all group-hover/item:scale-150" [class]="portal.online ? 'bg-[var(--color-success)]' : 'bg-accent'"></div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                  <!-- Background Pattern -->
                  <div class="absolute -bottom-10 -right-10 w-40 h-40 border-t border-l border-white/5 rounded-tl-[80px]"></div>
                </div>

              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .db-root {
      min-height: 100vh;
      background: #050505;
      position: relative;
      overflow-x: hidden;
      color: #e2e8f0;
      padding: 3.5rem;
    }

    .noise-overlay {
      position: fixed;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.015;
      pointer-events: none;
      z-index: 1;
    }

    .content-area {
      position: relative;
      z-index: 2;
      max-width: 1700px;
      margin: 0 auto;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 2.5rem;
    }

    .status-pill-precision {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .status-pill-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .online { color: #10b981; }
    .online .status-pill-dot { background: #10b981; }

    .text-stroke-sm {
      -webkit-text-stroke: 1px currentColor;
      color: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: var(--color-accent);
    }

    .animate-stagger > * {
      animation: stg 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes stg {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
    .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }

    .animate-shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private dashSvc  = inject(AdminDashboardService);
  private auditSvc = inject(AuditLogService);

  loading    = signal(true);
  error      = signal('');
  summary    = signal<AdminDashboardSummary | null>(null);
  portals    = signal<PortalStatus[]>([]);
  recentLogs = signal<AuditLog[]>([]);

  taxColors = ['#D92B2B', '#8c52ff', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16'];

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
    return Math.max((amount / max) * 100, amount > 0 ? 5 : 0);
  }

  formatM(v: number | undefined): string {
    if (!v || v === 0) return '0.00';
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
        else this.error.set(res.error || 'Failed to load strategic intelligence summary.');
        this.loading.set(false);
      },
      error: () => { this.error.set('Satellite link disrupted. Handshake with National Data Matrix failed.'); this.loading.set(false); }
    });
    this.dashSvc.getPortalsStatus().subscribe({
      next: res => { if (res.success && res.data) this.portals.set(res.data); }
    });
  }

  refreshLogs() {
    this.auditSvc.getLogs(1, 15).subscribe({
      next: res => { if (res.success && res.data) this.recentLogs.set(res.data.logs); }
    });
  }
}
