import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-wrapper" [class.overlay]="overlay">
      <div class="loading-spinner-box">
        <div class="agri-spinner"></div>
        <span class="loading-message">{{ message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .loading-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
      width: 100%;

      &.overlay {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(2px);
        z-index: 50;
      }
    }
    .loading-spinner-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .agri-spinner {
      width: 38px;
      height: 38px;
      border: 3px solid var(--color-light-sage);
      border-top-color: var(--color-forest);
      border-radius: 50%;
      animation: spin 0.75s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .loading-message {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-forest);
    }
  `]
})
export class LoadingComponent {
  @Input() message: string = 'Loading telemetry & farm records...';
  @Input() overlay: boolean = false;
}
