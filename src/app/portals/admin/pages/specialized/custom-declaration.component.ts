import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-declaration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="declaration-container p-6">
      <header class="mb-8">
        <h1 class="text-3xl font-black text-slate-800 tracking-tight">Customs Self-Declaration</h1>
        <p class="text-slate-500 mt-1">Official Form-88 for declaring goods at ports of entry</p>
      </header>

      <div class="max-w-4xl mx-auto">
        <div class="stepper mb-10">
          @for (s of steps; track s; let i = $index) {
            <div class="step" [class.active]="currentStep() === i" [class.done]="currentStep() > i">
              <div class="step-circle">{{ i + 1 }}</div>
              <span class="step-label">{{ s }}</span>
            </div>
            @if (i < steps.length - 1) {
              <div class="step-line" [class.done]="currentStep() > i"></div>
            }
          }
        </div>

        <div class="card p-8 animate-fade-in">
          @if (currentStep() === 0) {
            <div class="step-content">
              <h3 class="text-xl font-bold text-slate-800 mb-6">Traveler Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="field">
                  <label>Full Name (as per Passport)</label>
                  <input type="text" [(ngModel)]="formData.name" class="input" placeholder="e.g. John Doe"/>
                </div>
                <div class="field">
                  <label>Passport Number</label>
                  <input type="text" [(ngModel)]="formData.passport" class="input" placeholder="e.g. AK1234567"/>
                </div>
                <div class="field">
                  <label>Flight / Vessel Number</label>
                  <input type="text" [(ngModel)]="formData.flight" class="input" placeholder="e.g. KQ101"/>
                </div>
                <div class="field">
                  <label>Country of Origin</label>
                  <input type="text" [(ngModel)]="formData.origin" class="input" placeholder="e.g. United Kingdom"/>
                </div>
              </div>
            </div>
          }

          @if (currentStep() === 1) {
            <div class="step-content">
              <h3 class="text-xl font-bold text-slate-800 mb-6">Goods Declaration</h3>
              <p class="text-slate-500 mb-6 text-sm">Please list all goods exceeding the duty-free allowance or restricted items.</p>
              
              <div class="items-list mb-6">
                @for (item of formData.items; track item.id; let i = $index) {
                  <div class="item-row flex gap-4 mb-4">
                    <input type="text" [(ngModel)]="item.description" class="input flex-[2]" placeholder="Description of goods"/>
                    <input type="number" [(ngModel)]="item.value" class="input flex-1" placeholder="Value (USD)"/>
                    <button (click)="removeItem(i)" class="remove-btn">✕</button>
                  </div>
                }
                <button (click)="addItem()" class="add-btn mt-2">
                  + Add Item
                </button>
              </div>

              <div class="summary-box p-6 bg-slate-50 rounded-2xl">
                <div class="flex justify-between items-center">
                  <span class="text-slate-600 font-bold">Total Declared Value</span>
                  <span class="text-xl font-black text-slate-800">USD {{ calculateTotal().toLocaleString() }}</span>
                </div>
              </div>
            </div>
          }

          @if (currentStep() === 2) {
            <div class="step-content text-center py-10">
              @if (!isSubmitted()) {
                <div class="confirmation">
                  <div class="icon-box mb-6 mx-auto">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#e31e24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <h3 class="text-2xl font-black text-slate-800 mb-4">Confirm Declaration</h3>
                  <p class="text-slate-500 mb-8 max-w-md mx-auto">
                    By submitting this form, you certify that the information provided is true and correct to the best of your knowledge.
                  </p>
                  <label class="flex items-center gap-3 justify-center mb-10 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="formData.agreed" class="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500">
                    <span class="text-sm font-semibold text-slate-700">I solemnly declare the above information is correct.</span>
                  </label>
                </div>
              } @else {
                <div class="success animate-fade-in">
                  <div class="success-icon mb-6 mx-auto">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="white"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h3 class="text-2xl font-black text-slate-800 mb-2">Declaration Submitted</h3>
                  <p class="text-slate-500 mb-8">Ref Number: KRA-CUST-88-{{ refNumber }}</p>
                  <div class="flex gap-4 justify-center">
                    <button class="btn-primary" (click)="reset()">New Declaration</button>
                    <button class="btn-secondary">Download PDF</button>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        @if (!isSubmitted()) {
          <div class="nav-btns flex justify-between mt-8">
            <button class="btn-secondary" [disabled]="currentStep() === 0" (click)="prev()">Back</button>
            <button class="btn-primary" [disabled]="!canNext()" (click)="next()">
              {{ currentStep() === 2 ? 'Submit Form-88' : 'Continue' }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .declaration-container { max-width: 1200px; margin: 0 auto; }
    .card { background: white; border-radius: 24px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    
    .stepper { display: flex; align-items: center; gap: 8px; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; position: relative; }
    .step-circle { 
      width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; 
      font-weight: 800; border: 3px solid #e2e8f0; color: #94a3b8; background: white; z-index: 2;
    }
    .step.active .step-circle { border-color: #e31e24; color: #e31e24; }
    .step.done .step-circle { background: #22c55e; border-color: #22c55e; color: white; }
    .step-label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .step-line { flex: 1; height: 3px; background: #e2e8f0; margin-top: -24px; border-radius: 2px; }
    .step-line.done { background: #22c55e; }

    .field label { display: block; font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .input { 
      width: 100%; padding: 12px 16px; border-radius: 12px; border: 2px solid #f1f5f9; 
      background: #fbfcfd; font-weight: 700; transition: 0.3s;
    }
    .input:focus { border-color: #e31e24; background: white; outline: none; }

    .btn-primary { 
      padding: 12px 32px; border-radius: 14px; background: #e31e24; color: white; 
      font-weight: 800; border: none; cursor: pointer; transition: 0.3s;
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { 
      padding: 12px 32px; border-radius: 14px; background: white; color: #64748b; 
      border: 2px solid #e2e8f0; font-weight: 800; cursor: pointer;
    }

    .add-btn { background: #f1f5f9; color: #475569; padding: 8px 16px; border-radius: 10px; font-weight: 700; border: none; cursor: pointer; }
    .remove-btn { color: #cbd5e1; font-size: 1.2rem; border: none; background: none; cursor: pointer; }
    .remove-btn:hover { color: #ef4444; }

    .success-icon { width: 64px; height: 64px; border-radius: 50%; background: #22c55e; display: flex; align-items: center; justify-content: center; }

    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
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
