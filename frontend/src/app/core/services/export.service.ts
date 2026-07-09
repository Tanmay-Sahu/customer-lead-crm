import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = `${environment.apiUrl}/export`;

  constructor(private http: HttpClient) {}

  exportExcel() {
    window.open(`${this.apiUrl}/excel`, '_blank');
  }

  exportPdf() {
    window.open(`${this.apiUrl}/pdf`, '_blank');
  }
}
