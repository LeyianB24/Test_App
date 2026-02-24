import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { KbService, KbCategory } from '../../services/kb.service';

@Component({
  selector: 'app-kb-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="kb-container p-6 animate-fade-in">
      <div class="kb-header mb-8 text-center">
        <h1 class="text-3xl font-bold text-slate-800 mb-2">Knowledge Base</h1>
        <p class="text-slate-500">Find answers to common questions and learn how to use the portal</p>
        
        <div class="search-box mt-6 max-w-2xl mx-auto relative">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="onSearch()"
            placeholder="Search for articles (e.g. nil return, payment methods)..."
            class="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all pl-12"
          />
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Search Results -->
      <div *ngIf="isSearching()" class="search-results mb-12">
        <h2 class="text-xl font-semibold mb-4 text-slate-700">Search Results</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div *ngFor="let art of searchResults()" class="result-card p-4 bg-white rounded-xl border border-slate-100 hover:border-red-200 hover:shadow-md transition-all cursor-pointer" [routerLink]="['/helpdesk/knowledge-base/article', art.slug]">
            <h3 class="font-bold text-slate-800">{{ art.title }}</h3>
            <div class="flex items-center mt-2 text-xs text-slate-400">
              <span class="view-count flex items-center gap-1">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/></svg>
                {{ art.view_count }} views
              </span>
            </div>
          </div>
          <div *ngIf="searchResults().length === 0" class="col-span-full py-12 text-center text-slate-400 italic">
            No articles found matching "{{ searchQuery }}"
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div *ngIf="!isSearching()" class="categories-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let cat of categories()" class="category-card group p-6 bg-white rounded-3xl border border-slate-100 hover:border-red-500/20 hover:shadow-xl hover:shadow-red-500/5 transition-all cursor-pointer" [routerLink]="['/helpdesk/knowledge-base/category', cat.id]">
          <div class="icon-box w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-red-50 flex items-center justify-center mb-4 transition-colors">
            <!-- Dynamic Icon (Placeholder for now) -->
             <svg class="text-slate-400 group-hover:text-red-500 transition-colors" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors">{{ cat.name }}</h3>
          <p class="text-slate-500 mt-2 line-clamp-2 text-sm">{{ cat.description }}</p>
          <div class="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ cat.article_count }} Articles</span>
            <svg class="text-slate-300 group-hover:text-red-400 transform group-hover:translate-x-1 transition-all" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kb-container { max-width: 1200px; margin: 0 auto; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class KbListComponent implements OnInit {
  private kbService = inject(KbService);
  
  categories = signal<KbCategory[]>([]);
  searchQuery = '';
  isSearching = signal(false);
  searchResults = signal<any[]>([]);

  ngOnInit() {
    this.kbService.getCategories().subscribe(res => {
      if (res.success) this.categories.set(res.data);
    });
  }

  onSearch() {
    if (this.searchQuery.length >= 3) {
      this.isSearching.set(true);
      this.kbService.search(this.searchQuery).subscribe(res => {
        if (res.success) this.searchResults.set(res.data);
      });
    } else {
      this.isSearching.set(false);
      this.searchResults.set([]);
    }
  }
}
