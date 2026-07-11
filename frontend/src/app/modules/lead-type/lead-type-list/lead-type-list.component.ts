import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LeadTypeService } from '../../../core/services/lead-type.service';
import { LeadType } from '../../../core/models/crm.models';
import { LeadTypeFormComponent } from '../lead-type-form/lead-type-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lead-type-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center mb-4 animate-fade-in-up">
      <div>
        <h1 class="fw-bold h2 mb-1">Lead Types</h1>
        <p class="text-muted small mb-0">Manage different categories of your customer leads</p>
      </div>
      <button mat-raised-button color="primary" class="rounded-pill px-4 border-0" (click)="openForm()">
        <mat-icon>add</mat-icon> Add Lead Type
      </button>
    </div>

    <!-- Search Panel -->
    <div class="crm-card mb-4 p-3 shadow-sm animate-fade-in-up">
      <div class="search-box border rounded px-3 py-1 d-flex align-items-center w-100" style="max-width: 400px; height: 38px;">
        <mat-icon class="text-muted me-2" style="font-size: 1.1rem; width: 1.1rem; height: 1.1rem;">search</mat-icon>
        <input type="text" class="form-control border-0 bg-transparent py-1 shadow-none nav-search-input" 
               placeholder="Search lead types..." (keyup)="applyFilter($event)" style="outline: none;">
      </div>
    </div>

    <!-- Table Section -->
    <div class="table-container animate-fade-in-up">
      <div class="loading-overlay" *ngIf="isLoading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <table mat-table [dataSource]="dataSource" matSort>
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
          <td mat-cell *matCellDef="let element"> #{{element.id}} </td>
        </ng-container>

        <!-- Type Name Column -->
        <ng-container matColumnDef="leadTypeName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Type Name </th>
          <td mat-cell *matCellDef="let element" class="fw-bold type-name"> {{element.leadTypeName}} </td>
        </ng-container>

        <!-- Description Column -->
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef> Description </th>
          <td mat-cell *matCellDef="let element" class="desc-text text-wrap"> {{element.description || '-'}} </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="text-end pe-4"> Actions </th>
          <td mat-cell *matCellDef="let element" class="text-end pe-4">
            <button mat-icon-button color="primary" (click)="openForm(element)" matTooltip="Edit" aria-label="Edit Type">
              <mat-icon>edit_note</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteType(element)" matTooltip="Delete" aria-label="Delete Type">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="lead-type-row"></tr>

        <!-- Row shown when there is no matching data. -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell p-5 text-center text-muted" colspan="4">
            <div class="py-3">
              <mat-icon class="fs-1 mb-2 opacity-50" style="width: auto; height: auto;">search_off</mat-icon>
              <p class="mb-0">{{ isLoading ? 'Loading data...' : 'No lead types match the search query.' }}</p>
            </div>
          </td>
        </tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: [`
    .table-container { min-height: 200px; }
    .loading-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: var(--bg);
      opacity: 0.8;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .filter-bar {
      background-color: var(--surface-2);
      border-bottom: 1px solid var(--border) !important;
    }
    .search-box {
      background-color: var(--surface);
      border: 1px solid var(--border) !important;
      transition: var(--transition);
    }
    .search-box:focus-within {
      border-color: var(--primary) !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
    }
    .search-box input {
      color: var(--text);
      font-size: 0.875rem;
    }
    .search-box input::placeholder {
      color: var(--text-muted);
    }
    .type-name {
      color: var(--primary) !important;
    }
    .desc-text {
      color: var(--text-secondary) !important;
    }
    .lead-type-row {
      transition: var(--transition);
    }
    .lead-type-row:hover {
      background-color: var(--sidebar-hover-bg) !important;
    }
    .text-wrap {
      white-space: pre-wrap;
    }
  `]
})
export class LeadTypeListComponent implements OnInit {
  private leadTypeService = inject(LeadTypeService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['id', 'leadTypeName', 'description', 'actions'];
  dataSource = new MatTableDataSource<LeadType>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.leadTypeService.getAllLeadTypes().subscribe({
      next: (resp) => {
        this.dataSource.data = resp.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load lead types', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openForm(data?: LeadType) {
    const dialogRef = this.dialog.open(LeadTypeFormComponent, {
      width: '450px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteType(data: LeadType) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${data.leadTypeName}"?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.leadTypeService.deleteLeadType(data.id).subscribe({
          next: () => {
            this.snackBar.open('Lead Type deleted successfully', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Error deleting lead type', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
}
