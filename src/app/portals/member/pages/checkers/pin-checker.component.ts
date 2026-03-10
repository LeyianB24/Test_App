import { inject, Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface PinDetails {
  pin: string;
  taxpayerName: string;
  pinStatus: string;
  iTaxStatus: string;
  obligations: { name: string; status: string }[];
}

@Component({
  selector: 'app-pin-checker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner">
        <header class="premium-header">
          <div class="header-main">
            <div class="header-tag">
              <span class="tag-glow"></span>
              <span class="tag-text">Unified PIN Authentication Protocol</span>
            </div>
            <h1 class="premium-title">Registry <span class="red-gradient">Intelligence</span></h1>
            <p class="premium-subtitle">Authorized gateway for taxpayer identity verification and real-time compliance monitoring</p>
          </div>
        </header>

        <div class="auth-console mx-auto max-w-3xl">
          <!-- Scanner Search -->
          <div class="elite-card scanner-box group">
             <div class="scanner-line" *ngIf="isLoading()"></div>
             <div class="scanner-content">
                <div class="scanner-header">
                   <svg class="scanner-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                   <span class="scanner-label">TARGET IDENTITY REGISTRY</span>
                </div>
                
                <div class="input-action-row">
                   <div class="input-wrap">
                      <input 
                         type="text" 
                         [(ngModel)]="pin" 
                         class="pin-input" 
                         placeholder="A001234567X"
                         maxlength="11"
                      />
                      <div class="input-focus-glow"></div>
                   </div>
                   <button 
                      class="btn-execute" 
                      [disabled]="!pin() || isLoading()" 
                      (click)="checkPin()"
                   >
                      <span class="btn-text" *ngIf="!isLoading()">EXECUTE VALIDATION</span>
                      <div class="btn-loader" *ngIf="isLoading()">
                         <div class="pulse-ring"></div>
                         <span>VALIDATING...</span>
                      </div>
                   </button>
                </div>
                <p class="helper-text">ENTER TAXPAYER PIN FOR MULTI-VECTOR IDENTITY VERIFICATION.</p>
             </div>
          </div>

          <!-- Error Feedback -->
          <div class="error-strip" *ngIf="error()">
             <div class="error-icon">!</div>
             <span class="error-msg">{{ error() }}</span>
          </div>

          <!-- Dossier Result -->
          <div class="dossier-result" *ngIf="result()">
             <div class="elite-card result-card">
                <div class="result-header">
                   <div class="identity-badge">
                      <span class="id-ref">{{ result()?.pin }}</span>
                      <h2 class="taxpayer-name">{{ result()?.taxpayerName }}</h2>
                   </div>
                   <div class="status-box">
                      <span class="status-pill-elite" [class.active]="result()?.pinStatus === 'Active'">
                         <span class="dot"></span>
                         {{ result()?.pinStatus }}
                      </span>
                   </div>
                </div>

                <div class="kpi-grid">
                   <div class="kpi-card">
                      <span class="kpi-label">ELECTRONIC STATUS</span>
                      <span class="kpi-value">{{ result()?.iTaxStatus }}</span>
                   </div>
                   <div class="kpi-card">
                      <span class="kpi-label">VALIDATION MODE</span>
                      <span class="kpi-value">REAL-TIME GRID</span>
                   </div>
                </div>

                <div class="obligations-section">
                   <h3 class="section-title">
                      <span class="line"></span>
                      TAX OBLIGATION REGISTRY
                   </h3>
                   
                   <div class="ob-stack">
                      @for (ob of result()?.obligations; track ob.name) {
                         <div class="ob-row group">
                            <div class="ob-info">
                               <div class="ob-icon-box">
                                  <svg class="ob-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                               </div>
                               <span class="ob-name">{{ ob.name }}</span>
                            </div>
                            <span class="ob-status" [class.active]="ob.status === 'Active'">{{ ob.status }}</span>
                         </div>
                      }
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      --red: #D92B2B;
      --red-bright: #EF3B3B;
      --red-glow: rgba(217, 43, 43, 0.4);
      --red-pale: rgba(217, 43, 43, 0.1);
      --red-border: rgba(217, 43, 43, 0.2);
      --bg-root: #080809;
      --bg-card: rgba(18, 18, 20, 0.6);
      --bdr: rgba(255, 255, 255, 0.05);
      --text-muted: #666670;
      
      --emerald: #10b981;
      --emerald-pale: rgba(16, 185, 129, 0.1);
    }

    .db-root {
      min-height: 100vh;
      background: var(--bg-root);
      position: relative;
      overflow-x: hidden;
      color: #fff;
    }

    .noise-overlay {
      position: fixed; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3");
      opacity: 0.03;
      z-index: 1;
    }

    .accent-bleed {
      position: fixed; top: -10%; right: -5%;
      width: 60%; height: 50%;
      background: radial-gradient(circle at center, var(--red-pale) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
    }

    .db-inner {
      position: relative; z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    .premium-header { margin-bottom: 56px; text-align: center; }
    .header-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px; background: var(--red-pale);
      border: 1px solid var(--red-border); border-radius: 100px;
      margin-bottom: 16px;
    }
    .tag-glow { width: 6px; height: 6px; background: var(--red); border-radius: 50%; box-shadow: 0 0 10px var(--red); }
    .tag-text { font-size: 10px; font-weight: 950; color: var(--red-bright); letter-spacing: 2px; text-transform: uppercase; }

    .premium-title { font-size: 48px; font-weight: 950; letter-spacing: -2px; line-height: 1; margin: 0; }
    .red-gradient { background: linear-gradient(to right, #fff, var(--red-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .premium-subtitle { color: var(--text-muted); font-size: 14px; font-weight: 500; margin: 12px 0 0; letter-spacing: 0.5px; }

    /* Scanner Box */
    .scanner-box { 
       padding: 40px; background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 32px;
       position: relative; overflow: hidden; backdrop-filter: blur(24px);
    }
    .scanner-line {
       position: absolute; left: 0; right: 0; top: 0; height: 2px;
       background: linear-gradient(to right, transparent, var(--red-bright), transparent);
       box-shadow: 0 0 15px var(--red);
       animation: scan 2s infinite linear;
       z-index: 20;
    }
    @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }

    .scanner-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .scanner-icon { width: 20px; height: 20px; color: var(--red-bright); }
    .scanner-label { font-size: 11px; font-weight: 950; color: var(--text-muted); letter-spacing: 2.5px; }

    .input-action-row { display: flex; gap: 16px; margin-bottom: 20px; }
    .input-wrap { flex-grow: 1; position: relative; }
    .pin-input {
       width: 100%; height: 72px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr);
       border-radius: 20px; padding: 0 32px; color: #fff; font-size: 24px; font-weight: 950;
       letter-spacing: 12px; outline: none; transition: all 0.3s;
    }
    .pin-input:focus { border-color: var(--red-border); background: rgba(217, 43, 43, 0.05); }
    .input-focus-glow { position: absolute; inset: 0; background: var(--red-glow); filter: blur(20px); opacity: 0; transition: opacity 0.3s; border-radius: inherit; pointer-events: none; }
    .pin-input:focus + .input-focus-glow { opacity: 0.05; }

    .btn-execute {
       padding: 0 40px; background: var(--red); color: #fff; border: none; border-radius: 20px;
       font-size: 11px; font-weight: 950; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s;
       box-shadow: 0 12px 24px var(--red-glow); display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .btn-execute:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 32px var(--red-glow); }
    .btn-execute:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-loader { display: flex; align-items: center; gap: 12px; }
    .pulse-ring { width: 12px; height: 12px; border: 2px solid #fff; border-radius: 50%; border-right-color: transparent; animation: spin 0.8s infinite linear; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    .helper-text { font-size: 10px; font-weight: 900; color: var(--text-muted); letter-spacing: 1px; }

    /* Error Strip */
    .error-strip {
       margin-top: 24px; padding: 20px 32px; background: rgba(239, 68, 68, 0.1);
       border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 20px;
       display: flex; align-items: center; gap: 16px; color: #ef4444;
    }
    .error-icon { width: 24px; height: 24px; background: #ef4444; color: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 950; }
    .error-msg { font-size: 11px; font-weight: 950; letter-spacing: 1px; text-transform: uppercase; }

    /* Dossier Result */
    .dossier-result { margin-top: 40px; animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .result-card { padding: 48px; background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 40px; backdrop-filter: blur(24px); }
    
    .result-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .id-ref { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 950; color: var(--red-bright); letter-spacing: 3px; margin-bottom: 8px; block; }
    .taxpayer-name { font-size: 32px; font-weight: 950; margin: 0; color: #fff; tracking: -1px; }

    /* kpi grid */
    .kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }
    .kpi-card { padding: 24px; background: rgba(255,255,255,0.03); border: 1px solid var(--bdr); border-radius: 20px; }
    .kpi-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; display: block; margin-bottom: 8px; }
    .kpi-value { font-size: 14px; font-weight: 950; color: #fff; letter-spacing: 1px; }

    /* Obligations */
    .section-title { font-size: 11px; font-weight: 950; color: var(--text-muted); letter-spacing: 3px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; }
    .section-title .line { flex-grow: 1; height: 1px; background: var(--bdr); }

    .ob-stack { display: flex; flex-direction: column; gap: 12px; }
    .ob-row {
       padding: 24px 32px; background: rgba(255,255,255,0.02); border: 1px solid var(--bdr);
       border-radius: 20px; display: flex; justify-content: space-between; align-items: center;
       transition: all 0.3s;
    }
    .ob-row:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
    .ob-info { display: flex; align-items: center; gap: 20px; }
    .ob-icon-box { width: 44px; height: 44px; background: #000; border-radius: 12px; border: 1px solid var(--bdr); display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.3s; }
    .ob-row:hover .ob-icon-box { color: var(--red-bright); border-color: var(--red-border); background: var(--red-pale); }
    .ob-icon { width: 20px; height: 20px; }
    .ob-name { font-size: 13px; font-weight: 900; color: #fff; letter-spacing: -0.2px; }

    .ob-status { font-size: 9px; font-weight: 950; color: var(--text-muted); background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 8px; letter-spacing: 1px; }
    .ob-status.active { color: var(--emerald); background: var(--emerald-pale); border: 1px solid rgba(16, 185, 129, 0.2); }

    .status-pill-elite { 
       display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px;
       background: rgba(0,0,0,0.4); border: 1px solid var(--bdr); border-radius: 100px;
       font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 1px;
    }
    .status-pill-elite.active { color: var(--emerald); border-color: rgba(16, 185, 129, 0.3); box-shadow: 0 4px 12px var(--emerald-pale); }
    .status-pill-elite .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }

    @media (max-width: 640px) {
       .input-action-row { flex-direction: column; }
       .btn-execute { height: 72px; }
       .kpi-grid { grid-template-columns: 1fr; }
       .result-header { flex-direction: column; gap: 24px; }
       .taxpayer-name { font-size: 24px; }
    }
  `],
})
export class PinCheckerComponent {
  private http = inject(HttpClient);
  
  pin = signal('');
  isLoading = signal(false);
  result = signal<PinDetails | null>(null);
  error = signal('');

  checkPin() {
    if (this.pin().length < 11) {
      this.error.set('AUTHENTICATION FAILED: PIN must be exactly 11 characters.');
      return;
    }

    this.isLoading.set(true);
    this.error.set('');
    this.result.set(null);

    // Simulated API latency for elite feel
    setTimeout(() => {
      this.isLoading.set(false);
      this.result.set({
        pin: this.pin().toUpperCase(),
        taxpayerName: 'DOE JOHN ANTHONY',
        pinStatus: 'Active',
        iTaxStatus: 'Registered',
        obligations: [
          { name: 'Income Tax - Resident Individual', status: 'Active' },
          { name: 'Value Added Tax (VAT)', status: 'Active' },
          { name: 'Pay As You Earn (PAYE)', status: 'Inactive' }
        ]
      });
    }, 1200);
  }
}
