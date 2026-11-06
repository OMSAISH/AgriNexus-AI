import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="brand">
          <div class="brand-icon">🌱</div>
          <div class="brand-text">
            <span class="brand-title">AgriNexus AI</span>
            <span class="brand-subtitle">Rahata 5-Acre Case Study</span>
          </div>
        </a>

        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Overview</a>
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
          <a routerLink="/system-status" routerLinkActive="active" class="nav-link health-badge">
            <span class="pulse-dot"></span>
            System Health
          </a>
        </nav>

        <div class="nav-actions">
          @if (authService.isAuthenticated()) {
            <div class="user-pill">
              <span class="user-role">{{ authService.currentUser()?.primary_role }}</span>
              <span class="user-name">{{ authService.currentUser()?.full_name }}</span>
              <button (click)="authService.logout()" class="btn-logout" title="Sign Out">Sign Out</button>
            </div>
          } @else {
            <a routerLink="/auth/login" class="btn btn-secondary btn-sm">Sign In</a>
            <a routerLink="/auth/register" class="btn btn-primary btn-sm">Register</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      background: var(--color-surface-card);
      border-bottom: 1px solid var(--color-surface-border);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }
    .brand-icon {
      font-size: 1.75rem;
      background: var(--color-sage-100);
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-sage-300);
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--color-forest-800);
      letter-spacing: -0.02em;
    }
    .brand-subtitle {
      font-size: 0.72rem;
      color: var(--color-text-muted);
      font-weight: 500;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-link {
      padding: 0.5rem 0.85rem;
      border-radius: var(--radius-sm);
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      transition: all 0.15s ease;
      &:hover {
        color: var(--color-forest-800);
        background: var(--color-surface-bg);
      }
      &.active {
        color: var(--color-forest-800);
        background: var(--color-sage-100);
        font-weight: 600;
      }
    }
    .health-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .btn-sm {
      padding: 0.45rem 0.9rem;
      font-size: 0.82rem;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: var(--color-surface-bg);
      border: 1px solid var(--color-surface-border);
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.82rem;
    }
    .user-role {
      background: var(--color-forest-800);
      color: white;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
    }
    .user-name {
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .btn-logout {
      background: none;
      border: none;
      color: #dc2626;
      font-size: 0.75rem;
      cursor: pointer;
      margin-left: 0.25rem;
      font-weight: 600;
      &:hover { text-decoration: underline; }
    }
  `]
})
export class NavbarComponent {
  public readonly authService = inject(AuthService);
}
