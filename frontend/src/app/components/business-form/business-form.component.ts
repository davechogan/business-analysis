import { Component } from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';

@Component({
  selector: 'app-business-form',
  template: `
    <div id="contextForm" *ngIf="!submitted">
      <h2>Business Opportunity Analysis</h2>
      <div>
        <p>What kind of business opportunity are you considering?</p>
        <textarea 
          [(ngModel)]="customContext" 
          rows="6" 
          cols="50" 
          placeholder="Describe your business idea here...">
        </textarea>
      </div>
      <button 
        [disabled]="isSubmitting" 
        (click)="submitContext()">
        {{isSubmitting ? 'Processing...' : 'Submit'}}
      </button>
    </div>
  `
})
export class BusinessFormComponent {
  customContext = '';
  isSubmitting = false;
  submitted = false;

  constructor(private analysisService: AnalysisService) {}

  async submitContext() {
    if (!this.customContext.trim()) {
      alert('Please describe your business opportunity');
      return;
    }

    this.isSubmitting = true;
    
    try {
      const response = await this.analysisService.submitContext(this.customContext).toPromise();
      this.submitted = true;
      this.analysisService.updateStep('strategy');
      // Additional logic to handle the response
    } catch (error) {
      console.error('Error submitting context:', error);
      // Handle error
    } finally {
      this.isSubmitting = false;
    }
  }
} 