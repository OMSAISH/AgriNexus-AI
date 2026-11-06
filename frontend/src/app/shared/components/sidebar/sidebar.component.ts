import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavSection {
  title: string;
  items: {
    label: string;
    route: string;
    icon: string;
    badge?: string;
  }[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile Backdrop -->
    @if (mobileOpen) {
      <div class="sidebar-backdrop" (click)="closeMobile.emit()"></div>
    }

    <aside class="sidebar" [class.collapsed]="collapsed" [class.mobile-open]="mobileOpen">
      <!-- Logo Header -->
      <div class="sidebar-header">
        <a routerLink="/dashboard" class="brand-link" (click)="onNavClick()">
          <div class="brand-symbol">🌱</div>
          @if (!collapsed) {
            <div class="brand-details">
              <span class="brand-name">AgriNexus AI</span>
              <span class="brand-edition">SaaS Enterprise</span>
            </div>
          }
        </a>
        <button (click)="toggleCollapse.emit()" class="collapse-toggle-btn" title="Toggle Sidebar">
          <span>{{ collapsed ? '▶' : '◀' }}</span>
        </button>
      </div>

      <!-- Quick Case Study Status -->
      @if (!collapsed) {
        <div class="holding-summary">
          <div class="holding-dot"></div>
          <div class="holding-info">
            <strong>Rahata Holding (5.0 Ac)</strong>
            <span>3 Active Crop Parcels</span>
          </div>
        </div>
      }

      <!-- Navigation Links Container -->
      <nav class="sidebar-nav">
        @for (section of navSections; track section.title) {
          <div class="nav-section">
            @if (!collapsed) {
              <div class="section-title">{{ section.title }}</div>
            } @else {
              <div class="section-divider"></div>
            }

            <ul class="nav-list">
              @for (item of section.items; track item.route) {
                <li class="nav-item">
                  <a
                    [routerLink]="item.route"
                    routerLinkActive="active"
                    [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                    (click)="onNavClick()"
                    class="nav-link"
                    [title]="item.label"
                  >
                    <span class="nav-icon">{{ item.icon }}</span>
                    @if (!collapsed) {
                      <span class="nav-label">{{ item.label }}</span>
                      @if (item.badge) {
                        <span class="nav-badge">{{ item.badge }}</span>
                      }
                    }
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        @if (!collapsed) {
          <div class="footer-profile">
            <div class="avatar-mini">DS</div>
            <div class="user-meta">
              <strong>Dnyaneshwar S.</strong>
              <span>Lead Farmer</span>
            </div>
          </div>
        }
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(2px);
      z-index: 1040;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 260px;
      background: #174C38; /* Mandated Forest Green */
      color: #FAFBF8;      /* Warm White */
      display: flex;
      flex-direction: column;
      z-index: 1050;
      transition: width var(--transition-normal), transform var(--transition-normal);
      border-right: 1px solid rgba(255, 255, 255, 0.08);

      &.collapsed {
        width: 72px;

        .brand-link { justify-content: center; }
        .collapse-toggle-btn { display: none; }
        .nav-link { justify-content: center; padding: 0.75rem; }
      }
    }

    .sidebar-header {
      padding: var(--space-4) var(--space-4);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      height: 64px;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
    }

    .brand-symbol {
      width: 36px;
      height: 36px;
      background: #16845B; /* Mandated Emerald */
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .brand-details {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 1.05rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
    }

    .brand-edition {
      font-size: 0.68rem;
      color: #c4decb;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .collapse-toggle-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #c4decb;
      width: 24px;
      height: 24px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.65rem;
      &:hover { background: rgba(255, 255, 255, 0.2); color: #ffffff; }
    }

    .holding-summary {
      margin: var(--space-3) var(--space-3) 0;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      padding: 0.6rem 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .holding-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
      flex-shrink: 0;
    }

    .holding-info {
      display: flex;
      flex-direction: column;
      strong { font-size: 0.78rem; color: #ffffff; }
      span { font-size: 0.7rem; color: #cbd5e1; }
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-3) var(--space-2);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .section-title {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #94a3b8;
      padding: 0 var(--space-3) 0.35rem;
    }

    .section-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
      margin: 0.4rem 0.5rem;
    }

    .nav-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.55rem var(--space-3);
      color: #cbd5e1;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-weight: 500;
      text-decoration: none;
      transition: all var(--transition-fast);
      position: relative;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }

      &.active {
        background: #16845B; /* Mandated Emerald */
        color: #ffffff;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }
    }

    .nav-icon {
      font-size: 1.05rem;
      flex-shrink: 0;
      width: 20px;
      text-align: center;
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nav-badge {
      font-size: 0.65rem;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-full);
    }

    .sidebar-footer {
      padding: var(--space-3) var(--space-4);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.1);
    }

    .footer-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar-mini {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #16845B;
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      strong { font-size: 0.8rem; color: #ffffff; }
      span { font-size: 0.7rem; color: #94a3b8; }
    }

    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
        &.mobile-open {
          transform: translateX(0);
        }
      }
      .sidebar-backdrop {
        display: block;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() collapsed: boolean = false;
  @Input() mobileOpen: boolean = false;

  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() closeMobile = new EventEmitter<void>();

  navSections: NavSection[] = [
    {
      title: 'Operations',
      items: [
        { label: 'Dashboard', route: '/dashboard', icon: '📊' },
        { label: 'Farm Management', route: '/farms', icon: '🏡' },
        { label: 'Field Management', route: '/fields', icon: '🗺️' },
        { label: 'Crop Management', route: '/crops', icon: '🌱' },
        { label: 'Crop Lifecycle', route: '/crop-lifecycle', icon: '⏳' },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { label: 'AI Crop Doctor', route: '/crop-doctor', icon: '🩺', badge: 'AI' },
        { label: 'Irrigation Intelligence', route: '/irrigation', icon: '💧' },
        { label: 'Weather Intelligence', route: '/weather', icon: '🌦️' },
        { label: 'Market Intelligence', route: '/market-intelligence', icon: '📈' },
      ]
    },
    {
      title: 'Resources',
      items: [
        { label: 'Inventory', route: '/inventory', icon: '📦' },
        { label: 'Labour Management', route: '/labour', icon: '👥' },
        { label: 'Equipment Management', route: '/equipment', icon: '🚜' },
      ]
    },
    {
      title: 'Management',
      items: [
        { label: 'Financial Management', route: '/financials', icon: '💰' },
        { label: 'Analytics & Reports', route: '/reports', icon: '📑' },
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Notifications', route: '/notifications', icon: '🔔', badge: '3' },
        { label: 'Settings', route: '/settings', icon: '⚙️' },
        { label: 'System Diagnostics', route: '/system-status', icon: '⚡' },
      ]
    }
  ];

  onNavClick(): void {
    if (this.mobileOpen) {
      this.closeMobile.emit();
    }
  }
}
