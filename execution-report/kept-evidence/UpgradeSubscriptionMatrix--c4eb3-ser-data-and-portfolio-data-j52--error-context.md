# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: UpgradeSubscriptionMatrix.spec.ts >> Upgrade Subscription Use Case 3 Matrix >> SC-90 - Successful upgrade keeps existing user data and portfolio data
- Location: tests\UpgradeSubscriptionMatrix.spec.ts:361:13

# Error details

```
Error: Profile should still show the same disposable account after the plan change.

expect(received).toContain(expected) // indexOf

Expected substring: "imhardikthanki+up-inc-ovl-m-muxukoqn"
Received string:    "dashboard
opportunities
portfolio
research
academy
support
delayed
sync all
ht
profile·
manage your profile and account settings·
personal information
update your personal information
first name
last name
email
not verified·
contact support to change your email·
save changes
mobile number
verify your mobile number via sms otp. used for security alerts and account recovery.
two-factor authentication
add an extra layer of security to your account using an authenticator app like google authenticator, authy, or 1password.
trusted devices
skip two-factor verification on devices you trust. your current browser is labeled below.
danger zone
irreversible actions for your account
delete account·
© 2026 ools inc. all rights reserved.·
privacy policy
·
terms of service
·
disclosures
·
risk warning
·
contact·
options trading involves substantial risk and is not suitable for all investors. past performance does not guarantee future results."
```

# Test source

```ts
  591 |     ).completePayment();
  592 |   } else {
  593 |     ctx.state.sawCheckoutDuringChange =
  594 |       false;
  595 |   }
  596 | }
  597 | 
  598 | /* ----------------------------------------------------------------------------
  599 | Shared steps
  600 | ---------------------------------------------------------------------------- */
  601 | 
  602 | async function stepSavedCardPreserved(
  603 |   ctx: PackContext
  604 | ) {
  605 |   const portal =
  606 |     await ctx.billing.openSubscriptionPortal();
  607 | 
  608 |   try {
  609 |     const text =
  610 |       await portal
  611 |         .locator('body')
  612 |         .innerText();
  613 | 
  614 |     expect(
  615 |       text,
  616 |       'Stripe portal should still list the card used at purchase (Visa ending 4242).'
  617 |     ).toMatch(/4242|visa/i);
  618 |   } finally {
  619 |     await ctx.billing
  620 |       .leaveStripePortal()
  621 |       .catch(() => undefined);
  622 |   }
  623 | }
  624 | 
  625 | async function stepNoCheckoutReprompt(
  626 |   ctx: PackContext
  627 | ) {
  628 |   expect(
  629 |     ctx.state.sawCheckoutDuringChange,
  630 |     'Plan change should reuse the saved payment method and not send the user to Stripe checkout again.'
  631 |   ).toBe(false);
  632 | }
  633 | 
  634 | async function stepExactlyOneCurrentPlan(
  635 |   ctx: PackContext
  636 | ) {
  637 |   await openPlansTab(ctx);
  638 | 
  639 |   const currentMarkers =
  640 |     await ctx.page
  641 |       .getByText(
  642 |         /^\s*current( plan)?\s*$/i
  643 |       )
  644 |       .count();
  645 | 
  646 |   console.log(
  647 |     `[${ctx.scenario}] current-plan markers on Plans tab: ${currentMarkers}`
  648 |   );
  649 | 
  650 |   expect(
  651 |     currentMarkers,
  652 |     'Exactly one plan should be marked as the current plan (no duplicate active subscriptions).'
  653 |   ).toBe(1);
  654 | }
  655 | 
  656 | async function stepActivePlan(
  657 |   ctx: PackContext,
  658 |   plan: PaidPlan
  659 | ) {
  660 |   await ctx.billing.validateOverview();
  661 | 
  662 |   await ctx.billing.validateActivePlan(
  663 |     plan
  664 |   );
  665 | }
  666 | 
  667 | async function stepUserDataPreserved(
  668 |   ctx: PackContext
  669 | ) {
  670 |   await ctx.page.goto(
  671 |     `${BASE_URL}/dashboard`,
  672 |     {
  673 |       waitUntil:
  674 |         'domcontentloaded'
  675 |     }
  676 |   );
  677 | 
  678 |   await new DashboardPage(
  679 |     ctx.page
  680 |   ).validateLoaded();
  681 | 
  682 |   await new DashboardPage(
  683 |     ctx.page
  684 |   ).validateNoLoadError();
  685 | 
  686 |   await ctx.page.goto(
  687 |     `${BASE_URL}/dashboard/profile`,
  688 |     {
  689 |       waitUntil:
  690 |         'domcontentloaded'
> 691 |     }
      |     ^ Error: Profile should still show the same disposable account after the plan change.
  692 |   ).catch(() => undefined);
  693 | 
  694 |   await ctx.page.waitForTimeout(2000);
  695 | 
  696 |   const inputValues =
  697 |     await ctx.page
  698 |       .$$eval(
  699 |         'input',
  700 |         (inputs) =>
  701 |           inputs.map(
  702 |             (input) =>
  703 |               (input as HTMLInputElement).value
  704 |           )
  705 |       )
  706 |       .catch(() => [] as string[]);
  707 | 
  708 |   const body =
  709 |     (
  710 |       await ctx.page
  711 |         .locator('body')
  712 |         .innerText()
  713 |     ) +
  714 |     ' ' +
  715 |     inputValues.join(' ');
  716 | 
  717 |   const localPart =
  718 |     ctx.email.split('@')[0];
  719 | 
  720 |   expect(
  721 |     body.toLowerCase(),
  722 |     'Profile should still show the same disposable account after the plan change.'
  723 |   ).toContain(
  724 |     localPart.toLowerCase()
  725 |   );
  726 | }
  727 | 
  728 | async function stepTransactionPaidCount(
  729 |   ctx: PackContext,
  730 |   expectedAdditional: number
  731 | ) {
  732 |   expect(
  733 |     ctx.state.paidBeforeChange,
  734 |     'Paid transaction count before the change was not recorded.'
  735 |   ).toBeDefined();
  736 | 
  737 |   expect(
  738 |     (ctx.state.paidAfterChange ?? 0) -
  739 |       (ctx.state.paidBeforeChange ?? 0),
  740 |     `Transactions should gain exactly ${expectedAdditional} paid entr${expectedAdditional === 1 ? 'y' : 'ies'} after the change.`
  741 |   ).toBe(expectedAdditional);
  742 | }
  743 | 
  744 | async function stepTransactionAmount(
  745 |   ctx: PackContext,
  746 |   amount: number
  747 | ) {
  748 |   await openTransactions(ctx);
  749 | 
  750 |   await expect(
  751 |     ctx.page.locator('main')
  752 |   ).toContainText(
  753 |     moneyPattern(amount),
  754 |     {
  755 |       timeout: 15000
  756 |     }
  757 |   );
  758 | }
  759 | 
  760 | async function stepHistoryShows(
  761 |   ctx: PackContext,
  762 |   plan: PaidPlan
  763 | ) {
  764 |   await ctx.billing.validateOverview();
  765 | 
  766 |   await ctx.billing.validateHistoryShowsPlan(
  767 |     plan
  768 |   );
  769 | }
  770 | 
  771 | async function readDowngradeDialog(
  772 |   ctx: PackContext,
  773 |   targetPlan: PaidPlan
  774 | ) {
  775 |   await ctx.billing.validateOverview();
  776 | 
  777 |   await ctx.billing.openMonthlyDowngradeOrRetention({
  778 |     targetPlan
  779 |   });
  780 | 
  781 |   const dialog =
  782 |     ctx.page
  783 |       .locator(
  784 |         '[role="dialog"], [role="alertdialog"]'
  785 |       )
  786 |       .first();
  787 | 
  788 |   await expect(dialog).toBeVisible({
  789 |     timeout: 15000
  790 |   });
  791 | 
```