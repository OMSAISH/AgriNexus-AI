import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-bar-wrapper">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        [(ngModel)]="query"
        (ngModelChange)="onSearchChange($event)"
        [placeholder]="placeholder"
        class="search-bar-input"
      />
      @if (query) {
        <button (click)="clear()" class="search-clear-btn" title="Clear search">✕</button>
      }
    </div>
  `,
  styles: [`
    .search-bar-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      max-width: 380px;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      font-size: 0.85rem;
      color: var(--color-neutral-grey);
      pointer-events: none;
    }
    .search-bar-input {
      width: 100%;
      padding: 0.55rem 2rem 0.55rem 2.4rem;
      font-family: inherit;
      font-size: 0.88rem;
      color: var(--color-dark-text);
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-xs);

      &:focus {
        outline: none;
        border-color: var(--color-emerald);
        box-shadow: 0 0 0 3px rgba(22, 132, 91, 0.12);
      }

      &::placeholder {
        color: var(--color-neutral-grey);
      }
    }
    .search-clear-btn {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      color: var(--color-neutral-grey);
      font-size: 0.8rem;
      cursor: pointer;
      padding: 0.2rem;
      &:hover { color: var(--color-dark-text); }
    }
  `]
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Search farm records, crops, alerts...';
  @Output() search = new EventEmitter<string>();

  query: string = '';

  onSearchChange(val: string): void {
    this.search.emit(val);
  }

  clear(): void {
    this.query = '';
    this.search.emit('');
  }
}
