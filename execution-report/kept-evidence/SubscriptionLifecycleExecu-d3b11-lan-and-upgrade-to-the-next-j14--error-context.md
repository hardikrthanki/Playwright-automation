# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Purchase each paid plan and upgrade to the next
- Location: tests\SubscriptionLifecycleExecution.spec.ts:163:9

# Error details

```
Error: Expected an upgrade from Portfolio Hedger to Marketplace.

expect(received).toBeTruthy()

Received: false
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
          - button "Enter fullscreen" [ref=e33] [cursor=pointer]:
            - img
          - button "Switch to dark theme" [ref=e34] [cursor=pointer]:
            - img
          - button "HT" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: HT
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Billing & Subscription" [level=1] [ref=e41]
          - paragraph [ref=e42]: Manage your plan, payment methods, and billing history.
        - generic [ref=e43]:
          - tablist [ref=e44]:
            - tab "Overview" [ref=e45] [cursor=pointer]: Overview
            - tab "Plans" [selected] [ref=e46] [cursor=pointer]: Plans
            - tab "History" [ref=e47] [cursor=pointer]: History
          - tabpanel "Plans" [ref=e48]:
            - generic [ref=e49]:
              - generic [ref=e51]:
                - img [ref=e52]
                - text: Change Plan
              - generic [ref=e57]:
                - generic [ref=e58]:
                  - generic [ref=e59]:
                    - generic [ref=e60]:
                      - paragraph [ref=e62]: Curious
                      - paragraph [ref=e63]: Explore your Portfolio
                      - paragraph [ref=e64]: Free
                    - list [ref=e65]:
                      - listitem [ref=e66]:
                        - img [ref=e67]
                        - text: Manual Upload Only
                      - listitem [ref=e69]:
                        - img [ref=e70]
                        - text: Positions (10)
                      - listitem [ref=e72]:
                        - img [ref=e73]
                        - text: Simulations (10)
                      - listitem [ref=e75]:
                        - img [ref=e76]
                        - text: CTAs Refresh
                      - listitem [ref=e78]:
                        - img [ref=e79]
                        - text: Covered Calls
                      - listitem [ref=e81]:
                        - img [ref=e82]
                        - text: OOLS Score
                    - button "Switch to Free" [disabled]:
                      - img
                      - text: Switch to Free
                  - generic [ref=e84]:
                    - generic [ref=e85]:
                      - paragraph [ref=e87]: Income
                      - paragraph [ref=e88]: Build your Portfolio
                      - paragraph [ref=e89]: $29/month
                    - list [ref=e90]:
                      - listitem [ref=e91]:
                        - img [ref=e92]
                        - text: Broker Integration (1)
                      - listitem [ref=e94]:
                        - img [ref=e95]
                        - text: Account Linked (1)
                      - listitem [ref=e97]:
                        - img [ref=e98]
                        - text: Positions (100)
                      - listitem [ref=e100]:
                        - img [ref=e101]
                        - text: CTAs Unlimited
                      - listitem [ref=e103]:
                        - img [ref=e104]
                        - text: Simulations Unlimited
                      - listitem [ref=e106]:
                        - img [ref=e107]
                        - text: Covered Calls/Puts CTAs
                      - listitem [ref=e109]:
                        - img [ref=e110]
                        - text: Earnings Notifications
                      - listitem [ref=e112]:
                        - img [ref=e113]
                        - text: Dividend Notifications
                      - listitem [ref=e115]:
                        - img [ref=e116]
                        - text: OOLS Score
                    - button "Downgrade" [disabled]:
                      - img
                      - text: Downgrade
                  - generic [ref=e118]:
                    - generic [ref=e119]:
                      - paragraph [ref=e121]: Overlay Strategists
                      - paragraph [ref=e122]: Optimize your Portfolio
                      - paragraph [ref=e123]: $79/month
                    - list [ref=e124]:
                      - listitem [ref=e125]:
                        - img [ref=e126]
                        - text: Broker Integration (5)
                      - listitem [ref=e128]:
                        - img [ref=e129]
                        - text: Account Linked (10)
                      - listitem [ref=e131]:
                        - img [ref=e132]
                        - text: Positions (500)
                      - listitem [ref=e134]:
                        - img [ref=e135]
                        - text: CTAs & Simulations Unlimited
                      - listitem [ref=e137]:
                        - img [ref=e138]
                        - text: Covered Calls/Puts CTAs
                      - listitem [ref=e140]:
                        - img [ref=e141]
                        - text: Earnings & Dividends Notifications
                      - listitem [ref=e143]:
                        - img [ref=e144]
                        - text: ITM/ATM resolve suggestions
                      - listitem [ref=e146]:
                        - img [ref=e147]
                        - text: Portfolio Analytics
                      - listitem [ref=e149]:
                        - img [ref=e150]
                        - text: Bulk Portfolio Load
                      - listitem [ref=e152]:
                        - img [ref=e153]
                        - text: OOLS Score
                    - button "Current plan" [disabled]:
                      - img
                      - text: Current plan
                  - generic [ref=e155]:
                    - generic [ref=e156]:
                      - paragraph [ref=e158]: Portfolio Hedger
                      - paragraph [ref=e159]: Optimize your Portfolio
                      - paragraph [ref=e160]: $149/month
                    - list [ref=e161]:
                      - listitem [ref=e162]:
                        - img [ref=e163]
                        - text: Broker Integration (10)
                      - listitem [ref=e165]:
                        - img [ref=e166]
                        - text: Account Linked (20)
                      - listitem [ref=e168]:
                        - img [ref=e169]
                        - text: Positions (1000)
                      - listitem [ref=e171]:
                        - img [ref=e172]
                        - text: CTAs & Simulations Unlimited
                      - listitem [ref=e174]:
                        - img [ref=e175]
                        - text: Covered Calls/Puts CTAs
                      - listitem [ref=e177]:
                        - img [ref=e178]
                        - text: Protective Puts
                      - listitem [ref=e180]:
                        - img [ref=e181]
                        - text: Option roll suggestions
                      - listitem [ref=e183]:
                        - img [ref=e184]
                        - text: Earnings & Dividends Notifications
                      - listitem [ref=e186]:
                        - img [ref=e187]
                        - text: ITM/ATM resolve suggestions
                      - listitem [ref=e189]:
                        - img [ref=e190]
                        - text: Portfolio Analytics
                      - listitem [ref=e192]:
                        - img [ref=e193]
                        - text: Bulk Portfolio Load
                      - listitem [ref=e195]:
                        - img [ref=e196]
                        - text: OOLS Score
                    - button "Upgrade" [disabled]:
                      - img
                      - text: Upgrade
                - paragraph [ref=e198]: Upgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then.
        - generic [ref=e199]:
          - generic [ref=e200]:
            - generic [ref=e201]: Danger Zone
            - generic [ref=e202]: Cancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.
          - button "Cancel Subscription" [ref=e204] [cursor=pointer]
    - contentinfo [ref=e205]:
      - generic [ref=e206]:
        - generic [ref=e207]:
          - paragraph [ref=e208]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e209]:
            - link "Privacy Policy" [ref=e211] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e212]:
              - generic [ref=e213]: ·
              - link "Terms of Service" [ref=e214] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e215]:
              - generic [ref=e216]: ·
              - link "Disclosures" [ref=e217] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e218]:
              - generic [ref=e219]: ·
              - link "Risk Warning" [ref=e220] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e221]:
              - generic [ref=e222]: ·
              - link "Contact" [ref=e223] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e224]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T":
    - list:
      - listitem [ref=e225]:
        - img [ref=e227]
        - generic [ref=e230]: Your plan has been updated.
  - alert [ref=e231]
```

# Test source

```ts
  1830 |       'SUB_LIFECYCLE_RETENTION_ACCEPT_ENABLED',
  1831 |       'Accepts the once-per-lifetime offer, then asserts a second downgrade does not show it again.',
  1832 |       async ({ page }) => {
  1833 |         await purchasePaidPlanForDisposableUser(
  1834 |           page,
  1835 |           'sub-lifecycle-user-d-retention-accept',
  1836 |           'Portfolio Hedger',
  1837 |           'monthly',
  1838 |           'user-d-retention-accept'
  1839 |         );
  1840 | 
  1841 |         const billing =
  1842 |           new BillingPage(
  1843 |             page
  1844 |           );
  1845 | 
  1846 |         await billing.acceptMonthlyDowngradeRetentionOffer({
  1847 |           currentPlan:
  1848 |             'Portfolio Hedger',
  1849 |           targetPlan:
  1850 |             'Overlay Strategists'
  1851 |         });
  1852 | 
  1853 |         await billing.assertRetentionOfferNotShown({
  1854 |           currentPlan:
  1855 |             'Portfolio Hedger',
  1856 |           targetPlan:
  1857 |             'Overlay Strategists'
  1858 |         });
  1859 |       }
  1860 |     );
  1861 | 
  1862 |     controlledLifecycleTest(
  1863 |       'User D monthly retention offer decline then schedule downgrade',
  1864 |       'SUB_LIFECYCLE_DOWNGRADE_SUBMIT_ENABLED',
  1865 |       'Declines retention and schedules the monthly downgrade at next renewal.',
  1866 |       async ({ page }) => {
  1867 |         await purchasePaidPlanForDisposableUser(
  1868 |           page,
  1869 |           'sub-lifecycle-user-d-downgrade-submit',
  1870 |           'Overlay Strategists',
  1871 |           'monthly',
  1872 |           'user-d-downgrade-submit'
  1873 |         );
  1874 | 
  1875 |         await new BillingPage(
  1876 |           page
  1877 |         ).declineRetentionAndPreviewOrScheduleDowngrade({
  1878 |           currentPlan:
  1879 |             'Overlay Strategists',
  1880 |           targetPlan:
  1881 |             'Income Builder',
  1882 |           schedule:
  1883 |             true
  1884 |         });
  1885 |       }
  1886 |     );
  1887 | 
  1888 |     controlledLifecycleTest(
  1889 |       'Purchase each paid plan and upgrade to the next',
  1890 |       'SUB_LIFECYCLE_FREE_LADDER_ENABLED',
  1891 |       'Creates one disposable user, purchases Income Builder, then upgrades to Overlay Strategists, Portfolio Hedger, and Marketplace. Each upgrade validates the due amount and renewal date.',
  1892 |       async ({ page }) => {
  1893 |         test.setTimeout(
  1894 |           60 * 60 * 1000
  1895 |         );
  1896 | 
  1897 |         await test.step(
  1898 |           'Purchase Income Builder monthly',
  1899 |           async () => {
  1900 |             await purchasePaidPlanForDisposableUser(
  1901 |               page,
  1902 |               'sub-lifecycle-purchase-upgrade',
  1903 |               'Income Builder',
  1904 |               'monthly',
  1905 |               'purchase-upgrade-ladder'
  1906 |             );
  1907 |           }
  1908 |         );
  1909 | 
  1910 |         for (let index = 1; index < PAID_PLAN_LADDER.length; index += 1) {
  1911 |           const fromPlan =
  1912 |             PAID_PLAN_LADDER[index - 1];
  1913 |           const toPlan =
  1914 |             PAID_PLAN_LADDER[index];
  1915 | 
  1916 |           await test.step(
  1917 |             `Upgrade ${fromPlan} to ${toPlan} and validate the calculation`,
  1918 |             async () => {
  1919 |               const upgraded =
  1920 |                 await submitUpgradeWithDueAndRenewal(
  1921 |                   page,
  1922 |                   toPlan,
  1923 |                   'monthly',
  1924 |                   'upgrade'
  1925 |                 );
  1926 | 
  1927 |               expect(
  1928 |                 upgraded,
  1929 |                 `Expected an upgrade from ${fromPlan} to ${toPlan}.`
> 1930 |               ).toBeTruthy();
       |                 ^ Error: Expected an upgrade from Portfolio Hedger to Marketplace.
  1931 |             }
  1932 |           );
  1933 |         }
  1934 |       }
  1935 |     );
  1936 | 
  1937 |     test(
  1938 |       'Subscription lifecycle calculation rules are deterministic',
  1939 |       async () => {
  1940 |         const monthlyUpgrade =
  1941 |           proratedDelta(
  1942 |             'Income Builder',
  1943 |             'Overlay Strategists',
  1944 |             'monthly',
  1945 |             15,
  1946 |             30
  1947 |           );
  1948 | 
  1949 |         expect(
  1950 |           monthlyUpgrade
  1951 |         ).toBe(
  1952 |           25
  1953 |         );
  1954 | 
  1955 |         const annualUpgrade =
  1956 |           proratedDelta(
  1957 |             'Overlay Strategists',
  1958 |             'Portfolio Hedger',
  1959 |             'annual',
  1960 |             180,
  1961 |             365
  1962 |           );
  1963 | 
  1964 |         expect(
  1965 |           annualUpgrade
  1966 |         ).toBe(
  1967 |           354.79
  1968 |         );
  1969 | 
  1970 |         const immediateRefund =
  1971 |           refundEstimate(
  1972 |             'Marketplace',
  1973 |             'monthly',
  1974 |             10,
  1975 |             30
  1976 |           );
  1977 | 
  1978 |         expect(
  1979 |           immediateRefund
  1980 |         ).toBe(
  1981 |           166
  1982 |         );
  1983 |       }
  1984 |     );
  1985 |   }
  1986 | );
  1987 | 
```