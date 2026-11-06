import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [class]="'theme-' + theme">
      <div class="stat-main">
        <div class="stat-meta">
          <span class="stat-label">{{ label }}</span>
          <div class="stat-value-row">
            <span class="stat-value">{{ value }}</span>
            @if (unit) {
              <span class="stat-unit">{{ unit }}</span>
            }
          </div>
        </div>
        <div class="stat-icon-box" [ngClass]="'icon-' + theme">
          <span>{{ icon }}</span>
        </div>
      </div>

      <div class="stat-footer">
        @if (trend) {
          <span class="trend-pill" [class.trend-up]="trend.direction === 'up'" [class.trend-down]="trend.direction === 'down'">
            <span class="trend-arrow">{{ trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '•' }}</span>
            <span>{{ trend.value }}</span>
          </span>
        }
        <span class="stat-subtext">{{ subtext }}</span>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      position: relative;
      overflow: hidden;
      transition: all var(--transition-fast);

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: #cbd5e1;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--color-forest);
      }
      &.theme-emerald::before { background: var(--color-emerald); }
      &.theme-warning::before { background: var(--color-warning); }
      &.theme-info::before { background: var(--color-info); }
    }

    .stat-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .stat-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .stat-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--color-neutral-grey);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .stat-value-row {
      display: flex;
      align-items: baseline;
      gap: 0.35rem;
    }

    .stat-value {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--color-dark-text);
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .stat-unit {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--color-neutral-grey);
    }

    .stat-icon-box {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      flex-shrink: 0;
      background: var(--color-light-sage);
      color: var(--color-forest);
      border: 1px solid var(--color-sage-border);

      &.icon-emerald { background: #e6f7ef; color: var(--color-emerald); }
      &.icon-warning { background: #fef3c7; color: #b45309; }
      &.icon-info { background: #e0f2fe; color: #0369a1; }
    }

    .stat-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      padding-top: 0.4rem;
      border-top: 1px solid var(--color-border-subtle);
    }

    .trend-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-sm);
      font-size: 0.72rem;
      font-weight: 700;
      background: var(--color-surface-subtle);
      color: var(--color-neutral-grey);

      &.trend-up {
        background: var(--color-success-bg);
        color: var(--color-success);
      }
      &.trend-down {
        background: var(--color-danger-bg);
        color: var(--color-danger);
      }
    }

    .trend-arrow {
      font-weight: 800;
    }

    .stat-subtext {
      color: var(--color-neutral-grey);
      font-size: 0.78rem;
    }
  `]
})
export class StatCardComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) value!: string | number;
  @Input() unit?: string;
  @Input() subtext: string = '';
  @Input() icon: string = '🌱';
  @Input() theme: 'forest' | 'emerald' | 'warning' | 'info' = 'forest';
  @Input() trend?: { direction: 'up' | 'down' | 'neutral'; value: string };
}
