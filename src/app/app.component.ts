import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

const STORAGE_KEY = 'stickystack.prototype.v1';
const defaultLanes = ['Backlog', 'In Progress', 'Done'];
const palette = [
  { name: 'Sunbeam yellow', value: '#fff18a' },
  { name: 'Idea pink', value: '#ff9fc9' },
  { name: 'Sky blue', value: '#94d9ff' },
  { name: 'Mint green', value: '#adf0b6' },
  { name: 'Lavender', value: '#cab6ff' },
  { name: 'Apricot', value: '#ffc078' }
];

interface StickyNote {
  id: string;
  title: string;
  details: string;
  status: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  lanes: string[];
  notes: StickyNote[];
}

interface StickyStackState {
  projects: Project[];
}

interface ProjectFormModel {
  name: string;
  description: string;
  color: string;
}

interface NoteFormModel {
  id: string;
  title: string;
  details: string;
  status: string;
  color: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('projectModal') private projectModal?: ElementRef<HTMLDialogElement>;
  @ViewChild('laneModal') private laneModal?: ElementRef<HTMLDialogElement>;
  @ViewChild('noteModal') private noteModal?: ElementRef<HTMLDialogElement>;

  readonly palette = palette;
  readonly tiltValues = [-2.4, 1.8, -1.2, 2.2];

  state = this.loadState();
  activeProjectId: string | null = null;
  flippedNoteIds = new Set<string>();
  laneName = '';
  projectForm: ProjectFormModel = this.emptyProjectForm();
  noteForm: NoteFormModel = this.emptyNoteForm();
  noteModalTitle = 'Add note';

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

  projectTilt(index: number): string {
    return `${this.tiltValues[index % this.tiltValues.length]}deg`;
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

  isNoteFlipped(noteId: string): boolean {
    return this.flippedNoteIds.has(noteId);
  }

  updateNoteStatus(note: StickyNote, status: string): void {
    note.status = status;
    this.flippedNoteIds.delete(note.id);
    this.saveState();
  }

  openProjectForm(form?: NgForm): void {
    form?.resetForm();
    this.projectForm = this.emptyProjectForm();
    this.showModal(this.projectModal?.nativeElement);
  }

  createProject(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const project: Project = {
      id: crypto.randomUUID(),
      name: this.projectForm.name.trim(),
      description: this.projectForm.description.trim(),
      color: this.projectForm.color,
      lanes: [...defaultLanes],
      notes: []
    };

    this.state.projects.unshift(project);
    this.saveState();
    this.closeModal(this.projectModal?.nativeElement);
    form.resetForm(this.emptyProjectForm());
  }

  openLaneForm(form?: NgForm): void {
    form?.resetForm();
    this.laneName = '';
    this.showModal(this.laneModal?.nativeElement);
  }

  addLane(form: NgForm): void {
    const project = this.activeProject;
    const lane = this.laneName.trim();
    if (!project || form.invalid || !lane) {
      return;
    }

    if (!project.lanes.some((candidate) => candidate.toLowerCase() === lane.toLowerCase())) {
      project.lanes.push(lane);
    }

    this.saveState();
    this.closeModal(this.laneModal?.nativeElement);
    form.resetForm();
    this.laneName = '';
  }

  openNoteForm(note?: StickyNote, form?: NgForm): void {
    const project = this.activeProject;
    if (!project) {
      return;
    }

    form?.resetForm();
    this.noteForm = {
      id: note?.id ?? '',
      title: note?.title ?? '',
      details: note?.details ?? '',
      status: note?.status ?? project.lanes[0],
      color: note?.color ?? palette[0].value
    };
    this.noteModalTitle = note ? 'Edit note' : 'Add note';
    this.showModal(this.noteModal?.nativeElement);
  }

  saveNote(form: NgForm): void {
    const project = this.activeProject;
    if (!project || form.invalid) {
      return;
    }

    const payload = {
      title: this.noteForm.title.trim(),
      details: this.noteForm.details.trim(),
      status: this.noteForm.status,
      color: this.noteForm.color
    };

    if (this.noteForm.id) {
      const note = project.notes.find((candidate) => candidate.id === this.noteForm.id);
      if (note) {
        Object.assign(note, payload);
      }
    } else {
      project.notes.push({ id: crypto.randomUUID(), ...payload });
    }

    this.saveState();
    this.closeModal(this.noteModal?.nativeElement);
    form.resetForm(this.emptyNoteForm(project.lanes[0]));
  }

  deleteNote(project: Project, note: StickyNote): void {
    project.notes = project.notes.filter((candidate) => candidate.id !== note.id);
    this.flippedNoteIds.delete(note.id);
    this.saveState();
  }

  closeDialog(dialog?: HTMLDialogElement): void {
    this.closeModal(dialog);
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
          lanes: defaultLanes,
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

  private emptyProjectForm(): ProjectFormModel {
    return { name: '', description: '', color: palette[0].value };
  }

  private emptyNoteForm(status = defaultLanes[0]): NoteFormModel {
    return { id: '', title: '', details: '', status, color: palette[0].value };
  }

  private showModal(dialog?: HTMLDialogElement): void {
    if (!dialog) {
      return;
    }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  private closeModal(dialog?: HTMLDialogElement): void {
    if (!dialog) {
      return;
    }

    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }
}
