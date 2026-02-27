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
 */
export const permissionGuard: CanActivateFn = (route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const slug = route.data['slug'] as string;

  if (!slug) {
    console.warn('⚠️ permissionGuard: No slug defined for route', route);
    return true; // If no slug defined, allow access (or could be strict and deny)
  }

  return waitForInit(authService).pipe(
    map(() => {
      if (authService.checkPermission(slug)) return true;
      
      router.navigate(['/unauthorized']);
      return false;
    })
  );
};
