import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpEventType } from '@angular/common/http';
import { ImportSummaryDialogComponent } from './import-summary-dialog.component';

import { CustomerLeadService } from '../../../core/services/customer-lead.service';
import { LeadTypeService } from '../../../core/services/lead-type.service';
import { CustomerLead, LeadStatus, Priority, LeadType, ApiResponse, PagedResponse } from '../../../core/models/crm.models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, 
    MatButtonModule, MatIconModule, MatChipsModule, MatDialogModule, MatSnackBarModule, 
    MatProgressSpinnerModule, MatProgressBarModule, MatTooltipModule, MatMenuModule, MatTabsModule,
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <div class="row mb-4 align-items-center">
      <div class="col">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item"><a routerLink="/dashboard">Dashboard</a></li>
            <li class="breadcrumb-item active">Customer Leads</li>
          </ol>
        </nav>
        <h1 class="fw-bold h2 mb-0">Customer Leads</h1>
      </div>
      <div class="col-auto d-flex align-items-center gap-2">
        <button mat-stroked-button color="primary" class="rounded-pill px-3" (click)="downloadTemplate()" matTooltip="Download Excel import template">
          <mat-icon class="me-1">download</mat-icon> Template
        </button>
        <button mat-raised-button color="accent" class="rounded-pill px-3 bg-success text-white" (click)="fileInput.click()" [disabled]="isUploading">
          <mat-icon class="me-1">upload_file</mat-icon> Import Excel
        </button>
        <input type="file" #fileInput (change)="onFileSelected($event)" accept=".xlsx,.xls" style="display: none">
        <button mat-raised-button color="primary" class="rounded-pill px-4" routerLink="add">
          <mat-icon class="me-1">person_add_alt</mat-icon> Add New Lead
        </button>
      </div>
    </div>

    <!-- Uploading State Overlay -->
    <div *ngIf="isUploading" class="upload-progress-container mb-3 p-3 border rounded shadow-sm">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="d-flex align-items-center text-primary fw-semibold">
          <mat-icon class="spinner-icon me-2">cloud_upload</mat-icon>
          Uploading leads spreadsheet... ({{uploadProgress}}%)
        </span>
      </div>
      <mat-progress-bar mode="determinate" [value]="uploadProgress"></mat-progress-bar>
    </div>

    <!-- Filter Panel -->
    <div class="crm-card mb-4 p-4 shadow-sm">
      <form [formGroup]="filterForm" class="row g-3">
        <div class="col-md-3">
          <mat-form-field appearance="outline" class="w-100 mb-0">
            <mat-label>Customer Name</mat-label>
            <input matInput formControlName="customerName" placeholder="Client name...">
          </mat-form-field>
        </div>
        <div class="col-md-3">
          <mat-form-field appearance="outline" class="w-100 mb-0">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option [value]="null">All Statuses</mat-option>
              <mat-option *ngFor="let s of statuses" [value]="s">{{s}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="col-md-2">
          <mat-form-field appearance="outline" class="w-100 mb-0">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option [value]="null">All Priorities</mat-option>
              <mat-option *ngFor="let p of priorities" [value]="p">{{p}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="col-md-2">
          <mat-form-field appearance="outline" class="w-100 mb-0">
            <mat-label>Lead Type</mat-label>
            <mat-select formControlName="leadTypeId">
              <mat-option [value]="null">All Types</mat-option>
              <mat-option *ngFor="let type of leadTypes" [value]="type.id">{{type.leadTypeName}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="col-md-2 d-flex align-items-center gap-2">
          <button mat-flat-button color="primary" class="h-100 flex-grow-1" (click)="applyFilters()">Filter</button>
          <button mat-icon-button (click)="resetFilters()" matTooltip="Reset Filters">
            <mat-icon>refresh</mat-icon>
          </button>
        </div>
      </form>
    </div>

    <!-- Table Section -->
    <div class="crm-card p-0 shadow-sm overflow-hidden">
      <div class="table-container position-relative">
        <div class="loading-overlay" *ngIf="isLoading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>

        <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSortChange($event)">
          <!-- Name Column -->
          <ng-container matColumnDef="customerName">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Customer </th>
            <td mat-cell *matCellDef="let element">
              <div class="d-flex align-items-center py-2">
                <div class="avatar me-3">{{element.customerName[0]}}</div>
                <div>
                  <div class="fw-bold">{{element.customerName}}</div>
                  <div class="text-muted small"><i class="bi bi-phone me-1"></i>{{element.mobile}}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <!-- Type Column -->
          <ng-container matColumnDef="leadType">
            <th mat-header-cell *matHeaderCellDef> Type </th>
            <td mat-cell *matCellDef="let element"> {{element.leadTypeName}} </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
            <td mat-cell *matCellDef="let element">
              <span class="custom-badge" [ngClass]="getStatusClass(element.status)">
                {{formatEnum(element.status)}}
              </span>
            </td>
          </ng-container>

          <!-- Priority Column -->
          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> Priority </th>
            <td mat-cell *matCellDef="let element">
              <span class="custom-badge" [ngClass]="getPriorityClass(element.priority)">
                {{formatEnum(element.priority)}}
              </span>
            </td>
          </ng-container>

          <!-- City Column -->
          <ng-container matColumnDef="city">
            <th mat-header-cell *matHeaderCellDef mat-sort-header> City </th>
            <td mat-cell *matCellDef="let element"> {{element.city || '-'}} </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="text-end pe-4"> Actions </th>
            <td mat-cell *matCellDef="let element" class="text-end pe-4">
              <span [matTooltip]="isMobileValid(element.mobile) ? 'Contact via WhatsApp' : 'Invalid Mobile Number'">
                <a mat-icon-button 
                   class="text-success me-1"
                   [href]="isMobileValid(element.mobile) ? getWhatsAppUrl(element.mobile, element.customerName) : 'javascript:void(0)'" 
                   target="_blank"
                   [style.pointer-events]="isMobileValid(element.mobile) ? 'auto' : 'none'"
                   [style.opacity]="isMobileValid(element.mobile) ? '1' : '0.5'"
                   [disabled]="!isMobileValid(element.mobile)"
                   (click)="!isMobileValid(element.mobile) ? $event.preventDefault() : null">
                  <i class="bi bi-whatsapp fs-5"></i>
                </a>
              </span>
              <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item [routerLink]="['view', element.id]"><mat-icon>visibility</mat-icon> View Details</button>
                <button mat-menu-item [routerLink]="['edit', element.id]"><mat-icon>edit</mat-icon> Edit</button>
                <button mat-menu-item (click)="deleteLead(element)" class="text-danger"><mat-icon color="warn">delete</mat-icon> Delete</button>
              </mat-menu>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="lead-row"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell p-5 text-center text-muted" colspan="6">
              <div *ngIf="!isLoading">
                <mat-icon class="fs-1 mb-2 opacity-50" style="width: auto; height: auto;">person_search</mat-icon>
                <p class="mb-0">No leads found. Use "Add New Lead" to begin.</p>
              </div>
            </td>
          </tr>
        </table>

        <mat-paginator [length]="totalElements"
                       [pageSize]="pageSize"
                       [pageSizeOptions]="[5, 10, 25, 50]"
                       (page)="onPageChange($event)"
                       showFirstLastButtons>
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .table-container { min-height: 400px; }
    .loading-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--bg);
      opacity: 0.8;
      z-index: 10;
      display: flex; justify-content: center; align-items: center;
    }
    .avatar {
      width: 40px; height: 40px; 
      background-color: var(--surface-2); color: var(--primary);
      border-radius: 50%; display: flex; 
      align-items: center; justify-content: center;
      font-weight: bold; border: 2px solid var(--border);
      box-shadow: var(--card-shadow);
    }
    .lead-row:hover { background-color: var(--sidebar-hover-bg) !important; cursor: pointer; }
    .custom-badge {
      padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;
    }
    .status-new { background-color: #e0f2fe; color: #0369a1; }
    .status-contacted { background-color: #f1f5f9; color: #475569; }
    .status-interested { background-color: #dcfce7; color: #15803d; }
    .status-hot { background-color: #fee2e2; color: #b91c1c; }
    .status-warm { background-color: #fef3c7; color: #92400e; }
    .status-cold { background-color: #f3f4f6; color: #374151; }
    .status-closed { background-color: #dcfce7; color: #166534; border: 1px solid #bdf2ce; }
    .upload-progress-container {
      background-color: var(--surface-2);
      border-color: var(--border) !important;
      color: var(--text);
    }
    .spinner-icon {
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
  `]
})
export class LeadListComponent implements OnInit {
  private leadService = inject(CustomerLeadService);
  private leadTypeService = inject(LeadTypeService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  searchQuery: string | null = null;
  isUploading = false;
  uploadProgress = 0;

  // Components properties
  displayedColumns: string[] = ['customerName', 'leadType', 'status', 'priority', 'city', 'actions'];
  dataSource = new MatTableDataSource<CustomerLead>([]);
  isLoading = true;
  
  // Pagination & Sorting State
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  sortBy = 'createdDate';
  sortDir = 'desc';

  // Filters Data
  statuses = Object.values(LeadStatus);
  priorities = Object.values(Priority);
  leadTypes: LeadType[] = [];

  filterForm = this.fb.group({
    customerName: [''],
    mobile: [''],
    status: [null as LeadStatus | null],
    priority: [null as Priority | null],
    leadTypeId: [null as number | null],
    city: ['']
  });

  ngOnInit() {
    this.loadLeadTypes();
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || null;
      this.currentPage = params['page'] ? +params['page'] : 0;
      this.loadLeads();
    });
  }

  loadLeadTypes() {
    this.leadTypeService.getAllLeadTypes().subscribe(resp => this.leadTypes = resp.data);
  }

  loadLeads() {
    this.isLoading = true;
    
    if (this.searchQuery) {
      this.leadService.globalSearch(this.searchQuery, this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
        next: (resp) => this.handleResponse(resp),
        error: () => this.handleError()
      });
      return;
    }

    // Check if any filter is active
    const filters = this.filterForm.value;
    const isFiltered = Object.values(filters).some(val => val !== null && val !== '');

    if (isFiltered) {
      const searchCriteria = {
        ...filters,
        page: this.currentPage,
        size: this.pageSize,
        sortBy: this.sortBy,
        sortDir: this.sortDir
      } as any;

      this.leadService.searchLeads(searchCriteria).subscribe({
        next: (resp) => this.handleResponse(resp),
        error: () => this.handleError()
      });
    } else {
      this.leadService.getLeads(this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
        next: (resp) => this.handleResponse(resp),
        error: () => this.handleError()
      });
    }
  }

  handleResponse(resp: ApiResponse<PagedResponse<CustomerLead>>) {
    this.dataSource.data = resp.data.content;
    this.totalElements = resp.data.totalElements;
    this.isLoading = false;
  }

  handleError() {
    this.snackBar.open('Error loading leads', 'Close', { duration: 3000 });
    this.isLoading = false;
  }

  applyFilters() {
    this.currentPage = 0;
    this.loadLeads();
  }

  resetFilters() {
    this.filterForm.reset();
    this.router.navigate(['/leads'], { queryParams: {} });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadLeads();
  }

  onSortChange(sort: Sort) {
    this.sortBy = sort.active === 'leadType' ? 'leadType.leadTypeName' : sort.active;
    this.sortDir = sort.direction || 'desc';
    this.loadLeads();
  }

  deleteLead(lead: CustomerLead) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Customer Lead',
        message: `Permanently delete ${lead.customerName}? All follow-ups and notes will be removed.`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.isLoading = true;
        this.leadService.deleteLead(lead.id).subscribe({
          next: () => {
            this.snackBar.open('Lead deleted successfully', 'Close', { duration: 3000 });
            this.loadLeads();
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Error deleting lead', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }

  // UI Helpers
  formatEnum(val: string) { return val?.replace(/_/g, ' '); }

  isMobileValid(mobile?: string): boolean {
    if (!mobile) return false;
    const cleanMobile = mobile.replace(/\D/g, '');
    return cleanMobile.length >= 10;
  }

  getWhatsAppUrl(mobile: string, name: string): string {
    if (!mobile) return '';
    let cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.startsWith('91') && cleanMobile.length === 12) {
      // keep 91
    } else if (cleanMobile.length === 10) {
      cleanMobile = '91' + cleanMobile;
    } else {
      cleanMobile = '91' + cleanMobile;
    }
    const text = encodeURIComponent(`Hello ${name}, regarding your enquiry.`);
    return `https://wa.me/${cleanMobile}?text=${text}`;
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'NEW': return 'status-new';
      case 'INTERESTED': return 'status-interested';
      case 'CLOSED_WON': return 'status-closed';
      case 'CLOSED_LOST': return 'status-hot';
      default: return 'status-contacted';
    }
  }

  getPriorityClass(priority: string) {
    switch (priority) {
      case 'HOT': return 'status-hot';
      case 'WARM': return 'status-warm';
      case 'COLD': return 'status-cold';
      default: return 'status-contacted';
    }
  }

  downloadTemplate() {
    this.leadService.downloadTemplate().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lead_import_template.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Template downloaded successfully', 'Close', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Failed to download template', 'Close', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'xlsx' && extension !== 'xls') {
      this.snackBar.open('Only .xlsx and .xls formats are supported', 'Close', { duration: 3000 });
      event.target.value = '';
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    this.leadService.importExcel(file).subscribe({
      next: (ev: any) => {
        if (ev.type === HttpEventType.UploadProgress) {
          if (ev.total) {
            this.uploadProgress = Math.round(100 * ev.loaded / ev.total);
          }
        } else if (ev.type === HttpEventType.Response) {
          this.isUploading = false;
          const apiResponse = ev.body;
          if (apiResponse && apiResponse.success) {
            this.snackBar.open('Import process completed', 'Close', { duration: 3000 });
            this.loadLeads();
            this.openSummaryDialog(apiResponse.data);
          } else {
            this.snackBar.open(apiResponse?.message || 'Import failed', 'Close', { duration: 4000 });
          }
        }
      },
      error: (err) => {
        this.isUploading = false;
        const errMsg = err.error?.message || 'An error occurred during file upload';
        this.snackBar.open(errMsg, 'Close', { duration: 4000 });
      }
    });

    event.target.value = '';
  }

  openSummaryDialog(data: any) {
    this.dialog.open(ImportSummaryDialogComponent, {
      data,
      width: '600px',
      disableClose: false
    });
  }
}
