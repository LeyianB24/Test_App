import { Component, Input, Output, EventEmitter, signal, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

/**
 * Enhanced Form Field Component
 * Provides consistent form input styling with validation feedback
 * Supports text, email, password, number, tel, date inputs
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-form-field',
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-group-precision animate-fade-in">
      <!-- Label with Tactical Indicator -->
      @if (label) {
        <label class="label-precision" [for]="fieldId">
          {{ label }}
          @if (required) {
            <span class="text-red-base ml-1">*</span>
          }
        </label>
      }

      <!-- High-Precision Input Wrapper -->
      <div class="input-wrapper-precision relative group">
        <input
          [id]="fieldId"
          [type]="type"
          class="input-precision w-full"
          [class.input-error-precision]="isError()"
          [class.input-success-precision]="isSuccess()"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value()"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          [attr.aria-label]="label"
          [attr.aria-describedby]="helpId"
          [attr.aria-invalid]="isError()">
        
        <!-- Tactical Icon Display -->
        @if (icon) {
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-base transition-colors pointer-events-none">
            {{ icon }}
          </span>
        }

        <!-- Focus Ring / Border Pulse -->
        <div class="input-focus-pulse-precision"></div>
      </div>

      <!-- Tactical Feedback Pipeline -->
      <div class="feedback-pipeline-precision mt-2">
        @if (isError()) {
          <p [id]="helpId" class="error-state-precision flex items-center gap-2 text-[10px] font-bold">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            <span class="uppercase tracking-wider">{{ errorMessage() }}</span>
          </p>
        } @else if (isSuccess()) {
          <p class="success-state-precision flex items-center gap-2 text-[10px] font-bold">
             <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-width="4" d="M5 13l4 4L19 7"/></svg>
             <span class="uppercase tracking-wider">{{ successMessage || 'Validation Sequence Clear' }}</span>
          </p>
        } @else if (helpText) {
          <p [id]="helpId" class="text-white/20 text-[9px] font-black uppercase tracking-widest pl-1">
            {{ helpText }}
          </p>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .input-focus-pulse-precision {
      position: absolute;
      inset: -2px;
      border: 2px solid var(--red-base);
      border-radius: 14px;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .group-focus-within .input-focus-pulse-precision {
      opacity: 0.1;
      transform: scale(1.02);
    }
  `]
})
export class FormFieldComponent {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'url'>('text');
  value = input<any>(signal<string>(''));
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  icon = input<string>('');
  helpText = input<string>('');
  successMessage = input<string>('');
  errorMessage = input<any>(signal<string>(''));
  validationPattern = input<RegExp | null>(null);

  valueChange = output<string>();
  focus = output<void>();
  blur = output<void>();

  fieldId = `form-field-${Math.random().toString(36).slice(2)}`;
  helpId = `${this.fieldId}-help`;
  isFocused = signal(false);
  isTouched = signal(false);

  isError() {
    return this.isTouched() && !!this.errorMessage();
  }

  isSuccess() {
    return this.isTouched() && !this.errorMessage() && this.value().length > 0;
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.valueChange.emit(input.value);

    // Validate if pattern provided
    if (this.validationPattern && input.value) {
      const isValid = this.validationPattern.test(input.value);
      this.errorMessage.set(isValid ? '' : 'Invalid format');
    }
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.isFocused.set(false);
    this.blur.emit();
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.focus.emit();
  }
}
