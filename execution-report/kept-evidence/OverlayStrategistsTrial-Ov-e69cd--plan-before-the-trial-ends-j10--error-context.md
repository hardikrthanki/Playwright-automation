# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: OverlayStrategistsTrial.spec.ts >> Overlay Strategists Trial Experience >> Trial user can subscribe to a paid plan before the trial ends
- Location: tests\OverlayStrategistsTrial.spec.ts:861:11

# Error details

```
Error: locator.click: Element is outside of the viewport
Call log:
  - waiting for locator('[role="dialog"], [role="alertdialog"]').filter({ hasText: /confirm your subscription|total due today/i }).first().getByRole('button', { name: /confirm\s*&\s*pay/i })
    - locator resolved to <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-1.5">Confirm & pay $2.90</button>
  - attempting click action
    - scrolling into view if needed
    - done scrolling

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
              - generic: "1"
            - button:
              - generic:
                - generic: HT
    - main:
      - generic:
        - generic:
          - heading [level=1]: Billing & Subscription
          - paragraph: Manage your plan, payment methods, and billing history.
        - generic:
          - generic: Trial
          - generic: Overlay Strategists
          - generic: Free trial · ends Nov 4, 2026
          - generic:
            - img
            - text: No card
        - generic:
          - tablist:
            - tab: Overview
            - tab [selected]: Plans
            - tab: History
          - tabpanel:
            - note:
              - generic:
                - generic:
                  - img
                - generic: Founding Team's Beta Pricing
              - generic:
                - paragraph: Save while helping us build OolTool — Beta pricing for the first 1,000 users.
                - paragraph: "Note: OolTool is iteratively adding new features, new brokers and additional symbols."
            - generic:
              - generic:
                - generic:
                  - img
                  - text: Change Plan
                - generic:
                  - button: Monthly
                  - button: Annual
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Curious
                      - paragraph: Explore your Portfolio
                      - generic:
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
                      - generic:
                        - generic:
                          - paragraph:
                            - generic: Was
                            - text: $29/month
                          - generic:
                            - paragraph:
                              - generic: Now
                              - generic: $2.90
                              - generic: /month
                            - generic: Beta
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
                      - generic:
                        - generic:
                          - paragraph:
                            - generic: Was
                            - text: $79/month
                          - generic:
                            - paragraph:
                              - generic: Now
                              - generic: $7.90
                              - generic: /month
                            - generic: Beta
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
                    - button [disabled]:
                      - img
                      - text: Current plan
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Portfolio Hedger
                      - paragraph: Optimize your Portfolio
                      - generic:
                        - generic:
                          - paragraph:
                            - generic: Was
                            - text: $149/month
                          - generic:
                            - paragraph:
                              - generic: Now
                              - generic: $14.90
                              - generic: /month
                            - generic: Beta
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
                    - button:
                      - img
                      - text: Upgrade
                - paragraph: Upgrades and switching to annual take effect immediately - the prorated difference is charged to your card on file. Downgrades and switching to monthly are scheduled for your next renewal. Switching to the Free plan takes effect at the end of the period you have already paid for - you keep full access until then.
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
  - dialog "Confirm your subscription" [ref=e2]:
    - generic [ref=e3]:
      - heading "Confirm your subscription" [level=2] [ref=e4]:
        - img [ref=e5]
        - text: Confirm your subscription
      - paragraph [ref=e8]: Review Income and accept the terms before continuing to payment.
    - note [ref=e9]:
      - generic [ref=e10]:
        - img [ref=e12]
        - generic [ref=e15]: Founding Team's Beta Pricing
      - generic [ref=e17]:
        - paragraph [ref=e18]: Save while helping us build OolTool — Beta pricing for the first 1,000 users.
        - paragraph [ref=e19]: "Note: OolTool is iteratively adding new features, new brokers and additional symbols."
    - generic [ref=e20]:
      - generic [ref=e21]:
        - term [ref=e22]: Plan
        - definition [ref=e23]: Income
      - generic [ref=e24]:
        - term [ref=e25]: Billing frequency
        - definition [ref=e26]: monthly
      - generic [ref=e27]:
        - term [ref=e28]: Price
        - definition [ref=e29]: $2.90/month
      - generic [ref=e30]:
        - term [ref=e31]: Tax
        - definition [ref=e32]: Calculated at checkout
      - generic [ref=e33]:
        - term [ref=e34]: Total due today
        - definition [ref=e35]: $2.90 USD
      - generic [ref=e36]:
        - term [ref=e37]: Next renewal date
        - definition [ref=e38]: November 5, 2026
    - paragraph [ref=e39]: This subscription renews automatically on November 5, 2026 at $2.90/month until you cancel. You can cancel any time from Billing.
    - generic [ref=e40] [cursor=pointer]:
      - checkbox "I agree to the Terms & Conditions" [checked] [active] [ref=e41]:
        - generic:
          - img
      - generic [ref=e42]:
        - text: I agree to the
        - link "Terms & Conditions" [ref=e43]:
          - /url: /terms-of-services
        - text: ","
        - link "Privacy Policy" [ref=e44]:
          - /url: /privacy-policy
        - text: and
        - link "Refund & Cancellation Policy" [ref=e45]:
          - /url: /terms-of-services#cancellation
        - text: .
    - generic [ref=e46]:
      - button "Cancel" [ref=e47] [cursor=pointer]
      - button "Confirm & pay $2.90" [ref=e48] [cursor=pointer]
    - button "Close" [ref=e49]:
      - img [ref=e50]
      - generic [ref=e53]: Close
```

# Test source

```ts
  4789 |     ).catch(
  4790 |       () => false
  4791 |     );
  4792 | 
  4793 |   if (
  4794 |     !reachedStripe &&
  4795 |     await confirmDialog.isVisible().catch(
  4796 |       () => false
  4797 |     )
  4798 |   ) {
  4799 |     const termsCheckbox =
  4800 |       confirmDialog.locator(
  4801 |         '[role="checkbox"], input[type="checkbox"]'
  4802 |       ).first();
  4803 | 
  4804 |     await expect(
  4805 |       termsCheckbox
  4806 |     ).toBeVisible({
  4807 |       timeout: 10000
  4808 |     });
  4809 | 
  4810 |     await safeClick(
  4811 |       termsCheckbox,
  4812 |       'Accept subscription terms'
  4813 |     );
  4814 | 
  4815 |     const confirmPay =
  4816 |       confirmDialog.getByRole(
  4817 |         'button',
  4818 |         {
  4819 |           name: /confirm\s*&\s*pay/i
  4820 |         }
  4821 |       );
  4822 | 
  4823 |     const termsAccepted =
  4824 |       async () => {
  4825 |         if (
  4826 |           await termsCheckbox.isChecked().catch(
  4827 |             () => false
  4828 |           )
  4829 |         ) {
  4830 |           return true;
  4831 |         }
  4832 | 
  4833 |         const state =
  4834 |           await termsCheckbox.getAttribute(
  4835 |             'aria-checked'
  4836 |           ) ??
  4837 |           await termsCheckbox.getAttribute(
  4838 |             'data-state'
  4839 |           );
  4840 | 
  4841 |         return state === 'true' ||
  4842 |           state === 'checked';
  4843 |       };
  4844 | 
  4845 |     if (
  4846 |       !await termsAccepted()
  4847 |     ) {
  4848 |       await termsCheckbox.click({
  4849 |         force: true
  4850 |       }).catch(
  4851 |         () => undefined
  4852 |       );
  4853 |     }
  4854 | 
  4855 |     if (
  4856 |       !await confirmPay.isEnabled().catch(
  4857 |         () => false
  4858 |       )
  4859 |     ) {
  4860 |       await confirmDialog.getByText(
  4861 |         /agree|terms|i understand|accept/i
  4862 |       ).first().click({
  4863 |         force: true
  4864 |       }).catch(
  4865 |         () => undefined
  4866 |       );
  4867 |     }
  4868 | 
  4869 |     await expect(
  4870 |       confirmPay
  4871 |     ).toBeEnabled({
  4872 |       timeout: 15000
  4873 |     });
  4874 | 
  4875 |     await confirmPay.evaluate(
  4876 |       (button) => {
  4877 |         button.scrollIntoView({
  4878 |           block: 'center',
  4879 |           inline: 'nearest'
  4880 |         });
  4881 |       }
  4882 |     );
  4883 | 
  4884 |     await confirmPay.click({
  4885 |       timeout: 8000
  4886 |     }).catch(
  4887 |       async () => {
  4888 |         await confirmPay.click({
> 4889 |           force: true,
       |                          ^ Error: locator.click: Element is outside of the viewport
  4890 |           timeout: 8000
  4891 |         });
  4892 |       }
  4893 |     );
  4894 |   } else if (!reachedStripe) {
  4895 |     await this.submitPlanChangeCalculationPreview({
  4896 |       targetPlan,
  4897 |       action
  4898 |     });
  4899 |   }
  4900 | 
  4901 |   if (
  4902 |     /checkout\.stripe\.com/i.test(
  4903 |       this.page.url()
  4904 |     ) ||
  4905 |     await this.page.waitForURL(
  4906 |       /checkout\.stripe\.com/,
  4907 |       {
  4908 |         timeout: 20000
  4909 |       }
  4910 |     ).then(
  4911 |       () => true
  4912 |     ).catch(
  4913 |       () => false
  4914 |     )
  4915 |   ) {
  4916 |     await new StripePaymentPage(
  4917 |       this.page
  4918 |     ).completePayment();
  4919 |   }
  4920 | 
  4921 |   await this.validateActivePlan(
  4922 |     targetPlan
  4923 |   );
  4924 | 
  4925 |   await this.validateHistoryShowsPlan(
  4926 |     targetPlan
  4927 |   );
  4928 | 
  4929 |   Logger.success(
  4930 |     `Trial user subscribed to ${targetPlan} before the trial ended`
  4931 |   );
  4932 | }
  4933 | 
  4934 | async validateHistoryTabStable() {
  4935 | 
  4936 |   Logger.info(
  4937 |     'Validating Billing History Tab Stability'
  4938 |   );
  4939 | 
  4940 |   await safeClick(
  4941 |     this.historyTab,
  4942 |     'Open History Tab'
  4943 |   );
  4944 | 
  4945 |   await safeClick(
  4946 |     this.transactionsTab,
  4947 |     'Open Transactions Tab'
  4948 |   );
  4949 | 
  4950 |   await this.validateBillingUrl();
  4951 | 
  4952 |   await expect(
  4953 |     this.page.getByText(
  4954 |       /transactions|paid|invoice|history/i
  4955 |     ).first()
  4956 |   ).toBeVisible({
  4957 |     timeout: 15000,
  4958 |   });
  4959 | 
  4960 |   Logger.success(
  4961 |     'Billing History Tab Stable'
  4962 |   );
  4963 | }
  4964 | 
  4965 | async validateInvoiceAndPdfLinksHaveTargets() {
  4966 | 
  4967 |   Logger.info(
  4968 |     'Validating Billing Evidence Links'
  4969 |   );
  4970 | 
  4971 |   const alreadyOnHistory =
  4972 |     await this.page.getByText(
  4973 |       /^paid$/i
  4974 |     ).first().isVisible({
  4975 |       timeout: 2000
  4976 |     }).catch(
  4977 |       () => false
  4978 |     );
  4979 | 
  4980 |   if (
  4981 |     !alreadyOnHistory
  4982 |   ) {
  4983 |     await this.validateHistoryTabStable();
  4984 |   }
  4985 | 
  4986 |   const invoiceLink =
  4987 |     this.invoiceLinks.first();
  4988 | 
  4989 |   await expect(
```