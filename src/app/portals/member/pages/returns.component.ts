import { Component, inject, computed, signal, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ReturnsService } from '../../../services/returns.service';
import { environment } from '../../../../environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-returns',
  imports: [FormsModule],
  template: `
    <div class="page-container animate-up">
      
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Compliance <span class="gradient-text">Registry</span></h1>
          <p class="premium-subtitle">Authorized gateway for tax returns processing and fiscal history monitoring</p>
        </div>
        <div class="header-actions">
           <button class="modern-btn primary-btn" (click)="showFileDialog.set(true)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke-width="3"/></svg>
              Initiate New Filing
           </button>
        </div>
      </header>

      <!-- Elite Summary Section -->
      <div class="stats-grid-premium">
        <div class="premium-stat-card d-flex align-items-center p-4 animate-up delay-1">
          <div class="stat-icon-wrapper blue me-3">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Submissions</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ allReturns().length }}</h3>
            </div>
          </div>
        </div>
        <div class="premium-stat-card d-flex align-items-center p-4 animate-up delay-2">
          <div class="stat-icon-wrapper green me-3">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Verified Filings</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ submittedReturns().length }}</h3>
            </div>
          </div>
        </div>
        <div class="premium-stat-card d-flex align-items-center p-4 animate-up delay-3">
          <div class="stat-icon-wrapper red me-3">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2.2"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Pending Reviews</span>
            <div class="stat-value-group">
               <h3 class="stat-number">{{ pendingReturns().length }}</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action: Filing Surface -->
      @if (showFileDialog()) {
        <div class="elite-filing-surface animate-scale">
           <div class="surface-header">
              <div class="s-title-v">
                 <h3>Secure Filing Sequence</h3>
                 <p>Configure return parameters for valid transmission</p>
              </div>
              <button class="close-luxury" (click)="cancelFileDialog()">✕</button>
           </div>
           
           <div class="surface-body">
              <div class="luxury-form-grid">
                <div class="luxury-input-box">
                  <label>Revenue Head (Obligation)</label>
                  <div class="select-wrapper-elite">
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
                <div class="luxury-input-box">
                  <label>Fiscal Period (Month/Year)</label>
                  <input type="text" [(ngModel)]="newReturn.period" placeholder="e.g. November 2025" class="elite-input- luxury">
                </div>
              </div>
           </div>

           <div class="surface-footer">
              <button class="modern-btn outline-btn danger sm" (click)="cancelFileDialog()">Discard Session</button>
              <button class="modern-btn primary-btn" (click)="fileReturn()" [disabled]="!newReturn.type || !newReturn.period">
                Authorize Submission
              </button>
           </div>
        </div>
      }

      <!-- Action Hub & Search Registry -->
      <div class="action-bar-glass mt-32 animate-up delay-2">
        <h4 class="hub-label">Compliance Records</h4>
        <div class="search-premium">
           <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2.5"/></svg>
           <input type="text" placeholder="Trace filings by reference or period..." class="search-input-elite" [(ngModel)]="searchQuery" (input)="onSearch()">
        </div>
      </div>

      <!-- Main Registry Table -->
      <div class="content-card-premium animate-up delay-3">
         <div class="table-responsive-elite">
            <table class="modern-table-elite">
              <thead>
                <tr>
                  <th>Filing Head</th>
                  <th>Fiscal Period</th>
                  <th>Transmission Date</th>
                  <th>Compliance Status</th>
                  <th class="text-center">Verification</th>
                </tr>
              </thead>
              <tbody>
                @if (filteredReturns().length === 0) {
                  <tr>
                    <td colspan="5" class="empty-placeholder">
                       <div class="empty-state-luxury">
                          <div class="e-icon">∅</div>
                          <p>Registry clear. No matching records traced.</p>
                       </div>
                    </td>
                  </tr>
                } @else {
                  @for (r of filteredReturns(); track r.id) {
                    <tr class="table-row-hover">
                      <td><span class="filing-title-elite">{{ r.type }}</span></td>
                      <td><span class="period-pill">{{ r.period }}</span></td>
                      <td><span class="date-label-elite">{{ r.dateSubmitted || 'NOT TRANSMITTED' }}</span></td>
                      <td>
                        <div class="status-pill-elite" [class]="r.status">
                           <span class="dot"></span>
                           {{ r.status }}
                        </div>
                      </td>
                      <td class="text-center">
                        <button class="icon-btn-elite" (click)="downloadAcknowledgement(r.id.toString())" title="Download Acknowledgement">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2.2"/></svg>
                        </button>
                      </td>
                    </tr>
                  }
                }
              </tbody>
            </table>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .elite-filing-surface {
      background: var(--bg-surface-1);
      -webkit-backdrop-filter: blur(24px); backdrop-filter: blur(24px);
      border-radius: 32px; border: 1px solid var(--border-default);
      box-shadow: var(--shadow-2xl), inset 0 2px 0 rgba(255,255,255,0.05); 
      margin-bottom: 40px; overflow: hidden;
      border-top: 5px solid var(--kra-red); position: relative;
    }
    .surface-header { padding: 32px 40px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-2); }
    .s-title-v h3 { font-size: 1.25rem; font-weight: 900; color: var(--text-primary); margin: 0; }
    .s-title-v p { font-size: 0.85rem; color: var(--text-tertiary); font-weight: 600; margin-top: 4px; }
    .close-luxury { width: 44px; height: 44px; border-radius: 12px; border: none; background: var(--bg-hover); color: var(--text-tertiary); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: 0.3s; }
    .close-luxury:hover { background: var(--bg-status-danger); color: var(--text-danger); }

    .surface-body { padding: 40px; }
    .luxury-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .luxury-input-box { display: flex; flex-direction: column; gap: 12px; }
    .luxury-input-box label { font-size: 0.75rem; font-weight: 900; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; }
    
    .elite-input-luxury, select {
      width: 100%; padding: 18px 24px; background: var(--bg-surface-2); border: 2px solid var(--border-default);
      border-radius: 20px; font-weight: 700; color: var(--text-primary); font-size: 1rem;
      transition: 0.3s; font-family: inherit;
    }
    .elite-input-luxury:focus, select:focus { border-color: var(--color-accent); outline: none; background: var(--bg-surface-1); box-shadow: 0 0 0 5px rgba(227,30,36,0.1); }
    
    .select-wrapper-elite { position: relative; }
    .select-wrapper-elite::after { content: '▾'; position: absolute; right: 24px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-tertiary); font-size: 1.5rem; }
    select { appearance: none; }

    .surface-footer { padding: 30px 40px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end; gap: 20px; background: var(--bg-surface-2); }

    .hub-label { font-size: 0.9rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: var(--text-tertiary); margin: 0; }
    
    .filing-title-elite { font-weight: 900; color: var(--text-primary); font-size: 1rem; }
    .period-pill { padding: 6px 14px; background: var(--bg-surface-2); border-radius: 10px; font-weight: 800; color: var(--color-accent); font-size: 0.8rem; }
    .date-label-elite { font-weight: 700; color: var(--text-secondary); font-size: 0.9rem; }
    
    .empty-placeholder { text-align: center; padding: 100px 0; }
    .empty-state-luxury { color: var(--text-tertiary); }
    .e-icon { font-size: 4rem; margin-bottom: 20px; font-weight: 300; }
    .empty-state-luxury p { font-size: 1.1rem; font-weight: 800; }

    @media (max-width: 900px) {
       .luxury-form-grid { grid-template-columns: 1fr; }
       .surface-header, .surface-footer { padding: 24px; }
       .surface-body { padding: 24px; }
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
        alert(`Strategic Acknowledgement: New filing created successfully.\nReference Head: ${this.newReturn.type}\nFiscal Period: ${this.newReturn.period}`);
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
