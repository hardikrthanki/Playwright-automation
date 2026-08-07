# ADR-005: Evidence-First Intelligence

## Status

Accepted

## Context

The platform will use intelligence and AI-style recommendations. Without discipline, the system could present unsupported conclusions as facts.

## Decision

The ecosystem follows this principle:

```text
Evidence before Intelligence.
Intelligence before Automation.
Automation before Visualization.
```

Insights must be traceable to evidence, relationships, validated mappings, or clearly marked assumptions.

## Consequences

- Major conclusions must explain supporting data.
- AI recommendations must include source and confidence where possible.
- Fallback text must not be presented as confirmed cause.
- Visualization is the final expression of evidence-backed intelligence, not the source of truth.

