import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs">
      <button *ngFor="let tab of tabs"
              (click)="onTabClick(tab)"
              [class.active]="tab === activeTab">
        {{ tab }}
      </button>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TabsComponent {
  @Input() tabs: string[] = [];
  @Input() activeTab: string = '';
  @Output() tabChange = new EventEmitter<string>();

  onTabClick(tab: string) {
    this.tabChange.emit(tab);
  }
} 