import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AppHeaderComponent } from './header/app-header.component';
import { LaneDialogComponent } from './dialogs/lane-dialog.component';
import { NoteDialogComponent } from './dialogs/note-dialog.component';
import { ProjectBoardComponent } from './board/project-board.component';
import { ProjectDialogComponent } from './dialogs/project-dialog.component';
import { ProjectHomeComponent } from './home/project-home.component';
import { STORAGE_KEY, defaultLanes, projectTemplates } from './app.constants';
import { BoardType, NoteFormModel, Project, ProjectFormModel, StickyNote, StickyStackState } from './models';

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
    const template = this.templateFor(projectForm.templateType);
    const project: Project = {
      id: crypto.randomUUID(),
      name: projectForm.name,
      description: projectForm.description,
      color: projectForm.color,
      templateType: template.type,
      lanes: [...template.lanes],
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
        const parsedState = JSON.parse(saved) as Partial<StickyStackState>;
        const migratedState = this.migrateState(parsedState);
        if (JSON.stringify(parsedState) !== JSON.stringify(migratedState)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedState));
        }
        return migratedState;
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
          templateType: 'kanban',
          lanes: [...this.templateFor('kanban').lanes],
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

  private migrateState(state: Partial<StickyStackState>): StickyStackState {
    const projects = Array.isArray(state.projects)
      ? state.projects.map((project) => this.migrateProject(project as Partial<Project>))
      : [];

    return { projects };
  }

  private migrateProject(project: Partial<Project>): Project {
    const template = this.templateFor(project.templateType);
    const lanes = this.migrateLanes(project.lanes, template.lanes);

    return {
      id: project.id || crypto.randomUUID(),
      name: project.name || 'Untitled project',
      description: project.description || '',
      color: project.color || '#fff18a',
      templateType: template.type,
      lanes,
      notes: this.migrateNotes(project.notes, lanes)
    };
  }

  private migrateLanes(lanes: unknown, fallbackLanes: string[]): string[] {
    if (Array.isArray(lanes) && lanes.every((lane) => typeof lane === 'string') && lanes.length) {
      return lanes;
    }

    return [...fallbackLanes];
  }

  private migrateNotes(notes: unknown, lanes: string[]): StickyNote[] {
    if (!Array.isArray(notes)) {
      return [];
    }

    const fallbackStatus = lanes[0] ?? defaultLanes[0];
    return notes.map((note) => {
      const savedNote = note as Partial<StickyNote>;

      return {
        id: savedNote.id || crypto.randomUUID(),
        title: savedNote.title || 'Untitled note',
        details: savedNote.details || '',
        status: savedNote.status || fallbackStatus,
        color: savedNote.color || '#fff18a'
      };
    });
  }

  private templateFor(type: BoardType | undefined) {
    return projectTemplates.find((template) => template.type === type) ?? projectTemplates[0];
  }

  private saveState(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }
}
