import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  constructor(private http: HttpClient) {}

  getData(endpoint: string, payload: any): Observable<any> {
    return this.http.post(`http://localhost:5000/process/${endpoint}`, {
      ...payload,
      format: true
    });
  }

  getAnalysis(type: string, context: string): Observable<any> {
    return this.getData(type, { context });
  }

  private extractIndustry(context: string): string {
    return context.split('.')[0];
  }

  getJustification(context: string): Observable<any> {
    return this.http.post(`http://localhost:5000/process/justification`, {
      context,
      format: true
    });
  }

  getDeck(context: string): Observable<any> {
    return this.http.post(`http://localhost:5000/process/deck`, {
      context,
      format: true
    });
  }
} 