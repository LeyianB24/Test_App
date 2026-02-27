import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';

/**
 * Ensures the AuthService is initialized before proceeding
 */
const waitForInit = (authService: AuthService) => {
  return toObservable(authService.isInitialized).pipe(
    filter((initialized): initialized is boolean => !!initialized),
    take(1)
  );
};

/**
 * authGuard — Requires the user to be logged in.
 * Redirects to /login if not authenticated.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return waitForInit(authService).pipe(
    map(() => {
      if (authService.isAuthenticated()) return true;
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};
