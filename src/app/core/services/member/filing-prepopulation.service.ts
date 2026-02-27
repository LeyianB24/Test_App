import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface PrepopulationData {
  baseInfo: {
    taxpayer_name: string;
    taxpayer_id: string;
    pin?: string;
    email: string;
    station: string;
  };
  incomeItems: PreFillItem[];
  deductionItems: PreFillItem[];
  reliefItems: PreFillItem[];
}

export interface PreFillItem {
  category: string;
  description: string;
  amount: number;
}

export interface Discrepancy {
  type: string;
  message: string;
  severity: 'High' | 'Medium' | 'Low';
}

@Injectable({
  providedIn: 'root'
})
export class FilingPrepopulationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/filing_prepopulation_api.php`;

  getPrefillData(returnType: string, taxYear: number): Observable<PrepopulationData | null> {
    return this.http.get<any>(`${this.apiUrl}?action=prefill&return_type=${returnType}&tax_year=${taxYear}`).pipe(
      map(res => res.success ? res.data : null),
      catchError(() => of(null))
    );
  }

  getDiscrepancies(returnType: string, taxYear: number): Observable<Discrepancy[]> {
    return this.http.get<any>(`${this.apiUrl}?action=discrepancies&return_type=${returnType}&tax_year=${taxYear}`).pipe(
      map(res => res.success ? res.data : []),
      catchError(() => of([]))
    );
  }
}
