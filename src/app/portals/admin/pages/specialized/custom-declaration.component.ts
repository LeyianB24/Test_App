import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule as NgCommon } from '@angular/common';

@Component({
  selector: 'app-custom-declaration',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommon, FormsModule, ReactiveFormsModule],
  template: `
    <div class="db-root">
      <div class="noise-overlay"></div>
      
      <div class="content-area animate-stagger">
        
        <!-- Customs Header Manifold -->
        <header class="mb-14 overflow-hidden relative group">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 relative z-10">
            <div class="space-y-2">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-1.5 h-6 bg-accent rounded-full shadow-[0_0_12px_var(--color-accent)]"></div>
                <span class="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Cross-Border Asset Control</span>
              </div>
              <h1 class="text-5xl font-black text-primary tracking-tighter uppercase leading-none">
                Customs <span class="text-stroke-sm">Manifold</span>
              </h1>
              <p class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                AUTHORIZED DECLARATION PROTOCOL // NODE: CST-KRA-08
              </p>
            </div>

            <div class="flex items-center gap-6">
               <div class="status-pill-precision online py-2 px-5 bg-white/5 border-white/10">
                 <span class="status-pill-dot animate-pulse shadow-[0_0_8px_var(--color-success)]"></span>
                 BORDER CONTROL SYNC ACTIVE
               </div>
            </div>
          </div>
        </header>

        <!-- Elite Stepper Manifold -->
        <div class="glass-panel overflow-hidden border-white/5 bg-white/[0.01]">
           <div class="flex border-b border-white/5 bg-white/[0.02]">
              @for (step of steps; track step.id) {
                <div class="flex-1 p-10 flex flex-col items-center gap-4 relative transition-all" [class.opacity-30]="currentStep() < step.id">
                   <div class="w-12 h-12 rounded-2xl flex items-center justify-center border font-black text-sm transition-all shadow-2xl" 
                      [class]="currentStep() === step.id ? 'bg-accent border-accent text-white shadow-[0_0_20px_var(--color-accent)]' : (currentStep() > step.id ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white' : 'bg-white/5 border-white/10 text-muted')">
                      @if (currentStep() > step.id) {
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                      } @else {
                        {{ step.id }}
                      }
                   </div>
                   <span class="text-[10px] font-black uppercase tracking-[0.3em]" [class.text-primary]="currentStep() === step.id" [class.text-muted]="currentStep() !== step.id">
                      {{ step.label }}
                   </span>
                   @if ($index < steps.length - 1) {
                     <div class="absolute right-[-2.5%] top-[2.5rem] w-[5%] h-[1px] bg-white/10 hidden xl:block"></div>
                   }
                </div>
              }
           </div>

           <div class="p-14 min-h-[500px]">
              <form [formGroup]="declarationForm" (ngSubmit)="submit()">
                 
                 <!-- Step 1: Identity Vector -->
                 @if (currentStep() === 1) {
                    <div class="animate-stagger space-y-12">
                       <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div class="space-y-4">
                             <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">National ID PIN</label>
                             <input type="text" formControlName="travelerPin" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none uppercase tracking-widest placeholder:text-muted/20" placeholder="A001234567X">
                          </div>
                          <div class="space-y-4">
                             <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Identity Passport Vector</label>
                             <input type="text" formControlName="passportNo" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none uppercase tracking-widest placeholder:text-muted/20" placeholder="AK123456">
                          </div>
                       </div>
                       <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                          <div class="space-y-4">
                             <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Temporal Arrival</label>
                             <input type="date" formControlName="arrivalDate" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none">
                          </div>
                          <div class="space-y-4">
                             <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Transit Manifest ID</label>
                             <input type="text" formControlName="flightNumber" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none uppercase tracking-widest" placeholder="KQ 101">
                          </div>
                          <div class="space-y-4">
                             <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Origin Hub</label>
                             <input type="text" formControlName="origin" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none uppercase tracking-tight" placeholder="LONDON (LHR)">
                          </div>
                       </div>
                    </div>
                 }

                 <!-- Step 2: Asset Declaration -->
                 @if (currentStep() === 2) {
                    <div class="animate-stagger space-y-12">
                       <div class="p-8 rounded-3xl bg-accent/5 border border-accent/20 flex items-center justify-between mb-10">
                          <div class="flex items-center gap-6">
                             <div class="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                             </div>
                             <p class="text-[10px] font-black text-primary uppercase tracking-widest">Mandatory: Declare all assets exceeding KES 500,000 threshold</p>
                          </div>
                       </div>
                       
                       <div class="space-y-4">
                          <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Asset Spectrum Description</label>
                          <textarea formControlName="goodsDescription" rows="4" class="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] py-8 px-10 text-sm font-black text-primary focus:border-accent outline-none uppercase tracking-tight placeholder:text-muted/20" placeholder="Specify all taxable quantities and asset fragments..."></textarea>
                       </div>

                       <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div class="space-y-4">
                             <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Aggregate Value Vector (USD)</label>
                             <input type="number" formControlName="value" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none tabular-nums font-mono" placeholder="0.00">
                          </div>
                          <div class="space-y-4">
                             <label class="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-2">Currency Protocol</label>
                             <select formControlName="currency" class="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 px-8 text-sm font-black text-primary focus:border-accent outline-none uppercase appearance-none cursor-pointer">
                                <option value="USD">UNITED STATES DOLLAR (USD)</option>
                                <option value="EUR">EURO ZONE (EUR)</option>
                                <option value="GBP">BRITISH POUND (GBP)</option>
                                <option value="KES">KENYAN SHILLING (KES)</option>
                             </select>
                          </div>
                       </div>
                    </div>
                 }

                 <!-- Step 3: Commitment Protocol -->
                 @if (currentStep() === 3) {
                    <div class="animate-stagger flex flex-col items-center justify-center text-center gap-12 py-10">
                       <div class="w-32 h-32 rounded-[3.5rem] bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center border border-[var(--color-success)]/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                       </div>
                       <div class="space-y-4 max-w-xl">
                          <h3 class="text-3xl font-black text-primary uppercase tracking-tighter">Legal Commitment Array</h3>
                          <p class="text-[11px] font-bold text-muted uppercase tracking-[0.2em] leading-relaxed">By committing this fragment, I certify that all asset telemetry provided is accurate and exhaustive according to the National Customs Protocol Act.</p>
                       </div>
                       
                       <div class="p-8 rounded-3xl bg-white/5 border border-white/5 w-full max-w-2xl text-left grid grid-cols-2 gap-8">
                          <div>
                            <span class="text-[9px] font-black text-muted uppercase tracking-widest block mb-2">PIN VECTOR</span>
                            <span class="text-xs font-black text-primary uppercase tracking-tighter">{{ declarationForm.value.travelerPin || 'UNSPECIFIED' }}</span>
                          </div>
                          <div>
                            <span class="text-[9px] font-black text-muted uppercase tracking-widest block mb-2">AGGREGATE VALUE</span>
                            <span class="text-xs font-black text-accent uppercase tracking-tighter">{{ declarationForm.value.value }} {{ declarationForm.value.currency }}</span>
                          </div>
                       </div>
                    </div>
                 }

                 <div class="flex justify-between items-center pt-14 border-t border-white/5">
                    <button type="button" (click)="prevStep()" [disabled]="currentStep() === 1" 
                       class="btn-precision online !bg-white/5 !border-white/10 !text-primary disabled:opacity-20">
                       VOID PREVIOUS
                    </button>
                    
                    @if (currentStep() < 3) {
                      <button type="button" (click)="nextStep()" class="btn-precision online !bg-primary !text-white !border-none shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                         CONTINUE TRAJECTORY
                      </button>
                    } @else {
                      <button type="submit" [disabled]="submitting() || declarationForm.invalid" 
                         class="btn-precision online !bg-accent !text-white !border-none shadow-[0_0_30px_var(--color-accent)] animate-pulse">
                         {{ submitting() ? 'COMMITING...' : 'FINALIZE DECLARATION' }}
                      </button>
                    }
                 </div>
              </form>
           </div>
        </div>

        @if (success()) {
           <div class="fixed inset-0 z-[2000] flex items-center justify-center p-8 backdrop-blur-3xl bg-black/90 animate-fade-in">
              <div class="text-center space-y-12">
                 <div class="w-40 h-40 bg-[var(--color-success)] text-white rounded-[4rem] flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(16,185,129,0.3)] animate-scale">
                    <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="4" d="M5 13l4 4L19 7"/></svg>
                 </div>
                 <div class="space-y-4">
                    <h2 class="text-5xl font-black text-primary uppercase tracking-tighter">Protocol Committed</h2>
                    <p class="text-[11px] font-black text-muted uppercase tracking-[0.4em]">Asset declaration signature has been successfully logged in the National Matrix.</p>
                 </div>
                 <button (click)="success.set(false); reset()" class="btn-precision online !px-20">Acknowledge Command</button>
              </div>
           </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .db-root {
      min-height: 100vh;
      background: #050505;
      position: relative;
      overflow-x: hidden;
      color: #e2e8f0;
      padding: 3.5rem;
    }

    .noise-overlay {
      position: fixed;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.015;
      pointer-events: none;
      z-index: 1;
    }

    .content-area {
      position: relative;
      z-index: 2;
      max-width: 1700px;
      margin: 0 auto;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 2.5rem;
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

    .animate-stagger > * {
      animation: stg 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes stg { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .animate-scale { animation: sc 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes sc { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

    .animate-fade-in { animation: fi 0.4s ease-out; }
    @keyframes fi { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class CustomDeclarationComponent {
  private fb = inject(FormBuilder);

  currentStep = signal(1);
  submitting = signal(false);
  success = signal(false);

  steps = [
    { id: 1, label: 'Identity Vector' },
    { id: 2, label: 'Asset Spectrum' },
    { id: 3, label: 'Legal Commitment' }
  ];

  declarationForm = this.fb.group({
    travelerPin: ['', [Validators.required]],
    passportNo: ['', [Validators.required]],
    arrivalDate: ['', [Validators.required]],
    flightNumber: ['', [Validators.required]],
    origin: ['', [Validators.required]],
    goodsDescription: ['', [Validators.required]],
    value: [0, [Validators.required, Validators.min(0)]],
    currency: ['USD', [Validators.required]]
  });

  nextStep() { if (this.currentStep() < 3) this.currentStep.update(s => s + 1); }
  prevStep() { if (this.currentStep() > 1) this.currentStep.update(s => s - 1); }

  submit() {
    if (this.declarationForm.invalid) return;
    this.submitting.set(true);
    setTimeout(() => {
      this.submitting.set(false);
      this.success.set(true);
    }, 2000);
  }

  reset() {
    this.declarationForm.reset({ currency: 'USD', value: 0 });
    this.currentStep.set(1);
  }
}
