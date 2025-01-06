import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { Results, AnalysisStep, TabStatus, FormattedAnalysis } from './types/analysis.types';
import { DataSourceService } from './services/data-source.service';
import { D3ProgressComponent } from './components/d3-progress/d3-progress.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    D3ProgressComponent
  ],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'Business Opportunity Analysis';
  businessContext = '';
  isSubmitting = false;
  results: Results = {
    strategy: null,
    competitors: null,
    revenue: null,
    cost: null,
    roi: null,
    justification: null,
    deck: null
  };
  currentStep = 0;
  askingForJustification = false;
  askingForDeck = false;
  activeTab: AnalysisStep = 'strategy';
  progress = 0;
  showJustification = false;
  showDeck = false;
  showDeckPreview = false;
  isDarkMode = false;

  // Base analysis steps (always shown)
  readonly baseAnalysisSteps: AnalysisStep[] = [
    'strategy',
    'competitors',
    'revenue',
    'cost',
    'roi'
  ];

  // Computed property for all active steps
  get analysisSteps(): AnalysisStep[] {
    let steps = [...this.baseAnalysisSteps];
    if (this.showJustification) steps.push('justification');
    if (this.showDeck) steps.push('deck');
    return steps;
  }

  @ViewChild('deckContent') deckContent!: ElementRef;

  constructor(
    private http: HttpClient,
    private dataSource: DataSourceService,
    private themeService: ThemeService
  ) {
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  ngOnInit() {
    this.resetState();
  }

  getTabStatus(step: AnalysisStep): TabStatus {
    if (this.results[step] && this.results[step] !== null) {
      return 'complete';
    }
    if (this.analysisSteps.indexOf(step) === this.currentStep && this.isSubmitting) {
      return 'processing';
    }
    return 'pending';
  }

  setActiveTab(tab: AnalysisStep): void {
    if (this.results[tab]) {
      this.activeTab = tab;
    }
  }

  hasResults(): boolean {
    return Object.values(this.results).some(result => result !== null);
  }

  onSubmit() {
    console.log('Submit clicked - starting analysis');
    this.isSubmitting = true;
    this.currentStep = 0;
    this.results = {
      strategy: null,
      competitors: null,
      revenue: null,
      cost: null,
      roi: null,
      justification: null,
      deck: null
    };
    this.progress = 0;
    this.activeTab = 'strategy';  // Set initial active tab
    console.log('Starting analysis with steps:', this.analysisSteps);
    this.processNextStep();
  }

  processNextStep() {
    const step = this.analysisSteps[this.currentStep];
    console.log('Processing step:', step, 'Current step:', this.currentStep);
    console.log('Current results:', this.results);

    if (!this.askingForJustification && !this.askingForDeck) {
      switch(step) {
        case 'strategy':
          console.log('Starting strategy analysis');
          this.processStrategy();
          break;
        case 'competitors':
          console.log('Starting competitor analysis');
          this.processCompetitors();
          break;
        case 'revenue':
          console.log('Starting revenue analysis');
          this.processRevenue();
          break;
        case 'cost':
          console.log('Starting cost analysis');
          this.processCost();
          break;
        case 'roi':
          console.log('Starting ROI analysis');
          this.processROI();
          break;
        default:
          console.log('Reached default case with step:', step);
          if (this.results['roi']) {
            this.askingForJustification = true;
          }
      }
    }
  }

  onJustificationResponse(wantJustification: boolean) {
    this.showJustification = wantJustification;
    this.askingForJustification = false;
    
    if (wantJustification) {
      this.processJustification();
    } else {
      // Skip justification step entirely
      this.currentStep = this.baseAnalysisSteps.length;  // Set to end of base steps
      this.askForDeck();
    }
  }

  askForDeck() {
    console.log('Asking for deck...');
    this.askingForDeck = true;
    // Only show justification if user said yes to it
    this.showJustification = this.results['justification'] !== null;
  }

  onDeckResponse(wantDeck: boolean) {
    this.showDeck = wantDeck;
    this.askingForDeck = false;
    if (wantDeck) {
      this.currentStep = this.analysisSteps.indexOf('deck');
      this.processDeck();
    } else {
      // If no deck wanted, set progress to 100%
      this.progress = 100;
    }
  }

  private processStrategy() {
    console.log('Processing strategy...');
    this.http.post('http://localhost:5000/process/strategy', {
      context: this.businessContext,
      format: true
    }).subscribe({
      next: (response: any) => {
        console.log('Strategy response:', response);
        const sections = this.parseResponseIntoSections(response.result);
        this.results['strategy'] = {
          sections: sections
        };
        this.currentStep++;
        this.processNextStep();
      },
      error: (error) => {
        console.error('Strategy Error:', error);
        this.isSubmitting = false;
      }
    });
  }

  private parseResponseIntoSections(text: string) {
    if (!text || typeof text !== 'string') {
      return [];
    }

    // Split by ### and filter out empty sections
    const sections = text.split(/###\s*/).filter(section => section.trim());
    
    return sections.map(section => {
      const lines = section.trim().split('\n');
      const title = lines[0].trim().replace(/^#\s*/, ''); // Remove # from title
      
      // Process the content lines
      const content = lines.slice(1)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          // Remove any # headers from content
          if (line.startsWith('#')) {
            return line.replace(/^#\s*/, '');
          }
          
          // Handle bullet points
          if (line.startsWith('•')) {
            line = line.substring(1).trim();
          }
          if (line.startsWith('-')) {
            line = line.substring(1).trim();
          }
          
          // Convert markdown bold with colons to HTML
          line = line.replace(/\*\*([^:*]+):\*\*/, '<strong>$1:</strong>');
          
          // Convert any remaining markdown bold to HTML
          line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
          
          return line;
        });

      return {
        title,
        content: content
      };
    });
  }

  private processRevenue() {
    console.log('Processing revenue...');
    this.http.post('http://localhost:5000/process/revenue', {
      context: this.businessContext,
      strategy: this.results['strategy'],
      format: true
    }).subscribe({
      next: (response: any) => {
        console.log('Revenue response:', response);
        const sections = this.parseResponseIntoSections(response.result);
        this.results['revenue'] = {
          sections: sections
        };
        this.currentStep++;
        this.processNextStep();
      },
      error: (error) => {
        console.error('Revenue Error:', error);
        this.isSubmitting = false;
      }
    });
  }

  private processCost() {
    console.log('Processing cost...');
    this.http.post('http://localhost:5000/process/cost', {
      context: this.businessContext,
      strategy: this.results['strategy'],
      revenue: this.results['revenue'],
      format: true
    }).subscribe({
      next: (response: any) => {
        console.log('Cost response:', response);
        const sections = this.parseResponseIntoSections(response.result);
        this.results['cost'] = {
          sections: sections
        };
        this.currentStep++;
        this.processNextStep();
      },
      error: (error) => {
        console.error('Cost Error:', error);
        this.isSubmitting = false;
      }
    });
  }

  private processROI() {
    console.log('Processing ROI...');
    this.http.post('http://localhost:5000/process/roi', {
      context: this.businessContext,
      strategy: this.results['strategy'],
      revenue: this.results['revenue'],
      cost: this.results['cost'],
      format: true
    }).subscribe({
      next: (response: any) => {
        console.log('ROI response:', response);
        const sections = this.parseResponseIntoSections(response.result);
        this.results['roi'] = {
          sections: sections
        };
        this.currentStep++;
        this.updateProgress();
        console.log('ROI complete, asking for justification');
      },
      error: (error) => {
        console.error('ROI Error:', error);
        this.isSubmitting = false;
      }
    });
  }

  private processJustification() {
    console.log('Processing justification...');
    this.http.post('http://localhost:5000/process/justification', {
      context: this.businessContext,
      strategy: this.results['strategy'],
      revenue: this.results['revenue'],
      cost: this.results['cost'],
      roi: this.results['roi'],
      format: true
    }).subscribe({
      next: (response: any) => {
        console.log('Justification response:', response);
        const sections = this.parseResponseIntoSections(response.result);
        this.results['justification'] = {
          sections: sections
        };
        this.showJustification = true;
        this.activeTab = 'justification';
        this.askingForJustification = false;
        this.askForDeck();
      },
      error: (error) => {
        console.error('Justification Error:', error);
        this.isSubmitting = false;
      }
    });
  }

  private processDeck() {
    console.log('Processing deck...');
    this.http.post('http://localhost:5000/process/deck', {
      context: this.businessContext,
      strategy: this.results['strategy'],
      revenue: this.results['revenue'],
      cost: this.results['cost'],
      roi: this.results['roi'],
      format: true
    }).subscribe({
      next: (response: any) => {
        console.log('Deck response:', response);
        const sections = this.parseResponseIntoSections(response.result);
        this.results['deck'] = {
          sections: sections
        };
        this.showDeck = true;
        this.activeTab = 'deck';
      },
      error: (error) => {
        console.error('Deck Error:', error);
        this.isSubmitting = false;
      }
    });
  }

  private updateProgress() {
    // Calculate total steps based on user choices and completed steps
    const totalSteps = this.analysisSteps.length;
    const completedSteps = this.analysisSteps.filter(step => this.results[step] !== null).length;
    
    // Calculate percentage (0-100)
    this.progress = Math.min(Math.round((completedSteps / totalSteps) * 100), 100);
    
    console.log(`Progress: ${completedSteps}/${totalSteps} steps (${this.progress}%)`);
  }

  // Helper method to check if a step is complete
  isStepComplete(step: AnalysisStep): boolean {
    return this.results[step] !== null;
  }

  // Helper method to get the current step status
  getStepStatus(step: AnalysisStep): 'complete' | 'active' | 'pending' {
    if (this.results[step] !== null) {
        return 'complete';
    }
    if (this.analysisSteps.indexOf(step) === this.currentStep && this.isSubmitting) {
        return 'active';
    }
    return 'pending';
  }

  isMetricsBasedSection(tab: string): boolean {
    return ['strategy', 'competitors', 'revenue', 'cost', 'roi'].includes(tab);
  }

  isDocumentSection(tab: string): boolean {
    return ['justification', 'deck'].includes(tab);
  }

  isHeader(text: string): boolean {
    // Check if the text starts with one or more # symbols
    return /^#{1,6}\s/.test(text);
  }

  formatHeader(text: string): string {
    // Count the number of # to determine header level
    const matches = text.match(/^#+/);
    const level = matches ? matches[0].length : 1; // Default to level 1 if no match
    const content = text.replace(/^#+\s*/, '');
    // Return different sized headers based on the number of #
    return `<span class="header-${Math.min(level, 3)}">${content}</span>`;
  }

  formatParagraph(text: string): string {
    // Only apply bold formatting if text is wrapped in **
    return text
      .replace(/^-\s/, '• ') // Convert dashes to bullets
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); // Only bold text between **
  }

  isBulletPoint(text: string): boolean {
    return text.trim().startsWith('-');
  }

  copyDeckContent(): void {
    const content = this.deckContent.nativeElement.textContent;
    navigator.clipboard.writeText(content).then(() => {
      // Optional: Add some user feedback that the content was copied
      alert('Deck content copied to clipboard!');
    });
  }

  toggleDeckView(): void {
    this.showDeckPreview = !this.showDeckPreview;
  }

  getTabLabel(step: AnalysisStep): string {
    switch (step) {
      case 'roi':
        return 'ROI';
      case 'strategy':
        return 'Strategic Analysis';
      case 'competitors':
        return 'Competitor Analysis';
      case 'justification':
        return 'Business Case';
      case 'deck':
        return 'Investor Deck';
      default:
        return `${step.charAt(0).toUpperCase() + step.slice(1)} Analysis`;
    }
  }

  private processCompetitors() {
    console.log('Processing competitors...');
    this.http.post('http://localhost:5000/process/competitors', {
      context: this.businessContext,
      format: true
    }).subscribe({
      next: (response: any) => {
        console.log('Competitors response:', response);
        const sections = this.parseResponseIntoSections(response.result);
        this.results['competitors'] = {
          sections: sections
        };
        this.currentStep++;
        this.processNextStep();
      },
      error: (error) => {
        console.error('Competitors Error:', error);
        this.isSubmitting = false;
      }
    });
  }

  private resetState() {
    this.isSubmitting = false;
    this.currentStep = 0;
    this.businessContext = '';
    this.results = {
      strategy: null,
      competitors: null,
      revenue: null,
      cost: null,
      roi: null,
      justification: null,
      deck: null
    };
    this.progress = 0;
    this.activeTab = 'strategy';
    this.askingForJustification = false;
    this.askingForDeck = false;
    this.showJustification = false;
    this.showDeck = false;
    this.showDeckPreview = false;
  }

  cancelAnalysis() {
    this.resetState();
  }

  // After ROI analysis is complete, ask about additional analyses
  askForAdditionalAnalyses() {
    if (this.results['roi']) {
      this.askingForJustification = false;
      this.showJustification = false;
    }
  }

  formatContent(text: string): string {
    return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  shouldShowJustificationPrompt(): boolean {
    const baseAnalysisComplete = this.isBaseAnalysisComplete();
    const shouldShow = !this.showJustification && 
           !this.askingForDeck &&
           baseAnalysisComplete;
    
    console.log('Justification Prompt Details:', JSON.stringify({
        showJustification: this.showJustification,
        askingForDeck: this.askingForDeck,
        askingForJustification: this.askingForJustification,
        baseAnalysisComplete: baseAnalysisComplete,
        shouldShow: shouldShow,
        currentStep: this.currentStep,
        results: Object.keys(this.results).filter(key => this.results[key] !== null)
    }, null, 2));
    
    return shouldShow;
  }

  shouldShowDeckPrompt(): boolean {
    return !this.showDeck && 
           this.askingForDeck &&
           this.isBaseAnalysisComplete() &&
           (!this.askingForJustification || this.showJustification);
  }

  isBaseAnalysisComplete(): boolean {
    return this.baseAnalysisSteps.every(step => this.results[step]);
  }

  addJustification(): void {
    this.showJustification = true;
    this.askingForJustification = true;
    this.currentStep = this.analysisSteps.indexOf('justification');
    this.activeTab = 'justification';
    this.processJustification();
  }

  skipJustification(): void {
    this.askingForJustification = true;
    this.checkForDeckPrompt();
  }

  addDeck(): void {
    this.showDeck = true;
    this.askingForDeck = true;
    this.currentStep = this.analysisSteps.indexOf('deck');
    this.activeTab = 'deck';
    this.processDeck();
  }

  skipDeck(): void {
    this.askingForDeck = true;
  }

  private checkForDeckPrompt(): void {
    if (this.shouldShowDeckPrompt()) {
        // The deck prompt will show automatically due to the template condition
    }
  }

  getCompletedSteps(): string[] {
    return Object.keys(this.results).filter(key => this.results[key] !== null);
  }
} 