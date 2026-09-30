# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardWidgets.spec.ts >> Dashboard Widgets >> Dashboard shows portfolio score events allocation and opportunities
- Location: tests\DashboardWidgets.spec.ts:38:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: /view full expiry calendar/i }).or(getByRole('button', { name: /view full expiry calendar/i })).or(getByText(/view full expiry calendar/i)).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('link', { name: /view full expiry calendar/i }).or(getByRole('button', { name: /view full expiry calendar/i })).or(getByText(/view full expiry calendar/i)).first()

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
          - generic [ref=e43]:
            - generic [ref=e44]:
              - img [ref=e46]
              - generic [ref=e49]:
                - paragraph [ref=e50]: Total Portfolio Value
                - paragraph [ref=e51]: $350,645
                - paragraph [ref=e52]: 100% of portfolio
            - generic [ref=e53]:
              - img [ref=e55]
              - generic [ref=e58]:
                - paragraph [ref=e59]: Invested Value
                - paragraph [ref=e60]: $349,645
                - paragraph [ref=e61]: 99.7% of portfolio
            - generic [ref=e62]:
              - img [ref=e64]
              - generic [ref=e66]:
                - paragraph [ref=e67]: Cash & Buying Power
                - paragraph [ref=e68]: $1,000
                - paragraph [ref=e69]: 0.3% of portfolio
          - generic [ref=e70]:
            - generic [ref=e71]:
              - paragraph [ref=e72]: Ools Score (Portfolio)
              - button "Learn more about Ools Score" [ref=e73]:
                - img [ref=e74]
            - generic [ref=e77]:
              - img "Ools Score 47 out of 100" [ref=e78]:
                - generic [ref=e85]: "47"
              - generic [ref=e86]:
                - generic [ref=e87]: "0"
                - generic [ref=e88]: Diversified
                - generic [ref=e89]: Overlayed
                - generic [ref=e90]: Hedged
                - generic [ref=e91]: DeRisked
                - generic [ref=e92]: "100"
            - list [ref=e93]:
              - listitem [ref=e94]: Covered-call utilization below your profile target.
          - generic [ref=e95]:
            - generic [ref=e96]:
              - img [ref=e98]
              - generic [ref=e100]:
                - heading "Upcoming Events" [level=3] [ref=e101]
                - paragraph [ref=e102]: Top 3 from your portfolio symbols
            - list [ref=e103]:
              - listitem [ref=e104]:
                - generic [ref=e105]:
                  - paragraph [ref=e106]: CAG
                  - paragraph [ref=e107]: Earnings
                - paragraph [ref=e108]: Sep 30
              - listitem [ref=e109]:
                - generic [ref=e110]:
                  - paragraph [ref=e111]: CAH
                  - paragraph [ref=e112]: Ex-div
                - paragraph [ref=e113]: Oct 1
              - listitem [ref=e114]:
                - generic [ref=e115]:
                  - paragraph [ref=e116]: CB
                  - paragraph [ref=e117]: Earnings
                - paragraph [ref=e118]: Oct 20
            - link "View more" [ref=e120] [cursor=pointer]:
              - /url: /dashboard/event-calendar
              - text: View more
              - img [ref=e121]
        - generic [ref=e123]:
          - generic [ref=e124]:
            - heading "Asset Allocation" [level=3] [ref=e125]
            - generic [ref=e126]:
              - generic [ref=e127]:
                - application [ref=e130]
                - generic:
                  - generic: $350.6K
                  - generic: Total
              - list [ref=e143]:
                - listitem [ref=e144]:
                  - generic [ref=e147]: Equity
                  - generic [ref=e148]:
                    - generic [ref=e149]: $86,958
                    - generic [ref=e150]: 24.80%
                - listitem [ref=e151]:
                  - generic [ref=e154]: Cash
                  - generic [ref=e155]:
                    - generic [ref=e156]: $1,000
                    - generic [ref=e157]: 0.29%
                - listitem [ref=e158]:
                  - generic [ref=e161]: Options (Net)
                  - generic [ref=e162]:
                    - generic [ref=e163]: $8,503
                    - generic [ref=e164]: 2.42%
          - generic [ref=e165]:
            - heading "Option Strategy Breakdown" [level=3] [ref=e166]
            - paragraph [ref=e167]: Total Options (Net)
            - paragraph [ref=e168]: $8,503
            - generic [ref=e169]:
              - generic [ref=e170]: Strategy
              - generic [ref=e171]: Market Value
              - generic [ref=e172]: "% of Portfolio"
            - list [ref=e173]:
              - listitem [ref=e174]:
                - generic [ref=e175]: Covered Calls
                - generic [ref=e177]: $0.00
                - generic [ref=e178]: 0.00%
              - listitem [ref=e179]:
                - generic [ref=e180]: Cash Secured Puts
                - generic [ref=e182]: $0.00
                - generic [ref=e183]: 0.00%
              - listitem [ref=e184]:
                - generic [ref=e185]: Protective Puts
                - generic [ref=e189]: +$7,790.85
                - generic [ref=e190]: +2.22%
              - listitem [ref=e191]:
                - generic [ref=e192]: Long Calls
                - generic [ref=e196]: +$619.29
                - generic [ref=e197]: +0.18%
              - listitem [ref=e198]:
                - generic [ref=e199]: Other Strategies
                - generic [ref=e203]: +$92.97
                - generic [ref=e204]: +0.03%
            - link "View option exposure" [ref=e206] [cursor=pointer]:
              - /url: /dashboard/options-research
              - text: View option exposure
              - img [ref=e207]
          - generic [ref=e209]:
            - heading "Broker Accounts" [level=3] [ref=e210]
            - generic [ref=e211]:
              - generic [ref=e212]:
                - generic [ref=e213]: Broker
                - generic [ref=e214]: Last Refresh
                - generic [ref=e215]: Market Value
                - generic [ref=e216]: "% of Total"
              - list [ref=e217]:
                - listitem [ref=e218]:
                  - generic [ref=e219]:
                    - generic [ref=e220]: ME
                    - generic [ref=e221]: Manual entry
                  - generic [ref=e222]: —
                  - generic [ref=e223]: $350,645
                  - generic [ref=e224]: 100.0%
              - generic [ref=e225]:
                - generic [ref=e226]: Total (1 Broker)
                - generic [ref=e227]: $350,645
                - generic [ref=e228]: 100%
            - link "Manage Accounts" [ref=e230] [cursor=pointer]:
              - /url: /dashboard/accounts
              - text: Manage Accounts
              - img [ref=e231]
        - generic [ref=e233]:
          - generic [ref=e235]:
            - heading "Top 10 Opportunities" [level=3] [ref=e236]
            - paragraph [ref=e237]: AI-powered option overlay strategies for your portfolio.
            - table [ref=e239]:
              - rowgroup [ref=e240]:
                - row "# Symbol Strategy Expiry (DTE) Strike Premium Yield% Assign. %" [ref=e241]:
                  - columnheader "#" [ref=e242]
                  - columnheader "Symbol" [ref=e243]
                  - columnheader "Strategy" [ref=e244]
                  - columnheader "Expiry (DTE)" [ref=e245]
                  - columnheader "Strike" [ref=e246]
                  - columnheader "Premium" [ref=e247]
                  - columnheader "Yield%" [ref=e248]
                  - columnheader "Assign. %" [ref=e249]
              - rowgroup [ref=e250]:
                - row "1 CB CSP Nov 20, 2026 (51 DTE) $325 $7.45 0.2% 98%" [ref=e251]:
                  - cell "1" [ref=e252]
                  - cell "CB" [ref=e253]
                  - cell "CSP" [ref=e254]:
                    - generic [ref=e255]: CSP
                  - cell "Nov 20, 2026 (51 DTE)" [ref=e256]:
                    - text: Nov 20, 2026
                    - generic [ref=e257]: (51 DTE)
                  - cell "$325" [ref=e258]
                  - cell "$7.45" [ref=e259]
                  - cell "0.2%" [ref=e260]
                  - cell "98%" [ref=e261]
                - row "2 CB CSP Nov 20, 2026 (51 DTE) $320 $5.75 0.1% 96%" [ref=e262]:
                  - cell "2" [ref=e263]
                  - cell "CB" [ref=e264]
                  - cell "CSP" [ref=e265]:
                    - generic [ref=e266]: CSP
                  - cell "Nov 20, 2026 (51 DTE)" [ref=e267]:
                    - text: Nov 20, 2026
                    - generic [ref=e268]: (51 DTE)
                  - cell "$320" [ref=e269]
                  - cell "$5.75" [ref=e270]
                  - cell "0.1%" [ref=e271]
                  - cell "96%" [ref=e272]
                - row "3 CB CSP Nov 20, 2026 (51 DTE) $325 $7.45 0.2% 98%" [ref=e273]:
                  - cell "3" [ref=e274]
                  - cell "CB" [ref=e275]
                  - cell "CSP" [ref=e276]:
                    - generic [ref=e277]: CSP
                  - cell "Nov 20, 2026 (51 DTE)" [ref=e278]:
                    - text: Nov 20, 2026
                    - generic [ref=e279]: (51 DTE)
                  - cell "$325" [ref=e280]
                  - cell "$7.45" [ref=e281]
                  - cell "0.2%" [ref=e282]
                  - cell "98%" [ref=e283]
                - row "4 CB CSP Nov 20, 2026 (51 DTE) $325 $7.45 0.2% 98%" [ref=e284]:
                  - cell "4" [ref=e285]
                  - cell "CB" [ref=e286]
                  - cell "CSP" [ref=e287]:
                    - generic [ref=e288]: CSP
                  - cell "Nov 20, 2026 (51 DTE)" [ref=e289]:
                    - text: Nov 20, 2026
                    - generic [ref=e290]: (51 DTE)
                  - cell "$325" [ref=e291]
                  - cell "$7.45" [ref=e292]
                  - cell "0.2%" [ref=e293]
                  - cell "98%" [ref=e294]
                - row "5 FICO CSP Oct 16, 2026 (16 DTE) $1,040 $44.30 0.6% 93%" [ref=e295]:
                  - cell "5" [ref=e296]
                  - cell "FICO" [ref=e297]
                  - cell "CSP" [ref=e298]:
                    - generic [ref=e299]: CSP
                  - cell "Oct 16, 2026 (16 DTE)" [ref=e300]:
                    - text: Oct 16, 2026
                    - generic [ref=e301]: (16 DTE)
                  - cell "$1,040" [ref=e302]
                  - cell "$44.30" [ref=e303]
                  - cell "0.6%" [ref=e304]
                  - cell "93%" [ref=e305]
                - row "6 FICO CSP Oct 16, 2026 (16 DTE) $1,040 $44.30 0.6% 93%" [ref=e306]:
                  - cell "6" [ref=e307]
                  - cell "FICO" [ref=e308]
                  - cell "CSP" [ref=e309]:
                    - generic [ref=e310]: CSP
                  - cell "Oct 16, 2026 (16 DTE)" [ref=e311]:
                    - text: Oct 16, 2026
                    - generic [ref=e312]: (16 DTE)
                  - cell "$1,040" [ref=e313]
                  - cell "$44.30" [ref=e314]
                  - cell "0.6%" [ref=e315]
                  - cell "93%" [ref=e316]
                - row "7 FICO CSP Oct 16, 2026 (16 DTE) $1,040 $44.30 0.6% 93%" [ref=e317]:
                  - cell "7" [ref=e318]
                  - cell "FICO" [ref=e319]
                  - cell "CSP" [ref=e320]:
                    - generic [ref=e321]: CSP
                  - cell "Oct 16, 2026 (16 DTE)" [ref=e322]:
                    - text: Oct 16, 2026
                    - generic [ref=e323]: (16 DTE)
                  - cell "$1,040" [ref=e324]
                  - cell "$44.30" [ref=e325]
                  - cell "0.6%" [ref=e326]
                  - cell "93%" [ref=e327]
                - row "8 CB CSP Oct 16, 2026 (16 DTE) $330 $4.85 0.1% 95%" [ref=e328]:
                  - cell "8" [ref=e329]
                  - cell "CB" [ref=e330]
                  - cell "CSP" [ref=e331]:
                    - generic [ref=e332]: CSP
                  - cell "Oct 16, 2026 (16 DTE)" [ref=e333]:
                    - text: Oct 16, 2026
                    - generic [ref=e334]: (16 DTE)
                  - cell "$330" [ref=e335]
                  - cell "$4.85" [ref=e336]
                  - cell "0.1%" [ref=e337]
                  - cell "95%" [ref=e338]
                - row "9 CB CSP Oct 16, 2026 (16 DTE) $330 $4.85 0.1% 95%" [ref=e339]:
                  - cell "9" [ref=e340]
                  - cell "CB" [ref=e341]
                  - cell "CSP" [ref=e342]:
                    - generic [ref=e343]: CSP
                  - cell "Oct 16, 2026 (16 DTE)" [ref=e344]:
                    - text: Oct 16, 2026
                    - generic [ref=e345]: (16 DTE)
                  - cell "$330" [ref=e346]
                  - cell "$4.85" [ref=e347]
                  - cell "0.1%" [ref=e348]
                  - cell "95%" [ref=e349]
                - row "10 CB CSP Oct 16, 2026 (16 DTE) $330 $4.85 0.1% 95%" [ref=e350]:
                  - cell "10" [ref=e351]
                  - cell "CB" [ref=e352]
                  - cell "CSP" [ref=e353]:
                    - generic [ref=e354]: CSP
                  - cell "Oct 16, 2026 (16 DTE)" [ref=e355]:
                    - text: Oct 16, 2026
                    - generic [ref=e356]: (16 DTE)
                  - cell "$330" [ref=e357]
                  - cell "$4.85" [ref=e358]
                  - cell "0.1%" [ref=e359]
                  - cell "95%" [ref=e360]
            - generic [ref=e361]:
              - generic [ref=e362]:
                - generic [ref=e363]: CC
                - text: Covered Call
              - generic [ref=e364]:
                - generic [ref=e365]: CSP
                - text: Cash Secured Put
              - generic [ref=e366]:
                - generic [ref=e367]: PP
                - text: Protective Put
              - generic [ref=e368]:
                - generic [ref=e369]: LC
                - text: Long Call
            - link "View all opportunities" [ref=e371] [cursor=pointer]:
              - /url: /dashboard/opportunities
              - text: View all opportunities
              - img [ref=e372]
          - generic [ref=e375]:
            - generic [ref=e376]:
              - generic [ref=e377]:
                - heading "Option Expiry Overview" [level=3] [ref=e378]
                - paragraph [ref=e379]: By count of open option contracts
              - generic [ref=e380]:
                - generic [ref=e381]: OTM
                - generic [ref=e383]: NTM
                - generic [ref=e385]: ATM
                - generic [ref=e387]: ITM
            - generic [ref=e389]:
              - button "Short Options" [ref=e390]
              - button "Long Options" [ref=e391]
            - paragraph [ref=e392]: No open short options
        - generic [ref=e394]:
          - generic [ref=e395]:
            - paragraph [ref=e396]: OolTool Performance
            - img [ref=e397]
          - paragraph [ref=e401]: How much value OolTool's suggestions have generated — separate from your portfolio's own gains.
          - generic [ref=e402]:
            - generic [ref=e403]:
              - generic [ref=e404]:
                - img [ref=e405]
                - paragraph [ref=e409]: Opportunities Executed
              - paragraph [ref=e410]: 0 / 0
              - paragraph [ref=e411]: No scenarios yet
            - generic [ref=e412]:
              - generic [ref=e413]:
                - img [ref=e414]
                - paragraph [ref=e416]: Premium Generated
              - paragraph [ref=e417]: $0
              - paragraph [ref=e418]: From executed scenarios
            - generic [ref=e419]:
              - generic [ref=e420]:
                - img [ref=e421]
                - paragraph [ref=e424]: Successful Opportunities
              - paragraph [ref=e425]: 0 / 0
              - paragraph [ref=e426]: None settled yet
          - generic [ref=e427]:
            - generic [ref=e428]:
              - paragraph [ref=e429]: Realized opportunity P&L
              - paragraph [ref=e430]: $0
            - generic [ref=e431]:
              - paragraph [ref=e432]: Open opportunity P&L
              - paragraph [ref=e433]: $0
          - generic [ref=e434]:
            - generic [ref=e435]: "Covered Calls: 0"
            - generic [ref=e436]: "Cash-Secured Puts: 0"
            - generic [ref=e437]: "Other: 0"
    - contentinfo [ref=e438]:
      - generic [ref=e439]:
        - generic [ref=e440]:
          - paragraph [ref=e441]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e442]:
            - link "Privacy Policy" [ref=e444] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e445]:
              - generic [ref=e446]: ·
              - link "Terms of Service" [ref=e447] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e448]:
              - generic [ref=e449]: ·
              - link "Disclosures" [ref=e450] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e451]:
              - generic [ref=e452]: ·
              - link "Risk Warning" [ref=e453] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e454]:
              - generic [ref=e455]: ·
              - link "Contact" [ref=e456] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e457]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e458]
```

# Test source

```ts
  1395 |     ).toMatch(
  1396 |       /covered call|cash secured put|protective put|long call|\bCC\b|\bCSP\b/i
  1397 |     );
  1398 | 
  1399 |     const ignored =
  1400 |       new Set([
  1401 |         'CC',
  1402 |         'CSP',
  1403 |         'PP',
  1404 |         'LC',
  1405 |         'ATM',
  1406 |         'ITM',
  1407 |         'OTM',
  1408 |         'DTE',
  1409 |         'USD',
  1410 |         'AI'
  1411 |       ]);
  1412 | 
  1413 |     const symbols =
  1414 |       [...new Set(
  1415 |         [...text.matchAll(
  1416 |           /\b[A-Z]{2,5}\b/g
  1417 |         )].map(
  1418 |           (match) => match[0]
  1419 |         ).filter(
  1420 |           (symbol) =>
  1421 |             !ignored.has(symbol)
  1422 |         )
  1423 |       )];
  1424 | 
  1425 |     expect(
  1426 |       symbols.length
  1427 |     ).toBeGreaterThan(
  1428 |       0
  1429 |     );
  1430 | 
  1431 |     expect(
  1432 |       symbols.length
  1433 |     ).toBeLessThanOrEqual(
  1434 |       10
  1435 |     );
  1436 | 
  1437 |     Logger.success(
  1438 |       'Top 10 Opportunities are shown'
  1439 |     );
  1440 |   }
  1441 | 
  1442 |   async validatePerformanceSummary() {
  1443 |     Logger.info(
  1444 |       'Validating OolTool Performance'
  1445 |     );
  1446 | 
  1447 |     const text =
  1448 |       await this.cardText(
  1449 |         /ooltool performance/i,
  1450 |         /opportunities executed|successful opportunities/i
  1451 |       );
  1452 | 
  1453 |     expect(
  1454 |       text
  1455 |     ).toMatch(
  1456 |       /\d+\s*\/\s*\d+/
  1457 |     );
  1458 | 
  1459 |     Logger.success(
  1460 |       'OolTool Performance is shown'
  1461 |     );
  1462 |   }
  1463 | 
  1464 |   async validateDashboardCardLinks() {
  1465 |     Logger.info(
  1466 |       'Validating dashboard card links'
  1467 |     );
  1468 | 
  1469 |     const labels = [
  1470 |       /view option exposure/i,
  1471 |       /manage accounts/i,
  1472 |       /view all opportunities/i,
  1473 |       /view full expiry calendar/i
  1474 |     ];
  1475 | 
  1476 |     for (const label of labels) {
  1477 |       await expect(
  1478 |         this.page.getByRole(
  1479 |           'link',
  1480 |           {
  1481 |             name: label
  1482 |           }
  1483 |         ).or(
  1484 |           this.page.getByRole(
  1485 |             'button',
  1486 |             {
  1487 |               name: label
  1488 |             }
  1489 |           )
  1490 |         ).or(
  1491 |           this.page.getByText(
  1492 |             label
  1493 |           )
  1494 |         ).first()
> 1495 |       ).toBeVisible({
       |         ^ Error: expect(locator).toBeVisible() failed
  1496 |         timeout: 15000
  1497 |       });
  1498 |     }
  1499 | 
  1500 |     Logger.success(
  1501 |       'Dashboard card links are visible'
  1502 |     );
  1503 |   }
  1504 | 
  1505 |   async validateExpiryOverview() {
  1506 |     Logger.info(
  1507 |       'Validating Option Expiry Overview'
  1508 |     );
  1509 | 
  1510 |     const text =
  1511 |       await this.cardText(
  1512 |         /option expiry overview/i,
  1513 |         /expiration|symbol/i
  1514 |       );
  1515 | 
  1516 |     const hasContractRow =
  1517 |       /\b[A-Z]{2,5}\b/.test(
  1518 |         text
  1519 |       ) &&
  1520 |       /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}\b/i.test(
  1521 |         text
  1522 |       );
  1523 | 
  1524 |     const empty =
  1525 |       /no expir|none|no option/i.test(
  1526 |         text
  1527 |       );
  1528 | 
  1529 |     expect(
  1530 |       empty || hasContractRow
  1531 |     ).toBe(
  1532 |       true
  1533 |     );
  1534 | 
  1535 |     Logger.success(
  1536 |       'Option Expiry Overview is visible'
  1537 |     );
  1538 |   }
  1539 | 
  1540 |   async validate() {
  1541 | 
  1542 | await this.validateLoaded();
  1543 | 
  1544 |     Logger.step(
  1545 |   'Refreshing Dashboard'
  1546 | );
  1547 | 
  1548 |   await this.refresh();
  1549 | 
  1550 |     await expect(this.page)
  1551 |       .toHaveURL(
  1552 |         /dashboard/,
  1553 |         {
  1554 |           timeout: 30000,
  1555 |         }
  1556 |       );
  1557 | 
  1558 |   await this.validateNoLoadError();
  1559 | 
  1560 |    Logger.success(
  1561 |   'Dashboard persists after refresh'
  1562 | );
  1563 |   }
  1564 | }
  1565 | 
```