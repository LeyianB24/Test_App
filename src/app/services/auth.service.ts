import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { User, LoginCredentials, AuthResponse } from '../models/app.models';
import { UserDataService } from './user-data.service';

/**
 * AuthService - Manages user authentication and session state
 *
 * Connected to PHP Backend at: http://localhost/kra-api/
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private userDataService = inject(UserDataService);
  private apiUrl = 'http://localhost/itax/kra-api';

  // Reactive State (Source of Truth)
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signals for reactive UI
  public currentUser = signal<User | null>(this.currentUserSubject.value);
  public isAuthenticated = computed(() => this.currentUser() !== null);
  public isLoading = signal(false);
  
  // New: Page-level permissions
  public userPages = signal<any[]>([]);

  // Computed signals for user metadata
  public userName = computed(() => this.currentUser()?.name || 'Authorized Taxpayer');
  public userType = computed(() => this.currentUser()?.type || 'individual');
  public userRole = computed(() => this.currentUser()?.role || '');

  constructor() {
    // Sync the signal with the subject once
    this.currentUser$.subscribe(user => {
      this.currentUser.set(user);
      if (user) {
        this.fetchUserPages();
      } else {
        this.userPages.set([]);
      }
    });
  }

  fetchUserPages() {
    return this.http.get<any>(`${this.apiUrl}/admin_role_matrix.php?action=get_navigation`, { withCredentials: true })
      .subscribe(res => {
        if (res.success && res.data && res.data.pages) {
          this.userPages.set(res.data.pages);
        }
      });
  }

  checkPermission(slug: string): boolean {
    const user = this.currentUser();
    if (!user) return false;
    
    // SUPER_ADMIN has god-mode
    if (user.role?.toUpperCase() === 'SUPER_ADMIN') return true;
    
    // Check if slug exists in allowed pages
    return this.userPages().some(p => p.slug === slug);
  }

  /**
   * Login method
   */
  login(credentials: LoginCredentials, rememberMe: boolean = false): Observable<AuthResponse> {
    console.log('🔐 AuthService: Attempting login for Taxpayer ID:', credentials.taxpayer_id);
    this.isLoading.set(true);

    return this.http.post<any>(`${this.apiUrl}/auth_jwt.php?action=login`, credentials, { withCredentials: true }).pipe(
      tap(response => {
        this.isLoading.set(false);

        if (response.success && response.data && response.data.user) {
          const { user, tokens } = response.data;
          if (tokens) this.setTokensInStorage(tokens, rememberMe);
          this.setUserInStorage(user, tokens?.access_token);
          this.currentUserSubject.next(user);
          
          // Successfully logged in, fetch permissions
          this.fetchUserPages();

          console.log('✅ Login successful:', user.name);
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('❌ Login error:', error);
        return of({
          success: false,
          message: error.error?.message || 'Connection failed'
        });
      })
    );
  }

  /**
   * Logout method - Clears user session
   */
  logout(): Observable<boolean> {
    console.log('🚪 AuthService: Logging out user');

    const refresh = localStorage.getItem('refreshToken');

    if (refresh) {
      // Call server to revoke refresh token
      return this.http.post<any>(`${this.apiUrl}/auth_jwt.php?action=logout`, { refresh_token: refresh }).pipe(
        tap(() => {
          this.userDataService.clearUserData();
          this.clearUserFromStorage();
          this.currentUserSubject.next(null);
        }),
        catchError(() => {
          // Even if server call fails, clear local session
          this.userDataService.clearUserData();
          this.clearUserFromStorage();
          this.currentUserSubject.next(null);
          return of(true);
        }),
        switchMap(() => of(true))
      );
    }

    // No refresh token - just clear locally
    this.userDataService.clearUserData();
    this.clearUserFromStorage();
    this.currentUserSubject.next(null);
    return of(true);
  }

  /**
   * Check if user is authenticated
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Get current user value (synchronous)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Register new user
   */
  register(userData: Partial<User>): Observable<AuthResponse> {
    console.log('📝 AuthService: Registering new user');

    return this.http.post<any>(`${this.apiUrl}/auth_register.php`, userData).pipe(
      tap(response => {
        if (response.success && response.data) {
          console.log('✅ Registration successful:', response.data.name);
        }
      }),
      catchError(error => {
        console.error('❌ Registration error:', error);
        return of({
          success: false,
          message: error.error?.message || 'Registration failed'
        });
      })
    );
  }

  /**
   * Update user profile
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    const user = this.currentUserSubject.value;
    if (!user) return throwError(() => new Error('Not logged in'));

    // If we had a profile endpoint:
    // return this.http.put<User>(`${this.apiUrl}/users/${user.id}`, updates)...

    // For now, assume success and update local state
    const updatedUser = { ...user, ...updates };
    this.setUserInStorage(updatedUser, this.getAuthToken() || undefined);
    this.currentUserSubject.next(updatedUser);
    return of(updatedUser);
  }

  /**
   * Forgot Password - Request reset link
   */
  forgotPassword(taxpayer_id: string): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/auth_forgot_password.php`, { taxpayer_id });
  }

  /**
   * Update Password
   */
  updatePassword(currentPassword: string, newPassword: string): Observable<any> {
    const user = this.getCurrentUser();
    if (!user) return of({ success: false, message: 'Not logged in' });

    return this.http.post(`${this.apiUrl}/auth_update_password.php`, {
      user_id: user.id,
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  // ========== Private Helper Methods ==========

  /**
   * Store user in localStorage
   */
  private setUserInStorage(user: User, token?: string): void {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      if (token) localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Retrieve user from localStorage
   */
  private getUserFromStorage(): User | null {
    try {
      const userJson = localStorage.getItem('currentUser');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear user from localStorage
   */
  private clearUserFromStorage(): void {
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Get stored auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Validate token
   */
  validateToken(): Observable<boolean> {
    return of(!!this.getAuthToken());
  }

  /**
   * Check if refresh token is available
   */
  hasRefreshToken(): boolean {
    return !!localStorage.getItem('refreshToken');
  }

  /**
   * Refresh the auth token
   */
  refreshToken(): Observable<AuthResponse> {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return of({ success: false, message: 'No refresh token available' } as AuthResponse);

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth_jwt.php?action=refresh`, { refresh_token: refresh })
      .pipe(
        tap(response => {
          if (response.success && response.data?.tokens) {
            const tokens = response.data.tokens as any;
            this.setTokensInStorage(tokens, true);
          }
        })
      );
  }

  /**
   * Persist access and refresh tokens. If rememberMe is false store access token only (session-like).
   */
  private setTokensInStorage(tokens: { access_token: string; refresh_token: string; access_expires_in?: number; refresh_expires_in?: number }, rememberMe: boolean) {
    try {
      if (tokens.access_token) localStorage.setItem('authToken', tokens.access_token);
      if (rememberMe && tokens.refresh_token) localStorage.setItem('refreshToken', tokens.refresh_token);
      // Optionally store expiry metadata
      if (tokens.access_expires_in) localStorage.setItem('authTokenExpires', String(Date.now() + (tokens.access_expires_in * 1000)));
      if (tokens.refresh_expires_in) localStorage.setItem('refreshTokenExpires', String(Date.now() + (tokens.refresh_expires_in * 1000)));
    } catch (error) {
      console.error('Failed to persist tokens:', error);
    }
  }
}
