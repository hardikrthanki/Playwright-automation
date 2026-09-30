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
Timeout:  20000ms

Call log:
  - Expect "toBeEnabled" with timeout 20000ms
  - waiting for getByRole('button', { name: 'Create Account', exact: true }).or(getByRole('button', { name: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).or(locator('button[type="submit"]').filter({ hasText: /create account|start\s+(30[-\s]?day\s+)?free\s+trial|start trial/i })).first()
    23 × locator resolved to <button disabled type="submit" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 w-full h-11">Create Account</button>
       - unexpected value "disabled"

```

# Test source

```ts
  815  |   }
  816  | 
  817  | 
  818  | 
  819  | 
  820  |   async register(
  821  |     email: string,
  822  |     mobileNumber =
  823  |       TEST_USERS.onboarding.mobile
  824  |   ) {
  825  | 
  826  | 
  827  |     Logger.step(
  828  |       `Registering: ${email}`
  829  |     );
  830  | 
  831  |     validatePasswordPolicy(
  832  |       TEST_USERS.onboarding.password
  833  |     );
  834  | 
  835  | 
  836  |     await this.firstNameInput.fill(
  837  |       TEST_USERS.onboarding.firstName
  838  |     );
  839  | 
  840  | 
  841  |     await this.lastNameInput.fill(
  842  |       TEST_USERS.onboarding.lastName
  843  |     );
  844  | 
  845  | 
  846  |     console.log(
  847  |       'Registration Email:',
  848  |       email
  849  |     );
  850  | 
  851  | 
  852  |     await this.emailInput.fill(
  853  |       email
  854  |     );
  855  | 
  856  | 
  857  |     await this.fillMobileNumber(
  858  |       mobileNumber
  859  |     );
  860  | 
  861  | 
  862  |     if (
  863  |       AUTH_SETTINGS.registrationMobileOtpEnabled
  864  |     ) {
  865  |       await this.waitForSendCodeEnabled();
  866  | 
  867  |       await this.clickSendCode(
  868  |         1
  869  |       );
  870  | 
  871  |       await this.waitForRegistrationOtpInput();
  872  | 
  873  |       await this.clickVerifyWhenReady();
  874  | 
  875  | 
  876  |       Logger.success(
  877  |         'OTP Verify Clicked'
  878  |       );
  879  | 
  880  |       await this.ensureMobileVerified();
  881  | 
  882  |       await this.waitForPasswordFieldsReady();
  883  |     } else {
  884  |       Logger.info(
  885  |         'Registration mobile OTP is disabled in auth settings'
  886  |       );
  887  |     }
  888  | 
  889  | 
  890  | 
  891  |     await this.fillPasswordFields();
  892  | 
  893  |     await this.acceptVisibleRegistrationConsents();
  894  | 
  895  |     const submitReady =
  896  |       await expect(
  897  |         this.submitButton
  898  |       ).toBeEnabled({
  899  |         timeout: 8000
  900  |       }).then(
  901  |         () => true
  902  |       ).catch(
  903  |         () => false
  904  |       );
  905  | 
  906  |     if (
  907  |       !submitReady
  908  |     ) {
  909  |       await this.acceptVisibleRegistrationConsents();
  910  | 
  911  |       await this.fillPasswordFields();
  912  | 
  913  |       await expect(
  914  |         this.submitButton
> 915  |       ).toBeEnabled({
       |         ^ Error: expect(locator).toBeEnabled() failed
  916  |         timeout: 20000
  917  |       });
  918  |     }
  919  | 
  920  |     await safeClick(
  921  |       this.submitButton,
  922  |       'Submit Registration'
  923  |     );
  924  | 
  925  |     await expect
  926  |       .poll(
  927  |         async () =>
  928  |           this.registrationLooksAccepted(),
  929  |         {
  930  |           timeout: 20000,
  931  |           message: 'Waiting for registration success or email-verification screen'
  932  |         }
  933  |       )
  934  |       .toBeTruthy();
  935  | 
  936  | 
  937  | 
  938  |     Logger.success(
  939  |       'Registration successful. Verification email sent.'
  940  |     );
  941  | 
  942  | 
  943  |   }
  944  | 
  945  |   private async registrationLooksAccepted() {
  946  |     const url =
  947  |       this.page.url();
  948  | 
  949  |     if (
  950  |       /verify-email-sent|\/(verify|onboarding|dashboard|plan|risk|compliance|check-email|confirm)/i.test(
  951  |         url
  952  |       )
  953  |     ) {
  954  |       return true;
  955  |     }
  956  | 
  957  |     const firstNameVisible =
  958  |       await this.firstNameInput.isVisible().catch(
  959  |         () => false
  960  |       );
  961  | 
  962  |     const bodyText =
  963  |       await this.page
  964  |         .locator(
  965  |           'body'
  966  |         )
  967  |         .innerText()
  968  |         .catch(
  969  |           () => ''
  970  |         );
  971  | 
  972  |     if (
  973  |       !firstNameVisible &&
  974  |       /check your email|verification link was sent|verify-email/i.test(
  975  |         bodyText
  976  |       )
  977  |     ) {
  978  |       return true;
  979  |     }
  980  | 
  981  |     return /check your email|a verification link was sent|verification (sent|email|link)|verify your email|confirm your email/i.test(
  982  |       bodyText
  983  |     );
  984  |   }
  985  | 
  986  |   private async waitForRegistrationAccepted(
  987  |     timeoutMs: number
  988  |   ) {
  989  |     const started =
  990  |       Date.now();
  991  | 
  992  |     while (
  993  |       Date.now() -
  994  |         started <
  995  |       timeoutMs
  996  |     ) {
  997  |       if (
  998  |         await this.registrationLooksAccepted()
  999  |       ) {
  1000 |         return true;
  1001 |       }
  1002 | 
  1003 |       await this.page.waitForTimeout(
  1004 |         500
  1005 |       );
  1006 |     }
  1007 | 
  1008 |     return false;
  1009 |   }
  1010 | 
  1011 | 
  1012 | }
  1013 | 
```