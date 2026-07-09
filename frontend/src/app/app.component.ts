import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSnackBarModule],
  template: '<router-outlet></router-outlet>',
  styles: []
})
export class AppComponent implements OnInit {
  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.checkForUpdates();
    this.setupInstallPrompt();
  }

  private checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          const snack = this.snackBar.open(
            'New version available. Update now?',
            'RELOAD',
            { duration: 15000, horizontalPosition: 'center', verticalPosition: 'bottom' }
          );
          snack.onAction().subscribe(() => {
            window.location.reload();
          });
        });
    }
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      
      const snack = this.snackBar.open(
        'Install LeadFlow CRM on your device.',
        'INSTALL',
        { duration: 10000, horizontalPosition: 'right', verticalPosition: 'bottom' }
      );
      snack.onAction().subscribe(() => {
        const promptEvent = (window as any).deferredPrompt;
        if (promptEvent) {
          promptEvent.prompt();
          promptEvent.userChoice.then(() => {
            (window as any).deferredPrompt = null;
          });
        }
      });
    });
  }
}
