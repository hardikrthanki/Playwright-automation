# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Prepared paid user can preview monthly and annual upgrade calculations
- Location: tests\SubscriptionLifecycleExecution.spec.ts:139:9

# Error details

```
Error: Plan charge 9.81 should match list price 1490, list plus unused credit, or the prorated amount due today while the new recurring amount stays 1490.

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
              - generic: "18"
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
                    - button:
                      - img
                      - text: Downgrade
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
                    - button [disabled]:
                      - img
                      - text: Current plan
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
  - dialog "Upgrade to Portfolio Hedger?" [ref=e2]:
    - generic [ref=e3]:
      - heading "Upgrade to Portfolio Hedger?" [level=2] [ref=e4]:
        - img [ref=e5]
        - text: Upgrade to Portfolio Hedger?
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
        - term [ref=e22]: Portfolio Hedger charge
        - definition [ref=e23]: $9.81
      - generic [ref=e24]:
        - term [ref=e25]: Credit for unused time
        - definition [ref=e26]: "-$52.00"
      - generic [ref=e27]:
        - term [ref=e28]: Amount due today
        - definition [ref=e29]: "-$42.19"
      - generic [ref=e30]:
        - term [ref=e31]: New recurring amount
        - definition [ref=e32]: $14.90/month
      - generic [ref=e33]:
        - term [ref=e34]: Next billing date
        - definition [ref=e35]: October 25, 2026
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
  1760 |   ).toBeDefined();
  1761 | 
  1762 |   expect(
  1763 |     amountDueToday,
  1764 |     'Amount due today should be present in plan-change preview'
  1765 |   ).toBeDefined();
  1766 | 
  1767 |   expect(
  1768 |     newRecurringAmount,
  1769 |     'New recurring amount should be present in plan-change preview'
  1770 |   ).toBeDefined();
  1771 | 
  1772 |   if (options.expectedPlanCharge !== undefined) {
  1773 |     const comparableListPrice =
  1774 |       options.expectedPlanCharge;
  1775 | 
  1776 |     const listPriceDelta =
  1777 |       Math.abs(
  1778 |         (
  1779 |           planCharge ??
  1780 |           0
  1781 |         ) -
  1782 |           comparableListPrice
  1783 |       );
  1784 | 
  1785 |     const netPriceDelta =
  1786 |       Math.abs(
  1787 |         (
  1788 |           planCharge ??
  1789 |           0
  1790 |         ) -
  1791 |           (
  1792 |             comparableListPrice +
  1793 |             (
  1794 |               unusedCredit ??
  1795 |               0
  1796 |             )
  1797 |           )
  1798 |       );
  1799 | 
  1800 |     const recurringMatchesList =
  1801 |       newRecurringAmount !== undefined &&
  1802 |       Math.abs(
  1803 |         newRecurringAmount -
  1804 |           comparableListPrice
  1805 |       ) <= 1;
  1806 | 
  1807 |     const proratedDueToday =
  1808 |       (
  1809 |         planCharge ??
  1810 |         0
  1811 |       ) > 0 &&
  1812 |       (
  1813 |         planCharge ??
  1814 |         0
  1815 |       ) + 0.02 < comparableListPrice &&
  1816 |       amountDueToday !== undefined &&
  1817 |       Math.abs(
  1818 |         (
  1819 |           planCharge ??
  1820 |           0
  1821 |         ) -
  1822 |           amountDueToday
  1823 |       ) <= 1 &&
  1824 |       recurringMatchesList;
  1825 | 
  1826 |     const listPriceText =
  1827 |       comparableListPrice.toFixed(
  1828 |         2
  1829 |       );
  1830 | 
  1831 |     const listPriceShown =
  1832 |       dialogText.includes(
  1833 |         listPriceText
  1834 |       ) ||
  1835 |       dialogText.includes(
  1836 |         String(
  1837 |           comparableListPrice
  1838 |         )
  1839 |       );
  1840 | 
  1841 |     const chargeWithinList =
  1842 |       (
  1843 |         planCharge ??
  1844 |         0
  1845 |       ) > 0 &&
  1846 |       (
  1847 |         planCharge ??
  1848 |         0
  1849 |       ) <= comparableListPrice + 0.05;
  1850 | 
  1851 |     expect(
  1852 |       listPriceDelta <= 0.05 ||
  1853 |         netPriceDelta <= 1 ||
  1854 |         proratedDueToday ||
  1855 |         (
  1856 |           listPriceShown &&
  1857 |           chargeWithinList
  1858 |         ),
  1859 |       `Plan charge ${planCharge} should match list price ${comparableListPrice}, list plus unused credit, or the prorated amount due today while the new recurring amount stays ${comparableListPrice}.`
> 1860 |     ).toBeTruthy();
       |       ^ Error: Plan charge 9.81 should match list price 1490, list plus unused credit, or the prorated amount due today while the new recurring amount stays 1490.
  1861 |   }
  1862 | 
  1863 |   if (options.expectedRecurringAmount !== undefined) {
  1864 |     const comparableRecurring =
  1865 |       options.expectedRecurringAmount;
  1866 | 
  1867 |     const listPriceText =
  1868 |       comparableRecurring.toFixed(
  1869 |         2
  1870 |       );
  1871 | 
  1872 |     const listPriceShown =
  1873 |       dialogText.includes(
  1874 |         listPriceText
  1875 |       ) ||
  1876 |       dialogText.includes(
  1877 |         String(
  1878 |           comparableRecurring
  1879 |         )
  1880 |       );
  1881 | 
  1882 |     const proratedCharge =
  1883 |       (
  1884 |         planCharge ??
  1885 |         0
  1886 |       ) > 0 &&
  1887 |       (
  1888 |         planCharge ??
  1889 |         0
  1890 |       ) + 0.05 < comparableRecurring &&
  1891 |       listPriceShown;
  1892 | 
  1893 |     expect(
  1894 |       Math.abs(
  1895 |         (
  1896 |           newRecurringAmount ??
  1897 |           0
  1898 |         ) -
  1899 |           comparableRecurring
  1900 |       ) <= 0.05 ||
  1901 |         proratedCharge,
  1902 |       `New recurring amount should match configured ${options.targetPlan} ${options.interval} price.`
  1903 |     ).toBeTruthy();
  1904 |   }
  1905 | 
  1906 |   expect(
  1907 |     unusedCredit ?? 0,
  1908 |     'Unused-time credit should be zero or negative.'
  1909 |   ).toBeLessThanOrEqual(
  1910 |     0
  1911 |   );
  1912 | 
  1913 |   expect(
  1914 |     amountDueToday ?? 0,
  1915 |     'Amount due today should not exceed the target plan charge.'
  1916 |   ).toBeLessThanOrEqual(
  1917 |     planCharge ?? 0
  1918 |   );
  1919 | 
  1920 |   if (options.action === 'upgrade') {
  1921 |     expect(
  1922 |       Math.abs(
  1923 |         (
  1924 |           planCharge ??
  1925 |           0
  1926 |         ) +
  1927 |           (
  1928 |             unusedCredit ??
  1929 |             0
  1930 |           ) -
  1931 |           (
  1932 |             amountDueToday ??
  1933 |             0
  1934 |           )
  1935 |       )
  1936 |     ).toBeLessThanOrEqual(
  1937 |       0.02
  1938 |     );
  1939 |   }
  1940 | 
  1941 |   Logger.success(
  1942 |     `${options.action} calculation preview validated for ${options.targetPlan} ${options.interval}`
  1943 |   );
  1944 | }
  1945 | 
  1946 | async validatePlanChangeDueAmountAndRenewal(
  1947 |   options: {
  1948 |     targetPlan: string;
  1949 |     action: 'upgrade' | 'downgrade' | 'interval';
  1950 |     interval: 'monthly' | 'annual';
  1951 |     expectedBillingCopy?: RegExp;
  1952 |     expectedPlanCharge?: number;
  1953 |     expectedRecurringAmount?: number;
  1954 |   }
  1955 | ) {
  1956 |   await this.validatePlanChangeCalculationPreview(
  1957 |     options
  1958 |   );
  1959 | 
  1960 |   const dialogText =
```