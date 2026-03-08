import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tcc-application',
  imports: [RouterModule],
  template: `
    <div class="page-container animate-up">
      <!-- Elite Page Header -->
      <header class="page-header-elite">
        <div class="header-info">
          <h1 class="premium-title">Tax Compliance <span class="gradient-text">Certificate</span></h1>
          <p class="premium-subtitle">Apply for or renew your TCC to certify your tax compliance status.</p>
        </div>
        <div class="header-actions">
           <div class="badge-precision badge-compliant">
              COMPLIANT
           </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Application Card -->
        <div class="content-card-premium p-10 flex flex-col items-center text-center relative overflow-hidden group border-t-4 border-accent">
          
          <div class="w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-transform bg-blue-500/10">
             <svg class="w-12 h-12 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>

          <h2 class="text-2xl font-bold mb-4">Apply for New TCC</h2>
          <p class="text-sm leading-relaxed mb-10 max-w-sm mx-auto text-tertiary">
            Submit a new application for a Tax Compliance Certificate. KRA will review your filing and payment history across all obligations.
          </p>

          <button class="modern-btn primary-btn w-full justify-center" (click)="apply()">
            Begin Application Flow
          </button>
        </div>

        <!-- Certificate Status Card -->
        <div class="content-card-premium p-10 flex flex-col">
          <h3 class="text-xl font-bold mb-8 flex items-center">
             <svg class="w-6 h-6 mr-3 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             My Active Certificates
          </h3>
          
          @if (certificates.length > 0) {
            <div class="space-y-4">
              @for (cert of certificates; track cert.id) {
                <div class="certificate-row p-6 rounded-2xl border transition-colors bg-hover border-default">
                   <div class="flex justify-between items-start mb-4">
                      <div>
                         <div class="font-bold mb-1 text-primary">{{ cert.number }}</div>
                         <div class="text-[10px] font-mono text-tertiary">Issued on: {{ cert.issuedDate }}</div>
                      </div>
                      <div class="badge-precision badge-compliant">
                         VALID
                      </div>
                   </div>
                   <div class="flex justify-between items-center text-xs">
                      <span class="text-secondary">Expires: <strong class="text-primary">{{ cert.expiryDate }}</strong></span>
                      <button class="font-bold hover:underline text-accent">Download PDF</button>
                   </div>
                </div>
              }
            </div>
          } @else {
            <div class="flex-grow flex flex-col items-center justify-center text-tertiary py-10">
               <svg class="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
               <p>No active certificates found.</p>
            </div>
          }
        </div>
      </div>

      <!-- Compliance Checklist -->
      <section class="mt-12">
         <h2 class="text-2xl font-bold mb-6">Compliance Checklist</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (item of checklist; track item.label) {
              <div class="content-card-premium p-6 flex items-center">
                 <div class="w-10 h-10 rounded-full flex items-center justify-center mr-4" [class.bg-status-success]="item.ok" [class.bg-status-warning]="!item.ok">
                    @if (item.ok) {
                       <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    } @else {
                       <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    }
                 </div>
                 <div>
                    <div class="text-sm font-bold text-primary">{{ item.label }}</div>
                    <div class="text-[10px] uppercase tracking-tighter text-tertiary">{{ item.ok ? 'All Clear' : 'Attention Required' }}</div>
                 </div>
              </div>
            }
         </div>
      </section>
    </div>
  `,
  styles: [`
    /* No component specific styles needed, using global elite styles */
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TccApplicationComponent {
  certificates = [
    {
      id: 1,
      number: 'KRA/TCC/2025/1102983',
      issuedDate: '2025-06-12',
      expiryDate: '2026-06-11'
    }
  ];

  checklist = [
    { label: 'Return Filing', ok: true },
    { label: 'Payment Status', ok: true },
    { label: 'PIN Data Update', ok: true },
    { label: 'Tax Obligations', ok: true }
  ];

  apply() {
    console.log('Initiating TCC application...');
  }
}
