# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardCoverageDepth.spec.ts >> Deeper dashboard controls >> Company Finance switches statements and period, then resets
- Location: tests\DashboardCoverageDepth.spec.ts:196:9

# Error details

```
TimeoutError: locator.click: Timeout 8000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^search$/i })
    - locator resolved to <button disabled type="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    15 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "OolTool" [ref=e7] [cursor=pointer]:
          - /url: /dashboard
          - img "OolTool" [ref=e8]
        - navigation [ref=e10]:
          - link "Dashboard" [ref=e11] [cursor=pointer]:
            - /url: /dashboard
          - link "Opportunities" [ref=e12] [cursor=pointer]:
            - /url: /dashboard/opportunities
          - button "Portfolio" [ref=e14]:
            - generic [ref=e15]: Portfolio
            - img [ref=e16]
          - button "Research" [ref=e19]:
            - generic [ref=e20]: Research
            - img [ref=e21]
          - link "Academy" [ref=e23] [cursor=pointer]:
            - /url: /academy
          - link "Support" [ref=e24] [cursor=pointer]:
            - /url: /dashboard/support
        - generic [ref=e25]:
          - button "Sync all" [ref=e26] [cursor=pointer]:
            - img
            - generic [ref=e27]: Sync all
          - button "Add options" [ref=e28] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e29] [cursor=pointer]:
            - img [ref=e30]
            - generic [ref=e33]: "17"
          - button "Enter fullscreen" [ref=e34] [cursor=pointer]:
            - img
          - button "Switch to dark theme" [ref=e35] [cursor=pointer]:
            - img
          - button "HT" [ref=e36] [cursor=pointer]:
            - generic [ref=e38]: HT
    - main [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - heading "Company Finance" [level=1] [ref=e42]
          - paragraph [ref=e43]: Search a symbol to review income statements, balance sheets, cash flow, and key financial ratios.
        - generic [ref=e45]:
          - generic [ref=e47]:
            - generic [ref=e48]: Symbol
            - generic [ref=e49]:
              - img
              - combobox "Search symbol (e.g. AAPL)" [disabled] [ref=e50]: AAPL - Apple Inc.
              - button "Clear Symbol" [disabled] [ref=e51]:
                - img [ref=e52]
          - generic [ref=e55]:
            - button "Search" [disabled]:
              - img
              - generic: Search
            - button "Reset" [disabled]:
              - img
              - generic: Reset
    - contentinfo [ref=e69]:
      - generic [ref=e70]:
        - generic [ref=e71]:
          - paragraph [ref=e72]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e73]:
            - link "Privacy Policy" [ref=e75] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e76]:
              - generic [ref=e77]: ·
              - link "Terms of Service" [ref=e78] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e79]:
              - generic [ref=e80]: ·
              - link "Disclosures" [ref=e81] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e82]:
              - generic [ref=e83]: ·
              - link "Risk Warning" [ref=e84] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e85]:
              - generic [ref=e86]: ·
              - link "Contact" [ref=e87] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e88]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e89]: Company Finance | OolTool
```

# Test source

```ts
  1  | import { Locator } from '@playwright/test';
  2  | 
  3  | import {
  4  |   dismissOverlays
  5  | } from './dismissOverlays';
  6  | import {
  7  |   watchDelayMs
  8  | } from '../config/watchMode';
  9  | 
  10 | /* =============================================================================
  11 | HELPER: safeClick
  12 | 
  13 | PURPOSE
  14 | -------
  15 | Waits for a locator to become visible, scrolls it into view, then clicks it.
  16 | Overlays are dismissed first. Real clicks are used so cookie/announcement
  17 | layers cannot swallow Create Account, Sign up, profile, or Plans actions.
  18 | ============================================================================= */
  19 | 
  20 | export async function safeClick(
  21 |   locator: Locator,
  22 |   label: string
  23 | ) {
  24 |   console.log(`[CLICK] ${label}`);
  25 | 
  26 |   const page =
  27 |     locator.page();
  28 | 
  29 |   await dismissOverlays(
  30 |     page
  31 |   );
  32 | 
  33 |   await locator.waitFor({
  34 |     state: 'visible',
  35 |     timeout: 15000,
  36 |   });
  37 | 
  38 |   await locator.scrollIntoViewIfNeeded({
  39 |     timeout: 5000,
  40 |   }).catch(
  41 |     () => undefined
  42 |   );
  43 | 
  44 |   try {
  45 |     await locator.click({
  46 |       timeout: 8000,
  47 |     });
  48 |   } catch {
  49 |     await dismissOverlays(
  50 |       page
  51 |     );
  52 | 
  53 |     await locator.scrollIntoViewIfNeeded({
  54 |       timeout: 5000,
  55 |     }).catch(
  56 |       () => undefined
  57 |     );
  58 | 
> 59 |     await locator.click({
     |                   ^ TimeoutError: locator.click: Timeout 8000ms exceeded.
  60 |       timeout: 8000,
  61 |     });
  62 |   }
  63 | 
  64 |   const watchDelay =
  65 |     watchDelayMs();
  66 | 
  67 |   if (watchDelay > 0) {
  68 |     await locator.page().waitForTimeout(
  69 |       watchDelay
  70 |     );
  71 |   }
  72 | }
  73 | 
```