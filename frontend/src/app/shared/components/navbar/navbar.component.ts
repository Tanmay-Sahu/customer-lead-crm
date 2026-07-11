import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  template: `
    <nav class="navbar px-3 px-md-4">
      <div class="container-fluid d-flex justify-content-between align-items-center px-0">
        <!-- Left Side: Workspace Title & Dynamic Breadcrumbs -->
        <div class="d-flex flex-column text-start">
          <div class="fw-bold fs-6 text-color leading-tight">LeadFlow CRM Workspace</div>
          <div class="text-muted date-text mt-0.5 d-flex align-items-center gap-1">
            <span>{{ getCurrentPath() }}</span>
            <span class="text-color opacity-25">•</span>
            <span>{{ todayDate | date:'EEEE, MMM d' }}</span>
          </div>
        </div>

        <!-- Center Side: Global Search Bar -->
        <div class="search-bar d-flex align-items-center px-3 py-1">
          <i class="bi bi-search text-muted me-2" style="font-size: 0.85rem;"></i>
          <input type="text" placeholder="Search lead pipeline..." (keyup.enter)="onSearch($event)" class="border-0 bg-transparent nav-search-input" style="outline: none;" aria-label="Search">
        </div>
        
        <!-- Right Side: User & Notifications -->
        <div class="user-actions d-flex align-items-center gap-2 gap-sm-3">
          <!-- Notification Bell -->
          <button class="btn btn-link border-0 text-muted p-2 d-flex align-items-center theme-toggle-btn" matTooltip="Notifications">
            <i class="bi bi-bell-fill text-muted fs-5"></i>
          </button>

          <!-- Dark Mode Toggle Button -->
          <button class="btn btn-link border-0 text-muted p-2 d-flex align-items-center theme-toggle-btn" (click)="toggleTheme()" matTooltip="Toggle Dark/Light Mode">
            <i class="bi" [ngClass]="isDarkMode ? 'bi-sun-fill text-warning fs-5' : 'bi-moon-fill text-primary fs-5'"></i>
          </button>
 
          <div class="dropdown">
            <button class="btn border-0 d-flex align-items-center px-1 px-sm-2 profile-trigger" type="button" (click)="toggleDropdown()">
              <div class="avatar-gradient me-md-2">{{ initials() }}</div>
              <div class="d-none d-md-block text-start text-inherit">
                <div class="fw-bold small username-text">{{ authService.currentUser()?.name }}</div>
                <div class="text-muted user-role-badge" style="font-size: 9px;">{{ authService.currentUser()?.role }}</div>
              </div>
            </button>
            
            <div class="dropdown-menu dropdown-menu-end shadow-premium border-0" [class.show]="isDropdownOpen">
              <a class="dropdown-item py-2" href="#"><i class="bi bi-person me-2"></i> Profile</a>
              <a class="dropdown-item py-2" href="#"><i class="bi bi-gear me-2"></i> Settings</a>
              <hr class="dropdown-divider">
              <button class="dropdown-item py-2 text-danger" (click)="logout()">
                <i class="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: var(--navbar-height);
      background: var(--surface) !important;
      border: 1px solid var(--border) !important;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm) !important;
      margin: 16px 24px 0 24px;
      padding: 0 1.5rem !important;
      transition: var(--transition);
    }
    .text-color {
      color: var(--text);
    }
    .leading-tight {
      line-height: 1.2;
    }
    .date-text {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .search-bar {
      background-color: var(--surface-2);
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      transition: var(--transition);
      height: 38px;
    }
    .search-bar:focus-within {
      background-color: var(--surface);
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-tint);
    }
    .avatar-gradient {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%);
      color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: var(--shadow-sm);
      font-size: 0.85rem;
    }
    .profile-trigger {
      padding: 4px 8px !important;
      border-radius: var(--radius-pill) !important;
      transition: var(--transition);
      min-height: auto !important;
      border: 1px solid var(--border) !important;
    }
    .profile-trigger:hover {
      background-color: var(--surface-2);
      border-color: var(--text-muted) !important;
    }
    .username-text {
      color: var(--text);
      font-weight: 700;
    }
    .user-role-badge {
      color: var(--text-muted) !important;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .dropdown-menu {
      min-width: 200px;
      margin-top: 10px;
      background-color: var(--surface);
      border: 1px solid var(--border) !important;
      box-shadow: var(--shadow-premium) !important;
      border-radius: var(--radius-md) !important;
    }
    .dropdown-item {
      color: var(--text-secondary);
      font-weight: 600;
    }
    .dropdown-item:hover {
      background-color: var(--surface-2) !important;
      color: var(--primary) !important;
    }
    .nav-search-input {
      width: 140px;
      transition: width 0.3s ease;
      color: var(--text);
      font-size: 0.82rem;
    }
    .nav-search-input:focus {
      width: 220px;
    }
    .toggle-btn, .theme-toggle-btn {
      color: var(--text) !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px !important;
      min-width: 38px;
      border-radius: var(--radius-md);
      transition: var(--transition);
      border: 1px solid var(--border) !important;
    }
    .toggle-btn:hover, .theme-toggle-btn:hover {
      background-color: var(--surface-2);
      border-color: var(--text-muted) !important;
    }
    @media (max-width: 991.98px) {
      .navbar {
        margin: 10px 15px 0 15px;
      }
    }
    @media (max-width: 575.98px) {
      .nav-search-input {
        width: 80px;
      }
      .nav-search-input:focus {
        width: 120px;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  sidebarService = inject(SidebarService);
  router = inject(Router);
  isDropdownOpen = false;
  isDarkMode = false;
  todayDate = new Date();

  ngOnInit() {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.updateTheme();
  }

  initials(): string {
    const name = this.authService.currentUser()?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onSearch(event: any) {
    const q = event.target.value;
    this.router.navigate(['/leads'], { queryParams: q ? { q } : {} });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.updateTheme();
  }

  private updateTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  getCurrentPath(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Dashboard Workspace';
    if (url.includes('/leads/add')) return 'Customer Leads / Add New';
    if (url.includes('/leads/edit')) return 'Customer Leads / Modify Lead';
    if (url.includes('/leads/view')) return 'Customer Leads / Profile Detail';
    if (url.includes('/leads')) return 'Customer Leads / List Directory';
    if (url.includes('/reminders')) return 'Follow-up Board / Planner';
    if (url.includes('/lead-types')) return 'Lead Categories / Index';
    if (url.includes('/users')) return 'Staff Accounts / Index';
    return 'CRM Workspace';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
