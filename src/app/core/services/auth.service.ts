import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { User, LoginCredentials, AuthResponse } from '../models/app.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  // Strict Signal State management
  readonly currentUser = signal<User | null>(this.getUserFromStorage());
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isInitialized = signal(false);
  readonly isLoading = signal(false);
  
  // RBAC State
  readonly userPages = signal<any[]>([]);
  
  // Computed metadata
  readonly userName = computed(() => this.currentUser()?.name || 'Authorized Taxpayer');
  readonly userType = computed(() => this.currentUser()?.type || 'individual');
  readonly userRole = computed(() => (this.currentUser()?.role || '').toUpperCase());
  
  readonly roleCategory = computed<'member' | 'admin'>(() => {
    return this.userRole() === 'TAXPAYER' ? 'member' : 'admin';
  });

  constructor() {
    this.initializeSession();
    
    // Auto-sync storage when user changes
    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    });
  }

  private initializeSession() {
    const user = this.currentUser();
    if (!user) {
      this.isInitialized.set(true);
      return;
    }

    // Coordinate data loading on startup
    forkJoin({
      pages: this.fetchUserPages(),
      context: this.loadSessionContext()
    }).subscribe({
      next: (res) => {
        console.log('🛡️ AuthService: Security perimeter stabilized.');
        
        // If we have a user but no navigation pages, something is wrong with the role/permissions
        if (this.currentUser() && (!res.pages || res.pages.length === 0)) {
          console.warn('⚠️ AuthService: Session initialized with zero access pages. Verify RBAC matrix.');
        }
        
        this.isInitialized.set(true);
      },
      error: (err) => {
        console.error('🚫 AuthService: Gateway handshake failed.', err);
        // If initial load fails (e.g. 401), we should probably clear the zombie session
        if (err.status === 401 || err.status === 403) {
          this.logout().subscribe();
        }
        this.isInitialized.set(true);
      }
    });
  }

  private loadSessionContext(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_taxpayer_data.php`, { withCredentials: true }).pipe(
      tap(res => {
        // We could populate other services here if needed
      }),
      catchError(() => of(null))
    );
  }

  fetchUserPages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin_role_matrix.php?action=get_navigation`, { withCredentials: true }).pipe(
      tap(res => {
        if (res.success && res.data?.pages) {
          const uniquePages = Array.from(
            new Map(res.data.pages.map((p: any) => [p.slug, p])).values()
          );
          this.userPages.set(uniquePages);
        }
      }),
      catchError(() => {
        this.userPages.set([]);
        return of(null);
      })
    );
  }

  /**
   * Checks if the user has a specific permission for a given page slug.
   * @param slug The page identifier (e.g., 'dashboard', 'returns')
   * @param action The specific capability to check
   */
  hasPermission(slug: string, action: 'view' | 'edit' | 'delete' | 'export' = 'view'): boolean {
    if (this.userRole() === 'SUPER_ADMIN') return true;
    
    const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');
    const page = this.userPages().find(p => {
      const pSlug = p.slug.replace(/^\/+|\/+$/g, '');
      return pSlug === normalizedSlug;
    });

    if (!page) return false;

    // If only checking view access
    if (action === 'view') return page.permissions?.view === 1 || page.can_view === 1;

    // Check granular permissions
    const perms = page.permissions || page;
    switch (action) {
      case 'edit': return perms.edit === 1 || perms.can_edit === 1;
      case 'delete': return perms.delete === 1 || perms.can_delete === 1;
      case 'export': return perms.export === 1 || perms.can_export === 1;
      default: return false;
    }
  }

  // Alias for backward compatibility and simple guard usage
  checkPermission(slug: string): boolean {
    return this.hasPermission(slug, 'view');
  }

  login(credentials: LoginCredentials, rememberMe: boolean = false): Observable<AuthResponse> {
    this.isLoading.set(true);

    return this.http.post<any>(`${this.apiUrl}/auth_jwt.php?action=login`, credentials, { withCredentials: true }).pipe(
      tap(response => {
        this.isLoading.set(false);
        if (response.success && response.data?.user) {
          const { user, tokens } = response.data;
          if (tokens) this.setTokensInStorage(tokens, rememberMe);
          this.currentUser.set(user);
          
          // Reload user pages after login (don't reset isInitialized)
          this.fetchUserPages().subscribe();
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        return of({
          success: false,
          message: error.error?.message || 'Gateway connection failed'
        });
      })
    );
  }

  logout(): Observable<boolean> {
    const refresh = localStorage.getItem('refreshToken');
    const clearLocal = () => {
      this.currentUser.set(null);
      this.userPages.set([]);
      localStorage.removeItem('refreshToken');
    };

    if (refresh) {
      return this.http.post<any>(`${this.apiUrl}/auth_jwt.php?action=logout`, { refresh_token: refresh }).pipe(
        tap(clearLocal),
        catchError(() => {
          clearLocal();
          return of(true);
        }),
        switchMap(() => of(true))
      );
    }

    clearLocal();
    return of(true);
  }

  private setTokensInStorage(tokens: any, rememberMe: boolean) {
    if (tokens.access_token) localStorage.setItem('authToken', tokens.access_token);
    if (rememberMe && tokens.refresh_token) localStorage.setItem('refreshToken', tokens.refresh_token);
  }

  private getUserFromStorage(): User | null {
    try {
      const userJson = localStorage.getItem('currentUser');
      if (!userJson) return null;
      
      const user = JSON.parse(userJson) as User;
      
      // Strict validation: Must have taxpayer_id and at least default role info
      if (!user.taxpayer_id || !user.type) {
        console.warn('⚠️ AuthService: Purged corrupted user fragment from storage.');
        return null;
      }
      
      return user;
    } catch {
      return null;
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  refreshToken(): Observable<AuthResponse> {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return of({ success: false, message: 'No refresh token' } as AuthResponse);

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth_jwt.php?action=refresh`, { refresh_token: refresh })
      .pipe(
        tap(response => {
          if (response.success && response.data?.tokens) {
            this.setTokensInStorage(response.data.tokens, true);
          }
        })
      );
  }

  register(userData: any): Observable<any> {
    this.isLoading.set(true);
    return this.http.post<any>(`${this.apiUrl}/auth_jwt.php?action=register`, userData).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  forgotPassword(taxpayerId: string): Observable<any> {
    this.isLoading.set(true);
    return this.http.post<any>(`${this.apiUrl}/auth_jwt.php?action=forgot_password`, { taxpayer_id: taxpayerId }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    this.isLoading.set(true);
    return this.http.post<any>(`${this.apiUrl}/auth_jwt.php?action=update_password`, { 
      current_password: oldPassword, 
      new_password: newPassword 
    }, { withCredentials: true }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(err => {
        this.isLoading.set(false);
        return throwError(() => err);
      })
    );
  }
}
