import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent, FooterComponent],
  template: `
    <div class="admin-wrapper" [class.sidebar-open]="sidebarService.isOpen()">
      <div 
        *ngIf="sidebarService.isOpen()" 
        class="sidebar-backdrop" 
        (click)="sidebarService.close()">
      </div>

      <app-sidebar></app-sidebar>
      
      <div class="main-panel">
        <app-navbar></app-navbar>
        
        <div class="content">
          <div class="container-fluid py-4 px-0">
            <router-outlet></router-outlet>
          </div>
        </div>
        
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
    }
    .main-panel {
      flex: 1;
      margin-left: 280px;
      display: flex;
      flex-direction: column;
      transition: margin-left 0.3s ease;
      min-width: 0;
    }
    .content {
      flex: 1;
      padding: 0 24px;
      min-width: 0;
    }
    .sidebar-backdrop {
      display: none;
    }
    @media (max-width: 991.98px) {
      .content {
        padding: 0 15px;
      }
      .main-panel {
        margin-left: 0;
      }
      .sidebar-backdrop {
        display: block;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(4px);
        z-index: 999;
      }
    }
  `]
})
export class AdminLayoutComponent {
  public sidebarService = inject(SidebarService);
}
