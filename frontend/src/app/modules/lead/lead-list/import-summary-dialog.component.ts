import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-import-summary-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <div class="dialog-container">
      <h2 class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
        <span class="fw-bold d-flex align-items-center dialog-title">
          <mat-icon class="text-primary me-2">summarize</mat-icon> Import Results Summary
        </span>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </h2>
      
      <div class="dialog-content py-2">
        <!-- Summary Cards -->
        <div class="row g-3 mb-4">
          <div class="col-md-4">
            <div class="summary-card total border">
              <div class="label text-muted">Total Rows</div>
              <div class="value fs-3 fw-bold">{{data.totalRows}}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="summary-card success border">
              <div class="label text-success">Imported</div>
              <div class="value fs-3 fw-bold text-success">{{data.importedCount}}</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="summary-card failed border">
              <div class="label text-danger">Skipped / Failed</div>
              <div class="value fs-3 fw-bold text-danger">{{data.failedCount}}</div>
            </div>
          </div>
        </div>
        
        <!-- Errors / Skipped Details -->
        <div *ngIf="data.errors && data.errors.length > 0" class="errors-section">
          <h3 class="h6 mb-2 fw-semibold text-danger d-flex align-items-center">
            <mat-icon class="me-1">warning</mat-icon> Skipped Row Details
          </h3>
          <div class="table-container border rounded">
            <table mat-table [dataSource]="data.errors" class="w-100">
              <!-- Row Number Column -->
              <ng-container matColumnDef="rowNumber">
                <th mat-header-cell *matHeaderCellDef class="px-2" style="width: 100px">Row No.</th>
                <td mat-cell *matCellDef="let err" class="px-2 font-monospace">{{err.rowNumber}}</td>
              </ng-container>

              <!-- Error Message Column -->
              <ng-container matColumnDef="errorMessage">
                <th mat-header-cell *matHeaderCellDef class="px-3">Error / Reason</th>
                <td mat-cell *matCellDef="let err" class="px-3 text-danger">{{err.errorMessage}}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </div>

        <div *ngIf="!data.errors || data.errors.length === 0" class="alert alert-success d-flex align-items-center mb-0 mt-3 py-2 px-3 border-0">
          <mat-icon class="me-2 text-success">check_circle</mat-icon>
          <div>All rows were parsed and imported successfully without errors!</div>
        </div>
      </div>
      
      <div class="dialog-actions d-flex justify-content-end pt-3 border-top mt-3">
        <button mat-flat-button color="primary" (click)="close()" class="px-4">OK</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 8px;
      min-width: 480px;
      max-width: 600px;
      background-color: var(--surface);
      color: var(--text);
    }
    .dialog-title {
      font-size: 1.25rem;
      color: var(--text);
    }
    .summary-card {
      background-color: var(--surface-2);
      border-color: var(--border) !important;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .summary-card.total {
      border-left: 4px solid var(--primary) !important;
    }
    .summary-card.success {
      border-left: 4px solid #22c55e !important;
    }
    .summary-card.failed {
      border-left: 4px solid #ef4444 !important;
    }
    .label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .value {
      color: var(--text);
    }
    .table-container {
      max-height: 220px;
      overflow-y: auto;
      background-color: var(--surface);
      border-color: var(--border) !important;
    }
    table {
      background-color: transparent !important;
    }
    th.mat-header-cell {
      background-color: var(--surface-2);
      color: var(--text);
      font-weight: 600;
      border-bottom: 1px solid var(--border);
    }
    td.mat-cell {
      color: var(--text-secondary);
      border-bottom: 1px solid var(--border);
      background-color: transparent !important;
    }
    .close-btn {
      color: var(--text-secondary);
    }
    h2 {
      border-color: var(--border) !important;
    }
    .dialog-actions {
      border-color: var(--border) !important;
    }
    .alert-success {
      background-color: rgba(34, 197, 94, 0.15) !important;
      color: #4ade80 !important;
    }
  `]
})
export class ImportSummaryDialogComponent {
  displayedColumns: string[] = ['rowNumber', 'errorMessage'];

  constructor(
    public dialogRef: MatDialogRef<ImportSummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      totalRows: number;
      importedCount: number;
      failedCount: number;
      errors: { rowNumber: number; errorMessage: string }[];
    }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
