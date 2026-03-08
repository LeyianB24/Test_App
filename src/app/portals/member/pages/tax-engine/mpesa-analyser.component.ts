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
    <div class="analyser-container p-8 animate-fade-in">
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-4xl font-black text-white tracking-tighter">M-PESA Revenue Analyser</h1>
          <p class="text-slate-400 font-medium">Extract taxable income from your mobile money statements</p>
        </div>
        
        <div class="flex gap-4">
           <button class="btn-tool bg-white/5 border border-white/10 text-white font-black px-6 py-3 rounded-2xl hover:bg-white/10 transition-all">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Format Guide
           </button>
        </div>
      </header>

      @if (!isLoaded()) {
        <!-- Upload State -->
        <div class="flex flex-col items-center justify-center py-20 bg-slate-800/30 rounded-[3rem] border-2 border-dashed border-white/10">
           <div class="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
           </div>
           <h2 class="text-2xl font-black text-white mb-4">Upload M-PESA PDF/CSV</h2>
           <p class="text-slate-500 text-center max-w-sm font-medium mb-10">Select a statement from the Safaricom App or *334# to begin automatic tax categorization.</p>
           
           <button (click)="simulateUpload()" class="btn-glow bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
              {{ isParsing() ? 'Parsing Statement...' : 'Choose File to Analyse' }}
           </button>
           
           @if (isParsing()) {
             <div class="mt-8 flex gap-2">
                <div class="dot bg-emerald-500 animate-bounce"></div>
                <div class="dot bg-emerald-500 animate-bounce delay-75"></div>
                <div class="dot bg-emerald-500 animate-bounce delay-150"></div>
             </div>
           }
        </div>
      } @else {
        <!-- Analysis Results -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <!-- Transactions Table -->
           <div class="lg:col-span-2 space-y-8">
              <div class="card-glass-dark p-8 rounded-[3rem] border border-white/5 overflow-hidden">
                 <h3 class="text-xl font-black text-white mb-6">Categorized Transactions</h3>
                 <div class="overflow-x-auto">
                    <table class="w-full text-left">
                       <thead>
                          <tr class="text-[10px] uppercase font-black text-slate-500 border-b border-white/5 pb-4">
                             <th class="px-4 py-4">Ref / Details</th>
                             <th class="px-4 py-4">Type</th>
                             <th class="px-4 py-4">Amount</th>
                             <th class="px-4 py-4">Tax Category</th>
                          </tr>
                       </thead>
                       <tbody class="divide-y divide-white/5">
                          @for (tx of transactions(); track tx.receiptNo) {
                             <tr class="group hover:bg-white/5 transition-all">
                                <td class="px-4 py-6">
                                   <div class="flex flex-col">
                                      <span class="text-white font-black text-sm">{{ tx.details }}</span>
                                      <span class="text-slate-500 text-[10px] font-mono">{{ tx.receiptNo }}</span>
                                   </div>
                                </td>
                                <td class="px-4 py-6">
                                   <span class="px-3 py-1 bg-white/5 text-slate-400 rounded-lg text-xs font-bold">{{ tx.type }}</span>
                                </td>
                                <td class="px-4 py-6">
                                   <span class="text-white font-black" [class.text-emerald-400]="tx.amount > 0">
                                      {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount | number }}
                                   </span>
                                </td>
                                <td class="px-4 py-6">
                                   <select class="category-select bg-slate-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl outline-none focus:border-blue-500">
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
           <div class="space-y-8">
              <div class="insight-card p-10 bg-slate-800 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                 <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                 <h3 class="text-blue-400 font-black uppercase text-xs tracking-widest mb-8">Discovery Insights</h3>
                 
                 <div class="space-y-8 relative z-10">
                    <div>
                       <span class="text-[10px] font-black uppercase text-slate-500">Taxable Income Found</span>
                       <h4 class="text-3xl font-black text-white">KES {{ insights().totalIncome | number }}</h4>
                    </div>
                    <div>
                       <span class="text-[10px] font-black uppercase text-slate-500">Business Expenses</span>
                       <h4 class="text-3xl font-black text-red-400">KES {{ insights().businessExpenses | number }}</h4>
                    </div>
                    
                    <div class="h-px bg-white/10 my-8"></div>
                    
                    <button (click)="syncToVat()" class="w-full py-5 bg-blue-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 mb-4">
                       Sync Validated Sales to VAT
                    </button>
                    <button (click)="syncToTot()" class="w-full py-5 bg-slate-900 text-slate-300 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-black transition-all">
                       Inject into TOT Return
                    </button>
                 </div>
              </div>
              
              <div class="p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
                 <div class="flex items-center gap-3 mb-4">
                    <svg width="20" height="20" fill="#F59E0B" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    <h4 class="text-amber-500 font-black text-[10px] uppercase">Review Required</h4>
                 </div>
                 <p class="text-[11px] text-slate-400 font-bold leading-relaxed">
                   We've identified <strong>KES 150,000</strong> received from a registered PIN. This has been flagged as taxable turnover. Please verify if this was internal transfer or sales.
                 </p>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .analyser-container { max-width: 1400px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    .btn-glow:hover { box-shadow: 0 0 30px rgba(16, 185, 129, 0.4); }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .delay-75 { animation-delay: 0.1s; }
    .delay-150 { animation-delay: 0.2s; }
    
    .card-glass-dark { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); }
    .category-select { appearance: none; cursor: pointer; }
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
