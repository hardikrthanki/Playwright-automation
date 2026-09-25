# Live Design Screen Map

Captured from https://pios-intelligence-system.hardikrthanki.chatgpt.site/

This guide drives the isolated redesign in `future-pios/design/`.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Marketing + vision + module catalog + workspace preview + AI assistant + knowledge + roadmap |
| `/start-project` | Full interactive Requirement Intelligence workspace |
| `/modules/requirement-intelligence` | Module overview + product preview + capability status |
| `/modules/validation-intelligence` | Same template for validation |
| `/modules/evidence-intelligence` | Evidence module (in development) |
| `/modules/knowledge-intelligence` | Knowledge module |
| `/modules/ai-intelligence` | AI assistant module |
| `/modules/project-intelligence` | Project dashboard module |
| `/modules/collaboration` | Collaboration module |
| `/modules/learning` | Learning module |
| `/modules/administration` | Admin module |
| `/modules/integrations` | Integrations module |

## `/start-project` screens (same URL, staged UI)

### Screen A — Requirement Input
- Project name
- Tabs: Upload documents / Paste requirement
- Dropzone + browse
- Analyze disabled until input exists
- Right rail counters empty: Files 0, Pages —, Requirements —, Business Rules —, Dependencies —
- Left lifecycle: 01 active, later stages locked

### Screen B — AI Understanding (progress)
- Headline: Watch PIOS understand your project
- Progress % + seconds remaining
- Radar / reading animation
- Checklist of pipeline steps
- Right rail counters begin filling
- Lifecycle stages complete one by one

### Screen C — Human Review
- Headline: Project intelligence is ready to review
- KPI cards: Requirements 24, Business Rules 7, Dependencies 19, Questions 11, Risks 5, Validation Areas 6
- Metadata: version, owner, approval, repository locked
- Progress: AI 100%, Human Review 0/6, Repository blocked
- AI Review Queue with findings
- Actions: Accept / Edit / Comment / Reject / Explain
- Connected intelligence links (REQ, dependency, evidence)
- Gap analysis questions
- Dependency path
- Timeline of analysis events
- Repository stays locked until review gates pass

## Redesign mapping

| Live concept | Isolated redesign |
| --- | --- |
| Requirement Intelligence module | RIE product |
| Validation Intelligence module | AIR product |
| Evidence Intelligence module | Shared Evidence platform page |
| Knowledge / AI / Admin / Integrations | Platform pages |
| Project Intelligence module | Project Workspace |
| Knowledge Repository stage | Learn / Reuse (PIOS) |
| Missing Release / Observe | Add RI + OI stages in lifecycle |
| Analyze → counters → review | Keep complete interactive behavior |
