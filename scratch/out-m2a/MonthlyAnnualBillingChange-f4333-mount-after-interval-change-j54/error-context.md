# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MonthlyAnnualBillingChangeMatrix.spec.ts >> Monthly To Annual Billing Change Use Case 5 Matrix >> SC-180 - Invoice or receipt shows correct annual amount after interval change
- Location: tests\MonthlyAnnualBillingChangeMatrix.spec.ts:361:13

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected pattern: /(?:\$|USD)\s?290(?:\.0+)?(?!\d)/
Received string:  "Billing & SubscriptionManage your plan, payment methods, and billing history.OverviewPlansHistoryBilling HistorySubscription changes and Stripe invoice transactions.Subscription HistoryTransactionsSyncUETPDNNZ-0002paidMonthlySubscription Update · Oct 7, 2026, 4:01 PMIncludes -$2.90 credit for unused timeInvoice PDF USD 287.10UETPDNNZ-0001paidMonthlySubscription Create · Oct 7, 2026, 4:01 PMInvoice PDF USD 2.90Danger ZoneCancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.Cancel Subscription"
Timeout: 15000ms

Call log:
  - Expect "toContainText" with timeout 15000ms
  - waiting for locator('main')
    18 × locator resolved to <main class="container flex-1 px-4 py-8">…</main>
       - unexpected value "Billing & SubscriptionManage your plan, payment methods, and billing history.OverviewPlansHistoryBilling HistorySubscription changes and Stripe invoice transactions.Subscription HistoryTransactionsSyncUETPDNNZ-0002paidMonthlySubscription Update · Oct 7, 2026, 4:01 PMIncludes -$2.90 credit for unused timeInvoice PDF USD 287.10UETPDNNZ-0001paidMonthlySubscription Create · Oct 7, 2026, 4:01 PMInvoice PDF USD 2.90Danger ZoneCancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.Cancel Subscription"

```

# Test source

```ts
  682 |   ctx: PackContext,
  683 |   plan: PaidPlan
  684 | ) {
  685 |   await ctx.billing.validateOverview();
  686 | 
  687 |   await ctx.billing.validateActivePlan(
  688 |     plan
  689 |   );
  690 | }
  691 | 
  692 | async function stepUserDataPreserved(
  693 |   ctx: PackContext
  694 | ) {
  695 |   await ctx.page.goto(
  696 |     `${BASE_URL}/dashboard`,
  697 |     {
  698 |       waitUntil:
  699 |         'domcontentloaded'
  700 |     }
  701 |   );
  702 | 
  703 |   await new DashboardPage(
  704 |     ctx.page
  705 |   ).validateLoaded();
  706 | 
  707 |   await new DashboardPage(
  708 |     ctx.page
  709 |   ).validateNoLoadError();
  710 | 
  711 |   await ctx.page.goto(
  712 |     `${BASE_URL}/dashboard/profile`,
  713 |     {
  714 |       waitUntil:
  715 |         'domcontentloaded'
  716 |     }
  717 |   ).catch(() => undefined);
  718 | 
  719 |   await ctx.page.waitForTimeout(2000);
  720 | 
  721 |   const inputValues =
  722 |     await ctx.page
  723 |       .$$eval(
  724 |         'input',
  725 |         (inputs) =>
  726 |           inputs.map(
  727 |             (input) =>
  728 |               (input as HTMLInputElement).value
  729 |           )
  730 |       )
  731 |       .catch(() => [] as string[]);
  732 | 
  733 |   const body =
  734 |     (
  735 |       await ctx.page
  736 |         .locator('body')
  737 |         .innerText()
  738 |     ) +
  739 |     ' ' +
  740 |     inputValues.join(' ');
  741 | 
  742 |   const localPart =
  743 |     ctx.email.split('@')[0];
  744 | 
  745 |   expect(
  746 |     body.toLowerCase(),
  747 |     'Profile should still show the same disposable account after the plan change.'
  748 |   ).toContain(
  749 |     localPart.toLowerCase()
  750 |   );
  751 | }
  752 | 
  753 | async function stepTransactionPaidCount(
  754 |   ctx: PackContext,
  755 |   expectedAdditional: number
  756 | ) {
  757 |   expect(
  758 |     ctx.state.paidBeforeChange,
  759 |     'Paid transaction count before the change was not recorded.'
  760 |   ).toBeDefined();
  761 | 
  762 |   expect(
  763 |     (ctx.state.paidAfterChange ?? 0) -
  764 |       (ctx.state.paidBeforeChange ?? 0),
  765 |     `Transactions should gain exactly ${expectedAdditional} paid entr${expectedAdditional === 1 ? 'y' : 'ies'} after the change.`
  766 |   ).toBe(expectedAdditional);
  767 | }
  768 | 
  769 | async function stepTransactionAmount(
  770 |   ctx: PackContext,
  771 |   amount: number | null,
  772 |   expectCredit = false
  773 | ) {
  774 |   await openTransactions(ctx);
  775 | 
  776 |   const main =
  777 |     ctx.page.locator('main');
  778 | 
  779 |   if (amount !== null) {
  780 |     await expect(
  781 |       main
> 782 |     ).toContainText(
      |       ^ Error: expect(locator).toContainText(expected) failed
  783 |       moneyPattern(amount),
  784 |       {
  785 |         timeout: 15000
  786 |       }
  787 |     );
  788 |   }
  789 | 
  790 |   if (expectCredit) {
  791 |     // Upgrade invoices are prorated: "Includes -$X credit for unused time".
  792 |     await expect(
  793 |       main
  794 |     ).toContainText(
  795 |       /Subscription Update[\s\S]{0,120}credit for unused time/i,
  796 |       {
  797 |         timeout: 15000
  798 |       }
  799 |     );
  800 |   }
  801 | }
  802 | 
  803 | async function stepHistoryShows(
  804 |   ctx: PackContext,
  805 |   plan: PaidPlan
  806 | ) {
  807 |   await ctx.billing.validateOverview();
  808 | 
  809 |   await ctx.billing.validateHistoryShowsPlan(
  810 |     plan
  811 |   );
  812 | }
  813 | 
  814 | async function readDowngradeDialog(
  815 |   ctx: PackContext,
  816 |   targetPlan: PaidPlan
  817 | ) {
  818 |   await ctx.billing.validateOverview();
  819 | 
  820 |   await ctx.billing.openMonthlyDowngradeOrRetention({
  821 |     targetPlan
  822 |   });
  823 | 
  824 |   const dialog =
  825 |     ctx.page
  826 |       .locator(
  827 |         '[role="dialog"], [role="alertdialog"]'
  828 |       )
  829 |       .first();
  830 | 
  831 |   await expect(dialog).toBeVisible({
  832 |     timeout: 15000
  833 |   });
  834 | 
  835 |   let text =
  836 |     await dialog.innerText();
  837 | 
  838 |   if (
  839 |     !/feature|limit|broker|position|lose|restrict|reduced/i.test(
  840 |       text
  841 |     )
  842 |   ) {
  843 |     const decline =
  844 |       dialog
  845 |         .getByRole('button', {
  846 |           name: /decline|no,? thanks|continue|downgrade anyway|skip|not now/i
  847 |         })
  848 |         .first();
  849 | 
  850 |     if (
  851 |       await decline
  852 |         .isVisible({ timeout: 2000 })
  853 |         .catch(() => false)
  854 |     ) {
  855 |       await decline.click();
  856 | 
  857 |       text =
  858 |         await dialog.innerText();
  859 |     }
  860 |   }
  861 | 
  862 |   await ctx.page.keyboard.press(
  863 |     'Escape'
  864 |   );
  865 | 
  866 |   return text;
  867 | }
  868 | 
  869 | async function findCancelScheduledControl(
  870 |   ctx: PackContext,
  871 |   pattern: RegExp
  872 | ) {
  873 |   await openPlansTab(ctx);
  874 | 
  875 |   const control =
  876 |     ctx.page
  877 |       .getByRole('button', {
  878 |         name: pattern
  879 |       })
  880 |       .or(
  881 |         ctx.page.getByRole(
  882 |           'link',
```