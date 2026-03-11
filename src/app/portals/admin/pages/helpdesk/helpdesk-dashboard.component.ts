import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpdeskService, HelpdeskSummary } from '../../../../services/helpdesk.service';

@Component({
  selector: 'app-helpdesk-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Support Header Manifold -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Service Request Command</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                Support <span class="text-stroke-sm">Velocity</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                REAL-TIME RESOLUTION TELEMETRY // NODE: SUP-KRA-NODE-03
              </p>
            </div>

            <div class="flex items-center gap-6">
              <div class="status-pill-precision online py-2 px-5 bg-white/5 border-white/10">
                <span class="status-pill-dot animate-pulse shadow-[0_0_8px_var(--color-success)]"></span>
                RESOLVERS ONLINE
              </div>
              <button (click)="loadSummary()" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/10 transition-all flex items-center justify-center group/btn">
                 <svg [class.animate-spin]="loading()" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Dynamic Pulse Indicators -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
          <div class="glass-panel p-10 flex items-center justify-between group hover:border-accent/30 transition-all relative overflow-hidden">
            <div class="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity"></div>
            <div class="space-y-1 relative z-10">
              <span class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Active Directives</span>
              <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums">{{ summary()?.activeTickets || 0 }}</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-accent/10 border border-white/10 group-hover:border-accent/30 transition-all relative z-10">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5a2 2 0 012-2z"/></svg>
            </div>
          </div>

          <div class="glass-panel p-10 flex items-center justify-between group hover:border-primary/30 transition-all relative overflow-hidden">
             <div class="absolute inset-x-0 bottom-0 h-1 bg-[var(--color-success)] opacity-20"></div>
             <div class="space-y-1">
              <span class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Mean Resolve Delta</span>
              <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums">{{ summary()?.avgResolutionTime || 0 }} HRS</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 transition-all">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>

          <div class="glass-panel p-10 flex items-center justify-between group border-[var(--color-success)]/20">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">SLA Integ-Ratio</span>
              <h3 class="text-3xl font-black text-[var(--color-success)] tracking-tighter tabular-nums">{{ summary()?.slaCompliance || 0 }}%</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center border border-[var(--color-success)]/10">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
            </div>
          </div>

          <div class="glass-panel p-10 flex items-center justify-between group">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Global Resolved</span>
              <h3 class="text-3xl font-black text-primary tracking-tighter tabular-nums">{{ (summary()?.totalResolved || 0) | number }}</h3>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 transition-all">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           <!-- Support Velocity Analytics -->
           <div class="lg:col-span-8 flex flex-col gap-8">
              
              <!-- Daily Tick Volume Chart -->
              <div class="glass-panel !p-0 overflow-hidden flex-1 group">
                 <div class="flex items-center justify-between p-10 border-b border-white/5 bg-white/[0.02]">
                    <div class="space-y-1">
                      <h3 class="text-lg font-black text-primary uppercase tracking-tighter">Request Velocity</h3>
                      <p class="text-[9px] font-black text-muted uppercase tracking-widest">Support incident trajectory // Last 30 Cycles</p>
                    </div>
                 </div>
                 <div class="p-12 h-[400px] flex items-end gap-3 relative px-16">
                    <div class="absolute inset-x-12 bottom-12 border-b border-white/5"></div>
                    @for (v of dailyVolume(); track $index) {
                      <div class="flex-1 bg-accent/20 rounded-t-lg transition-all duration-700 hover:bg-accent hover:shadow-[0_0_15px_var(--color-accent)] relative group/bar" 
                        [style.height.%]="getVolumePct(v.count)">
                        <div class="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-primary text-secondary text-[8px] font-black py-1 px-2 rounded">{{ v.count }}</div>
                      </div>
                    }
                 </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <!-- Status Spectrum -->
                 <div class="glass-panel p-10 space-y-8">
                    <h4 class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Status Spectrum</h4>
                    <div class="space-y-6">
                       @for (s of statusBreakdown(); track $index) {
                         <div class="flex flex-col gap-3 group/item">
                            <div class="flex justify-between items-center text-[11px] font-black text-primary uppercase tracking-tight">
                               <span>{{ s.status }}</span>
                               <span>{{ s.count }}</span>
                            </div>
                            <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div class="h-full bg-accent transition-all duration-1000" [style.width.%]="getStatusPct(s.count)"></div>
                            </div>
                         </div>
                       }
                    </div>
                 </div>

                 <!-- Priority Array -->
                 <div class="glass-panel p-10 space-y-8">
                    <h4 class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Priority Array</h4>
                    <div class="space-y-6">
                       @for (p of priorityBreakdown(); track $index) {
                         <div class="flex flex-col gap-3">
                            <div class="flex justify-between items-center text-[11px] font-black text-primary uppercase tracking-tight">
                               <div class="flex items-center gap-3">
                                  <div class="w-2 h-2 rounded-full" [class]="p.priority === 'High' ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]' : 'bg-[var(--color-success)]'"></div>
                                  <span>{{ p.priority }}</span>
                               </div>
                               <span>{{ p.count }}</span>
                            </div>
                            <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div class="h-full transition-all duration-1000" [class]="p.priority === 'High' ? 'bg-accent' : 'bg-primary'" [style.width.%]="getPriorityPct(p.count)"></div>
                            </div>
                         </div>
                       }
                    </div>
                 </div>
              </div>
           </div>

           <!-- Sidebar Intelligence -->
           <div class="lg:col-span-4 space-y-8">
              <!-- Category Distribution -->
              <div class="glass-panel p-10 space-y-10 group/cats">
                <h4 class="text-[10px] font-black text-muted uppercase tracking-[0.4em] flex justify-between items-center">
                   Category Manifold
                   <svg class="text-accent group-hover/cats:rotate-90 transition-transform duration-500" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                </h4>
                <div class="space-y-6">
                   @for (c of categoryBreakdown(); track $index) {
                     <div class="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all cursor-default">
                        <div class="flex items-center gap-4">
                           <div class="w-2 h-2 rounded-full" [style.background]="catColors[$index % catColors.length]"></div>
                           <span class="text-[10px] font-black text-secondary uppercase tracking-widest">{{ c.category }}</span>
                        </div>
                        <span class="text-xs font-black text-primary tabular-nums tracking-tighter">{{ c.count }}</span>
                     </div>
                   }
                </div>
              </div>

              <!-- Support Protocol Readiness -->
              <div class="glass-panel p-10 bg-accent/5 border-accent/20 relative overflow-hidden">
                 <div class="absolute -right-10 -bottom-10 w-40 h-40 border border-accent/10 rounded-full blur-3xl"></div>
                 <div class="relative z-10 space-y-8">
                    <header class="flex items-center justify-between">
                       <h4 class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Protocol Health</h4>
                       <span class="text-xs font-black text-primary tabular-nums tracking-tighter">94%</span>
                    </header>
                    <div class="flex items-center gap-6">
                       <div class="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center shadow-[0_0_20px_var(--color-accent)] shrink-0">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                       </div>
                       <p class="text-[9px] font-black text-muted uppercase tracking-widest leading-relaxed">System resolution velocity is currently within optimal constraints. Incident escalations are below Tier-2 threshold levels.</p>
                    </div>
                 </div>
              </div>
           </div>

        </div>
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

    .online { color: #10b981; }
    .status-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .text-stroke-sm {
      -webkit-text-stroke: 1px currentColor;
      color: transparent;
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
  `]
})
export class HelpdeskDashboardComponent implements OnInit {
  private helpSvc = inject(HelpdeskService);

  loading = signal(true);
  summary = signal<HelpdeskSummary | null>(null);
  
  catColors = ['#D92B2B', '#8c52ff', '#10b981', '#3b82f6', '#f59e0b'];

  statusBreakdown() { return (this.summary()?.statusBreakdown as any[]) ?? []; }
  priorityBreakdown() { return (this.summary()?.priorityBreakdown as any[]) ?? []; }
  categoryBreakdown() { return (this.summary()?.categoryBreakdown as any[]) ?? []; }
  dailyVolume() { return (this.summary()?.dailyVolume as any[]) ?? []; }

  getStatusPct(count: number) {
    const max = Math.max(...this.statusBreakdown().map(d => d.count), 1);
    return (count / max) * 100;
  }
  getPriorityPct(count: number) {
    const max = Math.max(...this.priorityBreakdown().map(d => d.count), 1);
    return (count / max) * 100;
  }
  getVolumePct(count: number) {
    const max = Math.max(...this.dailyVolume().map(d => d.count), 1);
    return Math.max((count / max) * 100, count > 0 ? 5 : 0);
  }

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.loading.set(true);
    this.helpSvc.getSummary().subscribe({
      next: (res: { success: boolean, data: HelpdeskSummary }) => {
        if (res.success && res.data) this.summary.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
