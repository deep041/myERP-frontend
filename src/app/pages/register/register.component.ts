import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { IconComponent } from '../../layout/icon.component';
import { ThemeToggleComponent } from '../../layout/theme-toggle.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, IconComponent, ThemeToggleComponent],
  template: `
    <div class="auth">
      <aside class="auth-aside">
        <a class="brand" routerLink="/login">
          <span class="mark" aria-hidden="true">E</span>
          <span class="brand-name">ERP</span>
        </a>
        <div class="auth-copy">
          <h2>Create your account, then add a company.</h2>
          <p>You can belong to more than one company. Each company keeps its own workspace.</p>
        </div>
      </aside>
      <main id="main" class="auth-main">
        <div class="auth-toolbar">
          <app-theme-toggle />
        </div>
        <form class="auth-form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <h1>Create account</h1>
          <p class="lede">Use your name, email, and a password of at least 8 characters.</p>

          <div class="field" [class.is-invalid]="form.controls.name.touched && form.controls.name.invalid">
            <label for="register-name">Name</label>
            <input id="register-name" type="text" formControlName="name" autocomplete="name" />
            @if (form.controls.name.touched && form.controls.name.hasError('required')) {
              <p class="field-error">Enter your name.</p>
            }
          </div>

          <div class="field" [class.is-invalid]="form.controls.email.touched && form.controls.email.invalid">
            <label for="register-email">Email</label>
            <input id="register-email" type="email" formControlName="email" autocomplete="email" spellcheck="false" />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <p class="field-error">Enter a valid email address.</p>
            }
          </div>

          <div class="field" [class.is-invalid]="form.controls.password.touched && form.controls.password.invalid">
            <label for="register-password">Password</label>
            <div class="password-field">
              <input
                id="register-password"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="new-password"
                aria-describedby="password-hint"
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
            <p class="field-hint" id="password-hint">At least 8 characters.</p>
            @if (form.controls.password.touched && form.controls.password.hasError('minlength')) {
              <p class="field-error">Use at least 8 characters.</p>
            }
          </div>

          <div class="field" [class.is-invalid]="form.touched && form.hasError('passwordMismatch')">
            <label for="register-confirm">Confirm password</label>
            <div class="password-field">
              <input
                id="register-confirm"
                [type]="showConfirm() ? 'text' : 'password'"
                formControlName="confirmPassword"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="icon-btn field-toggle"
                (click)="showConfirm.set(!showConfirm())"
                [attr.aria-pressed]="showConfirm()"
                [attr.aria-label]="showConfirm() ? 'Hide password confirmation' : 'Show password confirmation'"
              >
                <app-icon [name]="showConfirm() ? 'eye-off' : 'eye'" />
              </button>
            </div>
            @if (form.touched && form.hasError('passwordMismatch')) {
              <p class="field-error">Passwords do not match.</p>
            }
          </div>

          @if (errorMessage) {
            <p class="form-error" role="alert">{{ errorMessage }}</p>
          }

          <button class="btn btn-primary" type="submit" [disabled]="form.invalid || submitting">
            {{ submitting ? 'Creating account…' : 'Create account' }}
          </button>
          <p class="auth-switch">Already have an account? <a routerLink="/login">Sign in</a></p>
        </form>
      </main>
    </div>
  `,
})
export class RegisterComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  submitting = false;
  errorMessage = '';
  readonly showPassword = signal(false);
  readonly showConfirm = signal(false);

  readonly form = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [passwordsMatch] },
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.errorMessage = '';
    const { name, email, password } = this.form.getRawValue();
    this.auth.register({ name, email, password }).subscribe({
      next: () => {
        void this.router.navigateByUrl('/companies');
      },
      error: (error: { error?: { error?: { message?: string } } }) => {
        this.submitting = false;
        this.errorMessage = error.error?.error?.message ?? 'Unable to create the account';
      },
    });
  }
}

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
