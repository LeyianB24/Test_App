import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  template: `
    <router-outlet></router-outlet>
    <app-notification></app-notification>
    <div class="container">
      <h1>{{ title }}</h1>
      <button (click)="handleGetStarted()">Get Started</button>
      <button (click)="handleLearnMore()">Learn More</button>
    </div>
  `,
  styles: [`
    .container { padding: 1rem; }
    h1 { font-size: 1.5rem; margin-bottom: .5rem; }
    button { margin-right: .5rem; }
  `]
})
export class AppComponent {
  title = 'My Angular App';

  // Inject the service
  constructor(private notifyService: NotificationService) {}

  // Action for the 'Get Started' button
  handleGetStarted() {
    this.notifyService.show('Welcome aboard! 🚀', 'success');
  }

  // Action for the 'Learn More' button
  handleLearnMore() {
    this.notifyService.show('This is an info notification.', 'info');
  }
}
