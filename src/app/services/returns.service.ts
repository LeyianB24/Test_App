import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaxReturn } from '../models/app.models';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReturnsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/itax/kra-api/returns_api_v2.php';

  private returns = signal<TaxReturn[]>([]);

  // Computed values
  allReturns = computed(() => this.returns());
  submittedReturns = computed(() =>
    this.returns().filter(r => r.status === 'submitted')
  );
  pendingReturns = computed(() =>
    this.returns().filter(r => r.status === 'pending')
  );
  draftReturns = computed(() =>
    this.returns().filter(r => r.status === 'draft')
  );

  constructor() {}

  refreshReturns(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/returns/list`, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success && Array.isArray(res.data.returns)) {
          this.returns.set(res.data.returns);
        }
      }),
      catchError(error => {
        console.error('Error refreshing returns:', error);
        return throwError(() => error);
      })
    );
  }

  setReturns(data: TaxReturn[]) {
    this.returns.set(data);
  }

  getReturnById(id: string): TaxReturn | undefined {
    return this.returns().find(r => r.id === id);
  }

  // Create new return
  createReturn(period: string, type: string, taxpayerId?: string): Observable<any> {
    const payload = {
      period,
      tax_type: type,
      line_items: []
    };
    return this.http.post<any>(`${this.apiUrl}/returns/create`, payload, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success) {
          this.refreshReturns().subscribe();
        }
      }),
      catchError(error => {
        console.error('Error creating return:', error);
        return throwError(() => error);
      })
    );
  }

  // Submit return
  submitReturn(id: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/returns/${id}/submit`, {}, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success) {
          this.refreshReturns().subscribe();
        }
      }),
      map(() => true),
      catchError(error => {
        console.error('Error submitting return:', error);
        return throwError(() => error);
      })
    );
  }

  // Search returns
  searchReturns(query: string): TaxReturn[] {
    const lowerQuery = query.toLowerCase();
    return this.returns().filter(r =>
      r.period.toLowerCase().includes(lowerQuery) ||
      r.type.toLowerCase().includes(lowerQuery)
    );
  }
}
