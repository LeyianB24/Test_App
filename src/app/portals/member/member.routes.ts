import { Routes } from '@angular/router';
import { MemberShellComponent } from './member-shell.component';

/**
 * Member Portal Routes — All routes under /member/*
 * The shell component provides the layout (sidebar, header, footer).
 */
export const memberRoutes: Routes = [
  {
    path: '',
    component: MemberShellComponent,
    children: [
      // Default redirect
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // Dashboard
      {
        path: 'dashboard',
        title: 'KRA iTax | My Dashboard',
        loadComponent: () => import('./pages/member-dashboard.component').then(m => m.MemberDashboardComponent)
      },

      // Returns & Filing
      {
        path: 'returns',
        children: [
          { path: '', title: 'KRA iTax | Returns Hub', loadComponent: () => import('./pages/returns/returns-hub.component').then(m => m.ReturnsHubComponent) },
          { path: 'vat', title: 'KRA iTax | VAT Return', loadComponent: () => import('./pages/returns/vat-return.component').then(m => m.VatReturnComponent) },
          { path: 'paye', title: 'KRA iTax | PAYE Return', loadComponent: () => import('./pages/returns/paye-return.component').then(m => m.PayeReturnComponent) },
          { path: 'income-tax', title: 'KRA iTax | Income Tax Hub', loadComponent: () => import('./pages/returns/income-tax-hub.component').then(m => m.IncomeTaxHubComponent) },
          { path: 'rental-income', title: 'KRA iTax | Rental Income', loadComponent: () => import('./pages/returns/rental-income-return.component').then(m => m.RentalIncomeReturnComponent) },
          { path: 'history', title: 'KRA iTax | Filing History', loadComponent: () => import('./pages/returns.component').then(m => m.ReturnsComponent) },
        ]
      },

      // Compliance & Certificates
      {
        path: 'compliance',
        children: [
          { path: 'tcc', title: 'KRA iTax | TCC Application', loadComponent: () => import('./pages/compliance/tcc-application.component').then(m => m.TccApplicationComponent) },
          { path: 'pin-certificate', title: 'KRA iTax | PIN Certificate', loadComponent: () => import('./pages/compliance/pin-certificate.component').then(m => m.PinCertificateComponent) },
        ]
      },

      // Correspondence & Notices
      {
        path: 'correspondence',
        children: [
          { path: 'notices', title: 'KRA iTax | Notices', loadComponent: () => import('./pages/correspondence/notices.component').then(m => m.NoticesComponent) },
          { path: 'assessments', title: 'KRA iTax | Assessments', loadComponent: () => import('./pages/correspondence/assessments.component').then(m => m.AssessmentsComponent) },
        ]
      },

      // Objections & Appeals
      {
        path: 'objections',
        children: [
          { path: '', title: 'KRA iTax | My Objections', loadComponent: () => import('./pages/objections/objection-list.component').then(m => m.ObjectionListComponent) },
          { path: 'create', title: 'KRA iTax | Lodge Objection', loadComponent: () => import('./pages/objections/objection-create.component').then(m => m.ObjectionCreateComponent) },
        ]
      },

      // Tax Refunds
      {
        path: 'refunds',
        children: [
          { path: '', title: 'KRA iTax | Tax Refunds', loadComponent: () => import('./pages/refunds/refund-list.component').then(m => m.RefundListComponent) },
          { path: 'apply', title: 'KRA iTax | Apply for Refund', loadComponent: () => import('./pages/refunds/refund-apply.component').then(m => m.RefundApplyComponent) },
        ]
      },

      // Installment Plans
      {
        path: 'installments',
        children: [
          { path: '', title: 'KRA iTax | Payment Plans', loadComponent: () => import('./pages/installments/installment-list.component').then(m => m.InstallmentListComponent) },
          { path: 'apply', title: 'KRA iTax | Apply for Installment', loadComponent: () => import('./pages/installments/installment-apply.component').then(m => m.InstallmentApplyComponent) },
        ]
      },

      // Statements & History
      {
        path: 'statements',
        children: [
          { path: 'ledger', title: 'KRA iTax | Tax Ledger', loadComponent: () => import('./pages/statements/tax-statement.component').then(m => m.TaxStatementComponent) },
        ]
      },

      // M-Service Hub
      {
        path: 'm-service',
        title: 'KRA iTax | M-Service Hub',
        loadComponent: () => import('./pages/m-service/m-service-hub.component').then(m => m.MServiceHubComponent)
      },

      // Payments
      {
        path: 'payments',
        title: 'KRA iTax | Payments',
        loadComponent: () => import('./pages/payments-enhanced.component').then(m => m.PaymentsEnhancedComponent)
      },
      {
        path: 'payments/mpesa',
        title: 'KRA iTax | M-Pesa Payment',
        loadComponent: () => import('./pages/mpesa-payment.component').then(m => m.MpesaPaymentComponent)
      },

      // Debt / Liabilities
      {
        path: 'debt',
        title: 'KRA iTax | Liability Portfolio',
        loadComponent: () => import('./pages/debt.component').then(m => m.DebtComponent)
      },

      // eTIMS
      {
        path: 'etims',
        title: 'KRA iTax | eTIMS Invoicing',
        loadComponent: () => import('./pages/etims.component').then(m => m.EtimsComponent)
      },

      // Tax Engine (Guided Wizards)
      {
        path: 'tax-engine',
        children: [
          { path: '', redirectTo: 'calculators', pathMatch: 'full' },
          { path: 'calculators', title: 'KRA iTax | Tax Calculators', loadComponent: () => import('./pages/tax-engine/tax-calculators.component').then(m => m.TaxCalculatorsComponent) },
          { path: 'file/nil-return', title: 'KRA iTax | Nil Return', loadComponent: () => import('./pages/tax-engine/nil-return-wizard.component').then(m => m.NilReturnWizardComponent) },
          { path: 'file/tot', title: 'KRA iTax | TOT Return', loadComponent: () => import('./pages/tax-engine/tot-wizard.component').then(m => m.TotWizardComponent) },
          { path: 'mpesa-analyser', title: 'KRA iTax | M-Pesa Analyser', loadComponent: () => import('./pages/tax-engine/mpesa-analyser.component').then(m => m.MpesaAnalyserComponent) },
          { path: 'client', title: 'KRA iTax | Tax Reconciliation', loadComponent: () => import('./pages/tax-engine/reconciliation.component').then(m => m.ReconciliationComponent) },
        ]
      },

      // KRA Checkers
      {
        path: 'checkers',
        children: [
          { path: '', redirectTo: 'pin', pathMatch: 'full' },
          { path: 'pin', title: 'KRA iTax | PIN Checker', loadComponent: () => import('./pages/checkers/pin-checker.component').then(m => m.PinCheckerComponent) },
          { path: 'tcc', title: 'KRA iTax | TCC Checker', loadComponent: () => import('./pages/checkers/tcc-checker.component').then(m => m.TccCheckerComponent) },
          { path: 'prn', title: 'KRA iTax | PRN Checker', loadComponent: () => import('./pages/checkers/prn-checker.component').then(m => m.PrnCheckerComponent) },
        ]
      },

      // Notifications
      {
        path: 'notifications',
        children: [
          { path: '', redirectTo: 'hub', pathMatch: 'full' },
          { path: 'hub', title: 'KRA iTax | Notifications', loadComponent: () => import('./pages/notifications/notification-hub.component').then(m => m.NotificationHubComponent) },
          { path: 'calendar', title: 'KRA iTax | Tax Calendar', loadComponent: () => import('./pages/notifications/deadline-calendar.component').then(m => m.DeadlineCalendarComponent) },
        ]
      },

      // Helpdesk
      {
        path: 'helpdesk',
        children: [
          { path: '', redirectTo: 'tickets', pathMatch: 'full' },
          { path: 'tickets', title: 'KRA iTax | My Tickets', loadComponent: () => import('./pages/ticket-list.component').then(m => m.TicketListComponent) },
          { path: 'tickets/create', title: 'KRA iTax | Raise Ticket', loadComponent: () => import('./pages/ticket-create.component').then(m => m.TicketCreateComponent) },
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

      // Profile & Settings
      {
        path: 'profile',
        title: 'KRA iTax | My Profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        title: 'KRA iTax | Gateway Settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      },
    ]
  }
];
