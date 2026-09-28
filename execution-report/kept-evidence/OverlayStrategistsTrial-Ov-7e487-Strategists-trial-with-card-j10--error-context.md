# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: OverlayStrategistsTrial.spec.ts >> Overlay Strategists Trial Experience >> New user can start Overlay Strategists trial with card
- Location: tests\OverlayStrategistsTrial.spec.ts:256:11

# Error details

```
TimeoutError: locator.click: Timeout 8000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Verify', exact: true })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - link "OolTool" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "OolTool" [ref=e7]
      - heading "Create Account" [level=1] [ref=e8]
      - paragraph [ref=e9]: Start your OolTool journey
    - generic [ref=e10]:
      - button "Continue with Google" [ref=e11] [cursor=pointer]:
        - img
        - text: Continue with Google
      - button "Continue with Apple" [ref=e12] [cursor=pointer]:
        - img
        - text: Continue with Apple
      - generic [ref=e17]: Or sign up with email & mobile
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]: First name
            - textbox "First name" [ref=e22]: Hardik
          - generic [ref=e23]:
            - generic [ref=e24]: Last name
            - textbox "Last name" [ref=e25]: Thanki
        - generic [ref=e26]:
          - generic [ref=e27]: Email
          - textbox "Email" [ref=e28]: imhardikthanki+overlay-with-mukzatr0@gmail.com
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Mobile number
            - generic [ref=e32]:
              - img
              - text: Verified
          - generic [ref=e33]:
            - generic [ref=e34]: "+1"
            - textbox "2015550123" [disabled] [ref=e35]: "2015555425"
          - paragraph [ref=e36]: US mobile numbers only. We’ll text you a one-time code.
        - generic [ref=e37]:
          - generic [ref=e38]: Password
          - generic [ref=e39]:
            - textbox [ref=e40]: Test@123456
            - button "Show" [ref=e41]:
              - img [ref=e42]
        - generic [ref=e45]:
          - generic [ref=e46]: Confirm password
          - generic [ref=e47]:
            - textbox [ref=e48]: Test@123456
            - button "Show" [ref=e49]:
              - img [ref=e50]
        - button "Create Account" [ref=e53] [cursor=pointer]
      - paragraph [ref=e54]:
        - text: Already have an account?
        - link "Sign in" [ref=e55] [cursor=pointer]:
          - /url: /login
  - region "Notifications alt+T"
  - alert [ref=e56]
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
  33 |   await locator.waitFor({
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
> 59 |     await locator.click({
     |                   ^ TimeoutError: locator.click: Timeout 8000ms exceeded.
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