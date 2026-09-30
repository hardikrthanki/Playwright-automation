# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleE2EMatrix.spec.ts >> Subscription Lifecycle E2E Matrix >> LC-014 - User can start paid subscription from onboarding plan selection
- Location: tests\SubscriptionLifecycleE2EMatrix.spec.ts:506:13

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  getByRole('button', { name: 'Create Account', exact: true }).or(getByRole('button', { name: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).or(locator('button[type="submit"]').filter({ hasText: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).first()
Expected: enabled
Received: disabled
Timeout:  20000ms

Call log:
  - Expect "toBeEnabled" with timeout 20000ms
  - waiting for getByRole('button', { name: 'Create Account', exact: true }).or(getByRole('button', { name: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).or(locator('button[type="submit"]').filter({ hasText: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).first()
    24 × locator resolved to <button disabled type="submit" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 w-full h-11">Create Account</button>
       - unexpected value "disabled"

```

# Test source

```ts
  878  |       TEST_USERS.onboarding.password
  879  |     );
  880  | 
  881  | 
  882  |     await this.firstNameInput.fill(
  883  |       TEST_USERS.onboarding.firstName
  884  |     );
  885  | 
  886  | 
  887  |     await this.lastNameInput.fill(
  888  |       TEST_USERS.onboarding.lastName
  889  |     );
  890  | 
  891  | 
  892  |     console.log(
  893  |       'Registration Email:',
  894  |       email
  895  |     );
  896  | 
  897  | 
  898  |     await this.emailInput.fill(
  899  |       email
  900  |     );
  901  | 
  902  | 
  903  |     await this.fillMobileNumber(
  904  |       mobileNumber
  905  |     );
  906  | 
  907  | 
  908  |     if (
  909  |       AUTH_SETTINGS.registrationMobileOtpEnabled
  910  |     ) {
  911  |       await this.waitForSendCodeEnabled();
  912  | 
  913  |       await this.clickSendCode(
  914  |         1
  915  |       );
  916  | 
  917  |       await this.waitForRegistrationOtpInput();
  918  | 
  919  |       await this.clickVerifyWhenReady();
  920  | 
  921  | 
  922  |       Logger.success(
  923  |         'OTP Verify Clicked'
  924  |       );
  925  | 
  926  |       await this.ensureMobileVerified();
  927  | 
  928  |       await this.waitForPasswordFieldsReady();
  929  |     } else {
  930  |       Logger.info(
  931  |         'Registration mobile OTP is disabled in auth settings'
  932  |       );
  933  |     }
  934  | 
  935  | 
  936  | 
  937  |     await this.fillPasswordFields();
  938  | 
  939  |     await this.acceptVisibleRegistrationConsents();
  940  | 
  941  |     const submitReady =
  942  |       await expect(
  943  |         this.submitButton
  944  |       ).toBeEnabled({
  945  |         timeout: 8000
  946  |       }).then(
  947  |         () => true
  948  |       ).catch(
  949  |         () => false
  950  |       );
  951  | 
  952  |     if (
  953  |       !submitReady
  954  |     ) {
  955  |       await this.acceptVisibleRegistrationConsents();
  956  | 
  957  |       const agreement =
  958  |         this.page.getByText(
  959  |           /i agree|i accept|terms of (use|service)|privacy policy/i
  960  |         ).first();
  961  | 
  962  |       if (
  963  |         await agreement.isVisible().catch(
  964  |           () => false
  965  |         )
  966  |       ) {
  967  |         await agreement.click({
  968  |           force: true
  969  |         }).catch(
  970  |           () => undefined
  971  |         );
  972  |       }
  973  | 
  974  |       await this.fillPasswordFields();
  975  | 
  976  |       await expect(
  977  |         this.submitButton
> 978  |       ).toBeEnabled({
       |         ^ Error: expect(locator).toBeEnabled() failed
  979  |         timeout: 20000
  980  |       });
  981  |     }
  982  | 
  983  |     await safeClick(
  984  |       this.submitButton,
  985  |       'Submit Registration'
  986  |     );
  987  | 
  988  |     await expect
  989  |       .poll(
  990  |         async () =>
  991  |           this.registrationLooksAccepted(),
  992  |         {
  993  |           timeout: 20000,
  994  |           message: 'Waiting for registration success or email-verification screen'
  995  |         }
  996  |       )
  997  |       .toBeTruthy();
  998  | 
  999  | 
  1000 | 
  1001 |     Logger.success(
  1002 |       'Registration successful. Verification email sent.'
  1003 |     );
  1004 | 
  1005 | 
  1006 |   }
  1007 | 
  1008 |   private async registrationLooksAccepted() {
  1009 |     const url =
  1010 |       this.page.url();
  1011 | 
  1012 |     if (
  1013 |       /verify-email-sent|\/(verify|onboarding|dashboard|plan|risk|compliance|check-email|confirm)/i.test(
  1014 |         url
  1015 |       )
  1016 |     ) {
  1017 |       return true;
  1018 |     }
  1019 | 
  1020 |     const firstNameVisible =
  1021 |       await this.firstNameInput.isVisible().catch(
  1022 |         () => false
  1023 |       );
  1024 | 
  1025 |     const bodyText =
  1026 |       await this.page
  1027 |         .locator(
  1028 |           'body'
  1029 |         )
  1030 |         .innerText()
  1031 |         .catch(
  1032 |           () => ''
  1033 |         );
  1034 | 
  1035 |     if (
  1036 |       !firstNameVisible &&
  1037 |       /check your email|verification link was sent|verify-email/i.test(
  1038 |         bodyText
  1039 |       )
  1040 |     ) {
  1041 |       return true;
  1042 |     }
  1043 | 
  1044 |     return /check your email|a verification link was sent|verification (sent|email|link)|verify your email|confirm your email/i.test(
  1045 |       bodyText
  1046 |     );
  1047 |   }
  1048 | 
  1049 |   private async waitForRegistrationAccepted(
  1050 |     timeoutMs: number
  1051 |   ) {
  1052 |     const started =
  1053 |       Date.now();
  1054 | 
  1055 |     while (
  1056 |       Date.now() -
  1057 |         started <
  1058 |       timeoutMs
  1059 |     ) {
  1060 |       if (
  1061 |         await this.registrationLooksAccepted()
  1062 |       ) {
  1063 |         return true;
  1064 |       }
  1065 | 
  1066 |       await this.page.waitForTimeout(
  1067 |         500
  1068 |       );
  1069 |     }
  1070 | 
  1071 |     return false;
  1072 |   }
  1073 | 
  1074 | 
  1075 | }
  1076 | 
```