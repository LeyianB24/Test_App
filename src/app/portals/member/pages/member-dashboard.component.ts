import { Component, inject, computed, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DashboardDataService } from '../../../services/dashboard-data.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

interface DashboardStat {
  label: string;
  value: number;
  type: 'currency' | 'percent' | 'count';
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  color: 'red' | 'green' | 'blue' | 'gold';
  icon: string;
}

@Component({
  selector: 'app-member-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
  template: `
    <div class="animate-fade-in p-2 md:p-6 lg:p-8">
      <!-- Top Intelligence Bar -->
      <header class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                v2.0 MASTER
              </span>
            </div>
            <h1 class="premium-title">
              Wealth <span class="text-blue-500">Terminal</span>
            </h1>
            <p class="text-slate-400 text-lg md:text-xl font-medium mt-1">Synchronized Access Cluster // <span class="text-white">{{ userName() }}</span></p>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <button class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-2 shadow-sm text-sm" (click)="downloadStatusReport()">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Intelligence Report
            </button>
            <button class="btn-primary py-3 px-6 shadow-lg shadow-blue-500/25" (click)="router.navigate(['/member/payments-enhanced'])">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              Execute Payment
            </button>
          </div>
        </div>
      </header>
    
      <!-- HD Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10 lg:mb-14">
        @for (stat of stats(); track stat.label) {
          <div class="glass-panel p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
            <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 to-transparent {{ stat.color === 'blue' ? 'from-blue-500' : stat.color === 'red' ? 'from-red-500' : stat.color === 'green' ? 'from-emerald-500' : 'from-amber-500' }}"></div>
            
            <div class="flex justify-between items-start mb-6">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 {{ stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : stat.color === 'red' ? 'bg-red-500/10 text-red-400' : stat.color === 'green' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400' }}">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="stat.icon" />
                </svg>
              </div>
              
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold leading-none border {{ stat.trendDirection === 'up' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : stat.trendDirection === 'down' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20' }}">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  @if (stat.trendDirection === 'up') {
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7 7 7M12 3v18"/>
                  }
                  @if (stat.trendDirection === 'down') {
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7-7-7M12 21V3"/>
                  }
                  @if (stat.trendDirection === 'neutral') {
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"/>
                  }
                </svg>
                {{ stat.trend }}
              </div>
            </div>
            
            <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 z-10 relative">{{ stat.label }}</h3>
            <div class="text-4xl lg:text-5xl font-bold text-white tracking-tight z-10 relative">{{ stat.formattedValue }}</div>
          </div>
        }
      </div>
    
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <!-- Revenue Analytics Surface (Spans 2 cols) -->
        <div class="glass-panel p-8 lg:p-10 lg:col-span-2 flex flex-col relative overflow-hidden">
          <div class="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 relative z-10">
            <div>
              <h3 class="premium-subtitle m-0 mb-1">Revenue Trajectory</h3>
              <p class="text-slate-400 text-sm">12-month centralized performance telemetry</p>
            </div>
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              REAL-TIME
            </span>
          </div>
    
          <div class="relative h-[300px] w-full mt-auto flex items-end justify-between gap-2 z-10">
            @for (bar of [50, 70, 40, 90, 60, 80, 55, 75, 65, 85, 95, 100]; track $index) {
              <div class="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-pointer group relative flex flex-col justify-end"
                   [style.height.%]="bar">
                <!-- Tooltip -->
                <div class="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                   {{ bar }}K
                </div>
              </div>
            }
          </div>
          <!-- X-Axis Labels -->
          <div class="flex justify-between w-full mt-4 text-[10px] font-bold text-slate-500 uppercase z-10 px-1">
             <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
             <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>
    
        <!-- System Load / Distribution -->
        <div class="glass-panel p-8 lg:p-10 flex flex-col relative overflow-hidden">
          <div class="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <h3 class="premium-subtitle m-0 mb-1 relative z-10">System Compliance</h3>
          <p class="text-slate-400 text-sm mb-12 relative z-10">Operational Integrity Status</p>
          
          <div class="flex-grow flex flex-col items-center justify-center relative z-10">
            <div class="relative w-48 h-48 mb-6">
              <!-- Background Track -->
              <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" stroke-width="8" fill="none" />
                <!-- Foreground Fill -->
                <circle cx="50" cy="50" r="40" 
                        stroke="currentColor" 
                        stroke-width="8" 
                        fill="none" 
                        stroke-linecap="round"
                        class="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
                        [style.stroke-dasharray]="251.2"
                        [style.stroke-dashoffset]="dashOffset()" />
              </svg>
              <!-- Center Text -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-black text-white tracking-tighter">{{ complianceScore() }}<span class="text-2xl text-emerald-500">%</span></span>
                <span class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Compliant</span>
              </div>
            </div>
            
            <div class="w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
               <div class="flex justify-between items-center">
                  <span class="text-xs text-slate-400">Pending Actions</span>
                  <span class="text-xs font-bold" [class]="dashboardData.statistics().count_pending_obligations > 0 ? 'text-red-400' : 'text-emerald-400'">{{ dashboardData.statistics().count_pending_obligations }}</span>
               </div>
               <div class="flex justify-between items-center">
                  <span class="text-xs text-slate-400">Returns Status</span>
                  <span class="text-xs font-bold text-emerald-400">Up to date</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class MemberDashboardComponent implements OnInit {
  authService = inject(AuthService);
  dashboardData = inject(DashboardDataService);
  router = inject(Router);

  currentUser = computed(() => this.authService.currentUser());
  userName = computed(() => this.currentUser()?.name || 'Authorized Taxpayer');
  
  complianceScore = computed(() => {
    // Dynamic compliance score based on pending obligations
    const pending = this.dashboardData.statistics().count_pending_obligations || 0;
    if (pending === 0) return 98;
    return Math.max(10, 98 - (pending * 15));
  });

  dashOffset = computed(() => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    return circumference - (this.complianceScore() / 100) * circumference;
  });

  stats = computed(() => {
    const s = this.dashboardData.statistics();
    const data: any[] = [
      { 
        label: 'Total Paid (YTD)', 
        value: s.total_revenue || 0, 
        type: 'currency', 
        trend: '+12.5% Gain', 
        trendDirection: 'up', 
        color: 'blue', 
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
      },
      { 
        label: 'Pending Obligations', 
        value: s.count_pending_obligations || 0, 
        type: 'count', 
        trend: s.count_pending_obligations > 0 ? 'Action Needed' : 'All Clear', 
        trendDirection: s.count_pending_obligations > 0 ? 'down' : 'up', 
        color: 'red', 
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' 
      },
      { 
        label: 'Returns Filed', 
        value: s.total_returns || 0, 
        type: 'count', 
        trend: 'Elite Status', 
        trendDirection: 'up', 
        color: 'gold', 
        icon: 'M13 10V3L4 14h7v7l9-11h-7z' 
      }
    ];

    return data.map(stat => ({
      ...stat,
      formattedValue: stat.type === 'currency' 
        ? 'KES ' + (stat.value / 1000).toFixed(1) + 'K'
        : stat.type === 'percent' ? stat.value + '%' : stat.value.toString()
    }));
  });

  chartData = computed(() => {
    const rawData = this.dashboardData.chartData();
    const max = Math.max(...rawData.map(d => d.amount), 1000);
    return rawData.map(d => ({
      ...d,
      height: (d.amount / max) * 100
    }));
  });

  activities = computed(() => {
    const payments = this.dashboardData.recentPayments().map(p => ({
        action: `Payment: ${p.payment_reference}`,
        date: p.payment_date,
        status: 'success',
        statusLabel: 'SETTLED',
        timestamp: new Date(p.payment_date).getTime()
    }));
    
    const returns = this.dashboardData.recentReturns().map(r => ({
        action: `Return Filed: ${r.return_reference}`,
        date: r.filing_date,
        status: 'success',
        statusLabel: 'FILED',
        timestamp: new Date(r.filing_date).getTime()
    }));
    
    // Combine and sort by date descending
    return [...payments, ...returns]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);
  });

  ngOnInit() {
    // Data is now prefetched by AuthService on login/startup
  }

  downloadStatusReport() {
    window.open(`${environment.apiUrl}/download.php?type=status_report&id=1&format=pdf`, '_blank');
  }
}
