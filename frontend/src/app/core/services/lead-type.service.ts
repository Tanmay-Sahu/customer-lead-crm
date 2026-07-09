import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, LeadType } from '../models/crm.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadTypeService {
  private apiUrl = `${environment.apiUrl}/lead-types`;

  constructor(private http: HttpClient) {}

  getAllLeadTypes(): Observable<ApiResponse<LeadType[]>> {
    return this.http.get<ApiResponse<LeadType[]>>(this.apiUrl);
  }

  getLeadTypeById(id: number): Observable<ApiResponse<LeadType>> {
    return this.http.get<ApiResponse<LeadType>>(`${this.apiUrl}/${id}`);
  }

  createLeadType(leadType: any): Observable<ApiResponse<LeadType>> {
    return this.http.post<ApiResponse<LeadType>>(this.apiUrl, leadType);
  }

  updateLeadType(id: number, leadType: any): Observable<ApiResponse<LeadType>> {
    return this.http.put<ApiResponse<LeadType>>(`${this.apiUrl}/${id}`, leadType);
  }

  deleteLeadType(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
