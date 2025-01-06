import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-indicator',
  template: `
    <div class="loading-indicator" *ngIf="loading">
      Processing {{ step }}...
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class LoadingIndicatorComponent {
  @Input() loading: boolean = false;
  @Input() step: string = '';
} 