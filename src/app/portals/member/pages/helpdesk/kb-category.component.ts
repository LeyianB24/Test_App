import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { KbService, KbArticle, KbCategory } from '../../../../services/kb.service';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-kb-category',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <!-- Elite Breadcrumb -->
      <nav class="mb-12 flex items-center gap-4">
        <a routerLink="/helpdesk/knowledge-base" class="text-blue-500 hover:text-blue-400 font-black uppercase text-[10px] tracking-widest transition-colors">Knowledge Base</a>
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="text-slate-600"><path d="M9 18l6-6-6-6" stroke-width="3"/></svg>
        <span class="text-slate-500 font-bold text-[10px] uppercase tracking-widest">{{ category()?.name || 'Loading Index...' }}</span>
      </nav>

      @if (category()) {
        <header class="mb-16">
          <div class="flex items-center gap-6 mb-4">
             <div class="w-16 h-16 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center">
                 <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             </div>
             <h1 class="text-5xl font-black text-white tracking-tighter">{{ category()?.name }}</h1>
          </div>
          <p class="text-slate-400 text-lg font-medium max-w-3xl leading-relaxed">{{ category()?.description }}</p>
        </header>

        <div class="space-y-6">
          @for (art of articles(); track art.id) {
            <div 
              class="card-glass p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group flex items-center justify-between"
              [routerLink]="['/helpdesk/knowledge-base/article', art.slug]"
            >
              <div class="flex-1 pr-8">
                 <h3 class="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{{ art.title }}</h3>
                 <div class="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span class="flex items-center gap-2">
                       <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                       {{ art.view_count }} Views
                    </span>
                    <span>Last Updated: {{ art.created_at | date:'dd MMM yyyy' }}</span>
                 </div>
              </div>
              <div class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white"><path d="M9 18l6-6-6-6" stroke-width="2.5"/></svg>
              </div>
            </div>
          } @empty {
            <div class="p-24 text-center rounded-[3rem] border border-dashed border-white/10 bg-white/5">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mx-auto mb-6 text-slate-700"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Repository Vacant</p>
              <p class="text-slate-600 text-sm mt-2">No investigative logs have been cataloged in this classification yet.</p>
            </div>
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-40 gap-6">
           <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
           <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest">Retrieving Category Index...</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; }
    .card-glass { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(20px); }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class KbCategoryComponent {
  private kbService = inject(KbService);
  private route = inject(ActivatedRoute);

  public articles = signal<KbArticle[]>([]);
  
  public category = computed(() => {
    const id = this.categoryId();
    if (!id) return null;
    return this.kbService.categories().find(c => c.id === id) || null;
  });

  private categoryId = toSignal(
    this.route.params.pipe(
      map(params => +params['id']),
      tap(id => this.loadArticles(id))
    ),
    { initialValue: null }
  );

  private loadArticles(id: number) {
    if (!id) return;
    this.kbService.getArticles(id).subscribe(res => {
      if (res.success) this.articles.set(res.data);
    });
  }
}
