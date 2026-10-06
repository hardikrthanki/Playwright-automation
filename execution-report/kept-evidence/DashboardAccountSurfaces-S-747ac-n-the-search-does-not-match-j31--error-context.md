# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardAccountSurfaces.spec.ts >> Signed-in account surfaces >> Glossary keeps terms when the search does not match
- Location: tests\DashboardAccountSurfaces.spec.ts:443:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^assignment$/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /^assignment$/i })

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
          - link "Opportunities" [ref=e12] [cursor=pointer]:
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
          - button "QU" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: QU
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Academy" [level=1] [ref=e43]
          - paragraph [ref=e44]: A self-paced library of options-strategy references, lessons, and definitions.
          - paragraph [ref=e45]: Educational content only - this app does not place trades or provide investment advice.
        - navigation [ref=e47]:
          - link "Beginners" [ref=e48] [cursor=pointer]:
            - /url: /academy/beginners
            - img [ref=e49]
            - text: Beginners
          - link "Overview" [ref=e52] [cursor=pointer]:
            - /url: /academy
            - img [ref=e53]
            - text: Overview
          - link "Lessons" [ref=e56] [cursor=pointer]:
            - /url: /academy/lessons
            - img [ref=e57]
            - text: Lessons
          - link "Strategy Library" [ref=e59] [cursor=pointer]:
            - /url: /academy/strategies
            - img [ref=e60]
            - text: Strategy Library
          - link "Glossary" [ref=e62] [cursor=pointer]:
            - /url: /academy/glossary
            - img [ref=e63]
            - text: Glossary
        - generic [ref=e66]:
          - generic [ref=e67]:
            - generic [ref=e68]:
              - img [ref=e70]
              - heading "Glossary" [level=1] [ref=e73]
            - paragraph [ref=e74]: Plain-language definitions of the options terms used throughout the app.
          - generic [ref=e75]:
            - img [ref=e76]
            - textbox "Search terms or definitions…" [active] [ref=e79]: ZZZNOTATERM
          - generic [ref=e80]: No terms match "ZZZNOTATERM".
        - generic [ref=e81]:
          - img [ref=e82]
          - paragraph [ref=e84]: All Academy content is educational and informational only. Nothing here is investment advice, a solicitation, or an offer to buy or sell any security. You are solely responsible for any decisions you make at your broker.
    - contentinfo [ref=e85]:
      - generic [ref=e86]:
        - generic [ref=e87]:
          - paragraph [ref=e88]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e89]:
            - link "Privacy Policy" [ref=e91] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e92]:
              - generic [ref=e93]: ·
              - link "Terms of Service" [ref=e94] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e95]:
              - generic [ref=e96]: ·
              - link "Disclosures" [ref=e97] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e98]:
              - generic [ref=e99]: ·
              - link "Risk Warning" [ref=e100] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e101]:
              - generic [ref=e102]: ·
              - link "Contact" [ref=e103] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e104]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e105]
```

# Test source

```ts
  374 |         await expect(
  375 |           page.locator(
  376 |             'main'
  377 |           )
  378 |         ).toContainText(
  379 |           /no results found|search for a symbol/i
  380 |         );
  381 |       }
  382 |     );
  383 | 
  384 |     test(
  385 |       'Glossary opens one term and clears the search',
  386 |       async ({ page }) => {
  387 |         await openPath(
  388 |           page,
  389 |           '/academy/glossary'
  390 |         );
  391 | 
  392 |         const search =
  393 |           page.getByRole(
  394 |             'textbox',
  395 |             {
  396 |               name: /search/i
  397 |             }
  398 |           ).or(
  399 |             page.getByPlaceholder(
  400 |               /search/i
  401 |             )
  402 |           ).first();
  403 | 
  404 |         await search.fill(
  405 |           'delta'
  406 |         );
  407 | 
  408 |         const term =
  409 |           page.getByRole(
  410 |             'heading',
  411 |             {
  412 |               name: /^delta$/i
  413 |             }
  414 |           );
  415 | 
  416 |         await safeClick(
  417 |           term,
  418 |           'Open Delta'
  419 |         );
  420 | 
  421 |         await expect(
  422 |           page.locator(
  423 |             'main'
  424 |           )
  425 |         ).toContainText(
  426 |           /options greek|option's price|\$1 move/i
  427 |         );
  428 | 
  429 |         await search.fill(
  430 |           ''
  431 |         );
  432 | 
  433 |         await expect(
  434 |           page.locator(
  435 |             'main'
  436 |           )
  437 |         ).toContainText(
  438 |           /assignment|bid\s*\/\s*ask|breakeven/i
  439 |         );
  440 |       }
  441 |     );
  442 | 
  443 |     test(
  444 |       'Glossary keeps terms when the search does not match',
  445 |       async ({ page }) => {
  446 |         await openPath(
  447 |           page,
  448 |           '/academy/glossary'
  449 |         );
  450 | 
  451 |         const search =
  452 |           page.getByRole(
  453 |             'textbox',
  454 |             {
  455 |               name: /search/i
  456 |             }
  457 |           ).or(
  458 |             page.getByPlaceholder(
  459 |               /search/i
  460 |             )
  461 |           ).first();
  462 | 
  463 |         await search.fill(
  464 |           'ZZZNOTATERM'
  465 |         );
  466 | 
  467 |         await expect(
  468 |           page.getByRole(
  469 |             'heading',
  470 |             {
  471 |               name: /^assignment$/i
  472 |             }
  473 |           )
> 474 |         ).toBeVisible();
      |           ^ Error: expect(locator).toBeVisible() failed
  475 | 
  476 |         await expect(
  477 |           page
  478 |         ).toHaveURL(
  479 |           /\/academy\/glossary/
  480 |         );
  481 | 
  482 |         await search.fill(
  483 |           ''
  484 |         );
  485 | 
  486 |         await expect(
  487 |           page.locator(
  488 |             'main'
  489 |           )
  490 |         ).toContainText(
  491 |           /assignment/i
  492 |         );
  493 |       }
  494 |     );
  495 | 
  496 |     test(
  497 |       'Equity research clears a typed symbol',
  498 |       async ({ page }) => {
  499 |         await openPath(
  500 |           page,
  501 |           '/dashboard'
  502 |         );
  503 | 
  504 |         await new DashboardPage(
  505 |           page
  506 |         ).validateLoaded();
  507 | 
  508 |         await openHeaderMenuItem(
  509 |           page,
  510 |           /^research$/i,
  511 |           /^equity$/i,
  512 |           'Equity research'
  513 |         );
  514 | 
  515 |         const input =
  516 |           page.locator(
  517 |             'main'
  518 |           ).getByRole(
  519 |             'combobox'
  520 |           ).or(
  521 |             page.getByPlaceholder(
  522 |               /symbol/i
  523 |             )
  524 |           ).first();
  525 | 
  526 |         await input.fill(
  527 |           'ZZZNOTASYMBOL'
  528 |         );
  529 | 
  530 |         await expect(
  531 |           page.locator(
  532 |             'main'
  533 |           )
  534 |         ).toContainText(
  535 |           /no results found/i
  536 |         );
  537 | 
  538 |         const clear =
  539 |           page.locator(
  540 |             'main'
  541 |           ).getByRole(
  542 |             'button',
  543 |             {
  544 |               name: /clear/i
  545 |             }
  546 |           ).or(
  547 |             page.locator(
  548 |               'main button:has(svg.lucide-x)'
  549 |             )
  550 |           ).first();
  551 | 
  552 |         await safeClick(
  553 |           clear,
  554 |           'Clear equity symbol'
  555 |         );
  556 | 
  557 |         await expect(
  558 |           input
  559 |         ).toHaveValue(
  560 |           ''
  561 |         );
  562 | 
  563 |         await expect(
  564 |           page.getByRole(
  565 |             'heading',
  566 |             {
  567 |               name: /^ZZZNOTASYMBOL$/
  568 |             }
  569 |           )
  570 |         ).toHaveCount(
  571 |           0
  572 |         );
  573 |       }
  574 |     );
```