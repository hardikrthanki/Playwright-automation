# Search Engine

The Search Engine makes AIR navigable.

## Search Targets

Search should index:

- Modules.
- Business journeys.
- Tests.
- Failed tests.
- Evidence.
- Quality explanations.
- Release reasons.
- Recommendations.
- Roadmap items.
- History.

## Current Behavior

The Search Engine is implemented in:

- `scripts/air-core/engine/search-engine.js`

The previous service path remains as a compatibility wrapper:

- `scripts/air-core/services/search-index.js`

The current dashboard reads `searchIndex[]` from `air-results.json` and closes search UI on selection, Escape, or outside click.

## Output Contract

```json
{
  "searchIndex": [
    {
      "id": "module-authentication",
      "type": "module",
      "title": "Authentication",
      "target": "#module-dashboard-authentication",
      "status": "Healthy",
      "module": "Authentication",
      "priority": "Low",
      "category": "",
      "keywords": ["module", "health", "coverage"],
      "text": "module Authentication Healthy Authentication Low 12 tests 12 passed 0 failed 100% health"
    }
  ]
}
```

## Current Indexed Areas

- Release decision.
- Quality score and explanations.
- Modules.
- Business journeys.
- Passed/skipped tests.
- Failed tests.
- Evidence.
- Recommendations.
- Future validation / roadmap.
- History snapshots.

Failed tests are indexed through `failedTests[]` so they are not duplicated from the full `tests[]` collection.

## Future Requirements

- Build index from `air-results.json`.
- Rank exact matches above partial matches.
- Highlight matching text.
- Support keyboard navigation.
- Support result categories.
- Keep search independent from UI.

## Example

Searching `login` should locate:

- Authentication module.
- Login-related tests.
- Related evidence.
- Recommendations.
- Future API validation placeholders.
