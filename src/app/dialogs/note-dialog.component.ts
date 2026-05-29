import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { defaultLanes, palette } from '../app.constants';
import { NoteCreationContext, NoteFormModel, StickyNote } from '../models';

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
  @Input() isStoryMap = false;

  @Output() noteSaved = new EventEmitter<NoteFormModel>();

  readonly palette = palette;
  noteForm: NoteFormModel = this.emptyNoteForm();
  noteModalTitle = 'Add note';

  open(note?: StickyNote, context?: NoteCreationContext): void {
    const fallbackStatus = this.lanes[0] ?? defaultLanes[0];
    const cardType = note?.cardType ?? context?.cardType ?? (this.isStoryMap ? 'activity' : 'note');

    this.noteFormRef?.resetForm();
    this.noteForm = {
      id: note?.id ?? '',
      title: note?.title ?? '',
      details: note?.details ?? '',
      status: note?.status ?? context?.status ?? fallbackStatus,
      color: note?.color ?? palette[0].value,
      parentId: note?.parentId ?? context?.parentId ?? null,
      row: note?.row ?? context?.row ?? 0,
      column: note?.column ?? context?.column ?? 0,
      sortOrder: note?.sortOrder ?? Date.now(),
      cardType
    };
    this.noteModalTitle = note ? 'Edit note' : `Add ${this.cardTypeLabel(cardType).toLowerCase()}`;
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
      color: this.noteForm.color,
      parentId: this.noteForm.parentId,
      row: this.noteForm.row,
      column: this.noteForm.column,
      sortOrder: this.noteForm.sortOrder,
      cardType: this.noteForm.cardType
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
    return {
      id: '',
      title: '',
      details: '',
      status,
      color: palette[0].value,
      parentId: null,
      row: 0,
      column: 0,
      sortOrder: 0,
      cardType: 'note'
    };
  }

  cardTypeLabel(cardType: string): string {
    switch (cardType) {
      case 'activity':
        return 'Activity';
      case 'task':
        return 'User task';
      case 'story':
        return 'Story';
      default:
        return 'Note';
    }
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
