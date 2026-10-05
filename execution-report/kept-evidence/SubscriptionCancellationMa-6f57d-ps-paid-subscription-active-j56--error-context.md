# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionCancellationMatrix.spec.ts >> Subscription Cancellation Use Case 7 Matrix >> SC-260 - Resume cancellation keeps paid subscription active
- Location: tests\SubscriptionCancellationMatrix.spec.ts:553:13

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected pattern: /Income Builder/i
Received string:  "Billing & SubscriptionManage your plan, payment methods, and billing history.OverviewPlansHistoryFounding Team's Beta PricingSave while helping us build OolTool — Beta pricing for the first 1,000 users.Note: OolTool is iteratively adding new features, new brokers and additional symbols.Change PlanMonthlyAnnualCuriousExplore your PortfolioFreeManual Upload OnlyPositions (10)Simulations (10)CTAs RefreshCovered CallsOOLS ScoreSwitch to FreeIncomeBuild your PortfolioWas $29/monthNow $2.90/monthBetaBroker Integration (1)Account Linked (1)Positions (100)CTAs UnlimitedSimulations UnlimitedCovered Calls/Puts CTAsEarnings NotificationsDividend NotificationsOOLS ScoreKeep my planOverlay StrategistsOptimize your PortfolioWas $79/monthNow $7.90/monthBetaBroker Integration (5)Account Linked (10)Positions (500)CTAs & Simulations UnlimitedCovered Calls/Puts CTAsEarnings & Dividends NotificationsITM/ATM resolve suggestionsPortfolio AnalyticsBulk Portfolio LoadOOLS ScoreUpgradePortfolio HedgerOptimize your PortfolioWas $149/monthNow $14.90/monthBetaBroker Integration (10)Account Linked (20)Positions (1000)CTAs & Simulations UnlimitedCovered Calls/Puts CTAsProtective PutsOption roll suggestionsEarnings & Dividends NotificationsITM/ATM resolve suggestionsPortfolio AnalyticsBulk Portfolio LoadOOLS ScoreUpgradeUpgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then."
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('main')
    9 × locator resolved to <main class="container flex-1 px-4 py-8">…</main>
      - unexpected value "Billing & SubscriptionManage your plan, payment methods, and billing history.OverviewPlansHistoryFounding Team's Beta PricingSave while helping us build OolTool — Beta pricing for the first 1,000 users.Note: OolTool is iteratively adding new features, new brokers and additional symbols.Change PlanMonthlyAnnualCuriousExplore your PortfolioFreeManual Upload OnlyPositions (10)Simulations (10)CTAs RefreshCovered CallsOOLS ScoreSwitch to FreeIncomeBuild your PortfolioWas $29/monthNow $2.90/monthBetaBroker Integration (1)Account Linked (1)Positions (100)CTAs UnlimitedSimulations UnlimitedCovered Calls/Puts CTAsEarnings NotificationsDividend NotificationsOOLS ScoreKeep my planOverlay StrategistsOptimize your PortfolioWas $79/monthNow $7.90/monthBetaBroker Integration (5)Account Linked (10)Positions (500)CTAs & Simulations UnlimitedCovered Calls/Puts CTAsEarnings & Dividends NotificationsITM/ATM resolve suggestionsPortfolio AnalyticsBulk Portfolio LoadOOLS ScoreUpgradePortfolio HedgerOptimize your PortfolioWas $149/monthNow $14.90/monthBetaBroker Integration (10)Account Linked (20)Positions (1000)CTAs & Simulations UnlimitedCovered Calls/Puts CTAsProtective PutsOption roll suggestionsEarnings & Dividends NotificationsITM/ATM resolve suggestionsPortfolio AnalyticsBulk Portfolio LoadOOLS ScoreUpgradeUpgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then."

```

# Test source

```ts
  3478 | ) {
  3479 |   Logger.info(
  3480 |     'Submitting monthly cancel at period end'
  3481 |   );
  3482 | 
  3483 |   const host =
  3484 |     await this.openCancelSubscriptionHost();
  3485 | 
  3486 |   try {
  3487 |     const text =
  3488 |       await this.hostBodyText(
  3489 |         host.page
  3490 |       );
  3491 | 
  3492 |     expect(
  3493 |       text
  3494 |     ).toMatch(
  3495 |       /keep access to .{0,80} until \w+ \d{1,2},? \d{4}|end of (this|the) (current )?billing period|refunds apply to annual plans only/i
  3496 |     );
  3497 | 
  3498 |     expect(
  3499 |       text
  3500 |     ).not.toMatch(
  3501 |       /cancel and refund|cancel at expiry/i
  3502 |     );
  3503 | 
  3504 |     await this.fillCancelReasonIfPresent(
  3505 |       host.page,
  3506 |       'Automation period-end cancel for disposable monthly user.'
  3507 |     );
  3508 | 
  3509 |     const periodEndOption =
  3510 |       this.cancelOptionControl(
  3511 |         host.page,
  3512 |         /cancel at (the )?(end|expiry|period)|end of (this|the) billing period|keep access/i
  3513 |       );
  3514 | 
  3515 |     if (
  3516 |       await periodEndOption.isVisible({
  3517 |         timeout: 3000
  3518 |       }).catch(
  3519 |         () => false
  3520 |       )
  3521 |     ) {
  3522 |       await safeClick(
  3523 |         periodEndOption,
  3524 |         'Choose cancel at period end'
  3525 |       );
  3526 |     }
  3527 | 
  3528 |     await this.confirmCancelAction(
  3529 |       host.page,
  3530 |       'Submit monthly cancel at period end',
  3531 |       /yes,?\s*cancel|cancel (subscription|plan)|confirm|continue|cancel at period end/i
  3532 |     );
  3533 | 
  3534 |     await expect(
  3535 |       host.page
  3536 |         .getByText(
  3537 |           /scheduled to cancel|cancellation scheduled|cancelling|cancels on|service will end|cancel at period end|access until|keep access to|moved to the free plan|you('ll| will) have access until/i
  3538 |         )
  3539 |         .first()
  3540 |     ).toBeVisible({
  3541 |       timeout: 30000
  3542 |     });
  3543 | 
  3544 |     Logger.success(
  3545 |       'Monthly cancel at period end submitted'
  3546 |     );
  3547 |   } finally {
  3548 |     if (
  3549 |       options?.keepScheduled
  3550 |     ) {
  3551 |       await host.page.keyboard.press(
  3552 |         'Escape'
  3553 |       );
  3554 |     } else {
  3555 |       await host.close();
  3556 |     }
  3557 |   }
  3558 | }
  3559 | 
  3560 | async expectPaidAccessWhileCancellationScheduled(
  3561 |   planName: string
  3562 | ) {
  3563 |   await this.openPlansView();
  3564 | 
  3565 |   const stillOnPlan =
  3566 |     await this.cardShowsCurrentPlan(
  3567 |       planName
  3568 |     );
  3569 | 
  3570 |   if (
  3571 |     !stillOnPlan
  3572 |   ) {
  3573 |     await expect(
  3574 |       this.page.locator(
  3575 |         'main'
  3576 |       )
  3577 |     ).toContainText(
> 3578 |       new RegExp(
       |       ^ Error: expect(locator).toContainText(expected) failed
  3579 |         planName,
  3580 |         'i'
  3581 |       )
  3582 |     );
  3583 |   }
  3584 | 
  3585 |   await expect(
  3586 |     this.page.locator(
  3587 |       'main'
  3588 |     )
  3589 |   ).toContainText(
  3590 |     /scheduled to cancel|cancellation scheduled|cancels on|access until|keep access to|moved to the free plan|service will end|end of (this|the) (current )?billing period/i
  3591 |   );
  3592 | 
  3593 |   await expect(
  3594 |     this.page.locator(
  3595 |       'main'
  3596 |     )
  3597 |   ).not.toContainText(
  3598 |     /refund (issued|processed|completed)|moved to free|subscription cancelled/i
  3599 |   );
  3600 | }
  3601 | 
  3602 | async resumeScheduledCancellation(
  3603 |   planName: string
  3604 | ) {
  3605 |   Logger.info(
  3606 |     `Resuming scheduled cancellation for ${planName}`
  3607 |   );
  3608 | 
  3609 |   await this.closeCancelDialogIfOpen();
  3610 | 
  3611 |   const resume =
  3612 |     this.page.getByRole(
  3613 |       'button',
  3614 |       {
  3615 |         name: /don'?t cancel|resume subscription|reactivate/i
  3616 |       }
  3617 |     ).first();
  3618 | 
  3619 |   const enabledKeepPlan =
  3620 |     this.page.getByRole(
  3621 |       'button',
  3622 |       {
  3623 |         name: /keep my plan/i
  3624 |       }
  3625 |     ).first();
  3626 | 
  3627 |   if (
  3628 |     await resume.isVisible({
  3629 |       timeout: 5000
  3630 |     }).catch(
  3631 |       () => false
  3632 |     ) &&
  3633 |     await resume.isEnabled().catch(
  3634 |       () => false
  3635 |     )
  3636 |   ) {
  3637 |     await safeClick(
  3638 |       resume,
  3639 |       'Resume scheduled cancellation'
  3640 |     );
  3641 |   } else if (
  3642 |     await enabledKeepPlan.isVisible({
  3643 |       timeout: 2000
  3644 |     }).catch(
  3645 |       () => false
  3646 |     ) &&
  3647 |     await enabledKeepPlan.isEnabled().catch(
  3648 |       () => false
  3649 |     )
  3650 |   ) {
  3651 |     await enabledKeepPlan.click({
  3652 |       timeout: 8000
  3653 |     });
  3654 |   } else {
  3655 |     const host =
  3656 |       await this.openCancelSubscriptionHost();
  3657 | 
  3658 |     await host.close();
  3659 |   }
  3660 | 
  3661 |   await this.validateActivePlan(
  3662 |     planName
  3663 |   );
  3664 | 
  3665 |   await expect(
  3666 |     this.page.locator(
  3667 |       'main'
  3668 |     )
  3669 |   ).not.toContainText(
  3670 |     /scheduled to cancel|cancellation scheduled/i
  3671 |   );
  3672 | 
  3673 |   Logger.success(
  3674 |     `${planName} stayed active after cancellation was resumed`
  3675 |   );
  3676 | }
  3677 | 
  3678 | async showRefundAmountWithoutConfirming(
```