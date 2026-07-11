import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CustomerLeadService } from '../../../core/services/customer-lead.service';
import { LeadTypeService } from '../../../core/services/lead-type.service';
import { LeadType, LeadStatus, Priority } from '../../../core/models/crm.models';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, MatButtonModule, 
    MatInputModule, MatFormFieldModule, MatSelectModule, MatDatepickerModule, 
    MatNativeDateModule, MatSnackBarModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="row mb-4 align-items-center animate-fade-in-up">
      <div class="col">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item"><a routerLink="/dashboard">Dashboard</a></li>
            <li class="breadcrumb-item"><a routerLink="/leads">Customer Leads</a></li>
            <li class="breadcrumb-item active">{{ isEditMode ? 'Edit' : 'Add' }} Lead</li>
          </ol>
        </nav>
        <h1 class="fw-bold h2 mb-0 text-color">{{ isEditMode ? 'Modify' : 'Register' }} Customer Lead</h1>
      </div>
    </div>

    <div class="row animate-fade-in-up">
      <div class="col-lg-12">
        <div class="crm-card p-4 shadow-sm border-0 position-relative form-card-container">
          <div class="loading-overlay rounded" *ngIf="isLoading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>

          <form [formGroup]="leadForm" (ngSubmit)="onSubmit()">
            <!-- Section 1: Customer Contact Details -->
            <div class="crm-card shadow-sm border-0 mb-4 p-4 animate-fade-in-up">
              <h5 class="fw-bold mb-3 d-flex align-items-center text-color border-bottom pb-2">
                <i class="bi bi-person text-primary me-2"></i> 1. Customer Contact Details
              </h5>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Customer Name</mat-label>
                    <input matInput formControlName="customerName" placeholder="Full Name">
                    <mat-error *ngIf="leadForm.get('customerName')?.hasError('required')">Name is required</mat-error>
                  </mat-form-field>
                </div>
                <div class="col-md-3 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Mobile Number</mat-label>
                    <input matInput formControlName="mobile" placeholder="10 Digit Number" maxlength="10">
                    <mat-error *ngIf="leadForm.get('mobile')?.hasError('required')">Mobile is required</mat-error>
                    <mat-error *ngIf="leadForm.get('mobile')?.hasError('pattern')">Enter valid 10-digit number</mat-error>
                  </mat-form-field>
                </div>
                <div class="col-md-3 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Alternate Number</mat-label>
                    <input matInput formControlName="alternateNumber" placeholder="Alternate phone" maxlength="15">
                  </mat-form-field>
                </div>
                <div class="col-md-3 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Email Address</mat-label>
                    <input matInput formControlName="email" placeholder="example@mail.com">
                    <mat-error *ngIf="leadForm.get('email')?.hasError('email')">Invalid email format</mat-error>
                  </mat-form-field>
                </div>
              </div>
            </div>

            <!-- Section 2: Lead Classification -->
            <div class="crm-card shadow-sm border-0 mb-4 p-4 animate-fade-in-up">
              <h5 class="fw-bold mb-3 d-flex align-items-center text-color border-bottom pb-2">
                <i class="bi bi-bookmark-star text-primary me-2"></i> 2. Lead Classification
              </h5>
              <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Lead Type</mat-label>
                    <mat-select formControlName="leadTypeId">
                      <mat-option *ngFor="let type of leadTypes" [value]="type.id">{{type.leadTypeName}}</mat-option>
                    </mat-select>
                    <mat-error *ngIf="leadForm.get('leadTypeId')?.hasError('required')">Lead type is required</mat-error>
                  </mat-form-field>
                </div>
                <div class="col-md-3 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Status</mat-label>
                    <mat-select formControlName="status">
                      <mat-option *ngFor="let s of statuses" [value]="s">{{s?.replace('_', ' ')}}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                <div class="col-md-3 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Priority</mat-label>
                    <mat-select formControlName="priority">
                      <mat-option *ngFor="let p of priorities" [value]="p">{{p?.replace('_', ' ')}}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                <div class="col-md-3 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Lead Source</mat-label>
                    <input matInput formControlName="leadSource" placeholder="e.g. Website, Referral">
                  </mat-form-field>
                </div>
              </div>
            </div>

            <!-- Section 3: Representative Schedules -->
            <div class="crm-card shadow-sm border-0 mb-4 p-4 animate-fade-in-up">
              <h5 class="fw-bold mb-3 d-flex align-items-center text-color border-bottom pb-2">
                <i class="bi bi-calendar-event text-primary me-2"></i> 3. Assignments & Schedules
              </h5>
              <div class="row g-3">
                <div class="col-md-4 col-sm-12">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Assigned Executive</mat-label>
                    <input matInput formControlName="assignedExecutive" placeholder="Executive Name">
                  </mat-form-field>
                </div>
                <div class="col-md-4 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Visit Date</mat-label>
                    <input matInput [matDatepicker]="visitDatePicker" formControlName="visitDate">
                    <mat-datepicker-toggle matIconSuffix [for]="visitDatePicker"></mat-datepicker-toggle>
                    <mat-datepicker #visitDatePicker></mat-datepicker>
                  </mat-form-field>
                </div>
                <div class="col-md-4 col-sm-6">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Next Follow-up Date</mat-label>
                    <input matInput [matDatepicker]="followupDatePicker" formControlName="nextFollowupDate">
                    <mat-datepicker-toggle matIconSuffix [for]="followupDatePicker"></mat-datepicker-toggle>
                    <mat-datepicker #followupDatePicker></mat-datepicker>
                  </mat-form-field>
                </div>
              </div>
            </div>

            <!-- Section 4: Geography & Location details -->
            <div class="crm-card shadow-sm border-0 mb-4 p-4 animate-fade-in-up">
              <h5 class="fw-bold mb-3 d-flex align-items-center text-color border-bottom pb-2">
                <i class="bi bi-geo-alt text-primary me-2"></i> 4. Location Details
              </h5>
              <div class="row g-3">
                <div class="col-md-4 col-sm-12">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>City</mat-label>
                    <input matInput formControlName="city">
                  </mat-form-field>
                </div>
                <div class="col-md-8 col-sm-12">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Address</mat-label>
                    <input matInput formControlName="address">
                  </mat-form-field>
                </div>
              </div>
            </div>

            <!-- Section 5: Log & Requirement Specifications -->
            <div class="crm-card shadow-sm border-0 mb-4 p-4 animate-fade-in-up">
              <h5 class="fw-bold mb-3 d-flex align-items-center text-color border-bottom pb-2">
                <i class="bi bi-file-earmark-text text-primary me-2"></i> 5. Requirements & Discussion
              </h5>
              <div class="row g-3">
                <div class="col-12">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Requirement Details</mat-label>
                    <textarea matInput formControlName="requirement" rows="2"></textarea>
                  </mat-form-field>
                </div>
                <div class="col-12">
                  <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Discussion Details</mat-label>
                    <textarea matInput formControlName="discussionDetails" rows="2" placeholder="Detail notes from discussion..."></textarea>
                  </mat-form-field>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="d-flex gap-2 justify-content-start animate-fade-in-up">
              <button mat-raised-button color="primary" type="submit" [disabled]="leadForm.invalid || isSaving" class="rounded-pill px-5">
                <mat-icon class="me-1">save</mat-icon> {{ isSaving ? 'Saving...' : 'Save Lead' }}
              </button>
              <button mat-outlined-button type="button" routerLink="/leads" class="rounded-pill px-4">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-color {
      color: var(--text);
    }
    .section-header {
      font-size: 1rem !important;
      border-bottom: 2px solid var(--border);
      padding-bottom: 8px;
    }
    .form-card-container {
      background-color: var(--surface) !important;
    }
    .loading-overlay {
      position: absolute; top:0; left:0; right:0; bottom:0;
      background: var(--bg); opacity: 0.8; z-index: 10;
      display: flex; justify-content: center; align-items: center;
    }
  `]
})
export class LeadFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leadService = inject(CustomerLeadService);
  private leadTypeService = inject(LeadTypeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  leadForm: FormGroup;
  isEditMode = false;
  leadId: number | null = null;
  isLoading = false;
  isSaving = false;

  leadTypes: LeadType[] = [];
  statuses = Object.values(LeadStatus);
  priorities = Object.values(Priority);

  constructor() {
    this.leadForm = this.fb.group({
      customerName: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      alternateNumber: [''],
      email: ['', [Validators.email]],
      leadTypeId: [null, [Validators.required]],
      city: [''],
      address: [''],
      requirement: [''],
      leadSource: [''],
      assignedExecutive: [''],
      discussionDetails: [''],
      visitDate: [null],
      nextFollowupDate: [null],
      status: [LeadStatus.NEW],
      priority: [Priority.WARM]
    });
  }

  ngOnInit() {
    this.loadLeadTypes();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.leadId = +params['id'];
        this.loadLeadData(this.leadId);
      }
    });
  }

  loadLeadTypes() {
    this.leadTypeService.getAllLeadTypes().subscribe(resp => this.leadTypes = resp.data);
  }

  loadLeadData(id: number) {
    this.isLoading = true;
    this.leadService.getLeadById(id).subscribe({
      next: (resp) => {
        this.leadForm.patchValue(resp.data);
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error loading lead data', 'Close', { duration: 3000 });
        this.router.navigate(['/leads']);
      }
    });
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
    if (this.leadForm.valid) {
      this.isSaving = true;
      const formData = { ...this.leadForm.value };
      
      if (formData.visitDate) {
        formData.visitDate = this.formatDate(formData.visitDate) as any;
      }
      if (formData.nextFollowupDate) {
        formData.nextFollowupDate = this.formatDate(formData.nextFollowupDate) as any;
      }

      if (this.isEditMode && this.leadId) {
        this.leadService.updateLead(this.leadId, formData).subscribe({
          next: () => {
            this.snackBar.open('Lead updated successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/leads']);
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Error updating lead', 'Close', { duration: 3000 });
            this.isSaving = false;
          }
        });
      } else {
        this.leadService.createLead(formData).subscribe({
          next: () => {
            this.snackBar.open('Lead registered successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/leads']);
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Error creating lead', 'Close', { duration: 3000 });
            this.isSaving = false;
          }
        });
      }
    }
  }
}
