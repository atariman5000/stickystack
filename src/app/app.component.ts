import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AppHeaderComponent } from './header/app-header.component';
import { LaneDialogComponent } from './dialogs/lane-dialog.component';
import { NoteDialogComponent } from './dialogs/note-dialog.component';
import { ProjectBoardComponent } from './board/project-board.component';
import { ProjectDialogComponent } from './dialogs/project-dialog.component';
import { ProjectHomeComponent } from './home/project-home.component';
import { STORAGE_KEY, defaultLanes } from './app.constants';
import { NoteFormModel, Project, ProjectFormModel, StickyNote, StickyStackState } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    LaneDialogComponent,
    NoteDialogComponent,
    ProjectBoardComponent,
    ProjectDialogComponent,
    ProjectHomeComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('projectDialog') private projectDialog?: ProjectDialogComponent;
  @ViewChild('laneDialog') private laneDialog?: LaneDialogComponent;
  @ViewChild('noteDialog') private noteDialog?: NoteDialogComponent;

  state = this.loadState();
  activeProjectId: string | null = null;
  flippedNoteIds = new Set<string>();

  get activeProject(): Project | undefined {
    return this.state.projects.find((project) => project.id === this.activeProjectId);
  }

  get isBoardView(): boolean {
    return Boolean(this.activeProject);
  }

  get pageTitle(): string {
    return this.activeProject?.name ?? 'Organize projects with tactile sticky notes.';
  }

  get pageSubtitle(): string {
    return this.activeProject
      ? 'Flip notes for details, change status to move them, and add lanes as your workflow evolves.'
      : 'Create a project, jump into its board, and move color-coded tasks through custom swim lanes.';
  }

  showHome(): void {
    this.activeProjectId = null;
    this.flippedNoteIds.clear();
  }

  showBoard(projectId: string): void {
    this.activeProjectId = projectId;
    this.flippedNoteIds.clear();
  }

  openProjectForm(): void {
    this.projectDialog?.open();
  }

  createProject(projectForm: ProjectFormModel): void {
    const project: Project = {
      id: crypto.randomUUID(),
      name: projectForm.name,
      description: projectForm.description,
      color: projectForm.color,
      lanes: [...defaultLanes],
      notes: []
    };

    this.state.projects.unshift(project);
    this.saveState();
  }

  openLaneForm(): void {
    this.laneDialog?.open();
  }

  addLane(lane: string): void {
    const project = this.activeProject;
    if (!project) {
      return;
    }

    if (!project.lanes.some((candidate) => candidate.toLowerCase() === lane.toLowerCase())) {
      project.lanes.push(lane);
    }

    this.saveState();
  }

  openNoteForm(note?: StickyNote): void {
    if (!this.activeProject) {
      return;
    }

    this.noteDialog?.open(note);
  }

  saveNote(noteForm: NoteFormModel): void {
    const project = this.activeProject;
    if (!project) {
      return;
    }

    const payload = {
      title: noteForm.title,
      details: noteForm.details,
      status: noteForm.status,
      color: noteForm.color
    };

    if (noteForm.id) {
      const note = project.notes.find((candidate) => candidate.id === noteForm.id);
      if (note) {
        Object.assign(note, payload);
      }
    } else {
      project.notes.push({ id: crypto.randomUUID(), ...payload });
    }

    this.saveState();
  }

  notesForLane(project: Project, lane: string): StickyNote[] {
    return project.notes.filter((note) => note.status === lane);
  }

  doneCount(project: Project): number {
    return project.notes.filter((note) => note.status === 'Done').length;
  }

  toggleNoteFlip(noteId: string): void {
    if (this.flippedNoteIds.has(noteId)) {
      this.flippedNoteIds.delete(noteId);
      return;
    }

    this.flippedNoteIds.add(noteId);
  }

  updateNoteStatus(note: StickyNote, status: string): void {
    note.status = status;
    this.flippedNoteIds.delete(note.id);
    this.saveState();
  }

  deleteNote(project: Project, note: StickyNote): void {
    project.notes = project.notes.filter((candidate) => candidate.id !== note.id);
    this.flippedNoteIds.delete(note.id);
    this.saveState();
  }

  private loadState(): StickyStackState {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as StickyStackState;
      } catch (error) {
        console.warn('Could not parse saved StickyStack data. Loading starter project.', error);
      }
    }

    return {
      projects: [
        {
          id: crypto.randomUUID(),
          name: 'Prototype roadmap',
          description: 'Try the sticky-note project workflow and tune the lanes.',
          color: '#fff18a',
          lanes: [...defaultLanes],
          notes: [
            {
              id: crypto.randomUUID(),
              title: 'Sketch first board flow',
              details: 'Confirm projects live on the home wall, then click into a board with lanes and task notes.',
              status: 'Backlog',
              color: '#94d9ff'
            },
            {
              id: crypto.randomUUID(),
              title: 'Test flip animation',
              details: 'Click any note to flip from the short description to the detail side. Click again to return.',
              status: 'In Progress',
              color: '#ff9fc9'
            },
            {
              id: crypto.randomUUID(),
              title: 'Move by status',
              details: 'Use the status selector on a note to automatically send it to the matching swim lane.',
              status: 'Done',
              color: '#adf0b6'
            }
          ]
        }
      ]
    };
  }

  private saveState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }
}
