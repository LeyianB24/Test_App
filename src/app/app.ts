import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationService } from './notification/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'KRA Tax Portal';
  currentDate = new Date();

  // Enhanced Stats with Progress bars
  stats = [
    { label: 'Total Tax Due', value: 'KES 145,200', trend: 'Due in 5 days', color: 'red', progress: 75 },
    { label: 'VAT Returns', value: 'Submitted', trend: 'On Time', color: 'green', progress: 100 },
    { label: 'eTIMS Invoices', value: '340', trend: '+12 this week', color: 'blue', progress: 60 },
    { label: 'Compliance Score', value: '98%', trend: 'Excellent', color: 'green', progress: 98 }
  ];

  // Enhanced Activity with Status
  recentActivity = [
    { user: 'Bezalel Leyian', action: 'Filed VAT Return (Jan 2026)', time: '2 mins ago', status: 'success', statusText: 'Filed' },
    { user: 'System', action: 'Generated Payment Slip (PRN)', time: '1 hour ago', status: 'pending', statusText: 'Pending Pay' },
    { user: 'KRA Notifications', action: 'Compliance Certificate Approved', time: '5 hours ago', status: 'success', statusText: 'Approved' },
    { user: 'Bezalel Leyian', action: 'Uploaded Withholding Cert', time: '1 day ago', status: 'warning', statusText: 'Reviewing' }
  ];

  constructor(private notifyService: NotificationService) {}

  handleAction() {
    this.notifyService.show('Initiating new tax return...', 'info');
  }

  handleLogout() {
    this.notifyService.show('Logging out of secure portal...', 'success');
  }
}
