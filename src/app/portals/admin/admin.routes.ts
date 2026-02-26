import { Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell.component';

/**
 * Admin Portal Routes — All routes under /admin-portal/*
 * The shell component provides the layout (sidebar, header, footer).
 * No per-route permission guards needed — the adminPortalGuard handles portal-level access.
 */
export const adminPortalRoutes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      // Default redirect
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Admin Dashboard
      {
        path: 'dashboard',
        title: 'KRA iTax | Admin Dashboard',
        loadComponent: () => import('./pages/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },

      // Client Management
      {
        path: 'clients',
        title: 'KRA iTax | Client Management',
        loadComponent: () => import('./pages/admin-clients.component').then(m => m.AdminClientsComponent)
      },

      // Role Matrix
      {
        path: 'role-matrix',
        title: 'KRA iTax | Role & Permission Matrix',
        loadComponent: () => import('./pages/admin-role-matrix.component').then(m => m.AdminRoleMatrixComponent)
      },

      // Reports
      {
        path: 'reports',
        title: 'KRA iTax | Reports',
        loadComponent: () => import('./pages/admin-reports.component').then(m => m.AdminReportsComponent)
      },

      // Audit Log
      {
        path: 'audit',
        title: 'KRA iTax | System Audit Log',
        loadComponent: () => import('./pages/admin/audit-log.component').then(m => m.AuditLogComponent)
      },

      // Helpdesk (Admin/Staff view — manage tickets, manage KB)
      {
        path: 'helpdesk',
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', title: 'KRA iTax | Helpdesk Dashboard', loadComponent: () => import('./pages/helpdesk/helpdesk-dashboard.component').then(m => m.HelpdeskDashboardComponent) },
          { path: 'tickets', title: 'KRA iTax | Support Tickets', loadComponent: () => import('./pages/ticket-list.component').then(m => m.TicketListComponent) },
          { path: 'tickets/:id', title: 'KRA iTax | Ticket Detail', loadComponent: () => import('./pages/ticket-detail.component').then(m => m.TicketDetailComponent) },
          {
            path: 'knowledge-base',
            children: [
              { path: '', loadComponent: () => import('./pages/helpdesk/kb-list.component').then(m => m.KbListComponent) },
              { path: 'category/:id', loadComponent: () => import('./pages/helpdesk/kb-category.component').then(m => m.KbCategoryComponent) },
              { path: 'article/:slug', loadComponent: () => import('./pages/helpdesk/kb-article.component').then(m => m.KbArticleComponent) },
            ]
          }
        ]
      },

      // Specialized services (accessible to admin in specific scenarios)
      {
        path: 'specialized',
        children: [
          { path: 'custom-declaration', title: 'KRA iTax | Custom Declaration', loadComponent: () => import('./pages/specialized/custom-declaration.component').then(m => m.CustomDeclarationComponent) }
        ]
      },

      // Admin profile
      {
        path: 'profile',
        title: 'KRA iTax | My Profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  }
];
