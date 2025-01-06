import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  template: `
    <div class="loading-container" *ngIf="loading">
      <div class="spinner"></div>
      <p>Processing {{step}}...</p>
    </div>
  `,
  styles: [`
    .loading-container {
      text-align: center;
      padding: 20px;
    }
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingIndicatorComponent {
  @Input() loading: boolean = false;
  @Input() step: string = '';
} 