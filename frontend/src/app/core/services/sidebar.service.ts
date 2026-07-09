import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isOpen = signal(false);

  toggleState() {
    this.isOpen.set(!this.isOpen());
  }

  close() {
    this.isOpen.set(false);
  }

  open() {
    this.isOpen.set(true);
  }
}
