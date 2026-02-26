import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, filter, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth.service';

/**
 * Helper — waits for AuthService to finish initialization before evaluating guards.
 */
function waitForInit(authService: AuthService) {
  return toObservable(authService.isInitialized).pipe(
    filter(initialized => initialized === true),
    take(1)
  );
}

/**
 * authGuard — Requires the user to be logged in.
 * Redirects to /login if not authenticated.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return waitForInit(authService).pipe(
    map(() => {
      if (authService.isLoggedIn()) {
        return true;
      }
      console.log('� Auth Guard: Not authenticated, redirecting to login');
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};

/**
 * guestGuard — Requires the user to NOT be logged in.
 * Redirects authenticated users to their portal home.
 * Does NOT redirect if coming from a failed-login / permission denied state.
 */
export const guestGuard: CanActivateFn = (route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return waitForInit(authService).pipe(
    map(() => {
      if (!authService.isLoggedIn()) {
        return true;
      }
      // Allow access to login even when authenticated if permissionDenied param is present
      const isPermissionDenied = route.queryParams['permissionDenied'] === 'true';
      if (isPermissionDenied) {
        return true;
      }
      // Already logged in — redirect to the correct portal
      const portal = authService.roleCategory() === 'member' ? '/member/dashboard' : '/admin-portal/dashboard';
      console.log(`� Guest Guard: Already authenticated, redirecting to ${portal}`);
      router.navigate([portal]);
      return false;
    })
  );
};
