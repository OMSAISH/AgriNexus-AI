import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="profile-menu">
      <div class="profile-header">
        <div class="user-avatar-large">
          <span>{{ initials }}</span>
        </div>
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-email">{{ userEmail }}</span>
          <span class="agri-badge badge-forest user-role">{{ userRole }}</span>
        </div>
      </div>

      <div class="menu-divider"></div>

      <div class="menu-links">
        <a routerLink="/settings" (click)="close.emit()" class="menu-item">
          <span class="item-icon">⚙️</span>
          <span>Farm &amp; System Settings</span>
        </a>
        <a routerLink="/system-status" (click)="close.emit()" class="menu-item">
          <span class="item-icon">⚡</span>
          <span>System Diagnostics Probe</span>
        </a>
        <a routerLink="/reports" (click)="close.emit()" class="menu-item">
          <span class="item-icon">📑</span>
          <span>Harvest &amp; Yield Reports</span>
        </a>
      </div>

      <div class="menu-divider"></div>

      <div class="profile-footer">
        <button (click)="logout.emit()" class="btn-signout">
          <span>🚪</span>
          <span>Sign Out of AgriNexus</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .profile-menu {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      width: 270px;
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
    .profile-header {
      padding: var(--space-4) var(--space-5);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--color-warm-white);
    }
    .user-avatar-large {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--color-forest);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
      border: 2px solid var(--color-light-sage);
    }
    .user-details {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      overflow: hidden;
    }
    .user-name {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--color-dark-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-email {
      font-size: 0.72rem;
      color: var(--color-neutral-grey);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role {
      align-self: flex-start;
      margin-top: 0.2rem;
      font-size: 0.65rem;
    }
    .menu-divider {
      height: 1px;
      background: var(--color-border);
    }
    .menu-links {
      padding: 0.4rem;
    }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.6rem 0.85rem;
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--color-dark-text);
      border-radius: var(--radius-sm);
      transition: background var(--transition-fast);

      &:hover {
        background: var(--color-light-sage);
        color: var(--color-forest);
      }
    }
    .item-icon {
      font-size: 0.95rem;
    }
    .profile-footer {
      padding: 0.4rem;
    }
    .btn-signout {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.6rem 0.85rem;
      background: none;
      border: none;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-danger);
      border-radius: var(--radius-sm);
      cursor: pointer;
      text-align: left;
      font-family: inherit;

      &:hover {
        background: #fee2e2;
      }
    }
  `]
})
export class ProfileMenuComponent {
  @Input() userName: string = 'Dnyaneshwar Kisan Shinde';
  @Input() userEmail: string = 'farmer.rahata@agrinexus.ai';
  @Input() userRole: string = 'FARMER';

  @Output() logout = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  get initials(): string {
    if (!this.userName) return 'AN';
    const parts = this.userName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
}
