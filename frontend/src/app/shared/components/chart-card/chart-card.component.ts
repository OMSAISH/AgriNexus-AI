import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-card">
      <div class="chart-header">
        <div class="chart-titles">
          <h4 class="chart-title">{{ title }}</h4>
          @if (subtitle) {
            <p class="chart-subtitle">{{ subtitle }}</p>
          }
        </div>
        <div class="chart-actions">
          <ng-content select="[chart-actions]"></ng-content>
        </div>
      </div>

      <div class="chart-wrapper">
        <div #chartContainer class="chart-container" [style.height]="height"></div>
      </div>
    </div>
  `,
  styles: [`
    .chart-card {
      background: var(--color-surface-card);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .chart-titles {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .chart-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-dark-text);
      letter-spacing: -0.01em;
    }

    .chart-subtitle {
      font-size: 0.8rem;
      color: var(--color-neutral-grey);
    }

    .chart-wrapper {
      position: relative;
      width: 100%;
      flex: 1;
      min-height: 200px;
    }

    .chart-container {
      width: 100%;
    }
  `]
})
export class ChartCardComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() height: string = '300px';
  @Input() options?: echarts.EChartsOption;

  private chartInstance?: echarts.ECharts;
  private resizeObserver?: ResizeObserver;

  ngOnInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.chartInstance && this.options) {
      this.chartInstance.setOption(this.options, true);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }

  private initChart(): void {
    if (!this.chartContainer?.nativeElement) return;

    this.chartInstance = echarts.init(this.chartContainer.nativeElement);
    if (this.options) {
      this.chartInstance.setOption(this.options);
    }

    // Set up responsive auto-resize
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.chartInstance?.resize();
      });
      this.resizeObserver.observe(this.chartContainer.nativeElement);
    }
  }
}
