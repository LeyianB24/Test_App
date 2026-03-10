import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DeclarationItem {
  id: string;
  description: string;
  quantity: number;
  valueUsd: number;
  category: string;
}

@Component({
  selector: 'app-custom-declaration',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner">
        <header class="premium-header">
          <div class="header-main">
            <div class="header-tag">
              <span class="tag-glow"></span>
              <span class="tag-text">Federal Customs Interface Protocol</span>
            </div>
            <h1 class="premium-title">Customs <span class="red-gradient">Discovery</span></h1>
            <p class="premium-subtitle">Authorized self-declaration protocol for statutory asset entry and duty liability assessment</p>
          </div>
          
          <div class="header-stats">
             <div class="stat-pill">
                <span class="label">FISCAL REFERENCE</span>
                <span class="value">{{ refNumber }}</span>
             </div>
          </div>
        </header>

        <div class="declaration-manifold max-w-5xl mx-auto">
          <!-- Multi-Phase Navigator -->
          <nav class="phase-navigator">
            <div class="nav-track"></div>
            @for (step of steps; track step; let i = $index) {
              <div class="phase-node" 
                [class.active]="currentStep() === i"
                [class.completed]="currentStep() > i"
              >
                <div class="node-circle">
                  @if (currentStep() > i) {
                    <svg class="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7"/></svg>
                  } @else {
                    <span class="step-num">{{ i + 1 }}</span>
                  }
                </div>
                <span class="step-label">{{ step }}</span>
              </div>
            }
          </nav>

          <div class="manifold-surface">
            <!-- Phase 1: Identity -->
            <div class="phase-content animate-up" *ngIf="currentStep() === 0">
              <div class="p-10 lg:p-14">
                <div class="input-grid">
                  <div class="input-field">
                    <label>LEGAL IDENTITY (TAXPAYER NAME)</label>
                    <input type="text" [(ngModel)]="traveler.name" placeholder="e.g. ADRIAN VANCE">
                  </div>
                  <div class="input-field">
                    <label>STATUTORY PASSPORT REF</label>
                    <input type="text" [(ngModel)]="traveler.passport" placeholder="AK8829102">
                  </div>
                  <div class="input-field">
                    <label>ARRIVAL TERMINAL PROTOCOL</label>
                    <input type="text" [(ngModel)]="traveler.flight" placeholder="e.g. KQ102 HEATHROW">
                  </div>
                  <div class="input-field">
                    <label>PRIMARY RESIDENCE ARCHIVE</label>
                    <input type="text" [(ngModel)]="traveler.origin" placeholder="COUNTRY OF ORIGIN">
                  </div>
                </div>
              </div>
            </div>

            <!-- Phase 2: Asset Inventory -->
            <div class="phase-content animate-up" *ngIf="currentStep() === 1">
              <div class="p-10 lg:p-14">
                <div class="section-header">
                  <div class="header-text">
                    <h3 class="section-title">AUTHORIZED ASSET REGISTRY</h3>
                    <p class="section-sub">Enumerate all liquidated assets exceeding duty-free statutory thresholds</p>
                  </div>
                  <button (click)="addItem()" class="btn-ghost-elite">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M12 4v16m8-8H4"/></svg>
                    INSERT PROTOCOL
                  </button>
                </div>

                <div class="item-stack">
                  @for (item of items(); track item.id; let i = $index) {
                    <div class="item-row group">
                      <div class="row-fields">
                        <div class="field-box lg:col-span-6">
                           <label>ARCHIVE DESCRIPTOR</label>
                           <input type="text" [(ngModel)]="item.description" placeholder="e.g. DIGITAL CINEMA RED V-RAPTOR">
                        </div>
                        <div class="field-box lg:col-span-3">
                           <label>ASSET CLASSIFICATION</label>
                           <select [(ngModel)]="item.category">
                              <option value="Electronics">ELECTRONICS</option>
                              <option value="Jewelry">JEWELRY / LUXURY</option>
                              <option value="Commercial">COMMERCIAL SAMPLES</option>
                              <option value="Personal">PERSONAL EFFECTS</option>
                           </select>
                        </div>
                        <div class="field-box lg:col-span-2">
                           <label>APPRAISAL (USD)</label>
                           <div class="currency-input">
                              <span class="curr">USD</span>
                              <input type="number" [(ngModel)]="item.valueUsd" placeholder="0.00">
                           </div>
                        </div>
                        <div class="field-action lg:col-span-1">
                           <button (click)="removeItem(i)" class="btn-remove">
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
                           </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <div class="summary-box">
                   <div class="summary-glow"></div>
                   <div class="total-metric">
                      <div class="metric-icon">
                         <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7" /></svg>
                      </div>
                      <div class="metric-info">
                         <span class="m-label">AGGREGATE INVENTORY APPRAISAL</span>
                         <span class="m-value"><span class="m-curr">USD</span>{{ totalValue().toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
                      </div>
                   </div>
                   <div class="duty-metric">
                      <span class="m-label">ESTIMATED DUTY LIABILITY</span>
                      <span class="m-value duty"><span class="m-curr">USD</span>{{ (totalValue() * 0.25).toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
                   </div>
                </div>
              </div>
            </div>

            <!-- Phase 3: Attestation -->
            <div class="phase-content animate-up" *ngIf="currentStep() === 2">
              <div class="p-10 lg:p-14">
                @if (!isSubmitted()) {
                  <div class="attestation-view">
                     <div class="auth-seal">
                        <div class="seal-glow"></div>
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="3.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                     </div>
                     <h3 class="auth-title">STATUTORY AUTHORIZATION</h3>
                     <p class="auth-desc">By executing this digital transmission, you authenticate under statutory penalty (Customs Act) that all items and valuations itemized in this protocol are true.</p>
                     
                     <label class="agreement-check">
                        <input type="checkbox" [(ngModel)]="agreed" class="sr-only">
                        <div class="check-box" [class.checked]="agreed()">
                           <svg *ngIf="agreed()" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <span class="check-text">I solemnly attest that the contents of this Form-88 Discovery Protocol are accurate.</span>
                     </label>
                  </div>
                } @else {
                  <div class="success-view">
                     <div class="success-seal">
                        <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="3.5" class="animate-draw"><path d="M5 13l4 4L19 7"/></svg>
                        <div class="seal-pulse"></div>
                     </div>
                     <h3 class="success-title">PROTOCOL AUTHORIZED</h3>
                     <p class="success-ref">REFERENCE ARCHIVE: <span class="ref-val">{{ refNumber }}</span></p>
                     
                     <div class="success-actions">
                        <button (click)="reset()" class="btn-ghost-elite">NEW DISCOVERY</button>
                        <button class="btn-primary-elite">DOWNLOAD CERTIFICATE</button>
                     </div>
                  </div>
                }
              </div>
            </div>

            <!-- Terminal Controls -->
            <div class="terminal-controls" *ngIf="!isSubmitted()">
               <button (click)="prev()" [disabled]="currentStep() === 0" class="btn-prev">GO BACK</button>
               <button (click)="next()" [disabled]="!canProceed()" class="btn-next">
                  {{ currentStep() === 2 ? 'AUTHORIZE DECLARATION' : 'NEXT PROTOCOL' }}
               </button>
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
      --violet: #8c52ff;
      --violet-pale: rgba(140, 82, 255, 0.1);
      --bg-root: #080809;
      --bg-surface: rgba(18, 18, 20, 0.6);
      --bdr: rgba(255, 255, 255, 0.05);
      --text-muted: #666670;
      
      --emerald: #10b981;
      --emerald-pale: rgba(16, 185, 129, 0.1);
    }

    .db-root { 
      min-height: 100vh; 
      background: #050505 url('assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      color: #fff; 
      position: relative; 
      overflow-x: hidden; 
      padding-bottom: 5rem;
    }
    
    .db-root::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.02; z-index: 2; pointer-events: none; }

    .db-inner { 
      position: relative; 
      z-index: 10; 
      max-width: 1400px; 
      margin: 0 auto; 
      padding: 40px 24px; 
    }

    .premium-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 56px; }
    .header-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px; background: var(--violet-pale);
      border: 1px solid rgba(140, 82, 255, 0.2); border-radius: 100px;
      margin-bottom: 16px;
    }
    .tag-glow { width: 6px; height: 6px; background: var(--violet); border-radius: 50%; box-shadow: 0 0 10px var(--violet); }
    .tag-text { font-size: 10px; font-weight: 950; color: #b794f4; letter-spacing: 2px; text-transform: uppercase; }

    .premium-title { font-size: 48px; font-weight: 950; letter-spacing: -2px; line-height: 1; margin: 0; }
    .red-gradient { background: linear-gradient(to right, #fff, var(--red-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .premium-subtitle { color: var(--text-muted); font-size: 14px; font-weight: 500; margin: 12px 0 0; letter-spacing: 0.5px; }

    .stat-pill { padding: 12px 24px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr); border-radius: 16px; text-align: right; }
    .stat-pill .label { display: block; font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; margin-bottom: 4px; }
    .stat-pill .value { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 900; color: #fff; letter-spacing: 2px; }

    /* Navigator */
    .phase-navigator {
       display: flex; justify-content: space-between; position: relative;
       max-width: 800px; margin: 0 auto 56px; padding: 0 40px;
    }
    .nav-track { position: absolute; top: 28px; left: 80px; right: 80px; height: 1px; background: var(--bdr); z-index: 1; }
    .phase-node { 
       display: flex; flex-direction: column; align-items: center; gap: 16px;
       position: relative; z-index: 2;
    }
    .node-circle {
       width: 56px; height: 56px; border-radius: 16px; background: #000;
       border: 1px solid var(--bdr); display: flex; align-items: center; justify-content: center;
       transition: all 0.5s;
    }
    .phase-node.active .node-circle { background: var(--red); border-color: var(--red); box-shadow: 0 8px 24px var(--red-glow); transform: scale(1.1); }
    .phase-node.completed .node-circle { background: var(--emerald); border-color: var(--emerald); color: #fff; }
    .step-num { font-size: 20px; font-weight: 950; color: var(--text-muted); }
    .phase-node.active .step-num { color: #fff; }
    .check-icon { width: 24px; height: 24px; }
    .step-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; transition: color 0.3s; }
    .phase-node.active .step-label { color: #fff; }

    /* Manifold */
    .manifold-surface { background: var(--bg-surface); border: 1px solid var(--bdr); border-radius: 48px; overflow: hidden; backdrop-filter: blur(24px); }
    
    .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .input-field { display: flex; flex-direction: column; gap: 12px; }
    .input-field label { font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 1.5px; margin-left: 8px; }
    .input-field input {
       height: 64px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr);
       border-radius: 20px; padding: 0 24px; color: #fff; font-size: 14px; font-weight: 950;
       text-transform: uppercase; letter-spacing: 1px; outline: none; transition: all 0.3s;
    }
    .input-field input:focus { border-color: var(--red-border); background: var(--red-pale); }

    /* Asset Registry */
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .section-title { font-size: 12px; font-weight: 950; color: #fff; letter-spacing: 2px; margin: 0; }
    .section-sub { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 1px; margin: 4px 0 0; text-transform: uppercase; }

    .btn-ghost-elite { 
       padding: 10px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--bdr); border-radius: 12px;
       font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 1.5px; cursor: pointer;
       transition: all 0.3s; display: flex; align-items: center; gap: 8px;
    }
    .btn-ghost-elite:hover { background: rgba(255,255,255,0.08); color: #fff; }

    .item-stack { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
    .item-row { padding: 32px; background: rgba(0,0,0,0.3); border: 1px solid var(--bdr); border-radius: 24px; transition: all 0.3s; }
    .item-row:hover { border-color: rgba(255,255,255,0.1); }
    .row-fields { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; }
    
    .field-box { display: flex; flex-direction: column; gap: 8px; }
    .field-box label { font-size: 8px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; }
    .field-box input, .field-box select { 
       height: 48px; background: #000; border: 1px solid var(--bdr); border-radius: 12px;
       padding: 0 16px; color: #fff; font-size: 12px; font-weight: 950; outline: none; transition: all 0.3s;
    }
    .field-box input:focus { border-color: var(--red-border); }
    
    .currency-input { position: relative; }
    .curr { position: absolute; left: 16px; top: 50%; translate: 0 -50%; font-size: 10px; font-weight: 950; color: var(--text-muted); }
    .currency-input input { padding-left: 52px; color: var(--emerald); }

    .btn-remove { 
       width: 44px; height: 44px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1);
       border-radius: 12px; color: #ef4444; cursor: pointer; transition: all 0.3s; margin-top: auto;
    }
    .btn-remove:hover { background: #ef4444; color: #fff; }

    .summary-box { 
       padding: 40px; background: var(--emerald-pale); border: 1px solid rgba(16, 185, 129, 0.2);
       border-radius: 32px; position: relative; overflow: hidden; display: flex; justify-content: space-between; align-items: center;
    }
    .summary-glow { position: absolute; right: -50px; bottom: -50px; width: 150px; height: 150px; background: radial-gradient(circle, var(--emerald) 0%, transparent 70%); opacity: 0.1; }
    
    .total-metric { display: flex; gap: 24px; align-items: center; }
    .metric-icon { width: 56px; height: 56px; background: #000; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--emerald); }
    .m-label { font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2.5px; display: block; margin-bottom: 8px; }
    .m-value { font-size: 32px; font-weight: 950; color: #fff; tracking: -1px; }
    .m-curr { font-size: 12px; color: var(--text-muted); margin-right: 8px; }
    .status.duty { color: var(--emerald); }

    /* Attestation */
    .attestation-view { text-align: center; padding: 40px 0; }
    .auth-seal { 
       width: 80px; height: 80px; background: var(--red); border-radius: 28px;
       margin: 0 auto 32px; display: flex; align-items: center; justify-content: center;
       position: relative; box-shadow: 0 16px 32px var(--red-glow);
    }
    .seal-glow { position: absolute; inset: -10px; background: var(--red); filter: blur(20px); opacity: 0.3; border-radius: inherit; }
    
    .auth-title { font-size: 32px; font-weight: 950; margin: 0 0 16px; letter-spacing: -1px; }
    .auth-desc { font-size: 11px; font-weight: 600; color: #aaa; max-width: 500px; margin: 0 auto 48px; line-height: 1.6; text-transform: uppercase; letter-spacing: 0.5px; }

    .agreement-check {
       display: flex; align-items: center; gap: 20px; padding: 32px;
       background: rgba(255,255,255,0.02); border: 1px solid var(--bdr); border-radius: 32px;
       cursor: pointer; transition: all 0.3s; max-width: 600px; margin: 0 auto; text-align: left;
    }
    .agreement-check:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
    .check-box { width: 32px; height: 32px; border: 2px solid var(--bdr); border-radius: 10px; flex-shrink: 0; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
    .check-box.checked { background: var(--red); border-color: var(--red); }
    .check-text { font-size: 11px; font-weight: 900; color: var(--text-muted); letter-spacing: 0.5px; line-height: 1.5; text-transform: uppercase; }
    .agreement-check:hover .check-text { color: #fff; }

    /* Success */
    .success-view { text-align: center; padding: 64px 0; }
    .success-seal { 
       width: 100px; height: 100px; background: var(--emerald); border-radius: 32px;
       margin: 0 auto 40px; display: flex; align-items: center; justify-content: center;
       position: relative; box-shadow: 0 24px 48px var(--emerald-pale);
    }
    .seal-pulse { position: absolute; inset: -15px; border: 2px solid var(--emerald); border-radius: inherit; animation: sealPulse 2s infinite; opacity: 0; }
    @keyframes sealPulse { 0% { scale: 0.8; opacity: 0.5; } 100% { scale: 1.2; opacity: 0; } }

    .success-title { font-size: 40px; font-weight: 950; margin: 0 0 12px; letter-spacing: -1.5px; }
    .success-ref { font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 4px; }
    .ref-val { color: var(--emerald); }

    .success-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 480px; margin: 48px auto 0; }
    .btn-primary-elite {
       height: 60px; background: var(--red); color: #fff; border: none; border-radius: 18px;
       font-size: 11px; font-weight: 950; letter-spacing: 1.5px; cursor: pointer; transition: all 0.3s;
       box-shadow: 0 12px 24px var(--red-glow);
    }
    .btn-primary-elite:hover { transform: translateY(-2px); box-shadow: 0 16px 32px var(--red-glow); }

    /* Terminal Controls */
    .terminal-controls { padding: 32px 40px; background: rgba(0,0,0,0.3); border-top: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: center; }
    .btn-prev { background: none; border: none; font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px; cursor: pointer; }
    .btn-prev:hover:not(:disabled) { color: #fff; }
    .btn-prev:disabled { opacity: 0.2; cursor: not-allowed; }
    
    .btn-next {
       height: 60px; padding: 0 48px; background: var(--red); color: #fff; border: none; border-radius: 18px;
       font-size: 11px; font-weight: 950; letter-spacing: 2px; cursor: pointer; transition: all 0.4s;
       box-shadow: 0 12px 24px var(--red-glow);
    }
    .btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 32px var(--red-glow); }
    .btn-next:disabled { background: var(--bg-card); color: var(--text-muted); box-shadow: none; cursor: not-allowed; border: 1px solid var(--bdr); }

    .animate-up { animation: up 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
    @keyframes up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-draw { stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw 0.8s forwards 0.4s; }
    @keyframes draw { to { stroke-dashoffset: 0; } }

    @media (max-width: 768px) {
       .premium-header { flex-direction: column; align-items: flex-start; gap: 32px; }
       .phase-navigator { padding: 0; }
       .step-label { display: none; }
       .input-grid { grid-template-columns: 1fr; }
       .row-fields { grid-template-columns: 1fr; }
       .summary-box { flex-direction: column; gap: 32px; text-align: center; }
       .total-metric { flex-direction: column; }
       .success-actions { grid-template-columns: 1fr; }
    }
  `],
})
export class CustomDeclarationComponent {
  steps = ['IDENTIFICATION', 'ASSET REGISTRY', 'ATTESTATION'];
  currentStep = signal(0);
  isSubmitted = signal(false);
  refNumber = `KRA-CUST-${Math.floor(1000000 + Math.random() * 9000000)}`;

  traveler = {
    name: '',
    passport: '',
    flight: '',
    origin: ''
  };

  items = signal<DeclarationItem[]>([
    { id: '1', description: '', quantity: 1, valueUsd: 0, category: 'Electronics' }
  ]);

  agreed = signal(false);

  totalValue = computed(() => {
    return this.items().reduce((acc: number, item) => acc + (item.valueUsd || 0), 0);
  });

  addItem() {
    this.items.update(prev => [
      ...prev, 
      { id: Date.now().toString(), description: '', quantity: 1, valueUsd: 0, category: 'Electronics' }
    ]);
  }

  removeItem(index: number) {
    this.items.update(prev => prev.filter((_, i) => i !== index));
    if (this.items().length === 0) this.addItem();
  }

  canProceed = computed(() => {
    const s = this.currentStep();
    if (s === 0) return this.traveler.name.length > 3 && this.traveler.passport.length > 5;
    if (s === 1) return this.items().some(i => i.description.length > 2 && i.valueUsd > 0);
    if (s === 2) return this.agreed();
    return true;
  });

  next() {
    if (this.currentStep() === 2) {
      this.isSubmitted.set(true);
    } else {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  prev() {
    if (this.currentStep() > 0) this.currentStep.set(this.currentStep() - 1);
  }

  reset() {
    this.currentStep.set(0);
    this.isSubmitted.set(false);
    this.traveler = { name: '', passport: '', flight: '', origin: '' };
    this.items.set([{ id: '1', description: '', quantity: 1, valueUsd: 0, category: 'Electronics' }]);
    this.agreed.set(false);
    this.refNumber = `KRA-CUST-${Math.floor(1000000 + Math.random() * 9000000)}`;
  }
}
