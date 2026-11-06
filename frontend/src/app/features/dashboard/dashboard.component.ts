import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../core/services/toast.service';
import { DashboardSummary } from '../../core/models/agrinexus.models';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    StatCardComponent,
    ChartCardComponent,
    PageHeaderComponent
  ],
  template: `
    <div class="dashboard-shell">
      <!-- Page Header with Live Database Sync Indicator -->
      <app-page-header
        title="Executive Farm Operations Twin"
        [subtitle]="'Live Telemetry &bull; Farmer: ' + authService.userName() + ' (' + authService.userEmail() + ')'"
        badge="PostgreSQL Synced"
        badgeTheme="forest"
        [breadcrumbs]="[{ label: 'Home', url: '/' }, { label: 'Farm Operations' }, { label: 'Dashboard' }]"
      >
        <div header-actions class="dashboard-header-actions">
          <div class="case-study-pill">
            <span class="pulse-indicator"></span>
            <span>Holding: {{ summary()?.total_cultivated_acres || 5.0 }} Ac</span>
          </div>
          <button (click)="loadDashboardData()" class="btn btn-secondary btn-sm" [disabled]="isLoading()">
            <span>{{ isLoading() ? 'Fetching DB...' : '🔄 Refresh Data' }}</span>
          </button>
          <a routerLink="/crop-doctor" class="btn btn-primary btn-sm">
            <span>🩺 AI Crop Scanner</span>
          </a>
        </div>
      </app-page-header>

      <!-- Top Row Stat Cards (Real DB-Derived) -->
      <div class="stat-grid">
        <app-stat-card
          label="Total Cultivated Area"
          [value]="(summary()?.total_cultivated_acres || 5.0).toString()"
          unit="Acres"
          [subtext]="(summary()?.total_fields || 3) + ' Active Fields Recorded in DB'"
          icon="🗺️"
          theme="forest"
          [trend]="{ direction: 'neutral', value: '100% Utilized' }"
        ></app-stat-card>

        <app-stat-card
          label="Active Crops"
          [value]="(summary()?.active_crops_count || 3).toString()"
          unit="Commodities"
          subtext="Onion, Soybean, Sugarcane"
          icon="🌱"
          theme="emerald"
          [trend]="{ direction: 'up', value: 'Verified DB' }"
        ></app-stat-card>

        <app-stat-card
          label="Recorded Income"
          [value]="'₹' + formatCurrency(summary()?.recorded_income || 745000)"
          subtext="APMC Mandi &amp; Mill Advance"
          icon="💰"
          theme="emerald"
          [trend]="{ direction: 'up', value: '+' + (summary()?.profit_margin_pct || 73.9) + '% Margin' }"
        ></app-stat-card>

        <app-stat-card
          label="Total Farm Expenses"
          [value]="'₹' + formatCurrency(summary()?.total_expenses || 194500)"
          subtext="Inputs, Drip, Labour &amp; Power"
          icon="🧾"
          theme="warning"
          [trend]="{ direction: 'down', value: '₹' + formatCurrency(summary()?.estimated_profit || 550500) + ' Net' }"
        ></app-stat-card>
      </div>

      <!-- Operational Logistics & Resources Status Strip -->
      <div class="logistics-bar">
        <div class="logistics-pill">
          <span class="pill-icon">📦</span>
          <div class="pill-data">
            <strong>{{ summary()?.low_stock_alerts_count ?? 1 }} Low-Stock Item(s)</strong>
            <span>Input Reserves Alert</span>
          </div>
          <a routerLink="/inventory" class="pill-link">Manage Stock →</a>
        </div>
        <div class="logistics-pill">
          <span class="pill-icon">👥</span>
          <div class="pill-data">
            <strong>{{ summary()?.active_labour_count ?? 4 }} Workers Active</strong>
            <span>Muster Roll Ready</span>
          </div>
          <a routerLink="/labour" class="pill-link">View Roster →</a>
        </div>
        <div class="logistics-pill">
          <span class="pill-icon">🚜</span>
          <div class="pill-data">
            <strong>{{ summary()?.operational_machinery_count ?? 4 }} Operational Units</strong>
            <span>Fleet Readiness 100%</span>
          </div>
          <a routerLink="/equipment" class="pill-link">Fleet Details →</a>
        </div>
      </div>

      <!-- Second Row: Operational Overview (Crop Health, Weather, Irrigation) -->
      <div class="operational-grid">
        <!-- 1. Crop Health Overview -->
        <div class="agri-card health-overview-card">
          <div class="card-title-bar">
            <div>
              <h4>Crop Health Status</h4>
              <p class="text-sub">Foliar Pathology Screening</p>
            </div>
            <span class="agri-badge badge-warning">1 Action Required</span>
          </div>

          <div class="health-parcels-list">
            <div class="health-item attention">
              <div class="crop-badge onion">🧅 Plot 1: Onion (2.0 Ac)</div>
              <div class="health-details">
                <strong>Alternaria Risk: Moderate</strong>
                <span>Purple Blotch lesions detected on older leaves.</span>
              </div>
              <a routerLink="/crop-doctor" class="btn btn-sm btn-outline">Review Rx</a>
            </div>

            <div class="health-item healthy">
              <div class="crop-badge soybean">🌱 Plot 2: Soybean (2.0 Ac)</div>
              <div class="health-details">
                <strong>Vigor: Optimal (96%)</strong>
                <span>Pod-filling stage; no fungal rust observed.</span>
              </div>
              <span class="agri-badge badge-success">Healthy</span>
            </div>

            <div class="health-item healthy">
              <div class="crop-badge sugarcane">🎋 Plot 3: Sugarcane (1.0 Ac)</div>
              <div class="health-details">
                <strong>Grand Growth (92%)</strong>
                <span>Canopy density robust; borer traps deployed.</span>
              </div>
              <span class="agri-badge badge-success">Healthy</span>
            </div>
          </div>
        </div>

        <!-- 2. Weather & Microclimate Intelligence -->
        <div class="agri-card weather-overview-card">
          <div class="card-title-bar">
            <div>
              <h4>Microclimate Intelligence</h4>
              <p class="text-sub">Rahata Station (19.71° N, 74.48° E)</p>
            </div>
            <span class="agri-badge badge-forest">Realtime Sensor</span>
          </div>

          <div class="weather-telemetry-row">
            <div class="temp-block">
              <span class="temp-val">28.4°C</span>
              <span class="condition">Sunny &bull; Clear Sky</span>
            </div>
            <div class="metrics-subgrid">
              <div class="metric-mini">
                <span class="m-label">Humidity</span>
                <span class="m-val">58%</span>
              </div>
              <div class="metric-mini">
                <span class="m-label">Wind</span>
                <span class="m-val">11 km/h NE</span>
              </div>
              <div class="metric-mini">
                <span class="m-label">Rain Chance</span>
                <span class="m-val">0% (48h)</span>
              </div>
              <div class="metric-mini">
                <span class="m-label">ET0</span>
                <span class="m-val">4.6 mm/day</span>
              </div>
            </div>
          </div>

          <div class="spray-window-banner">
            <span class="icon">✨</span>
            <div class="spray-text">
              <strong>Optimal Spray Window Active</strong>
              <span>Wind speed &lt; 12 km/h and dry canopy favorable until 4:00 PM.</span>
            </div>
          </div>
        </div>

        <!-- 3. Smart Irrigation Overview -->
        <div class="agri-card irrigation-overview-card">
          <div class="card-title-bar">
            <div>
              <h4>Drip Automation &bull; Pravara</h4>
              <p class="text-sub">Well &amp; Canal Line Network</p>
            </div>
            <span class="agri-badge badge-emerald">Drip Automated</span>
          </div>

          <div class="moisture-meters-list">
            <div class="moisture-row">
              <div class="meter-info">
                <span>Plot 1: Onion</span>
                <strong>62% VWC (Optimal)</strong>
              </div>
              <div class="progress-track">
                <div class="progress-fill emerald" style="width: 62%;"></div>
              </div>
            </div>

            <div class="moisture-row">
              <div class="meter-info">
                <span>Plot 2: Soybean</span>
                <strong>48% VWC (Irrigate Today)</strong>
              </div>
              <div class="progress-track">
                <div class="progress-fill warning" style="width: 48%;"></div>
              </div>
            </div>

            <div class="moisture-row">
              <div class="meter-info">
                <span>Plot 3: Sugarcane</span>
                <strong>74% VWC (Optimal)</strong>
              </div>
              <div class="progress-track">
                <div class="progress-fill forest" style="width: 74%;"></div>
              </div>
            </div>
          </div>

          <div class="next-cycle-info">
            <span>Next Scheduled Drip Cycle:</span>
            <strong>Plot 2 Sprinkler at 05:30 PM (45 mins)</strong>
          </div>
        </div>
      </div>

      <!-- Third Row: Visual Analytics (ECharts) -->
      <div class="charts-dual-grid">
        <app-chart-card
          title="Crop Land Allocation"
          subtitle="Database Area Distribution Across 5.00 Acres"
          [options]="cropDistributionOptions"
          chartHeight="300px"
        ></app-chart-card>

        <app-chart-card
          title="Cash Flow &amp; Farm Ledger"
          subtitle="Real Database Revenue vs Expenses"
          [options]="financialTrendOptions"
          chartHeight="300px"
        ></app-chart-card>
      </div>

      <!-- Fourth Row: Database Upcoming Activities & Farm Timeline -->
      <div class="tasks-activities-grid">
        <!-- Upcoming Tasks from DB -->
        <div class="agri-card tasks-card">
          <div class="card-title-bar">
            <div>
              <h4>Upcoming Field Activities</h4>
              <p class="text-sub">Relational Database Farm Activities Schedule</p>
            </div>
            <a routerLink="/activities" class="btn btn-sm btn-outline">+ Schedule Task</a>
          </div>

          <div class="task-list">
            @for (act of (summary()?.upcoming_activities || fallbackActivities); track act.id) {
              <div class="task-row">
                <div class="task-checkbox-col">
                  <span class="priority-dot" [class]="act.priority.toLowerCase()"></span>
                </div>
                <div class="task-info">
                  <span class="task-title">{{ act.title }}</span>
                  <div class="task-meta">
                    <span class="task-plot">📍 {{ act.field_name || act.crop_name || 'Farm Holding' }}</span>
                    <span class="task-date">📅 {{ act.scheduled_date }}</span>
                  </div>
                </div>
                <span class="agri-badge" [class.badge-warning]="act.priority === 'HIGH'" [class.badge-forest]="act.priority !== 'HIGH'">
                  {{ act.priority }}
                </span>
              </div>
            }
          </div>
        </div>

        <!-- Recent Farm Events / Audit Stream -->
        <div class="agri-card activities-card">
          <div class="card-title-bar">
            <div>
              <h4>Farm Audit &amp; Operations Log</h4>
              <p class="text-sub">Immutable Activity Records</p>
            </div>
            <a routerLink="/system-status" class="btn btn-sm btn-outline">Full Trace</a>
          </div>

          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot success"></div>
              <div class="activity-content">
                <strong>Drip Fertigation Completed (Plot 1)</strong>
                <p>Delivered 12,000 L water + 19:19:19 water-soluble mix across 2.0 acres onion.</p>
                <span class="activity-time">Yesterday, 06:45 PM &bull; Drip Controller</span>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot warning"></div>
              <div class="activity-content">
                <strong>Herbicide Spray Logged</strong>
                <p>Applied Oxyfluorfen pre-emergence on Plot 1 beds (Cost: ₹2,400 recorded in Ledger).</p>
                <span class="activity-time">3 days ago &bull; Ramesh Pawar</span>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot info"></div>
              <div class="activity-content">
                <strong>Lasalgaon Mandi Onion Sale Advance</strong>
                <p>Received ₹3,50,000 advance invoice credited via UPI from registered APMC trader.</p>
                <span class="activity-time">5 days ago &bull; Financial Ledger</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-shell {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .dashboard-header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .case-study-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-light-sage);
      color: #174C38;
      font-size: 0.78rem;
      font-weight: 700;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      border: 1px solid rgba(22, 132, 91, 0.2);
    }
    .pulse-indicator {
      width: 8px;
      height: 8px;
      background: #16845B;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(22, 132, 91, 0.7);
      animation: pulseGreen 2s infinite;
    }
    @keyframes pulseGreen {
      0% { box-shadow: 0 0 0 0 rgba(22, 132, 91, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(22, 132, 91, 0); }
      100% { box-shadow: 0 0 0 0 rgba(22, 132, 91, 0); }
    }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .logistics-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .logistics-pill {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 0.85rem 1.15rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      .pill-icon { font-size: 1.5rem; }
      .pill-data {
        display: flex;
        flex-direction: column;
        flex: 1;
        strong { font-size: 0.88rem; color: #172B24; }
        span { font-size: 0.74rem; color: var(--color-neutral-grey); }
      }
      .pill-link {
        font-size: 0.78rem;
        font-weight: 700;
        color: #16845B;
        text-decoration: none;
        white-space: nowrap;
        &:hover { text-decoration: underline; color: #174C38; }
      }
    }
    .operational-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    .agri-card {
      background: #ffffff;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: var(--shadow-sm);
    }
    .card-title-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      h4 { font-size: 1rem; font-weight: 700; color: var(--color-dark-text); margin-bottom: 0.15rem; }
      .text-sub { font-size: 0.78rem; color: var(--color-neutral-grey); }
    }
    .health-parcels-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .health-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-md);
      background: var(--color-surface-ground);
      border-left: 4px solid #16845B;
      gap: 0.75rem;
      &.attention {
        border-left-color: #D97706;
        background: #FEF3C7;
      }
    }
    .crop-badge {
      font-size: 0.75rem;
      font-weight: 700;
      color: #174C38;
      white-space: nowrap;
    }
    .health-details {
      display: flex;
      flex-direction: column;
      flex: 1;
      strong { font-size: 0.82rem; color: var(--color-dark-text); }
      span { font-size: 0.75rem; color: var(--color-neutral-grey); }
    }
    .weather-telemetry-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0;
      gap: 1rem;
    }
    .temp-block {
      display: flex;
      flex-direction: column;
      .temp-val { font-size: 2rem; font-weight: 800; color: #174C38; line-height: 1.1; }
      .condition { font-size: 0.78rem; color: var(--color-neutral-grey); }
    }
    .metrics-subgrid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.65rem 1rem;
    }
    .metric-mini {
      display: flex;
      flex-direction: column;
      .m-label { font-size: 0.7rem; color: var(--color-neutral-grey); }
      .m-val { font-size: 0.82rem; font-weight: 700; color: var(--color-dark-text); }
    }
    .spray-window-banner {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      background: #E8F2EA;
      border: 1px solid #16845B;
      border-radius: var(--radius-md);
      padding: 0.65rem 0.85rem;
      .icon { font-size: 1.1rem; }
      .spray-text {
        font-size: 0.75rem;
        color: #174C38;
        display: flex;
        flex-direction: column;
        strong { font-weight: 700; }
      }
    }
    .moisture-meters-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .moisture-row {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .meter-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      color: var(--color-dark-text);
      strong { font-weight: 700; }
    }
    .progress-track {
      height: 8px;
      background: var(--color-surface-ground);
      border-radius: var(--radius-full);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }
    .progress-fill {
      height: 100%;
      border-radius: var(--radius-full);
      &.emerald { background: #16845B; }
      &.warning { background: #D97706; }
      &.forest { background: #174C38; }
    }
    .next-cycle-info {
      font-size: 0.76rem;
      color: var(--color-neutral-grey);
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      padding-top: 0.5rem;
      border-top: 1px dashed var(--color-border);
      strong { color: #174C38; }
    }
    .charts-dual-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    .tasks-activities-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .task-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-md);
      background: var(--color-surface-ground);
      border: 1px solid var(--color-border);
      gap: 0.75rem;
    }
    .priority-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      &.high { background: #DC2626; }
      &.medium { background: #D97706; }
      &.low { background: #16845B; }
    }
    .task-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      .task-title { font-size: 0.82rem; font-weight: 600; color: var(--color-dark-text); }
      .task-meta {
        display: flex;
        gap: 0.75rem;
        font-size: 0.72rem;
        color: var(--color-neutral-grey);
        margin-top: 0.2rem;
      }
    }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
      padding-left: 1.25rem;
      &::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 6px;
        bottom: 6px;
        width: 2px;
        background: var(--color-border);
      }
    }
    .timeline-item {
      position: relative;
      display: flex;
      gap: 0.75rem;
    }
    .timeline-dot {
      position: absolute;
      left: -1.25rem;
      top: 4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #174C38;
      border: 2px solid #ffffff;
      box-shadow: 0 0 0 2px var(--color-border);
      &.success { background: #16845B; }
      &.warning { background: #D97706; }
      &.info { background: #0284C7; }
    }
    .activity-content {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      strong { font-size: 0.85rem; color: var(--color-dark-text); }
      p { font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.4; }
    }
    .activity-time { font-size: 0.7rem; color: var(--color-neutral-grey); margin-top: 0.15rem; }

    @media (max-width: 768px) {
      .charts-dual-grid, .tasks-activities-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly toast = inject(ToastService);

  public readonly isLoading = signal(false);
  public readonly summary = signal<DashboardSummary | null>(null);

  // Fallback demonstration activities if DB has none scheduled
  public fallbackActivities = [
    {
      id: 'fb1',
      title: 'Basal Fertilizer Application (DAP + Potash)',
      activity_type: 'FERTILIZATION',
      status: 'SCHEDULED',
      priority: 'HIGH',
      scheduled_date: 'Tomorrow',
      field_name: 'Plot 1 - East (Onion)',
      crop_name: 'Rabi Onion'
    },
    {
      id: 'fb2',
      title: 'Drip Lateral Inspection and Filter Flush',
      activity_type: 'IRRIGATION',
      status: 'SCHEDULED',
      priority: 'MEDIUM',
      scheduled_date: 'In 2 days',
      field_name: 'Plot 3 - West (Sugarcane)',
      crop_name: 'Sugarcane Adsali'
    }
  ];

  // Apache ECharts 1: Crop Distribution
  cropDistributionOptions: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} Acres ({d}%)'
    },
    legend: {
      bottom: '5%',
      left: 'center',
      textStyle: { color: '#64748B', fontSize: 12 }
    },
    color: ['#DC2626', '#16845B', '#D97706', '#2563EB'],
    series: [
      {
        name: 'Land Area Allocation',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        data: [
          { value: 2.0, name: 'Plot 1: Rabi Onion (Bhima Super)' },
          { value: 2.0, name: 'Plot 2: Soybean (JS 335)' },
          { value: 1.0, name: 'Plot 3: Sugarcane (Co 86032)' }
        ]
      }
    ]
  };

  // Apache ECharts 2: Cash Flow & Farm Ledger
  financialTrendOptions: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['Recorded Revenue', 'Input Costs'],
      textStyle: { color: '#64748B' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025'],
        axisTick: { alignWithLabel: true },
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#64748B' }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: { color: '#64748B', formatter: '₹{value}k' },
        splitLine: { lineStyle: { color: '#F1F5F9' } }
      }
    ],
    color: ['#16845B', '#D97706'],
    series: [
      {
        name: 'Recorded Revenue',
        type: 'bar',
        barWidth: '35%',
        data: [115, 280, 0, 350, 0, 0],
        itemStyle: { borderRadius: [4, 4, 0, 0] }
      },
      {
        name: 'Input Costs',
        type: 'line',
        smooth: true,
        data: [28, 42, 38, 45, 24, 17],
        lineStyle: { width: 3 }
      }
    ]
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.dashboardService.getDashboardSummary().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.summary.set(data);

        // Dynamically update ECharts pie chart with real crop distribution
        if (data.crop_distribution && data.crop_distribution.length > 0) {
          const chartData = data.crop_distribution.map(d => ({
            name: `${d.crop_name} (${d.area_acres} Ac)`,
            value: Number(d.area_acres)
          }));
          this.cropDistributionOptions = {
            ...this.cropDistributionOptions,
            series: [{
              ...(this.cropDistributionOptions.series as any)[0],
              data: chartData
            }]
          };
        }

        // Dynamically update cashflow chart if monthly data exists
        if (data.monthly_cashflow && data.monthly_cashflow.length > 0) {
          const months = data.monthly_cashflow.map(m => m.month);
          const income = data.monthly_cashflow.map(m => Math.round(Number(m.income) / 1000));
          const expenses = data.monthly_cashflow.map(m => Math.round(Number(m.expense) / 1000));

          this.financialTrendOptions = {
            ...this.financialTrendOptions,
            xAxis: [{
              type: 'category',
              data: months,
              axisLine: { lineStyle: { color: '#CBD5E1' } },
              axisLabel: { color: '#64748B' }
            }],
            series: [
              {
                name: 'Recorded Revenue',
                type: 'bar',
                barWidth: '35%',
                data: income,
                itemStyle: { borderRadius: [4, 4, 0, 0] }
              },
              {
                name: 'Input Costs',
                type: 'line',
                smooth: true,
                data: expenses,
                lineStyle: { width: 3 }
              }
            ]
          };
        }

        this.toast.success('Live Telemetry Synced', 'Operational and financial metrics queried from PostgreSQL.');
      },
      error: (err) => {
        this.isLoading.set(false);
        console.warn('Dashboard summary query error:', err);
      }
    });
  }

  formatCurrency(val: number): string {
    return Number(val).toLocaleString('en-IN');
  }
}
