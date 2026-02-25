import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from '../models/app.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Signal-based state management
  private userData = signal<User | null>(null);
  private isLoading = signal(false);
  private error = signal<string | null>(null);

  // Computed values
  currentUser = computed(() => this.userData());
  isLoadingUser = computed(() => this.isLoading());
  userError = computed(() => this.error());

  constructor() {}

  /**
   * Load complete user data including profile
   */
  loadUserData(taxpayerId: string): Observable<any> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<any>(`${this.apiUrl}/get_taxpayer_data.php`).pipe(
      tap(response => {
        this.isLoading.set(false);
        
        if (response.success) {
          console.log('✅ User data loaded successfully:', response.user);
          
          // Update user signal with complete data
          this.userData.set(response.user);
        } else {
          console.error('❌ Failed to load user data:', response.message);
          this.error.set(response.message || 'Failed to load user data');
        }
      }),
      catchError(error => {
        this.isLoading.set(false);
        console.error('❌ Error loading user data:', error);
        this.error.set('Failed to connect to server');
        return of({ success: false, message: 'Connection error' });
      })
    );
  }

  /**
   * Update user data locally
   */
  updateUserData(userData: Partial<User>) {
    const currentUser = this.userData();
    if (currentUser) {
      this.userData.set({ ...currentUser, ...userData });
    }
  }

  /**
   * Clear user data
   */
  clearUserData() {
    this.userData.set(null);
    this.error.set(null);
  }

  /**
   * Get user display name
   */
  getDisplayName(): string {
    const user = this.userData();
    return user?.name || 'User';
  }

  /**
   * Get taxpayer ID
   */
  getTaxpayerId(): string {
    const user = this.userData();
    return user?.taxpayer_id || '';
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.userData();
    return user?.type === 'admin';
  }

  /**
   * Check if user is business
   */
  isBusiness(): boolean {
    const user = this.userData();
    return user?.type === 'business';
  }

  /**
   * Check if user is individual
   */
  isIndividual(): boolean {
    const user = this.userData();
    return user?.type === 'individual';
  }
  /**
   * Set data from external source (AuthService)
   */
  setData(user: any) {
    if (user) {
      console.log('🔄 UserDataService: Manual state sync');
      this.userData.set(user);
    }
  }
}
