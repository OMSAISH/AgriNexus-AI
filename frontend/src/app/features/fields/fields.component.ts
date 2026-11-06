import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ToastService } from '../../core/services/toast.service';
import { FieldService } from '../../core/services/field.service';
import { FarmService } from '../../core/services/farm.service';
import { FieldPlot, Farm } from '../../core/models/agrinexus.models';

@Component({
  selector: 'app-fields',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatCardComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Field Parcels &amp; Geospatial Boundaries"
        subtitle="Rahata 5-Acre Farm Subdivisions &bull; Sub-Meter Coordinate Polygons &bull; Drip Zones"
        badge="PostgreSQL Synced"
        badgeTheme="forest"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Farm Management' }, { label: 'Fields' }]"
      >
        <div header-actions class="header-actions-row">
          <button (click)="openAddModal()" class="btn btn-primary btn-sm">+ Add New Parcel</button>
        </div>
      </app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Total Parcels"
          [value]="fields().length.toString()"
          unit="Plots"
          subtext="Contiguous Farm Holdings"
          icon="🗺️"
          theme="forest"
        ></app-stat-card>
        <app-stat-card
          label="Assigned Land Area"
          [value]="totalAssignedAcres().toString()"
          unit="Acres"
          [subtext]="'Of ' + (farm()?.total_area_acres || 5.0) + ' Ac Farm Boundary'"
          icon="📐"
          theme="emerald"
        ></app-stat-card>
        <app-stat-card
          label="Avg Soil pH"
          value="7.36"
          unit="Neutral"
          subtext="Ideal for Allium &amp; Glycine max"
          icon="🧪"
          theme="info"
        ></app-stat-card>
        <app-stat-card
          label="Area Allocation Status"
          [value]="remainingAcres() === 0 ? '100% Full' : remainingAcres() + ' Ac Free'"
          [subtext]="remainingAcres() === 0 ? 'Total holding fully mapped' : 'Available for new parcels'"
          icon="⚖️"
          [theme]="remainingAcres() === 0 ? 'emerald' : 'warning'"
        ></app-stat-card>
      </div>

      <!-- Area Allocation Capacity Bar -->
      <div class="agri-card allocation-card">
        <div class="allocation-header">
          <div>
            <strong>Farm Parcel Allocation Budget</strong>
            <span>{{ totalAssignedAcres() }} of {{ farm()?.total_area_acres || 5.0 }} Acres Assigned</span>
          </div>
          <span class="agri-badge badge-forest">{{ allocationPct() }}% Bound</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" [style.width.%]="allocationPct()"></div>
        </div>
        <p class="allocation-note">
          ℹ️ <strong>Area Guard Active:</strong> AgriNexus AI enforces strict referential geometry: total field parcel sizes cannot exceed the farm holding boundary ({{ farm()?.total_area_acres || 5.0 }} Ac).
        </p>
      </div>

      <!-- Parcels Grid -->
      <div class="parcels-grid">
        @for (plot of fields(); track plot.id) {
          <div class="agri-card plot-card">
            <div class="plot-header">
              <div>
                <span class="plot-code">PARCEL-{{ plot.id.slice(0, 8).toUpperCase() }}</span>
                <h3 class="plot-title">{{ plot.name }}</h3>
              </div>
              <span class="agri-badge badge-forest">{{ plot.area_acres }} Acres</span>
            </div>

            <div class="crop-status-pill">
              <span class="crop-icon">🌱</span>
              <div class="crop-info">
                <strong>{{ plot.active_crop_name || 'Active Cultivation' }}</strong>
                <span>Irrigation: {{ plot.irrigation_type }}</span>
              </div>
            </div>

            <div class="plot-details-list">
              <div class="detail-row">
                <span>Soil Classification:</span>
                <strong>{{ plot.soil_type }}</strong>
              </div>
              <div class="detail-row">
                <span>Soil pH Level:</span>
                <strong>{{ plot.soil_ph }} (Neutral Vertisol)</strong>
              </div>
              <div class="detail-row">
                <span>Irrigation Grid:</span>
                <strong>{{ plot.irrigation_type }}</strong>
              </div>
              <div class="detail-row">
                <span>Location Sub-area:</span>
                <strong>{{ plot.location || 'Rahata Block' }}</strong>
              </div>
            </div>

            <div class="plot-actions">
              <button (click)="onInspectPlot(plot)" class="btn btn-secondary btn-sm flex-1">
                Telemetry Specs
              </button>
              <button (click)="deletePlot(plot)" class="btn btn-outline btn-sm text-danger">
                Delete
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Add Parcel Modal -->
      @if (showAddModal()) {
        <div class="modal-backdrop">
          <div class="agri-modal">
            <div class="modal-header">
              <h3>Create New Field Parcel</h3>
              <button (click)="showAddModal.set(false)" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Parcel Name *</label>
                <input type="text" [(ngModel)]="newField.name" placeholder="e.g. Plot 4 — South Extension" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Parcel Area (Acres) *</label>
                  <input type="number" [(ngModel)]="newField.area_acres" class="form-control" min="0.1" step="0.25" />
                  <small class="text-sub">Available: {{ remainingAcres() }} Ac remaining</small>
                </div>
                <div class="form-group">
                  <label>Soil pH</label>
                  <input type="number" [(ngModel)]="newField.soil_ph" class="form-control" min="4.0" max="10.0" step="0.1" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Soil Type</label>
                  <select [(ngModel)]="newField.soil_type" class="form-control">
                    <option value="BLACK_REGUR">Medium-Deep Black Regur</option>
                    <option value="ALLUVIAL">Alluvial Loam</option>
                    <option value="RED_LOAM">Red Lateritic Loam</option>
                    <option value="CLAY_LOAM">Clay Loam</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Irrigation System</label>
                  <select [(ngModel)]="newField.irrigation_type" class="form-control">
                    <option value="INLINE_DRIP">Inline Drip System</option>
                    <option value="SUB_SURFACE_DRIP">Sub-surface Drip</option>
                    <option value="SPRINKLER">Overhead Sprinkler</option>
                    <option value="CANAL_FLOOD">Canal Flood Flow</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Sector / Location Note</label>
                <input type="text" [(ngModel)]="newField.location" placeholder="e.g. Near Pravara distributary gate" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="showAddModal.set(false)" class="btn btn-secondary">Cancel</button>
              <button (click)="submitField()" class="btn btn-primary" [disabled]="isSubmitting()">Create Parcel</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .header-actions-row { display: flex; gap: 0.75rem; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
    .allocation-card {
      display: flex; flex-direction: column; gap: 0.75rem;
      background: #FFF; border: 1px solid var(--color-border);
      border-radius: var(--radius-md); padding: 1.25rem;
    }
    .allocation-header {
      display: flex; justify-content: space-between; align-items: center;
      div { display: flex; flex-direction: column; }
      strong { font-size: 0.95rem; color: #174C38; }
      span { font-size: 0.78rem; color: var(--color-neutral-grey); }
    }
    .progress-track {
      width: 100%; height: 8px; background: #E5E7EB; border-radius: 9999px; overflow: hidden;
    }
    .progress-fill {
      height: 100%; background: #16845B; border-radius: 9999px; transition: width 0.3s ease;
    }
    .allocation-note { font-size: 0.78rem; color: var(--color-neutral-grey); margin: 0; }
    .parcels-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem; }
    .plot-card { display: flex; flex-direction: column; gap: 1rem; }
    .plot-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .plot-code { font-size: 0.72rem; font-weight: 700; color: var(--color-neutral-grey); }
    .plot-title { font-size: 1.15rem; font-weight: 800; color: #174C38; margin: 0.2rem 0; }
    .crop-status-pill {
      display: flex; align-items: center; gap: 0.75rem;
      background: var(--color-light-sage); border: 1px solid var(--color-sage-border);
      padding: 0.6rem 0.85rem; border-radius: var(--radius-md);
    }
    .crop-icon { font-size: 1.5rem; }
    .crop-info strong { display: block; font-size: 0.9rem; color: #174C38; }
    .crop-info span { font-size: 0.78rem; color: var(--color-neutral-grey); }
    .plot-details-list { display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.82rem; }
    .detail-row {
      display: flex; justify-content: space-between;
      span { color: var(--color-neutral-grey); }
      strong { color: var(--color-dark-text); }
    }
    .plot-actions { display: flex; gap: 0.75rem; }
    .flex-1 { flex: 1; }
    .text-danger { color: #DC2626 !important; border-color: #FCA5A5 !important; }
    .text-sub { font-size: 0.74rem; color: #6B7280; }
    .modal-backdrop {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; backdrop-filter: blur(3px);
    }
    .agri-modal {
      background: #FFF; border-radius: 12px; width: 90%; max-width: 520px;
      padding: 1.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;
      h3 { font-size: 1.2rem; font-weight: 800; color: #174C38; }
      .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; }
    }
    .modal-body { display: flex; flex-direction: column; gap: 1rem; }
    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.82rem; font-weight: 700; color: #172B24; }
      .form-control { padding: 0.6rem 0.8rem; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 0.88rem; }
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 0.75rem;
      margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #E5E7EB;
    }
  `]
})
export class FieldManagementComponent implements OnInit {
  private readonly fieldService = inject(FieldService);
  private readonly farmService = inject(FarmService);
  private readonly toast = inject(ToastService);

  farm = signal<Farm | null>(null);
  fields = signal<FieldPlot[]>([]);

  showAddModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  newField: any = {
    name: '',
    area_acres: 1.0,
    soil_type: 'BLACK_REGUR',
    soil_ph: 7.4,
    irrigation_type: 'INLINE_DRIP',
    location: '',
  };

  ngOnInit(): void {
    this.farmService.getFarms().subscribe({
      next: (farms) => {
        if (farms.length > 0) {
          this.farm.set(farms[0]);
          this.loadFields(farms[0].id);
        }
      },
      error: (err) => this.toast.error('Farm Error', err.message || 'Failed to load farm details')
    });
  }

  loadFields(farmId: string): void {
    this.fieldService.getFields(farmId).subscribe({
      next: (data) => this.fields.set(data),
      error: (err) => this.toast.error('Field Error', err.message || 'Failed to load fields')
    });
  }

  totalAssignedAcres(): number {
    return this.fields().reduce((acc, f) => acc + Number(f.area_acres), 0);
  }

  remainingAcres(): number {
    const total = this.farm()?.total_area_acres || 5.0;
    return Math.max(0, Number((total - this.totalAssignedAcres()).toFixed(2)));
  }

  allocationPct(): number {
    const total = this.farm()?.total_area_acres || 5.0;
    return Math.min(100, Math.round((this.totalAssignedAcres() / total) * 100));
  }

  openAddModal(): void {
    this.newField = {
      name: '',
      area_acres: Math.max(0.5, this.remainingAcres()),
      soil_type: 'BLACK_REGUR',
      soil_ph: 7.4,
      irrigation_type: 'INLINE_DRIP',
      location: '',
    };
    this.showAddModal.set(true);
  }

  submitField(): void {
    if (!this.newField.name) {
      this.toast.error('Validation', 'Please provide parcel name');
      return;
    }
    if (!this.farm()) {
      this.toast.error('Error', 'No active farm holding found');
      return;
    }
    this.isSubmitting.set(true);
    const payload = { ...this.newField, farm_id: this.farm()!.id };
    this.fieldService.createField(payload).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.showAddModal.set(false);
        this.toast.success('Parcel Created', `${created.name} (${created.area_acres} Ac) mapped onto farm.`);
        this.loadFields(this.farm()!.id);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const detail = err.error?.detail || err.message || 'Could not create parcel';
        this.toast.error('Area Violation', detail);
      }
    });
  }

  deletePlot(plot: FieldPlot): void {
    if (confirm(`Delete parcel "${plot.name}" (${plot.area_acres} Ac)? This will unassign all linked crops.`)) {
      this.fieldService.deleteField(plot.id).subscribe({
        next: () => {
          this.toast.success('Parcel Removed', `Deleted ${plot.name}`);
          if (this.farm()) {
            this.loadFields(this.farm()!.id);
          }
        },
        error: (err) => this.toast.error('Deletion Failed', err.message)
      });
    }
  }

  onInspectPlot(plot: FieldPlot): void {
    this.toast.info('Parcel Telemetry', `Inspecting sensors & soil history for ${plot.name}`);
  }
}
