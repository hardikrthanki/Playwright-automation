# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionCancellationMatrix.spec.ts >> Subscription Cancellation Use Case 7 Matrix >> SC-275 - Card-backed trial can be cancelled before auto-renewal
- Location: tests\SubscriptionCancellationMatrix.spec.ts:553:13

# Error details

```
Error: Card-backed trial did not leave Stripe checkout.
```

# Test source

```ts
  1681 |   await billing.resumeScheduledCancellation(
  1682 |     'Income Builder'
  1683 |   );
  1684 | }
  1685 | 
  1686 | async function executeRefundPreview(
  1687 |   page: Page
  1688 | ) {
  1689 |   const billing =
  1690 |     await purchaseDisposablePlan(
  1691 |       page,
  1692 |       'refund-preview',
  1693 |       'Income Builder',
  1694 |       'annual'
  1695 |     );
  1696 | 
  1697 |   await billing.showRefundAmountWithoutConfirming(
  1698 |     'Income Builder'
  1699 |   );
  1700 | }
  1701 | 
  1702 | async function executeTrialCancel(
  1703 |   page: Page
  1704 | ) {
  1705 |   await registerAndReachPlanSelection(
  1706 |     page,
  1707 |     'trial-cancel'
  1708 |   );
  1709 | 
  1710 |   const planPage =
  1711 |     new PlanSelectionPage(
  1712 |       page
  1713 |     );
  1714 | 
  1715 |   await planPage.selectOverlayStrategistsTrialWithoutCard();
  1716 |   await planPage.validateNotRedirectedToStripeCheckout();
  1717 | 
  1718 |   await new DashboardPage(
  1719 |     page
  1720 |   ).validateLoaded();
  1721 | 
  1722 |   const billing =
  1723 |     new BillingPage(
  1724 |       page
  1725 |     );
  1726 | 
  1727 |   await billing.validateOverlayStrategistsTrialBillingState(
  1728 |     'without-card'
  1729 |   );
  1730 | 
  1731 |   try {
  1732 |     await billing.cancelTrialWithoutPaymentMethod();
  1733 |   } catch (error) {
  1734 |     const message =
  1735 |       error instanceof Error
  1736 |         ? error.message
  1737 |         : String(
  1738 |           error
  1739 |         );
  1740 | 
  1741 |     if (
  1742 |       /Cancel subscription control was not found/i.test(
  1743 |         message
  1744 |       )
  1745 |     ) {
  1746 |       throw new CoverageSkip(
  1747 |         'No-card trial billing does not show Cancel subscription.'
  1748 |       );
  1749 |     }
  1750 | 
  1751 |     throw error;
  1752 |   }
  1753 | }
  1754 | 
  1755 | async function executeCardTrialCancel(
  1756 |   page: Page
  1757 | ) {
  1758 |   const user =
  1759 |     await registerAndReachPlanSelection(
  1760 |       page,
  1761 |       'trial-cancel-card'
  1762 |     );
  1763 | 
  1764 |   await new PlanSelectionPage(
  1765 |     page
  1766 |   ).selectOverlayStrategistsTrialWithCard();
  1767 | 
  1768 |   await new StripePaymentPage(
  1769 |     page
  1770 |   ).completeTrialPayment();
  1771 | 
  1772 |   const reached =
  1773 |     await continueAfterWithCardTrialCheckout(
  1774 |       page,
  1775 |       user.mobileNumber
  1776 |     );
  1777 | 
  1778 |   if (
  1779 |     !reached
  1780 |   ) {
> 1781 |     throw new Error(
       |           ^ Error: Card-backed trial did not leave Stripe checkout.
  1782 |       'Card-backed trial did not leave Stripe checkout.'
  1783 |     );
  1784 |   }
  1785 | 
  1786 |   await new DashboardPage(
  1787 |     page
  1788 |   ).validateLoaded({
  1789 |     acceptTrialSuccessMobileGate: true
  1790 |   });
  1791 | 
  1792 |   await new BillingPage(
  1793 |     page
  1794 |   ).cancelTrialWithoutPaymentMethod();
  1795 | }
  1796 | 
  1797 | async function executeDowngradeThenCancel(
  1798 |   page: Page
  1799 | ) {
  1800 |   const billing =
  1801 |     await purchaseDisposablePlan(
  1802 |       page,
  1803 |       'downgrade-then-cancel',
  1804 |       'Overlay Strategists',
  1805 |       'monthly'
  1806 |     );
  1807 | 
  1808 |   await billing.assertDowngradeImpactWarning(
  1809 |     'Income Builder'
  1810 |   );
  1811 | 
  1812 |   await billing.declineRetentionAndPreviewOrScheduleDowngrade({
  1813 |     currentPlan:
  1814 |       'Overlay Strategists',
  1815 |     targetPlan:
  1816 |       'Income Builder',
  1817 |     schedule:
  1818 |       true
  1819 |   });
  1820 | 
  1821 |   await billing.submitMonthlyCancelAtPeriodEnd({
  1822 |     keepScheduled: true
  1823 |   });
  1824 | 
  1825 |   await billing.expectPaidAccessWhileCancellationScheduled(
  1826 |     'Overlay Strategists'
  1827 |   );
  1828 | }
  1829 | 
  1830 | async function executePaidNoSecondTrial(
  1831 |   page: Page
  1832 | ) {
  1833 |   await Promise.race([
  1834 |     loginPaidSubscriber(
  1835 |       page
  1836 |     ),
  1837 |     page.waitForTimeout(
  1838 |       90000
  1839 |     ).then(
  1840 |       () => {
  1841 |         throw new Error(
  1842 |           'Paid subscriber login did not finish within 90s.'
  1843 |         );
  1844 |       }
  1845 |     )
  1846 |   ]);
  1847 | 
  1848 |   await new BillingPage(
  1849 |     page
  1850 |   ).validatePaidSubscriberTrialCtaIsNotOffered();
  1851 | }
  1852 | 
  1853 | async function submitIntervalChange(
  1854 |   page: Page,
  1855 |   tag: string,
  1856 |   startingInterval: 'monthly' | 'annual',
  1857 |   targetInterval: 'monthly' | 'annual'
  1858 | ) {
  1859 |   const billing =
  1860 |     await purchaseDisposablePlan(
  1861 |       page,
  1862 |       tag,
  1863 |       'Income Builder',
  1864 |       startingInterval
  1865 |     );
  1866 | 
  1867 |   try {
  1868 |     await billing.openPlanChangeCalculationPreview({
  1869 |       targetPlan:
  1870 |         'Income Builder',
  1871 |       action:
  1872 |         'interval',
  1873 |       interval:
  1874 |         targetInterval
  1875 |     });
  1876 |   } catch (error) {
  1877 |     if (
  1878 |       isMissingPlanAction(
  1879 |         error
  1880 |       )
  1881 |     ) {
```