# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: SubscriptionLifecycleExecution.spec.ts >> Subscription Lifecycle Execution >> User C yearly cancel and refund
- Location: tests\SubscriptionLifecycleExecution.spec.ts:163:9

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
    23 × locator resolved to <button disabled type="submit" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 w-full h-11">Create Account</button>
       - unexpected value "disabled"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - link "OolTool" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "OolTool" [ref=e7]
      - heading "Create Account" [level=1] [ref=e8]
      - paragraph [ref=e9]: Start your OolTool journey
    - generic [ref=e10]:
      - button "Continue with Google" [ref=e11] [cursor=pointer]:
        - img
        - text: Continue with Google
      - button "Continue with Apple" [ref=e12] [cursor=pointer]:
        - img
        - text: Continue with Apple
      - generic [ref=e17]: Or sign up with email & mobile
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]: First name
            - textbox "First name" [ref=e22]: Hardik
          - generic [ref=e23]:
            - generic [ref=e24]: Last name
            - textbox "Last name" [ref=e25]: Thanki
        - generic [ref=e26]:
          - generic [ref=e27]: Email
          - textbox "Email" [ref=e28]: imhardikthanki+sub-lifecycl-munzbjlz@gmail.com
        - generic [ref=e29]:
          - generic [ref=e30]:
            - generic [ref=e31]: Mobile number
            - generic [ref=e32]:
              - img
              - text: Not verified
          - generic [ref=e33]:
            - generic [ref=e34]: "+1"
            - textbox "2015550123" [ref=e35]: "2015557801"
          - paragraph [ref=e36]: US mobile numbers only. We’ll text you a one-time code.
          - generic [ref=e37]:
            - textbox "Enter OTP" [ref=e38]: "111111"
            - generic [ref=e39]:
              - button "Verify" [ref=e40] [cursor=pointer]
              - button "32s" [disabled]
        - generic [ref=e41]:
          - generic [ref=e42]: Password
          - generic [ref=e43]:
            - textbox [ref=e44]: Test@123456
            - button "Show" [ref=e45]:
              - img [ref=e46]
        - generic [ref=e49]:
          - generic [ref=e50]: Confirm password
          - generic [ref=e51]:
            - textbox [active] [ref=e52]: Test@123456
            - button "Show" [ref=e53]:
              - img [ref=e54]
        - button "Create Account" [disabled]
      - paragraph [ref=e57]:
        - text: Already have an account?
        - link "Sign in" [ref=e58] [cursor=pointer]:
          - /url: /login
  - region "Notifications alt+T"
  - alert [ref=e59]
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