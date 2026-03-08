import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { ValidationService, ValidationRule } from '../../services/validation.service';
import { NotificationService } from '../../core/services/notification.service';
import { MpesaService } from '../../services/mpesa.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-payment-form',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-content-precision animate-fade-in">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
    
        <!-- Primary Directive Input -->
        <div class="lg:col-span-8 space-y-10">
          <div class="card-precision p-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-1.5 h-8 bg-red-base rounded-full"></div>
              <div>
                <h3 class="text-lg font-black uppercase tracking-tighter">Financial Directive</h3>
                <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Transaction Pipeline Configuration</p>
              </div>
            </div>
    
            <form [formGroup]="paymentForm" (ngSubmit)="submitPayment()" class="form-stack-precision">
              <!-- Entity Selector -->
              <div class="form-group-precision">
                <label for="taxpayer" class="label-precision">Target Entity <span class="text-red-base">*</span></label>
                <div class="input-wrapper-precision">
                  <select formControlName="taxpayerId" id="taxpayer" class="input-precision w-full appearance-none">
                    <option value="">-- IDENTIFY ENTITY --</option>
                    @for (tp of taxpayers(); track tp) {
                      <option [value]="tp.id">
                        {{ tp.name }} // {{ tp.pin }}
                      </option>
                    }
                  </select>
                </div>
                @if (hasError('taxpayerId')) {
                  <p class="error-state-precision mt-2 text-[10px] uppercase font-bold">{{ getError('taxpayerId') }}</p>
                }
              </div>
    
              <!-- Classification -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="form-group-precision">
                  <label for="paymentType" class="label-precision">Directive Type <span class="text-red-base">*</span></label>
                  <div class="input-wrapper-precision">
                    <select formControlName="paymentType" id="paymentType" class="input-precision w-full appearance-none" (change)="onPaymentTypeChange()">
                      <option value="">-- CATEGORIZE --</option>
                      <option value="tax_return">Tax Return Settlement</option>
                      <option value="outstanding">Liability Clearing</option>
                      <option value="invoice">Invoice Remittance</option>
                      <option value="general">Ad-hoc Payment</option>
                    </select>
                  </div>
                </div>
    
                <!-- Numerical Payload -->
                <div class="form-group-precision">
                  <label for="amount" class="label-precision">Payload Value (KES) <span class="text-red-base">*</span></label>
                  <div class="input-wrapper-precision relative group">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 group-focus-within:text-red-base transition-colors">KES</span>
                    <input
                      type="number"
                      formControlName="amount"
                      id="amount"
                      placeholder="0.00"
                      class="input-precision w-full pl-12 text-right font-mono text-lg tracking-tighter"
                      [class.input-error-precision]="hasError('amount')">
                    </div>
                    @if (hasError('amount')) {
                      <p class="error-state-precision mt-2 text-[10px] uppercase font-bold">{{ getError('amount') }}</p>
                    }
                  </div>
                </div>
    
                <!-- Channel Allocation -->
                <div class="form-group-precision mt-4">
                  <label class="label-precision mb-4">Transmission Channel <span class="text-red-base">*</span></label>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label class="card-precision p-4 flex items-start gap-4 cursor-pointer hover:border-red-base/40 transition-all" [class.border-red-base]="paymentForm.get('paymentMethod')?.value === 'mpesa'">
                      <input type="radio" formControlName="paymentMethod" value="mpesa" class="mt-1 accent-red-base">
                      <div class="flex flex-col">
                        <span class="text-xs font-black uppercase text-white">M-PESA</span>
                        <span class="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Mobile Instant</span>
                      </div>
                    </label>
                    <label class="card-precision p-4 flex items-start gap-4 cursor-pointer hover:border-red-base/40 transition-all" [class.border-red-base]="paymentForm.get('paymentMethod')?.value === 'bank_transfer'">
                      <input type="radio" formControlName="paymentMethod" value="bank_transfer" class="mt-1 accent-red-base">
                      <div class="flex flex-col">
                        <span class="text-xs font-black uppercase text-white">EFT/RTGS</span>
                        <span class="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Institutional</span>
                      </div>
                    </label>
                    <label class="card-precision p-4 flex items-start gap-4 cursor-pointer hover:border-red-base/40 transition-all" [class.border-red-base]="paymentForm.get('paymentMethod')?.value === 'cheque'">
                      <input type="radio" formControlName="paymentMethod" value="cheque" class="mt-1 accent-red-base">
                      <div class="flex flex-col">
                        <span class="text-xs font-black uppercase text-white">Instrument</span>
                        <span class="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Cheque/Bankers</span>
                      </div>
                    </label>
                  </div>
                </div>
    
                <!-- Tactical Contact (M-PESA specific) -->
                @if (paymentForm.get('paymentMethod')?.value === 'mpesa') {
                  <div class="form-group-precision animate-fade-in">
                    <label for="phone" class="label-precision">Target Mobile Sequence <span class="text-red-base">*</span></label>
                    <div class="input-wrapper-precision">
                      <input
                        type="tel"
                        formControlName="phone"
                        id="phone"
                        placeholder="+254 XXX XXX XXX"
                        class="input-precision w-full font-mono tracking-widest"
                        [class.input-error-precision]="hasError('phone')">
                      </div>
                      @if (hasError('phone')) {
                        <p class="error-state-precision mt-2 text-[10px] uppercase font-bold">{{ getError('phone') }}</p>
                      }
                    </div>
                  }
    
                  <!-- Narrative -->
                  <div class="form-group-precision">
                    <label for="description" class="label-precision">Directive Narrative</label>
                    <div class="input-wrapper-precision">
                      <textarea
                        formControlName="description"
                        id="description"
                        placeholder="Provide context for this transaction..."
                        class="input-precision w-full min-h-[100px] py-4"
                      rows="3"></textarea>
                    </div>
                  </div>
    
                  <!-- Action Interface -->
                  <div class="flex gap-4 pt-6">
                    <button type="reset" class="btn-precision btn-secondary-precision flex-1 py-4" (click)="resetForm()">
                      CLEAR BUFFER
                    </button>
                    <button type="submit" class="btn-precision btn-primary-precision flex-[2] py-4" [disabled]="!paymentForm.valid || isSubmitting()">
                      @if (!isSubmitting()) { <span>COMMIT DIRECTIVE</span> }
                      @else { <span>SYNCHRONIZING...</span> }
                    </button>
                  </div>
                </form>
              </div>
            </div>
    
            <!-- Sidebar Analytics -->
            <div class="lg:col-span-4 space-y-8">
              @if (paymentForm.get('taxpayerId')?.value) {
                <div class="ops-card-precision animate-scale-in">
                  <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-red-base mb-6">Real-time Allocation Summary</h3>
    
                  <div class="ledger-stack-precision">
                    <div class="ledger-row-precision">
                      <span class="label">Taxpayer</span>
                      <span class="value text-white">{{ getSelectedTaxpayer()?.name }}</span>
                    </div>
                    <div class="ledger-row-precision">
                      <span class="label">PIN Sequence</span>
                      <span class="value font-mono tracking-tighter text-white">{{ getSelectedTaxpayer()?.pin }}</span>
                    </div>
                  </div>
    
                  <div class="mt-10 pt-6 border-t border-white/5 space-y-6">
                    <div class="flex justify-between items-center">
                      <span class="text-xs font-bold text-white/30 uppercase tracking-widest">Payload</span>
                      <span class="text-xl font-black text-white">KES {{ paymentForm.get('amount')?.value || '0' | number:'1.0-2' }}</span>
                    </div>
    
                    @if (paymentForm.get('paymentMethod')?.value === 'mpesa') {
                      <div class="flex justify-between items-center opacity-60">
                        <span class="text-[10px] font-bold text-white/30 uppercase tracking-widest">M-PESA Fee</span>
                        <span class="text-sm font-bold text-white">KES {{ calculateMpesaFee() | number:'1.0-2' }}</span>
                      </div>
                    }
    
                    <div class="p-4 bg-red-base/10 border border-red-base/20 rounded-xl">
                      <div class="flex justify-between items-end">
                        <span class="text-[10px] font-black text-red-base uppercase tracking-[0.2em]">Total Remittance</span>
                        <span class="text-2xl font-black text-white">KES {{ getTotalAmount() | number:'1.0-2' }}</span>
                      </div>
                    </div>
                  </div>
    
                  <div class="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-xl flex gap-4 items-start">
                    <svg width="18" height="18" class="text-white/20 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <p class="text-[10px] font-medium leading-relaxed text-white/40">Deployment of this payload requires second-factor authorization. Ensure your transmission channel is secure.</p>
                  </div>
                </div>
              } @else {
                <div class="card-precision p-12 text-center border-dashed border-white/10 opacity-30">
                  <svg width="48" height="48" class="mx-auto mb-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <p class="text-xs font-bold uppercase tracking-widest text-white/40 leading-relaxed">Select taxpayer to initialize<br>summary pipeline</p>
                </div>
              }
            </div>
          </div>
        </div>
    `,
  styles: [`
    :host { display: block; width: 100%; }
    .input-precision option { background: #0A0A0A; color: white; }
  `]
})
export class PaymentFormComponent {
  private formBuilder = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private validationService = inject(ValidationService);
  private notificationService = inject(NotificationService);
  private mpesaService = inject(MpesaService);

  // State
  paymentForm!: FormGroup;
  isSubmitting = signal(false);
  selectedPaymentType = signal('');

  // Data
  taxpayers = signal<any[]>([
    { id: 1, name: 'John Doe', pin: 'A123456789A' },
    { id: 2, name: 'Jane Smith', pin: 'B987654321B' },
    { id: 3, name: 'ABC Corp', pin: 'C111111111C' }
  ]);

  returns = signal<any[]>([
    { id: 1, period: '2024 Q1', amount: 50000 },
    { id: 2, period: '2024 Q2', amount: 75000 }
  ]);

  invoices = signal<any[]>([
    { id: 101, name: 'INV-001', amount: 25000 },
    { id: 102, name: 'INV-002', amount: 40000 }
  ]);

  filteredReturns = computed(() => this.returns());
  filteredInvoices = computed(() => this.invoices());

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.paymentForm = this.formBuilder.group({
      taxpayerId: ['', Validators.required],
      paymentType: ['', Validators.required],
      relatedId: [''],
      amount: [0, [Validators.required, Validators.min(100), Validators.max(150000)]],
      paymentMethod: ['mpesa', Validators.required],
      phone: ['', Validators.required],
      description: ['']
    });

    // Watch payment type changes
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const phoneControl = this.paymentForm.get('phone');
      if (method === 'mpesa') {
        phoneControl?.setValidators([Validators.required]);
      } else {
        phoneControl?.clearValidators();
      }
      phoneControl?.updateValueAndValidity({emitEvent: false});
    });
  }

  onPaymentTypeChange(): void {
    this.selectedPaymentType.set(this.paymentForm.get('paymentType')?.value);
  }

  showFeeBreakdown(): boolean {
    return !!this.paymentForm.get('amount')?.value && this.paymentForm.get('amount')?.value > 0;
  }

  calculateMpesaFee(): number {
    const amount = this.paymentForm.get('amount')?.value || 0;
    return this.mpesaService.calculatePaymentFee(amount).fee;
  }

  getTotalAmount(): number {
    const amount = this.paymentForm.get('amount')?.value || 0;
    const fee = this.paymentForm.get('paymentMethod')?.value === 'mpesa'
      ? this.calculateMpesaFee()
      : 0;
    return amount + fee;
  }

  getSubmitButtonText(): string {
    const method = this.paymentForm.get('paymentMethod')?.value;
    return method === 'mpesa' ? 'Proceed to M-PESA' : 'Confirm Payment';
  }

  getSelectedTaxpayer(): any {
    const id = this.paymentForm.get('taxpayerId')?.value;
    return this.taxpayers().find(tp => tp.id === id);
  }

  hasError(field: string): boolean {
    const control = this.paymentForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getError(field: string): string {
    const control = this.paymentForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    }
    if (control.hasError('min')) {
      return 'Minimum amount is KES 100';
    }
    if (control.hasError('max')) {
      return 'Maximum amount is KES 150,000';
    }

    return 'Invalid input';
  }

  async submitPayment(): Promise<void> {
    if (!this.paymentForm.valid) {
      this.notificationService.showError('Please fill in all required fields');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formData = this.paymentForm.value;

      if (formData.paymentMethod === 'mpesa') {
        // Trigger M-PESA payment
        const result = await this.mpesaService.processPayment(
          formData.phone,
          formData.amount,
          formData.taxpayerId
        );

        if (result.success) {
          this.notificationService.showSuccess('M-PESA payment initiated. Check your phone for the prompt.');
          this.resetForm();
        } else {
          this.notificationService.showError(result.message);
        }
      } else {
        // Other payment methods
        this.notificationService.showSuccess('Payment recorded. Please complete payment through your bank.');
        this.resetForm();
      }
    } catch (error: any) {
      this.notificationService.showError('Payment processing failed: ' + error.message);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  resetForm(): void {
    this.paymentForm.reset({
      paymentMethod: 'mpesa'
    });
    this.selectedPaymentType.set('');
  }
}
