import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

/**
 * Enhanced Form Field Component
 * Provides consistent form input styling with validation feedback
 * Supports text, email, password, number, tel, date inputs
 */
@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-group-enhanced">
      <!-- Label with Required Indicator -->
      <label *ngIf="label" class="form-label-enhanced" [for]="fieldId">
        {{ label }}
        <span *ngIf="required" class="label-required"></span>
      </label>

      <!-- Input Field Wrapper -->
      <div class="input-icon-wrapper">
        <input
          [id]="fieldId"
          [type]="type"
          class="form-control-enhanced"
          [ngClass]="{'error': isError(), 'success': isSuccess()}"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value()"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          [attr.aria-label]="label"
          [attr.aria-describedby]="helpId"
          [attr.aria-invalid]="isError()">
        
        <!-- Icon Display (when provided) -->
        <span *ngIf="icon" class="input-icon">{{ icon }}</span>
      </div>

      <!-- Help Text -->
      <p *ngIf="helpText && !isError()" [id]="helpId" class="form-help-text">
        {{ helpText }}
      </p>

      <!-- Error Text -->
      <p *ngIf="isError()" [id]="helpId" class="form-error-text">
        {{ errorMessage() }}
      </p>

      <!-- Success Text -->
      <p *ngIf="isSuccess()" class="form-success-text">
        {{ successMessage || 'Looks good!' }}
      </p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .form-group-enhanced {
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
    }

    .form-control-enhanced.success {
      border-color: var(--success);
      background: rgba(16, 185, 129, 0.02);
    }

    .form-control-enhanced.success:focus {
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
    }
  `]
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'url' = 'text';
  @Input() value = signal<string>('');
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() icon: string = '';
  @Input() helpText: string = '';
  @Input() successMessage: string = '';
  @Input() errorMessage = signal<string>('');
  @Input() validationPattern: RegExp | null = null;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

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
