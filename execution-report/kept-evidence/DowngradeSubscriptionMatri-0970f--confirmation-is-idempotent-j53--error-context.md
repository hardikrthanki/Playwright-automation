# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DowngradeSubscriptionMatrix.spec.ts >> Downgrade Subscription Use Case 4 Matrix >> SC-147 - Double-clicking downgrade confirmation is idempotent
- Location: tests\DowngradeSubscriptionMatrix.spec.ts:481:13

# Error details

```
Error: After a double-click the downgrade should be scheduled exactly once.

expect(received).toMatch(expected)

Expected pattern: /downgrade to income[\s\S]{0,40}scheduled/i
Received string:  "Billing & Subscription·
Manage your plan, payment methods, and billing history.·
Overview
Plans
History
Founding Team's Beta Pricing·
Save while helping us build OolTool — Beta pricing for the first 1,000 users.·
Note: OolTool is iteratively adding new features, new brokers and additional symbols.·
Change Plan
Monthly
Annual·
Curious·
Explore your Portfolio·
Free·
Manual Upload Only
Positions (10)
Simulations (10)
CTAs Refresh
Covered Calls
OOLS Score
Switch to Free·
Income·
Build your Portfolio·
Was
$29/month·
Now
$2.90
/month·
BETA
Broker Integration (1)
Account Linked (1)
Positions (100)
CTAs Unlimited
Simulations Unlimited
Covered Calls/Puts CTAs
Earnings Notifications
Dividend Notifications
OOLS Score
Downgrade·
Overlay Strategists·
Optimize your Portfolio·
Was
$79/month·
Now
$7.90
/month·
BETA
Broker Integration (5)
Account Linked (10)
Positions (500)
CTAs & Simulations Unlimited
Covered Calls/Puts CTAs
Earnings & Dividends Notifications
ITM/ATM resolve suggestions
Portfolio Analytics
Bulk Portfolio Load
OOLS Score
Current plan·
Portfolio Hedger·
Optimize your Portfolio·
Was
$149/month·
Now
$14.90
/month·
BETA
Broker Integration (10)
Account Linked (20)
Positions (1000)
CTAs & Simulations Unlimited
Covered Calls/Puts CTAs
Protective Puts
Option roll suggestions
Earnings & Dividends Notifications
ITM/ATM resolve suggestions
Portfolio Analytics
Bulk Portfolio Load
OOLS Score
Upgrade·
Upgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then.·
Danger Zone
Cancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.
Cancel Subscription"
```

# Test source

```ts
  1407 |               )
  1408 |           );
  1409 |         },
  1410 | 
  1411 |       'saved-card-preserved':
  1412 |         stepSavedCardPreserved,
  1413 | 
  1414 |       'single-active-plan':
  1415 |         stepExactlyOneCurrentPlan,
  1416 | 
  1417 |       'user-data-preserved':
  1418 |         stepUserDataPreserved,
  1419 | 
  1420 |       'cancel-scheduled-downgrade':
  1421 |         async (ctx) => {
  1422 |           const control =
  1423 |             await findCancelScheduledControl(
  1424 |               ctx,
  1425 |               /cancel (the )?(scheduled )?(downgrade|change)|keep (my )?(current )?plan|undo (the )?(downgrade|change)|don'?t downgrade|stay on overlay/i
  1426 |             );
  1427 | 
  1428 |           await control.click();
  1429 | 
  1430 |           const confirm =
  1431 |             ctx.page
  1432 |               .getByRole('dialog')
  1433 |               .getByRole('button', {
  1434 |                 name: /^(yes|confirm|keep|cancel downgrade)/i
  1435 |               })
  1436 |               .first();
  1437 | 
  1438 |           if (
  1439 |             await confirm
  1440 |               .isVisible({
  1441 |                 timeout: 3000
  1442 |               })
  1443 |               .catch(() => false)
  1444 |           ) {
  1445 |             await confirm.click();
  1446 |           }
  1447 | 
  1448 |           await stepActivePlan(
  1449 |             ctx,
  1450 |             'Overlay Strategists'
  1451 |           );
  1452 |         }
  1453 |     }
  1454 |   },
  1455 | 
  1456 |   DOWNGRADE_DOUBLE_CLICK_OVERLAY_TO_INCOME: {
  1457 |     setup: async (ctx) => {
  1458 |       await buyPlan(
  1459 |         ctx,
  1460 |         'Overlay Strategists',
  1461 |         'monthly'
  1462 |       );
  1463 | 
  1464 |       startRequestRecorder(ctx);
  1465 | 
  1466 |       await ctx.billing.validateOverview();
  1467 | 
  1468 |       await ctx.billing.openMonthlyDowngradeOrRetention({
  1469 |         targetPlan:
  1470 |           'Income Builder'
  1471 |       });
  1472 | 
  1473 |       const decline =
  1474 |         ctx.page
  1475 |           .getByRole('dialog')
  1476 |           .getByRole('button', {
  1477 |             name: /decline|no,? thanks|continue|downgrade anyway|skip|not now/i
  1478 |           })
  1479 |           .first();
  1480 | 
  1481 |       if (
  1482 |         await decline
  1483 |           .isVisible({ timeout: 3000 })
  1484 |           .catch(() => false)
  1485 |       ) {
  1486 |         await decline.click();
  1487 |       }
  1488 | 
  1489 |       await confirmWithDoubleClick(
  1490 |         ctx
  1491 |       );
  1492 |     },
  1493 |     steps: {
  1494 |       'single-downgrade-request':
  1495 |         async (ctx) => {
  1496 |           expectNoDuplicateActionRequests(
  1497 |             ctx.requests,
  1498 |             'Double-click downgrade'
  1499 |           );
  1500 | 
  1501 |           // The downgrade must still be scheduled (not undone by the 2nd click).
  1502 |           await ctx.billing.validateOverview();
  1503 | 
  1504 |           expect(
  1505 |             await mainText(ctx),
  1506 |             'After a double-click the downgrade should be scheduled exactly once.'
> 1507 |           ).toMatch(
       |             ^ Error: After a double-click the downgrade should be scheduled exactly once.
  1508 |             /downgrade to income[\s\S]{0,40}scheduled/i
  1509 |           );
  1510 |         },
  1511 | 
  1512 |       'access-kept-until-effective-date':
  1513 |         async (ctx) => {
  1514 |           await stepActivePlan(
  1515 |             ctx,
  1516 |             'Overlay Strategists'
  1517 |           );
  1518 |         }
  1519 |     }
  1520 |   },
  1521 | 
  1522 |   INTERVAL_INCOME_MONTHLY_TO_ANNUAL: {
  1523 |     setup: async (ctx) => {
  1524 |       await buyPlan(
  1525 |         ctx,
  1526 |         'Income Builder',
  1527 |         'monthly'
  1528 |       );
  1529 | 
  1530 |       ctx.state.paidBeforeChange =
  1531 |         await countPaidTransactions(
  1532 |           ctx
  1533 |         );
  1534 | 
  1535 |       await ctx.billing.validateOverview();
  1536 | 
  1537 |       await changePlan(
  1538 |         ctx,
  1539 |         {
  1540 |           targetPlan:
  1541 |             'Income Builder',
  1542 |           action: 'interval',
  1543 |           interval: 'annual'
  1544 |         }
  1545 |       );
  1546 | 
  1547 |       await ctx.billing.validateActivePlan(
  1548 |         'Income Builder'
  1549 |       );
  1550 | 
  1551 |       ctx.state.paidAfterChange =
  1552 |         await countPaidTransactions(
  1553 |           ctx
  1554 |         );
  1555 |     },
  1556 |     steps: {
  1557 |       'entitlements-preserved':
  1558 |         async (ctx) => {
  1559 |           await stepActivePlan(
  1560 |             ctx,
  1561 |             'Income Builder'
  1562 |           );
  1563 |         },
  1564 | 
  1565 |       'transaction-history':
  1566 |         async (ctx) => {
  1567 |           await stepTransactionPaidCount(
  1568 |             ctx,
  1569 |             1
  1570 |           );
  1571 |         },
  1572 | 
  1573 |       'annual-amount':
  1574 |         async (ctx) => {
  1575 |           await stepTransactionAmount(
  1576 |             ctx,
  1577 |             PLAN_PRICES[
  1578 |               'Income Builder'
  1579 |             ].annual
  1580 |           );
  1581 |         },
  1582 | 
  1583 |       'confirmation-email':
  1584 |         async (ctx) => {
  1585 |           await waitForEmail(
  1586 |             ctx,
  1587 |             'billing interval confirmation',
  1588 |             (mail) =>
  1589 |               subjectMatches(
  1590 |                 mail,
  1591 |                 /annual|yearly|billing (interval|cycle|period)|plan (has )?(changed|updated)|subscription (updated|changed)|switch/i
  1592 |               )
  1593 |           );
  1594 |         },
  1595 | 
  1596 |       'saved-card-preserved':
  1597 |         stepSavedCardPreserved,
  1598 | 
  1599 |       'no-checkout-reprompt':
  1600 |         stepNoCheckoutReprompt,
  1601 | 
  1602 |       'single-active-plan':
  1603 |         stepExactlyOneCurrentPlan
  1604 |     }
  1605 |   },
  1606 | 
  1607 |   INTERVAL_INCOME_ANNUAL_TO_MONTHLY: {
```