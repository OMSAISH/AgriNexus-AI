import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state-card">
      <div class="empty-icon-wrap">
        <span class="empty-icon">{{ icon }}</span>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-description">{{ description }}</p>

      @if (actionLabel) {
        <button (click)="actionClicked.emit()" class="btn btn-primary btn-sm">
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state-card {
      background: var(--color-surface-card);
      border: 1px dashed var(--color-border);
      border-radius: var(--radius-lg);
      padding: 3.5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      max-width: 480px;
      margin: 1.5rem auto;
    }
    .empty-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--color-light-sage);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
      border: 1px solid var(--color-sage-border);
    }
    .empty-icon {
      font-size: 2rem;
    }
    .empty-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--color-dark-text);
    }
    .empty-description {
      font-size: 0.88rem;
      color: var(--color-neutral-grey);
      line-height: 1.5;
      max-width: 380px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = '🌾';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() actionLabel?: string;
  @Output() actionClicked = new EventEmitter<void>();
}
