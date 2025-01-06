import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-chart-display',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="chartData"
        [options]="chartOptions"
        [type]="chartType">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      margin: 1rem 0;
      height: 300px;
    }
  `]
})
export class ChartDisplayComponent implements OnInit {
  @Input() data: any;
  @Input() type: string = 'market';

  chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    }
  };
  
  chartType: ChartType = 'pie';

  ngOnInit() {
    this.setupChart();
  }

  private setupChart() {
    switch (this.type) {
      case 'market':
        this.setupMarketChart();
        break;
      case 'revenue':
        this.setupRevenueChart();
        break;
      case 'costs':
        this.setupCostsChart();
        break;
    }
  }

  private setupMarketChart() {
    if (this.data?.marketShares) {
      this.chartType = 'pie';
      this.chartData = {
        labels: this.data.marketShares.map((item: any) => item.company),
        datasets: [{
          data: this.data.marketShares.map((item: any) => item.share),
          backgroundColor: [
            '#2563eb',
            '#3b82f6',
            '#60a5fa',
            '#93c5fd'
          ]
        }]
      };
    }
  }

  private setupRevenueChart() {
    if (this.data?.revenueProjections) {
      this.chartType = 'bar';
      this.chartData = {
        labels: this.data.revenueProjections.map((item: any) => item.year),
        datasets: [{
          label: 'Projected Revenue',
          data: this.data.revenueProjections.map((item: any) => item.amount),
          backgroundColor: '#2563eb'
        }]
      };
      this.chartOptions = {
        ...this.chartOptions,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: any) => '$' + this.formatNumber(Number(value))
            }
          }
        }
      };
    }
  }

  private setupCostsChart() {
    if (this.data?.costBreakdown) {
      this.chartType = 'doughnut';
      this.chartData = {
        labels: this.data.costBreakdown.map((item: any) => item.category),
        datasets: [{
          data: this.data.costBreakdown.map((item: any) => item.amount),
          backgroundColor: [
            '#2563eb',
            '#3b82f6',
            '#60a5fa',
            '#93c5fd',
            '#bfdbfe'
          ]
        }]
      };
    }
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
} 