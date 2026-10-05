# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: DashboardMenus.spec.ts >> Dashboard menus >> Portfolio menu opens each holdings destination
- Location: tests\DashboardMenus.spec.ts:133:9

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected pattern: /portfolio|account|position|holding|broker|connect/i
Received string:  "WatchlistTrack symbols, market snapshots, news, and generate opportunities.My Watchlist(0)Opportunities(0)NewAddNo symbols yet. Add a symbol to see market data.Top NewsMy WatchlistNews will appear here for symbols in this watchlist"
Timeout: 20000ms

Call log:
  - Expect "toContainText" with timeout 20000ms
  - waiting for locator('main')
    4 × locator resolved to <main class="container flex-1 px-4 py-8">…</main>
      - unexpected value ""
    - locator resolved to <main class="container flex-1 px-4 py-8">…</main>
    - unexpected value "WatchlistTrack symbols, market snapshots, news, and generate opportunities.Loading watchlists…"
    18 × locator resolved to <main class="container flex-1 px-4 py-8">…</main>
       - unexpected value "WatchlistTrack symbols, market snapshots, news, and generate opportunities.My Watchlist(0)Opportunities(0)NewAddNo symbols yet. Add a symbol to see market data.Top NewsMy WatchlistNews will appear here for symbols in this watchlist"

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
          - button "Prices are delayed, not live market prices. Portfolio value and P&L come from your broker, so they can differ from your broker's dashboard." [ref=e26]: Delayed
          - button "Sync all" [ref=e27] [cursor=pointer]:
            - img
            - generic [ref=e28]: Sync all
          - button "Add options" [ref=e29] [cursor=pointer]:
            - img
          - button "Notifications" [ref=e30] [cursor=pointer]:
            - img [ref=e31]
            - generic [ref=e34]: "18"
          - button "QU" [ref=e35] [cursor=pointer]:
            - generic [ref=e37]: QU
    - main [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Watchlist" [level=1] [ref=e41]
          - paragraph [ref=e42]: Track symbols, market snapshots, news, and generate opportunities.
        - generic [ref=e43]:
          - generic [ref=e44]:
            - generic [ref=e45]:
              - tablist [ref=e46]:
                - tab "My Watchlist (0)" [selected] [ref=e47] [cursor=pointer]:
                  - text: My Watchlist
                  - generic [ref=e48]: (0)
                - tab "Opportunities (0)" [ref=e49] [cursor=pointer]:
                  - text: Opportunities
                  - generic [ref=e50]: (0)
              - tabpanel "My Watchlist (0)"
            - generic [ref=e51]:
              - button "New" [ref=e52] [cursor=pointer]:
                - img
                - text: New
              - button "Edit watchlist" [ref=e53] [cursor=pointer]:
                - img
              - button "Delete watchlist" [disabled]:
                - img
          - generic [ref=e54]:
            - generic [ref=e55]:
              - img [ref=e56]
              - textbox "Add symbol (e.g. AAPL)" [ref=e59]
            - button "Add" [disabled]:
              - img
              - text: Add
          - paragraph [ref=e61]: No symbols yet. Add a symbol to see market data.
          - generic [ref=e62]:
            - generic [ref=e64]:
              - img [ref=e66]
              - generic [ref=e69]:
                - heading "Top News" [level=3] [ref=e70]
                - paragraph [ref=e71]: My Watchlist
            - paragraph [ref=e73]: News will appear here for symbols in this watchlist
    - contentinfo [ref=e74]:
      - generic [ref=e75]:
        - generic [ref=e76]:
          - paragraph [ref=e77]: © 2026 Ools Inc. All rights reserved.
          - navigation "Legal and support" [ref=e78]:
            - link "Privacy Policy" [ref=e80] [cursor=pointer]:
              - /url: /privacy-policy
            - generic [ref=e81]:
              - generic [ref=e82]: ·
              - link "Terms of Service" [ref=e83] [cursor=pointer]:
                - /url: /terms-of-services
            - generic [ref=e84]:
              - generic [ref=e85]: ·
              - link "Disclosures" [ref=e86] [cursor=pointer]:
                - /url: /disclosures
            - generic [ref=e87]:
              - generic [ref=e88]: ·
              - link "Risk Warning" [ref=e89] [cursor=pointer]:
                - /url: /risk-warning
            - generic [ref=e90]:
              - generic [ref=e91]: ·
              - link "Contact" [ref=e92] [cursor=pointer]:
                - /url: /contact
        - paragraph [ref=e93]: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert [ref=e94]
```

# Test source

```ts
  109 |           await safeClick(
  110 |             page.getByRole(
  111 |               'menuitem',
  112 |               {
  113 |                 name: destination.name
  114 |               }
  115 |             ),
  116 |             'Open research destination'
  117 |           );
  118 | 
  119 |           await expect(
  120 |             page.locator(
  121 |               'main'
  122 |             )
  123 |           ).toContainText(
  124 |             destination.content,
  125 |             {
  126 |               timeout: 20000
  127 |             }
  128 |           );
  129 |         }
  130 |       }
  131 |     );
  132 | 
  133 |     test(
  134 |       'Portfolio menu opens each holdings destination',
  135 |       async ({ page }) => {
  136 |         await openDashboard(
  137 |           page
  138 |         );
  139 | 
  140 |         await openMenu(
  141 |           page,
  142 |           /^portfolio$/i,
  143 |           'Portfolio menu'
  144 |         );
  145 | 
  146 |         const items =
  147 |           page.getByRole(
  148 |             'menuitem'
  149 |           );
  150 | 
  151 |         await expect(
  152 |           items.first()
  153 |         ).toBeVisible({
  154 |           timeout: 10000
  155 |         });
  156 | 
  157 |         const names =
  158 |           await items.allInnerTexts();
  159 | 
  160 |         expect(
  161 |           names.length
  162 |         ).toBeGreaterThan(
  163 |           0
  164 |         );
  165 | 
  166 |         for (const name of names) {
  167 |           const label =
  168 |             name.replace(
  169 |               /\s+/g,
  170 |               ' '
  171 |             ).trim();
  172 | 
  173 |           if (
  174 |             !label
  175 |           ) {
  176 |             continue;
  177 |           }
  178 | 
  179 |           await openDashboard(
  180 |             page
  181 |           );
  182 | 
  183 |           await openMenu(
  184 |             page,
  185 |             /^portfolio$/i,
  186 |             'Portfolio menu'
  187 |           );
  188 | 
  189 |           await safeClick(
  190 |             page.getByRole(
  191 |               'menuitem',
  192 |               {
  193 |                 name: new RegExp(
  194 |                   `^${label.replace(
  195 |                     /[.*+?^${}()|[\]\\]/g,
  196 |                     '\\$&'
  197 |                   )}$`,
  198 |                   'i'
  199 |                 )
  200 |               }
  201 |             ),
  202 |             label
  203 |           );
  204 | 
  205 |           await expect(
  206 |             page.locator(
  207 |               'main'
  208 |             )
> 209 |           ).toContainText(
      |             ^ Error: expect(locator).toContainText(expected) failed
  210 |             /portfolio|account|position|holding|broker|connect/i,
  211 |             {
  212 |               timeout: 20000
  213 |             }
  214 |           );
  215 |         }
  216 |       }
  217 |     );
  218 |   }
  219 | );
  220 | 
```