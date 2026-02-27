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

  it(`should have the 'iTax Portal' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('iTax Portal');
  });

  it('should render the welcome message', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Checks for "Welcome" because the name "Bezalel" is dynamic
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome');
  });
});
