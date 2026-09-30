# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> User D monthly retention offer decline then schedule downgrade
- Location: tests\SubscriptionLifecycleExecution.spec.ts:163:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /decline|no thanks|continue (to )?downgrade|skip offer|don'?t (want|keep)|switch plans anyway/i }).or(getByRole('radio', { name: /decline|no thanks|continue (to )?downgrade|skip offer|don'?t (want|keep)|switch plans anyway/i })).or(getByRole('link', { name: /decline|no thanks|continue (to )?downgrade|skip offer|don'?t (want|keep)|switch plans anyway/i })).or(locator('label, button, a, [role="radio"], [role="option"]').filter({ hasText: /decline|no thanks|continue (to )?downgrade|skip offer|don'?t (want|keep)|switch plans anyway/i })).first() to be visible

```

# Page snapshot

```yaml
- generic:
  - generic:
    - banner:
      - generic:
        - generic:
          - generic:
            - link:
              - /url: /dashboard
              - img
          - generic:
            - navigation:
              - link:
                - /url: /dashboard
                - text: Dashboard
              - link:
                - /url: /dashboard/opportunities
                - text: Opportunities
              - generic:
                - button:
                  - generic: Portfolio
                  - img
              - generic:
                - button:
                  - generic: Research
                  - img
              - link:
                - /url: /academy
                - text: Academy
              - link:
                - /url: /dashboard/support
                - text: Support
          - generic:
            - button:
              - img
              - generic: Sync all
            - button:
              - img
            - button:
              - img
            - button:
              - img
            - button:
              - img
            - button:
              - generic:
                - generic: HT
    - main:
      - generic:
        - generic:
          - heading [level=1]: Billing & Subscription
          - paragraph: Manage your plan, payment methods, and billing history.
        - generic:
          - tablist:
            - tab: Overview
            - tab [selected]: Plans
            - tab: History
          - tabpanel:
            - generic:
              - generic:
                - generic:
                  - img
                  - text: Change Plan
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Curious
                      - paragraph: Explore your Portfolio
                      - paragraph: Free
                    - list:
                      - listitem:
                        - img
                        - text: Manual Upload Only
                      - listitem:
                        - img
                        - text: Positions (10)
                      - listitem:
                        - img
                        - text: Simulations (10)
                      - listitem:
                        - img
                        - text: CTAs Refresh
                      - listitem:
                        - img
                        - text: Covered Calls
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Switch to Free
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Income
                      - paragraph: Build your Portfolio
                      - paragraph: $29/month
                    - list:
                      - listitem:
                        - img
                        - text: Broker Integration (1)
                      - listitem:
                        - img
                        - text: Account Linked (1)
                      - listitem:
                        - img
                        - text: Positions (100)
                      - listitem:
                        - img
                        - text: CTAs Unlimited
                      - listitem:
                        - img
                        - text: Simulations Unlimited
                      - listitem:
                        - img
                        - text: Covered Calls/Puts CTAs
                      - listitem:
                        - img
                        - text: Earnings Notifications
                      - listitem:
                        - img
                        - text: Dividend Notifications
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Downgrade
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Overlay Strategists
                      - paragraph: Optimize your Portfolio
                      - paragraph: $79/month
                    - list:
                      - listitem:
                        - img
                        - text: Broker Integration (5)
                      - listitem:
                        - img
                        - text: Account Linked (10)
                      - listitem:
                        - img
                        - text: Positions (500)
                      - listitem:
                        - img
                        - text: CTAs & Simulations Unlimited
                      - listitem:
                        - img
                        - text: Covered Calls/Puts CTAs
                      - listitem:
                        - img
                        - text: Earnings & Dividends Notifications
                      - listitem:
                        - img
                        - text: ITM/ATM resolve suggestions
                      - listitem:
                        - img
                        - text: Portfolio Analytics
                      - listitem:
                        - img
                        - text: Bulk Portfolio Load
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button [disabled]:
                      - img
                      - text: Current plan
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Portfolio Hedger
                      - paragraph: Optimize your Portfolio
                      - paragraph: $149/month
                    - list:
                      - listitem:
                        - img
                        - text: Broker Integration (10)
                      - listitem:
                        - img
                        - text: Account Linked (20)
                      - listitem:
                        - img
                        - text: Positions (1000)
                      - listitem:
                        - img
                        - text: CTAs & Simulations Unlimited
                      - listitem:
                        - img
                        - text: Covered Calls/Puts CTAs
                      - listitem:
                        - img
                        - text: Protective Puts
                      - listitem:
                        - img
                        - text: Option roll suggestions
                      - listitem:
                        - img
                        - text: Earnings & Dividends Notifications
                      - listitem:
                        - img
                        - text: ITM/ATM resolve suggestions
                      - listitem:
                        - img
                        - text: Portfolio Analytics
                      - listitem:
                        - img
                        - text: Bulk Portfolio Load
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Upgrade
                - paragraph: Upgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then.
        - generic:
          - generic:
            - generic: Danger Zone
            - generic: Cancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.
          - generic:
            - button: Cancel Subscription
    - contentinfo:
      - generic:
        - generic:
          - paragraph: © 2026 Ools Inc. All rights reserved.
          - navigation:
            - generic:
              - link:
                - /url: /privacy-policy
                - text: Privacy Policy
            - generic:
              - generic: ·
              - link:
                - /url: /terms-of-services
                - text: Terms of Service
            - generic:
              - generic: ·
              - link:
                - /url: /disclosures
                - text: Disclosures
            - generic:
              - generic: ·
              - link:
                - /url: /risk-warning
                - text: Risk Warning
            - generic:
              - generic: ·
              - link:
                - /url: /contact
                - text: Contact
        - paragraph: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert
  - dialog "Downgrade to Income?" [ref=e2]:
    - generic [ref=e3]:
      - heading "Downgrade to Income?" [level=2] [ref=e4]:
        - img [ref=e5]
        - text: Downgrade to Income?
      - paragraph [ref=e8]:
        - text: Your current plan stays active until the end of this billing period. The downgrade takes effect on
        - strong [ref=e9]: October 30, 2026
        - text: "- no refund or credit is issued."
    - generic [ref=e10]:
      - paragraph [ref=e11]: Stay and save 20%
      - paragraph [ref=e12]: Keep your current plan and get 20% off your next 3 monthly bills. One-time offer.
      - button "Apply 20% discount & stay" [active] [ref=e13] [cursor=pointer]
    - generic [ref=e14]:
      - paragraph [ref=e15]: What changes on Income
      - paragraph [ref=e16]: "Features you'll lose:"
      - list [ref=e17]:
        - listitem [ref=e18]: CTAs & Simulations Unlimited
        - listitem [ref=e19]: Earnings & Dividends Notifications
        - listitem [ref=e20]: ITM/ATM resolve suggestions
        - listitem [ref=e21]: Portfolio Analytics
        - listitem [ref=e22]: Bulk Portfolio Load
      - paragraph [ref=e23]: "New plan limits:"
      - list [ref=e24]:
        - listitem [ref=e25]: "Broker connections: up to 1 (you currently use 0)"
        - listitem [ref=e26]: "Linked accounts: up to 1 (you currently use 0)"
        - listitem [ref=e27]: "Positions: up to 100 (you currently use 0)"
    - generic [ref=e28]:
      - button "Keep my plan" [ref=e29] [cursor=pointer]
      - button "Schedule downgrade" [ref=e30] [cursor=pointer]
    - button "Close" [ref=e31]:
      - img [ref=e32]
      - generic [ref=e35]: Close
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
> 33 |   await locator.waitFor({
     |                 ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
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
  59 |     await locator.click({
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