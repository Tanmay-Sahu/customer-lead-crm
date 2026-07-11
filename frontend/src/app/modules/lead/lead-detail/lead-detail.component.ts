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
    <div class="row mb-4 align-items-center animate-fade-in-up" *ngIf="lead">
      <div class="col">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-1">
            <li class="breadcrumb-item"><a routerLink="/leads">Leads</a></li>
            <li class="breadcrumb-item active">Lead Details</li>
          </ol>
        </nav>
        <h1 class="fw-bold h2 mb-0 text-color">{{lead.customerName}}</h1>
        <p class="text-muted small mb-0 d-flex align-items-center gap-2 mt-1">
          <span class="d-inline-flex align-items-center"><i class="bi bi-geo-alt me-1 text-primary"></i>{{lead.city || 'No City'}}</span>
          <span class="text-muted">|</span>
          <span class="d-inline-flex align-items-center"><i class="bi bi-tag me-1 text-primary"></i>{{lead.leadTypeName}}</span>
        </p>
      </div>
      <div class="col-auto">
        <button mat-raised-button color="primary" class="rounded-pill" [routerLink]="['/leads/edit', lead.id]">
          <mat-icon class="me-1">edit</mat-icon> Edit Lead
        </button>
      </div>
    </div>

    <div class="row animate-fade-in-up" *ngIf="lead">
      <!-- Left Column (Profile Sidebar - 4/12 grid) -->
      <div class="col-lg-4 mb-4">
        <div class="crm-card p-4 shadow-sm border-0 text-center">
          <div class="profile-card-header d-flex flex-column align-items-center">
            <div class="avatar-gradient mb-3" style="width: 80px; height: 80px; font-size: 2.2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: var(--shadow-md);">
              {{lead.customerName[0].toUpperCase()}}
            </div>
            <h4 class="fw-bold mb-1 text-color">{{lead.customerName}}</h4>
            <div class="text-muted small mb-3"><i class="bi bi-geo-alt me-1 text-primary"></i>{{lead.city || 'No City'}}</div>
            
            <div class="d-flex gap-2 justify-content-center">
              <span class="custom-badge" [ngClass]="getStatusClass(lead.status)">{{formatStatus(lead.status)}}</span>
              <span class="custom-badge" [ngClass]="getPriorityClass(lead.priority)">{{formatPriority(lead.priority)}}</span>
            </div>
          </div>
          
          <div class="text-start">
            <h6 class="fw-bold text-uppercase text-muted mb-3" style="font-size: 11px; letter-spacing: 0.5px;">Contact Info</h6>
            <div class="info-row d-flex flex-column mb-3">
              <span class="info-label small text-muted text-uppercase tracking-wider" style="font-size: 10px;">Primary Phone</span>
              <div class="d-flex align-items-center justify-content-between mt-1">
                <span class="fw-bold text-color">{{lead.mobile}}</span>
                <span [matTooltip]="isMobileValid(lead.mobile) ? 'Contact via WhatsApp' : 'Invalid Mobile Number'">
                  <a mat-icon-button 
                     class="whatsapp-btn-detail"
                     [href]="isMobileValid(lead.mobile) ? getWhatsAppUrl(lead.mobile, lead.customerName) : 'javascript:void(0)'" 
                     target="_blank"
                     [style.pointer-events]="isMobileValid(lead.mobile) ? 'auto' : 'none'"
                     [style.opacity]="isMobileValid(lead.mobile) ? '1' : '0.5'"
                     [disabled]="!isMobileValid(lead.mobile)"
                     (click)="!isMobileValid(lead.mobile) ? $event.preventDefault() : null"
                     aria-label="WhatsApp">
                    <i class="bi bi-whatsapp fs-5"></i>
                  </a>
                </span>
              </div>
            </div>
            
            <div class="info-row d-flex flex-column mb-3" *ngIf="lead.alternateNumber">
              <span class="info-label small text-muted text-uppercase tracking-wider" style="font-size: 10px;">Alternate Phone</span>
              <div class="d-flex align-items-center justify-content-between mt-1">
                <span class="fw-bold text-color">{{lead.alternateNumber}}</span>
                <span [matTooltip]="isMobileValid(lead.alternateNumber) ? 'Contact via WhatsApp' : 'Invalid Mobile Number'">
                  <a mat-icon-button 
                     class="whatsapp-btn-detail"
                     [href]="isMobileValid(lead.alternateNumber) ? getWhatsAppUrl(lead.alternateNumber, lead.customerName) : 'javascript:void(0)'" 
                     target="_blank"
                     [style.pointer-events]="isMobileValid(lead.alternateNumber) ? 'auto' : 'none'"
                     [style.opacity]="isMobileValid(lead.alternateNumber) ? '1' : '0.5'"
                     [disabled]="!isMobileValid(lead.alternateNumber)"
                     (click)="!isMobileValid(lead.alternateNumber) ? $event.preventDefault() : null"
                     aria-label="WhatsApp">
                    <i class="bi bi-whatsapp fs-5"></i>
                  </a>
                </span>
              </div>
            </div>

            <div class="info-row d-flex flex-column mb-3">
              <span class="info-label small text-muted text-uppercase tracking-wider" style="font-size: 10px;">Email Address</span>
              <span class="fw-semibold text-color mt-1 text-truncate">{{lead.email || 'N/A'}}</span>
            </div>

            <hr class="my-3 border-light">
            
            <h6 class="fw-bold text-uppercase text-muted mb-3" style="font-size: 11px; letter-spacing: 0.5px;">Lead Metadata</h6>
            <div class="info-row d-flex flex-column mb-3">
              <span class="info-label small text-muted text-uppercase tracking-wider" style="font-size: 10px;">Lead Source</span>
              <span class="fw-semibold text-color mt-1"><i class="bi bi-share me-2 text-muted"></i>{{lead.leadSource || 'N/A'}}</span>
            </div>

            <div class="info-row d-flex flex-column mb-3">
              <span class="info-label small text-muted text-uppercase tracking-wider" style="font-size: 10px;">Assigned Representative</span>
              <span class="fw-semibold text-color mt-1"><i class="bi bi-person-badge me-2 text-muted"></i>{{lead.assignedExecutive || 'Unassigned'}}</span>
            </div>

            <div class="info-row d-flex flex-column mb-3">
              <span class="info-label small text-muted text-uppercase tracking-wider" style="font-size: 10px;">Scheduled Visit</span>
              <span class="fw-semibold text-color mt-1"><i class="bi bi-calendar-event me-2 text-muted"></i>{{(lead.visitDate | date:'mediumDate') || 'Not scheduled'}}</span>
            </div>

            <div class="info-row d-flex flex-column">
              <span class="info-label small text-muted text-uppercase tracking-wider" style="font-size: 10px;">Next Follow-up Task</span>
              <span class="fw-bold text-primary mt-1"><i class="bi bi-alarm me-2 text-primary"></i>{{(lead.nextFollowupDate | date:'mediumDate') || 'Not set'}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (Details & Tabs - 8/12 grid) -->
      <div class="col-lg-8">
        <!-- Lead Requirements & Discussion Details Card -->
        <div class="crm-card shadow-sm border-0 mb-4 p-4">
          <h5 class="fw-bold mb-3 d-flex align-items-center text-color border-bottom pb-2">
            <i class="bi bi-file-earmark-text text-primary me-2"></i> Lead Requirements
          </h5>
          
          <div class="row g-3">
            <div class="col-12 mb-2">
              <div class="small text-muted text-uppercase fw-semibold" style="font-size: 10px;">Requirement Summary</div>
              <p class="small text-color mt-1 bg-light p-3 rounded mb-0 text-wrap">{{lead.requirement || 'No requirements specified.'}}</p>
            </div>
            <div class="col-12">
              <div class="small text-muted text-uppercase fw-semibold" style="font-size: 10px;">Discussion Log</div>
              <p class="small text-color mt-1 bg-light p-3 rounded mb-0 text-wrap">{{lead.discussionDetails || 'No discussion details logged.'}}</p>
            </div>
          </div>
        </div>

        <!-- Timeline & Notes Tabs Card -->
        <div class="crm-card shadow-sm border-0 p-0 overflow-hidden">
          <mat-tab-group animationDuration="150ms">
            <!-- Follow-ups Tab -->
            <mat-tab>
              <ng-template mat-tab-label><mat-icon class="me-2">history</mat-icon> Follow-up Trail</ng-template>
              <div class="p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="fw-bold mb-0 text-color">Follow-up History</h6>
                  <button mat-raised-button color="primary" class="rounded-pill" (click)="openFollowUpForm()">
                    <mat-icon>add</mat-icon> Log Activity
                  </button>
                </div>

                <div class="timeline" *ngIf="followUps.length > 0; else emptyFollowUps">
                  <div class="timeline-item" *ngFor="let f of followUps">
                    <div class="timeline-marker shadow-sm" [class.completed]="f.status === 'COMPLETED'"></div>
                    <div class="timeline-content crm-card p-3 mb-3 border-0 shadow-sm timeline-card">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="small fw-bold text-primary"><i class="bi bi-calendar-check me-1"></i>{{f.followUpDate | date:'mediumDate'}}</span>
                        <div class="actions">
                          <button mat-icon-button (click)="openFollowUpForm(f)" aria-label="Edit Follow-up"><mat-icon class="small-icon">edit</mat-icon></button>
                          <button mat-icon-button color="warn" (click)="deleteFollowUp(f)" aria-label="Delete Follow-up"><mat-icon class="small-icon">delete</mat-icon></button>
                        </div>
                      </div>
                      <p class="mb-2 small text-color text-wrap">{{f.discussion}}</p>
                      <span class="badge rounded-pill" [ngClass]="f.status === 'COMPLETED' ? 'bg-success-tint text-success' : 'bg-warning-tint text-warning'">{{f.status}}</span>
                    </div>
                  </div>
                </div>
                <ng-template #emptyFollowUps>
                  <div class="text-center py-5 text-muted">
                    <i class="bi bi-calendar-x fs-1 opacity-50 d-block mb-2"></i>
                    No follow-ups recorded yet.
                  </div>
                </ng-template>
              </div>
            </mat-tab>

            <!-- Notes Tab -->
            <mat-tab>
              <ng-template mat-tab-label><mat-icon class="me-2">note_alt</mat-icon> Internal Notes</ng-template>
              <div class="p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="fw-bold mb-0 text-color">Notes Log</h6>
                  <button mat-raised-button color="accent" class="rounded-pill" (click)="openNoteForm()">
                    <mat-icon>add</mat-icon> Log Note
                  </button>
                </div>

                <div class="notes-list" *ngIf="notes.length > 0; else emptyNotes">
                  <div class="note-item crm-card p-3 mb-3 border-start border-4 border-warning shadow-sm note-card" *ngFor="let n of notes">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                       <span class="text-muted" style="font-size: 10px;"><i class="bi bi-clock me-1"></i>{{n.createdDate | date:'medium'}}</span>
                       <div class="actions">
                          <button mat-icon-button (click)="openNoteForm(n)" aria-label="Edit Note"><mat-icon class="small-icon">edit</mat-icon></button>
                          <button mat-icon-button color="warn" (click)="deleteNote(n)" aria-label="Delete Note"><mat-icon class="small-icon">delete</mat-icon></button>
                       </div>
                    </div>
                    <p class="mb-0 small text-color text-wrap">{{n.note}}</p>
                  </div>
                </div>
                <ng-template #emptyNotes>
                  <div class="text-center py-5 text-muted">
                    <i class="bi bi-chat-square-quote fs-1 opacity-50 d-block mb-2"></i>
                    No internal notes logged for this lead.
                  </div>
                </ng-template>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-color {
      color: var(--text);
    }
    .bg-light {
      background-color: var(--surface-2) !important;
    }
    .info-label {
      font-size: 0.7rem !important;
      letter-spacing: 1px;
      font-weight: 700;
    }
    .whatsapp-btn-detail {
      color: var(--accent) !important;
      transition: var(--transition);
      width: 32px !important;
      height: 32px !important;
      line-height: 32px !important;
      min-height: auto !important;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
    }
    .whatsapp-btn-detail:hover {
      background-color: var(--accent-tint) !important;
      transform: scale(1.05);
    }
    .timeline { border-left: 2px solid var(--border); padding-left: 20px; position: relative; }
    .timeline-item { position: relative; }
    .timeline-marker {
      width: 10px; height: 10px; border-radius: 50%; background: var(--text-muted);
      position: absolute; left: -26px; top: 12px;
      box-shadow: 0 0 0 3px var(--border);
      transition: var(--transition);
    }
    .timeline-marker.completed {
      background: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-tint);
    }
    .small-icon { font-size: 16px; width: 16px; height: 16px; }
    .timeline-card, .note-card {
      background-color: var(--surface) !important;
      border: 1px solid var(--border) !important;
      color: var(--text) !important;
      transition: var(--transition);
    }
    .timeline-card:hover, .note-card:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md) !important;
    }
    .bg-success-tint {
      background-color: var(--success-tint) !important;
    }
    .bg-warning-tint {
      background-color: var(--warning-tint) !important;
    }
    .text-wrap {
      white-space: pre-wrap;
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

  getStatusClass(status: string) {
    switch (status) {
      case 'NEW': return 'status-new';
      case 'CONTACTED': return 'status-contacted';
      case 'INTERESTED': return 'status-interested';
      case 'FOLLOW_UP': return 'status-warm';
      case 'VISIT_SCHEDULED': return 'status-contacted';
      case 'NEGOTIATION': return 'status-negotiation';
      case 'CLOSED_WON': return 'status-closed';
      case 'CLOSED_LOST': return 'status-hot';
      case 'NOT_INTERESTED': return 'status-cold';
      default: return 'status-contacted';
    }
  }

  formatStatus(status: string): string {
    return status ? status.replace(/_/g, ' ') : '';
  }

  getPriorityClass(priority: string) {
    switch (priority) {
      case 'HOT': return 'status-hot';
      case 'WARM': return 'status-warm';
      case 'COLD': return 'status-cold';
      case 'NOT_CUSTOMER': return 'status-lost';
      default: return 'status-contacted';
    }
  }

  formatPriority(priority: string): string {
    return priority ? priority.replace(/_/g, ' ') : '';
  }
}
