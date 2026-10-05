# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> Disposable user climbs every monthly then yearly plan and sees yearly cancel options
- Location: tests\SubscriptionLifecycleExecution.spec.ts:139:9

# Error details

```
Error: Yearly cancel should offer Cancel at expiry with access until the renewal date.

expect(received).toMatch(expected)

Expected pattern: /cancel at expiry/i
Received string:  "Cancel subscription?·
You can resubscribe anytime.·
You'll keep access to Portfolio Hedger until October 5, 2027, then be moved to the Free plan.·
Keep my plan
Yes, cancel
Close"
```

# Page snapshot

```yaml
- generic:
  - generic:
    - banner:
      - generic:
        - generic:
          - generic:
            - link:
              - /url: /dashboard
              - img
          - generic:
            - navigation:
              - link:
                - /url: /dashboard
                - text: Dashboard
              - link:
                - /url: /dashboard/opportunities
                - text: Opportunities
              - generic:
                - button:
                  - generic: Portfolio
                  - img
              - generic:
                - button:
                  - generic: Research
                  - img
              - link:
                - /url: /academy
                - text: Academy
              - link:
                - /url: /dashboard/support
                - text: Support
          - generic:
            - button: Delayed
            - button:
              - img
              - generic: Sync all
            - button:
              - img
            - button:
              - img
            - button:
              - generic:
                - generic: HT
    - main:
      - generic:
        - generic:
          - heading [level=1]: Billing & Subscription
          - paragraph: Manage your plan, payment methods, and billing history.
        - generic:
          - tablist:
            - tab: Overview
            - tab: Plans
            - tab [selected]: History
          - tabpanel:
            - generic:
              - generic:
                - generic:
                  - img
                  - text: Billing History
                - generic: Subscription changes and Stripe invoice transactions.
              - generic:
                - generic:
                  - generic:
                    - tablist:
                      - tab [selected]: Subscription History
                      - tab: Transactions
                    - button:
                      - img
                      - text: Sync
                  - tabpanel:
                    - list:
                      - listitem:
                        - generic:
                          - img
                        - generic:
                          - generic:
                            - generic:
                              - paragraph: Plan changed to Portfolio Hedger
                              - generic: Annual
                            - generic:
                              - paragraph: on Oct 5, 2026, 4:29 PM
                              - paragraph: renews Oct 5, 2027, 4:29 PM
                          - paragraph: From Portfolio Hedger · USD 1490.00
                      - listitem:
                        - generic:
                          - img
                        - generic:
                          - generic:
                            - generic:
                              - paragraph: Upgraded to Portfolio Hedger
                              - generic: Monthly
                            - generic:
                              - paragraph: on Oct 5, 2026, 4:29 PM
                              - paragraph: renews Nov 5, 2026, 4:29 PM
                          - paragraph: From Overlay Strategists · USD 14.90
                      - listitem:
                        - generic:
                          - img
                        - generic:
                          - generic:
                            - generic:
                              - paragraph: Upgraded to Overlay Strategists
                              - generic: Monthly
                            - generic:
                              - paragraph: on Oct 5, 2026, 4:29 PM
                              - paragraph: renews Nov 5, 2026, 4:29 PM
                          - paragraph: From Income · USD 7.90
                      - listitem:
                        - generic:
                          - img
                        - generic:
                          - generic:
                            - generic:
                              - paragraph: Subscribed to Income
                              - generic: Monthly
                            - generic:
                              - paragraph: on Oct 5, 2026, 4:29 PM
                              - paragraph: renews Nov 5, 2026, 4:29 PM
                          - paragraph: New subscription · USD 2.90
        - generic:
          - generic:
            - generic: Danger Zone
            - generic: Cancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.
          - generic:
            - button: Cancel Subscription
    - contentinfo:
      - generic:
        - generic:
          - paragraph: © 2026 Ools Inc. All rights reserved.
          - navigation:
            - generic:
              - link:
                - /url: /privacy-policy
                - text: Privacy Policy
            - generic:
              - generic: ·
              - link:
                - /url: /terms-of-services
                - text: Terms of Service
            - generic:
              - generic: ·
              - link:
                - /url: /disclosures
                - text: Disclosures
            - generic:
              - generic: ·
              - link:
                - /url: /risk-warning
                - text: Risk Warning
            - generic:
              - generic: ·
              - link:
                - /url: /contact
                - text: Contact
        - paragraph: Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.
  - region "Notifications alt+T"
  - alert
  - dialog "Cancel subscription?" [ref=e2]:
    - generic [ref=e3]:
      - heading "Cancel subscription?" [level=2] [ref=e4]:
        - img [ref=e5]
        - text: Cancel subscription?
      - paragraph [ref=e7]: You can resubscribe anytime.
    - paragraph [ref=e8]:
      - text: You'll keep access to
      - strong [ref=e9]: Portfolio Hedger
      - text: until
      - strong [ref=e10]: October 5, 2027
      - text: ", then be moved to the Free plan."
    - generic [ref=e11]:
      - button "Keep my plan" [active] [ref=e12] [cursor=pointer]
      - button "Yes, cancel" [ref=e13] [cursor=pointer]
    - button "Close" [ref=e14]:
      - img [ref=e15]
      - generic [ref=e18]: Close
```

# Test source

```ts
  2449 |         name: /keep (my|your)? ?plan|stay|not now|close|^cancel$/i
  2450 |       }
  2451 |     ).first();
  2452 | 
  2453 |   if (
  2454 |     await leaveOffer.isVisible({
  2455 |       timeout: 3000
  2456 |     }).catch(
  2457 |       () => false
  2458 |     )
  2459 |   ) {
  2460 |     await safeClick(
  2461 |       leaveOffer,
  2462 |       'Leave retention offer without downgrading'
  2463 |     );
  2464 |   } else {
  2465 |     await this.page.keyboard.press(
  2466 |       'Escape'
  2467 |     );
  2468 |   }
  2469 | 
  2470 |   Logger.success(
  2471 |     'Monthly downgrade retention offer validated without scheduling a downgrade'
  2472 |   );
  2473 | }
  2474 | 
  2475 | async validateYearlyCancellationOptions() {
  2476 |   Logger.info(
  2477 |     'Validating yearly cancel-at-expiry and cancel-immediately-with-refund options'
  2478 |   );
  2479 | 
  2480 |   await this.validateOverview();
  2481 | 
  2482 |   const inAppCancel =
  2483 |     this.page.getByRole(
  2484 |       'button',
  2485 |       {
  2486 |         name: /cancel subscription/i
  2487 |       }
  2488 |     ).first();
  2489 | 
  2490 |   let host =
  2491 |     this.page;
  2492 | 
  2493 |   if (
  2494 |     await inAppCancel.isVisible({
  2495 |       timeout: 5000
  2496 |     }).catch(
  2497 |       () => false
  2498 |     )
  2499 |   ) {
  2500 |     await safeClick(
  2501 |       inAppCancel,
  2502 |       'Open in-app cancel subscription'
  2503 |     );
  2504 |   } else {
  2505 |     host =
  2506 |       await this.openSubscriptionPortal();
  2507 | 
  2508 |     const portalCancel =
  2509 |       host.locator(
  2510 |         'button, a'
  2511 |       ).filter({
  2512 |         hasText: /cancel subscription/i
  2513 |       }).first();
  2514 | 
  2515 |     if (
  2516 |       await portalCancel.isVisible({
  2517 |         timeout: 8000
  2518 |       }).catch(
  2519 |         () => false
  2520 |       )
  2521 |     ) {
  2522 |       await safeClick(
  2523 |         portalCancel,
  2524 |         'Open Cancel Subscription'
  2525 |       );
  2526 |     }
  2527 |   }
  2528 | 
  2529 |   const dialog =
  2530 |     host.locator(
  2531 |       '[role="dialog"], [role="alertdialog"]'
  2532 |     ).filter({
  2533 |       hasText: /cancel subscription/i
  2534 |     }).first();
  2535 | 
  2536 |   await expect(
  2537 |     dialog
  2538 |   ).toBeVisible({
  2539 |     timeout: 15000
  2540 |   });
  2541 | 
  2542 |   const bodyText =
  2543 |     await dialog.innerText();
  2544 | 
  2545 |   expect(
  2546 |     bodyText,
  2547 |     'Yearly cancel should offer Cancel at expiry with access until the renewal date.'
  2548 |   ).toMatch(
> 2549 |     /cancel at expiry/i
       |     ^ Error: Yearly cancel should offer Cancel at expiry with access until the renewal date.
  2550 |   );
  2551 | 
  2552 |   expect(
  2553 |     bodyText,
  2554 |     'Cancel at expiry should keep the plan until a date and say there is no refund.'
  2555 |   ).toMatch(
  2556 |     /keep .+ until .{0,40}\d{4}[\s\S]{0,80}no refund/i
  2557 |   );
  2558 | 
  2559 |   expect(
  2560 |     bodyText,
  2561 |     'Yearly cancel should offer Cancel and refund with an amount.'
  2562 |   ).toMatch(
  2563 |     /cancel and refund\s*\$\s*[\d,]+(?:\.\d{2})?/i
  2564 |   );
  2565 | 
  2566 |   expect(
  2567 |     bodyText,
  2568 |     'Cancel and refund should describe the unused annual period.'
  2569 |   ).toMatch(
  2570 |     /unused portion|unused (months|time)/i
  2571 |   );
  2572 | 
  2573 |   const abortCancel =
  2574 |     host.getByRole(
  2575 |       'button',
  2576 |       {
  2577 |         name: /keep my plan|don'?t cancel|keep subscription|go back|not now/i
  2578 |       }
  2579 |     ).first();
  2580 | 
  2581 |   if (
  2582 |     await abortCancel.isVisible({
  2583 |       timeout: 3000
  2584 |     }).catch(
  2585 |       () => false
  2586 |     )
  2587 |   ) {
  2588 |     await safeClick(
  2589 |       abortCancel,
  2590 |       'Leave cancel options without submitting'
  2591 |     );
  2592 |   } else {
  2593 |     await host.keyboard.press(
  2594 |       'Escape'
  2595 |     );
  2596 |   }
  2597 | 
  2598 |   Logger.success(
  2599 |     'Yearly cancel-at-expiry and refund options validated without cancelling'
  2600 |   );
  2601 | }
  2602 | 
  2603 | async expectPlanActionAvailable(
  2604 |   planName: string,
  2605 |   action: 'upgrade' | 'downgrade'
  2606 | ) {
  2607 |   Logger.info(
  2608 |     `Checking ${action} to ${planName} is available`
  2609 |   );
  2610 | 
  2611 |   await this.openPlansView();
  2612 | 
  2613 |   const actionButton =
  2614 |     await this.findPlanActionButton(
  2615 |       planName,
  2616 |       action
  2617 |     );
  2618 | 
  2619 |   await expect(
  2620 |     actionButton
  2621 |   ).toBeVisible();
  2622 | 
  2623 |   Logger.success(
  2624 |     `${action} to ${planName} is available`
  2625 |   );
  2626 | }
  2627 | 
  2628 | async expectCurrentIntervalSwitchHidden(
  2629 |   interval: 'monthly' | 'annual'
  2630 | ) {
  2631 |   Logger.info(
  2632 |     `Checking switch to ${interval} is hidden for a ${interval} subscription`
  2633 |   );
  2634 | 
  2635 |   await this.openPlansView();
  2636 | 
  2637 |   const switchToCurrentInterval =
  2638 |     this.page.getByRole(
  2639 |       'button',
  2640 |       {
  2641 |         name:
  2642 |           interval === 'monthly'
  2643 |             ? /switch to monthly|change to monthly/i
  2644 |             : /switch to annual|change to annual/i
  2645 |       }
  2646 |     );
  2647 | 
  2648 |   await expect(
  2649 |     switchToCurrentInterval
```