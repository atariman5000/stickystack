import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoteCardComponent } from '../note-card/note-card.component';
import { Project, StickyNote } from '../models';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [CommonModule, NoteCardComponent],
  templateUrl: './project-board.component.html'
})
export class ProjectBoardComponent {
  @Input({ required: true }) project!: Project;
  @Input({ required: true }) flippedNoteIds!: Set<string>;

  @Output() noteFlipped = new EventEmitter<string>();
  @Output() noteStatusChanged = new EventEmitter<{ note: StickyNote; status: string }>();
  @Output() noteEdited = new EventEmitter<StickyNote>();
  @Output() noteDeleted = new EventEmitter<StickyNote>();

  notesForLane(project: Project, lane: string): StickyNote[] {
    return project.notes.filter((note) => note.status === lane);
  }

  doneCount(project: Project): number {
    return project.notes.filter((note) => note.status === 'Done').length;
  }

  isNoteFlipped(noteId: string): boolean {
    return this.flippedNoteIds.has(noteId);
  }
}
