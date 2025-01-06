import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisResultsComponent } from './components/analysis-results/analysis-results.component';
import { AnalysisStep, Results } from './types/analysis.types';
import { AnalysisService } from './services/analysis.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AnalysisResultsComponent
  ]
})
export class AppComponent {
  title = 'Business Opportunity Analysis';
  showResults = false;
  isSubmitting = false;
  businessContext = '';
  currentStep: number = 0;
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
  completedSteps: AnalysisStep[] = [];

  constructor(private analysisService: AnalysisService) {}

  async onSubmit() {
    if (this.businessContext.trim()) {
      console.log('Submitting analysis...');
      this.showResults = true;
      this.isSubmitting = true;
      
      try {
        await this.analysisService.submitContext(this.businessContext).toPromise();
        console.log('Context submitted successfully');
        
        for (const step of this.analysisSteps) {
          this.currentStep = this.analysisSteps.indexOf(step);
          console.log(`Processing step: ${step}`);
          
          const result = await this.analysisService.processStep(step, {}).toPromise();
          this.results[step] = result;
          this.completedSteps.push(step);
          console.log(`Step ${step} completed:`, result);
        }
      } catch (error) {
        console.error('Error during analysis:', error);
      }
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
    console.log('Skipping deck generation');
  }
} 