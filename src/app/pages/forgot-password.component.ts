import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule, NgOptimizedImage],
  template: `
    <div class="login-root" [attr.data-theme]="theme()">

      <!-- Theme Toggle -->
      <button class="theme-toggle" type="button" (click)="toggleTheme()"
        [attr.aria-label]="theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
        @if (theme() === 'dark') {
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        } @else {
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        }
      </button>

      <!-- Left Panel -->
      <div class="left-panel">
        <div class="left-grid"></div>
        <div class="left-glow"></div>
        <span class="corner-mark corner-tl"></span>
        <span class="corner-mark corner-tr"></span>
        <span class="corner-mark corner-bl"></span>
        <span class="corner-mark corner-br"></span>

        <div class="left-inner">
          <div class="brand-block">
            <div class="logo-wrap">
              <img ngSrc="assets/logo.png" width="52" height="52" alt="KRA Logo" priority class="logo-img">
              <div class="logo-ring"></div>
            </div>
            <div class="brand-text">
              <p class="brand-eyebrow">Kenya Revenue Authority</p>
              <h1 class="brand-name">iTax<span class="brand-accent">IS</span></h1>
              <p class="brand-sub">Security & Recovery</p>
            </div>
          </div>

          <p class="brand-tagline">
            Official identity restoration protocol.<br>Enter your Taxpayer PIN to initiate secure recovery.
          </p>

          <div class="divider-rule"></div>
          
          <div class="left-footer">
            <span class="footer-tag">GOK CERTIFIED</span>
            <span class="footer-tag">ISO 27001</span>
            <span class="footer-tag">AES-256</span>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="right-inner">
          <div class="form-card">

            <div class="form-header">
              <div class="form-header-top">
                <div class="session-badge">
                  <span class="pulse-dot"></span>
                  SECURE RECOVERY
                </div>
                <span class="form-ref">REF: RC-{{ sessionRef() }}</span>
              </div>
              
              @if (!showSuccess()) {
                <h2 class="form-title">Reset Password</h2>
                <p class="form-subtitle">Verify your identity to establish a new security cipher.</p>
              } @else {
                <h2 class="form-title">Transmission Complete</h2>
                <p class="form-subtitle">Identity verified. A secure reset token has been dispatched.</p>
              }
            </div>

            @if (!showSuccess()) {
              <form [formGroup]="recoveryForm" (ngSubmit)="onSubmit()" class="login-form">
                
                <div class="field-group" [class.field-focused]="pinFocused()">
                  <label class="field-label">KRA PIN / ID Number</label>
                  <div class="field-wrap">
                    <div class="field-icon">
                      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      formControlName="taxpayer_id"
                      placeholder="e.g. A000123456Z"
                      class="field-input"
                      (focus)="pinFocused.set(true)"
                      (blur)="pinFocused.set(false)"
                    />
                  </div>
                </div>

                @if (errorMessage()) {
                  <div class="error-bar">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="flex-shrink:0;margin-top:1px">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>{{ errorMessage() }}</span>
                  </div>
                }

                <button type="submit" class="submit-btn" [disabled]="recoveryForm.invalid || isSubmitting()">
                  <span class="submit-inner">
                    @if (!isSubmitting()) {
                      Authorize Recovery
                    } @else {
                      <span class="spinner"></span>
                      Tracing Records...
                    }
    taxpayer_id: ['', Validators.required]
  });

  maskedEmail = signal('');
  isSubmitting = signal(false);
  errorMessage = signal('');
  showSuccess = signal(false);

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
        this.errorMessage.set('Primary gateway connection timed out.');
      }
    });
  }
}
