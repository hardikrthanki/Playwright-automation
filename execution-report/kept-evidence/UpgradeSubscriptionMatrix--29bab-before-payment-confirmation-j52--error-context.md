# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UpgradeSubscriptionMatrix.spec.ts >> Upgrade Subscription Use Case 3 Matrix >> SC-87 - User can cancel upgrade before payment confirmation
- Location: tests\UpgradeSubscriptionMatrix.spec.ts:361:13

# Error details

```
TimeoutError: locator.click: Timeout 8000ms exceeded.
Call log:
  - waiting for locator('p, h2, h3, h4, span').filter({ hasText: /^\s*(?:Portfolio Hedger|Portfolio Hedge|3-Advanced)\s*$/i }).first().locator('xpath=ancestor::*[.//button][1]').getByRole('button', { name: /upgrade/i }).first()

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
  48  |     await locator.waitFor({
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
> 79  |         await locator.click({
      |                       ^ TimeoutError: locator.click: Timeout 8000ms exceeded.
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
  149 |         () => true
  150 |       ).catch(
  151 |         () => false
  152 |       );
  153 | 
  154 |     if (opened) {
  155 |       return;
  156 |     }
  157 | 
  158 |     await page.keyboard.press(
  159 |       'Escape'
  160 |     ).catch(
  161 |       () => undefined
  162 |     );
  163 |   }
  164 | 
  165 |   await anyItem.waitFor({
  166 |     state: 'visible',
  167 |     timeout: 15000
  168 |   });
  169 | }
  170 | 
  171 | export async function openHeaderMenuItem(
  172 |   page: Page,
  173 |   menuName: RegExp,
  174 |   itemName: RegExp,
  175 |   label: string
  176 | ) {
  177 |   const menuItem =
  178 |     page.getByRole(
  179 |       'menuitem',
```