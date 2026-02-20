import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { NotificationService } from './notification.service';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  private readonly API_BASE_URL = 'http://localhost/itax/kra-api';
  private readonly TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RETRIES = 3;

  // Track loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor() {}

  /**
   * GET request with error handling
   */
  get<T = any>(
    endpoint: string,
    options?: { params?: Record<string, any>; showNotification?: boolean }
  ): Observable<ApiResponse<T>> {
    return this.executeRequest<T>('GET', endpoint, null, options);
  }

  /**
   * POST request with error handling
   */
  post<T = any>(
    endpoint: string,
    body: any,
    options?: { showNotification?: boolean }
  ): Observable<ApiResponse<T>> {
    return this.executeRequest<T>('POST', endpoint, body, options);
  }

  /**
   * PUT request with error handling
   */
  put<T = any>(
    endpoint: string,
    body: any,
    options?: { showNotification?: boolean }
  ): Observable<ApiResponse<T>> {
    return this.executeRequest<T>('PUT', endpoint, body, options);
  }

  /**
   * PATCH request with error handling
   */
  patch<T = any>(
    endpoint: string,
    body: any,
    options?: { showNotification?: boolean }
  ): Observable<ApiResponse<T>> {
    return this.executeRequest<T>('PATCH', endpoint, body, options);
  }

  /**
   * DELETE request with error handling
   */
  delete<T = any>(
    endpoint: string,
    options?: { showNotification?: boolean }
  ): Observable<ApiResponse<T>> {
    return this.executeRequest<T>('DELETE', endpoint, null, options);
  }

  /**
   * Execute HTTP request with comprehensive error handling
   */
  private executeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    body: any = null,
    options?: { params?: Record<string, any>; showNotification?: boolean }
  ): Observable<ApiResponse<T>> {
    const url = `${this.API_BASE_URL}/${endpoint}`;
    const showNotification = options?.showNotification !== false;

    this.loadingSubject.next(true);

    let httpRequest: Observable<ApiResponse<T>>;

    if (method === 'GET') {
      httpRequest = this.http.get<ApiResponse<T>>(url, {
        params: this.buildParams(options?.params)
      });
    } else if (method === 'POST') {
      httpRequest = this.http.post<ApiResponse<T>>(url, body);
    } else if (method === 'PUT') {
      httpRequest = this.http.put<ApiResponse<T>>(url, body);
    } else if (method === 'PATCH') {
      httpRequest = this.http.patch<ApiResponse<T>>(url, body);
    } else {
      httpRequest = this.http.delete<ApiResponse<T>>(url);
    }

    return httpRequest.pipe(
      timeout(this.TIMEOUT),
      retry({ count: 1, delay: 1000 }),
      catchError((error) => this.handleError(error, showNotification))
    );
  }

  /**
   * Build HTTP params from object
   */
  private buildParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return httpParams;
  }

  /**
   * Comprehensive error handling
   */
  private handleError(error: HttpErrorResponse, showNotification: boolean): Observable<never> {
    this.loadingSubject.next(false);

    let errorMessage = 'An error occurred. Please try again.';
    let errorDetails: ApiErrorDetail[] = [];

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network Error: ${error.error.message}`;
      errorDetails = [{
        message: error.error.message,
        code: 'NETWORK_ERROR'
      }];
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
          errorDetails = [{ message: 'Connection failed', code: 'CONNECTION_ERROR' }];
          break;

        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          if (error.error?.errors) {
            // Handle validation errors
            errorDetails = this.parseValidationErrors(error.error.errors);
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }
          break;

        case 401:
          errorMessage = 'Session expired. Please login again.';
          errorDetails = [{ message: 'Unauthorized', code: 'AUTH_ERROR' }];
          // Trigger logout here if needed
          break;

        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          errorDetails = [{ message: 'Access denied', code: 'FORBIDDEN' }];
          break;

        case 404:
          errorMessage = 'Resource not found.';
          errorDetails = [{ message: 'Not found', code: 'NOT_FOUND' }];
          break;

        case 409:
          errorMessage = 'This resource already exists or conflicts with existing data.';
          errorDetails = [{ message: error.error?.message || 'Conflict', code: 'CONFLICT' }];
          break;

        case 422:
          errorMessage = 'Validation failed. Please check your input.';
          if (error.error?.errors) {
            errorDetails = this.parseValidationErrors(error.error.errors);
          }
          break;

        case 429:
          errorMessage = 'Too many requests. Please wait before trying again.';
          errorDetails = [{ message: 'Rate limited', code: 'RATE_LIMITED' }];
          break;

        case 500:
          errorMessage = 'Server error. Our team has been notified. Please try again later.';
          errorDetails = [{ message: 'Server error', code: 'SERVER_ERROR' }];
          break;

        case 502:
          errorMessage = 'Service temporarily unavailable. Please try again in a moment.';
          errorDetails = [{ message: 'Gateway error', code: 'GATEWAY_ERROR' }];
          break;

        case 503:
          errorMessage = 'Service is undergoing maintenance. Please try again later.';
          errorDetails = [{ message: 'Service unavailable', code: 'SERVICE_UNAVAILABLE' }];
          break;

        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
      }
    }

    // Show notification if enabled
    if (showNotification) {
      this.notificationService.showError(errorMessage);
    }

    // Log for debugging
    console.error('API Error:', {
      status: error.status,
      message: errorMessage,
      details: errorDetails,
      fullError: error
    });

    return throwError(() => ({
      message: errorMessage,
      details: errorDetails,
      status: error.status,
      error: error.error
    }));
  }

  /**
   * Parse validation errors from API response
   */
  private parseValidationErrors(errors: any): ApiErrorDetail[] {
    const details: ApiErrorDetail[] = [];

    Object.keys(errors).forEach(field => {
      const messages = Array.isArray(errors[field]) ? errors[field] : [errors[field]];
      messages.forEach(message => {
        details.push({
          field,
          message,
          code: 'VALIDATION_ERROR'
        });
      });
    });

    return details;
  }

  /**
   * Get loading state
   */
  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  /**
   * Stop all pending requests (for cleanup)
   */
  cancelRequests(): void {
    this.loadingSubject.next(false);
  }
}
