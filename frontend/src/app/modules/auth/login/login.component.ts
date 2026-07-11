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
    <div class="login-card-container animate-fade-in-up">
      <!-- Mobile Brand Header (d-lg-none) -->
      <div class="text-center d-lg-none mb-4">
        <div class="d-inline-flex align-items-center justify-content-center mb-2">
          <i class="bi bi-rocket-takeoff-fill fs-1 text-primary me-2"></i>
          <span class="fs-2 fw-bold text-color">LeadFlow <span class="text-primary">CRM</span></span>
        </div>
      </div>

      <div class="crm-card border-0 p-4 p-md-5 shadow-lg">
        <div class="text-start mb-4">
          <h2 class="fw-bold h3 mb-1">Welcome back</h2>
          <p class="text-muted small">Enter your credentials to access your CRM workspace.</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label small fw-semibold">Username</label>
            <div class="input-group-custom">
              <span class="input-icon"><i class="bi bi-person"></i></span>
              <input type="text" formControlName="username" class="form-control" placeholder="Enter username">
            </div>
            <div *ngIf="loginForm.get('username')?.touched && loginForm.get('username')?.hasError('required')" class="text-danger small mt-1">
              Username is required.
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-semibold">Password</label>
            <div class="input-group-custom">
              <span class="input-icon"><i class="bi bi-shield-lock"></i></span>
              <input type="password" formControlName="password" class="form-control" placeholder="Enter password">
            </div>
            <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.hasError('required')" class="text-danger small mt-1">
              Password is required.
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-4 small">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="remember">
              <label class="form-check-label text-muted" for="remember">Keep me signed in</label>
            </div>
            <a href="#" class="text-primary text-decoration-none fw-semibold">Forgot password?</a>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading" class="btn btn-primary w-100 py-2 fw-bold shadow">
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
          
          <div *ngIf="errorMessage" class="alert alert-danger mt-3 small py-2 border-0">
            <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-card-container {
      width: 100%;
    }
    .input-group-custom {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .input-group-custom .input-icon {
      position: absolute;
      left: 14px;
      color: var(--text-muted);
      z-index: 4;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .input-group-custom .form-control {
      padding-left: 42px !important;
      width: 100%;
    }
    .text-color {
      color: var(--text);
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
