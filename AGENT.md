# Agent Instructions

## Roadmap tracking

- Treat `docs/cardboardit-parity-roadmap.md` as the source of truth for planned CardBoard-style feature work.
- When completing any roadmap task, update the matching checklist item in `docs/cardboardit-parity-roadmap.md` from `[ ]` to `[x]`.
- When a phase is fully complete, update its `Status` line from `[ ] Not started` to `[x] Complete`.
- If a phase is partially complete, update its `Status` line to `[ ] In progress`.
- Mark acceptance-test checklist items only after the behavior has been implemented and verified.
- Mark completion-checklist items only after the corresponding check, build, or documentation update has been completed.
- Keep roadmap updates in the same change set as the implementation whenever practical.
- Do not mark future milestones complete based only on planned work or partial scaffolding.

## Verification expectations

- For each feature slice, run the checks listed in the roadmap phase when practical.
- If a listed check cannot be run, leave its checklist item unchecked and note the reason in the final response.
- Preserve existing local-first behavior and migration expectations called out in the roadmap.
