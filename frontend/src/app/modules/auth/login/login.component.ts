import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-5 col-lg-4">
        <div class="card border-0 shadow-lg p-4 p-md-5 crm-card">
          <div class="text-center mb-4">
            <div class="icon-box bg-primary text-white mx-auto mb-3">
              <i class="bi bi-lock-fill fs-2"></i>
            </div>
            <h2 class="fw-bold">Welcome Back</h2>
            <p class="text-muted">Enter your credentials to access CRM</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label class="form-label fw-bold">Username</label>
              <div class="input-group">
                <span class="input-group-text bg-transparent border-end-0"><i class="bi bi-person"></i></span>
                <input type="text" formControlName="username" class="form-control border-start-0" placeholder="Enter username">
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold">Password</label>
              <div class="input-group">
                <span class="input-group-text bg-transparent border-end-0"><i class="bi bi-shield-lock"></i></span>
                <input type="password" formControlName="password" class="form-control border-start-0" placeholder="Enter password">
              </div>
            </div>

            <div class="d-flex justify-content-between mb-4 small">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="remember">
                <label class="form-check-label" for="remember">Remember me</label>
              </div>
              <a href="#" class="text-primary text-decoration-none">Forgot password?</a>
            </div>

            <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn btn-primary w-100 py-2 fw-bold shadow">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
            
            <div *ngIf="errorMessage" class="alert alert-danger mt-3 small py-2">
              <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .icon-box {
      width: 60px;
      height: 60px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 15px -3px rgb(37 99 235 / 0.4);
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (resp) => {
          if (resp.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = resp.message;
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Invalid credentials or server error';
          this.isLoading = false;
        }
      });
    }
  }
}
