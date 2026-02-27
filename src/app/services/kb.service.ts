import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface KbCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  article_count?: number;
}

export interface KbArticle {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  content: string;
  view_count: number;
  created_at: string;
  category_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class KbService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/kb_api.php`;

  // State signals
  private categoriesSignal = signal<KbCategory[]>([]);
  private loadingSignal = signal<boolean>(false);

  // Read-only signals
  public categories = computed(() => this.categoriesSignal());
  public isLoading = computed(() => this.loadingSignal());

  constructor() {
    this.refreshCategories();
  }

  public refreshCategories(): void {
    this.loadingSignal.set(true);
    this.http.get<any>(`${this.apiUrl}?action=get_categories`).subscribe({
      next: (resp) => {
        if (resp.success) this.categoriesSignal.set(resp.data);
        this.loadingSignal.set(false);
      },
      error: () => this.loadingSignal.set(false)
    });
  }

  public getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=get_categories`);
  }

  getArticles(categoryId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=get_articles&category_id=${categoryId}`);
  }

  getArticle(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=get_article&slug=${slug}`);
  }

  search(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?action=search&query=${query}`);
  }

  incrementView(articleId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?action=increment_view`, { id: articleId });
  }
}
