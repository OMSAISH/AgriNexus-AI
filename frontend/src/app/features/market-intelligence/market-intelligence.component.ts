import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { ToastService } from '../../core/services/toast.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-market-intelligence',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatCardComponent, ChartCardComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="APMC Mandi Intelligence &amp; Harvest Monetization"
        subtitle="Real-time modal rates across Rahata, Shrirampur &amp; Ahmednagar APMCs &bull; Selling vs Storing Advisories"
        badge="Rates Synced"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Intelligence' }, { label: 'Market Intelligence' }]"
      >
        <div header-actions>
          <button (click)="refreshMarketData()" class="btn btn-secondary btn-sm">🔄 Refresh Mandi Feed</button>
        </div>
      </app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Rahata Mandi (Onion)"
          value="₹2,450"
          unit="/ Qtl"
          subtext="Modal Rate &bull; Up ₹220 Today"
          icon="🧅"
          theme="forest"
          [trend]="{ direction: 'up', value: '+9.8%' }"
        ></app-stat-card>
        <app-stat-card
          label="Rahata Mandi (Soybean)"
          value="₹4,620"
          unit="/ Qtl"
          subtext="Modal Rate &bull; Variety: JS 335"
          icon="🌱"
          theme="emerald"
          [trend]="{ direction: 'up', value: '+1.7%' }"
        ></app-stat-card>
        <app-stat-card
          label="Sugarcane FRP Rate"
          value="₹3,150"
          unit="/ Ton"
          subtext="Pravara Sugar Factory Quota"
          icon="🎋"
          theme="info"
          [trend]="{ direction: 'neutral', value: 'Statutory' }"
        ></app-stat-card>
        <app-stat-card
          label="Strategic Harvest Advisory"
          value="Hold Onion"
          subtext="Expect ₹2,700 within 3 weeks"
          icon="📈"
          theme="warning"
        ></app-stat-card>
      </div>

      <!-- Commodity Tabs & ECharts Historical Trend -->
      <div class="market-chart-section">
        <div class="commodity-tabs">
          <button
            (click)="selectCommodity('onion')"
            class="tab-btn"
            [class.active]="selectedCommodity() === 'onion'"
          >
            🧅 Rabi Onion Price Curve
          </button>
          <button
            (click)="selectCommodity('soybean')"
            class="tab-btn"
            [class.active]="selectedCommodity() === 'soybean'"
          >
            🌱 Soybean Price Curve
          </button>
        </div>

        <app-chart-card
          [title]="selectedCommodity() === 'onion' ? '30-Day Modal Price Trend: Rabi Onion (₹ / Quintal)' : '30-Day Modal Price Trend: Soybean (₹ / Quintal)'"
          subtitle="Comparative price spread: Rahata APMC vs Shrirampur APMC vs Ahmednagar APMC"
          height="340px"
          [options]="activeChartOptions"
        ></app-chart-card>
      </div>

      <!-- Mandi Comparison Cards Grid -->
      <div class="mandi-cards-grid">
        <div class="agri-card mandi-card highlight">
          <div class="mandi-title-row">
            <div>
              <span class="mandi-type-badge">Primary Local APMC</span>
              <h3>Rahata APMC Market</h3>
            </div>
            <span class="agri-badge badge-success">Recommended</span>
          </div>

          <div class="price-rows">
            <div class="p-row">
              <span>Rabi Onion (Grade A)</span>
              <strong>₹2,450 / Qtl <small class="text-success">▲ +₹220</small></strong>
            </div>
            <div class="p-row">
              <span>Soybean (Dry Seed)</span>
              <strong>₹4,620 / Qtl <small class="text-success">▲ +₹80</small></strong>
            </div>
            <div class="p-row">
              <span>Daily Total Arrival</span>
              <strong>4,200 Quintals</strong>
            </div>
          </div>
          <div class="mandi-footer">
            <span>Distance: <strong>4.2 km</strong> &bull; Transport: ~₹35/qtl</span>
          </div>
        </div>

        <div class="agri-card mandi-card">
          <div class="mandi-title-row">
            <div>
              <span class="mandi-type-badge">Neighboring Sub-Market</span>
              <h3>Shrirampur APMC</h3>
            </div>
            <span class="agri-badge badge-neutral">18 km</span>
          </div>

          <div class="price-rows">
            <div class="p-row">
              <span>Rabi Onion (Grade A)</span>
              <strong>₹2,380 / Qtl <small class="text-danger">▼ -₹50</small></strong>
            </div>
            <div class="p-row">
              <span>Soybean (Dry Seed)</span>
              <strong>₹4,590 / Qtl <small class="text-neutral">Stable</small></strong>
            </div>
            <div class="p-row">
              <span>Daily Total Arrival</span>
              <strong>2,800 Quintals</strong>
            </div>
          </div>
          <div class="mandi-footer">
            <span>Distance: <strong>18 km</strong> &bull; Transport: ~₹75/qtl</span>
          </div>
        </div>

        <div class="agri-card mandi-card">
          <div class="mandi-title-row">
            <div>
              <span class="mandi-type-badge">District Center</span>
              <h3>Ahmednagar Central APMC</h3>
            </div>
            <span class="agri-badge badge-neutral">82 km</span>
          </div>

          <div class="price-rows">
            <div class="p-row">
              <span>Rabi Onion (Grade A)</span>
              <strong>₹2,510 / Qtl <small class="text-success">▲ +₹180</small></strong>
            </div>
            <div class="p-row">
              <span>Soybean (Dry Seed)</span>
              <strong>₹4,650 / Qtl <small class="text-success">▲ +₹110</small></strong>
            </div>
            <div class="p-row">
              <span>Daily Total Arrival</span>
              <strong>9,500 Quintals</strong>
            </div>
          </div>
          <div class="mandi-footer">
            <span>Distance: <strong>82 km</strong> &bull; High transport cost nullifies premium</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
    .market-chart-section { display: flex; flex-direction: column; gap: 0.75rem; }
    .commodity-tabs { display: flex; gap: 0.5rem; }
    .tab-btn {
      padding: 0.55rem 1.1rem;
      border: 1px solid var(--color-border);
      background: var(--color-surface-card);
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-dark-text);
      cursor: pointer;
      font-family: inherit;
      &.active {
        background: #174C38;
        color: #ffffff;
        border-color: #174C38;
      }
    }
    .mandi-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .mandi-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      &.highlight { border: 2px solid #16845B; }
    }
    .mandi-title-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .mandi-type-badge { font-size: 0.72rem; font-weight: 700; color: #16845B; text-transform: uppercase; }
    .mandi-title-row h3 { font-size: 1.15rem; font-weight: 800; color: #174C38; margin-top: 0.15rem; }
    .price-rows { display: flex; flex-direction: column; gap: 0.6rem; }
    .p-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.88rem;
      padding-bottom: 0.4rem;
      border-bottom: 1px solid var(--color-border-subtle);
      strong { color: var(--color-dark-text); }
    }
    .mandi-footer { font-size: 0.75rem; color: var(--color-neutral-grey); padding-top: 0.35rem; }
  `]
})
export class MarketIntelligenceComponent {
  private readonly toast = inject(ToastService);

  public readonly selectedCommodity = signal<'onion' | 'soybean'>('onion');

  onionChartOptions: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Rahata APMC', 'Shrirampur APMC', 'Ahmednagar APMC'], textStyle: { color: '#64748B' } },
    xAxis: {
      type: 'category',
      data: ['7 Oct', '14 Oct', '21 Oct', '28 Oct', '4 Nov'],
      axisLine: { lineStyle: { color: '#CBD5E1' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '₹{value}' },
      splitLine: { lineStyle: { color: '#F1F5F9' } }
    },
    color: ['#16845B', '#0284C7', '#D97706'],
    series: [
      { name: 'Rahata APMC', type: 'line', smooth: true, data: [1950, 2050, 2180, 2230, 2450], lineStyle: { width: 3 } },
      { name: 'Shrirampur APMC', type: 'line', smooth: true, data: [1920, 2010, 2150, 2200, 2380] },
      { name: 'Ahmednagar APMC', type: 'line', smooth: true, data: [2000, 2120, 2220, 2330, 2510] }
    ]
  };

  soybeanChartOptions: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Rahata APMC', 'Shrirampur APMC', 'Ahmednagar APMC'], textStyle: { color: '#64748B' } },
    xAxis: {
      type: 'category',
      data: ['7 Oct', '14 Oct', '21 Oct', '28 Oct', '4 Nov'],
      axisLine: { lineStyle: { color: '#CBD5E1' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '₹{value}' },
      splitLine: { lineStyle: { color: '#F1F5F9' } }
    },
    color: ['#16845B', '#0284C7', '#D97706'],
    series: [
      { name: 'Rahata APMC', type: 'line', smooth: true, data: [4480, 4520, 4560, 4540, 4620], lineStyle: { width: 3 } },
      { name: 'Shrirampur APMC', type: 'line', smooth: true, data: [4450, 4500, 4530, 4510, 4590] },
      { name: 'Ahmednagar APMC', type: 'line', smooth: true, data: [4510, 4550, 4600, 4580, 4650] }
    ]
  };

  get activeChartOptions(): echarts.EChartsOption {
    return this.selectedCommodity() === 'onion' ? this.onionChartOptions : this.soybeanChartOptions;
  }

  selectCommodity(c: 'onion' | 'soybean'): void {
    this.selectedCommodity.set(c);
  }

  refreshMarketData(): void {
    this.toast.success('Mandi Rates Synced', 'Updated APMC arrival volumes and modal rate curves.');
  }
}
