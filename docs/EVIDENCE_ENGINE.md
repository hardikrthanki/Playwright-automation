# Evidence Engine

The Evidence Engine connects proof to execution data.

## Evidence Types

- Screenshot.
- Video.
- Trace.
- Logs.
- Raw Playwright report.
- Future API request/response.
- Future database validation.
- Future performance data.
- Future security scan.

## Responsibilities

- Attach evidence to tests.
- Attach failure evidence to failed tests.
- Attach module-level evidence summaries.
- Provide safe preview metadata.
- Support missing evidence states.
- Classify screenshots, videos, traces, logs, attachments, and raw reports.
- Build evidence groups by test and module.
- Produce evidence summary counts for future Quality Engine use.

## Current Behavior

The dashboard supports evidence previews inside AIR for images, videos, traces, and raw artifact links when available.

## Current Implementation

Current engine:

- `scripts/air-core/engine/evidence-engine.js`

Compatibility wrapper:

- `scripts/air-core/services/evidence-mapper.js`

## Output Contract

Evidence Engine returns:

- `screenshots[]`
- `videos[]`
- `traces[]`
- `logs[]`
- `attachments[]`
- `rawReports[]`
- `byTest`
- `byModule`
- `summary`

The existing `playwrightReport` field remains for dashboard compatibility, but future AIR code should prefer generic `rawReports[]`.

## Non-Responsibilities

- No release decision logic.
- No quality score logic.
- No UI rendering.
- No framework-specific dashboard behavior.

## Future Requirements

- Correlate evidence by test ID.
- Support direct trace viewer launch.
- Support evidence packages.
- Support side-by-side screenshot comparison.
- Support searchable evidence metadata.
