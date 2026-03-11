import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminReportsService } from '../../../services/admin-reports.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Intelligence Header Manifold -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Statutory Intelligence Engine</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                Intelligence <span class="text-stroke-sm">Terminal</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                SECURE DATA EXTRACTION // NATIONAL REVENUE ARCHIVE NODE: RPT-KRA-12
              </p>
            </div>

            <div class="flex items-center gap-6">
              <div class="status-pill-precision online py-2 px-5 bg-white/5 border-white/10 uppercase font-mono">
                ENCRYPTION TIER-7 ACTIVE
              </div>
            </div>
          </div>
        </header>

        <!-- Intelligence Grid Manifold -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (report of reports; track report.id) {
            <div class="glass-panel p-10 hover:border-accent/30 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[380px]">
              <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
              
              <div class="space-y-8 relative z-10">
                <div class="flex items-start justify-between">
                  <div class="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-2xl">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-width="1.5" [attr.d]="report.icon"/>
                    </svg>
                  </div>
                  <div class="status-pill-precision !px-3 !py-1 text-[8px] opacity-40 group-hover:opacity-100 transition-opacity">
                    v2.0 ARRAY
                  </div>
                </div>

                <div class="space-y-3">
                  <h3 class="text-2xl font-black text-primary uppercase tracking-tighter leading-tight">{{ report.title }}</h3>
                  <p class="text-[11px] font-medium text-muted uppercase tracking-widest leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                    {{ report.description }}
                  </p>
                </div>
              </div>

              <div class="pt-10 border-t border-white/5 relative z-10">
                <div class="grid grid-cols-2 gap-4">
                  <button (click)="download(report.id, 'csv')" 
                    class="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 hover:bg-accent/10 hover:border-accent/40 text-[10px] font-black text-primary uppercase tracking-[0.2em] transition-all group/btn">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
                    CSV.ARRAY
                  </button>
                  <button (click)="download(report.id, 'pdf')" 
                    class="flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/40 text-[10px] font-black text-primary uppercase tracking-[0.2em] transition-all group/btn">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 8l4-4m-4 4L8 8"/></svg>
                    PDF.MATRIX
                  </button>
                </div>
              </div>

              <!-- Background Decoration -->
              <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          }
        </div>

        <!-- System Intelligence Pulse -->
        <div class="mt-14 glass-panel p-10 bg-white/[0.01] border-white/5">
           <div class="flex items-center gap-8">
              <div class="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-[0_0_20px_var(--color-accent)]">
                 <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div class="space-y-1">
                 <h4 class="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Operational Protocol Note</h4>
                 <p class="text-[9px] font-medium text-muted uppercase tracking-[0.2em]">All intelligence exports are subject to cryptographic vetting and authorized signature protocols. Extraction signatures are logged in the National Forensic Metadata Matrix.</p>
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
export class AdminReportsComponent implements OnInit {
  private reportsSvc = inject(AdminReportsService);

  reports = [
    { 
      id: 'taxpayers', 
      title: 'Taxpayer Register', 
      description: 'Global extraction of serialized taxpayer identity fragments and registration telemetry.', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' 
    },
    { 
      id: 'revenue', 
      title: 'Fiscal Revenue Log', 
      description: 'Comprehensive audit of national revenue streams across VAT, PAYE, and Corporate manifolds.', 
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' 
    },
    { 
      id: 'returns', 
      title: 'Declarations Array', 
      description: 'Deep-dive intelligence on statutory filing velocity and submission integrity patterns.', 
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' 
    },
    { 
      id: 'arrears', 
      title: 'Arrears Matrix', 
      description: 'Visualizing critical debt vectors and high-priority obligation deviations across the network.', 
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 16v-1m4-4V7a4 4 0 00-8 0v4h8z' 
    },
    { 
      id: 'audit', 
      title: 'Administrative Ledger', 
      description: 'Forensic trail of command directives and system-wide state modifications by authorized nodes.', 
      icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4' 
    }
  ];

  ngOnInit() {}

  download(reportId: string, format: string) {
    this.reportsSvc.downloadReport(reportId, format).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportId}_intel_${new Date().getTime()}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
}
