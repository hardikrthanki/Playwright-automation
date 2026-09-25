# Future PIOS Structure (Isolated)

This folder is a **future architecture scaffold** for PIOS.

It is intentionally **separate** from the current working AIR / Playwright project.

## Rules

1. Do **not** import this folder from `scripts/air-core`, `config/`, or `execution-report/`.
2. Do **not** change current AIR behavior from files in this folder.
3. Current AIR continues to work as today (including its existing release-decision output).
4. When implementation begins later, migrate from this scaffold into real products **incrementally**.
5. Existing docs under `docs/` remain the current repository source of truth until a migration is explicitly started.

## Canonical naming (locked)

| Name | Canonical term |
| --- | --- |
| PIOS | **Product Intelligence Operating System** |
| AIR | **Automation Intelligence Report** |
| RIE | Requirements Intelligence Engine |
| RI | Release Intelligence |
| OI | Operational Intelligence |

## Locked product questions

| Product | Question |
| --- | --- |
| RIE | Are we building the right thing? |
| AIR | Did we validate the right thing correctly? |
| RI | Can we safely release it? |
| OI | What happened after release? |

## Folder map

```text
future-pios/
├── README.md                          ← you are here
├── IMPLEMENTATION_SEQUENCE.md         ← ordered future work
├── architecture/
│   ├── OVERVIEW.md
│   ├── PRODUCT_BOUNDARIES.md
│   └── NAMING.md
├── contracts/
│   ├── AIR_TO_RI.md
│   ├── VALIDATION_READINESS.md
│   ├── EVIDENCE_OWNERSHIP.md
│   └── TRACEABILITY.md
├── products/
│   ├── rie/
│   ├── air/                           ← future AIR alignment notes only
│   ├── ri/
│   └── oi/
├── platform/
│   ├── identity.md
│   ├── evidence.md
│   ├── knowledge.md
│   └── project-overview.md
├── demos/
│   ├── onboarding-traceability.md
│   └── stable-ids.example.json
├── schemas/
│   ├── validation-readiness.schema.json
│   └── entity-ids.schema.json
└── stubs/                             ← empty future code homes
    ├── platform/
    ├── rie/
    ├── ri/
    └── oi/
```

## Current vs future

| Area | Current project | This folder |
| --- | --- | --- |
| AIR Core | Live under `scripts/air-core/` | Not modified |
| AIR report | Live under `execution-report/` | Not modified |
| Release engine | Still emits GO / CONDITIONAL GO / NO GO | Future contract defines Validation Readiness |
| RIE / RI / OI | Specs in `docs/` | Scaffold + contracts prepared here |
| Stable IDs | Not required for current AIR runs | Example IDs prepared under `demos/` |

## When to use this folder

Use it to design, review, and prepare PIOS before touching production AIR code.

Do not wire it into npm scripts or the current report pipeline yet.
