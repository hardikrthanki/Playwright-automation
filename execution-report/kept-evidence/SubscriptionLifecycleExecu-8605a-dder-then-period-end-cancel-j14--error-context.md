# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> User A monthly plan ladder then period-end cancel
- Location: tests\SubscriptionLifecycleExecution.spec.ts:163:9

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /end of (this|the) billing period|period end|keep access until|cancels on|your service will end/i
Received string:  "Dashboard
Opportunities
Portfolio
Research
Academy
Support
Sync all
HT
Billing & Subscription·
Manage your plan, payment methods, and billing history.·
Overview
Plans
History
Change Plan·
Curious·
Explore your Portfolio·
Free·
Manual Upload Only
Positions (10)
Simulations (10)
CTAs Refresh
Covered Calls
OOLS Score
Switch to Free·
Income·
Build your Portfolio·
$29/month·
Broker Integration (1)
Account Linked (1)
Positions (100)
CTAs Unlimited
Simulations Unlimited
Covered Calls/Puts CTAs
Earnings Notifications
Dividend Notifications
OOLS Score
Downgrade·
Overlay Strategists·
Optimize your Portfolio·
$79/month·
Broker Integration (5)
Account Linked (10)
Positions (500)
CTAs & Simulations Unlimited
Covered Calls/Puts CTAs
Earnings & Dividends Notifications
ITM/ATM resolve suggestions
Portfolio Analytics
Bulk Portfolio Load
OOLS Score
Downgrade·
Portfolio Hedger·
Optimize your Portfolio·
$149/month·
Broker Integration (10)
Account Linked (20)
Positions (1000)
CTAs & Simulations Unlimited
Covered Calls/Puts CTAs
Protective Puts
Option roll suggestions
Earnings & Dividends Notifications
ITM/ATM resolve suggestions
Portfolio Analytics
Bulk Portfolio Load
OOLS Score
Current plan·
Upgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then.·
Danger Zone
Cancelling will end your paid plan at the end of the current billing period. You'll retain access to paid features until then.
Cancel Subscription·
© 2026 Ools Inc. All rights reserved.·
Privacy Policy
·
Terms of Service
·
Disclosures
·
Risk Warning
·
Contact·
Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results.·
Cancel subscription?·
You can resubscribe anytime.·
You'll keep access to Portfolio Hedger until October 30, 2026, then be moved to the Free plan. Refunds apply to annual plans only.·
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
            - button:
              - img
              - generic: Sync all
            - button:
              - img
            - button:
              - img
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
            - tab [selected]: Plans
            - tab: History
          - tabpanel:
            - generic:
              - generic:
                - generic:
                  - img
                  - text: Change Plan
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Curious
                      - paragraph: Explore your Portfolio
                      - paragraph: Free
                    - list:
                      - listitem:
                        - img
                        - text: Manual Upload Only
                      - listitem:
                        - img
                        - text: Positions (10)
                      - listitem:
                        - img
                        - text: Simulations (10)
                      - listitem:
                        - img
                        - text: CTAs Refresh
                      - listitem:
                        - img
                        - text: Covered Calls
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Switch to Free
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Income
                      - paragraph: Build your Portfolio
                      - paragraph: $29/month
                    - list:
                      - listitem:
                        - img
                        - text: Broker Integration (1)
                      - listitem:
                        - img
                        - text: Account Linked (1)
                      - listitem:
                        - img
                        - text: Positions (100)
                      - listitem:
                        - img
                        - text: CTAs Unlimited
                      - listitem:
                        - img
                        - text: Simulations Unlimited
                      - listitem:
                        - img
                        - text: Covered Calls/Puts CTAs
                      - listitem:
                        - img
                        - text: Earnings Notifications
                      - listitem:
                        - img
                        - text: Dividend Notifications
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Downgrade
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Overlay Strategists
                      - paragraph: Optimize your Portfolio
                      - paragraph: $79/month
                    - list:
                      - listitem:
                        - img
                        - text: Broker Integration (5)
                      - listitem:
                        - img
                        - text: Account Linked (10)
                      - listitem:
                        - img
                        - text: Positions (500)
                      - listitem:
                        - img
                        - text: CTAs & Simulations Unlimited
                      - listitem:
                        - img
                        - text: Covered Calls/Puts CTAs
                      - listitem:
                        - img
                        - text: Earnings & Dividends Notifications
                      - listitem:
                        - img
                        - text: ITM/ATM resolve suggestions
                      - listitem:
                        - img
                        - text: Portfolio Analytics
                      - listitem:
                        - img
                        - text: Bulk Portfolio Load
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button:
                      - img
                      - text: Downgrade
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Portfolio Hedger
                      - paragraph: Optimize your Portfolio
                      - paragraph: $149/month
                    - list:
                      - listitem:
                        - img
                        - text: Broker Integration (10)
                      - listitem:
                        - img
                        - text: Account Linked (20)
                      - listitem:
                        - img
                        - text: Positions (1000)
                      - listitem:
                        - img
                        - text: CTAs & Simulations Unlimited
                      - listitem:
                        - img
                        - text: Covered Calls/Puts CTAs
                      - listitem:
                        - img
                        - text: Protective Puts
                      - listitem:
                        - img
                        - text: Option roll suggestions
                      - listitem:
                        - img
                        - text: Earnings & Dividends Notifications
                      - listitem:
                        - img
                        - text: ITM/ATM resolve suggestions
                      - listitem:
                        - img
                        - text: Portfolio Analytics
                      - listitem:
                        - img
                        - text: Bulk Portfolio Load
                      - listitem:
                        - img
                        - text: OOLS Score
                    - button [disabled]:
                      - img
                      - text: Current plan
                - paragraph: Upgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then.
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
      - strong [ref=e10]: October 30, 2026
      - text: ", then be moved to the Free plan. Refunds apply to annual plans only."
    - generic [ref=e11]:
      - button "Keep my plan" [active] [ref=e12] [cursor=pointer]
      - button "Yes, cancel" [ref=e13] [cursor=pointer]
    - button "Close" [ref=e14]:
      - img [ref=e15]
      - generic [ref=e18]: Close
```

# Test source

```ts
  2714 |   await expect(
  2715 |     portalPage
  2716 |       .getByText(
  2717 |         /cancel your subscription|cancel at|refund|end of (this|the) billing period|why you'?re leaving|request refund/i
  2718 |       )
  2719 |       .first()
  2720 |   ).toBeVisible({
  2721 |     timeout: 20000
  2722 |   });
  2723 | 
  2724 |   Logger.success(
  2725 |     'Cancel subscription host opened'
  2726 |   );
  2727 | 
  2728 |   return {
  2729 |     page: portalPage,
  2730 |     isPortal: true,
  2731 |     close: async () => {
  2732 |       if (
  2733 |         portalPage !== this.page &&
  2734 |         !portalPage.isClosed()
  2735 |       ) {
  2736 |         await portalPage.close();
  2737 |       }
  2738 |     }
  2739 |   };
  2740 | }
  2741 | 
  2742 | async validateMonthlyCancellationOptions() {
  2743 |   Logger.info(
  2744 |     'Validating monthly cancel-at-period-end options'
  2745 |   );
  2746 | 
  2747 |   const host =
  2748 |     await this.openCancelSubscriptionHost();
  2749 | 
  2750 |   try {
  2751 |     const text =
  2752 |       await this.hostBodyText(
  2753 |         host.page
  2754 |       );
  2755 | 
  2756 |     expect(
  2757 |       text,
  2758 |       'Monthly cancel should describe period-end cancellation and continued access.'
  2759 |     ).toMatch(
  2760 |       /end of (this|the) (current )?billing period|period end|keep access until|retain access|cancels on|your service will end|until (the )?(end|renewal)/i
  2761 |     );
  2762 | 
  2763 |     expect(
  2764 |       text,
  2765 |       'Monthly cancel should not present an immediate refund path.'
  2766 |     ).not.toMatch(
  2767 |       /cancel immediately.{0,40}refund|request a refund|unused months.{0,20}refund/i
  2768 |     );
  2769 | 
  2770 |     const immediateCancel =
  2771 |       this.cancelOptionControl(
  2772 |         host.page,
  2773 |         /cancel immediately|cancel now and refund|request refund/i
  2774 |       );
  2775 | 
  2776 |     expect(
  2777 |       await immediateCancel.isVisible({
  2778 |         timeout: 2000
  2779 |       }).catch(
  2780 |         () => false
  2781 |       ),
  2782 |       'Monthly cancel should not require an immediate-cancel control.'
  2783 |     ).toBeFalsy();
  2784 | 
  2785 |     await this.fillCancelReasonIfPresent(
  2786 |       host.page,
  2787 |       'Automation validation only - monthly cancellation not submitted.'
  2788 |     );
  2789 | 
  2790 |     Logger.success(
  2791 |       'Monthly cancel-at-period-end options validated without submitting'
  2792 |     );
  2793 |   } finally {
  2794 |     await host.close();
  2795 |   }
  2796 | }
  2797 | 
  2798 | async submitMonthlyCancelAtPeriodEnd() {
  2799 |   Logger.info(
  2800 |     'Submitting monthly cancel at period end'
  2801 |   );
  2802 | 
  2803 |   const host =
  2804 |     await this.openCancelSubscriptionHost();
  2805 | 
  2806 |   try {
  2807 |     const text =
  2808 |       await this.hostBodyText(
  2809 |         host.page
  2810 |       );
  2811 | 
  2812 |     expect(
  2813 |       text
> 2814 |     ).toMatch(
       |       ^ Error: expect(received).toMatch(expected)
  2815 |       /end of (this|the) billing period|period end|keep access until|cancels on|your service will end/i
  2816 |     );
  2817 | 
  2818 |     expect(
  2819 |       text
  2820 |     ).not.toMatch(
  2821 |       /cancel immediately.{0,40}refund|request a refund/i
  2822 |     );
  2823 | 
  2824 |     await this.fillCancelReasonIfPresent(
  2825 |       host.page,
  2826 |       'Automation period-end cancel for disposable monthly user.'
  2827 |     );
  2828 | 
  2829 |     const periodEndOption =
  2830 |       this.cancelOptionControl(
  2831 |         host.page,
  2832 |         /cancel at (the )?(end|expiry|period)|end of (this|the) billing period|keep access/i
  2833 |       );
  2834 | 
  2835 |     if (
  2836 |       await periodEndOption.isVisible({
  2837 |         timeout: 3000
  2838 |       }).catch(
  2839 |         () => false
  2840 |       )
  2841 |     ) {
  2842 |       await safeClick(
  2843 |         periodEndOption,
  2844 |         'Choose cancel at period end'
  2845 |       );
  2846 |     }
  2847 | 
  2848 |     await this.confirmCancelAction(
  2849 |       host.page,
  2850 |       'Submit monthly cancel at period end',
  2851 |       /cancel (subscription|plan)|confirm|continue|cancel at period end/i
  2852 |     );
  2853 | 
  2854 |     await expect(
  2855 |       host.page
  2856 |         .getByText(
  2857 |           /scheduled to cancel|cancels on|service will end|cancel at period end|you('ll| will) have access until/i
  2858 |         )
  2859 |         .first()
  2860 |     ).toBeVisible({
  2861 |       timeout: 30000
  2862 |     });
  2863 | 
  2864 |     Logger.success(
  2865 |       'Monthly cancel at period end submitted'
  2866 |     );
  2867 |   } finally {
  2868 |     await host.close();
  2869 |   }
  2870 | }
  2871 | 
  2872 | async submitYearlyCancelAtExpiry() {
  2873 |   Logger.info(
  2874 |     'Submitting yearly cancel at expiry'
  2875 |   );
  2876 | 
  2877 |   const host =
  2878 |     await this.openCancelSubscriptionHost();
  2879 | 
  2880 |   try {
  2881 |     const expiryOption =
  2882 |       this.cancelOptionControl(
  2883 |         host.page,
  2884 |         /cancel at (expiry|period end|renewal)|keep access|no refund/i
  2885 |       );
  2886 | 
  2887 |     await expect(
  2888 |       expiryOption
  2889 |     ).toBeVisible({
  2890 |       timeout: 15000
  2891 |     });
  2892 | 
  2893 |     await safeClick(
  2894 |       expiryOption,
  2895 |       'Choose cancel at expiry'
  2896 |     );
  2897 | 
  2898 |     await this.fillCancelReasonIfPresent(
  2899 |       host.page,
  2900 |       'Automation cancel-at-expiry for disposable yearly user.'
  2901 |     );
  2902 | 
  2903 |     await this.confirmCancelAction(
  2904 |       host.page,
  2905 |       'Submit yearly cancel at expiry',
  2906 |       /cancel (at expiry|subscription|plan)|confirm|continue|keep access/i
  2907 |     );
  2908 | 
  2909 |     await expect(
  2910 |       host.page
  2911 |         .getByText(
  2912 |           /scheduled to cancel|cancels on|access until|cancel at expiry|service will end/i
  2913 |         )
  2914 |         .first()
```