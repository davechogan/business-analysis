import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AnalysisService } from './analysis.service';
import { of } from 'rxjs';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    httpClientSpy.post.and.returnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        AnalysisService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(AnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call submitContext with correct URL and data', () => {
    const testContext = 'test business context';
    service.submitContext(testContext);
    
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'http://localhost:5000/submit_context',
      { custom_context: testContext }
    );
  });

  it('should call processStep with correct URL and data', () => {
    const testStep = 'strategy';
    const testData = { key: 'value' };
    service.processStep(testStep, testData);
    
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      'http://localhost:5000/process/strategy',
      testData
    );
  });

  it('should return an Observable from submitContext', (done) => {
    const testContext = 'test business context';
    const mockResponse = { result: 'success' };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    service.submitContext(testContext).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });
  });

  it('should return an Observable from processStep', (done) => {
    const testStep = 'strategy';
    const testData = { key: 'value' };
    const mockResponse = { result: 'success' };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    service.processStep(testStep, testData).subscribe(response => {
      expect(response).toEqual(mockResponse);
      done();
    });
  });
});
