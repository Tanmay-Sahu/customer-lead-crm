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
    <div class="mb-4">
      <h1 class="fw-bold h2 mb-1">Reminders & Follow-ups</h1>
      <p class="text-muted small">Stay on top of your customer interactions</p>
    </div>

    <div class="row g-4">
      <div class="col-lg-4">
        <mat-card class="reminder-card border-0 shadow-sm border-top border-4 border-primary">
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">today</mat-icon>
            <mat-card-title class="fw-bold">Today</mat-card-title>
            <mat-card-subtitle>Due today</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="mt-3">
            <mat-list>
              <div *ngIf="today.length === 0" class="text-center py-4 text-muted small">No reminders for today</div>
              <mat-list-item *ngFor="let f of today" class="mb-2 reminder-item rounded">
                <mat-icon matListItemIcon color="primary">chevron_right</mat-icon>
                <div matListItemTitle class="fw-bold small">{{f.discussion | slice:0:30}}...</div>
                <div matListItemLine class="small text-muted">{{f.followUpDate | date:'shortTime'}}</div>
                <button mat-icon-button matListItemMeta [routerLink]="['/leads/view', f.leadId]"><mat-icon>visibility</mat-icon></button>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="col-lg-4">
        <mat-card class="reminder-card border-0 shadow-sm border-top border-4 border-danger">
          <mat-card-header>
            <mat-icon mat-card-avatar class="text-danger">warning</mat-icon>
            <mat-card-title class="fw-bold text-danger">Overdue</mat-card-title>
            <mat-card-subtitle>Missed appointments</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="mt-3">
            <mat-list>
              <div *ngIf="overdue.length === 0" class="text-center py-4 text-muted small">Great! No overdue follow-ups</div>
              <mat-list-item *ngFor="let f of overdue" class="mb-2 reminder-item rounded">
                <mat-icon matListItemIcon class="text-danger">error_outline</mat-icon>
                <div matListItemTitle class="fw-bold small">{{f.discussion | slice:0:30}}...</div>
                <div matListItemLine class="small text-muted">{{f.followUpDate | date:'mediumDate'}}</div>
                <button mat-icon-button matListItemMeta [routerLink]="['/leads/view', f.leadId]"><mat-icon>visibility</mat-icon></button>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="col-lg-4">
        <mat-card class="reminder-card border-0 shadow-sm border-top border-4 border-info">
          <mat-card-header>
            <mat-icon mat-card-avatar color="accent">upcoming</mat-icon>
            <mat-card-title class="fw-bold">Upcoming</mat-card-title>
            <mat-card-subtitle>Next 7 days</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content class="mt-3">
            <mat-list>
              <div *ngIf="upcoming.length === 0" class="text-center py-4 text-muted small">No upcoming follow-ups</div>
              <mat-list-item *ngFor="let f of upcoming" class="mb-2 reminder-item rounded">
                <mat-icon matListItemIcon color="accent">calendar_today</mat-icon>
                <div matListItemTitle class="fw-bold small">{{f.discussion | slice:0:30}}...</div>
                <div matListItemLine class="small text-muted">{{f.followUpDate | date:'mediumDate'}}</div>
                <button mat-icon-button matListItemMeta [routerLink]="['/leads/view', f.leadId]"><mat-icon>visibility</mat-icon></button>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .reminder-card {
      background-color: var(--surface) !important;
      color: var(--text) !important;
    }
    .reminder-card mat-card-title {
      color: var(--text) !important;
    }
    .reminder-card mat-card-subtitle {
      color: var(--text-secondary) !important;
    }
    .reminder-item {
      background-color: var(--surface-2) !important;
      color: var(--text) !important;
    }
    .reminder-item div[matListItemTitle] {
      color: var(--text) !important;
    }
    .reminder-item div[matListItemLine] {
      color: var(--text-secondary) !important;
    }
    .reminder-item button {
      color: var(--text-secondary) !important;
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
