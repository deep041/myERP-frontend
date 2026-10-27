import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { IconComponent } from '../../layout/icon.component';
import { ThemeToggleComponent } from '../../layout/theme-toggle.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, IconComponent, ThemeToggleComponent],
  template: `
    <div class="auth">
      <aside class="auth-aside">
        <a class="brand" routerLink="/login">
          <span class="mark" aria-hidden="true">E</span>
          <span class="brand-name">ERP</span>
        </a>
        <div class="auth-copy">
          <h2>One workspace for every company you run.</h2>
          <p>Sign in to open the companies you belong to and continue where you left off.</p>
        </div>
      </aside>
      <main id="main" class="auth-main">
        <div class="auth-toolbar">
          <app-theme-toggle />
        </div>
        <form class="auth-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <h1>Sign in</h1>
          <p class="lede">Use the email and password for your account.</p>

          <div class="field" [class.is-invalid]="form.controls.email.touched && form.controls.email.invalid">
            <label for="login-email">Email</label>
            <input id="login-email" type="email" formControlName="email" autocomplete="email" spellcheck="false" />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <p class="field-error" id="login-email-error">Enter a valid email address.</p>
            }
          </div>

          <div class="field" [class.is-invalid]="form.controls.password.touched && form.controls.password.invalid">
            <label for="login-password">Password</label>
            <div class="password-field">
              <input
                id="login-password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="icon-btn field-toggle"
                (click)="showPassword.set(!showPassword())"
                [attr.aria-pressed]="showPassword()"
                [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
              >
                <app-icon [name]="showPassword() ? 'eye-off' : 'eye'" />
              </button>
            </div>
          </div>

          @if (errorMessage) {
            <p class="form-error" role="alert">{{ errorMessage }}</p>
          }

          <button class="btn btn-primary" type="submit" [disabled]="form.invalid || submitting">
            {{ submitting ? 'Signing in…' : 'Sign in' }}
          </button>
          <p class="auth-switch">New here? <a routerLink="/register">Create an account</a></p>
        </form>
      </main>
    </div>
  `,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  submitting = false;
  errorMessage = '';
  readonly showPassword = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
