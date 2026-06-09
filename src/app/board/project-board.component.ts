import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoteCardComponent } from '../note-card/note-card.component';
import { projectTemplates } from '../app.constants';
import { NoteCreationContext, Project, StickyNote } from '../models';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [FormsModule, NoteCardComponent],
  templateUrl: './project-board.component.html'
})
export class ProjectBoardComponent {
  @Input({ required: true }) project!: Project;
  @Input({ required: true }) flippedNoteIds!: Set<string>;

  @Output() noteFlipped = new EventEmitter<string>();
  @Output() noteStatusChanged = new EventEmitter<{ note: StickyNote; status: string }>();
  @Output() noteEdited = new EventEmitter<StickyNote>();
  @Output() noteDeleted = new EventEmitter<StickyNote>();
  @Output() noteCreated = new EventEmitter<NoteCreationContext>();
  @Output() releaseSliceRenamed = new EventEmitter<{ from: string; to: string }>();

  draggedNoteId: string | null = null;
  dragOverLane: string | null = null;

  notesForLane(project: Project, lane: string): StickyNote[] {
    return project.notes.filter((note) => note.status === lane);
  }

  activities(project: Project): StickyNote[] {
    return this.sorted(project.notes.filter((note) => note.cardType === 'activity'));
  }

  tasksForActivity(project: Project, activityId: string): StickyNote[] {
    return this.sorted(project.notes.filter((note) => note.cardType === 'task' && note.parentId === activityId));
  }

  storiesForTask(project: Project, taskId: string, releaseSlice: string): StickyNote[] {
    return this.sorted(project.notes.filter((note) => note.cardType === 'story' && note.parentId === taskId && note.status === releaseSlice));
  }

  storyCount(project: Project, releaseSlice: string): number {
    return project.notes.filter((note) => note.cardType === 'story' && note.status === releaseSlice).length;
  }

  createActivity(project: Project): void {
    this.noteCreated.emit({
      cardType: 'activity',
      parentId: null,
      status: project.releaseSlices[0],
      column: this.activities(project).length,
      row: 0
    });
  }

  createTask(project: Project, activity: StickyNote): void {
    this.noteCreated.emit({
      cardType: 'task',
      parentId: activity.id,
      status: project.releaseSlices[0],
      column: activity.column,
      row: this.tasksForActivity(project, activity.id).length
    });
  }

  createStory(project: Project, task: StickyNote, releaseSlice: string): void {
    this.noteCreated.emit({
      cardType: 'story',
      parentId: task.id,
      status: releaseSlice,
      column: task.column,
      row: project.releaseSlices.indexOf(releaseSlice)
    });
  }

  doneCount(project: Project): number {
    return project.notes.filter((note) => note.status === 'Done').length;
  }

  templateLabel(project: Project): string {
    return projectTemplates.find((template) => template.type === project.templateType)?.label ?? 'Simple Kanban';
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

  dropNoteInReleaseSlice(event: DragEvent, releaseSlice: string): void {
    event.preventDefault();
    const noteId = event.dataTransfer?.getData('text/plain') || this.draggedNoteId;
    const note = this.project.notes.find((candidate) => candidate.id === noteId);

    if (note && note.cardType === 'story' && note.status !== releaseSlice) {
      this.noteStatusChanged.emit({ note, status: releaseSlice });
    }

    this.endNoteDrag();
  }

  renameReleaseSlice(from: string, to: string): void {
    this.releaseSliceRenamed.emit({ from, to });
  }

  private sorted(notes: StickyNote[]): StickyNote[] {
    return [...notes].sort((first, second) => first.sortOrder - second.sortOrder || first.title.localeCompare(second.title));
  }
}
