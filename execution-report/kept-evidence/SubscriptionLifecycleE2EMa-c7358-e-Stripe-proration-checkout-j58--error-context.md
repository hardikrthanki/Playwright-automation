# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-024 - Upgrade to higher plan starts immediate Stripe proration checkout
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
Error: Plan charge 7.9 should match list price 79 or list plus unused credit.

expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1625 |       {
  1626 |         name: /confirm|pay|continue/i
  1627 |       }
  1628 |     ).first()
  1629 |   ).toBeVisible({
  1630 |     timeout: 10000
  1631 |   });
  1632 | 
  1633 |   const planCharge =
  1634 |     firstCurrencyValueNearLabel(
  1635 |       dialogText,
  1636 |       new RegExp(
  1637 |         `(?:${this.planNamePattern(
  1638 |           options.targetPlan
  1639 |         )})\\s+charge`,
  1640 |         'i'
  1641 |       )
  1642 |     );
  1643 | 
  1644 |   const unusedCredit =
  1645 |     firstCurrencyValueNearLabel(
  1646 |       dialogText,
  1647 |       /credit for unused time/i
  1648 |     );
  1649 | 
  1650 |   const amountDueToday =
  1651 |     firstCurrencyValueNearLabel(
  1652 |       dialogText,
  1653 |       /amount due today/i
  1654 |     );
  1655 | 
  1656 |   const newRecurringAmount =
  1657 |     firstCurrencyValueNearLabel(
  1658 |       dialogText,
  1659 |       /new recurring amount/i
  1660 |     );
  1661 | 
  1662 |   expect(
  1663 |     planCharge,
  1664 |     'Plan charge should be present in plan-change preview'
  1665 |   ).toBeDefined();
  1666 | 
  1667 |   expect(
  1668 |     unusedCredit,
  1669 |     'Unused-time credit should be present in plan-change preview'
  1670 |   ).toBeDefined();
  1671 | 
  1672 |   expect(
  1673 |     amountDueToday,
  1674 |     'Amount due today should be present in plan-change preview'
  1675 |   ).toBeDefined();
  1676 | 
  1677 |   expect(
  1678 |     newRecurringAmount,
  1679 |     'New recurring amount should be present in plan-change preview'
  1680 |   ).toBeDefined();
  1681 | 
  1682 |   if (options.expectedPlanCharge !== undefined) {
  1683 |     const shownMonthlyWhileAnnualRequested =
  1684 |       options.interval === 'annual' &&
  1685 |       /\/month|per month|monthly/i.test(
  1686 |         dialogText
  1687 |       ) &&
  1688 |       !/\/year|per year|annual/i.test(
  1689 |         dialogText
  1690 |       );
  1691 | 
  1692 |     const comparableListPrice =
  1693 |       shownMonthlyWhileAnnualRequested
  1694 |         ? options.expectedPlanCharge / 10
  1695 |         : options.expectedPlanCharge;
  1696 | 
  1697 |     const listPriceDelta =
  1698 |       Math.abs(
  1699 |         (
  1700 |           planCharge ??
  1701 |           0
  1702 |         ) -
  1703 |           comparableListPrice
  1704 |       );
  1705 | 
  1706 |     const netPriceDelta =
  1707 |       Math.abs(
  1708 |         (
  1709 |           planCharge ??
  1710 |           0
  1711 |         ) -
  1712 |           (
  1713 |             comparableListPrice +
  1714 |             (
  1715 |               unusedCredit ??
  1716 |               0
  1717 |             )
  1718 |           )
  1719 |       );
  1720 | 
  1721 |     expect(
  1722 |       listPriceDelta <= 0.02 ||
  1723 |         netPriceDelta <= 1,
  1724 |       `Plan charge ${planCharge} should match list price ${comparableListPrice} or list plus unused credit.`
> 1725 |     ).toBeTruthy();
       |       ^ Error: Plan charge 7.9 should match list price 79 or list plus unused credit.
  1726 |   }
  1727 | 
  1728 |   if (options.expectedRecurringAmount !== undefined) {
  1729 |     const shownMonthlyWhileAnnualRequested =
  1730 |       options.interval === 'annual' &&
  1731 |       /\/month|per month|monthly/i.test(
  1732 |         dialogText
  1733 |       ) &&
  1734 |       !/\/year|per year|annual/i.test(
  1735 |         dialogText
  1736 |       );
  1737 |     const comparableRecurring =
  1738 |       shownMonthlyWhileAnnualRequested
  1739 |         ? options.expectedRecurringAmount / 10
  1740 |         : options.expectedRecurringAmount;
  1741 | 
  1742 |     expect(
  1743 |       Math.abs(
  1744 |         (
  1745 |           newRecurringAmount ??
  1746 |           0
  1747 |         ) -
  1748 |           comparableRecurring
  1749 |       ),
  1750 |       `New recurring amount should match configured ${options.targetPlan} ${shownMonthlyWhileAnnualRequested ? 'monthly' : options.interval} price.`
  1751 |     ).toBeLessThanOrEqual(
  1752 |       0.02
  1753 |     );
  1754 |   }
  1755 | 
  1756 |   expect(
  1757 |     unusedCredit ?? 0,
  1758 |     'Unused-time credit should be zero or negative.'
  1759 |   ).toBeLessThanOrEqual(
  1760 |     0
  1761 |   );
  1762 | 
  1763 |   expect(
  1764 |     amountDueToday ?? 0,
  1765 |     'Amount due today should not exceed the target plan charge.'
  1766 |   ).toBeLessThanOrEqual(
  1767 |     planCharge ?? 0
  1768 |   );
  1769 | 
  1770 |   if (options.action === 'upgrade') {
  1771 |     expect(
  1772 |       Math.abs(
  1773 |         (
  1774 |           planCharge ??
  1775 |           0
  1776 |         ) +
  1777 |           (
  1778 |             unusedCredit ??
  1779 |             0
  1780 |           ) -
  1781 |           (
  1782 |             amountDueToday ??
  1783 |             0
  1784 |           )
  1785 |       )
  1786 |     ).toBeLessThanOrEqual(
  1787 |       0.02
  1788 |     );
  1789 |   }
  1790 | 
  1791 |   Logger.success(
  1792 |     `${options.action} calculation preview validated for ${options.targetPlan} ${options.interval}`
  1793 |   );
  1794 | }
  1795 | 
  1796 | async validatePlanChangeDueAmountAndRenewal(
  1797 |   options: {
  1798 |     targetPlan: string;
  1799 |     action: 'upgrade' | 'downgrade' | 'interval';
  1800 |     interval: 'monthly' | 'annual';
  1801 |     expectedBillingCopy?: RegExp;
  1802 |     expectedPlanCharge?: number;
  1803 |     expectedRecurringAmount?: number;
  1804 |   }
  1805 | ) {
  1806 |   await this.validatePlanChangeCalculationPreview(
  1807 |     options
  1808 |   );
  1809 | 
  1810 |   const dialogText =
  1811 |     await this.planChangeDialog(
  1812 |       options
  1813 |     ).innerText();
  1814 | 
  1815 |   const renewal =
  1816 |     parseFlexibleDate(
  1817 |       nearbyTextAfterLabel(
  1818 |         dialogText,
  1819 |         /next billing date|renews on|renewal date/i
  1820 |       )
  1821 |     ) ??
  1822 |     parseFlexibleDate(
  1823 |       dialogText
  1824 |     );
  1825 | 
```