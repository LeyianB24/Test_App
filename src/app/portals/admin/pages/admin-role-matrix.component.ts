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
    <div class="rm-root">
      <div class="rm-grid-bg"></div>
      <div class="rm-glow-tl"></div>
      <div class="rm-glow-br"></div>

      <div class="rm-content">

        <!-- Header -->
        <header class="rm-header">
          <div class="rm-header-left">
            <div class="rm-kicker">
              <span class="rm-kicker-bar"></span>
              <span class="rm-kicker-text">Advanced Authorization Layer · SEC-KRA-09</span>
            </div>
            <h1 class="rm-title">Protocol <span class="rm-title-outline">Shield Matrix</span></h1>
            <p class="rm-subtitle">Configure access control and permission vectors per authority primitive</p>
          </div>
          <div class="rm-header-right">
            <div class="rm-status-pill">
              <span class="rm-status-dot"></span>
              ENCRYPTION ACTIVE
            </div>
            <button
              class="rm-commit-btn"
              (click)="savePermissions()"
              [disabled]="saving() || !selectedRole()"
              id="commit-protocol-btn"
            >
              <span class="rm-commit-inner">
                @if (saving()) {
                  <span class="rm-spinner"></span>
                  SYNCHRONIZING...
                } @else {
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  COMMIT PROTOCOL
                }
              </span>
              <span class="rm-commit-shimmer"></span>
            </button>
          </div>
        </header>

        <!-- Save Success Banner -->
        @if (saveSuccess()) {
          <div class="rm-success-banner">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
            Protocol matrix synchronized successfully.
          </div>
        }

        <!-- Main Grid -->
        <div class="rm-layout">

          <!-- Role List Panel -->
          <div class="rm-roles-panel">
            <div class="rm-panel-header">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Authority Primitives
            </div>
            <div class="rm-roles-list" role="list">
              @for (role of roles(); track role.id) {
                <button
                  class="rm-role-btn"
                  [class.rm-role-active]="selectedRole()?.id === role.id"
                  (click)="selectRole(role)"
                  [id]="'role-' + role.id"
                  role="listitem"
                >
                  <div class="rm-role-active-glow" *ngIf="selectedRole()?.id === role.id"></div>
                  <div class="rm-role-content">
                    <div class="rm-role-icon">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <div class="rm-role-text">
                      <span class="rm-role-name">{{ role.name }}</span>
                      <span class="rm-role-id">SEC-{{ role.id.toString().padStart(3, '0') }}</span>
                    </div>
                    <div class="rm-role-arrow">
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                </button>
              }
            </div>
          </div>

          <!-- Permissions Matrix Panel -->
          <div class="rm-matrix-panel">

            @if (loading()) {
              <div class="rm-loading-state">
                <div class="rm-scanner">
                  <div class="rm-scanner-ring rm-scanner-ring-1"></div>
                  <div class="rm-scanner-ring rm-scanner-ring-2"></div>
                  <div class="rm-scanner-beam"></div>
                  <div class="rm-scanner-icon">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                </div>
                <p class="rm-loading-text">Decrypting Protocol Matrix...</p>
                <div class="rm-loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            } @else if (!selectedRole()) {
              <div class="rm-empty-state">
                <div class="rm-empty-icon-wrap">
                  <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <h3 class="rm-empty-title">Authority Lockdown</h3>
                <p class="rm-empty-sub">Select an authority primitive from the left panel to view and configure its protocol matrix.</p>
              </div>
            } @else {
              <div class="rm-table-header">
                <div class="rm-selected-role-tag">
                  <span class="rm-selected-role-dot"></span>
                  {{ selectedRole()?.name }}
                </div>
                <span class="rm-perm-count">{{ permissions().length }} modules</span>
              </div>

              <div class="rm-table-wrap">
                <table class="rm-table" aria-label="Permission Matrix">
                  <thead>
                    <tr class="rm-thead-row">
                      <th class="rm-th rm-th-module">Module Node</th>
                      <th class="rm-th rm-th-perm">
                        <span class="rm-perm-label view">
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          View
                        </span>
                      </th>
                      <th class="rm-th rm-th-perm">
                        <span class="rm-perm-label edit">
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          Edit
                        </span>
                      </th>
                      <th class="rm-th rm-th-perm">
                        <span class="rm-perm-label delete">
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          Delete
                        </span>
                      </th>
                      <th class="rm-th rm-th-perm">
                        <span class="rm-perm-label export">
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                          Export
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (perm of permissions(); track perm.module_id) {
                      <tr class="rm-tr">
                        <td class="rm-td rm-td-module">
                          <div class="rm-module-cell">
                            <div class="rm-module-indicator"></div>
                            <div>
                              <span class="rm-module-name">{{ perm.module_name }}</span>
                              <span class="rm-module-id">MN-{{ perm.module_id.toString().padStart(3, '0') }}</span>
                            </div>
                          </div>
                        </td>
                        <td class="rm-td rm-td-perm">
                          <label class="rm-toggle view">
                            <input type="checkbox" [(ngModel)]="perm.can_view">
                            <span class="rm-track"><span class="rm-thumb"></span></span>
                          </label>
                        </td>
                        <td class="rm-td rm-td-perm">
                          <label class="rm-toggle edit">
                            <input type="checkbox" [(ngModel)]="perm.can_edit">
                            <span class="rm-track"><span class="rm-thumb"></span></span>
                          </label>
                        </td>
                        <td class="rm-td rm-td-perm">
                          <label class="rm-toggle delete">
                            <input type="checkbox" [(ngModel)]="perm.can_delete">
                            <span class="rm-track"><span class="rm-thumb"></span></span>
                          </label>
                        </td>
                        <td class="rm-td rm-td-perm">
                          <label class="rm-toggle export">
                            <input type="checkbox" [(ngModel)]="perm.can_export">
                            <span class="rm-track"><span class="rm-thumb"></span></span>
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
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    :host { display: block; font-family: 'Inter', sans-serif; }

    /* ── Root ── */
    .rm-root {
      min-height: 100vh;
      background: #060608 url('/assets/kra_background.png') no-repeat center center fixed;
      background-size: cover;
      position: relative; overflow-x: hidden;
      color: #e8e5e2; padding: 3.5rem;
      --accent: #D92B2B;
      --accent-glow: rgba(217,43,43,0.3);
      --success: #10b981;
      --blue: #3b82f6;
      --purple: #8c52ff;
      --warning: #f59e0b;
      --border: rgba(255,255,255,0.07);
      --surface-1: rgba(255,255,255,0.03);
      --surface-2: rgba(255,255,255,0.06);
      --text-1: #f0ede8;
      --text-2: rgba(160,154,148,0.8);
      --text-3: #5a5650;
    }
    .rm-root::before {
      content: ""; position: absolute; inset: 0;
      background: radial-gradient(ellipse at top left, rgba(217,43,43,0.1) 0%, transparent 50%),
                  radial-gradient(ellipse at bottom right, rgba(0,0,0,0.9) 0%, transparent 60%);
      pointer-events: none; z-index: 1;
    }
    .rm-grid-bg {
      position: fixed; inset: 0; z-index: 0;
      background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 100% 100% at 50% 0%, black 30%, transparent 80%);
    }
    .rm-glow-tl { position: fixed; top: -150px; left: -150px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(217,43,43,0.12), transparent 70%); filter: blur(60px); pointer-events: none; z-index: 0; }
    .rm-glow-br { position: fixed; bottom: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(140,82,255,0.06), transparent 70%); filter: blur(60px); pointer-events: none; z-index: 0; }

    .rm-content { position: relative; z-index: 10; max-width: 1700px; margin: 0 auto; }

    /* ── Header ── */
    .rm-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 3rem; flex-wrap: wrap; }
    .rm-header-left { space-y: 2; }
    .rm-kicker { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .rm-kicker-bar { width: 3px; height: 20px; background: var(--accent); border-radius: 2px; box-shadow: 0 0 12px var(--accent-glow); }
    .rm-kicker-text { font-size: 9px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; color: var(--accent); }
    .rm-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: var(--text-1); margin: 0 0 8px; letter-spacing: -0.04em; line-height: 1; }
    .rm-title-outline { -webkit-text-stroke: 1.5px var(--text-1); color: transparent; }
    .rm-subtitle { font-size: 13px; font-weight: 500; color: var(--text-2); margin: 0; }

    .rm-header-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
    .rm-status-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 9px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; color: var(--success); background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); border-radius: 30px; padding: 8px 16px; }
    .rm-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); box-shadow: 0 0 10px rgba(16,185,129,0.7); animation: blink 2s infinite; }
    @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.4} }

    .rm-commit-btn {
      position: relative; padding: 0 28px; height: 48px; min-width: 180px;
      background: linear-gradient(135deg, #D92B2B 0%, #b82323 100%);
      border: none; border-radius: 14px; cursor: pointer;
      overflow: hidden; transition: all 0.3s ease;
    }
    .rm-commit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(217,43,43,0.4); }
    .rm-commit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .rm-commit-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 900; letter-spacing: 0.08em; color: white; }
    .rm-commit-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transform: skewX(-20deg) translateX(-150%); animation: shimmer 3s infinite; }
    @keyframes shimmer { 0%,100%{transform:skewX(-20deg) translateX(-150%)} 60%{transform:skewX(-20deg) translateX(250%)} }
    .rm-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Success Banner */
    .rm-success-banner { display: flex; align-items: center; gap: 10px; padding: 14px 20px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 14px; color: var(--success); font-size: 13px; font-weight: 600; margin-bottom: 28px; animation: slidein 0.4s ease; }
    @keyframes slidein { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }

    /* ── Layout ── */
    .rm-layout { display: grid; grid-template-columns: 280px 1fr; gap: 20px; align-items: start; }
    @media (max-width: 900px) { .rm-layout { grid-template-columns: 1fr; } }

    /* ── Roles Panel ── */
    .rm-roles-panel { background: rgba(15,13,12,0.5); backdrop-filter: blur(32px); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; }
    .rm-panel-header { display: flex; align-items: center; gap: 8px; padding: 20px 20px 16px; font-size: 9px; font-weight: 900; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-2); border-bottom: 1px solid var(--border); }
    .rm-roles-list { padding: 12px; display: flex; flex-direction: column; gap: 6px; }

    .rm-role-btn {
      position: relative; width: 100%; padding: 14px 16px; border-radius: 16px;
      border: 1px solid var(--border); background: var(--surface-1);
      cursor: pointer; transition: all 0.2s ease; overflow: hidden; text-align: left;
    }
    .rm-role-btn:hover { background: var(--surface-2); border-color: rgba(255,255,255,0.12); }
    .rm-role-btn.rm-role-active { background: rgba(217,43,43,0.12); border-color: rgba(217,43,43,0.35); }
    .rm-role-active-glow { position: absolute; inset: 0; background: radial-gradient(circle at 30% 50%, rgba(217,43,43,0.15), transparent 70%); pointer-events: none; }
    .rm-role-content { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; }
    .rm-role-icon { width: 30px; height: 30px; border-radius: 10px; background: var(--surface-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-2); flex-shrink: 0; transition: all 0.2s; }
    .rm-role-active .rm-role-icon { background: rgba(217,43,43,0.15); border-color: rgba(217,43,43,0.3); color: var(--accent); }
    .rm-role-text { flex: 1; min-width: 0; }
    .rm-role-name { display: block; font-size: 12px; font-weight: 700; color: var(--text-1); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .rm-role-active .rm-role-name { color: #ff6f6f; }
    .rm-role-id { display: block; font-size: 9px; font-weight: 600; color: var(--text-3); letter-spacing: 0.1em; margin-top: 2px; }
    .rm-role-arrow { color: var(--text-3); opacity: 0; transform: translateX(-4px); transition: all 0.2s; }
    .rm-role-btn:hover .rm-role-arrow, .rm-role-btn.rm-role-active .rm-role-arrow { opacity: 1; transform: translateX(0); color: var(--accent); }

    /* ── Matrix Panel ── */
    .rm-matrix-panel { background: rgba(12,11,10,0.55); backdrop-filter: blur(40px); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; min-height: 400px; display: flex; flex-direction: column; }

    /* Loading */
    .rm-loading-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; padding: 80px 40px; }
    .rm-scanner { position: relative; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; }
    .rm-scanner-ring { position: absolute; border-radius: 50%; border: 2px solid var(--accent); }
    .rm-scanner-ring-1 { inset: 0; opacity: 0.3; animation: ring-pulse 2s ease-in-out infinite; }
    .rm-scanner-ring-2 { inset: 10px; opacity: 0.5; animation: ring-pulse 2s ease-in-out infinite 0.5s; }
    .rm-scanner-beam { position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, transparent 70%, var(--accent) 100%); animation: spin 1.5s linear infinite; opacity: 0.6; }
    .rm-scanner-icon { position: relative; z-index: 1; color: var(--accent); }
    @keyframes ring-pulse { 0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.7;transform:scale(1.05)} }
    .rm-loading-text { font-size: 10px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-2); }
    .rm-loading-dots { display: flex; gap: 6px; }
    .rm-loading-dots span { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: dot-bounce 1.2s ease-in-out infinite; }
    .rm-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .rm-loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dot-bounce { 0%,80%,100%{transform:scale(0.5);opacity:0.5}40%{transform:scale(1);opacity:1} }

    /* Empty State */
    .rm-empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; padding: 80px 40px; text-align: center; }
    .rm-empty-icon-wrap { width: 88px; height: 88px; border-radius: 28px; background: var(--surface-1); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--text-3); transition: all 0.4s; }
    .rm-empty-state:hover .rm-empty-icon-wrap { border-color: rgba(217,43,43,0.2); color: var(--accent); }
    .rm-empty-title { font-size: 22px; font-weight: 900; color: var(--text-1); text-transform: uppercase; letter-spacing: -0.02em; margin: 0; }
    .rm-empty-sub { font-size: 12px; font-weight: 500; color: var(--text-2); max-width: 300px; line-height: 1.7; margin: 0; }

    /* Table Header */
    .rm-table-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; border-bottom: 1px solid var(--border); }
    .rm-selected-role-tag { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #ff6f6f; }
    .rm-selected-role-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 8px var(--accent-glow); }
    .rm-perm-count { font-size: 10px; font-weight: 700; color: var(--text-3); }

    /* Table */
    .rm-table-wrap { overflow-x: auto; flex: 1; }
    .rm-table-wrap::-webkit-scrollbar { height: 3px; } .rm-table-wrap::-webkit-scrollbar-track { background: transparent; } .rm-table-wrap::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    .rm-table { width: 100%; border-collapse: collapse; }

    .rm-thead-row { background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border); }
    .rm-th { padding: 16px 20px; font-size: 9px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-2); white-space: nowrap; }
    .rm-th-module { text-align: left; min-width: 200px; }
    .rm-th-perm { text-align: center; min-width: 100px; }

    .rm-perm-label { display: inline-flex; align-items: center; gap: 5px; }
    .rm-perm-label.view { color: var(--success); }
    .rm-perm-label.edit { color: var(--blue); }
    .rm-perm-label.delete { color: var(--accent); }
    .rm-perm-label.export { color: var(--purple); }

    .rm-tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
    .rm-tr:hover { background: rgba(255,255,255,0.025); }
    .rm-tr:last-child { border-bottom: none; }
    .rm-td { padding: 16px 20px; vertical-align: middle; }
    .rm-td-module {}
    .rm-td-perm { text-align: center; }

    .rm-module-cell { display: flex; align-items: center; gap: 12px; }
    .rm-module-indicator { width: 3px; height: 32px; background: var(--border); border-radius: 2px; transition: background 0.2s; flex-shrink: 0; }
    .rm-tr:hover .rm-module-indicator { background: var(--accent); box-shadow: 0 0 8px var(--accent-glow); }
    .rm-module-name { display: block; font-size: 12px; font-weight: 700; color: var(--text-1); text-transform: uppercase; letter-spacing: 0.03em; }
    .rm-module-id { display: block; font-size: 9px; font-weight: 600; color: var(--text-3); letter-spacing: 0.1em; margin-top: 2px; }

    /* Toggles */
    .rm-toggle { display: inline-block; width: 44px; height: 22px; cursor: pointer; position: relative; }
    .rm-toggle input { display: none; }
    .rm-track { position: absolute; inset: 0; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 11px; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }
    .rm-thumb { position: absolute; left: 3px; top: 3px; width: 14px; height: 14px; background: rgba(255,255,255,0.2); border-radius: 8px; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); }

    /* View - green */
    .rm-toggle.view input:checked + .rm-track { background: rgba(16,185,129,0.12); border-color: rgba(16,185,129,0.35); box-shadow: 0 0 12px rgba(16,185,129,0.15); }
    .rm-toggle.view input:checked + .rm-track .rm-thumb { transform: translateX(22px); background: var(--success); box-shadow: 0 0 12px rgba(16,185,129,0.6); }

    /* Edit - blue */
    .rm-toggle.edit input:checked + .rm-track { background: rgba(59,130,246,0.12); border-color: rgba(59,130,246,0.35); box-shadow: 0 0 12px rgba(59,130,246,0.15); }
    .rm-toggle.edit input:checked + .rm-track .rm-thumb { transform: translateX(22px); background: var(--blue); box-shadow: 0 0 12px rgba(59,130,246,0.6); }

    /* Delete - red */
    .rm-toggle.delete input:checked + .rm-track { background: rgba(217,43,43,0.12); border-color: rgba(217,43,43,0.35); box-shadow: 0 0 12px rgba(217,43,43,0.15); }
    .rm-toggle.delete input:checked + .rm-track .rm-thumb { transform: translateX(22px); background: var(--accent); box-shadow: 0 0 12px var(--accent-glow); }

    /* Export - purple */
    .rm-toggle.export input:checked + .rm-track { background: rgba(140,82,255,0.12); border-color: rgba(140,82,255,0.35); box-shadow: 0 0 12px rgba(140,82,255,0.15); }
    .rm-toggle.export input:checked + .rm-track .rm-thumb { transform: translateX(22px); background: var(--purple); box-shadow: 0 0 12px rgba(140,82,255,0.5); }
  `]
})
export class AdminRoleMatrixComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = signal(true);
  saving = signal(false);
  saveSuccess = signal(false);
  roles = signal<Role[]>([]);
  selectedRole = signal<Role | null>(null);
  permissions = signal<ModulePermission[]>([]);

  ngOnInit() { this.loadRoles(); }

  loadRoles() {
    this.loading.set(true);
    this.adminService.getRoles().subscribe({
      next: (res: { success: boolean; data: Role[] }) => {
        if (res.success && res.data) this.roles.set(res.data);
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
        if (res.success && res.data) this.permissions.set(res.data);
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
          this.saveSuccess.set(true);
          setTimeout(() => this.saveSuccess.set(false), 3500);
        }
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }
}
