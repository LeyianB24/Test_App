import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { KbService, KbArticle } from '../../../../services/kb.service';

@Component({
  selector: 'app-kb-article',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      @if (article(); as art) {
        <nav class="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-tertiary">
          <a routerLink="/helpdesk/knowledge-base" class="hover:text-accent transition-colors">Knowledge Base</a>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M9 5l7 7-7 7"/></svg>
          <a [routerLink]="['/helpdesk/knowledge-base/category', art.category_id]" class="hover:text-accent transition-colors">{{ art.category_name }}</a>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M9 5l7 7-7 7"/></svg>
          <span class="text-primary truncate max-w-[200px]">{{ art.title }}</span>
        </nav>

        <article class="content-card-premium p-10 md:p-16 relative overflow-hidden">
          <div class="absolute -top-20 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl opacity-30"></div>
          
          <header class="mb-12 border-b border-default pb-10 relative z-10">
            <div class="flex items-center gap-3 mb-6">
              <span class="badge-precision badge-compliant">
                 {{ art.category_name }}
              </span>
              <span class="text-[10px] font-black text-tertiary uppercase tracking-widest">Published {{ art.created_at | date }}</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-black text-primary leading-tight">{{ art.title }}</h1>
            
            <div class="mt-8 flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-tertiary">
              <span class="flex items-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2.5"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2.5"/></svg>
                {{ art.view_count | number }} Views
              </span>
            </div>
          </header>

          <div class="protocol-content relative z-10 prose-elite" [innerHTML]="art.content"></div>

          <footer class="mt-20 pt-12 border-t border-default flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
            <div class="feedback-sector">
              <h4 class="text-xs font-black text-tertiary uppercase tracking-widest mb-6">Was this article helpful?</h4>
              @if (!feedbackSent()) {
                <div class="flex gap-4">
                  <button 
                    (click)="sendFeedback(true)"
                    class="modern-btn outline-btn px-6 py-3 flex items-center gap-2 hover:bg-status-success"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M14 10h4.708c.954 0 1.708.754 1.708 1.708 0 .153-.021.304-.061.448l-1.444 5.278c-.287 1.05-1.238 1.774-2.324 1.774H7V10l3-5c.5-.5 1.5-.5 1.5 1v4h2.5z" stroke-width="2.5"/></svg>
                    Helpful
                  </button>
                  <button 
                    (click)="sendFeedback(false)"
                    class="modern-btn outline-btn px-6 py-3 flex items-center gap-2 hover:bg-status-danger"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="transform: scaleY(-1)"><path d="M14 10h4.708c.954 0 1.708.754 1.708 1.708 0 .153-.021.304-.061.448l-1.444 5.278c-.287 1.05-1.238 1.774-2.324 1.774H7V10l3-5c.5-.5 1.5-.5 1.5 1v4h2.5z" stroke-width="2.5"/></svg>
                    Not Helpful
                  </button>
                </div>
              } @else {
                <div class="p-4 bg-status-success border border-success-border/30 rounded-2xl flex items-center gap-3 text-success font-black text-xs animate-up">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  Thank you for your feedback
                </div>
              }
            </div>

            <button 
              routerLink="/helpdesk/knowledge-base" 
              class="modern-btn primary-btn sm"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2">
                <path stroke-width="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Knowledge Base
            </button>
          </footer>
        </article>
      } @else {
        <div class="flex flex-col items-center justify-center py-40">
           <div class="w-12 h-12 border-4 border-default border-t-accent rounded-full animate-spin mb-4"></div>
           <p class="text-[10px] font-black uppercase tracking-widest text-tertiary">Loading Article...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 1000px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    .animate-up { animation: up 0.4s ease-out; }
    @keyframes up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .prose-elite ::ng-deep p { color: var(--text-secondary); font-weight: 500; line-height: 1.8; margin-bottom: 2rem; font-size: 1.05rem; }
    .prose-elite ::ng-deep h2 { color: var(--text-primary); font-weight: 900; font-size: 1.75rem; margin: 3rem 0 1.5rem; letter-spacing: -0.02em; }
    .prose-elite ::ng-deep ul { list-style-type: disc; padding-left: 2rem; margin-bottom: 2rem; }
    .prose-elite ::ng-deep li { margin-bottom: 1rem; color: var(--text-secondary); font-weight: 500; }
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
