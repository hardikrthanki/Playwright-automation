# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AcademyDepth.spec.ts >> Academy depth >> Academy tabs lesson completion progress strategy filters and glossary
- Location: tests\AcademyDepth.spec.ts:104:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /marked complete/i })
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for getByRole('button', { name: /marked complete/i })

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - heading "Academy" [level=1] [ref=e44]
          - paragraph [ref=e45]: A self-paced library of options-strategy references, lessons, and definitions.
          - paragraph [ref=e46]: Educational content only - this app does not place trades or provide investment advice.
        - navigation [ref=e48]:
          - link "Beginners" [ref=e49] [cursor=pointer]:
            - /url: /academy/beginners
            - img [ref=e50]
            - text: Beginners
          - link "Overview" [ref=e53] [cursor=pointer]:
            - /url: /academy
            - img [ref=e54]
            - text: Overview
          - link "Lessons" [ref=e57] [cursor=pointer]:
            - /url: /academy/lessons
            - img [ref=e58]
            - text: Lessons
          - link "Strategy Library" [ref=e60] [cursor=pointer]:
            - /url: /academy/strategies
            - img [ref=e61]
            - text: Strategy Library
          - link "Glossary" [ref=e63] [cursor=pointer]:
            - /url: /academy/glossary
            - img [ref=e64]
            - text: Glossary
        - generic [ref=e67]:
          - article [ref=e68]:
            - generic [ref=e69]:
              - link "Back to Lessons" [ref=e70] [cursor=pointer]:
                - /url: /academy/lessons
                - img
                - text: Back to Lessons
              - generic [ref=e71]: beginner
              - generic [ref=e72]:
                - img [ref=e73]
                - text: 6 min read
            - generic [ref=e77]:
              - generic [ref=e78]:
                - heading "The Basic Structure" [level=2] [ref=e79]
                - paragraph [ref=e80]: A covered call is a position in which an investor who already owns at least 100 shares of a stock sells (writes) one call option contract against those shares. The shares act as collateral, hence the term 'covered.' The seller collects a premium up front in exchange for agreeing to deliver those shares at the strike price if the buyer exercises the option.
              - generic [ref=e81]:
                - heading "What the Premium Represents" [level=2] [ref=e82]
                - paragraph [ref=e83]: The premium is the cash paid by the option buyer to the seller at the time the contract is opened. It is credited immediately to the seller's account and is kept regardless of whether the option is exercised. The premium reflects the market's view of volatility, time to expiration, and how far the strike is from the current share price.
                - generic [ref=e84]:
                  - img [ref=e85]
                  - paragraph [ref=e87]: Premiums vary continuously with market conditions. Quotes shown in this app are illustrative snapshots and may not reflect executable prices.
              - generic [ref=e88]:
                - heading "Possible Outcomes at Expiration" [level=2] [ref=e89]
                - paragraph [ref=e90]: If the share price stays at or below the strike at expiration, the option typically expires worthless and the seller keeps both the shares and the premium. If the share price is above the strike, the shares may be called away (sold) at the strike price, and the seller keeps the premium plus any gain up to the strike.
              - generic [ref=e91]:
                - heading "What This App Does" [level=2] [ref=e92]
                - paragraph [ref=e93]: OolTool reads your positions in read-only mode and constructs conditional, illustrative scenarios so you can study a range of outcomes side by side. It does not place trades, single out specific contracts, or evaluate suitability.
                - generic [ref=e94]:
                  - img [ref=e95]
                  - paragraph [ref=e97]: Educational content only. Not investment advice, a solicitation, or an offer to buy or sell any security.
            - generic [ref=e99]:
              - heading "Key Takeaways" [level=3] [ref=e100]:
                - img [ref=e101]
                - text: Key Takeaways
              - list [ref=e104]:
                - listitem [ref=e105]:
                  - generic [ref=e106]: •
                  - generic [ref=e107]: A covered call requires owning at least 100 shares per contract written.
                - listitem [ref=e108]:
                  - generic [ref=e109]: •
                  - generic [ref=e110]: The premium is collected up front and kept regardless of outcome.
                - listitem [ref=e111]:
                  - generic [ref=e112]: •
                  - generic [ref=e113]: Upside above the strike price is capped for the duration of the contract.
            - generic [ref=e114]:
              - button "Mark as complete" [active] [ref=e115] [cursor=pointer]
              - 'link "Next: Reading an Options Chain" [ref=e117] [cursor=pointer]':
                - /url: /academy/lessons/reading-an-options-chain
                - text: "Next: Reading an Options Chain"
                - img
          - complementary [ref=e118]:
            - generic [ref=e120]:
              - heading "Related Terms" [level=3] [ref=e121]
              - list [ref=e122]:
                - listitem [ref=e123]:
                  - link "Premium" [ref=e124] [cursor=pointer]:
                    - /url: /academy/glossary#premium
                    - text: Premium
                    - img [ref=e125]
                - listitem [ref=e127]:
                  - link "Strike Price" [ref=e128] [cursor=pointer]:
                    - /url: /academy/glossary#strike-price
                    - text: Strike Price
                    - img [ref=e129]
                - listitem [ref=e131]:
                  - link "Expiration" [ref=e132] [cursor=pointer]:
                    - /url: /academy/glossary#expiration
                    - text: Expiration
                    - img [ref=e133]
                - listitem [ref=e135]:
                  - link "Assignment" [ref=e136] [cursor=pointer]:
                    - /url: /academy/glossary#assignment
                    - text: Assignment
                    - img [ref=e137]
            - generic [ref=e140]:
              - heading "All Lessons" [level=3] [ref=e141]
              - list [ref=e142]:
                - listitem [ref=e143]:
                  - link "1.What is a Covered Call?" [ref=e144] [cursor=pointer]:
                    - /url: /academy/lessons/what-is-a-covered-call
                    - generic [ref=e145]: "1."
                    - text: What is a Covered Call?
                - listitem [ref=e146]:
                  - link "2.Reading an Options Chain" [ref=e147] [cursor=pointer]:
                    - /url: /academy/lessons/reading-an-options-chain
                    - generic [ref=e148]: "2."
                    - text: Reading an Options Chain
                - listitem [ref=e149]:
                  - link "3.Moneyness & the Option Chain" [ref=e150] [cursor=pointer]:
                    - /url: /academy/lessons/moneyness-and-the-option-chain
                    - generic [ref=e151]: "3."
                    - text: Moneyness & the Option Chain
                - listitem [ref=e152]:
                  - link "4.Intrinsic vs. Extrinsic Value" [ref=e153] [cursor=pointer]:
                    - /url: /academy/lessons/intrinsic-vs-extrinsic-value
                    - generic [ref=e154]: "4."
                    - text: Intrinsic vs. Extrinsic Value
                - listitem [ref=e155]:
                  - link "5.Strike Selection Basics" [ref=e156] [cursor=pointer]:
                    - /url: /academy/lessons/strike-selection-basics
                    - generic [ref=e157]: "5."
                    - text: Strike Selection Basics
                - listitem [ref=e158]:
                  - link "6.Managing Assignment Risk" [ref=e159] [cursor=pointer]:
                    - /url: /academy/lessons/managing-assignment-risk
                    - generic [ref=e160]: "6."
                    - text: Managing Assignment Risk
                - listitem [ref=e161]:
                  - link "7.Implied Volatility & IV Crush" [ref=e162] [cursor=pointer]:
                    - /url: /academy/lessons/implied-volatility-and-iv-crush
                    - generic [ref=e163]: "7."
                    - text: Implied Volatility & IV Crush
                - listitem [ref=e164]:
                  - link "8.Theta & Time Decay" [ref=e165] [cursor=pointer]:
                    - /url: /academy/lessons/theta-and-time-decay
                    - generic [ref=e166]: "8."
                    - text: Theta & Time Decay
                - listitem [ref=e167]:
                  - link "9.Delta Explained" [ref=e168] [cursor=pointer]:
                    - /url: /academy/lessons/delta-explained
                    - generic [ref=e169]: "9."
                    - text: Delta Explained
                - listitem [ref=e170]:
                  - link "10.Gamma Explained" [ref=e171] [cursor=pointer]:
                    - /url: /academy/lessons/gamma-explained
                    - generic [ref=e172]: "10."
                    - text: Gamma Explained
                - listitem [ref=e173]:
                  - link "11.Putting the Greeks Together" [ref=e174] [cursor=pointer]:
                    - /url: /academy/lessons/putting-the-greeks-together
                    - generic [ref=e175]: "11."
                    - text: Putting the Greeks Together
                - listitem [ref=e176]:
                  - link "12.Vega Explained" [ref=e177] [cursor=pointer]:
                    - /url: /academy/lessons/vega-explained
                    - generic [ref=e178]: "12."
                    - text: Vega Explained
                - listitem [ref=e179]:
                  - link "13.Interpreting Payoff Diagrams" [ref=e180] [cursor=pointer]:
                    - /url: /academy/lessons/interpreting-payoff-diagrams
                    - generic [ref=e181]: "13."
                    - text: Interpreting Payoff Diagrams
        - generic [ref=e182]:
          - img [ref=e183]
          - paragraph [ref=e185]: All Academy content is educational and informational only. Nothing here is investment advice, a solicitation, or an offer to buy or sell any security. You are solely responsible for any decisions you make at your broker.
    - contentinfo [ref=e186]:
      - generic [ref=e187]:
        - generic [ref=e188]:
          - paragraph [ref=e189]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e190]:
            - link "Privacy Policy" [ref=e192] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e193]:
              - generic [ref=e194]: ·
              - link "Terms of Service" [ref=e195] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e196]:
              - generic [ref=e197]: ·
              - link "Disclosures" [ref=e198] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e199]:
              - generic [ref=e200]: ·
              - link "Risk Warning" [ref=e201] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e202]:
              - generic [ref=e203]: ·
              - link "Contact" [ref=e204] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e205]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e206]
```

# Test source

```ts
  185 |             page.locator(
  186 |               'main'
  187 |             ).getByRole(
  188 |               'button',
  189 |               {
  190 |                 name: level
  191 |               }
  192 |             );
  193 | 
  194 |           if (
  195 |             await filter.waitFor({
  196 |               state: 'visible',
  197 |               timeout: 1500
  198 |             }).then(
  199 |               () => true
  200 |             ).catch(
  201 |               () => false
  202 |             )
  203 |           ) {
  204 |             await safeClick(
  205 |               filter,
  206 |               'Lesson level'
  207 |             );
  208 | 
  209 |             await expect(
  210 |               page.locator(
  211 |                 'main'
  212 |               )
  213 |             ).toContainText(
  214 |               /lesson|covered call|no lessons/i
  215 |             );
  216 |           }
  217 |         }
  218 | 
  219 |         await safeClick(
  220 |           page.getByRole(
  221 |             'link',
  222 |             {
  223 |               name: /what is a covered call/i
  224 |             }
  225 |           ).first(),
  226 |           'Open lesson'
  227 |         );
  228 | 
  229 |         await expect(
  230 |           page
  231 |         ).toHaveURL(
  232 |           /\/academy\/lessons\/what-is-a-covered-call/
  233 |         );
  234 | 
  235 |         await expect(
  236 |           page.locator(
  237 |             'main'
  238 |           )
  239 |         ).toContainText(
  240 |           /covered call requires owning at least 100 shares/i
  241 |         );
  242 | 
  243 |         const mark =
  244 |           page.getByRole(
  245 |             'button',
  246 |             {
  247 |               name: /mark as complete/i
  248 |             }
  249 |           );
  250 | 
  251 |         const alreadyDone =
  252 |           page.getByRole(
  253 |             'button',
  254 |             {
  255 |               name: /marked complete|completed|undo/i
  256 |             }
  257 |           );
  258 | 
  259 |         let markedNow = false;
  260 | 
  261 |         if (
  262 |           await mark.waitFor({
  263 |             state: 'visible',
  264 |             timeout: 5000
  265 |           }).then(
  266 |             () => true
  267 |           ).catch(
  268 |             () => false
  269 |           )
  270 |         ) {
  271 |           await safeClick(
  272 |             mark,
  273 |             'Mark as complete'
  274 |           );
  275 | 
  276 |           markedNow = true;
  277 | 
  278 |           await expect(
  279 |             page.getByRole(
  280 |               'button',
  281 |               {
  282 |                 name: /marked complete/i
  283 |               }
  284 |             )
> 285 |           ).toBeVisible({
      |             ^ Error: expect(locator).toBeVisible() failed
  286 |             timeout: 15000
  287 |           });
  288 |         } else {
  289 |           await expect(
  290 |             alreadyDone
  291 |           ).toBeVisible();
  292 |         }
  293 | 
  294 |         await openAcademy(
  295 |           page
  296 |         );
  297 | 
  298 |         await expect(
  299 |           page.locator(
  300 |             'main'
  301 |           )
  302 |         ).toContainText(
  303 |           /your progress/i
  304 |         );
  305 | 
  306 |         const progress =
  307 |           page.getByRole(
  308 |             'progressbar'
  309 |           );
  310 | 
  311 |         if (
  312 |           await progress.waitFor({
  313 |             state: 'visible',
  314 |             timeout: 3000
  315 |           }).then(
  316 |             () => true
  317 |           ).catch(
  318 |             () => false
  319 |           )
  320 |         ) {
  321 |           await expect(
  322 |             progress
  323 |           ).toBeVisible();
  324 |         }
  325 | 
  326 |         await expect(
  327 |           page.locator(
  328 |             'main'
  329 |           )
  330 |         ).toContainText(
  331 |           markedNow
  332 |             ? /[1-9]\d*\s*\/\s*13/
  333 |             : /\d+\s*\/\s*13/,
  334 |           {
  335 |             timeout: 20000
  336 |           }
  337 |         );
  338 | 
  339 |         await expect(
  340 |           page.locator(
  341 |             'main'
  342 |           )
  343 |         ).toContainText(
  344 |           /completed \d+ of 13|start your first lesson|\d+\s*\/\s*13/i
  345 |         );
  346 | 
  347 |         await safeClick(
  348 |           page.getByRole(
  349 |             'link',
  350 |             {
  351 |               name: /^strategy library$/i
  352 |             }
  353 |           ).first(),
  354 |           'Strategy library'
  355 |         );
  356 | 
  357 |         const categories = [
  358 |           {
  359 |             button: /^all\b/i,
  360 |             content: /18 of 18|covered call/i
  361 |           },
  362 |           {
  363 |             button: /^income\b/i,
  364 |             content: /covered call|5 of 18/i
  365 |           },
  366 |           {
  367 |             button: /^directional\b/i,
  368 |             content: /long call|4 of 18/i
  369 |           },
  370 |           {
  371 |             button: /^protection\b/i,
  372 |             content: /protective put|2 of 18/i
  373 |           },
  374 |           {
  375 |             button: /^volatility\b/i,
  376 |             content: /straddle|4 of 18/i
  377 |           },
  378 |           {
  379 |             button: /^precision\b/i,
  380 |             content: /butterfly|1 of 18/i
  381 |           },
  382 |           {
  383 |             button: /^advanced\b/i,
  384 |             content: /ratio spread|2 of 18/i
  385 |           }
```