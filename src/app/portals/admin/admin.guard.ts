import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, filter, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';

/**
 * Admin Portal Guard - Only allows non-TAXPAYER roles (admin, staff, etc) into
 * the admin portal. If a taxpayer tries to access /admin-portal/*, they are
 * redirected back to /member/dashboard.
 */
export const adminPortalGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait until auth is initialized before evaluating
  return toObservable(authService.isInitialized).pipe(
    filter(initialized => initialized === true),
    take(1),
    map(() => {
      if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
      }
      if (authService.roleCategory() === 'admin') {
        return true;
      }
      // Taxpayer trying to access admin portal → redirect to member portal
      console.log('🔒 Admin Guard: Taxpayer redirected to member portal');
      router.navigate(['/member/dashboard']);
      return false;
    })
  );
};
