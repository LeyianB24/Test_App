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

/**
 * Permission Guard - Enforces granular role-page access control
 *
 * Use this to check if the current user has can_view permission for a specific slug.
 * The slug is expected to be passed in the route data as 'slug'.
 */
export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Must be authenticated
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // 2. Identify the slug for this route (from route data or path)
  const requiredSlug = route.data['slug'] || route.routeConfig?.path;

  if (!requiredSlug) {
    console.warn('⚠️ Permission Guard: No slug defined for route', state.url);
    return true; // Fallback to allowing access if no slug is specified
  }

  // 3. Check specific permission
  const hasAccess = authService.checkPermission(requiredSlug);

  if (!hasAccess) {
    console.log(`🚫 Permission Guard: Access denied for slug: ${requiredSlug}`);
    router.navigate(['/dashboard'], { queryParams: { permissionDenied: true, slug: requiredSlug } });
    return false;
  }

  console.log(`✅ Permission Guard: Access granted for slug: ${requiredSlug}`);
  return true;
};
