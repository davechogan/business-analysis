import { Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { BaseType } from 'd3-selection';

@Component({
  selector: 'app-d3-progress',
  template: `
    <div class="d3-progress"></div>
    <style>
      @keyframes pulse {
        0% { 
          stroke-width: 3;
          r: 15;
        }
        50% { 
          stroke-width: 6;
          r: 20;
        }
        100% { 
          stroke-width: 3;
          r: 15;
        }
      }
      
      :host ::ng-deep circle.active {
        animation: pulse 1s ease-in-out infinite !important;
      }
    </style>
  `,
  styles: [`
    .d3-progress {
      width: 100%;
      height: 100px;
      margin: 2rem 0;
    }

    :host ::ng-deep circle.active {
      fill: var(--surface-card) !important;
      stroke: var(--primary-color) !important;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class D3ProgressComponent implements OnInit, OnChanges, OnDestroy {
  @Input() steps: string[] = [];
  @Input() currentStep: number = 0;
  @Input() completedSteps: string[] = [];

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private margin = { top: 20, right: 20, bottom: 30, left: 20 };
  private width = 800;
  private height = 80;
  private radius = 15;
  private activeNode: d3.Selection<BaseType, string, SVGGElement, unknown> | null = null;
  private animationInterval: any;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.createSvg();
    this.drawProgress();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['steps'] || changes['currentStep'] || changes['completedSteps']) && this.svg) {
      this.drawProgress();
    }
  }

  ngOnDestroy(): void {
    if (this.svg) {
      this.svg.remove();
    }
  }

  private createSvg() {
    d3.select(this.el.nativeElement).select('svg').remove();
    this.svg = d3.select(this.el.nativeElement.querySelector('.d3-progress'))
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  }

  private drawProgress() {
    if (!this.steps.length) return;

    console.log('D3 Progress Component State:', {
        steps: this.steps,
        currentStep: this.currentStep,
        completedSteps: this.completedSteps,
    });

    const stepWidth = (this.width - this.margin.left - this.margin.right) / (this.steps.length - 1);

    // Draw connecting lines
    const lineGroup = this.svg.selectAll('.line-group')
      .data([null])
      .join('g')
      .attr('class', 'line-group');

    // Background lines
    lineGroup.selectAll('.bg-line')
      .data(this.steps.slice(0, -1))
      .join('line')
      .attr('class', 'bg-line')
      .attr('x1', (_: string, i: number) => this.margin.left + i * stepWidth)
      .attr('x2', (_: string, i: number) => this.margin.left + (i + 1) * stepWidth)
      .attr('y1', this.height / 2)
      .attr('y2', this.height / 2)
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 3);

    // Progress lines
    lineGroup.selectAll('.progress-line')
      .data(this.steps.slice(0, this.currentStep))
      .join('line')
      .attr('class', 'progress-line')
      .attr('x1', (_: string, i: number) => this.margin.left + i * stepWidth)
      .attr('x2', (_: string, i: number) => this.margin.left + (i + 1) * stepWidth)
      .attr('y1', this.height / 2)
      .attr('y2', this.height / 2)
      .attr('stroke', 'var(--primary-color)')
      .attr('stroke-width', 3);

    // Draw circles and labels
    const nodeGroup = this.svg.selectAll<SVGGElement, string>('.node-group')
      .data(this.steps)
      .join('g')
      .attr('class', 'node-group')
      .attr('transform', (_: string, i: number) => 
        `translate(${this.margin.left + i * stepWidth}, ${this.height / 2})`);

    // Circles
    nodeGroup.selectAll('circle')
      .data(d => [d])
      .join('circle')
      .attr('r', this.radius)
      .attr('fill', (d: string) => 
        this.completedSteps.includes(d) ? 'var(--primary-color)' : 'var(--surface-card)')
      .attr('stroke', 'var(--primary-color)')
      .attr('stroke-width', 3)
      .attr('class', (d: string) => {
        const isCurrentStep = d === this.steps[this.currentStep];
        const isNotCompleted = !this.completedSteps.includes(d);
        return isCurrentStep && isNotCompleted ? 'active' : '';
      });

    // Step numbers
    nodeGroup.each((d, i, nodes) => {
      const group = d3.select(nodes[i]);
      const stepData = { step: d, index: i };
      
      console.log('Processing step number:', {
        stepData,
        isCompleted: this.completedSteps.includes(d)
      });

      group.selectAll('.step-number')
        .data([stepData])
        .join('text')
        .attr('class', 'step-number')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('fill', data => {
          const isCompleted = this.completedSteps.includes(data.step);
          console.log(`Step ${data.step} (${data.index + 1}) fill:`, {
            isCompleted,
            color: isCompleted ? 'white' : 'var(--text-color)'
          });
          return isCompleted ? 'white' : 'var(--text-color)';
        })
        .text(data => data.index + 1);
    });

    // Labels
    nodeGroup.selectAll('.step-label')
      .data(d => [d])
      .join('text')
      .attr('class', 'step-label')
      .attr('text-anchor', 'middle')
      .attr('dy', '2em')
      .attr('fill', 'var(--text-color)')
      .text((d: string) => d);
  }
} 