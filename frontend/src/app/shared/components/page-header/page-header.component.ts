import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header">
      <div class="header-main">
        @if (breadcrumbs && breadcrumbs.length > 0) {
          <nav class="breadcrumb-nav" aria-label="Breadcrumb">
            <ol class="breadcrumb-list">
              @for (item of breadcrumbs; track item.label; let last = $last) {
                <li class="breadcrumb-item" [class.active]="last">
                  @if (item.url && !last) {
                    <a [routerLink]="item.url">{{ item.label }}</a>
                    <span class="separator">/</span>
                  } @else {
                    <span>{{ item.label }}</span>
                  }
                </li>
              }
            </ol>
          </nav>
        }

        <div class="title-row">
          <div class="title-with-badge">
            <h1 class="page-title">{{ title }}</h1>
            @if (badge) {
              <span class="agri-badge" [ngClass]="'badge-' + (badgeTheme || 'success')">
                {{ badge }}
              </span>
            }
          </div>
          @if (subtitle) {
            <p class="page-subtitle">{{ subtitle }}</p>
          }
        </div>
      </div>

      <div class="header-actions">
        <ng-content select="[header-actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-end;
      gap: 1.25rem;
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--color-border);
    }
    .header-main {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .breadcrumb-nav {
      font-size: 0.75rem;
      color: var(--color-neutral-grey);
    }
    .breadcrumb-list {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      list-style: none;
    }
    .breadcrumb-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      a {
        color: var(--color-neutral-grey);
        &:hover { color: var(--color-forest); }
      }
      &.active {
        color: var(--color-dark-text);
        font-weight: 600;
      }
    }
    .separator {
      color: #cbd5e1;
    }
    .title-row {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .title-with-badge {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .page-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--color-forest-dark);
      letter-spacing: -0.025em;
      line-height: 1.2;
    }
    .page-subtitle {
      font-size: 0.88rem;
      color: var(--color-text-secondary);
      line-height: 1.4;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
  `]
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() badge?: string;
  @Input() badgeTheme?: 'forest' | 'success' | 'warning' | 'info' | 'neutral';
  @Input() breadcrumbs?: BreadcrumbItem[];
}
