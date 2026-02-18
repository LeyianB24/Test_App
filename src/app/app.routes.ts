import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Login route (accessible only when not authenticated)
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
    path: 'registration',
    title: 'KRA iTax | Taxpayer Enrollment',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/registration.component').then(m => m.RegistrationComponent)
  },

  // Default redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Protected routes (require authentication)
  {
    path: 'dashboard',
    title: 'KRA iTax | Smart Dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'returns',
    title: 'KRA iTax | Returns Filing Hub',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/returns.component').then(m => m.ReturnsComponent)
  },
  {
    path: 'payments',
    title: 'KRA iTax | Secure Payments',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/payments.component').then(m => m.PaymentsComponent)
  },
  {
    path: 'debt',
    title: 'KRA iTax | Debt Management',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/debt.component').then(m => m.DebtComponent)
  },
  {
    path: 'etims',
    title: 'KRA iTax | eTIMS Invoicing',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/etims.component').then(m => m.EtimsComponent)
  },
  {
    path: 'profile',
    title: 'KRA iTax | Taxpayer Profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'settings',
    title: 'KRA iTax | System Settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },

  // Fallback for unknown routes
  { path: '**', redirectTo: 'login' }
];
