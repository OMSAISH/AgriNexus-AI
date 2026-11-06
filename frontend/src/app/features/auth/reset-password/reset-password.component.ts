import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page-container">
      <div class="auth-card">
        <div class="auth-brand-header">
          <div class="brand-avatar">🔑</div>
          <h2>Set New Password</h2>
          <p>Please enter your new secure password below (minimum 8 characters).</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              formControlName="newPassword"
              placeholder="••••••••••••"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('newPassword')"
            />
            @if (isFieldInvalid('newPassword')) {
              <span class="field-error">Password must be at least 8 characters.</span>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              placeholder="••••••••••••"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('confirmPassword')"
            />
            @if (resetForm.hasError('mismatch') && resetForm.get('confirmPassword')?.touched) {
              <span class="field-error">Passwords do not match.</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="resetForm.invalid || isLoading()"
          >
            @if (isLoading()) {
              <span>Updating Password...</span>
            } @else {
              <span>Update Password &amp; Sign In</span>
            }
          </button>
        </form>

        <div class="auth-footer-links">
          <a routerLink="/auth/login">← Return to Sign In</a>
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
      line-height: 1.5;
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
    .auth-footer-links {
      text-align: center;
      margin-top: 1.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-border);
      font-size: 0.85rem;
      font-weight: 600;
    }
  `]
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  public readonly isLoading = signal(false);

  resetForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  isFieldInvalid(name: string): boolean {
    const f = this.resetForm.get(name);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.toast.success('Password Updated', 'Your account credentials have been reset successfully.');
      this.router.navigate(['/auth/login']);
    }, 800);
  }
}
