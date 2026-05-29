import { PaletteColor, ProjectTemplate } from './models';

export const STORAGE_KEY = 'stickystack.prototype.v1';
export const defaultLanes = ['Backlog', 'In Progress', 'Done'];
export const defaultReleaseSlices = ['MVP', 'Release 1', 'Later'];
export const projectTemplates: ProjectTemplate[] = [
  {
    type: 'kanban',
    label: 'Simple Kanban',
    description: 'Track work through a lightweight backlog, in-progress, and done flow.',
    lanes: [...defaultLanes]
  },
  {
    type: 'storyMap',
    label: 'User Story Map',
    description: 'Map user activities, tasks, stories, and release slices.',
    lanes: [...defaultReleaseSlices]
  },
  {
    type: 'roadmap',
    label: 'Product Roadmap',
    description: 'Plan outcomes across now, next, later, and launched horizons.',
    lanes: ['Now', 'Next', 'Later', 'Launched']
  },
  {
    type: 'canvas',
    label: 'Opportunity Canvas',
    description: 'Frame customer problems, evidence, ideas, experiments, and decisions.',
    lanes: ['Problem', 'Customers', 'Evidence', 'Ideas', 'Experiments', 'Decisions']
  },
  {
    type: 'retrospective',
    label: 'Sailboat Retro',
    description: 'Capture goals, wind, anchors, risks, and actions after a workshop.',
    lanes: ['Island', 'Wind', 'Anchors', 'Rocks', 'Actions']
  },
  {
    type: 'prioritization',
    label: '2x2 Prioritization Matrix',
    description: 'Compare ideas by impact and effort before deciding what to do next.',
    lanes: ['High Impact / Low Effort', 'High Impact / High Effort', 'Low Impact / Low Effort', 'Low Impact / High Effort']
  }
];
export const palette: PaletteColor[] = [
  { name: 'Sunbeam yellow', value: '#fff18a' },
  { name: 'Idea pink', value: '#ff9fc9' },
  { name: 'Sky blue', value: '#94d9ff' },
  { name: 'Mint green', value: '#adf0b6' },
  { name: 'Lavender', value: '#cab6ff' },
  { name: 'Apricot', value: '#ffc078' }
];
