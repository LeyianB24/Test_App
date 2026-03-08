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
 * adminPortalGuard — Extends authGuard and verifies roleCategory is 'admin'.
 */
export const adminPortalGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return waitForInit(authService).pipe(
    map(() => {
      if (!authService.isAuthenticated()) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      
      if (authService.roleCategory() === 'admin') return true;
      
      router.navigate(['/unauthorized']);
      return false;
    })
  );
};
