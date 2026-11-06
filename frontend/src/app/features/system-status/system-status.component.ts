import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HealthService } from '../../core/services/health.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="status-page">
      <div class="container">
        <!-- Header -->
        <div class="status-header">
          <div>
            <span class="page-tag">Infrastructure Verification (Phase 1)</span>
            <h1 class="page-title">Triple-Handshake Diagnostics</h1>
            <p class="page-subtitle">
              Real-time connectivity probe across Angular 19+ Frontend, FastAPI Backend, and PostgreSQL 18 Database.
            </p>
          </div>

          <button
            type="button"
            (click)="runDiagnostics()"
            class="btn btn-primary"
            [disabled]="healthService.healthState().isLoading"
          >
            @if (healthService.healthState().isLoading) {
              <span class="spinner"></span>
              <span>Probing APIs...</span>
            } @else {
              <span>🔄 Run Live Diagnostic Probe</span>
            }
          </button>
        </div>

        <!-- Metric Badges Row -->
        <div class="status-cards-grid">
          <!-- 1. Frontend Status -->
          <div class="status-card">
            <div class="card-top">
              <span class="card-label">Client Tier (Angular)</span>
              <span class="badge badge-success">Operational</span>
            </div>
            <div class="card-value">Angular 19+</div>
            <div class="card-detail">
              <span>Mode: Standalone Components</span>
              <span>API Base: {{ apiService.baseUrl }}</span>
            </div>
          </div>

          <!-- 2. Backend FastAPI Status -->
          <div class="status-card" [class.is-error]="!healthService.healthState().backend && !healthService.healthState().isLoading">
            <div class="card-top">
              <span class="card-label">Application Tier (FastAPI)</span>
              @if (healthService.healthState().backend) {
                <span class="badge badge-success">Online (HTTP 200)</span>
              } @else if (healthService.healthState().isLoading) {
                <span class="badge badge-warning">Probing...</span>
              } @else {
                <span class="badge badge-danger">Unreachable</span>
              }
            </div>
            <div class="card-value">
              {{ healthService.healthState().backend?.status || 'Offline' }}
            </div>
            <div class="card-detail">
              <span>Service: {{ healthService.healthState().backend?.service || 'N/A' }}</span>
              <span>Version: {{ healthService.healthState().backend?.version || 'N/A' }}</span>
            </div>
          </div>

          <!-- 3. PostgreSQL Database Status -->
          <div class="status-card" [class.is-error]="!healthService.healthState().database?.success && !healthService.healthState().isLoading">
            <div class="card-top">
              <span class="card-label">Data Tier (PostgreSQL)</span>
              @if (healthService.healthState().database?.success) {
                <span class="badge badge-success">Connected</span>
              } @else if (healthService.healthState().isLoading) {
                <span class="badge badge-warning">Testing Ping...</span>
              } @else {
                <span class="badge badge-danger">Disconnected</span>
              }
            </div>
            <div class="card-value">
              {{ healthService.healthState().database?.database_name || 'agrinexus_db' }}
            </div>
            <div class="card-detail">
              <span>Engine: {{ healthService.healthState().database?.database_type || 'PostgreSQL' }}</span>
              <span>Query Latency: {{ healthService.healthState().database?.latency_ms ? healthService.healthState().database?.latency_ms + ' ms' : 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Error Notification -->
        @if (healthService.healthState().error) {
          <div class="error-banner">
            <div class="error-icon">🚨</div>
            <div class="error-text">
              <h4>System Connection Alert</h4>
              <p>{{ healthService.healthState().error }}</p>
            </div>
          </div>
        }

        <!-- Technical Diagnostics Section -->
        <div class="diagnostics-panel">
          <div class="panel-header">
            <h3>Diagnostic Telemetry &amp; Raw Payloads</h3>
            <span class="last-checked" *ngIf="healthService.healthState().lastChecked">
              Last Verified: {{ healthService.healthState().lastChecked | date:'mediumTime' }}
            </span>
          </div>

          <div class="json-inspect-grid">
            <!-- Backend Health Payload -->
            <div class="json-box">
              <div class="json-header">
                <span>GET /api/v1/health</span>
                <span class="status-code">200 OK</span>
              </div>
              <pre><code>{{ healthService.healthState().backend | json }}</code></pre>
            </div>

            <!-- Database Health Payload -->
            <div class="json-box">
              <div class="json-header">
                <span>GET /api/v1/health/database</span>
                <span class="status-code">200 OK</span>
              </div>
              <pre><code>{{ healthService.healthState().database | json }}</code></pre>
            </div>
          </div>
        </div>

        <!-- Architecture Handshake Verification Flow -->
        <div class="handshake-flow-card">
          <h3>Triple-Handshake Verification Checklist</h3>
          <div class="flow-steps">
            <div class="flow-step completed">
              <span class="step-num">1</span>
              <div>
                <strong>Client Dispatch</strong>
                <p>Angular HttpClient issues non-blocking GET requests via ApiService.</p>
              </div>
            </div>
            <div class="flow-step completed">
              <span class="step-num">2</span>
              <div>
                <strong>ASGI Middleware Routing</strong>
                <p>FastAPI validates CORS headers and dispatches to /api/v1/health.</p>
              </div>
            </div>
            <div class="flow-step completed">
              <span class="step-num">3</span>
              <div>
                <strong>PostgreSQL Connection Pool</strong>
                <p>SQLAlchemy executes diagnostic SQL ping (SELECT version();) in agrinexus_db.</p>
              </div>
            </div>
            <div class="flow-step completed">
              <span class="step-num">4</span>
              <div>
                <strong>Reactivity Delivery</strong>
                <p>Angular Signals update reactive state and render latency diagnostics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-page {
      padding: 2.5rem 0 4rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .status-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-end;
      gap: 1.5rem;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-surface-border);
    }
    .page-tag {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-emerald-600);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .page-title {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--color-forest-900);
      margin-top: 0.25rem;
      letter-spacing: -0.02em;
    }
    .page-subtitle {
      color: var(--color-text-secondary);
      font-size: 0.95rem;
      margin-top: 0.25rem;
    }
    .status-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .status-card {
      background: #ffffff;
      border: 1px solid var(--color-surface-border);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border-top: 4px solid var(--color-emerald-600);
      &.is-error {
        border-top-color: #dc2626;
      }
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .card-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-forest-900);
      text-transform: capitalize;
    }
    .card-detail {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      font-size: 0.82rem;
      color: var(--color-text-secondary);
      padding-top: 0.5rem;
      border-top: 1px solid var(--color-surface-border-subtle);
    }
    .error-banner {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin-bottom: 2rem;
    }
    .error-icon {
      font-size: 1.75rem;
    }
    .error-text h4 {
      font-size: 1rem;
      font-weight: 700;
      color: #991b1b;
      margin-bottom: 0.25rem;
    }
    .error-text p {
      font-size: 0.88rem;
      color: #7f1d1d;
    }
    .diagnostics-panel {
      background: #ffffff;
      border: 1px solid var(--color-surface-border);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      box-shadow: var(--shadow-card);
      margin-bottom: 2rem;
    }
    .panel-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      gap: 0.5rem;
    }
    .panel-header h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--color-forest-900);
    }
    .last-checked {
      font-size: 0.82rem;
      color: var(--color-text-muted);
      font-weight: 500;
    }
    .json-inspect-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 1.25rem;
    }
    .json-box {
      background: #0f172a;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid #1e293b;
    }
    .json-header {
      background: #1e293b;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.78rem;
      color: #94a3b8;
      font-family: 'JetBrains Mono', monospace;
    }
    .status-code {
      color: #10b981;
      font-weight: 600;
    }
    pre {
      padding: 1rem;
      color: #e2e8f0;
      font-size: 0.82rem;
      line-height: 1.5;
      overflow-x: auto;
      max-height: 280px;
    }
    .handshake-flow-card {
      background: #ffffff;
      border: 1px solid var(--color-surface-border);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      box-shadow: var(--shadow-card);
    }
    .handshake-flow-card h3 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--color-forest-900);
      margin-bottom: 1.25rem;
    }
    .flow-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem;
    }
    .flow-step {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
    }
    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-forest-800);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.82rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .flow-step strong {
      display: block;
      font-size: 0.9rem;
      color: var(--color-forest-800);
      margin-bottom: 0.2rem;
    }
    .flow-step p {
      font-size: 0.82rem;
      color: var(--color-text-secondary);
      line-height: 1.4;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SystemStatusComponent implements OnInit {
  public readonly healthService = inject(HealthService);
  public readonly apiService = inject(ApiService);

  ngOnInit(): void {
    this.runDiagnostics();
  }

  runDiagnostics(): void {
    this.healthService.checkFullSystemHealth().subscribe({
      next: () => {
        console.log('[AgriNexus Handshake] Completed successfully.');
      },
      error: (err) => {
        console.error('[AgriNexus Handshake] Failed:', err);
      }
    });
  }
}
