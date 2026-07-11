import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LeadTypeService } from '../../../core/services/lead-type.service';
import { LeadType } from '../../../core/models/crm.models';

@Component({
  selector: 'app-lead-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title class="fw-bold">{{ isEditMode ? 'Edit' : 'Add' }} Lead Type</h2>
    <form [formGroup]="typeForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="pt-2">
        <div class="row">
          <div class="col-12 mb-3">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Lead Type Name</mat-label>
              <input matInput formControlName="leadTypeName" placeholder="e.g. Website Inquiry">
              <mat-error *ngIf="typeForm.get('leadTypeName')?.hasError('required')">Name is required</mat-error>
            </mat-form-field>
          </div>
          
          <div class="col-12">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Brief description..."></textarea>
            </mat-form-field>
          </div>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end" class="mb-2">
        <button mat-button type="button" (click)="onCancel()" class="rounded-pill">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="typeForm.invalid || isSaving" class="rounded-pill px-4">
          {{ isSaving ? 'Saving...' : 'Save Changes' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class LeadTypeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leadTypeService = inject(LeadTypeService);
  private snackBar = inject(MatSnackBar);

  typeForm: FormGroup;
  isEditMode = false;
  isSaving = false;

  constructor(
    public dialogRef: MatDialogRef<LeadTypeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeadType | null
  ) {
    this.typeForm = this.fb.group({
      leadTypeName: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    if (this.data) {
      this.isEditMode = true;
      this.typeForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.typeForm.valid) {
      this.isSaving = true;
      const formData = this.typeForm.value;

      if (this.isEditMode && this.data) {
        this.leadTypeService.updateLeadType(this.data.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Lead Type updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Error updating lead type', 'Close', { duration: 3000 });
            this.isSaving = false;
          }
        });
      } else {
        this.leadTypeService.createLeadType(formData).subscribe({
          next: () => {
            this.snackBar.open('Lead Type created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Error creating lead type', 'Close', { duration: 3000 });
            this.isSaving = false;
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
