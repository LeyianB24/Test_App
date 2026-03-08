import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
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
  imports: [FormsModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <header class="mb-12 flex justify-between items-end">
        <div>
          <div class="flex items-center gap-4 mb-2">
            <span class="px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-[10px] uppercase tracking-widest">Asset Liquidation</span>
          </div>
          <h1 class="text-6xl font-black text-white tracking-tighter mb-4">iBid <span class="text-amber-500">Auctions</span></h1>
          <p class="text-slate-400 font-medium text-lg max-w-2xl">Bidding portal for government assets and public liquidations.</p>
        </div>
        <div class="flex gap-4">
           <div class="p-6 bg-white/5 rounded-3xl border border-white/5 text-right">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Available Funds</span>
              <span class="text-2xl font-black text-emerald-400 tabular-nums">KES 4,250,000</span>
           </div>
        </div>
      </header>

      <!-- Category Filter -->
      <div class="flex gap-3 mb-10 pb-4 overflow-x-auto no-scrollbar">
        @for (cat of categories; track cat) {
          <button 
            (click)="selectedCategory.set(cat)"
            class="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border shrink-0"
            [class.bg-amber-600]="selectedCategory() === cat"
            [class.text-white]="selectedCategory() === cat"
            [class.border-amber-500]="selectedCategory() === cat"
            [class.bg-white/5]="selectedCategory() !== cat"
            [class.text-slate-500]="selectedCategory() !== cat"
            [class.border-white/5]="selectedCategory() !== cat"
            [class.hover:bg-white/10]="selectedCategory() !== cat"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Auction Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @for (item of filteredAuctions(); track item.id) {
          <div class="group relative bg-white/5 rounded-[3.5rem] border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all duration-500 flex flex-col">
             <!-- Status Overlay -->
             <div class="absolute top-6 left-6 z-10 flex gap-2">
                <span 
                  class="px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest backdrop-blur-md"
                  [class.bg-emerald-500/10]="item.status === 'Live'"
                  [class.text-emerald-400]="item.status === 'Live'"
                  [class.bg-red-500/10]="item.status === 'Ending'"
                  [class.text-red-400]="item.status === 'Ending'"
                >
                   ● {{ item.status }}
                </span>
                <span class="px-4 py-1.5 rounded-full bg-black/40 text-white font-black text-[9px] uppercase tracking-widest backdrop-blur-md">
                   {{ item.category }}
                </span>
             </div>

             <!-- Image placeholder (simulated) -->
             <div class="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-1 relative overflow-hidden">
                <div class="absolute inset-0 bg-amber-500/10 mix-blend-overlay group-hover:opacity-100 opacity-0 transition-opacity"></div>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-white/10"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="1.5"/></svg>
             </div>

             <div class="p-10 flex-1 flex flex-col">
                <h3 class="text-2xl font-black text-white tracking-tight mb-8 leading-tight group-hover:text-amber-400 transition-colors">{{ item.title }}</h3>
                
                <div class="grid grid-cols-2 gap-6 mb-10">
                   <div>
                      <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Current Bid</span>
                      <span class="text-xl font-black text-white tabular-nums">KES {{ item.currentBid.toLocaleString() }}</span>
                   </div>
                   <div class="text-right">
                      <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Volume</span>
                      <span class="text-xl font-black text-white tabular-nums">{{ item.totalBids }} Bids</span>
                   </div>
                </div>

                <div class="mt-auto pt-6 border-t border-white/5 flex items-center justify-between gap-4">
                   <div class="flex-1">
                      <span class="text-[9px] font-black text-amber-600/50 uppercase tracking-widest block mb-2">Time Remaining</span>
                      <div class="text-sm font-bold text-slate-400 tabular-nums">08h : 14m : 55s</div>
                   </div>
                   <button (click)="placeBid(item)" class="bg-white/5 hover:bg-amber-600 text-slate-300 hover:text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/5">
                      Enter Bid
                   </button>
                </div>
             </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class IBidAuctionComponent {
  categories = ['All Assets', 'Real Estate', 'Logistics', 'Seized Goods', 'Tech & Media', 'Industrial'];
  selectedCategory = signal('All Assets');

  auctions = signal<AuctionItem[]>([
    {
      id: '1',
      title: 'Luxury Office Suite - Upper Hill Nexus',
      currentBid: 24500000,
      reservePrice: 20000000,
      totalBids: 18,
      endTime: new Date(),
      imageUrl: '',
      category: 'Real Estate',
      status: 'Live'
    },
    {
      id: '2',
      title: 'Scania Heavy Loader Fleet (3 Units)',
      currentBid: 12400000,
      reservePrice: 10000000,
      totalBids: 12,
      endTime: new Date(),
      imageUrl: '',
      category: 'Logistics',
      status: 'Live'
    },
    {
      id: '3',
      title: 'High-End Multimedia Production Kit',
      currentBid: 850000,
      reservePrice: 700000,
      totalBids: 45,
      endTime: new Date(),
      imageUrl: '',
      category: 'Tech & Media',
      status: 'Ending'
    },
    {
      id: '4',
      title: 'Seized Rolex Cosmograph Daytona',
      currentBid: 4200000,
      reservePrice: 3500000,
      totalBids: 67,
      endTime: new Date(),
      imageUrl: '',
      category: 'Seized Goods',
      status: 'Live'
    },
    {
      id: '5',
      title: 'Industrial Generator Group (800kVA)',
      currentBid: 3100000,
      reservePrice: 2800000,
      totalBids: 5,
      endTime: new Date(),
      imageUrl: '',
      category: 'Industrial',
      status: 'Live'
    }
  ]);

  filteredAuctions = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'All Assets') return this.auctions();
    return this.auctions().filter(a => a.category === cat);
  });

  placeBid(item: AuctionItem) {
    // Simulated real-time bidding update
    const increment = Math.floor(Math.random() * 50000) + 10000;
    this.auctions.update(prev => prev.map(a => 
      a.id === item.id 
        ? { ...a, currentBid: a.currentBid + increment, totalBids: a.totalBids + 1 }
        : a
    ));
  }
}
