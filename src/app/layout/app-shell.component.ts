import { Component, ElementRef, HostListener, inject, input, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../core/auth/auth.service';
import { CompanyContextService } from '../core/company/company-context.service';
import { IconComponent } from './icon.component';
import { ThemeToggleComponent } from './theme-toggle.component';

export interface ShellCrumb {
  label: string;
  href?: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, IconComponent, ThemeToggleComponent],
  template: `
    <div class="shell" [class.is-collapsed]="collapsed()" [class.is-drawer-open]="drawerOpen()">
      @if (drawerOpen()) {
        <button type="button" class="backdrop" aria-label="Close navigation" (click)="drawerOpen.set(false)"></button>
      }
      <aside class="sidebar" id="app-nav">
        <div class="sidebar-brand">
          <a class="brand" routerLink="/companies">
            <span class="mark" aria-hidden="true">E</span>
            <span class="brand-name">ERP</span>
          </a>
        </div>
        <p class="nav-label">Workspace</p>
        <nav aria-label="Primary">
          <a
            routerLink="/companies"
            routerLinkActive="is-active"
            [routerLinkActiveOptions]="{ exact: true }"
            [attr.title]="collapsed() ? 'Companies' : null"
          >
            <app-icon name="companies" />
            <span>Companies</span>
          </a>
          @if (company()) {
            <a routerLink="/dashboard" routerLinkActive="is-active" [attr.title]="collapsed() ? 'Dashboard' : null">
              <app-icon name="dashboard" />
              <span>Dashboard</span>
            </a>
          }
        </nav>
      </aside>
      <div class="shell-main">
        <header class="shell-header">
          <div class="header-lead">
            <button type="button" class="icon-btn menu-btn" aria-label="Open navigation" (click)="drawerOpen.set(true)">
              <app-icon name="menu" />
            </button>
            <button
              type="button"
              class="icon-btn collapse-btn"
              (click)="collapsed.set(!collapsed())"
              [attr.aria-expanded]="!collapsed()"
              aria-controls="app-nav"
              [attr.aria-label]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            >
              <app-icon name="panel" />
            </button>
            <div>
              <nav aria-label="Breadcrumb">
                <ol class="crumbs">
                  @for (crumb of crumbs(); track crumb.label; let last = $last) {
                    <li>
                      @if (crumb.href && !last) {
                        <a [routerLink]="crumb.href">{{ crumb.label }}</a>
                      } @else {
                        <span [attr.aria-current]="last ? 'page' : null">{{ crumb.label }}</span>
                      }
                    </li>
                  }
                </ol>
              </nav>
              <h1>{{ title() }}</h1>
            </div>
          </div>
          <div class="header-actions">
            <app-theme-toggle />
            <div class="user-menu" #menuRoot>
              <button
                type="button"
                class="user-trigger"
                (click)="menuOpen.set(!menuOpen())"
                [attr.aria-expanded]="menuOpen()"
                aria-haspopup="menu"
              >
                <span class="avatar" aria-hidden="true">{{ initials() }}</span>
                <span class="user-name">{{ user()?.name }}</span>
              </button>
              @if (menuOpen()) {
                <div class="menu" role="menu">
                  <p class="menu-meta">{{ user()?.email }}</p>
                  <button type="button" role="menuitem" (click)="logout()">
                    <app-icon name="logout" />
                    Log out
                  </button>
                </div>
              }
            </div>
          </div>
        </header>
        <main id="main" class="shell-content">
          <ng-content />
        </main>
      </div>
    </div>
  `,
})
export class AppShellComponent {
  private readonly auth = inject(AuthService);
  private readonly companies = inject(CompanyContextService);
  private readonly router = inject(Router);
  private readonly menuRoot = viewChild<ElementRef<HTMLElement>>('menuRoot');

  readonly title = input.required<string>();
  readonly crumbs = input<ShellCrumb[]>([]);
  readonly user = this.auth.user;
  readonly company = this.companies.selected;
  readonly collapsed = signal(false);
  readonly drawerOpen = signal(false);
  readonly menuOpen = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.drawerOpen.set(false);
        this.menuOpen.set(false);
      });
  }

  initials(): string {
    const name = this.user()?.name?.trim() ?? '';
    const parts = name.split(/\s+/).filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase());
    return letters.join('') || 'U';
  }

  logout(): void {
    this.menuOpen.set(false);
    this.auth.logout().subscribe(() => {
      this.companies.clear();
      void this.router.navigateByUrl('/login');
    });
  }

  @HostListener('document:keydown.escape')
  closeOverlays(): void {
    this.menuOpen.set(false);
    this.drawerOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  closeMenuOnOutsideClick(event: MouseEvent): void {
    const root = this.menuRoot()?.nativeElement;
    if (!this.menuOpen() || !root || root.contains(event.target as Node)) {
      return;
    }
    this.menuOpen.set(false);
  }
}
