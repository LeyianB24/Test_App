import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { KbService, KbArticle, KbCategory } from '../../services/kb.service';

@Component({
  selector: 'app-kb-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="kb-container p-6 animate-fade-in">
      @if (category()) {
        <nav class="mb-6 flex items-center text-sm text-slate-500">
          <a routerLink="/helpdesk/knowledge-base" class="hover:text-red-600 transition-colors">Knowledge Base</a>
          <svg class="mx-2" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-slate-800 font-medium">{{ category()?.name }}</span>
        </nav>

        <div class="kb-header mb-8">
          <h1 class="text-3xl font-bold text-slate-800 mb-2">{{ category()?.name }}</h1>
          <p class="text-slate-500 max-w-2xl">{{ category()?.description }}</p>
        </div>

        <div class="articles-list space-y-4">
          @for (art of articles(); track art.id) {
            <div 
              class="article-card p-5 bg-white rounded-2xl border border-slate-100 hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/5 transition-all cursor-pointer group"
              [routerLink]="['/helpdesk/knowledge-base/article', art.slug]"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors mb-2">{{ art.title }}</h3>
                  <div class="flex items-center gap-4 text-xs text-slate-400">
                    <span class="view-count flex items-center gap-1">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/>
                      </svg>
                      {{ art.view_count }} views
                    </span>
                    <span>Published on {{ art.created_at | date }}</span>
                  </div>
                </div>
                <svg class="text-slate-300 group-hover:text-red-400 transform group-hover:translate-x-1 transition-all" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          } @empty {
            <div class="py-12 text-center text-slate-400 italic bg-white rounded-3xl border border-dashed border-slate-200">
              No articles found in this category.
            </div>
          }
        </div>
      } @else {
        <div class="flex justify-center items-center py-24">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .kb-container { max-width: 1000px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
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
