import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly STORAGE_KEY = 'kra_theme';
  private readonly HTML_ATTR = 'data-theme';

  /* Signal — the single reactive source of truth */
  readonly theme = signal<Theme>(this.resolveInitialTheme());

  constructor() {
    /* Apply theme to DOM whenever signal changes */
    effect(() => {
      this.applyTheme(this.theme());
    });

    /* Listen for OS preference changes */
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  private resolveInitialTheme(): Theme {
    /* 1. Check localStorage */
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    if (stored === 'dark' || stored === 'light') return stored;

    /* 2. Fall back to system preference */
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute(this.HTML_ATTR, theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    /* Update meta theme-color for browser chrome */
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#000000' : '#F6F6F6');
    }
  }
}
