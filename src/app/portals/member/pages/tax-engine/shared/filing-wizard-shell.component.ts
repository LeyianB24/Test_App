import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filing-wizard-shell',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wizard-shell animate-up max-w-5xl mx-auto p-6">
      <header class="wizard-header mb-10 text-center">
        <h1 class="text-4xl font-black text-primary tracking-tight mb-2">{{ title() }}</h1>
        <p class="text-tertiary font-medium">{{ subtitle() }}</p>
      </header>

      <!-- Stepper -->
      <div class="stepper-layout flex items-center justify-center mb-12">
        @for (step of steps(); track step; let i = $index) {
          <div class="step-node" [class.active]="currentStep() === i" [class.done]="currentStep() > i">
            <div class="step-blob">
              @if (currentStep() > i) {
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              } @else {
                {{ i + 1 }}
              }
            </div>
            <span class="step-title">{{ step }}</span>
          </div>
          @if (i < steps().length - 1) {
            <div class="step-line" [class.filled]="currentStep() > i"></div>
          }
        }
      </div>

      <!-- Main Content Slot -->
      <div class="wizard-canvas glassmorphism p-8 mb-8 min-h-[400px]">
        <ng-content></ng-content>
      </div>

      <!-- Actions -->
      <footer class="wizard-actions flex justify-between items-center bg-app p-4 rounded-2xl border border-default shadow-sm">
        @if (currentStep() > 0) {
          <button 
            class="btn-back" 
            (click)="back.emit()" 
            [disabled]="currentStep() === 0 || isSubmitting()"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Previous Step
          </button>
        }
        <div class="flex-grow"></div>
        
        @if (currentStep() < steps().length - 1) {
          <button class="btn-continue" [disabled]="!canContinue()" (click)="next.emit()">
            Continue
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        } @else {
          <button class="btn-submit" [disabled]="!canSubmit() || isSubmitting()" (click)="submit.emit()">
            @if (isSubmitting()) {
                <span class="spinner-mini mr-2"></span> Submitting...
            } @else {
                Finalize & Submit Returns
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            }
          </button>
        }
      </footer>
    </div>
  `,
  styles: [`
    .wizard-shell { position: relative; }
    .glassmorphism {
        background: var(--bg-surface-1);
        backdrop-filter: blur(16px);
        border: 1px solid var(--border-subtle);
        border-radius: 32px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
    }
    
    .stepper-layout { gap: 0; }
    .step-node { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; width: 100px; }
    .step-blob {
        width: 48px; height: 48px; border-radius: 18px; 
        display: flex; align-items: center; justify-content: center;
        background: var(--bg-surface-2); border: 2.5px solid var(--border-default); color: var(--text-tertiary);
        font-weight: 900; font-size: 1.1rem; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .step-node.active .step-blob { border-color: var(--color-accent); color: var(--color-accent); transform: scale(1.1); box-shadow: var(--shadow-focus); }
    .step-node.done .step-blob { background: var(--success-base); border-color: var(--success-base); color: white; }
    
    .step-title { margin-top: 12px; font-size: 0.75rem; font-weight: 900; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 1px; }
    .step-node.active .step-title { color: var(--color-accent); }
    .step-node.done .step-title { color: var(--success-base); }

    .step-line { flex-grow: 1; max-width: 150px; height: 4px; background: var(--border-default); margin-bottom: 30px; border-radius: 2px; position: relative; }
    .step-line.filled { background: var(--success-base); }

    .btn-continue, .btn-submit {
        background: var(--gradient-accent); color: white;
        padding: 14px 28px; border-radius: 16px; font-weight: 850; border: none;
        display: flex; align-items: center; transition: 0.3s; cursor: pointer;
    }
    .btn-continue:hover:not(:disabled), .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(227, 30, 36, 0.3); }
    .btn-continue:disabled, .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-back {
        background: var(--bg-surface-2); color: var(--text-tertiary); padding: 14px 24px; border-radius: 16px; 
        font-weight: 800; border: 2px solid var(--border-default); display: flex; align-items: center; cursor: pointer; transition: 0.2s;
    }
    .btn-back:hover:not(:disabled) { border-color: var(--border-accent-subtle); background: var(--bg-hover); color: var(--text-primary); }

    .spinner-mini {
        width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class FilingWizardShellComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  steps = input.required<string[]>();
  currentStep = input.required<number>();
  canContinue = input<boolean>(true);
  canSubmit = input<boolean>(true);
  isSubmitting = input<boolean>(false);

  next = output<void>();
  back = output<void>();
  submit = output<void>();
}
