import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * AppComponent — Minimal root component.
 *
 * Layout (sidebar, header, footer) is now handled by each portal's shell component:
 *  - MemberShellComponent for /member/*
 *  - AdminShellComponent  for /admin-portal/*
 *
 * Auth screens (login, forgot-password, register) render full-page with no layout.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`
})
export class AppComponent {}
