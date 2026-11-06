import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page-container">
      <div class="auth-card">
        <div class="auth-brand-header">
          <div class="brand-avatar">🌱</div>
          <h2>Password Recovery</h2>
          <p>Enter your registered farmer or operator email to receive a secure password reset link.</p>
        </div>

        @if (isSubmitted()) {
          <div class="success-state">
            <div class="success-icon">✉️</div>
            <h4>Reset Instructions Sent!</h4>
            <p>If an account exists for <strong>{{ resetEmail() }}</strong>, instructions to reset your password have been dispatched.</p>
            <a routerLink="/auth/login" class="btn btn-primary btn-block mt-3">Return to Sign In</a>
          </div>
        } @else {
          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="auth-form">
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
                <span class="field-error">Please provide a valid registered email address.</span>
              }
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-block"
              [disabled]="forgotForm.invalid || isLoading()"
            >
              @if (isLoading()) {
                <span>Sending Reset Link...</span>
              } @else {
                <span>Send Password Reset Instructions</span>
              }
            </button>
          </form>

          <div class="auth-footer-links">
            <a routerLink="/auth/login">← Back to Sign In</a>
            <a routerLink="/auth/register">Create Account</a>
          </div>
        }
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
      display: flex;
      justify-content: space-between;
      margin-top: 1.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-border);
      font-size: 0.85rem;
      font-weight: 600;
    }
    .success-state {
      text-align: center;
      padding: 1rem 0;
    }
    .success-icon {
      font-size: 3rem;
      margin-bottom: 0.75rem;
    }
    .mt-3 {
      margin-top: 1.5rem;
    }
  `]
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  public readonly isLoading = signal(false);
  public readonly isSubmitted = signal(false);
  public readonly resetEmail = signal('');

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isFieldInvalid(name: string): boolean {
    const f = this.forgotForm.get(name);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.isLoading.set(true);
    const email = this.forgotForm.value.email;

    setTimeout(() => {
      this.isLoading.set(false);
      this.resetEmail.set(email);
      this.isSubmitted.set(true);
      this.toast.success('Reset Email Sent', `Password reset token dispatched to ${email}`);
    }, 800);
  }
}
