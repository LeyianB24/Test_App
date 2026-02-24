import { Injectable, inject, signal } from '@angular/core';
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

  getCategories(): Observable<any> {
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
}
