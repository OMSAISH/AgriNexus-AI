import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../core/services/toast.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationItem } from '../../core/models/agrinexus.models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Farm Notification Center &amp; Alert Telemetry"
        subtitle="Operational alarms, pest risk advisories, microclimate shifts, and market opportunities"
        badge="PostgreSQL Synced"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'System' }, { label: 'Notifications' }]"
      >
        <div header-actions>
          <button (click)="loadNotifications()" class="btn btn-secondary btn-sm" [disabled]="isLoading()">
            {{ isLoading() ? 'Fetching...' : '🔄 Refresh' }}
          </button>
          <button (click)="markAllRead()" class="btn btn-primary btn-sm">Mark All Read</button>
        </div>
      </app-page-header>

      <!-- Category Filter Pills -->
      <div class="filter-pills-row">
        <button
          (click)="filterCategory.set('ALL')"
          class="filter-pill"
          [class.active]="filterCategory() === 'ALL'"
        >
          All Notifications ({{ notifications().length }})
        </button>
        <button
          (click)="filterCategory.set('ALERT')"
          class="filter-pill"
          [class.active]="filterCategory() === 'ALERT'"
        >
          🚨 Critical Alarms
        </button>
        <button
          (click)="filterCategory.set('ADVISORY')"
          class="filter-pill"
          [class.active]="filterCategory() === 'ADVISORY'"
        >
          📈 Market Advisories
        </button>
        <button
          (click)="filterCategory.set('INFO')"
          class="filter-pill"
          [class.active]="filterCategory() === 'INFO'"
        >
          ℹ️ Operational Info
        </button>
      </div>

      <!-- Notifications List -->
      <div class="notifications-feed">
        @for (item of filteredNotifications; track item.id) {
          <div class="agri-card notif-card" [class.unread]="!item.is_read">
            <div class="notif-icon-col">
              @switch (item.notification_type) {
                @case ('ALERT') { <span class="ico urgent">🚨</span> }
                @case ('ADVISORY') { <span class="ico market">📈</span> }
                @default { <span class="ico crop">🌱</span> }
              }
            </div>

            <div class="notif-body">
              <div class="notif-top">
                <div class="notif-title-wrap">
                  <h4>{{ item.title }}</h4>
                  <span class="agri-badge badge-neutral">{{ item.notification_type }}</span>
                </div>
                <span class="notif-time">{{ item.created_at | date:'medium' }}</span>
              </div>
              <p class="notif-text">{{ item.message }}</p>
            </div>

            <div class="notif-actions">
              @if (!item.is_read) {
                <button (click)="markAsRead(item)" class="btn btn-secondary btn-sm">Mark Read</button>
              }
              <button (click)="dismiss(item.id)" class="btn-dismiss" title="Dismiss">✕</button>
            </div>
          </div>
        } @empty {
          <div class="agri-card empty-notifs">
            <p>No active notifications at this time.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .filter-pills-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .filter-pill {
      padding: 0.45rem 0.95rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background: var(--color-surface-card);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-dark-text);
      cursor: pointer;
      font-family: inherit;
      transition: all var(--transition-fast);
      &.active {
        background: #174C38;
        color: #ffffff;
        border-color: #174C38;
      }
    }
    .notifications-feed { display: flex; flex-direction: column; gap: 1rem; }
    .notif-card {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      padding: 1.25rem;
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      &.unread {
        border-left: 4px solid #16845B;
        background: #F4F9F6;
      }
    }
    .empty-notifs {
      padding: 2.5rem;
      text-align: center;
      color: var(--color-neutral-grey);
    }
    .ico {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      &.urgent { background: #FEE2E2; }
      &.crop { background: #E8F7F0; }
      &.weather { background: #E0F2FE; }
      &.market { background: #FEF3C7; }
    }
    .notif-body { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .notif-top { display: flex; justify-content: space-between; align-items: baseline; }
    .notif-title-wrap { display: flex; align-items: center; gap: 0.65rem; }
    .notif-title-wrap h4 { font-size: 1rem; font-weight: 800; color: #174C38; }
    .notif-time { font-size: 0.75rem; color: var(--color-neutral-grey); }
    .notif-text { font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.5; }
    .notif-actions { display: flex; align-items: center; gap: 0.5rem; }
    .btn-dismiss {
      background: none;
      border: none;
      font-size: 1rem;
      color: var(--color-neutral-grey);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      &:hover { color: var(--color-dark-text); }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  private readonly notifService = inject(NotificationService);
  private readonly toast = inject(ToastService);

  public readonly isLoading = signal(false);
  public readonly filterCategory = signal<string>('ALL');
  public readonly notifications = signal<NotificationItem[]>([]);

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading.set(true);
    this.notifService.getNotifications().subscribe({
      next: (notifs) => {
        this.isLoading.set(false);
        this.notifications.set(notifs);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.warn('Error loading notifications:', err);
      }
    });
  }

  get filteredNotifications(): NotificationItem[] {
    const cat = this.filterCategory();
    if (cat === 'ALL') return this.notifications();
    return this.notifications().filter(n => n.notification_type === cat);
  }

  markAsRead(item: NotificationItem): void {
    this.notifService.markAsRead(item.id).subscribe({
      next: (updated) => {
        this.notifications.update(list => list.map(n => n.id === updated.id ? { ...n, is_read: true } : n));
        this.toast.info('Notification Updated', 'Marked as read in database.');
      },
      error: (err) => {
        item.is_read = true;
        this.toast.info('Notification Updated', 'Marked as read.');
      }
    });
  }

  markAllRead(): void {
    this.notifications().forEach(n => {
      if (!n.is_read) {
        this.notifService.markAsRead(n.id).subscribe();
      }
    });
    this.notifications.update(list => list.map(n => ({ ...n, is_read: true })));
    this.toast.success('Alerts Cleared', 'All notifications marked as read.');
  }

  dismiss(id: string): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
    this.toast.info('Dismissed', 'Notification dismissed.');
  }
}
