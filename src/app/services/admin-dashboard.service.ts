import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AdminDashboardSummary {
  stats: any;
  charts: any;
  metrics: any;
  compliance: any;
}

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getSummary(): Observable<{ success: boolean; data?: AdminDashboardSummary; error?: any }> {
    return this.http.get<any>(`${this.apiUrl}/admin_dashboard_api.php?action=summary`, { withCredentials: true })
      .pipe(catchError(err => of({ success: false, error: err })));
  }
}
