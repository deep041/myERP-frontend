import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppHeaderComponent } from '../../layout/app-header.component';
import { CompanyContextService } from '../../core/company/company-context.service';
import { Company } from '../../core/company/company.models';
import { CompanyService } from '../../core/company/company.service';

@Component({
  selector: 'app-company-list',
  imports: [AppHeaderComponent, RouterLink],
  template: `
    <app-header />
    <main class="page-body">
      <div class="page-heading row" style="justify-content: space-between;">
        <div>
          <h1>Companies</h1>
          <p class="lede">Choose a company to open, or create another one.</p>
        </div>
        <a class="button" routerLink="/companies/new">New company</a>
      </div>
      @if (errorMessage()) {
        <p class="form-error">{{ errorMessage() }}</p>
      }
      <section class="list">
        @for (company of companies(); track company.id) {
          <article class="company">
            <div>
              <strong>{{ company.name }}</strong>
              <div class="role">{{ company.role }}</div>
            </div>
            <button type="button" (click)="open(company)">Open</button>
          </article>
        } @empty {
          <p class="muted">You do not belong to a company yet.</p>
        }
      </section>
    </main>
  `,
})
export class CompanyListComponent {
  private readonly companyService = inject(CompanyService);
  private readonly context = inject(CompanyContextService);
  private readonly router = inject(Router);

  readonly companies = signal<Company[]>([]);
  readonly errorMessage = signal('');

  constructor() {
    this.companyService.list().subscribe({
      next: (companies) => this.companies.set(companies),
      error: () => this.errorMessage.set('Unable to load companies'),
    });
  }

  open(company: Company): void {
    this.context.select(company);
    void this.router.navigateByUrl('/dashboard');
  }
}
