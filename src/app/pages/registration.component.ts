import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Router, RouterModule } from '@angular/router';
import { PinCertificateComponent } from '../portals/member/pages/compliance/pin-certificate.component';

@Component({
  selector: 'app-registration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule, NgOptimizedImage, PinCertificateComponent],
  template: `
    <div class="fixed inset-0 flex bg-[var(--bg-root)] transition-all duration-300 overflow-hidden font-plus-jakarta" [attr.data-theme]="theme()">

      <!-- Left Panel: Enrollment Intelligence (Always Dark for Contrast) -->
      <div class="hidden lg:flex w-[400px] bg-[var(--brand-black)] relative overflow-hidden flex-col p-12 shrink-0">
        <!-- Grid Pattern Overlay -->
        <div class="absolute inset-0 opacity-[0.05] pointer-events-none" 
          style="background-image: linear-gradient(var(--bg-surface-1) 1px, transparent 1px), linear-gradient(90deg, var(--bg-surface-1) 1px, transparent 1px); background-size: 40px 40px;">
        </div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex items-center gap-4 mb-16">
            <img ngSrc="assets/logo.png" width="48" height="48" alt="KRA Logo" priority class="rounded-xl">
            <div>
              <p class="text-[9px] font-black text-[var(--color-accent)] uppercase tracking-[0.2em] mb-0.5">Kenya Revenue Authority</p>
              <h1 class="text-2xl font-black text-[var(--brand-white)] tracking-tighter">iTax<span class="text-[var(--color-accent)]">IS</span></h1>
            </div>
          </div>

          <div class="space-y-12">
            <div>
              <h2 class="text-lg font-black text-[var(--brand-white)] uppercase tracking-tight mb-3">Resident Enrollment</h2>
              <p class="text-[10px] font-semibold text-[var(--brand-white)]/40 leading-relaxed uppercase tracking-widest">Foundational taxpayer attribution sequence for legislative compliance.</p>
            </div>

            <!-- Vertical Stepper -->
            <div class="space-y-6">
              <div class="flex items-start gap-4 group cursor-pointer" (click)="goToStep(1)" [class.opacity-40]="currentStep() < 1">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all"
                  [class]="currentStep() >= 1 ? 'bg-[var(--color-accent)] text-[var(--brand-white)] shadow-[var(--shadow-glow)]' : 'bg-[var(--brand-white)]/5 text-[var(--brand-white)]/40 border border-[var(--brand-white)]/10'">
                  1
                </div>
                <div>
                  <p class="text-[8px] font-black text-[var(--color-accent)] uppercase tracking-widest mb-1">Phase 01</p>
                  <p class="text-xs font-black text-[var(--brand-white)] uppercase tracking-tight">Identity Registry</p>
                </div>
              </div>

              <div class="w-px h-8 bg-[var(--brand-white)]/10 ml-4"></div>

              <div class="flex items-start gap-4 group cursor-pointer" (click)="goToStep(2)" [class.opacity-40]="currentStep() < 2">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all"
                  [class]="currentStep() >= 2 ? 'bg-[var(--color-accent)] text-[var(--brand-white)] shadow-[var(--shadow-glow)]' : 'bg-[var(--brand-white)]/5 text-[var(--brand-white)]/40 border border-[var(--brand-white)]/10'">
                  2
                </div>
                <div>
                  <p class="text-[8px] font-black text-[var(--color-accent)] uppercase tracking-widest mb-1">Phase 02</p>
                  <p class="text-xs font-black text-[var(--brand-white)] uppercase tracking-tight">Domicile Matrix</p>
                </div>
              </div>

              <div class="w-px h-8 bg-[var(--brand-white)]/10 ml-4"></div>

              <div class="flex items-start gap-4 group cursor-pointer" (click)="goToStep(3)" [class.opacity-40]="currentStep() < 3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all"
                  [class]="currentStep() >= 3 ? 'bg-[var(--color-accent)] text-[var(--brand-white)] shadow-[var(--shadow-glow)]' : 'bg-[var(--brand-white)]/5 text-[var(--brand-white)]/40 border border-[var(--brand-white)]/10'">
                  3
                </div>
                <div>
                  <p class="text-[8px] font-black text-[var(--color-accent)] uppercase tracking-widest mb-1">Phase 03</p>
                  <p class="text-xs font-black text-[var(--brand-white)] uppercase tracking-tight">Security Protocol</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-auto space-y-4">
            <div class="h-[1px] bg-gradient-to-r from-[var(--color-accent)]/40 to-transparent"></div>
            <div class="flex gap-4 opacity-40">
              <span class="text-[8px] font-black text-[var(--brand-white)] border border-[var(--brand-white)]/20 px-2 py-1 rounded tracking-tighter">SECURE.ENROLL</span>
              <span class="text-[8px] font-black text-[var(--brand-white)] border border-[var(--brand-white)]/20 px-2 py-1 rounded tracking-tighter">AES-256</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Command Input -->
      <div class="flex-1 overflow-y-auto px-6 py-12 lg:px-12 relative flex justify-center">
        <!-- Theme Toggle -->
        <button (click)="toggleTheme()" 
          class="fixed top-8 right-8 w-10 h-10 rounded-full bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--color-accent)] transition-all hover:scale-110 shadow-sm z-50">
          @if (theme() === 'dark') {
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          } @else {
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          }
        </button>

        <div class="w-full max-w-[720px] animate-fade-in-up">
          <div class="bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-12 shadow-[var(--shadow-lg)] relative">
            
            @if (showSuccess()) {
              <div class="text-center">
                <div class="w-20 h-20 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full flex items-center justify-center mx-auto mb-8 animate-scale">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 class="text-[var(--text-3xl)] font-black text-[var(--text-primary)] tracking-tighter uppercase mb-4">Identity <span class="text-[var(--color-accent)]">Certified</span></h2>
                <p class="text-[var(--text-xs)] font-semibold text-[var(--text-secondary)] uppercase tracking-widest leading-loose mb-12">Deployment successful. Your digital identity node is initialized.</p>
                
                <div class="max-w-md mx-auto">
                    <app-pin-certificate 
                      [pin]="generatedPIN()" 
                      [name]="regForm.get('firstName')?.value + ' ' + regForm.get('lastName')?.value"
                      [email]="regForm.get('email')?.value">
                    </app-pin-certificate>
                    
                    <button class="w-full h-14 mt-12 px-6 bg-[var(--color-accent)] text-[var(--brand-white)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.2em] transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]" routerLink="/login">
                      INITIALIZE ACCESS
                    </button>
                </div>
              </div>
            } @else {
              <!-- Form Header -->
              <div class="mb-12">
                <div class="flex items-center gap-4 mb-6">
                  <div class="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent-bg)] border border-[var(--color-accent-dim)] rounded-full animate-pulse shadow-sm">
                    <span class="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></span>
                    <span class="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">Deployment Step 0{{ currentStep() }}/03</span>
                  </div>
                </div>
                <h2 class="text-[var(--text-3xl)] font-black text-[var(--text-primary)] tracking-tighter uppercase mb-3">Resident <span class="text-[var(--color-accent)]">Enrollment</span></h2>
                <p class="text-[var(--text-xs)] font-semibold text-[var(--text-secondary)] uppercase tracking-widest leading-loose">Formal taxpayer attribution sequence.</p>
              </div>

              <form [formGroup]="regForm" (ngSubmit)="onSubmit()" class="space-y-10">
                
                <!-- Step 1: Identify -->
                @if (currentStep() === 1) {
                  <div class="space-y-8 animate-fade-in">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Entity Classification</label>
                        <select formControlName="taxpayerType" class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-semibold focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none appearance-none transition-all uppercase tracking-widest">
                          <option value="individual">Individual Entity</option>
                          <option value="business">Non-Individual / Corporate</option>
                        </select>
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Residency Vector</label>
                        <select formControlName="residentStatus" class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-semibold focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none appearance-none transition-all uppercase tracking-widest">
                          <option value="resident">Resident of Kenya</option>
                          <option value="non-resident">Non-Resident Entity</option>
                        </select>
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Legal Forename</label>
                        <input type="text" formControlName="firstName" placeholder="As per Identity Document" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all uppercase">
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Legal Surname</label>
                        <input type="text" formControlName="lastName" placeholder="As per Identity Document" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all uppercase">
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Source ID / Passport</label>
                        <input type="text" formControlName="idNumber" placeholder="Primary Registry ID" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-mono font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all uppercase">
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Temporal Origin (DOB)</label>
                        <input type="date" formControlName="dob" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all">
                      </div>
                    </div>
                    
                    <button type="button" (click)="goToStep(2)" [disabled]="isStep1Invalid()"
                      class="w-full h-14 px-6 bg-[var(--color-accent)] text-[var(--brand-white)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.2em] transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] disabled:opacity-45">
                      NEXT SEQUENCE
                    </button>
                    <p class="text-center">
                      <a routerLink="/login" class="text-[var(--text-xs)] font-black text-[var(--text-muted)] hover:text-[var(--color-accent)] uppercase tracking-widest transition-colors mb-1">Return to Access Node</a>
                    </p>
                  </div>
                }

                <!-- Step 2: Domicile -->
                @if (currentStep() === 2) {
                  <div class="space-y-8 animate-fade-in">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Jurisdiction (County)</label>
                        <select formControlName="county" class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-semibold focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none appearance-none transition-all uppercase tracking-widest">
                          <option value="">Select jurisdiction...</option>
                          @for (c of counties; track c.code) { <option [value]="c.name">{{ c.name }}</option> }
                        </select>
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Major Hub / Town</label>
                        <input type="text" formControlName="town" placeholder="Origin Center" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all uppercase">
                      </div>
                      <div class="space-y-2 md:col-span-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Digital/Physical Anchor (Address)</label>
                        <textarea formControlName="address" rows="3" placeholder="Building, Floor, Street Identity..." 
                          class="w-full bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] p-4 text-[var(--text-sm)] font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all uppercase"></textarea>
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Strategic Command Station</label>
                        <select formControlName="kraStation" class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-semibold focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none appearance-none transition-all uppercase tracking-widest">
                          <option value="">Select KRA Center...</option>
                          <option value="Nairobi North">Nairobi North Hub</option>
                          <option value="Mombasa Station">Mombasa Deep Sea</option>
                          <option value="Kisumu Station">Kisumu Regional Node</option>
                        </select>
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Postal Metadata</label>
                        <input type="text" formControlName="postalCode" placeholder="e.g. 00100" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-mono font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all uppercase">
                      </div>
                    </div>
                    
                    <div class="flex gap-4">
                      <button type="button" (click)="goToStep(1)" class="h-14 px-6 border border-[var(--border-default)] text-[var(--text-secondary)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.2em] flex-1 hover:bg-[var(--bg-surface-2)]">BACK</button>
                      <button type="button" (click)="goToStep(3)" [disabled]="isStep2Invalid()" class="h-14 px-6 bg-[var(--color-accent)] text-[var(--brand-white)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.2em] flex-[2] hover:brightness-110 shadow-[var(--shadow-glow)] disabled:opacity-45">LINK PROTOCOLS</button>
                    </div>
                  </div>
                }

                <!-- Step 3: Secure -->
                @if (currentStep() === 3) {
                  <div class="space-y-10 animate-fade-in">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Verified Link (Email)</label>
                        <input type="email" formControlName="email" placeholder="name@domain.gov" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all">
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Uplink Vector (Phone)</label>
                        <input type="tel" formControlName="phone" placeholder="+254 7XX XXX" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-mono font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all">
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Encryption Key</label>
                        <input type="password" formControlName="password" placeholder="••••••••" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all">
                      </div>
                      <div class="space-y-2 group">
                        <label class="text-[var(--text-xs)] font-semibold uppercase tracking-[0.06em] text-[var(--text-secondary)] ml-1 transition-colors group-focus-within:text-[var(--color-accent)]">Validate Key</label>
                        <input type="password" formControlName="confirmPassword" placeholder="••••••••" 
                          class="w-full h-12 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-[var(--radius-lg)] px-4 text-[var(--text-sm)] font-medium focus:border-[var(--color-accent)] focus:bg-[var(--bg-surface-3)] outline-none transition-all">
                      </div>
                    </div>

                    <div class="p-8 bg-[var(--bg-surface-2)]/50 border border-[var(--border-subtle)] rounded-[var(--radius-xl)]">
                      <h4 class="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-6">Legislative Mandates</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 rounded-xl border border-[var(--color-accent-dim)] bg-[var(--color-accent-bg)] flex items-center justify-between">
                            <span class="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight">Income Tax - Res</span>
                            <span class="text-[8px] font-black text-[var(--color-accent)] border border-[var(--color-accent-dim)] px-2 py-0.5 rounded">REQUIRED</span>
                        </div>
                        <label class="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] flex items-center justify-between cursor-pointer hover:border-[var(--color-accent)]/40 transition-all">
                            <span class="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-tight">VAT Protocol</span>
                            <input type="checkbox" formControlName="obVAT" class="w-4 h-4 accent-[var(--color-accent)]">
                        </label>
                      </div>
                    </div>

                    <div class="flex items-start gap-4 p-1">
                      <input type="checkbox" formControlName="terms" class="w-4 h-4 accent-[var(--color-accent)] mt-0.5">
                      <span class="text-[10px] font-semibold text-[var(--text-secondary)] leading-relaxed uppercase tracking-widest">I formally certify all informational fragments are legally binding and accurate.</span>
                    </div>

                    <div class="flex gap-4">
                      <button type="button" (click)="goToStep(2)" class="h-14 px-6 border border-[var(--border-default)] text-[var(--text-secondary)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.2em] flex-1 hover:bg-[var(--bg-surface-2)]">BACK</button>
                      <button type="submit" [disabled]="regForm.invalid || isSubmitting()" 
                        class="h-14 px-6 bg-[var(--color-accent)] text-[var(--brand-white)] rounded-[var(--radius-lg)] font-heading font-semibold text-[var(--text-sm)] uppercase tracking-[0.2em] flex-[2] relative overflow-hidden group transition-all hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] disabled:opacity-45">
                        <span class="relative z-10 flex items-center justify-center gap-3">
                           @if (!isSubmitting()) { GENERATE IDENTITY }
                           @else { 
                             <div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                             PROCESSING... 
                            }
                        </span>
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[3000ms]"></div>
                      </button>
                    </div>
                  </div>
                }

              </form>
            }

            <div class="mt-12 pt-8 border-t border-[var(--border-subtle)] text-center">
              <span class="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20" class="text-[var(--color-accent)]"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.289-6.5 11.534-3.903-2.245-6.5-6.588-6.5-11.534 0-.68.056-1.35.166-2.001zm8.334 1.5a1 1 0 10-2 0V9H7a1 1 0 100 2h1.5v2.5a1 1 0 102 0V11H12a1 1 0 100-2h-1.5V6.499z" clip-rule="evenodd"/></svg>
                GOK DATA CUSTODIAN CERTIFIED &bull; CRYPTOGRAPHIC ENROLLMENT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class RegistrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  regForm: FormGroup;
  currentStep = signal(1);
  isSubmitting = signal(false);
  showSuccess = signal(false);
  generatedPIN = signal('');
  theme = signal<'light' | 'dark'>('light');

  counties = [
    { name: 'Mombasa', code: '001' }, { name: 'Kwale', code: '002' },
    { name: 'Kilifi', code: '003' }, { name: 'Tana River', code: '004' },
    { name: 'Lamu', code: '005' }, { name: 'Taita Taveta', code: '006' },
    { name: 'Garissa', code: '007' }, { name: 'Wajir', code: '008' },
    { name: 'Mandera', code: '009' }, { name: 'Marsabit', code: '010' },
    { name: 'Isiolo', code: '011' }, { name: 'Meru', code: '012' },
    { name: 'Tharaka-Nithi', code: '013' }, { name: 'Embu', code: '014' },
    { name: 'Kitui', code: '015' }, { name: 'Machakos', code: '016' },
    { name: 'Makueni', code: '017' }, { name: 'Nyandarua', code: '018' },
    { name: 'Nyeri', code: '019' }, { name: 'Kirinyaga', code: '020' },
    { name: 'Murang\'a', code: '021' }, { name: 'Kiambu', code: '022' },
    { name: 'Turkana', code: '023' }, { name: 'West Pokot', code: '024' },
    { name: 'Samburu', code: '025' }, { name: 'Trans Nzoia', code: '026' },
    { name: 'Uasin Gishu', code: '027' }, { name: 'Elgeyo Marakwet', code: '028' },
    { name: 'Nandi', code: '029' }, { name: 'Baringo', code: '030' },
    { name: 'Laikipia', code: '031' }, { name: 'Nakuru', code: '032' },
    { name: 'Narok', code: '033' }, { name: 'Kajiado', code: '034' },
    { name: 'Kericho', code: '035' }, { name: 'Bomet', code: '036' },
    { name: 'Kakamega', code: '037' }, { name: 'Vihiga', code: '038' },
    { name: 'Bungoma', code: '039' }, { name: 'Busia', code: '040' },
    { name: 'Siaya', code: '041' }, { name: 'Kisumu', code: '042' },
    { name: 'Homa Bay', code: '043' }, { name: 'Migori', code: '044' },
    { name: 'Kisii', code: '045' }, { name: 'Nyamira', code: '046' },
    { name: 'Nairobi', code: '047' }
  ];

  constructor() {
    this.regForm = this.fb.group({
      taxpayerType: ['individual', Validators.required],
      residentStatus: ['resident', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      idNumber: ['', [Validators.required, Validators.minLength(6)]],
      dob: ['', Validators.required],
      economicActivity: ['employment', Validators.required],

      county: ['', Validators.required],
      subCounty: ['', Validators.required],
      ward: ['', Validators.required],
      town: ['', Validators.required],
      postalCode: ['', Validators.required],
      address: ['', Validators.required],
      kraStation: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9+]{10,13}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
      
      obIncomeTax: [true],
      obVAT: [false]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme.set(prefersDark ? 'dark' : 'light');
  }

  toggleTheme() {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return pass === confirm ? null : { 'mismatch': true };
  }

  goToStep(step: number) {
    this.currentStep.set(step);
  }

  isStep1Invalid(): boolean {
    const fields = ['taxpayerType', 'residentStatus', 'firstName', 'lastName', 'idNumber', 'dob', 'economicActivity'];
    return fields.some(f => this.regForm.get(f)?.invalid);
  }

  isStep2Invalid(): boolean {
    const fields = ['county', 'subCounty', 'ward', 'town', 'postalCode', 'address', 'kraStation'];
    return fields.some(f => this.regForm.get(f)?.invalid);
  }

  onSubmit() {
    if (this.regForm.valid) {
      this.isSubmitting.set(true);
      const formData = this.regForm.getRawValue();
      const taxpayerId = this.generateTaxpayerId();
      
      const registrationData: any = {
        taxpayer_id: taxpayerId,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        type: formData.taxpayerType,
        profile: {
          id_number: formData.idNumber,
          first_name: formData.firstName,
          last_name: formData.lastName,
          dob: formData.dob,
          email: formData.email,
          phone: formData.phone,
          county: formData.county,
          town: formData.town,
          address: formData.address
        },
        obligations: [formData.obIncomeTax ? 'Income Tax - Resident' : ''],
        station: formData.kraStation
      };

      if (formData.obVAT) registrationData.obligations.push('Value Added Tax (VAT)');

      this.authService.register(registrationData).subscribe({
        next: (response: any) => {
          this.isSubmitting.set(false);
          if (response.success) {
            this.generatedPIN.set(taxpayerId);
            this.showSuccess.set(true);
          } else {
            alert(response.message || 'Error: ID number already registered.');
          }
        },
        error: () => {
          this.isSubmitting.set(false);
          alert('Error connecting to the server. Please check uplink.');
        }
      });
    } else {
      this.regForm.markAllAsTouched();
    }
  }

  private generateTaxpayerId(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let pin = 'A';
    for (let i = 0; i < 9; i++) pin += numbers.charAt(Math.floor(Math.random() * numbers.length));
    pin += letters.charAt(Math.floor(Math.random() * letters.length));
    return pin;
  }
}
