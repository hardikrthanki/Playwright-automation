# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardPositionActions.spec.ts >> Account and position prompts >> Delete and disconnect confirmations can be cancelled
- Location: tests\DashboardPositionActions.spec.ts:41:9

# Error details

```
TimeoutError: page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "https://uat.ooltool.com/dashboard", waiting until "domcontentloaded"

```

# Test source

```ts
  1   | import {
  2   |   BASE_URL
  3   | } from './config/testData';
  4   | 
  5   | import { AccountsPage }
  6   |   from './pages/AccountsPage';
  7   | 
  8   | import { DashboardPage }
  9   |   from './pages/DashboardPage';
  10  | 
  11  | import { PortfolioPage }
  12  |   from './pages/PortfolioPage';
  13  | 
  14  | import { test }
  15  |   from './fixtures/subscriberAuth';
  16  | 
  17  | import { safeClick }
  18  |   from './helpers/safeClick';
  19  | 
  20  | /* =============================================================================
  21  | TEST SUITE: Account and position prompts
  22  | 
  23  | PURPOSE
  24  | -------
  25  | Manage Accounts opens delete and disconnect confirmations. View positions
  26  | opens edit and delete. Each prompt is cancelled, so nothing is removed.
  27  | 
  28  | RUN
  29  | ---
  30  | npx playwright test tests/DashboardPositionActions.spec.ts --reporter=line
  31  | ============================================================================= */
  32  | 
  33  | test.describe(
  34  |   'Account and position prompts',
  35  |   () => {
  36  | 
  37  |     test.describe.configure({
  38  |       timeout: 180000
  39  |     });
  40  | 
  41  |     test(
  42  |       'Delete and disconnect confirmations can be cancelled',
  43  |       async ({ page }) => {
  44  |         const dashboard =
  45  |           new DashboardPage(
  46  |             page
  47  |           );
  48  | 
  49  |         const accounts =
  50  |           new AccountsPage(
  51  |             page
  52  |           );
  53  | 
> 54  |         await page.goto(
      |                    ^ TimeoutError: page.goto: Timeout 30000ms exceeded.
  55  |           `${BASE_URL}/dashboard`,
  56  |           {
  57  |             waitUntil: 'domcontentloaded'
  58  |           }
  59  |         );
  60  | 
  61  |         await dashboard.validateLoaded();
  62  | 
  63  |         await safeClick(
  64  |           page.getByRole(
  65  |             'link',
  66  |             {
  67  |               name: /manage accounts/i
  68  |             }
  69  |           ).first(),
  70  |           'Manage accounts'
  71  |         );
  72  | 
  73  |         await accounts.validateLoaded();
  74  |         await accounts.verifyDeleteAndDisconnect();
  75  |       }
  76  |     );
  77  | 
  78  |     test(
  79  |       'Edit and delete position prompts can be cancelled',
  80  |       async ({ page }) => {
  81  |         const dashboard =
  82  |           new DashboardPage(
  83  |             page
  84  |           );
  85  | 
  86  |         const accounts =
  87  |           new AccountsPage(
  88  |             page
  89  |           );
  90  | 
  91  |         const portfolio =
  92  |           new PortfolioPage(
  93  |             page
  94  |           );
  95  | 
  96  |         await page.goto(
  97  |           `${BASE_URL}/dashboard`,
  98  |           {
  99  |             waitUntil: 'domcontentloaded'
  100 |           }
  101 |         );
  102 | 
  103 |         await dashboard.validateLoaded();
  104 | 
  105 |         await safeClick(
  106 |           page.getByRole(
  107 |             'link',
  108 |             {
  109 |               name: /manage accounts/i
  110 |             }
  111 |           ).first(),
  112 |           'Manage accounts'
  113 |         );
  114 | 
  115 |         await accounts.validateLoaded();
  116 |         await accounts.openPositions();
  117 |         await portfolio.validateLoaded();
  118 |         await portfolio.verifyEditAndDelete();
  119 |       }
  120 |     );
  121 |   }
  122 | );
  123 | 
```