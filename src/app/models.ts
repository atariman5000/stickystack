export type BoardType = 'kanban' | 'storyMap' | 'roadmap' | 'retrospective' | 'canvas' | 'prioritization' | 'mindMap';
export type StoryCardType = 'activity' | 'task' | 'story' | 'note';

export interface ProjectTemplate {
  type: BoardType;
  label: string;
  description: string;
  lanes: string[];
}

export interface StickyNote {
  id: string;
  title: string;
  details: string;
  status: string;
  color: string;
  parentId: string | null;
  row: number;
  column: number;
  sortOrder: number;
  cardType: StoryCardType;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  templateType: BoardType;
  lanes: string[];
  releaseSlices: string[];
  notes: StickyNote[];
}

export interface StickyStackState {
  projects: Project[];
}

export interface ProjectFormModel {
  name: string;
  description: string;
  color: string;
  templateType: BoardType;
}

export interface NoteFormModel {
  id: string;
  title: string;
  details: string;
  status: string;
  color: string;
  parentId: string | null;
  row: number;
  column: number;
  sortOrder: number;
  cardType: StoryCardType;
}

export interface NoteCreationContext {
  cardType: StoryCardType;
  parentId: string | null;
  status?: string;
  column?: number;
  row?: number;
}

export interface PaletteColor {
  name: string;
  value: string;
}
