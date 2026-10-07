# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionCancellationMatrix.spec.ts >> Subscription Cancellation Use Case 7 Matrix >> SC-289 - Transaction history does not create an unexpected extra charge on cancellation
- Location: tests\SubscriptionCancellationMatrix.spec.ts:553:13

# Error details

```
Error: Transactions should gain exactly 0 paid entries after the change.

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: -1
```

# Test source

```ts
  682 |       .getByText(
  683 |         /^\s*current( plan)?\s*$/i
  684 |       )
  685 |       .count();
  686 | 
  687 |   console.log(
  688 |     `[${ctx.scenario}] current-plan markers on Plans tab: ${currentMarkers}`
  689 |   );
  690 | 
  691 |   expect(
  692 |     currentMarkers,
  693 |     'Exactly one plan should be marked as the current plan (no duplicate active subscriptions).'
  694 |   ).toBe(1);
  695 | }
  696 | 
  697 | async function stepActivePlan(
  698 |   ctx: PackContext,
  699 |   plan: PaidPlan
  700 | ) {
  701 |   await ctx.billing.validateOverview();
  702 | 
  703 |   await ctx.billing.validateActivePlan(
  704 |     plan
  705 |   );
  706 | }
  707 | 
  708 | async function stepUserDataPreserved(
  709 |   ctx: PackContext
  710 | ) {
  711 |   await ctx.page.goto(
  712 |     `${BASE_URL}/dashboard`,
  713 |     {
  714 |       waitUntil:
  715 |         'domcontentloaded'
  716 |     }
  717 |   );
  718 | 
  719 |   await new DashboardPage(
  720 |     ctx.page
  721 |   ).validateLoaded();
  722 | 
  723 |   await new DashboardPage(
  724 |     ctx.page
  725 |   ).validateNoLoadError();
  726 | 
  727 |   await ctx.page.goto(
  728 |     `${BASE_URL}/dashboard/profile`,
  729 |     {
  730 |       waitUntil:
  731 |         'domcontentloaded'
  732 |     }
  733 |   ).catch(() => undefined);
  734 | 
  735 |   await ctx.page.waitForTimeout(2000);
  736 | 
  737 |   const inputValues =
  738 |     await ctx.page
  739 |       .$$eval(
  740 |         'input',
  741 |         (inputs) =>
  742 |           inputs.map(
  743 |             (input) =>
  744 |               (input as HTMLInputElement).value
  745 |           )
  746 |       )
  747 |       .catch(() => [] as string[]);
  748 | 
  749 |   const body =
  750 |     (
  751 |       await ctx.page
  752 |         .locator('body')
  753 |         .innerText()
  754 |     ) +
  755 |     ' ' +
  756 |     inputValues.join(' ');
  757 | 
  758 |   const localPart =
  759 |     ctx.email.split('@')[0];
  760 | 
  761 |   expect(
  762 |     body.toLowerCase(),
  763 |     'Profile should still show the same disposable account after the plan change.'
  764 |   ).toContain(
  765 |     localPart.toLowerCase()
  766 |   );
  767 | }
  768 | 
  769 | async function stepTransactionPaidCount(
  770 |   ctx: PackContext,
  771 |   expectedAdditional: number
  772 | ) {
  773 |   expect(
  774 |     ctx.state.paidBeforeChange,
  775 |     'Paid transaction count before the change was not recorded.'
  776 |   ).toBeDefined();
  777 | 
  778 |   expect(
  779 |     (ctx.state.paidAfterChange ?? 0) -
  780 |       (ctx.state.paidBeforeChange ?? 0),
  781 |     `Transactions should gain exactly ${expectedAdditional} paid entr${expectedAdditional === 1 ? 'y' : 'ies'} after the change.`
> 782 |   ).toBe(expectedAdditional);
      |     ^ Error: Transactions should gain exactly 0 paid entries after the change.
  783 | }
  784 | 
  785 | async function stepTransactionAmount(
  786 |   ctx: PackContext,
  787 |   amount: number | null,
  788 |   expectCredit = false
  789 | ) {
  790 |   await openTransactions(ctx);
  791 | 
  792 |   const main =
  793 |     ctx.page.locator('main');
  794 | 
  795 |   if (amount !== null) {
  796 |     await expect(
  797 |       main
  798 |     ).toContainText(
  799 |       moneyPattern(amount),
  800 |       {
  801 |         timeout: 15000
  802 |       }
  803 |     );
  804 |   }
  805 | 
  806 |   if (expectCredit) {
  807 |     // Upgrade invoices are prorated: "Includes -$X credit for unused time".
  808 |     await expect(
  809 |       main
  810 |     ).toContainText(
  811 |       /Subscription Update[\s\S]{0,120}credit for unused time/i,
  812 |       {
  813 |         timeout: 15000
  814 |       }
  815 |     );
  816 |   }
  817 | }
  818 | 
  819 | async function stepHistoryShows(
  820 |   ctx: PackContext,
  821 |   plan: PaidPlan
  822 | ) {
  823 |   await ctx.billing.validateOverview();
  824 | 
  825 |   await ctx.billing.validateHistoryShowsPlan(
  826 |     plan
  827 |   );
  828 | }
  829 | 
  830 | // Subscription History tab must mention the change.
  831 | async function stepHistoryMatches(
  832 |   ctx: PackContext,
  833 |   pattern: RegExp,
  834 |   message: string
  835 | ) {
  836 |   await ctx.billing.validateOverview();
  837 | 
  838 |   await clickTab(
  839 |     ctx.billing.historyTab
  840 |   );
  841 | 
  842 |   // History has two sub-tabs and keeps the last one used.
  843 |   await ctx.page
  844 |     .getByText(
  845 |       /^Subscription History$/
  846 |     )
  847 |     .first()
  848 |     .click({
  849 |       timeout: 10000
  850 |     })
  851 |     .catch(() => undefined);
  852 | 
  853 |   await expect
  854 |     .poll(
  855 |       async () =>
  856 |         pattern.test(
  857 |           await mainText(ctx)
  858 |         ),
  859 |       {
  860 |         message,
  861 |         timeout: 20000
  862 |       }
  863 |     )
  864 |     .toBeTruthy();
  865 | }
  866 | 
  867 | // The "PDF" link of the newest transaction must serve a real PDF.
  868 | async function stepInvoicePdfOpens(
  869 |   ctx: PackContext
  870 | ) {
  871 |   await openTransactions(ctx);
  872 | 
  873 |   const pdfLink =
  874 |     ctx.page
  875 |       .locator('main a')
  876 |       .filter({
  877 |         hasText: /^\s*(invoice\s+)?pdf\s*$/i
  878 |       })
  879 |       .first();
  880 | 
  881 |   await expect(
  882 |     pdfLink,
```