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
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              REVENUE DISCOVERY ENGINE
            </span>
          </div>
          <h1 class="premium-title">M-PESA <span class="gradient-text">Analyser</span></h1>
          <p class="premium-subtitle">Automated extraction and classification of taxable liquidity from digital payment archives</p>
        </div>
        
        <button class="modern-btn border-white/10 text-slate-400 px-6 py-4 rounded-2xl hover:bg-white/[0.05] hover:text-white transition-all shadow-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3">
           <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
           Protocol Handbook
        </button>
      </header>

      @if (!isLoaded()) {
        <!-- Enhanced Upload State -->
        <div class="glass-panel p-20 lg:p-32 text-center border-dashed border-2 border-white/10 hover:border-emerald-500/30 transition-all group !rounded-[3rem] relative overflow-hidden">
           <div class="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-all"></div>
           
           <div class="w-24 h-24 bg-slate-950 border border-white/5 text-emerald-400 rounded-3xl flex items-center justify-center mb-10 mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 relative z-10">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
           </div>
           
           <h2 class="text-3xl font-black text-white mb-4 tracking-tighter uppercase relative z-10">Initialize Statement Parsing</h2>
           <p class="text-slate-500 max-w-md mx-auto mb-12 text-[11px] font-bold uppercase tracking-widest leading-relaxed relative z-10 opacity-70">Safaricom fiscal archives (PDF/CSV) are processed through an isolated clearing engine for statutory classification.</p>
           
           <button (click)="simulateUpload()" [disabled]="isParsing()" class="modern-btn primary-btn py-5 px-12 bg-emerald-600 border-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 elite-glow !rounded-2xl relative z-10">
              <span class="flex items-center gap-4">
                @if (isParsing()) {
                  <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  PARSING ARCHIVE...
                } @else {
                  EXECUTE DISCOVERY PROTOCOL
                }
              </span>
           </button>
        </div>
      } @else {
        <!-- Premium Analysis Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
           <!-- Transactions Table -->
           <div class="animate-up">
              <div class="glass-panel p-0 overflow-hidden bg-white/[0.01] border-white/5 relative">
                 <div class="p-8 border-b border-white/5 bg-white/[0.01]">
                    <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest">Classification Ledger</h3>
                 </div>
                 <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                       <thead>
                          <tr class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] border-b border-white/5 bg-white/[0.02]">
                             <th class="px-8 py-5">Protocol / Entity</th>
                             <th class="px-8 py-5">Classification</th>
                             <th class="px-8 py-5 text-right">Liquidity (KES)</th>
                             <th class="px-8 py-5 text-right">Statutory Action</th>
                          </tr>
                       </thead>
                       <tbody class="divide-y divide-white/[0.02]">
                          @for (tx of transactions(); track tx.receiptNo) {
                             <tr class="hover:bg-white/[0.01] transition-all group">
                                <td class="px-8 py-6">
                                   <div class="flex flex-col gap-1">
                                      <span class="text-white font-black text-sm tracking-tight group-hover:text-blue-400 transition-colors uppercase">{{ tx.details }}</span>
                                      <span class="text-slate-600 text-[9px] font-black tracking-[0.2em] font-mono">{{ tx.receiptNo }}</span>
                                   </div>
                                </td>
                                <td class="px-8 py-6">
                                   <span class="status-pill-elite active">
                                      <span class="dot"></span>
                                      {{ tx.type | uppercase }}
                                   </span>
                                </td>
                                <td class="px-8 py-6 text-right">
                                   <span class="font-black tabular-nums tracking-tighter" [class]="tx.amount > 0 ? 'text-emerald-500 text-sm' : 'text-slate-500 text-xs'">
                                      {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount | number:'1.2-2' }}
                                   </span>
                                </td>
                                <td class="px-8 py-6 text-right">
                                   <select class="bg-slate-950 border-white/5 rounded-xl text-white text-[9px] font-black uppercase tracking-widest p-2 focus:border-blue-500/50 transition-all outline-none">
                                      <option [value]="tx.category">{{ tx.category }}</option>
                                      <option value="Personal">PERSONAL ARCHIVE</option>
                                      <option value="VAT Sales">VAT REVENUE</option>
                                      <option value="TOT Turnover">TOT LIQUIDITY</option>
                                   </select>
                                </td>
                             </tr>
                          }
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>

           <!-- Performance Insights Sidebar -->
           <div class="space-y-8 animate-up delay-1">
              <div class="glass-panel p-8 bg-white/[0.01] border-white/5 relative overflow-hidden group">
                 <div class="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                 
                 <div class="flex items-center gap-4 mb-10 relative z-10">
                    <div class="w-12 h-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-blue-400 shadow-2xl group-hover:scale-110 transition-transform">
                       <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div class="flex flex-col">
                       <h3 class="text-xs font-black text-white uppercase tracking-tight">Discovery Matrix</h3>
                       <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Real-time Analytics</span>
                    </div>
                 </div>
                 
                 <div class="space-y-6 relative z-10">
                    <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all">
                       <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">Total Fiscal Liquidity</span>
                       <h4 class="text-3xl font-black text-white tracking-tighter tabular-nums mb-1"><span class="text-xs text-slate-600 mr-2">KES</span>{{ insights().totalIncome | number:'1.2-2' }}</h4>
                       <div class="flex items-center gap-2 mt-2">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span class="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Identification Verified</span>
                       </div>
                    </div>
                    
                    <div class="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 hover:border-amber-500/30 transition-all">
                       <span class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">Operational Outflows</span>
                       <h4 class="text-3xl font-black text-amber-500 tracking-tighter tabular-nums mb-1"><span class="text-xs text-slate-600 mr-2">KES</span>{{ insights().businessExpenses | number:'1.2-2' }}</h4>
                    </div>
                    
                    <div class="pt-8 space-y-4">
                       <button (click)="syncToVat()" class="modern-btn primary-btn w-full py-4 bg-blue-600 border-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 elite-glow !rounded-2xl">
                          <span class="flex items-center justify-center gap-3">
                             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                             SYNCHRONIZE TO VAT
                          </span>
                       </button>
                       <button (click)="syncToTot()" class="modern-btn w-full py-4 bg-slate-900 border-white/5 text-slate-500 hover:text-white hover:border-blue-500/30 font-black text-[10px] uppercase tracking-[0.2em] !rounded-2xl transition-all">
                          <span class="flex items-center justify-center gap-3">
                             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                             INJECT INTO TOT RETURN
                          </span>
                       </button>
                    </div>
                 </div>
              </div>
              
              <div class="glass-panel p-8 bg-gradient-to-br from-amber-600/10 to-transparent border-amber-600/20 relative overflow-hidden group">
                 <div class="absolute -right-12 -bottom-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all"></div>
                 <div class="flex flex-col gap-4 relative z-10">
                    <div class="flex items-center gap-3 text-amber-500">
                       <div class="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                       </div>
                       <h4 class="font-black text-[10px] uppercase tracking-[0.2em]">Manual Review Queue</h4>
                    </div>
                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      Statutory identification detected <strong class="text-white">KES 150,000</strong> from a registered entity. Action required: Verify if internal liquidity or commercial revenue.
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
    this.router.navigate(['/member/tax-engine/file/vat']);
  }

  syncToTot() {
    this.router.navigate(['/member/tax-engine/file/tot']);
  }
}
