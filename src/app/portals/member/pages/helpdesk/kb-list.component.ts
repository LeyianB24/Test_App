import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KbService, KbCategory, KbArticle } from '../../../../services/kb.service';

@Component({
  selector: 'app-kb-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      <div class="accent-bleed"></div>
      
      <div class="db-inner">
        <!-- Search Intelligence Manifold -->
        <section class="search-manifold animate-up">
           <div class="matrix-glow"></div>
           <div class="manifold-content">
              <div class="header-tag">
                 <span class="tag-glow"></span>
                 <span class="tag-text">Knowledge Matrix Protocol</span>
              </div>
              <h1 class="premium-title">How can we <span class="red-gradient">intelligence</span> you?</h1>
              <p class="premium-subtitle">Authorized repository for statutory resolutions and technical guidance</p>
              
              <div class="search-box-wrapper group">
                 <div class="search-input-field">
                    <svg class="search-icon" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input 
                      type="text" 
                      [(ngModel)]="searchQuery" 
                      (keyup.enter)="onSearch()"
                      placeholder="Search guides, regulations, or filing instructions..." 
                    >
                 </div>
                 <button (click)="onSearch()" class="btn-execute-search">
                    EXECUTE INDEX
                 </button>
              </div>
           </div>
        </section>

        @if (searchResults().length > 0) {
          <!-- Index Manifest (Results) -->
          <section class="results-manifest animate-up">
            <div class="manifest-header">
              <h2 class="manifest-title">SEARCH <span class="red-accent">INVESTIGATIONS</span></h2>
              <button (click)="searchResults.set([])" class="btn-clear-index">CLEAR MANIFEST</button>
            </div>
            <div class="results-grid">
              @for (article of searchResults(); track article.id) {
                <div [routerLink]="['/member/helpdesk/knowledge-base/article', article.slug]" class="result-entry group">
                    <div class="entry-line"></div>
                    <div class="entry-content">
                       <span class="entry-cat">{{ article.category_name || 'SYSTEM GUIDE' }}</span>
                       <h3 class="entry-title">{{ article.title }}</h3>
                       <p class="entry-snippet">{{ article.content }}</p>
                    </div>
                </div>
              }
            </div>
          </section>
        }

        <!-- Category Spectrum -->
        <section class="spectrum-section">
          <div class="section-header">
             <h2 class="section-label">STATUTORY KNOWLEDGE SPECTRUM</h2>
             <div class="section-line"></div>
          </div>
          
          <div class="spectrum-grid">
            @for (category of kbService.categories(); track category.id) {
              <div [routerLink]="['/member/helpdesk/knowledge-base/category', category.id]" class="protocol-card group">
                 <div class="card-glow"></div>
                 <div class="card-icon">
                    <div class="icon-inner">
                       <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                       </svg>
                    </div>
                 </div>
                 <h3 class="protocol-title">{{ category.name }}</h3>
                 <p class="protocol-desc">{{ category.description }}</p>
                 <div class="protocol-meta">
                    <span class="meta-tag">{{ category.article_count || 0 }} ARTICLES REGISTERED</span>
                 </div>
                 <div class="card-action">
                    <span class="action-text">OPEN PROTOCOL</span>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                 </div>
              </div>
            }
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      --red: #D92B2B;
      --red-bright: #EF3B3B;
      --red-glow: rgba(217, 43, 43, 0.4);
      --red-pale: rgba(217, 43, 43, 0.1);
      --red-border: rgba(217, 43, 43, 0.2);
      --violet: #8c52ff;
      --violet-pale: rgba(140, 82, 255, 0.1);
      --bg-root: #080809;
      --bg-surface: rgba(18, 18, 20, 0.6);
      --bdr: rgba(255, 255, 255, 0.05);
      --text-muted: #666670;
    }

    .db-root {
      min-height: 100vh;
      background: var(--bg-root);
      position: relative;
      overflow-x: hidden;
      color: #fff;
    }

    .noise-overlay {
      position: fixed; inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3");
      opacity: 0.03;
      z-index: 1;
    }

    .accent-bleed {
      position: fixed; top: -10%; right: -5%;
      width: 60%; height: 50%;
      background: radial-gradient(circle at center, var(--red-pale) 0%, transparent 70%);
      filter: blur(80px);
      z-index: 0;
    }

    .db-inner {
      position: relative; z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 24px;
    }

    /* Manifold Hero */
    .search-manifold {
       margin-bottom: 80px; padding: 100px 40px;
       background: rgba(0,0,0,0.3); border: 1px solid var(--bdr);
       border-radius: 56px; position: relative; overflow: hidden;
       text-align: center; backdrop-filter: blur(32px);
    }
    .matrix-glow { position: absolute; top: -50%; left: 10%; width: 80%; height: 80%; background: radial-gradient(circle, var(--red-pale) 0%, transparent 60%); opacity: 0.3; }

    .header-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 12px; background: var(--violet-pale);
      border: 1px solid rgba(140, 82, 255, 0.2); border-radius: 100px;
      margin-bottom: 24px;
    }
    .tag-glow { width: 6px; height: 6px; background: var(--violet); border-radius: 50%; box-shadow: 0 0 10px var(--violet); }
    .tag-text { font-size: 10px; font-weight: 950; color: #b794f4; letter-spacing: 2px; text-transform: uppercase; }

    .premium-title { font-size: 64px; font-weight: 950; letter-spacing: -3px; line-height: 1; margin: 0; }
    .red-gradient { background: linear-gradient(to right, #fff, var(--red-bright)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .premium-subtitle { color: var(--text-muted); font-size: 18px; font-weight: 500; margin: 24px 0 48px; letter-spacing: 0.5px; }

    /* Search Box */
    .search-box-wrapper { 
       display: flex; gap: 16px; max-width: 800px; margin: 0 auto;
       background: #000; border: 1px solid var(--bdr); border-radius: 32px;
       padding: 8px; transition: all 0.5s;
    }
    .search-box-wrapper:focus-within { border-color: var(--red-border); box-shadow: 0 0 40px var(--red-pale); }
    
    .search-input-field { flex: 1; display: flex; align-items: center; gap: 16px; padding-left: 24px; }
    .search-icon { color: var(--text-muted); transition: color 0.3s; }
    .search-box-wrapper:focus-within .search-icon { color: var(--red); }
    
    .search-input-field input { 
       width: 100%; background: none; border: none; outline: none;
       color: #fff; font-size: 16px; font-weight: 900; letter-spacing: 0.5px;
    }

    .btn-execute-search {
       height: 60px; padding: 0 32px; background: var(--red); border: none; border-radius: 24px;
       color: #fff; font-size: 11px; font-weight: 950; letter-spacing: 2px; cursor: pointer;
       transition: all 0.3s; box-shadow: 0 12px 24px var(--red-glow);
    }
    .btn-execute-search:hover { transform: translateY(-2px); box-shadow: 0 16px 32px var(--red-glow); background: var(--red-bright); }

    /* Results Manifest */
    .results-manifest { margin-bottom: 80px; }
    .manifest-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding: 0 12px; }
    .manifest-title { font-size: 12px; font-weight: 950; letter-spacing: 3px; color: #fff; }
    .red-accent { color: var(--red); }
    .btn-clear-index { background: none; border: none; color: var(--text-muted); font-size: 9px; font-weight: 950; letter-spacing: 2px; cursor: pointer; }
    .btn-clear-index:hover { color: var(--red); }

    .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .result-entry { 
       padding: 40px; background: var(--bg-surface); border: 1px solid var(--bdr);
       border-radius: 32px; cursor: pointer; position: relative; transition: all 0.3s;
       display: flex; gap: 24px; backdrop-filter: blur(12px);
    }
    .entry-line { width: 4px; height: 100%; background: var(--bdr); border-radius: 4px; transition: all 0.3s; flex-shrink: 0; }
    .result-entry:hover .entry-line { background: var(--red); filter: drop-shadow(0 0 10px var(--red)); }
    .result-entry:hover { border-color: var(--red-border); transform: translateX(8px); }
    
    .entry-cat { font-size: 9px; font-weight: 950; color: var(--red); letter-spacing: 2.5px; margin-bottom: 12px; display: block; }
    .entry-title { font-size: 20px; font-weight: 900; color: #fff; margin-bottom: 12px; letter-spacing: -0.5px; }
    .entry-snippet { color: var(--text-muted); font-size: 14px; font-weight: 500; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

    /* Spectrum Section */
    .section-header { display: flex; align-items: center; gap: 24px; margin-bottom: 56px; padding: 0 12px; }
    .section-label { font-size: 10px; font-weight: 950; color: var(--text-muted); letter-spacing: 3px; white-space: nowrap; }
    .section-line { flex: 1; height: 1px; background: var(--bdr); }

    .spectrum-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
    
    .protocol-card {
       padding: 48px 40px; background: var(--bg-surface); border: 1px solid var(--bdr);
       border-radius: 48px; cursor: pointer; position: relative; overflow: hidden;
       backdrop-filter: blur(24px); transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
       text-align: center;
    }
    .card-glow { position: absolute; inset: 0; background: radial-gradient(circle at top right, var(--red-pale) 0%, transparent 60%); opacity: 0; transition: opacity 0.5s; }
    .protocol-card:hover { transform: translateY(-12px); border-color: var(--red-border); }
    .protocol-card:hover .card-glow { opacity: 1; }

    .card-icon { 
       width: 80px; height: 80px; background: #000; border: 1px solid var(--bdr);
       border-radius: 28px; margin: 0 auto 32px; display: flex; align-items: center; justify-content: center;
       color: var(--text-muted); transition: all 0.5s;
    }
    .protocol-card:hover .card-icon { transform: scale(1.1); background: var(--red); color: #fff; border-color: var(--red); box-shadow: 0 20px 40px var(--red-glow); }

    .protocol-title { font-size: 24px; font-weight: 950; color: #fff; margin-bottom: 16px; letter-spacing: -1px; }
    .protocol-desc { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-bottom: 32px; font-weight: 500; }
    
    .meta-tag {
       font-size: 9px; font-weight: 950; color: var(--text-muted); letter-spacing: 2px;
       background: rgba(0,0,0,0.3); border: 1px solid var(--bdr); padding: 8px 16px; border-radius: 100px;
    }

    .card-action { 
       margin-top: 40px; display: flex; align-items: center; justify-content: center; gap: 12px;
       color: var(--red); opacity: 0; transform: translateY(10px); transition: all 0.5s;
    }
    .protocol-card:hover .card-action { opacity: 1; transform: translateY(0); }
    .action-text { font-size: 10px; font-weight: 950; letter-spacing: 2px; }

    .animate-up { animation: up 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
    @keyframes up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 1024px) {
       .results-grid { grid-template-columns: 1fr; }
       .premium-title { font-size: 48px; }
    }
  `],
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
