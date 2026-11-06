import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="cancel.emit()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-icon" [ngClass]="'icon-' + type">
          <span>{{ type === 'danger' ? '⚠️' : '❓' }}</span>
        </div>
        <div class="modal-body">
          <h4 class="modal-title">{{ title }}</h4>
          <p class="modal-message">{{ message }}</p>
        </div>
        <div class="modal-actions">
          <button (click)="cancel.emit()" class="btn btn-secondary btn-sm">
            Cancel
          </button>
          <button
            (click)="confirm.emit()"
            class="btn btn-sm"
            [ngClass]="type === 'danger' ? 'btn-danger' : 'btn-primary'"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(2px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-card {
      background: #ffffff;
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      max-width: 420px;
      width: 100%;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes scaleUp {
      from { transform: scale(0.95); }
      to { transform: scale(1); }
    }
    .modal-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      background: var(--color-surface-subtle);

      &.icon-danger { background: #fee2e2; }
      &.icon-info { background: #e0f2fe; }
    }
    .modal-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-dark-text);
      margin-bottom: 0.35rem;
    }
    .modal-message {
      font-size: 0.88rem;
      color: var(--color-text-secondary);
      line-height: 1.45;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
  `]
})
export class ConfirmationDialogComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() confirmLabel: string = 'Confirm Action';
  @Input() type: 'danger' | 'info' = 'danger';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
