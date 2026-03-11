import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AuctionItem {
  id: string;
  title: string;
  currentBid: number;
  reservePrice: number;
  totalBids: number;
  endTime: Date;
  imageUrl: string;
  category: string;
  status: 'Live' | 'Ending' | 'Closed';
}

@Component({
  selector: 'app-ibid-auction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container animate-fade-in">
      <div class="noise-overlay"></div>
      <header class="premium-header mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              ASSET LIQUIDATION TERMINAL
            </span>
          </div>
          <h1 class="premium-title">iBid <span class="gradient-text">Auctions</span></h1>
          <p class="premium-subtitle">Authorized bidding portal for statutory asset liquidations and public auctions</p>
        </div>
        
        <div class="flex items-center gap-6">
           <div class="glass-panel py-4 px-8 bg-white/[0.01] border-white/5 !rounded-2xl">
              <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Authenticated Liquidity</span>
              <span class="text-xl font-black text-emerald-400 tabular-nums tracking-tighter">KES 4,250,000</span>
           </div>
        </div>
      </header>

      <!-- Elite Category Strategy -->
      <div class="flex gap-4 mb-12 pb-6 overflow-x-auto no-scrollbar border-b border-white/5 relative z-20">
        @for (cat of categories; track cat) {
          <button 
            (click)="selectedCategory.set(cat)"
            class="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 border shrink-0 shadow-xl"
            [class.bg-amber-600]="selectedCategory() === cat"
            [class.text-white]="selectedCategory() === cat"
            [class.border-amber-500]="selectedCategory() === cat"
            [class.bg-slate-950]="selectedCategory() !== cat"
            [class.text-slate-500]="selectedCategory() !== cat"
            [class.border-white/5]="selectedCategory() !== cat"
            [class.hover:bg-white/5]="selectedCategory() !== cat"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- High-Definition Auction Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        @for (item of filteredAuctions(); track item.id) {
          <div class="group relative bg-white/[0.01] rounded-[3rem] border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all duration-700 flex flex-col shadow-2xl animate-up">
             <!-- Status Overlays -->
             <div class="absolute top-6 left-6 z-10 flex gap-3">
                <span 
                  class="px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10"
                  [class.bg-emerald-500/10]="item.status === 'Live'"
                  [class.text-emerald-400]="item.status === 'Live'"
                  [class.bg-red-500/10]="item.status === 'Ending'"
                  [class.text-red-400]="item.status === 'Ending'"
                >
                   <span class="inline-block w-1.5 h-1.5 rounded-full mr-2" [class.bg-emerald-500]="item.status === 'Live'" [class.bg-red-500]="item.status === 'Ending'" [class.animate-pulse]="true"></span>
                   {{ item.status }}
                </span>
                <span class="px-4 py-2 rounded-xl bg-slate-950/60 text-slate-400 font-black text-[9px] uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10">
                   {{ item.category }}
                </span>
             </div>

             <!-- Visual Media Placeholder -->
             <div class="aspect-[16/10] bg-slate-950 flex items-center justify-center p-1 relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent mix-blend-overlay group-hover:scale-110 transition-transform duration-1000"></div>
                <div class="absolute inset-0 border border-white/[0.02] z-10"></div>
                <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1" class="text-white/[0.03] group-hover:text-amber-500/10 transition-colors duration-700">
                   <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>

             <div class="p-10 flex-1 flex flex-col bg-white/[0.01]">
                <h3 class="text-xl font-black text-white tracking-tight mb-8 leading-snug group-hover:text-amber-400 transition-colors uppercase">{{ item.title }}</h3>
                
                <div class="grid grid-cols-2 gap-6 mb-10">
                   <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">Current Bid</span>
                      <span class="text-lg font-black text-white tabular-nums tracking-tighter">KES {{ item.currentBid.toLocaleString() }}</span>
                   </div>
                   <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-right">
                      <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">Protocol Count</span>
                      <span class="text-lg font-black text-white tabular-nums tracking-tighter">{{ item.totalBids }} BIDS</span>
                   </div>
                </div>

                <div class="mt-auto pt-8 border-t border-white/5 flex items-center justify-between gap-6">
                   <div class="flex-1">
                      <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Time Remaining</span>
                      <div class="text-[11px] font-black text-amber-500 tabular-nums tracking-[0.2em] font-mono">08H : 14M : 55S</div>
                   </div>
                   <button (click)="placeBid(item)" class="modern-btn border-white/10 text-slate-400 px-8 py-4 rounded-2xl hover:bg-amber-600 hover:text-white hover:border-amber-500 transition-all shadow-xl font-black text-[10px] uppercase tracking-widest">
                      ENTER BID
                   </button>
                </div>
             </div>
          </div>
        }
      </div>

      <!-- Statutory Disclaimer -->
      <footer class="mt-20 p-10 glass-panel border-white/5 bg-white/[0.01] text-center !rounded-[3rem]">
         <p class="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] leading-relaxed max-w-4xl mx-auto">
            ALL BIDS ARE BINDING UNDER THE PROVISIONS OF THE PUBLIC ASSET LIQUIDATION ACT. UNAUTHORIZED INTERFERENCE WITH DIGITAL AUCTION PROTOCOLS IS SUBJECT TO STATUTORY PENALTY.
         </p>
      </footer>
    </div>
  `,
  styles: [`
    .page-container { 
      min-height: 100vh; 
      background: #050505 url('/assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      color: #fff; 
      position: relative; 
      overflow-x: hidden; 
      padding: 60px 40px 100px;
    }
    
    .page-container::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.02; z-index: 2; pointer-events: none; }

    .premium-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
      margin-bottom: 40px;
    }

    .glass-panel {
      background: rgba(20, 20, 20, 0.4);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 32px;
      position: relative;
      z-index: 10;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .glass-panel:hover {
      background: rgba(20, 20, 20, 0.6);
      border-color: rgba(245, 158, 11, 0.3);
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class IBidAuctionComponent {
  categories = ['ALL ASSETS', 'REAL ESTATE', 'LOGISTICS', 'SEIZED GOODS', 'TECH & MEDIA', 'INDUSTRIAL'];
  selectedCategory = signal('ALL ASSETS');

  auctions = signal<AuctionItem[]>([
    {
      id: '1',
      title: 'LUXURY OFFICE SUITE - UPPER HILL NEXUS',
      currentBid: 24500000,
      reservePrice: 20000000,
      totalBids: 18,
      endTime: new Date(),
      imageUrl: '',
      category: 'REAL ESTATE',
      status: 'Live'
    },
    {
      id: '2',
      title: 'SCANIA HEAVY LOADER FLEET (3 UNITS)',
      currentBid: 12400000,
      reservePrice: 10000000,
      totalBids: 12,
      endTime: new Date(),
      imageUrl: '',
      category: 'LOGISTICS',
      status: 'Live'
    },
    {
      id: '3',
      title: 'HIGH-END MULTIMEDIA PRODUCTION KIT',
      currentBid: 850000,
      reservePrice: 700000,
      totalBids: 45,
      endTime: new Date(),
      imageUrl: '',
      category: 'TECH & MEDIA',
      status: 'Ending'
    },
    {
      id: '4',
      title: 'SEIZED ROLEX COSMOGRAPH DAYTONA',
      currentBid: 4200000,
      reservePrice: 3500000,
      totalBids: 67,
      endTime: new Date(),
      imageUrl: '',
      category: 'SEIZED GOODS',
      status: 'Live'
    },
    {
      id: '5',
      title: 'INDUSTRIAL GENERATOR GROUP (800KVA)',
      currentBid: 3100000,
      reservePrice: 2800000,
      totalBids: 5,
      endTime: new Date(),
      imageUrl: '',
      category: 'INDUSTRIAL',
      status: 'Live'
    }
  ]);

  filteredAuctions = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'ALL ASSETS') return this.auctions();
    return this.auctions().filter(a => a.category === cat);
  });

  placeBid(item: AuctionItem) {
    const increment = Math.floor(Math.random() * 50000) + 10000;
    this.auctions.update(prev => prev.map(a => 
      a.id === item.id 
        ? { ...a, currentBid: a.currentBid + increment, totalBids: a.totalBids + 1 }
        : a
    ));
  }
}
