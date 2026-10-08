# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardMenuWalk.spec.ts >> Each menu scenario >> Portfolio menu sorts holdings and opens each item
- Location: tests\DashboardMenuWalk.spec.ts:337:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('menuitem', { name: /^portfolio$/i }) to be visible

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
          - generic [ref=e13]:
            - button "Portfolio" [expanded] [active] [ref=e14]:
              - generic [ref=e15]: Portfolio
              - img [ref=e16]
            - menu [ref=e18]:
              - menuitem "Positions" [ref=e19] [cursor=pointer]:
                - generic [ref=e20]: Positions
              - menuitem "Accounts" [ref=e21] [cursor=pointer]:
                - generic [ref=e22]: Accounts
              - menuitem "Watchlist" [ref=e23] [cursor=pointer]:
                - generic [ref=e24]: Watchlist
              - menuitem "Analytics" [ref=e25] [cursor=pointer]:
                - generic [ref=e26]: Analytics
          - button "Research" [ref=e28]:
            - generic [ref=e29]: Research
            - img [ref=e30]
          - link "Academy" [ref=e32] [cursor=pointer]:
            - /url: /academy
          - link "Support" [ref=e33] [cursor=pointer]:
            - /url: /dashboard/support
        - generic [ref=e34]:
          - button "Market data and portfolio values may be delayed. Prices are not real-time. Portfolio holdings are based on the last snapshot received from your broker" [ref=e35]: Delayed
          - button "Sync all" [ref=e36] [cursor=pointer]:
            - img
            - generic [ref=e37]: Sync all
          - button "Add options" [ref=e38] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e39] [cursor=pointer]:
            - img [ref=e40]
            - generic [ref=e43]: "18"
          - button "QU" [ref=e44] [cursor=pointer]:
            - generic [ref=e46]: QU
    - main [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e49]:
          - generic [ref=e51]:
            - generic [ref=e52]:
              - img [ref=e54]
              - generic [ref=e57]:
                - paragraph [ref=e58]: Total Portfolio Value
                - paragraph [ref=e59]: $972,888
                - paragraph [ref=e60]: 100% of portfolio
            - generic [ref=e61]:
              - img [ref=e63]
              - generic [ref=e66]:
                - paragraph [ref=e67]: Invested Value
                - paragraph [ref=e68]: $971,888
                - paragraph [ref=e69]: 99.9% of portfolio
            - generic [ref=e70]:
              - img [ref=e72]
              - generic [ref=e74]:
                - paragraph [ref=e75]: Cash & Buying Power
                - paragraph [ref=e76]: $1,000
                - paragraph [ref=e77]: 0.1% of portfolio
          - generic [ref=e78]:
            - generic [ref=e79]:
              - paragraph [ref=e80]: Ools Score (Portfolio)
              - button "Learn more about Ools Score" [ref=e81]:
                - img [ref=e82]
            - generic [ref=e85]:
              - img "Ools Score 47 out of 100" [ref=e86]:
                - generic [ref=e93]: "47"
              - generic [ref=e94]:
                - generic [ref=e95]: "0"
                - generic [ref=e96]: Diversified
                - generic [ref=e97]: Overlayed
                - generic [ref=e98]: Hedged
                - generic [ref=e99]: DeRisked
                - generic [ref=e100]: "100"
            - list [ref=e101]:
              - listitem [ref=e102]: Covered-call utilization below your profile target.
          - generic [ref=e103]:
            - generic [ref=e104]:
              - img [ref=e106]
              - generic [ref=e108]:
                - heading "Upcoming Events" [level=3] [ref=e109]
                - paragraph [ref=e110]: Top 3 from your portfolio symbols
            - list [ref=e111]:
              - listitem [ref=e112]:
                - generic [ref=e113]:
                  - paragraph [ref=e114]: CB
                  - paragraph [ref=e115]: Earnings
                - paragraph [ref=e116]: Oct 20
              - listitem [ref=e117]:
                - generic [ref=e118]:
                  - paragraph [ref=e119]: CCI
                  - paragraph [ref=e120]: Earnings
                - paragraph [ref=e121]: Oct 21
              - listitem [ref=e122]:
                - generic [ref=e123]:
                  - paragraph [ref=e124]: AAPL
                  - paragraph [ref=e125]: Earnings
                - paragraph [ref=e126]: Oct 29
            - link "View more" [ref=e128] [cursor=pointer]:
              - /url: /dashboard/event-calendar
              - text: View more
              - img [ref=e129]
        - generic [ref=e131]:
          - generic [ref=e132]:
            - heading "Asset Allocation" [level=3] [ref=e133]
            - generic [ref=e134]:
              - generic [ref=e135]:
                - application [ref=e138]
                - generic:
                  - generic: $972.9K
                  - generic: Total
              - list [ref=e151]:
                - listitem [ref=e152]:
                  - generic [ref=e155]: Equity
                  - generic [ref=e156]:
                    - generic [ref=e157]: $87,746
                    - generic [ref=e158]: 9.02%
                - listitem [ref=e159]:
                  - generic [ref=e162]: Cash
                  - generic [ref=e163]:
                    - generic [ref=e164]: $1,000
                    - generic [ref=e165]: 0.10%
                - listitem [ref=e166]:
                  - generic [ref=e169]: Options (Net)
                  - generic [ref=e170]:
                    - generic [ref=e171]: $8,841
                    - generic [ref=e172]: 0.91%
          - generic [ref=e173]:
            - heading "Option Strategy Breakdown" [level=3] [ref=e174]
            - paragraph [ref=e175]: Total Options (Net)
            - paragraph [ref=e176]: $8,841
            - generic [ref=e177]:
              - generic [ref=e178]: Strategy
              - generic [ref=e179]: Market Value
              - generic [ref=e180]: "% of Portfolio"
            - list [ref=e181]:
              - listitem [ref=e182]:
                - generic [ref=e183]: Covered Calls
                - generic [ref=e185]: $0.00
                - generic [ref=e186]: 0.00%
              - listitem [ref=e187]:
                - generic [ref=e188]: Cash Secured Puts
                - generic [ref=e190]: $0.00
                - generic [ref=e191]: 0.00%
              - listitem [ref=e192]:
                - generic [ref=e193]: Protective Puts
                - generic [ref=e197]: +$7,998.78
                - generic [ref=e198]: +0.82%
              - listitem [ref=e199]:
                - generic [ref=e200]: Long Calls
                - generic [ref=e204]: +$745.17
                - generic [ref=e205]: +0.08%
              - listitem [ref=e206]:
                - generic [ref=e207]: Other Strategies
                - generic [ref=e211]: +$97.47
                - generic [ref=e212]: +0.01%
            - link "View option exposure" [ref=e214] [cursor=pointer]:
              - /url: /dashboard/options-research
              - text: View option exposure
              - img [ref=e215]
          - generic [ref=e217]:
            - heading "Broker Accounts" [level=3] [ref=e218]
            - generic [ref=e219]:
              - generic [ref=e220]:
                - generic [ref=e221]: Broker
                - generic [ref=e222]: Last Refresh
                - generic [ref=e223]: Market Value
                - generic [ref=e224]: "% of Total"
              - list [ref=e225]:
                - listitem [ref=e226]:
                  - generic [ref=e227]:
                    - img "Manual entry logo" [ref=e228]: ME
                    - generic [ref=e229]: Manual entry
                  - generic [ref=e230]: —
                  - generic [ref=e231]: $972,888
                  - generic [ref=e232]: 100.0%
              - generic [ref=e233]:
                - generic [ref=e234]: Total (1 Broker)
                - generic [ref=e235]: $972,888
                - generic [ref=e236]: 100%
            - link "Manage Accounts" [ref=e238] [cursor=pointer]:
              - /url: /dashboard/accounts
              - text: Manage Accounts
              - img [ref=e239]
        - generic [ref=e241]:
          - generic [ref=e243]:
            - heading "Top 10 Opportunities" [level=3] [ref=e244]
            - paragraph [ref=e245]: AI-powered option overlay strategies for your portfolio.
            - table [ref=e247]:
              - rowgroup [ref=e248]:
                - row "# Symbol Strategy Expiry (DTE) Strike Premium Yield% Assign. %" [ref=e249]:
                  - columnheader "#" [ref=e250]
                  - columnheader "Symbol" [ref=e251]
                  - columnheader "Strategy" [ref=e252]
                  - columnheader "Expiry (DTE)" [ref=e253]
                  - columnheader "Strike" [ref=e254]
                  - columnheader "Premium" [ref=e255]
                  - columnheader "Yield%" [ref=e256]
                  - columnheader "Assign. %" [ref=e257]
              - rowgroup [ref=e258]:
                - row "1 CB CSP Oct 16, 2026 (8 DTE) $330 $4.85 12.5% 30%" [ref=e259]:
                  - cell "1" [ref=e260]
                  - cell "CB" [ref=e261]
                  - cell "CSP" [ref=e262]:
                    - generic [ref=e263]: CSP
                  - cell "Oct 16, 2026 (8 DTE)" [ref=e264]:
                    - text: Oct 16, 2026
                    - generic [ref=e265]: (8 DTE)
                  - cell "$330" [ref=e266]
                  - cell "$4.85" [ref=e267]
                  - cell "12.5%" [ref=e268]
                  - cell "30%" [ref=e269]
                - row "2 FICO CSP Oct 16, 2026 (8 DTE) $1,040 $44.30 36.2% 99%" [ref=e270]:
                  - cell "2" [ref=e271]
                  - cell "FICO" [ref=e272]
                  - cell "CSP" [ref=e273]:
                    - generic [ref=e274]: CSP
                  - cell "Oct 16, 2026 (8 DTE)" [ref=e275]:
                    - text: Oct 16, 2026
                    - generic [ref=e276]: (8 DTE)
                  - cell "$1,040" [ref=e277]
                  - cell "$44.30" [ref=e278]
                  - cell "36.2%" [ref=e279]
                  - cell "99%" [ref=e280]
                - row "3 CB CSP Nov 20, 2026 (43 DTE) $320 $5.35 13.3% 24%" [ref=e281]:
                  - cell "3" [ref=e282]
                  - cell "CB" [ref=e283]
                  - cell "CSP" [ref=e284]:
                    - generic [ref=e285]: CSP
                  - cell "Nov 20, 2026 (43 DTE)" [ref=e286]:
                    - text: Nov 20, 2026
                    - generic [ref=e287]: (43 DTE)
                  - cell "$320" [ref=e288]
                  - cell "$5.35" [ref=e289]
                  - cell "13.3%" [ref=e290]
                  - cell "24%" [ref=e291]
                - row "4 FICO CSP Nov 20, 2026 (43 DTE) $600 $27.00 36.5% 25%" [ref=e292]:
                  - cell "4" [ref=e293]
                  - cell "FICO" [ref=e294]
                  - cell "CSP" [ref=e295]:
                    - generic [ref=e296]: CSP
                  - cell "Nov 20, 2026 (43 DTE)" [ref=e297]:
                    - text: Nov 20, 2026
                    - generic [ref=e298]: (43 DTE)
                  - cell "$600" [ref=e299]
                  - cell "$27.00" [ref=e300]
                  - cell "36.5%" [ref=e301]
                  - cell "25%" [ref=e302]
            - generic [ref=e303]:
              - generic [ref=e304]:
                - generic [ref=e305]: CC
                - text: Covered Call
              - generic [ref=e306]:
                - generic [ref=e307]: CSP
                - text: Cash Secured Put
              - generic [ref=e308]:
                - generic [ref=e309]: PP
                - text: Protective Put
              - generic [ref=e310]:
                - generic [ref=e311]: LC
                - text: Long Call
            - link "View all opportunities" [ref=e313] [cursor=pointer]:
              - /url: /dashboard/opportunities
              - text: View all opportunities
              - img [ref=e314]
          - generic [ref=e317]:
            - generic [ref=e318]:
              - generic [ref=e319]:
                - heading "Option Expiry Overview" [level=3] [ref=e320]
                - paragraph [ref=e321]: Open contracts expiring in the next 6 weeks
              - generic [ref=e322]:
                - generic [ref=e323]: OTM
                - generic [ref=e325]: NTM
                - generic [ref=e327]: ATM
                - generic [ref=e329]: ITM
            - generic [ref=e331]:
              - generic [ref=e332]:
                - button "Short Options" [ref=e333]
                - button "Long Options" [ref=e334]
              - generic [ref=e335]:
                - button "Call" [pressed] [ref=e336]
                - button "Put" [ref=e337]
            - paragraph [ref=e338]: No short call options expiring in the next 6 weeks
        - generic [ref=e340]:
          - generic [ref=e341]:
            - paragraph [ref=e342]: OolTool Performance
            - img [ref=e343]
          - paragraph [ref=e347]: How much value OolTool's suggestions have generated — separate from your portfolio's own gains.
          - generic [ref=e348]:
            - generic [ref=e349]:
              - generic [ref=e350]:
                - img [ref=e351]
                - paragraph [ref=e355]: Opportunities Executed
              - paragraph [ref=e356]: 0 / 0
              - paragraph [ref=e357]: No scenarios yet
            - generic [ref=e358]:
              - generic [ref=e359]:
                - img [ref=e360]
                - paragraph [ref=e362]: Premium Generated
              - paragraph [ref=e363]: $0
              - paragraph [ref=e364]: From executed scenarios
            - generic [ref=e365]:
              - generic [ref=e366]:
                - img [ref=e367]
                - paragraph [ref=e370]: Successful Opportunities
              - paragraph [ref=e371]: 0 / 0
              - paragraph [ref=e372]: None settled yet
          - generic [ref=e373]:
            - generic [ref=e374]: "Covered Calls: 0"
            - generic [ref=e375]: "Cash-Secured Puts: 0"
            - generic [ref=e376]: "Other: 0"
    - contentinfo [ref=e377]:
      - generic [ref=e378]:
        - generic [ref=e379]:
          - paragraph [ref=e380]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e381]:
            - link "Privacy Policy" [ref=e383] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e384]:
              - generic [ref=e385]: ·
              - link "Terms of Service" [ref=e386] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e387]:
              - generic [ref=e388]: ·
              - link "Disclosures" [ref=e389] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e390]:
              - generic [ref=e391]: ·
              - link "Risk Warning" [ref=e392] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e393]:
              - generic [ref=e394]: ·
              - link "Contact" [ref=e395] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e396]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e397]
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
```