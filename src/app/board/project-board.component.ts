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

  draggedNoteId: string | null = null;
  dragOverLane: string | null = null;

  notesForLane(project: Project, lane: string): StickyNote[] {
    return project.notes.filter((note) => note.status === lane);
  }

  doneCount(project: Project): number {
    return project.notes.filter((note) => note.status === 'Done').length;
  }

  isNoteFlipped(noteId: string): boolean {
    return this.flippedNoteIds.has(noteId);
  }

  startNoteDrag(noteId: string): void {
    this.draggedNoteId = noteId;
  }

  endNoteDrag(): void {
    this.draggedNoteId = null;
    this.dragOverLane = null;
  }

  allowLaneDrop(event: DragEvent, lane: string): void {
    if (!this.draggedNoteId) {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverLane = lane;
  }

  leaveLane(event: DragEvent, lane: string): void {
    if (!event.currentTarget || !event.relatedTarget) {
      this.dragOverLane = null;
      return;
    }

    const laneElement = event.currentTarget as HTMLElement;
    if (!laneElement.contains(event.relatedTarget as Node) && this.dragOverLane === lane) {
      this.dragOverLane = null;
    }
  }

  dropNoteInLane(event: DragEvent, lane: string): void {
    event.preventDefault();
    const noteId = event.dataTransfer?.getData('text/plain') || this.draggedNoteId;
    const note = this.project.notes.find((candidate) => candidate.id === noteId);

    if (note && note.status !== lane) {
      this.noteStatusChanged.emit({ note, status: lane });
    }

    this.endNoteDrag();
  }
}
