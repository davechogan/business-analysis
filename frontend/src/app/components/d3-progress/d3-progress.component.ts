import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisStep } from '../../types/analysis.types';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-progress',
  template: `
    <div class="d3-progress">
      <svg></svg>
    </div>
  `,
  styles: [`
    .d3-progress {
      width: 100%;
      height: 100px;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class D3ProgressComponent implements OnInit {
  @Input() steps: AnalysisStep[] = [];
  @Input() currentStep = 0;
  @Input() completedSteps: AnalysisStep[] = [];

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.createProgressBar();
  }

  private createProgressBar() {
    const svg = d3.select(this.el.nativeElement.querySelector('svg'));
    
    // Clear any existing content
    svg.selectAll('*').remove();
    
    const width = this.el.nativeElement.offsetWidth;
    const height = 100;
    const padding = 20;
    const stepWidth = (width - (2 * padding)) / (this.steps.length - 1);

    // Create progress line
    const line = svg.append('line')
      .attr('x1', padding)
      .attr('y1', height / 2)
      .attr('x2', width - padding)
      .attr('y2', height / 2)
      .style('stroke', '#ccc')
      .style('stroke-width', 2);

    // Create step circles
    this.steps.forEach((step, index) => {
      const x = padding + (stepWidth * index);
      
      // Circle
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', height / 2)
        .attr('r', 10)
        .style('fill', this.getStepColor(index))
        .style('stroke', '#666')
        .style('stroke-width', 2);

      // Label
      svg.append('text')
        .attr('x', x)
        .attr('y', height / 2 + 25)
        .attr('text-anchor', 'middle')
        .text(step.charAt(0).toUpperCase() + step.slice(1))
        .style('font-size', '12px');
    });
  }

  private getStepColor(index: number): string {
    if (this.completedSteps.includes(this.steps[index])) {
      return '#4CAF50';  // Green for completed
    }
    if (index === this.currentStep) {
      return '#2196F3';  // Blue for current
    }
    return '#fff';  // White for pending
  }
} 