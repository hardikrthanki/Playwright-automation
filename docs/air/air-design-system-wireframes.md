# AIR Design System And Wireframes

Product: Automation Intelligence Reporting  
Version: 1.0  
Purpose: Visual and interaction reference for AIR dashboards

## 1. Design Philosophy

AIR should feel like an enterprise command center: dark, focused, readable, and decision-oriented. The visual system should help stakeholders understand quality status quickly without reading raw automation logs.

## 2. Color Palette

```text
Background:       #070f1f
Panel:            #0f1b33
Card:             #132442
Card Secondary:   #172b4f
Text:             #eaf2ff
Muted Text:       #98a6bd
Border:           #274264
Success Green:    #22c55e
Warning Amber:    #f59e0b
Failure Red:      #ef4444
Info Blue:        #38bdf8
```

## 3. Typography

- Page title: 44px, bold
- Section title: 24px, bold
- Card value: 34px, heavy
- Body text: 18-20px
- Metadata and labels: 12-14px uppercase where useful

## 4. Icons

Current static report uses text labels to avoid external dependencies.

Future UI may use icons for:

- Release status
- Evidence
- Search
- Export
- Recommendations
- Module health
- Defects
- Security
- Performance

## 5. Spacing System

- Page padding: 34px desktop, 22px mobile
- Card gap: 18px
- Panel padding: 24px
- Table cell padding: 14px
- Badge padding: 6px 10px

## 6. Button Styles

Buttons should be used for clear actions:

- Open Playwright report
- Open raw JSON
- Export report
- Open evidence
- Compare run
- Search

Button style:

```text
Background: rgba(56,189,248,.12)
Border: 1px solid rgba(56,189,248,.35)
Radius: 12px
Text: light
```

## 7. Card Styles

Metric cards:

- Gradient background
- 22px radius
- Large value
- Muted label
- Status-colored value

Panel cards:

- Dark translucent background
- 24px radius
- Border
- Soft shadow

## 8. Table Styles

Tables should be compact but readable.

Required behavior:

- Header labels uppercase
- Dark table background
- Row borders
- Status badges
- No hidden failure text

## 9. Chart Styles

Current chart style:

- Vertical bar snapshot
- Status-colored bars
- Compact labels

Future charts:

- Trend line
- Pass/fail stacked chart
- Module health radar
- Coverage heatmap
- Failure aging chart

## 10. Sidebar Navigation

AIR report uses a narrow fixed left sidebar.

Current pages:

```text
01 Cover Dashboard
02 Executive Dashboard
03 Business Health
04 Business Journey
05 Automation Coverage
06 Risk And Recommendations
07 Evidence Center
08 Business Flow Status
09 What We Validated
10 Controlled Or External Flows
11 Coverage Roadmap
12 Detailed Test Results
```

## 11. Top Navigation

The static report does not use a heavy top navigation. Actions are placed inside the relevant Evidence page.

Future app version may include:

- Project selector
- Environment selector
- Build selector
- Search
- Export
- Settings

## 12. Executive Dashboard Wireframe

```text
+------------------------------------------------------------+
| PAGE 02                                    [Release Badge]  |
| Executive Dashboard                                         |
| Release decision, confidence, risk, and product health.     |
+------------------------------------------------------------+
| Product Health | Regression Confidence | Quality Score      |
| Overall Risk   | Automation Stability  | Release            |
+------------------------------------------------------------+
| Executive Summary                                           |
| Evidence / decision text                                    |
+------------------------------------------------------------+
```

## 13. Business Health Wireframe

```text
+------------------------------------------------------------+
| PAGE 03 Business Health                       [Health %]    |
+------------------------------------------------------------+
| Module | Score | Status | Risk | Passed/Total | Failed      |
+------------------------------------------------------------+
```

## 14. Business Journey Wireframe

```text
+------------------------------------------------------------+
| PAGE 04 Business Journey                    [Coverage]      |
+------------------------------------------------------------+
| [Register] [Mobile OTP] [Email Verify] [Login] [Risk]       |
| [Compliance] [Plan] [Payment] [Dashboard]                   |
+------------------------------------------------------------+
```

## 15. Module Dashboard Wireframe

Future module dashboard:

```text
+------------------------------------------------------------+
| Module Name | Health | Risk | Recent Trend                  |
+------------------------------------------------------------+
| Critical flows                                             |
| Failed scenarios                                           |
| Evidence links                                             |
| Recommendations                                            |
+------------------------------------------------------------+
```

## 16. API Dashboard Wireframe

Future API dashboard:

```text
Endpoint health | Status code coverage | Response time | Failures
```

## 17. Database Dashboard Wireframe

Future database dashboard:

```text
Query validation | Data integrity | Migration status | Failed checks
```

## 18. Security Dashboard Wireframe

Future security dashboard:

```text
Auth checks | Injection checks | Session checks | Sensitive data exposure
```

## 19. Performance Dashboard Wireframe

Future performance dashboard:

```text
Page load | API latency | Checkout duration | Slowest flows
```

## 20. Automation Coverage Dashboard

```text
Module | Positive | Negative | Security | Boundary | Status
```

## 21. Defect Dashboard

Future defect dashboard:

```text
Defect ID | Module | Severity | Linked Test | Status | Evidence
```

## 22. Evidence Dashboard

Current evidence page includes:

- Playwright HTML report link
- Raw JSON link
- Export to PDF action

Future evidence page should include searchable artifacts.

## 23. Recommendations Dashboard

Recommendations should be grouped by:

- Critical
- High
- Medium
- Future improvement

## 24. AI Insights Dashboard

Future AI insights should show:

- Summary
- Risk explanation
- Possible root cause
- Suggested next test
- Confidence score

## 25. Release Readiness Dashboard

Release readiness should show:

- GO / CONDITIONAL GO / NO GO
- Rule explanation
- Blocking issues
- Evidence links
- Approval note

## 26. Historical Trends Dashboard

Future dashboard:

- Pass rate trend
- Duration trend
- Failure count trend
- Flaky module trend
- Release score trend

## 27. Settings Page

Future settings page:

- Branding
- Thresholds
- Module mappings
- Evidence paths
- Export options
- Plugin configuration

## 28. Global Search Flow

```text
Open Search -> Enter query -> Filter modules/tests/evidence -> Open result
```

## 29. Compare Builds Flow

```text
Select baseline -> Select current run -> Compare status -> Review changed modules
```

## 30. Export Flow

```text
Open report -> Choose export -> Browser print/PDF -> Send to stakeholder
```

## 31. Mobile Layouts

Mobile behavior:

- Sidebar hidden
- Pages become single column
- Cards stack
- Tables remain scrollable if needed
- Buttons wrap

## 32. Tablet Layouts

Tablet behavior:

- Reduced padding
- Two-column cards where space allows
- Single-column panels

## 33. Component Library

Current components:

- Page
- Sidebar link
- Metric card
- Panel
- Badge
- Table
- Bar chart
- Journey chip
- Validation card
- Risk card
- Action button

## 34. Animation Guidelines

Static report should avoid heavy animation.

Future app may use:

- Subtle hover states
- Smooth page scrolling
- Lightweight chart transitions
- Loading skeletons

## 35. Empty States

When Playwright JSON is missing:

- Report should still open.
- It should show clear instruction to run tests.
- Test table should show an empty-state message.

## 36. Error States

Error states should:

- Explain what went wrong.
- Show affected module or evidence.
- Provide next action.

## 37. Loading States

Future app should show:

- Report loading
- Parsing status
- Evidence loading
- Historical comparison loading

## 38. Presentation Mode

Future presentation mode:

- Hide detailed test table by default
- Show executive pages first
- Keep large typography
- Support full-screen review

## 39. Future Design Concepts

- Interactive drilldown
- Build comparison timeline
- AI assistant panel
- Client-ready PDF templates
- Multi-project command center
