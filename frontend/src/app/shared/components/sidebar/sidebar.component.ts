import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar shadow-lg" [class.open]="sidebarService.isOpen()">
      <div class="logo d-flex flex-column justify-content-center px-4">
        <div class="d-flex align-items-center">
          <i class="bi bi-hexagon-half fs-3 text-primary me-2 brand-icon"></i>
          <span class="fs-4 fw-bold logo-text text-white">LeadFlow<span class="text-primary">.</span></span>
        </div>
        <div class="text-muted small brand-subtext mt-0.5">Enterprise Sales Workspace</div>
        <button class="btn btn-close-sidebar border-0 bg-transparent p-1 text-white position-absolute" (click)="sidebarService.close()" aria-label="Close Sidebar" style="right: 15px; top: 15px;">
          <i class="bi bi-x fs-2"></i>
        </button>
      </div>
      
      <div class="nav-links mt-3">
        <div class="sidebar-section-header">MAIN</div>
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <span class="nav-active-bar"></span>
          <i class="bi bi-speedometer2 me-3 nav-icon"></i> 
          <span class="nav-text">Dashboard Workspace</span>
        </a>
        
        <div class="sidebar-section-header">CRM MODULES</div>
        <a routerLink="/leads" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <span class="nav-active-bar"></span>
          <i class="bi bi-person-lines-fill me-3 nav-icon"></i>
          <span class="nav-text">Customer Leads</span>
        </a>
        <a routerLink="/reminders" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <span class="nav-active-bar"></span>
          <i class="bi bi-calendar-week me-3 nav-icon"></i>
          <span class="nav-text">Follow-up Board</span>
        </a>
        
        <div class="sidebar-section-header">REPORTS & CONFIG</div>
        <a routerLink="/lead-types" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <span class="nav-active-bar"></span>
          <i class="bi bi-pie-chart-fill me-3 nav-icon"></i>
          <span class="nav-text">Lead Categories</span>
        </a>
        
        <div class="sidebar-section-header">ADMINISTRATION</div>
        <a routerLink="/users" routerLinkActive="active" class="nav-item" (click)="sidebarService.close()">
          <span class="nav-active-bar"></span>
          <i class="bi bi-shield-lock-fill me-3 nav-icon"></i>
          <span class="nav-text">Staff & Accounts</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--sidebar-border);
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      transition: background-color 0.2s, border-color 0.2s, left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .logo {
      height: 84px;
      border-bottom: 1px solid var(--sidebar-border);
      width: 100%;
      position: relative;
    }
    .logo-text {
      font-family: 'Poppins', sans-serif;
      letter-spacing: -0.5px;
    }
    .brand-subtext {
      font-size: 0.68rem;
      letter-spacing: 0.5px;
      font-weight: 600;
      opacity: 0.65;
    }
    .brand-icon {
      transition: transform 0.3s ease;
    }
    .logo:hover .brand-icon {
      transform: rotate(120deg) scale(1.08);
    }
    .btn-close-sidebar {
      display: none;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      min-width: 44px;
    }
    .nav-links {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      height: calc(100vh - 84px);
      padding-bottom: 24px;
    }
    .sidebar-section-header {
      font-family: 'Poppins', sans-serif;
      letter-spacing: 1px;
      font-size: 0.62rem !important;
      font-weight: 700;
      color: var(--sidebar-text);
      opacity: 0.45;
      margin: 16px 24px 8px 24px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      position: relative;
      padding: 12px 20px;
      text-decoration: none;
      color: var(--sidebar-text);
      margin: 2px 16px;
      border-radius: var(--radius-md);
      font-weight: 500;
      font-size: 0.85rem;
      transition: var(--transition);
      min-height: 44px;
    }
    .nav-icon {
      font-size: 1.2rem;
      transition: var(--transition);
      opacity: 0.75;
    }
    .nav-item:hover {
      background-color: var(--sidebar-hover-bg);
      color: var(--sidebar-hover-color);
    }
    .nav-item:hover .nav-icon {
      transform: scale(1.1);
      opacity: 1;
    }
    .nav-active-bar {
      position: absolute;
      left: -16px;
      top: 15%;
      height: 70%;
      width: 4px;
      background-color: var(--primary);
      border-radius: 0 4px 4px 0;
      transform: scaleX(0);
      transition: transform 0.2s ease;
    }
    .nav-item.active {
      background: linear-gradient(90deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.02) 100%);
      color: var(--sidebar-text-active);
      font-weight: 600;
      border: 1px solid rgba(37, 99, 235, 0.2);
    }
    .nav-item.active .nav-icon {
      color: var(--primary);
      opacity: 1;
    }
    .nav-item.active .nav-active-bar {
      transform: scaleX(1);
    }
    @media (max-width: 991.98px) {
      .sidebar {
        left: -280px;
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
