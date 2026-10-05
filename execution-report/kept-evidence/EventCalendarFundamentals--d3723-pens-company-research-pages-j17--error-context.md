# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: EventCalendarFundamentals.spec.ts >> Event Calendar and Company Fundamentals >> A day filters by symbol and opens company research pages
- Location: tests\EventCalendarFundamentals.spec.ts:189:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /company fundamentals/i }).or(getByRole('heading', { name: /equity research/i }))
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for getByRole('heading', { name: /company fundamentals/i }).or(getByRole('heading', { name: /equity research/i }))
    - waiting for" https://uat.ooltool.com/dashboard/company-fundamentals?symbol=ABBV" navigation to finish...
    - navigated to "https://uat.ooltool.com/dashboard/company-fundamentals?symbol=ABBV"

```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
  1   | import {
  2   |   expect
  3   | } from '@playwright/test';
  4   | 
  5   | import { BasePage }
  6   |   from './BasePage';
  7   | 
  8   | import { safeClick }
  9   |   from '../helpers/safeClick';
  10  | 
  11  | import { Logger }
  12  |   from '../utils/logger';
  13  | 
  14  | /* =============================================================================
  15  | PAGE OBJECT: CompanyFundamentalsPage
  16  | 
  17  | PURPOSE
  18  | -------
  19  | A calendar event opens one company. Search loads a symbol, and Overview,
  20  | Valuation, Earnings, Dividends, News, Finance, Analyze options, and Event
  21  | calendar stay on that company.
  22  | ============================================================================= */
  23  | 
  24  | const TAB_CONTENT: Record<string, RegExp> = {
  25  |   Overview:
  26  |     /about the company|price history|market cap|52-week|p\/e/i,
  27  |   Valuation:
  28  |     /valuation|multiple|book|fair value|p\/b|enterprise/i,
  29  |   Earnings:
  30  |     /earnings|eps|revenue|income/i,
  31  |   Dividends:
  32  |     /dividend|yield|payout|ex-div/i,
  33  |   News:
  34  |     /news|headline|article|story|reported/i
  35  | };
  36  | 
  37  | export class CompanyFundamentalsPage
  38  |   extends BasePage {
  39  | 
  40  |   async openFromEvent(
  41  |     symbol: string
  42  |   ) {
  43  |     const fundamentals =
  44  |       this.page.getByRole(
  45  |         'heading',
  46  |         {
  47  |           name: /company fundamentals/i
  48  |         }
  49  |       );
  50  | 
  51  |     const equityResearch =
  52  |       this.page.getByRole(
  53  |         'heading',
  54  |         {
  55  |           name: /equity research/i
  56  |         }
  57  |       );
  58  | 
  59  |     await expect(
  60  |       fundamentals.or(
  61  |         equityResearch
  62  |       )
> 63  |     ).toBeVisible({
      |       ^ Error: expect(locator).toBeVisible() failed
  64  |       timeout: 20000
  65  |     });
  66  | 
  67  |     if (
  68  |       await equityResearch.isVisible().catch(
  69  |         () => false
  70  |       )
  71  |     ) {
  72  |       const input =
  73  |         this.page.getByRole(
  74  |           'combobox',
  75  |           {
  76  |             name: /search company name or symbol|search symbol/i
  77  |           }
  78  |         );
  79  | 
  80  |       await input.fill(
  81  |         symbol
  82  |       );
  83  | 
  84  |       const choice =
  85  |         this.page.getByRole(
  86  |           'option',
  87  |           {
  88  |             name: new RegExp(
  89  |               symbol,
  90  |               'i'
  91  |             )
  92  |           }
  93  |         ).first();
  94  | 
  95  |       const choiceReady =
  96  |         await choice.waitFor({
  97  |           state: 'visible',
  98  |           timeout: 4000
  99  |         }).then(
  100 |           () => true
  101 |         ).catch(
  102 |           () => false
  103 |         );
  104 | 
  105 |       if (
  106 |         choiceReady
  107 |       ) {
  108 |         await safeClick(
  109 |           choice,
  110 |           `Select ${symbol}`
  111 |         );
  112 |       }
  113 | 
  114 |       await safeClick(
  115 |         this.page.getByRole(
  116 |           'button',
  117 |           {
  118 |             name: /^analyze$/i
  119 |           }
  120 |         ),
  121 |         `Analyze ${symbol}`
  122 |       );
  123 | 
  124 |       const fundamentalsLink =
  125 |         this.page.getByRole(
  126 |           'link',
  127 |           {
  128 |             name: /company fundamentals/i
  129 |           }
  130 |         );
  131 | 
  132 |       if (
  133 |         await fundamentalsLink.isVisible({
  134 |           timeout: 15000
  135 |         }).catch(
  136 |           () => false
  137 |         )
  138 |       ) {
  139 |         await safeClick(
  140 |           fundamentalsLink,
  141 |           'Open company fundamentals'
  142 |         );
  143 |       }
  144 |     }
  145 |   }
  146 | 
  147 |   async validateLoaded(
  148 |     symbol: string
  149 |   ) {
  150 |     Logger.info(
  151 |       `Validating fundamentals for ${symbol}`
  152 |     );
  153 | 
  154 |     await expect(
  155 |       this.page.getByRole(
  156 |         'heading',
  157 |         {
  158 |           name: /company fundamentals|equity research/i
  159 |         }
  160 |       ).or(
  161 |         this.page.getByRole(
  162 |           'heading',
  163 |           {
```