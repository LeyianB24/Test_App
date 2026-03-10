import { Component, inject, computed, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReturnsService } from '../../../services/returns.service';
import { environment } from '../../../../environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-returns',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner">
        <!-- Elite Header -->
        <header class="db-header-elite animate-fade-in">
          <div class="header-left">
            <div class="live-badge">
              <div class="live-dot"></div>
              COMPLIANCE REGISTRY
            </div>
            <h1 class="premium-title">Submission <span class="text-red">Archive</span></h1>
            <p class="premium-subtitle">Authorized fiscal gateway for statutory returns and compliance monitoring</p>
          </div>
          
          <div class="header-right">
            <button class="btn-primary-elite" (click)="showFileDialog.set(true)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              NEW FILING
            </button>
          </div>
        </header>

        <!-- HD Metrics Grid -->
        <div class="main-grid animate-fade-in" style="animation-delay: 0.1s">
          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">TOTAL SUBMISSIONS</span>
              <div class="metric-value">{{ allReturns().length }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">VERIFIED FILINGS</span>
              <div class="metric-value">{{ submittedReturns().length }}</div>
            </div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-glow"></div>
            <div class="card-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">PENDING REVIEWS</span>
              <div class="metric-value">{{ pendingReturns().length }}</div>
            </div>
          </div>
        </div>

        <!-- Registry Table Section -->
        <div class="elite-card table-panel animate-fade-in" style="animation-delay: 0.2s">
          <div class="card-glow"></div>
          <div class="panel-header-elite">
            <div class="header-left-stack">
              <h2 class="panel-title">Compliance <span class="text-red">Records</span></h2>
              <p class="panel-desc">Statutory record sequence for active obligations</p>
            </div>
            <div class="search-box-elite">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Trace filings..." [(ngModel)]="searchQuery" (input)="onSearch()">
            </div>
          </div>

          <div class="registry-list">
            @for (r of filteredReturns(); track r.id) {
              <div class="registry-item animate-fade-in" [class]="r.status">
                <div class="ri-left">
                  <div class="ri-type">{{ r.type }}</div>
                  <div class="ri-period">{{ r.period }}</div>
                </div>
                <div class="ri-center">
                  <div class="ri-label">TRANSMISSION DATE</div>
                  <div class="ri-date">{{ r.dateSubmitted || 'NOT TRANSMITTED' }}</div>
                </div>
                <div class="ri-right">
                  <span class="status-badge" [class]="r.status === 'submitted' ? 'success' : 'alert'">
                    {{ r.status }}
                  </span>
                  <button class="icon-btn-elite" (click)="downloadAcknowledgement(r.id.toString())" title="Download Acknowledgement">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </button>
                </div>
              </div>
            } @empty {
              <div class="empty-state-elite">
                <div class="empty-icon">
                  <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <p>Registry Clear. No matching records traced.</p>
              </div>
            }
          </div>
        </div>

        <!-- Statutory Footer -->
        <footer class="db-footer-elite animate-fade-in" style="animation-delay: 0.3s">
           <p>STATUTORY IDENTIFICATION ARCHIVE. AUTHORIZED ACCESS ONLY. THIS RECORD IS SYNCHRONIZED WITH THE CENTRAL TAXPAYER REGISTRY.</p>
        </footer>
      </div>

      <!-- Filing Modal -->
      @if (showFileDialog()) {
        <div class="modal-overlay-elite animate-fade-in">
          <div class="modal-box elite-card animate-scale-in">
            <div class="card-glow"></div>
            <div class="panel-header-elite">
              <div class="header-left-stack">
                <h3 class="panel-title">Secure Filing <span class="text-red">Sequence</span></h3>
                <p class="panel-desc">Configure return parameters for valid transmission</p>
              </div>
              <button class="close-btn" (click)="cancelFileDialog()">✕</button>
            </div>
            
            <div class="modal-body-elite">
              <div class="mpesa-form-elite">
                <div class="input-group-elite">
                  <label>REVENUE HEAD (OBLIGATION)</label>
                  <div class="select-wrap-elite">
                    <select [(ngModel)]="newReturn.type">
                      <option value="">Select an active obligation...</option>
                      <option value="Monthly VAT Return">Monthly VAT Return (Section A)</option>
                      <option value="Income Tax Return">Income Tax Return (Resident Individual)</option>
                      <option value="PAYE Return">PAYE Systematic Return</option>
                      <option value="Withholding Tax Return">Withholding Statutory Return</option>
                      <option value="Rental Income">Rental Income Tax (Residential)</option>
                    </select>
                  </div>
                </div>

                <div class="input-group-elite">
                  <label>FISCAL PERIOD (MONTH/YEAR)</label>
                  <input type="text" [(ngModel)]="newReturn.period" placeholder="e.g. November 2025">
                </div>

                <div class="info-alert-elite">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>Legal Compliance Check: Ensure all data is accurate before authorizing transmission.</span>
                </div>

                <div class="form-actions-elite">
                  <button class="btn-ghost-elite" (click)="cancelFileDialog()" style="flex: 1">DISCARD</button>
                  <button class="btn-primary-elite" (click)="fileReturn()" [disabled]="!newReturn.type || !newReturn.period" style="flex: 2">
                    AUTHORIZE SUBMISSION
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
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
      
      --text-pri:     #F0F0F0;
      --text-sec:     #888888;
      --text-mut:     #4A4A4A;

      --bdr:          rgba(255, 255, 255, 0.08);
      --bdr-md:       rgba(255, 255, 255, 0.14);

      --duration-base: 0.4s;
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    .db-root { min-height: 100vh; background: var(--bg-root); color: var(--text-pri); position: relative; overflow-x: hidden; }
    .noise-overlay { position: fixed; inset: 0; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAA6f7sBAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAD1JREFUeNoVjEkOACAIA53/f9qFA9S0mSBYhS6Yp7mXqR8B1Zp6InoSpOqJ6EnUInoStYieRC2iF9GLaE30JPojDPoA9WpU6YIAAAAASUVORK5CYII=') repeat; opacity: 0.03; pointer-events: none; z-index: 1; }
    .accent-bleed { position: fixed; top: -100px; right: -100px; width: 600px; height: 600px; background: radial-gradient(circle, var(--red-pale) 0%, transparent 70%); filter: blur(60px); pointer-events: none; z-index: 2; }
    .db-inner { max-width: 1400px; margin: 0 auto; padding: 40px 28px 80px; position: relative; z-index: 10; display: flex; flex-direction: column; gap: 40px; }

    /* Header */
    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
    .premium-title { font-size: clamp(32px, 5vw, 48px); font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--red); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); max-width: 500px; }
    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s infinite; }

    /* Cards & Grid */
    .main-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 32px; position: relative; overflow: hidden; }
    .card-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at top right, var(--red-pale), transparent 40%); pointer-events: none; opacity: 0.6; }

    .metric-card { padding: 32px; display: flex; align-items: center; gap: 24px; transition: transform 0.3s; }
    .metric-card:hover { transform: translateY(-4px); }
    .card-icon { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--red); }
    .metric-label { font-size: 10px; font-weight: 800; color: var(--text-sec); letter-spacing: 1.5px; }
    .metric-value { font-size: 32px; font-weight: 950; color: var(--text-pri); }

    /* Table/Registry Panel */
    .table-panel { padding: 0; }
    .panel-header-elite { padding: 32px; display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; border-bottom: 1px solid var(--bdr); }
    .panel-title { font-size: 20px; font-weight: 900; margin: 0; }
    .panel-desc { font-size: 12px; color: var(--text-sec); margin-top: 4px; }
    
    .search-box-elite { position: relative; width: 100%; max-width: 320px; }
    .search-box-elite svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-mut); pointer-events: none; }
    .search-box-elite input { width: 100%; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 16px; padding: 12px 16px 12px 48px; color: var(--text-pri); font-size: 14px; outline: none; transition: all 0.2s; }
    .search-box-elite input:focus { border-color: var(--red); box-shadow: 0 0 0 4px var(--red-pale); background: var(--bg-card); }

    .registry-list { display: flex; flex-direction: column; }
    .registry-item { display: grid; grid-template-columns: 1.5fr 1fr 1fr; align-items: center; padding: 24px 32px; border-bottom: 1px solid var(--bdr); transition: all 0.2s; border-left: 0 solid var(--red); }
    .registry-item:hover { background: var(--bg-card-2); transform: translateX(8px); border-left-width: 4px; }
    .registry-item.submitted { border-left-color: #00C853; }
    .registry-item.pending { border-left-color: #FFAB00; }

    .ri-type { font-size: 15px; font-weight: 800; color: var(--text-pri); }
    .ri-period { font-size: 12px; color: var(--text-sec); font-weight: 600; margin-top: 2px; }
    .ri-label { font-size: 9px; font-weight: 800; color: var(--text-mut); letter-spacing: 1px; }
    .ri-date { font-size: 13px; font-weight: 700; color: var(--text-pri); }
    .ri-right { display: flex; justify-content: flex-end; align-items: center; gap: 16px; }

    .status-badge { padding: 4px 12px; border-radius: 50px; font-size: 9px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }
    .status-badge.alert { background: rgba(255, 171, 0, 0.1); color: #FFAB00; border: 1px solid rgba(255, 171, 0, 0.2); }
    .status-badge.success { background: rgba(0, 200, 83, 0.1); color: #00C853; border: 1px solid rgba(0, 200, 83, 0.2); }

    .icon-btn-elite { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--text-sec); cursor: pointer; transition: all 0.2s; }
    .icon-btn-elite:hover { background: var(--red); color: #fff; border-color: var(--red); transform: scale(1.1); }

    .empty-state-elite { padding: 80px 0; text-align: center; color: var(--text-mut); }
    .empty-icon { margin-bottom: 20px; opacity: 0.15; }

    /* Modals */
    .modal-overlay-elite { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .modal-box { width: 100%; max-width: 500px; }
    .modal-body-elite { padding: 32px; }
    
    .mpesa-form-elite { display: flex; flex-direction: column; gap: 24px; }
    .input-group-elite label { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 1.5px; margin-bottom: 10px; display: block; }
    .input-group-elite input, .select-wrap-elite select { width: 100%; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 14px; padding: 14px 20px; font-size: 15px; color: var(--text-pri); outline: none; transition: all 0.2s; }
    .input-group-elite input:focus, .select-wrap-elite select:focus { border-color: var(--red); background: var(--bg-card); box-shadow: 0 0 0 4px var(--red-pale); }

    .info-alert-elite { display: flex; gap: 12px; padding: 16px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 16px; color: var(--red-bright); font-size: 12px; font-weight: 600; line-height: 1.5; }
    .form-actions-elite { display: flex; gap: 16px; margin-top: 8px; }

    /* Buttons */
    .btn-primary-elite { background: var(--red); color: #fff; border: none; padding: 16px 28px; border-radius: 14px; font-size: 11px; font-weight: 900; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; box-shadow: 0 8px 16px -4px var(--red-glow); display: flex; align-items: center; justify-content: center; gap: 10px; text-transform: uppercase; }
    .btn-primary-elite:hover:not(:disabled) { background: var(--red-bright); transform: translateY(-2px); box-shadow: 0 12px 24px -6px var(--red-glow); }
    .btn-primary-elite:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn-ghost-elite { background: var(--bg-card-2); color: var(--text-sec); border: 1px solid var(--bdr); padding: 16px 24px; border-radius: 14px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; text-transform: uppercase; }
    .btn-ghost-elite:hover { background: var(--bg-card); color: var(--text-pri); border-color: var(--bdr-md); }

    .close-btn { width: 32px; height: 32px; border-radius: 10px; border: none; background: var(--bg-card-2); color: var(--text-sec); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px; }
    .close-btn:hover { color: var(--text-pri); background: var(--bdr); }

    /* Footer */
    .db-footer-elite { padding: 40px; border: 1px solid var(--bdr); border-radius: 32px; text-align: center; background: var(--bg-card-2); }
    .db-footer-elite p { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 4px; line-height: 1.8; max-width: 800px; margin: 0 auto; text-transform: uppercase; }

    /* Animations */
    .animate-fade-in { animation: fadeIn var(--duration-base) var(--ease-out) both; }
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out) both; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    @media (max-width: 768px) {
      .registry-item { grid-template-columns: 1fr; gap: 16px; padding: 24px; }
      .ri-right { justify-content: space-between; }
      .form-actions-elite { flex-direction: column; }
    }
  `]
})
export class ReturnsComponent implements OnInit {
  private returnsService = inject(ReturnsService);
  
  ngOnInit() {
    this.returnsService.refreshReturns().subscribe();
  }

  searchQuery = '';
  showFileDialog = signal(false);
  newReturn = { type: '', period: '' };

  allReturns = this.returnsService.allReturns;
  submittedReturns = this.returnsService.submittedReturns;
  pendingReturns = this.returnsService.pendingReturns;
  
  filteredReturns = computed(() => {
    if (!this.searchQuery) return this.allReturns();
    return this.returnsService.searchReturns(this.searchQuery);
  });

  fileReturn() {
    if (!this.newReturn.type || !this.newReturn.period) return;
    
    this.returnsService.createReturn(this.newReturn.period, this.newReturn.type).subscribe({
      next: (created) => {
        this.cancelFileDialog();
      },
      error: () => alert('Filing Integrity Check Failed: Critical handoff timeout.')
    });
  }

  downloadAcknowledgement(id: string) {
    const finalUrl = `${environment.apiUrl}/download.php?type=return&id=${id}&format=pdf`;
    window.open(finalUrl, '_blank');
  }

  cancelFileDialog() {
    this.showFileDialog.set(false);
    this.newReturn = { type: '', period: '' };
  }

  onSearch() {}
}
