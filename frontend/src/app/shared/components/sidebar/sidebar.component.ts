import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar shadow" [class.open]="sidebarService.isOpen()">
      <div class="logo d-flex align-items-center justify-content-between px-4">
        <div class="d-flex align-items-center">
          <i class="bi bi-rocket-takeoff-fill fs-3 text-primary me-2"></i>
          <span class="fs-4 fw-bold">CRM <span class="text-primary">Lead</span></span>
        </div>
        <button class="btn btn-close-sidebar" (click)="sidebarService.close()">
          <i class="bi bi-x fs-3"></i>
        </button>
      </div>
      
      <div class="nav-links mt-4">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <i class="bi bi-grid-fill me-3"></i> Dashboard
        </a>
        <a routerLink="/lead-types" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <i class="bi bi-tags-fill me-3"></i> Lead Types
        </a>
        <a routerLink="/leads" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <i class="bi bi-people-fill me-3"></i> Customer Leads
        </a>
        <a routerLink="/reminders" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <i class="bi bi-alarm-fill me-3"></i> Reminders
        </a>
        
        <div class="divider mx-4 my-3 text-muted small fw-bold">ADMIN ACTIONS</div>
        <a routerLink="/users" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <i class="bi bi-person-badge-fill me-3"></i> Manage Users
        </a>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border-color);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      transition: background-color 0.3s, border-color 0.3s, left 0.3s ease;
    }
    .logo {
      height: 70px;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-color);
      width: 100%;
    }
    .btn-close-sidebar {
      background: none;
      border: 0;
      color: var(--text-color);
      padding: 0;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 24px;
      text-decoration: none;
      color: var(--text-muted);
      margin: 4px 16px;
      border-radius: 8px;
      font-weight: 500;
      transition: background-color 0.2s, color 0.2s;
      min-height: 46px;
    }
    .nav-item:hover {
      background-color: var(--sidebar-hover-bg);
      color: var(--sidebar-hover-color);
    }
    .nav-item.active {
      background-color: var(--primary);
      color: var(--text-on-primary);
      box-shadow: var(--card-shadow);
    }
    .divider {
      letter-spacing: 1px;
      color: var(--text-muted) !important;
    }
    @media (max-width: 991.98px) {
      .sidebar {
        left: -260px;
        z-index: 1001;
      }
      .sidebar.open {
        left: 0;
      }
      .btn-close-sidebar {
        display: flex;
      }
    }
  `]
})
export class SidebarComponent {
  public sidebarService = inject(SidebarService);
}
