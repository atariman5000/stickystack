export interface StickyNote {
  id: string;
  title: string;
  details: string;
  status: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  lanes: string[];
  notes: StickyNote[];
}

export interface StickyStackState {
  projects: Project[];
}

export interface ProjectFormModel {
  name: string;
  description: string;
  color: string;
}

export interface NoteFormModel {
  id: string;
  title: string;
  details: string;
  status: string;
  color: string;
}

export interface PaletteColor {
  name: string;
  value: string;
}
