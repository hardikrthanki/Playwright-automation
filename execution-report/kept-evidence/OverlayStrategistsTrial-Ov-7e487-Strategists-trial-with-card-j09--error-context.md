# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: OverlayStrategistsTrial.spec.ts >> Overlay Strategists Trial Experience >> New user can start Overlay Strategists trial with card
- Location: tests\OverlayStrategistsTrial.spec.ts:265:11

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('[role="combobox"]').first() to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - button "Sign Out" [ref=e4] [cursor=pointer]:
        - img
        - text: Sign Out
    - generic [ref=e6]:
      - generic [ref=e7]:
        - link "OolTool" [ref=e8] [cursor=pointer]:
          - /url: /
          - img "OolTool" [ref=e9]
        - heading "Choose Your Plan" [level=1] [ref=e10]
        - paragraph [ref=e11]: Select a plan to get started with OolTool
      - generic [ref=e12]:
        - generic [ref=e14]:
          - button "Monthly" [ref=e15]
          - button "Annual" [ref=e16]
        - generic [ref=e17]:
          - radio "Curious Explore your Portfolio Free forever Manual Upload Only Positions (10) Simulations (10) CTAs Refresh Covered Calls OOLS Score" [checked] [ref=e18] [cursor=pointer]:
            - generic [ref=e19]:
              - img [ref=e20]
              - generic [ref=e22]: Curious
            - paragraph [ref=e23]: Explore your Portfolio
            - generic [ref=e24]: Free forever
            - list [ref=e25]:
              - listitem [ref=e26]:
                - img [ref=e27]
                - text: Manual Upload Only
              - listitem [ref=e29]:
                - img [ref=e30]
                - text: Positions (10)
              - listitem [ref=e32]:
                - img [ref=e33]
                - text: Simulations (10)
              - listitem [ref=e35]:
                - img [ref=e36]
                - text: CTAs Refresh
              - listitem [ref=e38]:
                - img [ref=e39]
                - text: Covered Calls
              - listitem [ref=e41]:
                - img [ref=e42]
                - text: OOLS Score
          - radio "Income Build your Portfolio $29/mo Broker Integration (1) Account Linked (1) Positions (100) CTAs Unlimited Simulations Unlimited Covered Calls/Puts CTAs Earnings Notifications Dividend Notifications OOLS Score" [ref=e44] [cursor=pointer]:
            - generic [ref=e45]:
              - img [ref=e46]
              - generic [ref=e48]: Income
            - paragraph [ref=e49]: Build your Portfolio
            - generic [ref=e50]: $29/mo
            - list [ref=e51]:
              - listitem [ref=e52]:
                - img [ref=e53]
                - text: Broker Integration (1)
              - listitem [ref=e55]:
                - img [ref=e56]
                - text: Account Linked (1)
              - listitem [ref=e58]:
                - img [ref=e59]
                - text: Positions (100)
              - listitem [ref=e61]:
                - img [ref=e62]
                - text: CTAs Unlimited
              - listitem [ref=e64]:
                - img [ref=e65]
                - text: Simulations Unlimited
              - listitem [ref=e67]:
                - img [ref=e68]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e70]:
                - img [ref=e71]
                - text: Earnings Notifications
              - listitem [ref=e73]:
                - img [ref=e74]
                - text: Dividend Notifications
              - listitem [ref=e76]:
                - img [ref=e77]
                - text: OOLS Score
          - radio "Overlay Strategists Optimize your Portfolio $79/mo Try 30 days free With card · auto-renews after trial Try 30 days free Without card · moves to Free after trial Broker Integration (5) Account Linked (10) Positions (500) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e79] [cursor=pointer]:
            - generic [ref=e81]:
              - img [ref=e82]
              - generic [ref=e84]: Overlay Strategists
            - paragraph [ref=e85]: Optimize your Portfolio
            - generic [ref=e86]: $79/mo
            - generic [ref=e88]:
              - button "Try 30 days free With card · auto-renews after trial" [ref=e89]:
                - generic [ref=e90]:
                  - img
                  - text: Try 30 days free
                - generic [ref=e91]: With card · auto-renews after trial
              - button "Try 30 days free Without card · moves to Free after trial" [ref=e92]:
                - generic [ref=e93]:
                  - img
                  - text: Try 30 days free
                - generic [ref=e94]: Without card · moves to Free after trial
            - list [ref=e95]:
              - listitem [ref=e96]:
                - img [ref=e97]
                - text: Broker Integration (5)
              - listitem [ref=e99]:
                - img [ref=e100]
                - text: Account Linked (10)
              - listitem [ref=e102]:
                - img [ref=e103]
                - text: Positions (500)
              - listitem [ref=e105]:
                - img [ref=e106]
                - text: CTAs & Simulations Unlimited
              - listitem [ref=e108]:
                - img [ref=e109]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e111]:
                - img [ref=e112]
                - text: Earnings & Dividends Notifications
              - listitem [ref=e114]:
                - img [ref=e115]
                - text: ITM/ATM resolve suggestions
              - listitem [ref=e117]:
                - img [ref=e118]
                - text: Portfolio Analytics
              - listitem [ref=e120]:
                - img [ref=e121]
                - text: Bulk Portfolio Load
              - listitem [ref=e123]:
                - img [ref=e124]
                - text: OOLS Score
          - radio "Portfolio Hedger Optimize your Portfolio $149/mo Broker Integration (10) Account Linked (20) Positions (1000) CTAs & Simulations Unlimited Covered Calls/Puts CTAs Protective Puts Option roll suggestions Earnings & Dividends Notifications ITM/ATM resolve suggestions Portfolio Analytics Bulk Portfolio Load OOLS Score" [ref=e126] [cursor=pointer]:
            - generic [ref=e127]:
              - img [ref=e128]
              - generic [ref=e130]: Portfolio Hedger
            - paragraph [ref=e131]: Optimize your Portfolio
            - generic [ref=e132]: $149/mo
            - list [ref=e133]:
              - listitem [ref=e134]:
                - img [ref=e135]
                - text: Broker Integration (10)
              - listitem [ref=e137]:
                - img [ref=e138]
                - text: Account Linked (20)
              - listitem [ref=e140]:
                - img [ref=e141]
                - text: Positions (1000)
              - listitem [ref=e143]:
                - img [ref=e144]
                - text: CTAs & Simulations Unlimited
              - listitem [ref=e146]:
                - img [ref=e147]
                - text: Covered Calls/Puts CTAs
              - listitem [ref=e149]:
                - img [ref=e150]
                - text: Protective Puts
              - listitem [ref=e152]:
                - img [ref=e153]
                - text: Option roll suggestions
              - listitem [ref=e155]:
                - img [ref=e156]
                - text: Earnings & Dividends Notifications
              - listitem [ref=e158]:
                - img [ref=e159]
                - text: ITM/ATM resolve suggestions
              - listitem [ref=e161]:
                - img [ref=e162]
                - text: Portfolio Analytics
              - listitem [ref=e164]:
                - img [ref=e165]
                - text: Bulk Portfolio Load
              - listitem [ref=e167]:
                - img [ref=e168]
                - text: OOLS Score
          - generic [ref=e171]:
            - heading "Enterprise" [level=3] [ref=e172]
            - paragraph [ref=e173]: For RIAs, wealth teams and financial institutions
            - paragraph [ref=e174]: Custom
            - paragraph [ref=e175]: SSO, SAML, SOC 2
            - list [ref=e176]:
              - listitem [ref=e177]:
                - img [ref=e178]
                - generic [ref=e180]: SaaS and API integrations
              - listitem [ref=e181]:
                - img [ref=e182]
                - generic [ref=e184]: Ools SDK and APIs
              - listitem [ref=e185]:
                - img [ref=e186]
                - generic [ref=e188]: Customized features
              - listitem [ref=e189]:
                - img [ref=e190]
                - generic [ref=e192]: Multi-user teams and role-based access
              - listitem [ref=e193]:
                - img [ref=e194]
                - generic [ref=e196]: Firm-wide portfolio analytics
              - listitem [ref=e197]:
                - img [ref=e198]
                - generic [ref=e200]: Centralized administration
              - listitem [ref=e201]:
                - img [ref=e202]
                - generic [ref=e204]: Audit logs and governance controls
            - button "Contact Sales" [ref=e205] [cursor=pointer]:
              - img
              - text: Contact Sales
            - link "contact@ooltool.com" [ref=e206] [cursor=pointer]:
              - /url: mailto:contact@ooltool.com
        - button "Complete Setup" [ref=e207] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=e208]
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