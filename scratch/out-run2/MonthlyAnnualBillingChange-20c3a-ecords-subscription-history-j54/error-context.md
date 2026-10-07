# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MonthlyAnnualBillingChangeMatrix.spec.ts >> Monthly To Annual Billing Change Use Case 5 Matrix >> SC-178 - Successful monthly-to-annual change records subscription history
- Location: tests\MonthlyAnnualBillingChangeMatrix.spec.ts:361:13

# Error details

```
Error: Subscription History should record the switch to annual billing.

expect(received).toBeTruthy()

Received: false

Call Log:
- Timeout 20000ms exceeded while waiting on the predicate
```

# Test source

```ts
  730 |     await ctx.page
  731 |       .$$eval(
  732 |         'input',
  733 |         (inputs) =>
  734 |           inputs.map(
  735 |             (input) =>
  736 |               (input as HTMLInputElement).value
  737 |           )
  738 |       )
  739 |       .catch(() => [] as string[]);
  740 | 
  741 |   const body =
  742 |     (
  743 |       await ctx.page
  744 |         .locator('body')
  745 |         .innerText()
  746 |     ) +
  747 |     ' ' +
  748 |     inputValues.join(' ');
  749 | 
  750 |   const localPart =
  751 |     ctx.email.split('@')[0];
  752 | 
  753 |   expect(
  754 |     body.toLowerCase(),
  755 |     'Profile should still show the same disposable account after the plan change.'
  756 |   ).toContain(
  757 |     localPart.toLowerCase()
  758 |   );
  759 | }
  760 | 
  761 | async function stepTransactionPaidCount(
  762 |   ctx: PackContext,
  763 |   expectedAdditional: number
  764 | ) {
  765 |   expect(
  766 |     ctx.state.paidBeforeChange,
  767 |     'Paid transaction count before the change was not recorded.'
  768 |   ).toBeDefined();
  769 | 
  770 |   expect(
  771 |     (ctx.state.paidAfterChange ?? 0) -
  772 |       (ctx.state.paidBeforeChange ?? 0),
  773 |     `Transactions should gain exactly ${expectedAdditional} paid entr${expectedAdditional === 1 ? 'y' : 'ies'} after the change.`
  774 |   ).toBe(expectedAdditional);
  775 | }
  776 | 
  777 | async function stepTransactionAmount(
  778 |   ctx: PackContext,
  779 |   amount: number | null,
  780 |   expectCredit = false
  781 | ) {
  782 |   await openTransactions(ctx);
  783 | 
  784 |   const main =
  785 |     ctx.page.locator('main');
  786 | 
  787 |   if (amount !== null) {
  788 |     await expect(
  789 |       main
  790 |     ).toContainText(
  791 |       moneyPattern(amount),
  792 |       {
  793 |         timeout: 15000
  794 |       }
  795 |     );
  796 |   }
  797 | 
  798 |   if (expectCredit) {
  799 |     // Upgrade invoices are prorated: "Includes -$X credit for unused time".
  800 |     await expect(
  801 |       main
  802 |     ).toContainText(
  803 |       /Subscription Update[\s\S]{0,120}credit for unused time/i,
  804 |       {
  805 |         timeout: 15000
  806 |       }
  807 |     );
  808 |   }
  809 | }
  810 | 
  811 | async function stepHistoryShows(
  812 |   ctx: PackContext,
  813 |   plan: PaidPlan
  814 | ) {
  815 |   await ctx.billing.validateOverview();
  816 | 
  817 |   await ctx.billing.validateHistoryShowsPlan(
  818 |     plan
  819 |   );
  820 | }
  821 | 
  822 | // Subscription History tab must mention the change.
  823 | async function stepHistoryMatches(
  824 |   ctx: PackContext,
  825 |   pattern: RegExp,
  826 |   message: string
  827 | ) {
  828 |   await ctx.billing.validateOverview();
  829 | 
> 830 |   await clickTab(
      |   ^ Error: Subscription History should record the switch to annual billing.
  831 |     ctx.billing.historyTab
  832 |   );
  833 | 
  834 |   // History has two sub-tabs and keeps the last one used.
  835 |   await ctx.page
  836 |     .getByText(
  837 |       /^Subscription History$/
  838 |     )
  839 |     .first()
  840 |     .click({
  841 |       timeout: 10000
  842 |     })
  843 |     .catch(() => undefined);
  844 | 
  845 |   await expect
  846 |     .poll(
  847 |       async () =>
  848 |         pattern.test(
  849 |           await mainText(ctx)
  850 |         ),
  851 |       {
  852 |         message,
  853 |         timeout: 20000
  854 |       }
  855 |     )
  856 |     .toBeTruthy();
  857 | }
  858 | 
  859 | // The "PDF" link of the newest transaction must serve a real PDF.
  860 | async function stepInvoicePdfOpens(
  861 |   ctx: PackContext
  862 | ) {
  863 |   await openTransactions(ctx);
  864 | 
  865 |   const pdfLink =
  866 |     ctx.page
  867 |       .locator('main a')
  868 |       .filter({
  869 |         hasText: /^\s*(invoice\s+)?pdf\s*$/i
  870 |       })
  871 |       .first();
  872 | 
  873 |   await expect(
  874 |     pdfLink,
  875 |     'Transactions should show an invoice PDF link.'
  876 |   ).toBeVisible({
  877 |     timeout: 20000
  878 |   });
  879 | 
  880 |   const href =
  881 |     await pdfLink.getAttribute(
  882 |       'href'
  883 |     );
  884 | 
  885 |   expect(
  886 |     href,
  887 |     'Invoice PDF link should point at the Stripe-hosted invoice.'
  888 |   ).toMatch(
  889 |     /^https:\/\/(pay|invoice)\.stripe\.com\//i
  890 |   );
  891 | 
  892 |   const response =
  893 |     await ctx.page
  894 |       .context()
  895 |       .request.get(href!);
  896 | 
  897 |   expect(
  898 |     response.status(),
  899 |     'Invoice PDF URL should respond successfully.'
  900 |   ).toBe(200);
  901 | 
  902 |   // Stripe serves the file as a generic download
  903 |   // (application/octet-stream), so the %PDF header is the real proof.
  904 |   const body =
  905 |     await response.body();
  906 | 
  907 |   expect(
  908 |     body.subarray(0, 5).toString(),
  909 |     'Invoice PDF file should start with the %PDF header.'
  910 |   ).toBe('%PDF-');
  911 | }
  912 | 
  913 | async function readDowngradeDialog(
  914 |   ctx: PackContext,
  915 |   targetPlan: PaidPlan
  916 | ) {
  917 |   await ctx.billing.validateOverview();
  918 | 
  919 |   await ctx.billing.openMonthlyDowngradeOrRetention({
  920 |     targetPlan
  921 |   });
  922 | 
  923 |   const dialog =
  924 |     ctx.page
  925 |       .locator(
  926 |         '[role="dialog"], [role="alertdialog"]'
  927 |       )
  928 |       .first();
  929 | 
  930 |   await expect(dialog).toBeVisible({
```