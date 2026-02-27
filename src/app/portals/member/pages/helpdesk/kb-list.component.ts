import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KbService, KbCategory, KbArticle } from '../../../../services/kb.service';

@Component({
  selector: 'app-kb-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <!-- Elite Hero Search -->
      <section class="mb-16 text-center py-20 bg-gradient-to-b from-blue-600/10 to-transparent rounded-[4rem] border border-white/5 relative overflow-hidden">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-blue-500/10 opacity-50"></div>
        
        <div class="relative z-10 max-w-3xl mx-auto px-6">
          <h1 class="text-6xl font-black text-white tracking-tighter mb-6">How can we <span class="text-blue-500">help you?</span></h1>
          <p class="text-slate-400 text-lg font-medium mb-12">Search our extensive repository for instant technical resolutions</p>
          
          <div class="relative group">
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (keyup.enter)="onSearch()"
              placeholder="Search guides, regulations, or filing instructions..." 
              class="w-full bg-slate-900 border-2 border-white/10 text-white px-10 py-6 rounded-[2rem] focus:border-blue-500 outline-none font-bold text-lg shadow-2xl transition-all group-hover:border-white/20"
            >
            <button (click)="onSearch()" class="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all">
               <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </div>
        </div>
      </section>

      @if (searchResults().length > 0) {
        <!-- Search Results Surface -->
        <section class="mb-20">
          <div class="flex items-center justify-between mb-8 px-4">
            <h2 class="text-2xl font-black text-white tracking-tight">Search Investigations</h2>
            <button (click)="searchResults.set([])" class="text-blue-500 font-bold text-xs uppercase tracking-widest">Clear Index</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (article of searchResults(); track article.id) {
              <div [routerLink]="['/helpdesk/knowledge-base/article', article.slug]" class="card-glass p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group">
                  <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 block">{{ article.category_name || 'Guide' }}</span>
                  <h3 class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{{ article.title }}</h3>
                  <p class="text-slate-500 text-sm line-clamp-2">{{ article.content }}</p>
              </div>
            }
          </div>
        </section>
      }

      <!-- Category Spectrum -->
      <section>
        <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-10 px-4">Knowledge Spectrum</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          @for (category of kbService.categories(); track category.id) {
            <div [routerLink]="['/helpdesk/knowledge-base/category', category.id]" class="card-glass p-10 rounded-[3rem] border border-white/5 hover:border-blue-500/30 hover:bg-slate-800 transition-all cursor-pointer group flex flex-col items-center text-center">
               <div class="w-20 h-20 bg-blue-600/10 text-blue-500 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-2xl shadow-blue-500/5">
                   <svg class="text-3xl" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                   </svg>
               </div>
               <h3 class="text-2xl font-black text-white mb-3 tracking-tight">{{ category.name }}</h3>
               <p class="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{{ category.description }}</p>
               <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/5">{{ category.article_count || 0 }} Articles</span>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1500px; margin: 0 auto; }
    .card-glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class KbListComponent {
  public kbService = inject(KbService);
  searchQuery = '';
  searchResults = signal<KbArticle[]>([]);

  onSearch(): void {
    if (!this.searchQuery.trim()) return;
    this.kbService.search(this.searchQuery).subscribe({
      next: (resp) => {
        if (resp.success) this.searchResults.set(resp.data);
      }
    });
  }
}
