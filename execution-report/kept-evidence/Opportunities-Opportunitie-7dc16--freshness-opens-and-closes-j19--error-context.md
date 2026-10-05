# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Opportunities.spec.ts >> Opportunities >> About CTA data freshness opens and closes
- Location: tests\Opportunities.spec.ts:380:9

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /about cta data freshness|data freshness|delayed prices|^delayed$/i }) to be visible

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
          - link "Opportunities" [active] [ref=e12] [cursor=pointer]:
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
          - button "Prices are delayed, not live market prices. Portfolio value and P&L come from your broker, so they can differ from your broker's dashboard." [ref=e26]: Delayed
          - button "Sync all" [ref=e27] [cursor=pointer]:
            - img
            - generic [ref=e28]: Sync all
          - button "Add options" [ref=e29] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e30] [cursor=pointer]:
            - img [ref=e31]
            - generic [ref=e34]: "18"
          - button "HT" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: HT
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - generic [ref=e41]:
            - generic [ref=e42]:
              - heading "Opportunities" [level=1] [ref=e43]
              - button "About opportunities" [ref=e44]:
                - img [ref=e45]
            - paragraph [ref=e47]: CTAs for your open positions and watchlist
          - button "How Opportunities work" [ref=e49] [cursor=pointer]:
            - img
            - text: How Opportunities work
        - generic [ref=e51]:
          - generic [ref=e52]:
            - generic [ref=e53]: Symbol
            - generic [ref=e54]:
              - img
              - combobox "Search any symbol" [ref=e55]
          - combobox [ref=e56]:
            - generic: All Strategies
            - img
          - combobox [ref=e57]:
            - generic: "Source: All"
            - img
          - combobox [ref=e58]:
            - generic: "Expiry: All"
            - img
          - combobox [ref=e59]:
            - generic: "Cost Basis: All"
            - img
          - button "Filters" [ref=e60] [cursor=pointer]:
            - img
            - text: Filters
          - button "Save View" [ref=e61] [cursor=pointer]
          - button "Saved Views" [ref=e62]
        - generic [ref=e65]:
          - generic [ref=e66]:
            - img [ref=e67]
            - generic [ref=e69]: "Your risk:"
            - generic [ref=e70]: Moderate (4–6)
            - generic [ref=e71]: ·
            - link "Details →" [ref=e72] [cursor=pointer]:
              - /url: /dashboard/risk-compliance
          - generic [ref=e73]:
            - button "Conservative (1–3) 3" [ref=e74]:
              - generic [ref=e76]:
                - text: Conservative
                - generic [ref=e77]: (1–3)
              - generic [ref=e78]: "3"
            - button "Moderate (4–6) 4" [pressed] [ref=e79]:
              - generic [ref=e81]:
                - text: Moderate
                - generic [ref=e82]: (4–6)
              - generic [ref=e83]: "4"
            - button "Growth (7–8) 5" [disabled] [ref=e84]:
              - generic [ref=e85]:
                - img [ref=e86]
                - generic [ref=e89]:
                  - text: Growth
                  - generic [ref=e90]: (7–8)
              - generic [ref=e91]: "5"
            - button "Aggressive (9–10) 5" [disabled] [ref=e92]:
              - generic [ref=e93]:
                - img [ref=e94]
                - generic [ref=e97]:
                  - text: Aggressive
                  - generic [ref=e98]: (9–10)
              - generic [ref=e99]: "5"
          - generic [ref=e100]:
            - generic [ref=e101]: Viewing Moderate risk
            - generic [ref=e102]: ·
            - link "Change profile →" [ref=e103] [cursor=pointer]:
              - /url: /dashboard/risk-compliance
        - generic [ref=e104]:
          - generic [ref=e105]:
            - generic [ref=e106]: Growth risk
            - generic [ref=e108]: Moderate risk
            - generic [ref=e110]: Aggressive risk
            - generic [ref=e112]: Conservative risk
            - generic [ref=e114]:
              - generic [ref=e115]: E
              - text: Earnings
            - generic [ref=e116]:
              - generic [ref=e117]: D
              - text: Dividend
            - generic [ref=e118]:
              - img [ref=e119]
              - text: Watching (opportunity watch)
            - generic [ref=e122]:
              - generic [ref=e123]: P
              - text: Position Taken (in Your Status)
            - button "Legend notes" [ref=e124]:
              - img [ref=e125]
          - generic [ref=e127]:
            - generic [ref=e128]: "Sort by:"
            - combobox [ref=e129]:
              - generic: Expiry (Soonest)
              - img
        - table [ref=e132]:
          - rowgroup [ref=e133]:
            - row "Symbol Strategy Expiry (DTE) Strike Last price Premium * Premium per contract Est. Return % Range +/- % Range for Premium Assign. Risk AD ± 0.10×(score/4) Equity Events Opp. Status Shows if this opportunity is New, Updated, Active, or Closed. On Hold isn’t used yet. Your Status Opportunity watch (date and underlying price at watch time) plus matching option holdings (Buy/Sell aggregated across broker and manual). Actions" [ref=e134]:
              - columnheader "Symbol" [ref=e135]:
                - button "Symbol" [ref=e137]:
                  - text: Symbol
                  - img [ref=e138]
              - columnheader "Strategy" [ref=e141]:
                - button "Strategy" [ref=e143]:
                  - text: Strategy
                  - img [ref=e144]
              - columnheader "Expiry (DTE)" [ref=e147]:
                - button "Expiry (DTE)" [ref=e149]:
                  - text: Expiry (DTE)
                  - img [ref=e150]
              - columnheader "Strike" [ref=e152]:
                - button "Strike" [ref=e154]:
                  - text: Strike
                  - img [ref=e155]
              - columnheader "Last price" [ref=e158]
              - columnheader "Premium * Premium per contract" [ref=e159]:
                - generic [ref=e160]:
                  - button "Premium" [ref=e161]:
                    - text: Premium
                    - img [ref=e162]
                  - button "* Premium per contract" [ref=e165]:
                    - img [ref=e166]
              - columnheader "Est. Return" [ref=e168]:
                - button "Est. Return" [ref=e170]:
                  - text: Est. Return
                  - img [ref=e171]
              - columnheader "% Range +/- % Range for Premium" [ref=e174]:
                - generic [ref=e175]:
                  - text: "% Range"
                  - button "+/- % Range for Premium" [ref=e176]:
                    - img [ref=e177]
              - columnheader "Assign. Risk AD ± 0.10×(score/4)" [ref=e179]:
                - generic [ref=e180]:
                  - button "Assign. Risk" [ref=e181]:
                    - text: Assign. Risk
                    - img [ref=e182]
                  - button "AD ± 0.10×(score/4)" [ref=e185]:
                    - img [ref=e186]
              - columnheader "Equity" [ref=e188]
              - columnheader "Events" [ref=e189]
              - columnheader "Opp. Status Shows if this opportunity is New, Updated, Active, or Closed. On Hold isn’t used yet." [ref=e190]:
                - generic [ref=e191]:
                  - text: Opp. Status
                  - button "Shows if this opportunity is New, Updated, Active, or Closed. On Hold isn’t used yet." [ref=e192]:
                    - img [ref=e193]
              - columnheader "Your Status Opportunity watch (date and underlying price at watch time) plus matching option holdings (Buy/Sell aggregated across broker and manual)." [ref=e195]:
                - generic [ref=e196]:
                  - text: Your Status
                  - button "Opportunity watch (date and underlying price at watch time) plus matching option holdings (Buy/Sell aggregated across broker and manual)." [ref=e197]:
                    - img [ref=e198]
              - columnheader "Actions" [ref=e200]
          - rowgroup [ref=e201]:
            - row "Moderate Opportunities 4 Balanced growth and income with moderate risk" [ref=e202]:
              - cell "Moderate Opportunities 4 Balanced growth and income with moderate risk" [ref=e203]:
                - generic [ref=e204]:
                  - generic [ref=e205]: Moderate Opportunities 4
                  - generic [ref=e206]: Balanced growth and income with moderate risk
            - row "Moderate risk CB Chubb Ltd Cash Secured Put Sell to Open Oct 16, 2026 11 DTE $330.00 $330.89 $4.85 (1.47%) +12.50% ±1.96% 44% 236 sh @ $1,200.00 Oct 20 New Sep 4, 2026, 10:23 AM Not Watching Row actions" [ref=e207]:
              - cell "Moderate risk CB Chubb Ltd" [ref=e208]:
                - generic [ref=e209]:
                  - generic "Moderate risk" [ref=e210]
                  - generic [ref=e211]:
                    - paragraph [ref=e212]: CB
                    - paragraph [ref=e213]: Chubb Ltd
              - cell "Cash Secured Put Sell to Open" [ref=e214]:
                - paragraph [ref=e215]: Cash Secured Put
                - paragraph [ref=e216]: Sell to Open
              - cell "Oct 16, 2026 11 DTE" [ref=e217]:
                - paragraph [ref=e218]: Oct 16, 2026
                - paragraph [ref=e219]: 11 DTE
              - cell "$330.00" [ref=e220]
              - cell "$330.89" [ref=e221]
              - cell "$4.85 (1.47%)" [ref=e222]:
                - paragraph [ref=e223]: $4.85
                - paragraph [ref=e224]: (1.47%)
              - cell "+12.50%" [ref=e225]
              - cell "±1.96%" [ref=e226]
              - cell "44%" [ref=e227]
              - cell "236 sh @ $1,200.00" [ref=e228]:
                - paragraph [ref=e229]: 236 sh
                - paragraph [ref=e230]: "@ $1,200.00"
              - cell "Oct 20" [ref=e231]:
                - generic [ref=e233]:
                  - generic [ref=e234]: E
                  - generic [ref=e235]: Oct 20
              - cell "New Sep 4, 2026, 10:23 AM" [ref=e236]:
                - generic [ref=e237]:
                  - generic [ref=e238]: New
                  - paragraph [ref=e239]: Sep 4, 2026, 10:23 AM
              - cell "Not Watching" [ref=e240]:
                - generic [ref=e243]:
                  - img [ref=e244]
                  - generic [ref=e247]: Not Watching
              - cell "Row actions" [ref=e248]:
                - button "Row actions" [ref=e249] [cursor=pointer]:
                  - img
                  - generic [ref=e250]: Row actions
            - row "Moderate risk FICO Fair Isaac Corporation Cash Secured Put Sell to Open Oct 16, 2026 11 DTE $1,040.00 $661.35 $44.30 (4.26%) +36.20% ±7.58% 97% 2 sh @ $10.00 Nov 4 New Sep 4, 2026, 10:24 AM Not Watching Row actions" [ref=e251]:
              - cell "Moderate risk FICO Fair Isaac Corporation" [ref=e252]:
                - generic [ref=e253]:
                  - generic "Moderate risk" [ref=e254]
                  - generic [ref=e255]:
                    - paragraph [ref=e256]: FICO
                    - paragraph [ref=e257]: Fair Isaac Corporation
              - cell "Cash Secured Put Sell to Open" [ref=e258]:
                - paragraph [ref=e259]: Cash Secured Put
                - paragraph [ref=e260]: Sell to Open
              - cell "Oct 16, 2026 11 DTE" [ref=e261]:
                - paragraph [ref=e262]: Oct 16, 2026
                - paragraph [ref=e263]: 11 DTE
              - cell "$1,040.00" [ref=e264]
              - cell "$661.35" [ref=e265]
              - cell "$44.30 (4.26%)" [ref=e266]:
                - paragraph [ref=e267]: $44.30
                - paragraph [ref=e268]: (4.26%)
              - cell "+36.20%" [ref=e269]
              - cell "±7.58%" [ref=e270]
              - cell "97%" [ref=e271]
              - cell "2 sh @ $10.00" [ref=e272]:
                - paragraph [ref=e273]: 2 sh
                - paragraph [ref=e274]: "@ $10.00"
              - cell "Nov 4" [ref=e275]:
                - generic [ref=e277]:
                  - generic [ref=e278]: E
                  - generic [ref=e279]: Nov 4
              - cell "New Sep 4, 2026, 10:24 AM" [ref=e280]:
                - generic [ref=e281]:
                  - generic [ref=e282]: New
                  - paragraph [ref=e283]: Sep 4, 2026, 10:24 AM
              - cell "Not Watching" [ref=e284]:
                - generic [ref=e287]:
                  - img [ref=e288]
                  - generic [ref=e291]: Not Watching
              - cell "Row actions" [ref=e292]:
                - button "Row actions" [ref=e293] [cursor=pointer]:
                  - img
                  - generic [ref=e294]: Row actions
            - row "Moderate risk CB Chubb Ltd Covered Call Sell to Open Nov 20, 2026 46 DTE $345.00 $330.89 $5.55 (1.61%) +12.50% ±1.96% 33% 236 sh @ $1,200.00 Oct 20 Updated Oct 2, 2026, 8:00 PM Not Watching Row actions" [ref=e295]:
              - cell "Moderate risk CB Chubb Ltd" [ref=e296]:
                - generic [ref=e297]:
                  - generic "Moderate risk" [ref=e298]
                  - generic [ref=e299]:
                    - paragraph [ref=e300]: CB
                    - paragraph [ref=e301]: Chubb Ltd
              - cell "Covered Call Sell to Open" [ref=e302]:
                - paragraph [ref=e303]: Covered Call
                - paragraph [ref=e304]: Sell to Open
              - cell "Nov 20, 2026 46 DTE" [ref=e305]:
                - paragraph [ref=e306]: Nov 20, 2026
                - paragraph [ref=e307]: 46 DTE
              - cell "$345.00" [ref=e308]
              - cell "$330.89" [ref=e309]
              - cell "$5.55 (1.61%)" [ref=e310]:
                - paragraph [ref=e311]: $5.55
                - paragraph [ref=e312]: (1.61%)
              - cell "+12.50%" [ref=e313]
              - cell "±1.96%" [ref=e314]
              - cell "33%" [ref=e315]
              - cell "236 sh @ $1,200.00" [ref=e316]:
                - paragraph [ref=e317]: 236 sh
                - paragraph [ref=e318]: "@ $1,200.00"
              - cell "Oct 20" [ref=e319]:
                - generic [ref=e321]:
                  - generic [ref=e322]: E
                  - generic [ref=e323]: Oct 20
              - cell "Updated Oct 2, 2026, 8:00 PM" [ref=e324]:
                - generic [ref=e325]:
                  - generic [ref=e326]: Updated
                  - paragraph [ref=e327]: Oct 2, 2026, 8:00 PM
              - cell "Not Watching" [ref=e328]:
                - generic [ref=e331]:
                  - img [ref=e332]
                  - generic [ref=e335]: Not Watching
              - cell "Row actions" [ref=e336]:
                - button "Row actions" [ref=e337] [cursor=pointer]:
                  - img
                  - generic [ref=e338]: Row actions
            - row "Moderate risk FICO Fair Isaac Corporation Cash Secured Put Sell to Open Nov 20, 2026 46 DTE $500.00 $661.35 $10.00 (2.00%) +14.90% ±7.58% 12% 2 sh @ $10.00 Nov 4 Updated Oct 2, 2026, 8:01 PM Not Watching Row actions" [ref=e339]:
              - cell "Moderate risk FICO Fair Isaac Corporation" [ref=e340]:
                - generic [ref=e341]:
                  - generic "Moderate risk" [ref=e342]
                  - generic [ref=e343]:
                    - paragraph [ref=e344]: FICO
                    - paragraph [ref=e345]: Fair Isaac Corporation
              - cell "Cash Secured Put Sell to Open" [ref=e346]:
                - paragraph [ref=e347]: Cash Secured Put
                - paragraph [ref=e348]: Sell to Open
              - cell "Nov 20, 2026 46 DTE" [ref=e349]:
                - paragraph [ref=e350]: Nov 20, 2026
                - paragraph [ref=e351]: 46 DTE
              - cell "$500.00" [ref=e352]
              - cell "$661.35" [ref=e353]
              - cell "$10.00 (2.00%)" [ref=e354]:
                - paragraph [ref=e355]: $10.00
                - paragraph [ref=e356]: (2.00%)
              - cell "+14.90%" [ref=e357]
              - cell "±7.58%" [ref=e358]
              - cell "12%" [ref=e359]
              - cell "2 sh @ $10.00" [ref=e360]:
                - paragraph [ref=e361]: 2 sh
                - paragraph [ref=e362]: "@ $10.00"
              - cell "Nov 4" [ref=e363]:
                - generic [ref=e365]:
                  - generic [ref=e366]: E
                  - generic [ref=e367]: Nov 4
              - cell "Updated Oct 2, 2026, 8:01 PM" [ref=e368]:
                - generic [ref=e369]:
                  - generic [ref=e370]: Updated
                  - paragraph [ref=e371]: Oct 2, 2026, 8:01 PM
              - cell "Not Watching" [ref=e372]:
                - generic [ref=e375]:
                  - img [ref=e376]
                  - generic [ref=e379]: Not Watching
              - cell "Row actions" [ref=e380]:
                - button "Row actions" [ref=e381] [cursor=pointer]:
                  - img
                  - generic [ref=e382]: Row actions
        - generic [ref=e383]:
          - generic [ref=e384]:
            - text: "Rows per page:"
            - combobox [ref=e385]:
              - generic: "10"
              - img
          - generic [ref=e386]:
            - paragraph [ref=e387]:
              - text: Showing
              - generic [ref=e388]: 1–4
              - text: of 4
            - navigation "Pagination" [ref=e389]:
              - button "First page" [disabled]:
                - img
              - button "Previous page" [disabled]:
                - img
              - button "Page 1" [ref=e390] [cursor=pointer]: "1"
              - button "Next page" [disabled]:
                - img
              - button "Last page" [disabled]:
                - img
    - contentinfo [ref=e391]:
      - generic [ref=e392]:
        - generic [ref=e393]:
          - paragraph [ref=e394]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e395]:
            - link "Privacy Policy" [ref=e397] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e398]:
              - generic [ref=e399]: ·
              - link "Terms of Service" [ref=e400] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e401]:
              - generic [ref=e402]: ·
              - link "Disclosures" [ref=e403] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e404]:
              - generic [ref=e405]: ·
              - link "Risk Warning" [ref=e406] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e407]:
              - generic [ref=e408]: ·
              - link "Contact" [ref=e409] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e410]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e411]
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
  77  |     });
  78  |   }
  79  | 
  80  |   const watchDelay =
  81  |     watchDelayMs();
  82  | 
  83  |   if (watchDelay > 0) {
  84  |     await locator.page().waitForTimeout(
  85  |       watchDelay
  86  |     );
  87  |   }
  88  | }
  89  | 
  90  | export async function openHeaderMenuItem(
  91  |   page: Page,
  92  |   menuName: RegExp,
  93  |   itemName: RegExp,
  94  |   label: string
  95  | ) {
  96  |   const menuButton =
  97  |     page.getByRole(
  98  |       'button',
  99  |       {
  100 |         name: menuName
  101 |       }
  102 |     ).first();
  103 | 
  104 |   const choices =
  105 |     () => [
  106 |       page.getByRole(
  107 |         'menuitem',
  108 |         {
  109 |           name: itemName
  110 |         }
  111 |       ).first(),
  112 |       page.getByRole(
  113 |         'option',
  114 |         {
  115 |           name: itemName
  116 |         }
  117 |       ).first(),
  118 |       page.getByRole(
  119 |         'link',
  120 |         {
  121 |           name: itemName
  122 |         }
  123 |       ).first()
  124 |     ];
  125 | 
  126 |   let visibleChoice: Locator | undefined;
  127 | 
  128 |   for (
  129 |     let attempt = 1;
  130 |     attempt <= 2 && !visibleChoice;
  131 |     attempt += 1
  132 |   ) {
  133 |     await safeClick(
  134 |       menuButton,
  135 |       `${label} menu`
  136 |     );
  137 | 
  138 |     for (const candidate of choices()) {
  139 |       if (
  140 |         await candidate.isVisible({
  141 |           timeout: 2000
  142 |         }).catch(
  143 |           () => false
  144 |         )
  145 |       ) {
  146 |         visibleChoice = candidate;
  147 |         break;
  148 |       }
```