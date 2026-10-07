# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UpgradeSubscriptionMatrix.spec.ts >> Upgrade Subscription Use Case 3 Matrix >> SC-94 - Upgrade invoice PDF opens and matches plan change details
- Location: tests\UpgradeSubscriptionMatrix.spec.ts:361:13

# Error details

```
Error: Invoice PDF URL should serve a PDF document.

expect(received).toMatch(expected)

Expected pattern: /pdf/i
Received string:  "application/octet-stream"
```

# Test source

```ts
  790 |       }
  791 |     );
  792 |   }
  793 | 
  794 |   if (expectCredit) {
  795 |     // Upgrade invoices are prorated: "Includes -$X credit for unused time".
  796 |     await expect(
  797 |       main
  798 |     ).toContainText(
  799 |       /Subscription Update[\s\S]{0,120}credit for unused time/i,
  800 |       {
  801 |         timeout: 15000
  802 |       }
  803 |     );
  804 |   }
  805 | }
  806 | 
  807 | async function stepHistoryShows(
  808 |   ctx: PackContext,
  809 |   plan: PaidPlan
  810 | ) {
  811 |   await ctx.billing.validateOverview();
  812 | 
  813 |   await ctx.billing.validateHistoryShowsPlan(
  814 |     plan
  815 |   );
  816 | }
  817 | 
  818 | // Subscription History tab must mention the change.
  819 | async function stepHistoryMatches(
  820 |   ctx: PackContext,
  821 |   pattern: RegExp,
  822 |   message: string
  823 | ) {
  824 |   await ctx.billing.validateOverview();
  825 | 
  826 |   await clickTab(
  827 |     ctx.billing.historyTab
  828 |   );
  829 | 
  830 |   await expect
  831 |     .poll(
  832 |       async () =>
  833 |         pattern.test(
  834 |           await mainText(ctx)
  835 |         ),
  836 |       {
  837 |         message,
  838 |         timeout: 20000
  839 |       }
  840 |     )
  841 |     .toBeTruthy();
  842 | }
  843 | 
  844 | // The "PDF" link of the newest transaction must serve a real PDF.
  845 | async function stepInvoicePdfOpens(
  846 |   ctx: PackContext
  847 | ) {
  848 |   await openTransactions(ctx);
  849 | 
  850 |   const pdfLink =
  851 |     ctx.page
  852 |       .locator('main a')
  853 |       .filter({
  854 |         hasText: /^\s*(invoice\s+)?pdf\s*$/i
  855 |       })
  856 |       .first();
  857 | 
  858 |   await expect(
  859 |     pdfLink,
  860 |     'Transactions should show an invoice PDF link.'
  861 |   ).toBeVisible({
  862 |     timeout: 20000
  863 |   });
  864 | 
  865 |   const href =
  866 |     await pdfLink.getAttribute(
  867 |       'href'
  868 |     );
  869 | 
  870 |   expect(
  871 |     href,
  872 |     'Invoice PDF link should point at the Stripe-hosted invoice.'
  873 |   ).toMatch(
  874 |     /^https:\/\/(pay|invoice)\.stripe\.com\//i
  875 |   );
  876 | 
  877 |   const response =
  878 |     await ctx.page
  879 |       .context()
  880 |       .request.get(href!);
  881 | 
  882 |   expect(
  883 |     response.status(),
  884 |     'Invoice PDF URL should respond successfully.'
  885 |   ).toBe(200);
  886 | 
  887 |   expect(
  888 |     response.headers()['content-type'] ?? '',
  889 |     'Invoice PDF URL should serve a PDF document.'
> 890 |   ).toMatch(/pdf/i);
      |     ^ Error: Invoice PDF URL should serve a PDF document.
  891 | 
  892 |   const body =
  893 |     await response.body();
  894 | 
  895 |   expect(
  896 |     body.subarray(0, 5).toString(),
  897 |     'Invoice PDF file should start with the %PDF header.'
  898 |   ).toBe('%PDF-');
  899 | }
  900 | 
  901 | async function readDowngradeDialog(
  902 |   ctx: PackContext,
  903 |   targetPlan: PaidPlan
  904 | ) {
  905 |   await ctx.billing.validateOverview();
  906 | 
  907 |   await ctx.billing.openMonthlyDowngradeOrRetention({
  908 |     targetPlan
  909 |   });
  910 | 
  911 |   const dialog =
  912 |     ctx.page
  913 |       .locator(
  914 |         '[role="dialog"], [role="alertdialog"]'
  915 |       )
  916 |       .first();
  917 | 
  918 |   await expect(dialog).toBeVisible({
  919 |     timeout: 15000
  920 |   });
  921 | 
  922 |   let text =
  923 |     await dialog.innerText();
  924 | 
  925 |   if (
  926 |     !/feature|limit|broker|position|lose|restrict|reduced/i.test(
  927 |       text
  928 |     )
  929 |   ) {
  930 |     const decline =
  931 |       dialog
  932 |         .getByRole('button', {
  933 |           name: /decline|no,? thanks|continue|downgrade anyway|skip|not now/i
  934 |         })
  935 |         .first();
  936 | 
  937 |     if (
  938 |       await decline
  939 |         .isVisible({ timeout: 2000 })
  940 |         .catch(() => false)
  941 |     ) {
  942 |       await decline.click();
  943 | 
  944 |       text =
  945 |         await dialog.innerText();
  946 |     }
  947 |   }
  948 | 
  949 |   await ctx.page.keyboard.press(
  950 |     'Escape'
  951 |   );
  952 | 
  953 |   return text;
  954 | }
  955 | 
  956 | async function findCancelScheduledControl(
  957 |   ctx: PackContext,
  958 |   pattern: RegExp
  959 | ) {
  960 |   await openPlansTab(ctx);
  961 | 
  962 |   const control =
  963 |     ctx.page
  964 |       .getByRole('button', {
  965 |         name: pattern
  966 |       })
  967 |       .or(
  968 |         ctx.page.getByRole(
  969 |           'link',
  970 |           {
  971 |             name: pattern
  972 |           }
  973 |         )
  974 |       )
  975 |       .first();
  976 | 
  977 |   if (
  978 |     !await control
  979 |       .isVisible({ timeout: 4000 })
  980 |       .catch(() => false)
  981 |   ) {
  982 |     throw new ScenarioSkip(
  983 |       'The Plans tab shows no control to cancel the scheduled change (looked for: ' +
  984 |         pattern.source +
  985 |         '). Add the control or tell us its label.'
  986 |     );
  987 |   }
  988 | 
  989 |   return control;
  990 | }
```