import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Enhanced Auth Interceptor with comprehensive error handling
 * Handles token management, error responses, and authorization
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  // Skip interceptor for authentication endpoints
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Add authorization token to request
  const token = localStorage.getItem('authToken');
  if (token) {
    req = req.clone({
      withCredentials: true,
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  } else {
    req = req.clone({ withCredentials: true });
  }

  return next(req).pipe(
    tap((event) => {
      // Log successful requests in debug mode
      if (event instanceof HttpResponse) {
        // Optional: Add analytics/logging here
      }
    }),
    catchError((error: HttpErrorResponse) => {
      return handleHttpError(error, authService, notificationService, req, next);
    })
  );
};

/**
 * Handle HTTP errors with appropriate notifications
 */
function handleHttpError(
  error: HttpErrorResponse,
  authService: AuthService,
  notificationService: NotificationService,
  req: any,
  next: any
): Observable<any> {
  // Handle 401 Unauthorized - Token may be expired
  if (error.status === 401) {
    // Try to refresh token
    const token = localStorage.getItem('authToken');
    if (token && authService.hasRefreshToken()) {
      return authService.refreshToken().pipe(
        switchMap((response: any) => {
          const newToken = response.token || response.data?.token;
          if (newToken) {
            localStorage.setItem('authToken', newToken);
            return next(req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            }));
          }
          throw new Error('Token refresh failed');
        }),
        catchError(() => {
          authService.logout();
          notificationService.showError('Session expired. Please log in again.');
          return throwError(() => new Error('Authentication failed'));
        })
      );
    }

    authService.logout();
    notificationService.showError('Session expired. Please log in again.');
    return throwError(() => error);
  }

  // Handle 403 Forbidden
  if (error.status === 403) {
    notificationService.showError('Access denied. You do not have permission to perform this action.');
    return throwError(() => error);
  }

  // Handle 404 Not Found
  if (error.status === 404) {
    notificationService.showError('Resource not found (404).');
    return throwError(() => error);
  }

  // Handle 400 Bad Request
  if (error.status === 400) {
    const message = extractErrorMessage(error);
    notificationService.showError(`Validation error: ${message}`);
    return throwError(() => error);
  }

  // Handle 409 Conflict (duplicate entry)
  if (error.status === 409) {
    notificationService.showError('This item already exists. Please use a different value.');
    return throwError(() => error);
  }

  // Handle 422 Unprocessable Entity
  if (error.status === 422) {
    const message = extractErrorMessage(error);
    notificationService.showError(`Invalid input: ${message}`);
    return throwError(() => error);
  }

  // Handle 429 Too Many Requests (Rate limiting)
  if (error.status === 429) {
    notificationService.showWarning('Too many requests. Please wait before trying again.');
    return throwError(() => error);
  }

  // Handle 500 Internal Server Error
  if (error.status === 500) {
    notificationService.showError('Server error. Our team has been notified. Please try again later.');
    return throwError(() => error);
  }

  // Handle 502 Bad Gateway
  if (error.status === 502) {
    notificationService.showError('Service temporarily unavailable. Please try again later.');
    return throwError(() => error);
  }

  // Handle 503 Service Unavailable
  if (error.status === 503) {
    notificationService.showError('Service is currently under maintenance. Please try again later.');
    return throwError(() => error);
  }

  // Handle network errors (status 0)
  if (error.status === 0) {
    notificationService.showError('Network error. Please check your internet connection.');
    return throwError(() => error);
  }

  // Generic error handling
  const errorMessage = extractErrorMessage(error);
  notificationService.showError(errorMessage || 'An unexpected error occurred. Please try again.');
  return throwError(() => error);
}

/**
 * Check if request is to an authentication endpoint
 */
function isAuthEndpoint(url: string): boolean {
  const authEndpoints = [
    'auth_jwt.php',
    'auth_secure.php',
    'auth_register.php',
    'auth_forgot_password.php',
    'auth_update_password.php',
    'status_check.php',
  ];

  return authEndpoints.some(endpoint => url.includes(endpoint));
}

/**
 * Extract error message from HTTP error response
 */
function extractErrorMessage(error: HttpErrorResponse): string {
  if (!error.error) {
    return error.statusText || 'Unknown error';
  }

  // Handle different error response formats from backend
  if (typeof error.error === 'string') {
    return error.error;
  }

  if (error.error.message) {
    return error.error.message;
  }

  if (error.error.error) {
    if (typeof error.error.error === 'string') {
      return error.error.error;
    }
    if (error.error.error.message) {
      return error.error.error.message;
    }
  }

  if (error.error.errors) {
    if (Array.isArray(error.error.errors)) {
      const messages = error.error.errors
        .filter((e: any) => e.message || e.field)
        .map((e: any) => e.message || `${e.field} is invalid`)
        .join(', ');
      return messages || 'Validation error';
    }
    if (typeof error.error.errors === 'object') {
      const messages = Object.entries(error.error.errors)
        .map(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            return `${field}: ${messages.join(', ')}`;
          }
          return `${field}: ${messages}`;
        })
        .join('; ');
      return messages || 'Validation error';
    }
  }

  return error.statusText || 'An error occurred';
}

/**
 * Logging Interceptor for development and debugging
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = performance.now();
  const method = req.method;
  const url = req.url;

  return next(req).pipe(
    tap({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          const duration = (performance.now() - startTime).toFixed(2);
          console.debug(`[HTTP] ${method} ${url} ✓ (${duration}ms)`);
        }
      },
      error: (error: HttpErrorResponse) => {
        const duration = (performance.now() - startTime).toFixed(2);
        console.error(
          `[HTTP] ${method} ${url} ✗ ${error.status} (${duration}ms)`,
          error
        );
      }
    })
  );
}
