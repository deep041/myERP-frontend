import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <main class="auth-screen">
      <form class="card" [formGroup]="form" (ngSubmit)="submit()">
        <h1>Sign in</h1>
        <p class="lede">Use your account to open your companies.</p>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" autocomplete="email" />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" type="password" formControlName="password" autocomplete="current-password" />
        </div>
        @if (errorMessage) {
          <p class="form-error">{{ errorMessage }}</p>
        }
        <div class="actions">
          <button type="submit" [disabled]="form.invalid || submitting">Sign in</button>
          <a routerLink="/register">Create an account</a>
        </div>
      </form>
    </main>
  `,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  submitting = false;
  errorMessage = '';

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitting = true;
    this.errorMessage = '';
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        void this.router.navigateByUrl('/companies');
      },
      error: (error: { error?: { error?: { message?: string } } }) => {
        this.submitting = false;
        this.errorMessage = error.error?.error?.message ?? 'Unable to sign in';
      },
    });
  }
}
