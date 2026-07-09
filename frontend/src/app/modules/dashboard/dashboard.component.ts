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
import { DashboardResponse, CustomerLead, ApiResponse, PagedResponse } from '../../core/models/crm.models';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, 
    MatProgressSpinnerModule, MatSnackBarModule, MatTooltipModule
  ],
  template: `
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h1 class="fw-bold h2 mb-1">CRM Dashboard</h1>
        <p class="text-muted small mb-0">Overview of your lead pipeline and activities</p>
      </div>
      <div class="col-auto d-flex gap-2">
        <button mat-stroked-button (click)="loadDashboardData()">
          <mat-icon class="me-1">refresh</mat-icon> Refresh
        </button>
        <button mat-raised-button color="primary" routerLink="/leads/add">
          <mat-icon class="me-1">add</mat-icon> New Lead
        </button>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="row g-3 mb-4" *ngIf="!isLoading; else skeletonStats">
      <div class="col-md-3 col-sm-6" *ngFor="let card of statCards">
        <div class="crm-card p-3 shadow-sm d-flex align-items-center h-100">
          <div class="stat-icon me-3" [style.backgroundColor]="card.bg" [style.color]="card.color">
            <mat-icon>{{card.icon}}</mat-icon>
          </div>
          <div>
            <div class="text-muted small fw-bold">{{card.label}}</div>
            <div class="h4 fw-bold mb-0">{{card.value}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="crm-card p-4 shadow-sm h-100 border-0">
          <h5 class="fw-bold mb-4">Monthly Lead Trends</h5>
          <div class="chart-container" style="height: 300px;">
            <canvas id="monthlyChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="crm-card p-4 shadow-sm h-100 border-0">
          <h5 class="fw-bold mb-4">Lead Status Breakdown</h5>
          <div class="chart-container" style="height: 300px;">
            <canvas id="statusChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-lg-4">
        <div class="crm-card p-4 shadow-sm h-100 border-0">
          <h5 class="fw-bold mb-4">Priority Distribution</h5>
          <div class="chart-container" style="height: 250px;">
            <canvas id="priorityChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="crm-card p-4 shadow-sm h-100 border-0">
          <h5 class="fw-bold mb-4">Leads by Type</h5>
          <div class="chart-container" style="height: 250px;">
            <canvas id="typeChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="crm-card p-4 shadow-sm h-100 border-0">
          <h5 class="fw-bold mb-4">Leads by City</h5>
          <div class="chart-container" style="height: 250px;">
            <canvas id="cityChart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Widgets Row -->
    <div class="row g-4">
      <div class="col-lg-6">
        <div class="crm-card shadow-sm border-0 h-100 p-0 overflow-hidden">
          <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Recent Leads</h5>
            <a routerLink="/leads" class="small text-primary text-decoration-none fw-bold">View All</a>
          </div>
          <div class="list-group list-group-flush">
            <div *ngFor="let lead of recentLeads" class="list-group-item p-3 border-0 d-flex justify-content-between align-items-center bg-transparent">
              <div class="d-flex align-items-center">
                <div class="avatar-sm me-3">{{lead.customerName[0]}}</div>
                <div>
                  <div class="fw-bold small">{{lead.customerName}}</div>
                  <div class="text-muted" style="font-size: 11px;">{{lead.city}} • {{lead.createdDate | date:'shortDate'}}</div>
                </div>
              </div>
              <span class="badge rounded-pill small" [ngClass]="getStatusClass(lead.status)">{{lead.status}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="crm-card shadow-sm border-0 h-100 p-0 overflow-hidden">
          <div class="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0">Quick Actions</h5>
          </div>
          <div class="p-4">
            <div class="row g-3">
              <div class="col-6">
                <button class="action-btn w-100" routerLink="/leads/add">
                  <mat-icon color="primary">person_add</mat-icon>
                  <div>Add Lead</div>
                </button>
              </div>
              <div class="col-6">
                <button class="action-btn w-100" (click)="exportPdf()">
                  <mat-icon color="warn">picture_as_pdf</mat-icon>
                  <div>Export PDF</div>
                </button>
              </div>
              <div class="col-6">
                <button class="action-btn w-100" (click)="exportExcel()">
                  <mat-icon color="accent">description</mat-icon>
                  <div>Export Excel</div>
                </button>
              </div>
              <div class="col-6">
                <button class="action-btn w-100">
                  <mat-icon style="color: #6366f1;">settings</mat-icon>
                  <div>Settings</div>
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
    .stat-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .avatar-sm {
      width: 35px; height: 35px; background: var(--surface-2); border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-weight: bold; font-size: 13px; color: var(--text-secondary);
    }
    .action-btn {
      padding: 20px; background: var(--surface-2); border: 1px solid var(--border);
      border-radius: 12px; text-align: center; color: var(--text);
      font-weight: 600; cursor: pointer; transition: 0.2s;
    }
    .action-btn:hover { background: var(--sidebar-hover-bg); border-color: var(--sidebar-hover-color); transform: scale(1.02); }
    .action-btn mat-icon { font-size: 28px; width: 28px; height: 28px; margin-bottom: 8px; }
    
    .status-new { background-color: #e0f2fe; color: #0369a1; }
    .status-interested { background-color: #dcfce7; color: #15803d; }
    
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
  private snackBar = inject(MatSnackBar);

  isLoading = true;
  stats?: DashboardResponse;
  recentLeads: CustomerLead[] = [];
  statCards: any[] = [];
  
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
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading dashboard stats', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  loadRecentLeads() {
    this.leadService.getLeads(0, 5, 'createdDate', 'desc').subscribe((resp: ApiResponse<PagedResponse<CustomerLead>>) => {
      this.recentLeads = resp.data.content;
    });
  }

  updateStatCards(data: DashboardResponse) {
    this.statCards = [
      { label: 'Total Leads', value: data.totalLeads, icon: 'people', bg: '#eff6ff', color: '#2563eb' },
      { label: 'Won Leads', value: data.closedWonLeads, icon: 'emoji_events', bg: '#f0fdf4', color: '#16a34a' },
      { label: 'Hot Leads', value: data.hotLeads, icon: 'whatshot', bg: '#fef2f2', color: '#dc2626' },
      { label: 'Upcoming', value: data.upcomingFollowUps, icon: 'event', bg: '#fff7ed', color: '#ea580c' },
      { label: 'New Leads', value: data.newLeads, icon: 'fiber_new', bg: '#fdf4ff', color: '#c026d3' },
      { label: 'Lead Types', value: data.totalLeadTypes, icon: 'category', bg: '#f1f5f9', color: '#64748b' },
      { label: 'Total Users', value: data.totalUsers, icon: 'admin_panel_settings', bg: '#ecfeff', color: '#0891b2' },
      { label: 'Total Notes', value: data.totalNotes, icon: 'notes', bg: '#fdf2f8', color: '#db2777' },
    ];
  }

  createCharts(data: DashboardResponse) {
    this.charts.forEach(c => c.destroy());
    this.charts = [];

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
    }, { maintainAspectRatio: false, responsive: true });

    // Status Chart
    this.createChart('statusChart', 'pie', {
      data: Object.values(data.statusStats),
      datasets: [{
        data: Object.values(data.statusStats),
        backgroundColor: ['#2563eb', '#64748b', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6', '#ef4444', '#f97316']
      }]
    }, { maintainAspectRatio: false, responsive: true });

    // Priority Chart
    this.createChart('priorityChart', 'doughnut', {
      labels: Object.keys(data.priorityStats),
      datasets: [{
        data: Object.values(data.priorityStats),
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#94a3b8']
      }]
    }, { cutout: '70%', maintainAspectRatio: false, responsive: true });

    // Type Chart
    this.createChart('typeChart', 'bar', {
      labels: Object.keys(data.leadTypeStats),
      datasets: [{
        label: 'Leads',
        data: Object.values(data.leadTypeStats),
        backgroundColor: '#2563eb'
      }]
    }, { maintainAspectRatio: false, responsive: true });

    // City Chart
    this.createChart('cityChart', 'bar', {
      labels: Object.keys(data.cityStats),
      datasets: [{
        label: 'Leads',
        data: Object.values(data.cityStats),
        backgroundColor: '#10b981'
      }]
    }, { indexAxis: 'y', maintainAspectRatio: false, responsive: true });
  }

  createChart(id: string, type: any, data: any, options: any = {}) {
    const ctx = document.getElementById(id) as HTMLCanvasElement;
    if (ctx) {
      const chart = new Chart(ctx, { type, data, options });
      this.charts.push(chart);
    }
  }

  getStatusClass(status: string) {
    if (status === 'NEW') return 'status-new';
    if (status === 'INTERESTED' || status === 'CLOSED_WON') return 'status-interested';
    return 'status-contacted';
  }

  exportPdf() {
    this.exportService.exportPdf();
  }

  exportExcel() {
    this.exportService.exportExcel();
  }
}
