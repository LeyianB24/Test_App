import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, filter, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';

/**
 * Member Guard - Only allows TAXPAYER role users into the member portal.
 * If an admin/staff user tries to access /member/*, they are redirected to
 * /admin-portal/dashboard.
 */
export const memberGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait until auth is initialized before evaluating
  return toObservable(authService.isInitialized).pipe(
    filter(initialized => initialized === true),
    take(1),
    map(() => {
      if (!authService.isAuthenticated()) {
        router.navigate(['/login']);
        return false;
      }
      if (authService.roleCategory() === 'member') {
        return true;
      }
      // Admin user trying to access member portal → redirect to admin portal
      console.log('🔒 Member Guard: Admin user redirected to admin portal');
      router.navigate(['/admin-portal/dashboard']);
      return false;
    })
  );
};
