# UI Guidelines

AIR UI v1.0 is frozen.

Do not redesign the dashboard unless a genuine usability defect is discovered.

## Frozen Visual Direction

- Dark navy background.
- Green OOLTool/AIR primary accent.
- Red only for failures.
- Amber only for true warning states.
- Premium enterprise dashboard style.
- Clear card hierarchy.
- Sidebar grouped by product purpose.

## Page Purpose Rule

Every page must answer one question.

| Page | Question |
| --- | --- |
| Overview | Can we release? |
| Release | Why is this the release decision? |
| Business Journeys | Can users complete critical flows? |
| Product Health | Which modules need attention? |
| Module Details | What is happening inside this module? |
| Failed Tests | What failed? |
| Evidence | What proof do we have? |
| AI Insights | What should we do next? |
| Roadmap | Where is AIR going? |

## Interaction Rule

Prefer drill-downs, drawers, modals, and previews over duplicating the same metric across pages.

## Empty State Rule

Never show red missing cards for unavailable data. Use clean empty states and planned/roadmap labels.

## AIR v1.1.1 Platform Polish Rules

AIR v1.1.1 is a consistency sprint only. Do not introduce new product features, change AIR Core behavior, or redesign the frozen dark navy and green visual direction.

## Release Badge Rules

- Use the shared release decision formatter for every release label.
- Supported values are `GO`, `CONDITIONAL_GO` / `CONDITIONAL GO`, and `NO_GO` / `NO GO`.
- Display labels must be `GO`, `CONDITIONAL GO`, and `NO GO`.
- Use one semantic status hook: `data-status="GO"`, `data-status="CONDITIONAL_GO"`, or `data-status="NO_GO"`.
- Badges must wrap safely, remain centered, and avoid hardcoded widths.
- Green is used for `GO`, amber only for `CONDITIONAL GO`, and red only for `NO GO`.

## Tooltip Metadata

Tooltips must read from a metadata layer before falling back to default copy. Current keys include:

| Key | Purpose |
| --- | --- |
| `qualityScore` | Explains how quality is summarized |
| `releaseDecision` | Explains release rule output |
| `risk` | Explains release or module risk |
| `coverage` | Explains execution coverage |
| `recommendation` | Explains recommended action |
| `businessHealth` | Explains journey/module health |
| `evidenceReadiness` | Explains evidence availability |

Future AIR data may override these strings, but the UI should not hardcode one-off tooltip explanations in page markup.

## Standard Empty State Pattern

Empty states should contain exactly three pieces of information:

| Field | Purpose |
| --- | --- |
| Title | What happened |
| Reason | Why the user is seeing this state |
| Next Action | What the user should do next |

Examples:

- No failed tests: Excellent! / No failed tests detected. / Continue release monitoring.
- No history: No historical executions available. / This is the first recorded AIR execution. / Build comparison will appear after multiple executions.
- No evidence: Evidence not available. / No evidence artifacts were generated for this execution. / Enable screenshots, videos, or traces in automation configuration.

## Design Tokens

Use tokens or token aliases before adding new raw values.

| Token | Use |
| --- | --- |
| `success` | Healthy, passed, release-ready states |
| `warning` | Conditional release or attention states |
| `danger` | Failures and blockers only |
| `info` | Neutral informational accents |
| `muted` | Supporting text |
| `panel` | Main card/panel background |
| `border` | Card and section boundaries |

Spacing should follow `xs`, `sm`, `md`, `lg`, and `xl`. Typography should follow `heading`, `body`, `label`, and `metric`.

## Responsive Expectations

- Sidebar must scroll independently when content exceeds viewport height.
- Global search, release badges, module cards, comparison cards, and roadmap cards must not overflow on tablet or mobile.
- Peer cards should use consistent padding, gap, and minimum height.
- Use responsive grid tracks instead of fixed widths.

## AIR v1.1.2 Executive Experience Rules

AIR v1.1.2 is the final v1.1 executive polish sprint. It does not change AIR Core, calculations, engines, or navigation. The goal is faster comprehension for executives, QA leads, managers, and CTOs.

## Executive Reading Flow

The first 30 seconds should answer:

1. Can we release?
2. How confident is AIR?
3. What is the risk?
4. Why did AIR make this recommendation?
5. What action should the team take next?

Use compact decision cards, bullets, and callouts instead of long paragraphs on executive-facing sections.

## Information Hierarchy

Use visual weight intentionally:

| Priority | Content |
| --- | --- |
| Highest | Release decision, quality score, confidence |
| Medium | Business journey, product health, risk |
| Lower | Supporting metrics, detail tables, future roadmap |

If two cards sit together but one affects release approval, make the release-impacting card more prominent through spacing, typography, border weight, or placement. Do not introduce new colors for priority.

## Three-Level Report Structure

AIR should read as three logical layers:

| Layer | Purpose | Pages |
| --- | --- | --- |
| Executive | Release decision and plain-English summary | Cover, Release, Executive Summary |
| Engineering | Investigation and proof | Product Health, Module Details, Failed Tests, Evidence, AI Insights |
| Engineering Intelligence | Trends and platform direction | Historical Intelligence, Roadmap, AIR Platform |

Do not duplicate the same detail on every page. Use the page purpose rule and drill-down patterns.

## Trend Indicator Rules

Historical comparisons may show direction only when AIR data already provides comparison direction.

Allowed labels:

- `↑ Better`
- `↓ Worse`
- `→ Stable`

Do not invent trend deltas. Use the values generated by the History Engine.

## Role-Based AI Reading

AI Insights should group guidance by audience when possible:

- Executive Summary
- Engineering Focus
- QA Focus
- Management Focus

This is presentation only. Do not create new recommendation logic in the UI.
