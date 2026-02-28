import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-declaration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-container p-8 animate-up">
      <header class="page-header-elite mb-10">
        <div class="header-info">
          <h1 class="premium-title">Customs <span class="gradient-text">Self-Declaration</span></h1>
          <p class="premium-subtitle">Official Form-88 Virtual Gateway for port-of-entry assets</p>
        </div>
        <div class="header-actions">
           <div class="status-pill-elite active">
              <span class="dot"></span>
              Secure Form
           </div>
        </div>
      </header>

      <div class="max-w-4xl mx-auto">
        <!-- Elite Stepper -->
        <div class="elite-stepper mb-12">
          @for (s of steps; track s; let i = $index) {
            <div class="elite-step" [class.active]="currentStep() === i" [class.done]="currentStep() > i">
              <div class="step-blob">
                 @if (currentStep() > i) {
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                 } @else {
                    {{ i + 1 }}
                 }
              </div>
              <span class="step-text">{{ s }}</span>
            </div>
            @if (i < steps.length - 1) {
              <div class="step-connector" [class.done]="currentStep() > i"></div>
            }
          }
        </div>

        <div class="content-card-premium p-10 relative overflow-hidden">
          <div class="absolute -top-20 -left-20 w-60 h-60 bg-red-50 rounded-full blur-3xl opacity-40"></div>
          
          @if (currentStep() === 0) {
            <div class="step-content animate-fade-in relative z-10">
              <div class="flex items-center gap-3 mb-8">
                 <div class="w-1 h-6 bg-red-600 rounded-full"></div>
                 <h3 class="text-xl font-black text-slate-800">Traveler Nexus Profile</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="field-group">
                  <label class="premium-label">Full Name (Legal Identity)</label>
                  <input type="text" [(ngModel)]="formData.name" class="search-input-elite w-full py-4 px-6" placeholder="e.g. John Doe"/>
                </div>
                <div class="field-group">
                  <label class="premium-label">Passport Serial</label>
                  <input type="text" [(ngModel)]="formData.passport" class="search-input-elite w-full py-4 px-6" placeholder="e.g. AK1234567"/>
                </div>
                <div class="field-group">
                  <label class="premium-label">Vessel/Flight Signature</label>
                  <input type="text" [(ngModel)]="formData.flight" class="search-input-elite w-full py-4 px-6" placeholder="e.g. KQ101"/>
                </div>
                <div class="field-group">
                  <label class="premium-label">Jurisdiction of Origin</label>
                  <input type="text" [(ngModel)]="formData.origin" class="search-input-elite w-full py-4 px-6" placeholder="e.g. United Kingdom"/>
                </div>
              </div>
            </div>
          }

          @if (currentStep() === 1) {
            <div class="step-content animate-fade-in relative z-10">
              <div class="flex items-center gap-3 mb-8">
                 <div class="w-1 h-6 bg-red-600 rounded-full"></div>
                 <h3 class="text-xl font-black text-slate-800">Asset Inventory Declaration</h3>
              </div>
              
              <div class="space-y-4 mb-10">
                @for (item of formData.items; track item.id; let i = $index) {
                  <div class="item-row-elite flex gap-4 items-center">
                    <input type="text" [(ngModel)]="item.description" class="search-input-elite flex-[3] py-4 px-6" placeholder="Item Description"/>
                    <div class="relative flex-1">
                       <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                       <input type="number" [(ngModel)]="item.value" class="search-input-elite w-full py-4 pl-8 pr-4" placeholder="Value"/>
                    </div>
                    <button (click)="removeItem(i)" class="icon-btn-elite text-red-500">
                       <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                }
                <button (click)="addItem()" class="modern-btn-elite-sm w-full py-4 flex items-center justify-center gap-2 mt-4 hover:bg-slate-50 transition-colors">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M12 4v16m8-8H4"/></svg>
                  Add Declaration Item
                </button>
              </div>

              <div class="p-8 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600 rounded-full blur-3xl opacity-20 transition-transform group-hover:scale-150"></div>
                <div class="flex justify-between items-center relative z-10">
                  <div>
                     <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Aggregated Valuation</span>
                     <p class="text-xs text-slate-500 mt-1">Calculated in real-time based on entries</p>
                  </div>
                  <span class="text-4xl font-black gradient-text">USD {{ calculateTotal().toLocaleString() }}</span>
                </div>
              </div>
            </div>
          }

          @if (currentStep() === 2) {
            <div class="step-content text-center py-10 animate-fade-in relative z-10">
              @if (!isSubmitted()) {
                <div class="confirmation">
                  <div class="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <h3 class="text-3xl font-black text-slate-800 mb-4">Official Attestation</h3>
                  <p class="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
                    By finalizing this document, you certify that the listed assets are comprehensive and accurate. Discrepancies may involve legal audit.
                  </p>
                  <label class="flex items-center gap-4 justify-center mb-12 cursor-pointer group p-6 rounded-3xl hover:bg-slate-50 transition-colors border-2 border-transparent hover:border-slate-100">
                    <input type="checkbox" [(ngModel)]="formData.agreed" class="w-6 h-6 rounded-lg border-2 border-slate-300 text-red-600 focus:ring-red-500">
                    <span class="text-sm font-black text-slate-700 uppercase tracking-wide">I attest to the integrity of this declaration</span>
                  </label>
                </div>
              } @else {
                <div class="success-state">
                  <div class="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200 animate-bounce">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="4" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 class="text-3xl font-black text-slate-800 mb-2">Protocol Successful</h3>
                  <p class="text-slate-500 mb-10 font-mono text-sm">TRANSACTION_REF: KRA-CUST-88-{{ refNumber }}</p>
                  <div class="flex gap-4 justify-center">
                    <button class="modern-btn primary-btn shadow-lg" (click)="reset()">New Entry</button>
                    <button class="modern-btn outline-btn">Download Archive</button>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        @if (!isSubmitted()) {
          <div class="nav-btns flex justify-between mt-12 px-2">
            <button class="modern-btn outline-btn" [disabled]="currentStep() === 0" (click)="prev()">
               <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="mr-2"><path stroke-width="3" d="M15 19l-7-7 7-7"/></svg>
               Back
            </button>
            <button class="modern-btn primary-btn px-10" [disabled]="!canNext()" (click)="next()">
              {{ currentStep() === 2 ? 'Finalize Attestation' : 'Next Protocol' }}
              <svg *ngIf="currentStep() < 2" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="ml-2"><path stroke-width="3" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; }
    .animate-up { animation: up 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    /* Elite Stepper */
    .elite-stepper { display: flex; align-items: center; gap: 12px; }
    .elite-step { display: flex; flex-direction: column; align-items: center; gap: 10px; flex: 1; position: relative; }
    .step-blob { 
      width: 44px; height: 44px; border-radius: 16px; display: flex; align-items: center; justify-content: center; 
      font-weight: 900; border: 2px solid #e2e8f0; color: #94a3b8; background: white; z-index: 2; transition: 0.3s;
    }
    .elite-step.active .step-blob { border-color: #e31e24; color: #e31e24; transform: scale(1.1); box-shadow: 0 8px 20px rgba(227,30,36,0.15); }
    .elite-step.done .step-blob { background: #10b981; border-color: #10b981; color: white; }
    .step-text { font-size: 0.6rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px; }
    .elite-step.active .step-text { color: #1e293b; }
    
    .step-connector { flex: 1; height: 3px; background: #f1f5f9; margin-top: -32px; border-radius: 10px; }
    .step-connector.done { background: #10b981; }

    .premium-label { display: block; font-size: 0.65rem; font-weight: 950; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; padding-left: 4px; }
    
    .item-row-elite { animation: slideIn 0.3s ease-out; }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .content-card-premium { border-radius: 40px; }
  `]
})
export class CustomDeclarationComponent {
  steps = ['Traveler', 'Goods', 'Confirm'];
  currentStep = signal(0);
  isSubmitted = signal(false);
  refNumber = Math.floor(100000 + Math.random() * 900000);

  formData = {
    name: '',
    passport: '',
    flight: '',
    origin: '',
    items: [{ id: 1, description: '', value: 0 }],
    agreed: false
  };

  calculateTotal() {
    return this.formData.items.reduce((acc, item) => acc + (item.value || 0), 0);
  }

  addItem() {
    this.formData.items.push({ id: Date.now(), description: '', value: 0 });
  }

  removeItem(index: number) {
    this.formData.items.splice(index, 1);
  }

  canNext() {
    if (this.currentStep() === 0) return this.formData.name && this.formData.passport;
    if (this.currentStep() === 2) return this.formData.agreed;
    return true;
  }

  next() {
    if (this.currentStep() === 2) {
      this.isSubmitted.set(true);
    } else {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  prev() {
    this.currentStep.set(this.currentStep() - 1);
  }

  reset() {
    this.currentStep.set(0);
    this.isSubmitted.set(false);
    this.formData = {
      name: '',
      passport: '',
      flight: '',
      origin: '',
      items: [{ id: 1, description: '', value: 0 }],
      agreed: false
    };
    this.refNumber = Math.floor(100000 + Math.random() * 900000);
  }
}
