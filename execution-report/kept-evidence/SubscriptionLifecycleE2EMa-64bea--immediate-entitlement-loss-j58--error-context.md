# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-027 - Downgrade schedules lower plan for next renewal instead of immediate entitlement loss
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 90000ms exceeded while waiting on the predicate
```

# Test source

```ts
  1983 |     );
  1984 | 
  1985 |   await expect(
  1986 |     dialog
  1987 |   ).toBeVisible({
  1988 |     timeout: 15000
  1989 |   });
  1990 | 
  1991 |   const termsCheckbox =
  1992 |     dialog
  1993 |       .locator(
  1994 |         '[role="checkbox"], input[type="checkbox"]'
  1995 |       )
  1996 |       .first();
  1997 | 
  1998 |   const confirmButton =
  1999 |     dialog
  2000 |       .getByRole(
  2001 |         'button',
  2002 |         {
  2003 |           name: /confirm\s*&\s*pay|confirm.*pay|pay/i
  2004 |         }
  2005 |       )
  2006 |       .first();
  2007 | 
  2008 |   await expect(
  2009 |     termsCheckbox
  2010 |   ).toBeVisible({
  2011 |     timeout: 10000
  2012 |   });
  2013 | 
  2014 |   await expect(
  2015 |     confirmButton
  2016 |   ).toBeDisabled({
  2017 |     timeout: 10000
  2018 |   });
  2019 | 
  2020 |   if (
  2021 |     !(await checkboxIsChecked(
  2022 |       termsCheckbox
  2023 |     ))
  2024 |   ) {
  2025 |     await safeClick(
  2026 |       termsCheckbox,
  2027 |       'Accept Plan Change Terms'
  2028 |     );
  2029 |   }
  2030 | 
  2031 |   await expect
  2032 |     .poll(
  2033 |       async () =>
  2034 |         checkboxIsChecked(
  2035 |           termsCheckbox
  2036 |         ),
  2037 |       {
  2038 |         timeout: 10000,
  2039 |         message: 'Waiting for plan-change terms checkbox to be checked'
  2040 |       }
  2041 |     )
  2042 |     .toBe(
  2043 |       true
  2044 |     );
  2045 | 
  2046 |   await expect(
  2047 |     confirmButton
  2048 |   ).toBeEnabled({
  2049 |     timeout: 15000
  2050 |   });
  2051 | 
  2052 |   await safeClick(
  2053 |     confirmButton,
  2054 |     'Confirm and pay plan change'
  2055 |   );
  2056 | 
  2057 |   await expect(
  2058 |     dialog
  2059 |   ).toBeHidden({
  2060 |     timeout: 60000
  2061 |   });
  2062 | 
  2063 |   await this.page.waitForLoadState(
  2064 |     'domcontentloaded'
  2065 |   ).catch(
  2066 |     () => undefined
  2067 |   );
  2068 | 
  2069 |   Logger.success(
  2070 |     `${options.action} submitted for ${options.targetPlan}`
  2071 |   );
  2072 | }
  2073 | 
  2074 | async validateActivePlan(
  2075 |   expectedPlan: string
  2076 | ) {
  2077 |   Logger.info(
  2078 |     `Validating active Billing plan: ${expectedPlan}`
  2079 |   );
  2080 | 
  2081 |   let attempt = 0;
  2082 | 
> 2083 |   await expect.poll(
       |   ^ Error: expect(received).toBe(expected) // Object.is equality
  2084 |     async () => {
  2085 |       attempt += 1;
  2086 | 
  2087 |       if (
  2088 |         attempt > 1 &&
  2089 |         attempt % 3 === 0
  2090 |       ) {
  2091 |         await this.page.reload({
  2092 |           waitUntil: 'domcontentloaded'
  2093 |         }).catch(
  2094 |           () => undefined
  2095 |         );
  2096 |       }
  2097 | 
  2098 |       await this.openPlansView();
  2099 | 
  2100 |       return this.cardShowsCurrentPlan(
  2101 |         expectedPlan
  2102 |       );
  2103 |     },
  2104 |     {
  2105 |       timeout: 90000,
  2106 |       intervals: [2000, 3000, 5000]
  2107 |     }
  2108 |   ).toBe(
  2109 |     true
  2110 |   );
  2111 | 
  2112 |   Logger.success(
  2113 |     `Active Billing plan validated: ${expectedPlan}`
  2114 |   );
  2115 | }
  2116 | 
  2117 | async closePlanChangeCalculationPreview(
  2118 |   options: {
  2119 |     targetPlan: string;
  2120 |     action: 'upgrade' | 'downgrade' | 'interval';
  2121 |   }
  2122 | ) {
  2123 |   const dialog =
  2124 |     this.planChangeDialog(
  2125 |       options
  2126 |     );
  2127 | 
  2128 |   const cancelButton =
  2129 |     dialog.getByRole(
  2130 |       'button',
  2131 |       {
  2132 |         name: /^(cancel|close)$/i
  2133 |       }
  2134 |     ).first();
  2135 | 
  2136 |   if (
  2137 |     await cancelButton.isVisible({
  2138 |       timeout: 3000
  2139 |     }).catch(
  2140 |       () => false
  2141 |     )
  2142 |   ) {
  2143 |     await safeClick(
  2144 |       cancelButton,
  2145 |       'Cancel Plan Change Preview'
  2146 |     );
  2147 |   } else {
  2148 |     await this.page.keyboard.press(
  2149 |       'Escape'
  2150 |     );
  2151 |   }
  2152 | 
  2153 |   await expect(
  2154 |     dialog
  2155 |   ).toBeHidden({
  2156 |     timeout: 10000
  2157 |   });
  2158 | }
  2159 | 
  2160 | async validatePlanChangeTermsRequired(
  2161 |   options: {
  2162 |     targetPlan: string;
  2163 |     action: 'upgrade' | 'downgrade' | 'interval';
  2164 |   }
  2165 | ) {
  2166 |   Logger.info(
  2167 |     `Validating ${options.action} terms are required before confirmation`
  2168 |   );
  2169 | 
  2170 |   const dialog =
  2171 |     this.planChangeDialog(
  2172 |       options
  2173 |     );
  2174 | 
  2175 |   await expect(
  2176 |     dialog
  2177 |   ).toBeVisible({
  2178 |     timeout: 15000
  2179 |   });
  2180 | 
  2181 |   const termsCheckbox =
  2182 |     dialog
  2183 |       .locator(
```