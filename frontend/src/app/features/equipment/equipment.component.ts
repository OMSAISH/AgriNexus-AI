import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { ToastService } from '../../core/services/toast.service';
import { EquipmentService } from '../../core/services/equipment.service';
import { FarmService } from '../../core/services/farm.service';
import { EquipmentItem, EquipmentSummary } from '../../core/models/agrinexus.models';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatCardComponent, DataTableComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Farm Machinery &amp; Equipment Maintenance"
        subtitle="Operational readiness, maintenance schedules &amp; Custom Hiring Center (CHC) machinery"
        badge="PostgreSQL Synced"
        badgeTheme="forest"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Resources' }, { label: 'Equipment' }]"
      >
        <div header-actions class="header-actions-row">
          <button (click)="openAddModal()" class="btn btn-secondary btn-sm">+ Register Machinery</button>
          <button (click)="openMaintModal()" class="btn btn-primary btn-sm">+ Log Service Record</button>
        </div>
      </app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Total Machinery"
          [value]="(summary()?.total_equipment || fleet().length).toString()"
          unit="Units"
          subtext="Owned Farm Machinery"
          icon="🚜"
          theme="forest"
        ></app-stat-card>
        <app-stat-card
          label="Operational Readiness"
          [value]="(summary()?.operational_count || 0).toString()"
          unit="Active"
          subtext="Ready for Field Duties"
          icon="⚙️"
          theme="emerald"
        ></app-stat-card>
        <app-stat-card
          label="In Maintenance"
          [value]="(summary()?.maintenance_count || 0).toString()"
          unit="Units"
          subtext="Overhaul / Garage Service"
          icon="🔧"
          theme="warning"
        ></app-stat-card>
        <app-stat-card
          label="Upcoming Services"
          [value]="(summary()?.upcoming_services_count || 0).toString()"
          unit="Scheduled"
          subtext="Routine Oil &amp; Filter Checks"
          icon="📅"
          theme="info"
        ></app-stat-card>
      </div>

      <!-- Equipment Table -->
      <div class="agri-card table-card">
        <div class="table-title-bar">
          <div>
            <h4>Farm Machinery Fleet</h4>
            <p>Status, specs, and service history for Rahata operations</p>
          </div>
        </div>

        <app-data-table
          [columns]="equipmentColumns"
          [data]="tableRows()"
          [hasRowActions]="true"
          (actionClicked)="onEquipAction($event)"
        ></app-data-table>
      </div>

      <!-- Add Equipment Modal -->
      @if (showAddModal()) {
        <div class="modal-backdrop">
          <div class="agri-modal">
            <div class="modal-header">
              <h3>Register Farm Equipment</h3>
              <button (click)="showAddModal.set(false)" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Asset Name *</label>
                <input type="text" [(ngModel)]="newEquip.name" placeholder="e.g. Swaraj 744 FE Tractor" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Type *</label>
                  <select [(ngModel)]="newEquip.equipment_type" class="form-control">
                    <option value="TRACTOR">Tractor</option>
                    <option value="TILLER">Power Tiller / Rotavator</option>
                    <option value="SPRAYER">Sprayer / Knapsack</option>
                    <option value="PUMP">Submersible Pump</option>
                    <option value="HARVESTER">Combine / Harvester</option>
                    <option value="DRIP_CONTROLLER">Drip Controller Valve</option>
                    <option value="OTHER">Other Machinery</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Status *</label>
                  <select [(ngModel)]="newEquip.status" class="form-control">
                    <option value="OPERATIONAL">OPERATIONAL</option>
                    <option value="MAINTENANCE">IN MAINTENANCE</option>
                    <option value="RETIRED">RETIRED</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Model Number</label>
                  <input type="text" [(ngModel)]="newEquip.model_number" placeholder="e.g. 744-FE-2022" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Purchase Cost (₹)</label>
                  <input type="number" [(ngModel)]="newEquip.purchase_price" class="form-control" min="0" step="5000" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="showAddModal.set(false)" class="btn btn-secondary">Cancel</button>
              <button (click)="submitNewEquipment()" class="btn btn-primary" [disabled]="isSubmitting()">Register Asset</button>
            </div>
          </div>
        </div>
      }

      <!-- Log Service Modal -->
      @if (showMaintModal()) {
        <div class="modal-backdrop">
          <div class="agri-modal">
            <div class="modal-header">
              <h3>Log Maintenance Service Record</h3>
              <button (click)="showMaintModal.set(false)" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Select Equipment *</label>
                <select [(ngModel)]="maintPayload.equipment_id" class="form-control">
                  @for (eq of fleet(); track eq.id) {
                    <option [value]="eq.id">{{ eq.name }} ({{ eq.equipment_type }} &bull; {{ eq.status }})</option>
                  }
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Service Type *</label>
                  <select [(ngModel)]="maintPayload.service_type" class="form-control">
                    <option value="ROUTINE">Routine Maintenance / Oil Change</option>
                    <option value="REPAIR">Repair / Component Replacement</option>
                    <option value="OVERHAUL">Full Seasonal Overhaul</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Service Cost (₹) *</label>
                  <input type="number" [(ngModel)]="maintPayload.cost" class="form-control" min="0" step="100" />
                </div>
              </div>
              <div class="form-group">
                <label>Work Description *</label>
                <input type="text" [(ngModel)]="maintPayload.description" placeholder="e.g. Engine oil replaced, filter cleaned, greased PTO shaft" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Technician / Garage</label>
                  <input type="text" [(ngModel)]="maintPayload.technician_name" placeholder="e.g. Rahata Agro Mechanics" class="form-control" />
                </div>
                <div class="form-group">
                  <label>Next Service Due Date</label>
                  <input type="date" [(ngModel)]="maintPayload.next_service_due" class="form-control" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="showMaintModal.set(false)" class="btn btn-secondary">Cancel</button>
              <button (click)="submitMaintenance()" class="btn btn-primary" [disabled]="isSubmitting()">Post Service Record</button>
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
    .table-card { display: flex; flex-direction: column; gap: 1rem; }
    .table-title-bar h4 { font-size: 1.15rem; font-weight: 800; color: #174C38; }
    .table-title-bar p { font-size: 0.82rem; color: var(--color-neutral-grey); }
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(3px);
    }
    .agri-modal {
      background: #FFF;
      border-radius: var(--radius-lg, 12px);
      width: 90%;
      max-width: 520px;
      padding: 1.5rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      h3 { font-size: 1.2rem; font-weight: 800; color: #174C38; }
      .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #888; }
    }
    .modal-body { display: flex; flex-direction: column; gap: 1rem; }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      label { font-size: 0.82rem; font-weight: 700; color: #172B24; }
      .form-control {
        padding: 0.6rem 0.8rem;
        border: 1px solid #D1D5DB;
        border-radius: 6px;
        font-size: 0.88rem;
      }
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #E5E7EB;
    }
  `]
})
export class EquipmentComponent implements OnInit {
  private readonly equipmentService = inject(EquipmentService);
  private readonly farmService = inject(FarmService);
  private readonly toast = inject(ToastService);

  fleet = signal<EquipmentItem[]>([]);
  summary = signal<EquipmentSummary | null>(null);
  farmId = signal<string>('');

  showAddModal = signal<boolean>(false);
  showMaintModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  newEquip: any = {
    name: '',
    equipment_type: 'TRACTOR',
    status: 'OPERATIONAL',
    model_number: '',
    purchase_price: 250000,
  };

  maintPayload: any = {
    equipment_id: '',
    service_type: 'ROUTINE',
    cost: 1500,
    description: '',
    technician_name: 'Local Agro Workshop, Rahata',
    next_service_due: '',
  };

  equipmentColumns: TableColumn[] = [
    { key: 'name', label: 'Equipment Asset' },
    { key: 'type', label: 'Category' },
    { key: 'model', label: 'Model' },
    { key: 'serviceCount', label: 'Service Logs' },
    { key: 'nextService', label: 'Next Due' },
    { key: 'status', label: 'Status', badgeType: true }
  ];

  ngOnInit(): void {
    this.farmService.getFarms().subscribe({
      next: (farms) => {
        if (farms.length > 0) {
          this.farmId.set(farms[0].id);
          this.loadFleet();
        }
      },
      error: () => this.loadFleet()
    });
  }

  loadFleet(): void {
    const params = this.farmId() ? { farm_id: this.farmId() } : undefined;
    this.equipmentService.getEquipment(params).subscribe({
      next: (data) => {
        this.fleet.set(data);
        if (data.length > 0 && !this.maintPayload.equipment_id) {
          this.maintPayload.equipment_id = data[0].id;
        }
      },
      error: (err) => this.toast.error('Fleet Error', err.message || 'Failed to load equipment')
    });

    this.equipmentService.getSummary(this.farmId() || undefined).subscribe({
      next: (s) => this.summary.set(s),
      error: () => {}
    });
  }

  tableRows(): any[] {
    return this.fleet().map(e => ({
      id: e.id,
      name: e.name,
      type: e.equipment_type,
      model: e.model_number || 'Standard',
      serviceCount: `${e.maintenance_count || 0} logged`,
      nextService: e.next_service_due || 'On Schedule',
      status: e.status,
    }));
  }

  openAddModal(): void {
    this.newEquip = {
      name: '',
      equipment_type: 'TRACTOR',
      status: 'OPERATIONAL',
      model_number: '',
      purchase_price: 250000,
    };
    this.showAddModal.set(true);
  }

  openMaintModal(): void {
    if (this.fleet().length > 0) {
      this.maintPayload.equipment_id = this.fleet()[0].id;
    }
    this.showMaintModal.set(true);
  }

  submitNewEquipment(): void {
    if (!this.newEquip.name) {
      this.toast.error('Validation', 'Please provide equipment name');
      return;
    }
    if (!this.farmId()) {
      this.toast.error('Error', 'No active farm holding found');
      return;
    }
    this.isSubmitting.set(true);
    const payload = { ...this.newEquip, farm_id: this.farmId() };
    this.equipmentService.createEquipment(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.showAddModal.set(false);
        this.toast.success('Asset Enrolled', `${res.name} added to machinery fleet.`);
        this.loadFleet();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error('Registration Failed', err.message || 'Could not register equipment');
      }
    });
  }

  submitMaintenance(): void {
    if (!this.maintPayload.equipment_id || !this.maintPayload.description) {
      this.toast.error('Validation', 'Please select machinery and describe service work');
      return;
    }
    this.isSubmitting.set(true);
    this.equipmentService.logMaintenance(this.maintPayload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.showMaintModal.set(false);
        this.toast.success('Maintenance Logged', `Logged ${res.service_type} for ${res.equipment_name}. Cost: ₹${res.cost}`);
        this.loadFleet();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error('Submission Failed', err.message || 'Could not record service record');
      }
    });
  }

  onEquipAction(row: any): void {
    if (confirm(`Remove equipment "${row.name}" from fleet registry?`)) {
      this.equipmentService.deleteEquipment(row.id).subscribe({
        next: () => {
          this.toast.success('Equipment Removed', `Deleted ${row.name}`);
          this.loadFleet();
        },
        error: (err) => this.toast.error('Deletion Failed', err.message)
      });
    }
  }
}
