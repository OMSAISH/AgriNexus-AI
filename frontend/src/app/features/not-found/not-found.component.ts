import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-page">
      <div class="not-found-card">
        <div class="not-found-icon">🚜</div>
        <h1>404 — Page Not Found</h1>
        <p>The requested route does not exist in the AgriNexus AI platform.</p>
        <div class="cta-actions">
          <a routerLink="/" class="btn btn-primary">Return to Homepage</a>
          <a routerLink="/system-status" class="btn btn-secondary">Check System Health</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem 1.5rem;
    }
    .not-found-card {
      background: #ffffff;
      border: 1px solid var(--color-surface-border);
      border-radius: var(--radius-lg);
      padding: 3rem 2rem;
      text-align: center;
      max-width: 500px;
      box-shadow: var(--shadow-card);
    }
    .not-found-icon {
      font-size: 3.5rem;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--color-forest-900);
      margin-bottom: 0.5rem;
    }
    p {
      color: var(--color-text-secondary);
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
    }
    .cta-actions {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
    }
  `]
})
export class NotFoundComponent {}
