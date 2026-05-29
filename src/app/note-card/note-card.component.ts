import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StickyNote } from '../models';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-card.component.html'
})
export class NoteCardComponent {
  @Input({ required: true }) note!: StickyNote;
  @Input({ required: true }) lanes: string[] = [];
  @Input({ required: true }) isFlipped = false;
  @Input() isDragging = false;

  @Output() flipped = new EventEmitter<void>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<void>();
  @Output() statusChanged = new EventEmitter<string>();
  @Output() edited = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  private didDrag = false;

  handleClick(): void {
    if (this.didDrag) {
      this.didDrag = false;
      return;
    }

    this.flipped.emit();
  }

  handleDragStart(event: DragEvent): void {
    this.didDrag = true;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', this.note.id);
    }
    this.dragStarted.emit();
  }

  handleDragEnd(): void {
    this.dragEnded.emit();
  }
}
