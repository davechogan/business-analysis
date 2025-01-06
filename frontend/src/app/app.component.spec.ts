import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { D3ProgressComponent } from './components/d3-progress/d3-progress.component';
import { AnalysisService } from './services/analysis.service';
import { ThemeService } from './services/theme.service';
import { DataSourceService } from './services/data-source.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let analysisService: jasmine.SpyObj<AnalysisService>;

  beforeEach(async () => {
    const analysisSpy = jasmine.createSpyObj('AnalysisService', ['submitContext', 'processStep']);
    analysisSpy.submitContext.and.returnValue(of({ result: 'success' }));
    analysisSpy.processStep.and.returnValue(of({ result: 'success' }));

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        AppComponent,
        D3ProgressComponent
      ],
      providers: [
        ThemeService,
        DataSourceService,
        { provide: AnalysisService, useValue: analysisSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    analysisService = TestBed.inject(AnalysisService) as jasmine.SpyObj<AnalysisService>;
    
    // Initialize required properties
    component.results = {
      strategy: null,
      competitors: null,
      revenue: null,
      cost: null,
      roi: null,
      justification: null,
      deck: null
    };
    
    component.isSubmitting = false;
    component.currentStep = 0;
    component.businessContext = '';
    component.showJustification = false;
    component.showDeck = false;
    component.askingForJustification = false;
    component.askingForDeck = false;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not process empty business context', () => {
    // Arrange
    component.businessContext = '';
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(analysisService.submitContext).not.toHaveBeenCalled();
  });

  it('should handle valid business context', () => {
    // Arrange
    const testContext = 'test context';
    component.businessContext = testContext;
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(component.isSubmitting).toBeTrue();
    expect(analysisService.processStep).toHaveBeenCalledWith('strategy', { 
      context: testContext,
      format: true
    });
  });

  it('should initialize with default values', () => {
    expect(component.businessContext).toBe('');
    expect(component.isSubmitting).toBeFalse();
    expect(component.progress).toBe(0);
    expect(component.currentStep).toBe(0);
  });

  it('should handle justification response', () => {
    component.onJustificationResponse(false);
    expect(component.showJustification).toBeFalse();
    expect(component.askingForJustification).toBeFalse();
  });

  it('should handle deck response', () => {
    component.onDeckResponse(false);
    expect(component.showDeck).toBeFalse();
    expect(component.askingForDeck).toBeFalse();
  });
});
