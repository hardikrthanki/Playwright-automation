# Contributing

Contributions should preserve AIR's product direction and architecture.

## Before Making Changes

Ask:

1. Does this solve a real user problem?
2. Does this reduce investigation time?
3. Does this duplicate existing information?
4. Is this reusable across projects?
5. Would a manager, QA engineer, or developer immediately understand it?

## Development Workflow

1. Read relevant documentation.
2. Keep changes scoped.
3. Prefer config over hardcoding.
4. Keep UI separate from engine logic.
5. Run typecheck.
6. Regenerate AIR output when report logic changes.

## Commands

```powershell
npm run typecheck
npm run report:execution
npm run report:execution:pdf
```

## Pull Request Expectations

- Explain the user problem.
- Mention changed files.
- Mention validation performed.
- Update docs when architecture changes.

