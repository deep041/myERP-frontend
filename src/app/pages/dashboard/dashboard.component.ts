import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CompanyContextService } from '../../core/company/company-context.service';
import { Company } from '../../core/company/company.models';
import { AppShellComponent } from '../../layout/app-shell.component';

@Component({
  selector: 'app-dashboard',
  imports: [AppShellComponent, RouterLink, DatePipe],
  template: `
    <app-shell title="Dashboard" [crumbs]="[{ label: 'Dashboard' }]">
      <div class="page narrow">
        @if (company(); as current) {
          <section class="panel workspace">
            <p class="eyebrow">Current company</p>
            <div class="workspace-title">
              <h2>{{ current.name }}</h2>
              <span class="badge" [attr.data-role]="current.role">{{ roleLabel(current.role) }}</span>
            </div>
            <p class="lede">Signed in as {{ user()?.name }}.</p>
            <dl class="meta">
              <div>
                <dt>Email</dt>
                <dd>{{ user()?.email }}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd class="num">{{ current.createdAt | date: 'mediumDate' }}</dd>
              </div>
            </dl>
            <a class="btn btn-secondary" routerLink="/companies">Switch company</a>
          </section>
        }
      </div>
    </app-shell>
  `,
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly companies = inject(CompanyContextService);
  readonly user = this.auth.user;
  readonly company = this.companies.selected;

  roleLabel(role: Company['role']): string {
    switch (role) {
      case 'OWNER':
        return 'Owner';
      case 'ADMIN':
        return 'Admin';
      case 'MANAGER':
        return 'Manager';
      case 'EMPLOYEE':
        return 'Employee';
    }
  }
}
