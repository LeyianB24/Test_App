import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-tcc-application',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner animate-stagger">
        
        <!-- ── HEADER ─────────────────────────────────────── -->
        <header class="db-header-elite">
          <div class="header-left">
            <div class="live-badge">
              <span class="live-dot"></span>
              SECURE REGISTRY ACTIVE
            </div>
            <h1 class="premium-title">Tax Compliance <span class="text-red">Registry</span></h1>
            <p class="premium-subtitle">Authorized gateway for TCC applications and real-time standing verification</p>
          </div>
          
          <div class="header-right">
            <div class="status-chip" [class.chip-ok]="isCompliant()">
              <span class="dot"></span>
              {{ isCompliant() ? 'TAXPAYER COMPLIANT' : 'ACTION REQUIRED' }}
            </div>
          </div>
        </header>

        <div class="main-grid">
          <!-- ── APPLICATION PANEL ─────────────────────────── -->
          <section class="panel application-panel">
            <div class="panel-icon-wrap">
               <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                 <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>

            <h2 class="panel-title-lg">Initialize TCC Protocol</h2>
            <p class="panel-desc">
              Execute a statutory request for a Tax Compliance Certificate. 
              Our autonomous clearing engine will itemize all historical ledgers.
            </p>

            <button class="btn-primary-elite" (click)="apply()">
              BEGIN AUTHORIZATION FLOW
            </button>
          </section>

          <!-- ── CREDENTIALS PANEL ─────────────────────────── -->
          <section class="panel credentials-panel">
            <div class="panel-header-sm">
               <div class="icon-box">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
               </div>
               <span>Active Fiscal Credentials</span>
            </div>
            
            <div class="cert-list">
              @for (cert of certificates(); track cert.id) {
                <div class="cert-card">
                   <div class="cert-top">
                      <div>
                         <div class="cert-number">{{ cert.number }}</div>
                         <div class="cert-meta">
                           <span class="meta-dot"></span>
                           Issued • {{ cert.issuedDate | date:'dd MMM yyyy' | uppercase }}
                        </div>
                      </div>
                      <span class="cert-tag">VALID PROTOCOL</span>
                   </div>
                   <div class="cert-footer">
                      <span class="expiry-label">Statutory Expiry: <strong class="text-green">{{ cert.expiryDate | date:'dd MMM yyyy' | uppercase }}</strong></span>
                      <button class="btn-ghost-sm">
                        RETRIEVE ARCHIVE
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                      </button>
                   </div>
                </div>
              } @empty {
                <div class="empty-state">
                   <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.2">
                     <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                   </svg>
                   <p>Registry Null</p>
                </div>
              }
            </div>
          </section>
        </div>

        <!-- ── TELEMETRY SECTION ──────────────────────────── -->
        <section class="telemetry-section">
           <div class="section-divider">
              <span class="divider-line"></span>
              <h2 class="section-label">Statutory Compliance Telemetry</h2>
              <span class="divider-line"></span>
           </div>

           <div class="telemetry-grid">
              @for (item of checklist(); track item.label) {
                <div class="telemetry-card">
                   <div class="t-icon" [class.t-ok]="item.ok" [class.t-alert]="!item.ok">
                      @if (item.ok) {
                         <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7" /></svg>
                      } @else {
                         <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4" /></svg>
                      }
                   </div>
                   <div class="t-content">
                      <div class="t-label">{{ item.label }}</div>
                      <div class="t-status" [class.text-green]="item.ok" [class.text-red]="!item.ok">
                        {{ item.ok ? 'ARCHIVE VERIFIED' : 'ACTION REQUIRED' }}
                      </div>
                   </div>
                </div>
              }
           </div>
        </section>
        
        <!-- ── FOOTER ─────────────────────────────────────── -->
        <footer class="db-footer-elite">
           <p>OFFICIAL TAXPAYER COMPLIANCE HUB • AUTHORIZED BY KENYA REVENUE AUTHORITY • SYNCHRONIZED REAL-TIME</p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --red:          #D92B2B;
      --red-bright:   #EF3B3B;
      --red-glow:     rgba(217, 43, 43, 0.38);
      --red-pale:     rgba(217, 43, 43, 0.10);
      --red-border:   rgba(217, 43, 43, 0.22);

      --bg-root:      #0C0C0C;
      --bg-card:      #141414;
      --bg-card-2:    #1C1C1C;
      --bg-card-3:    #232323;

      --text-pri:     #F0F0F0;
      --text-sec:     #888888;
      --text-mut:     #4A4A4A;

      --bdr:          rgba(255, 255, 255, 0.08);
      --bdr-md:       rgba(255, 255, 255, 0.14);
      --srf-hover:    rgba(255, 255, 255, 0.04);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
      color-scheme: dark;
    }

    @media (prefers-color-scheme: light) {
      :host {
        --bg-root:    #F2F2F4;
        --bg-card:    #FFFFFF;
        --bg-card-2:  #F7F7F9;
        --bg-card-3:  #EDEDEF;

        --text-pri:   #111111;
        --text-sec:   #555560;
        --text-mut:   #9999A8;

        --bdr:        rgba(0, 0, 0, 0.08);
        --bdr-md:     rgba(0, 0, 0, 0.14);
        --srf-hover:  rgba(0, 0, 0, 0.03);

        color-scheme: light;
      }
    }

    .db-root {
      min-height: 100vh;
      background: var(--bg-root);
      color: var(--text-pri);
      position: relative;
      overflow-x: hidden;
    }

    .db-inner {
      position: relative; z-index: 1;
      max-width: 1440px; margin: 0 auto;
      padding: 40px 28px 80px;
      display: flex; flex-direction: column; gap: 40px;
    }

    /* ── HEADER ─────────────────────────────────────── */
    .db-header-elite {
      display: flex; justify-content: space-between; align-items: flex-end;
      gap: 24px; flex-wrap: wrap; margin-bottom: 12px;
    }

    .premium-title {
      font-size: clamp(32px, 5vw, 42px);
      font-weight: 950; letter-spacing: -1.5px;
      line-height: 1; margin: 12px 0 8px;
    }
    .text-red { color: var(--red); }

    .premium-subtitle {
      font-size: 14px; font-weight: 500; color: var(--text-sec);
    }

    .live-badge {
      display: flex; align-items: center; gap: 7px;
      padding: 5px 12px; border-radius: 50px;
      background: var(--red-pale); border: 1px solid var(--red-border);
      font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright);
    }

    .live-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--red); box-shadow: 0 0 5px var(--red);
      animation: dot-blink 1.5s ease-in-out infinite;
    }

    .status-chip {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 16px; border-radius: 50px;
      background: var(--bg-card-2); border: 1px solid var(--bdr);
      font-size: 11px; font-weight: 800; letter-spacing: 0.5px; color: var(--text-sec);
    }
    .status-chip .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--text-mut); }
    .chip-ok { border-color: rgba(16, 185, 129, 0.2); background: rgba(16, 185, 129, 0.05); color: #34d399; }
    .chip-ok .dot { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }

    /* ── MAIN GRID ──────────────────────────────────── */
    .main-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
    }

    .panel {
      background: var(--bg-card); border: 1px solid var(--bdr);
      border-radius: 24px; padding: 40px;
      position: relative; overflow: hidden;
      display: flex; flex-direction: column;
    }

    .application-panel { align-items: center; text-align: center; justify-content: center; }

    .panel-icon-wrap {
      width: 80px; height: 80px; border-radius: 22px;
      background: var(--bg-card-2); border: 1px solid var(--bdr);
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 24px; color: var(--red-bright);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }

    .panel-title-lg {
      font-size: 24px; font-weight: 900; letter-spacing: -0.5px;
      color: var(--text-pri); margin-bottom: 12px; text-transform: uppercase;
    }

    .panel-desc {
      font-size: 13px; color: var(--text-sec); font-weight: 500;
      max-width: 320px; line-height: 1.6; margin-bottom: 32px;
    }

    .btn-primary-elite {
      width: 100%; max-width: 320px;
      background: var(--red); color: #fff;
      border: none; border-radius: 16px;
      padding: 18px 24px; font-size: 13px; font-weight: 800;
      letter-spacing: 2px; cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 20px var(--red-glow);
    }
    .btn-primary-elite:hover { background: var(--red-bright); transform: translateY(-2px); box-shadow: 0 12px 30px var(--red-glow); }

    /* ── CREDENTIALS ────────────────────────────────── */
    .panel-header-sm {
      display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
      font-size: 11px; font-weight: 850; letter-spacing: 2px;
      text-transform: uppercase; color: var(--text-mut);
    }
    .icon-box {
      width: 32px; height: 32px; border-radius: 9px;
      background: var(--red-pale); color: var(--red-bright);
      display: flex; align-items: center; justify-content: center;
      border: 1px solid var(--red-border);
    }

    .cert-list { display: flex; flex-direction: column; gap: 16px; }

    .cert-card {
      background: var(--bg-card-2); border: 1px solid var(--bdr);
      border-radius: 20px; padding: 24px;
      transition: all 0.2s;
    }
    .cert-card:hover { border-color: var(--bdr-md); transform: scale(1.01); }

    .cert-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .cert-number { font-size: 16px; font-weight: 800; color: var(--text-pri); letter-spacing: 1px; font-family: 'IBM Plex Mono', monospace; }
    
    .cert-meta {
      display: flex; align-items: center; gap: 8px; margin-top: 6px;
      font-size: 10px; font-weight: 700; color: var(--text-mut);
      text-transform: uppercase; letter-spacing: 1px;
    }
    .meta-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--red); }

    .cert-tag {
      font-size: 9px; font-weight: 900; letter-spacing: 1px; padding: 4px 10px;
      background: var(--red-pale); color: var(--red-bright); border-radius: 6px;
    }

    .cert-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding-top: 16px; border-top: 1px solid var(--bdr);
    }
    .expiry-label { font-size: 10px; font-weight: 700; color: var(--text-mut); text-transform: uppercase; }
    .text-green { color: #10b981; }

    .btn-ghost-sm {
      background: none; border: none; font-size: 10px; font-weight: 800;
      color: var(--red-bright); display: flex; align-items: center; gap: 8px;
      cursor: pointer; letter-spacing: 1.5px;
    }
    .btn-ghost-sm:hover { color: var(--text-pri); }

    /* ── TELEMETRY ──────────────────────────────────── */
    .section-divider {
      display: flex; align-items: center; gap: 20px; margin-bottom: 32px;
    }
    .divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--bdr), transparent); }
    .section-label { font-size: 10px; font-weight: 800; letter-spacing: 3px; color: var(--text-mut); text-transform: uppercase; }

    .telemetry-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
    }

    .telemetry-card {
      background: var(--bg-card); border: 1px solid var(--bdr);
      border-radius: 20px; padding: 24px;
      display: flex; align-items: center; gap: 20px;
      transition: all 0.2s;
    }
    .telemetry-card:hover { transform: translateY(-2px); border-color: var(--bdr-md); }

    .t-icon {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .t-ok    { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .t-alert { background: var(--red-pale); color: var(--red-bright); border: 1px solid var(--red-border); }

    .t-content { display: flex; flex-direction: column; gap: 2px; }
    .t-label { font-size: 11px; font-weight: 800; color: var(--text-pri); text-transform: uppercase; letter-spacing: 0.5px; }
    .t-status { font-size: 9px; font-weight: 900; letter-spacing: 1px; }

    /* ── FOOTER ─────────────────────────────────────── */
    .db-footer-elite {
      margin-top: 40px; padding: 40px;
      background: var(--bg-card-2); border: 1px solid var(--bdr);
      border-radius: 32px; text-align: center;
    }
    .db-footer-elite p {
      font-size: 10px; font-weight: 800; color: var(--text-mut);
      letter-spacing: 4px; line-height: 1.8; max-width: 800px; margin: 0 auto;
    }

    /* ── ANIMATIONS ──────────────────────────────────── */
    .animate-stagger > * {
      opacity: 0;
      animation: slide-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
    .animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
    .animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }

    @keyframes slide-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes dot-blink { 0%,100%{opacity:1} 50%{opacity:0.25} }

    /* ── RESPONSIVE ──────────────────────────────────── */
    @media (max-width: 1100px) { .main-grid { grid-template-columns: 1fr; } }
    @media (max-width: 900px)  { .telemetry-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px)  {
      .db-inner { padding: 24px 16px 60px; gap: 24px; }
      .main-grid { gap: 16px; }
      .telemetry-grid { gap: 12px; }
      .panel { padding: 32px 24px; }
      .cert-card { padding: 20px; }
    }
  `]
})
export class TccApplicationComponent {
  router = inject(Router);

  certificates = signal([
    {
      id: 1,
      number: 'KRA/TCC/2025/1102983',
      issuedDate: '2025-06-12',
      expiryDate: '2026-06-11'
    }
  ]);

  checklist = signal([
    { label: 'Return Filing', ok: true },
    { label: 'Payment Status', ok: true },
    { label: 'PIN Data Update', ok: true },
    { label: 'Tax Obligations', ok: true }
  ]);

  isCompliant = computed(() => this.checklist().every(i => i.ok));

  apply() {
    console.log('Initializing TCC Protocol...');
  }
}
