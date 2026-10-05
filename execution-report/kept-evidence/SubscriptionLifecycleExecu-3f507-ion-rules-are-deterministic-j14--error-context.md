# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Subscription lifecycle calculation rules are deterministic
- Location: tests\SubscriptionLifecycleExecution.spec.ts:1986:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 25
Received: 2.5
```

# Test source

```ts
  1900 |           'Purchase Income Builder monthly',
  1901 |           async () => {
  1902 |             await purchasePaidPlanForDisposableUser(
  1903 |               page,
  1904 |               'sub-lifecycle-purchase-upgrade',
  1905 |               'Income Builder',
  1906 |               'monthly',
  1907 |               'purchase-upgrade-ladder'
  1908 |             );
  1909 | 
  1910 |             const billing =
  1911 |               new BillingPage(
  1912 |                 page
  1913 |               );
  1914 | 
  1915 |             await billing.expectPlanActionAvailable(
  1916 |               'Overlay Strategists',
  1917 |               'upgrade'
  1918 |             );
  1919 | 
  1920 |             await billing.expectCurrentIntervalSwitchHidden(
  1921 |               'monthly'
  1922 |             );
  1923 |           }
  1924 |         );
  1925 | 
  1926 |         for (let index = 1; index < PAID_PLAN_LADDER.length; index += 1) {
  1927 |           const fromPlan =
  1928 |             PAID_PLAN_LADDER[index - 1];
  1929 |           const toPlan =
  1930 |             PAID_PLAN_LADDER[index];
  1931 | 
  1932 |           await test.step(
  1933 |             `Upgrade ${fromPlan} to ${toPlan} and validate the calculation`,
  1934 |             async () => {
  1935 |               const billing =
  1936 |                 new BillingPage(
  1937 |                   page
  1938 |                 );
  1939 | 
  1940 |               if (
  1941 |                 fromPlan ===
  1942 |                 'Overlay Strategists'
  1943 |               ) {
  1944 |                 await billing.expectPlanActionAvailable(
  1945 |                   'Portfolio Hedger',
  1946 |                   'upgrade'
  1947 |                 );
  1948 | 
  1949 |                 await billing.expectPlanActionAvailable(
  1950 |                   'Income Builder',
  1951 |                   'downgrade'
  1952 |                 );
  1953 |               }
  1954 | 
  1955 |               if (
  1956 |                 fromPlan ===
  1957 |                 'Portfolio Hedger'
  1958 |               ) {
  1959 |                 await billing.expectPlanActionAvailable(
  1960 |                   'Overlay Strategists',
  1961 |                   'downgrade'
  1962 |                 );
  1963 |               }
  1964 | 
  1965 |               const upgraded =
  1966 |                 await submitUpgradeWithDueAndRenewal(
  1967 |                   page,
  1968 |                   toPlan,
  1969 |                   'monthly',
  1970 |                   'upgrade'
  1971 |                 );
  1972 | 
  1973 |               if (
  1974 |                 !upgraded
  1975 |               ) {
  1976 |                 throw new Error(
  1977 |                   `Expected an upgrade from ${fromPlan} to ${toPlan}.`
  1978 |                 );
  1979 |               }
  1980 |             }
  1981 |           );
  1982 |         }
  1983 |       }
  1984 |     );
  1985 | 
  1986 |     test(
  1987 |       'Subscription lifecycle calculation rules are deterministic',
  1988 |       async () => {
  1989 |         const monthlyUpgrade =
  1990 |           proratedDelta(
  1991 |             'Income Builder',
  1992 |             'Overlay Strategists',
  1993 |             'monthly',
  1994 |             15,
  1995 |             30
  1996 |           );
  1997 | 
  1998 |         expect(
  1999 |           monthlyUpgrade
> 2000 |         ).toBe(
       |           ^ Error: expect(received).toBe(expected) // Object.is equality
  2001 |           25
  2002 |         );
  2003 | 
  2004 |         const annualUpgrade =
  2005 |           proratedDelta(
  2006 |             'Overlay Strategists',
  2007 |             'Portfolio Hedger',
  2008 |             'annual',
  2009 |             180,
  2010 |             365
  2011 |           );
  2012 | 
  2013 |         expect(
  2014 |           annualUpgrade
  2015 |         ).toBe(
  2016 |           354.79
  2017 |         );
  2018 | 
  2019 |         const immediateRefund =
  2020 |           refundEstimate(
  2021 |             'Portfolio Hedger',
  2022 |             'monthly',
  2023 |             10,
  2024 |             30
  2025 |           );
  2026 | 
  2027 |         expect(
  2028 |           immediateRefund
  2029 |         ).toBe(
  2030 |           99.33
  2031 |         );
  2032 |       }
  2033 |     );
  2034 |   }
  2035 | );
  2036 | 
```