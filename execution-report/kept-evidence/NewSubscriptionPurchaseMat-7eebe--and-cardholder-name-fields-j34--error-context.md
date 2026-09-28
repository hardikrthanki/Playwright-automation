# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: NewSubscriptionPurchaseMatrix.spec.ts >> New Subscription Purchase Use Case 2 Matrix >> SC-49 - Stripe checkout exposes card number, expiry, CVC, country, and cardholder name fields
- Location: tests\NewSubscriptionPurchaseMatrix.spec.ts:494:13

# Error details

```
TimeoutError: locator.click: Timeout 8000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Verify', exact: true })

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