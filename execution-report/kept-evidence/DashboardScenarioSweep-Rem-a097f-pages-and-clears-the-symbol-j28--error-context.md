# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardScenarioSweep.spec.ts >> Remaining dashboard scenarios >> Company Finance opens related research pages and clears the symbol
- Location: tests\DashboardScenarioSweep.spec.ts:329:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^AAPL$/ })
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for getByRole('heading', { name: /^AAPL$/ })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
          - button "Sync all" [ref=e26] [cursor=pointer]:
            - img
            - generic [ref=e27]: Sync all
          - button "Add options" [ref=e28] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e29] [cursor=pointer]:
            - img [ref=e30]
            - generic [ref=e33]: "17"
          - button "Enter fullscreen" [ref=e34] [cursor=pointer]:
            - img
          - button "Switch to dark theme" [ref=e35] [cursor=pointer]:
            - img
          - button "HT" [ref=e36] [cursor=pointer]:
            - generic [ref=e38]: HT
    - main [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - heading "Company Finance" [level=1] [ref=e42]
          - paragraph [ref=e43]: Search a symbol to review income statements, balance sheets, cash flow, and key financial ratios.
        - generic [ref=e45]:
          - generic [ref=e47]:
            - generic [ref=e48]: Symbol
            - generic [ref=e49]:
              - img
              - combobox "Search symbol (e.g. AAPL)" [disabled] [ref=e50]: AAPL - Apple Inc.
              - button "Clear Symbol" [disabled] [ref=e51]:
                - img [ref=e52]
          - generic [ref=e55]:
            - button "Search" [disabled]:
              - img
              - generic: Search
            - button "Reset" [disabled]:
              - img
              - generic: Reset
    - contentinfo [ref=e69]:
      - generic [ref=e70]:
        - generic [ref=e71]:
          - paragraph [ref=e72]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e73]:
            - link "Privacy Policy" [ref=e75] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e76]:
              - generic [ref=e77]: ·
              - link "Terms of Service" [ref=e78] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e79]:
              - generic [ref=e80]: ·
              - link "Disclosures" [ref=e81] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e82]:
              - generic [ref=e83]: ·
              - link "Risk Warning" [ref=e84] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e85]:
              - generic [ref=e86]: ·
              - link "Contact" [ref=e87] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e88]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e89]: Company Finance | OolTool
```

# Test source

```ts
  315 |         ).toContainText(
  316 |           /max gain/i
  317 |         );
  318 | 
  319 |         await expect(
  320 |           page.locator(
  321 |             'main'
  322 |           )
  323 |         ).toContainText(
  324 |           /max loss/i
  325 |         );
  326 |       }
  327 |     );
  328 | 
  329 |     test(
  330 |       'Company Finance opens related research pages and clears the symbol',
  331 |       async ({ page }) => {
  332 |         await openDashboard(
  333 |           page
  334 |         );
  335 | 
  336 |         await safeClick(
  337 |           page.getByRole(
  338 |             'button',
  339 |             {
  340 |               name: /^research$/i
  341 |             }
  342 |           ).first(),
  343 |           'Research menu'
  344 |         );
  345 | 
  346 |         await safeClick(
  347 |           page.getByRole(
  348 |             'menuitem',
  349 |             {
  350 |               name: /company finance/i
  351 |             }
  352 |           ),
  353 |           'Company Finance'
  354 |         );
  355 | 
  356 |         await searchSymbol(
  357 |           page,
  358 |           'AAPL'
  359 |         );
  360 | 
  361 |         await expect(
  362 |           page.getByRole(
  363 |             'tab',
  364 |             {
  365 |               name: /^income statement$/i
  366 |             }
  367 |           )
  368 |         ).toBeVisible({
  369 |           timeout: 20000
  370 |         });
  371 | 
  372 |         const links = [
  373 |           {
  374 |             name: /^fundamentals$/i,
  375 |             url: /company-fundamentals/,
  376 |             content: /overview|valuation|AAPL/i
  377 |           },
  378 |           {
  379 |             name: /analyze options/i,
  380 |             url: /equity-research|options-research/,
  381 |             content: /AAPL|option|chain|equity/i
  382 |           },
  383 |           {
  384 |             name: /event calendar/i,
  385 |             url: /event-calendar/,
  386 |             content: /event calendar|earnings|dividend/i
  387 |           },
  388 |           {
  389 |             name: /view all news/i,
  390 |             url: /\/news/,
  391 |             content: /news|AAPL|headline/i
  392 |           }
  393 |         ];
  394 | 
  395 |         for (const link of links) {
  396 |           await page.goto(
  397 |             `${BASE_URL}/dashboard/company-finance`,
  398 |             {
  399 |               waitUntil: 'domcontentloaded'
  400 |             }
  401 |           );
  402 | 
  403 |           await searchSymbol(
  404 |             page,
  405 |             'AAPL'
  406 |           );
  407 | 
  408 |           await expect(
  409 |             page.getByRole(
  410 |               'heading',
  411 |               {
  412 |                 name: /^AAPL$/
  413 |               }
  414 |             )
> 415 |           ).toBeVisible({
      |             ^ Error: expect(locator).toBeVisible() failed
  416 |             timeout: 20000
  417 |           });
  418 | 
  419 |           await safeClick(
  420 |             page.locator(
  421 |               'main'
  422 |             ).getByRole(
  423 |               'link',
  424 |               {
  425 |                 name: link.name
  426 |               }
  427 |             ).first(),
  428 |             'Open finance link'
  429 |           );
  430 | 
  431 |           await expect(
  432 |             page
  433 |           ).toHaveURL(
  434 |             link.url,
  435 |             {
  436 |               timeout: 20000
  437 |             }
  438 |           );
  439 | 
  440 |           await expect(
  441 |             page.locator(
  442 |               'main'
  443 |             )
  444 |           ).toContainText(
  445 |             link.content
  446 |           );
  447 |         }
  448 | 
  449 |         await page.goto(
  450 |           `${BASE_URL}/dashboard/company-finance`,
  451 |           {
  452 |             waitUntil: 'domcontentloaded'
  453 |           }
  454 |         );
  455 | 
  456 |         await searchSymbol(
  457 |           page,
  458 |           'AAPL'
  459 |         );
  460 | 
  461 |         await expect(
  462 |           page.getByRole(
  463 |             'heading',
  464 |             {
  465 |               name: /^AAPL$/
  466 |             }
  467 |           )
  468 |         ).toBeVisible({
  469 |           timeout: 20000
  470 |         });
  471 | 
  472 |         await safeClick(
  473 |           page.getByRole(
  474 |             'button',
  475 |             {
  476 |               name: /^reset$/i
  477 |             }
  478 |           ),
  479 |           'Reset symbol'
  480 |         );
  481 | 
  482 |         await expect(
  483 |           page.getByRole(
  484 |             'heading',
  485 |             {
  486 |               name: /^AAPL$/
  487 |             }
  488 |           )
  489 |         ).toBeHidden();
  490 | 
  491 |         await expect(
  492 |           page.locator(
  493 |             'main'
  494 |           )
  495 |         ).toContainText(
  496 |           /search a symbol/i
  497 |         );
  498 |       }
  499 |     );
  500 | 
  501 |     test(
  502 |       'Support walks every category, priority, and status without submitting',
  503 |       async ({ page }) => {
  504 |         await openDashboard(
  505 |           page
  506 |         );
  507 | 
  508 |         await safeClick(
  509 |           page.getByRole(
  510 |             'link',
  511 |             {
  512 |               name: /^support$/i
  513 |             }
  514 |           ).first(),
  515 |           'Support'
```