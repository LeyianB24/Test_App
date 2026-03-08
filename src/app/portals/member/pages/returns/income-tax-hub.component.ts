import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-income-tax-hub',
  imports: [RouterModule],
  template: `
    <div class="it-hub-container p-6 animate-fade-in">
      <header class="mb-10">
        <h1 class="text-3xl font-bold text-primary mb-2">Annual Income Tax Filing</h1>
        <p class="text-tertiary">Select your tax category to begin the annual return filing process.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- IT1: Individual -->
        <div class="card-gradient p-8 rounded-3xl border border-default hover:border-accent transition-all group relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all"></div>
          
          <div class="flex items-start justify-between mb-8">
            <div class="p-4 bg-accent/20 rounded-2xl shadow-lg border border-accent/30">
              <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <span class="px-3 py-1 bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full">Form IT1</span>
          </div>

          <h3 class="text-2xl font-bold text-primary mb-3">Individual Income Tax</h3>
          <p class="text-tertiary text-sm leading-relaxed mb-8">
            For residents and non-residents with employment income, business income, or professional fees. Includes self-employed individuals.
          </p>

          <button class="w-full py-4 primary-btn font-bold rounded-2xl transition-all flex items-center justify-center">
            Start IT1 Wizard
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>

        <!-- IT2C: Company/Corporate -->
        <div class="card-gradient p-8 rounded-3xl border border-default hover:border-success transition-all group relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-success/10 rounded-full blur-3xl group-hover:bg-success/20 transition-all"></div>

          <div class="flex items-start justify-between mb-8">
            <div class="p-4 bg-success/20 rounded-2xl shadow-lg border border-success/30">
              <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <span class="px-3 py-1 bg-success/20 text-success text-[10px] font-bold uppercase tracking-widest rounded-full">Form IT2C</span>
          </div>

          <h3 class="text-2xl font-bold text-primary mb-3">Company Income Tax</h3>
          <p class="text-tertiary text-sm leading-relaxed mb-8">
            For limited companies, SACCOs, Trusts, and Clubs. Filing based on audited financial statements and tax computations.
          </p>

          <button class="w-full py-4 modern-btn outline-btn font-bold rounded-2xl transition-all flex items-center justify-center">
            File Corporate Return
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>
      </div>

      <!-- Secondary Options -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
         <div class="p-6 glass-card flex items-center justify-between group cursor-pointer">
            <div class="flex items-center">
               <div class="w-12 h-12 bg-app rounded-xl flex items-center justify-center mr-4 text-tertiary group-hover:text-accent transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </div>
               <div>
                  <h4 class="text-primary font-bold">Partnership Return</h4>
                  <p class="text-xs text-tertiary">Form IT2P for partners and shared ventures.</p>
               </div>
            </div>
            <span class="text-tertiary group-hover:translate-x-1 transition-transform">→</span>
         </div>

         <div class="p-6 glass-card flex items-center justify-between group cursor-pointer">
            <div class="flex items-center">
               <div class="w-12 h-12 bg-app rounded-xl flex items-center justify-center mr-4 text-tertiary group-hover:text-warning transition-colors">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </div>
               <div>
                  <h4 class="text-primary font-bold">Simplified IT (IT2S)</h4>
                  <p class="text-xs text-tertiary">For turnover below KES 1M (non-VAT registered).</p>
               </div>
            </div>
            <span class="text-tertiary group-hover:translate-x-1 transition-transform">→</span>
         </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: var(--bg-surface-1);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-default);
      transition: all 0.3s ease;
      border-radius: 20px;
    }
    .glass-card:hover {
      background: var(--bg-hover);
      border-color: var(--border-accent-subtle);
    }
    .card-gradient {
      background: linear-gradient(135deg, var(--bg-surface-1) 0%, var(--bg-surface-2) 100%);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomeTaxHubComponent {}
