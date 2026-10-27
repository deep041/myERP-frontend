import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { CompanyContextService } from '../core/company/company-context.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/companies">ERP</a>
      <div class="row">
        @if (user(); as current) {
          <span class="muted">{{ current.name }}</span>
        }
        <button type="button" class="secondary" (click)="logout()">Log out</button>
      </div>
    </header>
  `,
})
export class AppHeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly companies = inject(CompanyContextService);
  private readonly router = inject(Router);
  readonly user = this.auth.user;

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.companies.clear();
      void this.router.navigateByUrl('/login');
    });
  }
}
