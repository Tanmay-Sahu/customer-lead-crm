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
    <nav class="navbar glass sticky-top px-3 px-md-4">
      <div class="container-fluid d-flex justify-content-between align-items-center px-0">
        <div class="d-flex align-items-center">
          <button class="btn btn-link border-0 text-muted p-2 d-lg-none me-2 toggle-btn" (click)="sidebarService.toggleState()" aria-label="Toggle Navigation">
            <i class="bi bi-list fs-3"></i>
          </button>
          
          <div class="search-bar d-flex align-items-center">
            <i class="bi bi-search text-muted me-2"></i>
            <input type="text" placeholder="Global Search..." (keyup.enter)="onSearch($event)" class="border-0 bg-transparent nav-search-input" style="outline: none;" aria-label="Search">
          </div>
        </div>
        
        <div class="user-actions d-flex align-items-center gap-2 gap-sm-3">
          <!-- Dark Mode Toggle Button -->
          <button class="btn btn-link border-0 text-muted p-2 d-flex align-items-center theme-toggle-btn" (click)="toggleTheme()" matTooltip="Toggle Dark/Light Mode">
            <i class="bi" [ngClass]="isDarkMode ? 'bi-sun-fill text-warning fs-5' : 'bi-moon-fill fs-5'"></i>
          </button>

          <div class="dropdown">
            <button class="btn border-0 d-flex align-items-center px-1 px-sm-2" type="button" (click)="toggleDropdown()">
              <div class="avatar me-md-2">{{ initials() }}</div>
              <div class="d-none d-md-block text-start text-inherit">
                <div class="fw-bold small">{{ authService.currentUser()?.name }}</div>
                <div class="text-muted" style="font-size: 10px;">{{ authService.currentUser()?.role }}</div>
              </div>
            </button>
            
            <div class="dropdown-menu dropdown-menu-end shadow border-0" [class.show]="isDropdownOpen">
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
      height: 70px;
      border-bottom: 1px solid var(--border-color);
      background: var(--navbar-bg) !important;
      color: var(--text-color);
      transition: background-color 0.3s, border-color 0.3s;
    }
    .avatar {
      width: 38px;
      height: 38px;
      background-color: var(--primary);
      color: var(--text-on-primary);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .dropdown-menu {
      min-width: 200px;
      margin-top: 10px;
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
    }
    .dropdown-item {
      color: var(--text-color);
    }
    .dropdown-item:hover {
      background-color: var(--sidebar-hover-bg);
      color: var(--sidebar-hover-color);
    }
    .nav-search-input {
      width: 140px;
      transition: width 0.3s ease;
      color: var(--text-color);
    }
    .nav-search-input:focus {
      width: 240px;
    }
    .toggle-btn {
      color: var(--text-color) !important;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      min-width: 44px;
    }
    .theme-toggle-btn {
      min-height: 44px;
      min-width: 44px;
      color: var(--text-color) !important;
    }
    @media (max-width: 575.98px) {
      .nav-search-input {
        width: 90px;
      }
      .nav-search-input:focus {
        width: 140px;
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
