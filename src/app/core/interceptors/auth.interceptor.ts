import { inject } from '@angular/core';
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Enhanced Auth Interceptor with comprehensive error handling
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  const token = authService.getAuthToken();
  if (token) {
    req = req.clone({
      withCredentials: true,
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  } else {
    req = req.clone({ withCredentials: true });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (token) {
          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              const newToken = response.data?.tokens?.access_token || response.token;
              if (newToken) {
                return next(req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` }
                }));
              }
              throw new Error('Refresh Failed');
            }),
            catchError(() => {
              authService.logout().subscribe();
              notificationService.showError('Session perimeter breached. Re-authenticating...');
              return throwError(() => error);
            })
          );
        }
        authService.logout().subscribe();
      }
      
      handleGenericErrors(error, notificationService);
      return throwError(() => error);
    })
  );
};

function handleGenericErrors(error: HttpErrorResponse, ns: NotificationService) {
  switch (error.status) {
    case 403: ns.showError('Security Access Denied (403).'); break;
    case 404: ns.showError('Resource Missing (404).'); break;
    case 429: ns.showWarning('Rate limit reached. Cooling down...'); break;
    case 500: ns.showError('Internal Grid Failure (500).'); break;
    case 0: ns.showError('Connection Severed. Check uplink.'); break;
  }
}

function isAuthEndpoint(url: string): boolean {
  return [
    'auth_jwt.php',
    'auth_register.php',
    'auth_forgot_password.php',
    'status_check.php'
  ].some(endpoint => url.includes(endpoint));
}
