# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardOptions.spec.ts >> Dashboard options >> Plus menu opens every add option
- Location: tests\DashboardOptions.spec.ts:153:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('menuitem').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('menuitem').first()

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
          - generic:
            - generic:
              - generic:
                - generic:
                  - img
                - generic:
                  - paragraph: Total Portfolio Value
                  - paragraph: $972,888
                  - paragraph: 100% of portfolio
              - generic:
                - generic:
                  - img
                - generic:
                  - paragraph: Invested Value
                  - paragraph: $971,888
                  - paragraph: 99.9% of portfolio
              - generic:
                - generic:
                  - img
                - generic:
                  - paragraph: Cash & Buying Power
                  - paragraph: $1,000
                  - paragraph: 0.1% of portfolio
          - generic:
            - generic:
              - paragraph: Ools Score (Portfolio)
              - button:
                - img
            - generic:
              - generic:
                - img:
                  - generic: "47"
                - generic:
                  - generic: "0"
                  - generic: Diversified
                  - generic: Overlayed
                  - generic: Hedged
                  - generic: DeRisked
                  - generic: "100"
            - list:
              - listitem: Covered-call utilization below your profile target.
          - generic:
            - generic:
              - generic:
                - img
              - generic:
                - heading [level=3]: Upcoming Events
                - paragraph: Top 3 from your portfolio symbols
            - list:
              - listitem:
                - generic:
                  - paragraph: CB
                  - paragraph: Earnings
                - paragraph: Oct 20
              - listitem:
                - generic:
                  - paragraph: CCI
                  - paragraph: Earnings
                - paragraph: Oct 21
              - listitem:
                - generic:
                  - paragraph: AAPL
                  - paragraph: Earnings
                - paragraph: Oct 29
            - generic:
              - link:
                - /url: /dashboard/event-calendar
                - text: View more
                - img
        - generic:
          - generic:
            - heading [level=3]: Asset Allocation
            - generic:
              - generic:
                - generic:
                  - generic:
                    - application
                - generic:
                  - generic: $972.9K
                  - generic: Total
              - list:
                - listitem:
                  - generic:
                    - generic: Equity
                  - generic:
                    - generic: $87,746
                    - generic: 9.02%
                - listitem:
                  - generic:
                    - generic: Cash
                  - generic:
                    - generic: $1,000
                    - generic: 0.10%
                - listitem:
                  - generic:
                    - generic: Options (Net)
                  - generic:
                    - generic: $8,841
                    - generic: 0.91%
          - generic:
            - heading [level=3]: Option Strategy Breakdown
            - paragraph: Total Options (Net)
            - paragraph: $8,841
            - generic:
              - generic: Strategy
              - generic: Market Value
              - generic: "% of Portfolio"
            - list:
              - listitem:
                - generic: Covered Calls
                - generic:
                  - generic: $0.00
                - generic: 0.00%
              - listitem:
                - generic: Cash Secured Puts
                - generic:
                  - generic: $0.00
                - generic: 0.00%
              - listitem:
                - generic: Protective Puts
                - generic:
                  - generic: +$7,998.78
                - generic: +0.82%
              - listitem:
                - generic: Long Calls
                - generic:
                  - generic: +$745.17
                - generic: +0.08%
              - listitem:
                - generic: Other Strategies
                - generic:
                  - generic: +$97.47
                - generic: +0.01%
            - generic:
              - link:
                - /url: /dashboard/options-research
                - text: View option exposure
                - img
          - generic:
            - heading [level=3]: Broker Accounts
            - generic:
              - generic:
                - generic: Broker
                - generic: Last Refresh
                - generic: Market Value
                - generic: "% of Total"
              - list:
                - listitem:
                  - generic:
                    - img: ME
                    - generic: Manual entry
                  - generic: —
                  - generic: $972,888
                  - generic: 100.0%
              - generic:
                - generic: Total (1 Broker)
                - generic: $972,888
                - generic: 100%
            - generic:
              - link:
                - /url: /dashboard/accounts
                - text: Manage Accounts
                - img
        - generic:
          - generic:
            - generic:
              - heading [level=3]: Top 10 Opportunities
              - paragraph: AI-powered option overlay strategies for your portfolio.
              - generic:
                - table:
                  - rowgroup:
                    - row:
                      - columnheader: "#"
                      - columnheader: Symbol
                      - columnheader: Strategy
                      - columnheader: Expiry (DTE)
                      - columnheader: Strike
                      - columnheader: Premium
                      - columnheader: Yield%
                      - columnheader: Assign. %
                  - rowgroup:
                    - row:
                      - cell: "1"
                      - cell: CB
                      - cell:
                        - generic: CSP
                      - cell:
                        - text: Oct 16, 2026
                        - generic: (8 DTE)
                      - cell: $330
                      - cell: $4.85
                      - cell: 12.5%
                      - cell: 30%
                    - row:
                      - cell: "2"
                      - cell: FICO
                      - cell:
                        - generic: CSP
                      - cell:
                        - text: Oct 16, 2026
                        - generic: (8 DTE)
                      - cell: $1,040
                      - cell: $44.30
                      - cell: 36.2%
                      - cell: 99%
                    - row:
                      - cell: "3"
                      - cell: CB
                      - cell:
                        - generic: CSP
                      - cell:
                        - text: Nov 20, 2026
                        - generic: (43 DTE)
                      - cell: $320
                      - cell: $5.35
                      - cell: 13.3%
                      - cell: 24%
                    - row:
                      - cell: "4"
                      - cell: FICO
                      - cell:
                        - generic: CSP
                      - cell:
                        - text: Nov 20, 2026
                        - generic: (43 DTE)
                      - cell: $600
                      - cell: $27.00
                      - cell: 36.5%
                      - cell: 25%
              - generic:
                - generic:
                  - generic: CC
                  - text: Covered Call
                - generic:
                  - generic: CSP
                  - text: Cash Secured Put
                - generic:
                  - generic: PP
                  - text: Protective Put
                - generic:
                  - generic: LC
                  - text: Long Call
              - generic:
                - link:
                  - /url: /dashboard/opportunities
                  - text: View all opportunities
                  - img
          - generic:
            - generic:
              - generic:
                - generic:
                  - heading [level=3]: Option Expiry Overview
                  - paragraph: Open contracts expiring in the next 6 weeks
                - generic:
                  - generic: OTM
                  - generic: NTM
                  - generic: ATM
                  - generic: ITM
              - generic:
                - generic:
                  - button: Short Options
                  - button: Long Options
                - generic:
                  - button [pressed]: Call
                  - button: Put
              - paragraph: No short call options expiring in the next 6 weeks
        - generic:
          - generic:
            - generic:
              - paragraph: OolTool Performance
              - img
            - paragraph: How much value OolTool's suggestions have generated — separate from your portfolio's own gains.
            - generic:
              - generic:
                - generic:
                  - img
                  - paragraph: Opportunities Executed
                - paragraph: 0 / 0
                - paragraph: No scenarios yet
              - generic:
                - generic:
                  - img
                  - paragraph: Premium Generated
                - paragraph: $0
                - paragraph: From executed scenarios
              - generic:
                - generic:
                  - img
                  - paragraph: Successful Opportunities
                - paragraph: 0 / 0
                - paragraph: None settled yet
            - generic:
              - generic: "Covered Calls: 0"
              - generic: "Cash-Secured Puts: 0"
              - generic: "Other: 0"
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
  - dialog "Connect a broker" [ref=e2]:
    - generic [ref=e3]:
      - heading "Connect a broker" [level=2] [ref=e4]
      - paragraph [ref=e5]: Securely connect your brokerage to sync your portfolio for personalized analytics and alerts.
    - generic [ref=e6]:
      - img
      - textbox "Search brokers" [active] [ref=e7]
    - generic [ref=e8]:
      - paragraph [ref=e9]: Available brokers
      - generic [ref=e10]:
        - button "MooMoo logo MooMoo" [ref=e11]:
          - img "MooMoo logo" [ref=e12]: MO
          - generic [ref=e13]: MooMoo
          - img [ref=e14]
        - button "Fidelity logo Fidelity" [ref=e16]:
          - img "Fidelity logo" [ref=e17]: FI
          - generic [ref=e18]: Fidelity
          - img [ref=e19]
        - button "Charles Schwab logo Charles Schwab" [ref=e21]:
          - img "Charles Schwab logo" [ref=e22]: CS
          - generic [ref=e23]: Charles Schwab
          - img [ref=e24]
        - button "Citi logo Citi" [ref=e26]:
          - img "Citi logo" [ref=e27]: CI
          - generic [ref=e28]: Citi
          - img [ref=e29]
        - button "Robinhood logo Robinhood" [ref=e31]:
          - img "Robinhood logo" [ref=e32]: RO
          - generic [ref=e33]: Robinhood
          - img [ref=e34]
        - button "E*TRADE logo E*TRADE" [ref=e36]:
          - img "E*TRADE logo" [ref=e37]: E*
          - generic [ref=e38]: E*TRADE
          - img [ref=e39]
        - button "Interactive Brokers logo Interactive Brokers" [ref=e41]:
          - img "Interactive Brokers logo" [ref=e42]: IB
          - generic [ref=e43]: Interactive Brokers
          - img [ref=e44]
        - button "Trading 212 Practice logo Trading 212 Practice" [ref=e46]:
          - img "Trading 212 Practice logo" [ref=e47]: T2
          - generic [ref=e48]: Trading 212 Practice
          - img [ref=e49]
        - button "Alpaca Paper logo Alpaca Paper" [ref=e51]:
          - img "Alpaca Paper logo" [ref=e52]: AP
          - generic [ref=e53]: Alpaca Paper
          - img [ref=e54]
        - button "Alpaca logo Alpaca" [ref=e56]:
          - img "Alpaca logo" [ref=e57]: AL
          - generic [ref=e58]: Alpaca
          - img [ref=e59]
        - button "More banks & brokers…" [ref=e61]:
          - img [ref=e63]
          - generic [ref=e65]: More banks & brokers…
          - img [ref=e66]
    - generic [ref=e68]:
      - img [ref=e70]
      - list [ref=e72]:
        - listitem [ref=e73]: Your password stays with your broker. We never see your login or KYC.
        - listitem [ref=e74]: We only read the portfolio you choose to connect.
        - listitem [ref=e75]: OolTool does not hold or move your money.
    - paragraph [ref=e76]:
      - text: Broker not listed?
      - button "Bulk Upload" [ref=e77]
      - text: or
      - button "Enter Manually" [ref=e78]
    - button "Close" [ref=e79]:
      - img [ref=e80]
      - generic [ref=e83]: Close
```

# Test source

```ts
  1   | import {
  2   |   expect,
  3   |   Page
  4   | } from '@playwright/test';
  5   | 
  6   | import {
  7   |   BASE_URL
  8   | } from './config/testData';
  9   | 
  10  | import { DashboardPage }
  11  |   from './pages/DashboardPage';
  12  | 
  13  | import { test }
  14  |   from './fixtures/subscriberAuth';
  15  | 
  16  | import { safeClick }
  17  |   from './helpers/safeClick';
  18  | 
  19  | /* =============================================================================
  20  | TEST SUITE: Dashboard options
  21  | 
  22  | PURPOSE
  23  | -------
  24  | Opens every plus-menu and profile-menu choice. Sign out is left unclicked
  25  | so the session stays signed in. Dialogs are closed without saving.
  26  | 
  27  | RUN
  28  | ---
  29  | npx playwright test tests/DashboardOptions.spec.ts --reporter=line
  30  | ============================================================================= */
  31  | 
  32  | test.describe(
  33  |   'Dashboard options',
  34  |   () => {
  35  | 
  36  |     test.describe.configure({
  37  |       timeout: 240000
  38  |     });
  39  | 
  40  |     async function openDashboard(
  41  |       page: Page
  42  |     ) {
  43  |       const dashboard =
  44  |         new DashboardPage(
  45  |           page
  46  |         );
  47  | 
  48  |       await page.goto(
  49  |         `${BASE_URL}/dashboard`,
  50  |         {
  51  |           waitUntil: 'domcontentloaded'
  52  |         }
  53  |       );
  54  | 
  55  |       await dashboard.validateLoaded();
  56  |     }
  57  | 
  58  |     function skipOption(
  59  |       label: string
  60  |     ) {
  61  |       return /sign out|log out|disconnect|delete|remove/i.test(
  62  |         label
  63  |       );
  64  |     }
  65  | 
  66  |     async function optionNames(
  67  |       page: Page
  68  |     ) {
  69  |       const items =
  70  |         page.getByRole(
  71  |           'menuitem'
  72  |         );
  73  | 
  74  |       await expect(
  75  |         items.first()
> 76  |       ).toBeVisible({
      |         ^ Error: expect(locator).toBeVisible() failed
  77  |         timeout: 10000
  78  |       });
  79  | 
  80  |       return (
  81  |         await items.allInnerTexts()
  82  |       ).map(
  83  |         (name) =>
  84  |           name.replace(
  85  |             /\s+/g,
  86  |             ' '
  87  |           ).trim()
  88  |       ).filter(
  89  |         Boolean
  90  |       );
  91  |     }
  92  | 
  93  |     async function openOption(
  94  |       page: Page,
  95  |       label: string
  96  |     ) {
  97  |       await safeClick(
  98  |         page.getByRole(
  99  |           'menuitem',
  100 |           {
  101 |             name: new RegExp(
  102 |               `^${label.replace(
  103 |                 /[.*+?^${}()|[\]\\]/g,
  104 |                 '\\$&'
  105 |               )}$`,
  106 |               'i'
  107 |             )
  108 |           }
  109 |         ).first(),
  110 |         label
  111 |       );
  112 | 
  113 |       const dialog =
  114 |         page.getByRole(
  115 |           'dialog'
  116 |         );
  117 | 
  118 |       if (
  119 |         await dialog.waitFor({
  120 |           state: 'visible',
  121 |           timeout: 4000
  122 |         }).then(
  123 |           () => true
  124 |         ).catch(
  125 |           () => false
  126 |         )
  127 |       ) {
  128 |         await expect(
  129 |           dialog
  130 |         ).toContainText(
  131 |           /.+/
  132 |         );
  133 | 
  134 |         await page.keyboard.press(
  135 |           'Escape'
  136 |         );
  137 | 
  138 |         return;
  139 |       }
  140 | 
  141 |       await expect(
  142 |         page.locator(
  143 |           'main, body'
  144 |         ).first()
  145 |       ).toContainText(
  146 |         /.+/,
  147 |         {
  148 |           timeout: 15000
  149 |         }
  150 |       );
  151 |     }
  152 | 
  153 |     test(
  154 |       'Plus menu opens every add option',
  155 |       async ({ page }) => {
  156 |         await openDashboard(
  157 |           page
  158 |         );
  159 | 
  160 |         await safeClick(
  161 |           page.locator(
  162 |             'header button:has(svg.lucide-plus), button:has(svg.lucide-plus)'
  163 |           ).first(),
  164 |           'Open plus menu'
  165 |         );
  166 | 
  167 |         const names =
  168 |           await optionNames(
  169 |             page
  170 |           );
  171 | 
  172 |         expect(
  173 |           names.length
  174 |         ).toBeGreaterThan(
  175 |           0
  176 |         );
```