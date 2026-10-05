# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-028 - Downgrade warns about feature and data-limit impact before confirmation
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[role="dialog"], [role="alertdialog"]').filter({ hasText: /cancel subscription/i }).getByRole('button', { name: /keep my plan/i })
    - locator resolved to <button disabled class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Keep my plan</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not enabled
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

```

# Test source

```ts
  805  |   console.log(
  806  |     `Plan lifecycle controls: upgrade=${upgradeCount}, downgrade=${downgradeCount}, current/status=${currentOrStatusCount}, subscribe/manage=${subscribeOrChooseCount}`
  807  |   );
  808  | 
  809  |   Logger.success(
  810  |     'Billing Plan Lifecycle Action Summary Validated'
  811  |   );
  812  | }
  813  | 
  814  | async validateBillingIntervalPresentationSummary() {
  815  | 
  816  |   Logger.info(
  817  |     'Validating Billing Interval Presentation Summary'
  818  |   );
  819  | 
  820  |   await this.validateOverview();
  821  | 
  822  |   if (
  823  |     await this.plansTab.isVisible({
  824  |       timeout: 5000
  825  |     }).catch(
  826  |       () => false
  827  |     )
  828  |   ) {
  829  |     await safeClick(
  830  |       this.plansTab,
  831  |       'Open Plans Tab'
  832  |     );
  833  |   }
  834  | 
  835  |   await this.validateBillingUrl();
  836  | 
  837  |   const pageText =
  838  |     await this.page
  839  |       .locator(
  840  |         'body'
  841  |       )
  842  |       .innerText();
  843  | 
  844  |   expect(
  845  |     pageText
  846  |   ).toMatch(
  847  |     /monthly|annual|month|year|\/mo|\/yr|\/year|per month|per year|billing period|no plan changes|paid plan|current plan/i
  848  |   );
  849  | 
  850  |   const monthlyMarkerCount =
  851  |     (
  852  |       pageText.match(
  853  |         /monthly|per month|\/mo|month/gi
  854  |       ) ?? []
  855  |     ).length;
  856  | 
  857  |   const annualMarkerCount =
  858  |     (
  859  |       pageText.match(
  860  |         /annual|per year|\/yr|\/year|year/gi
  861  |       ) ?? []
  862  |     ).length;
  863  | 
  864  |   console.log(
  865  |     `Billing interval markers: monthly=${monthlyMarkerCount}, annual=${annualMarkerCount}`
  866  |   );
  867  | 
  868  |   Logger.success(
  869  |     'Billing Interval Presentation Summary Validated'
  870  |   );
  871  | }
  872  | 
  873  | private async closeCancelDialogIfOpen() {
  874  |   const dialog =
  875  |     this.page.locator(
  876  |       '[role="dialog"], [role="alertdialog"]'
  877  |     ).filter({
  878  |       hasText: /cancel subscription/i
  879  |     });
  880  | 
  881  |   const open =
  882  |     await dialog.isVisible({
  883  |       timeout: 1000
  884  |     }).catch(
  885  |       () => false
  886  |     );
  887  | 
  888  |   if (!open) {
  889  |     return;
  890  |   }
  891  | 
  892  |   const keepPlan =
  893  |     dialog.getByRole(
  894  |       'button',
  895  |       {
  896  |         name: /keep my plan/i
  897  |       }
  898  |     );
  899  | 
  900  |   if (
  901  |     await keepPlan.isVisible().catch(
  902  |       () => false
  903  |     )
  904  |   ) {
> 905  |     await keepPlan.click();
       |                    ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  906  |   } else {
  907  |     await this.page.keyboard.press(
  908  |       'Escape'
  909  |     );
  910  |   }
  911  | 
  912  |   await expect(
  913  |     dialog
  914  |   ).toBeHidden({
  915  |     timeout: 10000
  916  |   });
  917  | }
  918  | 
  919  | private async cardShowsCurrentPlan(
  920  |   planName: string
  921  | ) {
  922  |   return this.page.evaluate(
  923  |     (targetPlan) => {
  924  |       const plans = [
  925  |         {
  926  |           name: 'Income Builder',
  927  |           needles: ['income builder', 'income']
  928  |         },
  929  |         {
  930  |           name: 'Overlay Strategists',
  931  |           needles: ['overlay strategists', 'overlay']
  932  |         },
  933  |         {
  934  |           name: 'Portfolio Hedger',
  935  |           needles: ['portfolio hedger', 'portfolio hedge']
  936  |         },
  937  |         {
  938  |           name: 'Curious Explorer',
  939  |           needles: ['curious explorer', 'curious']
  940  |         }
  941  |       ];
  942  | 
  943  |       const matchedPlans = (text: string) =>
  944  |         plans.filter(
  945  |           (plan) =>
  946  |             plan.needles.some(
  947  |               (needle) =>
  948  |                 text.includes(needle)
  949  |             )
  950  |         );
  951  | 
  952  |       const buttons =
  953  |         Array.from(
  954  |           document.querySelectorAll(
  955  |             'button, a'
  956  |           )
  957  |         );
  958  | 
  959  |       for (const element of buttons) {
  960  |         if (
  961  |           !/current plan/i.test(
  962  |             element.textContent ?? ''
  963  |           )
  964  |         ) {
  965  |           continue;
  966  |         }
  967  | 
  968  |         let current =
  969  |           element.parentElement;
  970  | 
  971  |         for (
  972  |           let depth = 0;
  973  |           current && depth < 12;
  974  |           depth += 1
  975  |         ) {
  976  |           const matches =
  977  |             matchedPlans(
  978  |               (
  979  |                 current.textContent ?? ''
  980  |               ).toLowerCase()
  981  |             );
  982  | 
  983  |           if (matches.length === 1) {
  984  |             return matches[0].name === targetPlan;
  985  |           }
  986  | 
  987  |           current =
  988  |             current.parentElement;
  989  |         }
  990  |       }
  991  | 
  992  |       return false;
  993  |     },
  994  |     planName
  995  |   );
  996  | }
  997  | 
  998  | private async openPlansView() {
  999  | 
  1000 |   await this.dismissMarketingOverlays();
  1001 | 
  1002 |   await this.closeCancelDialogIfOpen();
  1003 | 
  1004 |   await this.validateOverview();
  1005 | 
```