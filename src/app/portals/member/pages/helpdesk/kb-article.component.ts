import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { KbService, KbArticle } from '../../../../services/kb.service';

@Component({
  selector: 'app-kb-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="kb-container p-6 animate-fade-in">
      @if (article(); as art) {
        <nav class="mb-6 flex items-center text-sm text-slate-500">
          <a routerLink="/helpdesk/knowledge-base" class="hover:text-red-600 transition-colors">Knowledge Base</a>
          <svg class="mx-2" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <a [routerLink]="['/helpdesk/knowledge-base/category', art.category_id]" class="hover:text-red-600 transition-colors cursor-pointer">{{ art.category_name }}</a>
          <svg class="mx-2" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <span class="text-slate-800 font-medium truncate max-w-[200px]">{{ art.title }}</span>
        </nav>

        <article class="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm">
          <header class="mb-8 border-b border-slate-50 pb-8">
            <div class="flex items-center gap-2 mb-4">
              <span class="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">{{ art.category_name }}</span>
              <span class="text-slate-400 text-sm">•</span>
              <span class="text-slate-400 text-sm">{{ art.created_at | date }}</span>
            </div>
            <h1 class="text-4xl font-extrabold text-slate-900 leading-tight">{{ art.title }}</h1>
            
            <div class="mt-6 flex items-center gap-6 text-sm text-slate-500">
              <span class="view-count flex items-center gap-1.5">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/>
                </svg>
                {{ art.view_count }} views
              </span>
            </div>
          </header>

          <div class="prose prose-slate max-w-none text-slate-700 leading-relaxed" [innerHTML]="art.content"></div>

          <footer class="mt-12 pt-8 border-t border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="help-section">
              <h4 class="font-bold text-slate-800 mb-1">Was this article helpful?</h4>
              @if (!feedbackSent()) {
                <div class="flex gap-3">
                  <button 
                    (click)="sendFeedback(true)"
                    class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all flex items-center gap-2"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 10h4.708c.954 0 1.708.754 1.708 1.708 0 .153-.021.304-.061.448l-1.444 5.278c-.287 1.05-1.238 1.774-2.324 1.774H7V10l3-5c.5-.5 1.5-.5 1.5 1v4h2.5z" stroke-width="2"/></svg>
                    Yes
                  </button>
                  <button 
                    (click)="sendFeedback(false)"
                    class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all flex items-center gap-2"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="transform: scaleY(-1)"><path d="M14 10h4.708c.954 0 1.708.754 1.708 1.708 0 .153-.021.304-.061.448l-1.444 5.278c-.287 1.05-1.238 1.774-2.324 1.774H7V10l3-5c.5-.5 1.5-.5 1.5 1v4h2.5z" stroke-width="2"/></svg>
                    No
                  </button>
                </div>
              } @else {
                <p class="text-green-600 font-bold animate-fade-in flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  Thank you for your feedback!
                </p>
              }
            </div>

            <button 
              routerLink="/helpdesk/knowledge-base" 
              class="text-red-600 font-bold hover:underline flex items-center gap-2"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              All Articles
            </button>
          </footer>
        </article>
      } @else {
        <div class="flex justify-center items-center py-24">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .kb-container { max-width: 900px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .prose ::ng-deep p { margin-bottom: 1.5em; }
    .prose ::ng-deep h2 { font-size: 1.5rem; font-weight: 700; margin: 2em 0 1em; color: theme('colors.slate.800'); }
    .prose ::ng-deep ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; }
    .prose ::ng-deep li { margin-bottom: 0.5em; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KbArticleComponent implements OnInit {
  private kbService = inject(KbService);
  private route = inject(ActivatedRoute);
  
  article = signal<KbArticle | null>(null);
  feedbackSent = signal(false);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadArticle(slug);
      }
    });
  }

  private loadArticle(slug: string) {
    this.kbService.getArticle(slug).subscribe(res => {
      if (res.success) {
        this.article.set(res.data);
      }
    });
  }

  sendFeedback(isHelpful: boolean) {
    // In a real app, this would call an API
    this.feedbackSent.set(true);
  }
}
