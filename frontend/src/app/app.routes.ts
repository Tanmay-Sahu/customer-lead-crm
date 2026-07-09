import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'lead-types',
        loadComponent: () => import('./modules/lead-type/lead-type-list/lead-type-list.component').then(m => m.LeadTypeListComponent)
      },
      {
        path: 'leads',
        children: [
          {
            path: '',
            loadComponent: () => import('./modules/lead/lead-list/lead-list.component').then(m => m.LeadListComponent)
          },
          {
            path: 'add',
            loadComponent: () => import('./modules/lead/lead-form/lead-form.component').then(m => m.LeadFormComponent)
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./modules/lead/lead-form/lead-form.component').then(m => m.LeadFormComponent)
          },
          {
            path: 'view/:id',
            loadComponent: () => import('./modules/lead/lead-detail/lead-detail.component').then(m => m.LeadDetailComponent)
          }
        ]
      },
      {
        path: 'reminders',
        loadComponent: () => import('./modules/reminder/reminder.component').then(m => m.ReminderComponent)
      },
      // Other routes will be added in next phases
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
