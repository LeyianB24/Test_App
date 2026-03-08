import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule, NgOptimizedImage],
  template: `
    <div class="fixed inset-0 flex bg-[var(--bg-root)] transition-all duration-300 overflow-hidden font-plus-jakarta" [attr.data-theme]="theme()">

      <!-- Left Panel: Security Intelligence (Always Dark for Contrast) -->
      <div class="hidden lg:flex w-[400px] bg-[var(--brand-black)] relative overflow-hidden flex-col p-12 shrink-0">
        <!-- Grid Pattern Overlay -->
        <div class="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style="background-image: linear-gradient(var(--bg-surface-1) 1px, transparent 1px), linear-gradient(90deg, var(--bg-surface-1) 1px, transparent 1px); background-size: 40px 40px;">
        </div>
        
        <!-- Ambient Glow -->
        <div class="absolute -top-20 -left-20 w-80 h-80 bg-[var(--color-accent)] rounded-full blur-[120px] opacity-10"></div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center gap-4 mb-16">
            <img ngSrc="assets/logo.png" width="48" height="48" alt="KRA Logo" priority class="rounded-xl">
            <div>
              <p class="text-[9px] font-black text-[var(--color-accent)] uppercase tracking-[0.2em] mb-0.5">Kenya Revenue Authority</p>
              <h1 class="text-2xl font-black text-[var(--brand-white)] tracking-tighter">iTax<span class="text-[var(--color-accent)]">IS</span></h1>
            </div>
          </div>

          <div class="space-y-8 flex-grow">
            <div>
              <h2 class="text-lg font-black text-[var(--brand-white)] uppercase tracking-tight mb-3">Identity Recovery</h2>
              <p class="text-[10px] font-semibold text-[var(--brand-white)]/40 leading-relaxed uppercase tracking-widest">Official identity restoration protocol. Protected by secure transmission and MFA verification.</p>
            </div>

            <div class="h-[1px] bg-gradient-to-r from-[var(--color-accent)]/40 to-transparent"></div>

            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_rgba(218,56,50,0.6)]"></span>
                <span class="text-[10px] font-black text-[var(--brand-white)]/40 uppercase tracking-[0.2em]">Security Protocol Active</span>
              </div>
              <p class="text-[10px] font-semibold text-[var(--brand-white)]/40 leading-relaxed uppercase tracking-widest">Ensure you have access to your registered security channels (Email/Phone) before proceeding.</p>
            </div>
          </div>

          <div class="flex gap-4 mt-auto opacity-40">
            <span class="text-[8px] font-black text-[var(--brand-white)] border border-[var(--brand-white)]/20 px-2 py-1 rounded">GOK.RECOVERY.SEC</span>
            <span class="text-[8px] font-black text-[var(--brand-white)] border border-[var(--brand-white)]/20 px-2 py-1 rounded">TLS 1.3</span>
          </div>
        </div>
      </div>

      <!-- Right Panel: Command Input -->
      <div class="flex-1 flex items-center justify-center p-6 relative">
        <!-- Theme Toggle -->
        <button (click)="toggleTheme()" 
          class="absolute top-8 right-8 w-10 h-10 rounded-full bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-all hover:scale-110 shadow-sm z-50">
          @if (theme() === 'dark') {
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          } @else {
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
        </button>

        <div class="w-full max-w-[440px] animate-fade-in-up">
          <div class="bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-10 shadow-[var(--shadow-lg)] relative overflow-hidden">
            <!-- Form Header -->
            <div class="mb-10 text-center lg:text-left">
              <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div class="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent-bg)] border border-[var(--color-accent-dim)] rounded-full animate-pulse shadow-sm mx-auto lg:mx-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                  <span class="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">Recovery Node</span>
                </div>
                <span class="text-[9px] font-mono font-medium text-[var(--text-muted)] uppercase tracking-widest">REF: RC-{{ sessionRef() }}</span>
              </div>
              
              @if (!showSuccess()) {
                <h2 class="text-[var(--text-3xl)] font-black text-[var(--text-primary)] tracking-tighter uppercase mb-3">Reset <span class="text-[var(--color-accent)]">Key</span></h2>
                <p class="text-[var(--text-xs)] font-semibold text-[var(--text-secondary)] uppercase tracking-widest leading-loose">Verify your identity to restore access.</p>
              } @else {
                <h2 class="text-[var(--text-3xl)] font-black text-[var(--text-primary)] tracking-tighter uppercase mb-3 text-[var(--color-success)]">Link <span class="text-[var(--color-success)]">Dispatched</span></h2>
                <p class="text-[var(--text-xs)] font-semibold text-[var(--text-secondary)] uppercase tracking-widest leading-loose">Identity verified. Transmission complete.</p>
              }
            </div>

            @if (!showSuccess()) {
              <form [formGroup]="recoveryForm" (ngSubmit)="onSubmit()" class="space-y-8">
                <!-- KRA PIN -->
                <div class="space-y-2 group">
                  <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Taxpayer Identification (PIN)</label>
                  <div class="relative">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--color-accent)]">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    </div>
                    <input type="text" formControlName="taxpayer_id" 
                      placeholder="e.g. A001234567X" 
                      class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] pl-12 pr-4 text-[var(--text-sm)] font-mono font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] focus:shadow-[var(--shadow-focus)] outline-none uppercase transition-all">
                  </div>
                </div>

                <!-- Errors -->
                @if (errorMessage()) {
                  <div class="p-4 bg-[var(--color-accent-bg)] border border-[var(--color-accent-dim)] rounded-[var(--radius-md)] text-[var(--color-danger)] animate-shake">
                    <div class="flex items-center gap-3">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span class="text-[var(--text-xs)] font-black uppercase tracking-widest">{{ errorMessage() }}</span>
                    </div>
                  </div>
                }

                <!-- Submit -->
                <button type="submit" [disabled]="recoveryForm.invalid || isSubmitting()"
                  class="w-full h-12 px-6 bg-[var(--color-accent)] text-[var(--brand-white)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.1em] relative overflow-hidden group transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] disabled:opacity-45 disabled:cursor-not-allowed">
                  <span class="relative z-10 flex items-center justify-center gap-3">
                    @if (!isSubmitting()) {
                      AUTHORIZE RECOVERY
                    } @else {
                      <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      TRACING RECORDS...
                    }
                  </span>
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[3000ms]"></div>
                </button>

                <div class="text-center">
                  <a routerLink="/login" class="text-[var(--text-xs)] font-black text-[var(--text-muted)] hover:text-[var(--color-accent)] uppercase tracking-widest transition-colors">Return to Security Node</a>
                </div>
              </form>
            } @else {
              <div class="space-y-8 animate-fade-in">
                <div class="p-8 bg-[var(--color-success)]/5 border border-[var(--color-success)]/20 rounded-2xl text-center">
                  <p class="text-[11px] font-black text-[var(--text-secondary)] uppercase tracking-widest leading-loose">
                    Identity verified. A secure reset token has been dispatched to your registered security channel:<br>
                    <span class="text-[var(--text-primary)] italic mt-2 block tracking-tight">{{ maskedEmail() }}</span>
                  </p>
                </div>
                
                <button class="w-full h-14 px-6 border border-[var(--border-default)] text-[var(--text-secondary)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.2em] hover:bg-[var(--bg-surface-2)] transition-all" routerLink="/login">
                  RETURN TO GATEWAY
                </button>
              </div>
            }

            <div class="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center">
              <span class="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" class="text-[var(--color-accent)]"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/></svg>
                SHA-256 SECURED &bull; TLS 1.3
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [``]
})
export class ForgotPasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  recoveryForm = this.fb.group({
    taxpayer_id: ['', Validators.required]
  });

  maskedEmail = signal('');
  isSubmitting = signal(false);
  errorMessage = signal('');
  showSuccess = signal(false);
  pinFocused = signal(false);
  theme = signal<'light' | 'dark'>('light');
  sessionRef = signal('');

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(prefersDark ? 'dark' : 'light');
    this.sessionRef.set(Math.random().toString(36).substring(2, 8).toUpperCase());
  }

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  onSubmit() {
    if (this.recoveryForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    
    const { taxpayer_id } = this.recoveryForm.getRawValue();

    this.authService.forgotPassword(taxpayer_id!).subscribe({
      next: (response: any) => {
        this.isSubmitting.set(false);
        if (response.success) {
          this.maskedEmail.set(response.masked_email || 'your registered security channel');
          this.showSuccess.set(true);
        } else {
          this.errorMessage.set(response.message || 'Identity verification sequence failed.');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Sync Failure. Uplink interrupted.');
      }
    });
  }
}
