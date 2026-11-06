import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <span class="footer-logo">🌱 AgriNexus AI</span>
            <p class="footer-tagline">
              Intelligent Farm Operations & Decision Support Platform. Engineered for HCL Technical Evaluation.
            </p>
          </div>
          <div class="group-credentials">
            <h4>Group 9 Development Team:</h4>
            <div class="team-members">
              <span>Omsaish Kishor Dhokchaule</span>
              <span>Sahil Keshav Jawale</span>
              <span>Sarthak Balasaheb Harde</span>
              <span>Abhijeet Pankaj Kanawade</span>
              <span>Prathamesh Satish Shinde</span>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 AgriNexus AI — HCL Angular & Python FastAPI Project. Primary Case Study: Rahata, Ahilyanagar (5 Acres).</p>
          <div class="footer-meta">
            <span class="meta-tag">PostgreSQL 18</span>
            <span class="meta-tag">FastAPI v1</span>
            <span class="meta-tag">Angular 19+</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-forest-900);
      color: #e2e8f0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin-top: auto;
      padding: 3rem 1.5rem 1.5rem;
    }
    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
    }
    .footer-top {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .footer-brand {
      max-width: 420px;
    }
    .footer-logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-sage-300);
      display: block;
      margin-bottom: 0.5rem;
    }
    .footer-tagline {
      font-size: 0.88rem;
      color: #94a3b8;
      line-height: 1.5;
    }
    .group-credentials h4 {
      font-size: 0.88rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-sage-200);
      margin-bottom: 0.75rem;
    }
    .team-members {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: #cbd5e1;
    }
    .footer-bottom {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 1.5rem;
      font-size: 0.8rem;
      color: #64748b;
    }
    .footer-meta {
      display: flex;
      gap: 0.5rem;
    }
    .meta-tag {
      background: rgba(255, 255, 255, 0.06);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.72rem;
      color: var(--color-sage-300);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  `]
})
export class FooterComponent {}
