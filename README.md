# StickyStack

StickyStack is an Angular prototype for organizing work with Post-it style project boards. The home screen shows each project as a sticky note. Opening a project reveals swim lanes where task notes can be added, deleted, edited, flipped for details, and moved automatically by changing their status.

## Run locally

Install dependencies, then start the Angular dev server:

```bash
npm install
npm start
```

Then open <http://localhost:4200>.

## Useful scripts

```bash
npm run build
npm run check
```

## Prototype scope

- Create projects from the home wall.
- Add custom swim lanes inside each project.
- Add, edit, delete, and color-code notes.
- Click a note to flip between the front description and back details.
- Change a note's status to move it to the matching swim lane.
- Persist prototype data in `localStorage`.
