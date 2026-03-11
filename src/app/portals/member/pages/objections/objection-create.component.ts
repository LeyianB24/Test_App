import { inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-objection-create',
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-container animate-fade-in">
      <div class="noise-overlay"></div>
      <header class="premium-header mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              NEW DISPUTE PROTOCOL
            </span>
          </div>
          <h1 class="premium-title">Lodge Formal <span class="gradient-text">Objection</span></h1>
          <p class="premium-subtitle">Authorized gateway for administrative appeals within the statutory 30-day window</p>
        </div>
        <button routerLink="/member/objections" class="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
          Abort Dispute
        </button>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="glass-panel p-10 relative overflow-hidden group">
          <div class="absolute -top-32 -left-32 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors duration-1000"></div>

          <form [formGroup]="objectionForm">
            <div class="space-y-10 relative z-10">
              
              <!-- Selection Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Select Assessment Archive</label>
                    <select formControlName="assessment_id" class="form-select bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-blue-500/50 transition-all">
                       <option value="" disabled>Choose assessment to object to...</option>
                       <option value="1">AS-9921-XAO (VAT - Dec 2025)</option>
                       <option value="2">AS-8812-JAI (IT - 2025)</option>
                    </select>
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Dispute Classification</label>
                    <select formControlName="category" class="form-select bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-blue-500/50 transition-all">
                       <option value="calculation">Incorrect Tax Calculation</option>
                       <option value="deduction">Disputed Deduction Rejection</option>
                       <option value="procedural">Procedural Irregularity</option>
                       <option value="other">Other Grounds</option>
                    </select>
                 </div>
              </div>

              <!-- Grounds for Objection -->
              <div class="form-group">
                 <label class="block text-slate-500 mb-3 font-black text-[10px] uppercase tracking-[0.2em]">Detailed Grounds for Dispute</label>
                 <textarea formControlName="grounds" rows="6" class="form-input bg-slate-900/50 border-white/5 text-white rounded-xl focus:border-blue-500/50 transition-all resize-none shadow-2xl" placeholder="Provide a detailed technical explanation of your grounds for dispute..."></textarea>
                 <div class="text-[9px] text-slate-600 mt-3 font-black uppercase tracking-[0.2em]">Technical clarity accelerates officer review latency.</div>
              </div>

              <!-- Supporting Documents -->
              <div class="form-group">
                 <label class="block text-slate-500 mb-5 font-black text-[10px] uppercase tracking-[0.2em]">Evidentiary Attachments (PDF/Archive)</label>
                 <div class="border-2 border-dashed border-white/5 rounded-2xl p-12 text-center hover:border-blue-500/30 transition-all group/upload flex flex-col items-center cursor-pointer bg-white/[0.01]">
                    <div class="w-16 h-16 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover/upload:scale-110 group-hover/upload:border-blue-500/30 transition-all shadow-2xl">
                       <svg class="w-8 h-8 text-slate-600 group-hover/upload:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <p class="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-2">Attach Technical Evidence</p>
                    <p class="text-slate-600 text-[9px] font-black uppercase tracking-widest">Tax computations, ledgers, or bank archives.</p>
                 </div>
              </div>

              <!-- Action Footer -->
              <div class="pt-10 border-t border-white/5 flex flex-col md:flex-row gap-4">
                 <button type="submit" class="modern-btn primary-btn flex-1 py-4 shadow-xl shadow-blue-600/20 elite-glow !rounded-2xl" [disabled]="!objectionForm.valid">
                    Finalize Dispute Submission
                 </button>
                 <button routerLink="/member/objections" class="px-10 py-4 bg-slate-900 border border-white/5 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:text-white transition-all">
                    Discard Protocol
                 </button>
              </div>
            </div>
          </form>
        </div>

        <div class="mt-10 glass-panel p-8 bg-amber-500/5 border-amber-500/10 flex items-start gap-6 relative overflow-hidden">
           <div class="absolute -left-12 -bottom-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
           <div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 relative z-10">
              <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           </div>
           <div class="relative z-10">
              <h4 class="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Statutory Legal Disclaimer</h4>
              <p class="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-widest opacity-80">
                 Lodging a formal objection protocol does not stay the collection of the undisputed tax liability. Statutory requirements mandate immediate liquidation of the admitted portion of the assessment.
              </p>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { 
      min-height: 100vh; 
      background: #050505 ;
      background-size: cover;
      color: #fff; 
      position: relative; 
      overflow-x: hidden; 
      padding: 60px 40px 100px;
    }
    
    .page-container::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top left, rgba(217, 43, 43, 0.1), transparent 40%),
                  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.8), transparent 60%);
      pointer-events: none;
      z-index: 1;
    }

    .noise-overlay { position: fixed; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); opacity: 0.02; z-index: 2; pointer-events: none; }

    .premium-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 24px;
      margin-bottom: 40px;
    }

    .glass-panel {
      background: rgba(20, 20, 20, 0.4);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 32px;
      position: relative;
      z-index: 10;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .glass-panel:hover {
      background: rgba(20, 20, 20, 0.6);
      border-color: rgba(217, 43, 43, 0.3);
      box-shadow: 0 40px 80px rgba(0,0,0,0.6);
    }

    .form-input, .form-select {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 16px 20px;
      color: white;
      transition: all 0.3s;
      outline: none;
    }
    .form-input:focus, .form-select:focus {
      border-color: rgba(217, 43, 43, 0.4);
      background: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 0 4px rgba(217, 43, 43, 0.1);
    }
    
    .accent-blue { border-color: rgba(59, 130, 246, 0.4) !important; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectionCreateComponent {
  private fb = inject(FormBuilder);

  objectionForm = this.fb.group({
    assessment_id: ['', Validators.required],
    category: ['calculation', Validators.required],
    grounds: ['', [Validators.required, Validators.minLength(20)]],
    declaration: [false, Validators.requiredTrue]
  });
}
