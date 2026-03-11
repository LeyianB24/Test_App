import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService, UserProfile } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="pf-root">
      <div class="pf-grid-bg"></div>
      <div class="pf-glow-tl"></div>
      <div class="pf-glow-br"></div>

      <div class="pf-content">

        <!-- Header -->
        <header class="pf-header">
          <div>
            <div class="pf-kicker">
              <span class="pf-kicker-bar"></span>
              <span class="pf-kicker-text">Administrative Credential Control · ID-KRA-NODE-01</span>
            </div>
            <h1 class="pf-title">Identity <span class="pf-title-outline">Matrix</span></h1>
          </div>
          <button class="pf-recalibrate-btn" id="recalibrate-btn" (click)="openEditOverlay()">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            RECALIBRATE IDENTITY
          </button>
        </header>

        <!-- Main Grid -->
        <div class="pf-grid">

          <!-- Identity Card -->
          <div class="pf-identity-card">
            <!-- Background gloss layer -->
            <div class="pf-card-bg-stripe"></div>
            <div class="pf-card-dots-overlay"></div>

            <!-- Card top bar -->
            <div class="pf-card-topbar">
              <div class="pf-card-kicker">
                <span class="pf-card-dot"></span>
                PRIMARY CREDENTIAL FRAGMENT
              </div>
              <div class="pf-card-id-ref">{{ profile()?.taxpayer_id || 'LOADING...' }}</div>
            </div>

            <!-- Card body -->
            <div class="pf-card-body">

              <!-- Avatar -->
              <div class="pf-avatar-block">
                <div class="pf-avatar-rings">
                  <div class="pf-avatar-ring ring-outer"></div>
                  <div class="pf-avatar-ring ring-mid"></div>
                </div>
                <div class="pf-avatar-frame">
                  @if (profile()?.profile_image) {
                    <img [src]="profile()!.profile_image" alt="Profile" class="pf-avatar-img">
                  } @else {
                    <div class="pf-avatar-initials">
                      {{ initials() }}
                    </div>
                  }
                  <div class="pf-status-badge"></div>
                </div>
              </div>

              <!-- Identity Data -->
              <div class="pf-identity-data">
                <div class="pf-name-block">
                  <h2 class="pf-name">{{ profile()?.name || '—' }}</h2>
                  <div class="pf-badges">
                    <span class="pf-badge pf-badge-primary">PRIMARY ACCOUNT</span>
                    <span class="pf-badge pf-badge-role">{{ profile()?.role || 'SYSTEM ADMIN' }}</span>
                  </div>
                </div>

                <!-- Data Grid -->
                <div class="pf-data-grid">
                  <div class="pf-data-item" (click)="copyPin()">
                    <span class="pf-data-label">Administrative PIN</span>
                    <div class="pf-data-val-row">
                      <span class="pf-data-value pf-mono">{{ profile()?.taxpayer_id || 'A000000000X' }}</span>
                      <span class="pf-copy-hint">
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                          <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        COPY
                      </span>
                    </div>
                    @if (pinCopied()) {
                      <span class="pf-copied-confirm">✓ Copied to clipboard</span>
                    }
                  </div>

                  <div class="pf-data-item">
                    <span class="pf-data-label">Digital Signature</span>
                    <span class="pf-data-value">{{ profile()?.email || '—' }}</span>
                  </div>

                  <div class="pf-data-item">
                    <span class="pf-data-label">Node Cluster</span>
                    <span class="pf-data-value">{{ profile()?.station || 'NAIROBI NORTH' }}</span>
                  </div>

                  <div class="pf-data-item">
                    <span class="pf-data-label">Communication Vector</span>
                    <span class="pf-data-value pf-mono">{{ profile()?.phone || '+254 — — —' }}</span>
                  </div>

                  <div class="pf-data-item pf-data-wide">
                    <span class="pf-data-label">Physical Registry</span>
                    <span class="pf-data-value">{{ profile()?.address || 'TIMES TOWER, HAILE SELASSIE AVE, NAIROBI' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Panels -->
          <div class="pf-sidebar">

            <!-- Security Integrity -->
            <div class="pf-security-panel">
              <div class="pf-panel-title">Security Integrity</div>

              <div class="pf-gauge-wrap">
                <svg class="pf-gauge" viewBox="0 0 100 100">
                  <!-- Background track -->
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8" stroke-dasharray="264" stroke-dashoffset="0"/>
                  <!-- Value arc -->
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gauge-grad)" stroke-width="8"
                    stroke-dasharray="264" stroke-dashoffset="39.6"
                    stroke-linecap="round" transform="rotate(-90 50 50)">
                    <animate attributeName="stroke-dashoffset" from="264" to="39.6" dur="1.5s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1"/>
                  </circle>
                  <defs>
                    <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#D92B2B"/>
                      <stop offset="100%" stop-color="#ff6b6b"/>
                    </linearGradient>
                  </defs>
                  <text x="50" y="46" text-anchor="middle" fill="#f0ede8" font-size="14" font-weight="900" font-family="Inter, sans-serif">85%</text>
                  <text x="50" y="60" text-anchor="middle" fill="rgba(160,154,148,0.6)" font-size="7" font-weight="700" font-family="Inter, sans-serif" letter-spacing="1">SHIELD SYNC</text>
                </svg>
              </div>

              <div class="pf-security-rows">
                <div class="pf-security-row">
                  <span class="pf-security-label">2FA Status</span>
                  <span class="pf-security-val pf-val-success">ENABLED</span>
                </div>
                <div class="pf-security-row">
                  <span class="pf-security-label">Encryption Level</span>
                  <span class="pf-security-val pf-val-accent">TIER-X</span>
                </div>
                <div class="pf-security-row">
                  <span class="pf-security-label">Session Protocol</span>
                  <span class="pf-security-val pf-val-success">TLS 1.3</span>
                </div>
                <div class="pf-security-row">
                  <span class="pf-security-label">Last Access</span>
                  <span class="pf-security-val">{{ profile()?.last_login || 'CURRENT SESSION' }}</span>
                </div>
              </div>
            </div>

            <!-- Certificate Panel -->
            <button class="pf-cert-btn" (click)="downloadCertificate()">
              <div class="pf-cert-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div class="pf-cert-text">
                <span class="pf-cert-title">Extract PIN Certificate</span>
                <span class="pf-cert-sub">Authorized PDF Vector</span>
              </div>
              <svg class="pf-cert-arrow" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            <!-- Quick Info -->
            <div class="pf-info-panel">
              <div class="pf-panel-title">Node Metadata</div>
              <div class="pf-info-rows">
                <div class="pf-info-row">
                  <span class="pf-info-key">Department</span>
                  <span class="pf-info-val">{{ profile()?.department || 'ENFORCEMENT' }}</span>
                </div>
                <div class="pf-info-row">
                  <span class="pf-info-key">Designation</span>
                  <span class="pf-info-val">{{ profile()?.designation || 'TAX OFFICER II' }}</span>
                </div>
                <div class="pf-info-row">
                  <span class="pf-info-key">Auth Level</span>
                  <span class="pf-info-val pf-info-accent">ADMIN</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Recalibration Overlay -->
      @if (showEditOverlay()) {
        <div class="pf-overlay-backdrop" (click)="maybeClose($event)">
          <div class="pf-overlay" id="edit-overlay">
            <div class="pf-overlay-scan"></div>

            <div class="pf-overlay-header">
              <div>
                <div class="pf-overlay-kicker">
                  <span class="pf-overlay-kicker-dot"></span>
                  Secure Repositing Protocol
                </div>
                <h2 class="pf-overlay-title">Recalibrate Identity</h2>
              </div>
              <button class="pf-overlay-close" (click)="closeEditOverlay()" aria-label="Close overlay">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <form [formGroup]="editForm" (ngSubmit)="saveProfile()" class="pf-overlay-form">
              <div class="pf-form-grid">
                <div class="pf-form-field">
                  <label class="pf-form-label">Communication Vector</label>
                  <input type="tel" formControlName="phone" placeholder="+254 700 000 000" class="pf-form-input pf-mono">
                </div>
                <div class="pf-form-field">
                  <label class="pf-form-label">Digital Signature (Email)</label>
                  <input type="email" formControlName="email" placeholder="user@kra.go.ke" class="pf-form-input">
                </div>
              </div>
              <div class="pf-form-field">
                <label class="pf-form-label">Physical Registry Address</label>
                <input type="text" formControlName="address" placeholder="Times Tower, Haile Selassie Ave, Nairobi" class="pf-form-input">
              </div>

              <div class="pf-overlay-actions">
                <button type="button" class="pf-btn-abort" (click)="closeEditOverlay()">ABORT COMMAND</button>
                <button type="submit" class="pf-btn-commit" id="save-profile-btn" [disabled]="submitting() || editForm.invalid">
                  <span class="pf-btn-commit-inner">
                    @if (submitting()) {
                      <span class="pf-spinner"></span>COMMITTING...
                    } @else {
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>
                      COMMIT PROFILE
                    }
                  </span>
                  <span class="pf-btn-shimmer"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
    :host { display: block; font-family: 'Inter', sans-serif; }

    /* ── Root ── */
    .pf-root {
      min-height: 100vh;
      background: #060608;
      
      position: relative; overflow-x: hidden; color: #e8e5e2;
      padding: 3.5rem;
      --accent: #D92B2B;
      --accent-glow: rgba(217,43,43,0.35);
      --success: #10b981;
      --border: rgba(255,255,255,0.07);
      --surface-1: rgba(255,255,255,0.03);
      --surface-2: rgba(255,255,255,0.06);
      --text-1: #f0ede8;
      --text-2: rgba(160,154,148,0.8);
      --text-3: #5a5650;
    }
    .pf-root::before { content: ""; position: absolute; inset: 0; background: radial-gradient(ellipse at top left, rgba(217,43,43,0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(0,0,0,0.85) 0%, transparent 60%); pointer-events: none; z-index: 1; }
    .pf-grid-bg { position: fixed; inset: 0; z-index: 0; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 20%, transparent 80%); }
    .pf-glow-tl { position: fixed; top: -150px; left: -150px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(217,43,43,0.12), transparent 70%); filter: blur(60px); pointer-events: none; z-index: 0; }
    .pf-glow-br { position: fixed; bottom: -100px; right: -100px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(140,82,255,0.06), transparent 70%); filter: blur(60px); pointer-events: none; z-index: 0; }

    .pf-content { position: relative; z-index: 10; max-width: 1600px; margin: 0 auto; }

    /* ── Header ── */
    .pf-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 3rem; flex-wrap: wrap; }
    .pf-kicker { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .pf-kicker-bar { width: 3px; height: 20px; background: var(--accent); border-radius: 2px; box-shadow: 0 0 12px var(--accent-glow); }
    .pf-kicker-text { font-size: 9px; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase; color: var(--accent); }
    .pf-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: var(--text-1); margin: 0; letter-spacing: -0.04em; line-height: 1; }
    .pf-title-outline { -webkit-text-stroke: 1.5px var(--text-1); color: transparent; }

    .pf-recalibrate-btn { display: flex; align-items: center; gap: 8px; padding: 12px 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: var(--text-1); cursor: pointer; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.25s; flex-shrink: 0; }
    .pf-recalibrate-btn:hover { background: rgba(217,43,43,0.1); border-color: rgba(217,43,43,0.35); color: #ff6f6f; }

    /* ── Main Grid ── */
    .pf-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
    @media (max-width: 1100px) { .pf-grid { grid-template-columns: 1fr; } }

    /* ── Identity Card ── */
    .pf-identity-card {
      background: linear-gradient(145deg, rgba(20,18,16,0.8) 0%, rgba(10,9,8,0.9) 100%);
      backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 28px; overflow: hidden; position: relative;
      box-shadow: 0 40px 80px rgba(0,0,0,0.5);
    }

    .pf-card-bg-stripe {
      position: absolute; top: 0; right: 0; width: 50%; height: 100%;
      background: linear-gradient(135deg, transparent 0%, rgba(217,43,43,0.03) 100%);
      pointer-events: none;
    }
    .pf-card-dots-overlay {
      position: absolute; inset: 0; pointer-events: none; z-index: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 24px 24px;
      mask-image: radial-gradient(ellipse at 80% 50%, black 0%, transparent 70%);
    }

    .pf-card-topbar { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; padding: 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.015); }
    .pf-card-kicker { display: flex; align-items: center; gap: 8px; font-size: 9px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-2); }
    .pf-card-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); box-shadow: 0 0 10px rgba(16,185,129,0.7); animation: blink 2s infinite; }
    @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.4} }
    .pf-card-id-ref { font-size: 11px; font-weight: 700; color: var(--text-3); letter-spacing: 0.12em; font-family: 'JetBrains Mono', monospace; }

    .pf-card-body { position: relative; z-index: 2; padding: 32px 28px 36px; display: flex; gap: 36px; flex-wrap: wrap; }

    /* Avatar */
    .pf-avatar-block { position: relative; flex-shrink: 0; display: flex; align-items: flex-start; justify-content: center; width: 160px; }
    .pf-avatar-rings { position: absolute; inset: -20px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
    .pf-avatar-ring { position: absolute; border-radius: 50%; border: 1px solid var(--accent); }
    .ring-outer { inset: 0; opacity: 0.12; animation: ring-p 3s ease-in-out infinite; }
    .ring-mid { inset: 12px; opacity: 0.2; animation: ring-p 3s ease-in-out infinite 1s; }
    @keyframes ring-p { 0%,100%{opacity:.12;transform:scale(1)}50%{opacity:.3;transform:scale(1.04)} }
    .pf-avatar-frame { position: relative; width: 140px; height: 140px; border-radius: 28px; overflow: hidden; background: var(--surface-2); border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
    .pf-avatar-img { width: 100%; height: 100%; object-fit: cover; }
    .pf-avatar-initials { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 900; color: var(--text-1); background: linear-gradient(145deg, rgba(217,43,43,0.15), rgba(255,255,255,0.03)); }
    .pf-status-badge { position: absolute; bottom: 10px; right: 10px; width: 14px; height: 14px; border-radius: 50%; background: var(--success); border: 3px solid #060608; box-shadow: 0 0 14px rgba(16,185,129,0.7); }

    /* Identity Data */
    .pf-identity-data { flex: 1; min-width: 300px; }
    .pf-name-block { margin-bottom: 28px; }
    .pf-name { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 900; color: var(--text-1); margin: 0 0 12px; letter-spacing: -0.03em; text-transform: uppercase; }
    .pf-badges { display: flex; flex-wrap: wrap; gap: 8px; }
    .pf-badge { font-size: 8px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; }
    .pf-badge-primary { color: var(--success); background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); }
    .pf-badge-role { color: var(--accent); background: rgba(217,43,43,0.08); border: 1px solid rgba(217,43,43,0.25); }

    .pf-data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .pf-data-item { cursor: default; }
    .pf-data-wide { grid-column: 1 / -1; }
    .pf-data-label { display: block; font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-3); margin-bottom: 6px; }
    .pf-data-val-row { display: flex; align-items: center; gap: 10px; }
    .pf-data-value { font-size: 14px; font-weight: 700; color: var(--text-1); }
    .pf-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.08em; }
    .pf-copy-hint { display: flex; align-items: center; gap: 4px; font-size: 8px; font-weight: 800; letter-spacing: 0.15em; color: var(--text-3); opacity: 0; transition: opacity 0.2s; cursor: pointer; }
    .pf-data-item:hover .pf-copy-hint { opacity: 1; }
    .pf-data-item:hover .pf-data-value { color: var(--accent); }
    .pf-copied-confirm { font-size: 9px; font-weight: 700; color: var(--success); display: block; margin-top: 4px; animation: fadein 0.3s; }
    @keyframes fadein { from{opacity:0}to{opacity:1} }

    /* ── Sidebar ── */
    .pf-sidebar { display: flex; flex-direction: column; gap: 16px; }

    .pf-security-panel { background: rgba(12,11,10,0.6); backdrop-filter: blur(32px); border: 1px solid var(--border); border-radius: 24px; padding: 24px; }
    .pf-panel-title { font-size: 9px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-2); margin-bottom: 20px; }

    .pf-gauge-wrap { display: flex; justify-content: center; margin-bottom: 20px; }
    .pf-gauge { width: 110px; height: 110px; }

    .pf-security-rows { display: flex; flex-direction: column; gap: 8px; }
    .pf-security-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--surface-1); border: 1px solid var(--border); border-radius: 12px; }
    .pf-security-label { font-size: 10px; font-weight: 600; color: var(--text-2); }
    .pf-security-val { font-size: 9px; font-weight: 900; letter-spacing: 0.1em; color: var(--text-3); }
    .pf-val-success { color: var(--success); }
    .pf-val-accent { color: var(--accent); }

    .pf-cert-btn { width: 100%; background: rgba(12,11,10,0.6); backdrop-filter: blur(32px); border: 1px solid var(--border); border-radius: 24px; padding: 20px 22px; cursor: pointer; display: flex; align-items: center; gap: 16px; text-align: left; transition: all 0.25s; color: var(--text-1); }
    .pf-cert-btn:hover { border-color: rgba(217,43,43,0.3); background: rgba(217,43,43,0.06); }
    .pf-cert-icon { width: 44px; height: 44px; border-radius: 14px; background: rgba(217,43,43,0.1); border: 1px solid rgba(217,43,43,0.25); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; transition: transform 0.2s; }
    .pf-cert-btn:hover .pf-cert-icon { transform: scale(1.1); }
    .pf-cert-text { flex: 1; }
    .pf-cert-title { display: block; font-size: 12px; font-weight: 700; color: var(--text-1); text-transform: uppercase; letter-spacing: 0.04em; }
    .pf-cert-sub { display: block; font-size: 9px; font-weight: 600; color: var(--text-3); letter-spacing: 0.1em; margin-top: 3px; }
    .pf-cert-arrow { color: var(--text-3); transition: all 0.2s; }
    .pf-cert-btn:hover .pf-cert-arrow { color: var(--accent); transform: translateX(2px); }

    .pf-info-panel { background: rgba(12,11,10,0.6); backdrop-filter: blur(32px); border: 1px solid var(--border); border-radius: 24px; padding: 24px; }
    .pf-info-rows { display: flex; flex-direction: column; gap: 8px; }
    .pf-info-row { display: flex; align-items: center; justify-content: space-between; }
    .pf-info-key { font-size: 10px; font-weight: 600; color: var(--text-2); }
    .pf-info-val { font-size: 10px; font-weight: 800; letter-spacing: 0.06em; color: var(--text-1); text-transform: uppercase; }
    .pf-info-accent { color: var(--accent); }

    /* ── Edit Overlay ── */
    .pf-overlay-backdrop { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(20px); background: rgba(4,3,3,0.85); animation: fadein 0.3s; }

    .pf-overlay {
      position: relative; width: 100%; max-width: 640px;
      background: rgba(12,11,10,0.95); backdrop-filter: blur(40px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 28px;
      overflow: hidden; box-shadow: 0 60px 120px rgba(0,0,0,0.7);
      animation: overlayIn 0.5s cubic-bezier(0.22,1,0.36,1);
    }
    @keyframes overlayIn { from{opacity:0;transform:scale(0.96) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)} }

    .pf-overlay-scan { position: absolute; top: 0; left: 0; right: 0; height: 1.5px; background: linear-gradient(90deg, transparent, var(--accent), transparent); animation: scan 3s ease-in-out infinite; opacity: 0.6; }
    @keyframes scan { 0%{transform:translateY(0);opacity:.6}50%{transform:translateY(300px);opacity:.2}100%{transform:translateY(0);opacity:.6} }

    .pf-overlay-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 28px 32px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .pf-overlay-kicker { display: flex; align-items: center; gap: 8px; font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
    .pf-overlay-kicker-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent-glow); animation: blink 2s infinite; }
    .pf-overlay-title { font-size: 28px; font-weight: 900; color: var(--text-1); margin: 0; letter-spacing: -0.03em; }
    .pf-overlay-close { width: 44px; height: 44px; border-radius: 14px; background: var(--surface-1); border: 1px solid var(--border); color: var(--text-2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
    .pf-overlay-close:hover { background: rgba(217,43,43,0.1); border-color: rgba(217,43,43,0.3); color: var(--accent); }

    .pf-overlay-form { padding: 28px 32px 32px; display: flex; flex-direction: column; gap: 20px; }
    .pf-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 600px) { .pf-form-grid { grid-template-columns: 1fr; } }
    .pf-form-field { display: flex; flex-direction: column; gap: 8px; }
    .pf-form-label { font-size: 9px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-2); margin-left: 4px; }
    .pf-form-input { background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 13px 18px; font-size: 14px; font-weight: 600; color: var(--text-1); font-family: inherit; outline: none; transition: all 0.2s; }
    .pf-form-input:focus { border-color: var(--accent); background: rgba(217,43,43,0.04); box-shadow: 0 0 0 4px rgba(217,43,43,0.1); }
    .pf-form-input::placeholder { color: var(--text-3); }

    .pf-overlay-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
    .pf-btn-abort { padding: 12px 22px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: var(--text-2); cursor: pointer; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.2s; }
    .pf-btn-abort:hover { border-color: rgba(255,255,255,0.2); color: var(--text-1); }
    .pf-btn-commit { position: relative; padding: 12px 24px; background: linear-gradient(135deg, #D92B2B, #b82323); border: none; border-radius: 12px; cursor: pointer; overflow: hidden; transition: all 0.25s; }
    .pf-btn-commit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(217,43,43,0.4); }
    .pf-btn-commit:disabled { opacity: 0.4; cursor: not-allowed; }
    .pf-btn-commit-inner { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 900; letter-spacing: 0.08em; color: white; }
    .pf-btn-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transform: skewX(-20deg) translateX(-150%); animation: shimmer 3s infinite; }
    @keyframes shimmer { 0%,100%{transform:skewX(-20deg) translateX(-150%)}60%{transform:skewX(-20deg) translateX(250%)} }
    .pf-spinner { width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ProfileComponent implements OnInit {
  private authSvc = inject(AuthService);
  private fb = inject(FormBuilder);

  profile = signal<UserProfile | null>(null);
  showEditOverlay = signal(false);
  submitting = signal(false);
  pinCopied = signal(false);

  editForm = this.fb.group({
    name:    [''],
    email:   ['', [Validators.required, Validators.email]],
    phone:   [''],
    address: ['']
  });

  get initials(): () => string {
    return () => {
      const name = this.profile()?.name || '';
      return name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase() || '??';
    };
  }

  ngOnInit() { this.loadProfile(); }

  loadProfile() {
    this.authSvc.getProfile().subscribe({
      next: (res: { success: boolean, data: UserProfile }) => {
        if (res.success && res.data) {
          this.profile.set(res.data);
          this.editForm.patchValue({
            name:    res.data.name,
            email:   res.data.email,
            phone:   res.data.phone,
            address: res.data.address
          });
        }
      }
    });
  }

  openEditOverlay() { this.showEditOverlay.set(true); }
  closeEditOverlay() { this.showEditOverlay.set(false); }

  maybeClose(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('pf-overlay-backdrop')) {
      this.closeEditOverlay();
    }
  }

  saveProfile() {
    if (this.editForm.invalid) return;
    this.submitting.set(true);
    this.authSvc.updateProfile(this.editForm.value as any).subscribe({
      next: (res: { success: boolean }) => {
        if (res.success) {
          this.loadProfile();
          this.closeEditOverlay();
        }
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }

  copyPin() {
    const pin = this.profile()?.taxpayer_id || 'A000000000X';
    navigator.clipboard.writeText(pin);
    this.pinCopied.set(true);
    setTimeout(() => this.pinCopied.set(false), 2500);
  }

  downloadCertificate() {
    console.log('Initiating PIN certificate extraction protocol...');
  }
}
