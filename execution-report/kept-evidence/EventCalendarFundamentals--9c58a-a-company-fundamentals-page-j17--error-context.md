# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: EventCalendarFundamentals.spec.ts >> Event Calendar and Company Fundamentals >> View more opens event filters and a company fundamentals page
- Location: tests\EventCalendarFundamentals.spec.ts:45:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /company fundamentals|equity research/i }).first()
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for getByRole('heading', { name: /company fundamentals|equity research/i }).first()

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
          - heading "Event Calendar" [level=1] [ref=e42]
          - paragraph [ref=e43]: See upcoming equity earnings and dividend dates in a month view so you can plan overlays around the catalysts that matter most.
        - generic [ref=e45]:
          - generic [ref=e46]:
            - generic [ref=e47]:
              - generic [ref=e48]:
                - button "Previous month" [ref=e49] [cursor=pointer]:
                  - img
                - heading "September 2026" [level=2] [ref=e50]
                - button "Next month" [ref=e51] [cursor=pointer]:
                  - img
                - generic [ref=e52]:
                  - button "Month" [ref=e53]:
                    - img [ref=e54]
                    - text: Month
                  - button "Agenda" [ref=e56]:
                    - img [ref=e57]
                    - text: Agenda
              - generic [ref=e58]:
                - button "All" [ref=e59]
                - button "Earnings" [ref=e60]
                - button "Dividend" [ref=e61]
            - generic [ref=e62]:
              - generic [ref=e63]: Su
              - generic [ref=e64]: Mo
              - generic [ref=e65]: Tu
              - generic [ref=e66]: We
              - generic [ref=e67]: Th
              - generic [ref=e68]: Fr
              - generic [ref=e69]: Sa
            - generic [ref=e70]:
              - button "1" [ref=e73] [cursor=pointer]:
                - generic [ref=e74]: "1"
              - button "2" [ref=e75] [cursor=pointer]:
                - generic [ref=e76]: "2"
              - button "3" [ref=e77] [cursor=pointer]:
                - generic [ref=e78]: "3"
              - button "4" [ref=e79] [cursor=pointer]:
                - generic [ref=e80]: "4"
              - button "5" [ref=e81] [cursor=pointer]:
                - generic [ref=e82]: "5"
              - button "6" [ref=e83] [cursor=pointer]:
                - generic [ref=e84]: "6"
              - button "7" [ref=e85] [cursor=pointer]:
                - generic [ref=e86]: "7"
              - button "8" [ref=e87] [cursor=pointer]:
                - generic [ref=e88]: "8"
              - button "9" [ref=e89] [cursor=pointer]:
                - generic [ref=e90]: "9"
              - button "10" [ref=e91] [cursor=pointer]:
                - generic [ref=e92]: "10"
              - button "11" [ref=e93] [cursor=pointer]:
                - generic [ref=e94]: "11"
              - button "12" [ref=e95] [cursor=pointer]:
                - generic [ref=e96]: "12"
              - button "13" [ref=e97] [cursor=pointer]:
                - generic [ref=e98]: "13"
              - button "14" [ref=e99] [cursor=pointer]:
                - generic [ref=e100]: "14"
              - button "15" [ref=e101] [cursor=pointer]:
                - generic [ref=e102]: "15"
              - button "16" [ref=e103] [cursor=pointer]:
                - generic [ref=e104]: "16"
              - button "17" [ref=e105] [cursor=pointer]:
                - generic [ref=e106]: "17"
              - button "18" [ref=e107] [cursor=pointer]:
                - generic [ref=e108]: "18"
              - button "19" [ref=e109] [cursor=pointer]:
                - generic [ref=e110]: "19"
              - button "20" [ref=e111] [cursor=pointer]:
                - generic [ref=e112]: "20"
              - button "21" [ref=e113] [cursor=pointer]:
                - generic [ref=e114]: "21"
              - button "22" [ref=e115] [cursor=pointer]:
                - generic [ref=e116]: "22"
              - button "23" [ref=e117] [cursor=pointer]:
                - generic [ref=e118]: "23"
              - button "24" [ref=e119] [cursor=pointer]:
                - generic [ref=e120]: "24"
              - button "25" [ref=e121] [cursor=pointer]:
                - generic [ref=e122]: "25"
              - button "26" [ref=e123] [cursor=pointer]:
                - generic [ref=e124]: "26"
              - button "27" [ref=e125] [cursor=pointer]:
                - generic [ref=e126]: "27"
              - button "28" [ref=e127] [cursor=pointer]:
                - generic [ref=e128]: "28"
              - button "29" [ref=e129] [cursor=pointer]:
                - generic [ref=e130]: "29"
              - button "30 AMT ARE +26 more" [ref=e131] [cursor=pointer]:
                - generic [ref=e132]: "30"
                - generic [ref=e133]:
                  - button "AMT" [ref=e134]:
                    - img [ref=e135]
                    - generic [ref=e140]: AMT
                  - button "ARE" [ref=e141]:
                    - img [ref=e142]
                    - generic [ref=e147]: ARE
                  - button "+26 more" [ref=e148]
            - generic [ref=e149]:
              - generic [ref=e150]:
                - img [ref=e152]
                - text: Earnings
              - generic [ref=e154]:
                - img [ref=e156]
                - text: Dividend
              - generic [ref=e161]: Click a day or event for details
          - generic [ref=e162]:
            - heading "Events this month" [level=3] [ref=e163]
            - list [ref=e164]:
              - listitem [ref=e165]:
                - button "2026-09-30 Dividend AMT American Tower Corp - ex-dividend (6.98)" [ref=e166]:
                  - generic [ref=e167]:
                    - generic [ref=e168]: 2026-09-30
                    - generic [ref=e169]:
                      - img [ref=e170]
                      - text: Dividend
                    - generic [ref=e175]: AMT
                  - paragraph [ref=e176]: American Tower Corp - ex-dividend (6.98)
              - listitem [ref=e177]:
                - button "2026-09-30 Dividend ARE Alexandria Real Estate Equities Inc - ex-dividend (3.48)" [ref=e178]:
                  - generic [ref=e179]:
                    - generic [ref=e180]: 2026-09-30
                    - generic [ref=e181]:
                      - img [ref=e182]
                      - text: Dividend
                    - generic [ref=e187]: ARE
                  - paragraph [ref=e188]: Alexandria Real Estate Equities Inc - ex-dividend (3.48)
              - listitem [ref=e189]:
                - button "2026-09-30 Dividend BEN Franklin Resources Inc - ex-dividend (1.31)" [ref=e190]:
                  - generic [ref=e191]:
                    - generic [ref=e192]: 2026-09-30
                    - generic [ref=e193]:
                      - img [ref=e194]
                      - text: Dividend
                    - generic [ref=e199]: BEN
                  - paragraph [ref=e200]: Franklin Resources Inc - ex-dividend (1.31)
              - listitem [ref=e201]:
                - button "2026-09-30 Dividend BXP BXP, Inc. - ex-dividend (2.8)" [ref=e202]:
                  - generic [ref=e203]:
                    - generic [ref=e204]: 2026-09-30
                    - generic [ref=e205]:
                      - img [ref=e206]
                      - text: Dividend
                    - generic [ref=e211]: BXP
                  - paragraph [ref=e212]: BXP, Inc. - ex-dividend (2.8)
              - listitem [ref=e213]:
                - button "2026-09-30 Earnings CAG Conagra Brands, Inc. - quarterly earnings (est. EPS 0.31)" [ref=e214]:
                  - generic [ref=e215]:
                    - generic [ref=e216]: 2026-09-30
                    - generic [ref=e217]:
                      - img [ref=e218]
                      - text: Earnings
                    - generic [ref=e220]: CAG
                  - paragraph [ref=e221]: Conagra Brands, Inc. - quarterly earnings (est. EPS 0.31)
              - listitem [ref=e222]:
                - button "2026-09-30 Dividend CPT Camden Property Trust - ex-dividend (4.22)" [ref=e223]:
                  - generic [ref=e224]:
                    - generic [ref=e225]: 2026-09-30
                    - generic [ref=e226]:
                      - img [ref=e227]
                      - text: Dividend
                    - generic [ref=e232]: CPT
                  - paragraph [ref=e233]: Camden Property Trust - ex-dividend (4.22)
              - listitem [ref=e234]:
                - button "2026-09-30 Dividend DE Deere & Company - ex-dividend (6.48)" [ref=e235]:
                  - generic [ref=e236]:
                    - generic [ref=e237]: 2026-09-30
                    - generic [ref=e238]:
                      - img [ref=e239]
                      - text: Dividend
                    - generic [ref=e244]: DE
                  - paragraph [ref=e245]: Deere & Company - ex-dividend (6.48)
              - listitem [ref=e246]:
                - button "2026-09-30 Dividend DHR Danaher Corporation - ex-dividend (1.44)" [ref=e247]:
                  - generic [ref=e248]:
                    - generic [ref=e249]: 2026-09-30
                    - generic [ref=e250]:
                      - img [ref=e251]
                      - text: Dividend
                    - generic [ref=e256]: DHR
                  - paragraph [ref=e257]: Danaher Corporation - ex-dividend (1.44)
              - listitem [ref=e258]:
                - button "2026-09-30 Dividend ESS Essex Property Trust Inc - ex-dividend (10.32)" [ref=e259]:
                  - generic [ref=e260]:
                    - generic [ref=e261]: 2026-09-30
                    - generic [ref=e262]:
                      - img [ref=e263]
                      - text: Dividend
                    - generic [ref=e268]: ESS
                  - paragraph [ref=e269]: Essex Property Trust Inc - ex-dividend (10.32)
              - listitem [ref=e270]:
                - button "2026-09-30 Earnings FDS FactSet Research Systems Inc - quarterly earnings (est. EPS 4.32)" [ref=e271]:
                  - generic [ref=e272]:
                    - generic [ref=e273]: 2026-09-30
                    - generic [ref=e274]:
                      - img [ref=e275]
                      - text: Earnings
                    - generic [ref=e277]: FDS
                  - paragraph [ref=e278]: FactSet Research Systems Inc - quarterly earnings (est. EPS 4.32)
              - listitem [ref=e279]:
                - button "2026-09-30 Dividend FITB Fifth Third Bancorp - ex-dividend (1.6)" [ref=e280]:
                  - generic [ref=e281]:
                    - generic [ref=e282]: 2026-09-30
                    - generic [ref=e283]:
                      - img [ref=e284]
                      - text: Dividend
                    - generic [ref=e289]: FITB
                  - paragraph [ref=e290]: Fifth Third Bancorp - ex-dividend (1.6)
              - listitem [ref=e291]:
                - button "2026-09-30 Dividend HST Host Hotels & Resorts Inc - ex-dividend (0.8)" [ref=e292]:
                  - generic [ref=e293]:
                    - generic [ref=e294]: 2026-09-30
                    - generic [ref=e295]:
                      - img [ref=e296]
                      - text: Dividend
                    - generic [ref=e301]: HST
                  - paragraph [ref=e302]: Host Hotels & Resorts Inc - ex-dividend (0.8)
              - listitem [ref=e303]:
                - button "2026-09-30 Dividend ITW Illinois Tool Works Inc - ex-dividend (6.44)" [ref=e304]:
                  - generic [ref=e305]:
                    - generic [ref=e306]: 2026-09-30
                    - generic [ref=e307]:
                      - img [ref=e308]
                      - text: Dividend
                    - generic [ref=e313]: ITW
                  - paragraph [ref=e314]: Illinois Tool Works Inc - ex-dividend (6.44)
              - listitem [ref=e315]:
                - button "2026-09-30 Earnings JBL Jabil Circuit Inc - quarterly earnings (est. EPS 3.86)" [ref=e316]:
                  - generic [ref=e317]:
                    - generic [ref=e318]: 2026-09-30
                    - generic [ref=e319]:
                      - img [ref=e320]
                      - text: Earnings
                    - generic [ref=e322]: JBL
                  - paragraph [ref=e323]: Jabil Circuit Inc - quarterly earnings (est. EPS 3.86)
              - listitem [ref=e324]:
                - button "2026-09-30 Dividend LII Lennox International Inc - ex-dividend (5.26)" [ref=e325]:
                  - generic [ref=e326]:
                    - generic [ref=e327]: 2026-09-30
                    - generic [ref=e328]:
                      - img [ref=e329]
                      - text: Dividend
                    - generic [ref=e334]: LII
                  - paragraph [ref=e335]: Lennox International Inc - ex-dividend (5.26)
            - generic [ref=e336]:
              - paragraph [ref=e337]:
                - text: Showing
                - generic [ref=e338]: 1–15
                - text: of 28
              - navigation "Pagination" [ref=e339]:
                - button "First page" [disabled]:
                  - img
                - button "Previous page" [disabled]:
                  - img
                - button "Page 1" [ref=e340] [cursor=pointer]: "1"
                - button "Page 2" [ref=e341] [cursor=pointer]: "2"
                - button "Next page" [ref=e342] [cursor=pointer]:
                  - img
                - button "Last page" [ref=e343] [cursor=pointer]:
                  - img
    - contentinfo [ref=e344]:
      - generic [ref=e345]:
        - generic [ref=e346]:
          - paragraph [ref=e347]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e348]:
            - link "Privacy Policy" [ref=e350] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e351]:
              - generic [ref=e352]: ·
              - link "Terms of Service" [ref=e353] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e354]:
              - generic [ref=e355]: ·
              - link "Disclosures" [ref=e356] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e357]:
              - generic [ref=e358]: ·
              - link "Risk Warning" [ref=e359] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e360]:
              - generic [ref=e361]: ·
              - link "Contact" [ref=e362] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e363]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e364]: Event Calendar | OolTool
  - generic [ref=e365]: "0"
```

# Test source

```ts
  61  |         equityResearch
  62  |       )
  63  |     ).toBeVisible({
  64  |       timeout: 20000
  65  |     });
  66  | 
  67  |     if (
  68  |       await equityResearch.isVisible().catch(
  69  |         () => false
  70  |       )
  71  |     ) {
  72  |       const input =
  73  |         this.page.getByRole(
  74  |           'combobox',
  75  |           {
  76  |             name: /search company name or symbol|search symbol/i
  77  |           }
  78  |         );
  79  | 
  80  |       await input.fill(
  81  |         symbol
  82  |       );
  83  | 
  84  |       const choice =
  85  |         this.page.getByRole(
  86  |           'option',
  87  |           {
  88  |             name: new RegExp(
  89  |               symbol,
  90  |               'i'
  91  |             )
  92  |           }
  93  |         ).first();
  94  | 
  95  |       const choiceReady =
  96  |         await choice.waitFor({
  97  |           state: 'visible',
  98  |           timeout: 4000
  99  |         }).then(
  100 |           () => true
  101 |         ).catch(
  102 |           () => false
  103 |         );
  104 | 
  105 |       if (
  106 |         choiceReady
  107 |       ) {
  108 |         await safeClick(
  109 |           choice,
  110 |           `Select ${symbol}`
  111 |         );
  112 |       }
  113 | 
  114 |       await safeClick(
  115 |         this.page.getByRole(
  116 |           'button',
  117 |           {
  118 |             name: /^analyze$/i
  119 |           }
  120 |         ),
  121 |         `Analyze ${symbol}`
  122 |       );
  123 | 
  124 |       const fundamentalsLink =
  125 |         this.page.getByRole(
  126 |           'link',
  127 |           {
  128 |             name: /company fundamentals/i
  129 |           }
  130 |         );
  131 | 
  132 |       if (
  133 |         await fundamentalsLink.isVisible({
  134 |           timeout: 15000
  135 |         }).catch(
  136 |           () => false
  137 |         )
  138 |       ) {
  139 |         await safeClick(
  140 |           fundamentalsLink,
  141 |           'Open company fundamentals'
  142 |         );
  143 |       }
  144 |     }
  145 |   }
  146 | 
  147 |   async validateLoaded(
  148 |     symbol: string
  149 |   ) {
  150 |     Logger.info(
  151 |       `Validating fundamentals for ${symbol}`
  152 |     );
  153 | 
  154 |     await expect(
  155 |       this.page.getByRole(
  156 |         'heading',
  157 |         {
  158 |           name: /company fundamentals|equity research/i
  159 |         }
  160 |       ).first()
> 161 |     ).toBeVisible({
      |       ^ Error: expect(locator).toBeVisible() failed
  162 |       timeout: 20000
  163 |     });
  164 | 
  165 |     await expect(
  166 |       this.page.getByText(
  167 |         new RegExp(
  168 |           `\\b${symbol}\\b`
  169 |         )
  170 |       ).first()
  171 |     ).toBeVisible({
  172 |       timeout: 15000
  173 |     });
  174 | 
  175 |     await expect(
  176 |       this.page.getByText(
  177 |         /\$\d[\d,]*(?:\.\d+)?/
  178 |       ).first()
  179 |     ).toBeVisible();
  180 | 
  181 |     Logger.success(
  182 |       `Fundamentals are open for ${symbol}`
  183 |     );
  184 |   }
  185 | 
  186 |   async searchSymbol(
  187 |     symbol: string
  188 |   ) {
  189 |     Logger.info(
  190 |       `Searching symbol ${symbol}`
  191 |     );
  192 | 
  193 |     const input =
  194 |       this.page.getByPlaceholder(
  195 |         /search symbol/i
  196 |       ).or(
  197 |         this.page.getByRole(
  198 |           'textbox',
  199 |           {
  200 |             name: /search symbol/i
  201 |           }
  202 |         )
  203 |       ).first();
  204 | 
  205 |     await input.fill(
  206 |       symbol
  207 |     );
  208 | 
  209 |     await safeClick(
  210 |       this.page.getByRole(
  211 |         'button',
  212 |         {
  213 |           name: /^search$/i
  214 |         }
  215 |       ),
  216 |       `Search ${symbol}`
  217 |     );
  218 | 
  219 |     await this.validateLoaded(
  220 |       symbol
  221 |     );
  222 | 
  223 |     Logger.success(
  224 |       `Search loaded ${symbol}`
  225 |     );
  226 |   }
  227 | 
  228 |   async openDetailTab(
  229 |     name:
  230 |       | 'Overview'
  231 |       | 'Valuation'
  232 |       | 'Earnings'
  233 |       | 'Dividends'
  234 |       | 'News'
  235 |   ) {
  236 |     Logger.info(
  237 |       `Opening ${name}`
  238 |     );
  239 | 
  240 |     const pattern =
  241 |       new RegExp(
  242 |         `^${name}$`,
  243 |         'i'
  244 |       );
  245 | 
  246 |     const tab =
  247 |       this.page.getByRole(
  248 |         'tab',
  249 |         {
  250 |           name: pattern
  251 |         }
  252 |       ).or(
  253 |         this.page.getByRole(
  254 |           'button',
  255 |           {
  256 |             name: pattern
  257 |           }
  258 |         )
  259 |       ).first();
  260 | 
  261 |     await safeClick(
```