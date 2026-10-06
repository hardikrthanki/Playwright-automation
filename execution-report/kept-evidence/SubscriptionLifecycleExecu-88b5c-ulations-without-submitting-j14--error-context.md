# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Prepared paid user can preview downgrade calculations without submitting
- Location: tests\SubscriptionLifecycleExecution.spec.ts:139:9

# Error details

```
TimeoutError: locator.click: Timeout 8000ms exceeded.
Call log:
  - waiting for locator('p, h2, h3, h4, span').filter({ hasText: /^\s*(?:Income Builder|Income)\s*$/i }).first().locator('xpath=ancestor::*[.//button][1]').getByRole('button', { name: /downgrade/i }).first()

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
            - button: Delayed
            - button:
              - img
              - generic: Sync all
            - button:
              - img
            - button:
              - img
              - generic: "18"
            - button:
              - generic:
                - generic: QU
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
            - note:
              - generic:
                - generic:
                  - img
                - generic: Founding Team's Beta Pricing
              - generic:
                - paragraph: Save while helping us build OolTool — Beta pricing for the first 1,000 users.
                - paragraph: "Note: OolTool is iteratively adding new features, new brokers and additional symbols."
            - generic:
              - generic:
                - generic:
                  - img
                  - text: Change Plan
                - generic:
                  - button: Monthly
                  - button: Annual
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Curious
                      - paragraph: Explore your Portfolio
                      - generic:
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
                      - generic:
                        - generic:
                          - paragraph:
                            - generic: Was
                            - text: $29/month
                          - generic:
                            - paragraph:
                              - generic: Now
                              - generic: $2.90
                              - generic: /month
                            - generic: Beta
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
                      - generic:
                        - generic:
                          - paragraph:
                            - generic: Was
                            - text: $79/month
                          - generic:
                            - paragraph:
                              - generic: Now
                              - generic: $7.90
                              - generic: /month
                            - generic: Beta
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
                      - generic:
                        - generic:
                          - paragraph:
                            - generic: Was
                            - text: $149/month
                          - generic:
                            - paragraph:
                              - generic: Now
                              - generic: $14.90
                              - generic: /month
                            - generic: Beta
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
        - strong [ref=e9]: October 25, 2026
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
        - listitem [ref=e25]: "Broker connections: up to 1 (you currently use 1)"
        - listitem [ref=e26]: "Linked accounts: up to 1 (you currently use 1)"
        - listitem [ref=e27]: "Positions: up to 100 (you currently use 15)"
    - generic [ref=e28]:
      - button "Keep my plan" [ref=e29] [cursor=pointer]
      - button "Schedule downgrade" [ref=e30] [cursor=pointer]
    - button "Close" [ref=e31]:
      - img [ref=e32]
      - generic [ref=e35]: Close
```

# Test source

```ts
  1   | import {
  2   |   Locator,
  3   |   Page
  4   | } from '@playwright/test';
  5   | 
  6   | import {
  7   |   dismissOverlays
  8   | } from './dismissOverlays';
  9   | import {
  10  |   watchDelayMs
  11  | } from '../config/watchMode';
  12  | 
  13  | /* =============================================================================
  14  | HELPER: safeClick
  15  | 
  16  | PURPOSE
  17  | -------
  18  | Waits for a locator to become visible, scrolls it into view, then clicks it.
  19  | Overlays are dismissed first. Real clicks are used so cookie/announcement
  20  | layers cannot swallow Create Account, Sign up, profile, or Plans actions.
  21  | ============================================================================= */
  22  | 
  23  | export async function safeClick(
  24  |   locator: Locator,
  25  |   label: string
  26  | ) {
  27  |   console.log(`[CLICK] ${label}`);
  28  | 
  29  |   const page =
  30  |     locator.page();
  31  | 
  32  |   await dismissOverlays(
  33  |     page
  34  |   );
  35  | 
  36  |   try {
  37  |     await locator.waitFor({
  38  |       state: 'visible',
  39  |       timeout: 15000,
  40  |     });
  41  |   } catch {
  42  |     // A survey or cookie layer often appears a moment after the first
  43  |     // dismiss during a long run. Clear it and wait for the target again.
  44  |     await dismissOverlays(
  45  |       page
  46  |     );
  47  | 
  48  |     await locator.waitFor({
  49  |       state: 'visible',
  50  |       timeout: 15000,
  51  |     });
  52  |   }
  53  | 
  54  |   await locator.scrollIntoViewIfNeeded({
  55  |     timeout: 5000,
  56  |   }).catch(
  57  |     () => undefined
  58  |   );
  59  | 
  60  |   try {
  61  |     await locator.click({
  62  |       timeout: 8000,
  63  |     });
  64  |   } catch {
  65  |     await dismissOverlays(
  66  |       page
  67  |     );
  68  | 
  69  |     await locator.scrollIntoViewIfNeeded({
  70  |       timeout: 5000,
  71  |     }).catch(
  72  |       () => undefined
  73  |     );
  74  | 
  75  |     await locator.click({
  76  |       timeout: 8000,
  77  |     }).catch(
  78  |       async () => {
> 79  |         await locator.click({
      |                       ^ TimeoutError: locator.click: Timeout 8000ms exceeded.
  80  |           force: true,
  81  |           timeout: 8000
  82  |         });
  83  |       }
  84  |     );
  85  |   }
  86  | 
  87  |   const watchDelay =
  88  |     watchDelayMs();
  89  | 
  90  |   if (watchDelay > 0) {
  91  |     await locator.page().waitForTimeout(
  92  |       watchDelay
  93  |     );
  94  |   }
  95  | }
  96  | 
  97  | export async function openHeaderMenu(
  98  |   page: Page,
  99  |   menuName: RegExp
  100 | ) {
  101 |   const menuButton =
  102 |     page.getByRole(
  103 |       'button',
  104 |       {
  105 |         name: menuName
  106 |       }
  107 |     ).first();
  108 | 
  109 |   const anyItem =
  110 |     page.getByRole(
  111 |       'menuitem'
  112 |     ).first();
  113 | 
  114 |   for (let attempt = 1; attempt <= 2; attempt += 1) {
  115 |     await menuButton.hover();
  116 | 
  117 |     const openedByHover =
  118 |       await anyItem.waitFor({
  119 |         state: 'visible',
  120 |         timeout: 1500
  121 |       }).then(
  122 |         () => true
  123 |       ).catch(
  124 |         () => false
  125 |       );
  126 | 
  127 |     if (openedByHover) {
  128 |       return;
  129 |     }
  130 | 
  131 |     const expanded =
  132 |       await menuButton.getAttribute(
  133 |         'aria-expanded'
  134 |       ).catch(
  135 |         () => null
  136 |       );
  137 | 
  138 |     if (expanded !== 'true') {
  139 |       await menuButton.click({
  140 |         timeout: 8000
  141 |       });
  142 |     }
  143 | 
  144 |     const opened =
  145 |       await anyItem.waitFor({
  146 |         state: 'visible',
  147 |         timeout: 5000
  148 |       }).then(
  149 |         () => true
  150 |       ).catch(
  151 |         () => false
  152 |       );
  153 | 
  154 |     if (opened) {
  155 |       return;
  156 |     }
  157 | 
  158 |     await page.keyboard.press(
  159 |       'Escape'
  160 |     ).catch(
  161 |       () => undefined
  162 |     );
  163 |   }
  164 | 
  165 |   await anyItem.waitFor({
  166 |     state: 'visible',
  167 |     timeout: 15000
  168 |   });
  169 | }
  170 | 
  171 | export async function openHeaderMenuItem(
  172 |   page: Page,
  173 |   menuName: RegExp,
  174 |   itemName: RegExp,
  175 |   label: string
  176 | ) {
  177 |   const menuItem =
  178 |     page.getByRole(
  179 |       'menuitem',
```