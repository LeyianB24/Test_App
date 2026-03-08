import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app';
import { NotificationService } from './core/services/notification.service';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('AppComponent', () => {

  beforeEach(async () => {
    // We create a "Fake" notification service so the test doesn't crash
    const notificationSpy = { show: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]), // Provides empty routing to satisfy RouterOutlet
        { provide: NotificationService, useValue: notificationSpy } // Injects the fake service
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
