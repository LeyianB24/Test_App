import { inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-reports',
  imports: [],
  template: `
    <div class="content-area animate-fade-in">
      
      <!-- Elite Header -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight">
              System <span class="text-accent">Reports</span>
            </h1>
            <p class="text-[var(--text-secondary)] mt-2 font-semibold tracking-wide uppercase text-[10px]">National Intelligence Registry & Data Export Command</p>
          </div>
          <div class="flex items-center">
             <div class="status-pill-precision online py-3 px-6">
                <span class="text-[10px] font-black text-tertiary uppercase tracking-widest block mb-1">Available Intel</span>
                <span class="text-xl font-black text-accent tracking-tighter uppercase">6 Units</span>
             </div>
          </div>
        </div>
      </header>

      <!-- Intelligence Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">System Status</span>
              <h3 class="card-value text-success uppercase">Online</h3>
            </div>
            <div class="p-3 rounded-xl bg-success/5 text-success">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
          </div>
        </div>

        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Encryption Level</span>
              <h3 class="card-value text-blue-500 uppercase">AES-256</h3>
            </div>
            <div class="p-3 rounded-xl bg-blue-500/5 text-blue-500">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
          </div>
        </div>

        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Global Standards</span>
              <h3 class="card-value text-purple-500 uppercase">ISO-27001</h3>
            </div>
            <div class="p-3 rounded-xl bg-purple-500/5 text-purple-500">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
          </div>
        </div>

        <div class="stat-card-precision">
          <div class="flex items-center justify-between">
            <div>
              <span class="card-label">Data Latency</span>
              <h3 class="card-value uppercase tracking-tighter">< 50ms</h3>
            </div>
            <div class="p-3 rounded-xl bg-[var(--text-primary)]/5 text-primary">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Command Center -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Client Directory -->
        <div class="stat-card-precision !p-0 overflow-hidden relative group">
           <div class="p-8 h-full flex flex-col relative z-10 transition-colors group-hover:bg-[var(--bg-surface-1)]">
              <div class="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 transition-all duration-300 transform group-hover:rotate-6 group-hover:bg-blue-500 group-hover:text-white">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              </div>
              <h3 class="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Taxpayer Register</h3>
              <p class="text-[11px] font-semibold text-secondary leading-relaxed mb-8 flex-grow">A comprehensive telemetry export of all registered identities, including PIN validation and station assignments.</p>
              
              <div class="flex flex-col gap-3">
                <button class="btn-precision btn-primary-precision btn-sm" (click)="downloadReport('clients', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>EXPORT CSV</span>
                </button>
                <button class="btn-precision btn-secondary-precision btn-sm" (click)="downloadReport('clients', 'pdf')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  <span>GENERATE PDF</span>
                </button>
              </div>
           </div>
        </div>

        <!-- Revenue Extract -->
        <div class="stat-card-precision !p-0 overflow-hidden relative group">
           <div class="p-8 h-full flex flex-col relative z-10 transition-colors group-hover:bg-[var(--bg-surface-1)]">
              <div class="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-6 transition-all duration-300 transform group-hover:rotate-6 group-hover:bg-success group-hover:text-white">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              </div>
              <h3 class="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Fiscal Revenue Log</h3>
              <p class="text-[11px] font-semibold text-secondary leading-relaxed mb-8 flex-grow">A detailed audit extract of all fiscal transmissions, settlement records, and transaction hash validations.</p>
              
              <div class="flex flex-col gap-3">
                <button class="btn-precision btn-primary-precision btn-sm shadow-[0_4px_12px_rgba(var(--success-rgb),0.3)] !bg-success/90 !border-none" (click)="downloadReport('revenue', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>EXPORT CSV</span>
                </button>
                <button class="btn-precision btn-secondary-precision btn-sm" (click)="downloadReport('revenue', 'pdf')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  <span>GENERATE PDF</span>
                </button>
              </div>
           </div>
        </div>

        <!-- Returns Summary -->
        <div class="stat-card-precision !p-0 overflow-hidden relative group">
           <div class="p-8 h-full flex flex-col relative z-10 transition-colors group-hover:bg-[var(--bg-surface-1)]">
              <div class="w-14 h-14 rounded-2xl bg-warning/10 text-warning flex items-center justify-center mb-6 transition-all duration-300 transform group-hover:rotate-6 group-hover:bg-warning group-hover:text-white">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </div>
              <h3 class="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Declarations Array</h3>
              <p class="text-[11px] font-semibold text-secondary leading-relaxed mb-8 flex-grow">A high-density summary of all tax return declarations, including compliance status and processing metadata.</p>
              
              <div class="flex flex-col gap-3">
                <button class="btn-precision btn-primary-precision btn-sm !bg-warning/90 !border-none shadow-[0_4px_12px_rgba(var(--warning-rgb),0.3)]" (click)="downloadReport('returns', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>EXPORT CSV</span>
                </button>
              </div>
           </div>
        </div>

        <!-- Overdue Obligations -->
        <div class="stat-card-precision !p-0 overflow-hidden relative group border-accent/20">
           <div class="p-8 h-full flex flex-col relative z-10 transition-colors group-hover:bg-accent/5">
              <div class="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 transition-all duration-300 transform group-hover:rotate-6 group-hover:bg-accent group-hover:text-white">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="text-xs font-black text-accent uppercase tracking-[0.2em] mb-4">Arrears Matrix</h3>
              <p class="text-[11px] font-semibold text-secondary leading-relaxed mb-8 flex-grow">A critical list of overdue fiscal obligations, including calculated interest and punitive penalties.</p>
              
              <div class="flex flex-col gap-3">
                <button class="btn-precision btn-primary-precision btn-sm" (click)="downloadReport('obligations', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>EXPORT CSV</span>
                </button>
              </div>
           </div>
        </div>

        <!-- Compliance Matrix (Locked) -->
        <div class="stat-card-precision !p-0 overflow-hidden relative group opacity-50 cursor-not-allowed">
           <div class="p-8 h-full flex flex-col relative z-10 grayscale">
              <div class="w-14 h-14 rounded-2xl bg-[var(--bg-surface-2)] text-tertiary flex items-center justify-center mb-6">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <h3 class="text-xs font-black text-tertiary uppercase tracking-[0.2em] mb-4">Risk Stratification</h3>
              <p class="text-[11px] font-semibold text-tertiary leading-relaxed mb-8 flex-grow">Audit readiness scores and system-wide risk classifications (Locked Module).</p>
              
              <div class="flex flex-col gap-3">
                <button class="btn-precision btn-secondary-precision btn-sm opacity-50 cursor-not-allowed" disabled>
                  <span>UPGRADE ACCESS</span>
                </button>
              </div>
           </div>
        </div>

        <!-- System Audit Trail -->
        <div class="stat-card-precision !p-0 overflow-hidden relative group border-primary/20 bg-primary/5">
           <div class="p-8 h-full flex flex-col relative z-10 transition-colors group-hover:bg-primary/10">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 transition-all duration-300 transform group-hover:rotate-6 group-hover:bg-primary group-hover:text-white">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
              </div>
              <h3 class="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Administrative Ledger</h3>
              <p class="text-[11px] font-semibold text-secondary leading-relaxed mb-8 flex-grow">A chronological audit trail of all high-level administrative actions, security syncs, and command login sessions.</p>
              
              <div class="flex flex-col gap-3">
                <button class="btn-precision btn-primary-precision btn-sm" (click)="downloadReport('audit', 'csv')">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  <span>EXPORT CSV</span>
                </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  `,
  styles: [``]
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
