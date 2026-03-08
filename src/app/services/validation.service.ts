import { Injectable } from '@angular/core';
export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'pattern' | 'min' | 'max' | 'minLength' | 'maxLength' | 'custom';
  value?: any;
  message?: string;
  condition?: (value: any) => boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private readonly MIN_PASSWORD_LENGTH = 8;
  private readonly PHONE_PATTERN = /^(?:\+254|0)?([67]\d{8})$/;
  private readonly EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly KRAPING_PATTERN = /^[A-Z]\d{9}[A-Z]$/;
  private readonly ID_PATTERN = /^\d{6,8}$/;

  constructor() {}

  /**
   * Validate a single field
   */
  validateField(field: string, value: any, rules: ValidationRule[]): ValidationError[] {
    const fieldRules = rules.filter(r => r.field === field);
    const errors: ValidationError[] = [];

    fieldRules.forEach(rule => {
      const error = this.validateSingleRule(rule, value);
      if (error) {
        errors.push(error);
      }
    });

    return errors;
  }

  /**
   * Validate multiple fields
   */
  validateForm(formData: Record<string, any>, rules: ValidationRule[]): ValidationError[] {
    const errors: ValidationError[] = [];

    Object.keys(formData).forEach(field => {
      const fieldErrors = this.validateField(field, formData[field], rules);
      errors.push(...fieldErrors);
    });

    return errors;
  }

  /**
   * Validate single rule
   */
  private validateSingleRule(rule: ValidationRule, value: any): ValidationError | null {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return {
            field: rule.field,
            message: rule.message || `${this.humanize(rule.field)} is required`,
            type: 'REQUIRED'
          };
        }
        break;

      case 'email':
        if (value && !this.isValidEmail(value)) {
          return {
            field: rule.field,
            message: rule.message || 'Invalid email address',
            type: 'EMAIL'
          };
        }
        break;

      case 'pattern':
        if (value && !rule.value.test(value)) {
          return {
            field: rule.field,
            message: rule.message || `${this.humanize(rule.field)} format is invalid`,
            type: 'PATTERN'
          };
        }
        break;

      case 'min':
        if (value !== null && value !== undefined && Number(value) < rule.value) {
          return {
            field: rule.field,
            message: rule.message || `${this.humanize(rule.field)} must be at least ${rule.value}`,
            type: 'MIN'
          };
        }
        break;

      case 'max':
        if (value !== null && value !== undefined && Number(value) > rule.value) {
          return {
            field: rule.field,
            message: rule.message || `${this.humanize(rule.field)} cannot exceed ${rule.value}`,
            type: 'MAX'
          };
        }
        break;

      case 'minLength':
        if (value && String(value).length < rule.value) {
          return {
            field: rule.field,
            message: rule.message || `${this.humanize(rule.field)} must be at least ${rule.value} characters`,
            type: 'MIN_LENGTH'
          };
        }
        break;

      case 'maxLength':
        if (value && String(value).length > rule.value) {
          return {
            field: rule.field,
            message: rule.message || `${this.humanize(rule.field)} cannot exceed ${rule.value} characters`,
            type: 'MAX_LENGTH'
          };
        }
        break;

      case 'custom':
        if (value && rule.condition && !rule.condition(value)) {
          return {
            field: rule.field,
            message: rule.message || `${this.humanize(rule.field)} validation failed`,
            type: 'CUSTOM'
          };
        }
        break;
    }

    return null;
  }

  /**
   * Validate email (KRA specific: individual or business)
   */
  validateEmail(email: string): boolean {
    return this.isValidEmail(email);
  }

  /**
   * Validate KRA PIN
   */
  validateKRAPin(pin: string): boolean {
    return this.KRAPING_PATTERN.test(pin);
  }

  /**
   * Validate ID number
   */
  validateIDNumber(id: string): boolean {
    return this.ID_PATTERN.test(id);
  }

  /**
   * Validate phone number (Kenyan format)
   */
  validatePhoneNumber(phone: string): boolean {
    return this.PHONE_PATTERN.test(phone);
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (!password) {
      return { isStrong: false, score: 0, feedback: ['Password is required'] };
    }

    // Length check
    if (password.length >= this.MIN_PASSWORD_LENGTH) {
      score += 20;
    } else {
      feedback.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters`);
    }

    // Uppercase letters
    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Add uppercase letters for better security');
    }

    // Lowercase letters
    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Add lowercase letters for better security');
    }

    // Numbers
    if (/\d/.test(password)) {
      score += 20;
    } else {
      feedback.push('Add numbers for better security');
    }

    // Special characters
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Add special characters for maximum security');
    }

    return {
      isStrong: score >= 80,
      score,
      feedback: feedback.length === 0 ? ['Strong password'] : feedback
    };
  }

  /**
   * Validate password match
   */
  validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword && password.length > 0;
  }

  /**
   * Validate payment amount
   */
  validatePaymentAmount(amount: any): {
    isValid: boolean;
    message?: string;
  } {
    const numAmount = Number(amount);

    if (isNaN(numAmount)) {
      return { isValid: false, message: 'Amount must be a valid number' };
    }

    if (numAmount <= 0) {
      return { isValid: false, message: 'Amount must be greater than 0' };
    }

    if (numAmount > 999999999.99) {
      return { isValid: false, message: 'Amount exceeds maximum limit' };
    }

    // Check for reasonable decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(String(amount))) {
      return { isValid: false, message: 'Amount must have up to 2 decimal places' };
    }

    return { isValid: true };
  }

  /**
   * Validate date format
   */
  validateDate(dateString: string, format: 'YYYY-MM-DD' | 'DD/MM/YYYY' = 'YYYY-MM-DD'): boolean {
    const dateRegex = format === 'YYYY-MM-DD'
      ? /^\d{4}-\d{2}-\d{2}$/
      : /^\d{2}\/\d{2}\/\d{4}$/;

    if (!dateRegex.test(dateString)) {
      return false;
    }

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Validate date range
   */
  validateDateRange(startDate: Date, endDate: Date): {
    isValid: boolean;
    message?: string;
  } {
    if (startDate > endDate) {
      return {
        isValid: false,
        message: 'Start date cannot be after end date'
      };
    }

    return { isValid: true };
  }

  /**
   * Private helper: check if email is valid
   */
  private isValidEmail(email: string): boolean {
    return this.EMAIL_PATTERN.test(email);
  }

  /**
   * Convert field name to human readable format
   */
  private humanize(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Get error message for a specific field
   */
  getFieldError(errors: ValidationError[], field: string): string | null {
    const error = errors.find(e => e.field === field);
    return error ? error.message : null;
  }

  /**
   * Check if field has error
   */
  hasFieldError(errors: ValidationError[], field: string): boolean {
    return errors.some(e => e.field === field);
  }

  /**
   * Get all errors for a field
   */
  getFieldErrors(errors: ValidationError[], field: string): ValidationError[] {
    return errors.filter(e => e.field === field);
  }

  /**
   * Clear errors for specific field(s)
   */
  clearFieldErrors(errors: ValidationError[], fields: string | string[]): ValidationError[] {
    const fieldsToRemove = Array.isArray(fields) ? fields : [fields];
    return errors.filter(e => !fieldsToRemove.includes(e.field));
  }

  /**
   * Common validation rules for different forms
   */
  getLoginValidationRules(): ValidationRule[] {
    return [
      { field: 'taxpayerId', type: 'required' },
      { field: 'password', type: 'required' }
    ];
  }

  getRegistrationValidationRules(): ValidationRule[] {
    return [
      { field: 'firstName', type: 'required' },
      { field: 'lastName', type: 'required' },
      { field: 'idNumber', type: 'required' },
      { field: 'idNumber', type: 'pattern', value: this.ID_PATTERN, message: 'ID number must be 6-8 digits' },
      { field: 'email', type: 'required' },
      { field: 'email', type: 'email' },
      { field: 'phone', type: 'required' },
      { field: 'phone', type: 'pattern', value: this.PHONE_PATTERN, message: 'Invalid Kenyan phone number' },
      { field: 'password', type: 'required' },
      { field: 'password', type: 'minLength', value: this.MIN_PASSWORD_LENGTH },
      { field: 'confirmPassword', type: 'required' }
    ];
  }

  getPasswordChangeValidationRules(): ValidationRule[] {
    return [
      { field: 'currentPassword', type: 'required' },
      { field: 'newPassword', type: 'required' },
      { field: 'newPassword', type: 'minLength', value: this.MIN_PASSWORD_LENGTH },
      { field: 'confirmPassword', type: 'required' }
    ];
  }

  getPaymentValidationRules(): ValidationRule[] {
    return [
      { field: 'amount', type: 'required' },
      { field: 'paymentMethod', type: 'required' },
      { field: 'taxpayerId', type: 'required' }
    ];
  }

  getTaxReturnValidationRules(): ValidationRule[] {
    return [
      { field: 'taxType', type: 'required' },
      { field: 'taxPeriod', type: 'required' }
    ];
  }
}
