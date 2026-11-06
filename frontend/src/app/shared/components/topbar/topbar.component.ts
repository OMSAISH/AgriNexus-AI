import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { NotificationPanelComponent, FarmNotification } from '../notification-panel/notification-panel.component';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SearchBarComponent,
    NotificationPanelComponent,
    ProfileMenuComponent
  ],
  template: `
    <header class="topbar">
      <!-- Left side: Mobile Toggle & Page Info -->
      <div class="topbar-left">
        <button (click)="toggleMobileSidebar.emit()" class="mobile-menu-btn" title="Open Navigation Menu">
          <span class="hamburger-icon">☰</span>
        </button>

        <div class="location-chip">
          <span class="loc-pin">📍</span>
          <span class="loc-text">Rahata, Ahilyanagar &bull; 5.0 Ac</span>
        </div>
      </div>

      <!-- Center: Universal Search -->
      <div class="topbar-center">
        <app-search-bar
          placeholder="Search farm plots, crops, sensors, APMC mandis..."
          (search)="onGlobalSearch($event)"
        ></app-search-bar>
      </div>

      <!-- Right side: Language, Notifications, User Profile -->
      <div class="topbar-right">
        <!-- Language Selector -->
        <div class="lang-selector-box">
          <select [value]="selectedLanguage()" (change)="onLanguageChange($event)" class="lang-select">
            <option value="en">English (EN)</option>
            <option value="mr">मराठी (MR)</option>
            <option value="hi">हिंदी (HI)</option>
          </select>
        </div>

        <!-- Notification Bell & Flyout -->
        <div class="notification-wrapper">
          <button
            type="button"
            (click)="toggleNotifications()"
            class="icon-btn"
            [class.active]="showNotifications()"
            title="View Alerts"
          >
            <span class="btn-icon">🔔</span>
            @if (unreadAlertsCount > 0) {
              <span class="badge-dot"></span>
            }
          </button>

          @if (showNotifications()) {
            <app-notification-panel
              [notifications]="notifications"
              (markAllAsRead)="onMarkAllRead()"
              (close)="showNotifications.set(false)"
            ></app-notification-panel>
          }
        </div>

        <!-- User Profile Pill & Flyout -->
        <div class="profile-wrapper">
          <button
            type="button"
            (click)="toggleProfile()"
            class="profile-btn"
            [class.active]="showProfile()"
          >
            <div class="avatar-chip">
              {{ userInitials }}
            </div>
            <div class="user-info-text">
              <span class="user-display-name">{{ authService.currentUser()?.full_name || 'Dnyaneshwar Shinde' }}</span>
              <span class="user-sub">{{ authService.currentUser()?.primary_role || 'FARMER' }}</span>
            </div>
            <span class="chevron">▾</span>
          </button>

          @if (showProfile()) {
            <app-profile-menu
              [userName]="authService.currentUser()?.full_name || 'Dnyaneshwar Kisan Shinde'"
              [userEmail]="authService.currentUser()?.email || 'farmer.rahata@agrinexus.ai'"
              [userRole]="authService.currentUser()?.primary_role || 'FARMER'"
              (logout)="onLogout()"
              (close)="showProfile.set(false)"
            ></app-profile-menu>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height: 64px;
      background: var(--color-surface-card);
      border-bottom: 1px solid var(--color-border);
      padding: 0 var(--space-6);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 3px rgba(23, 43, 36, 0.04);
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: 1px solid var(--color-border);
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--color-dark-text);
      cursor: pointer;
      &:hover { background: var(--color-surface-subtle); }
    }

    .location-chip {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      background: var(--color-light-sage);
      color: var(--color-forest);
      border: 1px solid var(--color-sage-border);
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.78rem;
      font-weight: 600;
    }

    .topbar-center {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .lang-select {
      background: var(--color-warm-white);
      border: 1px solid var(--color-border);
      padding: 0.45rem 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.8rem;
      font-family: inherit;
      color: var(--color-dark-text);
      font-weight: 500;
      cursor: pointer;
      &:focus { outline: none; border-color: var(--color-emerald); }
    }

    .notification-wrapper, .profile-wrapper {
      position: relative;
    }

    .icon-btn {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all var(--transition-fast);

      &:hover, &.active {
        background: var(--color-light-sage);
        border-color: var(--color-emerald);
      }
    }

    .badge-dot {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 8px;
      height: 8px;
      background: var(--color-danger);
      border-radius: 50%;
      border: 2px solid #ffffff;
    }

    .profile-btn {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      padding: 0.3rem 0.65rem 0.3rem 0.35rem;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover, &.active {
        background: var(--color-light-sage);
        border-color: var(--color-emerald);
      }
    }

    .avatar-chip {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #174C38;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-info-text {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .user-display-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--color-dark-text);
      line-height: 1.1;
    }

    .user-sub {
      font-size: 0.68rem;
      color: var(--color-neutral-grey);
    }

    .chevron {
      font-size: 0.7rem;
      color: var(--color-neutral-grey);
    }

    @media (max-width: 1024px) {
      .mobile-menu-btn { display: flex; }
      .location-chip { display: none; }
      .topbar-center { display: none; }
    }
  `]
})
export class TopbarComponent {
  public readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  @Output() toggleMobileSidebar = new EventEmitter<void>();

  public readonly showNotifications = signal(false);
  public readonly showProfile = signal(false);
  public readonly selectedLanguage = signal('en');

  notifications: FarmNotification[] = [
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
      title: 'Optimal Spray Window',
      message: 'Wind speed 8 km/h optimal for foliar nutrient spray.',
      time: '3h ago',
      read: true
    }
  ];

  get unreadAlertsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  get userInitials(): string {
    const name = this.authService.currentUser()?.full_name || 'Dnyaneshwar Shinde';
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  }

  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
    if (this.showNotifications()) this.showProfile.set(false);
  }

  toggleProfile(): void {
    this.showProfile.update(v => !v);
    if (this.showProfile()) this.showNotifications.set(false);
  }

  onGlobalSearch(query: string): void {
    if (query) {
      this.toast.info('Search Query', `Filtering platform records for: "${query}"`);
    }
  }

  onLanguageChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedLanguage.set(val);
    const langNames: Record<string, string> = { en: 'English', mr: 'मराठी', hi: 'हिंदी' };
    this.toast.success('Language Switched', `Interface language updated to ${langNames[val] || val}.`);
  }

  onMarkAllRead(): void {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.toast.success('Alerts Cleared', 'All farm notifications marked as read.');
  }

  onLogout(): void {
    this.showProfile.set(false);
    this.authService.logout();
    this.toast.info('Signed Out', 'You have securely signed out of AgriNexus AI.');
  }
}
