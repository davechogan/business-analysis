import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultsComponent } from './components/analysis-results/analysis-results.component';
import { D3ProgressComponent } from './components/d3-progress/d3-progress.component';
import { AnalysisStep, Results } from './types/analysis.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AnalysisResultsComponent,
    D3ProgressComponent
  ]
})
export class AppComponent {
  title = 'Business Opportunity Analysis';
  showResults = false;
  isSubmitting = false;
  businessContext = '';
  currentStep = 0;
  analysisSteps: AnalysisStep[] = ['strategy', 'competitors', 'revenue', 'cost', 'roi'];
  activeTab: AnalysisStep = 'strategy';
  results: Results = {
    strategy: null,
    competitors: null,
    revenue: null,
    cost: null,
    roi: null,
    justification: null,
    deck: null
  };

  onSubmit() {
    if (this.businessContext.trim()) {
      this.showResults = true;
      this.isSubmitting = true;
    }
  }

  getCompletedSteps(): AnalysisStep[] {
    return this.analysisSteps.filter(step => this.results[step] !== null);
  }

  getTabLabel(step: string): string {
    return step.charAt(0).toUpperCase() + step.slice(1);
  }

  shouldShowJustificationPrompt(): boolean {
    return this.results.roi !== null && this.results.justification === null;
  }

  shouldShowDeckPrompt(): boolean {
    return this.results.roi !== null && this.results.deck === null;
  }

  onJustificationResponse(accepted: boolean) {
    if (accepted) {
      this.analysisSteps.push('justification');
    }
  }

  addDeck() {
    this.analysisSteps.push('deck');
  }

  skipDeck() {
    // Handle skipping deck
  }
} 