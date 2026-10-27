import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CompanyContextService } from '../../core/company/company-context.service';
import { Company } from '../../core/company/company.models';
import { CompanyService } from '../../core/company/company.service';
import { AppShellComponent } from '../../layout/app-shell.component';
import { IconComponent } from '../../layout/icon.component';

@Component({
  selector: 'app-company-list',
  imports: [AppShellComponent, RouterLink, DatePipe, IconComponent],
  template: `
    <app-shell title="Companies" [crumbs]="[{ label: 'Companies' }]">
      <div class="page">
        <div class="page-toolbar">
          <p>Choose a company to open, or create another one.</p>
          <a class="btn btn-primary" routerLink="/companies/new">
            <app-icon name="plus" />
            New company
          </a>
        </div>

        @if (loading()) {
          <div class="skeleton-list" aria-busy="true" aria-live="polite">
            <span class="sr-only">Loading companies</span>
            @for (row of skeletons; track row) {
              <div class="skeleton-row"></div>
            }
          </div>
        } @else if (errorMessage()) {
          <div class="notice notice-error" role="alert">
            <app-icon name="alert" />
            <div>
              <strong>Unable to load companies</strong>
              <p>{{ errorMessage() }}</p>
            </div>
            <button type="button" class="btn btn-secondary" (click)="load()">Try again</button>
          </div>
        } @else if (companies().length === 0) {
          <div class="empty">
            <span class="empty-mark" aria-hidden="true">
              <app-icon name="companies" />
            </span>
            <h2>No companies yet</h2>
            <p>Create a company to open your workspace. You will be the owner.</p>
            <a class="btn btn-primary" routerLink="/companies/new">Create company</a>
          </div>
        } @else {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Company</th>
                  <th scope="col">Role</th>
                  <th scope="col">Created</th>
                  <th scope="col"><span class="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                @for (company of companies(); track company.id) {
                  <tr>
                    <td class="company-name">{{ company.name }}</td>
                    <td><span class="badge" [attr.data-role]="company.role">{{ roleLabel(company.role) }}</span></td>
                    <td class="num">{{ company.createdAt | date: 'mediumDate' }}</td>
                    <td class="actions-cell">
                      <button type="button" class="btn btn-secondary" (click)="open(company)">Open</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </app-shell>
  `,
})
export class CompanyListComponent {
  private readonly companyService = inject(CompanyService);
  private readonly context = inject(CompanyContextService);
  private readonly router = inject(Router);

  readonly companies = signal<Company[]>([]);
  readonly errorMessage = signal('');
  readonly loading = signal(true);
  readonly skeletons = [1, 2, 3];

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.companyService.list().subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Unable to load companies');
      },
    });
  }

  open(company: Company): void {
    this.context.select(company);
    void this.router.navigateByUrl('/dashboard');
  }

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
