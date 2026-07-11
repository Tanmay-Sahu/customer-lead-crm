import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FollowUpService } from '../../../core/services/follow-up.service';

@Component({
  selector: 'app-follow-up-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title class="fw-bold">{{ isEdit ? 'Edit' : 'Log' }} Follow-up</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="pt-2">
        <mat-form-field appearance="outline" class="w-100 mb-2">
          <mat-label>Discussion Details</mat-label>
          <textarea matInput formControlName="discussion" rows="4"></textarea>
          <mat-error *ngIf="form.get('discussion')?.hasError('required')">Required</mat-error>
        </mat-form-field>
        
        <div class="row">
          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Follow-up Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="followUpDate">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="form.get('followUpDate')?.hasError('required')">Required</mat-error>
            </mat-form-field>
          </div>
          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option value="COMPLETED">Completed</mat-option>
                <mat-option value="PENDING">Pending</mat-option>
                <mat-option value="CANCELLED">Cancelled</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="mb-2">
        <button mat-button type="button" (click)="dialogRef.close()" class="rounded-pill">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid" class="rounded-pill px-4">Save</button>
      </mat-dialog-actions>
    </form>
  `
})
export class FollowUpFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(FollowUpService);
  isEdit = false;
  form = this.fb.group({
    leadId: [null as any],
    discussion: ['', Validators.required],
    followUpDate: [new Date(), Validators.required],
    status: ['PENDING']
  });

  constructor(
     public dialogRef: MatDialogRef<FollowUpFormComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.id) {
      this.isEdit = true;
      this.form.patchValue({
        leadId: data.leadId,
        discussion: data.discussion,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : new Date() as any,
        status: data.status
      });
    } else {
      this.form.patchValue({ leadId: data.leadId });
    }
  }

  formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  onSubmit() {
    if (this.form.valid) {
      const payload = { ...this.form.value };
      if (payload.followUpDate) {
        payload.followUpDate = this.formatDate(payload.followUpDate) as any;
      }
      if (this.isEdit) {
        this.service.updateFollowUp(this.data.id, payload).subscribe(() => this.dialogRef.close(true));
      } else {
        this.service.createFollowUp(payload).subscribe(() => this.dialogRef.close(true));
      }
    }
  }
}
