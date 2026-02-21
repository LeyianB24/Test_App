import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes from unauthorized access
 *
 * This guard checks if the user is authenticated before allowing
 * access to protected routes. If not authenticated, redirects to login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isLoggedIn();

  if (!isAuthenticated) {
    console.log('🚫 Auth Guard: User not authenticated, redirecting to login');
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  console.log('✅ Auth Guard: User authenticated, allowing access');
  return true;
};

/**
 * Admin Guard - Protects admin-only routes
 *
 * Checks if user is authenticated AND has admin role
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isLoggedIn();
  const userRole = authService.userRole();

  if (!isAuthenticated) {
    console.log('🚫 Admin Guard: User not authenticated, redirecting to login');
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  const isAdmin = userRole && ['SUPER_ADMIN', 'ADMIN'].includes(userRole.toUpperCase());

  if (!isAdmin) {
    console.log('🚫 Admin Guard: User lacks admin privileges, redirecting to dashboard');
    router.navigate(['/dashboard']);
    return false;
  }

  console.log('✅ Admin Guard: User is admin, allowing access');
  return true;
};

/**
 * Guest Guard - Prevents authenticated users from accessing login/register pages
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isLoggedIn();

  if (isAuthenticated) {
    console.log('🚫 Guest Guard: User already authenticated, redirecting to dashboard');
    router.navigate(['/dashboard']);
    return false;
  }

  console.log('✅ Guest Guard: User not authenticated, allowing access to login');
  return true;
};
