import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { defaultLanes, palette } from '../app.constants';
import { NoteFormModel, StickyNote } from '../models';

@Component({
  selector: 'app-note-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-dialog.component.html'
})
export class NoteDialogComponent {
  @ViewChild('noteModal') private noteModal?: ElementRef<HTMLDialogElement>;
  @ViewChild('noteFormRef') private noteFormRef?: NgForm;

  @Input() lanes: string[] = defaultLanes;

  @Output() noteSaved = new EventEmitter<NoteFormModel>();

  readonly palette = palette;
  noteForm: NoteFormModel = this.emptyNoteForm();
  noteModalTitle = 'Add note';

  open(note?: StickyNote): void {
    const fallbackStatus = this.lanes[0] ?? defaultLanes[0];

    this.noteFormRef?.resetForm();
    this.noteForm = {
      id: note?.id ?? '',
      title: note?.title ?? '',
      details: note?.details ?? '',
      status: note?.status ?? fallbackStatus,
      color: note?.color ?? palette[0].value
    };
    this.noteModalTitle = note ? 'Edit note' : 'Add note';
    this.showModal();
  }

  saveNote(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.noteSaved.emit({
      id: this.noteForm.id,
      title: this.noteForm.title.trim(),
      details: this.noteForm.details.trim(),
      status: this.noteForm.status,
      color: this.noteForm.color
    });
    this.closeDialog();
    form.resetForm(this.emptyNoteForm(this.lanes[0]));
  }

  closeDialog(): void {
    const dialog = this.noteModal?.nativeElement;
    if (!dialog) {
      return;
    }

    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  private emptyNoteForm(status = defaultLanes[0]): NoteFormModel {
    return { id: '', title: '', details: '', status, color: palette[0].value };
  }

  private showModal(): void {
    const dialog = this.noteModal?.nativeElement;
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
