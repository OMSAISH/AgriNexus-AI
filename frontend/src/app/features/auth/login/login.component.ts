import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page-container">
      <div class="auth-card">
        <div class="auth-brand-header">
          <div class="brand-avatar">🌱</div>
          <h2>Farmer &amp; Operator Login</h2>
          <p>Access the AgriNexus AI Farm Operations Platform</p>
        </div>

        @if (errorMessage()) {
          <div class="alert-box alert-error">
            <span>⚠️</span>
            <p>{{ errorMessage() }}</p>
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Account Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="e.g. farmer.rahata@agrinexus.ai"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <span class="field-error">Please enter a valid email address.</span>
            }
          </div>

          <div class="form-group">
            <div class="password-label-row">
              <label for="password">Password</label>
              <a routerLink="/auth/forgot-password" class="forgot-link">Forgot password?</a>
            </div>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••••••"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <span class="field-error">Password is required.</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="loginForm.invalid || isLoading()"
          >
            @if (isLoading()) {
              <span>Authenticating...</span>
            } @else {
              <span>Sign In to AgriNexus</span>
            }
          </button>
        </form>

        <!-- Quick Fill for Demonstration -->
        <div class="demo-prefill">
          <p class="prefill-title">HCL Project Demo Credentials:</p>
          <button type="button" (click)="fillCaseStudyCredentials()" class="btn btn-secondary btn-sm btn-block">
            🌱 Auto-fill Rahata Farmer Account
          </button>
        </div>

        <div class="auth-footer-links">
          <p>Don't have an account? <a routerLink="/auth/register">Create farmer profile</a></p>
          <p><a routerLink="/system-status">Check backend system status</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page-container {
      min-height: calc(100vh - 140px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      background: linear-gradient(135deg, #E8F2EA 0%, #FAFBF8 100%);
    }
    .auth-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      max-width: 440px;
      width: 100%;
      box-shadow: var(--shadow-lg);
    }
    .auth-brand-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .brand-avatar {
      width: 52px;
      height: 52px;
      background: #174C38;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      margin: 0 auto 1rem;
      color: #ffffff;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #174C38;
      margin-bottom: 0.35rem;
    }
    p {
      font-size: 0.88rem;
      color: var(--color-neutral-grey);
    }
    .alert-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
      &.alert-error {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
      }
    }
    .password-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }
    .forgot-link {
      font-size: 0.78rem;
      color: #16845B;
      font-weight: 600;
      &:hover { text-decoration: underline; }
    }
    .field-error {
      font-size: 0.75rem;
      color: var(--color-danger);
      margin-top: 0.25rem;
      display: block;
    }
    .btn-block {
      width: 100%;
    }
    .demo-prefill {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-border);
      text-align: center;
    }
    .prefill-title {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--color-neutral-grey);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    .auth-footer-links {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--color-neutral-grey);
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  fillCaseStudyCredentials(): void {
    this.loginForm.patchValue({
      email: 'farmer.rahata@agrinexus.ai',
      password: 'Farmer@Rahata2026',
    });
    this.toast.info('Auto-Filled', 'Pre-loaded verified credentials for Dnyaneshwar Shinde.');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const values = this.loginForm.getRawValue();
    this.auth.login({ email: values.email, password: values.password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toast.success('Welcome Back', `Authenticated as ${res.user.full_name}`);
        this.router.navigate(['/dashboard']);
      },
      error: (err: { message?: string }) => {
        this.isLoading.set(false);
        const msg = err.message || 'Invalid email or password.';
        this.errorMessage.set(msg);
        this.toast.error('Authentication Failed', msg);
      }
    });
  }
}
