import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, DashboardResponse } from '../models/crm.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<ApiResponse<DashboardResponse>> {
    return this.http.get<ApiResponse<DashboardResponse>>(this.apiUrl);
  }
}
