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
    <div class="content-area animate-stagger">
      
      <!-- HD Page Header -->
      <header class="mb-12">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h1 class="premium-title">Compliance <span class="text-[var(--color-accent)]">Registry</span></h1>
            <p class="premium-subtitle">Authorized gateway for tax returns processing and fiscal history monitoring</p>
          </div>
          <div class="flex items-center gap-4">
            <button class="btn-precision btn-primary-precision" (click)="showFileDialog.set(true)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              Initiate New Filing
            </button>
          </div>
        </div>
      </header>

      <!-- HD Metrics Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div class="stat-card-precision">
          <div class="card-icon-box blue">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <span class="card-label uppercase tracking-widest">Total Submissions</span>
          <span class="card-value">{{ allReturns().length }}</span>
        </div>

        <div class="stat-card-precision">
          <div class="card-icon-box green">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <span class="card-label uppercase tracking-widest">Verified Filings</span>
          <span class="card-value">{{ submittedReturns().length }}</span>
        </div>

        <div class="stat-card-precision">
          <div class="card-icon-box danger">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <span class="card-label uppercase tracking-widest">Pending Reviews</span>
          <span class="card-value">{{ pendingReturns().length }}</span>
        </div>
      </div>

      <!-- HD Registry Surface -->
      <div class="glass-panel p-0 overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between p-10 border-b border-subtle bg-surface-2/50 gap-6">
          <h3 class="text-xl font-black text-primary uppercase tracking-widest">Compliance Records</h3>
          <div class="search-input-precision w-full md:w-96">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" placeholder="Trace filings by reference or period..." [(ngModel)]="searchQuery" (input)="onSearch()">
          </div>
        </div>

        <div class="table-container">
          <table class="table-precision">
            <thead>
              <tr>
                <th>FILING HEAD</th>
                <th>FISCAL PERIOD</th>
                <th>TRANSMISSION DATE</th>
                <th>COMPLIANCE STATUS</th>
                <th class="text-right">VERIFICATION</th>
              </tr>
            </thead>
            <tbody>
              @for (r of filteredReturns(); track r.id) {
                <tr class="animate-stagger-item">
                  <td>
                    <span class="font-black text-primary">{{ r.type }}</span>
                  </td>
                  <td>
                    <span class="status-pill-precision !px-4 !py-1 text-[var(--color-accent)] !bg-surface-3">{{ r.period }}</span>
                  </td>
                  <td class="text-muted font-bold">{{ r.dateSubmitted || 'NOT TRANSMITTED' }}</td>
                  <td>
                    <div class="status-pill-precision" [class]="r.status === 'submitted' ? 'online' : (r.status === 'pending' ? 'pending' : 'overdue')">
                      <span class="status-pill-dot"></span>
                      {{ r.status | uppercase }}
                    </div>
                  </td>
                  <td class="text-right">
                    <button class="notification-bell-precision" (click)="downloadAcknowledgement(r.id.toString())" title="Download Acknowledgement">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">
                    <div class="py-24 text-center">
                      <div class="text-4xl mb-6 opacity-20">NULL</div>
                      <p class="premium-subtitle">Registry clear. No matching records traced.</p>
                      <button class="btn-precision btn-primary-precision mt-8" (click)="showFileDialog.set(true)">Initiate First Filing</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- HD Dialog: Secure Filing Sequence -->
      @if (showFileDialog()) {
        <div class="dialog-overlay-elite animate-fade-in" (click)="cancelFileDialog()">
          <div class="glass-panel !p-0 !max-w-xl w-full animate-scale-in" (click)="$event.stopPropagation()">
            <div class="p-10 border-b border-subtle bg-surface-2/50 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-black text-primary uppercase tracking-widest">Secure Filing Sequence</h3>
                <p class="premium-subtitle">Configure return parameters for valid transmission</p>
              </div>
              <button class="notification-bell-precision" (click)="cancelFileDialog()">✕</button>
            </div>
            
            <div class="p-10 space-y-10">
              <div class="space-y-4">
                <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Revenue Head (Obligation)</label>
                <div class="search-input-precision !w-full !px-6">
                  <select class="w-full bg-transparent border-none appearance-none font-black text-xs text-primary focus:outline-none" [(ngModel)]="newReturn.type">
                    <option value="">Select an active obligation...</option>
                    <option value="Monthly VAT Return">Monthly VAT Return (Section A)</option>
                    <option value="Income Tax Return">Income Tax Return (Resident Individual)</option>
                    <option value="PAYE Return">PAYE Systematic Return</option>
                    <option value="Withholding Tax Return">Withholding Statutory Return</option>
                    <option value="Rental Income">Rental Income Tax (Residential)</option>
                  </select>
                </div>
              </div>

              <div class="space-y-4">
                <label class="premium-subtitle !mt-0 uppercase tracking-widest text-[10px]">Fiscal Period (Month/Year)</label>
                <div class="search-input-precision !w-full !px-6">
                  <input type="text" [(ngModel)]="newReturn.period" placeholder="e.g. November 2025" class="!bg-transparent font-black">
                </div>
              </div>

              <div class="p-6 rounded-2xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/10 flex gap-4 text-[var(--color-accent)]">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span class="text-xs font-bold leading-tight">Ensure all data is accurate before submission. This action initiates a legal filing sequence.</span>
              </div>
            </div>

            <div class="p-10 bg-surface-2/50 border-t border-subtle flex justify-end gap-6">
              <button class="btn-precision btn-secondary-precision" (click)="cancelFileDialog()">Discard Session</button>
              <button class="btn-precision btn-primary-precision" (click)="fileReturn()" [disabled]="!newReturn.type || !newReturn.period">
                Authorize Submission
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .dialog-overlay-elite { position: fixed; inset: 0; background: var(--bg-overlay); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 2rem; }
    .animate-scale-in { animation: scaleIn var(--duration-base) var(--ease-out); }
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
