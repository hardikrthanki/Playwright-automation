# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AuthUiValidation.spec.ts >> Auth UI Validation >> Forgot password back to login clears reset-only navigation state
- Location: tests\AuthUiValidation.spec.ts:410:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
TimeoutError: page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "https://uat.ooltool.com/login", waiting until "domcontentloaded"

```

# Test source

```ts
  1   | import {
  2   |   Page,
  3   |   Locator,
  4   |   expect
  5   | } from '@playwright/test';
  6   | 
  7   | import { BasePage }
  8   |   from './BasePage';
  9   | 
  10  | import { safeClick }
  11  |   from '../helpers/safeClick';
  12  | 
  13  | import { Logger }
  14  |   from '../utils/logger';
  15  | 
  16  | import {
  17  |   BASE_URL
  18  | } from '../config/testData';
  19  | 
  20  | /* =============================================================================
  21  | PAGE OBJECT: ForgotPasswordPage
  22  | 
  23  | PURPOSE
  24  | -------
  25  | Handles Forgot Password functionality.
  26  | 
  27  | FEATURES COVERED
  28  | ----------------
  29  | 1. Open Login Page
  30  | 2. Click Forgot Password
  31  | 3. Validate Forgot Password Redirect
  32  | 4. Submit Email
  33  | 5. Validate Reset Link Message
  34  | 6. Navigate Back To Login
  35  | 
  36  | ============================================================================= */
  37  | 
  38  | export class ForgotPasswordPage
  39  |   extends BasePage {
  40  | 
  41  |   readonly forgotPasswordLink: Locator;
  42  |   readonly emailInput: Locator;
  43  |   readonly sendResetButton: Locator;
  44  |   readonly backToLoginLink: Locator;
  45  | 
  46  |   constructor(page: Page) {
  47  | 
  48  |     super(page);
  49  | 
  50  |     this.forgotPasswordLink =
  51  |       page.getByRole(
  52  |         'link',
  53  |         {
  54  |           name: /forgot\s+(your\s+)?password/i
  55  |         }
  56  |       ).or(
  57  |         page.locator(
  58  |           'a[href*="forgot-password"]'
  59  |         )
  60  |       );
  61  | 
  62  |     this.emailInput =
  63  |       page.locator(
  64  |         'input[type="email"]'
  65  |       );
  66  | 
  67  |     this.sendResetButton =
  68  |       page.getByRole(
  69  |         'button',
  70  |         {
  71  |           name: /send reset link/i
  72  |         }
  73  |       );
  74  | 
  75  |     this.backToLoginLink =
  76  |       page.getByText(
  77  |         /back to login/i
  78  |       );
  79  |   }
  80  | 
  81  |   async open() {
  82  | 
  83  |     Logger.info(
  84  |       'Opening Forgot Password Page'
  85  |     );
  86  | 
> 87  |     await this.page.goto(
      |                     ^ TimeoutError: page.goto: Timeout 30000ms exceeded.
  88  |       `${BASE_URL}/login`,
  89  |       {
  90  |         waitUntil: 'domcontentloaded'
  91  |       }
  92  |     );
  93  | 
  94  |     await this.dismissMarketingOverlays();
  95  | 
  96  |     await this.forgotPasswordLink.click({
  97  |       timeout: 10000
  98  |     }).catch(
  99  |       () => undefined
  100 |     );
  101 | 
  102 |     if (
  103 |       !/forgot-password/.test(
  104 |         this.page.url()
  105 |       )
  106 |     ) {
  107 |       await this.page.goto(
  108 |         `${BASE_URL}/forgot-password`,
  109 |         {
  110 |           waitUntil: 'domcontentloaded'
  111 |         }
  112 |       );
  113 |     }
  114 | 
  115 |     await expect(
  116 |       this.page
  117 |     ).toHaveURL(
  118 |       /forgot-password/,
  119 |       {
  120 |         timeout: 10000
  121 |       }
  122 |     );
  123 | 
  124 |     await expect(
  125 |       this.sendResetButton
  126 |     ).toBeVisible();
  127 | 
  128 |     Logger.success(
  129 |       'Forgot Password Page Opened'
  130 |     );
  131 |   }
  132 | 
  133 |   async requestReset(
  134 |     email: string
  135 |   ) {
  136 | 
  137 |     Logger.info(
  138 |       `Requesting Password Reset: ${email}`
  139 |     );
  140 | 
  141 |     await this.emailInput.fill(
  142 |       email
  143 |     );
  144 | 
  145 |     await safeClick(
  146 |       this.sendResetButton,
  147 |       'Send Reset Link'
  148 |     );
  149 |   }
  150 | 
  151 |   async validateEmailSent(
  152 |     email: string
  153 |   ) {
  154 | 
  155 |     Logger.info(
  156 |       'Validating Email Sent Screen'
  157 |     );
  158 | 
  159 |     await expect(
  160 |       this.page.getByText(
  161 |         /check your email/i
  162 |       )
  163 |     ).toBeVisible({
  164 |       timeout: 10000
  165 |     });
  166 | 
  167 |     await expect(
  168 |       this.page.getByText(
  169 |         email
  170 |       )
  171 |     ).toBeVisible();
  172 | 
  173 |     await expect(
  174 |       this.page.getByText(
  175 |         /expires in \d+\s*(minute|minutes|hour|hours)/i
  176 |       )
  177 |     ).toBeVisible();
  178 | 
  179 |     Logger.success(
  180 |       'Reset Link Message Verified'
  181 |     );
  182 |   }
  183 | 
  184 |   async backToLogin() {
  185 | 
  186 |     Logger.info(
  187 |       'Returning To Login Page'
```