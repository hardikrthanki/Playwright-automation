# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UpgradeSubscriptionMatrix.spec.ts >> Upgrade Subscription Use Case 3 Matrix >> SC-92 - Successful upgrade records transaction history entry
- Location: tests\UpgradeSubscriptionMatrix.spec.ts:361:13

# Error details

```
Error: Scenario UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY could not finish its setup flow (user not created): Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 81s.","code":"RATE_LIMITED","request_id":"acd9cc51-2103-430a-913c-f624f84db015"} Visible diagnostics: mobile="2015555350", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
```

# Test source

```ts
  1889 | 
  1890 |         await host.page.waitForTimeout(
  1891 |           5000
  1892 |         );
  1893 |       } finally {
  1894 |         await host.close();
  1895 |       }
  1896 |     },
  1897 |     steps: {
  1898 |       'single-cancellation-request':
  1899 |         async (ctx) => {
  1900 |           expectNoDuplicateActionRequests(
  1901 |             ctx.requests,
  1902 |             'Double-click final cancellation'
  1903 |           );
  1904 |         },
  1905 | 
  1906 |       'cancellation-recorded-once':
  1907 |         async (ctx) => {
  1908 |           await ctx.billing.expectPaidAccessWhileCancellationScheduled(
  1909 |             'Income Builder'
  1910 |           );
  1911 | 
  1912 |           await ctx.billing.validateOverview();
  1913 | 
  1914 |           await ctx.billing.historyTab.click();
  1915 | 
  1916 |           const cancelRows =
  1917 |             await ctx.page
  1918 |               .locator('main')
  1919 |               .getByText(
  1920 |                 /cancel/i
  1921 |               )
  1922 |               .count();
  1923 | 
  1924 |           console.log(
  1925 |             `[CANCEL_DOUBLE_CLICK] history cancel mentions: ${cancelRows}`
  1926 |           );
  1927 | 
  1928 |           expect(
  1929 |             cancelRows
  1930 |           ).toBeLessThanOrEqual(
  1931 |             2
  1932 |           );
  1933 |         }
  1934 |     }
  1935 |   }
  1936 | };
  1937 | 
  1938 | /* ----------------------------------------------------------------------------
  1939 | Runner
  1940 | ---------------------------------------------------------------------------- */
  1941 | 
  1942 | const packRuns = new Map<
  1943 |   string,
  1944 |   Promise<Map<string, ScenarioOutcome>>
  1945 | >();
  1946 | 
  1947 | async function executePack(
  1948 |   scenario: ScenarioUserName,
  1949 |   page: Page
  1950 | ) {
  1951 |   const pack =
  1952 |     PACKS[scenario];
  1953 | 
  1954 |   const outcomes =
  1955 |     new Map<string, ScenarioOutcome>();
  1956 | 
  1957 |   const ctx: PackContext = {
  1958 |     scenario,
  1959 |     page,
  1960 |     email: '',
  1961 |     billing:
  1962 |       new BillingPage(page),
  1963 |     seenMessageIds:
  1964 |       new Set(),
  1965 |     requests: [],
  1966 |     state: {}
  1967 |   };
  1968 | 
  1969 |   console.log(
  1970 |     `[scenario] ${scenario}: ${SCENARIO_USERS[scenario].description}`
  1971 |   );
  1972 | 
  1973 |   try {
  1974 |     await pack.setup(ctx);
  1975 |   } catch (error) {
  1976 |     for (const stepName of Object.keys(
  1977 |       pack.steps
  1978 |     )) {
  1979 |       outcomes.set(
  1980 |         stepName,
  1981 |         error instanceof ScenarioSkip
  1982 |           ? {
  1983 |               status: 'skipped',
  1984 |               reason:
  1985 |                 `${error.reason} (user ${ctx.email || 'not created'})`
  1986 |             }
  1987 |           : {
  1988 |               status: 'failed',
> 1989 |               error: new Error(
       |                      ^ Error: Scenario UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY could not finish its setup flow (user not created): Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 81s.","code":"RATE_LIMITED","request_id":"acd9cc51-2103-430a-913c-f624f84db015"} Visible diagnostics: mobile="2015555350", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
  1990 |                 `Scenario ${scenario} could not finish its setup flow (user ${ctx.email || 'not created'}): ${errorText(error)}`
  1991 |               )
  1992 |             }
  1993 |       );
  1994 |     }
  1995 | 
  1996 |     saveCachedPack(
  1997 |       scenario,
  1998 |       outcomes
  1999 |     );
  2000 | 
  2001 |     return outcomes;
  2002 |   }
  2003 | 
  2004 |   for (const [
  2005 |     stepName,
  2006 |     run
  2007 |   ] of Object.entries(pack.steps)) {
  2008 |     try {
  2009 |       await run(ctx);
  2010 | 
  2011 |       outcomes.set(
  2012 |         stepName,
  2013 |         { status: 'passed' }
  2014 |       );
  2015 |     } catch (error) {
  2016 |       if (
  2017 |         error instanceof ScenarioSkip
  2018 |       ) {
  2019 |         outcomes.set(
  2020 |           stepName,
  2021 |           {
  2022 |             status: 'skipped',
  2023 |             reason:
  2024 |               error.reason
  2025 |           }
  2026 |         );
  2027 |       } else {
  2028 |         console.log(
  2029 |           `[scenario] ${scenario}:${stepName} FAILED: ${errorText(error).replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').slice(0, 600)}`
  2030 |         );
  2031 | 
  2032 |         const pageText =
  2033 |           await ctx.page
  2034 |             .locator('main')
  2035 |             .innerText({
  2036 |               timeout: 3000
  2037 |             })
  2038 |             .then((text) =>
  2039 |               text
  2040 |                 .replace(/\s+/g, ' ')
  2041 |                 .slice(0, 900)
  2042 |             )
  2043 |             .catch(() => '');
  2044 | 
  2045 |         if (pageText) {
  2046 |           console.log(
  2047 |             `[scenario] ${scenario}:${stepName} page text: ${pageText}`
  2048 |           );
  2049 |         }
  2050 | 
  2051 |         outcomes.set(
  2052 |           stepName,
  2053 |           {
  2054 |             status: 'failed',
  2055 |             error
  2056 |           }
  2057 |         );
  2058 |       }
  2059 | 
  2060 |       await ctx.page.keyboard
  2061 |         .press('Escape')
  2062 |         .catch(() => undefined);
  2063 |     }
  2064 |   }
  2065 | 
  2066 |   saveCachedPack(
  2067 |     scenario,
  2068 |     outcomes
  2069 |   );
  2070 | 
  2071 |   return outcomes;
  2072 | }
  2073 | 
  2074 | /* Playwright restarts the worker after any failed test, which would lose the
  2075 |    in-memory results and make the next row create a second disposable user.
  2076 |    Results are therefore also stored per Playwright run (parent pid). */
  2077 | 
  2078 | const CACHE_MAX_AGE_MS =
  2079 |   4 * 60 * 60 * 1000;
  2080 | 
  2081 | function cacheFile(
  2082 |   scenario: string
  2083 | ) {
  2084 |   return path.join(
  2085 |     process.cwd(),
  2086 |     'test-results',
  2087 |     'scenario-cache',
  2088 |     process.env.SCENARIO_RUN_ID ??
  2089 |       String(process.ppid),
```