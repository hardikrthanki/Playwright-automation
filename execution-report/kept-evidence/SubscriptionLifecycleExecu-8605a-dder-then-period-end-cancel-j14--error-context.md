# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> User A monthly plan ladder then period-end cancel
- Location: tests\SubscriptionLifecycleExecution.spec.ts:139:9

# Error details

```
Error: Plan charge 7.9 should match list price 79, list plus unused credit, or the prorated amount due today while the new recurring amount stays 79.

expect(received).toBeTruthy()

Received: false
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
            - button:
              - generic:
                - generic: HT
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
                          - paragraph:
                            - generic: Was
                            - text: $29/month
                          - generic:
                            - paragraph:
                              - generic: Now
                              - generic: $2.90
                              - generic: /month
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
                    - button [disabled]:
                      - img
                      - text: Current plan
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Overlay Strategists
                      - paragraph: Optimize your Portfolio
                      - generic:
                        - generic:
                          - paragraph:
                            - generic: Was
                            - text: $79/month
                          - generic:
                            - paragraph:
                              - generic: Now
                              - generic: $7.90
                              - generic: /month
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
                          - paragraph:
                            - generic: Was
                            - text: $149/month
                          - generic:
                            - paragraph:
                              - generic: Now
                              - generic: $14.90
                              - generic: /month
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
  - dialog "Upgrade to Overlay Strategists?" [ref=e2]:
    - generic [ref=e3]:
      - heading "Upgrade to Overlay Strategists?" [level=2] [ref=e4]:
        - img [ref=e5]
        - text: Upgrade to Overlay Strategists?
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
        - term [ref=e22]: Overlay Strategists charge
        - definition [ref=e23]: $7.90
      - generic [ref=e24]:
        - term [ref=e25]: Credit for unused time
        - definition [ref=e26]: "-$2.90"
      - generic [ref=e27]:
        - term [ref=e28]: Amount due today
        - definition [ref=e29]: $5.00
      - generic [ref=e30]:
        - term [ref=e31]: New recurring amount
        - definition [ref=e32]: $7.90/month
      - generic [ref=e33]:
        - term [ref=e34]: Next billing date
        - definition [ref=e35]: November 5, 2026
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
  1659 |       dialogText,
  1660 |       /amount due today/i
  1661 |     );
  1662 | 
  1663 |   const newRecurringAmount =
  1664 |     firstCurrencyValueNearLabel(
  1665 |       dialogText,
  1666 |       /new recurring amount/i
  1667 |     );
  1668 | 
  1669 |   expect(
  1670 |     planCharge,
  1671 |     'Plan charge should be present in plan-change preview'
  1672 |   ).toBeDefined();
  1673 | 
  1674 |   expect(
  1675 |     unusedCredit,
  1676 |     'Unused-time credit should be present in plan-change preview'
  1677 |   ).toBeDefined();
  1678 | 
  1679 |   expect(
  1680 |     amountDueToday,
  1681 |     'Amount due today should be present in plan-change preview'
  1682 |   ).toBeDefined();
  1683 | 
  1684 |   expect(
  1685 |     newRecurringAmount,
  1686 |     'New recurring amount should be present in plan-change preview'
  1687 |   ).toBeDefined();
  1688 | 
  1689 |   if (options.expectedPlanCharge !== undefined) {
  1690 |     const shownMonthlyWhileAnnualRequested =
  1691 |       options.interval === 'annual' &&
  1692 |       /\/month|per month|monthly/i.test(
  1693 |         dialogText
  1694 |       ) &&
  1695 |       !/\/year|per year|annual/i.test(
  1696 |         dialogText
  1697 |       );
  1698 | 
  1699 |     const comparableListPrice =
  1700 |       shownMonthlyWhileAnnualRequested
  1701 |         ? options.expectedPlanCharge / 10
  1702 |         : options.expectedPlanCharge;
  1703 | 
  1704 |     const listPriceDelta =
  1705 |       Math.abs(
  1706 |         (
  1707 |           planCharge ??
  1708 |           0
  1709 |         ) -
  1710 |           comparableListPrice
  1711 |       );
  1712 | 
  1713 |     const netPriceDelta =
  1714 |       Math.abs(
  1715 |         (
  1716 |           planCharge ??
  1717 |           0
  1718 |         ) -
  1719 |           (
  1720 |             comparableListPrice +
  1721 |             (
  1722 |               unusedCredit ??
  1723 |               0
  1724 |             )
  1725 |           )
  1726 |       );
  1727 | 
  1728 |     const recurringMatchesList =
  1729 |       newRecurringAmount !== undefined &&
  1730 |       Math.abs(
  1731 |         newRecurringAmount -
  1732 |           comparableListPrice
  1733 |       ) <= 1;
  1734 | 
  1735 |     const proratedDueToday =
  1736 |       (
  1737 |         planCharge ??
  1738 |         0
  1739 |       ) > 0 &&
  1740 |       (
  1741 |         planCharge ??
  1742 |         0
  1743 |       ) + 0.02 < comparableListPrice &&
  1744 |       amountDueToday !== undefined &&
  1745 |       Math.abs(
  1746 |         (
  1747 |           planCharge ??
  1748 |           0
  1749 |         ) -
  1750 |           amountDueToday
  1751 |       ) <= 1 &&
  1752 |       recurringMatchesList;
  1753 | 
  1754 |     expect(
  1755 |       listPriceDelta <= 0.02 ||
  1756 |         netPriceDelta <= 1 ||
  1757 |         proratedDueToday,
  1758 |       `Plan charge ${planCharge} should match list price ${comparableListPrice}, list plus unused credit, or the prorated amount due today while the new recurring amount stays ${comparableListPrice}.`
> 1759 |     ).toBeTruthy();
       |       ^ Error: Plan charge 7.9 should match list price 79, list plus unused credit, or the prorated amount due today while the new recurring amount stays 79.
  1760 |   }
  1761 | 
  1762 |   if (options.expectedRecurringAmount !== undefined) {
  1763 |     const shownMonthlyWhileAnnualRequested =
  1764 |       options.interval === 'annual' &&
  1765 |       /\/month|per month|monthly/i.test(
  1766 |         dialogText
  1767 |       ) &&
  1768 |       !/\/year|per year|annual/i.test(
  1769 |         dialogText
  1770 |       );
  1771 |     const comparableRecurring =
  1772 |       shownMonthlyWhileAnnualRequested
  1773 |         ? options.expectedRecurringAmount / 10
  1774 |         : options.expectedRecurringAmount;
  1775 | 
  1776 |     expect(
  1777 |       Math.abs(
  1778 |         (
  1779 |           newRecurringAmount ??
  1780 |           0
  1781 |         ) -
  1782 |           comparableRecurring
  1783 |       ),
  1784 |       `New recurring amount should match configured ${options.targetPlan} ${shownMonthlyWhileAnnualRequested ? 'monthly' : options.interval} price.`
  1785 |     ).toBeLessThanOrEqual(
  1786 |       0.02
  1787 |     );
  1788 |   }
  1789 | 
  1790 |   expect(
  1791 |     unusedCredit ?? 0,
  1792 |     'Unused-time credit should be zero or negative.'
  1793 |   ).toBeLessThanOrEqual(
  1794 |     0
  1795 |   );
  1796 | 
  1797 |   expect(
  1798 |     amountDueToday ?? 0,
  1799 |     'Amount due today should not exceed the target plan charge.'
  1800 |   ).toBeLessThanOrEqual(
  1801 |     planCharge ?? 0
  1802 |   );
  1803 | 
  1804 |   if (options.action === 'upgrade') {
  1805 |     expect(
  1806 |       Math.abs(
  1807 |         (
  1808 |           planCharge ??
  1809 |           0
  1810 |         ) +
  1811 |           (
  1812 |             unusedCredit ??
  1813 |             0
  1814 |           ) -
  1815 |           (
  1816 |             amountDueToday ??
  1817 |             0
  1818 |           )
  1819 |       )
  1820 |     ).toBeLessThanOrEqual(
  1821 |       0.02
  1822 |     );
  1823 |   }
  1824 | 
  1825 |   Logger.success(
  1826 |     `${options.action} calculation preview validated for ${options.targetPlan} ${options.interval}`
  1827 |   );
  1828 | }
  1829 | 
  1830 | async validatePlanChangeDueAmountAndRenewal(
  1831 |   options: {
  1832 |     targetPlan: string;
  1833 |     action: 'upgrade' | 'downgrade' | 'interval';
  1834 |     interval: 'monthly' | 'annual';
  1835 |     expectedBillingCopy?: RegExp;
  1836 |     expectedPlanCharge?: number;
  1837 |     expectedRecurringAmount?: number;
  1838 |   }
  1839 | ) {
  1840 |   await this.validatePlanChangeCalculationPreview(
  1841 |     options
  1842 |   );
  1843 | 
  1844 |   const dialogText =
  1845 |     await this.planChangeDialog(
  1846 |       options
  1847 |     ).innerText();
  1848 | 
  1849 |   const renewal =
  1850 |     parseFlexibleDate(
  1851 |       nearbyTextAfterLabel(
  1852 |         dialogText,
  1853 |         /next billing date|renews on|renewal date/i
  1854 |       )
  1855 |     ) ??
  1856 |     parseFlexibleDate(
  1857 |       dialogText
  1858 |     );
  1859 | 
```