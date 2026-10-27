import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      @switch (name()) {
        @case ('companies') {
          <path d="M4 20V6.5A1.5 1.5 0 0 1 5.5 5H12v15" />
          <path d="M12 9h6.5A1.5 1.5 0 0 1 20 10.5V20" />
          <path d="M3 20h18" />
          <path d="M8 9h.01M8 13h.01M16 13h.01M16 17h.01" />
        }
        @case ('dashboard') {
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
          <rect x="13.5" y="3.5" width="7" height="4.5" rx="1.5" />
          <rect x="13.5" y="11" width="7" height="9.5" rx="1.5" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        }
        @case ('plus') {
          <path d="M12 5v14M5 12h14" />
        }
        @case ('menu') {
          <path d="M4 7h16M4 12h16M4 17h16" />
        }
        @case ('panel') {
          <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
          <path d="M9.5 4.5v15" />
        }
        @case ('moon') {
          <path d="M16.5 13.5A6.5 6.5 0 0 1 10 5.2 6.5 6.5 0 1 0 16.5 13.5Z" />
        }
        @case ('sun') {
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 3v1.5M12 19.5V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.5M19.5 12H21M4.9 19.1 6 18M18 6l1.1-1.1" />
        }
        @case ('eye') {
          <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
          <circle cx="12" cy="12" r="2.5" />
        }
        @case ('eye-off') {
          <path d="M4 5.5 19 18.5" />
          <path d="M9.2 6.8A9 9 0 0 1 12 6.5c6 0 9.5 5.5 9.5 5.5a16 16 0 0 1-3.2 3.6" />
          <path d="M6.1 8.2C4 9.8 2.5 12 2.5 12S6 17.5 12 17.5a8 8 0 0 0 3.2-.6" />
        }
        @case ('logout') {
          <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h7A1.5 1.5 0 0 1 19 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 9 18.5V17" />
          <path d="M13 12H4" />
          <path d="M6.5 9.5 4 12l2.5 2.5" />
        }
        @case ('alert') {
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 8v4.5" />
          <path d="M12 16h.01" />
        }
      }
    </svg>
  `,
})
export class IconComponent {
  readonly name = input.required<string>();
}
