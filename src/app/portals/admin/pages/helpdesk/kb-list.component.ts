import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KbService, KbCategory } from '../../../services/kb.service';

@Component({
  selector: 'app-kb-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Knowledge Header Manifold -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Institutional Wisdom Repository</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                Knowledge <span class="text-stroke-sm">Spectrum</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                STATUTORY PROTOCOLS // CORE ARCHIVE NODE: MEM-KRA-NODE-04
              </p>
            </div>

            <div class="flex-grow md:flex-grow-0 md:min-w-[500px] relative group/search">
               <div class="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                 <svg class="w-5 h-5 text-muted group-focus-within/search:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </div>
               <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="search()" 
                  placeholder="Decrypt Knowledge Vector / Protocol..." 
                  class="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-sm font-black transition-all focus:border-accent/40 outline-none focus:bg-accent/5 tracking-tight uppercase shadow-2xl">
            </div>
          </div>
        </header>

        <!-- Dynamic Category Manifold -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           @if (loading()) {
              @for (i of [1,2,3,4,5,6,7,8]; track i) {
                <div class="glass-panel h-64 animate-pulse bg-white/[0.02] border-white/5 rounded-[2.5rem]"></div>
              }
           } @else {
              @for (cat of categories(); track cat.id) {
                <div class="glass-panel p-10 hover:border-accent/30 transition-all group relative overflow-hidden flex flex-col justify-between cursor-pointer" (click)="viewCategory(cat.id)">
                   <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
                   
                   <div class="space-y-6 relative z-10">
                      <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      </div>
                      
                      <div class="space-y-2">
                        <h3 class="text-xl font-black text-primary uppercase tracking-tighter leading-tight">{{ cat.name }}</h3>
                        <p class="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed">{{ cat.description }}</p>
                      </div>
                   </div>

                   <div class="pt-8 flex items-center justify-between relative z-10">
                      <span class="text-[9px] font-black text-accent uppercase tracking-widest">{{ cat.article_count }} PROTOCOLS</span>
                      <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M13 7l5 5-5 5M6 7l5 5-5 5"/></svg>
                      </div>
                   </div>

                   <!-- Background Aura -->
                   <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              }
           }
        </div>

        @if (!loading() && categories().length === 0) {
           <div class="py-40 flex flex-col items-center justify-center gap-8">
              <div class="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-muted border border-white/10">
                 <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <p class="text-[11px] font-black text-muted uppercase tracking-[0.4em]">Wisdom Cluster Empty</p>
           </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .db-root {
      min-height: 100vh;
      background: #050505;
      position: relative;
      overflow-x: hidden;
      color: #e2e8f0;
      padding: 3.5rem;
    }

    .noise-overlay {
      position: fixed;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.015;
      pointer-events: none;
      z-index: 1;
    }

    .content-area {
      position: relative;
      z-index: 2;
      max-width: 1700px;
      margin: 0 auto;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 2.5rem;
    }

    .text-stroke-sm {
      -webkit-text-stroke: 1px currentColor;
      color: transparent;
    }

    .animate-stagger > * {
      animation: stg 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes stg {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
  `]
})
export class KbListComponent implements OnInit {
  private kbSvc = inject(KbService);

  loading = signal(true);
  categories = signal<KbCategory[]>([]);
  searchQuery = '';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.kbSvc.getCategories(this.searchQuery).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.categories.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  search() {
    this.loadCategories();
  }

  viewCategory(id: number) {
    console.log('Navigating to wisdom cluster ID:', id);
  }
}
