import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { D3ProgressComponent } from '../d3-progress/d3-progress.component';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { TabsComponent } from '../tabs/tabs.component';
import { AnalysisStep } from '../../types/analysis.types';
import { AnalysisService } from '../../services/analysis.service';

@Component({
  selector: 'app-analysis-results',
  template: `
    <div class="results" *ngIf="showResults">
      <app-d3-progress
        *ngIf="isSubmitting"
        [steps]="steps"
        [currentStep]="getCurrentStepIndex()"
        [completedSteps]="completedSteps">
      </app-d3-progress>

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
            <button (click)="setShowDeckPrompt()">No</button>
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
  `,
  standalone: true,
  imports: [
    CommonModule,
    D3ProgressComponent,
    LoadingIndicatorComponent,
    TabsComponent
  ]
})
export class AnalysisResultsComponent implements OnInit {
  @Input() showResults = false;
  @Input() isSubmitting = false;
  isLoading = false;
  currentStep: AnalysisStep = 'strategy';
  steps: AnalysisStep[] = ['strategy', 'competitors', 'revenue', 'cost', 'roi'];
  completedSteps: AnalysisStep[] = [];
  activeTabs: string[] = [];
  currentTab = 'Strategy';
  showJustificationPrompt = false;
  showDeckPrompt = false;

  constructor(private analysisService: AnalysisService) {}

  ngOnInit() {
    this.showResults = false;
    this.isSubmitting = false;
  }

  getCurrentStepIndex(): number {
    return this.steps.indexOf(this.currentStep);
  }

  processStep(step: AnalysisStep) {
    // Implementation
  }

  setShowDeckPrompt() {
    this.showDeckPrompt = true;
  }

  finishAnalysis() {
    // Implementation
  }

  onTabChange(tab: string) {
    this.currentTab = tab;
  }
} 