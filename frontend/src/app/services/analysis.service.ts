import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = 'http://localhost:5000'; // Your Flask backend URL

  constructor(private http: HttpClient) { }

  submitContext(context: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit_context`, { custom_context: context });
  }

  processStep(step: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/process/${step}`, data);
  }
} 