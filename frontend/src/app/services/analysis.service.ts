import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  constructor(private http: HttpClient) {}

  submitContext(context: string): Observable<any> {
    console.log('Submitting context:', context);
    return this.http.post('http://localhost:5000/submit_context', { custom_context: context })
      .pipe(
        tap(
          response => console.log('Submit context response:', response),
          error => console.error('Submit context error:', error)
        )
      );
  }

  processStep(step: string, data: any): Observable<any> {
    console.log(`Processing step ${step}:`, data);
    return this.http.post(`http://localhost:5000/process/${step}`, data)
      .pipe(
        tap(
          response => console.log(`Step ${step} response:`, response),
          error => console.error(`Step ${step} error:`, error)
        )
      );
  }
} 