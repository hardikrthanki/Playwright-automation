# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-038 - Eligible immediate cancellation displays refund amount before refund confirmation
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
TimeoutError: locator.click: Timeout 8000ms exceeded.
Call log:
  - waiting for locator('[role="dialog"], [role="alertdialog"]').filter({ hasText: /cancel subscription/i }).getByRole('button', { name: /keep my plan/i })
    - locator resolved to <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Keep my plan</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

```

# Test source

```ts
  810  | 
  811  |   Logger.success(
  812  |     'Billing Plan Lifecycle Action Summary Validated'
  813  |   );
  814  | }
  815  | 
  816  | async validateBillingIntervalPresentationSummary() {
  817  | 
  818  |   Logger.info(
  819  |     'Validating Billing Interval Presentation Summary'
  820  |   );
  821  | 
  822  |   await this.validateOverview();
  823  | 
  824  |   if (
  825  |     await this.plansTab.isVisible({
  826  |       timeout: 5000
  827  |     }).catch(
  828  |       () => false
  829  |     )
  830  |   ) {
  831  |     await safeClick(
  832  |       this.plansTab,
  833  |       'Open Plans Tab'
  834  |     );
  835  |   }
  836  | 
  837  |   await this.validateBillingUrl();
  838  | 
  839  |   const pageText =
  840  |     await this.page
  841  |       .locator(
  842  |         'body'
  843  |       )
  844  |       .innerText();
  845  | 
  846  |   expect(
  847  |     pageText
  848  |   ).toMatch(
  849  |     /monthly|annual|month|year|\/mo|\/yr|\/year|per month|per year|billing period|no plan changes|paid plan|current plan/i
  850  |   );
  851  | 
  852  |   const monthlyMarkerCount =
  853  |     (
  854  |       pageText.match(
  855  |         /monthly|per month|\/mo|month/gi
  856  |       ) ?? []
  857  |     ).length;
  858  | 
  859  |   const annualMarkerCount =
  860  |     (
  861  |       pageText.match(
  862  |         /annual|per year|\/yr|\/year|year/gi
  863  |       ) ?? []
  864  |     ).length;
  865  | 
  866  |   console.log(
  867  |     `Billing interval markers: monthly=${monthlyMarkerCount}, annual=${annualMarkerCount}`
  868  |   );
  869  | 
  870  |   Logger.success(
  871  |     'Billing Interval Presentation Summary Validated'
  872  |   );
  873  | }
  874  | 
  875  | private async closeCancelDialogIfOpen() {
  876  |   const dialog =
  877  |     this.page.locator(
  878  |       '[role="dialog"], [role="alertdialog"]'
  879  |     ).filter({
  880  |       hasText: /cancel subscription/i
  881  |     });
  882  | 
  883  |   const open =
  884  |     await dialog.isVisible({
  885  |       timeout: 1000
  886  |     }).catch(
  887  |       () => false
  888  |     );
  889  | 
  890  |   if (!open) {
  891  |     return;
  892  |   }
  893  | 
  894  |   const keepPlan =
  895  |     dialog.getByRole(
  896  |       'button',
  897  |       {
  898  |         name: /keep my plan/i
  899  |       }
  900  |     );
  901  | 
  902  |   if (
  903  |     await keepPlan.isVisible().catch(
  904  |       () => false
  905  |     ) &&
  906  |     await keepPlan.isEnabled().catch(
  907  |       () => false
  908  |     )
  909  |   ) {
> 910  |     await keepPlan.click({
       |                    ^ TimeoutError: locator.click: Timeout 8000ms exceeded.
  911  |       timeout: 8000
  912  |     });
  913  |   } else {
  914  |     await this.page.keyboard.press(
  915  |       'Escape'
  916  |     );
  917  |   }
  918  | 
  919  |   await expect(
  920  |     dialog
  921  |   ).toBeHidden({
  922  |     timeout: 10000
  923  |   });
  924  | }
  925  | 
  926  | private async cardShowsCurrentPlan(
  927  |   planName: string
  928  | ) {
  929  |   return this.page.evaluate(
  930  |     (targetPlan) => {
  931  |       const plans = [
  932  |         {
  933  |           name: 'Income Builder',
  934  |           needles: ['income builder', 'income']
  935  |         },
  936  |         {
  937  |           name: 'Overlay Strategists',
  938  |           needles: ['overlay strategists', 'overlay']
  939  |         },
  940  |         {
  941  |           name: 'Portfolio Hedger',
  942  |           needles: ['portfolio hedger', 'portfolio hedge']
  943  |         },
  944  |         {
  945  |           name: 'Curious Explorer',
  946  |           needles: ['curious explorer', 'curious']
  947  |         }
  948  |       ];
  949  | 
  950  |       const matchedPlans = (text: string) =>
  951  |         plans.filter(
  952  |           (plan) =>
  953  |             plan.needles.some(
  954  |               (needle) =>
  955  |                 text.includes(needle)
  956  |             )
  957  |         );
  958  | 
  959  |       const buttons =
  960  |         Array.from(
  961  |           document.querySelectorAll(
  962  |             'button, a'
  963  |           )
  964  |         );
  965  | 
  966  |       for (const element of buttons) {
  967  |         if (
  968  |           !/^(?:current plan|switch)$/i.test(
  969  |             (element.textContent ?? '').trim()
  970  |           )
  971  |         ) {
  972  |           continue;
  973  |         }
  974  | 
  975  |         let current =
  976  |           element.parentElement;
  977  | 
  978  |         for (
  979  |           let depth = 0;
  980  |           current && depth < 12;
  981  |           depth += 1
  982  |         ) {
  983  |           const matches =
  984  |             matchedPlans(
  985  |               (
  986  |                 current.textContent ?? ''
  987  |               ).toLowerCase()
  988  |             );
  989  | 
  990  |           if (matches.length === 1) {
  991  |             return matches[0].name === targetPlan;
  992  |           }
  993  | 
  994  |           current =
  995  |             current.parentElement;
  996  |         }
  997  |       }
  998  | 
  999  |       return false;
  1000 |     },
  1001 |     planName
  1002 |   );
  1003 | }
  1004 | 
  1005 | private async openPlansView() {
  1006 | 
  1007 |   await this.dismissMarketingOverlays();
  1008 | 
  1009 |   await this.closeCancelDialogIfOpen();
  1010 | 
```