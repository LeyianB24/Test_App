import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaxReturn } from '../models/app.models';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReturnsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost/itax/kra-api/return_actions.php';
  
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
    return this.http.get<any>(this.apiUrl, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success && Array.isArray(res.data)) {
          this.returns.set(res.data);
        }
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
    const payload = { period, type, taxpayer_id: taxpayerId, status: 'draft' };
    return this.http.post<any>(this.apiUrl, payload, { withCredentials: true }).pipe(
      tap(() => this.refreshReturns().subscribe())
    );
  }

  // Submit return
  submitReturn(id: string): Observable<boolean> {
     return this.http.put<any>(this.apiUrl, { id, status: 'submitted' }, { withCredentials: true }).pipe(
        tap(() => this.refreshReturns().subscribe()),
        map(() => true)
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
