# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: OverlayStrategistsTrialMatrix.spec.ts >> Overlay Strategists Trial FRD Matrix >> SC-26 - Trial user can subscribe before trial ends
- Location: tests\OverlayStrategistsTrialMatrix.spec.ts:464:13

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