import { inject } from '@angular/core';
import { Component, inject } from '@angular/core';

import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-reports',
  imports: [],
  template: `
    <div class="page-container p-8 animate-up">
      <!-- Elite Header -->
      <header class="page-header-elite mb-12">
        <div class="header-info">
          <h1 class="premium-title">System <span class="gradient-text">Reports</span></h1>
          <p class="premium-subtitle">View and export system reports</p>
        </div>
        <div class="header-actions">
           <div class="premium-stat-card px-6 py-3 border-none shadow-none bg-slate-50/50">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Available Reports</span>
              <span class="text-xl font-black text-red-600 tracking-tight">6 Reports</span>
           </div>
        </div>
      </header>

      <!-- Intelligence Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div class="premium-stat-card p-6 animate-up delay-1">
          <div class="stat-info">
            <span class="stat-label">System Status</span>
            <h3 class="stat-number">Online</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-emerald-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
        </div>

        <div class="premium-stat-card p-6 animate-up delay-2">
          <div class="stat-info">
            <span class="stat-label">Encryption Level</span>
            <h3 class="stat-number text-blue-600">AES-256</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-blue-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
        </div>

        <div class="premium-stat-card p-6 animate-up delay-3">
          <div class="stat-info">
            <span class="stat-label">Global Standards</span>
            <h3 class="stat-number text-purple-600">ISO-27001</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-purple-600">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
        </div>

        <div class="premium-stat-card p-6 animate-up delay-4">
          <div class="stat-info">
            <span class="stat-label">Data Latency</span>
            <h3 class="stat-number text-slate-800">< 50ms</h3>
          </div>
          <div class="absolute -bottom-2 -right-2 opacity-5 scale-150 text-slate-800">
             <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
        </div>
      </div>

      <!-- Report Command Center -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Client Directory -->
        <div class="content-card-premium p-1 relative overflow-hidden animate-up delay-1 group">
           <div class="bg-white rounded-[1.8rem] p-8 h-full flex flex-col transition-all group-hover:bg-slate-50/50">
              <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <h3 class="text-lg font-black text-slate-800 mb-3 uppercase tracking-tight">Client Directory</h3>
              <p class="text-[11px] font-bold text-slate-500 leading-relaxed mb-8 flex-grow">A complete list of registered taxpayers, including PINs, stations, and contact details.</p>
              
              <div class="flex flex-col gap-3">
                <button class="modern-btn primary-btn btn-sm" (click)="downloadReport('clients', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>Export CSV</span>
                </button>
                <button class="modern-btn outline-btn btn-sm" (click)="downloadReport('clients', 'pdf')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  <span>Generate PDF</span>
                </button>
              </div>
           </div>
        </div>

        <!-- Revenue Extract -->
        <div class="content-card-premium p-1 relative overflow-hidden animate-up delay-2 group">
           <div class="bg-white rounded-[1.8rem] p-8 h-full flex flex-col transition-all group-hover:bg-slate-50/50">
              <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <h3 class="text-lg font-black text-slate-800 mb-3 uppercase tracking-tight">Revenue Report</h3>
              <p class="text-[11px] font-bold text-slate-500 leading-relaxed mb-8 flex-grow">A detailed log of all successful payments and transactions.</p>
              
              <div class="flex flex-col gap-3">
                <button class="modern-btn primary-btn btn-sm" style="--btn-primary-bg: #10B981" (click)="downloadReport('revenue', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>Export CSV</span>
                </button>
                <button class="modern-btn outline-btn btn-sm" (click)="downloadReport('revenue', 'pdf')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  <span>Generate PDF</span>
                </button>
              </div>
           </div>
        </div>

        <!-- Returns Summary -->
        <div class="content-card-premium p-1 relative overflow-hidden animate-up delay-3 group">
           <div class="bg-white rounded-[1.8rem] p-8 h-full flex flex-col transition-all group-hover:bg-slate-50/50">
              <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <h3 class="text-lg font-black text-slate-800 mb-3 uppercase tracking-tight">Returns Summary</h3>
              <p class="text-[11px] font-bold text-slate-500 leading-relaxed mb-8 flex-grow">A summary of filed tax returns and their statuses.</p>
              
              <div class="flex flex-col gap-3">
                <button class="modern-btn primary-btn btn-sm" style="--btn-primary-bg: #F59E0B" (click)="downloadReport('returns', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>Export CSV</span>
                </button>
              </div>
           </div>
        </div>

        <!-- Overdue Obligations -->
        <div class="content-card-premium p-1 relative overflow-hidden animate-up delay-4 group">
           <div class="bg-white rounded-[1.8rem] p-8 h-full flex flex-col transition-all group-hover:bg-slate-50/50">
              <div class="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="text-lg font-black text-slate-800 mb-3 uppercase tracking-tight">Overdue Obligations</h3>
              <p class="text-[11px] font-bold text-slate-500 leading-relaxed mb-8 flex-grow">A list of overdue tax obligations and penalties.</p>
              
              <div class="flex flex-col gap-3">
                <button class="modern-btn primary-btn btn-sm" style="--btn-primary-bg: #E31E24" (click)="downloadReport('obligations', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>Export CSV</span>
                </button>
              </div>
           </div>
        </div>

        <!-- Compliance Matrix (Locked) -->
        <div class="content-card-premium p-1 relative overflow-hidden animate-up delay-5 group opacity-80">
           <div class="bg-white rounded-[1.8rem] p-8 h-full flex flex-col transition-all">
              <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-6 group-hover:bg-slate-800 group-hover:text-white transition-all duration-300">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <h3 class="text-lg font-black text-slate-400 mb-3 uppercase tracking-tight">Compliance Matrix</h3>
              <p class="text-[11px] font-bold text-slate-300 leading-relaxed mb-8 flex-grow">Audit readiness scores and risk classifications.</p>
              
              <div class="flex flex-col gap-3">
                <button class="modern-btn btn-sm cursor-not-allowed bg-slate-100 text-slate-400" disabled>
                  <span>Upgrade Required</span>
                </button>
              </div>
           </div>
        </div>

        <!-- System Audit Trail -->
        <div class="content-card-premium p-1 relative overflow-hidden animate-up delay-6 group">
           <div class="bg-white rounded-[1.8rem] p-8 h-full flex flex-col transition-all group-hover:bg-slate-50/50">
              <div class="w-14 h-14 rounded-2xl bg-slate-800 text-white flex items-center justify-center mb-6 group-hover:bg-red-600 transition-all duration-300 transform group-hover:rotate-6">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
              </div>
              <h3 class="text-lg font-black text-slate-800 mb-3 uppercase tracking-tight">System Audit Trail</h3>
              <p class="text-[11px] font-bold text-slate-500 leading-relaxed mb-8 flex-grow">A chronological log of administrative actions and logins.</p>
              
              <div class="flex flex-col gap-3">
                <button class="modern-btn primary-btn btn-sm bg-slate-800 hover:bg-slate-900" (click)="downloadReport('audit', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>Export CSV</span>
                </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    
    .btn-sm { font-size: 0.75rem !important; padding: 0.8rem 1rem !important; }
    
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
    .delay-4 { animation-delay: 0.4s; }
    .delay-5 { animation-delay: 0.5s; }
    .delay-6 { animation-delay: 0.6s; }
  `]
})
export class AdminReportsComponent {
  private authService = inject(AuthService);

  downloadReport(type: string, format: string) {
    const token = this.authService.getAuthToken();
    if (!token) return;
    const url = `${environment.apiUrl}/admin_export.php?type=${type}&format=${format}&token=${token}`;
    window.location.href = url;
  }
}
