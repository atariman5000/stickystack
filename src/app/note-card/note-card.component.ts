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

  @Output() flipped = new EventEmitter<void>();
  @Output() statusChanged = new EventEmitter<string>();
  @Output() edited = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();
}
