import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import * as echarts from 'echarts';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatCardComponent, ChartCardComponent],
  template: `
    <div class="page-shell">
      <app-page-header
        title="Microclimate Weather &amp; Spray Advisories"
        subtitle="7-day agro-meteorological forecasting for Rahata, Ahilyanagar (19.7126° N, 74.4842° E)"
        badge="IMD Radar Synced"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Intelligence' }, { label: 'Weather' }]"
      ></app-page-header>

      <!-- Stat Cards -->
      <div class="stat-row">
        <app-stat-card
          label="Current Temperature"
          value="28.4"
          unit="°C"
          subtext="Scattered Clouds &bull; Daytime High"
          icon="☀️"
          theme="forest"
        ></app-stat-card>
        <app-stat-card
          label="Relative Humidity"
          value="48"
          unit="%"
          subtext="Low Fungal Spore Spread Risk"
          icon="💧"
          theme="emerald"
        ></app-stat-card>
        <app-stat-card
          label="Wind Velocity"
          value="9.2"
          unit="km/h"
          subtext="NE Wind &bull; Safe Spray Window"
          icon="💨"
          theme="info"
        ></app-stat-card>
        <app-stat-card
          label="7-Day Rainfall Prob"
          value="5"
          unit="mm"
          subtext="Clear Skies across Ahilyanagar"
          icon="🌦️"
          theme="warning"
        ></app-stat-card>
      </div>

      <!-- Temperature & Rainfall Combo Chart -->
      <app-chart-card
        title="7-Day Thermal &amp; Precipitation Forecast (Rahata)"
        subtitle="Maximum/Minimum Temperatures vs. Expected Precipitation (mm)"
        height="320px"
        [options]="weatherChartOptions"
      ></app-chart-card>

      <!-- 7-Day Forecast Cards Row -->
      <div class="forecast-cards-row">
        @for (day of forecastDays; track day.day) {
          <div class="forecast-card" [class.today]="day.isToday">
            <span class="day-title">{{ day.day }}</span>
            <span class="weather-icon">{{ day.icon }}</span>
            <div class="day-temps">
              <span class="high">{{ day.high }}°</span>
              <span class="low">{{ day.low }}°</span>
            </div>
            <span class="day-condition">{{ day.condition }}</span>
            <span class="spray-badge" [class.safe]="day.spraySafe">{{ day.spraySafe ? 'Spray Safe' : 'No Spray' }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-shell { display: flex; flex-direction: column; gap: 1.5rem; }
    .stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; }
    .forecast-cards-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 1rem;
    }
    .forecast-card {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 1rem 0.75rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      box-shadow: var(--shadow-xs);
      &.today {
        border-color: #16845B;
        background: #f0fdf4;
      }
    }
    .day-title { font-size: 0.8rem; font-weight: 700; color: #174C38; }
    .weather-icon { font-size: 1.85rem; margin: 0.2rem 0; }
    .day-temps {
      display: flex;
      gap: 0.35rem;
      font-size: 0.85rem;
      .high { font-weight: 800; color: var(--color-dark-text); }
      .low { color: var(--color-neutral-grey); }
    }
    .day-condition { font-size: 0.72rem; color: var(--color-neutral-grey); }
    .spray-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);
      background: #FEE2E2;
      color: #991B1B;
      margin-top: 0.35rem;
      &.safe { background: #E8F7F0; color: #16845B; }
    }
  `]
})
export class WeatherComponent {
  weatherChartOptions: echarts.EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Max Temp (°C)', 'Min Temp (°C)', 'Rainfall (mm)'], textStyle: { color: '#64748B' } },
    xAxis: {
      type: 'category',
      data: ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
      axisLine: { lineStyle: { color: '#CBD5E1' } }
    },
    yAxis: [
      { type: 'value', name: 'Temp (°C)', axisLabel: { formatter: '{value}°C' } },
      { type: 'value', name: 'Rain (mm)', axisLabel: { formatter: '{value} mm' } }
    ],
    color: ['#DC2626', '#0284C7', '#16845B'],
    series: [
      { name: 'Max Temp (°C)', type: 'line', smooth: true, data: [29, 30, 28, 29, 31, 30, 29] },
      { name: 'Min Temp (°C)', type: 'line', smooth: true, data: [17, 18, 16, 17, 18, 17, 16] },
      { name: 'Rainfall (mm)', type: 'bar', yAxisIndex: 1, data: [0, 0, 2, 0, 0, 0, 0] }
    ]
  };

  forecastDays = [
    { day: 'Today', icon: '🌤️', high: 29, low: 17, condition: 'Clear', spraySafe: true, isToday: true },
    { day: 'Fri', icon: '☀️', high: 30, low: 18, condition: 'Sunny', spraySafe: true, isToday: false },
    { day: 'Sat', icon: '🌦️', high: 28, low: 16, condition: 'Isolated Showers', spraySafe: false, isToday: false },
    { day: 'Sun', icon: '🌤️', high: 29, low: 17, condition: 'Partly Cloudy', spraySafe: true, isToday: false },
    { day: 'Mon', icon: '☀️', high: 31, low: 18, condition: 'Dry Heat', spraySafe: true, isToday: false },
    { day: 'Tue', icon: '🌤️', high: 30, low: 17, condition: 'Clear', spraySafe: true, isToday: false },
    { day: 'Wed', icon: '🌤️', high: 29, low: 16, condition: 'Clear', spraySafe: true, isToday: false }
  ];
}
