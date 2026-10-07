# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UpgradeSubscriptionMatrix.spec.ts >> Upgrade Subscription Use Case 3 Matrix >> SC-95 - Upgrade confirmation email is sent
- Location: tests\UpgradeSubscriptionMatrix.spec.ts:361:13

# Error details

```
Error: Scenario UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY could not finish its setup flow (user not created): Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 81s.","code":"RATE_LIMITED","request_id":"acd9cc51-2103-430a-913c-f624f84db015"} Visible diagnostics: mobile="2015555350", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
```

# Test source

```ts
  2081 | function cacheFile(
  2082 |   scenario: string
  2083 | ) {
  2084 |   return path.join(
  2085 |     process.cwd(),
  2086 |     'test-results',
  2087 |     'scenario-cache',
  2088 |     process.env.SCENARIO_RUN_ID ??
  2089 |       String(process.ppid),
  2090 |     `${scenario}.json`
  2091 |   );
  2092 | }
  2093 | 
  2094 | function saveCachedPack(
  2095 |   scenario: string,
  2096 |   outcomes: Map<string, ScenarioOutcome>
  2097 | ) {
  2098 |   try {
  2099 |     const file =
  2100 |       cacheFile(scenario);
  2101 | 
  2102 |     fs.mkdirSync(
  2103 |       path.dirname(file),
  2104 |       { recursive: true }
  2105 |     );
  2106 | 
  2107 |     fs.writeFileSync(
  2108 |       file,
  2109 |       JSON.stringify(
  2110 |         [...outcomes.entries()].map(
  2111 |           ([step, outcome]) => ({
  2112 |             step,
  2113 |             status:
  2114 |               outcome.status,
  2115 |             reason:
  2116 |               outcome.status ===
  2117 |               'skipped'
  2118 |                 ? outcome.reason
  2119 |                 : undefined,
  2120 |             message:
  2121 |               outcome.status ===
  2122 |               'failed'
  2123 |                 ? errorText(
  2124 |                     outcome.error
  2125 |                   )
  2126 |                 : undefined
  2127 |           })
  2128 |         )
  2129 |       )
  2130 |     );
  2131 |   } catch {
  2132 |     // Cache is an optimisation only.
  2133 |   }
  2134 | }
  2135 | 
  2136 | function loadCachedPack(
  2137 |   scenario: string
  2138 | ) {
  2139 |   try {
  2140 |     const file =
  2141 |       cacheFile(scenario);
  2142 | 
  2143 |     const stat =
  2144 |       fs.statSync(file);
  2145 | 
  2146 |     if (
  2147 |       Date.now() - stat.mtimeMs >
  2148 |       CACHE_MAX_AGE_MS
  2149 |     ) {
  2150 |       return undefined;
  2151 |     }
  2152 | 
  2153 |     const rows = JSON.parse(
  2154 |       fs.readFileSync(
  2155 |         file,
  2156 |         'utf8'
  2157 |       )
  2158 |     ) as Array<{
  2159 |       step: string;
  2160 |       status: ScenarioOutcome['status'];
  2161 |       reason?: string;
  2162 |       message?: string;
  2163 |     }>;
  2164 | 
  2165 |     const outcomes =
  2166 |       new Map<string, ScenarioOutcome>();
  2167 | 
  2168 |     for (const row of rows) {
  2169 |       outcomes.set(
  2170 |         row.step,
  2171 |         row.status === 'passed'
  2172 |           ? { status: 'passed' }
  2173 |           : row.status === 'skipped'
  2174 |             ? {
  2175 |                 status: 'skipped',
  2176 |                 reason:
  2177 |                   row.reason ?? ''
  2178 |               }
  2179 |             : {
  2180 |                 status: 'failed',
> 2181 |                 error: new Error(
       |                        ^ Error: Scenario UPGRADE_INCOME_MONTHLY_TO_OVERLAY_MONTHLY could not finish its setup flow (user not created): Registration OTP input did not appear after requesting SMS code. Send status 429. {"error":"Too many OTP requests. Try again in 81s.","code":"RATE_LIMITED","request_id":"acd9cc51-2103-430a-913c-f624f84db015"} Visible diagnostics: mobile="2015555350", sendCodeEnabled=true; OR SIGN UP WITH EMAIL & MOBILE | Mobile number | US mobile numbers only. We’ll text you a one-time code. | Send code via SMS
  2182 |                   row.message ??
  2183 |                     'Scenario step failed earlier in this run.'
  2184 |                 )
  2185 |               }
  2186 |       );
  2187 |     }
  2188 | 
  2189 |     return outcomes;
  2190 |   } catch {
  2191 |     return undefined;
  2192 |   }
  2193 | }
  2194 | 
  2195 | export function isScenarioCoverageKey(
  2196 |   key: string
  2197 | ) {
  2198 |   return key.startsWith(
  2199 |     'scenario:'
  2200 |   );
  2201 | }
  2202 | 
  2203 | export async function runScenarioStep(
  2204 |   key: string,
  2205 |   page: Page
  2206 | ): Promise<ScenarioOutcome> {
  2207 |   const [
  2208 |     ,
  2209 |     scenarioName,
  2210 |     stepName
  2211 |   ] = key.split(':');
  2212 | 
  2213 |   const scenario =
  2214 |     scenarioName as ScenarioUserName;
  2215 | 
  2216 |   if (!PACKS[scenario]) {
  2217 |     return {
  2218 |       status: 'failed',
  2219 |       error: new Error(
  2220 |         `Unknown scenario "${scenarioName}" in ${key}.`
  2221 |       )
  2222 |     };
  2223 |   }
  2224 | 
  2225 |   let run =
  2226 |     packRuns.get(scenario);
  2227 | 
  2228 |   if (!run) {
  2229 |     const cached =
  2230 |       loadCachedPack(
  2231 |         scenario
  2232 |       );
  2233 | 
  2234 |     run = cached
  2235 |       ? Promise.resolve(
  2236 |           cached
  2237 |         )
  2238 |       : executePack(
  2239 |           scenario,
  2240 |           page
  2241 |         );
  2242 | 
  2243 |     packRuns.set(
  2244 |       scenario,
  2245 |       run
  2246 |     );
  2247 |   }
  2248 | 
  2249 |   const outcomes =
  2250 |     await run;
  2251 | 
  2252 |   return (
  2253 |     outcomes.get(stepName) ?? {
  2254 |       status: 'failed',
  2255 |       error: new Error(
  2256 |         `Scenario ${scenario} has no step "${stepName}".`
  2257 |       )
  2258 |     }
  2259 |   );
  2260 | }
  2261 | 
  2262 | export function listScenarioSteps() {
  2263 |   return Object.fromEntries(
  2264 |     Object.entries(PACKS).map(
  2265 |       ([name, pack]) => [
  2266 |         name,
  2267 |         Object.keys(pack.steps)
  2268 |       ]
  2269 |     )
  2270 |   );
  2271 | }
  2272 | 
```