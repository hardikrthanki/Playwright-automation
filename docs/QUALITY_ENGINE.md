# Quality Engine

The Quality Engine calculates the quality score, confidence, grade, and explanation.

## Inputs

- Pass rate.
- Coverage.
- Critical flow health.
- Business journey health.
- Module risk.
- Execution stability.
- Failure severity.

## Outputs

- Quality score.
- Quality grade.
- Confidence.
- Calculation factors.
- Plain-English explanation.

## Current Behavior

The current report displays quality score from the normalized AIR summary and provides a score explainer modal. AIR Core now also writes a full `quality` object to `air-results.json`.

Current engine:

- `scripts/air-core/engine/quality-engine.js`

Compatibility wrapper:

- `scripts/air-core/services/quality-score.js`

## Future Requirements

- Make all factor weights configurable.
- Support project-specific thresholds.
- Explain every score transparently.
- Avoid hidden or magic calculations.

## Configuration Rule

The Quality Engine must not hardcode its scoring formula.

These values must come from configuration:

- Scoring factors.
- Factor weights.
- Thresholds.
- Grade boundaries.

Current config:

- `config/air.thresholds.json`

## Output Contract

Quality Engine returns:

- `score`
- `confidence`
- `grade`
- `factors`
- `weights`
- `explanation`

## Example Factors

| Factor | Example Weight |
| --- | --- |
| Pass Rate | 35% |
| Critical Journey Health | 25% |
| Module Health | 20% |
| Evidence Completeness | 10% |
| Stability | 10% |
