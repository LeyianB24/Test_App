import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardService, AdminDashboardSummary, PortalStatus } from '../../../services/admin-dashboard.service';
import { AuditLogService, AuditLog } from '../../../core/services/admin/audit-log.service';

@Component({
  selector: 'app-admin-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="page-container p-8 animate-up">
      <!-- Elite Page Header -->
      <header class="page-header-elite mb-12">
        <div class="header-info">
          <h1 class="premium-title">Dashboard</h1>
          <p class="premium-subtitle">System overview, metrics, and revenue analytics</p>
        </div>
        <div class="header-actions">
          <div class="status-pill-elite synced mr-4">
            <span class="dot animate-pulse"></span>System Online
          </div>
          <button (click)="refresh()" class="modern-btn outline-btn btn-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Refresh Analytics</span>
          </button>
        </div>
      </header>

      <!-- ── Loading ───────────────────────────────────────── -->
      @if (loading()) {
        <div class="py-32 flex flex-col items-center">
          <div class="w-16 h-16 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
          <p class="mt-6 text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Loading system data...</p>
        </div>
      }

      <!-- ── Error ─────────────────────────────────────────── -->
      @if (error()) {
        <div class="m-8 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold flex items-center gap-4 animate-scale">
           <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
           {{ error() }}
        </div>
      }

      <!-- ── Main Content ──────────────────────────────────── -->
      @if (!loading() && summary() && summary()?.stats) {
        <div class="space-y-12 animate-fade-in">

          <!-- KPI Surface -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

            <!-- Total Revenue -->
            <div class="premium-stat-card p-6 border-l-4 border-red-600 group">
              <div class="stat-info mb-4">
                <span class="stat-label">Total Revenue</span>
                <h3 class="stat-number">KES {{ formatM(summary()?.stats?.totalTaxCollected) }}</h3>
              </div>
              <div class="status-pill-elite active text-[9px] w-fit">
                <span class="dot"></span>
                Month: KES {{ formatM(summary()?.stats?.monthlyRevenue) }}
              </div>
              <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-red-600 group-hover:scale-[1.7] transition-transform">
                <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>

            <!-- Total Taxpayers -->
            <div class="premium-stat-card p-6 border-l-4 border-blue-600 group">
              <div class="stat-info mb-4">
                <span class="stat-label">Taxpayers</span>
                <h3 class="stat-number">{{ (summary()?.stats?.totalTaxpayers || 0) | number }}</h3>
              </div>
              <div class="status-pill-elite synced text-[9px] w-fit">
                <span class="dot"></span>
                +{{ summary()?.stats?.newTaxpayersThisMonth || 0 }} new
              </div>
              <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-blue-600 group-hover:scale-[1.7] transition-transform">
                <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
            </div>

            <!-- Active Returns -->
            <div class="premium-stat-card p-6 border-l-4 border-emerald-600 group">
              <div class="stat-info mb-4">
                <span class="stat-label">Active Returns</span>
                 <h3 class="stat-number">{{ (summary()?.stats?.activeReturns || 0) | number }}</h3>
              </div>
              <div class="status-pill-elite active text-[9px] w-fit">
                <span class="dot"></span>
                Last 30 Days
              </div>
              <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-emerald-600 group-hover:scale-[1.7] transition-transform">
                <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
            </div>

            <!-- System Health -->
            <div class="premium-stat-card p-6 border-l-4 border-purple-600 group">
              <div class="stat-info mb-4">
                <span class="stat-label">System Health</span>
                <h3 class="stat-number">{{ summary()?.stats?.systemHealth || 98 }}%</h3>
              </div>
              <div class="status-pill-elite synced text-[9px] w-fit">
                <span class="dot"></span>
                Operational
              </div>
              <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-purple-600 group-hover:scale-[1.7] transition-transform">
                <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
            </div>

            <!-- Pending Payments -->
            <div class="premium-stat-card p-6 border-l-4 border-amber-600 group">
              <div class="stat-info mb-4">
                <span class="stat-label">Awaiting Settlement</span>
                <h3 class="stat-number">{{ (summary()?.stats?.pendingPayments || 0) | number }}</h3>
              </div>
              <div class="status-pill-elite pending text-[9px] w-fit">
                <span class="dot"></span>
                Awaiting Payment
              </div>
              <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-amber-600 group-hover:scale-[1.7] transition-transform">
                <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>

            <!-- Overdue -->
            <div class="premium-stat-card p-6 border-l-4 border-rose-600 group">
              <div class="stat-info mb-4">
                <span class="stat-label">Overdue Payments</span>
                <h3 class="stat-number text-red-600">{{ (summary()?.stats?.overdueObligations || 0) | number }}</h3>
              </div>
              <div class="status-pill-elite overdue text-[9px] w-fit">
                <span class="dot"></span>
                Action Required
              </div>
              <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-rose-600 group-hover:scale-[1.7] transition-transform">
                <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
            </div>

          </div>

          <!-- Main Analytics Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <!-- Revenue Intelligence -->
            <div class="lg:col-span-2 space-y-12">
               <div class="content-card-premium p-10 relative overflow-hidden">
                  <div class="absolute -top-20 -right-20 w-80 h-80 bg-red-50/50 rounded-full blur-3xl"></div>
                   
                  <div class="flex items-center justify-between mb-12 relative z-10">
                     <div>
                        <h3 class="text-xl font-black text-slate-800">Revenue Analytics</h3>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">12-Month Overview</p>
                     </div>
                     <span class="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-100 rounded-xl text-slate-500">KES {{ formatM(totalRevenue12M()) }} Total</span>
                  </div>

                  <div class="flex items-end gap-3 h-[250px] mb-8 relative z-10 px-4">
                    @for (m of chartMonths(); track $index) {
                      <div class="flex-grow flex flex-col items-center group h-full justify-end">
                        <div class="mb-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-xl translate-y-2 group-hover:translate-y-0 transition-all">
                           {{ formatK(m.amount) }}
                        </div>
                        <div class="w-full bg-slate-50/50 rounded-2xl overflow-hidden h-full flex items-end">
                           <div 
                              class="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-2xl transition-all duration-1000 ease-out group-hover:from-red-700 group-hover:shadow-[0_0_20px_rgba(227,30,36,0.3)]"
                              [style.height.%]="getBarPct(m.amount)"
                           ></div>
                        </div>
                        <span class="text-[9px] font-black text-slate-400 mt-4 uppercase tracking-tighter">{{ m.month }}</span>
                      </div>
                    }
                  </div>
               </div>

               <!-- Live System Pulse -->
               <div class="content-card-premium p-10">
                  <div class="flex items-center justify-between mb-10">
                    <h3 class="text-xl font-black text-slate-800 flex items-center gap-3">
                       <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                       Recent Activity Logs
                    </h3>
                    <button class="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] hover:opacity-70 transition-opacity" (click)="refreshLogs()">Clear Logs</button>
                  </div>

                  <div class="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                    @for (log of recentLogs(); track log.id) {
                      <div class="flex gap-6 group">
                        <div class="flex-shrink-0 w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all group-hover:scale-110" 
                             [class]="isErrorAction(log.action) ? 'bg-red-50 text-red-600 shadow-red-100/50' : 'bg-slate-50 text-slate-600 shadow-slate-100/50'">
                           @if (isErrorAction(log.action)) {
                              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                           } @else {
                              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                           }
                        </div>
                        <div class="flex-grow pb-6 border-b border-slate-50 last:border-0">
                           <div class="flex items-center justify-between mb-2">
                              <span class="text-[11px] font-black text-slate-800">{{ log.user || 'SYSTEM' }}</span>
                              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ log.timestamp | date:'HH:mm:ss' }}</span>
                           </div>
                           <p class="text-sm text-slate-600 font-medium leading-relaxed">{{ log.details }}</p>
                           <div class="mt-3 inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                                [class]="isErrorAction(log.action) ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'">
                              {{ log.action }}
                           </div>
                        </div>
                      </div>
                    } @empty {
                      <div class="text-center py-20 bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                         <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">No recent activity detected.</p>
                      </div>
                    }
                  </div>
               </div>
            </div>

            <!-- Side Intelligence -->
            <div class="space-y-12">
               <!-- Audit Readiness -->
               <div class="content-card-premium p-10 relative overflow-hidden">
                  <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-50/50 rounded-full blur-3xl"></div>
                   <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">Compliance Overview</h3>
                   
                   <div class="space-y-8 mb-12">
                      <div class="space-y-3">
                         <div class="flex justify-between text-[11px] font-black text-slate-700">
                            <span>RETURN FILING</span>
                            <span class="text-blue-600">{{ summary()?.compliance?.returnFilingRate || 0 }}%</span>
                         </div>
                         <div class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-600 transition-all duration-1000" [style.width.%]="summary()?.compliance?.returnFilingRate || 0"></div>
                         </div>
                      </div>
                      <div class="space-y-3">
                         <div class="flex justify-between text-[11px] font-black text-slate-700">
                            <span>PAYMENT VELOCITY</span>
                            <span class="text-emerald-600">{{ summary()?.compliance?.paymentCompliance || 0 }}%</span>
                         </div>
                         <div class="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-600 transition-all duration-1000" [style.width.%]="summary()?.compliance?.paymentCompliance || 0"></div>
                         </div>
                      </div>
                   </div>

                   <div class="p-8 bg-slate-800 rounded-[2.5rem] flex items-center gap-6 relative z-10 shadow-2xl shadow-slate-900/10">
                      <div class="relative w-20 h-20 flex-shrink-0">
                         <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"></circle>
                            <circle cx="18" cy="18" r="16" fill="none" stroke="red" stroke-width="4" stroke-dasharray="100" [attr.stroke-dashoffset]="100 - (summary()?.compliance?.auditReadiness || 0)" stroke-linecap="round" class="transition-all duration-1000"></circle>
                         </svg>
                         <div class="absolute inset-0 flex items-center justify-center font-black text-white text-sm">
                            {{ summary()?.compliance?.auditReadiness || 0 }}%
                         </div>
                      </div>
                      <div>
                         <span class="text-white font-black block text-sm">Overall Health</span>
                         <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">System-wide score</p>
                      </div>
                   </div>
               </div>

               <!-- Tax Type Distribution -->
               <div class="content-card-premium p-10">
                  <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">Revenue Distribution</h3>
                  <div class="space-y-4">
                    @for (t of taxTypes().slice(0,6); track $index) {
                      <div class="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                        <div class="flex items-center gap-4">
                           <div class="w-2 h-2 rounded-full" [style.background]="taxColors[$index % taxColors.length]"></div>
                           <span class="text-[11px] font-black text-slate-700 uppercase">{{ shortTaxType(t.type) }}</span>
                        </div>
                        <span class="text-xs font-black text-slate-900">KES {{ formatK(t.amount) }}</span>
                      </div>
                    }
                  </div>
               </div>

               <!-- Gov Nexus -->
               <div class="content-card-premium p-10 bg-slate-900 text-white relative overflow-hidden">
                  <div class="absolute top-0 right-0 p-10 opacity-10">
                     <svg width="100" height="100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="1" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                  </div>
                  <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10 relative z-10">System Integrations</h3>
                  <div class="space-y-4 relative z-10">
                    @for (portal of portals(); track portal.name) {
                      <div class="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group">
                        <div class="flex flex-col">
                           <span class="text-[11px] font-black text-slate-300">{{ portal.name }}</span>
                           <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{{ portal.online ? portal.latency : 'Offline' }}</span>
                        </div>
                        <div class="flex items-center gap-3">
                           <span class="text-[9px] font-black uppercase tracking-[0.2em]" [class.text-emerald-400]="portal.online" [class.text-red-400]="!portal.online">
                              {{ portal.online ? 'Online' : 'Offline' }}
                           </span>
                           <div class="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor]" [class.bg-emerald-400]="portal.online" [class.bg-red-400]="!portal.online"></div>
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
  styles: [`
    /* ── Layout ──────────────────────────────────────────── */
    .admin-dash { max-width: 1440px; margin: 0 auto; padding: 2rem; }

    /* ── KPI Grid ────────────────────────────────────────── */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (max-width: 1280px) { .kpi-grid { grid-template-columns: repeat(3,1fr); } }
    @media (max-width: 768px)  { .kpi-grid { grid-template-columns: 1fr 1fr; } }

    .kpi-card {
      background: #fff;
      border-radius: 20px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      transition: transform .35s cubic-bezier(.165,.84,.44,1), box-shadow .35s;
      box-shadow: 0 2px 12px rgba(0,0,0,.05);
      border: 1px solid #F1F5F9;
    }
    .kpi-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,.09); }

    .kpi-icon-wrap {
      width: 44px; height: 44px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 14px;
    }
    .kpi-icon-red    { background: rgba(227,30,36,.1);   color: #E31E24; }
    .kpi-icon-blue   { background: rgba(59,130,246,.1);  color: #3B82F6; }
    .kpi-icon-green  { background: rgba(16,185,129,.1);  color: #10B981; }
    .kpi-icon-purple { background: rgba(139,92,246,.1);  color: #8B5CF6; }
    .kpi-icon-amber  { background: rgba(245,158,11,.1);  color: #F59E0B; }
    .kpi-icon-rose   { background: rgba(251,113,133,.1); color: #F87171; }

    .kpi-label { font-size: .7rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: .5px; display: block; margin-bottom: 6px; }
    .kpi-value { font-size: 1.35rem; font-weight: 900; color: #1E293B; line-height: 1; margin-bottom: 8px; }
    .kpi-unit  { font-size: .8rem; font-weight: 700; }

    .kpi-badge { font-size: .62rem; font-weight: 900; padding: 3px 8px; border-radius: 8px; }
    .kpi-badge-green  { background: rgba(16,185,129,.1); color: #059669; }
    .kpi-badge-blue   { background: rgba(59,130,246,.1); color: #2563EB; }
    .kpi-badge-purple { background: rgba(139,92,246,.1); color: #7C3AED; }
    .kpi-badge-amber  { background: rgba(245,158,11,.1); color: #D97706; }
    .kpi-badge-rose   { background: rgba(239,68,68,.1);  color: #DC2626; }

    .kpi-sparkline { position: absolute; bottom: 0; right: 0; width: 100%; height: 40px; opacity: .5; }
    .kpi-sparkline svg { width: 100%; height: 100%; }

    .kpi-ring { position: absolute; bottom: 8px; right: 12px; width: 48px; height: 48px; }
    .kpi-ring svg { width: 100%; height: 100%; }

    /* ── Dash Grid ────────────────────────────────────────── */
    .dash-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
    @media (max-width: 1100px) { .dash-grid { grid-template-columns: 1fr; } }

    /* ── Cards ────────────────────────────────────────────── */
    .card-glass {
      background: rgba(255,255,255,.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,.5);
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 4px 24px rgba(0,0,0,.05);
      margin-bottom: 20px;
      transition: box-shadow .3s;
    }
    .card-glass:hover { box-shadow: 0 10px 36px rgba(0,0,0,.08); }
    .card-red-left    { border-left: 5px solid var(--kra-red, #E31E24); }
    .card-blue-left   { border-left: 5px solid #3B82F6; }
    .card-purple-left { border-left: 5px solid #8B5CF6; }
    .card-gold-left   { border-left: 5px solid #F59E0B; }
    .card-slate-left  { border-left: 5px solid #64748B; }

    .card-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .card-title { font-size: 1rem; font-weight: 900; color: #1E293B; margin: 0; }
    .badge-pill { background: #F1F5F9; color: #475569; font-size: .7rem; font-weight: 900; padding: 4px 12px; border-radius: 20px; }
    .text-link  { background: none; border: none; color: #3B82F6; font-size: .8rem; font-weight: 800; cursor: pointer; }
    .mb-20 { margin-bottom: 20px; }
    .mb-16 { margin-bottom: 16px; }

    /* ── Bar Chart ────────────────────────────────────────── */
    .bar-chart-wrap { display: flex; align-items: flex-end; gap: 8px; height: 120px; padding-bottom: 4px; }
    .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }
    .bar-label-top { font-size: .55rem; font-weight: 800; color: #94A3B8; min-height: 14px; }
    .bar-container { flex: 1; width: 100%; display: flex; align-items: flex-end; background: #F8FAFC; border-radius: 6px 6px 0 0; }
    .bar-fill { width: 100%; background: linear-gradient(to top, #E31E24, #F87171); border-radius: 6px 6px 0 0; min-height: 4px; transition: height 1s ease; }
    .bar-month { font-size: .6rem; font-weight: 800; color: #94A3B8; white-space: nowrap; }
    .chart-legend { display: flex; gap: 16px; margin-top: 12px; }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: .72rem; font-weight: 700; color: #64748B; }
    .legend-dot { width: 8px; height: 8px; border-radius: 2px; }
    .dot-red { background: #E31E24; }

    /* ── Performance Row ─────────────────────────────────── */
    .perf-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 20px; }
    @media (max-width: 900px) { .perf-row { grid-template-columns: repeat(2,1fr); } }

    .perf-metric { background: #FFF; border: 1px solid #F1F5F9; border-radius: 18px; padding: 16px; display: flex; gap: 14px; align-items: flex-start; box-shadow: 0 2px 8px rgba(0,0,0,.03); }
    .perf-icon { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .perf-icon.blue   { background: rgba(59,130,246,.1); color: #3B82F6; }
    .perf-icon.green  { background: rgba(16,185,129,.1); color: #10B981; }
    .perf-icon.purple { background: rgba(139,92,246,.1); color: #8B5CF6; }
    .perf-icon.amber  { background: rgba(245,158,11,.1); color: #F59E0B; }
    .perf-value { font-size: 1.1rem; font-weight: 900; color: #1E293B; margin-bottom: 2px; }
    .perf-label { font-size: .68rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; margin-bottom: 8px; }
    .mini-bar { height: 4px; background: #F1F5F9; border-radius: 2px; overflow: hidden; }
    .mini-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }
    .blue-fill   { background: #3B82F6; }
    .green-fill  { background: #10B981; }
    .purple-fill { background: #8B5CF6; }
    .amber-fill  { background: #F59E0B; }

    /* ── Pulse List ──────────────────────────────────────── */
    .pulse-scroll { max-height: 320px; overflow-y: auto; padding-right: 4px; }
    .pulse-item { display: flex; gap: 12px; padding: 12px 8px; border-radius: 12px; transition: background .2s; }
    .pulse-item:hover { background: rgba(241,245,249,.8); }
    .pulse-dot-wrap { width: 32px; height: 32px; border-radius: 10px; background: rgba(59,130,246,.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
    .red-dot-wrap   { background: rgba(239,68,68,.1); }
    .pulse-dot  { width: 8px; height: 8px; border-radius: 50%; background: #3B82F6; box-shadow: 0 0 6px #3B82F6; }
    .red-dot    { background: #EF4444; box-shadow: 0 0 6px #EF4444; }
    .pulse-body { flex: 1; min-width: 0; }
    .pulse-row  { display: flex; justify-content: space-between; margin-bottom: 2px; }
    .pulse-user { font-size: .8rem; font-weight: 900; color: #1E293B; }
    .pulse-time { font-size: .68rem; color: #94A3B8; font-weight: 700; }
    .pulse-desc { font-size: .75rem; color: #64748B; margin: 2px 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pulse-tag  { font-size: .6rem; font-weight: 950; text-transform: uppercase; color: #3B82F6; letter-spacing: .4px; }
    .red-tag    { color: #EF4444; }

    /* ── Compliance Radar ────────────────────────────────── */
    .radar-item { margin-bottom: 16px; }
    .radar-row  { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .radar-label{ font-size: .78rem; font-weight: 800; color: #64748B; }
    .radar-val  { font-size: .78rem; font-weight: 900; color: #1E293B; }
    .radar-track{ height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden; }
    .radar-fill { height: 100%; border-radius: 4px; transition: width 1.2s ease; }
    .radar-blue   { background: linear-gradient(90deg, #3B82F6, #60A5FA); }
    .radar-green  { background: linear-gradient(90deg, #10B981, #34D399); }
    .radar-purple { background: linear-gradient(90deg, #8B5CF6, #A78BFA); }

    .audit-score { display: flex; align-items: center; gap: 16px; margin-top: 24px; padding: 16px; background: #F8FAFC; border-radius: 16px; }
    .score-ring  { width: 80px; height: 80px; flex-shrink: 0; }
    .score-num   { font-size: 1.6rem; font-weight: 900; color: #1E293B; }
    .score-lbl   { font-size: .7rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; }

    /* ── Tax Type Distribution ───────────────────────────── */
    .tax-type-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #F8FAFC; }
    .tax-type-info { display: flex; align-items: center; gap: 10px; }
    .tax-dot  { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
    .tax-name { font-size: .8rem; font-weight: 800; color: #334155; }
    .tax-amt  { font-size: .78rem; font-weight: 900; color: #1E293B; }

    /* ── Gov Nexus ───────────────────────────────────────── */
    .nexus-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #F8FAFC; border-radius: 12px; margin-bottom: 6px; }
    .nexus-name { font-size: .82rem; font-weight: 800; color: #334155; }
    .nexus-status { display: flex; align-items: center; gap: 6px; }
    .nexus-dot { width: 7px; height: 7px; border-radius: 50%; background: #CBD5E1; }
    .nexus-dot-on { background: #10B981; box-shadow: 0 0 5px #10B981; }
    .nexus-txt { font-size: .65rem; font-weight: 950; color: #10B981; }
    .nexus-off { color: #EF4444; }
    .nexus-lat { font-size: .6rem; color: #94A3B8; font-weight: 700; }

    /* ── Live Badge ──────────────────────────────────────── */
    .live-badge { display: flex; align-items: center; gap: 6px; background: #1E293B; color: #fff; font-size: .65rem; font-weight: 950; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; margin-right: 10px; }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; animation: blink 1.5s infinite; }
    .live-badge-sm { display: flex; align-items: center; gap: 4px; font-size: .62rem; font-weight: 800; color: #64748B; }
    .live-dot-sm { width: 5px; height: 5px; border-radius: 50%; background: #10B981; animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: .4; } }

    /* ── Loading ─────────────────────────────────────────── */
    .loading-splash { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 16px; }
    .loading-splash p { color: #94A3B8; font-weight: 700; font-size: .9rem; }
    .spin { width: 40px; height: 40px; border: 4px solid #F1F5F9; border-top-color: #E31E24; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-msg { color: #94A3B8; font-size: .82rem; font-weight: 700; text-align: center; padding: 20px; }
    .page-container { max-width: 1440px; margin: 0 auto; padding: 2rem; }
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

  taxColors = ['#E31E24','#3B82F6','#10B981','#8B5CF6','#F59E0B','#EC4899','#06B6D4','#84CC16'];

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
