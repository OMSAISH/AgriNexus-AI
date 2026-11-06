import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { DataTableComponent, TableColumn } from '../../shared/components/data-table/data-table.component';
import { ToastService } from '../../core/services/toast.service';
import { LabourService } from '../../core/services/labour.service';
import { FarmService } from '../../core/services/farm.service';
import { LabourWorker, LabourSummary } from '../../core/models/agrinexus.models';

@Component({
  selector: 'app-labour',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatCardComponent, DataTableComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Farm Labour &amp; Field Workforce"
        subtitle="Manage daily muster rolls, tasks, piece-rate wages &amp; contractor payouts &bull; Rahata"
        badge="PostgreSQL Synced"
        badgeTheme="forest"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Resources' }, { label: 'Labour' }]"
      >
        <div header-actions class="header-actions-row">
          <button (click)="openAddWorkerModal()" class="btn btn-secondary btn-sm">+ Register Worker</button>
          <button (click)="openAttendanceModal()" class="btn btn-primary btn-sm">+ Log Daily Attendance</button>
        </div>
      </app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Active Farm Workers"
          [value]="(summary()?.active_workers || workers().length).toString()"
          unit="Workers"
          subtext="On-Duty Muster Pool"
          icon="👥"
          theme="forest"
        ></app-stat-card>
        <app-stat-card
          label="Today's Present"
          [value]="(summary()?.today_present || 0).toString()"
          unit="On Field"
          subtext="Rahata 5-Acre Holding"
          icon="✅"
          theme="emerald"
        ></app-stat-card>
        <app-stat-card
          label="Month-to-Date Wages"
          [value]="'₹' + formatVal(summary()?.month_to_date_wages || 0)"
          subtext="Direct Labor Disbursements"
          icon="💵"
          theme="info"
        ></app-stat-card>
        <app-stat-card
          label="Muster Integrity"
          value="100%"
          unit="Audited"
          subtext="Automated Rate Calculations"
          icon="🧾"
          theme="warning"
        ></app-stat-card>
      </div>

      <!-- Labour Roster Table -->
      <div class="agri-card table-card">
        <div class="table-title-bar">
          <div>
            <h4>Field Workforce Muster Roll</h4>
            <p>Assigned duties across Onion, Soybean, and Sugarcane plots</p>
          </div>
        </div>

        <app-data-table
          [columns]="labourColumns"
          [data]="tableRows()"
          [hasRowActions]="true"
          (actionClicked)="onWorkerAction($event)"
        ></app-data-table>
      </div>

      <!-- Add Worker Modal -->
      @if (showAddWorkerModal()) {
        <div class="modal-backdrop">
          <div class="agri-modal">
            <div class="modal-header">
              <h3>Register Farm Worker</h3>
              <button (click)="showAddWorkerModal.set(false)" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Full Name *</label>
                <input type="text" [(ngModel)]="newWorker.full_name" placeholder="e.g. Tukaram Shinde" class="form-control" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Skill Type *</label>
                  <select [(ngModel)]="newWorker.skill_type" class="form-control">
                    <option value="GENERAL">General Farm Labour</option>
                    <option value="OPERATOR">Machinery / Spray Operator</option>
                    <option value="HARVESTER">Harvesting Specialist</option>
                    <option value="SUPERVISOR">Field Supervisor</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Daily Wage Rate (₹) *</label>
                  <input type="number" [(ngModel)]="newWorker.daily_wage" class="form-control" min="100" step="50" />
                </div>
              </div>
              <div class="form-group">
                <label>Contact Phone Number</label>
                <input type="text" [(ngModel)]="newWorker.phone_number" placeholder="+91 98XXX XXXXX" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="showAddWorkerModal.set(false)" class="btn btn-secondary">Cancel</button>
              <button (click)="submitWorker()" class="btn btn-primary" [disabled]="isSubmitting()">Save Worker</button>
            </div>
          </div>
        </div>
      }

      <!-- Record Attendance Modal -->
      @if (showAttendanceModal()) {
        <div class="modal-backdrop">
          <div class="agri-modal">
            <div class="modal-header">
              <h3>Record Daily Attendance &amp; Wage</h3>
              <button (click)="showAttendanceModal.set(false)" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Select Worker *</label>
                <select [(ngModel)]="attPayload.labour_id" class="form-control">
                  @for (w of workers(); track w.id) {
                    <option [value]="w.id">{{ w.full_name }} (₹{{ w.daily_wage }}/day &bull; {{ w.skill_type }})</option>
                  }
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Attendance Status *</label>
                  <select [(ngModel)]="attPayload.status" class="form-control">
                    <option value="PRESENT">PRESENT (Full Day - 100% Wage)</option>
                    <option value="HALF_DAY">HALF DAY (4 Hours - 50% Wage)</option>
                    <option value="ABSENT">ABSENT (0 Wage)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Hours Worked</label>
                  <input type="number" [(ngModel)]="attPayload.hours_worked" class="form-control" min="0" max="16" step="1" />
                </div>
              </div>
              <div class="form-group">
                <label>Field Notes / Duty Undertaken</label>
                <input type="text" [(ngModel)]="attPayload.notes" placeholder="e.g. Onion field weeding and drip lateral flushing" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button (click)="showAttendanceModal.set(false)" class="btn btn-secondary">Cancel</button>
              <button (click)="submitAttendance()" class="btn btn-primary" [disabled]="isSubmitting()">Post Attendance</button>
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
export class LabourComponent implements OnInit {
  private readonly labourService = inject(LabourService);
  private readonly farmService = inject(FarmService);
  private readonly toast = inject(ToastService);

  workers = signal<LabourWorker[]>([]);
  summary = signal<LabourSummary | null>(null);
  farmId = signal<string>('');

  showAddWorkerModal = signal<boolean>(false);
  showAttendanceModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  newWorker: any = {
    full_name: '',
    skill_type: 'GENERAL',
    daily_wage: 400,
    phone_number: '',
  };

  attPayload: any = {
    labour_id: '',
    status: 'PRESENT',
    hours_worked: 8,
    notes: '',
  };

  labourColumns: TableColumn[] = [
    { key: 'name', label: 'Worker Name' },
    { key: 'role', label: 'Specialization' },
    { key: 'phone', label: 'Phone' },
    { key: 'dailyWage', label: 'Daily Wage' },
    { key: 'status', label: 'Roster Status', badgeType: true }
  ];

  ngOnInit(): void {
    this.farmService.getFarms().subscribe({
      next: (farms) => {
        if (farms.length > 0) {
          this.farmId.set(farms[0].id);
          this.loadLabourData();
        }
      },
      error: () => this.loadLabourData()
    });
  }

  loadLabourData(): void {
    const params = this.farmId() ? { farm_id: this.farmId() } : undefined;
    this.labourService.getWorkers(params).subscribe({
      next: (data) => {
        this.workers.set(data);
        if (data.length > 0 && !this.attPayload.labour_id) {
          this.attPayload.labour_id = data[0].id;
        }
      },
      error: (err) => this.toast.error('Labour Error', err.message || 'Failed to load workers')
    });

    this.labourService.getSummary(this.farmId() || undefined).subscribe({
      next: (s) => this.summary.set(s),
      error: () => {}
    });
  }

  tableRows(): any[] {
    return this.workers().map(w => ({
      id: w.id,
      name: w.full_name,
      role: w.skill_type,
      phone: w.phone_number || 'N/A',
      dailyWage: `₹${w.daily_wage} / day`,
      status: w.is_active ? 'Active Roster' : 'Inactive',
    }));
  }

  openAddWorkerModal(): void {
    this.newWorker = {
      full_name: '',
      skill_type: 'GENERAL',
      daily_wage: 400,
      phone_number: '',
    };
    this.showAddWorkerModal.set(true);
  }

  openAttendanceModal(): void {
    if (this.workers().length > 0) {
      this.attPayload.labour_id = this.workers()[0].id;
    }
    this.showAttendanceModal.set(true);
  }

  submitWorker(): void {
    if (!this.newWorker.full_name) {
      this.toast.error('Validation', 'Please provide worker name');
      return;
    }
    if (!this.farmId()) {
      this.toast.error('Error', 'No active farm holding found');
      return;
    }
    this.isSubmitting.set(true);
    const payload = { ...this.newWorker, farm_id: this.farmId() };
    this.labourService.createWorker(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.showAddWorkerModal.set(false);
        this.toast.success('Worker Enrolled', `${res.full_name} added to muster roll.`);
        this.loadLabourData();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error('Enrollment Failed', err.message || 'Could not register worker');
      }
    });
  }

  submitAttendance(): void {
    if (!this.attPayload.labour_id) {
      this.toast.error('Validation', 'Please select worker');
      return;
    }
    this.isSubmitting.set(true);
    const payload = { ...this.attPayload, farm_id: this.farmId() };
    this.labourService.recordAttendance(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.showAttendanceModal.set(false);
        this.toast.success('Attendance Logged', `Logged ${res.status} for ${res.worker_name}. Wage: ₹${res.wage_paid}`);
        this.loadLabourData();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error('Submission Failed', err.message || 'Could not record attendance');
      }
    });
  }

  onWorkerAction(row: any): void {
    if (confirm(`Remove worker "${row.name}" from active muster roll?`)) {
      this.labourService.deleteWorker(row.id).subscribe({
        next: () => {
          this.toast.success('Worker Removed', `Deleted ${row.name}`);
          this.loadLabourData();
        },
        error: (err) => this.toast.error('Deletion Failed', err.message)
      });
    }
  }

  formatVal(val: number): string {
    return Math.round(val).toLocaleString('en-IN');
  }
}
