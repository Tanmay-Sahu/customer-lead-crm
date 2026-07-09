import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, CustomerLead, LeadSearchRequest, PagedResponse } from '../models/crm.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerLeadService {
  private apiUrl = `${environment.apiUrl}/leads`;

  constructor(private http: HttpClient) {}

  getLeads(page: number, size: number, sortBy: string, sortDir: string): Observable<ApiResponse<PagedResponse<CustomerLead>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    return this.http.get<ApiResponse<PagedResponse<CustomerLead>>>(this.apiUrl, { params });
  }

  getLeadById(id: number): Observable<ApiResponse<CustomerLead>> {
    return this.http.get<ApiResponse<CustomerLead>>(`${this.apiUrl}/${id}`);
  }

  createLead(lead: any): Observable<ApiResponse<CustomerLead>> {
    return this.http.post<ApiResponse<CustomerLead>>(this.apiUrl, lead);
  }

  updateLead(id: number, lead: any): Observable<ApiResponse<CustomerLead>> {
    return this.http.put<ApiResponse<CustomerLead>>(`${this.apiUrl}/${id}`, lead);
  }

  deleteLead(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  searchLeads(criteria: LeadSearchRequest): Observable<ApiResponse<PagedResponse<CustomerLead>>> {
    return this.http.post<ApiResponse<PagedResponse<CustomerLead>>>(`${this.apiUrl}/search`, criteria);
  }

  globalSearch(query: string, page: number, size: number, sortBy: string, sortDir: string): Observable<ApiResponse<PagedResponse<CustomerLead>>> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);
    return this.http.get<ApiResponse<PagedResponse<CustomerLead>>>(`${this.apiUrl}/search`, { params });
  }

  importExcel(file: File): Observable<HttpEvent<ApiResponse<any>>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/import`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/import/template`, { responseType: 'blob' });
  }
}
