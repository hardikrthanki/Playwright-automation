# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AcademyDepth.spec.ts >> Academy depth >> Academy tabs lesson completion progress strategy filters and glossary
- Location: tests\AcademyDepth.spec.ts:178:9

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
              - link "Back to Lessons" [ref=e70] [cursor=pointer]:
                - /url: /academy/lessons
                - img
                - text: Back to Lessons
              - generic [ref=e71]: beginner
              - generic [ref=e72]:
                - img [ref=e73]
                - text: 6 min read
            - generic [ref=e77]:
              - generic [ref=e78]:
                - heading "The Basic Structure" [level=2] [ref=e79]
                - paragraph [ref=e80]: A covered call is a position in which an investor who already owns at least 100 shares of a stock sells (writes) one call option contract against those shares. The shares act as collateral, hence the term 'covered.' The seller collects a premium up front in exchange for agreeing to deliver those shares at the strike price if the buyer exercises the option.
              - generic [ref=e81]:
                - heading "What the Premium Represents" [level=2] [ref=e82]
                - paragraph [ref=e83]: The premium is the cash paid by the option buyer to the seller at the time the contract is opened. It is credited immediately to the seller's account and is kept regardless of whether the option is exercised. The premium reflects the market's view of volatility, time to expiration, and how far the strike is from the current share price.
                - generic [ref=e84]:
                  - img [ref=e85]
                  - paragraph [ref=e87]: Premiums vary continuously with market conditions. Quotes shown in this app are illustrative snapshots and may not reflect executable prices.
              - generic [ref=e88]:
                - heading "Possible Outcomes at Expiration" [level=2] [ref=e89]
                - paragraph [ref=e90]: If the share price stays at or below the strike at expiration, the option typically expires worthless and the seller keeps both the shares and the premium. If the share price is above the strike, the shares may be called away (sold) at the strike price, and the seller keeps the premium plus any gain up to the strike.
              - generic [ref=e91]:
                - heading "What This App Does" [level=2] [ref=e92]
                - paragraph [ref=e93]: OolTool reads your positions in read-only mode and constructs conditional, illustrative scenarios so you can study a range of outcomes side by side. It does not place trades, single out specific contracts, or evaluate suitability.
                - generic [ref=e94]:
                  - img [ref=e95]
                  - paragraph [ref=e97]: Educational content only. Not investment advice, a solicitation, or an offer to buy or sell any security.
            - generic [ref=e99]:
              - heading "Key Takeaways" [level=3] [ref=e100]:
                - img [ref=e101]
                - text: Key Takeaways
              - list [ref=e104]:
                - listitem [ref=e105]:
                  - generic [ref=e106]: •
                  - generic [ref=e107]: A covered call requires owning at least 100 shares per contract written.
                - listitem [ref=e108]:
                  - generic [ref=e109]: •
                  - generic [ref=e110]: The premium is collected up front and kept regardless of outcome.
                - listitem [ref=e111]:
                  - generic [ref=e112]: •
                  - generic [ref=e113]: Upside above the strike price is capped for the duration of the contract.
            - generic [ref=e114]:
              - button "Marked complete - undo" [ref=e115] [cursor=pointer]:
                - img
                - text: Marked complete - undo
              - 'link "Next: Reading an Options Chain" [ref=e117] [cursor=pointer]':
                - /url: /academy/lessons/reading-an-options-chain
                - text: "Next: Reading an Options Chain"
                - img
          - complementary [ref=e118]:
            - generic [ref=e120]:
              - heading "Related Terms" [level=3] [ref=e121]
              - list [ref=e122]:
                - listitem [ref=e123]:
                  - link "Premium" [ref=e124] [cursor=pointer]:
                    - /url: /academy/glossary#premium
                    - text: Premium
                    - img [ref=e125]
                - listitem [ref=e127]:
                  - link "Strike Price" [ref=e128] [cursor=pointer]:
                    - /url: /academy/glossary#strike-price
                    - text: Strike Price
                    - img [ref=e129]
                - listitem [ref=e131]:
                  - link "Expiration" [ref=e132] [cursor=pointer]:
                    - /url: /academy/glossary#expiration
                    - text: Expiration
                    - img [ref=e133]
                - listitem [ref=e135]:
                  - link "Assignment" [ref=e136] [cursor=pointer]:
                    - /url: /academy/glossary#assignment
                    - text: Assignment
                    - img [ref=e137]
            - generic [ref=e140]:
              - heading "All Lessons" [level=3] [ref=e141]
              - list [ref=e142]:
                - listitem [ref=e143]:
                  - link "1.What is a Covered Call?" [ref=e144] [cursor=pointer]:
                    - /url: /academy/lessons/what-is-a-covered-call
                    - generic [ref=e145]: "1."
                    - text: What is a Covered Call?
                    - img [ref=e146]
                - listitem [ref=e149]:
                  - link "2.Reading an Options Chain" [ref=e150] [cursor=pointer]:
                    - /url: /academy/lessons/reading-an-options-chain
                    - generic [ref=e151]: "2."
                    - text: Reading an Options Chain
                - listitem [ref=e152]:
                  - link "3.Moneyness & the Option Chain" [ref=e153] [cursor=pointer]:
                    - /url: /academy/lessons/moneyness-and-the-option-chain
                    - generic [ref=e154]: "3."
                    - text: Moneyness & the Option Chain
                - listitem [ref=e155]:
                  - link "4.Intrinsic vs. Extrinsic Value" [ref=e156] [cursor=pointer]:
                    - /url: /academy/lessons/intrinsic-vs-extrinsic-value
                    - generic [ref=e157]: "4."
                    - text: Intrinsic vs. Extrinsic Value
                - listitem [ref=e158]:
                  - link "5.Strike Selection Basics" [ref=e159] [cursor=pointer]:
                    - /url: /academy/lessons/strike-selection-basics
                    - generic [ref=e160]: "5."
                    - text: Strike Selection Basics
                - listitem [ref=e161]:
                  - link "6.Managing Assignment Risk" [ref=e162] [cursor=pointer]:
                    - /url: /academy/lessons/managing-assignment-risk
                    - generic [ref=e163]: "6."
                    - text: Managing Assignment Risk
                - listitem [ref=e164]:
                  - link "7.Implied Volatility & IV Crush" [ref=e165] [cursor=pointer]:
                    - /url: /academy/lessons/implied-volatility-and-iv-crush
                    - generic [ref=e166]: "7."
                    - text: Implied Volatility & IV Crush
                - listitem [ref=e167]:
                  - link "8.Theta & Time Decay" [ref=e168] [cursor=pointer]:
                    - /url: /academy/lessons/theta-and-time-decay
                    - generic [ref=e169]: "8."
                    - text: Theta & Time Decay
                - listitem [ref=e170]:
                  - link "9.Delta Explained" [ref=e171] [cursor=pointer]:
                    - /url: /academy/lessons/delta-explained
                    - generic [ref=e172]: "9."
                    - text: Delta Explained
                - listitem [ref=e173]:
                  - link "10.Gamma Explained" [ref=e174] [cursor=pointer]:
                    - /url: /academy/lessons/gamma-explained
                    - generic [ref=e175]: "10."
                    - text: Gamma Explained
                - listitem [ref=e176]:
                  - link "11.Putting the Greeks Together" [ref=e177] [cursor=pointer]:
                    - /url: /academy/lessons/putting-the-greeks-together
                    - generic [ref=e178]: "11."
                    - text: Putting the Greeks Together
                - listitem [ref=e179]:
                  - link "12.Vega Explained" [ref=e180] [cursor=pointer]:
                    - /url: /academy/lessons/vega-explained
                    - generic [ref=e181]: "12."
                    - text: Vega Explained
                - listitem [ref=e182]:
                  - link "13.Interpreting Payoff Diagrams" [ref=e183] [cursor=pointer]:
                    - /url: /academy/lessons/interpreting-payoff-diagrams
                    - generic [ref=e184]: "13."
                    - text: Interpreting Payoff Diagrams
        - generic [ref=e185]:
          - img [ref=e186]
          - paragraph [ref=e188]: All Academy content is educational and informational only. Nothing here is investment advice, a solicitation, or an offer to buy or sell any security. You are solely responsible for any decisions you make at your broker.
    - contentinfo [ref=e189]:
      - generic [ref=e190]:
        - generic [ref=e191]:
          - paragraph [ref=e192]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e193]:
            - link "Privacy Policy" [ref=e195] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e196]:
              - generic [ref=e197]: ·
              - link "Terms of Service" [ref=e198] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e199]:
              - generic [ref=e200]: ·
              - link "Disclosures" [ref=e201] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e202]:
              - generic [ref=e203]: ·
              - link "Risk Warning" [ref=e204] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e205]:
              - generic [ref=e206]: ·
              - link "Contact" [ref=e207] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e208]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e209]: OolTool | See potential income opportunities in your portfolio
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