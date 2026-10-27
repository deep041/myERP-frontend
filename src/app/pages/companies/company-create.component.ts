import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CompanyContextService } from '../../core/company/company-context.service';
import { CompanyService } from '../../core/company/company.service';
import { AppShellComponent } from '../../layout/app-shell.component';

@Component({
  selector: 'app-company-create',
  imports: [ReactiveFormsModule, AppShellComponent, RouterLink],
  template: `
    <app-shell
      title="New company"
      [crumbs]="[
        { label: 'Companies', href: '/companies' },
        { label: 'New company' },
      ]"
    >
      <div class="page narrow">
        <form class="panel" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <p class="eyebrow">Company setup</p>
          <h2>Name the company</h2>
          <p class="lede">You will be the owner. You can open it from the company list after it is created.</p>

          <div class="field" [class.is-invalid]="form.controls.name.touched && form.controls.name.invalid">
            <label for="company-name">Company name</label>
            <input id="company-name" type="text" formControlName="name" autocomplete="organization" maxlength="120" />
            <p class="field-hint">Shown to everyone who belongs to this company.</p>
            @if (form.controls.name.touched && form.controls.name.hasError('required')) {
              <p class="field-error">Enter a company name.</p>
            }
            @if (form.controls.name.touched && form.controls.name.hasError('maxlength')) {
              <p class="field-error">Use 120 characters or fewer.</p>
            }
          </div>

          @if (errorMessage) {
            <p class="form-error" role="alert">{{ errorMessage }}</p>
          }

          <div class="form-actions">
            <a class="btn btn-secondary" routerLink="/companies">Cancel</a>
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid || submitting">
              {{ submitting ? 'Creating…' : 'Create company' }}
            </button>
          </div>
        </form>
      </div>
    </app-shell>
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
      this.form.markAllAsTouched();
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
