import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="unauthorized-container">
      <div class="glass-card text-center animate-up">
        <h1 class="gradient-text">Access Denied</h1>
        <p>You do not have the required permissions to access this terminal.</p>
        <div class="mt-40">
          <a routerLink="/" class="modern-btn primary-btn">Return to Security Perimeter</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0b;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 60px;
      border-radius: 40px;
      max-width: 500px;
    }
    h1 { font-size: 2.5rem; font-weight: 900; }
    p { color: rgba(255,255,255,0.6); margin-top: 16px; font-size: 1.1rem; }
    .gradient-text { background: var(--kra-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  `]
})
export class UnauthorizedComponent {}
