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
    <div class="content-area animate-fade-in">
      
      <!-- Elite Header -->
      <header class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="header-titles-complex">
            <h1 class="text-3xl font-black text-primary tracking-tight">
              Role <span class="text-accent">Orchestration</span>
            </h1>
            <p class="text-[var(--text-secondary)] mt-2 font-semibold tracking-wide uppercase text-[10px]">National Authorization Control & Protocol Management</p>
          </div>
          @if (!loading()) {
            <div class="flex items-center gap-4">
              <div class="status-pill-precision online py-3 px-6">
                 <span class="text-[10px] font-black text-tertiary uppercase tracking-widest block mb-1">Active Roles</span>
                 <span class="text-xl font-black text-accent tracking-tighter uppercase">{{ totalRolesCount() }} UNITS</span>
              </div>
              <div class="status-pill-precision synced py-3 px-6">
                 <span class="text-[10px] font-black text-tertiary uppercase tracking-widest block mb-1">Protected Nodes</span>
                 <span class="text-xl font-black text-primary tracking-tighter uppercase">{{ totalPagesCount() }} SEGMENTS</span>
              </div>
            </div>
          }
        </div>
      </header>
    
      @if (loading()) {
        <div class="py-20 flex flex-col items-center gap-4">
          <div class="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <p class="text-[10px] font-black text-tertiary uppercase tracking-widest">Synchronizing Security Matrix...</p>
        </div>
      }
    
      @if (!loading() && error()) {
        <div class="stat-card-precision border-accent/20 animate-shake mb-10">
          <div class="flex items-center gap-4 text-accent">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span class="font-black uppercase text-xs tracking-widest">{{ error() }}</span>
          </div>
        </div>
      }
    
      @if (!loading() && !error()) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
    
          <!-- Role Identities -->
          <div class="lg:col-span-4 space-y-6">
            <h3 class="text-[10px] font-black text-tertiary uppercase tracking-[0.3em] pl-2 mb-6">User Role Clusters</h3>
            <div class="flex flex-col gap-4">
              @for (role of roles(); track role.id) {
                <button (click)="selectedRoleId.set(role.id)"
                  class="w-full flex items-center gap-6 p-6 rounded-2xl border-2 transition-all text-left relative group overflow-hidden"
                  [class]="selectedRoleId() === role.id ? 'bg-[var(--bg-surface-1)] border-accent shadow-xl shadow-accent/5' : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-accent/40'">
                  
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                    [class]="selectedRoleId() === role.id ? 'bg-accent text-white' : 'bg-[var(--bg-surface-2)] text-tertiary group-hover:text-accent'">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  
                  <div class="flex-1">
                    <span class="block text-sm font-black text-primary uppercase tracking-tight">{{ role.name }}</span>
                    <span class="block text-[9px] font-black text-tertiary uppercase tracking-widest mt-1 opacity-60">{{ role.description || 'Level 1 Clearance' }}</span>
                  </div>

                  @if (selectedRoleId() === role.id) {
                    <div class="absolute right-0 top-0 bottom-0 w-1 bg-accent"></div>
                  }
                </button>
              }
            </div>
          </div>
    
          <!-- Protocol Grid -->
          <div class="lg:col-span-8">
            @if (selectedRole()) {
              <div class="stat-card-precision !p-0 overflow-hidden relative border-accent/10">
                <div class="p-10 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
                   <div class="flex items-center justify-between mb-2">
                     <h2 class="text-xl font-black text-primary uppercase tracking-tight">Protocols: <span class="text-accent">{{ selectedRole().name }}</span></h2>
                     <div class="flex items-center gap-2">
                       <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                       <span class="text-[10px] font-black text-tertiary uppercase tracking-widest">Live Sync</span>
                     </div>
                   </div>
                   <p class="text-[10px] font-black text-tertiary uppercase tracking-widest">Configure cluster permission inheritance</p>
                </div>
    
                <div class="p-10 space-y-12 max-h-[800px] overflow-y-auto custom-scrollbar">
                  @for (module of modules(); track module.name) {
                    <div class="space-y-6">
                      <h4 class="text-[10px] font-black text-accent uppercase tracking-[0.3em] bg-accent/5 inline-block px-4 py-1 rounded-full border border-accent/10">{{ module.name }} Module</h4>
    
                      <div class="space-y-3">
                        @for (page of module.pages; track page.slug) {
                          <div class="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden transition-all hover:bg-[var(--bg-surface-1)]">
                            <div class="flex items-center justify-between p-6">
                              <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-xl bg-[var(--bg-surface-2)] flex items-center justify-center text-tertiary transition-all group-hover:text-accent">
                                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                </div>
                                <div>
                                  <span class="block text-xs font-black text-primary uppercase tracking-tight">{{ page.title }}</span>
                                  <span class="block text-[9px] font-black text-tertiary uppercase tracking-widest mt-1">/{{ page.slug }}</span>
                                </div>
                              </div>
    
                              <div class="flex items-center gap-6">
                                @if (getPermission(selectedRoleId(), page.slug, 'can_view')) {
                                  <button (click)="toggleExpand(page.slug)"
                                    class="text-[10px] font-black uppercase tracking-widest transition-all p-2 rounded-lg flex items-center gap-2"
                                    [class]="expandedPage() === page.slug ? 'bg-primary text-white' : 'bg-[var(--bg-surface-2)] text-tertiary hover:text-primary'">
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                                    Advanced
                                  </button>
                                }
    
                                <label class="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" class="sr-only peer"
                                    [checked]="getPermission(selectedRoleId(), page.slug, 'can_view')"
                                    (change)="togglePermission(selectedRoleId(), page.slug, 'can_view', $any($event.target).checked)"
                                    [disabled]="saving()">
                                  <div class="w-12 h-6 bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-accent peer-checked:bg-accent/10 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-tertiary after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                </label>
                              </div>
                            </div>
    
                            <!-- Advanced Matrix -->
                            @if (expandedPage() === page.slug && getPermission(selectedRoleId(), page.slug, 'can_view')) {
                              <div class="bg-[var(--bg-surface-2)] p-6 border-t border-[var(--border-subtle)] animate-fade-in">
                                <div class="grid grid-cols-3 gap-4">
                                  <label class="flex-1 cursor-pointer group">
                                    <input type="checkbox" class="sr-only peer" [checked]="getPermission(selectedRoleId(), page.slug, 'can_edit')" (change)="togglePermission(selectedRoleId(), page.slug, 'can_edit', $any($event.target).checked)">
                                    <div class="bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl p-4 text-center transition-all peer-checked:border-accent peer-checked:bg-accent/5 group-hover:border-accent group-hover:bg-accent/5">
                                      <span class="block text-[10px] font-black text-primary uppercase tracking-widest mb-1 group-hover:text-accent peer-checked:text-accent">Write</span>
                                      <span class="block text-[8px] font-black text-tertiary uppercase">Edit Data</span>
                                    </div>
                                  </label>
                                  <label class="flex-1 cursor-pointer group">
                                    <input type="checkbox" class="sr-only peer" [checked]="getPermission(selectedRoleId(), page.slug, 'can_delete')" (change)="togglePermission(selectedRoleId(), page.slug, 'can_delete', $any($event.target).checked)">
                                    <div class="bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl p-4 text-center transition-all peer-checked:border-accent peer-checked:bg-accent/5 group-hover:border-accent group-hover:bg-accent/5">
                                      <span class="block text-[10px] font-black text-primary uppercase tracking-widest mb-1 group-hover:text-accent peer-checked:text-accent">Purge</span>
                                      <span class="block text-[8px] font-black text-tertiary uppercase">Delete Data</span>
                                    </div>
                                  </label>
                                  <label class="flex-1 cursor-pointer group">
                                    <input type="checkbox" class="sr-only peer" [checked]="getPermission(selectedRoleId(), page.slug, 'can_export')" (change)="togglePermission(selectedRoleId(), page.slug, 'can_export', $any($event.target).checked)">
                                    <div class="bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl p-4 text-center transition-all peer-checked:border-accent peer-checked:bg-accent/5 group-hover:border-accent group-hover:bg-accent/5">
                                      <span class="block text-[10px] font-black text-primary uppercase tracking-widest mb-1 group-hover:text-accent peer-checked:text-accent">Export</span>
                                      <span class="block text-[8px] font-black text-tertiary uppercase">Data Sync</span>
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
            }
          </div>
        </div>
      }
    
      <!-- Integrity Stream -->
      <footer class="mt-20 bg-[var(--text-primary)] rounded-3xl p-10 relative overflow-hidden shadow-2xl">
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <h5 class="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Integrity Protocol Ledger</h5>
          </div>
          <div class="space-y-4">
            @for (change of recentChanges().slice(0, 3); track $index) {
              <div class="text-[11px] font-black text-white/80 border-l-2 border-accent pl-6 py-1 font-mono tracking-tighter uppercase">
                {{ change }}
              </div>
            } @empty {
              <div class="text-[11px] font-black text-white/20 uppercase tracking-widest pl-6">No recent modifications detected in synchronization</div>
            }
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [``]
})
export class AdminRoleMatrixComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(true);
  saving = signal(false);
  error = signal('');
  
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
