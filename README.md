# StickyStack

StickyStack is an Angular prototype for organizing work with Post-it style project boards. The home screen shows each project as a sticky note with its selected board template. Opening a project reveals template-defined sections where task notes can be added, deleted, edited, flipped for details, and moved automatically by changing their status.

## Run locally

Install dependencies, then start the Angular dev server:

```bash
npm install
npm start
```

Then open <http://localhost:4173>.

## Useful scripts

```bash
npm run build
npm run check
```

## Product roadmap

See [`docs/cardboardit-parity-roadmap.md`](docs/cardboardit-parity-roadmap.md) for the step-by-step CardBoard-inspired implementation plan, including prompts, acceptance criteria, and checks for each phase.

## Prototype scope

- Create projects from the home wall with a board template.
- Start from Simple Kanban, User Story Map, Product Roadmap, Opportunity Canvas, Sailboat Retro, or 2x2 Prioritization Matrix templates.
- Add custom swim lanes inside each project.
- Add, edit, delete, and color-code notes.
- Click a note to flip between the front description and back details.
- Change a note's status to move it to the matching section.
- Persist prototype data in `localStorage`.
- Migrate older saved projects without template data into Simple Kanban boards.
