# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MonthlyAnnualBillingChangeMatrix.spec.ts >> Monthly To Annual Billing Change Use Case 5 Matrix >> SC-182 - Confirmation email is sent after monthly-to-annual change
- Location: tests\MonthlyAnnualBillingChangeMatrix.spec.ts:361:13

# Error details

```
Error: No Gmail message for "billing interval confirmation" arrived for imhardikthanki+iv-m2a-muxyumxw@gmail.com within 120s. Subjects seen: ["Your Income subscription is now active","Verify your email for imhardikthanki+iv-m2a-muxyumxw@gmail.com"]
```

# Test source

```ts
  2214 | function cacheFile(
  2215 |   scenario: string
  2216 | ) {
  2217 |   return path.join(
  2218 |     process.cwd(),
  2219 |     'test-results',
  2220 |     'scenario-cache',
  2221 |     process.env.SCENARIO_RUN_ID ??
  2222 |       String(process.ppid),
  2223 |     `${scenario}.json`
  2224 |   );
  2225 | }
  2226 | 
  2227 | function saveCachedPack(
  2228 |   scenario: string,
  2229 |   outcomes: Map<string, ScenarioOutcome>
  2230 | ) {
  2231 |   try {
  2232 |     const file =
  2233 |       cacheFile(scenario);
  2234 | 
  2235 |     fs.mkdirSync(
  2236 |       path.dirname(file),
  2237 |       { recursive: true }
  2238 |     );
  2239 | 
  2240 |     fs.writeFileSync(
  2241 |       file,
  2242 |       JSON.stringify(
  2243 |         [...outcomes.entries()].map(
  2244 |           ([step, outcome]) => ({
  2245 |             step,
  2246 |             status:
  2247 |               outcome.status,
  2248 |             reason:
  2249 |               outcome.status ===
  2250 |               'skipped'
  2251 |                 ? outcome.reason
  2252 |                 : undefined,
  2253 |             message:
  2254 |               outcome.status ===
  2255 |               'failed'
  2256 |                 ? errorText(
  2257 |                     outcome.error
  2258 |                   )
  2259 |                 : undefined
  2260 |           })
  2261 |         )
  2262 |       )
  2263 |     );
  2264 |   } catch {
  2265 |     // Cache is an optimisation only.
  2266 |   }
  2267 | }
  2268 | 
  2269 | function loadCachedPack(
  2270 |   scenario: string
  2271 | ) {
  2272 |   try {
  2273 |     const file =
  2274 |       cacheFile(scenario);
  2275 | 
  2276 |     const stat =
  2277 |       fs.statSync(file);
  2278 | 
  2279 |     if (
  2280 |       Date.now() - stat.mtimeMs >
  2281 |       CACHE_MAX_AGE_MS
  2282 |     ) {
  2283 |       return undefined;
  2284 |     }
  2285 | 
  2286 |     const rows = JSON.parse(
  2287 |       fs.readFileSync(
  2288 |         file,
  2289 |         'utf8'
  2290 |       )
  2291 |     ) as Array<{
  2292 |       step: string;
  2293 |       status: ScenarioOutcome['status'];
  2294 |       reason?: string;
  2295 |       message?: string;
  2296 |     }>;
  2297 | 
  2298 |     const outcomes =
  2299 |       new Map<string, ScenarioOutcome>();
  2300 | 
  2301 |     for (const row of rows) {
  2302 |       outcomes.set(
  2303 |         row.step,
  2304 |         row.status === 'passed'
  2305 |           ? { status: 'passed' }
  2306 |           : row.status === 'skipped'
  2307 |             ? {
  2308 |                 status: 'skipped',
  2309 |                 reason:
  2310 |                   row.reason ?? ''
  2311 |               }
  2312 |             : {
  2313 |                 status: 'failed',
> 2314 |                 error: new Error(
       |                        ^ Error: No Gmail message for "billing interval confirmation" arrived for imhardikthanki+iv-m2a-muxyumxw@gmail.com within 120s. Subjects seen: ["Your Income subscription is now active","Verify your email for imhardikthanki+iv-m2a-muxyumxw@gmail.com"]
  2315 |                   row.message ??
  2316 |                     'Scenario step failed earlier in this run.'
  2317 |                 )
  2318 |               }
  2319 |       );
  2320 |     }
  2321 | 
  2322 |     return outcomes;
  2323 |   } catch {
  2324 |     return undefined;
  2325 |   }
  2326 | }
  2327 | 
  2328 | export function isScenarioCoverageKey(
  2329 |   key: string
  2330 | ) {
  2331 |   return key.startsWith(
  2332 |     'scenario:'
  2333 |   );
  2334 | }
  2335 | 
  2336 | export async function runScenarioStep(
  2337 |   key: string,
  2338 |   page: Page
  2339 | ): Promise<ScenarioOutcome> {
  2340 |   const [
  2341 |     ,
  2342 |     scenarioName,
  2343 |     stepName
  2344 |   ] = key.split(':');
  2345 | 
  2346 |   const scenario =
  2347 |     scenarioName as ScenarioUserName;
  2348 | 
  2349 |   if (!PACKS[scenario]) {
  2350 |     return {
  2351 |       status: 'failed',
  2352 |       error: new Error(
  2353 |         `Unknown scenario "${scenarioName}" in ${key}.`
  2354 |       )
  2355 |     };
  2356 |   }
  2357 | 
  2358 |   let run =
  2359 |     packRuns.get(scenario);
  2360 | 
  2361 |   if (!run) {
  2362 |     const cached =
  2363 |       loadCachedPack(
  2364 |         scenario
  2365 |       );
  2366 | 
  2367 |     run = cached
  2368 |       ? Promise.resolve(
  2369 |           cached
  2370 |         )
  2371 |       : executePack(
  2372 |           scenario,
  2373 |           page
  2374 |         );
  2375 | 
  2376 |     packRuns.set(
  2377 |       scenario,
  2378 |       run
  2379 |     );
  2380 |   }
  2381 | 
  2382 |   const outcomes =
  2383 |     await run;
  2384 | 
  2385 |   return (
  2386 |     outcomes.get(stepName) ?? {
  2387 |       status: 'failed',
  2388 |       error: new Error(
  2389 |         `Scenario ${scenario} has no step "${stepName}".`
  2390 |       )
  2391 |     }
  2392 |   );
  2393 | }
  2394 | 
  2395 | export function listScenarioSteps() {
  2396 |   return Object.fromEntries(
  2397 |     Object.entries(PACKS).map(
  2398 |       ([name, pack]) => [
  2399 |         name,
  2400 |         Object.keys(pack.steps)
  2401 |       ]
  2402 |     )
  2403 |   );
  2404 | }
  2405 | 
```