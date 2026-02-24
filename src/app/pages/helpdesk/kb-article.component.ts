import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { KbService, KbArticle } from '../../services/kb.service';

@Component({
  selector: 'app-kb-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="kb-article-view p-6 animate-fade-in" *ngIf="article()">
      <!-- Breadcrumbs -->
      <nav class="flex mb-8 text-sm font-medium text-slate-400" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <a routerLink="/helpdesk/knowledge-base" class="hover:text-red-600 transition-colors">Knowledge Base</a>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
              <a [routerLink]="['/helpdesk/knowledge-base/category', article()?.category_id]" class="ml-1 hover:text-red-600 transition-colors">{{ article()?.category_name }}</a>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
              <span class="ml-1 text-slate-800 line-clamp-1">{{ article()?.title }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div class="article-container max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
        <header class="mb-10 text-center">
          <div class="mb-4">
            <span class="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-full">
              {{ article()?.category_name }}
            </span>
          </div>
          <h1 class="text-4xl font-black text-slate-800 tracking-tight leading-tight">{{ article()?.title }}</h1>
          <div class="mt-6 flex items-center justify-center gap-6 text-slate-400 text-sm">
            <span class="flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-width="2"/></svg>
              Updated on {{ article()?.created_at | date:'longDate' }}
            </span>
            <span class="flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
              {{ article()?.view_count }} views
            </span>
          </div>
        </header>

        <article class="prose prose-slate max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-red-600 prose-strong:text-slate-900">
           <!-- Render content as HTML - assuming it's safe or sanitized on backend -->
           <div [innerHTML]="article()?.content" class="article-content whitespace-pre-wrap"></div>
        </article>

        <footer class="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between">
          <div class="feedback flex items-center gap-4">
            <span class="text-sm font-bold text-slate-500">Was this article helpful?</span>
            <div class="flex gap-2">
              <button class="px-5 py-2 rounded-xl bg-slate-50 hover:bg-green-50 hover:text-green-600 border border-slate-100 transition-all font-bold text-sm">Yes</button>
              <button class="px-5 py-2 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-600 border border-slate-100 transition-all font-bold text-sm">No</button>
            </div>
          </div>
          <button routerLink="/helpdesk/create" class="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
            Still need help? Create a ticket
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .kb-article-view { max-width: 1200px; margin: 0 auto; }
    .article-content { font-size: 1.125rem; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class KbArticleComponent implements OnInit {
  private kbService = inject(KbService);
  private route = inject(ActivatedRoute);

  article = signal<KbArticle | null>(null);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.kbService.getArticle(slug).subscribe(res => {
        if (res.success) this.article.set(res.data);
      });
    }
  }
}
