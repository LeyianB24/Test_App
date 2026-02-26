import { Component, inject, OnInit, signal, computed } from '@angular/core';
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
    <div class="matrix-container animate-in">
      <div class="matrix-header-elite">
        <div class="title-stack">
          <h1>Security <span class="gradient-text">Matrix</span></h1>
          <p class="subtitle">Assign operational access levels across system modules</p>
        </div>
        <div class="header-stats" *ngIf="!loading()">
           <div class="stat-pill">
              <span class="s-label">Active Roles:</span>
              <span class="s-value">{{ roles.length }}</span>
           </div>
           <div class="stat-pill">
              <span class="s-label">Total Pages:</span>
              <span class="s-value">{{ pages.length }}</span>
           </div>
        </div>
      </div>

      <div *ngIf="loading()" class="loading-state-elite">
        <div class="premium-spinner"></div>
        <p>Synchronizing permissions registry...</p>
      </div>

      <div *ngIf="!loading() && error()" class="error-glass">
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span>{{ error() }}</span>
      </div>

      <div *ngIf="!loading() && !error()" class="role-grid-luxury">
        
        <!-- Role Selection -->
        <div class="role-selector-panel">
          <div class="panel-label">System Identities</div>
          <div class="role-cards-stack">
            <button *ngFor="let role of roles" 
                    class="role-card-btn"
                    [class.active]="selectedRoleId() === role.id"
                    (click)="selectedRoleId.set(role.id)">
              <div class="role-icon-box">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="role-info">
                <span class="r-name">{{ role.name }}</span>
                <span class="r-meta">{{ role.description || 'Global Access' }}</span>
              </div>
              <div class="active-indicator"></div>
            </button>
          </div>
        </div>

        <!-- Permissions Editor -->
        <div class="permissions-editor-panel" *ngIf="selectedRole()">
          <div class="editor-header">
            <h3>Managing: <span class="highlight">{{ selectedRole().name }}</span></h3>
            <p>Toggle page visibility and advanced capabilities below.</p>
          </div>

          <div class="modules-container">
            <div *ngFor="let module of modules()" class="module-group">
              <div class="module-label">{{ module.name }}</div>
              
              <div class="page-access-list">
                <div *ngFor="let page of module.pages" class="page-access-row">
                  <div class="p-info">
                    <span class="p-title">{{ page.title }}</span>
                    <span class="p-slug">{{ page.slug }}</span>
                  </div>

                  <div class="p-actions">
                    <!-- Advanced Controls Toggle -->
                    <button class="advanced-btn" 
                            [class.active]="expandedPage() === page.slug"
                            (click)="toggleExpand(page.slug)"
                            *ngIf="getPermission(selectedRoleId(), page.slug, 'can_view')"
                            title="Advanced Permissions">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </button>

                    <!-- Main Access Toggle -->
                    <label class="access-switch">
                      <input type="checkbox"
                             [checked]="getPermission(selectedRoleId(), page.slug, 'can_view')"
                             (change)="togglePermission(selectedRoleId(), page.slug, 'can_view', $any($event.target).checked)"
                             [disabled]="saving()">
                      <span class="switch-slider"></span>
                    </label>
                  </div>

                  <!-- Expanded Advanced Controls -->
                  <div class="advanced-panel-elite" *ngIf="expandedPage() === page.slug && getPermission(selectedRoleId(), page.slug, 'can_view')">
                    <div class="adv-grid">
                      <label class="adv-check">
                        <input type="checkbox" 
                               [checked]="getPermission(selectedRoleId(), page.slug, 'can_edit')"
                               (change)="togglePermission(selectedRoleId(), page.slug, 'can_edit', $any($event.target).checked)">
                        <div class="adv-box">
                          <span class="adv-label">Edit</span>
                          <span class="adv-sub">Modify Data</span>
                        </div>
                      </label>
                      <label class="adv-check">
                        <input type="checkbox"
                               [checked]="getPermission(selectedRoleId(), page.slug, 'can_delete')"
                               (change)="togglePermission(selectedRoleId(), page.slug, 'can_delete', $any($event.target).checked)">
                        <div class="adv-box">
                          <span class="adv-label">Delete</span>
                          <span class="adv-sub">Remove Records</span>
                        </div>
                      </label>
                      <label class="adv-check">
                        <input type="checkbox"
                               [checked]="getPermission(selectedRoleId(), page.slug, 'can_export')"
                               (change)="togglePermission(selectedRoleId(), page.slug, 'can_export', $any($event.target).checked)">
                        <div class="adv-box">
                          <span class="adv-label">Export</span>
                          <span class="adv-sub">Download PDF/Excel</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Compact Feed -->
      <div class="compact-audit-elite" *ngIf="recentChanges.length > 0">
        <div class="audit-head">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Live Integrity Stream
        </div>
        <div class="audit-track">
          <div *ngFor="let change of recentChanges.slice(0, 3)" class="audit-entry">
            {{ change }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .matrix-container { padding: 40px; background: var(--bg-surface); min-height: 80vh; }
    .matrix-header-elite { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; }
    .title-stack h1 { font-size: 2.5rem; font-weight: 900; color: var(--text-main); margin: 0; letter-spacing: -1.5px; }
    .subtitle { color: var(--text-muted); font-size: 1rem; margin-top: 8px; font-weight: 600; }
    
    .header-stats { display: flex; gap: 16px; }
    .stat-pill { background: rgba(0,0,0,0.03); padding: 8px 16px; border-radius: 12px; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 700; border: 1px solid rgba(0,0,0,0.05); }
    .stat-pill .s-value { color: var(--kra-red); }

    .role-grid-luxury { display: grid; grid-template-columns: 320px 1fr; gap: 40px; align-items: start; }

    /* Role Panel */
    .role-selector-panel { background: rgba(0,0,0,0.015); border-radius: 24px; padding: 24px; border: 1px solid rgba(0,0,0,0.03); }
    .panel-label { font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; padding-left: 8px; }
    .role-cards-stack { display: flex; flex-direction: column; gap: 12px; }
    
    .role-card-btn {
      display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 20px; border: 2px solid transparent;
      background: var(--bg-surface); cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: left; position: relative; overflow: hidden;
    }
    .role-card-btn:hover { transform: translateX(8px); border-color: rgba(227,30,36,0.1); }
    .role-card-btn.active { border-color: var(--kra-red); background: #fffcfc; box-shadow: 0 12px 24px rgba(227,30,36,0.08); }
    
    .role-icon-box { width: 44px; height: 44px; border-radius: 12px; background: rgba(0,0,0,0.03); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: 0.3s; }
    .role-card-btn.active .role-icon-box { background: var(--kra-red); color: white; }
    
    .r-name { display: block; font-weight: 800; font-size: 1.05rem; color: var(--text-main); }
    .r-meta { display: block; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; margin-top: 4px; }
    
    .active-indicator { position: absolute; right: -10px; top: 50%; transform: translateY(-50%); width: 20px; height: 40px; background: var(--kra-red); border-radius: 20px; opacity: 0; transition: 0.3s; }
    .role-card-btn.active .active-indicator { opacity: 1; right: -12px; }

    /* Editor Panel */
    .permissions-editor-panel { background: var(--bg-surface); border-radius: 32px; padding: 32px; border: 1px solid var(--border-color); box-shadow: 0 30px 60px rgba(0,0,0,0.02); }
    .editor-header { margin-bottom: 40px; border-bottom: 1px solid var(--border-light); padding-bottom: 24px; }
    .editor-header h3 { font-size: 1.5rem; font-weight: 900; margin: 0; color: var(--text-main); }
    .editor-header .highlight { color: var(--kra-red); }
    .editor-header p { color: var(--text-muted); font-weight: 600; margin-top: 8px; }

    .module-group { margin-bottom: 40px; }
    .module-label { font-size: 0.75rem; font-weight: 900; color: var(--kra-red); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; background: rgba(227,30,36,0.05); display: inline-block; padding: 4px 12px; border-radius: 8px; }
    
    .page-access-list { display: flex; flex-direction: column; gap: 8px; }
    .page-access-row { border-radius: 16px; border: 1px solid var(--border-light); padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; transition: 0.2s; position: relative; flex-wrap: wrap; }
    .page-access-row:hover { background: rgba(0,0,0,0.01); border-color: var(--border-color); }

    .p-info { display: flex; flex-direction: column; gap: 4px; }
    .p-title { font-weight: 800; color: var(--text-main); font-size: 1.1rem; }
    .p-slug { font-size: 0.75rem; font-family: monospace; color: var(--text-muted); font-weight: 600; }

    .p-actions { display: flex; align-items: center; gap: 20px; }

    /* Access Switch */
    .access-switch { position: relative; display: inline-block; width: 64px; height: 32px; }
    .access-switch input { opacity: 0; width: 0; height: 0; }
    .switch-slider { position: absolute; cursor: pointer; inset: 0; background-color: #e5e7eb; border-radius: 32px; transition: .4s; }
    .switch-slider:before { position: absolute; content: ""; height: 24px; width: 24px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    input:checked + .switch-slider { background-color: var(--kra-red); }
    input:checked + .switch-slider:before { transform: translateX(32px); }

    .advanced-btn { border: none; background: rgba(0,0,0,0.04); color: var(--text-muted); width: 36px; height: 36px; border-radius: 12px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; }
    .advanced-btn:hover { background: var(--bg-hover); color: var(--text-main); }
    .advanced-btn.active { background: var(--text-main); color: white; }

    /* Advanced Panel */
    .advanced-panel-elite { width: 100%; margin-top: 20px; padding-top: 20px; border-top: 1px dashed var(--border-color); animation: slideDown 0.3s ease-out; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    
    .adv-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .adv-check { display: block; position: relative; cursor: pointer; }
    .adv-check input { position: absolute; opacity: 0; cursor: pointer; }
    .adv-box { background: rgba(0,0,0,0.02); padding: 16px; border-radius: 16px; border: 2px solid transparent; transition: 0.3s; }
    .adv-check input:checked + .adv-box { background: rgba(227,30,36,0.02); border-color: rgba(227,30,36,0.1); }
    .adv-label { display: block; font-weight: 800; font-size: 0.9rem; color: var(--text-main); }
    .adv-sub { display: block; font-size: 0.7rem; color: var(--text-muted); font-weight: 600; margin-top: 4px; }
    .adv-check input:checked + .adv-box .adv-label { color: var(--kra-red); }

    /* Audit Stream */
    .compact-audit-elite { margin-top: 40px; background: #0a0a0b; border-radius: 20px; padding: 20px 32px; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
    .audit-head { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .audit-track { display: flex; flex-direction: column; gap: 4px; }
    .audit-entry { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.8); border-left: 2px solid var(--kra-red); padding-left: 16px; }

    @media (max-width: 1100px) { .role-grid-luxury { grid-template-columns: 1fr; } }
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

  // New Reactive State
  selectedRoleId = signal<number | null>(null);
  expandedPage = signal<string | null>(null);

  selectedRole = computed(() => {
    const id = this.selectedRoleId();
    return this.roles.find(r => r.id === id);
  });

  modules = computed(() => {
    const groups: { name: string, pages: any[] }[] = [];
    this.pages.forEach(p => {
      let group = groups.find(g => g.name === p.module);
      if (!group) {
        group = { name: p.module, pages: [] };
        groups.push(group);
      }
      group.pages.push(p);
    });
    return groups;
  });

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
          
          // Auto-select first role if none selected
          if (!this.selectedRoleId() && this.roles.length > 0) {
            this.selectedRoleId.set(this.roles[0].id);
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load role matrix. Please try again.');
        this.loading.set(false);
      }
    });
  }

  toggleExpand(slug: string) {
    this.expandedPage.set(this.expandedPage() === slug ? null : slug);
  }

  getPermission(roleId: number | null, pageSlug: string, permKey: 'can_view' | 'can_edit' | 'can_delete' | 'can_export'): boolean {
    if (roleId === null) return false;
    const perm = this.permissions.find(p => p.role_id === roleId && p.page_slug === pageSlug);
    return perm ? (perm[permKey] === 1) : false;
  }

  togglePermission(roleId: number | null, pageSlug: string, permKey: 'can_view' | 'can_edit' | 'can_delete' | 'can_export', value: boolean) {
    if (roleId === null) return;
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
        const roleName = this.roles.find(r => r.id === roleId)?.name || `Role ${roleId}`;
        const pageTitle = this.pages.find(p => p.slug === pageSlug)?.title || pageSlug;
        const permLabel = permKey.replace('can_', '').toUpperCase();
        
        this.recentChanges.unshift(`${action.toUpperCase()}: ${permLabel} for ${pageTitle} (${roleName})`);
        
        // Update local session state to avoid full reload
        const index = this.permissions.findIndex(p => p.role_id === roleId && p.page_slug === pageSlug);
        if (index > -1) {
          this.permissions[index] = { ...this.permissions[index], ...payload };
        } else {
          this.permissions.push(payload as RolePermission);
        }
        
        this.saving.set(false);
      },
      error: (err) => {
        this.error.set('Failed to synchronize permission update.');
        this.saving.set(false);
      }
    });
  }
}
