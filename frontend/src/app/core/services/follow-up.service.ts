import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, FollowUp } from '../models/crm.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowUpService {
  private apiUrl = `${environment.apiUrl}/follow-ups`;

  constructor(private http: HttpClient) {}

  getFollowUpsByLead(leadId: number): Observable<ApiResponse<FollowUp[]>> {
    return this.http.get<ApiResponse<FollowUp[]>>(`${this.apiUrl}/lead/${leadId}`);
  }

  createFollowUp(followUp: any): Observable<ApiResponse<FollowUp>> {
    return this.http.post<ApiResponse<FollowUp>>(this.apiUrl, followUp);
  }

  updateFollowUp(id: number, followUp: any): Observable<ApiResponse<FollowUp>> {
    return this.http.put<ApiResponse<FollowUp>>(`${this.apiUrl}/${id}`, followUp);
  }

  deleteFollowUp(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getTodayReminders(): Observable<ApiResponse<FollowUp[]>> {
    return this.http.get<ApiResponse<FollowUp[]>>(`${environment.apiUrl}/reminders/today`);
  }

  getOverdueReminders(): Observable<ApiResponse<FollowUp[]>> {
    return this.http.get<ApiResponse<FollowUp[]>>(`${environment.apiUrl}/reminders/overdue`);
  }

  getUpcomingReminders(): Observable<ApiResponse<FollowUp[]>> {
    return this.http.get<ApiResponse<FollowUp[]>>(`${environment.apiUrl}/reminders/upcoming`);
  }
}
