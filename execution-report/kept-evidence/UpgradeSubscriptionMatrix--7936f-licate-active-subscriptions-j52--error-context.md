# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UpgradeSubscriptionMatrix.spec.ts >> Upgrade Subscription Use Case 3 Matrix >> SC-104 - Upgrade does not create duplicate active subscriptions
- Location: tests\UpgradeSubscriptionMatrix.spec.ts:361:13

# Error details

```
Error: Scenario UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY could not finish its setup flow (user not created): Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 81s.","code":"RATE_LIMITED","request_id":"acd9cc51-2103-430a-913c-f624f84db015"} Visible diagnostics: mobile="2015555350", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
```

# Test source

```ts
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
  2181 | 
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
> 2269 |                 error: new Error(
       |                        ^ Error: Scenario UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY could not finish its setup flow (user not created): Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 81s.","code":"RATE_LIMITED","request_id":"acd9cc51-2103-430a-913c-f624f84db015"} Visible diagnostics: mobile="2015555350", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
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
  2282 | 
  2283 | export function isScenarioCoverageKey(
  2284 |   key: string
  2285 | ) {
  2286 |   return key.startsWith(
  2287 |     'scenario:'
  2288 |   );
  2289 | }
  2290 | 
  2291 | export async function runScenarioStep(
  2292 |   key: string,
  2293 |   page: Page
  2294 | ): Promise<ScenarioOutcome> {
  2295 |   const [
  2296 |     ,
  2297 |     scenarioName,
  2298 |     stepName
  2299 |   ] = key.split(':');
  2300 | 
  2301 |   const scenario =
  2302 |     scenarioName as ScenarioUserName;
  2303 | 
  2304 |   if (!PACKS[scenario]) {
  2305 |     return {
  2306 |       status: 'failed',
  2307 |       error: new Error(
  2308 |         `Unknown scenario "${scenarioName}" in ${key}.`
  2309 |       )
  2310 |     };
  2311 |   }
  2312 | 
  2313 |   let run =
  2314 |     packRuns.get(scenario);
  2315 | 
  2316 |   if (!run) {
  2317 |     const cached =
  2318 |       loadCachedPack(
  2319 |         scenario
  2320 |       );
  2321 | 
  2322 |     run = cached
  2323 |       ? Promise.resolve(
  2324 |           cached
  2325 |         )
  2326 |       : executePack(
  2327 |           scenario,
  2328 |           page
  2329 |         );
  2330 | 
  2331 |     packRuns.set(
  2332 |       scenario,
  2333 |       run
  2334 |     );
  2335 |   }
  2336 | 
  2337 |   const outcomes =
  2338 |     await run;
  2339 | 
  2340 |   return (
  2341 |     outcomes.get(stepName) ?? {
  2342 |       status: 'failed',
  2343 |       error: new Error(
  2344 |         `Scenario ${scenario} has no step "${stepName}".`
  2345 |       )
  2346 |     }
  2347 |   );
  2348 | }
  2349 | 
  2350 | export function listScenarioSteps() {
  2351 |   return Object.fromEntries(
  2352 |     Object.entries(PACKS).map(
  2353 |       ([name, pack]) => [
  2354 |         name,
  2355 |         Object.keys(pack.steps)
  2356 |       ]
  2357 |     )
  2358 |   );
  2359 | }
  2360 | 
```