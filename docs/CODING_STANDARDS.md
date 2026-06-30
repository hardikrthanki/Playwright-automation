# Coding Standards

## General

- Keep changes scoped.
- Prefer readable code over clever code.
- Use configuration for project-specific mapping.
- Avoid duplicating calculation logic.
- Do not hardcode Playwright behavior into dashboard rendering.

## AIR Rules

- Dashboard reads AIR model.
- Parser translates raw framework output.
- Engines calculate decisions.
- Each engine must be independently testable and replaceable.
- Each engine should enrich only its own part of the AIR model.
- Engines must not depend on Playwright-specific structures.
- Engines must not depend on dashboard rendering code.
- UI presents results.
- Missing data is shown honestly.

## TypeScript / JavaScript

- Use clear function names.
- Keep helpers focused.
- Validate inputs before calculating.
- Escape user/result text before rendering HTML.
- Keep generated HTML interactions accessible.

## Tests

- Add tests when behavior risk is high.
- Existing Playwright tests should stay readable and page-object based.
- Avoid brittle selectors where stable semantic selectors are available.

## Documentation

Update docs when adding:

- New AIR model fields.
- New engine behavior.
- New config files.
- New commands.
- New export behavior.
