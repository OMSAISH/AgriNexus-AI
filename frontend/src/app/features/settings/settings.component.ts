import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Farm &amp; System Configuration"
        subtitle="Manage localized measurement units, notification thresholds, language preferences &bull; Rahata Farm"
        badge="Enterprise SaaS"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'System' }, { label: 'Settings' }]"
      >
        <div header-actions>
          <button (click)="saveSettings()" class="btn btn-primary btn-sm">Save All Preferences</button>
        </div>
      </app-page-header>

      <div class="settings-grid">
        <!-- Farm Profile Card -->
        <div class="agri-card settings-card">
          <div class="card-title-bar">
            <h4>Farm Estate Parameters</h4>
            <span class="agri-badge badge-forest">Holding #001</span>
          </div>

          <form [formGroup]="settingsForm" class="settings-form">
            <div class="form-group">
              <label for="farmTitle">Farm Name</label>
              <input id="farmTitle" formControlName="farmName" class="form-control" />
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label for="farmerName">Lead Operator</label>
                <input id="farmerName" formControlName="farmerName" class="form-control" />
              </div>
              <div class="form-group flex-1">
                <label for="phone">SMS / WhatsApp Number</label>
                <input id="phone" formControlName="phone" class="form-control" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label for="village">Village / Taluka</label>
                <input id="village" formControlName="village" class="form-control" />
              </div>
              <div class="form-group flex-1">
                <label for="district">District</label>
                <input id="district" formControlName="district" class="form-control" />
              </div>
            </div>
          </form>
        </div>

        <!-- Regional Preferences Card -->
        <div class="agri-card settings-card">
          <div class="card-title-bar">
            <h4>Regional &amp; Units Localization</h4>
            <span class="agri-badge badge-neutral">Multilingual</span>
          </div>

          <form [formGroup]="settingsForm" class="settings-form">
            <div class="form-group">
              <label for="lang">Platform Interface Language</label>
              <select id="lang" formControlName="language" class="form-control">
                <option value="en">English (Global Technical)</option>
                <option value="mr">मराठी (Regional Maharashtra)</option>
                <option value="hi">हिंदी (National Hindi)</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label for="unitArea">Land Area Measurement</label>
                <select id="unitArea" formControlName="areaUnit" class="form-control">
                  <option value="ACRE">Acres (Standard)</option>
                  <option value="GUNTHA">Guntha (1 Acre = 40 Guntha)</option>
                  <option value="HECTARE">Hectares (1 Hectare = 2.47 Acres)</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label for="currency">Currency Display</label>
                <select id="currency" formControlName="currency" class="form-control">
                  <option value="INR">Indian Rupee (₹ INR)</option>
                </select>
              </div>
            </div>

            <div class="checkbox-row">
              <label class="check-label">
                <input type="checkbox" formControlName="enableSms" class="custom-check" />
                <span>Receive High-Priority Frost &amp; Pest Alarms via SMS</span>
              </label>
            </div>

            <div class="checkbox-row">
              <label class="check-label">
                <input type="checkbox" formControlName="enableMandiAlerts" class="custom-check" />
                <span>Receive Daily Rahata APMC Modal Price Summary at 18:00 IST</span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .card-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.65rem;
      border-bottom: 1px solid var(--color-border);
      h4 { font-size: 1.1rem; font-weight: 800; color: #174C38; }
    }
    .form-row { display: flex; gap: 1rem; }
    .flex-1 { flex: 1; }
    .checkbox-row { margin-top: 0.75rem; }
    .check-label {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.85rem;
      color: var(--color-dark-text);
      cursor: pointer;
    }
    .custom-check { width: 18px; height: 18px; accent-color: #174C38; }

    @media (max-width: 960px) {
      .settings-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  settingsForm: FormGroup = this.fb.group({
    farmName: ['Shinde Krushi Farm - Rahata'],
    farmerName: ['Dnyaneshwar Kisan Shinde'],
    phone: ['+91-98220-12345'],
    village: ['Chitali / Rahata'],
    district: ['Ahilyanagar, Maharashtra'],
    language: ['en'],
    areaUnit: ['ACRE'],
    currency: ['INR'],
    enableSms: [true],
    enableMandiAlerts: [true]
  });

  saveSettings(): void {
    this.toast.success('Preferences Saved', 'Farm parameters & regional units updated successfully.');
  }
}
