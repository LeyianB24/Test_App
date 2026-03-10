import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, Role, ModulePermission } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-role-matrix',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Protocol Header Manifold -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Advanced Authorization Layer</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                Protocol <span class="text-stroke-sm">Shield Matrix</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                CRITICAL ACCESS DELEGATION // SYSTEM AUTHORITY OVERRIDE NODE: SEC-KRA-09
              </p>
            </div>

            <div class="flex items-center gap-6">
              <div class="status-pill-precision online py-2 px-5 bg-white/5 border-white/10">
                <span class="status-pill-dot animate-pulse shadow-[0_0_8px_var(--color-success)]"></span>
                ENCRYPTION LAYER ACTIVE
              </div>
              <button (click)="savePermissions()" [disabled]="saving() || !selectedRole()" 
                class="btn-precision online !bg-accent !text-white !border-none !px-10 shadow-[0_0_20px_var(--color-accent)] disabled:opacity-40">
                {{ saving() ? 'SYNCHRONIZING...' : 'COMMIT PROTOCOL' }}
              </button>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Role Array Selection -->
          <div class="lg:col-span-3 space-y-6">
            <div class="glass-panel p-8 bg-white/[0.02]">
              <h3 class="text-[10px] font-black text-muted uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"/></svg>
                Authority Primitives
              </h3>
              <div class="space-y-3">
                @for (role of roles(); track role.id) {
                  <button (click)="selectRole(role)" 
                    class="w-full p-5 rounded-2xl text-left transition-all relative overflow-hidden group/role"
                    [class.bg-accent]="selectedRole()?.id === role.id"
                    [class.text-white]="selectedRole()?.id === role.id"
                    [class.bg-white/5]="selectedRole()?.id !== role.id"
                    [class.border]="selectedRole()?.id !== role.id"
                    [class.border-white/5]="selectedRole()?.id !== role.id"
                    [class.hover:border-accent/40]="selectedRole()?.id !== role.id">
                    @if (selectedRole()?.id === role.id) {
                      <div class="absolute inset-0 bg-gradient-to-r from-accent to-accent/80"></div>
                      <div class="absolute right-[-20%] top-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    }
                    <div class="relative z-10 flex flex-col gap-1">
                      <span class="text-xs font-black uppercase tracking-tight">{{ role.name }}</span>
                      <span class="text-[9px] font-black uppercase tracking-widest opacity-60">ID: SEC-{{ role.id }}</span>
                    </div>
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Protocol Grid Manifold -->
          <div class="lg:col-span-9">
            <div class="glass-panel overflow-hidden border-white/5">
              @if (loading()) {
               <div class="py-40 flex flex-col items-center justify-center gap-8">
                  <div class="relative w-16 h-16">
                    <div class="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                    <div class="absolute inset-0 border-4 border-t-accent rounded-full animate-spin"></div>
                  </div>
                  <p class="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Reconstructing Protocol Grid...</p>
                </div>
              } @else if (!selectedRole()) {
                <div class="py-48 flex flex-col items-center justify-center text-center gap-8 group/init">
                  <div class="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-muted border border-white/10 group-hover/init:border-accent/30 transition-all outline outline-offset-8 outline-white/5">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </div>
                  <div class="space-y-2">
                    <h3 class="text-2xl font-black text-primary uppercase tracking-tighter">Authority Lockdown</h3>
                    <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Select an authority primitive to decrypt its protocol matrix</p>
                  </div>
                </div>
              } @else {
                <div class="overflow-x-auto custom-scrollbar">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-white/[0.02] border-b border-white/5">
                        <th class="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted">Module Node</th>
                        <th class="px-8 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted text-center">Visibility</th>
                        <th class="px-8 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted text-center">Modification</th>
                        <th class="px-8 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted text-center">Purge</th>
                        <th class="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted text-center">Extraction</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                      @for (perm of permissions(); track perm.module_id) {
                        <tr class="hover:bg-white/[0.03] transition-colors group">
                          <td class="px-10 py-8">
                            <div class="flex items-center gap-5">
                              <div class="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div class="space-y-1">
                                <span class="text-sm font-black text-primary uppercase tracking-tighter block">{{ perm.module_name }}</span>
                                <span class="text-[9px] font-black text-muted uppercase tracking-widest block opacity-60">ID: MN-{{ perm.module_id }}</span>
                              </div>
                            </div>
                          </td>
                          <td class="px-8 py-8 text-center">
                            <label class="matrix-toggle mx-auto">
                              <input type="checkbox" [(ngModel)]="perm.can_view">
                              <span class="toggle-manifold">
                                <span class="toggle-core"></span>
                              </span>
                            </label>
                          </td>
                          <td class="px-8 py-8 text-center">
                            <label class="matrix-toggle mx-auto">
                              <input type="checkbox" [(ngModel)]="perm.can_edit">
                              <span class="toggle-manifold mod">
                                <span class="toggle-core"></span>
                              </span>
                            </label>
                          </td>
                          <td class="px-8 py-8 text-center">
                            <label class="matrix-toggle mx-auto">
                              <input type="checkbox" [(ngModel)]="perm.can_delete">
                              <span class="toggle-manifold purge">
                                <span class="toggle-core"></span>
                              </span>
                            </label>
                          </td>
                          <td class="px-10 py-8 text-center">
                            <label class="matrix-toggle mx-auto">
                              <input type="checkbox" [(ngModel)]="perm.can_export">
                              <span class="toggle-manifold extract">
                                <span class="toggle-core"></span>
                              </span>
                            </label>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .db-root {
      min-height: 100vh;
      background: #050505 url('assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      position: relative;
      overflow-x: hidden;
      color: #e2e8f0;
      padding: 3.5rem;
    }

    .db-root::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay {
      position: fixed;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.02;
      pointer-events: none;
      z-index: 2;
    }

    .content-area {
      position: relative;
      z-index: 10;
      max-width: 1700px;
      margin: 0 auto;
    }

    .glass-panel {
      background: rgba(15, 15, 15, 0.4);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 2.5rem;
      box-shadow: 0 40px 80px rgba(0,0,0,0.4);
    }

    .status-pill-precision {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .online { color: #10b981; }
    .status-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .text-stroke-sm {
      -webkit-text-stroke: 1px currentColor;
      color: transparent;
    }

    .matrix-toggle {
      display: block;
      width: 48px;
      height: 24px;
      cursor: pointer;
      position: relative;
    }
    .matrix-toggle input { display: none; }
    
    .toggle-manifold {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .toggle-core {
      position: absolute;
      left: 4px;
      top: 4px;
      width: 14px;
      height: 14px;
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .matrix-toggle input:checked + .toggle-manifold {
      background: rgba(16, 185, 129, 0.08);
      border-color: rgba(16, 185, 129, 0.25);
    }
    .matrix-toggle input:checked + .toggle-manifold .toggle-core {
      transform: translateX(24px);
      background: #10b981;
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
    }

    /* Override for mod/purge/extract if needed for distinct colors */
    .matrix-toggle input:checked + .toggle-manifold.mod { background: rgba(59, 130, 246, 0.08); border-color: rgba(59, 130, 246, 0.25); }
    .matrix-toggle input:checked + .toggle-manifold.mod .toggle-core { background: #3b82f6; box-shadow: 0 0 15px rgba(59, 130, 246, 0.6); }
    
    .matrix-toggle input:checked + .toggle-manifold.purge { background: rgba(217, 43, 43, 0.08); border-color: rgba(217, 43, 43, 0.25); }
    .matrix-toggle input:checked + .toggle-manifold.purge .toggle-core { background: var(--color-accent); box-shadow: 0 0 15px var(--color-accent); }

    .matrix-toggle input:checked + .toggle-manifold.extract { background: rgba(140, 82, 255, 0.08); border-color: rgba(140, 82, 255, 0.25); }
    .matrix-toggle input:checked + .toggle-manifold.extract .toggle-core { background: #8c52ff; box-shadow: 0 0 15px rgba(140, 82, 255, 0.6); }

    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-accent); }

    .animate-stagger > * {
      animation: stg 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes stg {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
    .animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
  `]
})
export class AdminRoleMatrixComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(true);
  saving = signal(false);
  roles = signal<Role[]>([]);
  selectedRole = signal<Role | null>(null);
  permissions = signal<ModulePermission[]>([]);

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loading.set(true);
    this.adminService.getRoles().subscribe({
      next: (res: { success: boolean; data: Role[] }) => {
        if (res.success && res.data) {
          this.roles.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectRole(role: Role) {
    this.selectedRole.set(role);
    this.loading.set(true);
    this.adminService.getModulePermissions(role.id).subscribe({
      next: (res: { success: boolean; data: ModulePermission[] }) => {
        if (res.success && res.data) {
          this.permissions.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  savePermissions() {
    const role = this.selectedRole();
    if (!role) return;

    this.saving.set(true);
    this.adminService.upsertPermissions(role.id, this.permissions()).subscribe({
      next: (res: { success: boolean }) => {
        if (res.success) {
          // Protocol update success feedback
        }
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }
}
