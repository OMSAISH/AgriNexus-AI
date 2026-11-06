import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';
import { TopbarComponent } from '../shared/components/topbar/topbar.component';
import { ToastNotificationComponent } from '../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    TopbarComponent,
    ToastNotificationComponent
  ],
  template: `
    <div class="saas-shell" [class.sidebar-collapsed]="isSidebarCollapsed()">
      <!-- Toast Container -->
      <app-toast-notification></app-toast-notification>

      <!-- Sidebar -->
      <app-sidebar
        [collapsed]="isSidebarCollapsed()"
        [mobileOpen]="isMobileSidebarOpen()"
        (toggleCollapse)="toggleSidebar()"
        (closeMobile)="isMobileSidebarOpen.set(false)"
      ></app-sidebar>

      <!-- Main Layout Surface -->
      <div class="main-wrapper">
        <app-topbar
          (toggleMobileSidebar)="isMobileSidebarOpen.set(true)"
        ></app-topbar>

        <main class="page-viewport">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .saas-shell {
      display: flex;
      min-height: 100vh;
      background-color: var(--color-warm-white);
      transition: padding-left var(--transition-normal);
      padding-left: 260px;

      &.sidebar-collapsed {
        padding-left: 72px;
      }
    }

    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 100vh;
    }

    .page-viewport {
      flex: 1;
      padding: var(--space-6);
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
    }

    @media (max-width: 1024px) {
      .saas-shell {
        padding-left: 0 !important;
      }
      .page-viewport {
        padding: var(--space-4);
      }
    }
  `]
})
export class AppLayoutComponent {
  public readonly isSidebarCollapsed = signal(false);
  public readonly isMobileSidebarOpen = signal(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }
}
