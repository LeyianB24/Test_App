import { Component, signal, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MpesaParserService, MpesaTransaction } from '../../../../core/services/member/mpesa-parser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mpesa-analyser',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-[1400px] mx-auto p-4 md:p-8 animate-fade-in">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 class="premium-title mb-2">M-PESA Revenue Analyser</h1>
          <p class="text-slate-400 text-lg">Extract taxable income from your mobile money statements</p>
        </div>
        
        <button class="bg-white/5 border border-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-sm shadow-sm backdrop-blur-md">
           <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
           Format Guide
        </button>
      </header>

      @if (!isLoaded()) {
        <!-- Upload State -->
        <div class="glass-panel p-12 md:p-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10 hover:border-emerald-500/30 transition-colors">
           <div class="w-24 h-24 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
           </div>
           
           <h2 class="text-2xl font-bold text-white mb-4 tracking-tight">Upload M-PESA PDF/CSV</h2>
           <p class="text-slate-400 max-w-sm mb-10 text-sm">Select a statement from the Safaricom App or *334# to begin automatic tax categorization.</p>
           
           <button (click)="simulateUpload()" class="btn-primary px-10 py-4 shadow-lg shadow-emerald-500/20">
              <span class="flex items-center gap-3">
                @if (isParsing()) {
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Parsing Statement...
                } @else {
                  Choose File to Analyse
                }
              </span>
           </button>
        </div>
      } @else {
        <!-- Analysis Results -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <!-- Transactions Table -->
           <div class="lg:col-span-2">
              <div class="glass-panel p-6 md:p-8 relative overflow-hidden h-full">
                 <h3 class="premium-subtitle mb-6">Categorized Transactions</h3>
                 <div class="overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
                    <table class="w-full text-left border-collapse">
                       <thead>
                          <tr class="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-white/10">
                             <th class="pb-4 font-medium">Ref / Details</th>
                             <th class="pb-4 font-medium">Type</th>
                             <th class="pb-4 text-right font-medium">Amount</th>
                             <th class="pb-4 pl-6 font-medium">Tax Category</th>
                          </tr>
                       </thead>
                       <tbody class="divide-y divide-white/5">
                          @for (tx of transactions(); track tx.receiptNo) {
                             <tr class="hover:bg-white/[0.02] transition-colors group">
                                <td class="py-4 pr-4">
                                   <div class="flex flex-col gap-1">
                                      <span class="text-white font-medium text-sm">{{ tx.details }}</span>
                                      <span class="text-slate-500 text-xs font-mono">{{ tx.receiptNo }}</span>
                                   </div>
                                </td>
                                <td class="py-4 pr-4 align-top">
                                   <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white/5 text-slate-300 border border-white/10 uppercase tracking-wide">
                                     {{ tx.type }}
                                   </span>
                                </td>
                                <td class="py-4 px-4 text-right align-top">
                                   <span class="font-bold whitespace-nowrap" [class]="tx.amount > 0 ? 'text-emerald-400' : 'text-slate-300'">
                                      {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount | number }}
                                   </span>
                                </td>
                                <td class="py-4 pl-6 align-top">
                                   <select class="input-modern py-1.5 px-3 text-xs uppercase tracking-wider h-auto w-full max-w-[140px]">
                                      <option [value]="tx.category">{{ tx.category }}</option>
                                      <option value="Personal">Personal</option>
                                      <option value="VAT Sales">VAT Sales</option>
                                      <option value="TOT Turnover">TOT Turnover</option>
                                   </select>
                                </td>
                             </tr>
                          }
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           <!-- Insights Sidebar -->
           <div class="space-y-6">
              <div class="glass-panel p-8 relative overflow-hidden group">
                 <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-700"></div>
                 
                 <div class="relative z-10 flex items-center gap-3 mb-8">
                    <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <h3 class="text-blue-400 font-semibold uppercase text-xs tracking-widest">Discovery Insights</h3>
                 </div>
                 
                 <div class="space-y-6 relative z-10">
                    <div class="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                       <span class="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-2">Taxable Income Found</span>
                       <h4 class="text-3xl font-bold text-white tracking-tight">KES {{ insights().totalIncome | number }}</h4>
                    </div>
                    
                    <div class="p-5 rounded-2xl bg-red-500/5 border border-red-500/10">
                       <span class="text-xs font-medium text-red-400/80 uppercase tracking-wider block mb-2">Business Expenses</span>
                       <h4 class="text-3xl font-bold text-red-400 tracking-tight">KES {{ insights().businessExpenses | number }}</h4>
                    </div>
                    
                    <div class="pt-6 border-t border-white/10 flex flex-col gap-3">
                       <button (click)="syncToVat()" class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                          Sync to VAT
                       </button>
                       <button (click)="syncToTot()" class="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                          Inject into TOT Return
                       </button>
                    </div>
                 </div>
              </div>
              
              <div class="glass-panel p-6 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
                 <div class="flex flex-col gap-3">
                    <div class="flex items-center gap-2 text-amber-500">
                       <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                       <h4 class="font-bold text-xs uppercase tracking-wider">Review Required</h4>
                    </div>
                    <p class="text-sm text-slate-300 leading-relaxed">
                      We've identified <strong class="text-white">KES 150,000</strong> received from a registered PIN. This has been flagged as taxable turnover. Please verify if this was an internal transfer or sales.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class MpesaAnalyserComponent {
  private mpesaService = inject(MpesaParserService);
  private router = inject(Router);

  isParsing = signal(false);
  isLoaded = signal(false);
  transactions = this.mpesaService.transactions;
  insights = computed(() => this.mpesaService.getInsights());

  simulateUpload() {
    this.isParsing.set(true);
    // Simulate a file upload
    const mockFile = new File([''], 'statement.pdf');
    this.mpesaService.parseStatement(mockFile).subscribe(() => {
      this.isParsing.set(false);
      this.isLoaded.set(true);
    });
  }

  syncToVat() {
    // In a real app, we'd store the validated sales in a signal/store 
    // that the VAT wizard can consume
    this.router.navigate(['/member/tax-engine/file/vat']);
  }

  syncToTot() {
    this.router.navigate(['/member/tax-engine/file/tot']);
  }
}
