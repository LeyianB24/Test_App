import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard, permissionGuard } from './guards/auth.guard';

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

  // Default redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Protected routes (require authentication + permission check)
  {
    path: 'dashboard',
    title: 'KRA iTax | Smart Dashboard',
    canActivate: [authGuard, permissionGuard],
    data: { slug: 'dashboard' },
    loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'returns',
    title: 'KRA iTax | Returns Filing Hub',
    canActivate: [authGuard, permissionGuard],
    data: { slug: 'tax-engine/file/income-tax' }, // Mapping legacy path to new slug structure
    loadComponent: () => import('./pages/returns.component').then(m => m.ReturnsComponent)
  },
  {
    path: 'payments',
    title: 'KRA iTax | Secure Payments',
    canActivate: [authGuard, permissionGuard],
    data: { slug: 'tax-engine/payments' },
    loadComponent: () => import('./pages/payments-enhanced.component').then(m => m.PaymentsEnhancedComponent)
  },
  {
    path: 'etims',
    title: 'KRA iTax | eTIMS Invoicing',
    canActivate: [authGuard, permissionGuard],
    data: { slug: 'tax-engine/etims' },
    loadComponent: () => import('./pages/etims.component').then(m => m.EtimsComponent)
  },

  // Tax Expert Engine (Guided Wizards)
  {
    path: 'tax-engine',
    canActivate: [authGuard],
    children: [
      { path: 'client', data: { slug: 'tax-engine/client' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/tax-engine/reconciliation.component').then(m => m.ReconciliationComponent) },
      { path: 'mpesa-analyser', data: { slug: 'tax-engine/mpesa-analyser' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/tax-engine/mpesa-analyser.component').then(m => m.MpesaAnalyserComponent) },
      { path: 'file/nil-return', data: { slug: 'tax-engine/file/nil-return' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/tax-engine/nil-return-wizard.component').then(m => m.NilReturnWizardComponent) },
      { path: 'file/tot', data: { slug: 'tax-engine/file/tot' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/tax-engine/tot-wizard.component').then(m => m.TotWizardComponent) },
      { path: 'file/mri', data: { slug: 'tax-engine/file/mri' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'calculators', data: { slug: 'tax-engine/calculators' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/tax-engine/tax-calculators.component').then(m => m.TaxCalculatorsComponent) },
    ]
  },

  // KRA Checkers
  {
    path: 'checkers',
    canActivate: [authGuard],
    children: [
      { path: 'pin', data: { slug: 'checkers/pin' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/checkers/pin-checker.component').then(m => m.PinCheckerComponent) },
      { path: 'tcc', data: { slug: 'checkers/tcc' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/checkers/tcc-checker.component').then(m => m.TccCheckerComponent) },
      { path: 'prn', data: { slug: 'checkers/prn' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/checkers/prn-checker.component').then(m => m.PrnCheckerComponent) },
    ]
  },

  // Specialized Services
  {
    path: 'specialized',
    canActivate: [authGuard],
    children: [
      { path: 'custom-declaration', data: { slug: 'specialized/custom-declaration' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/specialized/custom-declaration.component').then(m => m.CustomDeclarationComponent) }
    ]
  },

  // Notification & Calendar
  {
    path: 'notifications',
    canActivate: [authGuard],
    children: [
      { path: 'hub', data: { slug: 'notifications/hub' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/notifications/notification-hub.component').then(m => m.NotificationHubComponent) },
      { path: 'calendar', data: { slug: 'notifications/calendar' }, canActivate: [permissionGuard], loadComponent: () => import('./pages/notifications/deadline-calendar.component').then(m => m.DeadlineCalendarComponent) }
    ]
  },

  // Helpdesk routes
  {
    path: 'helpdesk',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'KRA iTax | Helpdesk Dashboard',
        canActivate: [permissionGuard],
        data: { slug: 'tickets' },
        loadComponent: () => import('./pages/helpdesk/helpdesk-dashboard.component').then(m => m.HelpdeskDashboardComponent)
      },
      {
        path: '',
        title: 'KRA iTax | Support Tickets',
        canActivate: [permissionGuard],
        loadComponent: () => import('./pages/ticket-list.component').then(m => m.TicketListComponent)
      },
      {
        path: ':id',
        title: 'KRA iTax | Ticket Details',
        canActivate: [permissionGuard],
        data: { slug: 'tickets' },
        loadComponent: () => import('./pages/ticket-detail.component').then(m => m.TicketDetailComponent)
      },
      {
        path: 'create',
        title: 'KRA iTax | Create Ticket',
        canActivate: [permissionGuard],
        data: { slug: 'tickets' },
        loadComponent: () => import('./pages/ticket-create.component').then(m => m.TicketCreateComponent)
      },
      {
        path: 'knowledge-base',
        title: 'KRA iTax | Support Knowledge Base',
        canActivate: [permissionGuard],
        data: { slug: 'kb' },
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/helpdesk/kb-list.component').then(m => m.KbListComponent)
          },
          {
            path: 'category/:id',
            loadComponent: () => import('./pages/helpdesk/kb-category.component').then(m => m.KbCategoryComponent)
          },
          {
            path: 'article/:slug',
            loadComponent: () => import('./pages/helpdesk/kb-article.component').then(m => m.KbArticleComponent)
          }
        ]
      }
    ]
  },

  // Admin Module
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'KRA iTax | Admin Dashboard',
        canActivate: [permissionGuard],
        data: { slug: 'dashboard' },
        loadComponent: () => import('./pages/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'clients',
        title: 'KRA iTax | Client Management',
        canActivate: [permissionGuard],
        data: { slug: 'clients' },
        loadComponent: () => import('./pages/admin-clients.component').then(m => m.AdminClientsComponent)
      },
      {
        path: 'role-matrix',
        title: 'KRA iTax | Role-Based Permission Matrix',
        canActivate: [permissionGuard],
        data: { slug: 'role-matrix' },
        loadComponent: () => import('./pages/admin-role-matrix.component').then(m => m.AdminRoleMatrixComponent)
      },
      {
        path: 'audit',
        title: 'KRA iTax | System Audit logs',
        canActivate: [permissionGuard],
        data: { slug: 'audit' },
        loadComponent: () => import('./pages/admin/audit-log.component').then(m => m.AuditLogComponent)
      }
    ]
  },

  {
    path: 'profile',
    title: 'KRA iTax | Taxpayer Profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },

  // Fallback for unknown routes
  { path: '**', redirectTo: 'login' }
];
