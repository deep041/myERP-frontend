import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <a class="skip-link" href="#main">Skip to content</a>
    <router-outlet />
  `,
})
export class AppComponent {
  title = 'erp-frontend';

  constructor() {
    inject(ThemeService);
  }
}
