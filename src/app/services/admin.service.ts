import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface ModulePermission {
  module_id: string;
  module_name: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_export: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getRoles(): Observable<{ success: boolean; data: Role[] }> {
    return this.http.get<any>(`${this.apiUrl}/admin_role_matrix.php?action=get_matrix`)
      .pipe(
        map(res => ({
          success: res.success,
          data: res.data?.roles || []
        })),
        catchError(err => of({ success: false, data: [], error: err }))
      );
  }

  getModulePermissions(roleId: number): Observable<{ success: boolean; data: ModulePermission[] }> {
    return this.http.get<any>(`${this.apiUrl}/admin_role_matrix.php?action=get_matrix`)
      .pipe(
        map(res => {
          const pages = res.data?.pages || [];
          const permissions = res.data?.permissions || {};
          
          const modulePerms: ModulePermission[] = pages.map((page: any) => {
            const permKey = `${roleId}::${page.slug}`;
            const p = permissions[permKey] || {};
            return {
              module_id: page.slug,
              module_name: page.title,
              can_view: !!p.can_view,
              can_edit: !!p.can_edit,
              can_delete: !!p.can_delete,
              can_export: !!p.can_export
            };
          });
          
          return { success: res.success, data: modulePerms };
        }),
        catchError(err => of({ success: false, data: [], error: err }))
      );
  }

  upsertPermissions(roleId: number, permissions: ModulePermission[]): Observable<{ success: boolean }> {
    const requests = permissions.map(p => {
      const payload = {
        role_id: roleId,
        page_slug: p.module_id,
        can_view: p.can_view ? 1 : 0,
        can_edit: p.can_edit ? 1 : 0,
        can_delete: p.can_delete ? 1 : 0,
        can_export: p.can_export ? 1 : 0
      };
      return this.http.post<any>(`${this.apiUrl}/admin_role_matrix.php?action=upsert_permission`, payload);
    });

    return forkJoin(requests).pipe(
      map(() => ({ success: true })),
      catchError(() => of({ success: false }))
    );
  }

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
