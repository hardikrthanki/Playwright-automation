# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> User C yearly cancel and refund
- Location: tests\SubscriptionLifecycleExecution.spec.ts:158:9

# Error details

```
TimeoutError: locator.click: Timeout 8000ms exceeded.
Call log:
  - waiting for getByRole('dialog').filter({ hasText: /cancel/i }).first().getByRole('button', { name: /keep my plan/i })

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
          - button "Enter fullscreen" [ref=e33] [cursor=pointer]:
            - img
          - button "Switch to dark theme" [ref=e34] [cursor=pointer]:
            - img
          - button "HT" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: HT
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Billing & Subscription" [level=1] [ref=e41]
          - paragraph [ref=e42]: Manage your plan, payment methods, and billing history.
        - generic [ref=e43]:
          - tablist [ref=e44]:
            - tab "Overview" [ref=e45] [cursor=pointer]: Overview
            - tab "Plans" [selected] [ref=e46] [cursor=pointer]: Plans
            - tab "History" [ref=e47] [cursor=pointer]: History
          - tabpanel "Plans" [ref=e48]:
            - generic [ref=e49]:
              - generic [ref=e51]:
                - img [ref=e52]
                - text: Change Plan
              - generic [ref=e57]:
                - generic [ref=e58]:
                  - generic [ref=e59]:
                    - generic [ref=e60]:
                      - paragraph [ref=e62]: Curious
                      - paragraph [ref=e63]: Explore your Portfolio
                      - paragraph [ref=e64]: Free
                    - list [ref=e65]:
                      - listitem [ref=e66]:
                        - img [ref=e67]
                        - text: Manual Upload Only
                      - listitem [ref=e69]:
                        - img [ref=e70]
                        - text: Positions (10)
                      - listitem [ref=e72]:
                        - img [ref=e73]
                        - text: Simulations (10)
                      - listitem [ref=e75]:
                        - img [ref=e76]
                        - text: CTAs Refresh
                      - listitem [ref=e78]:
                        - img [ref=e79]
                        - text: Covered Calls
                      - listitem [ref=e81]:
                        - img [ref=e82]
                        - text: OOLS Score
                    - button "Switch to Free" [ref=e84] [cursor=pointer]:
                      - img
                      - text: Switch to Free
                  - generic [ref=e85]:
                    - generic [ref=e86]:
                      - paragraph [ref=e88]: Income
                      - paragraph [ref=e89]: Build your Portfolio
                      - paragraph [ref=e90]: $290/year
                    - list [ref=e91]:
                      - listitem [ref=e92]:
                        - img [ref=e93]
                        - text: Broker Integration (1)
                      - listitem [ref=e95]:
                        - img [ref=e96]
                        - text: Account Linked (1)
                      - listitem [ref=e98]:
                        - img [ref=e99]
                        - text: Positions (100)
                      - listitem [ref=e101]:
                        - img [ref=e102]
                        - text: CTAs Unlimited
                      - listitem [ref=e104]:
                        - img [ref=e105]
                        - text: Simulations Unlimited
                      - listitem [ref=e107]:
                        - img [ref=e108]
                        - text: Covered Calls/Puts CTAs
                      - listitem [ref=e110]:
                        - img [ref=e111]
                        - text: Earnings Notifications
                      - listitem [ref=e113]:
                        - img [ref=e114]
                        - text: Dividend Notifications
                      - listitem [ref=e116]:
                        - img [ref=e117]
                        - text: OOLS Score
                    - button "Downgrade" [ref=e119] [cursor=pointer]:
                      - img
                      - text: Downgrade
                  - generic [ref=e120]:
                    - generic [ref=e121]:
                      - paragraph [ref=e123]: Overlay Strategists
                      - paragraph [ref=e124]: Optimize your Portfolio
                      - paragraph [ref=e125]: $790/year
                    - list [ref=e126]:
                      - listitem [ref=e127]:
                        - img [ref=e128]
                        - text: Broker Integration (5)
                      - listitem [ref=e130]:
                        - img [ref=e131]
                        - text: Account Linked (10)
                      - listitem [ref=e133]:
                        - img [ref=e134]
                        - text: Positions (500)
                      - listitem [ref=e136]:
                        - img [ref=e137]
                        - text: CTAs & Simulations Unlimited
                      - listitem [ref=e139]:
                        - img [ref=e140]
                        - text: Covered Calls/Puts CTAs
                      - listitem [ref=e142]:
                        - img [ref=e143]
                        - text: Earnings & Dividends Notifications
                      - listitem [ref=e145]:
                        - img [ref=e146]
                        - text: ITM/ATM resolve suggestions
                      - listitem [ref=e148]:
                        - img [ref=e149]
                        - text: Portfolio Analytics
                      - listitem [ref=e151]:
                        - img [ref=e152]
                        - text: Bulk Portfolio Load
                      - listitem [ref=e154]:
                        - img [ref=e155]
                        - text: OOLS Score
                    - button "Keep my plan" [ref=e157] [cursor=pointer]:
                      - img
                      - text: Keep my plan
                  - generic [ref=e158]:
                    - generic [ref=e159]:
                      - paragraph [ref=e161]: Portfolio Hedger
                      - paragraph [ref=e162]: Optimize your Portfolio
                      - paragraph [ref=e163]: $1490/year
                    - list [ref=e164]:
                      - listitem [ref=e165]:
                        - img [ref=e166]
                        - text: Broker Integration (10)
                      - listitem [ref=e168]:
                        - img [ref=e169]
                        - text: Account Linked (20)
                      - listitem [ref=e171]:
                        - img [ref=e172]
                        - text: Positions (1000)
                      - listitem [ref=e174]:
                        - img [ref=e175]
                        - text: CTAs & Simulations Unlimited
                      - listitem [ref=e177]:
                        - img [ref=e178]
                        - text: Covered Calls/Puts CTAs
                      - listitem [ref=e180]:
                        - img [ref=e181]
                        - text: Protective Puts
                      - listitem [ref=e183]:
                        - img [ref=e184]
                        - text: Option roll suggestions
                      - listitem [ref=e186]:
                        - img [ref=e187]
                        - text: Earnings & Dividends Notifications
                      - listitem [ref=e189]:
                        - img [ref=e190]
                        - text: ITM/ATM resolve suggestions
                      - listitem [ref=e192]:
                        - img [ref=e193]
                        - text: Portfolio Analytics
                      - listitem [ref=e195]:
                        - img [ref=e196]
                        - text: Bulk Portfolio Load
                      - listitem [ref=e198]:
                        - img [ref=e199]
                        - text: OOLS Score
                    - button "Upgrade" [ref=e201] [cursor=pointer]:
                      - img
                      - text: Upgrade
                - paragraph [ref=e202]: Upgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then.
    - contentinfo [ref=e203]:
      - generic [ref=e204]:
        - generic [ref=e205]:
          - paragraph [ref=e206]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e207]:
            - link "Privacy Policy" [ref=e209] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e210]:
              - generic [ref=e211]: ·
              - link "Terms of Service" [ref=e212] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e213]:
              - generic [ref=e214]: ·
              - link "Disclosures" [ref=e215] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e216]:
              - generic [ref=e217]: ·
              - link "Risk Warning" [ref=e218] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e219]:
              - generic [ref=e220]: ·
              - link "Contact" [ref=e221] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e222]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e223]
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
  33 |   try {
  34 |     await locator.waitFor({
  35 |       state: 'visible',
  36 |       timeout: 15000,
  37 |     });
  38 |   } catch {
  39 |     // A survey or cookie layer often appears a moment after the first
  40 |     // dismiss during a long run. Clear it and wait for the target again.
  41 |     await dismissOverlays(
  42 |       page
  43 |     );
  44 | 
  45 |     await locator.waitFor({
  46 |       state: 'visible',
  47 |       timeout: 15000,
  48 |     });
  49 |   }
  50 | 
  51 |   await locator.scrollIntoViewIfNeeded({
  52 |     timeout: 5000,
  53 |   }).catch(
  54 |     () => undefined
  55 |   );
  56 | 
  57 |   try {
  58 |     await locator.click({
  59 |       timeout: 8000,
  60 |     });
  61 |   } catch {
  62 |     await dismissOverlays(
  63 |       page
  64 |     );
  65 | 
  66 |     await locator.scrollIntoViewIfNeeded({
  67 |       timeout: 5000,
  68 |     }).catch(
  69 |       () => undefined
  70 |     );
  71 | 
> 72 |     await locator.click({
     |                   ^ TimeoutError: locator.click: Timeout 8000ms exceeded.
  73 |       timeout: 8000,
  74 |     });
  75 |   }
  76 | 
  77 |   const watchDelay =
  78 |     watchDelayMs();
  79 | 
  80 |   if (watchDelay > 0) {
  81 |     await locator.page().waitForTimeout(
  82 |       watchDelay
  83 |     );
  84 |   }
  85 | }
  86 | 
```