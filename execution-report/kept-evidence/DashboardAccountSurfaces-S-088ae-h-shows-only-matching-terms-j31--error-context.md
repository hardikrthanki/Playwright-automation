# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardAccountSurfaces.spec.ts >> Signed-in account surfaces >> Glossary search shows only matching terms
- Location: tests\DashboardAccountSurfaces.spec.ts:443:9

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  getByRole('heading', { name: /^assignment$/i })
Expected: hidden
Received: visible
Timeout:  5000ms

Call log:
  - Expect "toBeHidden" with timeout 5000ms
  - waiting for getByRole('heading', { name: /^assignment$/i })
    9 × locator resolved to <h3 data-testid="text-term-assignment" class="font-display font-semibold text-base">Assignment</h3>
      - unexpected value "visible"

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
            - textbox "Search terms or definitions…" [active] [ref=e79]: vega
          - generic [ref=e80]:
            - generic [ref=e81]:
              - heading "A" [level=2] [ref=e82]
              - generic [ref=e85]:
                - generic [ref=e86]:
                  - heading "Assignment" [level=3] [ref=e87]
                  - generic [ref=e88]: mechanics
                - paragraph [ref=e89]: The process by which a call seller is obligated to deliver the underlying shares at the strike price after a buyer exercises the option.
            - generic [ref=e90]:
              - heading "B" [level=2] [ref=e91]
              - generic [ref=e92]:
                - generic [ref=e94]:
                  - generic [ref=e95]:
                    - heading "Bid / Ask" [level=3] [ref=e96]
                    - generic [ref=e97]: options
                  - paragraph [ref=e98]: The bid is the highest price a buyer is willing to pay; the ask is the lowest price a seller will accept. The difference is the spread.
                - generic [ref=e100]:
                  - generic [ref=e101]:
                    - heading "Breakeven" [level=3] [ref=e102]
                    - generic [ref=e103]: mechanics
                  - paragraph [ref=e104]: The underlying price at which a position results in zero profit or loss at expiration. For a covered call, approximately cost basis minus premium received.
            - generic [ref=e105]:
              - heading "C" [level=2] [ref=e106]
              - generic [ref=e107]:
                - generic [ref=e109]:
                  - generic [ref=e110]:
                    - heading "Call Option" [level=3] [ref=e111]
                    - generic [ref=e112]: options
                  - paragraph [ref=e113]: A contract giving the buyer the right, but not the obligation, to buy 100 shares of the underlying at the strike price on or before expiration.
                - generic [ref=e115]:
                  - generic [ref=e116]:
                    - heading "Cost Basis" [level=3] [ref=e117]
                    - generic [ref=e118]: general
                  - paragraph [ref=e119]: The original price paid for shares (adjusted for splits, dividends, and certain option premiums). Used to calculate gain or loss on sale.
                - generic [ref=e121]:
                  - generic [ref=e122]:
                    - heading "Covered Call" [level=3] [ref=e123]
                    - generic [ref=e124]: options
                  - paragraph [ref=e125]: Selling a call option against shares of the underlying that you already own (at least 100 shares per contract).
            - generic [ref=e126]:
              - heading "D" [level=2] [ref=e127]
              - generic [ref=e130]:
                - generic [ref=e131]:
                  - heading "Delta" [level=3] [ref=e132]
                  - generic [ref=e133]: options
                - paragraph [ref=e134]: An options Greek that estimates how much an option's price changes for a $1 move in the underlying. Often used as a rough probability proxy that the option finishes ITM.
            - generic [ref=e135]:
              - heading "E" [level=2] [ref=e136]
              - generic [ref=e137]:
                - generic [ref=e139]:
                  - generic [ref=e140]:
                    - heading "Ex-Dividend Date" [level=3] [ref=e141]
                    - generic [ref=e142]: general
                  - paragraph [ref=e143]: The cutoff date determining which shareholders receive an upcoming dividend. Owning shares before this date qualifies you for the dividend.
                - generic [ref=e145]:
                  - generic [ref=e146]:
                    - heading "Expiration" [level=3] [ref=e147]
                    - generic [ref=e148]: options
                  - paragraph [ref=e149]: The date on which an option contract ceases to exist. Options not closed or exercised by expiration either expire worthless (OTM) or are auto-exercised (ITM).
            - generic [ref=e150]:
              - heading "I" [level=2] [ref=e151]
              - generic [ref=e152]:
                - generic [ref=e154]:
                  - generic [ref=e155]:
                    - heading "Implied Volatility (IV)" [level=3] [ref=e156]
                    - generic [ref=e157]: options
                  - paragraph [ref=e158]: A forward-looking estimate of expected price movement derived from current option prices. Higher IV generally means richer premiums.
                - generic [ref=e160]:
                  - generic [ref=e161]:
                    - heading "Intrinsic Value" [level=3] [ref=e162]
                    - generic [ref=e163]: options
                  - paragraph [ref=e164]: "The portion of an option's price representing the in-the-money amount. For a call: max(0, share price − strike)."
                - generic [ref=e166]:
                  - generic [ref=e167]:
                    - heading "In-the-Money (ITM)" [level=3] [ref=e168]
                    - generic [ref=e169]: options
                  - paragraph [ref=e170]: A call is ITM when the share price is above the strike. ITM calls have intrinsic value.
            - generic [ref=e171]:
              - heading "O" [level=2] [ref=e172]
              - generic [ref=e173]:
                - generic [ref=e175]:
                  - generic [ref=e176]:
                    - heading "Open Interest" [level=3] [ref=e177]
                    - generic [ref=e178]: options
                  - paragraph [ref=e179]: The total number of option contracts at a given strike/expiration that are currently held open and have not been closed or exercised.
                - generic [ref=e181]:
                  - generic [ref=e182]:
                    - heading "Out-of-the-Money (OTM)" [level=3] [ref=e183]
                    - generic [ref=e184]: options
                  - paragraph [ref=e185]: A call is OTM when the share price is below the strike. OTM calls have no intrinsic value, only time value.
            - generic [ref=e186]:
              - heading "P" [level=2] [ref=e187]
              - generic [ref=e190]:
                - generic [ref=e191]:
                  - heading "Premium" [level=3] [ref=e192]
                  - generic [ref=e193]: options
                - paragraph [ref=e194]: The price paid by the option buyer to the seller, credited to the seller at the time the contract is opened.
            - generic [ref=e195]:
              - heading "R" [level=2] [ref=e196]
              - generic [ref=e199]:
                - generic [ref=e200]:
                  - heading "Roll" [level=3] [ref=e201]
                  - generic [ref=e202]: mechanics
                - paragraph [ref=e203]: Closing an existing option position and opening a new one at a different strike, expiration, or both - typically as a single combined order.
            - generic [ref=e204]:
              - heading "S" [level=2] [ref=e205]
              - generic [ref=e208]:
                - generic [ref=e209]:
                  - heading "Strike Price" [level=3] [ref=e210]
                  - generic [ref=e211]: options
                - paragraph [ref=e212]: The price at which the underlying shares can be bought (for calls) or sold (for puts) if the option is exercised.
            - generic [ref=e213]:
              - heading "T" [level=2] [ref=e214]
              - generic [ref=e217]:
                - generic [ref=e218]:
                  - heading "Theta" [level=3] [ref=e219]
                  - generic [ref=e220]: options
                - paragraph [ref=e221]: An options Greek that estimates how much an option's price decays per day, all else equal. Short option positions generally benefit from positive theta.
            - generic [ref=e222]:
              - heading "U" [level=2] [ref=e223]
              - generic [ref=e226]:
                - generic [ref=e227]:
                  - heading "Underlying" [level=3] [ref=e228]
                  - generic [ref=e229]: general
                - paragraph [ref=e230]: The asset (typically a stock or ETF) on which an option contract is based.
            - generic [ref=e231]:
              - heading "V" [level=2] [ref=e232]
              - generic [ref=e235]:
                - generic [ref=e236]:
                  - heading "Vega" [level=3] [ref=e237]
                  - generic [ref=e238]: options
                - paragraph [ref=e239]: An options Greek that estimates how much an option's price changes for a 1-point move in implied volatility.
        - generic [ref=e240]:
          - img [ref=e241]
          - paragraph [ref=e243]: All Academy content is educational and informational only. Nothing here is investment advice, a solicitation, or an offer to buy or sell any security. You are solely responsible for any decisions you make at your broker.
    - contentinfo [ref=e244]:
      - generic [ref=e245]:
        - generic [ref=e246]:
          - paragraph [ref=e247]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e248]:
            - link "Privacy Policy" [ref=e250] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e251]:
              - generic [ref=e252]: ·
              - link "Terms of Service" [ref=e253] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e254]:
              - generic [ref=e255]: ·
              - link "Disclosures" [ref=e256] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e257]:
              - generic [ref=e258]: ·
              - link "Risk Warning" [ref=e259] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e260]:
              - generic [ref=e261]: ·
              - link "Contact" [ref=e262] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e263]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e264]
```

# Test source

```ts
  389 |             }
  390 |           );
  391 | 
  392 |         const vega =
  393 |           page.getByRole(
  394 |             'heading',
  395 |             {
  396 |               name: /^vega$/i
  397 |             }
  398 |           );
  399 | 
  400 |         await search.fill(
  401 |           'vega'
  402 |         );
  403 | 
  404 |         await expect(
  405 |           vega
  406 |         ).toBeVisible();
  407 | 
  408 |         await expect(
  409 |           assignment
  410 |         ).toBeHidden();
  411 | 
  412 |         await search.fill(
  413 |           'ZZZNOTATERM'
  414 |         );
  415 | 
  416 |         await expect(
  417 |           assignment
  418 |         ).toBeHidden();
  419 | 
  420 |         await expect(
  421 |           vega
  422 |         ).toBeHidden();
  423 | 
  424 |         await expect(
  425 |           page
  426 |         ).toHaveURL(
  427 |           /\/academy\/glossary/
  428 |         );
  429 | 
  430 |         await search.fill(
  431 |           ''
  432 |         );
  433 | 
  434 |         await expect(
  435 |           assignment
  436 |         ).toBeVisible();
  437 | 
  438 |         await expect(
  439 |           vega
  440 |         ).toBeVisible();
  441 |       }
  442 |     );
  443 | 
  444 |     test(
  445 |       'Equity research clears a typed symbol',
  446 |       async ({ page }) => {
  447 |         await openPath(
  448 |           page,
  449 |           '/dashboard'
  450 |         );
  451 | 
  452 |         await new DashboardPage(
  453 |           page
  454 |         ).validateLoaded();
  455 | 
  456 |         await openHeaderMenuItem(
  457 |           page,
  458 |           /^research$/i,
  459 |           /^equity$/i,
  460 |           'Equity research'
  461 |         );
  462 | 
  463 |         const input =
  464 |           page.locator(
  465 |             'main'
  466 |           ).getByRole(
  467 |             'combobox'
  468 |           ).or(
  469 |             page.getByPlaceholder(
  470 |               /symbol/i
  471 |             )
  472 |           ).first();
  473 | 
  474 |         await input.fill(
  475 |           'ZZZNOTASYMBOL'
  476 |         );
  477 | 
  478 |         await expect(
  479 |           page.locator(
  480 |             'main'
  481 |           )
  482 |         ).toContainText(
  483 |           /no results found/i
  484 |         );
  485 | 
  486 |         const clear =
  487 |           page.locator(
  488 |             'main'
> 489 |           ).getByRole(
      |           ^ Error: expect(locator).toBeHidden() failed
  490 |             'button',
  491 |             {
  492 |               name: /clear/i
  493 |             }
  494 |           ).or(
  495 |             page.locator(
  496 |               'main button:has(svg.lucide-x)'
  497 |             )
  498 |           ).first();
  499 | 
  500 |         await safeClick(
  501 |           clear,
  502 |           'Clear equity symbol'
  503 |         );
  504 | 
  505 |         await expect(
  506 |           input
  507 |         ).toHaveValue(
  508 |           ''
  509 |         );
  510 | 
  511 |         await expect(
  512 |           page.getByRole(
  513 |             'heading',
  514 |             {
  515 |               name: /^ZZZNOTASYMBOL$/
  516 |             }
  517 |           )
  518 |         ).toHaveCount(
  519 |           0
  520 |         );
  521 |       }
  522 |     );
  523 | 
  524 |     test(
  525 |       'Equity research keeps an empty symbol on the search prompt',
  526 |       async ({ page }) => {
  527 |         await openPath(
  528 |           page,
  529 |           '/dashboard'
  530 |         );
  531 | 
  532 |         await new DashboardPage(
  533 |           page
  534 |         ).validateLoaded();
  535 | 
  536 |         await openHeaderMenuItem(
  537 |           page,
  538 |           /^research$/i,
  539 |           /^equity$/i,
  540 |           'Equity research'
  541 |         );
  542 | 
  543 |         const analyze =
  544 |           page.getByRole(
  545 |             'button',
  546 |             {
  547 |               name: /^analyze$/i
  548 |             }
  549 |           );
  550 | 
  551 |         if (
  552 |           await analyze.isEnabled().catch(
  553 |             () => false
  554 |           )
  555 |         ) {
  556 |           await safeClick(
  557 |             analyze,
  558 |             'Analyze empty symbol'
  559 |           );
  560 |         }
  561 | 
  562 |         await expect(
  563 |           page
  564 |         ).toHaveURL(
  565 |           /equity-research/
  566 |         );
  567 | 
  568 |         await expect(
  569 |           page.locator(
  570 |             'main'
  571 |           )
  572 |         ).toContainText(
  573 |           /search for a symbol/i
  574 |         );
  575 |       }
  576 |     );
  577 |   }
  578 | );
  579 | 
```