# StickyStack CardBoard-Inspired Roadmap

This roadmap turns StickyStack from a local sticky-note swim-lane prototype into a collaborative product-planning workspace inspired by CardBoard-style story maps, roadmaps, canvases, voting, board linking, exports, and integrations.

## Product goal

StickyStack should help a product team move from discovery to delivery in one visual workspace:

1. Capture ideas as sticky notes.
2. Organize them into story maps, roadmaps, kanban boards, retrospectives, and canvases.
3. Add enough detail to each note to make the board actionable.
4. Collaborate through comments, votes, guest access, and facilitation tools.
5. Export, share, and eventually sync work with delivery systems.

## Current baseline

The application already supports the first foundation layer:

- Project cards on a home wall.
- Project-level boards with custom swim lanes.
- Sticky notes with title, details, status, and color.
- Note creation, editing, deleting, flipping, drag-and-drop status movement, and `localStorage` persistence.

Keep this baseline stable while expanding the product in thin, testable slices.

## Implementation principles

- Ship one complete vertical slice at a time: model, UI, persistence, and smoke test.
- Keep existing local-first behavior until the collaboration phase requires a backend.
- Add data migrations whenever stored models change so existing `localStorage` users do not lose boards.
- Prefer reusable board primitives over one-off template screens: cards, lanes, sections, dividers, connectors, comments, and metadata should work across board types.
- Add promptable acceptance criteria to every phase so each implementation step can be tested before moving on.
- Mark checklist items as complete as each milestone ships. A phase is done only when its build tasks, acceptance tests, checks, and documentation update are complete.

## Phase 1 — Board types and templates

**Status:** [x] Complete

### Why

CardBoard-like tools are not just kanban boards. They provide starting structures for story mapping, roadmapping, retrospectives, prioritization, and product canvases.

### Build

- [x] Add a `BoardType` or `ProjectTemplate` model with types such as `kanban`, `storyMap`, `roadmap`, `retrospective`, `canvas`, and `mindMap`.
- [x] Replace the fixed default lane set with template-defined sections.
- [x] Add a template picker when creating a project.
- [x] Seed the Simple Kanban template.
- [x] Seed the User Story Map template.
- [x] Seed the Product Roadmap template.
- [x] Seed the Opportunity Canvas template.
- [x] Seed the Sailboat Retro template.
- [x] Seed the 2x2 Prioritization Matrix template.
- [x] Show each project type on the home wall with a label and short description.

### Prompt to implement

```text
Add board template support to StickyStack. Introduce typed templates for kanban, story map, roadmap, canvas, retro, and prioritization boards. Update project creation so users choose a template, seed the board sections from that template, persist the template type, and show the template label on project cards. Include model migration for old projects with only lanes.
```

### Acceptance tests

- [x] Creating a project requires or defaults to a template.
- [x] Existing saved projects still load as kanban boards.
- [x] Each template creates the expected sections without breaking note CRUD.
- [x] Project cards display the selected template type.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [x] `npm run check` passes.
- [x] `npm run build` passes.
- [x] README or docs describe the new template capability.

## Phase 2 — Story-map layout and release slices

**Status:** [ ] Not started

### Why

The most important CardBoard-style differentiator is a story map: a user journey backbone, child tasks or stories, and release slices.

### Build

- [ ] Add hierarchy fields to notes, such as `parentId`, `row`, `column`, `sortOrder`, and `cardType`.
- [ ] Support activities or backbone items.
- [ ] Support user tasks.
- [ ] Support stories or implementation notes.
- [ ] Add horizontal release dividers or slices, such as `MVP`, `Release 1`, and `Later`.
- [ ] Allow notes to be moved within the map without losing their hierarchy.
- [ ] Add an empty-state helper that explains how to build a story map.

### Prompt to implement

```text
Implement the Story Map board experience. Extend notes with hierarchy and ordering fields, add release slices, render story-map projects as activity columns with task/story rows, and keep kanban boards working as-is. Include migration defaults and update smoke tests for story-map rendering.
```

### Acceptance tests

- [ ] Story-map boards render in columns instead of status lanes.
- [ ] Notes can be added under a selected activity or task.
- [ ] Release slices appear and can be renamed.
- [ ] Existing kanban boards are unaffected.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] README or docs describe the story-map capability.

## Phase 3 — Rich card backs, attachments, tags, and estimates

**Status:** [ ] Not started

### Why

Planning cards need more than a title and details field once they become the team’s source of truth.

### Build

- [ ] Add description or acceptance criteria to notes.
- [ ] Add tags to notes.
- [ ] Add priority to notes.
- [ ] Add estimate to notes.
- [ ] Add assignee to notes.
- [ ] Add due date to notes.
- [ ] Add links to notes.
- [ ] Add lightweight attachment metadata to notes.
- [ ] Redesign the note dialog into tabs or sections: Summary, Details, Planning, Links.
- [ ] Add filtering by tag, assignee, priority, and status.
- [ ] Add search across titles and details.

### Prompt to implement

```text
Upgrade StickyStack note cards into rich planning cards. Add fields for tags, priority, estimate, assignee, due date, links, and acceptance criteria. Update the note dialog and card backs to edit and display these fields. Add search and filter controls for status, tag, assignee, and priority.
```

### Acceptance tests

- [ ] Old notes migrate with empty optional metadata.
- [ ] Users can create and edit all new card fields.
- [ ] Filters combine predictably and can be cleared.
- [ ] Card backs show useful metadata without overcrowding the card front.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] README or docs describe the rich card and filtering capability.

## Phase 4 — Board links, dependencies, connectors, and zoomable structure

**Status:** [ ] Not started

### Why

CardBoard-style tools help teams split complex planning into linked boards and visualize relationships between cards.

### Build

- [ ] Add board-to-board links with preview cards.
- [ ] Add note dependencies or relationships, such as `blocks`, `blockedBy`, `relatesTo`, and `duplicates`.
- [ ] Render connector lines between related notes where practical.
- [ ] Add a side panel for dependency details if full canvas connectors become visually dense.
- [ ] Add board-level breadcrumbs and linked-board navigation.

### Prompt to implement

```text
Add linked boards and card relationships. Let users connect one project board to another, show linked-board preview cards, add note relationships such as blocks or relates to, and render relationship indicators on cards with a dependency side panel.
```

### Acceptance tests

- [ ] A board can link to another board and navigate back.
- [ ] Note relationships persist across refreshes.
- [ ] Deleting a note or board cleans up orphaned relationships.
- [ ] Relationship indicators are visible without making cards hard to read.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] README or docs describe linked boards and relationships.

## Phase 5 — Collaboration-ready local features

**Status:** [ ] Not started

### Why

Before adding real-time multi-user collaboration, add collaboration concepts that work locally and can later be moved to a backend.

### Build

- [ ] Add comment threads on notes.
- [ ] Add board-level annotations or facilitator notes.
- [ ] Add voting sessions with configurable vote limits.
- [ ] Add a simple timer for workshops.
- [ ] Add presenter/facilitator mode for focusing the room on one card or section.
- [ ] Add guest/share-link UI placeholders that explain what will require backend support later.

### Prompt to implement

```text
Add local collaboration features to StickyStack. Implement note comments, board annotations, voting sessions with vote limits, a workshop timer, and facilitator focus mode. Persist everything locally and design the data model so it can later move to a backend.
```

### Acceptance tests

- [ ] Comments can be added, edited, and deleted on a note.
- [ ] Voting can start, stop, and display totals.
- [ ] Votes persist after refresh.
- [ ] Facilitator focus mode highlights one card or section.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] README or docs describe local collaboration features.

## Phase 6 — Import, export, and offline sharing

**Status:** [ ] Not started

### Why

Teams need to preserve workshop output and share snapshots with stakeholders who are not active collaborators.

### Build

- [ ] Export boards to JSON for backup and re-import.
- [ ] Export boards to CSV for spreadsheet review.
- [ ] Add browser print styles for PDF export.
- [ ] Add import validation and conflict handling.
- [ ] Add sample data import for demos.

### Prompt to implement

```text
Implement board import and export. Add JSON backup export/import, CSV export for cards, print-friendly board styles for PDF generation, import validation, and user-visible error handling for unsupported files or invalid board data.
```

### Acceptance tests

- [ ] Exported JSON can be imported into a clean browser and reproduce the board.
- [ ] CSV contains one row per note with key metadata.
- [ ] Print/PDF view is readable for kanban and story-map boards.
- [ ] Invalid import files show clear errors and do not corrupt existing boards.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] README or docs describe import, export, and print sharing.

## Phase 7 — Backend persistence, accounts, workspaces, and permissions

**Status:** [ ] Not started

### Why

Real collaboration, sharing, private boards, viewers, and auditability require server-side persistence and identity.

### Build

- [ ] Choose a backend path, such as Firebase/Supabase for speed or a custom API for control.
- [ ] Add user accounts and workspace membership.
- [ ] Add roles: owner, editor, viewer, and guest.
- [ ] Move projects from `localStorage` into backend storage.
- [ ] Keep a local cache for offline resilience.
- [ ] Add migration/export path from existing local data.

### Prompt to implement

```text
Add backend-backed workspaces to StickyStack. Introduce authentication, workspace membership, owner/editor/viewer roles, server-side board persistence, and a migration flow that imports existing localStorage projects into the signed-in workspace.
```

### Acceptance tests

- [ ] Users can sign in and see only their workspace boards.
- [ ] Editors can change boards; viewers cannot.
- [ ] Existing local projects can be migrated after sign-in.
- [ ] Signing out does not expose private boards.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] README or docs describe backend workspaces, roles, and local migration.

## Phase 8 — Real-time collaboration and guest access

**Status:** [ ] Not started

### Why

The application should support remote workshops where multiple people edit the same board at the same time.

### Build

- [ ] Add real-time board updates through WebSockets, Firebase, Supabase Realtime, or a similar mechanism.
- [ ] Show collaborator cursors or presence indicators.
- [ ] Add optimistic updates and conflict handling.
- [ ] Add guest links with scoped access and expiration.
- [ ] Add activity history for recent board changes.

### Prompt to implement

```text
Implement real-time collaboration. Add presence indicators, live card and board updates, optimistic conflict handling, scoped guest links, and a board activity feed. Keep permissions enforced by the backend.
```

### Acceptance tests

- [ ] Two browser sessions see note changes without refreshing.
- [ ] Presence indicators show active collaborators.
- [ ] Guest links can be created, used, revoked, and expired.
- [ ] Permission rules still apply during real-time updates.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] README or docs describe real-time collaboration and guest access.

## Phase 9 — Integrations and API

**Status:** [ ] Not started

### Why

Product discovery boards become more valuable when they connect to execution tools.

### Build

- [ ] Start with one integration, preferably Jira or GitHub Issues, before adding more.
- [ ] Add an integration abstraction around external work items.
- [ ] Map StickyStack notes to external issues or cards.
- [ ] Support one-way import first, then controlled two-way sync.
- [ ] Add webhook processing for external changes.
- [ ] Add an internal REST API for enterprise-style automation.

### Prompt to implement

```text
Add the first delivery-tool integration to StickyStack. Create an integration abstraction, implement one-way import from GitHub Issues or Jira into notes, store external IDs, and show sync status on cards. Design the code so future two-way sync and additional providers can be added.
```

### Acceptance tests

- [ ] Users can connect a provider in a test environment.
- [ ] External items import as notes with source metadata.
- [ ] Re-import updates matched notes instead of duplicating them.
- [ ] Integration failures are visible and recoverable.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] README or docs describe the first integration and API direction.

## Phase 10 — Enterprise polish and operational readiness

**Status:** [ ] Not started

### Why

After core product-market fit, the app needs trust, observability, and admin capabilities.

### Build

- [ ] Add workspace audit logs.
- [ ] Add admin insights, such as active boards, contributors, and stale boards.
- [ ] Add SSO/SAML only if customer demand justifies it.
- [ ] Add backup/restore documentation.
- [ ] Add accessibility audits for keyboard navigation, screen readers, and contrast.
- [ ] Add end-to-end tests for critical flows.

### Prompt to implement

```text
Add enterprise readiness features to StickyStack. Implement workspace audit logs, admin insights, improved accessibility for board and card interactions, backup/restore documentation, and end-to-end coverage for project creation, note editing, template boards, and exports.
```

### Acceptance tests

- [ ] Admins can inspect key workspace activity.
- [ ] Keyboard users can create, edit, move, and delete notes.
- [ ] Critical user flows are covered by automated tests.
- [ ] Backup and restore steps are documented and verified.

### Suggested checks

```bash
npm run check
npm run build
```

### Completion checklist

- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] README or docs describe enterprise readiness, accessibility, and backup/restore.

## Recommended prompt order

Use these prompts one at a time, only moving forward after checks pass:

1. [x] Board templates.
2. [ ] Story-map layout.
3. [ ] Rich card metadata and filters.
4. [ ] Board links and dependencies.
5. [ ] Local collaboration features.
6. [ ] Import/export.
7. [ ] Backend workspaces and permissions.
8. [ ] Real-time collaboration.
9. [ ] First integration.
10. [ ] Enterprise polish.

## Suggested test strategy

- Keep `npm run check` as the fast gate for structural smoke checks.
- Run `npm run build` after every feature slice.
- Add component-level tests when Angular testing is configured.
- Add Playwright or Cypress before the collaboration phase so multi-step board workflows can be tested reliably.
- Add migration tests whenever `Project`, `StickyNote`, or persisted state changes.
- Add import/export golden-file tests once JSON and CSV export exist.

## Definition of done for every phase

A phase is complete only when:

- [ ] The feature is available from the UI.
- [ ] Existing boards still load.
- [ ] Data persists after refresh.
- [ ] Smoke checks and production build pass.
- [ ] The README or docs describe how to use the new capability.
- [ ] The next prompt in this roadmap can be run without reworking the previous phase.
