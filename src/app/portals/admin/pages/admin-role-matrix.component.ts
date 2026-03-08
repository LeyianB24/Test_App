import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

interface RolePermission {
  role_id: number;
  page_slug: string;
  can_view: number;
  can_edit: number;
  can_delete: number;
  can_export: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-role-matrix',
  imports: [FormsModule],
  template: `
    <div class="page-container p-8 animate-up">
      <!-- Elite Header -->
      <header class="page-header-elite mb-12">
        <div class="header-info">
          <h1 class="premium-title">Role <span class="gradient-text">Management</span></h1>
          <p class="premium-subtitle">Manage system roles and permissions</p>
        </div>
        @if (!loading()) {
          <div class="header-actions flex gap-6">
            <div class="premium-stat-card px-6 py-3 border-none shadow-none bg-slate-50/50">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Active Roles</span>
              <span class="text-xl font-black text-red-600 tracking-tight">{{ totalRolesCount() }}</span>
            </div>
            <div class="premium-stat-card px-6 py-3 border-none shadow-none bg-slate-50/50">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Protected Pages</span>
              <span class="text-xl font-black text-slate-700 tracking-tight">{{ totalPagesCount() }}</span>
            </div>
          </div>
        }
      </header>
    
      @if (loading()) {
        <div class="py-32 flex flex-col items-center">
          <div class="w-12 h-12 border-4 border-slate-100 border-t-red-600 rounded-full animate-spin"></div>
          <p class="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading permissions...</p>
        </div>
      }
    
      @if (!loading() && error()) {
        <div class="m-8 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold flex items-center gap-4 animate-scale">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          {{ error() }}
        </div>
      }
    
      @if (!loading() && !error()) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
    
          <!-- Role Identities -->
          <div class="lg:col-span-4 space-y-6">
            <h3 class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-6">User Roles</h3>
            <div class="flex flex-col gap-4">
              @for (role of roles(); track role.id) {
                <button (click)="selectedRoleId.set(role.id)"
                  [class.active]="selectedRoleId() === role.id"
                  class="role-card-elite group">
                  <div class="role-icon-box" [class.active]="selectedRoleId() === role.id">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div class="text-left">
                    <span class="block text-sm font-black text-slate-800 group-hover:text-red-600 transition-colors">{{ role.name }}</span>
                    <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ role.description || 'Level 1 clearance' }}</span>
                  </div>
                  @if (selectedRoleId() === role.id) {
                    <div class="ml-auto">
                      <div class="w-1.5 h-6 bg-red-600 rounded-full animate-pulse"></div>
                    </div>
                  }
                </button>
              }
            </div>
          </div>
    
          <!-- Protocol Grid -->
          <div class="lg:col-span-8">
            @if (selectedRole()) {
              <div class="content-card-premium p-1 relative overflow-hidden">
                <div class="bg-white rounded-[1.8rem] p-10 h-full">
                  <header class="flex justify-between items-center mb-10 border-b border-slate-50 pb-8">
                    <div>
                      <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight">Protocols: <span class="text-red-600">{{ selectedRole().name }}</span></h2>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure role permissions</p>
                    </div>
                    <div class="flex gap-2">
                      <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                      <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live</span>
                    </div>
                  </header>
    
                  <div class="space-y-12">
                    @for (module of modules(); track module.name) {
                      <div class="module-section">
                        <h4 class="text-[10px] font-black text-red-600 uppercase tracking-[0.25em] mb-6 bg-red-50 inline-block px-3 py-1 rounded-md">{{ module.name }} Module</h4>
    
                        <div class="space-y-3">
                          @for (page of module.pages; track page.slug) {
                            <div class="protocol-row group" [class.expanded]="expandedPage() === page.slug">
                              <div class="flex items-center justify-between p-5">
                                <div class="flex items-center gap-4">
                                  <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                  </div>
                                  <div>
                                    <span class="block text-sm font-black text-slate-800 uppercase tracking-tight">{{ page.title }}</span>
                                    <span class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{{ page.slug }}</span>
                                  </div>
                                </div>
    
                                <div class="flex items-center gap-4">
                                  @if (getPermission(selectedRoleId(), page.slug, 'can_view')) {
                                    <button (click)="toggleExpand(page.slug)"
                                      class="advanced-toggle" [class.active]="expandedPage() === page.slug">
                                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                                      <span class="text-[9px] font-black uppercase tracking-widest ml-2 hidden sm:inline">Advanced</span>
                                    </button>
                                  }
    
                                  <!-- Elite Toggle -->
                                  <label class="premium-toggle">
                                    <input type="checkbox"
                                      [checked]="getPermission(selectedRoleId(), page.slug, 'can_view')"
                                      (change)="togglePermission(selectedRoleId(), page.slug, 'can_view', $any($event.target).checked)"
                                      [disabled]="saving()">
                                      <span class="toggle-track"></span>
                                    </label>
                                  </div>
                                </div>
    
                                <!-- Advanced Matrix -->
                                @if (expandedPage() === page.slug && getPermission(selectedRoleId(), page.slug, 'can_view')) {
                                  <div class="tactical-panel bg-slate-50/50 p-6 rounded-b-[1.2rem] border-t border-slate-100 animate-slide-down">
                                    <div class="grid grid-cols-3 gap-4">
                                      <label class="tactical-card">
                                        <input type="checkbox" [checked]="getPermission(selectedRoleId(), page.slug, 'can_edit')" (change)="togglePermission(selectedRoleId(), page.slug, 'can_edit', $any($event.target).checked)">
                                        <div class="tactical-box">
                                          <span class="t-label">Edit</span>
                                          <span class="t-sub text-[9px]">Can Edit</span>
                                        </div>
                                      </label>
                                      <label class="tactical-card">
                                        <input type="checkbox" [checked]="getPermission(selectedRoleId(), page.slug, 'can_delete')" (change)="togglePermission(selectedRoleId(), page.slug, 'can_delete', $any($event.target).checked)">
                                        <div class="tactical-box">
                                          <span class="t-label">Delete</span>
                                          <span class="t-sub text-[9px]">Can Delete</span>
                                        </div>
                                      </label>
                                      <label class="tactical-card">
                                        <input type="checkbox" [checked]="getPermission(selectedRoleId(), page.slug, 'can_export')" (change)="togglePermission(selectedRoleId(), page.slug, 'can_export', $any($event.target).checked)">
                                        <div class="tactical-box">
                                          <span class="t-label">Export</span>
                                          <span class="t-sub text-[9px]">Can Export</span>
                                        </div>
                                      </label>
                                    </div>
                                  </div>
                                }
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
    
        <!-- Integrity Stream -->
        <footer class="mt-20 bg-slate-900 rounded-[2rem] p-10 relative overflow-hidden animate-up delay-4 shadow-2xl">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
              <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Recent Permission Changes</h5>
            </div>
            <div class="space-y-2">
              @for (change of recentChanges().slice(0, 3); track $index) {
                <div class="text-[11px] font-bold text-slate-100/80 border-l-2 border-red-600 pl-6 py-1 font-mono tracking-tight">
                  {{ change }}
                </div>
              }
              @if (recentChanges().length === 0) {
                <div class="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-6">No recent changes detected</div>
              }
            </div>
          </div>
        </footer>
      </div>
    `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    
    .role-card-elite {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1.2rem;
      padding: 1.5rem;
      background: white;
      border: 1.5px solid #F1F5F9;
      border-radius: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .role-card-elite:hover {
      border-color: #E31E24;
      transform: translateX(8px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.03);
    }
    .role-card-elite.active {
      background: #FAFAFA;
      border-color: #E31E24;
      box-shadow: 0 15px 40px rgba(227, 30, 36, 0.08);
    }
    
    .role-icon-box {
      width: 3rem;
      height: 3rem;
      border-radius: 1rem;
      background: #F8FAFC;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94A3B8;
      transition: all 0.3s;
    }
    .role-icon-box.active {
      background: #E31E24;
      color: white;
      transform: scale(1.05);
    }

    .protocol-row {
      background: white;
      border: 1px solid #F8FAFC;
      border-radius: 1.2rem;
      transition: all 0.3s;
    }
    .protocol-row:hover {
      border-color: #F1F5F9;
      background: #FCFCFC;
    }
    .protocol-row.expanded {
      border-color: #F1F5F9;
      box-shadow: 0 10px 30px rgba(0,0,0,0.02);
    }

    .advanced-toggle {
      padding: 0.6rem 1rem;
      border-radius: 0.8rem;
      background: #F8FAFC;
      color: #94A3B8;
      display: flex;
      align-items: center;
      transition: all 0.2s;
    }
    .advanced-toggle:hover {
      background: #F1F5F9;
      color: #1E293B;
    }
    .advanced-toggle.active {
      background: #1E293B;
      color: white;
    }

    /* Elite Toggle */
    .premium-toggle {
      width: 3.5rem;
      height: 1.8rem;
      position: relative;
      cursor: pointer;
    }
    .premium-toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-track {
      position: absolute;
      inset: 0;
      background: #E2E8F0;
      border-radius: 2rem;
      transition: 0.4s;
    }
    .toggle-track:before {
      content: '';
      position: absolute;
      height: 1.4rem;
      width: 1.4rem;
      left: 0.2rem;
      bottom: 0.2rem;
      background: white;
      border-radius: 50%;
      transition: 0.4s;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    input:checked + .toggle-track { background: #E31E24; }
    input:checked + .toggle-track:before { transform: translateX(1.7rem); }

    .tactical-card {
      display: block;
      cursor: pointer;
    }
    .tactical-card input { display: none; }
    .tactical-box {
      background: white;
      padding: 1.2rem;
      border-radius: 1rem;
      border: 2px solid transparent;
      transition: all 0.3s;
      text-align: center;
    }
    .tactical-card input:checked + .tactical-box {
      border-color: #E31E24;
      background: rgba(227, 30, 36, 0.02);
    }
    .tactical-card input:checked + .tactical-box .t-label { color: #E31E24; }
    .t-label { display: block; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #64748B; letter-spacing: 0.1em; }

    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
  `]
})
export class AdminRoleMatrixComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(true);
  saving = signal(false);
  error = signal('');
  
  // 100% Signal-based state
  roles = signal<any[]>([]);
  pagesSource = signal<any[]>([]);
  permissions = signal<RolePermission[]>([]);
  recentChanges = signal<string[]>([]);
  selectedRoleId = signal<number | null>(null);
  expandedPage = signal<string | null>(null);

  selectedRole = computed(() => {
    const id = this.selectedRoleId();
    return this.roles().find(r => r.id === id);
  });

  modules = computed(() => {
    const groups: { name: string, pages: any[] }[] = [];
    this.pagesSource().forEach(p => {
      let group = groups.find(g => g.name === p.module);
      if (!group) {
        group = { name: p.module, pages: [] };
        groups.push(group);
      }
      group.pages.push(p);
    });
    return groups;
  });

  totalRolesCount = computed(() => this.roles().length);
  totalPagesCount = computed(() => this.pagesSource().length);

  ngOnInit(): void {
    this.fetchMatrix();
  }

  fetchMatrix() {
    this.loading.set(true);
    this.error.set('');
    this.adminService.getMatrix().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.roles.set(res.data.roles || []);
          this.pagesSource.set(res.data.pages || []);
          this.permissions.set(Object.values(res.data.permissions || {}) as RolePermission[]);
          
          if (!this.selectedRoleId() && this.roles().length > 0) {
            this.selectedRoleId.set(this.roles()[0].id);
          }
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to synchronize permissions registry.');
        this.loading.set(false);
      }
    });
  }

  toggleExpand(slug: string) {
    this.expandedPage.update(current => current === slug ? null : slug);
  }

  getPermission(roleId: number | null, pageSlug: string, permKey: keyof RolePermission): boolean {
    if (roleId === null) return false;
    const perm = this.permissions().find(p => p.role_id === roleId && p.page_slug === pageSlug);
    return perm ? (perm[permKey] === 1) : false;
  }

  togglePermission(roleId: number | null, pageSlug: string, permKey: 'can_view' | 'can_edit' | 'can_delete' | 'can_export', value: boolean) {
    if (roleId === null) return;
    this.saving.set(true);

    const currentPerms = this.permissions().find(p => p.role_id === roleId && p.page_slug === pageSlug) || 
      { role_id: roleId, page_slug: pageSlug, can_view: 0, can_edit: 0, can_delete: 0, can_export: 0 };
    
    const payload = {
      ...currentPerms,
      [permKey]: value ? 1 : 0
    };

    this.adminService.upsertPermission(payload).subscribe({
      next: () => {
        const action = value ? 'GRANTED' : 'REVOKED';
        const roleName = this.roles().find(r => r.id === roleId)?.name || `Role ${roleId}`;
        const pageTitle = this.pagesSource().find(p => p.slug === pageSlug)?.title || pageSlug;
        const permLabel = permKey.replace('can_', '').toUpperCase();
        
        this.recentChanges.update(prev => [`${action}: ${permLabel} for ${pageTitle} (${roleName})`, ...prev]);
        
        this.permissions.update(current => {
          const index = current.findIndex(p => p.role_id === roleId && p.page_slug === pageSlug);
          if (index > -1) {
            const updated = [...current];
            updated[index] = { ...updated[index], ...payload };
            return updated;
          }
          return [...current, payload as RolePermission];
        });
        
        this.saving.set(false);
      },
      error: () => {
        this.error.set('Integrity sync failed. Please verify network connection.');
        this.saving.set(false);
      }
    });
  }
}
