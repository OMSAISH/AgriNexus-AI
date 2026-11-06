import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { ToastService } from '../../core/services/toast.service';
import { FarmService } from '../../core/services/farm.service';
import { FieldService } from '../../core/services/field.service';
import { Farm, FieldPlot } from '../../core/models/agrinexus.models';

@Component({
  selector: 'app-farms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    StatCardComponent,
    DataTableComponent
  ],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Farm Holdings &amp; Land Parcels"
        subtitle="Manage agricultural estate parameters, legal ownership boundaries, and soil profiles"
        badge="PostgreSQL Synced"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Farm Management' }]"
      >
        <div header-actions>
          <button (click)="openAddFarmModal()" class="btn btn-primary btn-sm">
            <span>+ Register Farm Holding</span>
          </button>
        </div>
      </app-page-header>

      <!-- Stat Cards Row -->
      <div class="stat-row">
        <app-stat-card
          label="Registered Estates"
          [value]="(farms().length || 1).toString()"
          unit="Holding"
          [subtext]="currentFarm()?.name || 'Shinde Krushi Farm'"
          icon="🏡"
          theme="forest"
        ></app-stat-card>

        <app-stat-card
          label="Total Land Holdings"
          [value]="(currentFarm()?.total_area_acres || 5.0).toString()"
          unit="Acres"
          subtext="100% Cultivated Surface"
          icon="📐"
          theme="emerald"
        ></app-stat-card>

        <app-stat-card
          label="Primary Soil Series"
          [value]="currentFarm()?.soil_type || 'MEDIUM_BLACK'"
          subtext="Vertisol &bull; pH 7.4 Neutral"
          icon="🧪"
          theme="info"
        ></app-stat-card>

        <app-stat-card
          label="Irrigation Sources"
          [value]="currentFarm()?.irrigation_source || 'DRIP'"
          subtext="Pravara Canal &bull; Dug Well"
          icon="💧"
          theme="emerald"
        ></app-stat-card>
      </div>

      <!-- Farm Holding Detail Card -->
      @if (currentFarm()) {
        <div class="agri-card farm-detail-card">
          <div class="card-header-bar">
            <div class="farm-meta">
              <div class="farm-avatar">🌾</div>
              <div>
                <h3>{{ currentFarm()?.name }}</h3>
                <p class="meta-sub">
                  Location: {{ currentFarm()?.village }}, {{ currentFarm()?.taluka }}, {{ currentFarm()?.district }} &bull; State: {{ currentFarm()?.state }}
                </p>
              </div>
            </div>
            <span class="agri-badge badge-success">Verified Holding</span>
          </div>

          <div class="farm-specs-grid">
            <div class="spec-item">
              <span class="spec-label">Village &amp; Taluka</span>
              <strong>{{ currentFarm()?.village }} / {{ currentFarm()?.taluka }}</strong>
            </div>
            <div class="spec-item">
              <span class="spec-label">District &amp; State</span>
              <strong>{{ currentFarm()?.district }}, {{ currentFarm()?.state }}</strong>
            </div>
            <div class="spec-item">
              <span class="spec-label">GPS Coordinates</span>
              <strong>{{ currentFarm()?.latitude }}° N, {{ currentFarm()?.longitude }}° E</strong>
            </div>
            <div class="spec-item">
              <span class="spec-label">Area &amp; Status</span>
              <strong>{{ currentFarm()?.total_area_acres }} {{ currentFarm()?.area_unit }}</strong>
            </div>
            <div class="spec-item">
              <span class="spec-label">Soil Classification</span>
              <strong>{{ currentFarm()?.soil_type }}</strong>
            </div>
            <div class="spec-item">
              <span class="spec-label">Irrigation Network</span>
              <strong>{{ currentFarm()?.irrigation_source }} Automated</strong>
            </div>
          </div>
        </div>
      }

      <!-- Fields / Parcels Table -->
      <div class="table-section">
        <div class="section-title-row">
          <div>
            <h3>Constituent Field Parcels ({{ fields().length }})</h3>
            <p>Subdivided plots allocated to specific seasonal crop cycles</p>
          </div>
        </div>

        <app-data-table
          [columns]="fieldColumns"
          [data]="fieldsTableData()"
          [hasRowActions]="true"
          (actionClicked)="onViewField($event)"
        ></app-data-table>
      </div>

      <!-- Add Farm Modal Dialog -->
      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h4>Register New Farm Holding</h4>
              <button (click)="closeModal()" class="close-x">✕</button>
            </div>

            <form [formGroup]="farmForm" (ngSubmit)="onSaveFarm()" class="farm-form">
              <div class="form-group">
                <label for="farmName">Farm Holding Name</label>
                <input
                  id="farmName"
                  type="text"
                  formControlName="name"
                  placeholder="e.g. Shinde Krushi Farm - Unit 2"
                  class="form-control"
                />
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="acres">Total Area (Acres)</label>
                  <input
                    id="acres"
                    type="number"
                    step="0.1"
                    formControlName="total_area_acres"
                    class="form-control"
                  />
                </div>
                <div class="form-group flex-1">
                  <label for="village">Village / Taluka</label>
                  <input
                    id="village"
                    type="text"
                    formControlName="village"
                    placeholder="Rahata"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group flex-1">
                  <label for="soilType">Soil Profile</label>
                  <select id="soilType" formControlName="soil_type" class="form-control">
                    <option value="MEDIUM_BLACK">Medium Black (Vertisol)</option>
                    <option value="RED_LOAM">Red Loam</option>
                    <option value="CLAY_LOAM">Clay Loam</option>
                    <option value="ALLUVIAL">Alluvial</option>
                  </select>
                </div>
                <div class="form-group flex-1">
                  <label for="irrigation">Irrigation Source</label>
                  <select id="irrigation" formControlName="irrigation_source" class="form-control">
                    <option value="DRIP">Inline Drip System</option>
                    <option value="SPRINKLER">Overhead Sprinkler</option>
                    <option value="CANAL">Canal Flow</option>
                    <option value="WELL">Open Dug Well</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="desc">Description / Notes</label>
                <input
                  id="desc"
                  type="text"
                  formControlName="description"
                  placeholder="Precision holding description..."
                  class="form-control"
                />
              </div>

              <div class="modal-actions">
                <button type="button" (click)="closeModal()" class="btn btn-secondary btn-sm">Cancel</button>
                <button
                  type="submit"
                  class="btn btn-primary btn-sm"
                  [disabled]="farmForm.invalid || isSaving()"
                >
                  {{ isSaving() ? 'Persisting...' : 'Save to Database' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-shell {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .stat-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .agri-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
    }
    .farm-detail-card {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .card-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border);
    }
    .farm-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .farm-avatar {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--color-light-sage);
      border: 1px solid var(--color-sage-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
    }
    .farm-meta h3 {
      font-size: 1.25rem;
      font-weight: 800;
      color: #174C38;
    }
    .meta-sub {
      font-size: 0.8rem;
      color: var(--color-neutral-grey);
    }
    .farm-specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
    }
    .spec-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      strong { font-size: 0.95rem; color: var(--color-dark-text); }
    }
    .spec-label {
      font-size: 0.72rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--color-neutral-grey);
      letter-spacing: 0.04em;
    }
    .table-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .section-title-row h3 {
      font-size: 1.15rem;
      font-weight: 800;
      color: #174C38;
    }
    .section-title-row p {
      font-size: 0.82rem;
      color: var(--color-neutral-grey);
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(2px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-box {
      background: #ffffff;
      border-radius: var(--radius-xl);
      padding: 2rem;
      max-width: 520px;
      width: 100%;
      box-shadow: var(--shadow-lg);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--color-border);
      h4 { font-size: 1.2rem; font-weight: 800; color: #174C38; }
    }
    .close-x {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--color-neutral-grey);
    }
    .form-row { display: flex; gap: 1rem; }
    .flex-1 { flex: 1; }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }
  `]
})
export class FarmManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly farmService = inject(FarmService);
  private readonly fieldService = inject(FieldService);
  private readonly toast = inject(ToastService);

  public readonly farms = signal<Farm[]>([]);
  public readonly currentFarm = signal<Farm | null>(null);
  public readonly fields = signal<FieldPlot[]>([]);
  public readonly showModal = signal(false);
  public readonly isSaving = signal(false);

  farmForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    total_area_acres: [5.0, [Validators.required, Validators.min(0.5)]],
    village: ['Rahata', [Validators.required]],
    soil_type: ['MEDIUM_BLACK', [Validators.required]],
    irrigation_source: ['DRIP', [Validators.required]],
    description: ['']
  });

  fieldColumns: TableColumn[] = [
    { key: 'name', label: 'Plot Name' },
    { key: 'active_crop_name', label: 'Allocated Crop' },
    { key: 'area_acres', label: 'Acreage' },
    { key: 'irrigation_type', label: 'Irrigation' },
    { key: 'soil_ph', label: 'Soil pH' },
    { key: 'soil_type', label: 'Soil Type' }
  ];

  fieldsTableData(): any[] {
    return this.fields().map(f => ({
      ...f,
      area_acres: `${f.area_acres} Acres`,
      soil_ph: `pH ${f.soil_ph}`
    }));
  }

  ngOnInit(): void {
    this.loadFarmsAndFields();
  }

  loadFarmsAndFields(): void {
    this.farmService.getFarms().subscribe({
      next: (farms) => {
        this.farms.set(farms);
        if (farms.length > 0) {
          this.currentFarm.set(farms[0]);
          this.loadFields(farms[0].id);
        }
      },
      error: (err) => {
        console.warn('Error loading farms:', err);
      }
    });
  }

  loadFields(farmId: string): void {
    this.fieldService.getFields(farmId).subscribe({
      next: (fields) => {
        this.fields.set(fields);
      },
      error: (err) => {
        console.warn('Error loading fields:', err);
      }
    });
  }

  openAddFarmModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onSaveFarm(): void {
    if (this.farmForm.invalid) return;

    this.isSaving.set(true);
    const val = this.farmForm.value;
    this.farmService.createFarm({
      name: val.name,
      village: val.village,
      taluka: 'Rahata',
      district: 'Ahilyanagar',
      state: 'Maharashtra',
      total_area_acres: Number(val.total_area_acres),
      area_unit: 'acres',
      description: val.description,
      latitude: 19.712600,
      longitude: 74.484200,
      soil_type: val.soil_type,
      irrigation_source: val.irrigation_source
    }).subscribe({
      next: (createdFarm) => {
        this.isSaving.set(false);
        this.toast.success('Holding Registered', `Farm ${createdFarm.name} persisted to PostgreSQL.`);
        this.closeModal();
        this.loadFarmsAndFields();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.toast.error('Registration Failed', err.message || 'Could not save farm.');
      }
    });
  }

  onViewField(field: any): void {
    this.toast.info('Parcel Selected', `Opening geospatial details for ${field.name}`);
  }
}
