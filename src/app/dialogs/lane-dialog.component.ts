import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-lane-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lane-dialog.component.html'
})
export class LaneDialogComponent {
  @ViewChild('laneModal') private laneModal?: ElementRef<HTMLDialogElement>;
  @ViewChild('laneFormRef') private laneFormRef?: NgForm;

  @Output() laneAdded = new EventEmitter<string>();

  laneName = '';

  open(): void {
    this.laneFormRef?.resetForm();
    this.laneName = '';
    this.showModal();
  }

  addLane(form: NgForm): void {
    const lane = this.laneName.trim();
    if (form.invalid || !lane) {
      return;
    }

    this.laneAdded.emit(lane);
    this.closeDialog();
    form.resetForm();
    this.laneName = '';
  }

  closeDialog(): void {
    const dialog = this.laneModal?.nativeElement;
    if (!dialog) {
      return;
    }

    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  private showModal(): void {
    const dialog = this.laneModal?.nativeElement;
    if (!dialog) {
      return;
    }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }
}
