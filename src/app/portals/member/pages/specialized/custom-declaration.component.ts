import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DeclarationItem {
  id: string;
  description: string;
  quantity: number;
  valueUsd: number;
  category: string;
}

@Component({
  selector: 'app-custom-declaration',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container p-8 animate-fade-in">
      <header class="mb-12">
        <div class="flex items-center gap-4 mb-2">
          <span class="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest">Form-88 Protocol</span>
          <div class="h-[1px] flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent"></div>
        </div>
        <h1 class="text-6xl font-black text-white tracking-tighter mb-4">Customs <span class="text-indigo-500">Discovery</span></h1>
        <p class="text-slate-400 font-medium text-lg max-w-2xl">Lodge official self-declarations for imported goods, currency, and restricted items at jurisdictional entry points.</p>
      </header>

      <div class="max-w-5xl mx-auto">
        <!-- Stepper Hierarchy -->
        <div class="flex items-center justify-between mb-16 px-4">
          @for (step of steps; track step; let i = $index) {
            <div class="flex flex-col items-center gap-4 relative group">
              <div 
                class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2"
                [class.bg-indigo-600]="currentStep() === i"
                [class.border-indigo-500]="currentStep() === i"
                [class.text-white]="currentStep() === i"
                [class.bg-emerald-500]="currentStep() > i"
                [class.border-emerald-500]="currentStep() > i"
                [class.bg-slate-900]="currentStep() < i"
                [class.border-white/10]="currentStep() < i"
                [class.text-slate-500]="currentStep() < i"
              >
                @if (currentStep() > i) {
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                } @else {
                  <span class="text-xl font-black">{{ i + 1 }}</span>
                }
              </div>
              <span 
                class="text-[10px] font-black uppercase tracking-widest transition-colors duration-300"
                [class.text-indigo-400]="currentStep() === i"
                [class.text-emerald-500]="currentStep() > i"
                [class.text-slate-600]="currentStep() < i"
              >{{ step }}</span>
              
              @if (i < steps.length - 1) {
                <div class="absolute top-7 left-[calc(100%+0.5rem)] w-[calc(100vw/5)] max-w-[120px] h-[2px] bg-white/5 overflow-hidden">
                   <div 
                    class="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-700 ease-out"
                    [style.width.%]="currentStep() > i ? 100 : 0"
                   ></div>
                </div>
              }
            </div>
          }
        </div>

        <div class="card-glass p-1 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[120px] -mr-48 -mt-48 transition-all duration-1000"></div>
          <div class="p-10">
            
            <!-- Step 1: Identification -->
            @if (currentStep() === 0) {
              <div class="space-y-12 animate-slide-up">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-3">
                    <label class="input-label">Legal Name (Passport Index)</label>
                    <input type="text" [(ngModel)]="traveler.name" class="premium-input" placeholder="e.g. ADRIAN VANCE">
                  </div>
                  <div class="space-y-3">
                    <label class="input-label">Passport Identification</label>
                    <input type="text" [(ngModel)]="traveler.passport" class="premium-input font-mono" placeholder="AK8829102">
                  </div>
                  <div class="space-y-3">
                    <label class="input-label">Arrival Terminal / Flight</label>
                    <input type="text" [(ngModel)]="traveler.flight" class="premium-input" placeholder="e.g. KQ102 Heathrow">
                  </div>
                  <div class="space-y-3">
                    <label class="input-label">Primary Residency</label>
                    <input type="text" [(ngModel)]="traveler.origin" class="premium-input" placeholder="Country of Residence">
                  </div>
                </div>
              </div>
            }

            <!-- Step 2: Asset Declaration -->
            @if (currentStep() === 1) {
              <div class="space-y-8 animate-slide-up">
                <div class="flex justify-between items-end mb-4">
                  <div>
                    <h3 class="text-2xl font-black text-white tracking-tight">Venture Assets</h3>
                    <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Itemize all imports over duty-free thresholds</p>
                  </div>
                  <button (click)="addItem()" class="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-6 py-2 rounded-xl border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest transition-all">
                    + Insert Entry
                  </button>
                </div>

                <div class="space-y-4">
                  @for (item of items(); track item.id; let i = $index) {
                    <div class="grid grid-cols-12 gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                      <div class="col-span-12 md:col-span-5 space-y-2">
                         <label class="text-[9px] font-black text-slate-600 uppercase">Descriptor</label>
                         <input type="text" [(ngModel)]="item.description" class="minimal-input" placeholder="e.g. Digital Cinema Red V-Raptor">
                      </div>
                      <div class="col-span-6 md:col-span-3 space-y-2">
                         <label class="text-[9px] font-black text-slate-600 uppercase">Category</label>
                         <select [(ngModel)]="item.category" class="minimal-input appearance-none">
                            <option value="Electronics">Electronics</option>
                            <option value="Jewelry">Jewelry / Lux</option>
                            <option value="Commercial">Commercial Samples</option>
                            <option value="Personal">Personal Effects</option>
                         </select>
                      </div>
                      <div class="col-span-4 md:col-span-3 space-y-2">
                         <label class="text-[9px] font-black text-slate-600 uppercase">Appraisal (USD)</label>
                         <input type="number" [(ngModel)]="item.valueUsd" class="minimal-input font-mono text-emerald-400" placeholder="0.00">
                      </div>
                      <div class="col-span-2 md:col-span-1 flex items-end justify-center pb-2">
                         <button (click)="removeItem(i)" class="text-slate-600 hover:text-red-500 transition-colors">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                         </button>
                      </div>
                    </div>
                  }
                </div>

                <div class="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex justify-between items-center">
                   <div class="flex items-center gap-4">
                      <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                         <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/></svg>
                      </div>
                      <div>
                         <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Total Appraisal Matrix</span>
                         <span class="text-2xl font-black text-white tabular-nums">USD {{ totalValue().toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
                      </div>
                   </div>
                   <div class="text-right">
                      <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">Est. Duty Liability</span>
                      <span class="text-xl font-black text-emerald-400 tabular-nums">USD {{ (totalValue() * 0.25).toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
                   </div>
                </div>
              </div>
            }

            <!-- Step 3: Confirmation -->
            @if (currentStep() === 2) {
              <div class="animate-slide-up py-10">
                @if (!isSubmitted()) {
                  <div class="max-w-xl mx-auto text-center space-y-8">
                     <div class="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="3"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                     </div>
                     <h3 class="text-4xl font-black text-white tracking-tighter leading-none">Final Attestation</h3>
                     <p class="text-slate-400 font-medium leading-relaxed">By authorizing this transmission, you certify under penalty of jurisdictional law that all declared assets and values are accurate and truthful.</p>
                     
                     <label class="relative flex items-center gap-4 p-8 bg-white/5 rounded-[2.5rem] border border-white/10 cursor-pointer group hover:bg-white/[0.07] transition-all">
                        <input type="checkbox" [(ngModel)]="agreed" class="sr-only">
                        <div 
                          class="w-8 h-8 rounded-xl border-2 border-white/20 flex items-center justify-center transition-all group-hover:border-indigo-500 group-focus-within:border-indigo-500"
                          [class.bg-indigo-600]="agreed()"
                          [class.border-indigo-600]="agreed()"
                        >
                           @if (agreed()) {
                             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
                           }
                        </div>
                        <span class="text-sm font-bold text-slate-300 select-none">I solemnly swear the contents of this Form-88 are true.</span>
                     </label>
                  </div>
                } @else {
                  <div class="max-w-2xl mx-auto text-center space-y-8">
                     <div class="w-32 h-32 bg-emerald-500 rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative">
                        <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="3" class="animate-draw"><path d="M5 13l4 4L19 7"/></svg>
                        <div class="absolute inset-0 bg-emerald-400 blur-2xl opacity-30 animate-pulse"></div>
                     </div>
                     <div>
                        <h3 class="text-5xl font-black text-white tracking-tighter mb-4">Declaration Authorized</h3>
                        <p class="text-slate-500 font-black text-xs uppercase tracking-[0.4em]">REFERENCE ARCHIVE: <span class="text-white">{{ refNumber }}</span></p>
                     </div>
                     <div class="grid grid-cols-2 gap-4">
                        <button (click)="reset()" class="bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest py-6 rounded-[2rem] border border-white/5 transition-all">New Protocol</button>
                        <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest py-6 rounded-[2rem] transition-all shadow-xl shadow-indigo-600/20">Download Cert</button>
                     </div>
                  </div>
                }
              </div>
            }

          </div>

          <!-- Bottom Navigation -->
          @if (!isSubmitted()) {
            <div class="bg-black/20 p-8 flex justify-between items-center border-t border-white/5">
               <button 
                [disabled]="currentStep() === 0"
                (click)="prev()" 
                class="px-10 py-5 rounded-2xl bg-white/5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white disabled:opacity-30 transition-all border border-black"
               >
                 Go Back
               </button>
               <button 
                [disabled]="!canProceed()"
                (click)="next()" 
                class="px-12 py-5 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 disabled:bg-slate-800 transition-all shadow-lg shadow-indigo-600/20 border border-black"
               >
                 {{ currentStep() === 2 ? 'Authorize Declaration' : 'Next Protocol' }}
               </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; margin: 0 auto; }
    .card-glass { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(30px); }
    
    .input-label { display: block; font-size: 10px; font-weight: 950; color: #64748b; text-transform: uppercase; letter-spacing: 0.15em; margin-left: 1rem; }
    
    .premium-input {
      width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
      border-radius: 1.5rem; padding: 1.25rem 2rem; color: white; font-weight: 700; font-size: 1rem;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .premium-input:focus { outline: none; border-color: #6366f1; background: rgba(255,255,255,0.07); box-shadow: 0 0 40px rgba(99, 102, 241, 0.1); }
    
    .minimal-input {
      width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.05);
      border-radius: 1rem; padding: 0.75rem 1rem; color: white; font-weight: 600; font-size: 0.9rem;
      transition: all 0.3s;
    }
    .minimal-input:focus { outline: none; border-color: rgba(99, 102, 241, 0.5); background: rgba(255,255,255,0.03); }

    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
    }

    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    .animate-draw { stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw 0.8s forwards 0.4s; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
  `]
})
export class CustomDeclarationComponent {
  steps = ['Identification', 'Asset Registry', 'Attestation'];
  currentStep = signal(0);
  isSubmitted = signal(false);
  refNumber = `CUST88-${Math.floor(1000000 + Math.random() * 9000000)}`;

  traveler = {
    name: '',
    passport: '',
    flight: '',
    origin: ''
  };

  items = signal<DeclarationItem[]>([
    { id: '1', description: '', quantity: 1, valueUsd: 0, category: 'Electronics' }
  ]);

  agreed = signal(false);

  totalValue = computed(() => {
    return this.items().reduce((acc, item) => acc + (item.valueUsd || 0), 0);
  });

  addItem() {
    this.items.update(prev => [
      ...prev, 
      { id: Date.now().toString(), description: '', quantity: 1, valueUsd: 0, category: 'Electronics' }
    ]);
  }

  removeItem(index: number) {
    this.items.update(prev => prev.filter((_, i) => i !== index));
    if (this.items().length === 0) this.addItem();
  }

  canProceed = computed(() => {
    const s = this.currentStep();
    if (s === 0) return this.traveler.name.length > 3 && this.traveler.passport.length > 5;
    if (s === 1) return this.items().some(i => i.description.length > 2 && i.valueUsd > 0);
    if (s === 2) return this.agreed();
    return true;
  });

  next() {
    if (this.currentStep() === 2) {
      this.isSubmitted.set(true);
    } else {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  prev() {
    if (this.currentStep() > 0) this.currentStep.set(this.currentStep() - 1);
  }

  reset() {
    this.currentStep.set(0);
    this.isSubmitted.set(false);
    this.traveler = { name: '', passport: '', flight: '', origin: '' };
    this.items.set([{ id: '1', description: '', quantity: 1, valueUsd: 0, category: 'Electronics' }]);
    this.agreed.set(false);
    this.refNumber = `CUST88-${Math.floor(1000000 + Math.random() * 9000000)}`;
  }
}
