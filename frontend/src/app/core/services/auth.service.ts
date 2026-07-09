import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, LoginResponse, User } from '../models/crm.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Use Angular Signals for state management (modern Angular 17 approach)
  currentUser = signal<LoginResponse | null>(this.getUserFromStorage());

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setUserToStorage(response.data);
            this.currentUser.set(response.data);
          }
        })
      );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe();
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getRole(): string | null {
    return this.currentUser()?.role || null;
  }

  private setUserToStorage(user: LoginResponse): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getUserFromStorage(): LoginResponse | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
