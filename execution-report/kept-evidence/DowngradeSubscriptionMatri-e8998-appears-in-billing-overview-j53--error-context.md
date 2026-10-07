# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DowngradeSubscriptionMatrix.spec.ts >> Downgrade Subscription Use Case 4 Matrix >> SC-141 - Scheduled downgrade appears in billing overview
- Location: tests\DowngradeSubscriptionMatrix.spec.ts:481:13

# Error details

```
Error: Billing overview should show "Downgrade to Income scheduled" with its effective date.

expect(received).toMatch(expected)

Expected pattern: /downgrade to income[\s\S]{0,40}scheduled[\s\S]{0,80}takes effect/i
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
  1513 |         },
  1514 | 
  1515 |       'single-charge':
  1516 |         async (ctx) => {
  1517 |           await stepTransactionPaidCount(
  1518 |             ctx,
  1519 |             1
  1520 |           );
  1521 |         },
  1522 | 
  1523 |       'target-plan-active':
  1524 |         async (ctx) => {
  1525 |           await stepActivePlan(
  1526 |             ctx,
  1527 |             'Overlay Strategists'
  1528 |           );
  1529 |         }
  1530 |     }
  1531 |   },
  1532 | 
  1533 |   DOWNGRADE_OVERLAY_TO_INCOME_MONTHLY: {
  1534 |     setup: async (ctx) => {
  1535 |       await buyPlan(
  1536 |         ctx,
  1537 |         'Overlay Strategists',
  1538 |         'monthly'
  1539 |       );
  1540 |     },
  1541 |     steps: {
  1542 |       'impact-warning':
  1543 |         async (ctx) => {
  1544 |           const text =
  1545 |             await readDowngradeDialog(
  1546 |               ctx,
  1547 |               'Income Builder'
  1548 |             );
  1549 | 
  1550 |           expect(
  1551 |             text,
  1552 |             'Downgrade confirmation should warn about features that will be lost or restricted.'
  1553 |           ).toMatch(
  1554 |             /feature|lose|restrict|reduced|no longer/i
  1555 |           );
  1556 |         },
  1557 | 
  1558 |       'account-limits-shown':
  1559 |         async (ctx) => {
  1560 |           const text =
  1561 |             await readDowngradeDialog(
  1562 |               ctx,
  1563 |               'Income Builder'
  1564 |             );
  1565 | 
  1566 |           expect(
  1567 |             text,
  1568 |             'Downgrade confirmation should show the limits of the lower plan (brokers, accounts, positions).'
  1569 |           ).toMatch(
  1570 |             /limit|up to|\d+\s*(broker|account|position)|broker|position/i
  1571 |           );
  1572 |         },
  1573 | 
  1574 |       'schedule-at-renewal':
  1575 |         async (ctx) => {
  1576 |           await ctx.billing.validateOverview();
  1577 | 
  1578 |           await ctx.billing.declineRetentionAndPreviewOrScheduleDowngrade({
  1579 |             currentPlan:
  1580 |               'Overlay Strategists',
  1581 |             targetPlan:
  1582 |               'Income Builder',
  1583 |             schedule: true
  1584 |           });
  1585 |         },
  1586 | 
  1587 |       'access-kept-until-effective-date':
  1588 |         async (ctx) => {
  1589 |           await stepActivePlan(
  1590 |             ctx,
  1591 |             'Overlay Strategists'
  1592 |           );
  1593 | 
  1594 |           await openPlansTab(ctx);
  1595 | 
  1596 |           await expect(
  1597 |             ctx.page.locator('main')
  1598 |           ).not.toContainText(
  1599 |             /downgrade (is )?complete|you are now on income builder/i
  1600 |           );
  1601 |         },
  1602 | 
  1603 |       'scheduled-downgrade-in-overview':
  1604 |         async (ctx) => {
  1605 |           await ctx.billing.validateOverview();
  1606 | 
  1607 |           const text =
  1608 |             await mainText(ctx);
  1609 | 
  1610 |           expect(
  1611 |             text,
  1612 |             'Billing overview should show "Downgrade to Income scheduled" with its effective date.'
> 1613 |           ).toMatch(
       |             ^ Error: Billing overview should show "Downgrade to Income scheduled" with its effective date.
  1614 |             /downgrade to income[\s\S]{0,40}scheduled[\s\S]{0,80}takes effect/i
  1615 |           );
  1616 |         },
  1617 | 
  1618 |       'scheduled-downgrade-in-history':
  1619 |         async (ctx) => {
  1620 |           await ctx.billing.validateOverview();
  1621 | 
  1622 |           await clickTab(
  1623 |             ctx.billing.historyTab
  1624 |           );
  1625 | 
  1626 |           await expect(
  1627 |             ctx.page.locator('main'),
  1628 |             'Subscription history should list the scheduled downgrade.'
  1629 |           ).toContainText(
  1630 |             /downgrad|plan change|scheduled/i,
  1631 |             {
  1632 |               timeout: 15000
  1633 |             }
  1634 |           );
  1635 |         },
  1636 | 
  1637 |       'confirmation-email':
  1638 |         async (ctx) => {
  1639 |           await waitForEmail(
  1640 |             ctx,
  1641 |             'downgrade confirmation',
  1642 |             (mail) =>
  1643 |               subjectMatches(
  1644 |                 mail,
  1645 |                 /downgrad|plan change|plan (has )?(changed|updated)|subscription (updated|changed)|scheduled/i
  1646 |               )
  1647 |           );
  1648 |         },
  1649 | 
  1650 |       'saved-card-preserved':
  1651 |         stepSavedCardPreserved,
  1652 | 
  1653 |       'single-active-plan':
  1654 |         stepExactlyOneCurrentPlan,
  1655 | 
  1656 |       'user-data-preserved':
  1657 |         stepUserDataPreserved,
  1658 | 
  1659 |       'cancel-scheduled-downgrade':
  1660 |         async (ctx) => {
  1661 |           const control =
  1662 |             await findCancelScheduledControl(
  1663 |               ctx,
  1664 |               /cancel (the )?(scheduled )?(downgrade|change)|keep (my )?(current )?plan|undo (the )?(downgrade|change)|don'?t downgrade|stay on overlay/i
  1665 |             );
  1666 | 
  1667 |           await control.click();
  1668 | 
  1669 |           const confirm =
  1670 |             ctx.page
  1671 |               .getByRole('dialog')
  1672 |               .getByRole('button', {
  1673 |                 name: /^(yes|confirm|keep|cancel downgrade)/i
  1674 |               })
  1675 |               .first();
  1676 | 
  1677 |           if (
  1678 |             await confirm
  1679 |               .isVisible({
  1680 |                 timeout: 3000
  1681 |               })
  1682 |               .catch(() => false)
  1683 |           ) {
  1684 |             await confirm.click();
  1685 |           }
  1686 | 
  1687 |           await stepActivePlan(
  1688 |             ctx,
  1689 |             'Overlay Strategists'
  1690 |           );
  1691 |         }
  1692 |     }
  1693 |   },
  1694 | 
  1695 |   DOWNGRADE_DOUBLE_CLICK_OVERLAY_TO_INCOME: {
  1696 |     setup: async (ctx) => {
  1697 |       await buyPlan(
  1698 |         ctx,
  1699 |         'Overlay Strategists',
  1700 |         'monthly'
  1701 |       );
  1702 | 
  1703 |       startRequestRecorder(ctx);
  1704 | 
  1705 |       await ctx.billing.validateOverview();
  1706 | 
  1707 |       await ctx.billing.openMonthlyDowngradeOrRetention({
  1708 |         targetPlan:
  1709 |           'Income Builder'
  1710 |       });
  1711 | 
  1712 |       const decline =
  1713 |         ctx.page
```