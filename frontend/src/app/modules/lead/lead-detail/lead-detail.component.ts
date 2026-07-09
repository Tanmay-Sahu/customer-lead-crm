import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CustomerLeadService } from '../../../core/services/customer-lead.service';
import { FollowUpService } from '../../../core/services/follow-up.service';
import { NoteService } from '../../../core/services/note.service';
import { CustomerLead, FollowUp, Note } from '../../../core/models/crm.models';
import { FollowUpFormComponent } from '../follow-up-form/follow-up-form.component';
import { NoteFormComponent } from '../note-form/note-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTabsModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div class="row mb-4 align-items-center" *ngIf="lead">
      <div class="col">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item"><a routerLink="/leads">Leads</a></li>
            <li class="breadcrumb-item active">Lead Details</li>
          </ol>
        </nav>
        <h1 class="fw-bold h2 mb-0">{{lead.customerName}}</h1>
        <p class="text-muted small mb-0"><i class="bi bi-geo-alt me-1"></i>{{lead.city || 'No City'}} | <i class="bi bi-tag me-1"></i>{{lead.leadTypeName}}</p>
      </div>
      <div class="col-auto">
        <button mat-stroked-button class="me-2" [routerLink]="['/leads/edit', lead.id]">
          <mat-icon class="me-1">edit</mat-icon> Edit Lead
        </button>
      </div>
    </div>

    <div class="row" *ngIf="lead">
      <div class="col-lg-4 mb-4">
        <div class="crm-card p-4 shadow-sm h-100 border-0">
          <h5 class="fw-bold border-bottom pb-2 mb-3">Profile Info</h5>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Phone</label>
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold">{{lead.mobile}}</span>
              <span [matTooltip]="isMobileValid(lead.mobile) ? 'Contact via WhatsApp' : 'Invalid Mobile Number'">
                <a mat-icon-button 
                   class="text-success"
                   [href]="isMobileValid(lead.mobile) ? getWhatsAppUrl(lead.mobile, lead.customerName) : 'javascript:void(0)'" 
                   target="_blank"
                   [style.pointer-events]="isMobileValid(lead.mobile) ? 'auto' : 'none'"
                   [style.opacity]="isMobileValid(lead.mobile) ? '1' : '0.5'"
                   [disabled]="!isMobileValid(lead.mobile)"
                   (click)="!isMobileValid(lead.mobile) ? $event.preventDefault() : null"
                   style="width: 32px; height: 32px; line-height: 32px;">
                  <i class="bi bi-whatsapp fs-5"></i>
                </a>
              </span>
            </div>
          </div>
          <div class="info-row mb-2" *ngIf="lead.alternateNumber">
            <label class="text-muted small d-block">Alternate Phone</label>
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold">{{lead.alternateNumber}}</span>
              <span [matTooltip]="isMobileValid(lead.alternateNumber) ? 'Contact via WhatsApp' : 'Invalid Mobile Number'">
                <a mat-icon-button 
                   class="text-success"
                   [href]="isMobileValid(lead.alternateNumber) ? getWhatsAppUrl(lead.alternateNumber, lead.customerName) : 'javascript:void(0)'" 
                   target="_blank"
                   [style.pointer-events]="isMobileValid(lead.alternateNumber) ? 'auto' : 'none'"
                   [style.opacity]="isMobileValid(lead.alternateNumber) ? '1' : '0.5'"
                   [disabled]="!isMobileValid(lead.alternateNumber)"
                   (click)="!isMobileValid(lead.alternateNumber) ? $event.preventDefault() : null"
                   style="width: 32px; height: 32px; line-height: 32px;">
                  <i class="bi bi-whatsapp fs-5"></i>
                </a>
              </span>
            </div>
          </div>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Email</label>
            <span class="fw-bold">{{lead.email || 'N/A'}}</span>
          </div>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Status</label>
            <span class="badge bg-primary rounded-pill">{{lead.status}}</span>
          </div>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Lead Source</label>
            <span class="fw-bold">{{lead.leadSource || 'N/A'}}</span>
          </div>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Assigned Executive</label>
            <span class="fw-bold">{{lead.assignedExecutive || 'Unassigned'}}</span>
          </div>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Visit Date</label>
            <span class="fw-bold">{{(lead.visitDate | date:'mediumDate') || 'Not scheduled'}}</span>
          </div>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Next Follow-up Date</label>
            <span class="fw-bold">{{(lead.nextFollowupDate | date:'mediumDate') || 'Not set'}}</span>
          </div>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Date Created</label>
            <span class="fw-bold">{{lead.createdDate | date:'medium'}}</span>
          </div>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Requirement</label>
            <p class="small text-muted">{{lead.requirement || 'No requirements specified.'}}</p>
          </div>
          <div class="info-row mb-2">
            <label class="text-muted small d-block">Discussion Details</label>
            <p class="small text-muted">{{lead.discussionDetails || 'No discussion details logged.'}}</p>
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="crm-card shadow-sm border-0 h-100">
          <mat-tab-group animationDuration="0ms">
            <!-- Follow-ups Tab -->
            <mat-tab>
              <ng-template mat-tab-label><mat-icon class="me-2">history</mat-icon> Follow-ups</ng-template>
              <div class="p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="fw-bold mb-0">Follow-up Timeline</h6>
                  <button mat-raised-button color="primary" size="small" (click)="openFollowUpForm()">
                    <mat-icon>add</mat-icon> Log Follow-up
                  </button>
                </div>

                <div class="timeline" *ngIf="followUps.length > 0; else emptyFollowUps">
                  <div class="timeline-item" *ngFor="let f of followUps">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content crm-card p-3 mb-3 timeline-card border-0">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="small fw-bold text-primary">{{f.followUpDate | date:'mediumDate'}}</span>
                        <div class="actions">
                          <button mat-icon-button (click)="openFollowUpForm(f)"><mat-icon class="small-icon">edit</mat-icon></button>
                          <button mat-icon-button color="warn" (click)="deleteFollowUp(f)"><mat-icon class="small-icon">delete</mat-icon></button>
                        </div>
                      </div>
                      <p class="mb-1 small">{{f.discussion}}</p>
                      <span class="badge bg-secondary opacity-75 small" style="font-size: 9px;">{{f.status}}</span>
                    </div>
                  </div>
                </div>
                <ng-template #emptyFollowUps>
                  <p class="text-center text-muted py-4">No follow-ups recorded yet.</p>
                </ng-template>
              </div>
            </mat-tab>

            <!-- Notes Tab -->
            <mat-tab>
              <ng-template mat-tab-label><mat-icon class="me-2">note_alt</mat-icon> Notes</ng-template>
              <div class="p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="fw-bold mb-0">Internal Notes</h6>
                  <button mat-raised-button color="accent" (click)="openNoteForm()">
                    <mat-icon>add</mat-icon> Add Note
                  </button>
                </div>

                <div class="notes-list" *ngIf="notes.length > 0; else emptyNotes">
                  <div class="note-item crm-card p-3 mb-3 border-start border-4 border-warning shadow-none note-card" *ngFor="let n of notes">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                       <span class="text-muted" style="font-size: 10px;">{{n.createdDate | date:'medium'}}</span>
                       <div class="actions">
                          <button mat-icon-button (click)="openNoteForm(n)"><mat-icon class="small-icon">edit</mat-icon></button>
                          <button mat-icon-button color="warn" (click)="deleteNote(n)"><mat-icon class="small-icon">delete</mat-icon></button>
                       </div>
                    </div>
                    <p class="mb-0 small">{{n.note}}</p>
                  </div>
                </div>
                <ng-template #emptyNotes>
                  <p class="text-center text-muted py-4">No internal notes for this lead.</p>
                </ng-template>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline { border-left: 2px solid var(--border); padding-left: 20px; position: relative; }
    .timeline-item { position: relative; }
    .timeline-marker {
      width: 12px; height: 12px; border-radius: 50%; background: var(--primary);
      position: absolute; left: -27px; top: 12px; border: 2px solid var(--surface);
    }
    .small-icon { font-size: 18px; width: 18px; height: 18px; }
    .timeline-card, .note-card {
      background-color: var(--surface-2) !important;
      color: var(--text) !important;
    }
  `]
})
export class LeadDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private leadService = inject(CustomerLeadService);
  private followUpService = inject(FollowUpService);
  private noteService = inject(NoteService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  lead?: CustomerLead;
  followUps: FollowUp[] = [];
  notes: Note[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadLeadData(id);
    });
  }

  loadLeadData(id: number) {
    this.leadService.getLeadById(id).subscribe(resp => {
      this.lead = resp.data;
      this.loadInteractions(id);
    });
  }

  loadInteractions(id: number) {
    this.followUpService.getFollowUpsByLead(id).subscribe(resp => this.followUps = resp.data);
    this.noteService.getNotesByLead(id).subscribe(resp => this.notes = resp.data);
  }

  openFollowUpForm(data?: FollowUp) {
    const dialogRef = this.dialog.open(FollowUpFormComponent, {
      width: '500px',
      data: data ? { ...data } : { leadId: this.lead?.id }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadLeadData(this.lead!.id);
    });
  }

  deleteFollowUp(f: FollowUp) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Follow-up', message: 'Are you sure?', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.followUpService.deleteFollowUp(f.id).subscribe(() => {
          this.snackBar.open('Follow-up deleted', 'Close', { duration: 2000 });
          this.loadLeadData(this.lead!.id);
        });
      }
    });
  }

  openNoteForm(note?: Note) {
    const dialogRef = this.dialog.open(NoteFormComponent, {
      width: '450px',
      data: note ? { note } : { leadId: this.lead?.id }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadInteractions(this.lead!.id);
    });
  }

  deleteNote(n: Note) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Note', message: 'Are you sure you want to delete this note?', confirmColor: 'warn' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.noteService.deleteNote(n.id).subscribe({
          next: () => {
             this.snackBar.open('Note deleted successfully', 'Close', { duration: 2000 });
             this.loadInteractions(this.lead!.id);
          },
          error: (err) => {
             this.snackBar.open(err.error?.message || 'Error deleting note', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

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
}
