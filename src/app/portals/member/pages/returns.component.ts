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
    <div class="animate-fade-in p-2 md:p-6 lg:p-8">
      
      <!-- HD Page Header -->
      <header class="mb-10 lg:mb-14">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                COMPLIANCE MODULE
              </span>
            </div>
            <h1 class="premium-title">Compliance <span class="text-amber-500">Registry</span></h1>
            <p class="text-slate-400 text-lg md:text-xl font-medium mt-1">Authorized gateway for tax returns processing and fiscal history monitoring</p>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <button class="btn-primary py-3 px-6 shadow-lg shadow-amber-500/25 bg-amber-600 hover:bg-amber-500" (click)="showFileDialog.set(true)">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
              Initiate New Filing
            </button>
          </div>
        </div>
      </header>

      <!-- HD Metrics Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10 lg:mb-14">
        <div class="glass-panel p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 to-transparent"></div>
          <div class="flex justify-between items-start mb-6">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 bg-blue-500/10 text-blue-400">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
          </div>
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 z-10 relative">Total Submissions</h3>
          <div class="text-4xl lg:text-5xl font-bold text-white tracking-tight z-10 relative">{{ allReturns().length }}</div>
        </div>

        <div class="glass-panel p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 to-transparent"></div>
          <div class="flex justify-between items-start mb-6">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 bg-emerald-500/10 text-emerald-400">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 z-10 relative">Verified Filings</h3>
          <div class="text-4xl lg:text-5xl font-bold text-white tracking-tight z-10 relative">{{ submittedReturns().length }}</div>
        </div>

        <div class="glass-panel p-8 relative overflow-hidden group hover:border-red-500/30 transition-all duration-300 transform hover:-translate-y-1">
          <div class="absolute inset-0 bg-gradient-to-br from-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 to-transparent"></div>
          <div class="flex justify-between items-start mb-6">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center relative z-10 bg-red-500/10 text-red-400">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 z-10 relative">Pending Reviews</h3>
          <div class="text-4xl lg:text-5xl font-bold text-white tracking-tight z-10 relative">{{ pendingReturns().length }}</div>
        </div>
      </div>

      <!-- HD Registry Surface -->
      <div class="glass-panel p-0 overflow-hidden">
        <div class="flex flex-col md:flex-row md:items-center justify-between p-6 lg:p-10 border-b border-white/5 bg-white/[0.02] gap-6">
          <h3 class="premium-subtitle m-0 uppercase flex items-center gap-3">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            Compliance Records
          </h3>
          <div class="relative w-full md:w-96 group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input type="text" placeholder="Trace filings by reference or period..." [(ngModel)]="searchQuery" (input)="onSearch()"
                   class="w-full bg-slate-900/50 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-amber-500/50 focus:bg-slate-900 transition-all placeholder-slate-500">
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-white/10 bg-white/[0.02]">
                <th class="px-6 py-4">Filing Head</th>
                <th class="px-6 py-4">Fiscal Period</th>
                <th class="px-6 py-4">Transmission Date</th>
                <th class="px-6 py-4">Compliance Status</th>
                <th class="px-6 py-4 text-center">Verification</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 disabled-text-selection">
              @for (r of filteredReturns(); track r.id) {
                <tr class="group hover:bg-white/[0.02] transition-colors">
                  <td class="px-6 py-5">
                    <span class="font-bold text-white">{{ r.type }}</span>
                  </td>
                  <td class="px-6 py-5">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white/5 text-amber-400 border border-white/10">
                      {{ r.period }}
                    </span>
                  </td>
                  <td class="px-6 py-5 text-slate-400 font-medium">{{ r.dateSubmitted || 'NOT TRANSMITTED' }}</td>
                  <td class="px-6 py-5">
                    <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none border"
                          [ngClass]="{
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': r.status === 'submitted',
                            'bg-amber-500/10 text-amber-400 border-amber-500/20': r.status === 'pending',
                            'bg-slate-500/10 text-slate-400 border-slate-500/20': r.status === 'draft'
                          }">
                      <span class="w-1.5 h-1.5 rounded-full"
                            [ngClass]="{
                              'bg-emerald-500': r.status === 'submitted',
                              'bg-amber-500 animate-pulse': r.status === 'pending',
                              'bg-slate-500': r.status === 'draft'
                            }"></span>
                      {{ r.status }}
                    </span>
                  </td>
                  <td class="px-6 py-5 text-center">
                    <button class="p-2 text-slate-500 hover:text-amber-400 transition-colors rounded-lg hover:bg-amber-400/10 flex items-center justify-center mx-auto"
                            (click)="downloadAcknowledgement(r.id.toString())" title="Download Acknowledgement">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5">
                    <div class="py-24 text-center flex flex-col items-center justify-center">
                      <div class="w-20 h-20 mb-6 bg-white/5 rounded-3xl flex items-center justify-center text-slate-600">
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <h3 class="text-xl font-bold text-white mb-2">Registry Clear</h3>
                      <p class="text-slate-400 max-w-sm">No matching records traced. Ensure your parameters are correct or initiate a new filing.</p>
                      <button class="btn-primary mt-8 py-3 px-6 shadow-lg shadow-amber-500/25 bg-amber-600 hover:bg-amber-500" (click)="showFileDialog.set(true)">Initiate First Filing</button>
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
          <div class="glass-panel !p-0 max-w-xl w-full mx-4 shadow-2xl relative overflow-hidden" (click)="$event.stopPropagation()">
            <div class="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div class="p-8 border-b border-white/10 bg-white/[0.02] flex items-center justify-between relative z-10">
              <div>
                <h3 class="text-xl font-black text-white tracking-tight">Secure Filing Sequence</h3>
                <p class="text-slate-400 text-sm mt-1">Configure return parameters for valid transmission</p>
              </div>
              <button class="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all" (click)="cancelFileDialog()">✕</button>
            </div>
            
            <div class="p-8 space-y-8 relative z-10">
              <div class="space-y-3">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue Head (Obligation)</label>
                <div class="relative group">
                  <select class="w-full bg-slate-900 border border-white/10 text-white text-sm font-medium rounded-xl px-4 py-3.5 outline-none focus:border-amber-500/50 focus:bg-slate-800 transition-all appearance-none cursor-pointer" [(ngModel)]="newReturn.type">
                    <option value="" class="text-slate-500">Select an active obligation...</option>
                    <option value="Monthly VAT Return">Monthly VAT Return (Section A)</option>
                    <option value="Income Tax Return">Income Tax Return (Resident Individual)</option>
                    <option value="PAYE Return">PAYE Systematic Return</option>
                    <option value="Withholding Tax Return">Withholding Statutory Return</option>
                    <option value="Rental Income">Rental Income Tax (Residential)</option>
                  </select>
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fiscal Period (Month/Year)</label>
                <input type="text" [(ngModel)]="newReturn.period" placeholder="e.g. November 2025" class="w-full bg-slate-900 border border-white/10 text-white text-sm font-medium rounded-xl px-4 py-3.5 outline-none focus:border-amber-500/50 focus:bg-slate-800 transition-all placeholder-slate-500">
              </div>

              <div class="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-4 text-amber-500 items-start">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span class="text-sm font-medium leading-relaxed">Ensure all data is accurate before submission. This action initiates a legal filing sequence.</span>
              </div>
            </div>

            <div class="p-8 bg-white/[0.02] border-t border-white/10 flex flex-col-reverse sm:flex-row justify-end gap-4 relative z-10">
              <button class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors" (click)="cancelFileDialog()">Discard Session</button>
              <button class="btn-primary py-3 px-6 shadow-lg shadow-amber-500/25 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed" (click)="fileReturn()" [disabled]="!newReturn.type || !newReturn.period">
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
