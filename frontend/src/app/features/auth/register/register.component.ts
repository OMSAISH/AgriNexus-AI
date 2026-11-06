import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-icon">🌱</div>
          <h2>Create AgriNexus Account</h2>
          <p>Register as a Farmer, Extension Agronomist, or Operator</p>
        </div>

        @if (errorMessage()) {
          <div class="alert-box alert-error">
            <span>⚠️</span>
            <p>{{ errorMessage() }}</p>
          </div>
        }

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              formControlName="full_name"
              placeholder="e.g. Ramesh Baburao Patil"
              class="form-input"
              [class.is-invalid]="isFieldInvalid('full_name')"
            />
            @if (isFieldInvalid('full_name')) {
              <span class="field-error">Full name is required (min 2 characters).</span>
            }
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="e.g. ramesh.patil@agrinexus.ai"
              class="form-input"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <span class="field-error">Valid email address is required.</span>
            }
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label for="phoneNumber">Mobile Number</label>
              <input
                id="phoneNumber"
                type="tel"
                formControlName="phone_number"
                placeholder="+91-98765-43210"
                class="form-input"
              />
            </div>

            <div class="form-group flex-1">
              <label for="role">User Role</label>
              <select id="role" formControlName="role" class="form-input">
                <option value="FARMER">Farmer (Producer)</option>
                <option value="AGRONOMIST">Extension Agronomist</option>
                <option value="CHC_OPERATOR">CHC Machine Operator</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="At least 8 characters"
              class="form-input"
              [class.is-invalid]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <span class="field-error">Password must be at least 8 characters.</span>
            }
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="registerForm.invalid || isLoading()"
          >
            @if (isLoading()) {
              <span class="spinner"></span>
              <span>Registering Profile...</span>
            } @else {
              <span>Complete Registration</span>
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already registered? <a routerLink="/auth/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      background: linear-gradient(135deg, #f0fdf4 0%, #f8f9fa 100%);
    }
    .auth-card {
      background: #ffffff;
      border: 1px solid var(--color-surface-border);
      border-radius: var(--radius-lg);
      padding: 2.25rem;
      width: 100%;
      max-width: 480px;
      box-shadow: var(--shadow-lg);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 1.75rem;
    }
    .auth-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .auth-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-forest-900);
      margin-bottom: 0.25rem;
    }
    .auth-header p {
      font-size: 0.88rem;
      color: var(--color-text-muted);
    }
    .alert-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
      &.alert-error {
        background: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
      }
    }
    .form-group {
      margin-bottom: 1.15rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .flex-1 { flex: 1; }
    label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      margin-bottom: 0.35rem;
    }
    .form-input {
      width: 100%;
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--color-surface-border);
      border-radius: var(--radius-sm);
      font-size: 0.92rem;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      font-family: inherit;
      background: #ffffff;
      &:focus {
        outline: none;
        border-color: var(--color-emerald-600);
        box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.15);
      }
      &.is-invalid {
        border-color: #dc2626;
      }
    }
    .field-error {
      display: block;
      font-size: 0.75rem;
      color: #dc2626;
      margin-top: 0.25rem;
    }
    .btn-block {
      width: 100%;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.82rem;
      color: var(--color-text-secondary);
    }
  `]
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  public readonly isLoading = signal(false);
  public readonly errorMessage = signal<string | null>(null);

  public readonly registerForm: FormGroup = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone_number: ['+91-'],
    role: ['FARMER', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const values = this.registerForm.getRawValue();
    this.auth.register({
      full_name: values.full_name,
      email: values.email,
      phone_number: values.phone_number,
      role: values.role,
      password: values.password
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: { message?: string }) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Registration failed.');
      }
    });
  }
}
