import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { KbService, KbArticle } from '../../../../services/kb.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-kb-article',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <!-- Elite Breadcrumb -->
      <nav class="mb-12 flex items-center gap-4">
        <a routerLink="/helpdesk/knowledge-base" class="text-blue-500 hover:text-blue-400 font-black uppercase text-[10px] tracking-widest transition-colors">Knowledge Base</a>
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-slate-600"><path d="M9 18l6-6-6-6" stroke-width="3"/></svg>
        <a [routerLink]="['/helpdesk/knowledge-base/category', article()?.category_id]" class="text-blue-500 hover:text-blue-400 font-black uppercase text-[10px] tracking-widest transition-colors">{{ article()?.category_name }}</a>
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-slate-600"><path d="M9 18l6-6-6-6" stroke-width="3"/></svg>
        <span class="text-slate-500 font-bold text-[10px] uppercase tracking-widest truncate max-w-[200px]">{{ article()?.title }}</span>
      </nav>

      @if (article()) {
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <!-- Article Content -->
          <div class="lg:col-span-3">
            <article class="card-glass p-10 md:p-16 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-2xl">
              <div class="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32"></div>
              
              <header class="mb-12 relative z-10">
                <div class="flex items-center gap-4 mb-6">
                   <span class="badge-elite badge-progress">{{ article()?.category_name }}</span>
                   <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Article Index: {{ article()?.id }}</span>
                </div>
                <h1 class="text-5xl font-black text-white tracking-tighter leading-tight mb-8">{{ article()?.title }}</h1>
                
                <div class="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span class="flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    {{ article()?.view_count }} Expeditions
                  </span>
                  <span>Documented: {{ article()?.created_at | date:'dd MMM yyyy' }}</span>
                </div>
              </header>

              <div class="prose-elite relative z-10" [innerHTML]="article()?.content"></div>

              <footer class="mt-16 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div class="space-y-4 text-center md:text-left">
                  <h4 class="text-xs font-black text-white uppercase tracking-widest">Was this information conclusive?</h4>
                  @if (!feedbackSent()) {
                    <div class="flex gap-4">
                      <button (click)="sendFeedback(true)" class="px-8 py-3 rounded-xl border border-white/10 text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500/10 transition-all flex items-center gap-2">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" stroke-width="3"/></svg>
                        Yes, I'm satisfied
                      </button>
                      <button (click)="sendFeedback(false)" class="px-8 py-3 rounded-xl border border-white/10 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center gap-2">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" stroke-width="3"/></svg>
                        No, need clarity
                      </button>
                    </div>
                  } @else {
                    <div class="flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-widest animate-fade-in">
                       <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
                       Signal Received. Thank you.
                    </div>
                  }
                </div>

                <button routerLink="/helpdesk/knowledge-base" class="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="group-hover:-translate-x-1 transition-transform"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" stroke-width="2.5"/></svg>
                  Return to Index
                </button>
              </footer>
            </article>
          </div>

          <!-- Sidebar Context -->
          <div class="space-y-8">
             <div class="card-glass p-8 rounded-[3rem] border border-white/5 space-y-6">
                <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Related Directives</h3>
                <div class="space-y-4">
                   <!-- This could be populated with other articles from the same category -->
                   <div class="text-[10px] font-bold text-slate-500 flex items-center gap-2 py-2 border-b border-white/5 cursor-pointer hover:text-white transition-colors">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7"/></svg>
                      Regulatory Compliance 2026
                   </div>
                   <div class="text-[10px] font-bold text-slate-500 flex items-center gap-2 py-2 border-b border-white/5 cursor-pointer hover:text-white transition-colors">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7"/></svg>
                      Digital Signature Protocol
                   </div>
                </div>
             </div>

             <div class="p-8 rounded-[3rem] bg-blue-600/5 border border-blue-500/10">
                <p class="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-4">Urgent escalation?</p>
                <button routerLink="/helpdesk/tickets/create" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">Raise Secure Ticket</button>
             </div>
          </div>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-40 gap-6">
           <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
           <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest">Downloading Article Data...</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    .card-glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    .badge-elite { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 0.6rem; font-weight: 950; text-transform: uppercase; }
    .badge-progress { background: rgba(59, 130, 246, 0.1); color: #3B82F6; border: 1px solid rgba(59, 130, 246, 0.2); }

    .prose-elite { color: #94a3b8; font-size: 1.1rem; line-height: 1.8; }
    .prose-elite ::ng-deep p { margin-bottom: 2rem; }
    .prose-elite ::ng-deep h2 { color: white; font-size: 2rem; font-weight: 900; margin: 3rem 0 1.5rem; letter-spacing: -0.025em; }
    .prose-elite ::ng-deep h3 { color: white; font-size: 1.5rem; font-weight: 800; margin: 2rem 0 1rem; }
    .prose-elite ::ng-deep ul { list-style-type: none; padding-left: 0; margin-bottom: 2rem; }
    .prose-elite ::ng-deep li { position: relative; padding-left: 2rem; margin-bottom: 1rem; }
    .prose-elite ::ng-deep li::before { content: ""; position: absolute; left: 0; top: 0.6rem; width: 0.5rem; height: 0.5rem; background: #3B82F6; border-radius: 50%; opacity: 0.5; }
    .prose-elite ::ng-deep strong { color: white; font-weight: 700; }
    .prose-elite ::ng-deep code { background: rgba(255,255,255,0.05); color: #3B82F6; padding: 0.2rem 0.5rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.9em; }
  `]
})
export class KbArticleComponent {
  private kbService = inject(KbService);
  private route = inject(ActivatedRoute);

  public article = signal<KbArticle | null>(null);
  public feedbackSent = signal(false);

  private articleSlug = toSignal(
    this.route.params.pipe(
      map(params => params['slug']),
      tap(slug => this.loadArticle(slug))
    ),
    { initialValue: null }
  );

  private loadArticle(slug: string) {
    if (!slug) return;
    this.kbService.getArticle(slug).subscribe(res => {
      if (res.success) {
        this.article.set(res.data);
        // Track view
        this.kbService.incrementView(res.data.id).subscribe();
      }
    });
  }

  sendFeedback(isHelpful: boolean) {
    this.feedbackSent.set(true);
  }
}
