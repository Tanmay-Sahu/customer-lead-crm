import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-container">
      <!-- Branding Panel - Hidden on Mobile -->
      <div class="branding-panel d-none d-lg-flex flex-column justify-content-between p-5">
        <div class="brand-logo d-flex align-items-center">
          <i class="bi bi-rocket-takeoff-fill fs-2 text-primary me-2"></i>
          <span class="fs-3 fw-bold text-white">LeadFlow <span class="text-primary">CRM</span></span>
        </div>
        
        <div class="branding-hero my-auto">
          <h1 class="text-white display-4 fw-bold mb-3 lh-1">Convert Leads <br>Into Customers.</h1>
          <p class="text-secondary fs-5 mb-4 max-w-md">Streamline your sales pipeline, track notes, and stay on top of critical reminders with our modern intelligence engine.</p>
          
          <div class="features-list d-flex flex-column gap-3 text-white">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-check-circle-fill text-primary fs-5"></i>
              <span>Interactive Pipeline Dashboard</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-check-circle-fill text-primary fs-5"></i>
              <span>Excel Import & Bulk Operations</span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-check-circle-fill text-primary fs-5"></i>
              <span>One-Click WhatsApp Follow-up</span>
            </div>
          </div>
        </div>

        <div class="branding-footer text-secondary small">
          © 2026 LeadFlow CRM System. All rights reserved.
        </div>
      </div>

      <!-- Form Panel -->
      <div class="form-panel d-flex align-items-center justify-content-center p-4">
        <div class="w-100" style="max-width: 440px;">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      min-height: 100vh;
      width: 100vw;
      background-color: var(--bg);
    }
    .branding-panel {
      flex: 1.1;
      background: radial-gradient(circle at 10% 20%, rgba(15, 23, 42, 1) 0%, rgba(9, 13, 22, 1) 90%);
      position: relative;
      overflow: hidden;
      border-right: 1px solid var(--border);
    }
    .branding-panel::before {
      content: '';
      position: absolute;
      top: -20%;
      right: -20%;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .branding-panel::after {
      content: '';
      position: absolute;
      bottom: -10%;
      left: -10%;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }
    .form-panel {
      flex: 1;
      background-color: var(--bg);
    }
    .max-w-md {
      max-width: 480px;
    }
    .text-secondary {
      color: #94a3b8 !important;
    }
  `]
})
export class AuthLayoutComponent {}
