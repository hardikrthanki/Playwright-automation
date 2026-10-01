# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> OOLTool Onboarding Flow >> Register -> Verify Email -> Login -> Risk -> Compliance
- Location: tests\onboarding.spec.ts:132:7

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  getByText(/this page couldn'?t load|reload to try again|go back/i)
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" with timeout 5000ms
  - waiting for getByText(/this page couldn'?t load|reload to try again|go back/i)
    9 × locator resolved to <p>Reload to try again, or go back.</p>
      - unexpected value "visible"

```

# Test source

```ts
  180 |     await this.dismissMarketingOverlays();
  181 | 
  182 |     const menuTrigger =
  183 |       this.page.getByRole(
  184 |         'button',
  185 |         {
  186 |           name: /^ht$/i
  187 |         }
  188 |       ).or(
  189 |         this.page.getByText(
  190 |           'HT',
  191 |           {
  192 |             exact: true
  193 |           }
  194 |         )
  195 |       ).or(
  196 |         this.page.locator(
  197 |           'header button'
  198 |         ).filter({
  199 |           hasText: /^[A-Z]{1,2}$/
  200 |         })
  201 |       ).or(
  202 |         this.page.getByRole(
  203 |           'button',
  204 |           {
  205 |             name: /account|profile menu|user menu/i
  206 |           }
  207 |         )
  208 |       ).first();
  209 | 
  210 |     await safeClick(
  211 |       menuTrigger,
  212 |       'Open Profile Menu'
  213 |     );
  214 | 
  215 |     await expect(
  216 |       this.profileMenuItem(
  217 |         'Billing'
  218 |       ).or(
  219 |         this.page.getByText(
  220 |           /sign out/i
  221 |         )
  222 |       ).first()
  223 |     ).toBeVisible({
  224 |       timeout: 10000
  225 |     });
  226 |   }
  227 | 
  228 |   private profileMenuItem(
  229 |     label: string
  230 |   ) {
  231 |     const escaped =
  232 |       label.replace(
  233 |         /[.*+?^${}()|[\]\\]/g,
  234 |         '\\$&'
  235 |       );
  236 | 
  237 |     const labelPattern =
  238 |       new RegExp(
  239 |         `^${escaped}(\\b|\\s|&|$)`,
  240 |         'i'
  241 |       );
  242 | 
  243 |     const menu =
  244 |       this.page.locator(
  245 |         '[role="menu"], [data-radix-menu-content], [data-radix-dropdown-menu-content], [data-radix-popper-content-wrapper]'
  246 |       );
  247 | 
  248 |     return menu.getByRole(
  249 |       'menuitem',
  250 |       {
  251 |         name: labelPattern
  252 |       }
  253 |     ).or(
  254 |       menu.getByRole(
  255 |         'link',
  256 |         {
  257 |           name: labelPattern
  258 |         }
  259 |       )
  260 |     ).or(
  261 |       menu.getByRole(
  262 |         'button',
  263 |         {
  264 |           name: labelPattern
  265 |         }
  266 |       )
  267 |     ).or(
  268 |       menu.getByText(
  269 |         labelPattern
  270 |       )
  271 |     ).first();
  272 |   }
  273 | 
  274 |   async validateNoLoadError() {
  275 | 
  276 |     await expect(
  277 |       this.page.getByText(
  278 |         /this page couldn'?t load|reload to try again|go back/i
  279 |       )
> 280 |     ).not.toBeVisible({
      |           ^ Error: expect(locator).not.toBeVisible() failed
  281 |       timeout: 5000
  282 |     });
  283 |   }
  284 | 
  285 |   async validateLoaded(
  286 |     options?: {
  287 |       acceptTrialSuccessMobileGate?: boolean;
  288 |     }
  289 |   ) {
  290 | 
  291 |     await this.dismissMarketingOverlays();
  292 | 
  293 |     if (
  294 |       isLoginUrl(
  295 |         this.page.url()
  296 |       )
  297 |     ) {
  298 |       await restoreSubscriberSession(
  299 |         this.page
  300 |       );
  301 |     }
  302 | 
  303 |     Logger.info(
  304 |       'Validating Dashboard'
  305 |     );
  306 | 
  307 |     if (
  308 |       options?.acceptTrialSuccessMobileGate &&
  309 |       /verify-mobile/i.test(
  310 |         this.page.url()
  311 |       ) &&
  312 |       /trial=success/i.test(
  313 |         this.page.url()
  314 |       )
  315 |     ) {
  316 |       Logger.success(
  317 |         'QA-CL-005: with-card trial granted. Phone gate is separate from the trial grant.'
  318 |       );
  319 | 
  320 |       return;
  321 |     }
  322 | 
  323 |     await expect(
  324 |       this.page
  325 |     ).toHaveURL(
  326 |       /dashboard/,
  327 |       {
  328 |         timeout: 30000
  329 |       }
  330 |     );
  331 | 
  332 |     await this.validateNoLoadError();
  333 | 
  334 |     Logger.success(
  335 |       'Dashboard Loaded'
  336 |     );
  337 |   }
  338 | 
  339 |   async validateTopNavigationRoutes() {
  340 | 
  341 |     Logger.info(
  342 |       'Validating dashboard top navigation routes'
  343 |     );
  344 | 
  345 |     for (const item of this.topNavigationItems) {
  346 |       await this.openTopNavigationItem(
  347 |         item.label
  348 |       );
  349 | 
  350 |       await expect(
  351 |         this.page
  352 |       ).toHaveURL(
  353 |         item.url,
  354 |         {
  355 |           timeout: 15000
  356 |         }
  357 |       );
  358 | 
  359 |       await this.validateNoLoadError();
  360 |     }
  361 | 
  362 |     Logger.success(
  363 |       'Dashboard top navigation routes are healthy'
  364 |     );
  365 |   }
  366 | 
  367 |   async validateTopNavigationDestinationsRender() {
  368 | 
  369 |     Logger.info(
  370 |       'Validating dashboard top navigation destination content'
  371 |     );
  372 | 
  373 |     const navigationItems = [
  374 |       ...this.topNavigationItems
  375 |     ];
  376 | 
  377 |     for (const item of navigationItems) {
  378 |       await this.openTopNavigationItem(
  379 |         item.label
  380 |       );
```