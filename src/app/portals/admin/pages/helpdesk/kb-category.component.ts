import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { KbService, KbArticle, KbCategory } from '../../../../services/kb.service';

@Component({
  selector: 'app-kb-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      @if (category(); as cat) {
        <nav class="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <a routerLink="/helpdesk/knowledge-base" class="hover:text-red-500 transition-colors">Repository</a>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M9 5l7 7-7 7"/></svg>
          <span class="text-slate-800">{{ cat.name }}</span>
        </nav>

        <header class="page-header-elite mb-12">
           <div class="header-info">
              <h1 class="premium-title">{{ cat.name }}</h1>
              <p class="premium-subtitle pl-0 mt-1">{{ cat.description }}</p>
           </div>
        </header>

        <div class="grid grid-cols-1 gap-6">
          @for (art of articles(); track art.id) {
            <div 
              class="content-card-premium p-8 hover:border-red-500/30 transition-all cursor-pointer group flex justify-between items-center"
              [routerLink]="['/helpdesk/knowledge-base/article', art.slug]"
            >
              <div class="flex-1">
                <h3 class="text-2xl font-black text-slate-800 group-hover:text-red-600 transition-colors mb-3">{{ art.title }}</h3>
                <div class="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span class="flex items-center gap-1.5">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2.5"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2.5"/></svg>
                    {{ art.view_count | number }} Accesses
                  </span>
                  <span>Published {{ art.created_at | date }}</span>
                </div>
              </div>
              <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          } @empty {
            <div class="py-20 text-center opacity-50 bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <p class="text-xs font-black uppercase tracking-[0.2em] text-slate-500 italic">No protocols found in this sector</p>
            </div>
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-40">
           <div class="w-12 h-12 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
           <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Sector Data...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 1100px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KbCategoryComponent implements OnInit {
  private kbService = inject(KbService);
  private route = inject(ActivatedRoute);
  
  category = signal<KbCategory | null>(null);
  articles = signal<KbArticle[]>([]);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadCategory(id);
        this.loadArticles(id);
      }
    });
  }

  private loadCategory(id: number) {
    this.kbService.getCategories().subscribe(res => {
      if (res.success) {
        const cat = res.data.find((c: KbCategory) => c.id === id);
        this.category.set(cat || null);
      }
    });
  }

  private loadArticles(id: number) {
    this.kbService.getArticles(id).subscribe(res => {
      if (res.success) {
        this.articles.set(res.data);
      }
    });
  }
}
