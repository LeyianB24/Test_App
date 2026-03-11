import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  ip_address?: string;
  status: string;
  details: string;
}

export interface AuditLogResponse {
  success: boolean;
  data?: {
    logs: AuditLog[];
    total: number;
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  };
  error?: any;
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getLogs(page: number = 1, limit: number = 50, search: string = '', status: string = ''): Observable<AuditLogResponse> {
    let params = new HttpParams()
      .set('action', 'list')
      .set('page', page.toString())
      .set('limit', limit.toString());
      
    if (search) params = params.set('search', search);
    if (status && status !== 'all') params = params.set('status', status);

    return this.http.get<any>(`${this.apiUrl}/admin_audit_api.php`, { params, withCredentials: true })
      .pipe(catchError(err => of({ success: false, error: err })));
  }
}
