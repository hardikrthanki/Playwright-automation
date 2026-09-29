# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MonthlyAnnualBillingChangeMatrix.spec.ts >> Monthly To Annual Billing Change Use Case 5 Matrix >> SC-165 - Monthly plan subscriber sees annual billing option
- Location: tests\MonthlyAnnualBillingChangeMatrix.spec.ts:361:13

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  getByRole('button', { name: 'Create Account', exact: true }).or(getByRole('button', { name: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).or(locator('button[type="submit"]').filter({ hasText: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).first()
Expected: enabled
Received: disabled
Timeout:  30000ms

Call log:
  - Expect "toBeEnabled" with timeout 30000ms
  - waiting for getByRole('button', { name: 'Create Account', exact: true }).or(getByRole('button', { name: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).or(locator('button[type="submit"]').filter({ hasText: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).first()
    33 × locator resolved to <button disabled type="submit" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 w-full h-11">Create Account</button>
       - unexpected value "disabled"

```

# Test source

```ts
  759 |       this.submitButton
  760 |     ).toBeVisible({
  761 |       timeout: 15000
  762 |     });
  763 | 
  764 | 
  765 |     Logger.success(
  766 |       'Registration page opened'
  767 |     );
  768 | 
  769 |   }
  770 | 
  771 | 
  772 | 
  773 | 
  774 |   async register(
  775 |     email: string,
  776 |     mobileNumber =
  777 |       TEST_USERS.onboarding.mobile
  778 |   ) {
  779 | 
  780 | 
  781 |     Logger.step(
  782 |       `Registering: ${email}`
  783 |     );
  784 | 
  785 |     validatePasswordPolicy(
  786 |       TEST_USERS.onboarding.password
  787 |     );
  788 | 
  789 | 
  790 |     await this.firstNameInput.fill(
  791 |       TEST_USERS.onboarding.firstName
  792 |     );
  793 | 
  794 | 
  795 |     await this.lastNameInput.fill(
  796 |       TEST_USERS.onboarding.lastName
  797 |     );
  798 | 
  799 | 
  800 |     console.log(
  801 |       'Registration Email:',
  802 |       email
  803 |     );
  804 | 
  805 | 
  806 |     await this.emailInput.fill(
  807 |       email
  808 |     );
  809 | 
  810 | 
  811 |     await this.fillMobileNumber(
  812 |       mobileNumber
  813 |     );
  814 | 
  815 | 
  816 |     if (
  817 |       AUTH_SETTINGS.registrationMobileOtpEnabled
  818 |     ) {
  819 |       await this.waitForSendCodeEnabled();
  820 | 
  821 |       await this.clickSendCode(
  822 |         1
  823 |       );
  824 | 
  825 |       await this.waitForRegistrationOtpInput();
  826 | 
  827 |       await this.clickVerifyWhenReady();
  828 | 
  829 | 
  830 |       Logger.success(
  831 |         'OTP Verify Clicked'
  832 |       );
  833 | 
  834 |       await expect(
  835 |         this.page.getByText(
  836 |           /^verified$/i
  837 |         ).first()
  838 |       ).toBeVisible({
  839 |         timeout: 15000
  840 |       }).catch(
  841 |         () => undefined
  842 |       );
  843 | 
  844 |       await this.waitForPasswordFieldsReady();
  845 |     } else {
  846 |       Logger.info(
  847 |         'Registration mobile OTP is disabled in auth settings'
  848 |       );
  849 |     }
  850 | 
  851 | 
  852 | 
  853 |     await this.fillPasswordFields();
  854 | 
  855 |     await this.acceptVisibleRegistrationConsents();
  856 | 
  857 |     await expect(
  858 |       this.submitButton
> 859 |     ).toBeEnabled({
      |       ^ Error: expect(locator).toBeEnabled() failed
  860 |       timeout: 30000
  861 |     });
  862 | 
  863 |     await safeClick(
  864 |       this.submitButton,
  865 |       'Submit Registration'
  866 |     );
  867 | 
  868 |     await expect
  869 |       .poll(
  870 |         async () =>
  871 |           this.registrationLooksAccepted(),
  872 |         {
  873 |           timeout: 20000,
  874 |           message: 'Waiting for registration success or email-verification screen'
  875 |         }
  876 |       )
  877 |       .toBeTruthy();
  878 | 
  879 | 
  880 | 
  881 |     Logger.success(
  882 |       'Registration successful. Verification email sent.'
  883 |     );
  884 | 
  885 | 
  886 |   }
  887 | 
  888 |   private async registrationLooksAccepted() {
  889 |     const url =
  890 |       this.page.url();
  891 | 
  892 |     if (
  893 |       /verify-email-sent|\/(verify|onboarding|dashboard|plan|risk|compliance|check-email|confirm)/i.test(
  894 |         url
  895 |       )
  896 |     ) {
  897 |       return true;
  898 |     }
  899 | 
  900 |     const firstNameVisible =
  901 |       await this.firstNameInput.isVisible().catch(
  902 |         () => false
  903 |       );
  904 | 
  905 |     const bodyText =
  906 |       await this.page
  907 |         .locator(
  908 |           'body'
  909 |         )
  910 |         .innerText()
  911 |         .catch(
  912 |           () => ''
  913 |         );
  914 | 
  915 |     if (
  916 |       !firstNameVisible &&
  917 |       /check your email|verification link was sent|verify-email/i.test(
  918 |         bodyText
  919 |       )
  920 |     ) {
  921 |       return true;
  922 |     }
  923 | 
  924 |     return /check your email|a verification link was sent|verification (sent|email|link)|verify your email|confirm your email/i.test(
  925 |       bodyText
  926 |     );
  927 |   }
  928 | 
  929 |   private async waitForRegistrationAccepted(
  930 |     timeoutMs: number
  931 |   ) {
  932 |     const started =
  933 |       Date.now();
  934 | 
  935 |     while (
  936 |       Date.now() -
  937 |         started <
  938 |       timeoutMs
  939 |     ) {
  940 |       if (
  941 |         await this.registrationLooksAccepted()
  942 |       ) {
  943 |         return true;
  944 |       }
  945 | 
  946 |       await this.page.waitForTimeout(
  947 |         500
  948 |       );
  949 |     }
  950 | 
  951 |     return false;
  952 |   }
  953 | 
  954 | 
  955 | }
  956 | 
```