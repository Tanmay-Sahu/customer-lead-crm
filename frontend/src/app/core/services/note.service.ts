import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Note } from '../models/crm.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = `${environment.apiUrl}/notes`;

  constructor(private http: HttpClient) {}

  getNotesByLead(leadId: number): Observable<ApiResponse<Note[]>> {
    return this.http.get<ApiResponse<Note[]>>(`${this.apiUrl}/lead/${leadId}?_t=${new Date().getTime()}`);
  }

  createNote(note: any): Observable<ApiResponse<Note>> {
    return this.http.post<ApiResponse<Note>>(this.apiUrl, note);
  }

  updateNote(id: number, note: any): Observable<ApiResponse<Note>> {
    return this.http.put<ApiResponse<Note>>(`${this.apiUrl}/${id}`, note);
  }

  deleteNote(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
