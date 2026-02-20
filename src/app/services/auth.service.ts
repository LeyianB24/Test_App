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
  isLoading = signal(false);

  // Private BehaviorSubject to manage authentication state
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());

  // Public Observable for components to subscribe to
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signals for reactive UI updates
  public isAuthenticated = signal<boolean>(this.currentUserSubject.value !== null);
  public currentUser = signal<User | null>(this.currentUserSubject.value);

  // Computed signal for user display name
  public userName = computed(() => this.currentUser()?.name || 'Guest');
  public userType = computed(() => this.currentUser()?.type || 'individual');

  constructor() {
    // Subscribe to user changes to update signals
    this.currentUser$.subscribe(user => {
      this.currentUser.set(user);
      this.isAuthenticated.set(user !== null);
    });
  }

  /**
   * Login method
   * @param credentials - User PIN and password
   * @returns Observable<AuthResponse>
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    console.log('🔐 AuthService: Attempting login for Taxpayer ID:', credentials.taxpayer_id);
    this.isLoading.set(true);

    return this.http.post<any>(`${this.apiUrl}/auth_secure.php`, credentials, { withCredentials: true }).pipe(
      tap(response => {
        this.isLoading.set(false);

        if (response.success && response.data && response.data.user) {
          const { user } = response.data;

          // Store in localStorage for session persistence
          this.setUserInStorage(user);

          // Update BehaviorSubject
          this.currentUserSubject.next(user);

          console.log('✅ Login successful:', user.name);
        } else {
          console.log('❌ Login failed:', response.message);
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

    // Clear user data service
    this.userDataService.clearUserData();

    // Clear localStorage
    this.clearUserFromStorage();

    // Update BehaviorSubject
    this.currentUserSubject.next(null);

    console.log('✅ Logout successful');
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
    const token = localStorage.getItem('authToken');
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, { token })
      .pipe(
        tap(response => {
          if (response.success && response.data?.token) {
            localStorage.setItem('authToken', response.data.token);
          }
        })
      );
  }
}
