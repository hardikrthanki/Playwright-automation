# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-032 - Subscription management portal opens with current subscription details
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: /^email$/i }).or(locator('input[type="email"], input[name="email"]')).first() to be visible

```

# Test source

```ts
  1   | import {
  2   |   Page
  3   | } from '@playwright/test';
  4   | 
  5   | import {
  6   |   AUTH_SETTINGS,
  7   |   BASE_URL
  8   | } from '../config/testData';
  9   | 
  10  | import { URLS }
  11  |   from '../config/constants';
  12  | 
  13  | import '../config/loadLocalEnv';
  14  | 
  15  | import {
  16  |   isGmailAutomationEnabled,
  17  |   waitForGmailVerificationLink
  18  | } from './gmailImap';
  19  | 
  20  | /* =============================================================================
  21  | HELPER: waitForManualEmailVerification
  22  | 
  23  | PURPOSE
  24  | -------
  25  | After registration, wait for the Gmail verification link to succeed.
  26  | Never click Resend / Send verification link.
  27  | 
  28  | Uses Gmail IMAP when GMAIL_APP_PASSWORD is set in .env or the terminal.
  29  | Falls back to a headed pause only when automatic verification cannot finish.
  30  | ============================================================================= */
  31  | 
  32  | export function isEmailVerificationPage(
  33  |   page: Page
  34  | ) {
  35  |   return /verify-email/i.test(
  36  |     page.url()
  37  |   );
  38  | }
  39  | 
  40  | export async function openFreshLoginPage(
  41  |   page: Page
  42  | ) {
  43  |   const emailField =
  44  |     page.getByRole(
  45  |       'textbox',
  46  |       {
  47  |         name: /^email$/i
  48  |       }
  49  |     ).or(
  50  |       page.locator(
  51  |         'input[type="email"], input[name="email"]'
  52  |       )
  53  |     ).first();
  54  | 
  55  |   for (let attempt = 1; attempt <= 2; attempt += 1) {
  56  |     await page.goto(
  57  |       `${BASE_URL}${URLS.LOGIN}`,
  58  |       {
  59  |         waitUntil: 'domcontentloaded',
  60  |         timeout: 60000
  61  |       }
  62  |     ).catch(
  63  |       () => undefined
  64  |     );
  65  | 
  66  |     const ready =
  67  |       await emailField.waitFor({
  68  |         state: 'visible',
  69  |         timeout: 30000
  70  |       }).then(
  71  |         () => true
  72  |       ).catch(
  73  |         () => false
  74  |       );
  75  | 
  76  |     if (ready) {
  77  |       return;
  78  |     }
  79  |   }
  80  | 
> 81  |   await emailField.waitFor({
      |                    ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  82  |     state: 'visible',
  83  |     timeout: 30000
  84  |   });
  85  | }
  86  | 
  87  | export async function waitForManualEmailVerification(
  88  |   page: Page,
  89  |   email: string
  90  | ) {
  91  |   if (
  92  |     !AUTH_SETTINGS.emailVerificationRequired
  93  |   ) {
  94  |     if (
  95  |       isEmailVerificationPage(
  96  |         page
  97  |       )
  98  |     ) {
  99  |       await openFreshLoginPage(
  100 |         page
  101 |       );
  102 |     }
  103 | 
  104 |     return;
  105 |   }
  106 | 
  107 |   console.log(
  108 |     `Email verification for ${email}. Gmail IMAP: ${
  109 |       isGmailAutomationEnabled()
  110 |         ? 'enabled'
  111 |         : 'disabled'
  112 |     }`
  113 |   );
  114 | 
  115 |   if (
  116 |     isGmailAutomationEnabled()
  117 |   ) {
  118 |     console.log(
  119 |       `Reading verification email from Gmail for ${email}`
  120 |     );
  121 | 
  122 |     try {
  123 |       const verificationLink =
  124 |         await waitForGmailVerificationLink(
  125 |           email
  126 |         );
  127 | 
  128 |       console.log(
  129 |         'Opened verification link from Gmail inbox'
  130 |       );
  131 | 
  132 |       await page.goto(
  133 |         verificationLink,
  134 |         {
  135 |           waitUntil: 'domcontentloaded'
  136 |         }
  137 |       );
  138 | 
  139 |       await openFreshLoginPage(
  140 |         page
  141 |       );
  142 | 
  143 |       return;
  144 |     } catch (
  145 |       error
  146 |     ) {
  147 |       const message =
  148 |         error instanceof Error
  149 |           ? error.message
  150 |           : String(
  151 |             error
  152 |           );
  153 | 
  154 |       console.log(
  155 |         'Gmail inbox automation failed.'
  156 |       );
  157 |       console.log(
  158 |         message
  159 |       );
  160 | 
  161 |       if (process.env.CI || process.env.EMAIL_VERIFICATION_PAUSE !== 'true') {
  162 |         throw new Error(
  163 |           `Automatic Gmail verification failed for ${email}. ${message}`
  164 |         );
  165 |       }
  166 | 
  167 |       console.log(
  168 |         'Falling back to manual pause.'
  169 |       );
  170 |     }
  171 |   } else {
  172 |     console.log(
  173 |       'GMAIL_APP_PASSWORD is not set, so automatic Gmail verification is skipped.'
  174 |     );
  175 |     console.log(
  176 |       'Copy .env.example to .env and paste the Gmail App Password, or set $env:GMAIL_APP_PASSWORD in this VS Code terminal.'
  177 |     );
  178 | 
  179 |     if (process.env.CI || process.env.EMAIL_VERIFICATION_PAUSE !== 'true') {
  180 |       throw new Error(
  181 |         `Automatic Gmail verification is not configured for ${email}. Set GMAIL_APP_PASSWORD in .env.`
```