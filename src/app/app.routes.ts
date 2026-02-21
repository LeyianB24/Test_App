import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard } from './guards/auth.guard';

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
    loadComponent: () => import('./pages/payments-enhanced.component').then(m => m.PaymentsEnhancedComponent)
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

  // Enhanced pages (Session 3 - Super Enhancement)
  // Temporarily disabled - contain structural errors that prevent build
  // {
  //   path: 'returns-enhanced',
  //   title: 'KRA iTax | Tax Returns Management',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./pages/returns-enhanced.component').then(m => m.ReturnsEnhancedComponent)
  // },
  // {
  //   path: 'invoices-enhanced',
  //   title: 'KRA iTax | Invoice Management',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./pages/invoices-enhanced.component').then(m => m.InvoicesEnhancedComponent)
  // },
  // {
  //   path: 'obligations-enhanced',
  //   title: 'KRA iTax | Tax Obligations Tracker',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./pages/obligations-enhanced.component').then(m => m.ObligationsEnhancedComponent)
  // },
  // {
  //   path: 'admin-dashboard',
  //   title: 'KRA iTax | Admin Dashboard',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./pages/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  // },

  // Real-time operations
  // {
  //   path: 'payment-tracker',
  //   title: 'KRA iTax | Real-Time Payment Tracker',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./pages/real-time-payment-tracker.component').then(m => m.RealTimePaymentTrackerComponent)
  // },
  // {
  //   path: 'batch-operations',
  //   title: 'KRA iTax | Batch Operations Manager',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./pages/batch-operations.component').then(m => m.BatchOperationsComponent)
  // },

  // Tax Returns routes (Phase 4)
  {
    path: 'tax-returns',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'KRA iTax | Tax Returns Management',
        loadComponent: () => import('./pages/return-list.component').then(m => m.ReturnListComponent)
      },
      {
        path: 'create',
        title: 'KRA iTax | Create Tax Return',
        loadComponent: () => import('./pages/return-create.component').then(m => m.ReturnCreateComponent)
      },
      {
        path: ':id',
        title: 'KRA iTax | Return Details',
        loadComponent: () => import('./pages/return-detail.component').then(m => m.ReturnDetailComponent)
      }
    ]
  },

  // Helpdesk routes
  {
    path: 'helpdesk',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'KRA iTax | Support Tickets',
        loadComponent: () => import('./pages/ticket-list.component').then(m => m.TicketListComponent)
      },
      {
        path: 'create',
        title: 'KRA iTax | Create Ticket',
        loadComponent: () => import('./pages/ticket-create.component').then(m => m.TicketCreateComponent)
      },
      {
        path: ':id',
        title: 'KRA iTax | Ticket Details',
        loadComponent: () => import('./pages/ticket-detail.component').then(m => m.TicketDetailComponent)
      }
    ]
  },

  // Admin-only routes (require admin role)
  {
    path: 'admin',
    children: [
      {
        path: 'role-matrix',
        title: 'KRA iTax | Role-Based Permission Matrix',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin-role-matrix.component').then(m => m.AdminRoleMatrixComponent)
      }
    ]
  },

  // Fallback for unknown routes
  { path: '**', redirectTo: 'login' }
];
