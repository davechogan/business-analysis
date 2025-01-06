import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs-container">
      <div class="tabs">
        <button 
          *ngFor="let tab of tabs" 
          [class.active]="tab === activeTab"
          (click)="onTabClick(tab)">
          {{tab}}
        </button>
      </div>
      <div class="tab-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .tabs-container {
      margin: 20px 0;
    }
    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    button {
      padding: 10px 20px;
      border: none;
      background: #f0f0f0;
      cursor: pointer;
    }
    button.active {
      background: #007bff;
      color: white;
    }
  `]
})
export class TabsComponent {
  @Input() tabs: string[] = [];
  @Input() activeTab: string = '';
  @Output() tabChange = new EventEmitter<string>();

  onTabClick(tab: string) {
    this.tabChange.emit(tab);
  }
} 