# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Prepared paid user can preview monthly and annual upgrade calculations
- Location: tests\SubscriptionLifecycleExecution.spec.ts:139:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').or(getByRole('alertdialog')).filter({ hasText: /(?:upgrade|switch)\s+to\s+(?:Portfolio Hedger|Portfolio Hedge|3-Advanced)/i }).or(getByText(/(?:upgrade|downgrade|switch)\s+to\s+(?:Portfolio Hedger|Portfolio Hedge|3-Advanced)/i)).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('dialog').or(getByRole('alertdialog')).filter({ hasText: /(?:upgrade|switch)\s+to\s+(?:Portfolio Hedger|Portfolio Hedge|3-Advanced)/i }).or(getByText(/(?:upgrade|downgrade|switch)\s+to\s+(?:Portfolio Hedger|Portfolio Hedge|3-Advanced)/i)).first()

```

# Page snapshot

```yaml
- generic:
  - generic:
    - banner:
      - generic:
        - generic:
          - generic:
            - link:
              - /url: /dashboard
              - img
          - generic:
            - navigation:
              - link:
                - /url: /dashboard
                - text: Dashboard
              - link:
                - /url: /dashboard/opportunities
                - text: Opportunities
              - generic:
                - button:
                  - generic: Portfolio
                  - img
              - generic:
                - button:
                  - generic: Research
                  - img
              - link:
                - /url: /academy
                - text: Academy
              - link:
                - /url: /dashboard/support
                - text: Support
          - generic:
            - button: Delayed
            - button:
              - img
              - generic: Sync all
            - button:
              - img
            - button:
              - img
              - generic: "18"
            - button:
              - generic:
                - generic: QU
    - main:
      - generic:
        - generic:
          - heading [level=1]: Billing & Subscription
          - paragraph: Manage your plan, payment methods, and billing history.
        - generic:
          - tablist:
            - tab: Overview
            - tab [selected]: Plans
            - tab: History
          - tabpanel:
            - note:
              - generic:
                - generic:
                  - img
                - generic: Founding Team's Beta Pricing
              - generic:
                - paragraph: Save while helping us build OolTool — Beta pricing for the first 1,000 users.
                - paragraph: "Note: OolTool is iteratively adding new features, new brokers and additional symbols."
            - generic:
              - generic:
                - generic:
                  - img
                  - text: Change Plan
                - generic:
                  - button: Monthly
                  - button: Annual
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Curious
                      - paragraph: Explore your Portfolio
                      - generic:
                        - paragraph: Free
                    - list:
                      - listitem:
                        - img
                        - text: Manual Upload Only
                      - listitem:
                        - img
                        - text: Positions (10)
                      - listitem:
                        - img
                        - text: Simulations (10)
                      - listitem:
                        - img
                        - text: CTAs Refresh
                      - listitem:
                        - img
                        - text: Covered Calls
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Switch to Free
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Income
                      - paragraph: Build your Portfolio
                      - generic:
                        - generic:
                          - generic:
                            - paragraph:
                              - generic: $290
                              - generic: /year
                            - generic: Beta
                    - list:
                      - listitem:
                        - img
                        - text: Broker Integration (1)
                      - listitem:
                        - img
                        - text: Account Linked (1)
                      - listitem:
                        - img
                        - text: Positions (100)
                      - listitem:
                        - img
                        - text: CTAs Unlimited
                      - listitem:
                        - img
                        - text: Simulations Unlimited
                      - listitem:
                        - img
                        - text: Covered Calls/Puts CTAs
                      - listitem:
                        - img
                        - text: Earnings Notifications
                      - listitem:
                        - img
                        - text: Dividend Notifications
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Upgrade
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Overlay Strategists
                      - paragraph: Optimize your Portfolio
                      - generic:
                        - generic:
                          - generic:
                            - paragraph:
                              - generic: $790
                              - generic: /year
                            - generic: Beta
                    - list:
                      - listitem:
                        - img
                        - text: Broker Integration (5)
                      - listitem:
                        - img
                        - text: Account Linked (10)
                      - listitem:
                        - img
                        - text: Positions (500)
                      - listitem:
                        - img
                        - text: CTAs & Simulations Unlimited
                      - listitem:
                        - img
                        - text: Covered Calls/Puts CTAs
                      - listitem:
                        - img
                        - text: Earnings & Dividends Notifications
                      - listitem:
                        - img
                        - text: ITM/ATM resolve suggestions
                      - listitem:
                        - img
                        - text: Portfolio Analytics
                      - listitem:
                        - img
                        - text: Bulk Portfolio Load
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Upgrade
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Portfolio Hedger
                      - paragraph: Optimize your Portfolio
                      - generic:
                        - generic:
                          - generic:
                            - paragraph:
                              - generic: $1,490
                              - generic: /year
                            - generic: Beta
                    - list:
                      - listitem:
                        - img
                        - text: Broker Integration (10)
                      - listitem:
                        - img
                        - text: Account Linked (20)
                      - listitem:
                        - img
                        - text: Positions (1000)
                      - listitem:
                        - img
                        - text: CTAs & Simulations Unlimited
                      - listitem:
                        - img
                        - text: Covered Calls/Puts CTAs
                      - listitem:
                        - img
                        - text: Protective Puts
                      - listitem:
                        - img
                        - text: Option roll suggestions
                      - listitem:
                        - img
                        - text: Earnings & Dividends Notifications
                      - listitem:
                        - img
                        - text: ITM/ATM resolve suggestions
                      - listitem:
                        - img
                        - text: Portfolio Analytics
                      - listitem:
                        - img
                        - text: Bulk Portfolio Load
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Upgrade
                - paragraph: Upgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then.
        - generic:
          - generic:
            - generic: Danger Zone
            - generic: Cancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.
          - generic:
            - button: Cancel Subscription
    - contentinfo:
      - generic:
        - generic:
          - paragraph: © 2026 Ools Inc. All rights reserved.
          - navigation:
            - generic:
              - link:
                - /url: /privacy-policy
                - text: Privacy Policy
            - generic:
              - generic: ·
              - link:
                - /url: /terms-of-services
                - text: Terms of Service
            - generic:
              - generic: ·
              - link:
                - /url: /disclosures
                - text: Disclosures
            - generic:
              - generic: ·
              - link:
                - /url: /risk-warning
                - text: Risk Warning
            - generic:
              - generic: ·
              - link:
                - /url: /contact
                - text: Contact
        - paragraph: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert
  - dialog "Upgrade to Income?" [ref=e2]:
    - generic [ref=e3]:
      - heading "Upgrade to Income?" [level=2] [ref=e4]:
        - img [ref=e5]
        - text: Upgrade to Income?
      - paragraph [ref=e8]: You'll be charged the prorated amount below on your card on file now. Your plan then renews at the new price on the date shown.
    - note [ref=e9]:
      - generic [ref=e10]:
        - img [ref=e12]
        - generic [ref=e15]: Founding Team's Beta Pricing
      - generic [ref=e17]:
        - paragraph [ref=e18]: Save while helping us build OolTool — Beta pricing for the first 1,000 users.
        - paragraph [ref=e19]: "Note: OolTool is iteratively adding new features, new brokers and additional symbols."
    - generic [ref=e20]:
      - generic [ref=e21]:
        - term [ref=e22]: Income charge
        - definition [ref=e23]: $290.00
      - generic [ref=e24]:
        - term [ref=e25]: Credit for unused time
        - definition [ref=e26]: "-$51.43"
      - generic [ref=e27]:
        - term [ref=e28]: Amount due today
        - definition [ref=e29]: $238.57
      - generic [ref=e30]:
        - term [ref=e31]: New recurring amount
        - definition [ref=e32]: $290.00/year
      - generic [ref=e33]:
        - term [ref=e34]: Next billing date
        - definition [ref=e35]: October 5, 2027
    - generic [ref=e36] [cursor=pointer]:
      - checkbox "I agree to the Terms & Conditions" [active] [ref=e37]
      - generic [ref=e38]:
        - text: I agree to the
        - link "Terms & Conditions" [ref=e39]:
          - /url: /terms-of-services
        - text: ","
        - link "Privacy Policy" [ref=e40]:
          - /url: /privacy-policy
        - text: and
        - link "Refund & Cancellation Policy" [ref=e41]:
          - /url: /terms-of-services#cancellation
        - text: .
    - generic [ref=e42]:
      - button "Cancel" [ref=e43] [cursor=pointer]
      - button "Confirm & pay" [disabled]
    - button "Close" [ref=e44]:
      - img [ref=e45]
      - generic [ref=e48]: Close
```

# Test source

```ts
  1590 |         timeout: 8000
  1591 |       }).catch(
  1592 |         () => false
  1593 |       )
  1594 |     ) {
  1595 |       Logger.success(
  1596 |         `${options.action} calculation preview opened for ${options.targetPlan} ${options.interval}`
  1597 |       );
  1598 | 
  1599 |       return;
  1600 |     }
  1601 |   }
  1602 | 
  1603 |   let actionButton;
  1604 | 
  1605 |   try {
  1606 |     actionButton =
  1607 |       await this.findPlanActionButton(
  1608 |         options.targetPlan,
  1609 |         options.action
  1610 |       );
  1611 |   } catch (error) {
  1612 |     if (options.action !== 'interval') {
  1613 |       throw error;
  1614 |     }
  1615 | 
  1616 |     const intervalSwitch =
  1617 |       this.page.getByRole(
  1618 |         'button',
  1619 |         {
  1620 |           name: /^(?:switch)$|switch to annual|change to annual|to annual|switch to monthly|change to monthly|to monthly/i
  1621 |         }
  1622 |       ).first();
  1623 | 
  1624 |     if (
  1625 |       await intervalSwitch.isVisible({
  1626 |         timeout: 3000
  1627 |       }).catch(
  1628 |         () => false
  1629 |       )
  1630 |     ) {
  1631 |       actionButton =
  1632 |         intervalSwitch;
  1633 |     } else {
  1634 |       throw error;
  1635 |     }
  1636 |   }
  1637 | 
  1638 |   await safeClick(
  1639 |     actionButton,
  1640 |     `${options.action} ${options.targetPlan}`
  1641 |   );
  1642 | 
  1643 |   const dialog =
  1644 |     this.planChangeDialog(
  1645 |       options
  1646 |     );
  1647 | 
  1648 |   await expect(
  1649 |     dialog
  1650 |   ).toBeVisible({
  1651 |     timeout: 15000
  1652 |   });
  1653 | 
  1654 |   const dialogText =
  1655 |     await dialog.innerText();
  1656 | 
  1657 |   const showsMonthly =
  1658 |     /\/month|per month/i.test(
  1659 |       dialogText
  1660 |     );
  1661 | 
  1662 |   const showsAnnual =
  1663 |     /\/year|per year/i.test(
  1664 |       dialogText
  1665 |     );
  1666 | 
  1667 |   const wrongInterval =
  1668 |     options.interval === 'annual'
  1669 |       ? showsMonthly && !showsAnnual
  1670 |       : showsAnnual && !showsMonthly;
  1671 | 
  1672 |   if (wrongInterval) {
  1673 |     await this.closePlanChangeCalculationPreview(
  1674 |       options
  1675 |     );
  1676 | 
  1677 |     await this.billingIntervalButton(
  1678 |       options.interval
  1679 |     ).click({
  1680 |       timeout: 8000
  1681 |     });
  1682 | 
  1683 |     await safeClick(
  1684 |       actionButton,
  1685 |       `${options.action} ${options.targetPlan} ${options.interval}`
  1686 |     );
  1687 | 
  1688 |     await expect(
  1689 |       dialog
> 1690 |     ).toBeVisible({
       |       ^ Error: expect(locator).toBeVisible() failed
  1691 |       timeout: 15000
  1692 |     });
  1693 |   }
  1694 | 
  1695 |   Logger.success(
  1696 |     `${options.action} calculation preview opened for ${options.targetPlan} ${options.interval}`
  1697 |   );
  1698 | }
  1699 | 
  1700 | async validatePlanChangeCalculationPreview(
  1701 |   options: {
  1702 |     targetPlan: string;
  1703 |     action: 'upgrade' | 'downgrade' | 'interval';
  1704 |     interval: 'monthly' | 'annual';
  1705 |     expectedBillingCopy?: RegExp;
  1706 |     expectedPlanCharge?: number;
  1707 |     expectedRecurringAmount?: number;
  1708 |   }
  1709 | ) {
  1710 |   Logger.info(
  1711 |     `Validating ${options.action} calculation preview for ${options.targetPlan} ${options.interval}`
  1712 |   );
  1713 | 
  1714 |   const dialog =
  1715 |     this.planChangeDialog(
  1716 |       options
  1717 |     );
  1718 | 
  1719 |   await expect(
  1720 |     dialog
  1721 |   ).toBeVisible({
  1722 |     timeout: 15000
  1723 |   });
  1724 | 
  1725 |   const dialogText =
  1726 |     await dialog.innerText();
  1727 | 
  1728 |   const scheduledChange =
  1729 |     /takes effect|no refund|end of (this|the) billing period|schedule downgrade/i.test(
  1730 |       dialogText
  1731 |     );
  1732 | 
  1733 |   await expect(
  1734 |     dialog
  1735 |   ).toContainText(
  1736 |     new RegExp(
  1737 |       `${options.action === 'interval'
  1738 |         ? `(?:upgrade|downgrade|switch|change)\\s+to|${this.planNamePattern(
  1739 |           options.targetPlan
  1740 |         )}`
  1741 |         : `${options.action}\\s+to\\s+(?:${this.planNamePattern(
  1742 |           options.targetPlan
  1743 |         )})`}`,
  1744 |       'i'
  1745 |     )
  1746 |   );
  1747 | 
  1748 |   if (scheduledChange) {
  1749 |     Logger.success(
  1750 |       `${options.action} calculation preview validated for ${options.targetPlan} ${options.interval}`
  1751 |     );
  1752 | 
  1753 |     return;
  1754 |   }
  1755 | 
  1756 |   await expect(
  1757 |     dialog
  1758 |   ).toContainText(
  1759 |     /prorat|charged|card on file|billing cycle|renews|new price|amount due/i
  1760 |   );
  1761 | 
  1762 |   await expect(
  1763 |     dialog
  1764 |   ).toContainText(
  1765 |     /credit for unused time/i
  1766 |   );
  1767 | 
  1768 |   await expect(
  1769 |     dialog
  1770 |   ).toContainText(
  1771 |     /amount due today/i
  1772 |   );
  1773 | 
  1774 |   await expect(
  1775 |     dialog
  1776 |   ).toContainText(
  1777 |     /new recurring amount/i
  1778 |   );
  1779 | 
  1780 |   await expect(
  1781 |     dialog
  1782 |   ).toContainText(
  1783 |     /next billing date/i
  1784 |   );
  1785 | 
  1786 |   if (options.expectedBillingCopy) {
  1787 |     await expect(
  1788 |       dialog
  1789 |     ).toContainText(
  1790 |       options.expectedBillingCopy
```