# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AnnualMonthlyBillingChangeMatrix.spec.ts >> Annual To Monthly Billing Change Use Case 6 Matrix >> SC-214 - Annual-to-monthly change records subscription history
- Location: tests\AnnualMonthlyBillingChangeMatrix.spec.ts:393:13

# Error details

```
Error: Subscription History should record the scheduled switch to monthly billing (the only entry today is the annual purchase).

expect(received).toBeTruthy()

Received: false

Call Log:
- Timeout 20000ms exceeded while waiting on the predicate
```

# Test source

```ts
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
  782 |   ).toBe(expectedAdditional);
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
> 853 |   await expect
      |   ^ Error: Subscription History should record the scheduled switch to monthly billing (the only entry today is the annual purchase).
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
  883 |     'Transactions should show an invoice PDF link.'
  884 |   ).toBeVisible({
  885 |     timeout: 20000
  886 |   });
  887 | 
  888 |   const href =
  889 |     await pdfLink.getAttribute(
  890 |       'href'
  891 |     );
  892 | 
  893 |   expect(
  894 |     href,
  895 |     'Invoice PDF link should point at the Stripe-hosted invoice.'
  896 |   ).toMatch(
  897 |     /^https:\/\/(pay|invoice)\.stripe\.com\//i
  898 |   );
  899 | 
  900 |   const response =
  901 |     await ctx.page
  902 |       .context()
  903 |       .request.get(href!);
  904 | 
  905 |   expect(
  906 |     response.status(),
  907 |     'Invoice PDF URL should respond successfully.'
  908 |   ).toBe(200);
  909 | 
  910 |   // Stripe serves the file as a generic download
  911 |   // (application/octet-stream), so the %PDF header is the real proof.
  912 |   const body =
  913 |     await response.body();
  914 | 
  915 |   expect(
  916 |     body.subarray(0, 5).toString(),
  917 |     'Invoice PDF file should start with the %PDF header.'
  918 |   ).toBe('%PDF-');
  919 | }
  920 | 
  921 | // A refresh in the middle of a plan change must not silently drop the
  922 | // target the user picked: the confirmation should come back for the same
  923 | // plan. Nothing is ever confirmed, so no charge or change is made.
  924 | async function stepRefreshKeepsTarget(
  925 |   ctx: PackContext,
  926 |   options: {
  927 |     targetPlan: PaidPlan;
  928 |     action: 'upgrade' | 'downgrade' | 'interval';
  929 |     interval: Interval;
  930 |     targetPattern: RegExp;
  931 |     label: string;
  932 |   }
  933 | ) {
  934 |   await ctx.billing.validateOverview();
  935 | 
  936 |   await ctx.billing.openPlanChangeCalculationPreview({
  937 |     targetPlan: options.targetPlan,
  938 |     action: options.action,
  939 |     interval: options.interval
  940 |   });
  941 | 
  942 |   await ctx.page.reload({
  943 |     waitUntil: 'domcontentloaded'
  944 |   });
  945 | 
  946 |   const dialog =
  947 |     ctx.page
  948 |       .locator(
  949 |         '[role="dialog"], [role="alertdialog"]'
  950 |       )
  951 |       .first();
  952 | 
  953 |   const restored =
```