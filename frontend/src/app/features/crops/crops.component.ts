import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { ToastService } from '../../core/services/toast.service';
import { CropService } from '../../core/services/crop.service';
import { Crop } from '../../core/models/agrinexus.models';

@Component({
  selector: 'app-crops',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatCardComponent, DataTableComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Crop Portfolio &amp; Cultivation Cycles"
        subtitle="Botanical lifecycle monitoring, sowing regimes, and harvest projections for Rahata holding"
        badge="PostgreSQL Synced"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Crop Operations' }, { label: 'Crops' }]"
      >
        <div header-actions>
          <button (click)="loadCrops()" class="btn btn-secondary btn-sm" [disabled]="isLoading()">
            {{ isLoading() ? 'Syncing...' : '🔄 Refresh Crops' }}
          </button>
        </div>
      </app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Active Crop Types"
          [value]="(crops().length || 3).toString()"
          unit="Commodities"
          subtext="Onion, Soybean, Sugarcane"
          icon="🌾"
          theme="forest"
        ></app-stat-card>
        <app-stat-card
          label="Dominant Acreage"
          value="2.00"
          unit="Acres"
          subtext="Rabi Onion (Bhima Super)"
          icon="🧅"
          theme="emerald"
        ></app-stat-card>
        <app-stat-card
          label="Est. Onion Yield"
          value="18.0"
          unit="Tons"
          subtext="Bulb Diameter: 55–65 mm"
          icon="📦"
          theme="info"
        ></app-stat-card>
        <app-stat-card
          label="Est. Sugarcane Yield"
          value="85.0"
          unit="Tons"
          subtext="Brix Index: 19.5% Target"
          icon="🎋"
          theme="warning"
        ></app-stat-card>
      </div>

      <!-- Crops Data Table -->
      <div class="agri-card table-card">
        <div class="table-header-title">
          <h4>Cultivation Master Records ({{ crops().length }} Active in PostgreSQL)</h4>
          <p>Seeded directly from PostgreSQL agrinexus_db crops table</p>
        </div>

        <app-data-table
          [columns]="cropColumns"
          [data]="cropsTableData()"
          [hasRowActions]="true"
          (actionClicked)="onViewCropDetails($event)"
        ></app-data-table>
      </div>
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
    .agri-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }
    .table-card { display: flex; flex-direction: column; gap: 1rem; }
    .table-header-title h4 { font-size: 1.15rem; font-weight: 800; color: #174C38; }
    .table-header-title p { font-size: 0.82rem; color: var(--color-neutral-grey); }
  `]
})
export class CropManagementComponent implements OnInit {
  private readonly cropService = inject(CropService);
  private readonly toast = inject(ToastService);

  public readonly isLoading = signal(false);
  public readonly crops = signal<Crop[]>([]);

  cropColumns: TableColumn[] = [
    { key: 'crop_name', label: 'Crop Commodity' },
    { key: 'variety', label: 'Cultivar / Variety' },
    { key: 'field_name', label: 'Allocated Field' },
    { key: 'sowing_date', label: 'Sowing Date' },
    { key: 'expected_harvest_date', label: 'Expected Harvest' },
    { key: 'current_stage', label: 'Phenological Stage', badgeType: true },
    { key: 'cultivated_area', label: 'Cultivated Area' }
  ];

  cropsTableData(): any[] {
    return this.crops().map(c => ({
      ...c,
      cultivated_area: `${c.cultivated_area || 1.0} Acres`
    }));
  }

  ngOnInit(): void {
    this.loadCrops();
  }

  loadCrops(): void {
    this.isLoading.set(true);
    this.cropService.getCrops().subscribe({
      next: (crops) => {
        this.isLoading.set(false);
        this.crops.set(crops);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.warn('Error fetching crops:', err);
      }
    });
  }

  onViewCropDetails(crop: any): void {
    this.toast.info('Crop Selected', `Displaying phenological data for ${crop.crop_name} (${crop.variety})`);
  }
}
