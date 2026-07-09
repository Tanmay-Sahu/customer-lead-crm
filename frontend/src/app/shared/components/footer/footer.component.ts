import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer py-3 border-top mt-auto">
      <div class="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center small">
        <div>© 2026 CRM Lead System. Created for Professional Portfolio.</div>
        <div class="mt-2 mt-md-0">
          <a href="#" class="text-decoration-none me-3">Privacy Policy</a>
          <a href="#" class="text-decoration-none">Terms of Use</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      z-index: 10;
      background-color: var(--surface);
      border-top: 1px solid var(--border) !important;
      color: var(--text-secondary);
    }
    .footer a {
      color: var(--text-secondary);
    }
    .footer a:hover {
      color: var(--primary);
    }
  `]
})
export class FooterComponent {}
