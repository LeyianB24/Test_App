import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-filing-wizard-shell',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wizard-shell animate-stagger max-w-5xl mx-auto p-6 content-area">
      <header class="wizard-header mb-12 text-center animate-stagger-item">
        <h1 class="premium-title">{{ title() }}</h1>
        <p class="premium-subtitle">{{ subtitle() }}</p>
      </header>

      <!-- Stepper -->
      <div class="stepper-layout flex items-center justify-center mb-12 animate-stagger-item">
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
      <div class="wizard-canvas glass-panel p-10 mb-8 min-h-[400px] animate-stagger-item">
        <ng-content></ng-content>
      </div>

      <!-- Actions -->
      <footer class="wizard-actions flex justify-between items-center glass-panel !p-6 animate-stagger-item">
        @if (currentStep() > 0) {
          <button 
            class="btn-precision btn-secondary-precision" 
            (click)="back.emit()" 
            [disabled]="currentStep() === 0 || isSubmitting()"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            PREVIOUS STEP
          </button>
        }
        <div class="flex-grow"></div>
        
        @if (currentStep() < steps().length - 1) {
          <button class="btn-precision btn-primary-precision" [disabled]="!canContinue()" (click)="next.emit()">
            CONTINUE PROTOCOL
            <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        } @else {
          <button class="btn-precision btn-primary-precision" [disabled]="!canSubmit() || isSubmitting()" (click)="submit.emit()">
            @if (isSubmitting()) {
                <div class="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mr-3"></div> SUBMITTING...
            } @else {
                FINALIZE & SUBMIT
                <svg class="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
            }
          </button>
        }
      </footer>
    </div>
  `,
  styles: [`
    .wizard-shell { position: relative; }
    
    .stepper-layout { gap: 0; }
    .step-node { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 2; width: 100px; }
    .step-blob {
        width: 48px; height: 48px; border-radius: 18px; 
        display: flex; align-items: center; justify-content: center;
        background: var(--bg-surface-2); border: 2.5px solid var(--border-subtle); color: var(--text-muted);
        font-weight: 900; font-size: 1.1rem; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .step-node.active .step-blob { border-color: var(--color-accent); color: var(--color-accent); transform: scale(1.1); box-shadow: var(--shadow-focus); }
    .step-node.done .step-blob { background: var(--color-success); border-color: var(--color-success); color: white; }
    
    .step-title { margin-top: 12px; font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
    .step-node.active .step-title { color: var(--color-accent); }
    .step-node.done .step-title { color: var(--color-success); }

    .step-line { flex-grow: 1; max-width: 150px; height: 4px; background: var(--border-subtle); margin-bottom: 30px; border-radius: 2px; position: relative; }
    .step-line.filled { background: var(--color-success); }

    @media (max-width: 768px) {
        .step-title { display: none; }
    }
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
