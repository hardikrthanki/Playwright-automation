# Product Boundaries (Future)

## Ownership

| Product | Owns | Does not own |
| --- | --- | --- |
| PIOS | Identity, orgs, projects, roles, shared IDs, relationships, evidence infrastructure, knowledge infrastructure, AI access, audit, integrations | Requirement meaning, execution analysis, release governance |
| RIE | Requirements, AC, business rules, dependencies, requirement risks, coverage planning | Test execution, release decisions |
| AIR | Executions, results, failures, validation evidence, quality signals, validation readiness | Requirement authoring, governed GO/NO-GO |
| RI | Releases, gates, approvals, release risks, GO / CONDITIONAL GO / NO-GO | Requirement edits, execution mutation |
| OI | Production outcomes, incidents, operational signals | Pre-release validation ownership |

## Risk ownership

| Kind | Owner |
| --- | --- |
| Requirement Risk | RIE |
| Validation Risk / Quality Signals | AIR |
| Release Risk | RI |

## Rule

Products may reference another product's data through shared IDs.

Products must not modify another product's domain data.
