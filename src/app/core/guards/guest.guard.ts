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
 * guestGuard — Requires the user to NOT be logged in.
 * Redirects authenticated users to their portal home.
 */
export const guestGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return waitForInit(authService).pipe(
    map(() => {
      if (!authService.isAuthenticated()) return true;
      
      const portal = authService.roleCategory() === 'member' 
        ? '/member/dashboard' 
        : '/admin-portal/dashboard';
        
      router.navigate([portal]);
      return false;
    })
  );
};
