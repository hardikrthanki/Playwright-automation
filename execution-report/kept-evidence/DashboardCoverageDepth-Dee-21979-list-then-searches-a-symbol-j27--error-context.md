# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardCoverageDepth.spec.ts >> Deeper dashboard controls >> News switches portfolio and watchlist, then searches a symbol
- Location: tests\DashboardCoverageDepth.spec.ts:370:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /^AAPL$/ })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for getByRole('heading', { name: /^AAPL$/ })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - link "OolTool" [ref=e7] [cursor=pointer]:
          - /url: /dashboard
          - img "OolTool" [ref=e8]
        - navigation [ref=e10]:
          - link "Dashboard" [ref=e11] [cursor=pointer]:
            - /url: /dashboard
          - link "Opportunities" [ref=e12] [cursor=pointer]:
            - /url: /dashboard/opportunities
          - button "Portfolio" [ref=e14]:
            - generic [ref=e15]: Portfolio
            - img [ref=e16]
          - button "Research" [ref=e19]:
            - generic [ref=e20]: Research
            - img [ref=e21]
          - link "Academy" [ref=e23] [cursor=pointer]:
            - /url: /academy
          - link "Support" [ref=e24] [cursor=pointer]:
            - /url: /dashboard/support
        - generic [ref=e25]:
          - button "Sync all" [ref=e26] [cursor=pointer]:
            - img
            - generic [ref=e27]: Sync all
          - button "Add options" [ref=e28] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e29] [cursor=pointer]:
            - img [ref=e30]
            - generic [ref=e33]: "17"
          - button "Enter fullscreen" [ref=e34] [cursor=pointer]:
            - img
          - button "Switch to dark theme" [ref=e35] [cursor=pointer]:
            - img
          - button "HT" [ref=e36] [cursor=pointer]:
            - generic [ref=e38]: HT
    - main [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - heading "News" [level=1] [ref=e42]
          - paragraph [ref=e43]: Search any symbol on the All tab, or browse headlines for your portfolio and watchlist holdings.
        - generic [ref=e44]:
          - tablist [ref=e46]:
            - tab "All" [selected] [ref=e47] [cursor=pointer]: All
            - tab "Portfolio (8)" [ref=e48] [cursor=pointer]:
              - text: Portfolio
              - generic [ref=e49]: (8)
            - tab "Watchlist" [ref=e50] [cursor=pointer]: Watchlist
          - paragraph [ref=e51]:
            - text: Search any symbol for headlines, or open
            - link "Equity Research" [ref=e52] [cursor=pointer]:
              - /url: /dashboard/equity-research
            - text: for deeper analysis.
          - generic [ref=e53]:
            - generic [ref=e55]:
              - generic [ref=e56]: Symbol
              - generic [ref=e57]:
                - img
                - combobox "Search symbol (e.g. AAPL)" [ref=e58]: AAPL
                - button "Clear Symbol" [ref=e59]:
                  - img [ref=e60]
            - generic [ref=e63]:
              - button "Search" [ref=e64] [cursor=pointer]:
                - img
                - generic [ref=e65]: Search
              - button "Reset" [ref=e66] [cursor=pointer]:
                - img
                - generic [ref=e67]: Reset
          - generic [ref=e68]:
            - generic [ref=e69]:
              - heading "Results for AAPL" [level=3] [ref=e70]
              - link "Equity Research" [ref=e72] [cursor=pointer]:
                - /url: /dashboard/equity-research?symbol=AAPL
            - generic [ref=e74]:
              - article [ref=e75]:
                - generic [ref=e76]:
                  - generic [ref=e77]: AAPL
                  - generic [ref=e78]:
                    - generic [ref=e79]:
                      - heading "Apple Faces New AI Threat From Meta’s Muse - Meta Platforms (NASDAQ:META)" [level=3] [ref=e80]
                      - generic [ref=e81]: negative
                    - generic [ref=e82]:
                      - generic [ref=e83]: Benzinga
                      - generic [ref=e84]: ·
                      - generic [ref=e85]: 7h ago
                      - generic [ref=e86]:
                        - link "Research" [ref=e87] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e88]
                        - link "Read" [ref=e91] [cursor=pointer]:
                          - /url: https://www.benzinga.com/markets/tech/26/09/62067675/apple-stock-meta-muse-siri-ai-intent-layer
                          - text: Read
                          - img [ref=e92]
              - article [ref=e96]:
                - generic [ref=e97]:
                  - generic [ref=e98]: AAPL
                  - generic [ref=e99]:
                    - generic [ref=e100]:
                      - heading "John Ternus busca transformar a Apple en una empresa más ágil y competitiva" [level=3] [ref=e101]
                      - generic [ref=e102]: positive
                    - generic [ref=e103]:
                      - generic [ref=e104]: Bloomberg
                      - generic [ref=e105]: ·
                      - generic [ref=e106]: 11h ago
                      - generic [ref=e107]:
                        - link "Research" [ref=e108] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e109]
                        - link "Read" [ref=e112] [cursor=pointer]:
                          - /url: https://www.bloomberg.com/news/articles/2026-09-29/ternus-busca-transformar-apple-para-competir-en-era-de-ia-mumyl7t7
                          - text: Read
                          - img [ref=e113]
              - article [ref=e117]:
                - generic [ref=e118]:
                  - generic [ref=e119]: AAPL
                  - generic [ref=e120]:
                    - generic [ref=e121]:
                      - heading "Apple streamlines management as analysts urge faster AI innovation" [level=3] [ref=e122]
                      - generic [ref=e123]: neutral
                    - generic [ref=e124]:
                      - generic [ref=e125]: Proactive financial news
                      - generic [ref=e126]: ·
                      - generic [ref=e127]: 12h ago
                      - generic [ref=e128]:
                        - link "Research" [ref=e129] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e130]
                        - link "Read" [ref=e133] [cursor=pointer]:
                          - /url: https://www.proactiveinvestors.com/companies/news/1099322/apple-streamlines-management-as-analysts-urge-faster-ai-innovation-1099322.html
                          - text: Read
                          - img [ref=e134]
              - article [ref=e138]:
                - generic [ref=e139]:
                  - generic [ref=e140]: AAPL
                  - generic [ref=e141]:
                    - generic [ref=e142]:
                      - heading "Apple streamlines management as analysts urge faster AI innovation" [level=3] [ref=e143]
                      - generic [ref=e144]: neutral
                    - generic [ref=e145]:
                      - generic [ref=e146]: Yahoo! Finance Canada
                      - generic [ref=e147]: ·
                      - generic [ref=e148]: 12h ago
                      - generic [ref=e149]:
                        - link "Research" [ref=e150] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e151]
                        - link "Read" [ref=e154] [cursor=pointer]:
                          - /url: https://ca.finance.yahoo.com/news/apple-streamlines-management-analysts-urge-163900766.html
                          - text: Read
                          - img [ref=e155]
              - article [ref=e159]:
                - generic [ref=e160]:
                  - generic [ref=e161]: AAPL
                  - generic [ref=e162]:
                    - generic [ref=e163]:
                      - heading "How Much Do You Need to Have Netflix, Disney and the 8 Major Streaming Platforms?" [level=3] [ref=e164]
                      - generic [ref=e165]: neutral
                    - generic [ref=e166]:
                      - generic [ref=e167]: Benzinga
                      - generic [ref=e168]: ·
                      - generic [ref=e169]: 13h ago
                      - generic [ref=e170]:
                        - link "Research" [ref=e171] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e172]
                        - link "Read" [ref=e175] [cursor=pointer]:
                          - /url: https://www.benzinga.com/news/entertainment/26/09/62054937/how-much-do-you-need-to-have-netflix-disney-and-the-8-major-streaming-platforms
                          - text: Read
                          - img [ref=e176]
              - article [ref=e180]:
                - generic [ref=e181]:
                  - generic [ref=e182]: AAPL
                  - generic [ref=e183]:
                    - generic [ref=e184]:
                      - heading "Apple Could Keep Every iPhone Sale Yet Lose Discovery Referral, BofA Warns — Says Muse Concerns Are Overdone" [level=3] [ref=e185]
                      - generic [ref=e186]: positive
                    - generic [ref=e187]:
                      - generic [ref=e188]: Yahoo Finance
                      - generic [ref=e189]: ·
                      - generic [ref=e190]: 14h ago
                      - generic [ref=e191]:
                        - link "Research" [ref=e192] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e193]
                        - link "Read" [ref=e196] [cursor=pointer]:
                          - /url: https://finance.yahoo.com/markets/stocks/articles/apple-could-keep-every-iphone-142529154.html
                          - text: Read
                          - img [ref=e197]
              - article [ref=e201]:
                - generic [ref=e202]:
                  - generic [ref=e203]: AAPL
                  - generic [ref=e204]:
                    - generic [ref=e205]:
                      - 'heading "Form 4 Metalpha Technology Holding Ltd For: 29 September By Investing.com" [level=3] [ref=e206]'
                      - generic [ref=e207]: neutral
                    - generic [ref=e208]:
                      - generic [ref=e209]: Investing.com Canada
                      - generic [ref=e210]: ·
                      - generic [ref=e211]: 15h ago
                      - generic [ref=e212]:
                        - link "Research" [ref=e213] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e214]
                        - link "Read" [ref=e217] [cursor=pointer]:
                          - /url: https://ca.investing.com/news/stock-market-news/form-4-metalpha-technology-holding-ltd-for-29-september-93CH-4858236
                          - text: Read
                          - img [ref=e218]
              - article [ref=e222]:
                - generic [ref=e223]:
                  - generic [ref=e224]: AAPL
                  - generic [ref=e225]:
                    - generic [ref=e226]:
                      - heading "Equity Lifestyle Properties stock hits 52-week low at 58.68 USD" [level=3] [ref=e227]
                      - generic [ref=e228]: negative
                    - generic [ref=e229]:
                      - generic [ref=e230]: Investing.com Canada
                      - generic [ref=e231]: ·
                      - generic [ref=e232]: 15h ago
                      - generic [ref=e233]:
                        - link "Research" [ref=e234] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e235]
                        - link "Read" [ref=e238] [cursor=pointer]:
                          - /url: https://ca.investing.com/news/stock-market-news/equity-lifestyle-properties-stock-hits-52week-low-at-5868-usd-93CH-4858211
                          - text: Read
                          - img [ref=e239]
              - article [ref=e243]:
                - generic [ref=e244]:
                  - generic [ref=e245]: AAPL
                  - generic [ref=e246]:
                    - generic [ref=e247]:
                      - 'heading "KLA Corp Stock (KLAC) Opened Up by 3.73% on Sep 29: Drivers Behind the Movement" [level=3] [ref=e248]'
                      - generic [ref=e249]: negative
                    - generic [ref=e250]:
                      - generic [ref=e251]: TradingKey
                      - generic [ref=e252]: ·
                      - generic [ref=e253]: 15h ago
                      - generic [ref=e254]:
                        - link "Research" [ref=e255] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e256]
                        - link "Read" [ref=e259] [cursor=pointer]:
                          - /url: https://www.tradingkey.com/news/market-movers/262192157-market-movers-klac-20260929
                          - text: Read
                          - img [ref=e260]
              - article [ref=e264]:
                - generic [ref=e265]:
                  - generic [ref=e266]: AAPL
                  - generic [ref=e267]:
                    - generic [ref=e268]:
                      - heading "Motorola Solutions, Inc. (MSI) stock price, news, quote and history - Yahoo Finance" [level=3] [ref=e269]
                      - generic [ref=e270]: neutral
                    - generic [ref=e271]:
                      - generic [ref=e272]: Yahoo Finance Singapore
                      - generic [ref=e273]: ·
                      - generic [ref=e274]: 15h ago
                      - generic [ref=e275]:
                        - link "Research" [ref=e276] [cursor=pointer]:
                          - /url: /dashboard/equity-research?symbol=AAPL
                          - text: Research
                          - img [ref=e277]
                        - link "Read" [ref=e280] [cursor=pointer]:
                          - /url: https://sg.finance.yahoo.com/quote/MSI/latest-news/
                          - text: Read
                          - img [ref=e281]
            - generic [ref=e285]:
              - paragraph [ref=e286]:
                - text: Showing
                - generic [ref=e287]: 1–10
                - text: of 50
              - navigation "Pagination" [ref=e288]:
                - button "First page" [disabled]:
                  - img
                - button "Previous page" [disabled]:
                  - img
                - button "Page 1" [ref=e289] [cursor=pointer]: "1"
                - button "Page 2" [ref=e290] [cursor=pointer]: "2"
                - generic [ref=e291]: …
                - button "Page 4" [ref=e292] [cursor=pointer]: "4"
                - button "Page 5" [ref=e293] [cursor=pointer]: "5"
                - button "Next page" [ref=e294] [cursor=pointer]:
                  - img
                - button "Last page" [ref=e295] [cursor=pointer]:
                  - img
    - contentinfo [ref=e296]:
      - generic [ref=e297]:
        - generic [ref=e298]:
          - paragraph [ref=e299]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e300]:
            - link "Privacy Policy" [ref=e302] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e303]:
              - generic [ref=e304]: ·
              - link "Terms of Service" [ref=e305] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e306]:
              - generic [ref=e307]: ·
              - link "Disclosures" [ref=e308] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e309]:
              - generic [ref=e310]: ·
              - link "Risk Warning" [ref=e311] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e312]:
              - generic [ref=e313]: ·
              - link "Contact" [ref=e314] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e315]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e316]: News | OolTool
```

# Test source

```ts
  96  |             name: /^portfolio$/i
  97  |           }
  98  |         ).first(),
  99  |         'Portfolio menu'
  100 |       );
  101 | 
  102 |       await safeClick(
  103 |         page.getByRole(
  104 |           'menuitem',
  105 |           {
  106 |             name
  107 |           }
  108 |         ),
  109 |         label
  110 |       );
  111 |     }
  112 | 
  113 |     async function searchSymbol(
  114 |       page: Page,
  115 |       symbol: string
  116 |     ) {
  117 |       const input =
  118 |         page.locator(
  119 |           'main'
  120 |         ).getByRole(
  121 |           'combobox'
  122 |         ).or(
  123 |           page.getByPlaceholder(
  124 |             /symbol/i
  125 |           )
  126 |         ).first();
  127 | 
  128 |       await input.fill(
  129 |         symbol
  130 |       );
  131 | 
  132 |       const choice =
  133 |         page.getByRole(
  134 |           'option',
  135 |           {
  136 |             name: new RegExp(
  137 |               symbol,
  138 |               'i'
  139 |             )
  140 |           }
  141 |         ).first();
  142 | 
  143 |       if (
  144 |         await choice.waitFor({
  145 |           state: 'visible',
  146 |           timeout: 5000
  147 |         }).then(
  148 |           () => true
  149 |         ).catch(
  150 |           () => false
  151 |         )
  152 |       ) {
  153 |         await safeClick(
  154 |           choice,
  155 |           `Select ${symbol}`
  156 |         );
  157 |       }
  158 | 
  159 |       const search =
  160 |         page.getByRole(
  161 |           'button',
  162 |           {
  163 |             name: /^search$/i
  164 |           }
  165 |         );
  166 | 
  167 |       const searchReady =
  168 |         await expect(
  169 |           search
  170 |         ).toBeEnabled({
  171 |           timeout: 12000
  172 |         }).then(
  173 |           () => true
  174 |         ).catch(
  175 |           () => false
  176 |         );
  177 | 
  178 |       if (
  179 |         searchReady
  180 |       ) {
  181 |         await safeClick(
  182 |           search,
  183 |           `Search ${symbol}`
  184 |         );
  185 |       }
  186 | 
  187 |       await expect(
  188 |         page.getByRole(
  189 |           'heading',
  190 |           {
  191 |             name: new RegExp(
  192 |               `^${symbol}$`
  193 |             )
  194 |           }
  195 |         )
> 196 |       ).toBeVisible({
      |         ^ Error: expect(locator).toBeVisible() failed
  197 |         timeout: 30000
  198 |       });
  199 |     }
  200 | 
  201 |     function rangeButton(
  202 |       page: Page,
  203 |       name: string
  204 |     ) {
  205 |       return page.locator(
  206 |         'main'
  207 |       ).getByRole(
  208 |         'button',
  209 |         {
  210 |           name: new RegExp(
  211 |             `^${name}$`
  212 |           )
  213 |         }
  214 |       );
  215 |     }
  216 | 
  217 |     async function expectChosen(
  218 |       button: Locator
  219 |     ) {
  220 |       await expect(
  221 |         button
  222 |       ).toHaveClass(
  223 |         /bg-primary/
  224 |       );
  225 |     }
  226 | 
  227 |     test(
  228 |       'Company Finance switches statements and period, then resets',
  229 |       async ({ page }) => {
  230 |         await openDashboard(
  231 |           page
  232 |         );
  233 | 
  234 |         await openResearchItem(
  235 |           page,
  236 |           /company finance/i,
  237 |           'Company Finance'
  238 |         );
  239 | 
  240 |         await searchSymbol(
  241 |           page,
  242 |           'AAPL'
  243 |         );
  244 | 
  245 |         await expect(
  246 |           page.getByRole(
  247 |             'tab',
  248 |             {
  249 |               name: /^income statement$/i
  250 |             }
  251 |           )
  252 |         ).toBeVisible({
  253 |           timeout: 20000
  254 |         });
  255 | 
  256 |         await expect(
  257 |           page.locator(
  258 |             'main'
  259 |           )
  260 |         ).toContainText(
  261 |           /total revenue/i
  262 |         );
  263 | 
  264 |         await safeClick(
  265 |           rangeButton(
  266 |             page,
  267 |             'Quarterly'
  268 |           ),
  269 |           'Quarterly'
  270 |         );
  271 | 
  272 |         await expectChosen(
  273 |           rangeButton(
  274 |             page,
  275 |             'Quarterly'
  276 |           )
  277 |         );
  278 | 
  279 |         await safeClick(
  280 |           rangeButton(
  281 |             page,
  282 |             'Annual'
  283 |           ),
  284 |           'Annual'
  285 |         );
  286 | 
  287 |         await expectChosen(
  288 |           rangeButton(
  289 |             page,
  290 |             'Annual'
  291 |           )
  292 |         );
  293 | 
  294 |         for (const statement of [
  295 |           {
  296 |             name: /^balance sheet$/i,
```