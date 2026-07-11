import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Chart, registerables } from 'chart.js';
import { interval, Subscription, switchMap, startWith } from 'rxjs';

import { DashboardService } from '../../core/services/dashboard.service';
import { CustomerLeadService } from '../../core/services/customer-lead.service';
import { ExportService } from '../../core/services/export.service';
import { FollowUpService } from '../../core/services/follow-up.service';
import { DashboardResponse, CustomerLead, FollowUp, ApiResponse, PagedResponse } from '../../core/models/crm.models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, 
    MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <!-- Dashboard Welcome Banner -->
    <div class="welcome-banner animate-fade-in-up">
      <h2 class="fw-bold mb-1">Welcome back, sales administrator!</h2>
      <p class="mb-0 opacity-75">Your customer pipelines are active. You have {{stats?.upcomingFollowUps || 0}} upcoming follow-ups scheduled for this week.</p>
    </div>

    <!-- Stats Cards Grid (Single Row) -->
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-6 g-3 mb-4 animate-fade-in-up" *ngIf="!isLoading; else skeletonStats">
      <div class="col" *ngFor="let card of statCards | slice:0:6">
        <div class="crm-card stat-card p-3 shadow-sm d-flex align-items-center h-100 border-0"
             [style.background]="'linear-gradient(135deg, var(--surface) 0%, ' + card.bg + ' 100%)'">
          <div class="stat-icon-wrapper me-2" [style.borderColor]="card.color + '33'" [style.backgroundColor]="card.bg">
            <div class="stat-icon" [style.backgroundColor]="card.color" style="width: 32px; height: 32px;">
              <mat-icon class="text-white" style="font-size: 18px; width: 18px; height: 18px;">{{card.icon}}</mat-icon>
            </div>
          </div>
          <div>
            <div class="text-muted small fw-bold text-uppercase tracking-wider date-text">{{card.label}}</div>
            <div class="h4 fw-bold mb-0 mt-1 text-color leading-none">{{card.value}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Layout Splits -->
    <div class="row g-4 animate-fade-in-up">
      <!-- Left Column (8/12 grid) -->
      <div class="col-lg-8">
        <!-- Monthly Trends Chart -->
        <div class="crm-card p-4 shadow-sm mb-4 border-0">
          <h5 class="fw-bold mb-4 d-flex align-items-center text-color">
            <i class="bi bi-graph-up text-primary me-2"></i> Monthly Lead Trends
          </h5>
          <div class="chart-container" style="height: 300px; position: relative;">
            <canvas id="monthlyChart"></canvas>
          </div>
        </div>

        <!-- Stacking charts side-by-side -->
        <div class="row g-4 mb-4">
          <div class="col-md-6">
            <div class="crm-card p-4 shadow-sm border-0 h-100">
              <h5 class="fw-bold mb-4 d-flex align-items-center text-color">
                <i class="bi bi-pie-chart text-primary me-2"></i> Lead Status
              </h5>
              <div class="chart-container" style="height: 250px; position: relative;">
                <canvas id="statusChart"></canvas>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="crm-card p-4 shadow-sm border-0 h-100">
              <h5 class="fw-bold mb-4 d-flex align-items-center text-color">
                <i class="bi bi-lightning-charge text-danger me-2"></i> Priority Distribution
              </h5>
              <div class="chart-container" style="height: 250px; position: relative;">
                <canvas id="priorityChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-4">
          <div class="col-md-6">
            <div class="crm-card p-4 shadow-sm border-0 h-100">
              <h5 class="fw-bold mb-4 d-flex align-items-center text-color">
                <i class="bi bi-tag text-primary me-2"></i> Leads by Type
              </h5>
              <div class="chart-container" style="height: 250px; position: relative;">
                <canvas id="typeChart"></canvas>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="crm-card p-4 shadow-sm border-0 h-100">
              <h5 class="fw-bold mb-4 d-flex align-items-center text-color">
                <i class="bi bi-geo-alt text-success me-2"></i> Leads by City
              </h5>
              <div class="chart-container" style="height: 250px; position: relative;">
                <canvas id="cityChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Leads Widget Card -->
        <div class="crm-card shadow-sm border-0 mb-4 p-0 overflow-hidden">
          <div class="p-4 border-bottom d-flex justify-content-between align-items-center bg-transparent">
            <h5 class="fw-bold mb-0 d-flex align-items-center text-color">
              <i class="bi bi-clock-history text-primary me-2"></i> Recent Leads
            </h5>
            <a routerLink="/leads" class="small text-primary text-decoration-none fw-bold">View All</a>
          </div>
          <div class="list-group list-group-flush">
            <div *ngIf="recentLeads.length === 0" class="text-center py-5 text-muted">
              <i class="bi bi-inbox fs-2 opacity-50 d-block mb-2"></i>
              No recent leads available.
            </div>
            <div *ngFor="let lead of recentLeads" class="list-group-item p-3 border-0 d-flex justify-content-between align-items-center bg-transparent recent-lead-item">
              <div class="d-flex align-items-center">
                <div class="avatar-gradient-sm me-3">{{lead.customerName[0].toUpperCase()}}</div>
                <div>
                  <div class="fw-bold small text-color">{{lead.customerName}}</div>
                  <div class="text-muted" style="font-size: 11px;">{{lead.city || 'No City'}} • {{lead.createdDate | date:'mediumDate'}}</div>
                </div>
              </div>
              <span class="custom-badge" [ngClass]="getStatusClass(lead.status)">{{formatStatus(lead.status)}}</span>
            </div>
          </div>
        </div>

        <!-- Recent Pending Activity Timeline Widget Card -->
        <div class="crm-card shadow-sm border-0 p-4 overflow-hidden">
          <h5 class="fw-bold mb-4 d-flex align-items-center text-color">
            <i class="bi bi-clock-history text-primary me-2"></i> Recent Pending Follow-up Trail
          </h5>
          <div class="timeline-tracker" *ngIf="overdueFollowUps.length > 0; else emptyActivity">
            <div class="activity-node" *ngFor="let node of overdueFollowUps">
              <div class="activity-indicator active"></div>
              <div class="ms-1">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold small text-color text-truncate" style="max-width: 70%">{{node.discussion}}</span>
                  <span class="text-danger small fw-bold"><i class="bi bi-exclamation-triangle me-1"></i>{{node.followUpDate | date:'mediumDate'}}</span>
                </div>
                <div class="small text-muted mt-1">Lead ID: #{{node.leadId}} • Status: PENDING LOG</div>
              </div>
            </div>
          </div>
          <ng-template #emptyActivity>
            <div class="text-center py-4 text-muted small">
              <i class="bi bi-check-circle fs-3 d-block opacity-50 mb-2"></i>
              No pending activities
            </div>
          </ng-template>
        </div>
      </div>

      <!-- Right Column (4/12 grid) -->
      <div class="col-lg-4">
        <!-- Today's Appointments Panel -->
        <div class="crm-card shadow-sm border-0 mb-4 p-0 overflow-hidden">
          <div class="p-4 border-bottom d-flex justify-content-between align-items-center bg-transparent">
            <h5 class="fw-bold mb-0 d-flex align-items-center text-color">
              <i class="bi bi-calendar-check text-primary me-2"></i> Today's Appointments
            </h5>
            <span class="badge rounded-pill bg-primary-tint text-primary small">{{todayFollowUps.length}}</span>
          </div>
          <div class="p-3">
            <div *ngIf="todayFollowUps.length === 0" class="text-center py-5 text-muted small">
              <i class="bi bi-calendar2-x fs-3 d-block opacity-50 mb-2"></i>
              No appointments due today
            </div>
            <div *ngFor="let item of todayFollowUps" class="p-3 mb-2 rounded border border-light shadow-sm d-flex justify-content-between align-items-center bg-light">
              <div class="flex-grow-1 min-w-0 me-2">
                <div class="fw-bold small text-color text-truncate">{{item.discussion}}</div>
                <div class="small text-muted mt-1"><i class="bi bi-clock me-1"></i>{{item.followUpDate | date:'shortTime'}}</div>
              </div>
              <a [routerLink]="['/leads/view', item.leadId]" class="btn btn-outline-primary p-2 border-0 bg-transparent" style="min-height: auto !important; padding: 6px !important;"><mat-icon>chevron_right</mat-icon></a>
            </div>
          </div>
        </div>

        <!-- Quick Actions Panel -->
        <div class="crm-card shadow-sm border-0 p-0 overflow-hidden">
          <div class="p-4 border-bottom d-flex justify-content-between align-items-center bg-transparent">
            <h5 class="fw-bold mb-0 d-flex align-items-center text-color">
              <i class="bi bi-grid-3x3-gap text-primary me-2"></i> Quick Actions
            </h5>
          </div>
          <div class="p-4">
            <div class="row g-3">
              <div class="col-12">
                <button class="action-btn w-100 border-0 d-flex align-items-center text-start p-3 bg-transparent" routerLink="/leads/add">
                  <div class="action-icon-box primary-box me-3"><mat-icon>person_add</mat-icon></div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="action-title text-color">Add Lead</div>
                    <div class="action-desc text-muted mt-0.5 text-truncate">Register customer</div>
                  </div>
                  <mat-icon class="text-muted action-chevron ms-auto">chevron_right</mat-icon>
                </button>
              </div>
              <div class="col-12">
                <button class="action-btn w-100 border-0 d-flex align-items-center text-start p-3 bg-transparent" (click)="exportPdf()">
                  <div class="action-icon-box danger-box me-3"><mat-icon>picture_as_pdf</mat-icon></div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="action-title text-color">Export PDF</div>
                    <div class="action-desc text-muted mt-0.5 text-truncate">Download reports</div>
                  </div>
                  <mat-icon class="text-muted action-chevron ms-auto">chevron_right</mat-icon>
                </button>
              </div>
              <div class="col-12">
                <button class="action-btn w-100 border-0 d-flex align-items-center text-start p-3 bg-transparent" (click)="exportExcel()">
                  <div class="action-icon-box success-box me-3"><mat-icon>description</mat-icon></div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="action-title text-color">Export Excel</div>
                    <div class="action-desc text-muted mt-0.5 text-truncate">Save as spreadsheet</div>
                  </div>
                  <mat-icon class="text-muted action-chevron ms-auto">chevron_right</mat-icon>
                </button>
              </div>
              <div class="col-12">
                <button class="action-btn w-100 border-0 d-flex align-items-center text-start p-3 bg-transparent" routerLink="/reminders">
                  <div class="action-icon-box warning-box me-3"><mat-icon>alarm</mat-icon></div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="action-title text-color">Reminders</div>
                    <div class="action-desc text-muted mt-0.5 text-truncate">Track follow-ups</div>
                  </div>
                  <mat-icon class="text-muted action-chevron ms-auto">chevron_right</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton Templates -->
    <ng-template #skeletonStats>
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-sm-6" *ngFor="let i of [1,2,3,4]">
          <div class="crm-card p-3 shadow-sm h-100 skeleton-loading" style="min-height: 80px;"></div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .stat-card {
      transition: var(--transition);
      cursor: pointer;
    }
    .stat-card:hover {
      transform: translateY(-4px);
    }
    .stat-icon-wrapper {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid transparent;
      padding: 2px;
      transition: var(--transition);
    }
    .stat-icon {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      transition: var(--transition);
    }
    .stat-card:hover .stat-icon-wrapper {
      transform: scale(1.05);
    }
    .text-color {
      color: var(--text);
    }
    .leading-none {
      line-height: 1;
    }
    .date-text {
      font-size: 0.7rem;
      letter-spacing: 0.05em;
    }
    .recent-lead-item {
      transition: var(--transition);
      border-bottom: 1px solid var(--border) !important;
    }
    .recent-lead-item:last-child {
      border-bottom: none !important;
    }
    .recent-lead-item:hover {
      background-color: var(--surface-2) !important;
    }
    .avatar-gradient-sm {
      width: 36px; height: 36px; 
      background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%);
      color: #ffffff;
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: bold; font-size: 13px;
      box-shadow: var(--shadow-sm);
    }
    .action-btn {
      background: var(--surface) !important; 
      border: 1px solid var(--border) !important;
      border-radius: var(--radius-md) !important; 
      color: var(--text);
      cursor: pointer; 
      transition: var(--transition);
      min-height: 72px !important;
      height: 72px !important;
      padding: 0 16px !important;
    }
    .action-btn:hover { 
      background: var(--surface-2) !important; 
      box-shadow: var(--shadow-md) !important; 
      transform: translateY(-2px);
      border-color: var(--text-muted) !important;
    }
    .action-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
    }
    .action-btn:hover .action-icon-box {
      transform: scale(1.08) rotate(8deg);
    }
    .primary-box { background-color: var(--primary-tint); color: var(--primary); }
    .danger-box { background-color: var(--danger-tint); color: var(--danger); }
    .success-box { background-color: var(--accent-tint); color: var(--accent); }
    .warning-box { background-color: var(--warning-tint); color: var(--warning); }
    
    .action-title {
      font-size: 0.85rem;
      font-weight: 700;
    }
    .action-desc {
      font-size: 0.72rem;
    }
    .action-chevron {
      font-size: 1.1rem;
      transition: var(--transition);
    }
    .action-btn:hover .action-chevron {
      color: var(--primary) !important;
      transform: translateX(3px);
    }
    .skeleton-loading {
      background: linear-gradient(90deg, var(--surface) 25%, var(--surface-2) 50%, var(--surface) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private dashboardService = inject(DashboardService);
  private leadService = inject(CustomerLeadService);
  private exportService = inject(ExportService);
  private followUpService = inject(FollowUpService);
  private snackBar = inject(MatSnackBar);

  isLoading = true;
  stats?: DashboardResponse;
  recentLeads: CustomerLead[] = [];
  statCards: any[] = [];
  todayFollowUps: FollowUp[] = [];
  overdueFollowUps: FollowUp[] = [];
  
  private refreshSub?: Subscription;
  private charts: Chart[] = [];

  ngOnInit() {
    this.refreshSub = interval(60000).pipe(startWith(0)).subscribe(() => {
      this.loadDashboardData();
    });
  }

  ngAfterViewInit() {
    // We'll update charts when data is loaded
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
    this.charts.forEach(c => c.destroy());
  }

  loadDashboardData() {
    this.isLoading = true;
    this.dashboardService.getStats().subscribe({
      next: (resp: ApiResponse<DashboardResponse>) => {
        this.stats = resp.data;
        this.updateStatCards(resp.data);
        this.createCharts(resp.data);
        this.loadRecentLeads();
        this.loadFollowUpActivities();
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading dashboard stats', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadFollowUpActivities() {
    this.followUpService.getTodayReminders().subscribe({
      next: (resp) => this.todayFollowUps = resp.data || [],
      error: () => {}
    });
    this.followUpService.getOverdueReminders().subscribe({
      next: (resp) => this.overdueFollowUps = (resp.data || []).slice(0, 5),
      error: () => {}
    });
  }

  loadRecentLeads() {
    this.leadService.getLeads(0, 5, 'createdDate', 'desc').subscribe((resp: ApiResponse<PagedResponse<CustomerLead>>) => {
      this.recentLeads = resp.data.content;
    });
  }

  updateStatCards(data: DashboardResponse) {
    this.statCards = [
      { label: 'Total Leads', value: data.totalLeads, icon: 'people', bg: 'var(--primary-tint)', color: 'var(--primary)' },
      { label: 'Won Leads', value: data.closedWonLeads, icon: 'emoji_events', bg: 'var(--success-tint)', color: 'var(--success)' },
      { label: 'Hot Leads', value: data.hotLeads, icon: 'whatshot', bg: 'var(--danger-tint)', color: 'var(--danger)' },
      { label: 'Upcoming', value: data.upcomingFollowUps, icon: 'event', bg: 'var(--warning-tint)', color: 'var(--warning)' },
      { label: 'New Leads', value: data.newLeads, icon: 'fiber_new', bg: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' },
      { label: 'Lead Types', value: data.totalLeadTypes, icon: 'category', bg: 'var(--surface-2)', color: 'var(--text-secondary)' },
      { label: 'Total Users', value: data.totalUsers, icon: 'admin_panel_settings', bg: 'rgba(8, 145, 178, 0.1)', color: '#0891b2' },
      { label: 'Total Notes', value: data.totalNotes, icon: 'notes', bg: 'rgba(219, 39, 119, 0.1)', color: '#db2777' },
    ];
  }

  createCharts(data: DashboardResponse) {
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    // Check light/dark mode for chart colors
    const isDark = document.body.classList.contains('dark-mode');
    const textMutedColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#222f45' : '#e2e8f0';

    const globalChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textMutedColor,
            font: { family: 'Inter', weight: 'bold' }
          }
        }
      }
    } as any;

    // Monthly Chart
    this.createChart('monthlyChart', 'line', {
      labels: Object.keys(data.monthlyStats),
      datasets: [{
        label: 'New Leads',
        data: Object.values(data.monthlyStats),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4
      }]
    }, {
      ...globalChartOptions,
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textMutedColor } },
        y: { grid: { color: gridColor }, ticks: { color: textMutedColor } }
      }
    });

    // Status Chart
    this.createChart('statusChart', 'pie', {
      labels: Object.keys(data.statusStats).map(s => s.replace(/_/g, ' ')),
      datasets: [{
        data: Object.values(data.statusStats),
        backgroundColor: ['#2563eb', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#ef4444', '#94a3b8']
      }]
    }, globalChartOptions);

    // Priority Chart
    this.createChart('priorityChart', 'doughnut', {
      labels: Object.keys(data.priorityStats),
      datasets: [{
        data: Object.values(data.priorityStats),
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#94a3b8']
      }]
    }, {
      ...globalChartOptions,
      cutout: '72%'
    });

    // Type Chart
    this.createChart('typeChart', 'bar', {
      labels: Object.keys(data.leadTypeStats),
      datasets: [{
        label: 'Leads',
        data: Object.values(data.leadTypeStats),
        backgroundColor: '#2563eb',
        borderRadius: 4
      }]
    }, {
      ...globalChartOptions,
      scales: {
        x: { grid: { display: false }, ticks: { color: textMutedColor } },
        y: { grid: { color: gridColor }, ticks: { color: textMutedColor } }
      }
    });

    // City Chart
    this.createChart('cityChart', 'bar', {
      labels: Object.keys(data.cityStats),
      datasets: [{
        label: 'Leads',
        data: Object.values(data.cityStats),
        backgroundColor: '#10b981',
        borderRadius: 4
      }]
    }, {
      ...globalChartOptions,
      indexAxis: 'y',
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textMutedColor } },
        y: { grid: { display: false }, ticks: { color: textMutedColor } }
      }
    });
  }

  createChart(id: string, type: any, data: any, options: any = {}) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (ctx) {
      const chart = new Chart(ctx, { type, data, options });
      this.charts.push(chart);
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'NEW': return 'status-new';
      case 'CONTACTED': return 'status-contacted';
      case 'INTERESTED': return 'status-interested';
      case 'CLOSED_WON': return 'status-closed';
      case 'CLOSED_LOST': return 'status-hot';
      default: return 'status-contacted';
    }
  }

  formatStatus(status: string): string {
    return status ? status.replace(/_/g, ' ') : '';
  }

  exportPdf() {
    this.exportService.exportPdf();
  }

  exportExcel() {
    this.exportService.exportExcel();
  }
}

