import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ToastService } from '../../core/services/toast.service';
import { CropService } from '../../core/services/crop.service';
import { FarmService } from '../../core/services/farm.service';
import { Crop, CropPerformanceSummary } from '../../core/models/agrinexus.models';

@Component({
  selector: 'app-crop-lifecycle',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatCardComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Crop Phenological Lifecycle &amp; Yield Management"
        subtitle="Botanical development tracking from germination to harvest &bull; Rahata Farm Holding"
        badge="PostgreSQL Synced"
        badgeTheme="forest"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Crop Operations' }, { label: 'Lifecycle' }]"
      >
        <div header-actions>
          <button (click)="openAdvanceModal()" class="btn btn-primary btn-sm">⏩ Advance Phenology Stage</button>
        </div>
      </app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Active Crop Cultivation"
          [value]="(summary()?.total_cultivated_area || 5.0).toString()"
          unit="Acres"
          subtext="100% Parcel Utilization"
          icon="🌱"
          theme="forest"
        ></app-stat-card>
        <app-stat-card
          label="Crops Tracked"
          [value]="(summary()?.total_active_crops || crops().length).toString()"
          unit="Commodities"
          subtext="Onion, Soybean, Sugarcane"
          icon="🧅"
          theme="emerald"
        ></app-stat-card>
        <app-stat-card
          label="Target Onion Yield"
          value="18.5"
          unit="Tons"
          subtext="Bhima Super (Plot 1)"
          icon="⚖️"
          theme="info"
        ></app-stat-card>
        <app-stat-card
          label="Maturity Readiness"
          value="75%"
          unit="Avg"
          subtext="Late Rabi Harvest Window"
          icon="📅"
          theme="warning"
        ></app-stat-card>
      </div>

      <!-- Crop Performance Cards Grid -->
      <div class="crops-lifecycle-grid">
        @for (crop of crops(); track crop.id) {
          <div class="agri-card lifecycle-card">
            <div class="lifecycle-header">
              <div>
                <span class="crop-type-badge">{{ crop.crop_type }}</span>
                <h3>{{ crop.crop_name }} — {{ crop.variety || 'Certified' }}</h3>
                <p>Sown: {{ crop.sowing_date }} &bull; Target Moisture: {{ crop.target_moisture_min }}% – {{ crop.target_moisture_max }}%</p>
              </div>
              <div class="stage-pill">
                <span class="pulse-dot"></span>
                <strong>{{ crop.current_stage }}</strong>
              </div>
            </div>

            <!-- Phenological Stage Progression -->
            <div class="stages-timeline">
              @for (st of phenologyStages; track st.id) {
                <div class="stage-step" [class.completed]="isStagePassed(crop.current_stage, st.id)" [class.current]="crop.current_stage === st.id">
                  <div class="step-marker">
                    {{ isStagePassed(crop.current_stage, st.id) ? '✓' : crop.current_stage === st.id ? '●' : '○' }}
                  </div>
                  <div class="step-info">
                    <strong>{{ st.name }}</strong>
                    <span>{{ st.description }}</span>
                  </div>
                </div>
              }
            </div>

            <div class="lifecycle-footer">
              <div class="yield-badge">
                <span>Field: {{ crop.field_name || 'Assigned Plot' }}</span>
              </div>
              <button (click)="selectCropForTransition(crop)" class="btn btn-secondary btn-sm">
                Advance Stage →
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Advance Stage Modal -->
      @if (showStageModal()) {
        <div class="modal-backdrop">
          <div class="agri-modal">
            <div class="modal-header">
              <h3>Advance Phenological Growth Stage</h3>
              <button (click)="showStageModal.set(false)" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Select Crop *</label>
                <select [(ngModel)]="selectedCropId" class="form-control">
                  @for (c of crops(); track c.id) {
                    <option [value]="c.id">{{ c.crop_name }} (Current: {{ c.current_stage }})</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label>Target Phenology Stage *</label>
                <select [(ngModel)]="newStage" class="form-control">
                  <option value="SOWING">SOWING (Seed sowing / emergence)</option>
                  <option value="VEGETATIVE">VEGETATIVE (Foliage &amp; tiller growth)</option>
                  <option value="FLOWERING">FLOWERING (Flower initiation / bulbing)</option>
                  <option value="MATURITY">MATURITY (Physiological maturity)</option>
                  <option value="HARVESTED">HARVESTED (Completed crop cycle)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Agronomic Inspection Notes</label>
                <input type="text" [(ngModel)]="transitionNotes" placeholder="e.g. Neck fall observed in 50% bulbs; irrigation terminated" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="showStageModal.set(false)" class="btn btn-secondary">Cancel</button>
              <button (click)="submitStageTransition()" class="btn btn-primary" [disabled]="isSubmitting()">Apply Stage Transition</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
    .crops-lifecycle-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .lifecycle-card { display: flex; flex-direction: column; gap: 1.25rem; }
    .lifecycle-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--color-border);
      .crop-type-badge { font-size: 0.72rem; font-weight: 700; color: #16845B; text-transform: uppercase; }
      h3 { font-size: 1.2rem; font-weight: 800; color: #174C38; margin: 0.2rem 0; }
      p { font-size: 0.82rem; color: var(--color-neutral-grey); }
    }
    .stage-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #E8F2EA;
      color: #174C38;
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 700;
      .pulse-dot {
        width: 8px; height: 8px; border-radius: 50%; background: #16845B;
        box-shadow: 0 0 6px rgba(22,132,91,0.6);
      }
    }
    .stages-timeline {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    .stage-step {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 0.85rem;
      background: #FAFBF8;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      transition: all 0.2s ease;
      &.completed {
        border-color: #16845B;
        background: #F0FDF4;
        .step-marker { background: #16845B; color: #FFF; }
      }
      &.current {
        border-color: #174C38;
        background: #E8F2EA;
        box-shadow: 0 2px 8px rgba(23,76,56,0.15);
        .step-marker { background: #174C38; color: #FFF; }
      }
      .step-marker {
        width: 24px; height: 24px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: #E5E7EB; color: #64748B; font-size: 0.75rem; font-weight: 800;
      }
      .step-info strong { display: block; font-size: 0.88rem; color: #172B24; }
      .step-info span { font-size: 0.74rem; color: #64748B; }
    }
    .lifecycle-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border);
    }
    .yield-badge { font-size: 0.82rem; color: #64748B; font-weight: 600; }
    .modal-backdrop {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; backdrop-filter: blur(3px);
    }
    .agri-modal {
      background: #FFF; border-radius: 12px; width: 90%; max-width: 500px;
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
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 0.75rem;
      margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #E5E7EB;
    }
  `]
})
export class CropLifecycleComponent implements OnInit {
  private readonly cropService = inject(CropService);
  private readonly farmService = inject(FarmService);
  private readonly toast = inject(ToastService);

  crops = signal<Crop[]>([]);
  summary = signal<CropPerformanceSummary | null>(null);

  showStageModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  selectedCropId: string = '';
  newStage: string = 'VEGETATIVE';
  transitionNotes: string = '';

  phenologyStages = [
    { id: 'SOWING', name: '1. Sowing / Emergence', description: 'Bed prep, seed placement, initial rooting' },
    { id: 'VEGETATIVE', name: '2. Vegetative Growth', description: 'Canopy formation, tiller & leaf flush' },
    { id: 'FLOWERING', name: '3. Flowering / Bulbing', description: 'Bulb swell, sucrose accumulation' },
    { id: 'MATURITY', name: '4. Physiological Maturity', description: 'Neck fall, moisture dry-down' },
    { id: 'HARVESTED', name: '5. Harvest & Curing', description: 'Field curing, grade sorting, storage' },
  ];

  private readonly stageOrder = ['SOWING', 'VEGETATIVE', 'FLOWERING', 'MATURITY', 'HARVESTED'];

  ngOnInit(): void {
    this.loadCrops();
  }

  loadCrops(): void {
    this.cropService.getCrops().subscribe({
      next: (data) => {
        this.crops.set(data);
        if (data.length > 0 && !this.selectedCropId) {
          this.selectedCropId = data[0].id;
        }
      },
      error: (err) => this.toast.error('Crop Error', err.message || 'Failed to load crops')
    });

    this.cropService.getPerformanceSummary().subscribe({
      next: (s) => this.summary.set(s),
      error: () => {}
    });
  }

  isStagePassed(currentStage: string, checkStage: string): boolean {
    const curIdx = this.stageOrder.indexOf(currentStage);
    const chkIdx = this.stageOrder.indexOf(checkStage);
    return curIdx > chkIdx;
  }

  openAdvanceModal(): void {
    if (this.crops().length > 0) {
      this.selectedCropId = this.crops()[0].id;
    }
    this.showStageModal.set(true);
  }

  selectCropForTransition(crop: Crop): void {
    this.selectedCropId = crop.id;
    const curIdx = this.stageOrder.indexOf(crop.current_stage);
    if (curIdx < this.stageOrder.length - 1) {
      this.newStage = this.stageOrder[curIdx + 1];
    }
    this.showStageModal.set(true);
  }

  submitStageTransition(): void {
    if (!this.selectedCropId) {
      this.toast.error('Validation', 'Please select crop');
      return;
    }
    this.isSubmitting.set(true);
    this.cropService.transitionStage(this.selectedCropId, this.newStage, this.transitionNotes).subscribe({
      next: (updated) => {
        this.isSubmitting.set(false);
        this.showStageModal.set(false);
        this.toast.success('Stage Advanced', `${updated.crop_name} transitioned to ${updated.current_stage}. Activity timeline logged.`);
        this.loadCrops();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error('Transition Failed', err.message || 'Could not advance growth stage');
      }
    });
  }
}
