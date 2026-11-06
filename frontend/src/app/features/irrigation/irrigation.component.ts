import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { ToastService } from '../../core/services/toast.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-irrigation',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatCardComponent, ChartCardComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Irrigation Intelligence &amp; Water Balance"
        subtitle="Soil moisture sensor telemetry, Pravara canal rotation sync, and inline drip scheduling"
        badge="Drip Automated"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Intelligence' }, { label: 'Irrigation' }]"
      >
        <div header-actions>
          <button (click)="onManualOverride()" class="btn btn-secondary btn-sm">Manual Pump Trigger</button>
          <button (click)="onScheduleModal()" class="btn btn-primary btn-sm">+ Add Irrigation Cycle</button>
        </div>
      </app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Avg Soil Moisture"
          value="64"
          unit="%"
          subtext="Target: 50%–75% (Medium Black)"
          icon="💧"
          theme="forest"
        ></app-stat-card>
        <app-stat-card
          label="Water Conserved"
          value="32.4"
          unit="%"
          subtext="vs Flood Irrigation Benchmark"
          icon="🌱"
          theme="emerald"
        ></app-stat-card>
        <app-stat-card
          label="Canal Rotation Due"
          value="4"
          unit="Days"
          subtext="Pravara Left Bank Canal"
          icon="🌊"
          theme="info"
        ></app-stat-card>
        <app-stat-card
          label="Weekly Flow Volume"
          value="18,400"
          unit="Liters"
          subtext="Across 3 Drip Laterals"
          icon="📊"
          theme="warning"
        ></app-stat-card>
      </div>

      <!-- Water Consumption Chart & Parcel Moisture Meters -->
      <div class="irrigation-dual-grid">
        <!-- Chart -->
        <app-chart-card
          title="Daily Water Consumption (Kiloliters)"
          subtitle="7-day water application across Plot 1, Plot 2, Plot 3"
          height="320px"
          [options]="waterUsageChartOptions"
        ></app-chart-card>

        <!-- Parcel Moisture Cards -->
        <div class="agri-card moisture-status-card">
          <div class="card-title-bar">
            <h4>Live Parcel Moisture Sensors</h4>
            <span class="agri-badge badge-success">Telemetry Live</span>
          </div>

          <div class="moisture-list">
            <div class="moisture-parcel-item">
              <div class="mp-header">
                <strong>Plot 1: Rabi Onion (2.0 Ac)</strong>
                <span class="mp-val optimal">62% Moisture</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill optimal" style="width: 62%;"></div>
              </div>
              <span class="mp-status">Next Drip Run: Today at 17:30 IST (90 mins)</span>
            </div>

            <div class="moisture-parcel-item">
              <div class="mp-header">
                <strong>Plot 2: Soybean (1.5 Ac)</strong>
                <span class="mp-val good">58% Moisture</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill good" style="width: 58%;"></div>
              </div>
              <span class="mp-status">Sprinkler cycle complete; hold for 3 days</span>
            </div>

            <div class="moisture-parcel-item">
              <div class="mp-header">
                <strong>Plot 3: Sugarcane (1.5 Ac)</strong>
                <span class="mp-val high">74% Moisture</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill high" style="width: 74%;"></div>
              </div>
              <span class="mp-status">Sub-surface drip operational (Grand Growth Stage)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
    .irrigation-dual-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; }
    .card-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      padding-bottom: 0.65rem;
      border-bottom: 1px solid var(--color-border);
      h4 { font-size: 1.1rem; font-weight: 800; color: #174C38; }
    }
    .moisture-list { display: flex; flex-direction: column; gap: 1.25rem; }
    .moisture-parcel-item {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      background: var(--color-warm-white);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 0.85rem;
    }
    .mp-header { display: flex; justify-content: space-between; font-size: 0.85rem; }
    .mp-val {
      font-weight: 800;
      &.optimal { color: #16845B; }
      &.good { color: #0284C7; }
      &.high { color: #D97706; }
    }
    .bar-track { height: 8px; background: #E2E8F0; border-radius: var(--radius-full); overflow: hidden; }
    .bar-fill {
      height: 100%;
      border-radius: var(--radius-full);
      &.optimal { background: #16845B; }
      &.good { background: #0284C7; }
      &.high { background: #D97706; }
    }
    .mp-status { font-size: 0.72rem; color: var(--color-neutral-grey); }

    @media (max-width: 960px) {
      .irrigation-dual-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class IrrigationComponent {
  private readonly toast = inject(ToastService);

  waterUsageChartOptions: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Plot 1 (Onion)', 'Plot 2 (Soybean)', 'Plot 3 (Sugarcane)'], textStyle: { color: '#64748B' } },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: '#CBD5E1' } },
      axisLabel: { color: '#64748B' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value} kL', color: '#64748B' },
      splitLine: { lineStyle: { color: '#F1F5F9' } }
    },
    color: ['#DC2626', '#16845B', '#D97706'],
    series: [
      { name: 'Plot 1 (Onion)', type: 'bar', stack: 'total', data: [3.2, 2.8, 3.0, 2.5, 3.4, 2.9, 3.1] },
      { name: 'Plot 2 (Soybean)', type: 'bar', stack: 'total', data: [2.0, 1.8, 2.2, 2.0, 1.9, 2.1, 2.0] },
      { name: 'Plot 3 (Sugarcane)', type: 'bar', stack: 'total', data: [4.5, 4.2, 4.6, 4.4, 4.8, 4.3, 4.5] }
    ]
  };

  onManualOverride(): void {
    this.toast.warning('Manual Override', 'Drip pump motor triggered for 30-minute flush.');
  }

  onScheduleModal(): void {
    this.toast.info('Irrigation Schedule', 'Automated valve timer configured for Plot 1.');
  }
}
