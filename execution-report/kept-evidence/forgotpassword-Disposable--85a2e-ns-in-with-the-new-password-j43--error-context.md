# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: forgotpassword.spec.ts >> Disposable user resets password from the email link and signs in with the new password
- Location: tests\forgotpassword.spec.ts:215:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/password updated|password reset|success/i)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/password updated|password reset|success/i)

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - link "OolTool" [ref=e4] [cursor=pointer]:
      - /url: /
      - img "OolTool" [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]: Set New Password
        - generic [ref=e9]: Enter your new password below
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e12]:
            - text: New Password
            - generic [ref=e13]:
              - textbox "New Password" [active] [ref=e14]:
                - /placeholder: Min. 8 characters
              - button "Show password" [ref=e15] [cursor=pointer]:
                - img [ref=e16]
          - generic [ref=e19]:
            - text: Confirm Password
            - generic [ref=e20]:
              - textbox "Confirm Password" [ref=e21]: ResetFlow#26aA
              - button "Show password" [ref=e22] [cursor=pointer]:
                - img [ref=e23]
        - generic [ref=e26]:
          - button "Update Password" [ref=e27] [cursor=pointer]
          - link "Back to login" [ref=e28] [cursor=pointer]:
            - /url: /login
  - region "Notifications alt+T"
  - alert [ref=e29]
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
  17  |   validatePasswordPolicy
  18  | } from '../config/testData';
  19  | 
  20  | /* =============================================================================
  21  | PAGE OBJECT: ResetPasswordPage
  22  | 
  23  | PURPOSE
  24  | -------
  25  | Handles password reset after clicking reset email link.
  26  | 
  27  | FEATURES COVERED
  28  | ----------------
  29  | 1. Enter New Password
  30  | 2. Confirm Password
  31  | 3. Update Password
  32  | 4. Navigate Back To Login
  33  | 
  34  | ============================================================================= */
  35  | 
  36  | export class ResetPasswordPage
  37  |   extends BasePage {
  38  | 
  39  |   readonly newPasswordInput: Locator;
  40  | 
  41  |   readonly confirmPasswordInput: Locator;
  42  | 
  43  |   readonly updatePasswordButton: Locator;
  44  | 
  45  |   readonly backToLoginLink: Locator;
  46  | 
  47  |   constructor(page: Page) {
  48  | 
  49  |     super(page);
  50  | 
  51  |     this.newPasswordInput =
  52  |       page.getByLabel(
  53  |         /^new password$/i
  54  |       ).or(
  55  |         page.locator(
  56  |           'form input[type="password"]'
  57  |         ).nth(0)
  58  |       );
  59  | 
  60  |     this.confirmPasswordInput =
  61  |       page.getByLabel(
  62  |         /^confirm password$/i
  63  |       ).or(
  64  |         page.locator(
> 65  |           'form input[type="password"]'
      |                                                                                              ^ Error: expect(locator).toBeVisible() failed
  66  |         ).nth(1)
  67  |       );
  68  | 
  69  |     this.updatePasswordButton =
  70  |       page.getByRole(
  71  |         'button',
  72  |         {
  73  |           name: /update password/i
  74  |         }
  75  |       );
  76  | 
  77  |     this.backToLoginLink =
  78  |       page.getByText(
  79  |         /back to login/i
  80  |       );
  81  |   }
  82  | 
  83  |   async waitForFormReady() {
  84  | 
  85  |     await this.page.waitForLoadState(
  86  |       'domcontentloaded'
  87  |     );
  88  | 
  89  |     await expect(
  90  |       this.newPasswordInput
  91  |     ).toBeVisible({
  92  |       timeout: 30000
  93  |     });
  94  | 
  95  |     await expect(
  96  |       this.confirmPasswordInput
  97  |     ).toBeVisible({
  98  |       timeout: 30000
  99  |     });
  100 |   }
  101 | 
  102 |   async fillPassword(
  103 |     password: string
  104 |   ) {
  105 | 
  106 |     validatePasswordPolicy(
  107 |       password
  108 |     );
  109 | 
  110 |     Logger.info(
  111 |       'Updating Password'
  112 |     );
  113 |     console.log(
  114 |   'Current URL:',
  115 |   this.page.url()
  116 | );
  117 | 
  118 |     await this.waitForFormReady();
  119 | 
  120 |     await this.newPasswordInput.fill(
  121 |       password
  122 |     );
  123 | 
  124 |     await this.confirmPasswordInput.fill(
  125 |       password
  126 |     );
  127 | 
  128 |     Logger.success(
  129 |       'Password Fields Completed'
  130 |     );
  131 |   }
  132 | 
  133 |   async updatePassword() {
  134 | 
  135 |     await safeClick(
  136 |       this.updatePasswordButton,
  137 |       'Update Password'
  138 |     );
  139 | 
  140 |     Logger.success(
  141 |       'Update Password Clicked'
  142 |     );
  143 |   }
  144 | 
  145 |   async validateSuccess() {
  146 | 
  147 |     await expect(
  148 |       this.page.getByText(
  149 |         /password updated|password reset|success/i
  150 |       )
  151 |     ).toBeVisible({
  152 |       timeout: 10000
  153 |     });
  154 | 
  155 |     Logger.success(
  156 |       'Password Updated Successfully'
  157 |     );
  158 |   }
  159 | 
  160 |   async backToLogin() {
  161 | 
  162 |     await safeClick(
  163 |       this.backToLoginLink,
  164 |       'Back To Login'
  165 |     );
```