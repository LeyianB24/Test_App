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
    <div class="page-container animate-fade-in">
      <header class="mb-10 lg:mb-14 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
              FEDERAL CUSTOMS INTERFACE
            </span>
          </div>
          <h1 class="premium-title">Customs <span class="gradient-text">Discovery</span></h1>
          <p class="premium-subtitle">Authorized self-declaration protocol for statutory asset entry and duty liability assessment</p>
        </div>
        
        <div class="flex items-center gap-4">
           <div class="glass-panel py-3 px-6 bg-white/[0.01] border-white/5 !rounded-xl">
              <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Fiscal Reference</span>
              <span class="text-xs font-black text-white font-mono tracking-widest">{{ refNumber }}</span>
           </div>
        </div>
      </header>

      <div class="max-w-5xl mx-auto">
        <!-- Elite Multi-Phase Navigator -->
        <div class="flex items-center justify-between mb-16 px-4 relative">
          <div class="absolute top-7 left-0 right-0 h-px bg-white/[0.03] -z-10 mx-10"></div>
          @for (step of steps; track step; let i = $index) {
            <div class="flex flex-col items-center gap-4 relative group">
              <div 
                class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 z-10"
                [class.bg-violet-600]="currentStep() === i"
                [class.border-violet-500]="currentStep() === i"
                [class.text-white]="currentStep() === i"
                [class.shadow-xl]="currentStep() === i"
                [class.shadow-violet-500/20]="currentStep() === i"
                [class.bg-emerald-600]="currentStep() > i"
                [class.border-emerald-500]="currentStep() > i"
                [class.text-white]="currentStep() > i"
                [class.bg-slate-950]="currentStep() < i"
                [class.border-white/5]="currentStep() < i"
                [class.text-slate-600]="currentStep() < i"
              >
                @if (currentStep() > i) {
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7"/></svg>
                } @else {
                  <span class="text-xl font-black tabular-nums">{{ i + 1 }}</span>
                }
              </div>
              <span 
                class="text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500"
                [class.text-violet-400]="currentStep() === i"
                [class.text-emerald-500]="currentStep() > i"
                [class.text-slate-700]="currentStep() < i"
              >{{ step }}</span>
            </div>
          }
        </div>

        <div class="glass-panel p-0 rounded-[3.5rem] bg-white/[0.01] border-white/5 shadow-2xl relative overflow-hidden transition-all duration-1000">
          <div class="p-10 lg:p-14">
            
            <!-- Phase 1: Identity & Transit -->
            @if (currentStep() === 0) {
              <div class="space-y-12 animate-up">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="form-group space-y-4">
                    <label class="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] ml-2">Legal Identity (Taxpayer Name)</label>
                    <input type="text" [(ngModel)]="traveler.name" class="form-input bg-slate-950 border-white/5 text-white rounded-2xl p-5 font-black text-sm focus:border-violet-500/50 transition-all uppercase" placeholder="e.g. ADRIAN VANCE">
                  </div>
                  <div class="form-group space-y-4">
                    <label class="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] ml-2">Statutory Passport Ref</label>
                    <input type="text" [(ngModel)]="traveler.passport" class="form-input bg-slate-950 border-white/5 text-white rounded-2xl p-5 font-black text-sm focus:border-violet-500/50 transition-all font-mono uppercase" placeholder="AK8829102">
                  </div>
                  <div class="form-group space-y-4">
                    <label class="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] ml-2">Arrival Terminal Protocol</label>
                    <input type="text" [(ngModel)]="traveler.flight" class="form-input bg-slate-950 border-white/5 text-white rounded-2xl p-5 font-black text-sm focus:border-violet-500/50 transition-all uppercase" placeholder="e.g. KQ102 HEATHROW">
                  </div>
                  <div class="form-group space-y-4">
                    <label class="block text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] ml-2">Primary Residence Archive</label>
                    <input type="text" [(ngModel)]="traveler.origin" class="form-input bg-slate-950 border-white/5 text-white rounded-2xl p-5 font-black text-sm focus:border-violet-500/50 transition-all uppercase" placeholder="COUNTRY OF ORIGIN">
                  </div>
                </div>
              </div>
            }

            <!-- Phase 2: Asset Inventory -->
            @if (currentStep() === 1) {
              <div class="space-y-10 animate-up">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                  <div>
                    <h3 class="text-xs font-black text-white uppercase tracking-widest">Authorized Asset Registry</h3>
                    <p class="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-1 opacity-70">Enumerate all liquidated assets exceeding duty-free statutory thresholds</p>
                  </div>
                  <button (click)="addItem()" class="modern-btn border-violet-500/20 text-violet-400 px-6 py-3 rounded-xl hover:bg-violet-500/10 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M12 4v16m8-8H4"/></svg>
                    INSERT PROTOCOL
                  </button>
                </div>

                <div class="space-y-4">
                  @for (item of items(); track item.id; let i = $index) {
                    <div class="grid grid-cols-12 gap-6 p-8 bg-slate-950/40 rounded-3xl border border-white/5 group hover:border-violet-500/30 transition-all animate-up shadow-2xl">
                      <div class="col-span-12 lg:col-span-5 space-y-3">
                         <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Archive Descriptor</label>
                         <input type="text" [(ngModel)]="item.description" class="w-full bg-slate-950 border-white/5 text-white rounded-xl p-4 font-black text-sm focus:border-violet-500/50 transition-all uppercase" placeholder="e.g. DIGITAL CINEMA RED V-RAPTOR">
                      </div>
                      <div class="col-span-6 lg:col-span-3 space-y-3">
                         <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Asset Classification</label>
                         <div class="relative">
                            <select [(ngModel)]="item.category" class="w-full bg-slate-950 border-white/5 text-white rounded-xl p-4 font-black text-sm focus:border-violet-500/50 transition-all appearance-none uppercase">
                               <option value="Electronics">ELECTRONICS</option>
                               <option value="Jewelry">JEWELRY / LUXURY</option>
                               <option value="Commercial">COMMERCIAL SAMPLES</option>
                               <option value="Personal">PERSONAL EFFECTS</option>
                            </select>
                            <svg class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M19 9l-7 7-7-7"/></svg>
                         </div>
                      </div>
                      <div class="col-span-4 lg:col-span-3 space-y-3">
                         <label class="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Appraisal Matrix (USD)</label>
                         <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 font-black text-xs">USD</span>
                            <input type="number" [(ngModel)]="item.valueUsd" class="w-full bg-slate-950 border-white/5 text-emerald-400 rounded-xl pl-12 p-4 font-black text-sm focus:border-violet-500/50 transition-all tabular-nums" placeholder="0.00">
                         </div>
                      </div>
                      <div class="col-span-2 lg:col-span-1 flex items-end justify-center pb-3">
                         <button (click)="removeItem(i)" class="w-10 h-10 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-700 hover:text-red-500 hover:border-red-500/30 transition-all">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
                         </button>
                      </div>
                    </div>
                  }
                </div>

                <div class="p-10 rounded-[2.5rem] bg-emerald-500/[0.02] border border-emerald-500/20 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
                   <div class="absolute -right-12 -bottom-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
                   <div class="flex items-center gap-6 relative z-10">
                      <div class="w-14 h-14 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-emerald-400 shadow-2xl">
                         <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7" /></svg>
                      </div>
                      <div>
                         <span class="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] block mb-2">Aggregate Inventory Appraisal</span>
                         <span class="text-3xl font-black text-white tabular-nums tracking-tighter"><span class="text-xs text-slate-700 mr-2">USD</span>{{ totalValue().toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
                      </div>
                   </div>
                   <div class="text-right relative z-10">
                      <span class="text-[9px] font-black text-emerald-600 uppercase tracking-[0.3em] block mb-2">Estimated Duty Liability</span>
                      <span class="text-2xl font-black text-emerald-400 tabular-nums tracking-tighter"><span class="text-xs text-slate-700 mr-2">USD</span>{{ (totalValue() * 0.25).toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>
                   </div>
                </div>
              </div>
            }

            <!-- Phase 3: Final Attestation -->
            @if (currentStep() === 2) {
              <div class="animate-up py-6">
                @if (!isSubmitted()) {
                  <div class="max-w-2xl mx-auto text-center space-y-12">
                     <div class="w-24 h-24 bg-violet-600 rounded-[2.2rem] mx-auto flex items-center justify-center shadow-2xl shadow-violet-600/30 relative">
                        <div class="absolute inset-0 bg-violet-500 blur-2xl opacity-20 animate-pulse"></div>
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="3.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                     </div>
                     <div>
                        <h3 class="text-4xl font-black text-white tracking-tighter mb-4 uppercase">Statutory Authorization</h3>
                        <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed max-w-lg mx-auto opacity-70">By executing this digital transmission, you authenticate under statutory penalty (Customs Act) that all items and valuations itemized in this protocol are true.</p>
                     </div>
                     
                     <label class="relative flex items-center gap-6 p-10 bg-slate-950 border border-white/5 rounded-[3rem] cursor-pointer group hover:border-violet-500/30 transition-all shadow-2xl">
                        <input type="checkbox" [(ngModel)]="agreed" class="sr-only">
                        <div 
                          class="w-10 h-10 rounded-2xl border-2 border-white/10 flex items-center justify-center transition-all group-hover:border-violet-500 group-focus-within:border-violet-500"
                          [class.bg-violet-600]="agreed()"
                          [class.border-violet-600]="agreed()"
                        >
                           @if (agreed()) {
                             <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
                           }
                        </div>
                        <span class="text-xs font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest select-none text-left leading-relaxed">I solemnly attest that the contents of this Form-88 Discovery Protocol are accurate.</span>
                     </label>
                  </div>
                } @else {
                  <div class="max-w-2xl mx-auto text-center space-y-12 py-10">
                     <div class="w-32 h-32 bg-emerald-600 rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative">
                        <svg width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="3.5" class="animate-draw"><path d="M5 13l4 4L19 7"/></svg>
                        <div class="absolute inset-0 bg-emerald-400 blur-3xl opacity-20 animate-pulse"></div>
                     </div>
                     <div>
                        <h3 class="text-5xl font-black text-white tracking-tighter mb-4 uppercase">Protocol Authorized</h3>
                        <p class="text-slate-600 font-black text-[10px] uppercase tracking-[0.5em]">REFERENCE ARCHIVE: <span class="text-emerald-500 ml-2 tracking-widest">{{ refNumber }}</span></p>
                     </div>
                     <div class="grid grid-cols-2 gap-6 pt-6">
                        <button (click)="reset()" class="modern-btn border-white/10 text-slate-500 hover:text-white px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all">New Discovery</button>
                        <button class="modern-btn primary-btn py-5 px-8 bg-violet-600 border-violet-500 text-white !rounded-[2rem] shadow-xl shadow-violet-600/20 font-black text-[10px] uppercase tracking-widest elite-glow">Download Certificate</button>
                     </div>
                  </div>
                }
              </div>
            }

          </div>

          <!-- Elite Terminal Control -->
          @if (!isSubmitted()) {
            <div class="bg-slate-950/40 p-10 flex justify-between items-center border-t border-white/5 relative z-20">
               <button 
                [disabled]="currentStep() === 0"
                (click)="prev()" 
                class="modern-btn border-white/5 text-slate-600 hover:text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-20 transition-all"
               >
                 Go Back
               </button>
               <button 
                [disabled]="!canProceed()"
                (click)="next()" 
                class="modern-btn primary-btn py-5 px-12 bg-violet-600 border-violet-500 text-white !rounded-2xl shadow-xl shadow-violet-600/20 font-black text-[10px] uppercase tracking-[0.2em] elite-glow disabled:bg-slate-900 disabled:border-white/5 disabled:text-slate-700"
               >
                 {{ currentStep() === 2 ? 'AUTHORIZE DECLARATION' : 'NEXT PROTOCOL' }}
               </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-draw { stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw 0.8s forwards 0.4s; }
    @keyframes draw { to { stroke-dashoffset: 0; } }
  `],
})
export class CustomDeclarationComponent {
  steps = ['IDENTIFICATION', 'ASSET REGISTRY', 'ATTESTATION'];
  currentStep = signal(0);
  isSubmitted = signal(false);
  refNumber = `KRA-CUST-${Math.floor(1000000 + Math.random() * 9000000)}`;

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
    return this.items().reduce((acc: number, item) => acc + (item.valueUsd || 0), 0);
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
    this.refNumber = `KRA-CUST-${Math.floor(1000000 + Math.random() * 9000000)}`;
  }
}
