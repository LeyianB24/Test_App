import { inject, Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-objection-create',
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div class="objection-create-container p-6 animate-fade-in">
      <header class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Lodge Formal Objection</h1>
          <p class="text-slate-400">Object to a specific tax assessment or notice within the 30-day window.</p>
        </div>
        <button routerLink="/member/objections" class="text-slate-500 hover:text-white transition-colors">
          Cancel & Exit
        </button>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="glass-card p-10">
          <form [formGroup]="objectionForm">
            <div class="space-y-8">
              
              <!-- Selection Section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Select Assessment</label>
                    <select formControlName="assessment_id" class="form-select">
                       <option value="" disabled>Choose assessment to object to...</option>
                       <option value="1">AS-9921-XAO (VAT - Dec 2025)</option>
                       <option value="2">AS-8812-JAI (IT - 2025)</option>
                    </select>
                 </div>
                 <div class="form-group">
                    <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Objection Category</label>
                    <select formControlName="category" class="form-select">
                       <option value="calculation">Incorrect Tax Calculation</option>
                       <option value="deduction">Disputed Deduction Rejection</option>
                       <option value="procedural">Procedural Irregularity</option>
                       <option value="other">Other Grounds</option>
                    </select>
                 </div>
              </div>

              <!-- Grounds for Objection -->
              <div class="form-group">
                 <label class="block text-slate-300 mb-2 font-bold text-xs uppercase tracking-widest">Detailed Grounds for Objection</label>
                 <textarea formControlName="grounds" rows="6" class="form-input resize-none" placeholder="Provide a detailed explanation of why you are objecting to this assessment..."></textarea>
                 <div class="text-[10px] text-slate-600 mt-2 italic">Be specific to help the reviewing officer understand your case clearly.</div>
              </div>

              <!-- Supporting Documents -->
              <div class="form-group">
                 <label class="block text-slate-300 mb-4 font-bold text-xs uppercase tracking-widest">Supporting Documents (PDF/JPG/PNG)</label>
                 <div class="upload-zone border-2 border-dashed border-white/5 rounded-2xl p-8 text-center hover:border-blue-500/30 transition-all group flex flex-col items-center cursor-pointer bg-slate-800/20">
                    <div class="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                       <svg class="w-6 h-6 text-slate-500 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <p class="text-white text-sm font-bold mb-1">Click to attach evidence</p>
                    <p class="text-slate-500 text-[10px]">Tax computations, invoices, bank statements, etc.</p>
                 </div>
              </div>

              <!-- Action Footer -->
              <div class="pt-10 border-t border-white/5 flex gap-4">
                 <button type="submit" class="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1" [disabled]="!objectionForm.valid">
                    Lodge Formal Objection
                 </button>
                 <button routerLink="/member/objections" class="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-2xl transition-all">
                    Discard
                 </button>
              </div>
            </div>
          </form>
        </div>

        <div class="mt-8 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start">
           <svg class="w-6 h-6 text-amber-500 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           <p class="text-[11px] text-amber-500/80 leading-relaxed uppercase font-bold tracking-tight">
              Legal Disclaimer: Lodging an objection does not stay the collection of the undisputed tax. You are required to pay the admitted portion of the tax as per the assessment notice immediately to avoid interest and penalties.
           </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 28px;
    }
    .form-input, .form-select {
      width: 100%;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px 16px;
      color: white;
      transition: all 0.2s;
    }
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
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
