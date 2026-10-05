# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-011 - No-card trial enforces broker integration limit without counting manual entry
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:499:13

# Error details

```
Error: Confirmed product issue: manual entry is currently counted as broker integration.
```

# Test source

```ts
  2125 |     };
  2126 | 
  2127 |     coverageCache.set(
  2128 |       key,
  2129 |       passed
  2130 |     );
  2131 | 
  2132 |     return {
  2133 |       ...passed,
  2134 |       cache: 'miss'
  2135 |     };
  2136 |   } catch (error) {
  2137 |     if (
  2138 |       error instanceof CoverageSkip
  2139 |     ) {
  2140 |       const skipped: CoverageOutcome = {
  2141 |         status: 'skipped',
  2142 |         reason:
  2143 |           error.reason
  2144 |       };
  2145 | 
  2146 |       coverageCache.set(
  2147 |         key,
  2148 |         skipped
  2149 |       );
  2150 | 
  2151 |       return {
  2152 |         ...skipped,
  2153 |         cache: 'miss'
  2154 |       };
  2155 |     }
  2156 | 
  2157 |     const failed: CoverageOutcome = {
  2158 |       status: 'failed',
  2159 |       error
  2160 |     };
  2161 | 
  2162 |     coverageCache.set(
  2163 |       key,
  2164 |       failed
  2165 |     );
  2166 | 
  2167 |     throw error;
  2168 |   }
  2169 | }
  2170 | 
  2171 | export async function executeStripeMatrixScenario(
  2172 |   scenario: StripeMatrixScenario,
  2173 |   browser: Browser | undefined,
  2174 |   options: {
  2175 |     module?: string;
  2176 |     journey?: string;
  2177 |     blockedReason: string;
  2178 |     extraAnnotations?: Array<{
  2179 |       type: string;
  2180 |       description: string;
  2181 |     }>;
  2182 |   }
  2183 | ) {
  2184 |   test.info().annotations.push(
  2185 |     {
  2186 |       type: 'priority',
  2187 |       description:
  2188 |         scenario.priority
  2189 |     },
  2190 |     {
  2191 |       type: 'automation-status',
  2192 |       description:
  2193 |         scenario.status
  2194 |     },
  2195 |     {
  2196 |       type: 'source-test-id',
  2197 |       description:
  2198 |         scenario.sourceIds?.join(
  2199 |           ', '
  2200 |         ) ??
  2201 |         scenario.id
  2202 |     },
  2203 |     {
  2204 |       type: 'module',
  2205 |       description:
  2206 |         options.module ??
  2207 |         'Billing'
  2208 |     },
  2209 |     {
  2210 |       type: 'journey',
  2211 |       description:
  2212 |         options.journey ??
  2213 |         'Stripe'
  2214 |     },
  2215 |     ...(
  2216 |       options.extraAnnotations ??
  2217 |       []
  2218 |     )
  2219 |   );
  2220 | 
  2221 |   if (
  2222 |     scenario.status ===
  2223 |     'known-bug'
  2224 |   ) {
> 2225 |     throw new Error(
       |           ^ Error: Confirmed product issue: manual entry is currently counted as broker integration.
  2226 |       scenario.dependency ??
  2227 |         'Known product bug'
  2228 |     );
  2229 |   }
  2230 | 
  2231 |   if (
  2232 |     scenario.status !==
  2233 |     'automated'
  2234 |   ) {
  2235 |     test.skip(
  2236 |       true,
  2237 |       scenario.dependency ??
  2238 |         options.blockedReason
  2239 |     );
  2240 |   }
  2241 | 
  2242 |   if (
  2243 |     (
  2244 |       scenario.automation ??
  2245 |       ''
  2246 |     ).toLowerCase().includes(
  2247 |       'paid plan ladder availability'
  2248 |     )
  2249 |   ) {
  2250 |     test.info().annotations.push(
  2251 |       {
  2252 |         type: 'coverage-key',
  2253 |         description:
  2254 |           'paid-plan-ladder'
  2255 |       }
  2256 |     );
  2257 | 
  2258 |     return;
  2259 |   }
  2260 | 
  2261 |   const coverageKey =
  2262 |     inferStripeMatrixCoverageKey(
  2263 |       scenario.automation,
  2264 |       scenario.title
  2265 |     );
  2266 | 
  2267 |   const cached =
  2268 |     coverageCache.get(
  2269 |       coverageKey
  2270 |     );
  2271 | 
  2272 |   let result: CoverageOutcome & {
  2273 |     cache: 'hit' | 'miss';
  2274 |   };
  2275 | 
  2276 |   if (
  2277 |     cached ||
  2278 |     !coverageNeedsPage(
  2279 |       coverageKey
  2280 |     )
  2281 |   ) {
  2282 |     result =
  2283 |       await runCoverageKey(
  2284 |         coverageKey
  2285 |       );
  2286 |   } else if (
  2287 |     !browser
  2288 |   ) {
  2289 |     throw new Error(
  2290 |       `Coverage key ${coverageKey} needs a browser.`
  2291 |     );
  2292 |   } else {
  2293 |     const page =
  2294 |       await browser.newPage();
  2295 | 
  2296 |     try {
  2297 |       result =
  2298 |         await runCoverageKey(
  2299 |           coverageKey,
  2300 |           page
  2301 |         );
  2302 |     } finally {
  2303 |       await page.close();
  2304 |     }
  2305 |   }
  2306 | 
  2307 |   test.info().annotations.push(
  2308 |     {
  2309 |       type: 'coverage-key',
  2310 |       description:
  2311 |         coverageKey
  2312 |     },
  2313 |     {
  2314 |       type: 'coverage-cache',
  2315 |       description:
  2316 |         result.cache
  2317 |     }
  2318 |   );
  2319 | 
  2320 |   if (
  2321 |     result.status ===
  2322 |     'skipped'
  2323 |   ) {
  2324 |     test.skip(
  2325 |       true,
```