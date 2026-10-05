# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardAccountSurfaces.spec.ts >> Signed-in account surfaces >> Equity research clears a typed symbol
- Location: tests\DashboardAccountSurfaces.spec.ts:496:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('menuitem', { name: /^equity$/i }).first() to be visible

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - button "Research" [active] [ref=e19]:
            - generic [ref=e20]: Research
            - img [ref=e21]
          - link "Academy" [ref=e23] [cursor=pointer]:
            - /url: /academy
          - link "Support" [ref=e24] [cursor=pointer]:
            - /url: /dashboard/support
        - generic [ref=e25]:
          - button "Prices are delayed, not live market prices. Portfolio value and P&L come from your broker, so they can differ from your broker's dashboard." [ref=e26]: Delayed
          - button "Sync all" [ref=e27] [cursor=pointer]:
            - img
            - generic [ref=e28]: Sync all
          - button "Add options" [ref=e29] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e30] [cursor=pointer]:
            - img [ref=e31]
            - generic [ref=e34]: "18"
          - button "QU" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: QU
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - generic [ref=e42]:
            - generic [ref=e43]:
              - img [ref=e45]
              - generic [ref=e48]:
                - paragraph [ref=e49]: Total Portfolio Value
                - paragraph [ref=e50]: $350,648
                - paragraph [ref=e51]: 100% of portfolio
            - generic [ref=e52]:
              - img [ref=e54]
              - generic [ref=e57]:
                - paragraph [ref=e58]: Invested Value
                - paragraph [ref=e59]: $349,648
                - paragraph [ref=e60]: 99.7% of portfolio
            - generic [ref=e61]:
              - img [ref=e63]
              - generic [ref=e65]:
                - paragraph [ref=e66]: Cash & Buying Power
                - paragraph [ref=e67]: $1,000
                - paragraph [ref=e68]: 0.3% of portfolio
          - generic [ref=e69]:
            - generic [ref=e70]:
              - paragraph [ref=e71]: Ools Score (Portfolio)
              - button "Learn more about Ools Score" [ref=e72]:
                - img [ref=e73]
            - generic [ref=e76]:
              - img "Ools Score 47 out of 100" [ref=e77]:
                - generic [ref=e84]: "47"
              - generic [ref=e85]:
                - generic [ref=e86]: "0"
                - generic [ref=e87]: Diversified
                - generic [ref=e88]: Overlayed
                - generic [ref=e89]: Hedged
                - generic [ref=e90]: DeRisked
                - generic [ref=e91]: "100"
            - list [ref=e92]:
              - listitem [ref=e93]: Covered-call utilization below your profile target.
          - generic [ref=e94]:
            - generic [ref=e95]:
              - img [ref=e97]
              - generic [ref=e99]:
                - heading "Upcoming Events" [level=3] [ref=e100]
                - paragraph [ref=e101]: Top 3 from your portfolio symbols
            - list [ref=e102]:
              - listitem [ref=e103]:
                - generic [ref=e104]:
                  - paragraph [ref=e105]: CB
                  - paragraph [ref=e106]: Earnings
                - paragraph [ref=e107]: Oct 20
              - listitem [ref=e108]:
                - generic [ref=e109]:
                  - paragraph [ref=e110]: CCI
                  - paragraph [ref=e111]: Earnings
                - paragraph [ref=e112]: Oct 21
              - listitem [ref=e113]:
                - generic [ref=e114]:
                  - paragraph [ref=e115]: AAPL
                  - paragraph [ref=e116]: Earnings
                - paragraph [ref=e117]: Oct 29
            - link "View more" [ref=e119] [cursor=pointer]:
              - /url: /dashboard/event-calendar
              - text: View more
              - img [ref=e120]
        - generic [ref=e122]:
          - generic [ref=e123]:
            - heading "Asset Allocation" [level=3] [ref=e124]
            - generic [ref=e125]:
              - generic [ref=e126]:
                - application [ref=e129]
                - generic:
                  - generic: $350.6K
                  - generic: Total
              - list [ref=e142]:
                - listitem [ref=e143]:
                  - generic [ref=e146]: Equity
                  - generic [ref=e147]:
                    - generic [ref=e148]: $86,744
                    - generic [ref=e149]: 24.74%
                - listitem [ref=e150]:
                  - generic [ref=e153]: Cash
                  - generic [ref=e154]:
                    - generic [ref=e155]: $1,000
                    - generic [ref=e156]: 0.29%
                - listitem [ref=e157]:
                  - generic [ref=e160]: Options (Net)
                  - generic [ref=e161]:
                    - generic [ref=e162]: $7,964
                    - generic [ref=e163]: 2.27%
          - generic [ref=e164]:
            - heading "Option Strategy Breakdown" [level=3] [ref=e165]
            - paragraph [ref=e166]: Total Options (Net)
            - paragraph [ref=e167]: $7,964
            - generic [ref=e168]:
              - generic [ref=e169]: Strategy
              - generic [ref=e170]: Market Value
              - generic [ref=e171]: "% of Portfolio"
            - list [ref=e172]:
              - listitem [ref=e173]:
                - generic [ref=e174]: Covered Calls
                - generic [ref=e176]: $0.00
                - generic [ref=e177]: 0.00%
              - listitem [ref=e178]:
                - generic [ref=e179]: Cash Secured Puts
                - generic [ref=e181]: $0.00
                - generic [ref=e182]: 0.00%
              - listitem [ref=e183]:
                - generic [ref=e184]: Protective Puts
                - generic [ref=e188]: +$7,177.50
                - generic [ref=e189]: +2.05%
              - listitem [ref=e190]:
                - generic [ref=e191]: Long Calls
                - generic [ref=e195]: +$692.19
                - generic [ref=e196]: +0.20%
              - listitem [ref=e197]:
                - generic [ref=e198]: Other Strategies
                - generic [ref=e202]: +$94.47
                - generic [ref=e203]: +0.03%
            - link "View option exposure" [ref=e205] [cursor=pointer]:
              - /url: /dashboard/options-research
              - text: View option exposure
              - img [ref=e206]
          - generic [ref=e208]:
            - heading "Broker Accounts" [level=3] [ref=e209]
            - generic [ref=e210]:
              - generic [ref=e211]:
                - generic [ref=e212]: Broker
                - generic [ref=e213]: Last Refresh
                - generic [ref=e214]: Market Value
                - generic [ref=e215]: "% of Total"
              - list [ref=e216]:
                - listitem [ref=e217]:
                  - generic [ref=e218]:
                    - generic [ref=e219]: ME
                    - generic [ref=e220]: Manual entry
                  - generic [ref=e221]: —
                  - generic [ref=e222]: $350,648
                  - generic [ref=e223]: 100.0%
              - generic [ref=e224]:
                - generic [ref=e225]: Total (1 Broker)
                - generic [ref=e226]: $350,648
                - generic [ref=e227]: 100%
            - link "Manage Accounts" [ref=e229] [cursor=pointer]:
              - /url: /dashboard/accounts
              - text: Manage Accounts
              - img [ref=e230]
        - generic [ref=e232]:
          - generic [ref=e234]:
            - heading "Top 10 Opportunities" [level=3] [ref=e235]
            - paragraph [ref=e236]: AI-powered option overlay strategies for your portfolio.
            - table [ref=e238]:
              - rowgroup [ref=e239]:
                - row "# Symbol Strategy Expiry (DTE) Strike Premium Yield% Assign. %" [ref=e240]:
                  - columnheader "#" [ref=e241]
                  - columnheader "Symbol" [ref=e242]
                  - columnheader "Strategy" [ref=e243]
                  - columnheader "Expiry (DTE)" [ref=e244]
                  - columnheader "Strike" [ref=e245]
                  - columnheader "Premium" [ref=e246]
                  - columnheader "Yield%" [ref=e247]
                  - columnheader "Assign. %" [ref=e248]
              - rowgroup [ref=e249]:
                - row "1 CB CSP Oct 16, 2026 (11 DTE) $330 $4.85 12.5% 44%" [ref=e250]:
                  - cell "1" [ref=e251]
                  - cell "CB" [ref=e252]
                  - cell "CSP" [ref=e253]:
                    - generic [ref=e254]: CSP
                  - cell "Oct 16, 2026 (11 DTE)" [ref=e255]:
                    - text: Oct 16, 2026
                    - generic [ref=e256]: (11 DTE)
                  - cell "$330" [ref=e257]
                  - cell "$4.85" [ref=e258]
                  - cell "12.5%" [ref=e259]
                  - cell "44%" [ref=e260]
                - row "2 FICO CSP Oct 16, 2026 (11 DTE) $1,040 $44.30 36.2% 97%" [ref=e261]:
                  - cell "2" [ref=e262]
                  - cell "FICO" [ref=e263]
                  - cell "CSP" [ref=e264]:
                    - generic [ref=e265]: CSP
                  - cell "Oct 16, 2026 (11 DTE)" [ref=e266]:
                    - text: Oct 16, 2026
                    - generic [ref=e267]: (11 DTE)
                  - cell "$1,040" [ref=e268]
                  - cell "$44.30" [ref=e269]
                  - cell "36.2%" [ref=e270]
                  - cell "97%" [ref=e271]
                - row "3 CB CC Nov 20, 2026 (46 DTE) $345 $5.55 12.5% 33%" [ref=e272]:
                  - cell "3" [ref=e273]
                  - cell "CB" [ref=e274]
                  - cell "CC" [ref=e275]:
                    - generic [ref=e276]: CC
                  - cell "Nov 20, 2026 (46 DTE)" [ref=e277]:
                    - text: Nov 20, 2026
                    - generic [ref=e278]: (46 DTE)
                  - cell "$345" [ref=e279]
                  - cell "$5.55" [ref=e280]
                  - cell "12.5%" [ref=e281]
                  - cell "33%" [ref=e282]
                - row "4 FICO CSP Nov 20, 2026 (46 DTE) $500 $10.00 14.9% 12%" [ref=e283]:
                  - cell "4" [ref=e284]
                  - cell "FICO" [ref=e285]
                  - cell "CSP" [ref=e286]:
                    - generic [ref=e287]: CSP
                  - cell "Nov 20, 2026 (46 DTE)" [ref=e288]:
                    - text: Nov 20, 2026
                    - generic [ref=e289]: (46 DTE)
                  - cell "$500" [ref=e290]
                  - cell "$10.00" [ref=e291]
                  - cell "14.9%" [ref=e292]
                  - cell "12%" [ref=e293]
            - generic [ref=e294]:
              - generic [ref=e295]:
                - generic [ref=e296]: CC
                - text: Covered Call
              - generic [ref=e297]:
                - generic [ref=e298]: CSP
                - text: Cash Secured Put
              - generic [ref=e299]:
                - generic [ref=e300]: PP
                - text: Protective Put
              - generic [ref=e301]:
                - generic [ref=e302]: LC
                - text: Long Call
            - link "View all opportunities" [ref=e304] [cursor=pointer]:
              - /url: /dashboard/opportunities
              - text: View all opportunities
              - img [ref=e305]
          - generic [ref=e308]:
            - generic [ref=e309]:
              - generic [ref=e310]:
                - heading "Option Expiry Overview" [level=3] [ref=e311]
                - paragraph [ref=e312]: Open contracts expiring in the next 6 weeks
              - generic [ref=e313]:
                - generic [ref=e314]: OTM
                - generic [ref=e316]: NTM
                - generic [ref=e318]: ATM
                - generic [ref=e320]: ITM
            - generic [ref=e322]:
              - generic [ref=e323]:
                - button "Short Options" [ref=e324]
                - button "Long Options" [ref=e325]
              - generic [ref=e326]:
                - button "Call" [pressed] [ref=e327]
                - button "Put" [ref=e328]
            - paragraph [ref=e329]: No short call options expiring in the next 6 weeks
        - generic [ref=e331]:
          - generic [ref=e332]:
            - paragraph [ref=e333]: OolTool Performance
            - img [ref=e334]
          - paragraph [ref=e338]: How much value OolTool's suggestions have generated — separate from your portfolio's own gains.
          - generic [ref=e339]:
            - generic [ref=e340]:
              - generic [ref=e341]:
                - img [ref=e342]
                - paragraph [ref=e346]: Opportunities Executed
              - paragraph [ref=e347]: 0 / 0
              - paragraph [ref=e348]: No scenarios yet
            - generic [ref=e349]:
              - generic [ref=e350]:
                - img [ref=e351]
                - paragraph [ref=e353]: Premium Generated
              - paragraph [ref=e354]: $0
              - paragraph [ref=e355]: From executed scenarios
            - generic [ref=e356]:
              - generic [ref=e357]:
                - img [ref=e358]
                - paragraph [ref=e361]: Successful Opportunities
              - paragraph [ref=e362]: 0 / 0
              - paragraph [ref=e363]: None settled yet
          - generic [ref=e364]:
            - generic [ref=e365]: "Covered Calls: 0"
            - generic [ref=e366]: "Cash-Secured Puts: 0"
            - generic [ref=e367]: "Other: 0"
    - contentinfo [ref=e368]:
      - generic [ref=e369]:
        - generic [ref=e370]:
          - paragraph [ref=e371]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e372]:
            - link "Privacy Policy" [ref=e374] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e375]:
              - generic [ref=e376]: ·
              - link "Terms of Service" [ref=e377] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e378]:
              - generic [ref=e379]: ·
              - link "Disclosures" [ref=e380] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e381]:
              - generic [ref=e382]: ·
              - link "Risk Warning" [ref=e383] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e384]:
              - generic [ref=e385]: ·
              - link "Contact" [ref=e386] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e387]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e388]
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
> 48  |     await locator.waitFor({
      |                   ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
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
  79  |         await locator.click({
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
  97  | export async function openHeaderMenuItem(
  98  |   page: Page,
  99  |   menuName: RegExp,
  100 |   itemName: RegExp,
  101 |   label: string
  102 | ) {
  103 |   const menuButton =
  104 |     page.getByRole(
  105 |       'button',
  106 |       {
  107 |         name: menuName
  108 |       }
  109 |     ).first();
  110 | 
  111 |   const choices =
  112 |     () => [
  113 |       page.getByRole(
  114 |         'menuitem',
  115 |         {
  116 |           name: itemName
  117 |         }
  118 |       ).first(),
  119 |       page.getByRole(
  120 |         'option',
  121 |         {
  122 |           name: itemName
  123 |         }
  124 |       ).first(),
  125 |       page.getByRole(
  126 |         'link',
  127 |         {
  128 |           name: itemName
  129 |         }
  130 |       ).first()
  131 |     ];
  132 | 
  133 |   let visibleChoice: Locator | undefined;
  134 | 
  135 |   for (
  136 |     let attempt = 1;
  137 |     attempt <= 2 && !visibleChoice;
  138 |     attempt += 1
  139 |   ) {
  140 |     await safeClick(
  141 |       menuButton,
  142 |       `${label} menu`
  143 |     );
  144 | 
  145 |     for (const candidate of choices()) {
  146 |       if (
  147 |         await candidate.isVisible({
  148 |           timeout: 2000
```