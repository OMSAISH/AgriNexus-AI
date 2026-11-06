import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface FarmNotification {
  id: string;
  type: 'urgent' | 'weather' | 'crop' | 'market';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="notification-panel">
      <div class="panel-header">
        <div class="header-left">
          <h4>Farm Notifications</h4>
          <span class="unread-pill">{{ unreadCount }} New</span>
        </div>
        <button (click)="markAllAsRead.emit()" class="mark-read-btn">Mark All Read</button>
      </div>

      <div class="notifications-list">
        @if (notifications.length === 0) {
          <div class="empty-notifications">
            <span>🔔</span>
            <p>No active alerts right now.</p>
          </div>
        } @else {
          @for (item of notifications; track item.id) {
            <div class="notification-item" [class.unread]="!item.read">
              <div class="item-icon-box" [ngClass]="'icon-' + item.type">
                @switch (item.type) {
                  @case ('urgent') { <span>🚨</span> }
                  @case ('weather') { <span>🌧️</span> }
                  @case ('crop') { <span>🌱</span> }
                  @case ('market') { <span>📈</span> }
                }
              </div>
              <div class="item-content">
                <div class="item-title-row">
                  <span class="item-title">{{ item.title }}</span>
                  <span class="item-time">{{ item.time }}</span>
                </div>
                <p class="item-msg">{{ item.message }}</p>
              </div>
            </div>
          }
        }
      </div>

      <div class="panel-footer">
        <a routerLink="/notifications" (click)="close.emit()" class="view-all-link">
          Open Notification Center →
        </a>
      </div>
    </div>
  `,
  styles: [`
    .notification-panel {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 360px;
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-dropdown);
      z-index: 1000;
      overflow: hidden;
      animation: dropDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes dropDown {
      from { transform: translateY(-8px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .panel-header {
      padding: var(--space-4) var(--space-5);
      background: var(--color-warm-white);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--color-dark-text);
      }
    }
    .unread-pill {
      font-size: 0.7rem;
      font-weight: 700;
      background: var(--color-forest);
      color: #ffffff;
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-full);
    }
    .mark-read-btn {
      background: none;
      border: none;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-emerald);
      cursor: pointer;
      &:hover { text-decoration: underline; }
    }
    .notifications-list {
      max-height: 340px;
      overflow-y: auto;
    }
    .notification-item {
      padding: 0.85rem var(--space-5);
      border-bottom: 1px solid var(--color-border-subtle);
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      transition: background var(--transition-fast);

      &:hover {
        background: var(--color-warm-white);
      }
      &.unread {
        background: #f0fdf4;
      }
      &:last-child {
        border-bottom: none;
      }
    }
    .item-icon-box {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
      background: var(--color-surface-subtle);

      &.icon-urgent { background: #fee2e2; }
      &.icon-weather { background: #e0f2fe; }
      &.icon-crop { background: #d8f3dc; }
      &.icon-market { background: #fef3c7; }
    }
    .item-content {
      flex: 1;
    }
    .item-title-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 0.2rem;
    }
    .item-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--color-dark-text);
    }
    .item-time {
      font-size: 0.7rem;
      color: var(--color-neutral-grey);
    }
    .item-msg {
      font-size: 0.78rem;
      color: var(--color-text-secondary);
      line-height: 1.35;
    }
    .empty-notifications {
      padding: 2.5rem;
      text-align: center;
      color: var(--color-neutral-grey);
      font-size: 0.85rem;
      span { font-size: 1.75rem; display: block; margin-bottom: 0.35rem; }
    }
    .panel-footer {
      padding: var(--space-3) var(--space-5);
      background: var(--color-warm-white);
      border-top: 1px solid var(--color-border);
      text-align: center;
    }
    .view-all-link {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-forest);
      &:hover { color: var(--color-emerald); }
    }
  `]
})
export class NotificationPanelComponent {
  @Input() notifications: FarmNotification[] = [
    {
      id: '1',
      type: 'urgent',
      title: 'Purple Blotch Warning (Plot 1)',
      message: 'High humidity in Rahata triggers Alternaria risk for Rabi Onion.',
      time: '15m ago',
      read: false
    },
    {
      id: '2',
      type: 'market',
      title: 'Rahata APMC Onion Spike',
      message: 'Modal rate touched ₹2,450/quintal (up ₹220 today).',
      time: '1h ago',
      read: false
    },
    {
      id: '3',
      type: 'weather',
      title: 'Spray Window Favourable',
      message: 'Wind speed 8 km/h optimal for foliar nutrient spray.',
      time: '3h ago',
      read: true
    }
  ];

  @Output() markAllAsRead = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}
