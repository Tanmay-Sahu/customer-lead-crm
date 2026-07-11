import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { FollowUpService } from '../../core/services/follow-up.service';
import { FollowUp, ApiResponse } from '../../core/models/crm.models';

@Component({
  selector: 'app-reminder',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, MatIconModule, MatListModule, MatButtonModule, RouterModule],
  template: `
    <div class="mb-4 animate-fade-in-up">
      <h1 class="fw-bold h2 mb-1">Reminders & Follow-ups</h1>
      <p class="text-muted small">Stay on top of your customer interactions and follow-ups</p>
    </div>

    <div class="kanban-board animate-fade-in-up">
      <!-- Today Lane -->
      <div class="kanban-column">
        <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <mat-icon class="text-primary">today</mat-icon>
            <span class="fw-bold text-color">Due Today</span>
          </div>
          <span class="badge rounded-pill bg-primary-tint text-primary fw-bold" style="font-size: 11px;">{{today.length}}</span>
        </div>
        
        <div class="kanban-content">
          <div *ngIf="today.length === 0" class="text-center py-5 text-muted small">
            <i class="bi bi-calendar-check fs-3 d-block opacity-50 mb-2"></i>
            No reminders due today
          </div>
          <div *ngFor="let f of today" class="kanban-card">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary-tint text-primary small">#Lead {{f.leadId}}</span>
              <span class="small text-muted"><i class="bi bi-clock me-1"></i>{{f.followUpDate | date:'shortTime'}}</span>
            </div>
            <p class="small text-color fw-bold mb-3 text-wrap">{{f.discussion}}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge rounded-pill bg-warning-tint text-warning" style="font-size: 9px; letter-spacing: 0.5px;">{{f.status}}</span>
              <a [routerLink]="['/leads/view', f.leadId]" class="btn btn-outline-primary p-1 border-0 bg-transparent btn-sm" matTooltip="View Lead Profile">
                <mat-icon style="font-size: 18px; width: 18px; height: 18px;">arrow_forward</mat-icon>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Overdue Lane -->
      <div class="kanban-column">
        <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <mat-icon class="text-danger">warning</mat-icon>
            <span class="fw-bold text-danger">Overdue Tasks</span>
          </div>
          <span class="badge rounded-pill bg-danger-tint text-danger fw-bold" style="font-size: 11px;">{{overdue.length}}</span>
        </div>
        
        <div class="kanban-content">
          <div *ngIf="overdue.length === 0" class="text-center py-5 text-muted small">
            <i class="bi bi-emoji-smile fs-3 d-block opacity-50 mb-2"></i>
            No overdue tasks
          </div>
          <div *ngFor="let f of overdue" class="kanban-card" style="border-left: 3px solid var(--danger);">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-danger-tint text-danger small">#Lead {{f.leadId}}</span>
              <span class="small text-danger fw-bold"><i class="bi bi-calendar-x me-1"></i>{{f.followUpDate | date:'mediumDate'}}</span>
            </div>
            <p class="small text-color fw-bold mb-3 text-wrap">{{f.discussion}}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge rounded-pill bg-danger-tint text-danger" style="font-size: 9px; letter-spacing: 0.5px;">{{f.status}}</span>
              <a [routerLink]="['/leads/view', f.leadId]" class="btn btn-outline-primary p-1 border-0 bg-transparent btn-sm" matTooltip="View Lead Profile">
                <mat-icon style="font-size: 18px; width: 18px; height: 18px;">arrow_forward</mat-icon>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Lane -->
      <div class="kanban-column">
        <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <mat-icon class="text-success">event</mat-icon>
            <span class="fw-bold text-success">Upcoming Tasks</span>
          </div>
          <span class="badge rounded-pill bg-success-tint text-success fw-bold" style="font-size: 11px;">{{upcoming.length}}</span>
        </div>
        
        <div class="kanban-content">
          <div *ngIf="upcoming.length === 0" class="text-center py-5 text-muted small">
            <i class="bi bi-calendar fs-3 d-block opacity-50 mb-2"></i>
            No upcoming interactions scheduled
          </div>
          <div *ngFor="let f of upcoming" class="kanban-card" style="border-left: 3px solid var(--success);">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-success-tint text-success small">#Lead {{f.leadId}}</span>
              <span class="small text-muted"><i class="bi bi-calendar-check me-1"></i>{{f.followUpDate | date:'mediumDate'}}</span>
            </div>
            <p class="small text-color fw-bold mb-3 text-wrap">{{f.discussion}}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge rounded-pill bg-success-tint text-success" style="font-size: 9px; letter-spacing: 0.5px;">{{f.status}}</span>
              <a [routerLink]="['/leads/view', f.leadId]" class="btn btn-outline-primary p-1 border-0 bg-transparent btn-sm" matTooltip="View Lead Profile">
                <mat-icon style="font-size: 18px; width: 18px; height: 18px;">arrow_forward</mat-icon>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-color {
      color: var(--text);
    }
    .bg-light {
      background-color: var(--surface-2) !important;
    }
    .lane-card {
      background-color: var(--surface) !important;
      min-height: 480px;
    }
    .lane-header {
      border-color: var(--border) !important;
    }
    .lane-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .primary-box { background-color: var(--primary-tint); color: var(--primary); }
    .danger-box { background-color: var(--danger-tint); color: var(--danger); }
    .success-box { background-color: var(--accent-tint); color: var(--accent); }
    
    .reminder-item-card {
      background-color: var(--surface) !important;
      border: 1px solid var(--border) !important;
      border-left: 3px solid var(--primary) !important;
      transition: var(--transition);
    }
    .reminder-item-card.overdue-border {
      border-left: 3px solid var(--danger) !important;
    }
    .reminder-item-card.success-border {
      border-left: 3px solid var(--accent) !important;
    }
    .reminder-item-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md) !important;
      background-color: var(--surface-2) !important;
    }
    .view-btn {
      color: var(--text-secondary) !important;
      transition: var(--transition);
    }
    .reminder-item-card:hover .view-btn {
      color: var(--primary) !important;
      transform: translateX(2px);
    }
  `]
})
export class ReminderComponent implements OnInit {
  private service = inject(FollowUpService);
  
  today: FollowUp[] = [];
  overdue: FollowUp[] = [];
  upcoming: FollowUp[] = [];

  ngOnInit() {
    this.service.getTodayReminders().subscribe((resp: ApiResponse<FollowUp[]>) => this.today = resp.data);
    this.service.getOverdueReminders().subscribe((resp: ApiResponse<FollowUp[]>) => this.overdue = resp.data);
    this.service.getUpcomingReminders().subscribe((resp: ApiResponse<FollowUp[]>) => this.upcoming = resp.data);
  }
}
