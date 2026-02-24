import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { KbService, KbArticle, KbCategory } from '../../services/kb.service';

@Component({
  selector: 'app-kb-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="kb-category-view p-6 animate-fade-in" *ngIf="category()">
      <!-- Breadcrumbs -->
      <nav class="flex mb-8 text-sm font-medium text-slate-400" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <a routerLink="/helpdesk/knowledge-base" class="hover:text-red-600 transition-colors">Knowledge Base</a>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
              <span class="ml-1 text-slate-800">{{ category()?.name }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div class="category-header mb-12">
        <div class="flex items-center gap-4">
          <div class="category-icon p-4 bg-red-50 text-red-500 rounded-2xl">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-slate-800">{{ category()?.name }}</h1>
            <p class="text-slate-500 mt-1">{{ category()?.description }}</p>
          </div>
        </div>
      </div>

      <!-- Articles List -->
      <div class="articles-list space-y-4 max-w-4xl">
        <div *ngFor="let art of articles()" class="article-card group p-6 bg-white rounded-2xl border border-slate-100 hover:border-red-500/20 hover:shadow-lg transition-all cursor-pointer" [routerLink]="['/helpdesk/knowledge-base/article', art.slug]">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-bold text-slate-800 group-hover:text-red-600 transition-colors">{{ art.title }}</h3>
              <div class="flex items-center mt-2 text-xs text-slate-400 gap-4">
                <span class="flex items-center gap-1">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2"/></svg>
                  {{ art.created_at | date:'mediumDate' }}
                </span>
                <span class="flex items-center gap-1">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                  {{ art.view_count }} views
                </span>
              </div>
            </div>
            <svg class="text-slate-200 group-hover:text-red-400 transform group-hover:translate-x-1 transition-all" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div *ngIf="articles().length === 0" class="py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 text-center text-slate-400">
           No articles found in this category yet.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kb-category-view { max-width: 1200px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class KbCategoryComponent implements OnInit {
  private kbService = inject(KbService);
  private route = inject(ActivatedRoute);

  category = signal<KbCategory | null>(null);
  articles = signal<KbArticle[]>([]);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      // First get the category data from the list
      this.kbService.getCategories().subscribe(res => {
        if (res.success) {
          this.category.set(res.data.find((c: any) => c.id === id) || null);
        }
      });

      // Get articles for this category
      this.kbService.getArticles(id).subscribe(res => {
        if (res.success) this.articles.set(res.data);
      });
    }
  }
}
