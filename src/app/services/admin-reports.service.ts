import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminReportsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  downloadReport(reportId: string, format: string): Observable<Blob> {
    const url = `${this.apiUrl}/admin_role_matrix.php?action=download_report&report_id=${reportId}&format=${format}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(err => {
        console.error('Report download failed', err);
        throw err;
      })
    );
  }
}
