# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AcademyDepth.spec.ts >> Academy depth >> Beginners lessons overview categories and a strategy detail open
- Location: tests\AcademyDepth.spec.ts:554:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('main').getByRole('button', { name: /^mark as complete$/i }) to be visible

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
            - generic [ref=e33]: "18"
          - button "Enter fullscreen" [ref=e34] [cursor=pointer]:
            - img
          - button "Switch to dark theme" [ref=e35] [cursor=pointer]:
            - img
          - button "HT" [ref=e36] [cursor=pointer]:
            - generic [ref=e38]: HT
    - main [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - heading "Academy" [level=1] [ref=e44]
          - paragraph [ref=e45]: A self-paced library of options-strategy references, lessons, and definitions.
          - paragraph [ref=e46]: Educational content only - this app does not place trades or provide investment advice.
        - navigation [ref=e48]:
          - link "Beginners" [ref=e49] [cursor=pointer]:
            - /url: /academy/beginners
            - img [ref=e50]
            - text: Beginners
          - link "Overview" [ref=e53] [cursor=pointer]:
            - /url: /academy
            - img [ref=e54]
            - text: Overview
          - link "Lessons" [ref=e57] [cursor=pointer]:
            - /url: /academy/lessons
            - img [ref=e58]
            - text: Lessons
          - link "Strategy Library" [ref=e60] [cursor=pointer]:
            - /url: /academy/strategies
            - img [ref=e61]
            - text: Strategy Library
          - link "Glossary" [ref=e63] [cursor=pointer]:
            - /url: /academy/glossary
            - img [ref=e64]
            - text: Glossary
        - generic [ref=e67]:
          - article [ref=e68]:
            - generic [ref=e69]:
              - link "Back to Beginners" [ref=e70] [cursor=pointer]:
                - /url: /academy/beginners
                - img
                - text: Back to Beginners
              - generic [ref=e71]: beginner
              - generic [ref=e72]:
                - img [ref=e73]
                - text: 5 min read
            - generic [ref=e76]:
              - generic [ref=e77]: LESSON 1 · START HERE
              - heading "What Is a Stock Option?" [level=1] [ref=e78]
              - paragraph [ref=e79]: Understand the basic contract before learning any strategy.
            - generic [ref=e81]:
              - paragraph [ref=e82]:
                - text: A
                - strong [ref=e83]: stock option
                - text: is a contract connected to an underlying stock. It gives the buyer certain rights and gives the seller certain obligations for a specific period of time.
              - generic [ref=e84]:
                - generic [ref=e85]:
                  - generic [ref=e86]:
                    - generic [ref=e87]: Underlying Stock
                    - strong [ref=e88]: $100
                  - generic [ref=e89]: →
                  - generic [ref=e90]:
                    - generic [ref=e91]: Option Contract
                    - strong [ref=e92]: $105 Call
                  - generic [ref=e93]: →
                  - generic [ref=e94]:
                    - generic [ref=e95]: Expiration
                    - strong [ref=e96]: 30 Days
                - paragraph [ref=e97]: An option connects a stock, a strike price and a specific period of time.
              - heading "There are two basic types of options." [level=4] [ref=e98]
              - generic [ref=e99]:
                - generic [ref=e100]:
                  - generic [ref=e101]: Call Option
                  - generic [ref=e102]: A call gives its owner the right to buy the underlying shares at the option's strike price, subject to the terms of the contract.
                - generic [ref=e103]:
                  - generic [ref=e104]: Put Option
                  - generic [ref=e105]: A put gives its owner the right to sell the underlying shares at the option's strike price, subject to the terms of the contract.
              - paragraph [ref=e106]:
                - text: Standard listed equity option contracts generally represent
                - strong [ref=e107]: 100 shares
                - text: of the underlying stock. Options also have an expiration date, so unlike owning common stock, time is a central part of the instrument.
              - generic [ref=e108]:
                - generic [ref=e109]: Beginner takeaway
                - generic [ref=e110]: An option is not simply a cheaper version of a stock. It is a time-sensitive contract whose value can change because of the stock price, time remaining, volatility and other factors.
              - generic [ref=e111]:
                - generic [ref=e112]: How this connects to OolTool
                - generic [ref=e113]: OolTool can organize option information around the underlying stock, strike, expiration, premium and risk characteristics so users can understand the contract before evaluating a scenario.
            - generic [ref=e114]:
              - button "Marked complete - undo" [ref=e115] [cursor=pointer]:
                - img
                - text: Marked complete - undo
              - 'link "Next: Why Might Investors Use Options?" [ref=e117] [cursor=pointer]':
                - /url: /academy/beginners/why-options
                - text: "Next: Why Might Investors Use Options?"
                - img
          - complementary [ref=e118]:
            - generic [ref=e120]:
              - heading "Learning Path" [level=3] [ref=e121]
              - list [ref=e122]:
                - listitem [ref=e123]:
                  - link "1.What Is a Stock Option?" [ref=e124] [cursor=pointer]:
                    - /url: /academy/beginners/what-is-option
                    - generic [ref=e125]: "1."
                    - text: What Is a Stock Option?
                    - img [ref=e126]
                - listitem [ref=e129]:
                  - link "2.Why Might Investors Use Options?" [ref=e130] [cursor=pointer]:
                    - /url: /academy/beginners/why-options
                    - generic [ref=e131]: "2."
                    - text: Why Might Investors Use Options?
                - listitem [ref=e132]:
                  - link "3.When Might Options Make Sense?" [ref=e133] [cursor=pointer]:
                    - /url: /academy/beginners/when-options
                    - generic [ref=e134]: "3."
                    - text: When Might Options Make Sense?
                - listitem [ref=e135]:
                  - link "4.Understanding an Option's Time Value" [ref=e136] [cursor=pointer]:
                    - /url: /academy/beginners/time-value
                    - generic [ref=e137]: "4."
                    - text: Understanding an Option's Time Value
                - listitem [ref=e138]:
                  - link "5.The Option Greeks" [ref=e139] [cursor=pointer]:
                    - /url: /academy/beginners/greeks
                    - generic [ref=e140]: "5."
                    - text: The Option Greeks
                - listitem [ref=e141]:
                  - link "6.Using Options to Hedge" [ref=e142] [cursor=pointer]:
                    - /url: /academy/beginners/hedge
                    - generic [ref=e143]: "6."
                    - text: Using Options to Hedge
                - listitem [ref=e144]:
                  - link "7.Income & Stock Acquisition Strategies" [ref=e145] [cursor=pointer]:
                    - /url: /academy/beginners/income-acquisition
                    - generic [ref=e146]: "7."
                    - text: Income & Stock Acquisition Strategies
                - listitem [ref=e147]:
                  - link "8.How OolTool Helps Build Discipline" [ref=e148] [cursor=pointer]:
                    - /url: /academy/beginners/ooltool
                    - generic [ref=e149]: "8."
                    - text: How OolTool Helps Build Discipline
        - generic [ref=e150]:
          - img [ref=e151]
          - paragraph [ref=e153]: All Academy content is educational and informational only. Nothing here is investment advice, a solicitation, or an offer to buy or sell any security. You are solely responsible for any decisions you make at your broker.
    - contentinfo [ref=e154]:
      - generic [ref=e155]:
        - generic [ref=e156]:
          - paragraph [ref=e157]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e158]:
            - link "Privacy Policy" [ref=e160] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e161]:
              - generic [ref=e162]: ·
              - link "Terms of Service" [ref=e163] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e164]:
              - generic [ref=e165]: ·
              - link "Disclosures" [ref=e166] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e167]:
              - generic [ref=e168]: ·
              - link "Risk Warning" [ref=e169] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e170]:
              - generic [ref=e171]: ·
              - link "Contact" [ref=e172] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e173]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e174]: Academy
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
> 45 |     await locator.waitFor({
     |                   ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
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
  72 |     await locator.click({
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