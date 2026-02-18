import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Use Angular Signals for reactive state
  darkMode = signal<boolean>(false);

  constructor() {
    // Check localStorage or System Preference on load
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      this.setDarkMode(true);
    }
  }

  toggleTheme() {
    this.setDarkMode(!this.darkMode());
  }

  private setDarkMode(isDark: boolean) {
    this.darkMode.set(isDark);
    if (isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}
