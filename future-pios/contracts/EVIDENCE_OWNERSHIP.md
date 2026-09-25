# Evidence Ownership (Future)

## Rule

> AIR owns validation evidence as a domain concept.
> PIOS owns evidence identity, lineage, relationships, storage/reference infrastructure, and cross-product access.

## Split

```text
PIOS
 └── Evidence Infrastructure
      ├── Evidence ID
      ├── metadata
      ├── lineage
      ├── relationships
      └── access

AIR
 └── Validation Evidence
      ├── screenshots
      ├── traces
      ├── videos
      ├── logs
      ├── API results
      └── DB validation
```

## Consumers

- RIE may reference requirement/source evidence
- RI may reference validation evidence for readiness
- OI may reference production evidence

No product should invent a second evidence identity model.
