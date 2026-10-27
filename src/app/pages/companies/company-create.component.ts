import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppHeaderComponent } from '../../layout/app-header.component';
import { CompanyContextService } from '../../core/company/company-context.service';
import { CompanyService } from '../../core/company/company.service';

@Component({
  selector: 'app-company-create',
  imports: [ReactiveFormsModule, AppHeaderComponent, RouterLink],
  template: `
    <app-header />
    <main class="page-body">
      <form class="card" [formGroup]="form" (ngSubmit)="submit()">
        <h1>New company</h1>
        <p class="lede">You will be the owner of this company.</p>
        <div class="field">
          <label for="name">Company name</label>
          <input id="name" type="text" formControlName="name" />
        </div>
        @if (errorMessage) {
          <p class="form-error">{{ errorMessage }}</p>
        }
        <div class="actions">
          <button type="submit" [disabled]="form.invalid || submitting">Create company</button>
          <a routerLink="/companies">Cancel</a>
        </div>
      </form>
    </main>
  `,
})
export class CompanyCreateComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly context = inject(CompanyContextService);
  private readonly router = inject(Router);

  submitting = false;
  errorMessage = '';

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitting = true;
    this.errorMessage = '';
    this.companyService.create(this.form.controls.name.value).subscribe({
      next: (company) => {
        this.context.select(company);
        void this.router.navigateByUrl('/dashboard');
      },
      error: (error: { error?: { error?: { message?: string } } }) => {
        this.submitting = false;
        this.errorMessage = error.error?.error?.message ?? 'Unable to create the company';
      },
    });
  }
}
