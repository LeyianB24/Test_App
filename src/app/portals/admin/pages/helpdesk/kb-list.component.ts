import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KbService, KbCategory } from '../../../../services/kb.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-kb-list',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <header class="page-header-elite mb-10">
        <div class="header-info text-center w-full">
          <h1 class="premium-title">Knowledge <span class="gradient-text">Base</span></h1>
          <p class="premium-subtitle pl-0 mt-1">Institutional wisdom and protocol documentation</p>
          
          <div class="mt-8 max-w-2xl mx-auto relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="onSearch()"
              placeholder="Query institutional data (e.g. nil return, payment protocols)..."
              class="search-input-elite w-full py-5 px-14 text-sm font-medium relative z-10"
            />
            <svg class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 z-20 group-hover:text-red-500 transition-colors" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      <!-- Search Results -->
      @if (isSearching()) {
        <div class="search-results mb-12 animate-fade-in">
          <div class="flex items-center gap-2 mb-8 ml-2">
             <div class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
             <h2 class="text-xs font-black text-slate-500 uppercase tracking-widest">Protocol Search Matches</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (art of searchResults(); track art.slug) {
              <div class="content-card-premium p-6 hover:border-red-200 transition-all cursor-pointer group" [routerLink]="['/helpdesk/knowledge-base/article', art.slug]">
                <h3 class="font-black text-slate-800 group-hover:text-red-600 transition-colors mb-4">{{ art.title }}</h3>
                <div class="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span class="flex items-center gap-1.5">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2.5"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2.5"/></svg>
                    {{ art.view_count | number }} Accesses
                  </span>
                </div>
              </div>
            } @empty {
              <div class="col-span-full py-20 text-center opacity-50">
                <p class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 italic">No protocols match "{{ searchQuery }}"</p>
              </div>
            }
          </div>
        </div>
      }

      <!-- Categories Grid -->
      @if (!isSearching()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          @for (cat of categories(); track cat.id) {
            <div class="content-card-premium group p-8 hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-500/5 transition-all cursor-pointer" [routerLink]="['/helpdesk/knowledge-base/category', cat.id]">
              <div class="w-16 h-16 rounded-2xl bg-slate-50 group-hover:bg-red-50 flex items-center justify-center mb-6 transition-colors border border-slate-100 group-hover:border-red-100">
                 <svg class="text-slate-400 group-hover:text-red-600 transition-colors" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                 </svg>
              </div>
              <h3 class="text-2xl font-black text-slate-800 group-hover:text-red-600 transition-colors mb-3">{{ cat.name }}</h3>
              <p class="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6">{{ cat.description }}</p>
              <div class="pt-6 border-t border-slate-50 flex justify-between items-center mt-auto">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ cat.article_count }} Documents</span>
                <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 1500px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class KbListComponent implements OnInit {
  private kbService = inject(KbService);
  
  categories = signal<KbCategory[]>([]);
  searchQuery = '';
  isSearching = signal(false);
  searchResults = signal<any[]>([]);

  ngOnInit() {
    this.kbService.getCategories().subscribe(res => {
      if (res.success) this.categories.set(res.data);
    });
  }

  onSearch() {
    if (this.searchQuery.length >= 3) {
      this.isSearching.set(true);
      this.kbService.search(this.searchQuery).subscribe(res => {
        if (res.success) this.searchResults.set(res.data);
      });
    } else {
      this.isSearching.set(false);
      this.searchResults.set([]);
    }
  }
}
