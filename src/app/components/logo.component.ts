import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="logo-wrapper"
         [style.height]="height"
         [class.has-error]="hasError">

      <img
        *ngIf="!hasError"
        [src]="src"
        [alt]="altText"
        class="logo-img"
        (error)="onError()"
      />

      <div *ngIf="hasError" class="logo-fallback">
        <span class="fallback-text">KRA</span>
        <span class="fallback-sub">iTax</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
      line-height: 0;
      max-width: 100%; /* Prevent overflow on small screens */
    }

    .logo-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.3s ease;
      background-color: transparent; /* Default transparent */
    }

    .logo-img {
      height: 100%;       /* Match wrapper height */
      width: auto;        /* Maintain Aspect Ratio */
      max-width: 100%;    /* Responsive safety */
      object-fit: contain;
      display: block;
    }

    /* --- DARK MODE ADAPTATION --- */
    /* The KRA Logo has black text. In Dark Mode, this becomes invisible.
       Instead of inverting colors (which would ruin the Brand Red),
       we render a clean white 'pill' or 'badge' behind the logo.
    */
    :host-context(.dark-theme) .logo-wrapper {
      background-color: transparent !important;
      padding: 0;
      border: none;
      box-shadow: none;
      /* Ensure the blending works against the dark background */
      isolation: isolate; 
    }

    :host-context(.dark-theme) .logo-img {
       /* 
          Use a color-dodge or screen blend mode to make light parts pop and dark parts fade.
          Brightness adjustment ensures visibility.
          Invert is used only if the original logo is dark-on-light.
       */
       filter: brightness(0) invert(1);
       mix-blend-mode: screen; 
       opacity: 0.9;
    }

    /* --- FALLBACK STYLING --- */
    .logo-fallback {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      border-left: 4px solid var(--kra-red);
      padding-left: 8px;
    }

    .fallback-text {
      font-weight: 900;
      font-size: 1.2rem;
      line-height: 1;
      color: var(--text-main);
    }

    .fallback-sub {
      font-size: 0.7rem;
      color: var(--text-muted);
      letter-spacing: 1px;
    }
  `]
})
export class LogoComponent {
  @Input() height: string = '120px'; // Default matched to typical header size
  @Input() src: string = '/assets/logo.png'; // Use root-relative path
  @Input() altText: string = 'Kenya Revenue Authority';

  hasError = false;

  onError() {
    this.hasError = true;
    console.warn('Logo image failed to load. Displaying text fallback.');
  }
}
