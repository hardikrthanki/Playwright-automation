# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AnnualMonthlyBillingChangeMatrix.spec.ts >> Annual To Monthly Billing Change Use Case 6 Matrix >> SC-212 - Successful annual-to-monthly change preserves same plan tier
- Location: tests\AnnualMonthlyBillingChangeMatrix.spec.ts:393:13

# Error details

```
Error: Renewal date should fall within 45 days for monthly billing.

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 1795089515969
Received:    1822674600000
```

# Test source

```ts
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
  1961 |     await this.planChangeDialog(
  1962 |       options
  1963 |     ).innerText();
  1964 | 
  1965 |   const renewal =
  1966 |     parseFlexibleDate(
  1967 |       nearbyTextAfterLabel(
  1968 |         dialogText,
  1969 |         /next billing date|renews on|renewal date/i
  1970 |       )
  1971 |     ) ??
  1972 |     parseFlexibleDate(
  1973 |       dialogText
  1974 |     );
  1975 | 
  1976 |   expect(
  1977 |     renewal,
  1978 |     'Plan-change preview should show a next billing / renewal date.'
  1979 |   ).toBeDefined();
  1980 | 
  1981 |   const startOfToday =
  1982 |     new Date();
  1983 | 
  1984 |   startOfToday.setHours(
  1985 |     0,
  1986 |     0,
  1987 |     0,
  1988 |     0
  1989 |   );
  1990 | 
  1991 |   expect(
  1992 |     renewal!.getTime(),
  1993 |     'Renewal date should be today or later.'
  1994 |   ).toBeGreaterThanOrEqual(
  1995 |     startOfToday.getTime()
  1996 |   );
  1997 | 
  1998 |   const maxDays =
  1999 |     options.interval ===
  2000 |       'annual'
  2001 |       ? 400
  2002 |       : 45;
  2003 | 
  2004 |   expect(
  2005 |     renewal!.getTime(),
  2006 |     `Renewal date should fall within ${maxDays} days for ${options.interval} billing.`
> 2007 |   ).toBeLessThanOrEqual(
       |     ^ Error: Renewal date should fall within 45 days for monthly billing.
  2008 |     Date.now() +
  2009 |       maxDays *
  2010 |         24 *
  2011 |         60 *
  2012 |         60 *
  2013 |         1000
  2014 |   );
  2015 | 
  2016 |   Logger.success(
  2017 |     `${options.action} due amount and renewal ${renewal!.toISOString().slice(0, 10)} validated for ${options.targetPlan} ${options.interval}`
  2018 |   );
  2019 | }
  2020 | 
  2021 | async submitPlanChangeCalculationPreview(
  2022 |   options: {
  2023 |     targetPlan: string;
  2024 |     action: 'upgrade' | 'downgrade' | 'interval';
  2025 |   }
  2026 | ) {
  2027 |   Logger.info(
  2028 |     `Accepting terms and submitting ${options.action} for ${options.targetPlan}`
  2029 |   );
  2030 | 
  2031 |   const dialog =
  2032 |     this.planChangeDialog(
  2033 |       options
  2034 |     );
  2035 | 
  2036 |   await expect(
  2037 |     dialog
  2038 |   ).toBeVisible({
  2039 |     timeout: 15000
  2040 |   });
  2041 | 
  2042 |   const termsCheckbox =
  2043 |     dialog
  2044 |       .locator(
  2045 |         '[role="checkbox"], input[type="checkbox"]'
  2046 |       )
  2047 |       .first();
  2048 | 
  2049 |   const confirmButton =
  2050 |     dialog
  2051 |       .getByRole(
  2052 |         'button',
  2053 |         {
  2054 |           name: /confirm\s*&\s*pay|confirm.*pay|pay/i
  2055 |         }
  2056 |       )
  2057 |       .first();
  2058 | 
  2059 |   await expect(
  2060 |     termsCheckbox
  2061 |   ).toBeVisible({
  2062 |     timeout: 10000
  2063 |   });
  2064 | 
  2065 |   await expect(
  2066 |     confirmButton
  2067 |   ).toBeDisabled({
  2068 |     timeout: 10000
  2069 |   });
  2070 | 
  2071 |   if (
  2072 |     !(await checkboxIsChecked(
  2073 |       termsCheckbox
  2074 |     ))
  2075 |   ) {
  2076 |     await safeClick(
  2077 |       termsCheckbox,
  2078 |       'Accept Plan Change Terms'
  2079 |     );
  2080 |   }
  2081 | 
  2082 |   if (
  2083 |     !(await checkboxIsChecked(
  2084 |       termsCheckbox
  2085 |     ))
  2086 |   ) {
  2087 |     await termsCheckbox.click({
  2088 |       force: true
  2089 |     }).catch(
  2090 |       () => undefined
  2091 |     );
  2092 |   }
  2093 | 
  2094 |   if (
  2095 |     !(await checkboxIsChecked(
  2096 |       termsCheckbox
  2097 |     ))
  2098 |   ) {
  2099 |     await dialog.getByText(
  2100 |       /agree|terms|i understand|accept/i
  2101 |     ).first().click({
  2102 |       force: true
  2103 |     }).catch(
  2104 |       () => undefined
  2105 |     );
  2106 |   }
  2107 | 
```