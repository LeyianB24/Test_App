import { Component, input, signal, inject } from '@angular/core';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-logo',
  imports: [],
  template: `
    <div class="logo-container-precision"
         [style.height]="height()"
         [class.error-state]="hasError()">

      @if (!hasError()) {
        <img
          [src]="src()"
          [alt]="altText()"
          class="logo-img-precision"
          (error)="onError()"
        />
      } @else {
        <div class="logo-fallback-precision">
          <span class="brand-kra">KRA</span>
          <span class="brand-itax">iTax</span>
        </div>
      }
      
      <!-- Precision Accent Line -->
      <div class="logo-accent-precision"></div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      vertical-align: middle;
    }

    .logo-container-precision {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      position: relative;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .logo-container-precision:hover {
      filter: drop-shadow(0 0 15px rgba(218, 56, 50, 0.2));
      transform: translateY(-1px);
    }

    .logo-img-precision {
      height: 100%;
      width: auto;
      object-fit: contain;
      filter: brightness(0) invert(1);
      mix-blend-mode: screen;
      opacity: 0.95;
      transition: opacity 0.3s ease;
    }

    .logo-container-precision:hover .logo-img-precision {
      opacity: 1;
    }

    .logo-fallback-precision {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1;
    }

    .brand-kra {
      font-size: 1.5rem;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -0.05em;
    }

    .brand-itax {
      font-size: 0.75rem;
      font-weight: 700;
      color: #DA3832;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      margin-top: -2px;
    }

    .logo-accent-precision {
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: #DA3832;
      transition: width 0.3s ease;
    }

    .logo-container-precision:hover .logo-accent-precision {
      width: 100%;
    }
  `]
})
export class LogoComponent {
  height = input<string>('120px');
  src = input<string>('/assets/logo.png');
  altText = input<string>('Kenya Revenue Authority');

  hasError = signal(false);

  onError() {
    this.hasError.set(true);
    console.warn('Brand asset reconciliation failed. Initiating fallback sequence.');
  }
}
