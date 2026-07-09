import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-wrapper d-flex align-items-center justify-content-center">
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--primary) 0%, var(--bg) 100%);
    }
  `]
})
export class AuthLayoutComponent {}
