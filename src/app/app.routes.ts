import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';
import { memberGuard } from './core/guards/member.guard';
import { adminPortalGuard } from './core/guards/admin-portal.guard';

/**
 * Root Application Routes
 *
 * The app is split into two fully self-contained portals:
 *  - /member/*       → Taxpayer portal (MemberShellComponent + member routes)
 *  - /admin-portal/* → Admin/Staff portal (AdminShellComponent + admin routes)
 *
 * Each portal has its own layout shell, guard, and routing configuration.
 */
export const routes: Routes = [
  // Auth routes (for guests only)
  {
    path: 'login',
    title: 'KRA iTax | Secure Login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    title: 'KRA iTax | Password Recovery',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'register',
    title: 'KRA iTax | Create Account',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/registration.component').then(m => m.RegistrationComponent)
  },

  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ── Member (Taxpayer) Portal ────────────────────────────────────────────────
  {
    path: 'member',
    canActivate: [memberGuard],
    loadChildren: () => import('./portals/member/member.routes').then(m => m.memberRoutes)
  },

  // ── Admin Portal ─────────────────────────────────────────────────────────────
  {
    path: 'admin-portal',
    canActivate: [adminPortalGuard],
    loadChildren: () => import('./portals/admin/admin.routes').then(m => m.adminPortalRoutes)
  },

  // Unauthorized page
  {
    path: 'unauthorized',
    title: 'Access Denied',
    loadComponent: () => import('./pages/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  // Fallback — redirect unknown paths to login
  { path: '**', redirectTo: 'login' }
];
