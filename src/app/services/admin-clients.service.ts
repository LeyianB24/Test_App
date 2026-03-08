import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ClientData {
  id: number;
  taxpayer_id: string;
  name: string;
  email: string;
  type: string;
  registration_date: string;
  last_login: string;
  kra_pin: string;
  station: string;
  phone: string;
}

export interface ClientListResponse {
  success: boolean;
  data?: {
    clients: ClientData[];
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
export class AdminClientsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getClients(page: number = 1, limit: number = 50, search: string = ''): Observable<ClientListResponse> {
    let params = new HttpParams()
      .set('action', 'list')
      .set('page', page.toString())
      .set('limit', limit.toString());
      
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.apiUrl}/admin_clients_api.php`, { params, withCredentials: true })
      .pipe(catchError(err => of({ success: false, error: err })));
  }

  upsertClient(client: Partial<ClientData>): Observable<{ success: boolean; message?: string; error?: any }> {
    return this.http.post<any>(`${this.apiUrl}/admin_clients_api.php?action=upsert`, client, { withCredentials: true })
      .pipe(catchError(err => of({ success: false, error: err })));
  }

  deleteClient(id: number): Observable<{ success: boolean; message?: string; error?: any }> {
    return this.http.post<any>(`${this.apiUrl}/admin_clients_api.php?action=delete`, { id }, { withCredentials: true })
      .pipe(catchError(err => of({ success: false, error: err })));
  }

  importClients(rows: any[]): Observable<{ success: boolean; message?: string; error?: any }> {
    return this.http.post<any>(`${this.apiUrl}/admin_clients_api.php?action=import`, { rows }, { withCredentials: true })
      .pipe(catchError(err => of({ success: false, error: err })));
  }
}
