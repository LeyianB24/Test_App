import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getMatrix(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin_role_matrix.php?action=get_matrix`)
      .pipe(catchError(err => of({ success: false, error: err })));
  }

  upsertPermission(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin_role_matrix.php?action=upsert_permission`, payload)
      .pipe(catchError(err => of({ success: false, error: err })));
  }

  getNavigation(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin_role_matrix.php?action=get_navigation`)
      .pipe(catchError(err => of({ success: false, error: err })));
  }
}
