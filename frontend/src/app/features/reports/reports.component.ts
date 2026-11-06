import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatCardComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Analytics &amp; Agricultural Compliance Reports"
        subtitle="Generate audit-ready reports for crop insurance, bank credit, and ICAR soil health certification"
        badge="Export Ready"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Management' }, { label: 'Reports' }]"
      >
        <div header-actions>
          <button (click)="onExportAll()" class="btn btn-primary btn-sm">Download Full Estate Dossier (PDF)</button>
        </div>
      </app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Generated Reports"
          value="12"
          unit="Dossiers"
          subtext="Season 2026-27 Archive"
          icon="📑"
          theme="forest"
        ></app-stat-card>
        <app-stat-card
          label="Soil Health Rating"
          value="A+"
          unit="Certified"
          subtext="pH 7.4 &bull; Organic Carbon 0.68%"
          icon="🧪"
          theme="emerald"
        ></app-stat-card>
        <app-stat-card
          label="Crop Insurance Doc"
          value="PMFBY"
          subtext="Pradhan Mantri Fasal Bima Yojna"
          icon="🛡️"
          theme="info"
        ></app-stat-card>
        <app-stat-card
          label="Estimated Farm Carbon"
          value="4.2"
          unit="Tons"
          subtext="Sequestered in Sugarcane &amp; Vertisol"
          icon="🌿"
          theme="warning"
        ></app-stat-card>
      </div>

      <!-- Report Catalog Grid -->
      <div class="reports-catalog-grid">
        @for (report of reportCards; track report.title) {
          <div class="agri-card report-item-card">
            <div class="report-top">
              <span class="report-icon">{{ report.icon }}</span>
              <span class="agri-badge badge-forest">{{ report.type }}</span>
            </div>
            <h3 class="report-title">{{ report.title }}</h3>
            <p class="report-desc">{{ report.desc }}</p>
            <div class="report-meta">
              <span>Last Updated: <strong>{{ report.lastDate }}</strong></span>
              <span>Pages: <strong>{{ report.pages }}</strong></span>
            </div>
            <div class="report-buttons">
              <button (click)="downloadReport(report, 'pdf')" class="btn btn-secondary btn-sm flex-1">
                Download PDF
              </button>
              <button (click)="downloadReport(report, 'csv')" class="btn btn-outline btn-sm flex-1">
                CSV Data
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
    .reports-catalog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .report-item-card {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .report-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .report-icon { font-size: 2.25rem; }
    .report-title { font-size: 1.15rem; font-weight: 800; color: #174C38; }
    .report-desc { font-size: 0.85rem; color: var(--color-neutral-grey); line-height: 1.5; flex: 1; }
    .report-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      padding: 0.5rem 0;
      border-top: 1px solid var(--color-border-subtle);
      border-bottom: 1px solid var(--color-border-subtle);
      color: var(--color-neutral-grey);
    }
    .report-buttons { display: flex; gap: 0.75rem; }
    .flex-1 { flex: 1; }
  `]
})
export class ReportsComponent {
  private readonly toast = inject(ToastService);

  reportCards = [
    {
      icon: '🧪',
      title: 'Comprehensive Soil Health Card',
      desc: 'Nutrient audit covering Nitrogen (N), Phosphorus (P), Potassium (K), pH (7.4), EC, and Organic Carbon with ICAR dosage tables.',
      type: 'Agronomic',
      lastDate: '3 Nov 2026',
      pages: '4 pages'
    },
    {
      icon: '🧅',
      title: 'Rabi Onion Yield & Revenue Projection',
      desc: 'Biomass accumulation curve, bulb sizing distribution, APMC Rahata market price spread analysis and gross margin ledger.',
      type: 'Economic',
      lastDate: 'Today',
      pages: '6 pages'
    },
    {
      icon: '💧',
      title: 'Water Evapotranspiration & Drip Audit',
      desc: 'Volumetric consumption records, Pravara canal delivery synchronizations, and groundwater conservation metrics.',
      type: 'Irrigation',
      lastDate: '1 Nov 2026',
      pages: '3 pages'
    },
    {
      icon: '🩺',
      title: 'Pathology & Foliar Disease Scan Log',
      desc: 'Complete computer vision history of Alternaria porri detection on Plot 1, Mancozeb application timelines, and bio-spray outcomes.',
      type: 'Pathology',
      lastDate: 'Yesterday',
      pages: '5 pages'
    }
  ];

  downloadReport(report: any, format: string): void {
    this.toast.success('Document Generated', `Downloading "${report.title}" in ${format.toUpperCase()} format.`);
  }

  onExportAll(): void {
    this.toast.success('Dossier Compiled', 'Downloading complete 18-page AgriNexus farm dossier for Rahata holding.');
  }
}
