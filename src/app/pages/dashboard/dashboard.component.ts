import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CompanyContextService } from '../../core/company/company-context.service';
import { AppHeaderComponent } from '../../layout/app-header.component';

@Component({
  selector: 'app-dashboard',
  imports: [AppHeaderComponent, RouterLink],
  template: `
    <app-header />
    <main class="page-body">
      <section class="card">
        <h1>Dashboard</h1>
        <p class="lede">Signed in as {{ user()?.name }}.</p>
        @if (company(); as current) {
          <p><strong>{{ current.name }}</strong></p>
          <p class="muted">Your role is {{ current.role }}.</p>
        }
        <p><a routerLink="/companies">Switch company</a></p>
      </section>
    </main>
  `,
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly companies = inject(CompanyContextService);
  readonly user = this.auth.user;
  readonly company = this.companies.selected;
}
