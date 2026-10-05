# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-030 - Annual-to-monthly billing change is scheduled for next renewal date
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').or(getByRole('alertdialog')).filter({ hasText: /confirm your subscription|(?:Income Builder|Income)|(?:switch|change).{0,80}(?:annual|monthly)|(?:annual|monthly|per month|per year|\/month|\/year)/i }).first().locator('[role="checkbox"], input[type="checkbox"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('dialog').or(getByRole('alertdialog')).filter({ hasText: /confirm your subscription|(?:Income Builder|Income)|(?:switch|change).{0,80}(?:annual|monthly)|(?:annual|monthly|per month|per year|\/month|\/year)/i }).first().locator('[role="checkbox"], input[type="checkbox"]').first()

```

# Test source

```ts
  1973 |       options
  1974 |     ).innerText();
  1975 | 
  1976 |   const renewal =
  1977 |     parseFlexibleDate(
  1978 |       nearbyTextAfterLabel(
  1979 |         dialogText,
  1980 |         /next billing date|renews on|renewal date/i
  1981 |       )
  1982 |     ) ??
  1983 |     parseFlexibleDate(
  1984 |       dialogText
  1985 |     );
  1986 | 
  1987 |   expect(
  1988 |     renewal,
  1989 |     'Plan-change preview should show a next billing / renewal date.'
  1990 |   ).toBeDefined();
  1991 | 
  1992 |   const startOfToday =
  1993 |     new Date();
  1994 | 
  1995 |   startOfToday.setHours(
  1996 |     0,
  1997 |     0,
  1998 |     0,
  1999 |     0
  2000 |   );
  2001 | 
  2002 |   expect(
  2003 |     renewal!.getTime(),
  2004 |     'Renewal date should be today or later.'
  2005 |   ).toBeGreaterThanOrEqual(
  2006 |     startOfToday.getTime()
  2007 |   );
  2008 | 
  2009 |   const maxDays =
  2010 |     options.interval === 'annual' ||
  2011 |     options.action === 'interval' ||
  2012 |     options.action === 'downgrade'
  2013 |       ? 400
  2014 |       : 45;
  2015 | 
  2016 |   expect(
  2017 |     renewal!.getTime(),
  2018 |     `Renewal date should fall within ${maxDays} days for ${options.interval} billing.`
  2019 |   ).toBeLessThanOrEqual(
  2020 |     Date.now() +
  2021 |       maxDays *
  2022 |         24 *
  2023 |         60 *
  2024 |         60 *
  2025 |         1000
  2026 |   );
  2027 | 
  2028 |   Logger.success(
  2029 |     `${options.action} due amount and renewal ${renewal!.toISOString().slice(0, 10)} validated for ${options.targetPlan} ${options.interval}`
  2030 |   );
  2031 | }
  2032 | 
  2033 | async submitPlanChangeCalculationPreview(
  2034 |   options: {
  2035 |     targetPlan: string;
  2036 |     action: 'upgrade' | 'downgrade' | 'interval';
  2037 |   }
  2038 | ) {
  2039 |   Logger.info(
  2040 |     `Accepting terms and submitting ${options.action} for ${options.targetPlan}`
  2041 |   );
  2042 | 
  2043 |   const dialog =
  2044 |     this.planChangeDialog(
  2045 |       options
  2046 |     );
  2047 | 
  2048 |   await expect(
  2049 |     dialog
  2050 |   ).toBeVisible({
  2051 |     timeout: 15000
  2052 |   });
  2053 | 
  2054 |   const termsCheckbox =
  2055 |     dialog
  2056 |       .locator(
  2057 |         '[role="checkbox"], input[type="checkbox"]'
  2058 |       )
  2059 |       .first();
  2060 | 
  2061 |   const confirmButton =
  2062 |     dialog
  2063 |       .getByRole(
  2064 |         'button',
  2065 |         {
  2066 |           name: /confirm\s*&\s*pay|confirm.*pay|pay/i
  2067 |         }
  2068 |       )
  2069 |       .first();
  2070 | 
  2071 |   await expect(
  2072 |     termsCheckbox
> 2073 |   ).toBeVisible({
       |     ^ Error: expect(locator).toBeVisible() failed
  2074 |     timeout: 10000
  2075 |   });
  2076 | 
  2077 |   await expect(
  2078 |     confirmButton
  2079 |   ).toBeDisabled({
  2080 |     timeout: 10000
  2081 |   });
  2082 | 
  2083 |   if (
  2084 |     !(await checkboxIsChecked(
  2085 |       termsCheckbox
  2086 |     ))
  2087 |   ) {
  2088 |     await safeClick(
  2089 |       termsCheckbox,
  2090 |       'Accept Plan Change Terms'
  2091 |     );
  2092 |   }
  2093 | 
  2094 |   if (
  2095 |     !(await checkboxIsChecked(
  2096 |       termsCheckbox
  2097 |     ))
  2098 |   ) {
  2099 |     await termsCheckbox.click({
  2100 |       force: true
  2101 |     }).catch(
  2102 |       () => undefined
  2103 |     );
  2104 |   }
  2105 | 
  2106 |   if (
  2107 |     !(await checkboxIsChecked(
  2108 |       termsCheckbox
  2109 |     ))
  2110 |   ) {
  2111 |     await dialog.getByText(
  2112 |       /agree|terms|i understand|accept/i
  2113 |     ).first().click({
  2114 |       force: true
  2115 |     }).catch(
  2116 |       () => undefined
  2117 |     );
  2118 |   }
  2119 | 
  2120 |   await expect
  2121 |     .poll(
  2122 |       async () =>
  2123 |         checkboxIsChecked(
  2124 |           termsCheckbox
  2125 |         ),
  2126 |       {
  2127 |         timeout: 10000,
  2128 |         message: 'Waiting for plan-change terms checkbox to be checked'
  2129 |       }
  2130 |     )
  2131 |     .toBe(
  2132 |       true
  2133 |     );
  2134 | 
  2135 |   await expect(
  2136 |     confirmButton
  2137 |   ).toBeEnabled({
  2138 |     timeout: 15000
  2139 |   });
  2140 | 
  2141 |   await safeClick(
  2142 |     confirmButton,
  2143 |     'Confirm and pay plan change'
  2144 |   );
  2145 | 
  2146 |   await expect(
  2147 |     dialog
  2148 |   ).toBeHidden({
  2149 |     timeout: 60000
  2150 |   });
  2151 | 
  2152 |   await this.page.waitForLoadState(
  2153 |     'domcontentloaded'
  2154 |   ).catch(
  2155 |     () => undefined
  2156 |   );
  2157 | 
  2158 |   Logger.success(
  2159 |     `${options.action} submitted for ${options.targetPlan}`
  2160 |   );
  2161 | }
  2162 | 
  2163 | async validateActivePlan(
  2164 |   expectedPlan: string
  2165 | ) {
  2166 |   Logger.info(
  2167 |     `Validating active Billing plan: ${expectedPlan}`
  2168 |   );
  2169 | 
  2170 |   let attempt = 0;
  2171 | 
  2172 |   await expect.poll(
  2173 |     async () => {
```