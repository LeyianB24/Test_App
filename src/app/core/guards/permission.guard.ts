import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, take } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

const waitForInit = (authService: AuthService) => {
  return toObservable(authService.isInitialized).pipe(
    filter((initialized): initialized is boolean => !!initialized),
    take(1)
  );
};

/**
 * permissionGuard — Checks per-route page slug verification.
 * Expects 'slug' to be defined in route data.
 *
 * NOTE: For TAXPAYER (member) users, we skip the DB permission check because:
 *  1. The parent `/member` route is already secured by `memberGuard`.
 *  2. All member pages are seeded as accessible for the TAXPAYER role.
 *  3. This avoids a race condition where userPages may not be loaded yet.
 */
export const permissionGuard: CanActivateFn = (route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const slug = route.data['slug'] as string;

  if (!slug) {
    console.warn('⚠️ permissionGuard: No slug defined for route', route);
    return true;
  }

  return waitForInit(authService).pipe(
    map(() => {
      // TAXPAYER (member) users: parent memberGuard already validated their category.
      // Grant access directly to avoid race conditions with page loading.
      if (authService.roleCategory() === 'member') return true;

      // For admin users, enforce the DB-backed permission check.
      if (authService.checkPermission(slug)) return true;
      
      router.navigate(['/unauthorized']);
      return false;
    })
  );
};
