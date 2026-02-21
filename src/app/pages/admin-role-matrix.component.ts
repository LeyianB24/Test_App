import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';

interface RolePermission {
  role_id: number;
  page_slug: string;
  can_view: number;
  can_edit: number;
  can_delete: number;
  can_export: number;
}

@Component({
  selector: 'app-admin-role-matrix',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="matrix-container">
      <div class="matrix-header">
        <h1>Role-Based Permission Matrix</h1>
        <p class="subtitle">Manage access control for roles across all pages and modules</p>
      </div>

      <div *ngIf="loading()" class="loading-spinner">
        <div class="spin"></div>
        <p>Loading role matrix...</p>
      </div>

      <div *ngIf="!loading() && error()" class="error-banner">
        ⚠️ {{ error() }}
      </div>

      <div *ngIf="!loading() && !error()" class="matrix-wrapper">
        <div class="table-responsive">
          <table class="permission-matrix">
            <thead>
              <tr class="header-row">
                <th class="role-col sticky-left">Role / Page</th>
                <th *ngFor="let p of pages" class="page-col" [title]="p.title">
                  <div class="page-header">{{ p.title }}</div>
                  <div class="page-module">{{ p.module }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let role of roles" class="role-row" [class.super]="role.name === 'SUPER_ADMIN'">
                <td class="role-name sticky-left">
                  <strong>{{ role.name }}</strong>
                  <small *ngIf="role.description">{{ role.description }}</small>
                </td>

                <td *ngFor="let page of pages" class="permission-cell">
                  <div class="perm-group">
                    <label class="perm-check" title="View">
                      <input type="checkbox"
                             [checked]="getPermission(role.id, page.slug, 'can_view')"
                             (change)="togglePermission(role.id, page.slug, 'can_view', $any($event.target).checked)"
                             [disabled]="saving()">
                      <span class="label-text">V</span>
                    </label>
                    <label class="perm-check" title="Edit">
                      <input type="checkbox"
                             [checked]="getPermission(role.id, page.slug, 'can_edit')"
                             (change)="togglePermission(role.id, page.slug, 'can_edit', $any($event.target).checked)"
                             [disabled]="saving()">
                      <span class="label-text">E</span>
                    </label>
                    <label class="perm-check" title="Delete">
                      <input type="checkbox"
                             [checked]="getPermission(role.id, page.slug, 'can_delete')"
                             (change)="togglePermission(role.id, page.slug, 'can_delete', $any($event.target).checked)"
                             [disabled]="saving()">
                      <span class="label-text">D</span>
                    </label>
                    <label class="perm-check" title="Export">
                      <input type="checkbox"
                             [checked]="getPermission(role.id, page.slug, 'can_export')"
                             (change)="togglePermission(role.id, page.slug, 'can_export', $any($event.target).checked)"
                             [disabled]="saving()">
                      <span class="label-text">X</span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="matrix-legend">
          <h3>Legend</h3>
          <div class="legend-items">
            <div class="legend-item"><strong>V</strong> = View</div>
            <div class="legend-item"><strong>E</strong> = Edit</div>
            <div class="legend-item"><strong>D</strong> = Delete</div>
            <div class="legend-item"><strong>X</strong> = Export</div>
          </div>
        </div>

        <div *ngIf="recentChanges.length > 0" class="audit-log">
          <h3>Recent Changes</h3>
          <ul class="change-list">
            <li *ngFor="let change of recentChanges.slice(0, 5)" class="change-item">
              <small>{{ change }}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .matrix-container {
      padding: 24px;
      max-width: 100%;
      background: var(--bg-surface);
      border-radius: 12px;
    }

    .matrix-header {
      margin-bottom: 32px;
    }

    .matrix-header h1 {
      font-size: 28px;
      font-weight: 800;
      color: var(--text-main);
      margin: 0 0 8px 0;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 14px;
      margin: 0;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: var(--text-secondary);
    }

    .spin {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border-color);
      border-top-color: var(--kra-red);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-banner {
      background: #FEE2E2;
      border: 1px solid #FECACA;
      color: #DC2626;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-weight: 600;
    }

    .table-responsive {
      overflow-x: auto;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .permission-matrix {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .header-row {
      background: var(--bg-hover);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-row th {
      padding: 16px 12px;
      text-align: center;
      font-weight: 700;
      color: var(--text-main);
      border-bottom: 2px solid var(--border-color);
      white-space: nowrap;
    }

    .role-col,
    .sticky-left {
      position: sticky;
      left: 0;
      z-index: 5;
      background: var(--bg-surface);
      min-width: 160px;
    }

    .header-row .sticky-left {
      background: var(--bg-hover);
      z-index: 11;
    }

    .role-row:hover .sticky-left {
      background: #F9FAFB;
    }

    .role-name {
      padding: 16px 12px;
      border-bottom: 1px solid var(--border-light);
      font-weight: 600;
      color: var(--text-main);
    }

    .role-name small {
      display: block;
      font-size: 11px;
      color: var(--text-muted);
      font-weight: normal;
      margin-top: 4px;
    }

    .role-row.super .role-name {
      background: #FFFBEB;
      color: #92400E;
    }

    .page-header {
      font-weight: 700;
      color: var(--text-main);
    }

    .page-module {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .permission-cell {
      padding: 12px 8px;
      text-align: center;
      border-bottom: 1px solid var(--border-light);
    }

    .perm-group {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .perm-check {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      background: var(--bg-hover);
      transition: all 0.2s;
    }

    .perm-check input {
      display: none;
    }

    .perm-check input:checked + .label-text {
      background: var(--kra-red);
      color: white;
    }

    .label-text {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-weight: 700;
      font-size: 11px;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .perm-check:hover {
      background: var(--border-color);
    }

    .perm-check input:disabled + .label-text {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .matrix-legend {
      background: var(--bg-hover);
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .matrix-legend h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: var(--text-main);
    }

    .legend-items {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }

    .legend-item {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .legend-item strong {
      color: var(--kra-red);
      margin-right: 6px;
    }

    .audit-log {
      background: var(--bg-hover);
      padding: 16px;
      border-radius: 8px;
      border-left: 3px solid var(--kra-red);
    }

    .audit-log h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: var(--text-main);
    }

    .change-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .change-item {
      padding: 8px 0;
      color: var(--text-secondary);
      border-bottom: 1px solid var(--border-light);
    }

    .change-item:last-child {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      .matrix-container {
        padding: 16px;
      }
      .header-row th {
        padding: 12px 8px;
        font-size: 11px;
      }
      .perm-group {
        gap: 4px;
      }
      .perm-check {
        width: 28px;
        height: 28px;
      }
    }
  `]
})
export class AdminRoleMatrixComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(true);
  saving = signal(false);
  error = signal('');
  roles: any[] = [];
  pages: any[] = [];
  permissions: RolePermission[] = [];
  recentChanges: string[] = [];

  ngOnInit(): void {
    this.fetchMatrix();
  }

  fetchMatrix() {
    this.loading.set(true);
    this.error.set('');
    this.adminService.getMatrix().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.roles = res.data.roles || [];
          this.pages = res.data.pages || [];
          this.permissions = Object.values(res.data.permissions || {}) as RolePermission[];
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load role matrix. Please try again.');
        this.loading.set(false);
      }
    });
  }

  getPermission(roleId: number, pageSlug: string, permKey: 'can_view' | 'can_edit' | 'can_delete' | 'can_export'): boolean {
    const perm = this.permissions.find(p => p.role_id === roleId && p.page_slug === pageSlug);
    return perm ? (perm[permKey] === 1) : false;
  }

  togglePermission(roleId: number, pageSlug: string, permKey: 'can_view' | 'can_edit' | 'can_delete' | 'can_export', value: boolean) {
    this.saving.set(true);

    const currentPerms = this.permissions.find(p => p.role_id === roleId && p.page_slug === pageSlug) || { can_view: 0, can_edit: 0, can_delete: 0, can_export: 0 };
    const payload = {
      role_id: roleId,
      page_slug: pageSlug,
      can_view: permKey === 'can_view' ? (value ? 1 : 0) : currentPerms.can_view,
      can_edit: permKey === 'can_edit' ? (value ? 1 : 0) : currentPerms.can_edit,
      can_delete: permKey === 'can_delete' ? (value ? 1 : 0) : currentPerms.can_delete,
      can_export: permKey === 'can_export' ? (value ? 1 : 0) : currentPerms.can_export
    };

    this.adminService.upsertPermission(payload as any).subscribe({
      next: () => {
        const action = value ? 'granted' : 'revoked';
        const role = this.roles.find(r => r.id === roleId)?.name || `Role ${roleId}`;
        const page = this.pages.find(p => p.slug === pageSlug)?.title || pageSlug;
        this.recentChanges.unshift(`${action.toUpperCase()} ${permKey.replace('can_', '').toUpperCase()} access: ${role} → ${page}`);
        this.fetchMatrix();
        this.saving.set(false);
      },
      error: (err) => {
        this.error.set('Failed to update permission.');
        this.saving.set(false);
      }
    });
  }
}
