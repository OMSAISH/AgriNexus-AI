import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-card" [ngClass]="'toast-' + toast.type">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') { <span>✓</span> }
              @case ('error') { <span>✕</span> }
              @case ('warning') { <span>⚠️</span> }
              @case ('info') { <span>ℹ️</span> }
            }
          </div>
          <div class="toast-content">
            <h5 class="toast-title">{{ toast.title }}</h5>
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button (click)="toastService.dismiss(toast.id)" class="toast-close" title="Dismiss">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      width: 100%;
      pointer-events: none;
    }
    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.9rem 1.1rem;
      background: #ffffff;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--color-border);
      border-left: 5px solid;
      animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .toast-success {
      border-left-color: var(--color-success);
      .toast-icon { background: var(--color-success-bg); color: var(--color-success); }
    }
    .toast-error {
      border-left-color: var(--color-danger);
      .toast-icon { background: var(--color-danger-bg); color: var(--color-danger); }
    }
    .toast-warning {
      border-left-color: var(--color-warning);
      .toast-icon { background: var(--color-warning-bg); color: var(--color-warning); }
    }
    .toast-info {
      border-left-color: var(--color-info);
      .toast-icon { background: var(--color-info-bg); color: var(--color-info); }
    }
    .toast-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }
    .toast-content {
      flex: 1;
    }
    .toast-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--color-dark-text);
      margin-bottom: 0.15rem;
    }
    .toast-message {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      line-height: 1.35;
    }
    .toast-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      line-height: 1;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 0 0.25rem;
      &:hover { color: var(--color-dark-text); }
    }
  `]
})
export class ToastNotificationComponent {
  public readonly toastService = inject(ToastService);
}
