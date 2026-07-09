import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoteService } from '../../../core/services/note.service';

@Component({
  selector: 'app-note-form',
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
    <h2 mat-dialog-title class="fw-bold text-accent">{{ isEditMode ? 'Edit Internal Note' : 'Add Internal Note' }}</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="pt-2">
        <mat-form-field appearance="outline" class="w-100">
          <mat-label>Note Content</mat-label>
          <textarea matInput formControlName="note" rows="5" placeholder="Private internal notes..."></textarea>
          <mat-error *ngIf="form.get('note')?.hasError('required')">Content is required</mat-error>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="mb-2">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="accent" type="submit" [disabled]="form.invalid || isSaving">
          {{ isSaving ? 'Saving...' : (isEditMode ? 'Update Note' : 'Add Note') }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class NoteFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(NoteService);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    leadId: [null as any, Validators.required],
    note: ['', Validators.required]
  });

  isEditMode = false;
  isSaving = false;

  constructor(
     public dialogRef: MatDialogRef<NoteFormComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.note) {
      this.isEditMode = true;
      this.form.patchValue({
         leadId: data.note.leadId,
         note: data.note.note
      });
    } else {
      this.form.patchValue({ leadId: data.leadId });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSaving = true;
      
      if (this.isEditMode) {
        this.service.updateNote(this.data.note.id, this.form.value).subscribe({
          next: () => {
             this.snackBar.open('Note updated successfully', 'Close', { duration: 3000 });
             this.dialogRef.close(true);
          },
          error: (err) => {
             this.snackBar.open(err.error?.message || 'Error updating note', 'Close', { duration: 3000 });
             this.isSaving = false;
          }
        });
      } else {
        this.service.createNote(this.form.value).subscribe({
          next: () => {
             this.snackBar.open('Note added successfully', 'Close', { duration: 3000 });
             this.dialogRef.close(true);
          },
          error: (err) => {
             this.snackBar.open(err.error?.message || 'Error adding note', 'Close', { duration: 3000 });
             this.isSaving = false;
          }
        });
      }
    }
  }
}
