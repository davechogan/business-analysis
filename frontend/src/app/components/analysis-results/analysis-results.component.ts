import { Component, OnInit } from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';

@Component({
  selector: 'app-analysis-results',
  template: `
    <div class="results" *ngIf="showResults">
      <div class="controls-container">
        <app-loading-indicator 
          [step]="currentStep"
          [loading]="isLoading">
        </app-loading-indicator>

        <div class="step-prompts">
          <!-- Justification Prompt -->
          <div *ngIf="showJustificationPrompt" class="prompt">
            <h3>Would you like to generate a business justification?</h3>
            <button (click)="processStep('justification')">Yes</button>
            <button (click)="showDeckPrompt()">No</button>
          </div>

          <!-- Deck Prompt -->
          <div *ngIf="showDeckPrompt" class="prompt">
            <h3>Would you like to generate an investor deck?</h3>
            <button (click)="processStep('deck')">Yes</button>
            <button (click)="finishAnalysis()">No</button>
          </div>
        </div>
      </div>

      <app-tabs 
        [tabs]="activeTabs"
        [activeTab]="currentTab"
        (tabChange)="onTabChange($event)">
      </app-tabs>
    </div>
  `
})
export class AnalysisResultsComponent implements OnInit {
  // Component implementation
} 