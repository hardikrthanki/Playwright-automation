# AIR — Future Alignment Notes

Current live AIR stays under:

- `scripts/air-core/`
- `execution-report/`
- `config/air.*.json`

This folder only records **future** alignment. It must not be imported by current AIR.

## Today

AIR emits release-style decisions: `GO | CONDITIONAL GO | NO GO`.

## Future

AIR emits validation readiness: `SUFFICIENT | CONDITIONAL | INSUFFICIENT`.

See:

- `../../contracts/VALIDATION_READINESS.md`
- `../../contracts/AIR_TO_RI.md`

## Preserve

- Framework-independent engines
- Playwright as first adapter
- Normalized `air-results.json`
- Engine orchestrator pattern

## Do not do from here

- Rewrite AIR Core
- Wire these notes into npm scripts
- Change live report labels yet
