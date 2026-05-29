import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AppHeaderComponent } from './header/app-header.component';
import { LaneDialogComponent } from './dialogs/lane-dialog.component';
import { NoteDialogComponent } from './dialogs/note-dialog.component';
import { ProjectBoardComponent } from './board/project-board.component';
import { ProjectDialogComponent } from './dialogs/project-dialog.component';
import { ProjectHomeComponent } from './home/project-home.component';
import { STORAGE_KEY, defaultLanes, defaultReleaseSlices, projectTemplates } from './app.constants';
import { BoardType, NoteCreationContext, NoteFormModel, Project, ProjectFormModel, StickyNote, StickyStackState } from './models';

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
      releaseSlices: template.type === 'storyMap' ? [...defaultReleaseSlices] : [],
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

    if (project.templateType === 'storyMap' && !project.releaseSlices.some((candidate) => candidate.toLowerCase() === lane.toLowerCase())) {
      project.releaseSlices.push(lane);
    }

    if (!project.lanes.some((candidate) => candidate.toLowerCase() === lane.toLowerCase())) {
      project.lanes.push(lane);
    }

    this.saveState();
  }

  openNoteForm(note?: StickyNote, context?: NoteCreationContext): void {
    if (!this.activeProject) {
      return;
    }

    this.noteDialog?.open(note, context);
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
      color: noteForm.color,
      parentId: noteForm.parentId,
      row: noteForm.row,
      column: noteForm.column,
      sortOrder: noteForm.sortOrder,
      cardType: noteForm.cardType
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

  renameReleaseSlice(event: { from: string; to: string }): void {
    const project = this.activeProject;
    const nextName = event.to.trim();
    if (!project || !nextName || project.releaseSlices.some((slice) => slice.toLowerCase() === nextName.toLowerCase() && slice !== event.from)) {
      return;
    }

    project.releaseSlices = project.releaseSlices.map((slice) => slice === event.from ? nextName : slice);
    project.lanes = project.lanes.map((lane) => lane === event.from ? nextName : lane);
    project.notes.forEach((note) => {
      if (note.status === event.from) {
        note.status = nextName;
      }
    });
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
    const removedIds = new Set([note.id]);
    let foundDescendant = true;
    while (foundDescendant) {
      foundDescendant = false;
      project.notes.forEach((candidate) => {
        if (candidate.parentId && removedIds.has(candidate.parentId) && !removedIds.has(candidate.id)) {
          removedIds.add(candidate.id);
          foundDescendant = true;
        }
      });
    }

    project.notes = project.notes.filter((candidate) => !removedIds.has(candidate.id));
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
          releaseSlices: [],
          notes: [
            {
              id: crypto.randomUUID(),
              title: 'Sketch first board flow',
              details: 'Confirm projects live on the home wall, then click into a board with lanes and task notes.',
              status: 'Backlog',
              color: '#94d9ff',
              parentId: null,
              row: 0,
              column: 0,
              sortOrder: 0,
              cardType: 'note'
            },
            {
              id: crypto.randomUUID(),
              title: 'Test flip animation',
              details: 'Click any note to flip from the short description to the detail side. Click again to return.',
              status: 'In Progress',
              color: '#ff9fc9',
              parentId: null,
              row: 0,
              column: 0,
              sortOrder: 1,
              cardType: 'note'
            },
            {
              id: crypto.randomUUID(),
              title: 'Move by status',
              details: 'Use the status selector on a note to automatically send it to the matching swim lane.',
              status: 'Done',
              color: '#adf0b6',
              parentId: null,
              row: 0,
              column: 0,
              sortOrder: 2,
              cardType: 'note'
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
    const lanes = this.migrateLanes(project.lanes, template.lanes, template.type);
    const releaseSlices = this.migrateReleaseSlices(project.releaseSlices, template.type === 'storyMap' ? lanes : []);

    return {
      id: project.id || crypto.randomUUID(),
      name: project.name || 'Untitled project',
      description: project.description || '',
      color: project.color || '#fff18a',
      templateType: template.type,
      lanes,
      releaseSlices,
      notes: this.migrateNotes(project.notes, template.type === 'storyMap' ? releaseSlices : lanes, template.type)
    };
  }

  private migrateLanes(lanes: unknown, fallbackLanes: string[], boardType: BoardType): string[] {
    if (boardType === 'storyMap') {
      return [...fallbackLanes];
    }

    if (Array.isArray(lanes) && lanes.every((lane) => typeof lane === 'string') && lanes.length) {
      return lanes;
    }

    return [...fallbackLanes];
  }

  private migrateReleaseSlices(releaseSlices: unknown, fallbackSlices: string[]): string[] {
    if (Array.isArray(releaseSlices) && releaseSlices.every((slice) => typeof slice === 'string') && releaseSlices.length) {
      return releaseSlices;
    }

    return fallbackSlices.length ? [...fallbackSlices] : [];
  }

  private migrateNotes(notes: unknown, lanes: string[], boardType: BoardType): StickyNote[] {
    if (!Array.isArray(notes)) {
      return [];
    }

    const fallbackStatus = lanes[0] ?? defaultLanes[0];
    return notes.map((note, index) => {
      const savedNote = note as Partial<StickyNote>;

      return {
        id: savedNote.id || crypto.randomUUID(),
        title: savedNote.title || 'Untitled note',
        details: savedNote.details || '',
        status: savedNote.status || fallbackStatus,
        color: savedNote.color || '#fff18a',
        parentId: savedNote.parentId ?? null,
        row: typeof savedNote.row === 'number' && Number.isFinite(savedNote.row) ? savedNote.row : 0,
        column: typeof savedNote.column === 'number' && Number.isFinite(savedNote.column) ? savedNote.column : 0,
        sortOrder: typeof savedNote.sortOrder === 'number' && Number.isFinite(savedNote.sortOrder) ? savedNote.sortOrder : index,
        cardType: savedNote.cardType || (boardType === 'storyMap' ? 'story' : 'note')
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
