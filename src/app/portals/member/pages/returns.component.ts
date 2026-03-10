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
    <div class="db-root animate-fade-in">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>

      <div class="db-inner animate-stagger">
        <!-- Elite Header -->
        <header class="db-header-elite">
          <div class="header-left">
            <div class="live-badge">
              <span class="live-dot"></span>
              COMPLIANCE MODULE
            </div>
            <h1 class="premium-title">Compliance <span class="text-red">Registry</span></h1>
            <p class="premium-subtitle">Authorized gateway for tax returns processing and fiscal history monitoring</p>
          </div>
          
          <div class="header-right">
            <button class="btn-primary-elite" (click)="showFileDialog.set(true)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              INITIATE FILING
            </button>
          </div>
        </header>

        <!-- HD Metrics Grid -->
        <div class="main-grid">
          <div class="elite-card metric-card group">
            <div class="card-icon bg-red-pale text-red">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">Total Submissions</span>
              <div class="metric-value">{{ allReturns().length }}</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-icon bg-red-pale text-red">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">Verified Filings</span>
              <div class="metric-value">{{ submittedReturns().length }}</div>
            </div>
            <div class="card-glow"></div>
          </div>

          <div class="elite-card metric-card group">
            <div class="card-icon bg-red-pale text-red">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="metric-content">
              <span class="metric-label">Pending Reviews</span>
              <div class="metric-value">{{ pendingReturns().length }}</div>
            </div>
            <div class="card-glow"></div>
          </div>
        </div>

        <!-- Registry Table Section -->
        <div class="elite-card table-section">
          <div class="table-header">
            <div class="table-title">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              Compliance Records
            </div>
            <div class="search-box">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Trace filings..." [(ngModel)]="searchQuery" (input)="onSearch()">
            </div>
          </div>

          <div class="table-responsive">
            <table class="elite-table">
              <thead>
                <tr>
                  <th>Filing Head</th>
                  <th>Fiscal Period</th>
                  <th>Transmission Date</th>
                  <th>Status</th>
                  <th class="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                @for (r of filteredReturns(); track r.id) {
                  <tr class="table-row">
                    <td><span class="font-bold text-pri">{{ r.type }}</span></td>
                    <td><span class="period-chip">{{ r.period }}</span></td>
                    <td><span class="text-sec">{{ r.dateSubmitted || 'NOT TRANSMITTED' }}</span></td>
                    <td>
                      <span class="status-chip" [attr.data-status]="r.status">
                        <span class="status-dot"></span>
                        {{ r.status }}
                      </span>
                    </td>
                    <td class="text-center">
                      <button class="icon-btn" (click)="downloadAcknowledgement(r.id.toString())" title="Download Acknowledgement">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </button>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="empty-state">
                      <div class="empty-icon">
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <p>Registry Clear. No matching records traced.</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Theme Adherence Disclaimer -->
        <footer class="db-footer-elite">
           <p>STATUTORY IDENTIFICATION ARCHIVE. AUTHORIZED ACCESS ONLY. THIS RECORD IS SYNCHRONIZED WITH THE CENTRAL TAXPAYER REGISTRY.</p>
        </footer>
      </div>

      <!-- Filing Dialog -->
      @if (showFileDialog()) {
        <div class="elite-modal-overlay" (click)="cancelFileDialog()">
          <div class="elite-modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-title">
                <h3>Secure Filing Sequence</h3>
                <p>Configure return parameters for valid transmission</p>
              </div>
              <button class="close-btn" (click)="cancelFileDialog()">✕</button>
            </div>
            
            <div class="modal-body">
              <div class="form-group">
                <label>Revenue Head (Obligation)</label>
                <div class="select-wrapper">
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

              <div class="form-group">
                <label>Fiscal Period (Month/Year)</label>
                <input type="text" [(ngModel)]="newReturn.period" placeholder="e.g. November 2025">
              </div>

              <div class="info-alert">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Ensure all data is accurate. This initiates a legal filing sequence.</span>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn-ghost-elite" (click)="cancelFileDialog()">Discard</button>
              <button class="btn-primary-elite" (click)="fileReturn()" [disabled]="!newReturn.type || !newReturn.period">
                Authorize Submission
              </button>
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

      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    @media (prefers-color-scheme: light) {
      :host {
        --bg-root:    #F2F2F4;
        --bg-card:    #FFFFFF;
        --bg-card-2:  #F8F8FA;
        --text-pri:   #111111;
        --text-sec:   #555560;
        --text-mut:   #9999A8;
        --bdr:        rgba(0, 0, 0, 0.08);
        --bdr-md:     rgba(0, 0, 0, 0.12);
      }
    }

    .db-root { min-height: 100vh; background: var(--bg-root); color: var(--text-pri); position: relative; overflow-x: hidden; }
    .db-inner { max-width: 1400px; margin: 0 auto; padding: 40px 28px 80px; display: flex; flex-direction: column; gap: 40px; position: relative; z-index: 10; }

    .db-header-elite { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; }
    .premium-title { font-size: clamp(32px, 5vw, 48px); font-weight: 950; letter-spacing: -1.5px; line-height: 1; margin: 12px 0 8px; }
    .text-red { color: var(--red); }
    .premium-subtitle { font-size: 14px; font-weight: 500; color: var(--text-sec); max-width: 500px; }

    .live-badge { display: flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 50px; background: var(--red-pale); border: 1px solid var(--red-border); font-size: 9px; font-weight: 900; letter-spacing: 1.5px; color: var(--red-bright); }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); box-shadow: 0 0 10px var(--red); animation: blink 1.5s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .main-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
    .elite-card { background: var(--bg-card); border: 1px solid var(--bdr); border-radius: 32px; padding: 32px; position: relative; overflow: hidden; }
    
    .metric-card { display: flex; align-items: center; gap: 24px; }
    .card-icon { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-2); border: 1px solid var(--bdr); }
    .metric-label { font-size: 12px; font-weight: 700; color: var(--text-sec); uppercase; letter-spacing: 1px; }
    .metric-value { font-size: 32px; font-weight: 900; color: var(--text-pri); }

    .table-section { padding: 0; }
    .table-header { padding: 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; border-bottom: 1px solid var(--bdr); }
    .table-title { font-size: 18px; font-weight: 800; display: flex; align-items: center; gap: 12px; color: var(--text-pri); }
    
    .search-box { position: relative; width: 100%; max-width: 320px; }
    .search-box svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-mut); }
    .search-box input { width: 100%; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 16px; padding: 12px 16px 12px 48px; color: var(--text-pri); font-size: 14px; outline: none; transition: all 0.2s; }
    .search-box input:focus { border-color: var(--red); box-shadow: 0 0 0 4px var(--red-pale); }

    .elite-table { width: 100%; border-collapse: collapse; }
    .elite-table th { padding: 16px 32px; text-align: left; font-size: 11px; font-weight: 800; color: var(--text-mut); text-transform: uppercase; letter-spacing: 1px; background: var(--bg-card-2); }
    .elite-table td { padding: 20px 32px; border-bottom: 1px solid var(--bdr); font-size: 14px; }
    .table-row:hover { background: var(--bg-card-2); }

    .period-chip { padding: 4px 10px; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 8px; font-size: 12px; font-weight: 700; color: var(--text-sec); }
    
    .status-chip { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 50px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    .status-chip[data-status="submitted"] { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .status-chip[data-status="pending"] { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .icon-btn { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-2); border: 1px solid var(--bdr); color: var(--text-sec); cursor: pointer; transition: all 0.2s; }
    .icon-btn:hover { background: var(--red); color: #fff; border-color: var(--red); }

    .empty-state { padding: 80px 0; text-align: center; color: var(--text-mut); }
    .empty-icon { margin-bottom: 16px; opacity: 0.2; }

    .btn-primary-elite { background: var(--red); color: #fff; border: none; padding: 14px 28px; border-radius: 16px; font-size: 12px; font-weight: 800; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 15px var(--red-glow); }
    .btn-primary-elite:hover { background: var(--red-bright); transform: translateY(-2px); }
    .btn-primary-elite:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .btn-ghost-elite { background: var(--bg-card-2); color: var(--text-sec); border: 1px solid var(--bdr); padding: 14px 28px; border-radius: 16px; font-size: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
    .btn-ghost-elite:hover { background: var(--bdr); color: var(--text-pri); }

    .elite-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .elite-modal-content { background: var(--bg-card); border: 1px solid var(--bdr-md); border-radius: 32px; width: 100%; max-width: 540px; position: relative; box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
    
    .modal-header { padding: 32px; border-bottom: 1px solid var(--bdr); display: flex; justify-content: space-between; align-items: flex-start; }
    .modal-title h3 { font-size: 24px; font-weight: 900; margin: 0; }
    .modal-title p { font-size: 14px; color: var(--text-sec); margin: 4px 0 0; }
    .close-btn { background: none; border: none; font-size: 20px; color: var(--text-mut); cursor: pointer; }

    .modal-body { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-size: 12px; font-weight: 800; color: var(--text-mut); text-transform: uppercase; }
    .form-group input, .select-wrapper select { width: 100%; background: var(--bg-card-2); border: 1px solid var(--bdr); border-radius: 12px; padding: 14px; color: var(--text-pri); outline: none; font-size: 14px; }
    .form-group input:focus { border-color: var(--red); }
    
    .info-alert { display: flex; gap: 12px; padding: 16px; background: var(--red-pale); border: 1px solid var(--red-border); border-radius: 16px; color: var(--red-bright); font-size: 13px; font-weight: 500; }

    .modal-footer { padding: 24px 32px; border-top: 1px solid var(--bdr); display: flex; justify-content: flex-end; gap: 12px; }

    .db-footer-elite { margin-top: 40px; padding: 40px; border: 1px solid var(--bdr); border-radius: 32px; text-align: center; background: var(--bg-card-2); }
    .db-footer-elite p { font-size: 10px; font-weight: 800; color: var(--text-mut); letter-spacing: 4px; line-height: 1.8; max-width: 800px; margin: 0 auto; }
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
