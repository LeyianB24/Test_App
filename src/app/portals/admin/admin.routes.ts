import { Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell.component';
import { permissionGuard } from '../../core/guards/permission.guard';

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
        canActivate: [permissionGuard],
        data: { slug: 'dashboard' },
        loadComponent: () => import('./pages/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },

      // Client Management
      {
        path: 'clients',
        title: 'KRA iTax | Client Management',
        canActivate: [permissionGuard],
        data: { slug: 'clients' },
        loadComponent: () => import('./pages/admin-clients.component').then(m => m.AdminClientsComponent)
      },

      // Role Matrix
      {
        path: 'role-matrix',
        title: 'KRA iTax | Role & Permission Matrix',
        canActivate: [permissionGuard],
        data: { slug: 'role-matrix' },
        loadComponent: () => import('./pages/admin-role-matrix.component').then(m => m.AdminRoleMatrixComponent)
      },

      // Reports
      {
        path: 'reports',
        title: 'KRA iTax | Reports',
        canActivate: [permissionGuard],
        data: { slug: 'reports' },
        loadComponent: () => import('./pages/admin-reports.component').then(m => m.AdminReportsComponent)
      },

      // Audit Log
      {
        path: 'audit',
        title: 'KRA iTax | System Audit Log',
        canActivate: [permissionGuard],
        data: { slug: 'audit' },
        loadComponent: () => import('./pages/admin/audit-log.component').then(m => m.AuditLogComponent)
      },

      // Helpdesk (Admin/Staff view — manage tickets, manage KB)
      {
        path: 'helpdesk',
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { 
            path: 'dashboard', 
            title: 'KRA iTax | Helpdesk Dashboard', 
            canActivate: [permissionGuard],
            data: { slug: 'dashboard' }, // Helpdesk dashboard shares dashboard slug or needs its own?
            loadComponent: () => import('./pages/helpdesk/helpdesk-dashboard.component').then(m => m.HelpdeskDashboardComponent) 
          },
          { 
            path: 'tickets', 
            title: 'KRA iTax | Support Tickets', 
            canActivate: [permissionGuard],
            data: { slug: 'tickets' },
            loadComponent: () => import('./pages/ticket-list.component').then(m => m.TicketListComponent) 
          },
          { 
            path: 'tickets/:id', 
            title: 'KRA iTax | Ticket Detail', 
            canActivate: [permissionGuard],
            data: { slug: 'tickets' },
            loadComponent: () => import('./pages/ticket-detail.component').then(m => m.TicketDetailComponent) 
          },
          {
            path: 'knowledge-base',
            canActivate: [permissionGuard],
            data: { slug: 'kb' },
            children: [
              { path: '', loadComponent: () => import('./pages/helpdesk/kb-list.component').then(m => m.KbListComponent) },
              { path: 'category/:id', loadComponent: () => import('./pages/helpdesk/kb-category.component').then(m => m.KbCategoryComponent) },
              { path: 'article/:slug', loadComponent: () => import('./pages/helpdesk/kb-article.component').then(m => m.KbArticleComponent) },
            ]
          }
        ]
      },

      // Specialized services
      {
        path: 'specialized',
        children: [
          { 
            path: 'custom-declaration', 
            title: 'KRA iTax | Custom Declaration', 
            canActivate: [permissionGuard],
            data: { slug: 'checkers' }, // Mapping to checkers slug or similar
            loadComponent: () => import('./pages/specialized/custom-declaration.component').then(m => m.CustomDeclarationComponent) 
          }
        ]
      },

      // Admin profile
      {
        path: 'profile',
        title: 'KRA iTax | My Profile',
        canActivate: [permissionGuard],
        data: { slug: 'profile' },
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        title: 'KRA iTax | Gateway Settings',
        canActivate: [permissionGuard],
        data: { slug: 'settings' },
        loadComponent: () => import('../member/pages/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
