# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UpgradeSubscriptionMatrix.spec.ts >> Upgrade Subscription Use Case 3 Matrix >> SC-103 - Upgrade preserves billing customer and payment method
- Location: tests\UpgradeSubscriptionMatrix.spec.ts:361:13

# Error details

```
Error: Scenario UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY could not finish its setup flow (user not created): Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 81s.","code":"RATE_LIMITED","request_id":"acd9cc51-2103-430a-913c-f624f84db015"} Visible diagnostics: mobile="2015555350", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
```

# Test source

```ts
  2081 |       );
  2082 |     }
  2083 | 
  2084 |     saveCachedPack(
  2085 |       scenario,
  2086 |       outcomes
  2087 |     );
  2088 | 
  2089 |     return outcomes;
  2090 |   }
  2091 | 
  2092 |   for (const [
  2093 |     stepName,
  2094 |     run
  2095 |   ] of Object.entries(pack.steps)) {
  2096 |     try {
  2097 |       await run(ctx);
  2098 | 
  2099 |       outcomes.set(
  2100 |         stepName,
  2101 |         { status: 'passed' }
  2102 |       );
  2103 |     } catch (error) {
  2104 |       if (
  2105 |         error instanceof ScenarioSkip
  2106 |       ) {
  2107 |         outcomes.set(
  2108 |           stepName,
  2109 |           {
  2110 |             status: 'skipped',
  2111 |             reason:
  2112 |               error.reason
  2113 |           }
  2114 |         );
  2115 |       } else {
  2116 |         console.log(
  2117 |           `[scenario] ${scenario}:${stepName} FAILED: ${errorText(error).replace(/\u001b\[[0-9;]*m/g, '').replace(/\s+/g, ' ').slice(0, 600)}`
  2118 |         );
  2119 | 
  2120 |         const pageText =
  2121 |           await ctx.page
  2122 |             .locator('main')
  2123 |             .innerText({
  2124 |               timeout: 3000
  2125 |             })
  2126 |             .then((text) =>
  2127 |               text
  2128 |                 .replace(/\s+/g, ' ')
  2129 |                 .slice(0, 900)
  2130 |             )
  2131 |             .catch(() => '');
  2132 | 
  2133 |         if (pageText) {
  2134 |           console.log(
  2135 |             `[scenario] ${scenario}:${stepName} page text: ${pageText}`
  2136 |           );
  2137 |         }
  2138 | 
  2139 |         outcomes.set(
  2140 |           stepName,
  2141 |           {
  2142 |             status: 'failed',
  2143 |             error
  2144 |           }
  2145 |         );
  2146 |       }
  2147 | 
  2148 |       await ctx.page.keyboard
  2149 |         .press('Escape')
  2150 |         .catch(() => undefined);
  2151 |     }
  2152 |   }
  2153 | 
  2154 |   saveCachedPack(
  2155 |     scenario,
  2156 |     outcomes
  2157 |   );
  2158 | 
  2159 |   return outcomes;
  2160 | }
  2161 | 
  2162 | /* Playwright restarts the worker after any failed test, which would lose the
  2163 |    in-memory results and make the next row create a second disposable user.
  2164 |    Results are therefore also stored per Playwright run (parent pid). */
  2165 | 
  2166 | const CACHE_MAX_AGE_MS =
  2167 |   4 * 60 * 60 * 1000;
  2168 | 
  2169 | function cacheFile(
  2170 |   scenario: string
  2171 | ) {
  2172 |   return path.join(
  2173 |     process.cwd(),
  2174 |     'test-results',
  2175 |     'scenario-cache',
  2176 |     process.env.SCENARIO_RUN_ID ??
  2177 |       String(process.ppid),
  2178 |     `${scenario}.json`
  2179 |   );
  2180 | }
> 2181 | 
       |                        ^ Error: Scenario UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY could not finish its setup flow (user not created): Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 81s.","code":"RATE_LIMITED","request_id":"acd9cc51-2103-430a-913c-f624f84db015"} Visible diagnostics: mobile="2015555350", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
  2182 | function saveCachedPack(
  2183 |   scenario: string,
  2184 |   outcomes: Map<string, ScenarioOutcome>
  2185 | ) {
  2186 |   try {
  2187 |     const file =
  2188 |       cacheFile(scenario);
  2189 | 
  2190 |     fs.mkdirSync(
  2191 |       path.dirname(file),
  2192 |       { recursive: true }
  2193 |     );
  2194 | 
  2195 |     fs.writeFileSync(
  2196 |       file,
  2197 |       JSON.stringify(
  2198 |         [...outcomes.entries()].map(
  2199 |           ([step, outcome]) => ({
  2200 |             step,
  2201 |             status:
  2202 |               outcome.status,
  2203 |             reason:
  2204 |               outcome.status ===
  2205 |               'skipped'
  2206 |                 ? outcome.reason
  2207 |                 : undefined,
  2208 |             message:
  2209 |               outcome.status ===
  2210 |               'failed'
  2211 |                 ? errorText(
  2212 |                     outcome.error
  2213 |                   )
  2214 |                 : undefined
  2215 |           })
  2216 |         )
  2217 |       )
  2218 |     );
  2219 |   } catch {
  2220 |     // Cache is an optimisation only.
  2221 |   }
  2222 | }
  2223 | 
  2224 | function loadCachedPack(
  2225 |   scenario: string
  2226 | ) {
  2227 |   try {
  2228 |     const file =
  2229 |       cacheFile(scenario);
  2230 | 
  2231 |     const stat =
  2232 |       fs.statSync(file);
  2233 | 
  2234 |     if (
  2235 |       Date.now() - stat.mtimeMs >
  2236 |       CACHE_MAX_AGE_MS
  2237 |     ) {
  2238 |       return undefined;
  2239 |     }
  2240 | 
  2241 |     const rows = JSON.parse(
  2242 |       fs.readFileSync(
  2243 |         file,
  2244 |         'utf8'
  2245 |       )
  2246 |     ) as Array<{
  2247 |       step: string;
  2248 |       status: ScenarioOutcome['status'];
  2249 |       reason?: string;
  2250 |       message?: string;
  2251 |     }>;
  2252 | 
  2253 |     const outcomes =
  2254 |       new Map<string, ScenarioOutcome>();
  2255 | 
  2256 |     for (const row of rows) {
  2257 |       outcomes.set(
  2258 |         row.step,
  2259 |         row.status === 'passed'
  2260 |           ? { status: 'passed' }
  2261 |           : row.status === 'skipped'
  2262 |             ? {
  2263 |                 status: 'skipped',
  2264 |                 reason:
  2265 |                   row.reason ?? ''
  2266 |               }
  2267 |             : {
  2268 |                 status: 'failed',
  2269 |                 error: new Error(
  2270 |                   row.message ??
  2271 |                     'Scenario step failed earlier in this run.'
  2272 |                 )
  2273 |               }
  2274 |       );
  2275 |     }
  2276 | 
  2277 |     return outcomes;
  2278 |   } catch {
  2279 |     return undefined;
  2280 |   }
  2281 | }
```