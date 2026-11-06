import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  badgeType?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="table-container">
      @if (searchable || hasActions) {
        <div class="table-toolbar">
          @if (searchable) {
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange($event)"
                placeholder="Filter table records..."
                class="search-input"
              />
              @if (searchQuery) {
                <button (click)="clearSearch()" class="clear-btn">✕</button>
              }
            </div>
          }
          <div class="table-actions">
            <ng-content select="[table-actions]"></ng-content>
          </div>
        </div>
      }

      <div class="table-responsive">
        <table class="agri-table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th [style.text-align]="col.align || 'left'">
                  {{ col.label }}
                </th>
              }
              @if (hasRowActions) {
                <th style="text-align: right;">Actions</th>
              }
            </tr>
          </thead>
          <tbody>
            @if (filteredData.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length + (hasRowActions ? 1 : 0)" class="empty-cell">
                  <div class="empty-state-mini">
                    <span>🌱</span>
                    <p>No matching records found.</p>
                  </div>
                </td>
              </tr>
            } @else {
              @for (row of filteredData; track $index) {
                <tr>
                  @for (col of columns; track col.key) {
                    <td [style.text-align]="col.align || 'left'">
                      @if (col.badgeType) {
                        <span class="agri-badge badge-neutral">{{ row[col.key] }}</span>
                      } @else {
                        {{ row[col.key] }}
                      }
                    </td>
                  }
                  @if (hasRowActions) {
                    <td style="text-align: right;">
                      <button (click)="actionClicked.emit(row)" class="btn btn-secondary btn-sm">
                        View
                      </button>
                    </td>
                  }
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <div class="table-footer">
        <span class="record-count">Showing {{ filteredData.length }} of {{ data.length }} entries</span>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .table-toolbar {
      padding: var(--space-4) var(--space-5);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-warm-white);
    }
    .search-box {
      display: flex;
      align-items: center;
      position: relative;
      max-width: 320px;
      width: 100%;
    }
    .search-icon {
      position: absolute;
      left: 0.75rem;
      font-size: 0.85rem;
      color: var(--color-neutral-grey);
    }
    .search-input {
      width: 100%;
      padding: 0.5rem 2rem 0.5rem 2.2rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-family: inherit;
      background: #ffffff;
      &:focus {
        outline: none;
        border-color: var(--color-emerald);
      }
    }
    .clear-btn {
      position: absolute;
      right: 0.6rem;
      background: none;
      border: none;
      font-size: 0.75rem;
      color: var(--color-neutral-grey);
      cursor: pointer;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .agri-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.88rem;

      th {
        background: #f8fafc;
        color: var(--color-neutral-grey);
        font-weight: 600;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.85rem var(--space-5);
        border-bottom: 1px solid var(--color-border);
        white-space: nowrap;
      }

      td {
        padding: 0.9rem var(--space-5);
        border-bottom: 1px solid var(--color-border-subtle);
        color: var(--color-dark-text);
        vertical-align: middle;
      }

      tbody tr:hover {
        background: var(--color-light-sage);
      }

      tbody tr:last-child td {
        border-bottom: none;
      }
    }
    .empty-cell {
      padding: 3rem !important;
      text-align: center;
    }
    .empty-state-mini {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--color-neutral-grey);
      font-size: 0.88rem;
      span { font-size: 1.5rem; }
    }
    .table-footer {
      padding: var(--space-3) var(--space-5);
      background: var(--color-warm-white);
      border-top: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.78rem;
      color: var(--color-neutral-grey);
    }
  `]
})
export class DataTableComponent {
  @Input({ required: true }) columns: TableColumn[] = [];
  @Input({ required: true }) data: Record<string, any>[] = [];
  @Input() searchable: boolean = true;
  @Input() hasActions: boolean = false;
  @Input() hasRowActions: boolean = false;

  @Output() actionClicked = new EventEmitter<any>();

  searchQuery: string = '';

  get filteredData(): Record<string, any>[] {
    if (!this.searchQuery.trim()) {
      return this.data;
    }
    const q = this.searchQuery.toLowerCase();
    return this.data.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(q)
      )
    );
  }

  onSearchChange(val: string): void {
    this.searchQuery = val;
  }

  clearSearch(): void {
    this.searchQuery = '';
  }
}
